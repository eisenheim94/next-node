# Full-Stack Learning Project: Real-Time Issue Tracker

## Summary
Build a small but realistic team issue tracker: users can register/login, create projects, manage issues, assign users, change status/priority, comment, view analytics, receive real-time updates, and finish with end-to-end browser tests.

This project naturally covers:
- Next.js + TypeScript + Tailwind + shadcn/ui
- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT auth + refresh tokens + roles
- REST + Swagger
- Redux Toolkit + TanStack Query
- RabbitMQ
- WebSockets
- Chart.js
- Playwright at the end, once the app is feature-complete

We will start with plain `fetch`, move to stronger frontend state architecture later, and leave WebSockets, charts, and Playwright for the final stages.

## Teaching Workflow
- Default learning mode: the learner writes all implementation code manually. The assistant should explain exactly what to write, where to write it, and why, but should not edit project files unless the learner explicitly asks for direct code changes.
- Important: when the learner is expected to write a file, the assistant should show the full code for that file in chat. Do not give only summaries, pseudocode, or high-level implementation descriptions when the learner needs to type the file manually.
- Code style rule for all teaching responses: use single quotes in code examples, but use double quotes for JSX attributes.
- File instruction rule for all teaching responses: always show the file path for every file the learner needs to create or update before showing the code.
- Path format rule for all teaching responses: always show repo-relative paths, not absolute filesystem paths.
- Explanation rule for all teaching responses: for every file the learner creates or updates, explain what was added or changed, why it is needed, and how it works either immediately before or immediately after the file code.
- Progress tracking rule: after finishing a meaningful checkpoint or a phase, explicitly review the repo state against the plan and update this file so phase status and completed/remaining items stay current.
- Each phase should be covered as a complete implementation slice, not partially. If a phase needs backend, frontend, infrastructure, validation, or tests to be meaningfully usable, the teaching messages should cover the whole slice before moving on.
- Do not jump from unfinished backend work to frontend implementation unless the message explicitly says the backend is still a prerequisite and names the missing files or routes.
- Explanations should describe what to write, where to write it, how it works, and why the design is chosen.
- When giving implementation help, prefer incremental steps over dropping a finished solution. The learner should have a chance to type, run, and understand each step before moving on.
- Starting in later phases, some checkpoints should shift into learner-led implementation: you try the code first, then the reference solution can be shown in a collapsible section.

## Implementation Phases

### Phase 0: Foundations and architecture
Status: Completed

Set up frontend, backend, PostgreSQL, RabbitMQ, and the initial project structure.

Focus:
- Next/Nest architecture
- deep TypeScript foundations
- module boundaries
- Dockerized local environment

Quiz:
- architecture and TypeScript fundamentals

### Phase 1: Database design and first CRUD
Status: Completed
Completed:
- backend entities and TypeScript foundations for `User`, `Project`, and `Issue`
- backend DTO design for projects
- Phase 1 backend CRUD teaching flow and quiz
- backend CRUD endpoints for `User`, `Project`, and `Issue`
- Phase 1 frontend pages using manual `fetch`
- backend and frontend wired end to end for the first CRUD slice

Implement:
- `User`
- `Project`
- `Issue`

Focus:
- TypeORM entities and relations
- DTOs, enums, interfaces, validation
- first complete REST endpoints
- first frontend pages using manual `fetch`
- backend and frontend wired end to end before Phase 2 begins
- assistant acts as an instructor for this phase and should not directly implement the files unless explicitly asked to switch out of learning mode

Quiz:
- relations, DTOs, enum usage, CRUD flow

### Phase 2: Auth, refresh tokens, roles, protected routes
Status: Completed

Completed:
- register, login, logout, and refresh token backend flows
- typed JWT payload and auth response/token contracts
- JWT auth guard and role-based backend protection
- protected frontend auth flow with login/register pages and route guarding

Implement:
- register/login/logout
- JWT access + refresh tokens
- role-based access
- protected frontend/backend flows

Focus:
- typed JWT payloads
- auth guards
- authenticated request flow

Quiz:
- auth architecture and security flow

### Phase 3: Better REST design and reusable frontend API layer
Status: Completed

Add:
- pagination
- filtering
- sorting
- comments
- standardized errors
- typed API client around `fetch`
- TypeORM migrations setup for ongoing schema changes

Focus:
- generics
- query DTOs
- reusable request/response contracts
- Swagger as API contract
- migration workflow and schema evolution without `synchronize`

Completed:
- issue pagination, filtering, and sorting contracts
- standardized backend error shape and frontend error parsing
- typed paginated frontend API contracts for issues
- initial comments backend/frontend workflow
- TypeORM migration tooling and baseline migration strategy
- Phase 3 frontend issue experience with filters/pagination UI polish

