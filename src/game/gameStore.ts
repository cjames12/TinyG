import { create } from 'zustand';
import type { ShapeId } from './shapeCatalog';
import type { ShapeRound } from './shapeMatching';
import { createRound, selectShape, attemptMatch } from './shapeMatching';
import { calculateDifficulty, type DifficultyLevel } from './difficulty';

export type GameState =
  | 'idle'
  | 'selecting'
  | 'matching'
  | 'feedback'
  | 'animating'
  | 'roundComplete';

interface GameStore {
  // State
  state: GameState;
  roundNumber: number; // 1-based round count
  difficulty: DifficultyLevel; // Current difficulty based on round number
  round: ShapeRound;
  feedbackAnnouncement: string | null;
  animatingShapes: Set<ShapeId>;
  shakingTargets: Set<ShapeId>;

  // Actions
  initializeRound: () => void;
  advanceToNextRound: () => void;
  selectShape: (shapeId: ShapeId) => void;
  attemptMatch: (targetId: ShapeId) => void;
  setFeedbackAnnouncement: (announcement: string | null) => void;
  addAnimatingShape: (shapeId: ShapeId) => void;
  removeAnimatingShape: (shapeId: ShapeId) => void;
  addShakingTarget: (shapeId: ShapeId) => void;
  removeShakingTarget: (shapeId: ShapeId) => void;
  startNewRound: () => void;

  // Validation
  canTransitionTo: (nextState: GameState) => boolean;
  canProcessTap: (shapeId: ShapeId) => boolean;
}

// Valid state transitions
const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  idle: ['selecting'],
  selecting: ['selecting', 'roundComplete'],
  feedback: ['animating', 'selecting'],
  animating: ['selecting', 'roundComplete'],
  matching: ['feedback', 'selecting'],
  roundComplete: ['selecting', 'idle'],
};

const initialDifficulty = calculateDifficulty(1);
const initialRound = createRound([], Math.random, initialDifficulty.shapeCount);
if (!initialRound) {
  throw new Error('Failed to create initial round for game store');
}

export const useGameStore = create<GameStore>()(
  (set, get) => ({
      state: 'selecting' as GameState,
      roundNumber: 1,
      difficulty: initialDifficulty,
      round: initialRound,
      feedbackAnnouncement: null,
      animatingShapes: new Set(),
      shakingTargets: new Set(),

      canTransitionTo: (nextState: GameState) => {
        const current = get().state;
        return VALID_TRANSITIONS[current].includes(nextState);
      },

      canProcessTap: (shapeId: ShapeId): boolean => {
        const store = get();
        
        // Cannot tap if animating or shaking
        if (store.animatingShapes.has(shapeId) || store.shakingTargets.has(shapeId)) {
          return false;
        }

        // Cannot tap if already matched
        if (store.round.matchedShapes.includes(shapeId)) {
          return false;
        }

        return true;
      },

      initializeRound: () => {
        const store = get();
        const newDifficulty = calculateDifficulty(store.roundNumber);
        set(
          () => ({
            state: 'selecting',
            difficulty: newDifficulty,
            round: createRound([], Math.random, newDifficulty.shapeCount),
            feedbackAnnouncement: null,
            animatingShapes: new Set(),
            shakingTargets: new Set(),
          }),
        );
      },

      advanceToNextRound: () => {
        const store = get();
        const nextRoundNumber = store.roundNumber + 1;
        const newDifficulty = calculateDifficulty(nextRoundNumber);
        set(
          () => ({
            state: 'selecting',
            roundNumber: nextRoundNumber,
            difficulty: newDifficulty,
            round: createRound([], Math.random, newDifficulty.shapeCount),
            feedbackAnnouncement: null,
            animatingShapes: new Set(),
            shakingTargets: new Set(),
          }),
        );
      },

      selectShape: (shapeId: ShapeId) => {
        set((state) => {
          if (state.state !== 'selecting') {
            console.warn(
              `Cannot select shape in ${state.state} state`,
            );
            return state;
          }

          // Guard: prevent selecting already-matched shapes
          if (state.round.matchedShapes.includes(shapeId)) {
            return state;
          }

          const newRound = selectShape(state.round, shapeId);
          
          return { 
            round: newRound,
          };
        });
      },

      attemptMatch: (targetId: ShapeId) => {
        set((state) => {
          if (state.state !== 'selecting') {
            console.warn(
              `Cannot attempt match in ${state.state} state`,
            );
            return state;
          }

          const result = attemptMatch(state.round, targetId);
          return {
            state: 'feedback',
            round: result.round,
          };
        });
      },

      setFeedbackAnnouncement: (announcement: string | null) => {
        set(() => ({
          feedbackAnnouncement: announcement,
        }));
      },

      addAnimatingShape: (shapeId: ShapeId) => {
        set((state) => {
          const newSet = new Set(state.animatingShapes);
          newSet.add(shapeId);
          if (state.state === 'feedback') {
            return {
              state: 'animating',
              animatingShapes: newSet,
            };
          }
          return { animatingShapes: newSet };
        });
      },

      removeAnimatingShape: (shapeId: ShapeId) => {
        set((state) => {
          const newSet = new Set(state.animatingShapes);
          newSet.delete(shapeId);
          if (newSet.size === 0 && state.shakingTargets.size === 0) {
            return {
              state: 'selecting',
              animatingShapes: newSet,
            };
          }
          return { animatingShapes: newSet };
        });
      },

      addShakingTarget: (shapeId: ShapeId) => {
        set((state) => {
          const newSet = new Set(state.shakingTargets);
          newSet.add(shapeId);
          if (state.state === 'feedback') {
            return {
              state: 'animating',
              shakingTargets: newSet,
            };
          }
          return { shakingTargets: newSet };
        });
      },

      removeShakingTarget: (shapeId: ShapeId) => {
        set((state) => {
          const newSet = new Set(state.shakingTargets);
          newSet.delete(shapeId);
          if (newSet.size === 0 && state.animatingShapes.size === 0) {
            return {
              state: 'selecting',
              shakingTargets: newSet,
            };
          }
          return { shakingTargets: newSet };
        });
      },

      startNewRound: () => {
        set((state) => {
          if (!state.canTransitionTo('roundComplete')) {
            console.warn(
              `Invalid transition: ${state.state} -> roundComplete`,
            );
            return state;
          }
          return { state: 'roundComplete' };
        });
      },
    }),
);
