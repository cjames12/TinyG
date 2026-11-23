---
title: "Product Requirements Document: TinyG (Shape Matching Game)"
status: draft
created: 2026-11-20
updated: 2026-11-20
---

# Product Requirements Document: TinyG

## 1. Overview

**TinyG** is a web-based touchscreen game for young children (ages 3–6) that teaches shape recognition through playful, interactive matching. The core experience is tactile and immediate: a child selects a colored shape, taps a matching silhouette, and receives instant visual and audio-haptic feedback. The game is designed to feel like play first—educational outcomes emerge naturally as the child practices and masters shapes.

**Target Player:** A 4-year-old with 10+ minute attention span, prior experience with sorting/matching apps, and a desire for continuous, joyful play.

**Platform:** Responsive web application (mobile, tablet, desktop).

---

## 2. User Personas

### Primary User: The Child (Age 4)

- **Name/Archetype:** Early Learner, Shape Explorer
- **Age & Stage:** 4 years old, turning 4 in December; right-handed; developed fine motor skills for touchscreen interaction
- **Motivation:** Curiosity about shapes; love of cause-and-effect feedback; desire for immediate rewards
- **Attention Span:** 10+ minutes of sustained engagement
- **Experience:** Has played sorting and matching games; familiar with tap-based interaction
- **Pain Point:** Frustration with games that feel slow, unclear, or don't respond immediately
- **Success Signal:** Recognizing shapes with growing confidence; smiling and asking to play again; continuous play sessions

### Secondary User: The Parent

- **Name/Archetype:** Intentional Caregiver
- **Goal:** Provide screen time that feels developmentally appropriate and brain-supporting; watch their child learn and smile
- **Definition of Success:** Child recognizes shapes, plays continuously, asks for more, smiles while playing
- **Concern:** Screen time guilt; ensuring the game is safe (no ads, no data harvesting) and genuinely educational
- **Desired Outcome:** A tool that grows with their child from shape matching (now) to richer learning games (Phase 2+)

---

## 3. Goals & Success Metrics

### Product Goals

1. **Teach shape recognition** through playful repetition and immediate feedback.
2. **Build confidence** in a 4-year-old by ensuring success is accessible and rewarding.
3. **Establish a foundation** for a family of learning games (TinyG Game Suite) that the child will grow into over years.
4. **Create joy** as the primary driver—if the child smiles and asks to play again, the game succeeded.

### Success Metrics (Phase 1)

| Metric | Target | Notes |
|--------|--------|-------|
| **Shape Mastery** | 90% correct matches across rounds | Child demonstrates reliable recognition of 6–8 shapes; occasional mistakes are acceptable |
| **Engagement** | 10+ minutes continuous play | Child sustains attention through 3–5 rounds without stopping or asking to quit |
| **Repeat Play** | Child asks to play again | Parent observes continuous or near-continuous play sessions; child initiates play (not just prompted) |
| **Smile/Delight** | Visible positive emotion | Parent observes smiling, giggling, or enthusiastic reactions to matches and feedback |
| **No Frustration** | Zero rage-quit moments | Mismatch feedback is clear and fair; child understands the error and retries without distress |

---

## 4. Phase 1: Core Requirements (Ship Now)

### 4.1 Interaction Model

**Primary Loop: Select → Match → Feedback**

1. **Selection:**
   - Child taps a colored shape on the left side of the screen
   - **Visual cue:** The selected shape becomes highlighted (e.g., glow, scale-up, or border) to confirm selection
   - Selection persists until a matching attempt is made or a new shape is selected
   - **[ASSUMPTION]** Maximum one shape selected at a time

2. **Matching Attempt:**
   - Child taps a silhouette on the right side of the screen
   - System compares the selected shape to the tapped silhouette

