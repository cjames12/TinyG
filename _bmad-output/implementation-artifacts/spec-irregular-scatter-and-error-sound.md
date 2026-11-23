---
title: 'Irregular Scatter and Error Sound'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current 5-by-2 board still aligns shapes and silhouettes in rows and columns. The selected shape has a visible border, and the mismatch cue sounds too much like a gentle tone rather than an error.

**Approach:** Scatter all ten pieces at irregular two-dimensional positions across the responsive playfield, with no shared horizontal or vertical alignments, overlap, or clipping; keep each round's layout stable while it reflows with screen size. Elevate the selected shape without a selection border or background treatment, retaining the keyboard focus indicator. Replace the mismatch cue with a short, clearly recognizable, child-appropriate buzzer sound distinct from the correct-match chime, while preserving matching behavior and best-effort vibration.

</frozen-after-approval>

## Implementation Notes

- The randomized layout, selected-state styling, and distinct square-wave mismatch buzzer were already implemented. Browser verification exposed clipping at short landscape heights; `src/App.css` now compacts app/header padding and allows the playfield to shrink at heights up to 360px without reducing 48px targets.
- Existing focused tests cover distinct scatter coordinates, safe fallback positions, match behavior, feedback dispatch, buzzer/chime waveforms, and keyboard focus. Matching and best-effort vibration remain unchanged.
- Verification passed: all 16 tests and the production type-check/build. Browser checks at 320x568, 390x844, 768x1024, 1440x900, 568x320, and 320x320 confirmed ten unique x/y positions, stable positions across resizing, no overlap/clipping/horizontal overflow, and targets of at least 48px. Short-height layouts were repeated 30 times at both 568x320 and 320x320.

## Review Triage Log

- medium — patched: carried; at 568x320, a target was clipped before the short-height layout adjustment; compacted app/header padding and set the playfield minimum height to zero, then verified 30 layouts each at 568x320 and 320x320 with no clipped targets.
- medium — defer: replay starts a fresh round without clearing `feedbackAnnouncement`, so assistive technology can hear the previous round's final match announcement.
- medium — defer: the replay button disappears after activation without explicitly returning keyboard focus to a game control.
- medium — defer: matching disables the active source/target buttons without explicitly moving keyboard focus to another active control.
- low — defer: tapping a silhouette before selecting a shape produces no status feedback, leaving the player uncertain why nothing happened.
- false — rejected: visible “Play again” text conflicts with the earlier approved icon-only replay control and accessible-name requirement.
- false — rejected: the layout is randomized rather than row/column based, and every position has distinct x/y coordinates; the finding assumes an undefined minimum offset for incidental near-alignments.
- medium — rejected as out of scope: overlap can occur below 320 CSS pixels, but the prior approved responsive intent sets the supported minimum at 320 CSS pixels; tested supported widths have no overlap.
- low — defer: `selectShape` and `attemptMatch` can accept a catalog shape absent from the round when called directly, although the UI only supplies shapes from the current board.
- medium — defer: the edge-case review independently identified the stale replay announcement; it has the same pre-existing cause and route as the first replay-status finding.
- false — rejected: the lack of an automated browser test does not leave this change unverified; manual browser checks measured layout at six viewports, including repeated short-height runs, and the project has no browser-test harness.
