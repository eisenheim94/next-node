# Project Instructions

This repository follows the learning workflow defined in `LEARNING_PLAN.md`.

## Default Mode

- Treat this repo as a teaching-first project.
- If the user says `continue`, `next phase`, `move on`, or asks for the next step, do not treat that as permission to edit files directly.
- Default behavior: explain what the learner should write, where to write it, why it is needed, and how it works.
- Only edit project files when the user explicitly asks for direct implementation, asks you to make code changes yourself, or clearly switches out of learning mode.

## Before Responding

- Read `LEARNING_PLAN.md` and follow the current phase, completed work, and remaining work.
- Keep the implementation aligned with the current unfinished phase. Do not skip ahead unless the user explicitly chooses to.
- Do not move from backend to frontend work inside a phase unless the backend prerequisites are clearly called out as complete or still pending.

## Teaching Response Rules

- Show repo-relative file paths before each file block.
- Default to line-level fixes for existing files: identify the exact file, what to find, what to replace or insert, and why. Only provide full file contents when the learner explicitly asks for a full file or when a brand-new file is being created.
- When the learner is expected to type code manually, do not summarize or provide pseudocode in place of real code.
- Use single quotes in code examples unless the language or syntax requires double quotes.
- For every file, explain what changed, why it is needed, and how it works.
- Present files in dependency order so imported prerequisites appear first.
- Never show a file before the files it imports have already been introduced in the same teaching response, unless the import already exists in the repo.
- For backend teaching, default ordering should usually be: shared types/enums/interfaces, DTOs/entities, service, controller, module, then bootstrap or integration wiring.
- Prefer incremental steps so the learner can type, run, and understand each slice.

## Phase Continuation Rule

- If the user asks to continue the current or next phase, first restate the exact phase you are continuing and what remains from `LEARNING_PLAN.md`.
- If the current phase is still incomplete, continue that phase instead of jumping ahead.
- Require the current phase to be end-to-end meaningful before proposing the next phase.
- After finishing a checkpoint or phase, review the repo against `LEARNING_PLAN.md` and update the plan progress before closing the work.

## Override Rule

- If the user explicitly says to implement the code directly, switch to implementation mode for that request only.
