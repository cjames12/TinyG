---
title: "TinyG Experience Design — Interaction & Behavior"
status: final
created: 2026-11-20
updated: 2026-11-20
phase: 1
document_type: experience

---

# TinyG Experience Design — Phase 1

## Foundation

**Form-Factor:** Responsive web application (mobile, tablet, desktop). Single-player, touch-optimized, session-based (no login, no account persistence).

**UI System:** None inherited; TinyG uses a custom, minimal UI focused on shapes and interaction. Visual identity defined in DESIGN.md; behavioral specifications (state, interaction, accessibility) defined here.

**Platform:** HTML5, CSS3, JavaScript (or modern framework). Client-side only; no backend required for Phase 1. Offline playable (Service Worker recommended but not mandatory).

**Key Constraints:**
- Load time <2 seconds
- Tap-to-feedback latency <100ms
- 60 FPS animation frame rate
- Touch targets ≥48 CSS pixels on all devices
- No data collection, ads, or analytics

---

## Information Architecture

### Primary Views

TinyG has a minimal information architecture: one main play view, one optional settings panel.

#### 1. **Play Screen** (Primary)

**Purpose:** Child plays the shape matching game.

**Content:**
- Scattered shapes (6–8 per round) positioned randomly across the viewport
- Scattered silhouettes (6–8 per round) positioned randomly across the viewport
- Mute toggle (top-right corner)
- Optional round counter or progress indicator (subtle, non-intrusive)

**States:**
- **Round Active:** Shapes available for selection; silhouettes available for matching
- **Shape Selected:** Selected shape highlighted with glow + scale; silhouettes ready for tap
- **Matching Attempt In Progress:** Brief (300–500ms) feedback phase; shape animates to silhouette (success) or returns (mismatch)
- **Round Complete:** All shapes matched; optional "Great job!" message; brief pause before next round shuffles

**Navigation:** No explicit navigation in Phase 1. Play is continuous; next round starts automatically after completion.

#### 2. **Settings Panel** (Optional, Collapsible)

**Purpose:** Parent controls; accessible but not in child's tap path.

**Content:**
- Mute toggle (also available as icon on Play Screen)
- Future: Volume level, difficulty settings (Phase 2+)

**Access:** Top-right corner icon (settings gear or similar); overlays Play Screen when open. Click outside or tap a "close" button to dismiss.

**Design Note:** Mute toggle appears in both Play Screen (icon) and Settings (toggle). They sync state.

---

## Voice and Tone

### Microcopy Principles

TinyG uses **minimal text**. Interaction is primarily visual and haptic.

**When text appears:**
- **Encouraging:** "Great job!", "You did it!", "Well done!"
- **Warm:** No judgment; every message feels celebratory
- **Simple:** Single phrase, large text (32px+), readable from 2 feet away
- **Action-oriented:** Guides next step without being prescriptive

**Examples:**
- Round end: "Great job!" (simple, celebratory)
- Match success: (No text; sound + vibration + visual snap)
- Mismatch: (No text; gentle error sound + vibration)

### Brand Voice

TinyG's voice is **joyful, supportive, and non-judgmental**. Every interaction celebrates the child's curiosity and effort. Errors are learning moments, never failures.

---

## Component Patterns

### 1. Shape Tile (Interactive, Stateful)

**Visual Reference:** {DESIGN.md § Components § Shape Tile}

**States:**

```
Idle
  ↓ (tap this shape)
Selected
  ↓ (tap silhouette, success)
Matched → Fading → Removed
  ↕ (tap silhouette, mismatch)
Idle (shape returns, remains selected)
  ↓ (tap different shape)
Selected (new shape, old deselected)
```

**Behavior:**

- **Idle:** Default state before or after a round. Shape in original color, no glow, default scale (1.0x).
- **Selected:** When child taps shape, it enters this state. Visual cue: glow + scale (1.15x) applied instantly (<50ms). Selection persists until:
  - Child taps a silhouette (match attempt)
  - Child taps a different shape (switch selection)
  - Round completes (all shapes matched)
