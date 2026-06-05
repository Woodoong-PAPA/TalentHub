# Gap Analysis: talent-pool-management

## 1. Metadata

- Date: 2026-06-04
- Phase: Check
- Feature: talent-pool-management
- Plan reference: `docs/01-plan/features/talent-pool-management.plan.md`
- Design reference: `docs/02-design/features/talent-pool-management.design.md`
- Implementation references:
  - `index.html`
  - `styles.css`
  - `talent-pool.js`
  - `server.js`
  - `design.md`
  - `agents.md`

## 2. Executive Summary

The current implementation is a functional static web prototype for a Samsung Electronics recruiter talent pool management system. It covers the main recruiter-facing screens, including dashboard, talent pool list, talent registration, AI-style search, candidate detail, profile editing, education/career records, photo upload preview, and audit log display.

However, the enterprise design scope in the PDCA design document includes backend APIs, persistence, authentication, RBAC, storage, parsing workers, AI/vector search, integrations, monitoring, deployment, and compliance-grade audit/retention workflows. Those capabilities are currently represented as frontend simulations or are not yet implemented.

- Strict design match rate: 58%
- Prototype coverage including partial items: 67%
- PDCA decision: below the 90% threshold, proceed to Act / iterate.

After Act Iteration 1, the prototype now persists candidate data locally, preserves uploaded profile photos across reloads, validates profile edit records, supports education/career deletion, and restores original profile data when edits are canceled. The updated strict match rate is 66%, and prototype coverage including partial items is 73%.

## 3. Match Rate Calculation

This section keeps the initial Check-phase score for traceability. The latest recalculation is documented in section 12.

| Category | Count | Notes |
| --- | ---: | --- |
| Implemented | 29 | Fully visible and usable in the static prototype |
| Partial | 9 | Represented in UI or local JavaScript, but not production-grade |
| Missing | 12 | Not implemented |
| Total assessed items | 50 | Derived from plan, design, and user-requested changes |

Strict match rate uses fully implemented items only.

```text
29 / 50 = 58%
```

Prototype coverage gives half credit for partial items.

```text
(29 + 0.5 * 9) / 50 = 67%
```

## 4. Implemented Items

| Area | Status | Evidence |
| --- | --- | --- |
| Dashboard view | Implemented | Summary metrics, pipeline, skill distribution, action queue in `talent-pool.js` and `index.html` |
| Talent pool list | Implemented | Candidate table with photo, name, education, career, role, status, owner |
| Clear list cell separation | Implemented | Dedicated table layout and summary cells in `styles.css` |
| Candidate name opens detail | Implemented | Candidate row/name click routes into detail view |
| Detail sidebar menu removal | Implemented | Detail view is no longer exposed as a separate sidebar item |
| Registration view | Implemented | Candidate form with resume upload field and parsing preview simulation |
| Resume parsing preview | Implemented as prototype | UI displays extracted skills, education, career, and summary preview |
| AI search view | Implemented as prototype | Query interpretation, scored recommendations, and evidence chips |
| Candidate detail view | Implemented | Overview, resume, education, career, activity, applications, compliance tabs |
| Profile editing | Implemented | Existing candidate profile can be edited from detail view |
| Multiple education records | Implemented | Addable education record blocks in edit form |
| Multiple career records | Implemented | Addable career record blocks in edit form |
| Education fields | Implemented | Degree, school, major, start/end year-month |
| Career fields | Implemented | Country, company, level, title, start/end/current, achievements |
| Face profile photo upload | Implemented as prototype | Photo file upload creates object URL preview for detail/list |
| Candidate profile visual fallback | Implemented | Initials avatar when no uploaded photo exists |
| Audit log screen | Implemented | Activity list and event metadata display |
| In-memory audit events | Implemented as prototype | Key actions append local audit events |
| Toss-inspired visual system | Implemented | White/grey surfaces, blue action color, compact controls |
| Static local server | Implemented | `server.js` serves the prototype on localhost |
| Documentation context | Implemented | `design.md` and `agents.md` capture project/design guidance |

## 5. Partial Items

| Area | Current State | Gap |
| --- | --- | --- |
| Resume parsing | Simulated in JavaScript | No real document parser, OCR, NLP extraction, confidence score, or review workflow |
| AI talent search | Local heuristic scoring | No LLM integration, embedding model, vector search, semantic filters, or evaluation loop |
| Search and filtering | Basic local filtering | No indexed search, saved filters, advanced query builder, or recruiter-specific ranking model |
| Profile photo upload | Browser object URL preview | No persistent file upload, validation, storage URL, resizing, or access control |
| Candidate edits | In-memory state mutation | Refresh loses edits because there is no persistence |
| Education/career management | Add and edit supported | No delete, reorder, validation, or duplicate detection |
| Audit log | UI and local event append | No immutable audit table, actor identity, retention policy, or export |
| Compliance data | Display-oriented | No actual consent lifecycle, masking, deletion, retention timer, or access policy enforcement |
| Responsive verification | Desktop verified | Mobile and edge viewport QA still need full pass |

