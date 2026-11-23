---
title: 'Responsive Scattered Shape Board'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current game groups shapes and silhouettes into separate rows, includes more visible text than needed, and does not use the play area as a scattered matching board. The correct sound is not perceived clearly, and the user reports no audible cue for an incorrect match.

**Approach:** Use a responsive playfield for common phone, tablet, and desktop sizes (320 CSS pixels and wider), with no horizontal overflow, at least 48-pixel touch targets, and vertical scrolling rather than clipping on short screens. Scatter the five shapes and five silhouettes in non-overlapping random positions each round while preserving tap-to-select/place and existing match rules. Reduce visible copy to a concise title, visual progress, and an icon-only replay control with an accessible name. Play a joyful chime for correct matches and a clearly distinguishable, gentle error sound for incorrect matches; feedback failures must not block play.

</frozen-after-approval>

## Implementation Notes

- Mixed the five shapes and five silhouettes into a shuffled board order; each occupies a unique responsive grid cell.
- Reduced visible copy to the title, progress dots, and an accessible icon-only replay button; retained screen-reader status and 48-pixel minimum touch targets.
- Replaced the two-tone/one-tone feedback with a rising three-note success chime and a distinct descending two-note mismatch cue.
- Updated `src/App.tsx`, `src/App.css`, `src/game/shapeMatching.ts`, and their focused tests.
- Verification passed: 15 tests and production type-check/build. VS Code integrated browser (Chrome 150.0.7871.250, Electron 43.8.6) checks at 320x568, 390x844, 768x1024, 1440x900, and 568x320 found 10 unique in-bounds positions, no horizontal overflow, and minimum button widths of 48, 48, 61.44, 88, and 48 CSS pixels respectively. Correct/mismatch interactions were exercised in-browser.

## Review Triage Log

- `medium` — Patched: mismatch outcome is now announced through the live status region and covered by the App interaction test.
- `low` — Rejected: the mismatch already clears the selected-shape highlight while leaving the target unmatched; a separate animation or visible error copy is optional and outside this audio-focused change.
- `medium` — Patched: darkened progress-dot colors for at least 4.6:1 contrast against the base background.
- `medium` — Patched: keyboard interaction test now activates board choices and replay with Tab/Enter rather than mouse clicks.
- `medium` — Patched: feedback tests cover successful resume from a suspended audio context and a rejected resume.
- `low` — Patched: browser version, viewport sizes, measured target widths, and position/overflow results are recorded above for reproducibility.