- **Matched (Success):** Child tapped silhouette, match succeeded. Shape animates smoothly to silhouette position (400–500ms, cubic-bezier easing + subtle bounce on arrival). Simultaneously, origin shape location fades (opacity 1.0 → 0.0, 300–500ms). Vibration + success sound plays. Shape is now locked in place; original position is visually clear (empty or faded background).
- **Fading:** Intermediate state during fade-out of origin position. Smooth opacity transition; no interaction.
- **Removed:** After fade completes, shape position is no longer part of layout. No phantom whitespace; compact layout.
- **Return (Mismatch):** Child tapped silhouette, but it didn't match. Selected shape remains selected; it animates back to original position (300ms, smooth easing). Silhouette pulses or shakes briefly (visual feedback). Mismatch sound + light vibration plays.

**Interaction:**

- **Selection:** Tap shape to select (if not already selected). Instant visual feedback (glow + scale).
- **Deselection:** Tap a different shape to switch selection. No explicit "deselect" action.
- **Rapid Taps:** If child taps multiple shapes quickly while one is selected, only the first tap selects that shape; subsequent taps on other shapes are ignored (locked to current selection).

**Accessibility:**
- Touch target: ≥48px × 48px CSS pixels on all devices
- Color contrast: ≥3:1 against background (WCAG AA)
- Not reliant on color alone for distinction; shape silhouette is primary identifier

---

### 2. Silhouette Target (Interactive, Stateful)

**Visual Reference:** {DESIGN.md § Components § Silhouette Target}

**States:**

```
Idle (no shape selected)
  ↓ (shape is selected)
Ready (child can tap to match)
  ↓ (child taps this silhouette)
Matching (feedback in progress)
  ↓ (success)
Matched (shape locked in place, silhouette remains)
  ↕ (mismatch)
Ready (shape returns, ready to retry)
```

**Behavior:**

- **Idle:** Default state before any shape is selected. Silhouette is a simple outline (stroke, no fill). Visually present but not emphasized.
- **Ready:** A shape is currently selected. Silhouette is tappable; no visual change needed (outline remains). Implicit invitation: "tap me if I match."
- **Matching:** Child tapped this silhouette. System compares selected shape to this silhouette's pair. Feedback phase (300–500ms). Silhouette may pulse, brighten, or receive a subtle visual confirmation (optional for Phase 1; deferred to Phase 2 if needed).
- **Matched (Success):** Shape successfully matches this silhouette. Shape snaps into this position (animates from origin, 400–500ms). Silhouette remains highlighted or filled with shape color (visual confirmation). Shape is now locked here; mute feedback (no further interaction with this pair).
- **Return (Mismatch):** Shape does not match this silhouette. Silhouette shakes or pulses briefly (visual rejection, <300ms). Shape returns to original position. Silhouette returns to idle outline state; ready for retry.

**Interaction:**

- **Match Attempt:** Tap silhouette while a shape is selected. System evaluates match immediately.
- **No Multi-Match:** Cannot tap silhouette before a shape is selected; silhouette is not clickable in Idle state (no "tap here first" sequences).
- **Rapid Taps:** If child taps same silhouette multiple times while selected shape is animating, additional taps are ignored (locked during animation).

**Accessibility:**
- Touch target: ≥48px × 48px CSS pixels on all devices (bounding box, not just stroke)
- Stroke contrast: ≥3:1 against background
- Clear visual state: outline only (idle), or filled (matched)

---

### 3. Glow & Scale Selection Cue

**Visual Reference:** {DESIGN.md § Components § Selection Glow}

**Behavior:**

