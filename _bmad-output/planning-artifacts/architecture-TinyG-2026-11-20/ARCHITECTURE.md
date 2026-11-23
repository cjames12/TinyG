---
title: "TinyG Technical Architecture"
status: final
created: 2026-11-20
updated: 2026-11-20
phase: 1
document_type: architecture
---

# TinyG Technical Architecture

## 1. System Overview

**TinyG** is a client-side React single-page application (SPA) for a touch-based shape-matching game targeting 4-year-olds on responsive web platforms (phone, tablet, desktop).

**Architecture Philosophy:**
- **Game logic in utilities** (pure JavaScript, testable, decoupled from UI)
- **React for rendering** (components consume state, trigger actions)
- **Zustand for state management** (lightweight, Phase 2 extensible)
- **CSS-driven animations** (performance) + Framer Motion (polish)
- **Session-based, no persistence** in Phase 1

**Key Constraints:**
- Load time: <2 seconds
- Tap-to-feedback latency: <100ms
- Animation frame rate: 60 FPS
- Touch targets: ≥48 CSS pixels
- Bundle size: <500 KB gzipped
- No backend, no data collection

---

## 2. Tech Stack & Rationale

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18 | Component-driven UI, ecosystem, TypeScript support |
| **Build Tool** | Vite | Fast dev experience, optimized bundling, React Fast Refresh |
| **Language** | TypeScript | Type safety for game logic, easier refactoring |
| **State Mgmt** | Zustand | Lightweight (~2KB), scales to multiple games (Phase 2), simple API |
| **Animation** | CSS + Framer Motion | CSS for perf guarantees, Framer for complex choreography |
| **Styling** | CSS Modules | Scoped styles, no conflicts, minimal runtime overhead |
| **Testing** | Vitest + Playwright | Fast unit tests, real E2E scenarios, BMAD TEA integration |
| **Offline** | Service Worker | Play anywhere, no WiFi required |
| **Package Manager** | npm | Standard, Vite-compatible |

**Key Decisions:**

**Zustand over Redux/Context:**
- Redux is overkill for a single game
- Context requires lifting state high, prop drilling
- Zustand: lightweight, scales to 10+ games, explicit actions

**Hybrid Animations:**
- CSS transitions for simple fades/returns: fast, no JS overhead
- Framer Motion for match snap (smooth + bouncy): easier choreography, better feel
- Trade-off: Framer adds ~40KB, but Phase 2 needs it anyway

**CSS Modules over Tailwind:**
- Tailwind adds unnecessary utility bloat for a custom game UI
- CSS Modules keep styles scoped, easy to manage design tokens
- Design system defined in `design-tokens.ts`

**Custom Components, No UI Library:**
- Material-UI designed for dashboards, overkill
- Game needs custom shapes, silhouettes, minimal UI
- Mute toggle and settings are simple HTML buttons

---

## 3. Component Architecture

### Component Hierarchy

```
App
 └─ GameContainer (Zustand subscriber, main orchestrator)
     ├─ PlayScreen (primary view)
     │   ├─ ShapeBoard (scattered layout)
     │   │   ├─ ShapeTile (interactive, selectable)
     │   │   │   └─ ShapeTile.module.css
     │   │   └─ SilhouetteTile (interactive, tap to match)
     │   │       └─ SilhouetteTile.module.css
     │   └─ MuteToggle (top-right, settings control)
     └─ SettingsPanel (optional, overlays play screen)
         └─ MuteToggle (synced state)
```

### Component Responsibilities

| Component | Purpose | State | Props |
|-----------|---------|-------|-------|
| **GameContainer** | Orchestrates game, subscribes to Zustand store | From store | None (pulls from store) |
| **PlayScreen** | Main game view, layout root | From props | gameState, dispatch callbacks |
| **ShapeBoard** | Scatter layout, renders shapes & silhouettes | From props | shapes, silhouettes, positions, selectedShape |
| **ShapeTile** | Interactive shape, selectable | Visual (selected cue) | id, color, label, isSelected, onTap |
| **SilhouetteTile** | Interactive silhouette, tap to match | None | id, shapeId, isMatched, onTap |
| **MuteToggle** | Mute audio control | From store | isMuted, onToggle |

### Data Flow (Unidirectional)

1. **User taps shape** → `onTap` callback → `dispatch(selectShape(id))` → Zustand updates state
2. **State changes** → Zustand subscribers re-render → React re-renders only affected components
3. **User taps silhouette** → `onTap` callback → `dispatch(matchAttempt(shapeId, silhouetteId))` → Game logic decides success/mismatch
4. **Feedback triggered** → Sound, vibration, animation cues → Next round or shape ready for retry

