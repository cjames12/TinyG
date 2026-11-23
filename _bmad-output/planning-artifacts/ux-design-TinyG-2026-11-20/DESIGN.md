---
title: "TinyG Design System — Visual Language & Components"
status: final
created: 2026-11-20
updated: 2026-11-20
phase: 1
document_type: design

# Design Tokens
colors:
  - name: primary-red
    value: "#EF5350"
    description: "Saturated red for shapes; energetic and playful"
  - name: primary-blue
    value: "#42A5F5"
    description: "Clear blue; calming yet vibrant"
  - name: primary-yellow
    value: "#FDD835"
    description: "Warm yellow; joyful and bright"
  - name: primary-green
    value: "#66BB6A"
    description: "Fresh green; friendly and natural"
  - name: primary-purple
    value: "#AB47BC"
    description: "Rich purple; playful and imaginative"
  - name: accent-pink
    value: "#F48FB1"
    description: "Soft pink accent for variety"
  - name: accent-orange
    value: "#FFA726"
    description: "Warm orange accent"
  - name: accent-teal
    value: "#4DB6AC"
    description: "Cool teal accent"
  - name: background
    value: "#FAFAFA"
    description: "Very light gray; uncluttered and calm"
  - name: surface-muted
    value: "#F5F5F5"
    description: "Faded surface for matched shapes (origin fade)"
  - name: glow-accent
    value: "#FFD54F"
    description: "Warm golden glow for selection cue"
  - name: shadow-light
    value: "rgba(0, 0, 0, 0.1)"
    description: "Subtle shadow for depth"

typography:
  - name: font-family-primary
    value: "'Quicksand', 'Rubik', sans-serif"
    description: "Rounded, friendly, modern. Weights: 400 (normal), 700 (bold)"
  - name: size-display
    value: "32px"
    description: "Large text for round end ('Great job!'). Line height: 1.2"
  - name: size-body
    value: "16px"
    description: "Body text if needed. Line height: 1.5"
  - name: size-small
    value: "12px"
    description: "Small labels or counters (future phase). Line height: 1.4"

spacing:
  - name: space-xs
    value: "4px"
    description: "Micro spacing (component internal)"
  - name: space-sm
    value: "8px"
    description: "Small spacing between shapes or controls"
  - name: space-md
    value: "16px"
    description: "Medium spacing; common in layouts"
  - name: space-lg
    value: "24px"
    description: "Large spacing; breathing room"
  - name: space-xl
    value: "32px"
    description: "Extra large spacing; major sections"

rounded:
  - name: radius-shape
    value: "24px"
    description: "Friendly rounded corners for shapes (10–15% of shape size)"
  - name: radius-component
    value: "12px"
    description: "Medium radius for buttons or components"
  - name: radius-full
    value: "9999px"
    description: "Full circle for circular shapes or pill shapes"

animation:
  - name: duration-fast
    value: "300ms"
    description: "Quick feedback (mismatch return, error vibration)"
  - name: duration-normal
    value: "400–500ms"
    description: "Match success, shape snap into place"
  - name: easing-smooth
    value: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    description: "Smooth easing for polished motion"
  - name: easing-bounce
    value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    description: "Bouncy easing for arrival (slight overshoot)"

components:
  - name: shape-circle
    description: "Circular shape; 48–80px diameter. Rounded corners applied via CSS border-radius: 50%."
  - name: shape-square
    description: "Square shape; 48–80px per side. Rounded corners (radius-shape)."
  - name: shape-triangle
    description: "Triangle shape; CSS clip-path or SVG. 48–80px bounding box. Rounded corners via SVG smoothing."
  - name: shape-star
    description: "5-point star; SVG. 48–80px bounding box."
  - name: shape-heart
    description: "Heart shape; SVG. 48–80px bounding box."
  - name: silhouette
    description: "Target outline; thin stroke (2–3px), dark gray or charcoal (#424242). Same size as shape, slightly inset (2–4px padding). No fill, only stroke."
  - name: selection-glow
    description: "Radiant glow + scale on tap. Glow: golden shadow (glow-accent, blur 20–30px, spread 4–8px). Scale: 1.15x. Duration: instant or <50ms. Applied to selected shape."
  - name: match-vibration
    description: "Silhouette pulses or brightens on mismatch. Visual feedback only (not mandatory); haptic carries the feedback."
  - name: fade-transition
    description: "When shape matches, origin location fades over 300–500ms. Opacity 1.0 → 0.0, smooth easing. After fade, shape position removed from layout (no phantom space)."

---

# TinyG Visual Design — Phase 1

## Brand & Style

