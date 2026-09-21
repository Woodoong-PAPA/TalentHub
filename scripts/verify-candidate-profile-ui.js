const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

const baseUrl = process.env.CPG_TEST_URL || "http://127.0.0.1:5185";
const outputDir = path.join(process.cwd(), ".codex-artifacts", "candidate-profile");

async function login(page) {
  await page.addInitScript((payload) => {
    window.localStorage.setItem("samsung-talent-pool-state-v1", payload);
  }, JSON.stringify({
    version: 1,
    currentUserId: "member-admin",
    members: [{
      id: "member-admin",
      name: "시스템 관리자",
      email: "admin@samsung.com",
      passwordHash: "5842a8aa177243bfa34305cfaceb69a124ad6ccee62ebd4bd149be39871eb160",
      role: "admin",
      status: "active",
      businessUnit: "전사직속"
    }]
  }));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (await page.locator("#login-form").isVisible().catch(() => false)) {
    await page.locator("#login-email").fill("admin@samsung.com");
    await page.locator("#login-password").fill("Admin1234!");
    await page.locator("#login-form button[type='submit']").click();
  }
  try {
    await page.locator("body.is-authenticated").waitFor({ timeout: 10000 });
  } catch (error) {
    const authText = await page.locator("#auth-content").innerText().catch(() => "auth content unavailable");
    throw new Error(`Login failed: ${authText}`);
  }
}

async function assertNoViewportOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth
  }));
  if (metrics.body > metrics.viewport + 1 || metrics.document > metrics.viewport + 1) {
    throw new Error(`${label} horizontal overflow: ${JSON.stringify(metrics)}`);
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  try {
    await login(page);
    await page.evaluate(() => setView("profile-generator"));
    await page.locator("#profile-generator-view.is-active .cpg-shell").waitFor();
    await assertNoViewportOverflow(page, "desktop dashboard");
    await page.screenshot({ path: path.join(outputDir, "desktop-dashboard.png"), fullPage: true });

    await page.locator("[data-cpg-section='new-research']").first().click();
    await page.locator("#cpg-linkedin-url").fill("https://www.linkedin.com/in/ui-verification-candidate");
    await page.locator("[name='candidateName']").fill("UI 검증 후보자");
    await page.locator("[name='targetPosition']").fill("AI Platform 기술 리더");
    await page.locator("#cpg-research-form button[type='submit']").click();
    await page.locator(".cpg-candidate-hero").waitFor({ timeout: 15000 });
    await assertNoViewportOverflow(page, "desktop candidate detail");
    await page.screenshot({ path: path.join(outputDir, "desktop-candidate-detail.png"), fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await assertNoViewportOverflow(page, "mobile candidate detail");
    await page.screenshot({ path: path.join(outputDir, "mobile-candidate-detail.png"), fullPage: true });

    await page.locator("[data-cpg-section='new-research']").last().click();
    await page.locator("#cpg-linkedin-url").fill("https://www.linkedin.com/in/mobile-capture-flow");
    await assertNoViewportOverflow(page, "mobile new research");
    await page.screenshot({ path: path.join(outputDir, "mobile-new-research.png"), fullPage: true });

    await page.locator("[data-cpg-section='reports']").last().click();
    await page.locator("[name='reportCandidate']").first().check();
    await page.locator("#cpg-report-form button[type='submit']").click();
    await page.locator(".cpg-a4-preview").waitFor();
    await assertNoViewportOverflow(page, "mobile report preview");
    await page.screenshot({ path: path.join(outputDir, "mobile-report-preview.png"), fullPage: true });

    console.log(JSON.stringify({ ok: true, outputDir }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
