# EPIC 5: Audio & Haptic Feedback System

Child receives distinct, non-scary audio and haptic feedback for all actions with parent-controllable mute toggle.

## Story 5.1: Success Sound Implementation

As a child,
I want to hear a cheerful, bright sound when I make a match,
So that I know I did it right.

**Acceptance Criteria:**

**Given** a successful match occurs
**When** feedback is triggered
**Then** success sound plays (0.5–1 second duration)
**And** tone is cheerful, bright, game-like (think Mario jump sound)
**And** volume is loud enough to hear from 2 feet away (child-friendly, ~70–80 dB)
**And** sound is not startling or harmful to hearing
**And** sound plays only if mute toggle is OFF
**And** sound file is optimized (small file size, web-friendly format .webp or .mp3)

## Story 5.2: Mismatch Sound Implementation

As a child,
I want to hear a gentle "nope" sound when my match is wrong,
So that I know I need to try again (without feeling bad).

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** feedback is triggered
**Then** error sound plays (0.3–0.5 second duration)
**And** tone is gentle, slightly descending (not scary, e.g., soft "boing")
**And** volume is slightly quieter than success sound
**And** sound is not punitive or scary
**And** sound plays only if mute toggle is OFF
**And** sound file is optimized (small file size)

## Story 5.3: Vibration on Success

As a child,
I want to feel the device vibrate when I make a match,
So that I feel the success in my hands.

**Acceptance Criteria:**

**Given** a successful match occurs
**When** feedback is triggered
**Then** device vibrates (100–150ms duration)
**And** intensity is medium (child should notice, not be startled)
**And** vibration pattern is consistent across rounds
**And** vibration works on iOS (via Haptic API) and Android (Vibration API)
**And** vibration gracefully fails on devices without Vibration support (no error thrown)

## Story 5.4: Vibration on Mismatch (Distinct Pattern)

As a child,
I want to feel a gentler vibration when my match is wrong,
So that I know it's different from success.

**Acceptance Criteria:**

**Given** a mismatch occurs
**When** feedback is triggered
**Then** device vibrates (50–100ms duration)
**And** intensity is lighter than success vibration (distinct, not punitive)
**And** vibration is noticeably different from success (shorter or lighter feel)
**And** vibration works across iOS and Android
**And** vibration is optional for child comfort (can be disabled via mute, future feature)

## Story 5.5: Mute Toggle State Management

As a parent,
I want to toggle mute and have it persist and control all sounds,
So that I can quickly silence the game.

**Acceptance Criteria:**

**Given** mute toggle exists
**When** mute is turned ON
**Then** all sounds are silenced (success, error, etc.)
**And** mute state is stored in Zustand (observable)
**And** visual and haptic feedback still work (only audio is muted)
**And** toggle position clearly indicates mute state (icon: speaker on/off)
**And** toggle remains in selected state during session

## Story 5.6: Audio Asset Management

As a developer,
I want all audio files to be properly imported and managed,
So that sounds load correctly without delays.

**Acceptance Criteria:**

**Given** audio files are needed
**When** game initializes
**Then** success and error sound files are preloaded (not lazy-loaded)
**And** files are stored in `src/assets/audio/` directory
**And** Web Audio API is used for playback
**And** sounds play with <100ms latency from trigger
**And** no console errors on audio import or playback

---

# EPIC 6: Performance, Build & Deployment

Game loads fast (<2s), runs smoothly (60 FPS), works offline, and is production-ready with <500 KB bundle size.

## Story 6.1: Vite Build Configuration & Development Setup

As a developer,
I want a fast development environment with hot module reloading,
So that I can iterate quickly.

**Acceptance Criteria:**

**Given** project is set up
**When** running `npm run dev`
**Then** Vite starts dev server in <5 seconds
**And** React Fast Refresh works (edit code → see changes instantly)
**And** TypeScript is configured (strict mode recommended)
**And** CSS Modules are configured and working
**And** asset imports (images, audio) are configured
**And** build command (`npm run build`) produces optimized bundle

## Story 6.2: Code Splitting & Bundle Optimization

As a user,
I want the game to load quickly on cellular networks,
So that I can start playing immediately.

**Acceptance Criteria:**

**Given** game code is built
**When** bundle is generated
**Then** total bundle size is <500 KB (gzipped)
**And** main app chunk is <300 KB
**And** unused code is tree-shaken (no dead code in bundle)
**And** large dependencies are avoided (no Material-UI, Tailwind, etc.)
**And** bundle analysis tool is available for review
**And** load time on 3G network is <2 seconds

## Story 6.3: Performance Optimization (60 FPS Animations)

As a child,
I want smooth, jank-free animations when shapes snap and fade,
So that the game feels polished.

**Acceptance Criteria:**

**Given** animations are running
**When** shapes animate to silhouettes or fade
**Then** frame rate is consistently 60 FPS (no stuttering)
**And** CSS transforms are used (not layout changes) for animations
**And** React re-renders are optimized (no unnecessary renders)
**And** Zustand selectors prevent component over-subscription
**And** performance monitoring shows no red flags

## Story 6.4: Service Worker for Offline Play

As a child,
I want to play even when WiFi is unavailable,
So that I can play anywhere, anytime.

**Acceptance Criteria:**

