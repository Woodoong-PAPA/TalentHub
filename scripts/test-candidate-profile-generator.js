const assert = require("assert");
const { Readable } = require("stream");
const core = require("../lib/candidate-profile-core.js");
const reportHandler = require("../api/candidate-profile-report.js");

function run(name, test) {
  try {
    test();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

async function runAsync(name, test) {
  try {
    await test();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

run("LinkedIn personal profile URL normalization", () => {
  assert.strictEqual(
    core.normalizeLinkedInUrl("linkedin.com/in/example-person/?trk=test#about"),
    "https://www.linkedin.com/in/example-person"
  );
  assert.strictEqual(core.normalizeLinkedInUrl("https://example.com/in/example-person"), "");
  assert.strictEqual(core.normalizeLinkedInUrl("https://www.linkedin.com/company/example"), "");
});

run("fact types stay explicitly separated", () => {
  const fact = core.normalizeFact({ type: "AI_INTERPRETATION", claim: "리더십", value: "해석 문장" });
  assert.strictEqual(fact.type, "AI_INTERPRETATION");
  assert.strictEqual(fact.verificationStatus, "UNVERIFIED");
  assert.strictEqual(fact.confidence, "MEDIUM");
});

run("candidate type classification", () => {
  assert.strictEqual(core.classifyCandidateType({ currentPosition: "Principal Research Scientist" }), "RESEARCHER");
  assert.strictEqual(core.classifyCandidateType({ currentPosition: "VP of Platform Engineering" }), "EXECUTIVE");
  assert.strictEqual(core.classifyCandidateType({ currentPosition: "Venture Capital Partner" }), "INVESTOR");
});

run("research steps adapt to selected mode", () => {
  const deepSteps = core.getResearchSteps("deep");
  const materialSteps = core.getResearchSteps("materials");
  assert.ok(deepSteps.some((step) => step.id === "research"));
  assert.ok(!materialSteps.some((step) => step.id === "research"));
  assert.strictEqual(deepSteps.at(-1).id, "review");
});

run("report evidence excludes AI interpretations", () => {
  const candidate = core.createMockCandidate({
    linkedinUrl: "https://www.linkedin.com/in/report-test",
    candidateName: "테스트 후보자"
  });
  const report = core.createReport("interview", [candidate], { targetPosition: "기술 리더" });
  const message = report.sections.find((section) => section.id === "message").body;
  const interpretation = candidate.facts.find((fact) => fact.type === "AI_INTERPRETATION").value;
  assert.ok(message.includes(candidate.facts.find((fact) => fact.verificationStatus === "VERIFIED").value));
  assert.ok(!message.includes(interpretation));
});

run("multi-candidate report keeps candidate order", () => {
  const first = core.createMockCandidate({ linkedinUrl: "https://www.linkedin.com/in/first", candidateName: "첫 후보" });
  const second = core.createMockCandidate({ linkedinUrl: "https://www.linkedin.com/in/second", candidateName: "둘 후보" });
  const report = core.createReport("multi", [first, second], { targetPosition: "AI 리더" });
  assert.deepStrictEqual(report.candidateIds, [first.id, second.id]);
  assert.ok(report.sections[0].body.indexOf(first.name) < report.sections[0].body.indexOf(second.name));
});

run("mock candidate includes traceable facts and sources", () => {
  const candidate = core.createMockCandidate({
    linkedinUrl: "https://www.linkedin.com/in/source-test",
    candidateName: "소스 테스트"
  });
  assert.ok(candidate.facts.length >= 3);
  assert.ok(candidate.sources.length >= 2);
  candidate.facts.filter((fact) => fact.type === "FACT").forEach((fact) => {
    assert.ok(candidate.sources.some((source) => source.id === fact.sourceId));
  });
});

runAsync("DOCX endpoint returns an OOXML package", async () => {
  const candidate = core.createMockCandidate({
    linkedinUrl: "https://www.linkedin.com/in/docx-test",
    candidateName: "문서 테스트"
  });
  const report = core.createReport("basic", [candidate]);
  const request = Readable.from([JSON.stringify({ report, candidates: [candidate] })]);
  request.method = "POST";
  const response = {
    statusCode: 0,
    headers: {},
    body: null,
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    }
  };
  await reportHandler(request, response);
  assert.strictEqual(response.statusCode, 200);
  assert.ok(Buffer.isBuffer(response.body));
  assert.strictEqual(response.body.subarray(0, 2).toString("hex"), "504b");
  assert.match(response.headers["Content-Type"], /wordprocessingml/);
});
