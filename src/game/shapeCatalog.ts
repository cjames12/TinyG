export const SHAPE_CATALOG = [
  { id: "circle", label: "Circle", color: "#c73c27" },
  { id: "square", label: "Square", color: "#1958d9" },
  { id: "triangle", label: "Triangle", color: "#b87700" },
  { id: "rectangle", label: "Rectangle", color: "#1a7a4a" },
  { id: "oval", label: "Oval", color: "#6a2fb8" },
  { id: "star", label: "Star", color: "#d85c00" },
  { id: "heart", label: "Heart", color: "#b81357" },
  { id: "diamond", label: "Diamond", color: "#0a7c7e" },
  { id: "hexagon", label: "Hexagon", color: "#2d47b1" },
] as const;

export type ShapeId = (typeof SHAPE_CATALOG)[number]["id"];

export const SHAPES_PER_ROUND = 5; // Default for backward compatibility

export function getRandomShapesPerRound(): number {
  // For Story 2-1: Random between 6-8 shapes per round
  return Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
}

export function getShapeLabel(shapeId: ShapeId): string {
  return SHAPE_CATALOG.find((shape) => shape.id === shapeId)!.label;
}

export function getShapeColor(shapeId: ShapeId): string {
  return SHAPE_CATALOG.find((shape) => shape.id === shapeId)!.color;
}
