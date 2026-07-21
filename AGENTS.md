# AGENTS.md

Multi-agent working contract. **Read this first, every session, every agent.**

## Workspace permission rule

The user grants agents permission to perform any necessary read/write/build/git operations inside `D:\WorkSpace\Free_flight`. Operations outside this repository must ask the user for explicit permission first.

If the sandbox blocks an in-repository operation, the agent should request escalation for that exact operation. If build or demo verification still fails, stop and tell the user.

## Required reading

1. `README.md` — product background, state definitions, and data pipeline.
2. `CONTEXT.md` — project glossary and domain vocabulary.
3. `随心飞方案.docx` — full product specification (reference, not parsed).
4. `随心飞呼吸干预策略.md` — breathing exercise strategy details.
5. If you are picking up a specific plan that already has a handoff doc, read it too: `docs/handoffs/*.md`.

## Agent skills

### Issue tracker

Issues and PRDs for this repo are tracked as local markdown under `.scratch/`; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The repo uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: read root `CONTEXT.md` first, then relevant docs under `docs/`. See `docs/agents/domain.md`.

### Cross review policy

Material code changes, UI/UX modifications, state machine logic, and real-time data pipeline changes should use role-separated review before merge. Pay extra attention to: state transitions, timing accuracy, watch disconnect handling, audio crossfade, trajectory pool logic, and breathing exercise triggers. See `docs/agents/review-policy.md`.

## Per-agent focus

| Agent | Reads | Writes | Does not touch |
| --- | --- | --- | --- |
| Codex | `README.md`, `CONTEXT.md`, spec docs | `docs/`, `NEXT_STEPS.md`, plans | source code |
| ZCode | `README.md`, spec docs, `CONTEXT.md` | source code, `docs/handoffs/`, review findings | external dependencies (`D:\workspace\smart_band`, `D:\workspace\air_ionizer`) without explicit user approval |
| Claude / external | spec docs, review-policy.md | architecture review, adversarial review | source code (read-only reviewer) |

## Module ownership

| Domain | Directory | Notes |
| --- | --- | --- |
| Web demo | `fly_demo/` | Visual verification only; not for production |
| Android app | `android_app/` | Planned main development target after demo verification |
| Product spec | `随心飞方案.docx` | Authoritative product document |
| Breathing strategy | `随心飞呼吸干预策略.md` | Reference for breathing exercise logic |

## Build verification

Before committing any change:

- For `fly_demo/`: verify the web demo loads and runs correctly in a browser.
- For `android_app/`: verify the Android project builds and runs on device/emulator.

## Conflict resolution

- UI/UX changes → verify against product spec before implementing.
- State machine changes → discuss in `NEXT_STEPS.md` before implementing.
- Code → `feature/*` branches.
- Docs → `main` directly.
- Disagreement on design → `NEXT_STEPS.md` "Open Questions"; humans decide.
- Deviation from product spec → must be documented with reason.
