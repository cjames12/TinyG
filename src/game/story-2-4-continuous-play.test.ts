import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";
import { createRound } from "./shapeMatching";

describe("Story 2-4: Continuous Play Without Round Limits", () => {
  beforeEach(() => {
    // Reset store to initial state
    const freshRound = createRound([], Math.random, 6);
    useGameStore.setState({
      state: "selecting",
      roundNumber: 1,
      difficulty: { round: 1, shapeCount: 6, level: "easy", hasRotation: false, hasScaling: false, hasColorVariation: false },
      round: freshRound,
      feedbackAnnouncement: null,
      animatingShapes: new Set(),
      shakingTargets: new Set(),
    });
  });

  describe("Unlimited round advancement", () => {
    it("should allow advancing to round 10", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 9; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(10);
      expect(store.round).toBeDefined();
    });

    it("should allow advancing to round 50", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 49; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(50);
    });

    it("should allow advancing to round 100", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 99; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(100);
      expect(store.state).toBe("selecting");
      expect(store.round.boardItems.length).toBeGreaterThan(0);
    });

    it("should not throw errors during many advances", () => {
      let store = useGameStore.getState();
      let errorOccurred = false;
      try {
        for (let i = 0; i < 50; i++) {
          store.advanceToNextRound();
        }
      } catch (e) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(51);
    });
  });

  describe("No game-over or winning conditions", () => {
    it("should not have gameOver property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).gameOver).toBeUndefined();
    });

    it("should not have won property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).won).toBeUndefined();
    });

    it("should not have victory property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).victory).toBeUndefined();
    });

    it("should not have gameEnded property at high rounds", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 50; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).gameEnded).toBeUndefined();
    });
  });

  describe("No scoring or points system", () => {
    it("should not have score property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).score).toBeUndefined();
    });

    it("should not have points property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).points).toBeUndefined();
    });

    it("should not have level property", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).level).toBeUndefined();
    });
  });

  describe("Difficulty progression continues indefinitely", () => {
    it("should stay in hard tier from round 6 onwards", () => {
      let store = useGameStore.getState();

      // Advance to round 6
      for (let i = 0; i < 5; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.difficulty.level).toBe("hard");
      expect(store.round.shapes.length).toBe(8);

      // Advance to round 100 and check still hard
      for (let i = 0; i < 94; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(100);
      expect(store.difficulty.level).toBe("hard");
      expect(store.round.shapes.length).toBe(8);
    });

    it("should maintain color variation from round 6 onwards", () => {
      let store = useGameStore.getState();

      // Advance to round 6
      for (let i = 0; i < 5; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.difficulty.hasColorVariation).toBe(true);

      // Advance further and verify still enabled
      for (let i = 0; i < 20; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.difficulty.hasColorVariation).toBe(true);
    });
  });

  describe("Round state freshness", () => {
    it("should create fresh rounds with no matched shapes", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 10; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.round.matchedShapes.length).toBe(0);
      expect(store.round.selectedShape).toBeNull();
    });

    it("should reset animation state after advancement", () => {
      let store = useGameStore.getState();
      store.addAnimatingShape("circle");
      store.advanceToNextRound();
      store = useGameStore.getState();
      expect(store.animatingShapes.size).toBe(0);
      expect(store.shakingTargets.size).toBe(0);
    });
  });

  describe("Child can play indefinitely", () => {
    it("should allow 50 consecutive rounds", () => {
      let store = useGameStore.getState();
      for (let round = 0; round < 50; round++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(51);
      expect(store.state).toBe("selecting");
    });

    it("should maintain stable state across many rounds", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 100; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(101);
      expect(store.state).toBe("selecting");
      expect(store.round.shapes.length).toBe(8);
      expect(store.difficulty.level).toBe("hard");
    });
  });

  describe("Parent can end session", () => {
    it("should allow state reset at any round", () => {
      let store = useGameStore.getState();
      for (let i = 0; i < 50; i++) {
        store.advanceToNextRound();
      }
      store = useGameStore.getState();
      expect(store.roundNumber).toBe(51);

      // Reset
      const freshRound = createRound([], Math.random, 6);
      useGameStore.setState({
        state: "selecting",
        roundNumber: 1,
        difficulty: { round: 1, shapeCount: 6, level: "easy", hasRotation: false, hasScaling: false, hasColorVariation: false },
        round: freshRound,
        feedbackAnnouncement: null,
        animatingShapes: new Set(),
        shakingTargets: new Set(),
      });

      store = useGameStore.getState();
      expect(store.roundNumber).toBe(1);
    });
  });

  describe("No arbitrary limits", () => {
    it("should not have hardcoded maximum rounds", () => {
      let store = useGameStore.getState();
      let roundsProcessed = 1;

      for (let i = 0; i < 100; i++) {
        store.advanceToNextRound();
        roundsProcessed++;
      }

      store = useGameStore.getState();
      expect(store.roundNumber).toBe(roundsProcessed);
      expect(store.roundNumber).toBe(101);
    });

    it("should not have history/tracking that could cause memory leaks", () => {
      const store = useGameStore.getState();
      expect((store as unknown as Record<string, unknown>).history).toBeUndefined();
      expect((store as unknown as Record<string, unknown>).completedRounds).toBeUndefined();
    });
  });
});
