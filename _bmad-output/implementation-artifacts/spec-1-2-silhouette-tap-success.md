---
title: 'Silhouette Tap Detection & Success Feedback Animation'
type: 'feature'
created: '2026-11-20'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Silhouette tap detection exists in game logic but success feedback is incomplete: shape snap animation to silhouette position is missing, and audio/vibration callbacks are not wired to the game loop.

**Approach:** Implement smooth shape-to-silhouette snap animation (0.3–0.5s, cubic-bezier easing), wire success feedback callbacks (sound + vibration triggers), ensure tap-to-feedback latency <100ms.

## Boundaries & Constraints

**Always:**
- Animation duration: 0.3–0.5s (cubic-bezier(0.25, 0.46, 0.45, 0.94) easing)
- Tap-to-feedback latency <100ms (render first visual, trigger sound/vibration in parallel)
- Shape remains locked in silhouette position after animation (not returnable)
- Success sound and vibration trigger from Epic 5 (wire callbacks, don't implement audio/haptic here)
- Only animate matched shapes (no animation for mismatches)
- Touch targets remain ≥48 CSS pixels during animation
- 60 FPS animation (GPU-accelerated transforms)

**Never:**
- Do not change match detection logic (already working)
- Do not implement audio/vibration directly (Epic 5 scope)
- Do not add animation delay to initial feedback (must be instant)
- Do not break mismatch flow (Story 1.3 handles that)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Successful match | Shape selected, silhouette tapped, shapes match | Shape animates to silhouette position (0.3–0.5s), remains locked, success callbacks fire | N/A |
| Rapid silhouette taps | Shape selected, user taps same silhouette twice quickly | Only first match processes; second tap ignored (shape already locked) | Tap handlers ignore already-matched shapes |
| Tap while animating | Silhouette tapped while previous match animation is in progress | Queued tap ignored; first animation completes uninterrupted | No action on locked shapes |
| Shape fading on match | After successful match, shape at origin fades | Fade triggers after snap animation completes (Story 2.5 scope, but animation must not interfere) | CSS transition on matched state |

## Code Map

- `src/game/shapeMatching.ts` -- Match detection logic (working, no changes) + result types
- `src/App.tsx` -- Silhouette button tap handler (wire success callbacks here)
- `src/game/feedback.ts` -- `playFeedback('correct')` function (call after animation starts)
- `src/App.css` -- Add matched state animation for shape snap
- Component state -- Track animation state to prevent re-entry during animation

## Tasks & Acceptance

**Execution:**

- [ ] `src/App.css` -- Add `.shape-button.is-matched` animation rule: position → silhouette position, 0.3–0.5s, cubic-bezier easing
- [ ] `src/App.tsx` -- Modify `handleTargetTap()` to: (1) calculate silhouette position, (2) trigger snap animation, (3) fire success callbacks (`playFeedback`, `vibrateForSuccess`)
- [ ] `src/App.tsx` -- Add callback wiring for success sound (from Epic 5 `playFeedback` call)
- [ ] `src/App.tsx` -- Add callback wiring for success vibration (call `vibrateForSuccess` after match)
- [ ] Verify tap-to-feedback latency <100ms (render snapshot, measure to first audio/vibration trigger)

**Acceptance Criteria:**

- Given a shape is selected and a silhouette is visible
- When the child taps a silhouette that matches the selected shape
- Then the shape animates smoothly to the silhouette position (0.3–0.5s, cubic-bezier easing)
- And a success sound plays (cheerful, 0.5–1s duration)
- And the device vibrates (100–150ms, medium intensity)
- And tap-to-feedback latency is <100ms
- And the shape remains locked in the silhouette position (not returnable)
- And all 16+ tests pass with no regressions

## Implementation Notes

(Append-only during implementation)

</frozen-after-approval>
