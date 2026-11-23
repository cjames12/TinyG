import { describe, it, expect } from "vitest";
import {
  calculateDifficulty,
  getRotationForDifficulty,
  getScaleForDifficulty,
  getColorVariationForDifficulty,
  type DifficultyLevel,
} from "./difficulty";

describe("Difficulty Progression (Story 2-2)", () => {
  describe("calculateDifficulty", () => {
    it("should return 6 shapes for round 1 (easy, no variations)", () => {
      const difficulty = calculateDifficulty(1);
      expect(difficulty.round).toBe(1);
      expect(difficulty.shapeCount).toBe(6);
      expect(difficulty.level).toBe("easy");
      expect(difficulty.hasRotation).toBe(false);
      expect(difficulty.hasScaling).toBe(false);
      expect(difficulty.hasColorVariation).toBe(false);
    });

    it("should return 6 shapes for round 2 (easy, no variations)", () => {
      const difficulty = calculateDifficulty(2);
      expect(difficulty.round).toBe(2);
      expect(difficulty.shapeCount).toBe(6);
      expect(difficulty.level).toBe("easy");
      expect(difficulty.hasRotation).toBe(false);
      expect(difficulty.hasScaling).toBe(false);
      expect(difficulty.hasColorVariation).toBe(false);
    });

    it("should return 7 shapes for round 3 (medium, with rotation and scaling)", () => {
      const difficulty = calculateDifficulty(3);
      expect(difficulty.round).toBe(3);
      expect(difficulty.shapeCount).toBe(7);
      expect(difficulty.level).toBe("medium");
      expect(difficulty.hasRotation).toBe(true);
      expect(difficulty.hasScaling).toBe(true);
      expect(difficulty.hasColorVariation).toBe(false);
    });

    it("should return 7 shapes for round 5 (medium, with rotation and scaling)", () => {
      const difficulty = calculateDifficulty(5);
      expect(difficulty.round).toBe(5);
      expect(difficulty.shapeCount).toBe(7);
      expect(difficulty.level).toBe("medium");
      expect(difficulty.hasRotation).toBe(true);
      expect(difficulty.hasScaling).toBe(true);
      expect(difficulty.hasColorVariation).toBe(false);
    });

    it("should return 8 shapes for round 6 (hard, with all variations)", () => {
      const difficulty = calculateDifficulty(6);
      expect(difficulty.round).toBe(6);
      expect(difficulty.shapeCount).toBe(8);
      expect(difficulty.level).toBe("hard");
      expect(difficulty.hasRotation).toBe(true);
      expect(difficulty.hasScaling).toBe(true);
      expect(difficulty.hasColorVariation).toBe(true);
    });

    it("should return 8 shapes for round 100 (hard, with all variations)", () => {
      const difficulty = calculateDifficulty(100);
      expect(difficulty.round).toBe(100);
      expect(difficulty.shapeCount).toBe(8);
      expect(difficulty.level).toBe("hard");
      expect(difficulty.hasRotation).toBe(true);
      expect(difficulty.hasScaling).toBe(true);
      expect(difficulty.hasColorVariation).toBe(true);
    });

    it("should handle boundary rounds correctly", () => {
      // Round 2 to 3 is a boundary (shape count increases)
      const round2 = calculateDifficulty(2);
      const round3 = calculateDifficulty(3);
      expect(round2.shapeCount).toBe(6);
      expect(round3.shapeCount).toBe(7);

      // Round 5 to 6 is a boundary (shape count increases)
      const round5 = calculateDifficulty(5);
      const round6 = calculateDifficulty(6);
      expect(round5.shapeCount).toBe(7);
      expect(round6.shapeCount).toBe(8);
    });
  });

  describe("getRotationForDifficulty", () => {
    it("should return 0 rotation for easy difficulty", () => {
      const easyDifficulty: DifficultyLevel = {
        round: 1,
        shapeCount: 6,
        level: "easy",
        hasRotation: false,
        hasScaling: false,
        hasColorVariation: false,
      };

      const rotation = getRotationForDifficulty(easyDifficulty, () => 0.5);
      expect(rotation).toBe(0);
    });

    it("should return slight rotation (±22.5°) for medium difficulty", () => {
      const mediumDifficulty: DifficultyLevel = {
        round: 3,
        shapeCount: 7,
        level: "medium",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: false,
      };

      // Test with min random (0)
      const minRotation = getRotationForDifficulty(mediumDifficulty, () => 0);
      expect(minRotation).toBeGreaterThanOrEqual(-22.5);
      expect(minRotation).toBeLessThanOrEqual(22.5);

      // Test with max random (1)
      const maxRotation = getRotationForDifficulty(mediumDifficulty, () => 1);
      expect(maxRotation).toBeGreaterThanOrEqual(-22.5);
      expect(maxRotation).toBeLessThanOrEqual(22.5);

      // Test with mid random (0.5)
      const midRotation = getRotationForDifficulty(mediumDifficulty, () => 0.5);
      expect(Math.abs(midRotation)).toBeLessThanOrEqual(22.5);
    });

    it("should return wider rotation (±45°) for hard difficulty", () => {
      const hardDifficulty: DifficultyLevel = {
        round: 6,
        shapeCount: 8,
        level: "hard",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: true,
      };

      // Test with min random (0)
      const minRotation = getRotationForDifficulty(hardDifficulty, () => 0);
      expect(minRotation).toBeGreaterThanOrEqual(-45);
      expect(minRotation).toBeLessThanOrEqual(45);

      // Test with max random (1)
      const maxRotation = getRotationForDifficulty(hardDifficulty, () => 1);
      expect(maxRotation).toBeGreaterThanOrEqual(-45);
      expect(maxRotation).toBeLessThanOrEqual(45);
    });
  });

  describe("getScaleForDifficulty", () => {
    it("should return 1.0 scale for easy difficulty", () => {
      const easyDifficulty: DifficultyLevel = {
        round: 1,
        shapeCount: 6,
        level: "easy",
        hasRotation: false,
        hasScaling: false,
        hasColorVariation: false,
      };

      const scale = getScaleForDifficulty(easyDifficulty, () => 0.5);
      expect(scale).toBe(1.0);
    });

    it("should return slight scale (0.9-1.1) for medium difficulty", () => {
      const mediumDifficulty: DifficultyLevel = {
        round: 3,
        shapeCount: 7,
        level: "medium",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: false,
      };

      // Test with min random (0)
      const minScale = getScaleForDifficulty(mediumDifficulty, () => 0);
      expect(minScale).toBeGreaterThanOrEqual(0.9);
      expect(minScale).toBeLessThanOrEqual(1.1);

      // Test with max random (1)
      const maxScale = getScaleForDifficulty(mediumDifficulty, () => 1);
      expect(maxScale).toBeGreaterThanOrEqual(0.9);
      expect(maxScale).toBeLessThanOrEqual(1.1);
    });

    it("should return wider scale (0.85-1.15) for hard difficulty", () => {
      const hardDifficulty: DifficultyLevel = {
        round: 6,
        shapeCount: 8,
        level: "hard",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: true,
      };

      // Test with min random (0)
      const minScale = getScaleForDifficulty(hardDifficulty, () => 0);
      expect(minScale).toBeGreaterThanOrEqual(0.85);
      expect(minScale).toBeLessThanOrEqual(1.15);

      // Test with max random (1)
      const maxScale = getScaleForDifficulty(hardDifficulty, () => 1);
      expect(maxScale).toBeGreaterThanOrEqual(0.85);
      expect(maxScale).toBeLessThanOrEqual(1.15);
    });
  });

  describe("getColorVariationForDifficulty", () => {
    it("should return 0 color variation for easy difficulty", () => {
      const easyDifficulty: DifficultyLevel = {
        round: 1,
        shapeCount: 6,
        level: "easy",
        hasRotation: false,
        hasScaling: false,
        hasColorVariation: false,
      };

      const variation = getColorVariationForDifficulty(easyDifficulty, () => 0.5);
      expect(variation).toBe(0);
    });

    it("should return 0 color variation for medium difficulty", () => {
      const mediumDifficulty: DifficultyLevel = {
        round: 3,
        shapeCount: 7,
        level: "medium",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: false,
      };

      const variation = getColorVariationForDifficulty(mediumDifficulty, () => 0.5);
      expect(variation).toBe(0);
    });

    it("should return color variation (±10%) for hard difficulty", () => {
      const hardDifficulty: DifficultyLevel = {
        round: 6,
        shapeCount: 8,
        level: "hard",
        hasRotation: true,
        hasScaling: true,
        hasColorVariation: true,
      };

      // Test with min random (0)
      const minVariation = getColorVariationForDifficulty(hardDifficulty, () => 0);
      expect(minVariation).toBeGreaterThanOrEqual(-10);
      expect(minVariation).toBeLessThanOrEqual(10);

      // Test with max random (1)
      const maxVariation = getColorVariationForDifficulty(hardDifficulty, () => 1);
      expect(maxVariation).toBeGreaterThanOrEqual(-10);
      expect(maxVariation).toBeLessThanOrEqual(10);
    });
  });

  describe("Difficulty progression journey", () => {
    it("should progress from easy to hard over multiple rounds", () => {
      const round1 = calculateDifficulty(1);
      const round2 = calculateDifficulty(2);
      const round3 = calculateDifficulty(3);
      const round5 = calculateDifficulty(5);
      const round6 = calculateDifficulty(6);

      // Easy phase
      expect(round1.level).toBe("easy");
      expect(round2.level).toBe("easy");
      expect(round1.shapeCount).toBe(6);
      expect(round2.shapeCount).toBe(6);

      // Medium phase starts
      expect(round3.level).toBe("medium");
      expect(round5.level).toBe("medium");
      expect(round3.shapeCount).toBe(7);
      expect(round5.shapeCount).toBe(7);

      // Hard phase starts
      expect(round6.level).toBe("hard");
      expect(round6.shapeCount).toBe(8);
    });

    it("should ensure variations only appear at appropriate difficulty levels", () => {
      const easyDifficulty = calculateDifficulty(1);
      const mediumDifficulty = calculateDifficulty(3);
      const hardDifficulty = calculateDifficulty(6);

      // Easy: no variations
      expect(easyDifficulty.hasRotation).toBe(false);
      expect(easyDifficulty.hasScaling).toBe(false);
      expect(easyDifficulty.hasColorVariation).toBe(false);

      // Medium: rotation and scaling only
      expect(mediumDifficulty.hasRotation).toBe(true);
      expect(mediumDifficulty.hasScaling).toBe(true);
      expect(mediumDifficulty.hasColorVariation).toBe(false);

      // Hard: all variations
      expect(hardDifficulty.hasRotation).toBe(true);
      expect(hardDifficulty.hasScaling).toBe(true);
      expect(hardDifficulty.hasColorVariation).toBe(true);
    });
  });
});
