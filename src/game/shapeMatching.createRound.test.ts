import { describe, it, expect } from 'vitest';
import { createRound } from './shapeMatching';

describe('createRound utility', () => {
  it('creates a valid round', () => {
    const round = createRound();
    expect(round).toBeDefined();
    expect(round.shapes).toHaveLength(5);
    expect(round.boardItems).toHaveLength(10);
  });
});
