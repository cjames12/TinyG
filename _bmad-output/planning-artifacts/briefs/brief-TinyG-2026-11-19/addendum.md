# Product Brief Addendum

## Technical Direction

- **Stack:** React + Vite + TypeScript for the initial shape-matching game. This choice is revisitable if product direction changes (e.g., expanding to native mobile).

## Phase 1 & Phase 2 Roadmap

- **Phase 1 (Shipping within 4 hours from 2026-11-20 11:56):**
  - Implement variable shape count (6-8 per round, not fixed 5)
  - Add visual feedback: faded/cleared origin when shape is matched
  - Validate interaction loop, touch targets, sound/vibration feedback

- **Phase 2 (Post-Phase 1):**
  - Celebration animations: sparkling or confetti on successful match
  - Character design: Shapes evolve to emoji-like figures with eyes, blinking, facial expressions
  - Performance profiling to ensure animations do not degrade on lower-end devices

## Implementation Notes

- Selection animation treatment: Keep flexible; visual selection cue is required, exact animation is an implementation detail
- Touch target minimum: 48 CSS pixels (accessibility + small-hand usability)
- Match locking: Once matched, shape stays in place until round end
- Round flow: After all 5 shapes matched, next round auto-starts with new 6-8 random shapes
- Mismatch behavior: Vibration + sound; shape snaps back to origin; child can immediately retry
