import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { createRound } from './shapeMatching';

describe('Story 1-5: Interaction State Machine', () => {
  beforeEach(() => {
    // Reset store before each test
    const freshRound = createRound();
    useGameStore.setState({
      state: 'selecting',
      round: freshRound,
      feedbackAnnouncement: null,
      animatingShapes: new Set(),
      shakingTargets: new Set(),
    });
  });

  describe('State Initialization', () => {
    it('initializes with selecting state and valid round', () => {
      const state = useGameStore.getState();
      expect(state.state).toBe('selecting');
      expect(state.round).toBeDefined();
      expect(state.round.shapes).toHaveLength(5);
      expect(state.round.boardItems).toHaveLength(10);
    });

    it('starts with no selections or animations', () => {
      const state = useGameStore.getState();
      expect(state.round.selectedShape).toBeNull();
      expect(state.animatingShapes.size).toBe(0);
      expect(state.shakingTargets.size).toBe(0);
      expect(state.feedbackAnnouncement).toBeNull();
    });
  });

  describe('Valid State Transitions', () => {
    it('allows selecting -> selecting transition (shape selection toggle)', () => {
      const store = useGameStore.getState();
      expect(store.canTransitionTo('selecting')).toBe(true);
    });

    it('allows selecting -> roundComplete transition (round completion)', () => {
      const store = useGameStore.getState();
      expect(store.canTransitionTo('roundComplete')).toBe(true);
    });

    it('prevents invalid transitions from selecting state', () => {
      const store = useGameStore.getState();
      expect(store.canTransitionTo('idle')).toBe(false);
      expect(store.canTransitionTo('matching')).toBe(false);
      expect(store.canTransitionTo('feedback')).toBe(false);
      expect(store.canTransitionTo('animating')).toBe(false);
    });

    it('allows roundComplete -> selecting transition (new round)', () => {
      useGameStore.setState({ state: 'roundComplete' });
      const store = useGameStore.getState();
      expect(store.canTransitionTo('selecting')).toBe(true);
    });

    it('allows feedback -> animating transition (animation play)', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();
      expect(store.canTransitionTo('animating')).toBe(true);
    });

    it('allows animating -> selecting transition (animation complete)', () => {
      useGameStore.setState({ state: 'animating' });
      const store = useGameStore.getState();
      expect(store.canTransitionTo('selecting')).toBe(true);
    });
  });

  describe('Shape Selection', () => {
    it('selects a shape when in selecting state', () => {
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];

      store.selectShape(shapeId);

      const updated = useGameStore.getState();
      expect(updated.round.selectedShape).toBe(shapeId);
    });

    it('toggles shape selection (deselect on tap)', () => {
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];

      store.selectShape(shapeId);
      expect(useGameStore.getState().round.selectedShape).toBe(shapeId);

      store.selectShape(shapeId);
      expect(useGameStore.getState().round.selectedShape).toBeNull();
    });

    it('switches selection to different shape', () => {
      const store = useGameStore.getState();
      const shape1 = store.round.shapes[0];
      const shape2 = store.round.shapes[1];

      store.selectShape(shape1);
      expect(useGameStore.getState().round.selectedShape).toBe(shape1);

      store.selectShape(shape2);
      expect(useGameStore.getState().round.selectedShape).toBe(shape2);
    });

    it('prevents selection in non-selecting state', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];

      // Should warn but not crash
      store.selectShape(shapeId);

      // State should not change
      expect(useGameStore.getState().round.selectedShape).toBeNull();
    });
  });

  describe('Match Attempts', () => {
    it('transitions to feedback state on match attempt', () => {
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];
      const targetId = store.round.targets[0];

      // Select shape first
      store.selectShape(shapeId);

      // Attempt match (might fail, but state should still transition)
      store.attemptMatch(targetId);

      const updated = useGameStore.getState();
      expect(updated.state).toBe('feedback');
    });

    it('prevents attempts in non-selecting state', () => {
      useGameStore.setState({ state: 'animating' });
      const store = useGameStore.getState();

      // Should warn but not crash
      store.attemptMatch(store.round.targets[0]);

      // State should not change
      expect(useGameStore.getState().state).toBe('animating');
    });
  });

  describe('Animation Management', () => {
    it('adds animating shape', () => {
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];

      store.addAnimatingShape(shapeId);

      const updated = useGameStore.getState();
      expect(updated.animatingShapes.has(shapeId)).toBe(true);
    });

    it('removes animating shape', () => {
      const store = useGameStore.getState();
      const shapeId = store.round.shapes[0];

      store.addAnimatingShape(shapeId);
      store.removeAnimatingShape(shapeId);

      const updated = useGameStore.getState();
      expect(updated.animatingShapes.has(shapeId)).toBe(false);
    });

    it('transitions to animating state when adding animation in feedback state', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();

      store.addAnimatingShape(store.round.shapes[0]);

      const updated = useGameStore.getState();
      expect(updated.state).toBe('animating');
    });

    it('returns to selecting when all animations complete', () => {
      useGameStore.setState({ state: 'animating' });
      const store = useGameStore.getState();
      const shape1 = store.round.shapes[0];

      store.addAnimatingShape(shape1);
      store.removeAnimatingShape(shape1);

      const updated = useGameStore.getState();
      expect(updated.state).toBe('selecting');
    });
  });

  describe('Feedback Announcements', () => {
    it('sets feedback announcement', () => {
      const store = useGameStore.getState();
      store.setFeedbackAnnouncement('Test announcement');

      const updated = useGameStore.getState();
      expect(updated.feedbackAnnouncement).toBe('Test announcement');
    });

    it('clears feedback announcement', () => {
      const store = useGameStore.getState();
      store.setFeedbackAnnouncement('Test');
      store.setFeedbackAnnouncement(null);

      const updated = useGameStore.getState();
      expect(updated.feedbackAnnouncement).toBeNull();
    });
  });

  describe('Round Management', () => {
    it('initializes new round when called', () => {
      const store = useGameStore.getState();
      const originalRound = store.round;

      store.initializeRound();

      const updated = useGameStore.getState();
      expect(updated.state).toBe('selecting');
      expect(updated.round).not.toBe(originalRound); // New round instance
      expect(updated.feedbackAnnouncement).toBeNull();
      expect(updated.animatingShapes.size).toBe(0);
      expect(updated.shakingTargets.size).toBe(0);
    });

    it('transitions to roundComplete state', () => {
      const store = useGameStore.getState();
      store.startNewRound();

      const updated = useGameStore.getState();
      expect(updated.state).toBe('roundComplete');
    });

    it('prevents invalid round completion transition', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();

      store.startNewRound();

      // Should warn but state should not change to invalid state
      const updated = useGameStore.getState();
      expect(updated.state).toBe('feedback');
    });
  });

  describe('Shake Animation Management', () => {
    it('adds shaking target', () => {
      const store = useGameStore.getState();
      const targetId = store.round.targets[0];

      store.addShakingTarget(targetId);

      const updated = useGameStore.getState();
      expect(updated.shakingTargets.has(targetId)).toBe(true);
    });

    it('removes shaking target', () => {
      const store = useGameStore.getState();
      const targetId = store.round.targets[0];

      store.addShakingTarget(targetId);
      store.removeShakingTarget(targetId);

      const updated = useGameStore.getState();
      expect(updated.shakingTargets.has(targetId)).toBe(false);
    });

    it('transitions to animating state when adding shake in feedback state', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();

      store.addShakingTarget(store.round.targets[0]);

      const updated = useGameStore.getState();
      expect(updated.state).toBe('animating');
    });

    it('returns to selecting when all shakes complete with no other animations', () => {
      useGameStore.setState({ state: 'animating' });
      const store = useGameStore.getState();
      const target1 = store.round.targets[0];

      store.addShakingTarget(target1);
      store.removeShakingTarget(target1);

      const updated = useGameStore.getState();
      expect(updated.state).toBe('selecting');
    });
  });

  describe('Complex State Scenarios', () => {
    it('handles feedback + multiple animations simultaneously', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();
      const shape1 = store.round.shapes[0];
      const shape2 = store.round.shapes[1];

      store.addAnimatingShape(shape1);
      expect(useGameStore.getState().state).toBe('animating');

      store.addAnimatingShape(shape2);
      expect(useGameStore.getState().state).toBe('animating');

      store.removeAnimatingShape(shape1);
      expect(useGameStore.getState().state).toBe('animating');

      store.removeAnimatingShape(shape2);
      expect(useGameStore.getState().state).toBe('selecting');
    });

    it('handles mixed animations and shakes', () => {
      useGameStore.setState({ state: 'feedback' });
      const store = useGameStore.getState();
      const shape1 = store.round.shapes[0];
      const target1 = store.round.targets[0];

      store.addAnimatingShape(shape1);
      store.addShakingTarget(target1);

      expect(useGameStore.getState().state).toBe('animating');
      expect(useGameStore.getState().animatingShapes.has(shape1)).toBe(true);
      expect(useGameStore.getState().shakingTargets.has(target1)).toBe(true);

      store.removeAnimatingShape(shape1);
      expect(useGameStore.getState().state).toBe('animating'); // Still animating because shake is active

      store.removeShakingTarget(target1);
      expect(useGameStore.getState().state).toBe('selecting');
    });

    it('complete round flow: select, attempt, animate, new round', async () => {
      let state = useGameStore.getState();
      expect(state.state).toBe('selecting');

      // Select shape
      const shapeId = state.round.shapes[0];
      state.selectShape(shapeId);
      state = useGameStore.getState();
      expect(state.round.selectedShape).toBe(shapeId);

      // Attempt match
      state.attemptMatch(state.round.targets[0]);
      state = useGameStore.getState();
      expect(state.state).toBe('feedback');

      // Animate (could be match or mismatch)
      state.addAnimatingShape(shapeId);
      state = useGameStore.getState();
      expect(state.state).toBe('animating');

      // Complete animation
      state.removeAnimatingShape(shapeId);
      state = useGameStore.getState();
      expect(state.state).toBe('selecting');

      // Complete round
      state.startNewRound();
      state = useGameStore.getState();
      expect(state.state).toBe('roundComplete');

      // New round
      state.initializeRound();
      state = useGameStore.getState();
      expect(state.state).toBe('selecting');
    });
  });
});

