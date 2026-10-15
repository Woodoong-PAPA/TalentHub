// Applies the same isolated integration to a checkout or a preserved release source.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(process.argv[2]||'.');
function edit(file,fn){const p=path.join(base,file);let s=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');s=fn(s);fs.writeFileSync(p,s);}
function once(s,a,b){if(!s.includes(a))throw Error('Missing integration anchor: '+a.slice(0,100));return s.replace(a,b);}
edit('talent-pool.js',s=>{
 s=once(s,'const STATUS_LABELS = {','const unifiedMembers = window.TalentAuth?.enabled === true;\nconst STATUS_LABELS = {');
 s=once(s,'const MENU_CONFIG = [','const MENU_CONFIG = [\n  { view: "interview-management", label: "면접 일정 관리", description: "면접 일정 조율과 이메일 승인" },');
 s=once(s,'const ROLE_PERMISSION_TABLE_VIEWS = new Set([','const ROLE_PERMISSION_TABLE_VIEWS = new Set([\n  "interview-management",');
 for(const role of ['applicant','hiring_manager','business_recruiter','division_recruiter'])s=once(s,role+': [',role+': ["interview-management", ');
 s=once(s,'id: member.id || createId("member"),','id: member.id || createId("member"),\n    authUserId: member.authUserId || member.auth_user_id || "",\n    interviewRole: member.interviewRole || member.profile?.interviewRole || "",');
 s=once(s,'const { password, ...safeMember } = normalized;','const { password, ...safeMember } = normalized;\n  if (unifiedMembers) delete safeMember.passwordHash;');
 s=once(s,'if (!state.members.some((member) => member.role === "admin" && member.status === "active")) {','if (!unifiedMembers && !state.members.some((member) => member.role === "admin" && member.status === "active")) {');
 s=once(s,'async function supabaseRequest(path, options = {}) {',`async function supabaseRequest(path, options = {}) {
  if (unifiedMembers && path.startsWith("app_members")) return window.TalentAuth.memberRequest(path, options);
  if (unifiedMembers && path.startsWith("app_role_permissions") && options.method === "POST") {
    await window.TalentAuth.request("permissions", { rows: JSON.parse(options.body || "[]") }); return null;
  }`);
 s=once(s,'await ensureMemberPasswordHashes();','if (!unifiedMembers) await ensureMemberPasswordHashes();');
 s=once(s,'if (memberRows.length) {','if (!unifiedMembers && memberRows.length) {');
 s=once(s,'if (permissionRows.length) {','if (!unifiedMembers && permissionRows.length) {');
 s=once(s,'    if (Array.isArray(policySourceRows) && policySourceRows.length) {',`    for (const permission of permissionRows || []) {
      if (permission.view !== "interview-management" || !state.rolePermissions[permission.role]) continue;
      const views = new Set(state.rolePermissions[permission.role]);
      if (permission.enabled) views.add(permission.view); else views.delete(permission.view);
      state.rolePermissions[permission.role] = [...views];
    }
    if (Array.isArray(policySourceRows) && policySourceRows.length) {`);
 if(s.includes('const toolFrames = {'))s=once(s,'const toolFrames = {','const toolFrames = {\n    "interview-management": { id: "interview-management-frame", src: "/interview-management?embedded=1" },');
 else {
   s=once(s,'function setView(view) {',`function ensureIntegratedInterviewLoaded() {
     const frame = document.getElementById("interview-management-frame");
     if (state.view === "interview-management" && frame && !frame.dataset.loaded) { frame.src = "/interview-management?embedded=1"; frame.dataset.loaded = "true"; }
   }
   function setView(view) {`);
   s=once(s,'  syncActiveViewState();','  syncActiveViewState();\n  ensureIntegratedInterviewLoaded();');
 }
 s=once(s,'async function verifyMemberPassword(member, password) {','async function verifyMemberPassword(member, password) {\n  if (unifiedMembers) return window.TalentAuth.verifyPassword(member.email, password);');
 s=once(s,'member.passwordHash = await hashPassword(member.email, newPassword);',`if (unifiedMembers) {
      const result = await window.TalentAuth.client.auth.updateUser({ password: newPassword });
      if (result.error) { showMemberProfileError("비밀번호 변경에 실패했습니다."); return; }
      member.passwordHash = "";
    } else member.passwordHash = await hashPassword(member.email, newPassword);`);
 s=once(s,'const member = state.members.find((item) => item.email === email);',`let member = state.members.find((item) => item.email === email);
  if (unifiedMembers) {
    try {
      member = normalizeMember(await window.TalentAuth.login(email, password));
      state.members = (await window.TalentAuth.request("members")).members.map(normalizeMember);
      form.elements.password.value = "";
    } catch (error) { setAuthMessage(error.message); return; }
  }`);
 s=once(s,'if (!member || !await verifyMemberPassword(member, password)) {','if (!member || (!unifiedMembers && !await verifyMemberPassword(member, password))) {');
 // Pending signup and administrator-created accounts use the same canonical API.
 s=s.replaceAll('passwordHash: await hashPassword(email, password),','passwordHash: unifiedMembers ? "" : await hashPassword(email, password),');
 let anchor='  state.members.unshift(member);\n  queueMemberRemoteSave(member);\n  notifyAdminsOfSignup(member);';
 s=once(s,anchor,`  if (unifiedMembers) {
    try { await window.TalentAuth.request("signup", { member, password }); form.reset(); }
    catch (error) { setAuthMessage(error.message); return; }
  } else { state.members.unshift(member); queueMemberRemoteSave(member); }
  notifyAdminsOfSignup(member);`);
 s=once(s,'  state.members.unshift(member);\n  state.memberFilters.role = "all";',`  if (unifiedMembers) {
    try {
      const saved = await window.TalentAuth.request("members/create", { member: { ...member, interviewRole: String(formData.get("interviewRole") || "") }, password });
      Object.assign(member, normalizeMember(saved.member)); form.reset();
    } catch (error) { showMemberCreateError(error.message); return; }
  }
  state.members.unshift(member);
  state.memberFilters.role = "all";`);
 s=once(s,'function logout() {','function logout() {\n  if (unifiedMembers) window.TalentAuth.logout();\n  const imFrame = document.getElementById("interview-management-frame");\n  if (imFrame) { imFrame.src = "about:blank"; delete imFrame.dataset.loaded; }');
 s=once(s,'  queueMemberRemoteSave(member);\n  addAuditLog("회원 계정 생성",','  if (!unifiedMembers) queueMemberRemoteSave(member);\n  addAuditLog("회원 계정 생성",');
 s=once(s,'    console.warn("Member remote save failed.", error);',`    console.warn("Member remote save failed.", error);
    if (unifiedMembers) {
      showToast("회원 정보 저장에 실패했습니다. " + error.message);
      window.TalentAuth.request("members").then(result => {
        state.members = result.members.map(normalizeMember); persistState({ skipRemoteSync: true }); render();
      }).catch(() => {});
    }`);
 s=once(s,'  member.passwordHash = await hashPassword(member.email, TEMP_PASSWORD);',`  if (unifiedMembers) {
    const password = await window.TalentAuth.choosePassword(member.name);
    if (!password) return;
    try { await window.TalentAuth.request("members/reset-password", { id: member.id, password }); }
    catch (error) { showToast(error.message); return; }
    member.passwordHash = "";
    addAuditLog("회원 비밀번호 초기화", member.name, "관리자 지정 비밀번호 설정");
    persistState(); renderMembers(); showToast("비밀번호를 초기화했습니다."); return;
  }
  member.passwordHash = await hashPassword(member.email, TEMP_PASSWORD);`);
 s=once(s,'  restorePersistedState();\n  ensureMemberDefaults();',`  restorePersistedState();
  if (unifiedMembers) {
    state.currentUserId = ""; state.members = [];
    const member = await window.TalentAuth.restore();
    if (member) { state.members = [normalizeMember(member)]; state.currentUserId = member.id; }
  }
  ensureMemberDefaults();`);
 s=once(s,'if (await ensureMemberPasswordHashes()) {','if (!unifiedMembers && await ensureMemberPasswordHashes()) {');
 s=once(s,'            <th>등급</th>','            <th>등급</th>\n            ${unifiedMembers ? "<th>면접 권한</th>" : ""}');
 s=once(s,'              <td>${getMemberStatusChip(member.status)}</td>',`              \${unifiedMembers ? \`<td><select class="control-select compact-select" data-member-interview-role="\${escapeHtml(member.id)}" \${isAdmin() ? "" : "disabled"}>\${renderInterviewRoleOptions(member.interviewRole)}</select></td>\` : ""}
              <td>\${getMemberStatusChip(member.status)}</td>`);
 s=once(s,'          <label data-member-create-business-unit-field',`          \${unifiedMembers && isAdmin() ? \`<label>면접 권한<select name="interviewRole" class="control-select">\${renderInterviewRoleOptions("")}</select></label>\` : ""}
          <label data-member-create-business-unit-field`);
 s=once(s,'function renderRolePermissionMatrix() {',`function renderInterviewRoleOptions(selected) {
  return Object.entries({ "": "회원 등급에 따라 자동", RECRUITER: "채용담당자", HRBP: "HRBP", INTERVIEWER: "면접관", CANDIDATE: "지원자" }).map(([key,label]) => \`<option value="\${key}" \${key === selected ? "selected" : ""}>\${label}</option>\`).join("");
}
function renderRolePermissionMatrix() {`);
 s=once(s,'    const memberRoleSelect = event.target.closest("[data-member-role]");',`    const interviewRoleSelect = event.target.closest("[data-member-interview-role]");
    if (interviewRoleSelect && unifiedMembers && isAdmin()) {
      const member = findMember(interviewRoleSelect.dataset.memberInterviewRole);
      window.TalentAuth.request("members/update", { id: member.id, member: { interviewRole: interviewRoleSelect.value } })
        .then(result => { Object.assign(member, normalizeMember(result.member)); persistState(); showToast("면접 권한을 저장했습니다."); })
        .catch(error => { renderMembers(); showToast(error.message); });
      return;
    }
    const memberRoleSelect = event.target.closest("[data-member-role]");`);
 return s;
});
edit('index.html',s=>{
 s=once(s,'    <script src="talent-pool.js',`    <script src="/vendor/supabase.js" defer></script>
    <script src="/vendor/supabase-global.js" defer></script>
    <script src="/talent-auth.js?v=20261016-01" defer></script>
    <script src="talent-pool.js`);
 s=s.replace(/\s*<a class="nav-item" href="\/interview-management"[\s\S]*?<\/a>/,'');
 s=once(s,'        </nav>',`          <button class="nav-item" type="button" data-view="interview-management"><span class="nav-icon">일</span><span>면접 일정 관리</span></button>
        </nav>`);
 s=once(s,'</main>',`<section id="interview-management-view" class="view" aria-label="면접 일정 관리"><iframe id="interview-management-frame" title="면접 일정 관리" class="embedded-tool-frame im-integrated-frame" loading="lazy"></iframe></section>
      </main>`);
 return s;
});
if (fs.existsSync(path.join(base,'server.js'))) edit('server.js',s=>once(s,'  if (/^\\/api\\/interview-management',`  if (/^\\/api\\/talent-auth(?:\\/|$)/.test(request.url.split("?")[0])) {
    require("./api/talent-auth/index.js")(request, response); return;
  }
  if (/^\\/api\\/interview-management`));
edit('api/router.js',s=>once(s,'  const loadHandler = routes[routeName];',`  if (/^talent-auth(?:\\/|$)/.test(routeName)) {
    await require("./talent-auth/index.js")(request, response); return;
  }
  const loadHandler = routes[routeName];`));
edit('scripts/build-runtime-config.js',s=>once(s,'"talent-pool.js", "interpreter.html"','"talent-pool.js", "talent-auth.js", "interpreter.html"'));
