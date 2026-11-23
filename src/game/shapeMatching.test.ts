import { describe, expect, it, vi } from "vitest";
import { SHAPES_PER_ROUND } from "./shapeCatalog";
import {
  attemptMatch,
  createRound,
  isRoundComplete,
  selectShape,
} from "./shapeMatching";

let deterministicSeed = 1;
const deterministicRandom = () => {
  deterministicSeed = (Math.imul(deterministicSeed, 1664525) + 1013904223) >>> 0;
  return deterministicSeed / 0x100000000;
};

describe("createRound", () => {
  it("creates five unique shapes and a different target order", () => {
    const round = createRound([], deterministicRandom);

    expect(round.shapes).toHaveLength(SHAPES_PER_ROUND);
    expect(new Set(round.shapes).size).toBe(SHAPES_PER_ROUND);
    expect(round.targets).not.toEqual(round.shapes);
    expect([...round.targets].sort()).toEqual([...round.shapes].sort());
  });

  it("scatters each shape and silhouette into a unique board position", () => {
    const round = createRound([], deterministicRandom);

    expect(round.boardItems).toHaveLength(SHAPES_PER_ROUND * 2);
    expect(round.boardItems.filter(({ kind }) => kind === "shape")).toHaveLength(
      SHAPES_PER_ROUND,
    );
    expect(round.boardItems.filter(({ kind }) => kind === "target")).toHaveLength(
      SHAPES_PER_ROUND,
    );
    expect(
      new Set(round.boardItems.map(({ kind, shapeId }) => `${kind}:${shapeId}`)).size,
    ).toBe(SHAPES_PER_ROUND * 2);

    const positions = round.boardItems.map(({ position }) => position);
    expect(new Set(positions.map(({ x }) => x)).size).toBe(SHAPES_PER_ROUND * 2);
    expect(new Set(positions.map(({ y }) => y)).size).toBe(SHAPES_PER_ROUND * 2);

    for (let first = 0; first < positions.length; first += 1) {
      for (let second = first + 1; second < positions.length; second += 1) {
        const horizontalDistance =
          ((positions[first].x - positions[second].x) * 304) / 100;
        const verticalDistance =
          ((positions[first].y - positions[second].y) * 280) / 100;

        expect(Math.abs(horizontalDistance)).toBeGreaterThanOrEqual(6);
        expect(Math.abs(verticalDistance)).toBeGreaterThanOrEqual(6);
        expect(
          Math.max(Math.abs(horizontalDistance), Math.abs(verticalDistance)),
        ).toBeGreaterThanOrEqual(58);
      }
    }

    const nextLayout = createRound([], deterministicRandom).boardItems.map(
      ({ position }) => position,
    );
    expect(nextLayout).not.toEqual(positions);
  });

  it("uses a safe fallback layout when the random source stalls", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    try {
      const positions = createRound([], () => 0).boardItems.map(
        ({ position }) => position,
      );

      expect(positions).toHaveLength(SHAPES_PER_ROUND * 2);
      for (let first = 0; first < positions.length; first += 1) {
        for (let second = first + 1; second < positions.length; second += 1) {
          const horizontalDistance =
            ((positions[first].x - positions[second].x) * 304) / 100;
          const verticalDistance =
            ((positions[first].y - positions[second].y) * 280) / 100;

          expect(Math.abs(horizontalDistance)).toBeGreaterThanOrEqual(6);
          expect(Math.abs(verticalDistance)).toBeGreaterThanOrEqual(6);
          expect(
            Math.max(Math.abs(horizontalDistance), Math.abs(verticalDistance)),
          ).toBeGreaterThanOrEqual(58);
        }
      }
      expect(warning).toHaveBeenCalledOnce();
    } finally {
      warning.mockRestore();
    }
  });

  it("chooses a different shape set from the previous round", () => {
    const previous = createRound([], deterministicRandom);
    const next = createRound(previous.shapes, deterministicRandom);

    expect([...next.shapes].sort()).not.toEqual([...previous.shapes].sort());
  });
});

describe("shape selection", () => {
  it("replaces a selected shape and toggles it off when tapped again", () => {
    const round = createRound([], deterministicRandom);
    const [first, second] = round.shapes;
    const firstSelection = selectShape(round, first);
    const secondSelection = selectShape(firstSelection, second);

    expect(firstSelection.selectedShape).toBe(first);
    expect(secondSelection.selectedShape).toBe(second);
    expect(selectShape(secondSelection, second).selectedShape).toBeNull();
  });

  it("does not select a shape that is already matched", () => {
    const round = createRound([], deterministicRandom);
    const shape = round.shapes[0];
    const selected = selectShape(round, shape);
    const matched = attemptMatch(selected, shape).round;

    expect(selectShape(matched, shape)).toBe(matched);
  });
});

describe("matching", () => {
  it("keeps selection after a mismatch for immediate retry and leaves every pair unmatched", () => {
    const round = createRound([], deterministicRandom);
    const selected = selectShape(round, round.shapes[0]);
    const otherShape = round.shapes.find((shape) => shape !== round.shapes[0])!;
    const attempt = attemptMatch(selected, otherShape);

    expect(attempt.result).toBe("mismatch");
    expect(attempt.round.selectedShape).toBe(round.shapes[0]);
    expect(attempt.round.matchedShapes).toEqual([]);
  });

  it("does nothing when a target is tapped before selecting a shape", () => {
    const round = createRound([], deterministicRandom);
    const attempt = attemptMatch(round, round.targets[0]);

    expect(attempt.result).toBe("no-selection");
    expect(attempt.round).toBe(round);
  });

  it("ignores an already-matched target without changing the current selection", () => {
    const round = createRound([], deterministicRandom);
    const firstMatch = attemptMatch(selectShape(round, round.shapes[0]), round.shapes[0]).round;
    const selected = selectShape(firstMatch, round.shapes[1]);
    const attempt = attemptMatch(selected, round.shapes[0]);

    expect(attempt.result).toBe("already-matched");
    expect(attempt.round).toBe(selected);
  });

  it("locks correct pairs and completes after all five matches", () => {
    let round = createRound([], deterministicRandom);

    for (const shapeId of round.shapes) {
      round = attemptMatch(selectShape(round, shapeId), shapeId).round;
    }

    expect(round.matchedShapes).toHaveLength(SHAPES_PER_ROUND);
    expect(isRoundComplete(round)).toBe(true);
  });
});
