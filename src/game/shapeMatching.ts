import { SHAPE_CATALOG, SHAPES_PER_ROUND, type ShapeId } from "./shapeCatalog";

export interface ShapeRound {
  shapes: ShapeId[];
  targets: ShapeId[];
  boardItems: BoardItem[];
  selectedShape: ShapeId | null;
  matchedShapes: ShapeId[];
}

export interface BoardPosition {
  x: number;
  y: number;
}

export interface BoardItem {
  kind: "shape" | "target";
  shapeId: ShapeId;
  position: BoardPosition;
}

const POSITION_FRAME_WIDTH = 304;
const POSITION_FRAME_HEIGHT = 280;
const POSITION_PADDING = 26;
const MIN_POSITION_DISTANCE = 58;
const MIN_AXIS_DISTANCE = 6;
const MAX_POSITION_ATTEMPTS = 50000;
const FALLBACK_BOARD_POSITIONS: readonly BoardPosition[] = [
  { x: 234.661, y: 195.718 },
  { x: 132.937, y: 87.926 },
  { x: 220.112, y: 97.516 },
  { x: 146.383, y: 158.011 },
  { x: 32.274, y: 138.613 },
  { x: 110.049, y: 220.022 },
  { x: 60.112, y: 79.619 },
  { x: 195.341, y: 37.767 },
  { x: 42.714, y: 233.807 },
  { x: 170.796, y: 246.263 },
  // Additional positions for 7-8 shape rounds (all within padding bounds: 26-278 x, 26-254 y)
  { x: 268.5, y: 42.3 },
  { x: 51.2, y: 32.7 },
  { x: 275.3, y: 128.5 },
  { x: 72.8, y: 184.2 },
  { x: 158.6, y: 240.1 },
  { x: 270.7, y: 219.4 },
];

export type MatchResult =
  | "matched"
  | "mismatch"
  | "no-selection"
  | "already-matched";

export interface MatchAttempt {
  round: ShapeRound;
  result: MatchResult;
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function hasSameShapeSet(first: readonly ShapeId[], second: readonly ShapeId[]): boolean {
  return first.length === second.length && first.every((shapeId) => second.includes(shapeId));
}

function createBoardPositions(random: () => number, shapeCount: number = SHAPES_PER_ROUND): BoardPosition[] {
  const positions: BoardPosition[] = [];
  let attempts = 0;
  const targetPositionCount = shapeCount * 2; // shapes + targets

  while (positions.length < targetPositionCount && attempts < MAX_POSITION_ATTEMPTS) {
    attempts += 1;
    const x =
      POSITION_PADDING +
      random() * (POSITION_FRAME_WIDTH - POSITION_PADDING * 2);
    const y =
      POSITION_PADDING +
      random() * (POSITION_FRAME_HEIGHT - POSITION_PADDING * 2);
    const hasSpace = positions.every((position) => {
      const horizontalDistance = x - position.x;
      const verticalDistance = y - position.y;
      return (
        Math.abs(horizontalDistance) >= MIN_AXIS_DISTANCE &&
        Math.abs(verticalDistance) >= MIN_AXIS_DISTANCE &&
        Math.max(Math.abs(horizontalDistance), Math.abs(verticalDistance)) >=
          MIN_POSITION_DISTANCE
      );
    });

    if (hasSpace) {
      positions.push({ x, y });
    }
  }

  if (positions.length !== targetPositionCount) {
    console.warn("Could not randomize all game piece positions; using a safe layout.");
    return FALLBACK_BOARD_POSITIONS.slice(0, Math.min(targetPositionCount, FALLBACK_BOARD_POSITIONS.length)).map(({ x, y }) => ({
      x: (x / POSITION_FRAME_WIDTH) * 100,
      y: (y / POSITION_FRAME_HEIGHT) * 100,
    }));
  }

  return positions.map(({ x, y }) => ({
    x: (x / POSITION_FRAME_WIDTH) * 100,
    y: (y / POSITION_FRAME_HEIGHT) * 100,
  }));
}

export function createRound(
  previousShapes: readonly ShapeId[] = [],
  random: () => number = Math.random,
  shapesCount: number = SHAPES_PER_ROUND,
): ShapeRound {
  const catalogShapeIds = SHAPE_CATALOG.map((shape) => shape.id);

  if (catalogShapeIds.length <= shapesCount) {
    throw new Error("The shape catalog must contain more shapes than a round.");
  }

  const shuffledCatalog = shuffle(catalogShapeIds, random);
  const shapes = shuffledCatalog.slice(0, shapesCount);

  if (hasSameShapeSet(shapes, previousShapes)) {
    shapes[shapesCount - 1] = shuffledCatalog[shapesCount];
  }

  const targets = shuffle(shapes, random);
  if (targets.every((shapeId, index) => shapeId === shapes[index])) {
    targets.push(targets.shift()!);
  }

  const boardItemOrder = shuffle(
    [
      ...shapes.map((shapeId) => ({ kind: "shape" as const, shapeId })),
      ...targets.map((shapeId) => ({ kind: "target" as const, shapeId })),
    ],
    random,
  );
  const positions = createBoardPositions(random, shapesCount);
  const boardItems = boardItemOrder.map((item, index) => ({
    ...item,
    position: positions[index],
  }));

  return {
    shapes,
    targets,
    boardItems,
    selectedShape: null,
    matchedShapes: [],
  };
}

export function selectShape(round: ShapeRound, shapeId: ShapeId): ShapeRound {
  if (round.matchedShapes.includes(shapeId)) {
    return round;
  }

  return {
    ...round,
    selectedShape: round.selectedShape === shapeId ? null : shapeId,
  };
}

export function attemptMatch(round: ShapeRound, targetShape: ShapeId): MatchAttempt {
  if (round.matchedShapes.includes(targetShape)) {
    return { round, result: "already-matched" };
  }

  if (round.selectedShape === null) {
    return { round, result: "no-selection" };
  }

  if (round.selectedShape === targetShape) {
    return {
      round: {
        ...round,
        selectedShape: null,
        matchedShapes: [...round.matchedShapes, targetShape],
      },
      result: "matched",
    };
  }

  // On mismatch, keep the shape selected for immediate retry
  return {
    round: round,
    result: "mismatch",
  };
}

export function isRoundComplete(round: ShapeRound): boolean {
  return round.matchedShapes.length === round.shapes.length;
}
