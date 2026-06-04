# Supabase, Vercel, GitHub Deployment Guide

## 1. Current Status

This project is now prepared for Supabase-backed deployment on Vercel with GitHub Actions.

Completed locally:

- Added Vercel build configuration: `vercel.json`
- Added runtime config generation: `scripts/build-runtime-config.js`
- Added npm scripts: `package.json`
- Added Supabase schema: `supabase/schema.sql`
- Added GitHub Actions deployment workflow: `.github/workflows/vercel-deploy.yml`
- Added environment variable template: `.env.example`
- Updated app runtime to use Supabase when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are configured
- Uses `talent-pool.js` as the browser script so Vercel does not mistake the UI script for a Node entrypoint
- Kept local fallback through `localStorage` when Supabase is not configured

Blocked in this local environment:

- `git` CLI is not installed or not on PATH.
- `gh` CLI is not installed or not on PATH.
- `vercel` CLI is not installed or not on PATH.
- `supabase` CLI is not installed or not on PATH.
- No Supabase, Vercel, or GitHub auth tokens are available in the environment.

Because of those constraints, the actual remote project creation, GitHub push, Supabase SQL execution, and Vercel deployment must be completed after the account/project credentials are available.

## 2. Environment Variables

Use these values in local `.env`, Vercel Project Environment Variables, and GitHub Actions Secrets.

| Name | Scope | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | Local, Vercel, GitHub | Supabase project URL |
| `SUPABASE_ANON_KEY` | Local, Vercel, GitHub | Public anon key used by browser REST calls |
| `APP_DATA_SOURCE` | Local, Vercel, GitHub | Use `supabase` for remote persistence, `local` for local-only mode |
| `OPENAI_API_KEY` | Local/Vercel only when AI backend exists | Do not expose this to browser code |
| `VERCEL_TOKEN` | GitHub secret | Token for GitHub Actions deployment |
| `VERCEL_ORG_ID` | GitHub secret | Vercel team/user id |
| `VERCEL_PROJECT_ID` | GitHub secret | Vercel project id |

Do not commit `.env`, `.env.local`, `.vercel`, or `runtime-config.js`.

## 3. Supabase Setup

1. Create a Supabase project.
2. Open Supabase Dashboard.
3. Go to SQL Editor.
4. Run the full contents of `supabase/schema.sql`.
5. Go to Project Settings > API.
6. Copy:
   - Project URL into `SUPABASE_URL`
   - anon public key into `SUPABASE_ANON_KEY`

The current schema creates:

- `public.candidates`
- `public.audit_logs`
- `candidate-assets` storage bucket
- demo RLS policies for anon/authenticated read/write

Important production note:

The current RLS policies are intentionally permissive for MVP/demo deployment. Before using this with real candidate data, replace the demo anon write policies with authenticated recruiter-only policies and move mutations behind a server-side API.

## 4. Local Verification With Supabase

After filling `.env`:

```powershell
npm run build
npm run check
npm run dev
```

Open:

```text
http://127.0.0.1:5177/
```

Expected behavior:

- If Supabase variables are valid, local state syncs to Supabase.
- If Supabase variables are missing or invalid, the app continues with local browser storage.
- Candidate edits, registration, education/career changes, and audit logs remain usable.

## 5. GitHub Setup

When Git is available:

```powershell
git init
git add .
git commit -m "Prepare Supabase and Vercel deployment"
git branch -M main
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

If GitHub CLI is available:

```powershell
gh repo create <owner>/<repo> --private --source . --remote origin --push
```

Add these GitHub repository secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The workflow at `.github/workflows/vercel-deploy.yml` deploys to Vercel on pushes to `main`.

## 6. Vercel Setup

Option A: Vercel Dashboard

1. Import the GitHub repository into Vercel.
2. Framework Preset: Other.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `APP_DATA_SOURCE=supabase`
6. Deploy.

Option B: Vercel CLI

```powershell
npm install -g vercel
vercel login
vercel link
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add APP_DATA_SOURCE production
vercel deploy --prod
```

Set `APP_DATA_SOURCE` to:

```text
supabase
```

## 7. Runtime Config

Vercel runs:

```powershell
npm run build
```

That creates `runtime-config.js` with only public runtime values:

- Supabase URL
- Supabase anon key
- data source mode

This file is ignored by Git and regenerated per environment.

The production static output is written to `dist`, and Vercel is configured to deploy only that directory.

## 8. Post-Deployment Smoke Test

After deployment:

1. Open the Vercel production URL.
2. Register a test candidate.
3. Edit the candidate name, education, and career.
4. Refresh the page.
5. Confirm the changes remain visible.
6. Open Supabase Table Editor.
7. Confirm rows exist in:
   - `candidates`
   - `audit_logs`

## 9. Production Hardening Checklist

Before using real candidate data:

- Replace demo anon write policies with authenticated RLS policies.
- Move candidate mutations behind server-side APIs.
- Store profile photos and resumes in Supabase Storage instead of Data URLs.
- Add SSO/RBAC.
- Add audit immutability and retention policies.
- Add CI checks for SQL migrations.
- Add backup and recovery policy.
- Add monitoring and error tracking.

## 10. References

- Vercel Project Configuration: https://vercel.com/docs/project-configuration
- Vercel `vercel.json` configuration: https://vercel.com/docs/project-configuration/vercel-json
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
