---
title: 'Shape Silhouette Sorter'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/planning-artifacts/briefs/brief-TinyG-2026-11-19/brief.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The user wants a simple, enjoyable web activity for their three-year-old daughter to play on a phone or tablet. They hope play can support development, but have not specified a learning outcome or measurable claim.

**Approach:** Build one touch-first shape-matching game. Each round presents five shapes and their matching silhouettes. The child taps a shape to select it, then taps its target. Correct matches stay in place; mismatches provide gentle audio and haptic feedback and clear the selection for an immediate retry. A completed round can be replayed with a fresh set of five shapes.

## Boundaries & Constraints

**Always:** Use React + Vite + TypeScript. Fit phone and tablet browser screens; use taps, not dragging; show which shape is selected; tapping another unmatched shape replaces the selection, and tapping the selected shape again clears it; matched shapes and silhouettes ignore taps; keep correct matches in place; allow retry after a mismatch; play a fun sound for a correct match and a gentle sound plus best-effort vibration for a mismatch; offer a new round only after all five pairs are matched.

**Never:** Add other games (including puzzles or coloring) in this feature; use timers, lives, or penalties; require accounts or collect personal data; make claims that the game produces a measured developmental benefit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Select a shape | No shape selected; child taps an unmatched shape | Shape receives a clear selected visual state | No external error state |
| Change selection | An unmatched shape is selected; child taps a different unmatched shape | The newly tapped shape becomes selected | Keep exactly one selected shape |
| Clear selection | An unmatched shape is selected; child taps it again | Selection clears and no pair changes | Board remains available |
| Tap a matched item | Child taps an already-matched shape or silhouette | Matched item stays locked; any current unmatched selection remains unchanged | Ignore the tap |
| Correct match | Shape selected; child taps its matching unmatched silhouette | Shape is shown in the silhouette, both are locked as matched, selection clears, and a fun sound is attempted | Audio failure does not delay or undo the match |
| Mismatch | Shape selected; child taps a different unmatched silhouette | Selected shape returns to its starting slot and selection clears; gentle sound and light vibration are attempted; child can retry immediately | Audio/vibration failures do not block reset or retry |
| Target tapped first | No shape selected; child taps an unmatched silhouette | Board remains unchanged and available for another tap | No error dialog or penalty |
| Round complete | All five pairs matched | Keep matched board visible; show a completion message and a new-round control | Completion remains visible if audio is unavailable |
| Replay | Child activates the control after completion | Start a round with five distinct shapes and a set different from the immediately preceding round | Shape catalog contains at least six entries |

</frozen-after-approval>

## Code Map

- No application source, package manifest, product-specific tests, or reusable UI components exist in the workspace.
- `_bmad-output/planning-artifacts/briefs/brief-TinyG-2026-11-19/brief.md` is an unfinished product-brief skeleton; it contains no additional requirements.
- `_bmad-output/planning-artifacts/briefs/brief-TinyG-2026-11-19/.memlog.md` records the user's product and interaction decisions.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `index.html`, `src/main.tsx` -- scaffold the agreed browser app and test/build scripts.
- [x] `src/game/shapeCatalog.ts`, `src/game/shapeMatching.ts` -- define at least six recognizable shapes and implement five-unique-shape round generation, selection, matching, and replay state.
- [x] `src/App.tsx`, `src/App.css` -- build the responsive, accessible touch-first board, selected/correct/mismatch/completion states, audio feedback, best-effort vibration, and replay control.
- [x] `src/game/shapeMatching.test.ts` -- cover selection changes and clearing, matched-item locking, correct/mismatched matches, completion, and distinct replay sets.
- [x] `src/game/feedback.ts`, `src/game/feedback.test.ts` -- implement and verify best-effort sound and vibration without blocking game state.
- [x] `src/App.test.tsx` -- verify feedback dispatch, keyboard selection, round completion, and replay through the rendered game.

**Acceptance Criteria:**
- Given a phone or tablet viewport at least 320 CSS pixels wide, when the board is shown, then all controls remain visible without horizontal scrolling and each interactive target is at least 48 by 48 CSS pixels.
- Given a keyboard or assistive-technology user, when they navigate the game, then shape and silhouette controls have accessible names and expose selected and matched states.

## Implementation Notes

- Created a React + Vite + TypeScript app with a nine-shape SVG catalog, randomized five-shape rounds, and a separately shuffled target row.
- Implemented tap selection/replacement/toggle, locked matches, retry after mismatch, a completion state, and replay with a different shape set.
- Added synthesized Web Audio feedback and best-effort vibration. Unsupported or failed feedback does not block matching; failures are logged.
- Added game-state, feedback, and App interaction tests. The production build and all 12 tests pass; `npm audit` reports no vulnerabilities.
- Browser verification at 320 CSS pixels confirmed no horizontal overflow, targets larger than 48 CSS pixels, keyboard selection, mismatch reset, completion, and distinct replay.
- The workspace has no Git repository; `baseline_commit` is recorded as `NO_VCS`.

## Spec Change Log

## Review Triage Log

| ID | Finding | Verdict | Evidence and route |
|---|---|---|---|
| BH-01 | Product brief executive summary is a placeholder | low | The product brief was deliberately paused when the user chose the one-game shortcut; the approved build spec contains the current game's intent. Defer brief completion. |
| BH-02 | Product brief problem statement is a placeholder | low | Same paused brief; no gap in the current game's build spec. Defer with BH-01. |
| BH-03 | Product brief solution section is a placeholder | low | Same paused brief; the game approach is captured in the approved build spec. Defer with BH-01. |
| BH-04 | Product brief audience section is a placeholder | low | Same paused brief; the current spec identifies the user's three-year-old daughter. Defer with BH-01. |
| BH-05 | Product brief success criteria are a placeholder | low | Same paused brief; product-level success measures are not needed to implement this one-game shortcut. Defer with BH-01. |
| BH-06 | Product brief scope section is a placeholder | low | Same paused brief; the current feature boundaries are explicit in the approved build spec. Defer with BH-01. |
| BH-07 | Product brief vision section is a placeholder | low | Same paused brief; broader vision was intentionally deferred. Defer with BH-01. |
| BH-08 | `createRound` does not validate an injected random function's range | false | The only application callers use the default `Math.random`; tests inject `0`, which is in range. No invalid RNG input is reachable from the game UI. |
| BH-09 | Randomness tests only use a constant-zero source | false | The replay test uses the same constant-zero source for both rounds, exercising the repeated-set replacement branch; the round test also verifies target order differs. |
| BH-10 | No UI test verifies App feedback dispatch, completion, or keyboard flow | medium | Helper tests alone did not exercise rendered behavior. Added `src/App.test.tsx` for feedback dispatch, keyboard selection, completion, replay, and retry state. Patch applied. |
| EC-01 | Audio resume/playback rejection may be unhandled | false | `context.resume().then(playTones).catch(warnAudioUnavailable)` handles rejected resume promises and errors thrown while creating tones. |
| VG-01 | No App-level test covers correct and mismatch feedback dispatch | medium | The verification gap was real and shared BH-10's root cause. Added `src/App.test.tsx`; rendered interaction tests now cover feedback dispatch, keyboard selection, completion, and replay. Patch applied. |

## Design Notes

Use concise, high-contrast shapes and an uncluttered layout suitable for a preschooler. Attempt sounds only from user-triggered actions; playback failures must not block game state. Ignore vibration failures. A different five-shape set is always possible when the catalog contains at least six entries.

## Verification

**Commands:**
- `npm test` -- expected: matching logic tests pass.
- `npm run build` -- expected: production build succeeds.
