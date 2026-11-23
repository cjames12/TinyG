# Story 2-2 Integration Guide for Story 2-3

This guide shows how Story 2-3 (Round Completion & Auto-Reset) will use Story 2-2's difficulty system.

---

## Current App.tsx Structure

```typescript
// App.tsx uses these store features:
const { 
  round,
  selectedShape,
  matchedShapes,
  animatingShapes,
  feedbackAnnouncement,
} = useGameStore();
```

---

## Story 2-3 Will Add

```typescript
// Add these to App.tsx destructuring:
const { 
  round,
  selectedShape,
  matchedShapes,
  animatingShapes,
  feedbackAnnouncement,
  
  roundNumber,          // 👈 NEW (from Story 2-2)
  difficulty,           // 👈 NEW (from Story 2-2)
  advanceToNextRound,   // 👈 NEW (from Story 2-2)
} = useGameStore();
```

---

## Rendering Silhouettes with Variations

```typescript
import { 
  getRotationForDifficulty, 
  getScaleForDifficulty,
  getColorVariationForDifficulty 
} from './game/difficulty';

// In your silhouette rendering loop:
{round.boardItems
  .filter(item => item.kind === 'target')
  .map(item => {
    // Get variations based on current difficulty
    const rotation = getRotationForDifficulty(difficulty, Math.random);
    const scale = getScaleForDifficulty(difficulty, Math.random);
    const colorVar = getColorVariationForDifficulty(difficulty, Math.random);
    
    return (
      <button
        key={item.shapeId}
        className="target-button"
        style={{
          transform: `
            translate(${item.position.x}px, ${item.position.y}px)
            rotate(${rotation}deg)
            scale(${scale})
          `,
          // Apply color lightness shift if hard mode
          filter: colorVar !== 0 
            ? `brightness(${100 + colorVar}%)` 
            : 'none'
        }}
      >
        {/* Silhouette SVG or shape */}
      </button>
    );
  })
}
```

---

## Detecting Round Completion

```typescript
// When all shapes are matched:
const allMatched = matchedShapes.length === round.shapes.length;

if (allMatched && animatingShapes.size === 0) {
  // Story 2-3: Show celebration message
  setTimeout(() => {
    // Advance to next round using Story 2-2 feature
    advanceToNextRound();
    
    // Now:
    // - roundNumber incremented
    // - difficulty recalculated
    // - new round created with correct shape count
    // - variations will be applied to new silhouettes
  }, 2000); // After 2s celebration
}
```

---

## Rendering Round Progress

```typescript
// Optional: Show current round and difficulty
<div className="game-header">
  <h2>Round {roundNumber}</h2>
  <p>Difficulty: {difficulty.level}</p>
  <p>Shapes: {difficulty.shapeCount}</p>
  
  {difficulty.hasRotation && <span>🔄 Rotations</span>}
  {difficulty.hasScaling && <span>📏 Scaling</span>}
  {difficulty.hasColorVariation && <span>🎨 Colors</span>}
</div>
```

---

## Key Integration Points

| Feature | From Story 2-2 | Use in Story 2-3 |
|---------|-----------------|------------------|
| Round number | `roundNumber` | Display "Round X" in UI |
| Difficulty tier | `difficulty.level` | Show "Easy/Medium/Hard" badge |
| Shape count | `difficulty.shapeCount` | Already used (creates round) |
| Variations | `get*ForDifficulty()` functions | Apply to silhouettes |
| Advance round | `advanceToNextRound()` | Call when all matched |

---

## Testing Story 2-3 Integration

When testing Story 2-3, verify:

```typescript
// Before completing round 2:
expect(roundNumber).toBe(2);
expect(difficulty.level).toBe('easy');
expect(difficulty.shapeCount).toBe(6);

// Complete all matches...
// Advance round...

// After completing round 2 (now on round 3):
expect(roundNumber).toBe(3);
expect(difficulty.level).toBe('medium');  // ✅ Changed!
expect(difficulty.shapeCount).toBe(7);    // ✅ Changed!
expect(round.shapes.length).toBe(7);      // ✅ New round has 7!
```

---

## No Changes Needed to Story 2-2

✅ All Story 2-2 code is complete and production-ready  
✅ Story 2-3 just needs to integrate the existing exports  
✅ No breaking changes expected  

---

## Import Checklist for Story 2-3 Developer

```typescript
// Make sure to import:
import { useGameStore } from './game/gameStore';
import { 
  getRotationForDifficulty,
  getScaleForDifficulty, 
  getColorVariationForDifficulty 
} from './game/difficulty';

// You'll use:
// - store.roundNumber
// - store.difficulty
// - store.advanceToNextRound()
// - getRotation/Scale/ColorVariationForDifficulty()
```

---

## Handoff Summary

**From Story 2-2 to Story 2-3:**

✅ Difficulty system ready to use  
✅ Round tracking ready to use  
✅ All variation functions ready to use  
✅ Zustand integration complete  
✅ 48 tests covering all scenarios  

**Story 2-3 responsibility:**
- Detect round completion
- Show celebration UI
- Call `advanceToNextRound()`
- Apply variations to silhouettes

---

**Story 2-2 is production-ready! Story 2-3 can proceed with confidence.** 🚀
