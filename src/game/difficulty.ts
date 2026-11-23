/**
 * Difficulty progression system for TinyG
 * 
 * Story 2-2: Difficulty Progression (Round-Based)
 * 
 * Rounds 1–2: 6 shapes with identical silhouettes (baseline difficulty)
 * Rounds 3–5: 7 shapes with slight rotations/size variations on silhouettes
 * Rounds 6+: 8 shapes with mixed color/rotation/size variations
 */

export interface DifficultyLevel {
  round: number;
  shapeCount: number; // 6, 7, or 8
  level: 'easy' | 'medium' | 'hard'; // ease grouping
  hasRotation: boolean; // silhouettes may be rotated
  hasScaling: boolean; // silhouettes may have size variations
  hasColorVariation: boolean; // silhouettes may have color shifts
}

/**
 * Calculate difficulty level based on round number
 * @param roundNumber 1-based round number
 * @returns DifficultyLevel configuration
 */
export function calculateDifficulty(roundNumber: number): DifficultyLevel {
  if (roundNumber <= 2) {
    // Rounds 1-2: Baseline difficulty
    return {
      round: roundNumber,
      shapeCount: 6,
      level: 'easy',
      hasRotation: false,
      hasScaling: false,
      hasColorVariation: false,
    };
  }

  if (roundNumber <= 5) {
    // Rounds 3-5: Slight rotations and size variations
    return {
      round: roundNumber,
      shapeCount: 7,
      level: 'medium',
      hasRotation: true,
      hasScaling: true,
      hasColorVariation: false,
    };
  }

  // Rounds 6+: Full variations
  return {
    round: roundNumber,
    shapeCount: 8,
    level: 'hard',
    hasRotation: true,
    hasScaling: true,
    hasColorVariation: true,
  };
}

/**
 * Calculate silhouette rotation (in degrees) based on difficulty
 * Returns 0 for easy rounds, 0-45 degrees for medium, 0-90 degrees for hard
 * @param difficulty DifficultyLevel configuration
 * @param random Random number generator (0-1)
 * @returns Rotation angle in degrees
 */
export function getRotationForDifficulty(difficulty: DifficultyLevel, random: () => number): number {
  if (!difficulty.hasRotation) {
    return 0; // No rotation for easy rounds
  }

  if (difficulty.level === 'medium') {
    // Slight rotations: ±0-45 degrees
    return (random() * 45 - 22.5); // -22.5 to +22.5 degrees
  }

  // Hard mode: ±0-90 degrees
  return (random() * 90 - 45); // -45 to +45 degrees
}

/**
 * Calculate silhouette scale (multiplier) based on difficulty
 * Returns 1.0 for easy rounds, 0.9-1.1 for medium, 0.85-1.15 for hard
 * @param difficulty DifficultyLevel configuration
 * @param random Random number generator (0-1)
 * @returns Scale multiplier (1.0 = original size)
 */
export function getScaleForDifficulty(difficulty: DifficultyLevel, random: () => number): number {
  if (!difficulty.hasScaling) {
    return 1.0; // No scaling for easy rounds
  }

  if (difficulty.level === 'medium') {
    // Slight size variations: 90-110% of original
    return 0.9 + random() * 0.2; // 0.9 to 1.1
  }

  // Hard mode: 85-115% of original
  return 0.85 + random() * 0.3; // 0.85 to 1.15
}

/**
 * Calculate color brightness variation (lightness delta) based on difficulty
 * Returns 0 for easy rounds, 0-10% for medium, 0-20% for hard
 * Note: This creates a lightness shift, not full color change
 * @param difficulty DifficultyLevel configuration
 * @param random Random number generator (0-1)
 * @returns Lightness delta as percentage (-100 to +100, where -100 is black)
 */
export function getColorVariationForDifficulty(difficulty: DifficultyLevel, random: () => number): number {
  if (!difficulty.hasColorVariation) {
    return 0; // No color variation for easy/medium rounds
  }

  // Hard mode: ±10% lightness variation
  return (random() * 20 - 10); // -10 to +10% lightness
}