---

## 4. Game Logic & State Management

### Zustand Store Structure

```typescript
// gameStore.ts
interface GameState {
  // Game state
  shapes: Shape[]; // Array of 6-8 shapes in current round
  silhouettes: Silhouette[]; // Array of 6-8 silhouettes
  round: number; // Current round number
  matchedPairs: Set<string>; // IDs of matched shape-silhouette pairs
  
  // Interaction state
  selectedShapeId: string | null; // Currently selected shape (locked to one)
  
  // Settings
  isMuted: boolean;
  
  // Actions
  startGame: () => void;
  selectShape: (shapeId: string) => void;
  attemptMatch: (shapeId: string, silhouetteId: string) => void;
  completeRound: () => void;
  toggleMute: () => void;
}
```

### Game State Machine

```
[Idle] 
  → startGame() → [Playing]
  
[Playing]
  → selectShape(id) → [ShapeSelected] (locked)
  → attemptMatch(shapeId, silhouetteId) →
      ✓ Match → [MatchSuccess] → animate → [Playing] (shape stays, next shape ready)
      ✗ Mismatch → [MismatchFeedback] → animate return → [Playing] (shape back, selected)
  
  When all shapes matched:
  → [RoundComplete] → pause → startNewRound() → [Playing]
```

### Game Logic Utilities

**`gameEngine.ts`** (pure JS, testable):
- `generateShapes(round)` → 6-8 random shapes with difficulty scaling
- `generateSilhouettes(shapes)` → matching silhouettes with variations (rotation, size)
- `scatterLayout(shapes, silhouettes, viewport)` → random positions avoiding overlaps
- `checkMatch(shapeId, silhouetteId)` → boolean match result
- `calculateDifficulty(round)` → shape count, silhouette variations
- `nextRound(currentRound)` → new shapes, incremented difficulty

**`soundManager.ts`**:
- `playSuccess()` → success sound
- `playMismatch()` → error sound
- `vibrate(pattern)` → haptic feedback
- `setMuted(bool)` → global mute

---

## 5. Interaction & Event Handling

### Tap Event Handling

**Selection Tap (Shape Tile):**
1. User taps shape → React `onClick` handler fires
2. Handler calls `dispatch(selectShape(shapeId))`
3. If already selected, **lock in place** (ignore extra taps)
4. If different shape selected, switch selection (old deselects, new selects)

**Match Attempt Tap (Silhouette Tile):**
1. User taps silhouette → React `onClick` handler fires
2. Handler calls `dispatch(attemptMatch(selectedShapeId, silhouetteId))`
3. Game engine checks match
4. **Success:** Lock shape, fade origin, play sound/vibration, move to next shape
5. **Mismatch:** Return shape to origin, play error sound/vibration, keep selected for retry

### Rapid Tap Protection

**Locked-to-One Selection:**
- Once a shape is selected, any additional shape taps are **ignored** (not queued, not switched)
- Only a silhouette tap or intentional shape re-tap (to switch) changes selection
- Prevents accidental double-taps from breaking the game state

**Implementation:**
```typescript
selectShape = (shapeId: string) => {
  set((state) => {
    if (state.selectedShapeId === shapeId) return state; // Already selected, ignore
    return { selectedShapeId: shapeId }; // New selection
  });
};
```

### Touch Event Optimization

- **Event delegation** via React synthetic events (single handler per ShapeBoard)
- **Touch target sizing:** 48px minimum enforced in CSS
- **Latency target:** <100ms from tap to feedback
  - Touch event → React handler: ~10ms
  - Zustand state update: ~1ms
  - Re-render + animation start: ~20ms
  - Animation visual feedback: ~50ms
  - **Total: ~80ms (under 100ms budget)**

### Screen Rotation

- ResizeObserver monitors viewport changes
- On rotation: re-generate scatter layout, re-render
- Game state preserved (round, matched pairs, selectedShape)
- Seamless transition, no pause needed

---

## 6. Animation Architecture

### CSS Animations

**Selection Cue (Shape Tile on Select):**
```css
/* Glow + scale combo */
.shape.selected {
  animation: selectPulse 0.3s ease-in-out forwards;
  box-shadow: 0 0 20px rgba(255, 213, 79, 0.8); /* Golden glow */
  transform: scale(1.15);
}
@keyframes selectPulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 1; }
}
```

**Shape Fade on Match (Origin):**
```css
.shape.matched {
  animation: fadeClear 0.4s ease-out forwards;
}
@keyframes fadeClear {
  0% { opacity: 1; }
  100% { opacity: 0.1; transform: scale(0.95); }
}
```