## 6. Missing Items

| Area | Missing Capability | Impact |
| --- | --- | --- |
| Backend API | REST/GraphQL endpoints for candidate, resume, search, audit, and admin domains | Frontend cannot support real users or shared data |
| Database | Candidate, education, career, consent, audit, and application persistence | Data disappears on reload and cannot be queried reliably |
| Authentication | SSO, MFA, session management | No user identity or recruiter-specific access |
| Authorization | RBAC/ABAC by recruiter, role, org, and candidate sensitivity | Compliance and privacy requirements cannot be enforced |
| Object storage | Resume files and profile image storage | Upload features remain local-only |
| Queue/worker layer | Async resume parsing and enrichment jobs | Large files and parsing workloads cannot be handled safely |
| Real AI integration | LLM-based parsing, profile summarization, and search assistance | AI functionality remains a mock experience |
| Vector/search index | Semantic search, filter indexing, ranking, and fast retrieval | AI search cannot scale beyond local arrays |
| ATS/HRIS integration | Sync with recruiting systems and employee/internal mobility systems | Enterprise workflow remains isolated |
| Notifications | Follow-up reminders, candidate update notifications, workflow alerts | Recruiter action queue is manual/static |
| Monitoring | Metrics, logging, tracing, alerting | No operational visibility |
| Deployment/CI/CD | Build, test, deploy, rollback, environment config | App cannot be productionized |

## 7. Design Deviations

| Decision | Reason | Follow-up |
| --- | --- | --- |
| Implemented as dependency-free static app | Fast prototype delivery and local browser verification | Split into frontend app plus API/data layer when moving beyond MVP |
| Candidate pool columns changed | User requested photo, name, education, career, role, status, owner | Keep this as the product direction |
| Detail profile removed from sidebar | User requested detail access through talent pool item click | Keep detail as contextual navigation |
| AI and parsing are simulated | No backend/model infrastructure exists yet | Replace with service contracts and real integrations |
| Data is in memory | Current build is a prototype | Add local persistence first, then backend persistence |

## 8. Risk Assessment

| Risk | Severity | Notes |
| --- | --- | --- |
| Recruiter edits are lost on refresh | High | Current state exists only in JavaScript memory |
| Uploaded profile photos are not persisted | High | Object URLs disappear after reload |
| AI search may be mistaken for real AI | Medium | UI should label prototype behavior or wire real services |
| Privacy/compliance controls are display-only | High | Enterprise candidate data requires actual access and retention controls |
| Resume parsing is not real | Medium | Recruiter workflow cannot reduce manual entry yet |
| No tests | Medium | Regression risk will grow as edit and data flows expand |

## 9. Recommended Act Iterations

### Iteration 1: Stabilize the Prototype Data Flow

- Add `localStorage` persistence for candidates, audit logs, uploaded photo metadata where feasible, and UI preferences.
- Add education/career delete buttons.
- Add education/career validation for required fields and year-month format.
- Add cancel behavior that restores the original profile state.
- Add empty/error states for pool search and edit forms.

### Iteration 2: Prepare for Backend Integration

- Extract candidate data operations into a small repository/service layer.
- Define API-shaped request/response contracts for candidate CRUD, education/career CRUD, resume upload, search, and audit events.
- Replace direct state mutation with service functions that can later call real APIs.
- Add mock failure/loading states.

### Iteration 3: Implement Persistence and Storage

- Choose backend approach: BaaS for faster MVP or custom API for enterprise architecture.
- Persist candidate profiles, education, career, application history, consent, and audit events.
- Add object storage for resume files and profile images.
- Introduce authenticated user identity for owner and audit actor fields.

### Iteration 4: Real Parsing and AI Search

- Add resume parsing pipeline with extraction confidence and recruiter confirmation.
- Add profile enrichment and summarization.
- Add semantic search with embeddings/vector index.
- Add search evaluation examples so recommendations can be checked for quality.

### Iteration 5: Enterprise Readiness

- Add SSO/MFA and RBAC/ABAC.
- Implement consent, retention, deletion, masking, and immutable audit policies.
- Add ATS/HRIS integration points.
- Add monitoring, tests, CI/CD, and deployment runbook.

## 10. Next Step

Because the strict design match rate is 58%, this feature should move from Check to Act. The most practical next implementation step is Iteration 1: local persistence and profile edit polish. This keeps the prototype useful for recruiter demos while preparing the code for a real backend later.

## 11. Act Iteration 1 Result

Date: 2026-06-04

