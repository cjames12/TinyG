---
status: final
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-write-stories", "step-04-final-validation"]
inputDocuments: 
  - "prds/prd-TinyG-2026-11-20/prd.md"
  - "architecture-TinyG-2026-11-20/ARCHITECTURE.md"
  - "ux-design-TinyG-2026-11-20/DESIGN.md"
  - "ux-design-TinyG-2026-11-20/EXPERIENCE.md"
---

# TinyG - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for TinyG, decomposing requirements from the PRD, Architecture, and UX Design into implementable stories.

## Requirements Inventory

### Functional Requirements (34 total)

FR1: Game displays 6–8 random shapes and 6–8 matching silhouettes scattered randomly across the screen at round start
FR2: Child can tap a shape to select it; selected shape displays a visual cue (glow, scale-up, or border) to confirm selection
FR3: Selection persists until a matching attempt is made or a new shape is selected
FR4: Child can tap a silhouette to attempt a match; system compares selected shape to tapped silhouette
FR5: On successful match, selected shape snaps/locks to the silhouette position with smooth animation (0.3–0.5s)
FR6: On successful match, success sound plays (cheerful, short, loud enough for 4-year-olds)
FR7: On successful match, device vibration triggers (medium intensity, 100–150ms)
FR8: On successful match, original shape location fades/disappears over 0.3–0.5 seconds (visual cause-and-effect)
FR9: On successful match, selected shape is deselected and child is ready to match the next shape
FR10: On mismatch, error sound plays (distinct from success, not scary)
FR11: On mismatch, device vibration triggers (gentler/different from success, 50–100ms)
FR12: On mismatch, silhouette position briefly shakes/pulses to indicate rejection
FR13: On mismatch, selected shape returns to original position (undo behavior)
FR14: On mismatch, selected shape remains selected for immediate retry or new selection
FR15: Round goal: match all shapes to silhouettes without round limit
FR16: Round end: brief celebration message or visual appears (e.g., "Great job!")
FR17: Next round: system automatically shuffles 6–8 fresh shapes and silhouettes and scatters them randomly
FR18: Child can play continuously without round limits
FR19: Difficulty increases gradually: Rounds 1–2 (6 shapes, identical), Rounds 3–5 (7 shapes, slight rotations), Rounds 6+ (8 shapes, mixed variations)
FR20: Shapes in Phase 1: 6–8 simple, colorful, recognizable shapes (Circle, Square, Triangle, Star, Heart, Pentagon, Hexagon, Diamond)
FR21: Each shape is distinct by silhouette, colorful (not grayscale), and sized for touch (minimum 48px)
FR22: Selection visual cue is instant with no animation delay, high-contrast for a 4-year-old
FR23: Shape fading on match is smooth (opacity transition, 0.3–0.5s), not abrupt removal
FR24: Silhouette remains highlighted or filled with shape color after successful match
FR25: Game includes Mute toggle for parent control of all sounds (can be in settings menu or top-right corner icon)
FR26: Game is fully playable on phone (375px), tablet (768px), and desktop (1024px+)
FR27: Touch targets are at least 48 CSS pixels on all screen sizes with 8–12px spacing between targets
FR28: Layout adapts without breaking spacing or accessibility across all screen sizes
FR29: No time pressure on player; child can take as long as needed to tap
FR30: Clear, immediate feedback for all actions (visual, audio, haptic combined)
FR31: Errors are recoverable without punishment; mismatch returns shape to start position
FR32: Accidental taps on silhouettes return shape to start (no penalty)
FR33: Rapid taps on shapes are handled gracefully (no double-selection bugs)
FR34: Switching between shapes works smoothly (deselect, reselect)

### Non-Functional Requirements (17 total)

NFR1: Game loads in <2 seconds
NFR2: Tap-to-feedback latency is <100ms (critical for 4-year-old experience)
NFR3: Animations run at 60 FPS without stuttering
NFR4: Bundle size is <500 KB (gzipped) for quick web delivery
NFR5: Offline support via Service Worker (can play without internet)
NFR6: No backend server required for Phase 1 (fully client-side)
NFR7: No persistent storage in Phase 1 (session-based only)
NFR8: No data collection, analytics, or tracking
NFR9: Color contrast for shapes and silhouettes is at least 3:1 against background
NFR10: All critical feedback delivered via sound + vibration + visual (not sound alone)
NFR11: Sounds are not startling or harmful to hearing
NFR12: Success sound: 0.5–1 second, cheerful, bright, game-like tone
NFR13: Mismatch sound: 0.3–0.5 seconds, gentle, slightly descending, not scary
NFR14: Success vibration: 100–150ms, medium intensity
NFR15: Mismatch vibration: 50–100ms, slightly lighter intensity, distinct from success
NFR16: Game is single-player, session-based (no multi-player or account sync)
NFR17: Mute option is device-dependent (iOS/Android; web API fallback for browsers)

### Architectural Requirements (11 total)