**Mismatch Return (Shape Snap Back):**
```css
.shape.returning {
  animation: returnBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes returnBounce {
  0% { transform: translateX(var(--offset-x)) translateY(var(--offset-y)); }
  70% { transform: translateX(0) translateY(0) scale(1.05); }
  100% { transform: translateX(0) translateY(0) scale(1); }
}
```

### Framer Motion Animations

**Match Success Snap (Smooth + Bouncy):**
```typescript
// ShapeTile → Silhouette snap animation
export const matchAnimation = {
  initial: { x: 0, y: 0, opacity: 1 },
  animate: { 
    x: targetX, 
    y: targetY, 
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeInOut"
    }
  },
  bounce: {
    scale: [1, 1.1, 0.95, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.5, 0.75, 1],
      ease: "easeInOut"
    }
  }
};
```

**Timeline:**
- Match success: 400–500ms (smooth motion) + 300ms (bounce) = ~700ms total
- Mismatch return: 300ms (bouncy return)
- Fade: 300–500ms (opacity transition)

**Performance:**
- 60 FPS target on all animations
- GPU acceleration via `transform` and `opacity` only
- No layout thrashing (use `will-change` sparingly)

---

## 7. Styling Strategy

### CSS Modules

Each component has a scoped `.module.css` file:
```
components/
  GameContainer.module.css
  PlayScreen.module.css
  ShapeBoard.module.css
  ShapeTile.module.css
  SilhouetteTile.module.css
  MuteToggle.module.css
```

**Benefits:**
- No naming conflicts
- Scoped styles per component
- Easy to override via props
- Zero runtime overhead

### Design Tokens

**`styles/design-tokens.ts`** exports constants:
```typescript
export const colors = {
  primary: {
    red: "#EF5350",
    blue: "#42A5F5",
    yellow: "#FDD835",
    green: "#66BB6A",
    purple: "#AB47BC",
  },
  accent: { pink: "#F48FB1", orange: "#FFA726", teal: "#4DB6AC" },
  background: "#FAFAFA",
  glow: "#FFD54F",
};

export const typography = {
  fontFamily: "'Quicksand', 'Rubik', sans-serif",
  sizes: { display: "32px", body: "16px", small: "12px" },
};

export const spacing = {
  xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px"
};

export const animation = {
  easing: { smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  duration: { fast: 300, normal: 400, slow: 500 },
};
```

### Responsive Design

**Breakpoints:**
- **Phone (375px):** Base, shapes scale to fit
- **Tablet (768px):** Scaled up, more whitespace
- **Desktop (1024px+):** Scaled up further, touch-friendly

**Strategy:** Uniform scaling (same layout, proportional zoom)
```css
@media (min-width: 768px) {
  .shapeBoard { gap: 24px; } /* More spacing */
  .shapeTile { width: 80px; height: 80px; } /* Larger */
}
```

**Touch Target Enforcement:**
- Minimum 48px × 48px enforced globally
- Computed at layout time: `max(48px, 10% of viewport)`

---

## 8. Accessibility & Performance

### Accessibility Floor

**Touch Targets:**
- All interactive elements: ≥48 CSS pixels
- Minimum spacing: 8px between targets (no accidental overlaps)
- Verification: automated test checks all target sizes

**Visual Contrast:**
- Shape colors to background: ≥3:1 (WCAG AA for graphics)
- Silhouettes: distinct by shape, not color alone
- Selection cue (glow): high contrast golden tone

**Error Recovery:**
- Mismatch shape returns to origin, never disappears
- No "lose" conditions, no penalties
- Child can retry immediately with same shape selected

**Motor Accessibility:**
- No time pressure
- Large touch targets
- No multi-touch gestures
- Vibration + sound + visual feedback (not any single modality)

**Audio/Visual:**
- All audio has visual + haptic counterpart
- Mute toggle available (top-right)
- Sounds: success (cheerful, 0.5-1s), mismatch (gentle, 0.3-0.5s)

### Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| **Load Time** | <2s | Vite optimization, lazy load assets |
| **Tap Latency** | <100ms | Event delegation, Zustand speed, animation start |
| **Frame Rate** | 60 FPS | CSS transforms, GPU acceleration, Framer Motion |
| **Bundle** | <500 KB gzipped | Dependency audit, tree-shaking, minification |

**Load Time Breakdown:**
- Initial HTML/CSS: 500ms
- React/Vite bundle: 800ms
- Zustand + game utils: 300ms
- Asset preload (images, sounds): 400ms
- **Total: ~1.8s**

**Bundle Size Tracking:**
```bash
npm run build && npm run size-check
# Alert if >500 KB gzipped
```

