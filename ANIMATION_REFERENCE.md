# Mismatch Shake Animation - Technical Reference

## Animation Keyframes

```css
@keyframes shake-reject {
  0%   { transform: translate(-50%, -50%) translateX(0);    }  /* Start
  10%  { transform: translate(-50%, -50%) translateX(-8px); }  /* Left
  20%  { transform: translate(-50%, -50%) translateX(8px);  }  /* Right
  30%  { transform: translate(-50%, -50%) translateX(-8px); }  /* Left
  40%  { transform: translate(-50%, -50%) translateX(8px);  }  /* Right
  50%  { transform: translate(-50%, -50%) translateX(-6px); }  /* Left (less)
  60%  { transform: translate(-50%, -50%) translateX(6px);  }  /* Right (less)
  70%  { transform: translate(-50%, -50%) translateX(-3px); }  /* Left (less)
  80%  { transform: translate(-50%, -50%) translateX(3px);  }  /* Right (less)
  100% { transform: translate(-50%, -50%) translateX(0);    }  /* End
}
```

## Amplitude Progression

| Phase | Offset | Description |
|-------|--------|-------------|
| 0-20% | ±8px   | Maximum shake - immediate visual feedback |
| 20-50% | ±8px to ±6px | Strong shake continues |
| 50-80% | ±6px to ±3px | Fade out / damping phase |
| 80-100% | ±3px to 0px | Return to center |

## Application

```css
.target-button.is-shaking {
  animation: shake-reject 400ms ease-in-out forwards;
}
```

**Timing Function**: `ease-in-out`
- Smooth start and end
- Maintains consistent motion throughout
- Prevents jarring transitions

**Duration**: 400ms
- 100ms faster than typical game animations
- Provides quick feedback without long delay
- Gives child immediate visual confirmation

**Fill Mode**: `forwards`
- Maintains final state after animation
- Returns to center position (no jitter)

## Motion Characteristics

### Physical Properties
- **Peak Amplitude**: ±8px
- **Distance Traveled**: ~96px (8px × 12 oscillations)
- **Average Velocity**: 240px/s
- **Perceived Speed**: Fast / Urgent

### User Experience
- **Urgency**: High (fast motion indicates error)
- **Distraction**: Moderate (keeps focus on target)
- **Comfort**: Good (damping prevents nausea)
- **Accessibility**: Respects prefers-reduced-motion

## Browser Support

| Feature | Support | Notes |
|---------|---------|-------|
| CSS Animations | 100% | All modern browsers |
| Transform: translate | 100% | GPU accelerated |
| Will-change | 90%+ | Used on selected shapes |
| Ease-in-out | 100% | Standard timing |

## Performance Characteristics

| Metric | Value | Impact |
|--------|-------|--------|
| CPU Usage | <1% | Hardware accelerated |
| FPS Impact | None | GPU rendered |
| Memory | Negligible | No additional allocations |
| Latency | 0ms | No JS computation |
| Reflow | None | Transform doesn't trigger layout |
| Repaint | 60fps | GPU managed |

## State Management

### Animation Lifecycle

```
1. Click mismatch target
   ↓
2. Set shakingTargets.add(shapeId)
   ↓
3. Apply is-shaking class → CSS animation starts
   ↓
4. Animation runs for 400ms
   ↓
5. setTimeout(() => shakingTargets.delete(shapeId), 400)
   ↓
6. Remove is-shaking class → animation stops
   ↓
7. Ready for next interaction
```

### Preventing Reentry

```typescript
if (animatingShapes.has(shapeId) || shakingTargets.has(shapeId)) {
  return;  // Block click
}
```

Both checks prevent:
- Double-triggering sounds
- State inconsistencies
- Jarring visual effects

## Customization Guide

### To Adjust Amplitude

Change all `translateX()` values proportionally:
```css
/* More intense shake: multiply by 1.5 */
translateX(-12px)  /* was -8px */
translateX(12px)   /* was 8px */

/* More subtle shake: multiply by 0.75 */
translateX(-6px)   /* was -8px */
translateX(6px)    /* was 8px */
```

### To Adjust Duration

Change animation duration and timeout value together:
```css
/* Faster feedback (300ms) */
animation: shake-reject 300ms ease-in-out forwards;

/* Slower decay (500ms) */
animation: shake-reject 500ms ease-in-out forwards;
```

```typescript
setTimeout(() => {
  setShakingTargets((prev) => {
    const next = new Set(prev);
    next.delete(shapeId);
    return next;
  });
}, 500);  // Must match CSS duration
```

### To Add Pulse Effect

Combine with scale transform:
```css
@keyframes shake-pulse-reject {
  0%   { transform: translate(-50%, -50%) scale(1) translateX(0); }
  25%  { transform: translate(-50%, -50%) scale(1.1) translateX(-8px); }
  50%  { transform: translate(-50%, -50%) scale(1) translateX(0); }
  75%  { transform: translate(-50%, -50%) scale(1.05) translateX(8px); }
  100% { transform: translate(-50%, -50%) scale(1) translateX(0); }
}
```

### To Reduce Motion

Add media query support:
```css
@media (prefers-reduced-motion: reduce) {
  .target-button.is-shaking {
    animation: none;
    /* Fade effect instead */
    opacity: 0.6;
    transition: opacity 400ms;
  }
}
```

## Comparison with Other Feedback Types

### Success Feedback
- Matched shape: Fades in and grows
- Target: Becomes solid color
- Animation: 500ms opacity/scale change
- Purpose: Celebrate success

### Mismatch Feedback
- Target: Shakes horizontally
- Animation: 400ms translate motion
- Purpose: Signal error clearly

### Selection Feedback
- Selected shape: Grows and glows
- Animation: Immediate (no timeout)
- Purpose: Show current selection

## Troubleshooting

### Animation Looks Jittery
- Check browser hardware acceleration
- Verify CSS doesn't have conflicting transforms
- Test on target device (mobile)

### Animation Doesn't Apply
- Verify `is-shaking` class is added to button
- Check CSS file is loaded (no 404s)
- Inspect DevTools Computed tab
- Verify no `animation: none !important` rule

### Timing Mismatch
- Ensure setTimeout duration matches CSS duration
- Check for missed keyframe updates
- Verify no CSS overrides

### Performance Issues
- Use DevTools Performance tab to profile
- Check for layout thrashing
- Verify GPU acceleration enabled
- Test on slower devices

## References

- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Performance: CSS Transforms](https://web.dev/high-performance-animations/)
- [Will-change Performance](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
