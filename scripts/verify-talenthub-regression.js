"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("@playwright/test");
const base=process.env.TALENTHUB_TEST_URL||"http://127.0.0.1:5186";
async function main(){
  const browser=await chromium.launch({headless:true});
  try{
    for(const width of [1440,390]){
      const context=await browser.newContext({viewport:{width,height:960}});
      const page=await context.newPage();const errors=[];page.on("pageerror",error=>errors.push(error.message));
      await page.route("**/runtime-config.js*",route=>route.fulfill({contentType:"application/javascript",body:"window.__APP_CONFIG__={dataSource:'local'};"}));
      await page.route("**/api/**",route=>route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({ok:false,error:"Offline regression test"})}));
      await page.goto(base);await page.locator("#login-form").waitFor();
      assert.equal(await page.locator(".app-shell").isVisible(),false);
      await page.locator("#login-email").fill("admin@samsung.com");await page.locator("#login-password").fill("Admin1234!");await page.locator("#login-form button[type=submit]").click();
      await page.locator("body.is-authenticated").waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.nav-list [data-view="interview-management"]').count(),1);
      for(const view of ["pool","screening","interview","ai-search","members","dashboard"]){
        await page.locator(`.nav-list [data-view="${view}"]`).click();await page.locator(`#${view}-view.is-active`).waitFor();
      }
      await page.locator('.nav-list [data-view="pool"]').click();await page.locator('[data-view="register"]').click();
      await page.locator("#candidate-name").fill("가상 회귀 지원자");await page.locator("#candidate-role").fill("테스트 개발자");await page.locator("#candidate-skills").fill("JavaScript, 테스트");
      await page.locator("#register-education-degree-0").fill("학사");await page.locator("#register-education-school-0").fill("가상 대학교");await page.locator("#register-education-major-0").fill("테스트학");
      await page.locator("#register-career-company-0").fill("가상 회사");await page.locator("#register-career-position-0").fill("테스트 개발자");await page.locator("#register-career-country-0").fill("한국");
      await page.locator("#profile-photo").setInputFiles({name:"test.png",mimeType:"image/png",buffer:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5X8AAAAASUVORK5CYII=","base64")});
      await page.locator("#photo-preview img").waitFor();await page.locator("#register-form [data-register-submit]").click();
      await page.waitForFunction(()=>state.candidates.some(c=>c.name==="가상 회귀 지원자"));
      const candidate=await page.evaluate(()=>state.candidates.find(c=>c.name==="가상 회귀 지원자"));assert.equal(candidate.education[0].school,"가상 대학교");assert.equal(candidate.career[0].company,"가상 회사");
      await page.locator('.nav-list [data-view="pool"]').click();
      await page.locator(`#pool-view [data-select-candidate="${candidate.id}"]`).first().click();await page.locator("#detail-view.is-active").waitFor();
      await page.locator("[data-start-edit]").first().click();await page.locator("#edit-name").fill("가상 회귀 수정 지원자");await page.locator("#candidate-edit-form [data-save-candidate]").first().click();
      await page.waitForFunction(()=>state.candidates.some(c=>c.name==="가상 회귀 수정 지원자"));
      await page.locator('.nav-list [data-view="ai-search"]').click();await page.locator("#ai-query").fill("JavaScript 테스트 개발자");await page.locator("#run-ai-search").click();await page.waitForFunction(()=>!state.aiSearchLoading&&state.aiQuery.includes("JavaScript"));
      assert.ok(await page.locator(".search-results").innerText());
      assert.deepEqual(errors,[]);console.log(`PASS existing TalentHub ${width}px: auth gate/admin login, menus including Interview, registration/photo, pool detail/edit, AI search`);
      await context.close();
    }
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