- **Trigger:** Child taps a shape (or taps a different shape while one is selected)
- **Entry:** Glow + scale applied instantly (<50ms) or with brief entrance animation
- **Visual:** Golden radiant glow (blur 20–30px, spread 4–8px, opacity 0.6–0.8) + 1.15x scale (smooth easing with slight bounce on arrival, 200–300ms)
- **Exit:** When shape is deselected (new shape tapped) or matched, glow + scale removed smoothly (200ms fade-out, scale back to 1.0x)
- **Persistence:** Glow + scale persist from selection until match or deselection

**Purpose:** Clear, friendly visual feedback that the shape is selected and ready to match.

---

### 4. Match Success Feedback

**Visual Reference:** {DESIGN.md § Components § Match Success Feedback}

**Trigger:** Child taps a silhouette that matches the currently selected shape.

**Timeline (Concurrent):**

| Timing | Component | Action | Duration |
|--------|-----------|--------|----------|
| **0–500ms** | Shape | Animates from origin to silhouette position (smooth easing + slight bounce) | 400–500ms |
| **0–500ms** | Origin Location | Fades (opacity 1.0 → 0.0, smooth easing) | 300–500ms |
| **0–50ms** | Audio | Success sound plays (cheerful, brief, ~0.5–1s) | 1s |
| **0–150ms** | Haptic | Medium vibration (100–150ms, medium intensity) | 150ms |
| **500ms+** | UI | Shape locked in place; silhouette remains highlighted; ready for next shape selection | — |

**Result:**
- Child sees the shape move and lock in place
- Origin location visually clears (fades), confirming cause-and-effect
- Sound + vibration reinforce success
- Ready for next match immediately

**Accessibility:**
- Feedback is redundant (visual + audio + haptic); no single sense is required
- Animation is smooth and predictable; not jarring or disorienting

---

### 5. Mismatch Feedback

**Visual Reference:** {DESIGN.md § Components § Mismatch Feedback}

**Trigger:** Child taps a silhouette that does NOT match the currently selected shape.

**Timeline (Concurrent):**

| Timing | Component | Action | Duration |
|--------|-----------|--------|----------|
| **0–300ms** | Silhouette | Shakes or pulses (brief visual feedback) | 200–300ms |
| **0–300ms** | Shape | Returns to original position (smooth easing, reverse animation) | 300ms |
| **0–50ms** | Audio | Mismatch sound plays (gentle descending tone, slightly quieter than success) | ~0.3–0.5s |
| **0–100ms** | Haptic | Light vibration (50–100ms, slightly lower intensity than success) | 100ms |
| **300ms+** | UI | Shape remains selected; ready for retry or new shape selection | — |