**TinyG is playful, joyful, and uncluttered.** Designed for a 4-year-old's first shape-learning game, every visual choice prioritizes clarity, warmth, and encouragement. The color palette balances energy (saturated primaries) with softness (pastel accents), creating a space that feels exciting without overwhelming. Interactions are snappy yet polished, rewarding curiosity and exploration.

**Visual Principles:**
- **Playful warmth:** Rounded shapes, friendly colors, instant feedback
- **Clarity first:** No visual noise; every element has a purpose
- **Joyful feedback:** Success feels triumphant; errors are gentle and recoverable
- **Exploration-friendly:** Scattered layout invites discovery; no rigid structure

**Target User:** A 4-year-old with 10+ minutes attention span, prior experience with matching games, right-handed, curious, and responsive to immediate feedback.

**Platform:** Responsive web (phone, tablet, desktop). Same visual design scales proportionally across all devices.

---

## Colors

The TinyG palette mixes saturated primaries with soft accents, creating vibrant but balanced energy.

### Primary Shape Colors

| Color | Hex | Usage | Emotion |
|-------|-----|-------|---------|
| **Red** | `#EF5350` | Shape fill (e.g., circle, heart) | Energetic, warm, playful |
| **Blue** | `#42A5F5` | Shape fill (e.g., square, diamond) | Calming, clear, trustworthy |
| **Yellow** | `#FDD835` | Shape fill (e.g., triangle, star) | Joyful, bright, attention-grabbing |
| **Green** | `#66BB6A` | Shape fill (e.g., pentagon, hexagon) | Fresh, natural, friendly |
| **Purple** | `#AB47BC` | Shape fill (e.g., star, heart variant) | Imaginative, playful, special |

### Accent Colors (Variety & Softness)

| Color | Hex | Usage | Emotion |
|-------|-----|-------|---------|
| **Pink** | `#F48FB1` | Accent shape or variant | Soft, playful, gentle |
| **Orange** | `#FFA726` | Accent shape or variant | Warm, inviting, energetic |
| **Teal** | `#4DB6AC` | Accent shape or variant | Cool, calm, balanced |

### Background & UI

| Color | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| **Background** | `#FAFAFA` | Screen background | Clean, uncluttered canvas |
| **Surface Muted** | `#F5F5F5` | Faded shape origin after match | Visual feedback: "shape moved" |
| **Glow Accent** | `#FFD54F` | Selection glow (radiant shadow) | Warm, friendly highlight |
| **Silhouette Stroke** | `#424242` | Target outline (thin stroke) | High contrast, clear target |
| **Shadow Light** | `rgba(0, 0, 0, 0.1)` | Subtle depth cues | Minimal; used sparingly |

### Accessibility & Contrast

- All shape colors meet WCAG AA contrast (≥3:1) against `#FAFAFA` background
- Silhouettes are distinct by shape (not color alone); a 4-year-old can match by outline even if color-blind
- Glow accent (`#FFD54F`) is warm and not blue-shifted, friendly for all vision types

---

## Typography

Typography is minimal in Phase 1; it's purely supportive and friendly.

### Font Family
- **Primary:** `'Quicksand'` or fallback `'Rubik'`, sans-serif (default weight 400, bold 700)
- **Rationale:** Rounded, modern, playful—friendly for young children without feeling childish or hard to read

### Font Sizes & Usage

| Size | Value | Usage | Example |
|------|-------|-------|---------|
| **Display** | 32px | Large celebratory text (round end: "Great job!") | Visible from 1–2 feet away; bold weight (700) |
| **Body** | 16px | Instructional text (future); rarely used in Phase 1 | Simple captions or tooltips |
| **Small** | 12px | Tiny labels or counters (Phase 2+) | Not used in Phase 1 |

### Line Height & Spacing
- **Display:** 1.2 (compact, impact)
- **Body:** 1.5 (readable, spacious)

### Microcopy Principle
- **Minimal text:** Sounds and visuals do the talking
- **If text appears:** Keep it simple, encouraging, and large enough to read from 2 feet away
- **Tone:** Warm, celebratory, supportive (never punitive or condescending)

---

## Layout & Spacing

### Canvas & Responsive Scaling

**Viewport Sizes:**
- **Phone:** 375px wide (minimum)
- **Tablet:** 768px wide (common iPad size)
- **Desktop:** 1024px+ wide

**Scaling Strategy:** Game layout and proportions remain identical across all sizes. Shapes, silhouettes, and spacing scale proportionally. Touch targets stay ≥48px CSS pixels on all devices.

**Formula:** Shapes and components scale with viewport width to maintain consistent proportions and touch-friendly sizes.

### Safe Area & Margins

- **Safe margin:** 16–24px from viewport edges (prevents shapes from being cut off or unreachable)
- **Touch-friendly spacing:** Minimum 8–12px gap between adjacent shapes or silhouettes to prevent accidental overlaps
- **Whitespace:** Generous spacing around shapes encourages exploration without visual clutter

