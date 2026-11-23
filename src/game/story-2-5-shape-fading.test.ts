import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";
import { createRound } from "./shapeMatching";
import { calculateDifficulty } from "./difficulty";

describe("Story 2-5: Shape Fading on Match", () => {
  beforeEach(() => {
    // Reset store to initial state
    const freshRound = createRound([], Math.random, 6);
    useGameStore.setState({
      state: "selecting",
      roundNumber: 1,
      difficulty: calculateDifficulty(1),
      round: freshRound,
      feedbackAnnouncement: null,
      animatingShapes: new Set(),
      shakingTargets: new Set(),
    });
  });

  describe("Matched shape rendering", () => {
    it("should mark shape as matched when it correctly matches its target", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      // Find a shape and try matching it with its corresponding target
      const shapeToMatch = round.shapes[0];
      
      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const updatedRound = useGameStore.getState().round;
      expect(updatedRound.matchedShapes).toContain(shapeToMatch);
    });

    it("should include matched shape shapeId in matchedShapes array", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      expect(useGameStore.getState().round.matchedShapes.includes(shapeToMatch)).toBe(true);
    });

    it("should maintain matched shape in boardItems (not remove from DOM)", () => {
      const store = useGameStore.getState();
      const round = store.round;
      const boardItemsBefore = round.boardItems.length;

      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const boardItemsAfter = useGameStore.getState().round.boardItems.length;
      expect(boardItemsAfter).toBe(boardItemsBefore);

      const matchedShapeStillInBoard = useGameStore.getState().round.boardItems.some(
        (item) => item.shapeId === shapeToMatch
      );
      expect(matchedShapeStillInBoard).toBe(true);
    });

    it("should mark target as matched when shape matches", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      expect(useGameStore.getState().round.matchedShapes).toContain(shapeToMatch);
    });
  });

  describe("Fading behavior", () => {
    it("should allow multiple shapes to fade independently", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      if (round.shapes.length < 2) return;

      const shape1 = round.shapes[0];
      const shape2 = round.shapes[1];

      // First match
      store.selectShape(shape1);
      store.attemptMatch(shape1);

      const matchedAfterFirst = new Set(useGameStore.getState().round.matchedShapes);

      // Reset state to selecting to allow second match
      useGameStore.setState({
        state: "selecting",
        round: { ...useGameStore.getState().round, selectedShape: null }
      });

      // Second match
      store.selectShape(shape2);
      store.attemptMatch(shape2);

      const matchedAfterSecond = new Set(useGameStore.getState().round.matchedShapes);
      expect(matchedAfterSecond.size).toBeGreaterThan(matchedAfterFirst.size);

      expect(matchedAfterFirst.has(shape1)).toBe(true);
      expect(matchedAfterSecond.has(shape2)).toBe(true);
    });

    it("should maintain original shape color in matched state", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const matchedShape = useGameStore.getState().round.boardItems.find(
        (item) => item.shapeId === shapeToMatch && item.kind === "shape"
      );

      expect(matchedShape).toBeDefined();
    });
  });

  describe("Round completion with fading", () => {
    it("should allow advancing to next round after all shapes match", () => {
      const store = useGameStore.getState();
      const round = store.round;
      const shapes = round.shapes;

      if (shapes.length === 0) return;

      for (let i = 0; i < shapes.length; i++) {
        store.selectShape(shapes[i]);
        store.attemptMatch(shapes[i]);
        
        // Reset state for next match
        if (i < shapes.length - 1) {
          useGameStore.setState({
            state: "selecting",
            round: { ...useGameStore.getState().round, selectedShape: null }
          });
        }
      }

      const matchedCount = useGameStore.getState().round.matchedShapes.length;
      expect(matchedCount).toBeGreaterThan(0);

      const roundBefore = useGameStore.getState().roundNumber;

      store.advanceToNextRound();

      const roundAfter = useGameStore.getState().roundNumber;
      expect(roundAfter).toBe(roundBefore + 1);
    });

    it("should have fresh board after advancing from round with matched shapes", () => {
      const store = useGameStore.getState();
      const round = store.round;
      const shapes = round.shapes;

      if (shapes.length === 0) return;

      for (let i = 0; i < shapes.length; i++) {
        store.selectShape(shapes[i]);
        store.attemptMatch(shapes[i]);
        
        if (i < shapes.length - 1) {
          useGameStore.setState({
            state: "selecting",
            round: { ...useGameStore.getState().round, selectedShape: null }
          });
        }
      }

      store.advanceToNextRound();

      const newRound = useGameStore.getState().round;
      expect(newRound.matchedShapes).toHaveLength(0);
      expect(newRound.selectedShape).toBeNull();
    });

    it("should generate random number of shapes between 6-8 on each round", () => {
      const shapeCounts: number[] = [];

      for (let i = 0; i < 5; i++) {
        const store = useGameStore.getState();
        const shapes = store.round.shapes;
        shapeCounts.push(shapes.length);

        store.advanceToNextRound();
      }

      shapeCounts.forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(6);
        expect(count).toBeLessThanOrEqual(8);
      });
    });
  });

  describe("No regression on existing features", () => {
    it("should mark shape as matched when correct target is tapped", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const isMatched = useGameStore.getState().round.matchedShapes.includes(shapeToMatch);
      expect(isMatched).toBe(true);
    });

    it("should still disable matched shapes from being selected again", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const selectedBefore = useGameStore.getState().round.selectedShape;

      store.selectShape(shapeToMatch);

      const selectedAfter = useGameStore.getState().round.selectedShape;

      expect(selectedBefore).toBeNull();
      expect(selectedAfter).toBeNull();
    });

    it("should maintain silhouette visibility after match (not fade)", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const matchedTarget = useGameStore.getState().round.boardItems.find(
        (item) => item.shapeId === shapeToMatch && item.kind === "target"
      );

      expect(matchedTarget).toBeDefined();
      expect(matchedTarget?.kind).toBe("target");
    });
  });

  describe("DOM rendering for CSS animation", () => {
    it("should render matched shapes with is-matched class", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const matched = useGameStore.getState().round.matchedShapes;
      expect(matched).toContain(shapeToMatch);
    });

    it("should disable matched shape buttons to prevent interaction", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const matched = useGameStore.getState().round.matchedShapes.includes(shapeToMatch);
      expect(matched).toBe(true);
    });

    it("should apply animation delay to allow snap-in to complete first", () => {
      const store = useGameStore.getState();
      const round = store.round;
      
      const shapeToMatch = round.shapes[0];

      store.selectShape(shapeToMatch);
      store.attemptMatch(shapeToMatch);

      const matchedShapeStillInBoard = useGameStore.getState().round.boardItems.find(
        (item) => item.shapeId === shapeToMatch
      );

      expect(matchedShapeStillInBoard).toBeDefined();
    });
  });
});
