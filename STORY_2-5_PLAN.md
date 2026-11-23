# Story 2-5: Shape Fading on Match (Visual Cause-and-Effect)

## Acceptance Criteria

✅ **Given** a shape has been successfully matched to a silhouette  
✅ **When** the shape animation completes  
✅ **Then** the original shape position fades out over 0.3–0.5 seconds (smooth opacity transition)  
✅ **And** fade is not abrupt/instant removal  
✅ **And** silhouette position shows the shape filled with its color or highlighted  
✅ **And** fading happens after match animation (shape snaps in, then fades)  
✅ **And** CSS transition is used for performance (60 FPS)  

---

## Current State Analysis

### What Currently Happens
1. User taps matching silhouette
2. `attemptMatch()` adds shape to `matchedShapes`
3. App.tsx renders: `if (matched) return null` → shape disappears instantly
4. Silhouette remains, now filled with shape color

### What Should Happen (Story 2-5)
1. User taps matching silhouette
2. Shape animates to silhouette (500ms)
3. Shape stays in silhouette position, then fades out (400-500ms)
4. Total animation: ~1000ms (500ms snap + 500ms fade)
5. Silhouette remains filled with shape color

---

## Implementation Changes

### 1. App.tsx - Keep matched shapes in DOM longer
Instead of returning null immediately, render them with `.is-matched` class and let CSS/animation handle removal.

### 2. App.css - Enhance matched shape animation
- Change from `display: none` to opacity fade-out
- Duration: 400-500ms (smooth, not instant)
- Use CSS transition on opacity
- Add animation delay to let snap-in animation complete first

### 3. App.tsx - Remove from DOM after fade completes
After shape fades out (1000ms total = 500ms snap + 500ms fade), mark as truly gone or use CSS to hide.

---

## Implementation Strategy

### Option A: CSS-Only (Preferred)
- Keep matched shape in DOM
- Use `.is-matched` class to trigger fade animation
- After animation completes, shape is opacity: 0 and pointer-events: none
- Effectively "gone" but doesn't add significant overhead

### Option B: Timeout Removal
- Keep matched shape in DOM with `.is-matched` class
- CSS animates opacity fade
- After 1000ms (snap + fade), JavaScript removes from DOM
- Pro: Cleaner DOM; Con: More complex timing

---

## Test Cases to Verify

1. Shape fades out after match (not instant removal)
2. Fade duration is 400-500ms (measured)
3. Fade starts AFTER snap-in animation completes
4. Silhouette shows filled shape color during and after fade
5. Multiple matched shapes fade independently
6. Full round can complete with all shapes fading
7. Fade works across all screen sizes/devices

---

## Files to Modify

1. `src/App.tsx` - Change matched shape rendering logic
2. `src/App.css` - Enhance `.is-matched` animation
3. `src/App.test.tsx` - Verify fade animation (if needed)

---

## Success Criteria

- ✅ Shape fades smoothly (not instant)
- ✅ Fade duration: 400-500ms
- ✅ Fade happens AFTER snap-in (not simultaneous)
- ✅ Silhouette remains visible and filled
- ✅ All existing tests still pass
- ✅ Build succeeds
- ✅ No console errors
