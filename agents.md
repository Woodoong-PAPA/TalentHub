# Project Agent Instructions

## Project Overview

This project is a static MVP prototype for a Samsung recruiter talent pool management system. The product helps recruiters manage candidate pools, register candidates, simulate resume parsing, run AI-based candidate search, view detailed candidate profiles, track candidate history, and inspect audit/compliance status.

The current app is a frontend-only prototype. All candidate data lives in browser memory inside `app.js`.

## Current Product Scope

- Dashboard for talent pool metrics, status pipeline, skill distribution, and action queue.
- Candidate pool list with search and filters.
- Candidate registration form with resume upload simulation.
- AI search simulation with recommendation evidence.
- Candidate detail profile reachable from candidate pool rows and AI search results.
- Candidate profile includes overview, resume, education, career, activity, applications, and compliance.
- Candidate detail profiles are editable, and education/career records can contain multiple entries.
- Audit log view for important user and AI actions.
- Local static server for preview.

## Tech Stack

- HTML: `index.html`
- CSS: `styles.css`
- JavaScript: `app.js`
- Local server: `server.js`
- Documentation:
  - `design.md`
  - `docs/01-plan/features/talent-pool-management.plan.md`
  - `docs/02-design/features/talent-pool-management.design.md`
  - `docs/02-design/features/talent-pool-management.do.md`

No package manager or build step is currently required.

## How To Run

```powershell
node server.js 5177
```

Open:

```text
http://127.0.0.1:5177/
```

If port `5177` is already in use, run the server with another port:

```powershell
node server.js 5178
```

## Verification

Use these checks after editing:

```powershell
node --check app.js
node --check server.js
```

Then verify in the browser:

- Dashboard loads without horizontal overflow.
- Candidate names and roles in tables do not overlap.
- Talent pool rows show photo, name, education summary, career summary, role, status, and owner.
- Candidate name click from the talent pool opens the detail profile.
- Existing candidate profile edits save back into the in-memory candidate object.
- AI search renders results and detail navigation works.
- Candidate registration creates a new profile.
- Face profile photo upload preview appears in the registration form.

## Design System

Follow `design.md`.

Key rules:

- Use a Toss-inspired clarity system adapted for internal HR operations.
- Keep surfaces white with warm grey page background.
- Use `#3182f6` only for interactions and selected states.
- Use compact 8px cards, 12px buttons, 14px inputs, and pill badges.
- Do not use emojis in UI or documentation.
- Avoid decorative gradients, ornamental backgrounds, and marketing-style composition.
- Keep tables compact but readable with clear cell separation.
- Korean is the primary UI language.

## Data Model Notes

Candidate objects in `app.js` should include:

- Basic profile: `id`, `name`, `role`, `company`, `years`, `jobFamily`, `status`, `consent`, `owner`
- Visual profile: `initials`, `photoUrl`, `avatarColor`
- Skills and AI evidence: `skills`, `tags`, `summary`, `evidence`
- Education: `education[]`
  - `degree`
  - `school`
  - `major`
  - `start`
  - `end`
- Career: `career[]`
  - `country`
  - `company`
  - `rank`
  - `position`
  - `start`
  - `end`
  - `achievements`
- Activity and hiring context: `applications`, `timeline`

When adding new sample candidates, include education and career data so the detail profile stays complete.

## UI Structure Notes

- Do not add a separate left navigation item for detail profile.
- Candidate detail is entered from:
  - Candidate name in the talent pool list.
  - Detail buttons in dashboard action queue.
  - Detail buttons in AI search results.
- Keep `detail-view` in `index.html` because it is still a routed view, but it should not appear as a standalone sidebar menu item.

## Coding Conventions

- Use plain JavaScript and keep the app dependency-free unless the project direction changes.
- Prefer small helper functions over repeated template strings when rendering complex repeated UI.
- Keep functions camelCase.
- Keep constants UPPER_SNAKE_CASE only when they are true constants.
- Preserve Korean labels and recruiter workflow language.
- Do not introduce a backend or external network dependency unless explicitly requested.

## Important Constraints

- This is a prototype, not a production HRIS.
- Resume parsing and AI search are simulated.
- Face photo upload uses an in-browser object URL only and is not persisted after refresh.
- No real candidate personal information should be added.
- Do not remove the PDCA documents.
- After significant implementation changes, run a gap analysis in the PDCA flow when requested.
