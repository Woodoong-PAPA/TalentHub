"use strict";
// Rebuild the currently deployed source, then overlay only interview management.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const cli=path.join(process.env.APPDATA,'npm/node_modules/vercel/dist/vc.js');
const deployment=process.argv[2];
if(!/^dpl_[a-zA-Z0-9]+$/.test(deployment||''))throw Error('Baseline deployment id required');
const stage=path.join(root,'.codex-artifacts',`interview-release-${Date.now()}`);
async function api(endpoint){return new Promise((resolve,reject)=>{const child=spawn(process.execPath,[cli,'api',endpoint,'--raw'],{cwd:root,windowsHide:true});let out='',err='';child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>err+=b);child.on('error',reject);child.on('exit',code=>{if(code)return reject(Error('Vercel source retrieval failed: '+endpoint+' '+err.slice(-400)));try{resolve(JSON.parse(out.replace(/^\uFEFF/,'')));}catch{reject(Error('Invalid Vercel source response'));}});});}
async function main(){
  const tree=await api(`/v6/deployments/${deployment}/files`),files=[];
  function walk(nodes,p=''){for(const item of nodes){const name=p?`${p}/${item.name}`:item.name;if(item.children)walk(item.children,name);else if(item.type==='file'&&name.startsWith('src/')){const rel=name.slice(4);if(!rel.split('/').some(part=>part==='..'||part.startsWith('.codex')||['docs','supabase','.github'].includes(part))&&!/^(\.env|runtime-config\.js)/.test(rel))files.push({rel,uid:item.uid});}}}
  walk(tree);fs.mkdirSync(stage,{recursive:true});let copied=0,downloaded=0;
  const pending=[...files];
  await Promise.all(Array.from({length:3},async()=>{while(pending.length){const {rel,uid}=pending.shift(),source=path.join(root,rel),target=path.join(stage,rel);let bytes=fs.existsSync(source)&&fs.statSync(source).isFile()?fs.readFileSync(source):null;if(bytes&&crypto.createHash('sha1').update(bytes).digest('hex')===uid)copied++;else{const value=await api(`/v7/deployments/${deployment}/files/${uid}`);bytes=Buffer.from(value.data,'base64');if(crypto.createHash('sha1').update(bytes).digest('hex')!==uid)throw Error('Source hash mismatch: '+rel);downloaded++;}fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}}));
  const overlay=['interview-management.html','interview-management.css','interview-management.js','api/interview-management/index.js','lib/interview-management-core.js','lib/interview-management-mail.js'];
  for(const rel of overlay){const target=path.join(stage,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,rel),target);}
  function edit(rel,change){const target=path.join(stage,rel);const before=fs.readFileSync(target,'utf8'),after=change(before);if(before===after)throw Error('Release patch did not apply: '+rel);fs.writeFileSync(target,after);}
  edit('index.html',s=>s.replace('<div class="sidebar-footer">','<a class="nav-item" href="/interview-management" style="text-decoration:none"><span class="nav-icon">일</span><span>면접 일정 관리</span></a>\n        <div class="sidebar-footer">'));
  edit('api/router.js',s=>s.replace('  const loadHandler = routes[routeName];','  if (/^interview-management(?:/|$)/.test(routeName)) return require("./interview-management/index.js")(request,response);\n  const loadHandler = routes[routeName];').replace('(?:/|$)','(?:\\/|$)'));
  edit('api/client-config.js',s=>s.replace('    supabaseAnonKey,','    supabaseAnonKey,\n    interviewManagementSupabaseUrl: process.env.INTERVIEW_MGMT_SUPABASE_URL || supabaseUrl,\n    interviewManagementSupabaseAnonKey: process.env.INTERVIEW_MGMT_SUPABASE_ANON_KEY || supabaseAnonKey,'));
  edit('scripts/build-runtime-config.js',s=>s.replace('"profile-report.html"].forEach','"profile-report.html", "interview-management.html", "interview-management.css", "interview-management.js"].forEach').replace('  supabaseAnonKey,','  supabaseAnonKey,\n  interviewManagementSupabaseUrl: process.env.INTERVIEW_MGMT_SUPABASE_URL || supabaseUrl,\n  interviewManagementSupabaseAnonKey: process.env.INTERVIEW_MGMT_SUPABASE_ANON_KEY || supabaseAnonKey,'));
  // cleanUrls + filesystem handle /interview-management; an .html rewrite causes 404.
  fs.mkdirSync(path.join(stage,'.vercel'),{recursive:true});fs.copyFileSync(path.join(root,'.vercel/project.json'),path.join(stage,'.vercel/project.json'));
  const changed=[...overlay,'index.html','api/router.js','api/client-config.js','scripts/build-runtime-config.js','vercel.json'];
  fs.writeFileSync(path.join(root,'.codex-artifacts/interview-release-manifest.json'),JSON.stringify({baseline:deployment,stage,changed,baselineFiles:files,copied,downloaded},null,2));
  console.log(JSON.stringify({stage,baseline:deployment,copied,downloaded,changed}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
