"use strict";
// Run with node --env-file=.env. Only independent v2 variables are updated.
const path=require('node:path'),{spawn}=require('node:child_process'),{randomBytes}=require('node:crypto');
const root=path.resolve(__dirname,'..'),cli=path.join(process.env.APPDATA,'npm/node_modules/vercel/dist/vc.js');
async function put(name,value){await new Promise((resolve,reject)=>{const c=spawn(process.execPath,[cli,'env','add',name,'production','--force','--yes'],{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});c.stdout.resume();c.stderr.resume();c.on('error',reject);c.on('exit',code=>code?reject(Error('Vercel environment update failed: '+name)):resolve());c.stdin.end(value);});console.log('Configured '+name);}
async function main(){
  const values={
    INTERVIEW_MGMT_SUPABASE_URL:process.env.SUPABASE_URL,
    INTERVIEW_MGMT_SUPABASE_ANON_KEY:process.env.SUPABASE_ANON_KEY,
    INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY:process.env.SUPABASE_SERVICE_ROLE_KEY,
    INTERVIEW_MGMT_MAIL_SEND_ENABLED:'true',
    INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS:process.env.INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS,
    INTERVIEW_MGMT_MAIL_CRON_SECRET:process.env.INTERVIEW_MGMT_MAIL_CRON_SECRET||randomBytes(32).toString('hex')
  };
  if(!values.INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS)throw Error('Set INTERVIEW_MGMT_MAIL_ALLOWED_RECIPIENTS to the approved test recipient before deployment.');
  if(process.env.INTERVIEW_MGMT_RESEND_API_KEY)values.INTERVIEW_MGMT_RESEND_API_KEY=process.env.INTERVIEW_MGMT_RESEND_API_KEY;
  if(process.env.INTERVIEW_MGMT_MAIL_FROM)values.INTERVIEW_MGMT_MAIL_FROM=process.env.INTERVIEW_MGMT_MAIL_FROM;
  if(new URL(values.INTERVIEW_MGMT_SUPABASE_URL).hostname!=='pefsetlczrrlvlehealp.supabase.co'||!values.INTERVIEW_MGMT_SUPABASE_ANON_KEY||!values.INTERVIEW_MGMT_SUPABASE_SERVICE_ROLE_KEY)throw Error('Test project configuration required');
  for(const [name,value]of Object.entries(values))await put(name,value);
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