3. **Feedback on Success:**
   - Shape snaps/locks into the silhouette position (smooth animation, ~0.3–0.5s)
   - Success sound plays (cheerful, short, loud enough for 4-year-old ears without harm)
   - Device vibration triggers (gentle, brief haptic feedback)
   - Original shape location on the left fades/disappears (child sees cause-and-effect)
   - Selected shape is deselected; child is ready to match the next shape
   - **[ASSUMPTION]** Success feedback happens within 500ms of tap

4. **Feedback on Mismatch:**
   - Soft error sound plays (distinct from success, not scary)
   - Device vibration triggers (gentler than success, or different pattern)
   - Silhouette position briefly shakes/pulses to indicate rejection
   - Selected shape **returns to original position** on the left (this IS the undo behavior)
   - Selected shape **remains selected** so child can retry immediately or select a new shape
   - **[ASSUMPTION]** Mismatch feedback happens within 300ms of tap

### 4.2 Round Structure

- **Initial State:** 6–8 random shapes and 6–8 matching silhouettes are scattered randomly across the screen (not organized in panes)
- **Round Goal:** Match all shapes to silhouettes
- **Round Length:** Variable, estimated 3–5 minutes (depends on child's pace and accuracy)
- **Round End:** When all shapes are matched, a brief celebration message or visual appears (e.g., "Great job!" or a simple smiley), then a short pause
- **Next Round:** System shuffles 6–8 fresh shapes and silhouettes and scatters them randomly across the screen again
- **[ASSUMPTION]** No round limit; child can play continuously

### 4.3 Difficulty Progression

**Phase 1 Difficulty (Rounds 1–N):**

| Round | Shapes | Silhouette Variety | Feedback | Notes |
|-------|--------|-------------------|----------|-------|
| 1–2 | 6 | Identical positions, clear colors | Standard (sound + vibration) | Warm-up; child gains confidence |
| 3–5 | 7 | Slight rotations or size variations | Standard | Shapes recognizable despite changes |
| 6+ | 8 | Mixed: colors, rotations, sizes | Standard | Shapes require active visual matching, not just position memory |

**[ASSUMPTION]** Difficulty increases gradually to avoid frustration. Round progression is automatic; no pause for difficulty selection.

### 4.4 Shapes in Phase 1

The game includes a predefined set of 6–8 simple, colorful shapes. Each shape is:
- **Recognizable to a 4-year-old:** Circle, Square, Triangle, Star, Heart, Pentagon, Hexagon, Diamond (or similar)
- **Distinct by silhouette:** Each shape is visually different from others
- **Colorful:** Each shape has a primary color (not grayscale) to aid recognition
- **Sized for touch:** Minimum 48 CSS pixels (see Accessibility, below)

**[ASSUMPTION]** Shape set is finalized in design phase; not data-driven or randomizable beyond rounds.

### 4.5 Visual & Interaction Design

**Layout:**
- Shapes and silhouettes are **scattered randomly across the screen** (not in left/right panes)
- Both shapes and silhouettes are mixed spatially; child must explore the screen to find matches
- Creates a more dynamic, discovery-driven experience
- Responsive to screen size: scales and reflows on phone, tablet, desktop while maintaining scatter distribution

**Selection Visual Cue:**
- **Options (pick one):**
  - Soft glow around the selected shape
  - Scale up slightly (1.1x)
  - Add a colored border
  - Combination of above
- **[ASSUMPTION]** Cue is instant (no animation delay) and high-contrast enough for a 4-year-old to see clearly

**Shape Fading on Match:**
- When a shape is successfully matched, the original shape location fades over 0.3–0.5 seconds
- Silhouette at the matched location remains highlighted or filled with the shape color
- **[ASSUMPTION]** Fading is smooth (opacity transition), not abrupt removal

**Visual Polish:**
- No clutter; every visual element serves the interaction
- Rounded corners on shapes (friendlier for young children)
- Adequate whitespace to prevent cognitive overload
- Simple, friendly typography for any on-screen text (round numbers, "Great job!")
- Scattered distribution encourages exploration without overwhelming the screen

### 4.6 Audio Design

**Success Sound:**
- Duration: 0.5–1 second
- Tone: Cheerful, bright, game-like (think Mario or early video game success tones)
- Volume: Appropriate for tablet play (not ear-damaging, loud enough to hear from 1–2 feet away)
- **[ASSUMPTION]** Single success sound (not randomized variations in Phase 1)

**Mismatch Sound:**
- Duration: 0.3–0.5 seconds
- Tone: Gentle, slightly descending, not scary (e.g., soft "boing" or "nope")
- Volume: Slightly quieter than success sound
- **[ASSUMPTION]** Single mismatch sound (not randomized variations in Phase 1)

**Other Sounds:**
- Round start: Optional gentle chime or no sound (not required for Phase 1)
- Round end: Optional cheerful fanfare or smiley face (not required for Phase 1)

**Mute Option:**
- Parent-controllable toggle to mute all sounds (for bedtime or quiet environments)
- **[ASSUMPTION]** Mute toggle is in a simple settings menu or top-right corner icon

### 4.7 Haptic Feedback (Vibration)

- **Success Vibration:** 100–150ms, medium intensity (child should notice, not be startled)
- **Mismatch Vibration:** 50–100ms, slightly lighter intensity (distinct from success, acknowledges error without punishment)
- **[ASSUMPTION]** Vibration is device-dependent (iOS/Android; web API fallback for browsers without Vibration API)

### 4.8 Accessibility Requirements

**Touch Target Sizing:**
- Minimum 48 CSS pixels × 48 CSS pixels per touch target (shape or silhouette)
- Adequate spacing between targets (at least 8–12 CSS pixels) to prevent accidental overlaps
- **Standard:** WCAG 2.5.5 (Target Size)

**Color Contrast:**
- Shape colors and silhouettes should have sufficient contrast against background (at least 3:1 for graphics)
- Do not rely on color alone to distinguish shapes; each shape has a distinct silhouette
- **Standard:** WCAG 2.1.4 (Color Contrast)

**Responsive Design:**
- Game is fully playable on:
  - **Phone:** 375px wide (iPhone SE or similar)
  - **Tablet:** 768px wide (iPad or similar)
  - **Desktop:** 1024px+ wide
- Touch targets remain at least 48px on all screen sizes
- Layout adapts: shapes may stack or reflow to maintain touch-friendly spacing

**Motor & Cognitive:**
- No time pressure; child can take as long as needed to tap
- Clear, immediate feedback for all actions (no guessing whether tap registered)
- Errors are recoverable without punishment (mismatch returns shape, doesn't dock points)

**Audio:**
- All critical feedback is delivered via sound + vibration + visual (not sound alone)
- Sounds are not startling or harmful to hearing
- Mute option is available

**[ASSUMPTION]** No ARIA labels or screen-reader support in Phase 1 (game is primarily visual and tactile; audio + haptic covers accessibility intent).

---

## 5. Phase 2: Celebration & Character Traits (Future)

### Acceptance Criteria for Phase 2 Launch

**Readiness Trigger:**
- Child demonstrates 90% shape mastery across all 6–8 shapes (at least 15–20 rounds)
- Parent observes sustained engagement and repeat play for 2+ weeks
- No major frustrations or interaction blockers

### Phase 2 Features

**Celebration Animations:**
- When a shape snaps into place, a subtle particle effect appears (sparkling, confetti, or bubbles)
- Animation lasts 0.5–1 second, centered on the silhouette position
- Effect is delightful but not distracting (doesn't obscure the next shape)
- Parent can toggle celebration animations on/off (some children find them overstimulating)

**Animated Character Shapes:**
- Shapes evolve from flat silhouettes to cute, emoji-like designs with:
  - Eyes (simple dots or ovals)
  - Blinking animation (every 3–5 seconds)
  - Simple facial expressions (happy, surprised, thinking)
- Characters respond to child actions: smile when matched, seem thoughtful when waiting
- **[ASSUMPTION]** Character animations do not degrade performance; keep animation frame rate ≥60 FPS on target devices

**Non-Goals for Phase 2:**
- Multiple game modes (yet)
- Difficulty sliders or progression trees (yet)
- Parent analytics or progress tracking (yet)
- Story or narrative (yet)

---

## 6. Technical Requirements

### Platform & Tech Stack

- **Platform:** Web application (HTML5, CSS3, JavaScript or similar)
- **Responsive:** Mobile-first design; adapts to phone, tablet, desktop
- **Devices:** iOS Safari, Chrome/Android, desktop browsers (Chrome, Safari, Firefox)
- **Performance:** Target 60 FPS animations; <100ms tap-to-feedback latency

### Storage & Data

- No backend server required for Phase 1 (fully client-side)
- No persistent storage (progress tracking deferred to Phase 2+)
- No data collection or analytics (parent privacy concern implicit)
- **[ASSUMPTION]** Single-player, session-based (no multi-player or account sync)

### Key Non-Functional Requirements

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Tap Latency** | <100ms from tap to feedback | Toddler expects instant response; lag feels broken |
| **Animation Frame Rate** | 60 FPS | Smooth visuals prevent jank and distraction |
| **Load Time** | <2 seconds | Impatient 4-year-old won't wait; keep it instant |
| **Bundle Size** | <500 KB (gzipped) | Web-friendly for quick load on cellular |
| **Offline Support** | Preferred (Service Worker) | Play without internet connection |

---

## 7. Scope Boundaries

### In Scope for Phase 1

✓ 6–8 random shapes per round  
✓ Tap-to-select, tap-to-match interaction  
✓ Visual selection cue (glow, scale, border)  
✓ Success sound + locked shape in place  
✓ Mismatch vibration + sound + shape returns to start  
✓ Faded/cleared origin shape after successful match  
✓ Round replay after all matches  
✓ Accessible touch targets (48px minimum)  
✓ Responsive design (phone, tablet, desktop)  
✓ Mute toggle for sounds  
✓ Simple round counter or progress indicator  

### Out of Scope for Phase 1 (Phase 2 or Later)

✗ Celebration animations (sparkling/confetti)  
✗ Animated character shapes (emoji-like, eyes, expressions)  
✗ Multiple game modes (puzzles, coloring)  
✗ Difficulty selection or progression settings  
✗ Parent controls or progress tracking  
✗ Scoring or point systems  
✗ Leaderboards or social features  
✗ Story or narrative elements  
✗ Multiple languages (English only for Phase 1)  
✗ Screen-reader support (defer to Phase 2 if needed)  

### Explicitly Out of Scope (Never TinyG)

✗ Ads or in-app purchases  
✗ Data collection or analytics  
✗ Account creation or login  
✗ Multiplayer or competitive modes  
✗ Time pressure or "lose" conditions  
✗ Scary or punitive feedback  

---

## 8. Acceptance Criteria Summary

### Phase 1 Acceptance Criteria

**Game Playability:**
- [ ] Child can play a full round end-to-end without crashes or errors
- [ ] All 6–8 shapes can be matched successfully in a single round
- [ ] Next round appears and reshuffles 6–8 fresh shapes automatically

**Interaction:**
- [ ] Tapping a shape highlights it with clear visual cue
- [ ] Tapping a silhouette triggers success or mismatch feedback within 300–500ms
- [ ] Mismatch shape returns to original position and remains selected for retry

**Feedback:**
- [ ] Success sound plays and is distinguishable from mismatch sound
- [ ] Device vibrates on success and mismatch (distinct patterns or intensities)
- [ ] Matched shape fades/disappears from left pane clearly
- [ ] Silhouette remains highlighted after successful match

**Responsiveness:**
- [ ] Game is fully playable on phone (375px), tablet (768px), and desktop (1024px+)
- [ ] Touch targets are at least 48 CSS pixels on all screen sizes
- [ ] Layout adapts without breaking spacing or accessibility

**Accessibility:**
- [ ] All critical feedback is delivered via sound + vibration + visual
- [ ] No time pressure or score-based failure
- [ ] Mute toggle for audio is present and functional

**Performance:**
- [ ] Game loads in <2 seconds
- [ ] Animations run at 60 FPS without stuttering
- [ ] Tap-to-feedback latency is <100ms

**Edge Cases & Recovery:**
- [ ] Accidental taps on silhouettes return shape to start (no "oops" penalty)
- [ ] Rapid taps on shapes are handled gracefully (no double-selection bugs)
- [ ] Switching between shapes works smoothly (deselect, reselect)

---

## 9. Success Stories & Usage Scenarios

### Scenario 1: First-Time Player (5–10 minutes)
> **Child:** 4-year-old, first time seeing TinyG  
> **Parent:** Hands device to child, watches  
>
> Child taps a red circle. It glows. Parent says, "That's a circle! Now tap where it goes." Child taps the silhouette on the right. Circle snaps in, success sound plays, device vibrates. Child giggles. "Again!" Parent hands back device. Child plays through Rounds 1–2, matches most shapes, asks to keep playing.  
> **Outcome:** ✓ Engagement, ✓ Smile, ✓ Repeat request

### Scenario 2: Regular Learner (10–15 minutes)
> **Child:** 4-year-old, played TinyG 3–4 times this week  
> **Parent:** Child wakes up, asks "More shapes?" Parent opens TinyG  
>
> Child plays Rounds 1–4, recognizes all shapes immediately, makes few mistakes, celebrates each match with a smile. Parent observes the child mastering the interaction and shape names.  
> **Outcome:** ✓ Mastery, ✓ Continuous play, ✓ Learning visible

### Scenario 3: Mismatch Recovery (recovery from error)
> **Child:** 4-year-old, mid-round  
> **Mistake:** Child taps triangle on a square silhouette  
>
> Error sound plays. Triangle shakes at the silhouette, doesn't snap in. Triangle stays selected and returns to its spot on the left. Child tries again, taps the correct silhouette. Success! Sound, vibration, fade. Child continues unbothered.  
> **Outcome:** ✓ Clear error, ✓ Easy recovery, ✓ No frustration

---

## 10. Notes & Assumptions

**[ASSUMPTION]** Web-based platform using modern frontend tools (React, Vue, Vanilla JS—TBD in design phase).

**[ASSUMPTION]** No backend required for Phase 1; consider a simple service for Phase 2+ if progress tracking is added.

**[ASSUMPTION]** Sounds and vibration patterns are finalized by UX/Design; exact timing and intensity to be confirmed in prototyping.

**[ASSUMPTION]** Shape set is locked at 6–8 for Phase 1; randomization is shape order/position, not shape identity.

**[ASSUMPTION]** Difficulty progression is automatic per round; no manual level selection needed.

**[ASSUMPTION]** Target child is a typical 4-year-old with average motor control and attention; edge cases (special needs, accessibility) can be addressed in future phases with community feedback.

**[ASSUMPTION]** Parent context (screen time guilt, intentional design) informs all feature decisions; every feature should answer "Does this help the child learn and smile?"

---

## 11. Next Steps

1. **Design Phase:** Create visual mockups and interaction flows (wireframes)
2. **Prototype Phase:** Build interactive prototype for usability testing with target child
3. **Development Phase:** Implement Phase 1 features; test across devices
4. **Validation Phase:** Observe child playing; collect parent feedback
5. **Phase 2 Planning:** Assess 90% mastery target; scope celebration animations and character traits
6. **Launch Prep:** Finalize shapes, sounds, vibration patterns; prepare web deployment

---

**Document prepared for:** Personal passion project (TinyG Game Suite)  
**Created:** 2026-11-20  
**Status:** Draft (awaiting parent review and sign-off)