### Random Scatter Distribution

**Truly random positioning:**
- Shapes and silhouettes are positioned independently with random X, Y coordinates
- Each shape/silhouette has a minimum bounding box (48–80px) to ensure touch-friendliness
- Collision detection prevents exact overlaps; if collision detected, shapes slightly offset
- Distribution encourages exploration: shapes not clustered on one side, but scattered across screen

**Responsive adaptation:** On smaller screens (phone), shapes and silhouettes may appear closer together (but always with ≥8px gap). Scatter distribution is dynamic per screen size.

---

## Elevation & Depth

**TinyG uses minimal depth cues:**

- **Selection state:** Glow + scale create a "floating" effect (selected shape appears to lift)
- **Shadow:** Subtle shadow (`shadow-light`) applied to shapes to suggest slight lift from background (optional for Phase 1; deferred to Phase 2 if needed)
- **Fading:** Matched shape location fades (opacity 1.0 → 0.0) to show cause-and-effect

**No z-index complexity:** Most shapes are on the same visual plane. Selection glow naturally brings a shape forward perceptually.

---

## Shapes

The TinyG shape library for Phase 1 includes 6–8 simple, recognizable shapes. Each is colorful, distinct by silhouette, and touch-friendly.

### Shape Specifications

| Shape | Size | Style | Color(s) | Notes |
|-------|------|-------|----------|-------|
| **Circle** | 48–80px diameter | Full rounded (border-radius: 50%) | Red, blue, yellow, green, purple | Easiest to recognize; no rotation variants |
| **Square** | 48–80px per side | Rounded corners (radius-shape: 24px) | Blue, pink, teal | Rotation creates diamond; variant in later rounds |
| **Triangle** | 48–80px bounding box | Equilateral, rounded corners (SVG smoothing) | Yellow, orange, green | Rotation (90°, 180°, 270°) in later rounds |
| **Star** | 48–80px bounding box | 5-point, rounded points (SVG) | Purple, pink, yellow | Rotation in later rounds (slight variants) |
| **Heart** | 48–80px bounding box | Classic heart shape (SVG), rounded | Pink, red, purple | No rotation; most recognizable as single orientation |
| **Pentagon** | 48–80px bounding box | Regular pentagon, rounded corners (SVG) | Green, purple, blue | Rotation in later rounds |
| **Hexagon** | 48–80px bounding box | Regular hexagon, rounded corners (SVG) | Teal, blue, purple | Rotation in later rounds |
| **Diamond** | 48–80px bounding box | Rotated square, rounded corners (SVG) | Orange, pink, red | Variant of square; treated as separate in matching |

### Silhouette Specifications

Each silhouette is an outline-only target:
- **Stroke:** 2–3px, dark gray (`#424242`)
- **Fill:** None (transparent background)
- **Size:** Exact match to paired shape (or slightly larger for visual clarity)
- **Rounded corners:** Match shape's corner radius for consistency
- **Interaction area:** Silhouette target is tappable within full bounding box (not just stroke)

---

## Components

### 1. Shape Tile (Interactive)

**States:**
- **Idle:** Shape in original color, no glow, default scale (1.0x)
- **Selected:** Glow + scale (1.15x), golden radiant shadow, instant feedback
- **Matched:** Fades over 300–500ms (opacity 1.0 → 0.0), removed from layout after fade

**Interaction:**
- Tap to select (if not already selected)
- Tap a different shape to switch selection (old shape deselected)
- Rapid taps on other shapes while one is selected are ignored

**Animation:**
- Selection glow: Instant (<50ms) or very brief entrance
- Scale: Smooth easing with slight bounce on arrival
- Fade (on match): Smooth opacity transition over 300–500ms

**Sizing:** Responsive; scales with viewport. Always ≥48px on all devices.

### 2. Silhouette Target (Interactive)

**States:**
- **Idle:** Outline only (stroke: 2–3px, `#424242`), no fill
- **Hover/Focus:** Optional subtle highlight (slight color shift or glow, Phase 2+)
- **Mismatch feedback:** Optional pulse or shake (brief, <300ms), visual acknowledgment that tap registered

**Interaction:**
- Tap to attempt a match with selected shape
- If match succeeds: shape snaps in, fades at origin, vibration + sound
- If mismatch: silhouette shakes (optional visual), shape returns to original position, vibration + sound

**Sizing:** Same as paired shape, or slightly larger for visual clarity.

**Accessibility:** Minimum 48px × 48px touch target.

### 3. Selection Glow (Visual Feedback)

