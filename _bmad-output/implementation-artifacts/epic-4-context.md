# Epic 4 Context: Design System & Visual Polish

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Game has a cohesive, friendly visual identity with consistent design tokens, smooth animations, and celebratory feedback that feels delightful to 4-year-olds. This epic establishes the visual foundation: reusable color, typography, and spacing tokens; shape and silhouette components with clear interactive states; smooth match animations; and celebratory messaging for round completion. All animations target 60 FPS with easing curves tuned for a playful, responsive feel.

## Stories

- Story 4-1: Design Tokens System (Colors, Typography, Spacing)
- Story 4-2: Shape Components with Visual States
- Story 4-3: Silhouette Components & Highlight on Match
- Story 4-4: Match Animation (Smooth Snap into Silhouette)
- Story 4-5: Mismatch Feedback Animation (Shake/Pulse)
- Story 4-6: Round-End Celebration Message
- Story 4-7: Mute Toggle & Settings Panel

## Requirements & Constraints

**Color & Typography (from UX-DR1–2, FR20–21):**
- 8 primary shape colors: Red, Blue, Yellow, Green, Purple, Pink, Orange, Teal (distinct by silhouette)
- Typography: Quicksand/Rubik fonts; display (32px), body (16px), small (12px)
- Shapes are colorful (not grayscale), minimum 48px for touch, 10–15% border radius (e.g., 24px)
- High contrast for 4-year-old visibility

**Spacing & Layout (from UX-DR3):**
- Spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
- Touch targets minimum 48 CSS pixels on all screen sizes
- 8–12px spacing between targets

**Animation Timing & Easing (from UX-DR4–6, FR5, FR23–24):**
- Match animation: 0.3–0.5 seconds, smooth cubic-bezier easing (no linear)
- Mismatch shake: 300–500ms, small amplitude (5–10px)
- Round-end message: displays 1–2 seconds, fades smoothly
- All animations run at 60 FPS without stuttering
- No time pressure during play (FR29)

**Visual Feedback & States (from FR8, FR23–24):**
- On match: selected shape snaps to silhouette with smooth animation; silhouette fills with shape color; original shape fades over 0.3–0.5s
- On mismatch: silhouette shakes/pulses for 300–500ms; shape returns to original position
- Selected shape: visual cue (glow, scale-up 1.1x, or border); instant, no animation delay

**Celebration & Round Completion (from FR16, UX-DR25):**
- Round-end message: "Great job!" centered, 32px+ font, vibrant color, 1–2 second display, smooth fade
- Message non-intrusive (doesn't block shape view)

**Mute Toggle & Settings (from FR25, UX-DR9):**
- Toggle visible in top-right corner (icon or label) and optional settings panel
- Mute state syncs across locations
- When muted: sounds silent, visual/haptic feedback still works
- Persist mute state during session

## Technical Decisions

**Design Token Storage (AR5, AR6, AR10):**
- Tokens defined in `design-tokens.ts` (TypeScript) or CSS custom properties (`:root` in globals)
- All components reference tokens, never hardcoded values
- Tokens include colors, typography sizes, spacing scale, animation durations, easing curves

**Component Architecture (AR2, AR4, AR10):**
- React components for shapes and silhouettes with TypeScript
- CSS Modules for scoped, design-token-driven styling
- Framer Motion for complex choreography (match snap, celebration)
- CSS @keyframes for simple, performant animations (shake, fade)

**Animation Performance (AR4, NFR3, NFR4):**
- Hybrid approach: CSS for fast, 60 FPS baseline animations; Framer Motion for orchestrated sequences
- GPU acceleration via `will-change` and `transform`-based animations
- No JavaScript-driven pixel-by-pixel updates (pure CSS/Framer Motion)
- Bundle size target: <500 KB gzipped (design system adds ~20–30 KB)

**State Management (AR3):**
- Zustand store tracks: selected shape, matched shapes, feedback state, mute toggle
- Atomic updates prevent race conditions
- Mute state persists via sessionStorage (session-based, no cross-session persistence)

**Accessibility (FR22, FR29–30, NFR9–10):**
- Selection cue instant (no animation delay) for tactile feedback
- Color contrast ≥3:1 for shapes/silhouettes vs. background
- Multi-modal feedback: visual (glow, color fill) + audio (success/error sounds) + haptic (vibration)
- No time pressure; child controls interaction pace
- Mute toggle works independently of visual/haptic feedback

## Cross-Story Dependencies

- **Story 4-1 → Stories 4-2 to 4-7:** All component stories depend on tokens being defined first
- **Story 4-2 → Story 4-4 & 4-5:** Shape component visual states (selected, matching) used in match/mismatch animations
- **Story 4-3 → Story 4-5:** Silhouette shake/pulse animation uses silhouette component
- **Story 4-4 & 4-5 → Story 4-6:** Match and mismatch animations complete before celebration message triggers
- **Story 4-7 (Mute) → Epic 5:** Mute toggle implementation used by audio feedback system in next epic

## Context from Prior Stories (Epics 1–3)

**Epic 1 & 2 Completed:** Core gameplay (selection, matching, deselection, rounds) is fully functional with 300+ passing tests. Shape board is populated, matches work, game state machine is solid.

**Epic 3 Completed:** Responsive design, accessibility, multi-modal feedback, and no time pressure fully verified. Touch targets 48px+, color contrast 3:1+, audio/vibration/visual feedback synchronized.

**Current State:**
- Stories 4-1 & 4-2 (Design Tokens, Shape Components) are complete with 66 passing tests
- Stories 4-3 through 4-7 are ready for implementation
- Dev server running, 502/512 tests passing (pre-existing App.test.tsx issues unrelated to this epic)
- Production bundle: 234.75 KB gzipped