**Given** game is loaded once online
**When** device goes offline
**Then** Service Worker serves cached assets (HTML, CSS, JS, images, sounds)
**And** game loads and plays fully offline
**And** no backend calls are made (all logic is client-side)
**And** when back online, fresh updates are available (optional auto-update)
**And** manifest.webmanifest is configured (PWA support)

## Story 6.5: Asset Optimization (Images & Sounds)

As a developer,
I want all assets to be optimized for web delivery,
So that the game loads fast.

**Acceptance Criteria:**

**Given** assets are included
**When** build runs
**Then** images are compressed (.webp format preferred, .png fallback)
**And** audio files are optimized (.webp audio or .mp3, <100 KB each)
**And** shape SVGs are inlined or sprite-sheeted (no extra HTTP requests)
**And** no unused assets are included in bundle
**And** Vite automatically optimizes on build

## Story 6.6: Deployment & Environment Setup

As a developer,
I want to easily deploy the game to production,
So that it's available to players.

**Acceptance Criteria:**

**Given** code is ready for release
**When** running production build
**Then** `npm run build` creates optimized, minified bundle
**And** sourcemaps are available for debugging (optional, dev-only)
**And** game is served over HTTPS in production
**And** cache headers are configured (assets cache-busted on updates)
**And** deployment workflow is documented (GitHub Pages, Vercel, Netlify, or custom)

---

# EPIC 7: Testing & Quality Assurance (BMAD TEA Integration)

Game is thoroughly tested across unit, integration, and end-to-end layers; quality is validated per PRD acceptance criteria.

## Story 7.1: Vitest Unit Test Setup & Game Logic Tests

As a developer,
I want unit tests for game logic (shape matching, shuffling, difficulty),
So that I can refactor with confidence.

**Acceptance Criteria:**

**Given** game utilities are created
**When** tests run via `npm run test`
**Then** Vitest is configured and running
**And** unit tests cover game logic (shuffling, matching, difficulty calc)
**And** test cases include happy path, edge cases, and errors
**And** test coverage is >80% for utility functions
**And** tests run in <10 seconds (fast feedback)
**And** tests pass on CI/CD pipeline

## Story 7.2: Integration Tests (State + Components)

As a developer,
I want integration tests for Zustand state and React components,
So that component interactions work correctly.

**Acceptance Criteria:**

**Given** components and state are integrated
**When** integration tests run
**Then** Vitest + React Testing Library are configured
**And** tests cover state → component → user interaction flows
**And** state updates trigger correct component re-renders
**And** selection, matching, feedback all work in integrated tests
**And** test coverage is >70% for components
**And** mocking is used for Web Audio API and Vibration API

## Story 7.3: Playwright E2E Tests (Full Gameplay)

As a QA lead,
I want end-to-end tests that simulate a real child playing the game,
So that I can verify the full experience works.

**Acceptance Criteria:**

**Given** game is deployed to staging
**When** Playwright tests run
**Then** tests cover full gameplay scenarios:
  - Child taps shape → shape selected (glow visible)
  - Child taps matching silhouette → shape snaps in, sound plays, vibration triggers
  - Child taps mismatched silhouette → shape returns, error sound plays
  - Child completes a full round → celebration message appears → new round starts
  - Mute toggle works (sounds silent, visual feedback still works)
  - Responsive breakpoints work (phone, tablet, desktop)
**And** tests run in <60 seconds
**And** screenshots captured on failure (debugging)
**And** tests pass on Chrome, Firefox (at minimum)

## Story 7.4: Accessibility & Performance Testing

As a tester,
I want to verify accessibility and performance meet PRD requirements,
So that all children can play comfortably.

**Acceptance Criteria:**

**Given** game is built
**When** testing accessibility and performance
**Then** axe-core or similar tool checks WCAG compliance (color contrast, touch targets, etc.)
**And** lighthouse reports show:
  - Load time <2 seconds
  - Largest Contentful Paint <1.5s
  - Cumulative Layout Shift <0.1
  - Performance score >90
**And** tap-to-feedback latency measured <100ms
**And** animation frame rate validated at 60 FPS (via DevTools)

## Story 7.5: Cross-Device Testing Matrix

As a QA lead,
I want to verify the game works on target devices,
So that all children have a consistent experience.

**Acceptance Criteria:**

**Given** game is built
**When** tested on target devices
**Then** tested on:
  - iPhone SE / 375px viewport (mobile)
  - iPad Pro 768px viewport (tablet)
  - Desktop 1024px+ (browser)
  - Safari (iOS), Chrome (Android), Chrome/Firefox (Desktop)
**And** gameplay works identically on all combinations
**And** touch events register correctly on all devices
**And** audio/vibration work on iOS and Android

## Story 7.6: Quality Gate & Traceability Matrix

As a product manager,
I want a traceability matrix showing which PRD requirements are tested,
So that I can sign off on quality.

**Acceptance Criteria:**

**Given** all tests are written
**When** generating traceability matrix
**Then** matrix maps each FR to at least one test (unit, integration, or E2E)
**And** matrix maps each NFR to performance or accessibility tests
**And** matrix shows pass/fail status for each requirement
**And** coverage is >95% (at least one test per requirement)
**And** matrix is documented and reviewed by team