describe('Story 2-2: Difficulty Progression (Round-Based)', () => {
  beforeEach(() => {
    // Reset store to initial state before each test - create a fresh easy difficulty round
    const freshRound = createRound([], Math.random, 6);
    useGameStore.setState({
      state: 'selecting',
      roundNumber: 1,
      difficulty: { round: 1, shapeCount: 6, level: 'easy', hasRotation: false, hasScaling: false, hasColorVariation: false },
      round: freshRound,
      feedbackAnnouncement: null,
      animatingShapes: new Set(),
      shakingTargets: new Set(),
    });
  });

  describe('Round number tracking', () => {
    it('should initialize with round 1', () => {
      const store = useGameStore.getState();
      expect(store.roundNumber).toBe(1);
    });

    it('should increment round number when advancing to next round', () => {
      const store = useGameStore.getState();
      store.advanceToNextRound();

      const updatedStore = useGameStore.getState();
      expect(updatedStore.roundNumber).toBe(2);
    });

    it('should maintain round number across multiple advances', () => {
      const store = useGameStore.getState();

      store.advanceToNextRound(); // Round 1 -> 2
      expect(useGameStore.getState().roundNumber).toBe(2);

      store.advanceToNextRound(); // Round 2 -> 3
      expect(useGameStore.getState().roundNumber).toBe(3);

      store.advanceToNextRound(); // Round 3 -> 4
      expect(useGameStore.getState().roundNumber).toBe(4);

      store.advanceToNextRound(); // Round 4 -> 5
      expect(useGameStore.getState().roundNumber).toBe(5);

      store.advanceToNextRound(); // Round 5 -> 6
      expect(useGameStore.getState().roundNumber).toBe(6);
    });
  });

  describe('Difficulty calculation based on round number', () => {
    it('should use easy difficulty for round 1', () => {
      const store = useGameStore.getState();
      expect(store.difficulty.level).toBe('easy');
      expect(store.difficulty.shapeCount).toBe(6);
    });

    it('should use easy difficulty for round 2', () => {
      const store = useGameStore.getState();
      store.advanceToNextRound();

      const updatedStore = useGameStore.getState();
      expect(updatedStore.difficulty.level).toBe('easy');
      expect(updatedStore.difficulty.shapeCount).toBe(6);
    });

    it('should use medium difficulty starting from round 3', () => {
      const store = useGameStore.getState();
      store.advanceToNextRound(); // Round 1 -> 2
      store.advanceToNextRound(); // Round 2 -> 3

      const updatedStore = useGameStore.getState();
      expect(updatedStore.difficulty.level).toBe('medium');
      expect(updatedStore.difficulty.shapeCount).toBe(7);
      expect(updatedStore.difficulty.hasRotation).toBe(true);
      expect(updatedStore.difficulty.hasScaling).toBe(true);
      expect(updatedStore.difficulty.hasColorVariation).toBe(false);
    });

    it('should use medium difficulty through round 5', () => {
      const store = useGameStore.getState();
      for (let i = 1; i < 5; i++) {
        store.advanceToNextRound();
      }

      const updatedStore = useGameStore.getState();
      expect(updatedStore.roundNumber).toBe(5);
      expect(updatedStore.difficulty.level).toBe('medium');
      expect(updatedStore.difficulty.shapeCount).toBe(7);
    });

    it('should use hard difficulty starting from round 6', () => {
      const store = useGameStore.getState();
      for (let i = 1; i < 6; i++) {
        store.advanceToNextRound();
      }

      const updatedStore = useGameStore.getState();
      expect(updatedStore.roundNumber).toBe(6);
      expect(updatedStore.difficulty.level).toBe('hard');
      expect(updatedStore.difficulty.shapeCount).toBe(8);
      expect(updatedStore.difficulty.hasRotation).toBe(true);
      expect(updatedStore.difficulty.hasScaling).toBe(true);
      expect(updatedStore.difficulty.hasColorVariation).toBe(true);
    });

    it('should maintain hard difficulty beyond round 6', () => {
      const store = useGameStore.getState();
      for (let i = 1; i < 10; i++) {
        store.advanceToNextRound();
      }

      const updatedStore = useGameStore.getState();
      expect(updatedStore.roundNumber).toBe(10);
      expect(updatedStore.difficulty.level).toBe('hard');
      expect(updatedStore.difficulty.shapeCount).toBe(8);
    });
  });

  describe('Round creation with difficulty-based shape count', () => {
    it('should create round with 6 shapes for easy difficulty', () => {
      const store = useGameStore.getState();
      expect(store.round.shapes.length).toBe(6);
    });

    it('should create round with 7 shapes when advancing to round 3 (medium)', () => {
      const store = useGameStore.getState();
      store.advanceToNextRound(); // Round 1 -> 2
      store.advanceToNextRound(); // Round 2 -> 3

      const updatedStore = useGameStore.getState();
      expect(updatedStore.round.shapes.length).toBe(7);
    });

    it('should create round with 8 shapes when advancing to round 6 (hard)', () => {
      const store = useGameStore.getState();
      for (let i = 1; i < 6; i++) {
        store.advanceToNextRound();
      }

      const updatedStore = useGameStore.getState();
      expect(updatedStore.round.shapes.length).toBe(8);
    });

    it('should have matching count of targets to shapes', () => {
      const store = useGameStore.getState();
      expect(store.round.targets.length).toBe(store.round.shapes.length);
    });

    it('should maintain matching counts after advancing to medium difficulty', () => {
      const store = useGameStore.getState();
      store.advanceToNextRound(); // Round 1 -> 2
      store.advanceToNextRound(); // Round 2 -> 3

      const updatedStore = useGameStore.getState();
      expect(updatedStore.round.shapes.length).toBe(7);
      expect(updatedStore.round.targets.length).toBe(7);
    });
  });

  describe('Difficulty state observability', () => {
    it('should expose difficulty level in store', () => {
      const store = useGameStore.getState();
      expect(store.difficulty).toBeDefined();
      expect(store.difficulty.level).toBeDefined();
      expect(store.difficulty.shapeCount).toBeDefined();
      expect(typeof store.difficulty.hasRotation).toBe('boolean');
      expect(typeof store.difficulty.hasScaling).toBe('boolean');
      expect(typeof store.difficulty.hasColorVariation).toBe('boolean');
    });

    it('should update difficulty when round advances', () => {
      const store = useGameStore.getState();
      const initialDifficulty = store.difficulty;

      store.advanceToNextRound();
      store.advanceToNextRound();

      const updatedStore = useGameStore.getState();
      expect(updatedStore.difficulty).not.toEqual(initialDifficulty);
      expect(updatedStore.difficulty.level).toBe('medium');
    });

    it('should expose variations flags per difficulty level', () => {
      const store = useGameStore.getState();

      // Easy: no variations
      expect(store.difficulty.hasRotation).toBe(false);
      expect(store.difficulty.hasScaling).toBe(false);
      expect(store.difficulty.hasColorVariation).toBe(false);

      // Advance to medium
      store.advanceToNextRound();
      store.advanceToNextRound();
      const mediumStore = useGameStore.getState();
      expect(mediumStore.difficulty.hasRotation).toBe(true);
      expect(mediumStore.difficulty.hasScaling).toBe(true);
      expect(mediumStore.difficulty.hasColorVariation).toBe(false);

      // Advance to hard
      for (let i = 3; i < 6; i++) {
        store.advanceToNextRound();
      }
      const hardStore = useGameStore.getState();
      expect(hardStore.difficulty.hasRotation).toBe(true);
      expect(hardStore.difficulty.hasScaling).toBe(true);
      expect(hardStore.difficulty.hasColorVariation).toBe(true);
    });
  });

  describe('Progressive difficulty journey', () => {
    it('should represent complete progression from round 1 to 10', () => {
      const store = useGameStore.getState();
      const journey = [];

      // Record initial state
      journey.push({
        round: store.roundNumber,
        level: store.difficulty.level,
        shapeCount: store.difficulty.shapeCount,
      });

      // Progress through 9 more rounds
      for (let i = 0; i < 9; i++) {
        store.advanceToNextRound();
        const state = useGameStore.getState();
        journey.push({
          round: state.roundNumber,
          level: state.difficulty.level,
          shapeCount: state.difficulty.shapeCount,
        });
      }

      // Verify progression
      expect(journey[0].round).toBe(1);
      expect(journey[0].level).toBe('easy');
      expect(journey[0].shapeCount).toBe(6);

      expect(journey[1].round).toBe(2);
      expect(journey[1].level).toBe('easy');
      expect(journey[1].shapeCount).toBe(6);

      expect(journey[2].round).toBe(3);
      expect(journey[2].level).toBe('medium');
      expect(journey[2].shapeCount).toBe(7);

      expect(journey[5].round).toBe(6);
      expect(journey[5].level).toBe('hard');
      expect(journey[5].shapeCount).toBe(8);

      expect(journey[9].round).toBe(10);
      expect(journey[9].level).toBe('hard');
      expect(journey[9].shapeCount).toBe(8);
    });
  });
});

