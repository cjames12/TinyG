import { type ReactNode, useEffect, useState } from "react";
import { getShapeColor, getShapeLabel, type ShapeId } from "./game/shapeCatalog";
import { playFeedback, vibrateForMismatch, vibrateForSuccess } from "./game/feedback";
import { isRoundComplete, attemptMatch as attemptMatchLogic } from "./game/shapeMatching";
import { useGameStore } from "./game/gameStore";
import "./silhouette-tokens.css";
import "./App.css";

/**
 * Trigger celebration animation (sparkles/confetti) at a specific location
 * Story 4-1: Celebration Animations
 */
function triggerCelebrationAnimation(element: HTMLElement): void {
  if (!element || !document.body.contains(element)) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const celebration = document.createElement("div");
  celebration.className = "celebration-particles";
  celebration.style.left = `${x}px`;
  celebration.style.top = `${y}px`;
  celebration.setAttribute("aria-hidden", "true");

  // Create particles in burst pattern
  const particleCount = 8;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.className = "particle sparkle";
    particle.setAttribute("data-angle", String(i));
    celebration.appendChild(particle);
  }

  document.body.appendChild(celebration);

  // Clean up after animation completes
  setTimeout(() => {
    celebration.remove();
  }, 600);
}

function ShapeArtwork({
  shapeId,
  className,
}: {
  shapeId: ShapeId;
  className?: string;
}) {
  const artwork: Record<ShapeId, ReactNode> = {
    circle: <circle cx="50" cy="50" r="36" />,
    square: <rect x="16" y="16" width="68" height="68" rx="8" />,
    triangle: <polygon points="50,12 90,84 10,84" />,
    rectangle: <rect x="12" y="25" width="76" height="50" rx="8" />,
    oval: <ellipse cx="50" cy="50" rx="40" ry="27" />,
    star: (
      <path d="M50 8 61.5 36.5 92 38.5 68.5 58 76 88 50 72 24 88 31.5 58 8 38.5 38.5 36.5Z" />
    ),
    heart: (
      <path d="M50 86 14 51C-2 34 9 10 29 10c10 0 17 6 21 14 4-8 11-14 21-14 20 0 31 24 15 41Z" />
    ),
    diamond: <polygon points="50,8 91,50 50,92 9,50" />,
    hexagon: <polygon points="27,12 73,12 94,50 73,88 27,88 6,50" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 100 100"
    >
      <g fill="currentColor">{artwork[shapeId]}</g>
    </svg>
  );
}

