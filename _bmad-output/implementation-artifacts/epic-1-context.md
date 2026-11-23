# Epic 1 Context: Shape Matching Interaction Core

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Child can select shapes, attempt matches, and receive immediate feedback (success/mismatch) with sound, vibration, and animation. This epic establishes the core interaction pattern that all subsequent epics (rounds, difficulty, polish) depend on. Success = tapping shapes feels instant and responsive, with clear visual and tactile rewards.

## Stories

- Story 1.1: Shape Selection & Visual Cue
- Story 1.2: Silhouette Tap Detection & Success Feedback
- Story 1.3: Mismatch Feedback & Recovery
- Story 1.4: Shape Deselection & Multi-Shape Selection
- Story 1.5: Interaction State Machine Implementation

## Requirements & Constraints

**Selection & Interaction (FRs 2, 3, 22, 34):**
- Selection visual cue must be instant (within 50ms, no animation delay)
- Selection persists until new shape selected or match attempted
- Only one shape selected at a time
- Visual cue is high-contrast for 4-year-olds (glow + scale-up or bright border recommended)
- Shape switching is smooth (no visual glitches)

**Success Match Feedback (FRs 5, 6, 7):**
- Shape snaps to silhouette position with smooth animation (0.3–0.5s, cubic-bezier easing recommended)
- Success sound plays (cheerful, 0.5–1s duration) — handled by Epic 5
- Device vibration triggers (100–150ms, medium intensity) — handled by Epic 5
- Tap-to-feedback latency must be <100ms
- Shape locks in place after successful match (not returnable)

**Mismatch Feedback (FRs 10–14):**
- Silhouette shakes/pulses for 300–500ms on mismatch (visual rejection)
- Error sound plays (gentle, 0.3–0.5s, descending tone, not scary) — handled by Epic 5
- Device vibration triggers (50–100ms, lighter intensity, distinct from success) — handled by Epic 5
- Selected shape smoothly returns to original position (CSS transition, 300ms)
- Shape remains selected for immediate retry (no loss of selection)
- Tap-to-feedback latency <300ms

**Design Tokens (from Design System):**
- **Colors:** Shape colors from primary palette (red, blue, yellow, green, purple, pink, orange, teal)
- **Selection Glow:** #FFD54F (warm golden glow accent)
- **Background:** #FAFAFA (very light gray)
- **Font:** Quicksand/Rubik, rounded, 400/700 weights
- **Animation Easing:** cubic-bezier(0.25, 0.46, 0.45, 0.94) for smooth motion
- **Touch Targets:** ≥48 CSS pixels (enforced by Epic 3, but design for it here)

## Technical Decisions

**State Management (Zustand):**
- Game state tree: `{ selectedShape, gameState, positions, ... }` managed by Zustand
- Actions: `selectShape(id)`, `attemptMatch(silhouetteId)`, `clearSelection()`
- UI components subscribe to store; tap callbacks dispatch actions
- State changes logged for testing (Story 1.5)

**Component Structure:**
- `ShapeTile`: Interactive shape, displays selection cue when `isSelected={true}`
- `SilhouetteTile`: Interactive silhouette (outline), tap-to-match target
- `ShapeBoard`: Parent container, scatters shapes and silhouettes (layout via CSS Grid or Flexbox with random positioning)
- `GameContainer`: Subscribes to Zustand, orchestrates state machine

**Animation Strategy (Hybrid):**
- **Selection Cue:** Instant (className toggle) + optional subtle glow animation (Framer Motion, <100ms, non-blocking)
- **Mismatch Return:** CSS transition (transform, 300ms) — fast, no JS overhead
- **Success Snap:** Framer Motion (layout animation, 0.3–0.5s, cubic-bezier easing)
- **Silhouette Shake:** CSS keyframe animation (300–500ms) or Framer Motion

**Type Safety (TypeScript):**
- Shape: `{ id: string, type: ShapeType, color: string, x: number, y: number, isSelected: boolean }`
- Silhouette: `{ id: string, shapeId: string, x: number, y: number, isMatched: boolean }`
- GameState: `'active' | 'feedbackSuccess' | 'feedbackMismatch' | 'roundComplete'`

**Performance Targets:**
- Selection cue render <50ms (className toggle only)
- Match animation 60 FPS (Framer Motion, GPU-accelerated transforms)
- No layout thrashing (use `will-change: transform` for animated shapes)

## UX & Interaction Patterns

**Selection Feedback Loop:**
1. Child taps shape → instant visual cue (glow + scale)
2. Child sees selection confirmed immediately
3. Child taps silhouette → smooth snap animation + sound/vibration
4. Visual, audio, haptic feedback stack (multisensory confirmation)

**Error Recovery (No Penalty):**
- Mismatch shakes silhouette (visual: "try again")
- Shape returns to original position (undo behavior, child not stuck)
- Selection remains active (no extra tap needed to retry)
- Positive tone (gentle error sound, not scary)

**4-Year-Old Considerations:**
- High contrast for visual cues (glow color must stand out from shape color and background)
- Instant feedback (no waiting, no animations that feel slow)
- Tactile (vibration gives physical confirmation)
- No cognitive load (no scores, timers, or decision trees)

## Cross-Story Dependencies

**Within Epic 1:**
- Story 1.1 (selection) is prerequisite for 1.2–1.4 (all matching flows depend on selection state)
- Story 1.5 (state machine) can run in parallel with others but validates stories 1.1–1.4 work correctly

**With Other Epics:**
- Story 1.1–1.4 feed into Epic 2 (round initialization must generate shapes that are selectable)
- Stories 1.1–1.4 depend on design tokens from Epic 4 (colors, animation durations, easing)
- Epic 5 (audio/haptic) augments success/mismatch feedback in 1.2–1.3
- Story 1.5 (state machine) is independent and can be tested in isolation

**No backward dependencies:** Epic 1 does not depend on any other epic completing first.