Quiz:
- API design, generics, pagination/filtering

### Phase 4: State management properly
Status: Completed

Introduce:
- TanStack Query for server state
- Redux Toolkit for client/UI state

Focus:
- query caching and invalidation
- mutations
- slice design
- typed action payloads
- server state vs client state

Completed:
- shadcn/ui refactor for `projects`, `issues`, and `users` pages with modal-based create flows for the existing project/issue actions
- responsive entity card-grid layout for the main protected CRUD pages
- skeleton loading states for the `issues`, `projects`, and `users` list pages
- TanStack Query hooks and mutations for core server data flows with cache invalidation
- Redux Toolkit slices for client/UI state (issue filters and related controls)
- boundary hardening updates: users query ownership cleanup, issue-page loading consistency, mutation pending state sourced from TanStack Query

Quiz:
- when to use TanStack Query vs Redux

### Phase 5: RabbitMQ and asynchronous workflows
Implement:
- issue-created/status-changed events
- audit trail / notification processing
- async consumers

Focus:
- producers/consumers
- typed event payloads
- message-driven architecture

Quiz:
- async flow, retries, event design

### Phase 6: PostgreSQL performance and Redis caching
Implement:
- PostgreSQL indexes for real query patterns
- basic query analysis with `EXPLAIN`
- Redis cache for selected read-heavy endpoints
- cache invalidation after related mutations

Focus:
- B-tree, composite, and partial index selection
- tradeoffs between read performance and write cost
- cache-aside strategy
- TTL and invalidation design
- deciding what belongs in the database layer vs the cache layer

Quiz:
- when to add an index
- how composite index order affects query performance
- when Redis helps and when it adds unnecessary complexity
- how to keep cached data consistent enough for the product

### Phase 7: WebSockets for real-time collaboration
Implement:
- live issue updates
- live comments
- activity feed
- authenticated socket connections

Focus:
- Nest gateways
- room/subscription model
- sockets complementing REST, not replacing it

Quiz:
- real-time architecture and consistency concerns

### Phase 8: Dashboard analytics with Chart.js
Implement:
- issues by status
- issues by priority
- trend charts over time
- throughput/completion views

Focus:
- aggregation endpoints
- typed chart adapters
- backend vs frontend transformation responsibilities

Quiz:
- analytics endpoint design and chart data modeling

### Phase 9: Playwright end-to-end testing
Add browser-level tests after the application is fully built.

Test scope:
- register/login/logout
- protected route behavior
- create/edit/delete issue flows
- filtering/search flows
- role-based access scenarios
- comment workflow
- real-time update smoke checks where practical
- dashboard load/render checks

Focus:
- test architecture
- selectors and stable test design
- test fixtures and seeded data
- avoiding flaky async tests
- deciding what belongs in Playwright vs unit/integration tests

Why last:
- Playwright is most valuable once the main user journeys are stable
- otherwise you spend time constantly rewriting brittle tests while the app is still changing

Quiz:
- E2E vs integration vs unit testing
- when to mock vs hit real services
- common causes of flaky tests
- how to choose critical user journeys

## Public Interfaces and Type Boundaries
We should keep these explicit through the whole project:
- REST DTOs for auth, projects, issues, comments, analytics
- enums or literal unions for roles, issue status, issue priority
- paginated response shape
- error response shape
- JWT payload type
- RabbitMQ event payload interfaces
- WebSocket event payload interfaces
- Playwright fixture/test data contracts where useful

Rule across all phases:
- prefer explicit domain types over anonymous object shapes
- use classes where Nest requires runtime metadata
- use interfaces/types for contracts and composition
- use enums or literal unions intentionally

## Test Plan and Learning Validation
After every phase we include:
- a short quiz
- a "why this architecture?" recap
- a "TypeScript deep dive" for the types used in that phase
- a practical checkpoint where you explain the flow back in your own words

Later-phase teaching mode:
- some phases should include a "try it yourself first" checkpoint
- the full reference solution can be hidden under a collapsible section so you can attempt the implementation before revealing it

Testing progression:
- early phases: Swagger/manual verification
- middle phases: backend unit and e2e tests
- final phase: Playwright end-to-end coverage for critical user journeys

## Assumptions and Defaults
- Frontend: Next.js with TypeScript
- Backend: NestJS with TypeScript
- Styling/UI: Tailwind + shadcn/ui
- Database: PostgreSQL
- ORM: TypeORM
- Messaging: RabbitMQ
- API style: REST first, sockets later
- Auth: JWT access token + refresh token + roles
- Early data fetching: manual `fetch`
- Later data architecture: TanStack Query + Redux Toolkit
- WebSockets, Chart.js, and Playwright are intentionally late phases