export default function App() {
  const store = useGameStore();
  const [showCelebration, setShowCelebration] = useState(false);
  
  if (!store.round) {
    return null;
  }
  
  const complete = isRoundComplete(store.round);

  // Handle undefined store state (before initialization)
  if (!store.round.boardItems) {
    return null;
  }

  // Auto-advance to next round when celebration completes
  useEffect(() => {
    if (!complete) {
      setShowCelebration(false);
      return;
    }

    setShowCelebration(true);
    const timer = setTimeout(() => {
      store.advanceToNextRound();
      setShowCelebration(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, [complete, store]);

  function handleTargetTap(shapeId: ShapeId): void {
    // Guard 1: Check if shape is currently animating or shaking
    if (store.animatingShapes.has(shapeId) || store.shakingTargets.has(shapeId)) {
      return;
    }

    // Guard 2: Check if already matched
    if (store.round.matchedShapes.includes(shapeId)) {
      return;
    }

    const attempt = attemptMatchLogic(store.round, shapeId);

    if (attempt.result === "matched") {
      store.addAnimatingShape(shapeId);
      store.attemptMatch(shapeId);
      store.setFeedbackAnnouncement(`${getShapeLabel(shapeId)} matched.`);
      playFeedback("correct");
      vibrateForSuccess();

      // Trigger celebration animation at target button location
      const targetElement = document.querySelector(
        `[data-shape-id="${shapeId}"][data-kind="target"]`
      ) as HTMLElement;
      if (targetElement) {
        triggerCelebrationAnimation(targetElement);
      }

      setTimeout(() => {
        store.removeAnimatingShape(shapeId);
      }, 400);
    } else if (attempt.result === "mismatch") {
      store.addShakingTarget(shapeId);
      store.attemptMatch(shapeId);
      store.setFeedbackAnnouncement("Not a match. Try a different silhouette.");
      playFeedback("mismatch");
      vibrateForMismatch();

      setTimeout(() => {
        store.removeShakingTarget(shapeId);
      }, 400);
    }
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <h1>Shape Sorter</h1>
        <div
          aria-label={`${store.round.matchedShapes.length} of ${store.round.shapes.length} pairs matched`}
          aria-valuemax={store.round.shapes.length}
          aria-valuemin={0}
          aria-valuenow={store.round.matchedShapes.length}
          className="progress-indicator"
          role="progressbar"
        >
          {store.round.shapes.map((shapeId) => (
            <span
              aria-hidden="true"
              className={`progress-dot${store.round.matchedShapes.includes(shapeId) ? " is-filled" : ""}`}
              key={shapeId}
            />
          ))}
        </div>
      </header>

      <section className="playfield" aria-label="Shape matching game">
        {store.round.boardItems.map((item) => {
          const label = getShapeLabel(item.shapeId);
          const matched = store.round.matchedShapes.includes(item.shapeId);
          
          // For matched shapes, find the target position and use that instead
          let position = {
            left: `${item.position.x}%`,
            top: `${item.position.y}%`,
          };
          
          let animationStyle: Record<string, string> = {};
          
          if (item.kind === "shape" && matched) {
            // Find the target position for this shape
            const targetItem = store.round.boardItems.find(
              (bi) => bi.kind === "target" && bi.shapeId === item.shapeId
            );
            if (targetItem) {
              // Calculate delta: (current position - target position) as percentage
              const deltaX = item.position.x - targetItem.position.x;
              const deltaY = item.position.y - targetItem.position.y;
              
              position = {
                left: `${targetItem.position.x}%`,
                top: `${targetItem.position.y}%`,
              };
              
              // Apply delta as CSS custom properties for animation
              animationStyle = {
                '--delta-x': `${deltaX}%`,
                '--delta-y': `${deltaY}%`,
              } as Record<string, string>;
            }
          }

          if (item.kind === "shape") {
            return (
              <button
                key={`${item.kind}-${item.shapeId}`}
                aria-label={`Select ${label}`}
                aria-pressed={store.round.selectedShape === item.shapeId}
                className={[
                  "board-button",
                  "shape-button",
                  store.round.selectedShape === item.shapeId ? "is-selected" : "",
                  matched ? "is-matched" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (!matched) {
                    store.setFeedbackAnnouncement(null);
                    store.selectShape(item.shapeId);
                  }
                }}
                disabled={matched}
                style={{ ...position, color: getShapeColor(item.shapeId), ...animationStyle }}
                type="button"
              >
                <ShapeArtwork shapeId={item.shapeId} className="shape-art" />
              </button>
            );
          }

          return (
            <button
              key={`${item.kind}-${item.shapeId}`}
              aria-label={`${label} silhouette${matched ? " matched" : " target"}`}
              aria-pressed={matched}
              className={[
                "board-button",
                "target-button",
                matched ? "is-matched matched-silhouette" : "",
                store.shakingTargets.has(item.shapeId) ? "is-shaking" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-shape-id={item.shapeId}
              data-kind="target"
              data-color={getShapeColor(item.shapeId)}
              disabled={matched}
              onClick={() => handleTargetTap(item.shapeId)}
              style={matched ? { ...position, color: getShapeColor(item.shapeId) } : position}
              type="button"
            >
              <ShapeArtwork
                shapeId={item.shapeId}
                className={`shape-art${matched ? " matched-art" : " silhouette-art"}`}
              />
            </button>
          );
        })}
      </section>

      <p className="sr-only" aria-live="polite" role="status">
        {showCelebration
          ? "Great job! You matched all the shapes!"
          : complete
            ? "Round complete. Auto-advancing to next round."
            : store.feedbackAnnouncement ??
              (store.round.selectedShape
                ? `${getShapeLabel(store.round.selectedShape)} selected.`
                : `${store.round.matchedShapes.length} of ${store.round.shapes.length} pairs matched.`)}
      </p>

      {showCelebration && (
        <div className="celebration-overlay" aria-hidden="false">
          <div className="celebration-message">Great job!</div>
        </div>
      )}
    </main>
  );
}
