# EPIC 3: Responsive Design & Accessibility

Child can play comfortably on phone (375px), tablet (768px), or desktop (1024px+) with accessible touch targets and clear feedback across all devices.

## Story 3.1: Touch Target Sizing & Spacing Validation

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

## Story 3.2: Responsive Breakpoints (Phone, Tablet, Desktop)

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

## Story 3.3: Color Contrast & Visual Clarity

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

## Story 3.4: Error Recovery Without Penalty

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

## Story 3.5: Rapid Tap Handling & Accidental Tap Recovery

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

## Story 3.6: Multi-Modal Feedback (Sound + Vibration + Visual)

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

## Story 3.7: No Time Pressure or Scoring

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

# EPIC 4: Design System & Visual Polish

Game has a cohesive, friendly visual identity with consistent design tokens, smooth animations, and celebratory feedback that feels delightful.

## Story 4.1: Design Tokens System (Colors, Typography, Spacing)

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

## Story 4.2: Shape Components with Visual States

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

## Story 4.3: Silhouette Components & Highlight on Match

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

## Story 4.4: Match Animation (Smooth Snap into Silhouette)

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

## Story 4.5: Mismatch Feedback Animation (Shake/Pulse)

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

## Story 4.6: Round-End Celebration Message

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

## Story 4.7: Mute Toggle & Settings Panel

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
