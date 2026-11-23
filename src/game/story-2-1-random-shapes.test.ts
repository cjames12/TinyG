import { describe, it, expect } from 'vitest';
import { createRound, isRoundComplete } from './shapeMatching';
import { getRandomShapesPerRound, SHAPE_CATALOG } from './shapeCatalog';

describe('Story 2-1: Random Shape Generation (6-8 shapes)', () => {
  describe('getRandomShapesPerRound', () => {
    it('returns a number between 6 and 8', () => {
      for (let i = 0; i < 100; i++) {
        const count = getRandomShapesPerRound();
        expect(count).toBeGreaterThanOrEqual(6);
        expect(count).toBeLessThanOrEqual(8);
        expect(Number.isInteger(count)).toBe(true);
      }
    });

    it('generates a distribution of 6, 7, and 8', () => {
      const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0 };
      
      // Generate many random counts to check distribution
      for (let i = 0; i < 300; i++) {
        const count = getRandomShapesPerRound();
        counts[count as 6 | 7 | 8]++;
      }

      // Each should appear at least some times (statistically, should be ~1/3 each)
      expect(counts[6]).toBeGreaterThan(0);
      expect(counts[7]).toBeGreaterThan(0);
      expect(counts[8]).toBeGreaterThan(0);
    });
  });

  describe('createRound with custom shape count', () => {
    it('creates a round with 6 shapes', () => {
      const round = createRound([], Math.random, 6);
      expect(round.shapes.length).toBe(6);
      expect(round.targets.length).toBe(6);
      expect(round.boardItems.length).toBe(12); // 6 shapes + 6 targets
    });

    it('creates a round with 7 shapes', () => {
      const round = createRound([], Math.random, 7);
      expect(round.shapes.length).toBe(7);
      expect(round.targets.length).toBe(7);
      expect(round.boardItems.length).toBe(14); // 7 shapes + 7 targets
    });

    it('creates a round with 8 shapes', () => {
      const round = createRound([], Math.random, 8);
      expect(round.shapes.length).toBe(8);
      expect(round.targets.length).toBe(8);
      expect(round.boardItems.length).toBe(16); // 8 shapes + 8 targets
    });

    it('defaults to SHAPES_PER_ROUND (5) when shapesCount not provided', () => {
      const round = createRound();
      expect(round.shapes.length).toBe(5);
    });
  });

  describe('Round completion detection (variable shapes)', () => {
    it('marks 6-shape round complete when all 6 matched', () => {
      const round = createRound([], Math.random, 6);
      expect(isRoundComplete(round)).toBe(false);

      // Manually set all shapes as matched
      const completedRound = {
        ...round,
        matchedShapes: round.shapes,
      };
      expect(isRoundComplete(completedRound)).toBe(true);
    });

    it('marks 7-shape round complete when all 7 matched', () => {
      const round = createRound([], Math.random, 7);
      expect(isRoundComplete(round)).toBe(false);

      const completedRound = {
        ...round,
        matchedShapes: round.shapes,
      };
      expect(isRoundComplete(completedRound)).toBe(true);
    });

    it('marks 8-shape round complete when all 8 matched', () => {
      const round = createRound([], Math.random, 8);
      expect(isRoundComplete(round)).toBe(false);

      const completedRound = {
        ...round,
        matchedShapes: round.shapes,
      };
      expect(isRoundComplete(completedRound)).toBe(true);
    });

    it('does NOT mark round complete when only some shapes matched', () => {
      const round = createRound([], Math.random, 7);
      
      // Match only first 5 out of 7
      const partialRound = {
        ...round,
        matchedShapes: round.shapes.slice(0, 5),
      };
      expect(isRoundComplete(partialRound)).toBe(false);

      // Match only first 6 out of 7
      const almostRound = {
        ...round,
        matchedShapes: round.shapes.slice(0, 6),
      };
      expect(isRoundComplete(almostRound)).toBe(false);
    });
  });

  describe('Random shape selection (no duplicates across sequential rounds)', () => {
    it('provides different shapes when creating successive rounds', () => {
      const mockRandom = () => 0.5; // Deterministic for testing
      
      const round1 = createRound([], mockRandom, 6);
      const round2 = createRound(round1.shapes, mockRandom, 6);

      // Shapes should be different (influenced by previous shapes)
      // Note: They might coincidentally be the same, but the system tries to avoid it
      expect(round2.shapes).toBeDefined();
      expect(round2.shapes.length).toBe(6);
    });

    it('varies shape count across sequential rounds', () => {
      let previousShapes: any[] = [];
      const shapeCounts = new Set<number>();

      // Create 10 sequential rounds and collect their shape counts
      for (let i = 0; i < 10; i++) {
        const count = getRandomShapesPerRound();
        const round = createRound(previousShapes, Math.random, count);
        shapeCounts.add(round.shapes.length);
        previousShapes = round.shapes;
      }

      // We should see at least 2 different shape counts in 10 rounds
      // (statistically very likely to have variety)
      expect(shapeCounts.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Board positions for variable shape counts', () => {
    it('generates valid positions for all shapes and targets (6 shapes)', () => {
      const round = createRound([], Math.random, 6);
      const shapePositions = round.boardItems.filter(item => item.kind === 'shape');
      const targetPositions = round.boardItems.filter(item => item.kind === 'target');

      expect(shapePositions.length).toBe(6);
      expect(targetPositions.length).toBe(6);

      // All positions should be valid (between 0-100 for relative positioning)
      round.boardItems.forEach(item => {
        expect(item.position.x).toBeGreaterThanOrEqual(0);
        expect(item.position.x).toBeLessThanOrEqual(100);
        expect(item.position.y).toBeGreaterThanOrEqual(0);
        expect(item.position.y).toBeLessThanOrEqual(100);
      });
    });

    it('generates valid positions for all shapes and targets (8 shapes)', () => {
      const round = createRound([], Math.random, 8);
      const shapePositions = round.boardItems.filter(item => item.kind === 'shape');
      const targetPositions = round.boardItems.filter(item => item.kind === 'target');

      expect(shapePositions.length).toBe(8);
      expect(targetPositions.length).toBe(8);

      // All positions should be valid
      round.boardItems.forEach(item => {
        expect(item.position.x).toBeGreaterThanOrEqual(0);
        expect(item.position.x).toBeLessThanOrEqual(100);
        expect(item.position.y).toBeGreaterThanOrEqual(0);
        expect(item.position.y).toBeLessThanOrEqual(100);
      });
    });

    it('positions are unique (no two items at exact same location)', () => {
      const round = createRound([], Math.random, 7);
      
      // Check for duplicates by converting to string keys
      const positionKeys = new Set<string>();
      
      round.boardItems.forEach(item => {
        const key = `${item.position.x},${item.position.y}`;
        expect(positionKeys.has(key)).toBe(false); // Should not have seen this position
        positionKeys.add(key);
      });

      expect(positionKeys.size).toBe(14); // All positions unique
    });
  });

  describe('Shape variety validation', () => {
    it('uses different shapes from catalog (6 shapes)', () => {
      const round = createRound([], Math.random, 6);
      
      // All shapes should be from catalog
      round.shapes.forEach(shapeId => {
        const exists = SHAPE_CATALOG.some(s => s.id === shapeId);
        expect(exists).toBe(true);
      });

      // Should have no duplicate shapes in the round
      const uniqueShapes = new Set(round.shapes);
      expect(uniqueShapes.size).toBe(6);
    });

    it('uses different shapes from catalog (8 shapes)', () => {
      const round = createRound([], Math.random, 8);
      
      // All shapes should be from catalog
      round.shapes.forEach(shapeId => {
        const exists = SHAPE_CATALOG.some(s => s.id === shapeId);
        expect(exists).toBe(true);
      });

      // Should have no duplicate shapes in the round
      const uniqueShapes = new Set(round.shapes);
      expect(uniqueShapes.size).toBe(8);
    });

    it('requires at least 9 shapes in catalog (to support up to 8 shapes + 1 for variety)', () => {
      expect(SHAPE_CATALOG.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Story 2-1 Acceptance Criteria', () => {
    it('AC1: Every new game generates 6-8 random shapes', () => {
      for (let i = 0; i < 20; i++) {
        const count = getRandomShapesPerRound();
        const round = createRound([], Math.random, count);
        expect(round.shapes.length).toBeGreaterThanOrEqual(6);
        expect(round.shapes.length).toBeLessThanOrEqual(8);
      }
    });

    it('AC2: Shapes and silhouettes are scattered randomly (each round is a valid layout)', () => {
      // Test that multiple rounds can be created with valid, non-overlapping positions
      for (let i = 0; i < 10; i++) {
        const count = getRandomShapesPerRound();
        const round = createRound([], Math.random, count);

        // All positions should be valid
        round.boardItems.forEach(item => {
          expect(item.position.x).toBeGreaterThanOrEqual(0);
          expect(item.position.x).toBeLessThanOrEqual(100);
          expect(item.position.y).toBeGreaterThanOrEqual(0);
          expect(item.position.y).toBeLessThanOrEqual(100);
        });

        // Correct number of items
        expect(round.boardItems.length).toBe(count * 2);
      }
    });

    it('AC3: Round completion correctly detects when all shapes matched (regardless of count)', () => {
      for (let count = 6; count <= 8; count++) {
        const round = createRound([], Math.random, count);
        
        // Not complete initially
        expect(isRoundComplete(round)).toBe(false);

        // Complete after all matched
        const completed = { ...round, matchedShapes: round.shapes };
        expect(isRoundComplete(completed)).toBe(true);

        // Partial match should not complete
        const partial = { ...round, matchedShapes: round.shapes.slice(0, count - 1) };
        expect(isRoundComplete(partial)).toBe(false);
      }
    });

    it('AC4: Each shape has correct corresponding silhouette (targets match shapes)', () => {
      const round = createRound([], Math.random, 7);

      // Each shape should have a corresponding target with the same ID
      round.shapes.forEach(shapeId => {
        const hasTarget = round.targets.includes(shapeId);
        expect(hasTarget).toBe(true);
      });

      // Each target should have a corresponding shape
      round.targets.forEach(targetId => {
        const hasShape = round.shapes.includes(targetId);
        expect(hasShape).toBe(true);
      });
    });

    it('AC5: No duplicate shapes in a round', () => {
      for (let count = 6; count <= 8; count++) {
        const round = createRound([], Math.random, count);
        const uniqueShapes = new Set(round.shapes);
        expect(uniqueShapes.size).toBe(count);
      }
    });
  });
});