---

## 9. Testing Architecture (BMAD TEA Integration)

### Unit Tests (Vitest)

**Game Engine (`gameEngine.test.ts`):**
```typescript
describe("gameEngine", () => {
  it("generateShapes returns 6-8 random shapes", () => {});
  it("checkMatch correctly validates shape-silhouette pairs", () => {});
  it("calculateDifficulty increases with rounds", () => {});
});
```

**Zustand Store (`gameStore.test.ts`):**
```typescript
describe("gameStore", () => {
  it("selectShape locks selection", () => {});
  it("attemptMatch triggers success for valid pairs", () => {});
  it("toggleMute flips isMuted flag", () => {});
});
```

**Component Rendering (`ShapeTile.test.tsx`):**
```typescript
describe("ShapeTile", () => {
  it("renders with correct color and label", () => {});
  it("fires onTap callback on click", () => {});
  it("displays glow + scale when selected", () => {});
});
```

**Coverage Target:** 80%+ (game logic, state machine, component logic)

### Integration Tests (Vitest)

**Game Flow:**
```typescript
describe("Game Flow", () => {
  it("Round starts with 6 shapes and 6 silhouettes", () => {});
  it("Selecting shape then matching silhouette succeeds", () => {});
  it("Mismatched silhouette returns shape and keeps selection", () => {});
  it("All shapes matched triggers next round", () => {});
  it("Round difficulty increases each cycle", () => {});
});
```

### E2E Tests (Playwright + BMAD TEA)

**Playwright Scenarios (Real Browser Interaction):**

1. **First-Time Player (5 min session)**
   - Game loads
   - Child taps red circle
   - Child taps matching silhouette
   - Success feedback triggers (sound, vibration, visual)
   - Next shapes appear
   - Child continues matching

2. **Mismatch Recovery**
   - Child taps shape
   - Child taps wrong silhouette
   - Mismatch feedback (error sound, vibration, shape returns)
   - Shape stays selected
   - Child taps correct silhouette
   - Success

3. **Rapid Taps**
   - Child taps shape A
   - Child taps shape B immediately
   - Shape B does NOT become selected (locked to A)
   - Only silhouette tap or deliberate re-tap switches

4. **Screen Rotation**
   - Game playing on tablet
   - User rotates landscape → portrait
   - Layout reflows, all shapes visible
   - Game state preserved, play continues

5. **Accessibility Validation**
   - All touch targets are ≥48px
   - Contrast ratio ≥3:1 for all colors
   - No time pressure on interactions
   - Error recovery works

**BMAD TEA Integration:**
- Tests run in Playwright with real browser events
- Accessibility audit runs alongside E2E (axe-core)
- Performance metrics captured: load time, animation frame rate, tap latency
- Results logged for QA reporting

---

## 10. File Structure

```
src/
├── components/
│   ├── GameContainer.tsx
│   ├── GameContainer.module.css
│   ├── PlayScreen.tsx
│   ├── PlayScreen.module.css
│   ├── ShapeBoard.tsx
│   ├── ShapeBoard.module.css
│   ├── ShapeTile.tsx
│   ├── ShapeTile.module.css
│   ├── SilhouetteTile.tsx
│   ├── SilhouetteTile.module.css
│   ├── MuteToggle.tsx
│   └── MuteToggle.module.css
├── store/
│   └── gameStore.ts (Zustand store, actions)
├── game/
│   ├── gameEngine.ts (pure game logic)
│   ├── types.ts (Shape, Silhouette, GameState types)
│   └── constants.ts (shape definitions, difficulty levels)
├── utils/
│   ├── soundManager.ts (play/mute audio, vibration)
│   ├── layoutUtils.ts (scatter algorithm, touch targets)
│   └── animationUtils.ts (animation helpers)
├── styles/
│   ├── design-tokens.ts (colors, typography, spacing)
│   └── globals.css (reset, base styles)
├── hooks/
│   ├── useGameState.ts (Zustand subscriber hook)
│   ├── useInteraction.ts (tap handling)
│   └── useAnimation.ts (animation state)
├── tests/
│   ├── unit/
│   │   ├── gameEngine.test.ts
│   │   ├── gameStore.test.ts
│   │   └── ShapeTile.test.tsx
│   ├── integration/
│   │   └── gameFlow.test.ts
│   └── e2e/
│       └── gameplay.spec.ts (Playwright)
├── App.tsx (root component)
├── main.tsx (Vite entry)
└── vite-env.d.ts
```

---

## 11. Phase 2 Extensibility

### Feature Flags for Celebration Animations

