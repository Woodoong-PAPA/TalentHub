"use strict";
// Rebuild the currently deployed source, then overlay only interview management.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const cli=path.join(process.env.APPDATA,'npm/node_modules/vercel/dist/vc.js');
const deployment=process.argv[2];
if(!/^dpl_[a-zA-Z0-9]+$/.test(deployment||''))throw Error('Baseline deployment id required');
const stage=path.join(root,'.codex-artifacts',`unified-members-release-${Date.now()}`);
async function api(endpoint){return new Promise((resolve,reject)=>{const child=spawn(process.execPath,[cli,'api',endpoint,'--raw'],{cwd:root,windowsHide:true});let out='',err='';child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>err+=b);child.on('error',reject);child.on('exit',code=>{if(code)return reject(Error('Vercel source retrieval failed: '+endpoint+' '+err.slice(-400)));try{resolve(JSON.parse(out.replace(/^\uFEFF/,'')));}catch{reject(Error('Invalid Vercel source response'));}});});}
async function main(){
  const tree=await api(`/v6/deployments/${deployment}/files`),files=[];
  function walk(nodes,p=''){for(const item of nodes){const name=p?`${p}/${item.name}`:item.name;if(item.children)walk(item.children,name);else if(item.type==='file'&&name.startsWith('src/')){const rel=name.slice(4);if(!rel.split('/').some(part=>part==='..'||part.startsWith('.codex')||['docs','supabase','.github'].includes(part))&&!/^(\.env|runtime-config\.js)/.test(rel))files.push({rel,uid:item.uid});}}}
  walk(tree);fs.mkdirSync(stage,{recursive:true});let copied=0,downloaded=0;
  const pending=[...files];
  await Promise.all(Array.from({length:3},async()=>{while(pending.length){const {rel,uid}=pending.shift(),source=path.join(root,rel),target=path.join(stage,rel);let bytes=fs.existsSync(source)&&fs.statSync(source).isFile()?fs.readFileSync(source):null;if(bytes&&crypto.createHash('sha1').update(bytes).digest('hex')===uid)copied++;else{const value=await api(`/v7/deployments/${deployment}/files/${uid}`);bytes=Buffer.from(value.data,'base64');if(crypto.createHash('sha1').update(bytes).digest('hex')!==uid)throw Error('Source hash mismatch: '+rel);downloaded++;}fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}}));
  const overlay=['interview-management.html','interview-management.css','interview-management.js','talent-auth.js','api/talent-auth/index.js','api/interview-management/index.js','lib/interview-management-core.js','lib/interview-management-mail.js'];
  for(const rel of overlay){const target=path.join(stage,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,rel),target);}
  const cp=require('node:child_process');
  cp.execFileSync(process.execPath,[path.join(root,'scripts/integrate-talent-members.js'),stage],{stdio:'inherit',windowsHide:true});
  const configFile=path.join(stage,'api/client-config.js');let cfg=fs.readFileSync(configFile,'utf8');if(!cfg.includes('unifiedAuthEnabled:')){cfg=cfg.replace('    supabaseAnonKey,',"    supabaseAnonKey,\n    unifiedAuthEnabled: process.env.TALENT_AUTH_UNIFIED_ENABLED === 'true',");fs.writeFileSync(configFile,cfg);}
  const buildFile=path.join(stage,'scripts/build-runtime-config.js');let build=fs.readFileSync(buildFile,'utf8');if(!build.includes('unifiedAuthEnabled:')){build=build.replace('  supabaseAnonKey,',"  supabaseAnonKey,\n  unifiedAuthEnabled: process.env.TALENT_AUTH_UNIFIED_ENABLED === 'true',");fs.writeFileSync(buildFile,build);}
  const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');fs.appendFileSync(path.join(stage,'styles.css'),'\n'+css.slice(css.indexOf('.im-integrated-frame {')));
  fs.mkdirSync(path.join(stage,'.vercel'),{recursive:true});fs.copyFileSync(path.join(root,'.vercel/project.json'),path.join(stage,'.vercel/project.json'));
  const changed=[...overlay,'index.html','api/router.js','api/client-config.js','scripts/build-runtime-config.js','styles.css'];
  fs.writeFileSync(path.join(root,'.codex-artifacts/unified-members-release-manifest.json'),JSON.stringify({baseline:deployment,stage,changed,baselineFiles:files,copied,downloaded},null,2));
  console.log(JSON.stringify({stage,baseline:deployment,copied,downloaded,changed}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
