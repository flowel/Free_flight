# Domain Docs

This repo uses a single domain context.

## Before Exploring

Read these files before planning or editing:

- `CONTEXT.md` at the repo root.
- `README.md` for product background, state lists, and data pipeline description.
- `随心飞方案.docx` for the full development specification.
- `随心飞呼吸干预策略.md` for breathing exercise strategy details.
- Relevant handoff docs under `docs/handoffs/` when the task belongs to an active or recently closed scope.
- Relevant plans or specs under `docs/superpowers/plans/` when continuing planned work.

If an optional file or directory does not exist, proceed silently. Do not create domain docs just because they are missing; create or update them only when a real term, decision, or boundary needs to be recorded.

## Vocabulary

Use the terms defined in `CONTEXT.md` when naming issues, plans, tests, refactors, and review findings. If a task needs a concept that is not in the glossary, either reuse an existing term or note the gap for future domain modeling.

## Decision Records

If implementation or review output contradicts the product specification (`随心飞方案.docx`) or the breathing strategy document (`随心飞呼吸干预策略.md`), call out the conflict explicitly and ask for a human decision before overwriting the decision in code.

## Module Boundaries

| Module | Type | Role |
| --- | --- | --- |
| `fly_demo/` | Web demo (HTML/JS) | Visual verification of page layout, flight trajectories, audio playback, and breathing prompts; not for production delivery |
| `android_app/` | Android app (Kotlin/Java) | Production Android client; planned as the main development target after demo verification |
