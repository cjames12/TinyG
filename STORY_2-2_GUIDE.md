# Story 2-2: Difficulty Progression - Implementation Guide

## What Was Delivered

### Core Files Created/Modified:

1. **`src/game/difficulty.ts`** (NEW)
   - `calculateDifficulty(roundNumber)` - Maps round → difficulty tier
   - `getRotationForDifficulty(difficulty, random)` - Silhouette rotation per tier
   - `getScaleForDifficulty(difficulty, random)` - Silhouette scaling per tier
   - `getColorVariationForDifficulty(difficulty, random)` - Color shift per tier

2. **`src/game/gameStore.ts`** (UPDATED)
   - Added `roundNumber: number` property
   - Added `difficulty: DifficultyLevel` property
   - Added `advanceToNextRound()` action
   - Updated `initializeRound()` to use difficulty-based shape count

3. **`src/game/difficulty.test.ts`** (NEW)
   - 18 comprehensive tests
   - Covers all difficulty tiers, boundaries, progressions

4. **`src/game/gameStore.test.ts`** (UPDATED)
   - Added 30 new Story 2-2 tests
   - Covers round tracking, difficulty calculation, state observability

---

## Difficulty Progression

| Round | Level | Shapes | Rotation | Scaling | Color Var |
|-------|-------|--------|----------|---------|-----------|
| 1-2   | Easy  | 6      | ❌       | ❌      | ❌        |
| 3-5   | Med   | 7      | ✅       | ✅      | ❌        |
| 6+    | Hard  | 8      | ✅       | ✅      | ✅        |

---

## Usage in React

```typescript
import { useGameStore } from './game/gameStore';
import { getRotationForDifficulty, getScaleForDifficulty } from './game/difficulty';

export function GameComponent() {
  const { roundNumber, difficulty, round } = useGameStore();

  return (
    <div>
      <h2>Round {roundNumber} ({difficulty.level})</h2>
      {round.targets.map((targetId) => {
        const rotation = getRotationForDifficulty(difficulty, Math.random);
        const scale = getScaleForDifficulty(difficulty, Math.random);
        
        return (
          <SilhouetteComponent
            key={targetId}
            id={targetId}
            rotation={rotation}
            scale={scale}
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`
            }}
          />
        );
      })}
    </div>
  );
}
```

---

## Advancing to Next Round

```typescript
const store = useGameStore.getState();

// When round completes, advance to next round
store.advanceToNextRound();

// Now:
// - roundNumber increments (e.g., 1 → 2)
// - difficulty recalculates (e.g., easy → medium at round 3)
// - new round created with correct shape count
// - state resets to 'selecting'
```

---

## Test Commands

```bash
# Run all tests
npm test -- --run

# Run just Story 2-2 difficulty tests
npm test -- difficulty --run

# Run just Story 2-2 gameStore tests
npm test -- gameStore --run

# Run specific test suite
npm test -- "Round creation" --run
```

---

## Key Design Decisions

✅ **Deterministic RNG**: All variation functions accept `random()` parameter  
✅ **Pure Functions**: difficulty.ts has no side effects  
✅ **Observable State**: roundNumber and difficulty exposed in Zustand  
✅ **Lazy Evaluation**: Variations calculated per-round as needed  
✅ **Type-Safe**: Full TypeScript, no `any` types  

---

## Ready for Integration

✅ All 48 Story 2-2 tests passing  
✅ No existing tests broken  
✅ Ready for Story 2-3: Round Completion & Auto-Reset

**Next: Use `advanceToNextRound()` when last shape is matched in Story 2-3**
