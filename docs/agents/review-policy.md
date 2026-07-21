# Cross Review Policy

Use this policy for material code changes, UI/UX modifications, real-time data processing, BLE/watch communication, audio/breathing strategy logic, and Android app development.

## Review Levels

- Small docs-only or low-risk cleanup: self-review plus build verification is enough.
- Focused code change in a single module (e.g., audio strategy, trajectory logic, UI component): one independent reviewer checks correctness, tests, and edge cases.
- Major feature, real-time data pipeline change, BLE/watch communication, state machine modification, or user-visible behavior change: use two independent review passes before merge.
- Release or demo-ready candidate: run final verification after review feedback is resolved.

## Review Roles

- Implementer: writes the code, tests, and notes the intended behavior.
- Correctness reviewer: checks bugs, edge cases, error handling, state transitions, timing logic, and whether the diff matches the requirement.
- Architecture reviewer: checks module boundaries, coupling, state management patterns, real-time data flow, UI/UX consistency, and compatibility with the product spec (`随心飞方案.docx` / `随心飞呼吸干预策略.md`).
- Final verifier: runs build commands, tests on demo, reviews unresolved findings, and gives the merge recommendation.

## Cross-Model Review

Prefer different models or agent implementations for independent review passes when the current environment supports them.

Default routing:

- Codex: implementation self-check, git diff inspection, test and verification coordination.
- ZCode or another independent reviewer: correctness review for algorithm logic, state machines, data pipelines.
- Claude, Gemini, or another external model: architecture or adversarial review when those tools are available and the user explicitly requests them.

If different model tooling is not available, still keep the passes independent by using separate reviewer prompts that include only the requirements, relevant docs, and git diff. Do not rely on the implementer's chat history as review evidence.

## Domain-Specific Review Focus

Free_flight involves real-time biofeedback with strict timing and state management. Reviewers must pay extra attention to:

1. **State machine correctness**: emotion states (疲倦/平静/满足/高兴/兴奋/紧张/焦虑/沮丧) map to 4 feedback intervals; verify all transitions and edge cases.
2. **Timing accuracy**: the 30s initial collection → 1min update cadence pipeline must be correct; `30s, 1m30s, 2m30s, 3m30s, 4m30s` update nodes.
3. **Watch disconnect handling**: when watch disconnects or is removed, the system must gracefully fall back to no-watch mode with correct UI indicators.
4. **Audio crossfade**: 3-second fade-in/fade-out between emotion audio tracks; verify no audio gaps, clicks, or overlapping issues.
5. **Trajectory pool logic**: FIFO + random selection with 120s cooldown; verify selection fairness and edge cases when pool is exhausted.
6. **Breathing exercise triggers**: day mode (均等呼吸) vs night mode (4-7-8 breathing) trigger conditions must match the product spec exactly.
7. **No-watch mode fallback**: special trajectory pool, 50% probability per minute, "建议可穿戴设备" prompt, and "手表断开" icon behavior.

## Required Inputs

Each review request should include:

- A short description of what changed.
- The requirement, plan, issue, or handoff being implemented.
- The base and head git SHAs, or an explicit list of changed files when SHAs are not available.
- The build/run verification results (Android build for `android_app/`, Web demo for `fly_demo/`).
- Known risks, skipped tests, or intentional deviations from the plan.

## Severity

- Critical: must fix before merge. Includes broken functionality, crashes, data loss, state machine deadlock, timing corruption, watch data loss, or tests that should pass but fail.
- Important: should fix before proceeding unless a human explicitly accepts the risk. Includes missing error handling, weak state transition guards, UI inconsistency with spec, or meaningful test gaps.
- Minor: can be deferred. Includes style, small documentation polish, or low-risk cleanup.

## Merge Rule

A change is merge-ready only when:

- No Critical findings remain.
- Important findings are fixed or explicitly deferred with a reason.
- Required tests and build verification pass, or failures are documented as unrelated.
- The final verifier states `Ready to merge: Yes` or `Ready to merge: With accepted deferrals`.

## Output Format

Reviewers should report:

- Strengths.
- Critical findings.
- Important findings.
- Minor findings.
- Verification gaps.
- Merge assessment.

Each finding should include a file and line reference when possible, explain why it matters, and suggest the smallest practical fix.