**Definition:**
- Radiant golden glow applied to selected shape
- Glow color: `#FFD54F` (warm, friendly)
- Glow properties: Gaussian blur 20–30px, spread 4–8px, low opacity (0.6–0.8)
- Scale combined: Selected shape scales 1.15x simultaneously

**Purpose:** Clear visual cue that shape is selected; friendly and joyful.

**Duration:** Instant or <50ms entrance; persists until shape is deselected or matched.

### 4. Match Success Feedback (Combined)

**Visual:**
- Shape snaps into silhouette (smooth easing, slight bounce, 400–500ms)
- Origin shape fades at starting location (300–500ms, smooth opacity)
- Silhouette may brighten or fill with shape color (optional; deferred to Phase 2)

**Audio:** Success sound (~0.5–1s, cheerful tone)

**Haptic:** Medium vibration (100–150ms)

**Result:** Child sees and feels the match succeed; shape is now "locked" in place.

### 5. Mismatch Feedback (Combined)

**Visual:**
- Silhouette shakes or pulses briefly (200–300ms, subtle feedback)
- Selected shape returns to original position (smooth easing, 300ms)

**Audio:** Mismatch sound (~0.3–0.5s, gentle descending tone, quieter than success)

**Haptic:** Light vibration (50–100ms, slightly different from success)

**Result:** Child understands the error; shape is ready to retry or select a new shape.

**Key:** Shape remains selected after mismatch, allowing immediate retry without re-tapping the shape.

### 6. Mute Toggle (UI Control)

**Location:** Top-right corner, visible but not intrusive

**Visual:**
- Icon: Simple speaker icon (sound on) or muted speaker (sound off)
- Size: ~32px, tap-friendly
- Color: Neutral gray or subtle branding color
- State feedback: Icon changes on tap; visual confirmation (brief animation or color shift)

**Functionality:**
- Toggles all sounds: success, mismatch, round-start (if present), round-end (if present)
- Vibration is NOT muted (independent of audio toggle, can be managed separately if needed)
- State persists for session (reset on page reload; remember-me not required for Phase 1)

**Accessibility:** 48px minimum tap target, clear icon or tooltip on hover.

---

## Do's and Don'ts

### Do's ✓

- ✓ **Use rounded corners throughout.** Friendly, non-threatening aesthetic for young children.
- ✓ **Provide immediate visual + haptic feedback** for every tap. No guessing whether the game heard the tap.
- ✓ **Keep the background clean and simple.** Whitespace is your friend; it reduces cognitive overload.
- ✓ **Celebrate success visibly.** When shapes snap in, make it feel triumphant (glow, scale, sound, vibration).
- ✓ **Make errors gentle and recoverable.** Mismatch feedback is soft; shape returns for retry, no punishment.
- ✓ **Use warm, saturated colors.** Energy and joy, but not harsh or eye-straining.
- ✓ **Test touch targets on real devices.** 48px CSS pixels on small hands; ensure they're tappable from arm's reach.
- ✓ **Adapt to screen rotation seamlessly.** If tablet rotates, game reflows but state persists.
- ✓ **Keep sounds brief and cheerful.** Audio is supportive, not intrusive or scary.

### Don'ts ✗

- ✗ **Don't use busy backgrounds or patterns.** Visual clutter distracts from shapes and interaction.
- ✗ **Don't rely on color alone for shape distinction.** Each shape must be recognizable by silhouette, even without color.
- ✗ **Don't use small, hard-to-read fonts.** If text appears, keep it large (32px+) and simple.
- ✗ **Don't make shapes too small or too close together.** Minimum 48px × 48px per target; ≥8px gap between shapes.
- ✗ **Don't make errors scary or punitive.** No red "X" marks, no sad sounds, no point deductions. Gentle guidance only.
- ✗ **Don't use harsh colors or flashing effects.** No seizure-inducing patterns; keep animations smooth and calm.
- ✗ **Don't overwhelm with animations or effects.** Phase 1 is clean and focused. Celebration animations come in Phase 2.
- ✗ **Don't hide mute toggle or critical controls.** Make audio control obvious; parent needs quick access.
- ✗ **Don't create delay between tap and feedback.** Latency should be <100ms; a 4-year-old expects instant response.
- ✗ **Don't collect data, show ads, or impose paywalls.** Safe, trust-focused experience for parent and child.

---

## Cross-References

- **EXPERIENCE.md** specifies behavioral details, state management, and interaction flows that realize these visual components
- **EXPERIENCE.md § Component Patterns** defines the state machine for shapes and silhouettes (idle → selected → matched, etc.)
- **EXPERIENCE.md § Key Flows** walks through real user journeys where these visuals come alive

---

**Document Status:** `final` (Phase 1 visual design complete; ready for implementation)