AR1: Game logic implemented in utility functions (pure JavaScript, testable, decoupled from UI)
AR2: React components used for rendering (consume state, trigger actions)
AR3: Zustand for state management (lightweight, Phase 2 extensible)
AR4: Animations use hybrid approach: CSS for simple transitions + Framer Motion for complex choreography
AR5: Styling via CSS Modules (scoped styles, design token-driven)
AR6: TypeScript for type safety in game logic
AR7: Build tool: Vite for fast dev experience and optimized bundling
AR8: Testing: Vitest for unit/integration tests + Playwright for E2E tests with BMAD TEA integration
AR9: Package manager: npm
AR10: No Material-UI or Tailwind; custom UI components for the game
AR11: No backend required; consider simple service for Phase 2+ if progress tracking added

### UX Design Requirements (25 total)

UX-DR1: Implement custom design token system with 8 primary colors (Red, Blue, Yellow, Green, Purple, Pink, Orange, Teal) for shape differentiation
UX-DR2: Implement typography tokens: Quicksand/Rubik fonts, sizes for display (32px), body (16px), small (12px)
UX-DR3: Implement spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
UX-DR4: Implement rounded corners tokens: shape radius (24px), component radius (12px), full circle (9999px)
UX-DR5: Implement animation duration tokens: fast (300ms), normal (400–500ms)
UX-DR6: Implement easing tokens: smooth (cubic-bezier for polished motion), bounce (for snappy feedback)
UX-DR7: Create Shape Tile component with visual states: Idle, Selected (glow + scale), Matching (animation in progress), Matched (faded)
UX-DR8: Create Silhouette Tile component with visual states: Idle, Hover (optional visual cue), Matching In Progress, Matched (filled with shape color)
UX-DR9: Create Mute Toggle component (accessible icon button, available in Play Screen and Settings Panel)
UX-DR10: Create ShapeBoard component for scattered layout (renders shapes and silhouettes randomly positioned)
UX-DR11: Implement selection visual cue: soft glow around selected shape with high contrast for 4-year-olds
UX-DR12: Implement shape fading: smooth opacity transition (0.3–0.5s) when matched, visual cause-and-effect
UX-DR13: Implement silhouette highlight: filled with shape color or distinct highlight on successful match
UX-DR14: Implement match animation: smooth snap/lock of shape into silhouette (Framer Motion, 0.3–0.5s, cubic-bezier easing)
UX-DR15: Implement mismatch feedback: silhouette shakes/pulses for 300–500ms (CSS animation)
UX-DR16: Implement mismatch recovery: smooth return of shape to origin position (CSS transition, 300ms)
UX-DR17: Design round end celebration message: large text (32px+), encouraging language ("Great job!"), centered on screen
UX-DR18: Implement responsive breakpoints: phone (375px), tablet (768px), desktop (1024px+)
UX-DR19: Ensure all touch targets are 48px minimum on all device sizes
UX-DR20: Implement accessible touch target spacing: 8–12px minimum between targets
UX-DR21: Implement color contrast validation: 3:1 minimum for shapes and silhouettes vs. background
UX-DR22: Implement game layout: scattered (not left/right panes), truly random positioning of shapes and silhouettes
UX-DR23: Implement background: very light gray (#FAFAFA), uncluttered, calm visual atmosphere
UX-DR24: Implement rounded corners on all shapes (10–15% of shape size) for friendlier appearance
UX-DR25: Create Settings Panel component: collapsible, overlay on Play Screen, top-right corner access, includes Mute toggle and sync state with Play Screen

## Total Requirements: 87

---

## Epic List (APPROVED)

### Epic 1: Shape Matching Interaction Core
Child can select shapes, attempt matches, and receive immediate feedback (success/mismatch) with sound, vibration, and animation.
**FRs covered:** FR2, FR3, FR4, FR5, FR6, FR7, FR10, FR11, FR12, FR13, FR14, FR22
**NFRs covered:** NFR2, NFR10, NFR12–15
**UX-DRs covered:** UX-DR7, UX-DR8, UX-DR11, UX-DR14, UX-DR15, UX-DR16
**Tech Stack:** Zustand (state machine), Touch Events API, Framer Motion (match animation), CSS Modules (mismatch shake)

### Epic 2: Round Management & Shape Generation
Child experiences complete rounds: 6–8 shapes scatter randomly, matches clear them, and new rounds auto-generate with increasing difficulty.
**FRs covered:** FR1, FR9, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR23, FR24
**NFRs covered:** NFR6, NFR7
**UX-DRs covered:** UX-DR10, UX-DR12, UX-DR22
**Tech Stack:** Game utilities (shuffling, position randomizer), Zustand (round state, difficulty), Pure JS logic

### Epic 3: Responsive Design & Accessibility
Child can play comfortably on phone (375px), tablet (768px), or desktop (1024px+) with accessible touch targets and clear feedback across all devices.
**FRs covered:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34
**NFRs covered:** NFR9, NFR1, NFR3
**UX-DRs covered:** UX-DR18, UX-DR19, UX-DR20, UX-DR21, UX-DR23, UX-DR24
**Tech Stack:** CSS Modules (responsive breakpoints), Design tokens system, WCAG accessibility validation

### Epic 4: Design System & Visual Polish
Game has a cohesive, friendly visual identity with consistent design tokens, smooth animations, and celebratory feedback that feels delightful to a 4-year-old.
**FRs covered:** FR8, FR25
**UX-DRs covered:** UX-DR1–UX-DR6, UX-DR9, UX-DR13, UX-DR17, UX-DR25
**Tech Stack:** Design tokens (colors, typography, spacing, easing), Shape SVG components, Framer Motion (celebration), Settings Panel

### Epic 5: Audio & Haptic Feedback System
Child receives distinct, non-scary audio and haptic feedback for all actions (success vs. mismatch sounds, vibration patterns), with parent-controllable mute toggle.
**FRs covered:** FR6, FR10, FR25
**NFRs covered:** NFR11–17
**Tech Stack:** Web Audio API, Vibration API, Zustand (mute state), Mobile device compatibility fallback

### Epic 6: Performance, Build & Deployment
Game loads fast (<2s), runs smoothly (60 FPS), works offline, and is production-ready with <500 KB bundle size.
**NFRs covered:** NFR1, NFR3, NFR4, NFR5, NFR6–8
**ARs covered:** AR7, AR9
**Tech Stack:** Vite (build), Service Worker (offline), Bundle analysis, Performance monitoring

### Epic 7: Testing & Quality Assurance (BMAD TEA Integration)
Game is thoroughly tested across unit, integration, and end-to-end layers; quality is validated per PRD acceptance criteria.
**ARs covered:** AR8 (Vitest + Playwright)
**Tech Stack:** Vitest (unit/integration), Playwright (E2E), BMAD TEA test design & traceability

---

## FR Coverage Map

FR1: Epic 2 - Random shape/silhouette generation
FR2: Epic 1 - Shape selection interaction
FR3: Epic 1 - Selection persistence
FR4: Epic 1 - Silhouette tap detection
FR5: Epic 1 - Match animation (snap)
FR6: Epic 5 - Success sound
FR7: Epic 5 - Success vibration
FR8: Epic 4 - Shape fading visual
FR9: Epic 2 - Deselect after match
FR10: Epic 5 - Mismatch sound
FR11: Epic 5 - Mismatch vibration
FR12: Epic 1 - Silhouette shake/pulse
FR13: Epic 1 - Mismatch recovery (shape return)
FR14: Epic 1 - Selection remains after mismatch
FR15: Epic 2 - Round goal (match all)
FR16: Epic 4 - Round-end celebration message
FR17: Epic 2 - Next round auto-generate
FR18: Epic 2 - Continuous play
FR19: Epic 2 - Difficulty progression
FR20: Epic 4 - Shape set (Circle, Square, etc.)
FR21: Epic 4 - Shape sizing & clarity
FR22: Epic 1 - Selection visual cue (instant)
FR23: Epic 4 - Shape fading smooth
FR24: Epic 4 - Silhouette highlight on match
FR25: Epic 5 - Mute toggle & sound control
FR26: Epic 3 - Phone/tablet/desktop playability
FR27: Epic 3 - Touch target sizing (48px)
FR28: Epic 3 - Responsive layout adaptation
FR29: Epic 3 - No time pressure
FR30: Epic 3 - Multi-modal feedback
FR31: Epic 3 - Error recovery (no penalty)
FR32: Epic 3 - Accidental tap recovery
FR33: Epic 3 - Rapid tap handling
FR34: Epic 3 - Shape switching smoothly

---

**NEXT STEP:** Story Creation (Step 3)

---

## EPIC 1: Shape Matching Interaction Core

Child can select shapes, attempt matches, and receive immediate feedback (success/mismatch) with sound, vibration, and animation.

### Story 1.1: Shape Selection & Visual Cue

As a child,
I want to tap a shape and see it highlighted with a glow/scale effect,
So that I know which shape I've selected.

**Acceptance Criteria:**

**Given** the game is in Round Active state with shapes visible
**When** the child taps a shape
**Then** the shape displays an instant visual cue (glow + scale-up or border)
**And** the cue appears within 50ms (no animation delay)
**And** the selection persists until a new shape is selected or a matching attempt is made
**And** only one shape can be selected at a time
**And** the visual cue has high contrast (visible to 4-year-olds)

### Story 1.2: Silhouette Tap Detection & Success Feedback

As a child,
I want to tap a silhouette and see the selected shape snap into place with sound and vibration,
So that I feel the success immediately.

**Acceptance Criteria:**

**Given** a shape is selected and a silhouette is visible
**When** the child taps a silhouette that matches the selected shape
**Then** the shape animates smoothly to the silhouette position (0.3–0.5s, cubic-bezier easing)
**And** a success sound plays (cheerful, 0.5–1s duration)
**And** the device vibrates (100–150ms, medium intensity)
**And** tap-to-feedback latency is <100ms
**And** the shape remains locked in the silhouette position (not returnable)

### Story 1.3: Mismatch Feedback & Recovery

As a child,
I want to tap a silhouette that doesn't match and have my shape return to its original position,
So that I can try again without penalty.

**Acceptance Criteria:**

**Given** a shape is selected and a silhouette is visible
**When** the child taps a silhouette that does NOT match the selected shape
**Then** the silhouette briefly shakes/pulses for 300–500ms (visual rejection)
**And** an error sound plays (gentle, 0.3–0.5s, descending tone, not scary)
**And** the device vibrates (50–100ms, lighter intensity, distinct from success)
**And** the shape smoothly returns to its original position (CSS transition, 300ms)
**And** the shape remains selected for immediate retry
**And** tap-to-feedback latency is <300ms

### Story 1.4: Shape Deselection & Multi-Shape Selection

As a child,
I want to switch between shapes by tapping different ones,
So that I can easily select the shape I want to match next.

**Acceptance Criteria:**

**Given** a shape is currently selected
**When** the child taps a different shape
**Then** the previous shape's selection cue is instantly removed
**And** the new shape displays the selection cue immediately
**And** the new shape becomes the active selection
**And** rapid taps on shapes are handled gracefully (no double-selection bugs)
**And** transition between shapes is smooth (no visual glitches)

### Story 1.5: Interaction State Machine Implementation

As a developer,
I want the game to have a robust state machine managing selection, matching, and feedback states,
So that all interactions are predictable and testable.

**Acceptance Criteria:**

**Given** the game state machine is initialized
**When** transitions occur (Select → Attempt Match → Feedback → Ready for Next)
**Then** only valid state transitions are allowed
**And** state changes are logged in Zustand store (for testing)
**And** UI components subscribe to state changes and re-render correctly
**And** no race conditions occur with rapid taps or network delays (N/A for Phase 1, but architecture allows)

---

## EPIC 2: Round Management & Shape Generation

Child experiences complete rounds: 6–8 shapes scatter randomly, matches clear them, and new rounds auto-generate with increasing difficulty.

### Story 2.1: Round Initialization & Random Shape Generation

As a child,
I want each round to display 6–8 random shapes and 6–8 matching silhouettes scattered randomly across the screen,
So that every round feels fresh and I keep learning.

**Acceptance Criteria:**

**Given** a new round is starting
**When** the game initializes the round
**Then** 6–8 unique shapes are generated (Circle, Square, Triangle, Star, Heart, Pentagon, Hexagon, Diamond)
**And** 6–8 matching silhouettes are generated
**And** shapes and silhouettes are positioned randomly across the viewport (not in fixed left/right panes)
**And** no two shapes or silhouettes overlap (8–12px minimum spacing)
**And** all shapes remain within viewport bounds with margin
**And** shape positions vary between rounds (truly random, not pseudo-random repeat)

### Story 2.2: Difficulty Progression (Round-Based)

As a child,
I want the game to gradually increase difficulty as I play more rounds,
So that I stay challenged without becoming frustrated.

**Acceptance Criteria:**

**Given** rounds are being played sequentially
**When** tracking round count (Rounds 1–2, 3–5, 6+)
**Then** Rounds 1–2: 6 shapes with identical silhouettes (baseline difficulty)
**And** Rounds 3–5: 7 shapes with slight rotations/size variations on silhouettes
**And** Rounds 6+: 8 shapes with mixed color/rotation/size variations
**And** difficulty increases automatically without player action
**And** difficulty is stored in Zustand store and observable

### Story 2.3: Round Completion & Auto-Reset

As a child,
I want all shapes to disappear when matched and move to the next round automatically,
So that the game keeps flowing without me needing to do anything.

**Acceptance Criteria:**

**Given** all 6–8 shapes have been successfully matched to silhouettes
**When** the last shape is matched
**Then** a brief celebration message ("Great job!") appears centered on screen
**And** message displays for 1–2 seconds in large, friendly text (32px+)
**And** after celebration, shapes and silhouettes fade out
**And** a new round automatically initializes with fresh shapes (no manual "Next" button needed)
**And** round count increments and difficulty is recalculated

### Story 2.4: Continuous Play Without Round Limits

As a child,
I want to play as many rounds as I want without any "game over" or limit,
So that I can keep playing as long as I enjoy it.

**Acceptance Criteria:**

**Given** rounds are being played
**When** any round completes
**Then** the next round initializes automatically
**And** there is no round limit (1st round → 100th round all work identically)
**And** no score/points system to "win" or "lose"
**And** child can play indefinitely (parent can close app or end session)

### Story 2.5: Shape Fading on Match (Visual Cause-and-Effect)

As a child,
I want the original shape to disappear when it matches into the silhouette,
So that I see the cause-and-effect of my action.

**Acceptance Criteria:**

**Given** a shape has been successfully matched to a silhouette
**When** the shape animation completes
**Then** the original shape position fades out over 0.3–0.5 seconds (smooth opacity transition)
**And** fade is not abrupt/instant removal
**And** silhouette position shows the shape filled with its color or highlighted
**And** fading happens after match animation (shape snaps in, then fades)
**And** CSS transition is used for performance (60 FPS)

### Story 2.6: Game Loop & State Persistence

As a developer,
I want the game loop and round state to be managed in utilities (testable, decoupled),
So that the game logic is easy to verify and extend.

**Acceptance Criteria:**

**Given** the game is running
**When** rounds progress and shapes are matched
**Then** game state is managed by Zustand (round count, shapes, silhouettes, matches)
**And** game logic (matching, difficulty, shuffling) lives in utility functions (pure JS)
**And** React components subscribe to Zustand state and re-render on changes
**And** state changes are deterministic and testable

---

## EPIC 3: Responsive Design & Accessibility

Child can play comfortably on phone (375px), tablet (768px), or desktop (1024px+) with accessible touch targets and clear feedback across all devices.

### Story 3.1: Touch Target Sizing & Spacing Validation

As a child,
I want all shapes and silhouettes to be large enough for my tiny fingers to tap easily,
So that I don't get frustrated trying to hit small targets.

**Acceptance Criteria:**

**Given** the game is rendered on any device
**When** shapes and silhouettes are displayed
**Then** all touch targets are at least 48 CSS pixels × 48 CSS pixels (WCAG 2.5.5)
**And** minimum spacing between targets is 8–12 CSS pixels (no overlaps)
**And** spacing is maintained on phone, tablet, and desktop
**And** layout does not break or compress targets below 48px

### Story 3.2: Responsive Breakpoints (Phone, Tablet, Desktop)

As a child,
I want the game to work smoothly on my mom's phone, tablet, and computer,
So that we can play together on any device.

**Acceptance Criteria:**

**Given** the game is loaded on different devices
**When** device widths are phone (375px), tablet (768px), desktop (1024px+)
**Then** layout adapts without breaking spacing or accessibility
**And** shapes and silhouettes remain properly positioned on all sizes
**And** scattered layout is maintained (not reorganized into panes)
**And** all touch targets remain ≥48px on all breakpoints
**And** CSS Modules use responsive breakpoints (@media queries)

### Story 3.3: Color Contrast & Visual Clarity

As a child,
I want to see the shapes and silhouettes clearly so I can tell them apart,
So that I can match them correctly.

**Acceptance Criteria:**

**Given** shapes and silhouettes are displayed
**When** comparing shape colors to background
**Then** color contrast is at least 3:1 (WCAG 2.1.4 Graphics)
**And** each shape is visually distinct (not just by color; silhouette matters too)
**And** background is very light gray (#FAFAFA) for calmness and contrast
**And** no shapes blend into background

### Story 3.4: Error Recovery Without Penalty

As a child,
I want to tap the wrong silhouette and have my shape go back so I can try again,
So that mistakes don't make me sad.

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** the shape returns to its original position
**Then** no penalty is applied (no score lost, no "try again" message that feels punitive)
**And** error sound and vibration are gentle and non-scary
**And** shape remains selected for immediate retry
**And** child can keep playing without frustration

### Story 3.5: Rapid Tap Handling & Accidental Tap Recovery

As a child,
I want the game to handle my quick, excited taps without breaking,
So that my enthusiasm doesn't cause bugs.

**Acceptance Criteria:**

**Given** the child is tapping shapes and silhouettes rapidly
**When** multiple taps occur in quick succession (e.g., 2–3 taps/second)
**Then** only one tap per interaction is registered (no double-selection)
**And** accidental taps on silhouettes return the shape (no penalty)
**And** rapid switching between shapes works smoothly
**And** no race conditions or state corruption occurs

### Story 3.6: Multi-Modal Feedback (Sound + Vibration + Visual)

As a child,
I want to feel the game respond with sound AND vibration AND visual feedback at the same time,
So that I know something happened.

**Acceptance Criteria:**

**Given** an action occurs (success or mismatch)
**When** feedback is delivered
**Then** visual feedback appears (animation, glow, shake, fade)
**And** audio feedback plays (success or error sound)
**And** haptic feedback triggers (vibration)
**And** all three happen simultaneously (within 100ms of each other)
**And** feedback is never audio-only (accessible to deaf children)

### Story 3.7: No Time Pressure or Scoring

As a child,
I want to take my time matching shapes without being rushed,
So that I can play at my own pace.

**Acceptance Criteria:**

**Given** the game is running
**When** playing a round
**Then** no timer or countdown appears
**And** no points/score system exists
**And** no "lose" condition (can't fail a match attempt)
**And** child can pause by not tapping for as long as needed
**And** game waits patiently for child's next action

---

## EPIC 4: Design System & Visual Polish

Game has a cohesive, friendly visual identity with consistent design tokens, smooth animations, and celebratory feedback that feels delightful.

### Story 4.1: Design Tokens System (Colors, Typography, Spacing)

As a designer/developer,
I want all colors, fonts, and spacing to be defined as reusable design tokens,
So that the game has a consistent visual identity and is easy to update.

**Acceptance Criteria:**

**Given** the design tokens are defined
**When** components use tokens
**Then** 8 primary shape colors are available (Red, Blue, Yellow, Green, Purple, Pink, Orange, Teal)
**And** typography tokens exist: Quicksand/Rubik fonts, sizes 32px (display), 16px (body), 12px (small)
**And** spacing tokens exist: xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
**And** animation tokens exist: fast (300ms), normal (400–500ms), easing (smooth curve)
**And** tokens are stored in `design-tokens.ts` or CSS custom properties
**And** all components reference tokens (not hardcoded values)

### Story 4.2: Shape Components with Visual States

As a child,
I want shapes to look friendly and round, with clear feedback for each state (idle, selected, matched),
So that the game feels playful.

**Acceptance Criteria:**

**Given** shapes are rendered
**When** displaying shapes in different states
**Then** shapes have rounded corners (10–15% of size, e.g., 24px radius)
**And** Idle state: shape visible at normal scale, unselected
**And** Selected state: shape glows (soft golden glow) and scales up slightly (1.1x)
**And** Matching state: shape animates to silhouette (Framer Motion)
**And** Matched state: shape fades to semi-transparent at silhouette position
**And** all transitions are smooth, no jarring changes

### Story 4.3: Silhouette Components & Highlight on Match

As a child,
I want to see silhouettes clearly and know when a match is successful by the shape filling in,
So that I understand what I've accomplished.

**Acceptance Criteria:**

**Given** silhouettes are rendered
**When** displaying silhouettes
**Then** silhouettes are outlined in dark gray or black (high contrast)
**And** background is light gray (#FAFAFA)
**And** On mismatch: silhouette shakes/pulses for 300–500ms
**And** On match: silhouette fills with shape color (visual confirmation)
**And** filled silhouette remains visible after match (shows what was matched)

### Story 4.4: Match Animation (Smooth Snap into Silhouette)

As a child,
I want to see my shape smoothly glide into the silhouette when I make a match,
So that it feels rewarding and satisfying.

**Acceptance Criteria:**

**Given** a successful match occurs
**When** shape animates to silhouette
**Then** animation duration is 0.3–0.5 seconds
**And** easing is smooth (cubic-bezier curve, not linear)
**And** shape path is direct (no bouncing or overshooting in Phase 1)
**And** animation runs at 60 FPS without jank
**And** implemented via Framer Motion for polish

### Story 4.5: Mismatch Feedback Animation (Shake/Pulse)

As a child,
I want to see the silhouette wiggle when my shape doesn't match,
So that I know my answer was wrong (gently).

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** shape tap fails
**Then** silhouette shakes/pulses (CSS keyframe animation)
**And** shake duration is 300–500ms
**And** shake amplitude is small (5–10px offset, not dramatic)
**And** animation is CSS-based (fast, 60 FPS)
**And** shake stops cleanly without residual movement

### Story 4.6: Round-End Celebration Message

As a child,
I want to see a fun message like "Great job!" when I finish a round,
So that I feel celebrated and motivated to play again.

**Acceptance Criteria:**

**Given** all shapes in a round are matched
**When** round completes
**Then** message "Great job!" appears centered on screen
**And** message text is large (32px+), friendly font (Quicksand/Rubik)
**And** message color is vibrant (not grayscale)
**And** message displays for 1–2 seconds
**And** message fades out smoothly (opacity transition)
**And** message is non-intrusive (doesn't block view of shapes fading)

### Story 4.7: Mute Toggle & Settings Panel

As a parent,
I want to toggle sound on/off and have a simple settings area,
So that I can control the game's audio without complicated menus.

**Acceptance Criteria:**

**Given** the game is running
**When** mute toggle is accessed
**Then** toggle is visible in top-right corner (icon or label)
**And** toggle is also available in an optional Settings Panel (overlay)
**And** toggle syncs state between both locations
**And** mute state persists during the session
**And** when muted, all sounds are silent (success, error, etc.)
**And** visual and haptic feedback still work (not muted)
**And** Settings Panel can be opened/closed without interrupting gameplay

---

## EPIC 5: Audio & Haptic Feedback System

Child receives distinct, non-scary audio and haptic feedback for all actions with parent-controllable mute toggle.

### Story 5.1: Success Sound Implementation

As a child,
I want to hear a cheerful, bright sound when I make a match,
So that I know I did it right.

**Acceptance Criteria:**

**Given** a successful match occurs
**When** feedback is triggered
**Then** success sound plays (0.5–1 second duration)
**And** tone is cheerful, bright, game-like (think Mario jump sound)
**And** volume is loud enough to hear from 2 feet away (child-friendly, ~70–80 dB)
**And** sound is not startling or harmful to hearing
**And** sound plays only if mute toggle is OFF
**And** sound file is optimized (small file size, web-friendly format .webp or .mp3)

### Story 5.2: Mismatch Sound Implementation

As a child,
I want to hear a gentle "nope" sound when my match is wrong,
So that I know I need to try again (without feeling bad).

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** feedback is triggered
**Then** error sound plays (0.3–0.5 second duration)
**And** tone is gentle, slightly descending (not scary, e.g., soft "boing")
**And** volume is slightly quieter than success sound
**And** sound is not punitive or scary
**And** sound plays only if mute toggle is OFF
**And** sound file is optimized (small file size)

### Story 5.3: Vibration on Success

As a child,
I want to feel the device vibrate when I make a match,
So that I feel the success in my hands.

**Acceptance Criteria:**

**Given** a successful match occurs
**When** feedback is triggered
**Then** device vibrates (100–150ms duration)
**And** intensity is medium (child should notice, not be startled)
**And** vibration pattern is consistent across rounds
**And** vibration works on iOS (via Haptic API) and Android (Vibration API)
**And** vibration gracefully fails on devices without Vibration support (no error thrown)

### Story 5.4: Vibration on Mismatch (Distinct Pattern)

As a child,
I want to feel a gentler vibration when my match is wrong,
So that I know it's different from success.

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** feedback is triggered
**Then** device vibrates (50–100ms duration)
**And** intensity is lighter than success vibration (distinct, not punitive)
**And** vibration is noticeably different from success (shorter or lighter feel)
**And** vibration works across iOS and Android
**And** vibration is optional for child comfort (can be disabled via mute, future feature)

### Story 5.5: Mute Toggle State Management

As a parent,
I want to toggle mute and have it persist and control all sounds,
So that I can quickly silence the game.

**Acceptance Criteria:**

**Given** mute toggle exists
**When** mute is turned ON
**Then** all sounds are silenced (success, error, etc.)
**And** mute state is stored in Zustand (observable)
**And** visual and haptic feedback still work (only audio is muted)
**And** toggle position clearly indicates mute state (icon: speaker on/off)
**And** toggle remains in selected state during session

### Story 5.6: Audio Asset Management

As a developer,
I want all audio files to be properly imported and managed,
So that sounds load correctly without delays.

**Acceptance Criteria:**

**Given** audio files are needed
**When** game initializes
**Then** success and error sound files are preloaded (not lazy-loaded)
**And** files are stored in `src/assets/audio/` directory
**And** Web Audio API is used for playback
**And** sounds play with <100ms latency from trigger
**And** no console errors on audio import or playback

---

## EPIC 6: Performance, Build & Deployment

Game loads fast (<2s), runs smoothly (60 FPS), works offline, and is production-ready with <500 KB bundle size.

### Story 6.1: Vite Build Configuration & Development Setup

As a developer,
I want a fast development environment with hot module reloading,
So that I can iterate quickly.

**Acceptance Criteria:**

**Given** project is set up
**When** running `npm run dev`
**Then** Vite starts dev server in <5 seconds
**And** React Fast Refresh works (edit code → see changes instantly)
**And** TypeScript is configured (strict mode recommended)
**And** CSS Modules are configured and working
**And** asset imports (images, audio) are configured
**And** build command (`npm run build`) produces optimized bundle

### Story 6.2: Code Splitting & Bundle Optimization

As a user,
I want the game to load quickly on cellular networks,
So that I can start playing immediately.

**Acceptance Criteria:**

**Given** game code is built
**When** bundle is generated
**Then** total bundle size is <500 KB (gzipped)
**And** main app chunk is <300 KB
**And** unused code is tree-shaken (no dead code in bundle)
**And** large dependencies are avoided (no Material-UI, Tailwind, etc.)
**And** bundle analysis tool is available for review
**And** load time on 3G network is <2 seconds

### Story 6.3: Performance Optimization (60 FPS Animations)

As a child,
I want smooth, jank-free animations when shapes snap and fade,
So that the game feels polished.

**Acceptance Criteria:**

**Given** animations are running
**When** shapes animate to silhouettes or fade
**Then** frame rate is consistently 60 FPS (no stuttering)
**And** CSS transforms are used (not layout changes) for animations
**And** React re-renders are optimized (no unnecessary renders)
**And** Zustand selectors prevent component over-subscription
**And** performance monitoring shows no red flags

### Story 6.4: Service Worker for Offline Play

As a child,
I want to play even when WiFi is unavailable,
So that I can play anywhere, anytime.

**Acceptance Criteria:**

**Given** game is loaded once online
**When** device goes offline
**Then** Service Worker serves cached assets (HTML, CSS, JS, images, sounds)
**And** game loads and plays fully offline
**And** no backend calls are made (all logic is client-side)
**And** when back online, fresh updates are available (optional auto-update)
**And** manifest.webmanifest is configured (PWA support)

### Story 6.5: Asset Optimization (Images & Sounds)

As a developer,
I want all assets to be optimized for web delivery,
So that the game loads fast.

**Acceptance Criteria:**

**Given** assets are included
**When** build runs
**Then** images are compressed (.webp format preferred, .png fallback)
**And** audio files are optimized (.webp audio or .mp3, <100 KB each)
**And** shape SVGs are inlined or sprite-sheeted (no extra HTTP requests)
**And** no unused assets are included in bundle
**And** Vite automatically optimizes on build

### Story 6.6: Deployment & Environment Setup

As a developer,
I want to easily deploy the game to production,
So that it's available to players.

**Acceptance Criteria:**

**Given** code is ready for release
**When** running production build
**Then** `npm run build` creates optimized, minified bundle
**And** sourcemaps are available for debugging (optional, dev-only)
**And** game is served over HTTPS in production
**And** cache headers are configured (assets cache-busted on updates)
**And** deployment workflow is documented (GitHub Pages, Vercel, Netlify, or custom)

---

## EPIC 7: Testing & Quality Assurance (BMAD TEA Integration)

Game is thoroughly tested across unit, integration, and end-to-end layers; quality is validated per PRD acceptance criteria.

### Story 7.1: Vitest Unit Test Setup & Game Logic Tests

As a developer,
I want unit tests for game logic (shape matching, shuffling, difficulty),
So that I can refactor with confidence.

**Acceptance Criteria:**

**Given** game utilities are created
**When** tests run via `npm run test`
**Then** Vitest is configured and running
**And** unit tests cover game logic (shuffling, matching, difficulty calc)
**And** test cases include happy path, edge cases, and errors
**And** test coverage is >80% for utility functions
**And** tests run in <10 seconds (fast feedback)
**And** tests pass on CI/CD pipeline

### Story 7.2: Integration Tests (State + Components)

As a developer,
I want integration tests for Zustand state and React components,
So that component interactions work correctly.

**Acceptance Criteria:**

**Given** components and state are integrated
**When** integration tests run
**Then** Vitest + React Testing Library are configured
**And** tests cover state → component → user interaction flows
**And** state updates trigger correct component re-renders
**And** selection, matching, feedback all work in integrated tests
**And** test coverage is >70% for components
**And** mocking is used for Web Audio API and Vibration API

### Story 7.3: Playwright E2E Tests (Full Gameplay)

As a QA lead,
I want end-to-end tests that simulate a real child playing the game,
So that I can verify the full experience works.

**Acceptance Criteria:**

**Given** game is deployed to staging
**When** Playwright tests run
**Then** tests cover full gameplay scenarios:
  - Child taps shape → shape selected (glow visible)
  - Child taps matching silhouette → shape snaps in, sound plays, vibration triggers
  - Child taps mismatched silhouette → shape returns, error sound plays
  - Child completes a full round → celebration message appears → new round starts
  - Mute toggle works (sounds silent, visual feedback still works)
  - Responsive breakpoints work (phone, tablet, desktop)
**And** tests run in <60 seconds
**And** screenshots captured on failure (debugging)
**And** tests pass on Chrome, Firefox (at minimum)

### Story 7.4: Accessibility & Performance Testing

As a tester,
I want to verify accessibility and performance meet PRD requirements,
So that all children can play comfortably.

**Acceptance Criteria:**

**Given** game is built
**When** testing accessibility and performance
**Then** axe-core or similar tool checks WCAG compliance (color contrast, touch targets, etc.)
**And** lighthouse reports show:
  - Load time <2 seconds
  - Largest Contentful Paint <1.5s
  - Cumulative Layout Shift <0.1
  - Performance score >90
**And** tap-to-feedback latency measured <100ms
**And** animation frame rate validated at 60 FPS (via DevTools)

### Story 7.5: Cross-Device Testing Matrix

As a QA lead,
I want to verify the game works on target devices,
So that all children have a consistent experience.

**Acceptance Criteria:**

**Given** game is built
**When** tested on target devices
**Then** tested on:
  - iPhone SE / 375px viewport (mobile)
  - iPad Pro 768px viewport (tablet)
  - Desktop 1024px+ (browser)
  - Safari (iOS), Chrome (Android), Chrome/Firefox (Desktop)
**And** gameplay works identically on all combinations
**And** touch events register correctly on all devices
**And** audio/vibration work on iOS and Android

### Story 7.6: Quality Gate & Traceability Matrix

As a product manager,
I want a traceability matrix showing which PRD requirements are tested,
So that I can sign off on quality.

**Acceptance Criteria:**

**Given** all tests are written
**When** generating traceability matrix
**Then** matrix maps each FR to at least one test (unit, integration, or E2E)
**And** matrix maps each NFR to performance or accessibility tests
**And** matrix shows pass/fail status for each requirement
**And** coverage is >95% (at least one test per requirement)
**And** matrix is documented and reviewed by team

---

## ✅ EPIC & STORY CREATION COMPLETE

**Total Stories Generated: 43**
- Epic 1: 5 stories
- Epic 2: 6 stories
- Epic 3: 7 stories
- Epic 4: 7 stories
- Epic 5: 6 stories
- Epic 6: 6 stories
- Epic 7: 6 stories

**All 34 FRs Covered ✓**
**All 25 UX-DRs Covered ✓**
**All NFRs Addressed ✓**

