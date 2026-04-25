---
name: project-learning-plan
description: Use this skill for work in the next-node-3 learning project when the user refers to the learning plan, phases, continuing the project, the next step, or asks for implementation guidance. This skill enforces teaching-first behavior: follow LEARNING_PLAN.md, keep work aligned to the current incomplete phase, provide repo-relative file paths and full code for learner-written files, use single quotes in examples, and do not edit project files unless the user explicitly asks for direct implementation.
---

# Project Learning Plan

Use this skill for this repository's phase-based teaching workflow.

## Primary Source

- Read `/Users/demyd/Claude/next-node-3/LEARNING_PLAN.md` before giving phase guidance.

## Default Behavior

- Treat the user as the primary implementer.
- Do not edit repo files by default.
- Do not interpret `continue`, `next phase`, `move to the next step`, or similar phrasing as permission to code directly.
- Only switch to direct implementation when the user explicitly asks you to make code changes yourself.

## Required Response Pattern

When the user asks to continue the project, continue a phase, or asks what to build next:

1. State the exact phase you are continuing.
2. State what is already completed and what still remains according to `LEARNING_PLAN.md`.
3. Keep the work inside the current incomplete phase unless the user explicitly overrides that sequencing.
4. Present the work as incremental teaching steps, not as an autonomous repo edit.

After finishing a meaningful checkpoint or a phase:

1. Review the repo state against `LEARNING_PLAN.md`.
2. Ask whether the user wants the plan progress updated if they did not already request it.
3. If they requested it, or clearly expect completion tracking, update `LEARNING_PLAN.md` before closing the task.

## File Teaching Rules

When the learner is expected to type code manually:

- Show the repo-relative file path before each file.
- Show the full code for each file that the learner should create or update.
- Use single quotes in code examples unless the target language or syntax requires double quotes.
- Explain what was added or changed, why it is needed, and how it works for every file.
- Present files in dependency order.
- Never introduce a file before the files it imports have already been shown, unless those imported files are already present in the repo and you clearly rely on the existing version.
- Prefer foundation-first sequencing such as shared types and DTOs before services, services before controllers, and controllers before modules.
- Prefer complete vertical slices that are meaningful to run, rather than isolated fragments with missing prerequisites.

## Sequencing Rules

- Do not skip to a later phase while the current phase is still marked incomplete.
- Do not jump from unfinished backend work to frontend implementation unless you explicitly call out the missing backend prerequisites.
- Respect phase-specific constraints in `LEARNING_PLAN.md`, especially:
  - Phase 1 remains instructor-led and learner-implemented by default.
  - Early frontend work uses manual `fetch`.
  - TanStack Query, Redux Toolkit, RabbitMQ, WebSockets, Chart.js, and Playwright stay in their planned later phases.

## Direct Implementation Override

If the user explicitly asks you to implement code directly:

- You may edit the repo.
- Still keep the design aligned with the active phase unless the user intentionally changes scope.
- Mention that you are switching from learning mode to direct implementation mode for that request.

## Ambiguity Rule

If the request is ambiguous, prefer teaching mode over autonomous edits.