Implemented the first Act iteration focused on prototype data stability and profile edit quality.

Completed items:

- Added `localStorage` persistence for candidates, audit logs, selected candidate, and pool filters.
- Added persisted profile photo handling by storing uploaded photos as Data URLs instead of temporary object URLs.
- Added edit snapshots so canceling or leaving an edit session restores the original candidate state.
- Added delete actions for education and career records.
- Added edit-form validation for required candidate, education, and career fields.
- Added current-employment behavior that disables the career end-month field when "현재 재직 중" is checked.
- Added UI styling for validation errors, compact delete buttons, and disabled inputs.

Verification:

- `node --check talent-pool.js` passed.
- `node --check server.js` passed.
- Local server returned `200` for `/` and `/talent-pool.js`.
- Chrome headless rendered the dashboard, talent pool headers, education/career columns, registration form, detail tabs, and audit log.
- Chrome DevTools Protocol smoke test confirmed edit form open, education delete, validation error display, save to `localStorage`, and persistence after reload.

Remaining Act priorities:

- Add backend-shaped service layer and mock API contracts.
- Add persistent object storage or backend upload once the backend approach is selected.
- Re-run Gap Analysis after the next implementation pass.

## 12. Re-Analysis After Act Iteration 1

Date: 2026-06-04

### Updated Match Rate

The scoring set remains 50 assessed design/prototype acceptance items. Act Iteration 1 moved several prototype data-stability and edit-quality items from partial to implemented.

| Category | Before Act 1 | After Act 1 | Notes |
| --- | ---: | ---: | --- |
| Implemented | 29 | 33 | Local persistence, persistent photo data, edit rollback, record deletion, and validation are now implemented |
| Partial | 9 | 7 | AI/search, audit, compliance, and upload/storage concerns remain partial |
| Missing | 12 | 10 | Enterprise backend, real AI, search index, auth, integrations, monitoring, and deployment remain outside the static prototype |
| Total assessed items | 50 | 50 | Same scoring base as initial analysis |

Strict match rate:

```text
33 / 50 = 66%
```

Prototype coverage including partial items:

```text
(33 + 0.5 * 7) / 50 = 73%
```

### Newly Closed Gaps

| Gap | Result | Evidence |
| --- | --- | --- |
| Recruiter edits are lost on refresh | Closed for prototype | `localStorage` persistence stores candidates, audit logs, selected candidate, and pool filters |
| Uploaded profile photos are temporary | Closed for prototype | Uploaded photos are converted to Data URLs and persisted locally |
| Edit cancel leaves draft mutations behind | Closed | Edit snapshots restore the original candidate when canceling or leaving edit mode |
| Education/career records cannot be removed | Closed | Delete actions are available for both education and career edit records |
| Education/career fields lack validation | Closed for prototype | Required field and year-month validation now block invalid saves |
| Current employment end date can conflict | Closed | Checking current employment disables and clears career end month |

### Remaining Partial Gaps

| Area | Current State | Remaining Gap |
| --- | --- | --- |
| Resume parsing | Simulated extraction preview | No real parser, OCR, NLP extraction, confidence calibration, or review queue |
| AI talent search | Local heuristic scoring | No model-backed semantic parsing, embeddings, vector retrieval, or quality evaluation |
| Search/filtering | Local search and locally persisted filters | No backend index, saved search entity, advanced filters, or ranked search service |
| File upload/storage | Data URL for browser-local photo persistence | No object storage, file validation policy, signed URL, resizing, or access control |
| Audit log | Locally persisted event list | No immutable audit store, user identity, export, retention, or tamper protection |
| Compliance | Display-oriented consent/retention UI | No enforceable masking, deletion, retention timer, or policy engine |
| Responsive QA | Desktop/headless smoke verified | Full mobile and edge viewport QA still required |

### Remaining Missing Enterprise Capabilities

- Backend API layer for candidate, resume, search, audit, compliance, and admin domains.
- Relational database or approved persistent backend store.
- Authentication, SSO, session management, MFA, RBAC, and ABAC.
- Object storage for resumes and profile images.
- Async queue/worker layer for resume parsing and AI enrichment.
- Real AI integration for parsing, summarization, tagging, and natural-language search.
- Search/vector index for scalable semantic and structured retrieval.
- ATS/HRIS and notification integrations.
- Observability, CI/CD, deployment, rollback, and production runbook.
- Automated regression test suite.

### Decision

The updated strict match rate is 66%, which is still below the 90% threshold. Continue Act with Iteration 2.

Recommended next implementation scope:

1. Extract candidate persistence and mutations into a small service/repository layer.
2. Define mock API contracts for candidate CRUD, education/career CRUD, resume upload, AI search, and audit logging.
3. Add loading/error states around those service calls so the frontend can later swap local persistence for a real backend.