**Result:**
- Child understands the error (shape didn't match)
- Shape returns to start; no punishment or frustration
- Shape stays selected, allowing immediate retry
- Gentle feedback tone (not scary or negative)

**Accessibility:**
- Feedback is redundant and gentle; appropriate for young learner
- No "lose" condition or point deduction; purely informational

---

### 6. Mute Toggle

**Visual Reference:** {DESIGN.md § Components § Mute Toggle}

**Behavior:**

- **Location:** Top-right corner (Play Screen + Settings Panel)
- **Visual:** Speaker icon (sound on) or muted speaker (sound off)
- **Interaction:** Tap to toggle on/off
- **State Indication:** Icon changes immediately on tap; brief animation (scale or color shift) confirms state change
- **Effect:** Toggles all sounds (success, mismatch, round-start, round-end)
- **Vibration:** Not affected by mute; vibration remains active (can be managed separately if needed)
- **Persistence:** State persists for session; resets on page reload (remember-me not required Phase 1)

**Accessibility:**
- Touch target: 48px × 48px minimum
- Color contrast: ≥3:1
- Tooltip or label on hover (desktop) or long-press (mobile, Phase 2+)

---

## State Patterns

### Game State Machine

```
Game Start
  ↓
Initialize Round (shuffle 6–8 shapes and silhouettes, scatter randomly)
  ↓
Waiting for Selection
  ├─ [Child taps shape]
  ├─→ Shape Selected
  │    ├─ [Child taps silhouette]
  │    ├─→ Match Attempt (evaluate match)
  │    │    ├─ [Match succeeds]
  │    │    ├─→ Match Success Feedback (animate, sound, vibration, fade)
  │    │    │    ├─→ Waiting for Selection (ready for next shape)
  │    │    │    └─ [All shapes matched?]
  │    │    │      └─→ Round Complete
  │    │    │
  │    │    └─ [Match fails]
  │    │      └─→ Mismatch Feedback (error sound, vibration, shape returns)
  │    │         └─→ Shape Selected (ready for retry or new shape)
  │    │
  │    └─ [Child taps different shape]
  │      └─→ Shape Selected (switch selection, old shape deselected)
  │
  └─ [Rapid taps on other shapes]
    └─→ Ignored (locked to current selection)

Round Complete
  ├─ [Show optional "Great job!" message]
  ├─→ Brief pause (1–2 seconds)
  └─→ Initialize Round (next round)

Game Loop → Continuous play (no end state; child plays until parent stops)
```

### Shape Selection State

- **No Selection:** Default state; child can tap any shape
- **Selected:** One shape currently selected; selection persists until match attempt or new selection
- **Matched:** Shape is locked in place; no longer selectable

**Key Rule:** Only one shape can be selected at a time. Tapping a different shape switches selection.

### Round State

- **Active:** Round in progress; not all shapes matched yet
- **Complete:** All shapes matched; round end feedback shown
- **Transitioning:** Brief pause between round end and next round initialization

---

## Interaction Primitives

### 1. **Tap** (Primary Input)

- **Target:** Shapes (to select) or silhouettes (to match)
- **Latency:** <100ms from tap to visual/haptic feedback
- **Multi-tap:** Rapid taps are handled gracefully:
  - Taps on selected shape: ignored (already selected)
  - Taps on other shapes (while one selected): ignored (locked to current selection)
  - Taps on same silhouette (while animating): ignored (locked during feedback)
- **Touch vs Click:** Web API supports both touch events (mobile, tablet) and mouse events (desktop). Both trigger same behavior.

### 2. **Selection Feedback** (Visual + Haptic)

- **On select:** Glow + scale (instant), no haptic needed (visual feedback sufficient)
- **On match success:** Vibration (medium, 100–150ms) + sound + visual animation
- **On mismatch:** Vibration (light, 50–100ms) + sound + visual shake

### 3. **Screen Rotation Handling**

- **Trigger:** Device rotates (landscape ↔ portrait)
- **Behavior:** Game seamlessly adapts; layout reflows, shapes re-scatter, game state persists
- **Implementation:** Responsive canvas using viewport width/height; resize event listener updates layout
- **No pause:** Game continues playing if round is in progress; rotation doesn't interrupt

### 4. **Gesture Avoidance**

- **No pinch, swipe, or long-press:** Only tap is used. Simplifies interaction for young children.
- **No double-tap zoom:** Disabled via CSS (user-select: none, touch-action: manipulation)
- **No context menu:** Long-press does not trigger system context menu on Play Screen

---

## Accessibility Floor

### Motor & Cognitive

- **Touch target sizing:** Minimum 48 CSS pixels × 48 pixels (WCAG 2.5.5)
- **Touch spacing:** Minimum 8–12px gap between adjacent targets to prevent accidental overlaps
- **No time pressure:** Child can tap at their own pace; no countdown, no "lose" condition
- **Instant feedback:** Every tap receives visual + haptic response within 100ms
- **Error recovery:** Mismatch is gentle; shape returns for retry. No punishment or frustration.
- **Rapid-tap handling:** Extra taps don't cause unexpected state changes; safely ignored

### Visual

- **Color contrast:** All shape colors meet WCAG AA (≥3:1) against background
- **Shape distinction:** Each shape is identifiable by silhouette, not color alone
- **Readability:** Text (if present) is ≥32px, high contrast, sans-serif roundiness
- **No flashing:** Animations are smooth; no strobe effects or rapid flashing (seizure-safe)
- **Selection clarity:** Glow + scale make selection obvious across screen sizes

### Audio

- **Non-critical feedback:** Sound supports but doesn't replace visual/haptic feedback
- **Volume safety:** Sounds are designed for safe listening levels (not ear-damaging, loud enough to hear from 1–2 feet)
- **Mute option:** Parent can disable all sounds via top-right toggle
- **Distinct sounds:** Success and mismatch sounds are clearly different (cheerful vs. gentle error)

### Responsive Design

- **Scaling:** Game layout and touch targets scale proportionally across phone (375px), tablet (768px), desktop (1024px+)
- **Portrait & landscape:** Game adapts to both orientations seamlessly
- **High-resolution displays:** Touch targets remain ≥48px CSS pixels (not physical pixels)

### Cognitive Load

- **Minimal clutter:** Clean background, no visual noise
- **One action at a time:** Select shape, then match. No multi-step sequences.
- **Clear state:** Selected shape is obviously highlighted; no ambiguity about what's selected
- **Instant cause-and-effect:** Tap → immediate feedback. No delay or confusion.

### Edge Cases

- **No ARIA labels Phase 1:** Game is primarily visual and tactile. Audio + haptic cover accessibility intent. ARIA and screen-reader support deferred to Phase 2 if needed.
- **Color-blind friendly:** Silhouettes are distinct by shape; not reliant on color alone
- **No multi-language Phase 1:** English only. Microcopy is minimal ("Great job!"). Multi-language support deferred to Phase 2+.

---

## Key Flows

### Flow 1: First-Time Player (5–10 minutes)

**Protagonist:** Emma, age 4, first time playing TinyG

**Scenario:** Emma's parent opens TinyG on a tablet. Emma sees the shapes and is immediately curious.

**Timeline:**

1. **Game Loads:** Shapes and silhouettes are scattered randomly across screen. No instructions; visual design invites exploration.
2. **Emma Exploration Phase:** Emma taps a red circle (randomly). It glows + scales. She smiles.
3. **Emma's First Match:** Emma taps a silhouette that looks like a circle. Success! Circle snaps into place, origin fades, happy sound plays, vibration. Emma's eyes light up.
4. **Second Shape:** Emma taps a blue square. Glow + scale. Exploration continues.
5. **Mismatch (Learning Moment):** Emma taps a heart silhouette (doesn't match square). Gentle error sound, vibration, square returns to start. Emma tries again, finds the correct silhouette.
6. **Round Progress:** Emma matches 4 more shapes. Each success reinforces the pattern.
7. **Round Complete:** All 6 shapes matched. "Great job!" appears briefly. Emma laughs. Screen pauses for 1–2 seconds.
8. **Next Round:** New shapes, new scatter. Emma eagerly continues.

**Outcome:** Emma engaged, confident, asks to play more. ✓

---

### Flow 2: Regular Player (10–15 minutes)

**Protagonist:** Ethan, age 4, played TinyG 4–5 times this week

**Scenario:** Ethan asks to play TinyG again. He's familiar with the game and confident in his abilities.

**Timeline:**

1. **Game Loads:** Ethan immediately recognizes shapes and scans screen for them.
2. **Quick Selections:** Ethan taps a purple star, finds its silhouette quickly (he's learned the shapes). Match success. Next shape.
3. **Higher Confidence:** Ethan matches shapes faster than before. Success rate is high (~90%).
4. **Difficulty Progression:** Round 3 introduces slight rotations (triangle is rotated 90°). Ethan pauses, studies it, finds the match. Learning visible.
5. **Engaged Play:** Ethan plays through 5 rounds in ~15 minutes without stopping.
6. **Celebration:** Each match gets a smile or small verbal exclamation ("Yes!"). Parent observes growing mastery.
7. **Exit:** Parent gently suggests a break. Ethan asks, "One more round?" Engagement is strong.

**Outcome:** Ethan demonstrates shape mastery, continuous engagement, repeat play request. ✓

---

### Flow 3: Mismatch Recovery (Error Handling)

**Protagonist:** Maya, age 4, mid-round

**Scenario:** Maya accidentally taps a heart silhouette while a square is selected.

**Timeline:**

1. **Mismatch:** Heart silhouette pulses; gentle error sound plays; vibration (light).
2. **Recovery:** Square returns to its original position. Maya's selection remains locked on the square.
3. **Retry Mindset:** No frustration. Gentle feedback signals "not this one." Maya studies screen.
4. **Correct Match:** Maya finds the correct square silhouette and taps it. Success.
5. **Confidence Restored:** Match succeeds; sound, vibration, fade. Maya continues unbothered.

**Outcome:** Clear error; easy recovery; no frustration. ✓

---

### Flow 4: Edge Case — Screen Rotation

**Protagonist:** Kai, age 4, playing on parent's tablet

**Scenario:** Kai is mid-round when parent rotates tablet from portrait to landscape.

**Timeline:**

1. **Game Active:** Kai is selecting shapes; 3 matches completed so far.
2. **Rotation:** Parent rotates tablet 90° clockwise.
3. **Seamless Adaptation:** Game detects orientation change. Layout reflows; shapes and silhouettes re-scatter to fit new viewport. Game state (3 matches, selected shape if any) persists.
4. **Continuity:** Kai continues matching without pause. The scatter pattern is fresh but shapes are still recognizable.
5. **No Interruption:** No loading, no pause screen, no loss of progress.

**Outcome:** Seamless rotation; game continues. ✓

---

### Flow 5: Accidental Rapid Tap

**Protagonist:** Zara, age 4, excited and tapping quickly

**Scenario:** Zara taps a blue circle, then rapidly taps a yellow triangle and green square (all within 300ms) while trying to explore.

**Timeline:**

1. **First Tap:** Blue circle is selected. Glow + scale applied.
2. **Rapid Taps:** Zara taps yellow triangle and green square in quick succession.
3. **Handling:** Extra taps are ignored. Blue circle remains selected.
4. **Guidance:** No error or confusion. Blue circle is still glowing, waiting for Zara to tap a silhouette.
5. **User Intent:** Zara can now tap a silhouette to match the blue circle, or intentionally tap a *different* shape to switch selection.

**Outcome:** Graceful handling; no broken state; no frustration. ✓

---

## Responsive & Platform

### Responsive Breakpoints

TinyG uses a **uniform scaling strategy** across all screen sizes. The same layout and proportions are maintained; shapes and components scale proportionally.

| Viewport | Shapes | Layout | Touch Targets | Note |
|----------|--------|--------|----------------|------|
| **Phone** (375px) | 6–8, smaller | Compact scatter | 48px+ CSS | Minimal whitespace; shapes closer but always ≥8px gap |
| **Tablet** (768px) | 6–8, medium | Comfortable scatter | 48px+ CSS | More breathing room; shapes more spread |
| **Desktop** (1024px+) | 6–8, larger | Spacious scatter | 48px+ CSS | Maximum visual clarity; lots of exploration space |

**Scaling Formula:**
```
Responsive Shape Diameter = Base Size × (Viewport Width / 768px)
Example: 64px shape on tablet (768px) → 48px on phone (375px), 85px on desktop (1024px)
```

**Always ensure:** Touch targets remain ≥48px CSS pixels on all devices.

### Platform Considerations

**iOS Safari:**
- Vibration API: Supported (Vibration API web standard)
- Touch events: Fully supported
- Audio: Supported; autoplay may require user gesture first (tap to start game)
- Offline: Service Worker supported

**Chrome / Android:**
- Vibration API: Fully supported
- Touch events: Fully supported
- Audio: Supported
- Offline: Service Worker supported

**Desktop Browsers (Chrome, Safari, Firefox):**
- Vibration API: May not be supported (graceful degradation; sounds + visuals sufficient)
- Mouse events: Fully supported (tap → click)
- Touch events: Supported on touch-enabled devices
- Offline: Service Worker supported

**Fallbacks:**
- No vibration API: Game functions with sound + visual feedback only
- No Service Worker: Game requires internet connection (Phase 1 acceptable; Phase 2 may add offline support)
- No audio: Vibration + visual feedback sufficient; no loss of core functionality

---

## Performance Characteristics

### Load Time
- **Target:** <2 seconds (gzipped bundle <500 KB)
- **Optimization:** Lazy-load images if any; inline critical CSS; minimize JavaScript
- **Measurement:** Test on slow 3G network

### Animation Frame Rate
- **Target:** 60 FPS (smooth visuals)
- **Measurements:** Use Chrome DevTools Performance tab; profile during shape snap, fade, and glow animations
- **Optimization:** Use CSS transforms and opacity (GPU-accelerated); avoid layout thrashing

### Tap Latency
- **Target:** <100ms from tap to visual/haptic feedback
- **Measurement:** Test on real devices (iOS, Android, desktop)
- **Optimization:** Debounce rapid taps; use efficient event listeners

### Memory Usage
- **Target:** <50 MB on mobile; no memory leaks during extended play
- **Optimization:** Clean up event listeners; avoid creating new DOM elements per shape; use CSS/JS animation only
- **Measurement:** Chrome DevTools Memory tab; test 30+ minute session

---

## Notes for Implementation

### Audio Design

**Success Sound:**
- Tone: Cheerful, game-like (e.g., Mario-style "ding" or "boop")
- Duration: 0.5–1 second
- Volume: Comfortable from 1–2 feet away (not ear-damaging)
- Format: MP3 or Web Audio API synthesis

**Mismatch Sound:**
- Tone: Gentle, slightly descending (e.g., soft "boing" or "nope")
- Duration: 0.3–0.5 seconds
- Volume: Slightly quieter than success sound
- Format: MP3 or Web Audio API synthesis

**Round Start (Optional Phase 1):**
- Gentle chime or no sound (not required)

**Round End (Optional Phase 1):**
- Cheerful fanfare or smiley face (not required)

---

### Vibration Patterns

**Success Vibration:**
- Duration: 100–150ms
- Intensity: Medium (child should notice, not startle)
- Pattern: Single pulse

**Mismatch Vibration:**
- Duration: 50–100ms
- Intensity: Light (slightly lower than success)
- Pattern: Single pulse (distinct rhythm if possible, e.g., shorter burst)

**API:** Use Vibration API (`navigator.vibrate()`) with graceful fallback.

---

### Scatter Algorithm

**Random Positioning:**
- For each shape/silhouette, generate random X, Y within viewport bounds (minus safe margin)
- Minimum bounding box: 48–80px per shape
- Collision detection: If new position overlaps existing shape, offset by 8–12px or regenerate position
- Distribution: Shapes should not cluster on one side; use uniform random distribution or slight weighting to edges

**Example Algorithm:**
```
for each shape {
  do {
    x = random(safeMargin, viewportWidth - shapeSize - safeMargin)
    y = random(safeMargin, viewportHeight - shapeSize - safeMargin)
    positionValid = no collision with other shapes (gap ≥ 8px)
  } while (!positionValid)
  placeShape(x, y)
}
```

---

### Session Persistence (Phase 1)

- **No persistent storage:** Game progress is session-based. On page reload, new game starts.
- **Future (Phase 2):** Consider localStorage for session resume or basic progress tracking.

---

## Cross-References

- **DESIGN.md** specifies visual tokens, component specs, layout principles, and do's/don'ts
- **DESIGN.md § Components** provides visual implementation details for each interactive element
- Interaction patterns here (state machine, tap handling, rapid-tap logic) align with DESIGN.md visual components

---

**Document Status:** `final` (Phase 1 behavioral design complete; ready for implementation)

