- source_spec: `_bmad-output/implementation-artifacts/spec-shape-silhouette-sorter.md`
  summary: Complete the paused product brief for the broader age-3-to-6 game collection.
  evidence: The user chose to build only the first game now and revisit the product brief later; its remaining sections are still placeholders.
- source_spec: `_bmad-output/implementation-artifacts/spec-irregular-scatter-and-error-sound.md`
  summary: Clear the prior match announcement when replay starts a new round.
  evidence: After replay, the live status can retain the final match announcement from the completed round.
- source_spec: `_bmad-output/implementation-artifacts/spec-irregular-scatter-and-error-sound.md`
  summary: Hand keyboard focus to an active game control after matching or replay.
  evidence: Matching disables the focused board buttons, and replay removes its own button without explicitly moving focus.
- source_spec: `_bmad-output/implementation-artifacts/spec-irregular-scatter-and-error-sound.md`
  summary: Announce when a silhouette is tapped before selecting a shape.
  evidence: The no-selection result is ignored by the UI, so the status remains unchanged after that action.
- source_spec: `_bmad-output/implementation-artifacts/spec-irregular-scatter-and-error-sound.md`
  summary: Reject match attempts for shapes that are not part of the current round.
  evidence: The exported game helpers accept any catalog ShapeId, though the UI only supplies IDs present in the current board.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-shape-selection-visual-cue.md`
  summary: Handle selection persistence when child taps already-selected shape (should remain selected, not deselect).
  evidence: Story 1-1 (visual cue) is out of scope for game logic. Story 1.4 (Shape Deselection & Multi-Shape Selection) handles the interaction pattern for switching and persisting selections.
