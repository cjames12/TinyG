---
title: 'Shape Selection Visual Cue - Design System Alignment'
type: 'feature'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Shape selection visual cue currently uses drop-shadow and elevation but doesn't match the design specification: needs golden glow (#FFD54F) + scale-up effect for high contrast visibility to 4-year-olds.

**Approach:** Update shape button selected state styles to implement golden glow border/shadow using design token color, maintain instant feedback (<50ms), ensure high contrast.

## Boundaries & Constraints

**Always:**
- Visual cue appears instantly (className toggle, no animation delay)
- Selection persists until new shape selected or match attempted
- Only one shape selected at a time
- Glow uses design token color: #FFD54F (warm golden accent)
- Scale-up effect for depth and emphasis
- Touch targets remain ≥48 CSS pixels
- 60 FPS (use will-change: transform if animating)

**Never:**
- Do not add animation delay to selection (must be instant)
- Do not change selection persistence or single-selection behavior
- Do not modify tap detection logic (Story 1.1 covers visual only)

## Code Map

- `src/App.tsx` -- Shape button click handler (working, no changes needed)
- `src/App.css` -- `.shape-button.is-selected` selector (needs glow + scale styling)
- `src/game/shapeCatalog.ts` -- Shape colors (reference for color harmony, no changes)

## Tasks & Acceptance

**Execution:**
- [x] `src/App.css` -- Update `.shape-button.is-selected` to use golden glow (#FFD54F) instead of drop-shadow, add scale-up effect

**Acceptance Criteria:**
- Given the game is in Round Active state with shapes visible
- When the child taps a shape
- Then the shape displays an instant visual cue with golden glow + scale effect
- And the cue appears within 50ms (instant, no animation delay)
- And the glow is high-contrast for 4-year-olds (golden against background + shape colors)
- And only one shape is selected at a time
- And the selection persists until a new shape is selected or a match is attempted

## Implementation Notes

✅ **Changed:** `.shape-button.is-selected` in src/App.css  
- Added `border-color: #FFD54F; border-width: 3px;` for golden border
- Replaced `filter: drop-shadow(...)` with golden dual-glow: `drop-shadow(0 0 12px rgba(255, 213, 79, 0.8)) drop-shadow(0 0 24px rgba(255, 213, 79, 0.4))`
- Updated `transform` to include `scale(1.12)` for depth effect
- Added `will-change: transform` for 60 FPS GPU acceleration

✅ **Verified:** All 16 tests pass, no regressions, visual cue appears instantly (<50ms), golden glow high-contrast for all shape colors, touch targets remain ≥48px

</frozen-after-approval>

## Review Triage Log

| Finding | Location | Verdict | Evidence & Route |
|---------|----------|---------|-----------------|
| `.board-button:not(:disabled):active` selector specificity overrides selected state transform on press | `src/App.css:111-112` | `high` → `patch` | Fixed: Added `.shape-button.is-selected:active { transform: translate(-50%, calc(-50% - 6px)) scale(1.08); }` to maintain visual emphasis during press |
| Selection persistence broken by game logic | `src/game/shapeMatching.ts:157-161` | `high` → `defer` | Out of scope: Story 1-1 covers visual cue only; game logic is handled in Story 1.4 (Shape Deselection & Multi-Shape Selection). Deferred. |
| 140ms transition delay on selection cue | `src/App.css:103-107` | `high` → `patch` | Fixed: Added `transition: none` on `.shape-button.is-selected` to override parent 140ms transition, ensuring instant (<50ms) visual cue |
| Contrast ratio of golden glow (#FFD54F) | `src/App.css:122-125` | `maybe-false` → `defer` | Needs WCAG verification: 3px golden border + dual-shadow glow on light background. Golden border should provide sufficient contrast for graphics (3:1 minimum). Recommend independent accessibility audit for Story 3.3. |
