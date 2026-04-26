# Issue Tracker Learning Project

This repository is a personal learning project for building a Node.js backend from scratch with the stack defined in [LEARNING_PLAN.md](/Users/demyd/Claude/next-node-3/LEARNING_PLAN.md), while also refreshing my Next.js and Redux knowledge in practice.

About 95% of the code in this project is written manually by me. AI is used mainly to help define the learning path, suggest the next steps, and provide example implementations of how specific pieces can be written.

The whole design direction and UX improvements are also done by me.

## Goals

- Learn how to build a production-style Node.js backend from scratch
- Practice backend architecture, auth, database design, validation, and API design
- Refresh frontend skills with Next.js, Redux Toolkit, and modern React patterns
- Build the project phase by phase instead of skipping straight to a finished template

## Current Status

`LEARNING_PLAN.md` currently shows Phases 0-4 as completed, and the codebase matches that state. Phase 4 is completed: TanStack Query and Redux Toolkit are both implemented and in use.

## Stack

### Backend

- `[x]` Node.js
- `[x]` TypeScript
- `[x]` NestJS
- `[x]` PostgreSQL
- `[x]` TypeORM
- `[x]` DTO validation with `class-validator`
- `[x]` JWT auth
- `[x]` Refresh tokens
- `[x]` Role-based access control
- `[x]` REST API
- `[x]` Swagger
- `[x]` TypeORM migrations
- `[ ]` RabbitMQ event workflows
- `[ ]` WebSockets

### Frontend

- `[x]` Next.js
- `[x]` React
- `[x]` TypeScript
- `[x]` Tailwind CSS
- `[x]` shadcn/ui
- `[x]` Manual `fetch` API layer
- `[x]` TanStack Query
- `[x]` Redux Toolkit
- `[x]` React Redux
- `[x]` React Hook Form
- `[x]` Zod
- `[x]` Pagination, filtering, and sorting
- `[x]` Comments flow
- `[ ]` Chart.js analytics dashboards
- `[ ]` Playwright end-to-end tests

### Infrastructure and Workspace

- `[x]` Docker Compose
- `[x]` PostgreSQL local container
- `[x]` RabbitMQ local container
- `[x]` Monorepo with `apps/frontend` and `apps/backend`

## Learning Phases

- `[x]` Phase 0: Foundations and architecture
- `[x]` Phase 1: Database design and first CRUD
- `[x]` Phase 2: Auth, refresh tokens, roles, protected routes
- `[x]` Phase 3: Better REST design and reusable frontend API layer
- `[x]` Phase 4: State management properly
- `[ ]` Phase 5: RabbitMQ and asynchronous workflows
- `[ ]` Phase 6: WebSockets for real-time collaboration
- `[ ]` Phase 7: Dashboard analytics with Chart.js
- `[ ]` Phase 8: Playwright end-to-end testing

## UX Notes

Some UX features already implemented in the project:

- Delete warnings that clearly say deleting a project or issue will also delete related child data
- Spinners on buttons that submit requests
- Dismissible issue filter badges
- Skeleton preloaders
- Pagination controls at both the top and bottom of the issues list

## Services

- Frontend: `apps/frontend`
- Backend: `apps/backend`
- PostgreSQL: `localhost:5433`
- RabbitMQ: `localhost:5672`
- RabbitMQ management UI: `http://localhost:15672`
- Swagger docs: `http://localhost:3001/api/docs`

## Quick Start

1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Run `docker compose up -d`
4. Run `npm run dev:backend`
5. Run `npm run dev:frontend`

## Learning Plan

The detailed roadmap and progress tracking live in [LEARNING_PLAN.md](/Users/demyd/Claude/next-node-3/LEARNING_PLAN.md).
