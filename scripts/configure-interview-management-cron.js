"use strict";
// Privileged operator setup: no credentials are printed or embedded in cron SQL.
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),{randomBytes}=require('node:crypto');
const root=path.resolve(__dirname,'..');
async function run(executable,args,input){return new Promise((resolve,reject)=>{const child=spawn(executable,args,{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});child.stdout.resume();child.stderr.resume();child.on('error',reject);child.on('exit',code=>code?reject(Error('Operator command failed')):resolve());child.stdin.end(input||'');});}
async function main(){
  if(new URL(process.env.SUPABASE_URL).hostname!=='pefsetlczrrlvlehealp.supabase.co')throw Error('Approved test project required');
  const secret=process.env.INTERVIEW_MGMT_MAIL_CRON_SECRET||randomBytes(32).toString('hex');
  if(!/^[a-zA-Z0-9_-]{32,128}$/.test(secret))throw Error('Invalid worker secret format');
  if(!process.env.INTERVIEW_MGMT_MAIL_CRON_SECRET)fs.appendFileSync(path.join(root,'.env'),'\nINTERVIEW_MGMT_MAIL_CRON_SECRET='+secret+'\n');
  const sql=path.join(root,'.codex-artifacts/interview-vault-setup.sql');
  // This temporary file is Git-ignored and removed as soon as Vault consumes it.
  fs.writeFileSync(sql,"do $vault$ declare v_id uuid; begin select id into v_id from vault.secrets where name='interview_mgmt_mail_cron_secret'; if v_id is null then perform vault.create_secret('"+secret+"','interview_mgmt_mail_cron_secret','TalentHub v2 approved mail worker'); else perform vault.update_secret(v_id,'"+secret+"'); end if;end $vault$;");
  try{await run('powershell.exe',['-NoProfile','-File',path.join(process.env.APPDATA,'npm/supabase.ps1'),'db','query','--linked','--file',sql]);}finally{fs.unlinkSync(sql);}
  await run(process.execPath,[path.join(process.env.APPDATA,'npm/node_modules/vercel/dist/vc.js'),'env','add','INTERVIEW_MGMT_MAIL_CRON_SECRET','production','--force','--yes'],secret);
  console.log('Worker secret stored in local .env, Supabase Vault and Vercel. Redeploy before enabling the cron job.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
