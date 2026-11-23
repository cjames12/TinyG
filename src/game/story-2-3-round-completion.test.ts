import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";
import { createRound } from "./shapeMatching";

describe("Story 2-3: Round Completion & Auto-Reset", () => {
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

  describe("Round completion detection", () => {
    it("should recognize round is not complete when no matches", () => {
      const store = useGameStore.getState();
      expect(store.round.matchedShapes.length).toBe(0);
      expect(store.round.matchedShapes.length === store.round.shapes.length).toBe(false);
    });

    it("should recognize round is complete when all shapes matched", () => {
      const store = useGameStore.getState();
      
      // Manually mark all shapes as matched (simulating game play)
      store.round.matchedShapes = [...store.round.shapes];
      
      expect(store.round.matchedShapes.length).toBe(store.round.shapes.length);
      expect(store.round.matchedShapes.length).toBe(6); // Easy has 6 shapes
    });

    it("should handle partial matches without completing round", () => {
      const store = useGameStore.getState();
      const halfMatched = store.round.shapes.slice(0, 3);
      
      store.round.matchedShapes = halfMatched;
      
      expect(store.round.matchedShapes.length).toBe(3);
      expect(store.round.matchedShapes.length === store.round.shapes.length).toBe(false);
    });
  });

  describe("Round auto-reset with difficulty progression", () => {
    it("should advance to next round when calling advanceToNextRound", () => {
      const store = useGameStore.getState();
      const initialRound = store.roundNumber;
      
      store.advanceToNextRound();
      
      const updated = useGameStore.getState();
      expect(updated.roundNumber).toBe(initialRound + 1);
    });

    it("should reset state when advancing to next round", () => {
      const store = useGameStore.getState();
      
      // Set some state
      store.round.matchedShapes = [...store.round.shapes];
      store.round.selectedShape = store.round.shapes[0];
      store.feedbackAnnouncement = "Test";
      
      // Advance round
      store.advanceToNextRound();
      
      const updated = useGameStore.getState();
      expect(updated.round.matchedShapes).toEqual([]);
      expect(updated.round.selectedShape).toBeNull();
      expect(updated.feedbackAnnouncement).toBeNull();
      expect(updated.state).toBe("selecting");
    });

    it("should create new round with difficulty-based shape count after progression", () => {
      const store = useGameStore.getState();
      
      // Advance to round 2 (still easy, still 6 shapes)
      store.advanceToNextRound();
      let updated = useGameStore.getState();
      expect(updated.round.shapes.length).toBe(6);
      
      // Advance to round 3 (medium, now 7 shapes)
      store.advanceToNextRound();
      updated = useGameStore.getState();
      expect(updated.round.shapes.length).toBe(7);
      expect(updated.difficulty.level).toBe("medium");
      expect(updated.roundNumber).toBe(3);
    });
  });

  describe("Celebration message timing", () => {
    it("should allow setting celebration announcement", () => {
      const store = useGameStore.getState();
      
      store.setFeedbackAnnouncement("Great job!");
      
      const updated = useGameStore.getState();
      expect(updated.feedbackAnnouncement).toBe("Great job!");
    });

    it("should clear celebration announcement after showing", () => {
      const store = useGameStore.getState();
      
      store.setFeedbackAnnouncement("Great job!");
      expect(useGameStore.getState().feedbackAnnouncement).toBe("Great job!");
      
      store.setFeedbackAnnouncement(null);
      expect(useGameStore.getState().feedbackAnnouncement).toBeNull();
    });
  });

  describe("Continuous play flow", () => {
    it("should allow playing multiple rounds sequentially", () => {
      const store = useGameStore.getState();
      const roundsPlayed = [];
      
      // Play through rounds 1-5
      for (let i = 0; i < 5; i++) {
        const current = useGameStore.getState();
        roundsPlayed.push({
          round: current.roundNumber,
          level: current.difficulty.level,
          shapes: current.round.shapes.length,
        });
        
        // Advance to next round
        store.advanceToNextRound();
      }
      
      // Verify progression
      expect(roundsPlayed[0].round).toBe(1);
      expect(roundsPlayed[0].level).toBe("easy");
      expect(roundsPlayed[0].shapes).toBe(6);
      
      expect(roundsPlayed[1].round).toBe(2);
      expect(roundsPlayed[1].level).toBe("easy");
      expect(roundsPlayed[1].shapes).toBe(6);
      
      expect(roundsPlayed[2].round).toBe(3);
      expect(roundsPlayed[2].level).toBe("medium");
      expect(roundsPlayed[2].shapes).toBe(7);
      
      expect(roundsPlayed[4].round).toBe(5);
      expect(roundsPlayed[4].level).toBe("medium");
      expect(roundsPlayed[4].shapes).toBe(7);
    });

    it("should handle unlimited rounds without breaking", () => {
      const store = useGameStore.getState();
      
      // Play through 50 rounds
      for (let i = 0; i < 50; i++) {
        store.advanceToNextRound();
      }
      
      const final = useGameStore.getState();
      expect(final.roundNumber).toBe(51);
      expect(final.difficulty.level).toBe("hard");
      expect(final.round.shapes.length).toBe(8);
    });

    it("should maintain proper difficulty tiers through continuous play", () => {
      let store = useGameStore.getState();
      expect(store.roundNumber).toBe(1);
      expect(store.difficulty.level).toBe("easy");
      
      // Advance to round 6 (hard tier)
      for (let i = 0; i < 5; i++) {
        store.advanceToNextRound();
        store = useGameStore.getState(); // Get fresh state after each advance
      }
      
      // Verify final round is in hard tier (round 6)
      expect(store.roundNumber).toBe(6);
      expect(store.difficulty.level).toBe("hard");
    });
  });

  describe("No round limits", () => {
    it("should not have game over state", () => {
      const store = useGameStore.getState();
      
      // Play many rounds
      for (let i = 0; i < 100; i++) {
        store.advanceToNextRound();
      }
      
      const final = useGameStore.getState();
      
      // Should still be in a playable state
      expect(final.state).toBe("selecting");
      expect(final.roundNumber).toBe(101);
      // No "game over" property should exist
      expect((final as unknown as Record<string, unknown>).gameOver).toBeUndefined();
    });

    it("should maintain valid game state at high round numbers", { timeout: 10000 }, () => {
      const store = useGameStore.getState();
      
      // Jump to round 1000
      for (let i = 0; i < 1000; i++) {
        store.advanceToNextRound();
      }
      
      const final = useGameStore.getState();
      
      // Should still have a valid, playable round
      expect(final.roundNumber).toBe(1001);
      expect(final.round.shapes.length).toBe(8); // Hard mode
      expect(final.round.targets.length).toBe(8);
      expect(final.round.boardItems.length).toBe(16); // 8 shapes + 8 targets
      expect(final.state).toBe("selecting");
    });
  });

  describe("No scoring or winning state", () => {
    it("should not have score tracking", () => {
      const store = useGameStore.getState();
      
      // No score property should exist
      expect((store as unknown as Record<string, unknown>).score).toBeUndefined();
      expect((store as unknown as Record<string, unknown>).points).toBeUndefined();
    });

    it("should not have winning condition", () => {
      const store = useGameStore.getState();
      
      // Play many rounds
      for (let i = 0; i < 100; i++) {
        store.advanceToNextRound();
      }
      
      const final = useGameStore.getState();
      
      // No game won state
      expect((final as unknown as Record<string, unknown>).won).toBeUndefined();
      expect((final as unknown as Record<string, unknown>).gameWon).toBeUndefined();
      expect((final as unknown as Record<string, unknown>).victory).toBeUndefined();
    });
  });
});