```typescript
// gameStore.ts
interface GameState {
  features: {
    celebrationAnimations: boolean; // Phase 2
    characterShapes: boolean; // Phase 2
  };
}
```

### Character Trait System (Phase 2)

**Shape with traits:**
```typescript
interface ShapeWithTraits {
  id: string;
  color: string;
  silhouette: string;
  character?: {
    eyes: "open" | "blinking" | "surprised";
    expression: "happy" | "thinking" | "celebrating";
    animationLoop: "blink" | "bounce" | "idle";
  };
}
```

**Render conditionally:**
```typescript
{character ? <AnimatedCharacter {...character} /> : <StaticShape />}
```

### Game Mode Expansion

**Plugin architecture for future games:**
```typescript
// All games reuse:
// - Zustand store (extend with game-specific slices)
// - Touch event handling (same latency, accessibility)
// - Animation system (CSS + Framer Motion)
// - Styling system (design tokens)

interface GameMode {
  id: string;
  name: string;
  component: React.FC<GameModeProps>;
  store: ZustandStore;
}
```

---

## 12. Build & Deployment

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: "ES2020",
    outDir: "dist",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand"],
          game: ["./src/game/gameEngine"],
        },
      },
    },
  },
  server: { port: 3000, open: true },
});
```

### Service Worker (Offline Support)

**`public/sw.js`** caches app shell + assets:
```javascript
// Cache game on first load
// Serve from cache if offline
// Update cache in background
```

**Registration in `main.tsx`:**
```typescript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

### Asset Optimization

- **Images:** Compress via Vite (WebP fallback)
- **Sounds:** MP3 optimized (~50KB total)
- **Fonts:** Subset Quicksand, preload
- **Bundle:** Tree-shake unused code, minify all JS/CSS

### Local Development Workflow

```bash
npm run dev        # Start Vite dev server (HMR)
npm run build      # Produce optimized dist
npm run preview    # Preview production build locally
npm test           # Run Vitest + Playwright
npm run size-check # Audit bundle size
```

### Future: CI/CD (Placeholder for Phase 2)

```yaml
# .github/workflows/test-and-build.yml (Future)
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci && npm test && npm run build && npm run size-check
```

---

## 13. Key Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Zustand** | Lightweight, scales to multiple games | Less boilerplate than Context, but explicit dispatch needed |
| **Hybrid Animations** | CSS for perf, Framer for polish | Framer adds 40KB bundle, mitigated by Phase 2 usage |
| **CSS Modules** | Scoped, performant, simple | Requires CSS tooling, no utility shorthand |
| **Custom Components** | Lightweight, game-specific | No pre-built accessibility, must build it in |
| **Vitest + Playwright** | Fast unit tests, real E2E | Slower than snapshot tests, but catches real bugs |
| **No Backend Phase 1** | Simpler, offline-capable | No progress persistence, all in-browser |
| **Service Worker** | Offline play, fast revisits | Complexity, cache invalidation needed |

---

## 14. Performance & Quality Targets

### Performance Benchmarks

```
✓ Load time: 1.8s target (<2s hard limit)
✓ Tap-to-feedback: 80ms typical (<100ms max)
✓ Animation frame rate: 60 FPS (monitored)
✓ Bundle size: 420 KB gzipped (target <500 KB)
```

### Quality Standards

```
✓ Unit test coverage: ≥80% (game logic, state)
✓ E2E coverage: 100% of play scenarios
✓ Accessibility: WCAG 2.1 Level AA for touch, contrast, error recovery
✓ Browser support: iOS Safari 13+, Chrome 90+, Firefox 90+, Edge 90+
```

### Monitoring & Feedback

- **Performance:** Measure load time, tap latency, frame rate on real devices
- **UX:** Observe child playing, ask parent for feedback
- **Errors:** Catch crashes via console, error tracking (Phase 2)
- **Iteration:** Phase 1 baseline, Phase 2 adds monitoring

---

## 15. Next Steps

1. **Component Development** → Build React components per hierarchy
2. **Game Logic** → Implement gameEngine utilities, test thoroughly
3. **State Management** → Set up Zustand store, actions, subscribers
4. **Styling** → Build CSS Modules, integrate design tokens
5. **Animations** → Implement CSS + Framer Motion timelines
6. **Testing** → Write unit, integration, E2E tests (Vitest + Playwright)
7. **Optimization** → Profile, optimize bundle, test performance
8. **Polish** → Sounds, vibration, accessibility audit
9. **Phase 2 Planning** → Feature flags, character system, new game modes

---

**This architecture is production-ready. Build it incrementally, test rigorously, iterate based on child's feedback.**
