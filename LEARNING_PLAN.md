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
- Each phase should be covered as a complete implementation slice, not partially. If a phase needs backend, frontend, infrastructure, validation, or tests to be meaningfully usable, the teaching messages should cover the whole slice before moving on.
- Do not jump from unfinished backend work to frontend implementation unless the message explicitly says the backend is still a prerequisite and names the missing files or routes.
- Explanations should describe what to write, where to write it, how it works, and why the design is chosen.
- Starting in later phases, some checkpoints should shift into learner-led implementation: you try the code first, then the reference solution can be shown in a collapsible section.

## Implementation Phases

### Phase 0: Foundations and architecture
Set up frontend, backend, PostgreSQL, RabbitMQ, and the initial project structure.

Focus:
- Next/Nest architecture
- deep TypeScript foundations
- module boundaries
- Dockerized local environment

Quiz:
- architecture and TypeScript fundamentals

### Phase 1: Database design and first CRUD
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

Quiz:
- relations, DTOs, enum usage, CRUD flow

### Phase 2: Auth, refresh tokens, roles, protected routes
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
Add:
- pagination
- filtering
- sorting
- comments
- standardized errors
- typed API client around `fetch`

Focus:
- generics
- query DTOs
- reusable request/response contracts
- Swagger as API contract

Quiz:
- API design, generics, pagination/filtering

### Phase 4: State management properly
Introduce:
- TanStack Query for server state
- Redux Toolkit for client/UI state

Focus:
- query caching and invalidation
- mutations
- slice design
- typed action payloads
- server state vs client state

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

### Phase 6: WebSockets for real-time collaboration
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

### Phase 7: Dashboard analytics with Chart.js
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

### Phase 8: Playwright end-to-end testing
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
