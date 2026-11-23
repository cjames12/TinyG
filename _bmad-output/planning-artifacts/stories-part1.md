# EPIC 1: Shape Matching Interaction Core

Child can select shapes, attempt matches, and receive immediate feedback (success/mismatch) with sound, vibration, and animation.

## Story 1.1: Shape Selection & Visual Cue

As a child,
I want to tap a shape and see it highlighted with a glow/scale effect,
So that I know which shape I've selected.

**Acceptance Criteria:**

**Given** the game is in Round Active state with shapes visible
**When** the child taps a shape
**Then** the shape displays an instant visual cue (glow + scale-up or border)
**And** the cue appears within 50ms (no animation delay)
**And** the selection persists until a new shape is selected or a matching attempt is made
**And** only one shape can be selected at a time
**And** the visual cue has high contrast (visible to 4-year-olds)

## Story 1.2: Silhouette Tap Detection & Success Feedback

As a child,
I want to tap a silhouette and see the selected shape snap into place with sound and vibration,
So that I feel the success immediately.

**Acceptance Criteria:**

**Given** a shape is selected and a silhouette is visible
**When** the child taps a silhouette that matches the selected shape
**Then** the shape animates smoothly to the silhouette position (0.3–0.5s, cubic-bezier easing)
**And** a success sound plays (cheerful, 0.5–1s duration)
**And** the device vibrates (100–150ms, medium intensity)
**And** tap-to-feedback latency is <100ms
**And** the shape remains locked in the silhouette position (not returnable)

## Story 1.3: Mismatch Feedback & Recovery

As a child,
I want to tap a silhouette that doesn't match and have my shape return to its original position,
So that I can try again without penalty.

**Acceptance Criteria:**

**Given** a shape is selected and a silhouette is visible
**When** the child taps a silhouette that does NOT match the selected shape
**Then** the silhouette briefly shakes/pulses for 300–500ms (visual rejection)
**And** an error sound plays (gentle, 0.3–0.5s, descending tone, not scary)
**And** the device vibrates (50–100ms, lighter intensity, distinct from success)
**And** the shape smoothly returns to its original position (CSS transition, 300ms)
**And** the shape remains selected for immediate retry
**And** tap-to-feedback latency is <300ms

## Story 1.4: Shape Deselection & Multi-Shape Selection

As a child,
I want to switch between shapes by tapping different ones,
So that I can easily select the shape I want to match next.

**Acceptance Criteria:**

**Given** a shape is currently selected
**When** the child taps a different shape
**Then** the previous shape's selection cue is instantly removed
**And** the new shape displays the selection cue immediately
**And** the new shape becomes the active selection
**And** rapid taps on shapes are handled gracefully (no double-selection bugs)
**And** transition between shapes is smooth (no visual glitches)

## Story 1.5: Interaction State Machine Implementation

As a developer,
I want the game to have a robust state machine managing selection, matching, and feedback states,
So that all interactions are predictable and testable.

**Acceptance Criteria:**

**Given** the game state machine is initialized
**When** transitions occur (Select → Attempt Match → Feedback → Ready for Next)
**Then** only valid state transitions are allowed
**And** state changes are logged in Zustand store (for testing)
**And** UI components subscribe to state changes and re-render correctly
**And** no race conditions occur with rapid taps or network delays (N/A for Phase 1, but architecture allows)

---

# EPIC 2: Round Management & Shape Generation

Child experiences complete rounds: 6–8 shapes scatter randomly, matches clear them, and new rounds auto-generate with increasing difficulty.

## Story 2.1: Round Initialization & Random Shape Generation

As a child,
I want each round to display 6–8 random shapes and 6–8 matching silhouettes scattered randomly across the screen,
So that every round feels fresh and I keep learning.

**Acceptance Criteria:**

**Given** a new round is starting
**When** the game initializes the round
**Then** 6–8 unique shapes are generated (Circle, Square, Triangle, Star, Heart, Pentagon, Hexagon, Diamond)
**And** 6–8 matching silhouettes are generated
**And** shapes and silhouettes are positioned randomly across the viewport (not in fixed left/right panes)
**And** no two shapes or silhouettes overlap (8–12px minimum spacing)
**And** all shapes remain within viewport bounds with margin
**And** shape positions vary between rounds (truly random, not pseudo-random repeat)

## Story 2.2: Difficulty Progression (Round-Based)

As a child,
I want the game to gradually increase difficulty as I play more rounds,
So that I stay challenged without becoming frustrated.

**Acceptance Criteria:**

**Given** rounds are being played sequentially
**When** tracking round count (Rounds 1–2, 3–5, 6+)
**Then** Rounds 1–2: 6 shapes with identical silhouettes (baseline difficulty)
**And** Rounds 3–5: 7 shapes with slight rotations/size variations on silhouettes
**And** Rounds 6+: 8 shapes with mixed color/rotation/size variations
**And** difficulty increases automatically without player action
**And** difficulty is stored in Zustand store and observable

## Story 2.3: Round Completion & Auto-Reset

As a child,
I want all shapes to disappear when matched and move to the next round automatically,
So that the game keeps flowing without me needing to do anything.

**Acceptance Criteria:**

**Given** all 6–8 shapes have been successfully matched to silhouettes
**When** the last shape is matched
**Then** a brief celebration message ("Great job!") appears centered on screen
**And** message displays for 1–2 seconds in large, friendly text (32px+)
**And** after celebration, shapes and silhouettes fade out
**And** a new round automatically initializes with fresh shapes (no manual "Next" button needed)
**And** round count increments and difficulty is recalculated

## Story 2.4: Continuous Play Without Round Limits

As a child,
I want to play as many rounds as I want without any "game over" or limit,
So that I can keep playing as long as I enjoy it.

**Acceptance Criteria:**

**Given** rounds are being played
**When** any round completes
**Then** the next round initializes automatically
**And** there is no round limit (1st round → 100th round all work identically)
**And** no score/points system to "win" or "lose"
**And** child can play indefinitely (parent can close app or end session)

## Story 2.5: Shape Fading on Match (Visual Cause-and-Effect)

As a child,
I want the original shape to disappear when it matches into the silhouette,
So that I see the cause-and-effect of my action.

**Acceptance Criteria:**

**Given** a shape has been successfully matched to a silhouette
**When** the shape animation completes
**Then** the original shape position fades out over 0.3–0.5 seconds (smooth opacity transition)
**And** fade is not abrupt/instant removal
**And** silhouette position shows the shape filled with its color or highlighted
**And** fading happens after match animation (shape snaps in, then fades)
**And** CSS transition is used for performance (60 FPS)

## Story 2.6: Game Loop & State Persistence

As a developer,
I want the game loop and round state to be managed in utilities (testable, decoupled),
So that the game logic is easy to verify and extend.

**Acceptance Criteria:**

**Given** the game is running
**When** rounds progress and shapes are matched
**Then** game state is managed by Zustand (round count, shapes, silhouettes, matches)
**And** game logic (matching, difficulty, shuffling) lives in utility functions (pure JS)
**And** React components subscribe to Zustand state and re-render on changes
**And** state changes are deterministic and testable
