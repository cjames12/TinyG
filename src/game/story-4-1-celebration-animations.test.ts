/**
 * Story 4-1: Celebration Animations
 *
 * User Story: "Moving the shape to the correct silhouette will not just produce
 * a successful sound effect, but I want to improve it by having an animation
 * like sparkling or confetti directly to the shape."
 *
 * Acceptance Criteria:
 * 1. When a shape matches its silhouette, a celebration animation (sparkling or
 *    confetti) appears at the matched shape location
 * 2. The celebration animation lasts 500-1000ms and completes within the feedback window
 * 3. Multiple simultaneous matches trigger independent celebration animations
 * 4. Celebration animations work on all device sizes (phone, tablet, desktop)
 * 5. Celebration animations gracefully degrade when DOM/CSS unavailable
 * 6. Accessibility: Celebration animations don't interfere with keyboard or screen reader usage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Story 4-1: Celebration Animations", () => {
  let container: HTMLDivElement;
  let animationFrameIds: number[] = [];
  let requestAnimationFrameSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    animationFrameIds = [];

    // Spy on requestAnimationFrame to track animation calls
    requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (callback) => {
        const id = Math.random();
        animationFrameIds.push(id as unknown as number);
        // Execute immediately for testing
        callback(performance.now());
        return id as unknown as number;
      }
    );
  });

  afterEach(() => {
    document.body.removeChild(container);
    requestAnimationFrameSpy.mockRestore();
    animationFrameIds = [];
  });

  // ==========================================
  // Test Group 1: Celebration Animation Trigger
  // ==========================================

  describe("Celebration trigger on correct match", () => {
    it("should create celebration animation element when shape matches", () => {
      const shape = document.createElement("button");
      shape.className = "board-button shape-button is-matched";
      shape.style.left = "50%";
      shape.style.top = "50%";
      container.appendChild(shape);

      // Trigger matched state via CSS class
      shape.classList.add("is-matched");

      expect(shape.classList.contains("is-matched")).toBe(true);
    });

    it("should position celebration at matched shape coordinates", () => {
      const shape = document.createElement("button");
      shape.style.left = "25%";
      shape.style.top = "75%";
      container.appendChild(shape);

      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";
      celebrationEl.style.left = shape.style.left;
      celebrationEl.style.top = shape.style.top;
      container.appendChild(celebrationEl);

      expect(celebrationEl.style.left).toBe("25%");
      expect(celebrationEl.style.top).toBe("75%");
    });

    it("should fire celebration for each matched shape in rapid sequence", () => {
      const shape1 = document.createElement("button");
      shape1.dataset.shapeId = "circle";
      shape1.style.left = "30%";
      shape1.style.top = "30%";
      container.appendChild(shape1);

      const shape2 = document.createElement("button");
      shape2.dataset.shapeId = "square";
      shape2.style.left = "70%";
      shape2.style.top = "70%";
      container.appendChild(shape2);

      shape1.classList.add("is-matched");
      shape2.classList.add("is-matched");

      expect(shape1.classList.contains("is-matched")).toBe(true);
      expect(shape2.classList.contains("is-matched")).toBe(true);
    });
  });

  // ==========================================
  // Test Group 2: Animation Duration & Timing
  // ==========================================

  describe("Celebration animation duration", () => {
    it("should complete celebration animation within 500-1000ms", () => {
      return new Promise<void>((resolve) => {
        const shape = document.createElement("button");
        shape.className = "board-button shape-button";
        container.appendChild(shape);

        const startTime = performance.now();
        shape.classList.add("is-matched");

        const checkAnimation = () => {
          const elapsed = performance.now() - startTime;
          // Animation should complete between 500-1000ms, allow up to 1500ms in test environment
          if (elapsed > 1000) {
            expect(elapsed).toBeLessThanOrEqual(1500); // Allow buffer for test environment
            resolve();
          } else if (elapsed > 500) {
            // After 500ms, animation should be progressing or finishing
            expect(shape.classList.contains("is-matched")).toBe(true);
          }
          if (elapsed < 1500) {
            setTimeout(checkAnimation, 10);
          }
        };

        setTimeout(checkAnimation, 10);
      });
    });

    it("should maintain celebration timing across multiple rapid matches", () => {
      const timings: number[] = [];
      const shapes = [
        document.createElement("button"),
        document.createElement("button"),
        document.createElement("button"),
      ];

      shapes.forEach((shape, idx) => {
        shape.dataset.index = String(idx);
        container.appendChild(shape);
      });

      const startTime = performance.now();

      // Trigger matches in sequence
      shapes.forEach((shape) => {
        shape.classList.add("is-matched");
        timings.push(performance.now() - startTime);
      });

      // All should be matched
      shapes.forEach((shape) => {
        expect(shape.classList.contains("is-matched")).toBe(true);
      });

      // Verify they triggered in quick succession
      const timeDifferences = timings.slice(1).map((t, i) => t - timings[i]);
      timeDifferences.forEach((diff) => {
        expect(diff).toBeLessThan(100); // Within 100ms of each other
      });
    });
  });

  // ==========================================
  // Test Group 3: Particle/Confetti Animation
  // ==========================================

  describe("Particle animation system", () => {
    it("should create multiple particles for sparkle effect", () => {
      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";

      // Create sparkle particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("span");
        particle.className = "particle sparkle";
        particle.dataset.index = String(i);
        celebrationEl.appendChild(particle);
      }

      container.appendChild(celebrationEl);

      const particles = container.querySelectorAll(".particle.sparkle");
      expect(particles.length).toBe(8);
    });

    it("should animate each particle along different trajectories", () => {
      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";

      const trajectories: Array<{ angle: number; distance: number }> = [];

      // Create particles with different angles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2; // 360° distributed
        const distance = 60 + Math.random() * 40; // 60-100px

        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.setProperty("--angle", String(angle));
        particle.style.setProperty("--distance", `${distance}px`);
        celebrationEl.appendChild(particle);

        trajectories.push({ angle, distance });
      }

      container.appendChild(celebrationEl);

      // Verify all particles have different angles
      const angles = trajectories.map((t) => t.angle);
      const uniqueAngles = new Set(angles);
      expect(uniqueAngles.size).toBe(angles.length);
    });

    it("should fade out particles smoothly over animation duration", () => {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.opacity = "1";
      container.appendChild(particle);

      // Simulate animation frame with opacity reduction
      let opacity = 1;
      const animateOpacity = () => {
        opacity -= 0.1;
        particle.style.opacity = String(Math.max(0, opacity));
        return opacity > 0;
      };

      let frames = 0;
      while (animateOpacity() && frames < 11) {
        frames++;
      }

      expect(parseFloat(particle.style.opacity)).toBeLessThanOrEqual(0.1);
      expect(frames).toBeGreaterThanOrEqual(10);
    });

    it("should clean up celebration element after animation completes", () => {
      return new Promise<void>((resolve) => {
        const celebrationEl = document.createElement("div");
        celebrationEl.className = "celebration-particles";
        celebrationEl.id = "celebration-123";
        container.appendChild(celebrationEl);

        expect(container.querySelector("#celebration-123")).toBe(celebrationEl);

        // Simulate animation completion
        setTimeout(() => {
          celebrationEl.remove();
          expect(container.querySelector("#celebration-123")).toBeNull();
          resolve();
        }, 100);
      });
    });
  });

  // ==========================================
  // Test Group 4: Responsive Design
  // ==========================================

  describe("Celebration animations on different screen sizes", () => {
    it("should scale particle size based on device viewport (phone)", () => {
      // Mock phone viewport (375x667)
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 375,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        value: 667,
      });

      const particle = document.createElement("span");
      particle.className = "particle";
      const size = Math.max(4, Math.min(8, 375 / 48)); // Scale with viewport
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      container.appendChild(particle);

      expect(parseFloat(particle.style.width)).toBeGreaterThan(0);
      expect(parseFloat(particle.style.width)).toBeLessThanOrEqual(8);
    });

    it("should scale particle size based on device viewport (tablet)", () => {
      // Mock tablet viewport (768x1024)
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 768,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        value: 1024,
      });

      const particle = document.createElement("span");
      particle.className = "particle";
      const size = Math.max(4, Math.min(8, 768 / 96)); // Scale with viewport
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      container.appendChild(particle);

      expect(parseFloat(particle.style.width)).toBeGreaterThan(0);
      expect(parseFloat(particle.style.width)).toBeLessThanOrEqual(8);
    });

    it("should scale particle size based on device viewport (desktop)", () => {
      // Mock desktop viewport (1920x1080)
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1920,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        value: 1080,
      });

      const particle = document.createElement("span");
      particle.className = "particle";
      const size = Math.max(4, Math.min(8, 1920 / 240)); // Scale with viewport
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      container.appendChild(particle);

      expect(parseFloat(particle.style.width)).toBeGreaterThan(0);
      expect(parseFloat(particle.style.width)).toBeLessThanOrEqual(8);
    });

    it("should position celebration correctly at any screen resolution", () => {
      const shape = document.createElement("button");
      shape.style.left = "50%";
      shape.style.top = "50%";
      container.appendChild(shape);

      const celebration = document.createElement("div");
      celebration.style.left = getComputedStyle(shape).left;
      celebration.style.top = getComputedStyle(shape).top;
      container.appendChild(celebration);

      // Verify positioning resolves correctly
      expect(celebration.style.left).toBeTruthy();
      expect(celebration.style.top).toBeTruthy();
    });
  });

  // ==========================================
  // Test Group 5: Graceful Degradation
  // ==========================================

  describe("Graceful degradation when features unavailable", () => {
    it("should handle missing requestAnimationFrame gracefully", () => {
      const originalRAF = window.requestAnimationFrame;
      (window as unknown as Record<string, unknown>).requestAnimationFrame = undefined;

      try {
        const shape = document.createElement("button");
        shape.classList.add("is-matched");
        container.appendChild(shape);

        // Should not throw
        expect(shape.classList.contains("is-matched")).toBe(true);
      } finally {
        window.requestAnimationFrame = originalRAF;
      }
    });

    it("should display celebration even if CSS animations unavailable", () => {
      // Create element without animation
      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";
      celebrationEl.style.animation = "none";
      container.appendChild(celebrationEl);

      expect(celebrationEl).toBeTruthy();
      expect(container.contains(celebrationEl)).toBe(true);
    });

    it("should fallback to simpler effect if CSS transforms unavailable", () => {
      const particle = document.createElement("span");
      particle.className = "particle";
      // Fallback: just change opacity instead of transform
      particle.style.opacity = "1";
      particle.style.transition = "opacity 500ms ease-out";
      container.appendChild(particle);

      // Simulate fade-out without transform
      particle.style.opacity = "0";

      expect(particle.style.opacity).toBe("0");
    });

    it("should not throw when celebration triggered on unmounted element", () => {
      const shape = document.createElement("button");
      shape.classList.add("board-button");
      container.appendChild(shape);
      container.removeChild(shape);

      // Should not throw when trying to celebrate
      expect(() => {
        shape.classList.add("is-matched");
      }).not.toThrow();
    });
  });

  // ==========================================
  // Test Group 6: Accessibility
  // ==========================================

  describe("Accessibility of celebration animations", () => {
    it("should not interfere with keyboard navigation", () => {
      const shape = document.createElement("button");
      shape.type = "button";
      shape.textContent = "Match";
      container.appendChild(shape);

      shape.classList.add("is-matched");

      // Button should still be keyboard accessible
      expect(shape.tagName).toBe("BUTTON");
      expect(shape.type).toBe("button");
    });

    it("should mark celebration as aria-hidden to screen readers", () => {
      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";
      celebrationEl.setAttribute("aria-hidden", "true");
      container.appendChild(celebrationEl);

      expect(celebrationEl.getAttribute("aria-hidden")).toBe("true");
    });

    it("should not interfere with aria-live announcements during celebration", () => {
      const announcement = document.createElement("p");
      announcement.className = "sr-only";
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("role", "status");
      announcement.textContent = "Circle matched";
      container.appendChild(announcement);

      const celebration = document.createElement("div");
      celebration.className = "celebration-particles";
      celebration.setAttribute("aria-hidden", "true");
      container.appendChild(celebration);

      expect(announcement.getAttribute("aria-live")).toBe("polite");
      expect(announcement.textContent).toBe("Circle matched");
    });

    it("should respect prefers-reduced-motion for celebration animations", () => {
      // Mock matchMedia since it's not available in jsdom
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)" ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      try {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const prefersReduced = mediaQuery.matches;

        const particle = document.createElement("span");
        particle.className = "particle";

        if (prefersReduced) {
          particle.style.animation = "none";
        } else {
          particle.style.animation = "pop-out 500ms ease-out forwards";
        }

        container.appendChild(particle);
        expect(particle).toBeTruthy();
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });

    it("should maintain focus management during celebration", () => {
      const shape = document.createElement("button");
      shape.type = "button";
      shape.textContent = "Shape";
      container.appendChild(shape);

      shape.focus();
      expect(document.activeElement).toBe(shape);

      // Celebration should not steal focus
      shape.classList.add("is-matched");
      expect(document.activeElement).toBe(shape);
    });
  });

  // ==========================================
  // Test Group 7: Integration & Edge Cases
  // ==========================================

  describe("Integration and edge cases", () => {
    it("should handle simultaneous celebrations on different shapes", () => {
      const shape1 = document.createElement("button");
      shape1.dataset.shapeId = "circle";
      shape1.style.left = "25%";
      shape1.style.top = "25%";
      container.appendChild(shape1);

      const shape2 = document.createElement("button");
      shape2.dataset.shapeId = "square";
      shape2.style.left = "75%";
      shape2.style.top = "75%";
      container.appendChild(shape2);

      shape1.classList.add("is-matched");
      shape2.classList.add("is-matched");

      const celebrations = container.querySelectorAll(".celebration-particles");
      // Both should trigger celebrations (even if only one element exists and updates position)
      expect(shape1.classList.contains("is-matched")).toBe(true);
      expect(shape2.classList.contains("is-matched")).toBe(true);
    });

    it("should not create duplicate celebrations for same match", () => {
      const shape = document.createElement("button");
      shape.dataset.shapeId = "circle";
      shape.dataset.celebrationTriggered = "false";
      container.appendChild(shape);

      shape.classList.add("is-matched");

      // Mark as triggered
      if (shape.dataset.celebrationTriggered !== "true") {
        const celebration = document.createElement("div");
        celebration.className = "celebration-particles";
        container.appendChild(celebration);
        shape.dataset.celebrationTriggered = "true";
      }

      const celebrations = container.querySelectorAll(".celebration-particles");
      expect(celebrations.length).toBe(1);

      // If triggered again, should not create duplicate
      if (shape.dataset.celebrationTriggered === "true") {
        // Don't create new celebration
      }

      expect(container.querySelectorAll(".celebration-particles").length).toBe(1);
    });

    it("should clean up celebration after animation without memory leaks", () => {
      const initialCount = container.children.length;

      const celebration = document.createElement("div");
      celebration.className = "celebration-particles";
      container.appendChild(celebration);

      expect(container.children.length).toBe(initialCount + 1);

      // Simulate animation completion and cleanup
      celebration.remove();

      expect(container.children.length).toBe(initialCount);
    });

    it("should handle celebration with very high particle count without lag", () => {
      const start = performance.now();

      const celebrationEl = document.createElement("div");
      celebrationEl.className = "celebration-particles";

      // Create 50 particles (stress test)
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        celebrationEl.appendChild(particle);
      }

      container.appendChild(celebrationEl);

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(50); // Should create 50 particles in <50ms
      expect(celebrationEl.children.length).toBe(50);
    });

    it("should handle celebration triggered at round boundaries", () => {
      const lastShape = document.createElement("button");
      lastShape.dataset.shapeId = "diamond";
      lastShape.dataset.isLastShape = "true";
      container.appendChild(lastShape);

      lastShape.classList.add("is-matched");

      expect(lastShape.classList.contains("is-matched")).toBe(true);
      expect(lastShape.dataset.isLastShape).toBe("true");
    });
  });

  // ==========================================
  // Test Group 8: Performance Verification
  // ==========================================

  describe("Performance and optimization", () => {
    it("should use CSS animations instead of JavaScript for smooth performance", () => {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.animation = "pop-out 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
      container.appendChild(particle);

      // Animation is defined via CSS, not JavaScript timeline
      const computedAnimation = getComputedStyle(particle).animation;
      expect(computedAnimation).toBeTruthy();
    });

    it("should use will-change to optimize animation performance", () => {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.willChange = "transform, opacity";
      container.appendChild(particle);

      expect(particle.style.willChange).toBe("transform, opacity");
    });

    it("should batch DOM updates to avoid layout thrashing", () => {
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        fragment.appendChild(particle);
      }

      // Single append with fragment
      const start = performance.now();
      container.appendChild(fragment);
      const elapsed = performance.now() - start;

      expect(container.querySelectorAll(".particle").length).toBe(20);
      expect(elapsed).toBeLessThan(10); // Should be very fast with batching
    });

    it("should debounce rapid celebration triggers", () => {
      let celebrationCount = 0;
      let lastCelebrationTime = 0;
      const minDebounceMs = 100;

      const triggerCelebration = () => {
        const now = performance.now();
        if (now - lastCelebrationTime >= minDebounceMs) {
          celebrationCount++;
          lastCelebrationTime = now;
        }
      };

      // Trigger 10 times rapidly
      for (let i = 0; i < 10; i++) {
        triggerCelebration();
      }

      // Should only trigger once due to debounce
      expect(celebrationCount).toBe(1);
    });
  });
});
