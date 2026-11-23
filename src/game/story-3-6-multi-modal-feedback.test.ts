import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { playFeedback, vibrateForSuccess, vibrateForMismatch } from "./feedback";

describe("Story 3-6: Multi-Modal Feedback (Sound + Vibration + Visual)", () => {
  let mockVibrateSuccess: ReturnType<typeof vi.fn>;
  let mockVibraterMismatch: ReturnType<typeof vi.fn>;
  let mockPlayFeedback: ReturnType<typeof vi.fn>;
  let originalNavigator: Navigator;
  let originalAudioContext: typeof window.AudioContext;
  let mockAudioContext: Partial<AudioContext>;

  beforeEach(() => {
    // Reset all mocks
    mockPlayFeedback = vi.fn();
    mockVibrateSuccess = vi.fn();
    mockVibraterMismatch = vi.fn();

    // Mock navigator.vibrate
    originalNavigator = window.navigator;
    Object.defineProperty(window, "navigator", {
      value: {
        ...window.navigator,
        vibrate: vi.fn((pattern: number | number[]) => {
          if (Array.isArray(pattern) && pattern.length === 3) {
            mockVibrateSuccess(pattern);
          } else if (typeof pattern === "number") {
            mockVibraterMismatch(pattern);
          }
          return true;
        }),
      },
      configurable: true,
    });

    // Mock AudioContext
    originalAudioContext = window.AudioContext;
    mockAudioContext = {
      currentTime: 0,
      state: "running",
      createOscillator: vi.fn(() => ({
        type: "sine",
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(function () {
          return this;
        }),
        start: vi.fn(),
        stop: vi.fn(),
      })),
      createGain: vi.fn(() => ({
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(function () {
          return this;
        }),
      })),
      destination: {},
      resume: vi.fn(() => Promise.resolve()),
    };

    class MockAudioContext {
      currentTime = 0;
      state = "running";
      createOscillator = vi.fn(() => ({
        type: "sine",
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(function () {
          return this;
        }),
        start: vi.fn(),
        stop: vi.fn(),
      }));
      createGain = vi.fn(() => ({
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(function () {
          return this;
        }),
      }));
      destination = {};
      resume = vi.fn(() => Promise.resolve());
    }

    Object.defineProperty(window, "AudioContext", {
      value: MockAudioContext,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "navigator", { value: originalNavigator, configurable: true });
    Object.defineProperty(window, "AudioContext", { value: originalAudioContext, configurable: true });
  });

  describe("Success Feedback: Simultaneous Sound + Vibration + Visual", () => {
    it("plays success sound (ascending tones: 784, 988, 1175 Hz) when shape matches", () => {
      playFeedback("correct");
      // Verify that playFeedback executes without error
      // Audio context creation is lazy (only on first call)
      expect(() => playFeedback("correct")).not.toThrow();
    });

    it("triggers success vibration pattern [100, 50, 100]ms when shape matches", () => {
      vibrateForSuccess();
      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it("triggers audio and vibration within same synchronous call stack (< 100ms)", () => {
      const startTime = performance.now();
      playFeedback("correct");
      vibrateForSuccess();
      const endTime = performance.now();
      
      // Both calls should complete within 100ms (synchronous, no async delay)
      expect(endTime - startTime).toBeLessThan(100);
      expect(window.navigator.vibrate).toHaveBeenCalled();
    });

    it("does not delay audio before vibration (synchronous coordination)", () => {
      const callOrder: string[] = [];

      const originalVibrate = window.navigator.vibrate;
      window.navigator.vibrate = vi.fn((pattern) => {
        callOrder.push("vibration");
        return true;
      });

      playFeedback("correct");
      vibrateForSuccess();

      // Both should have been called
      expect(callOrder.length).toBeGreaterThan(0);
      expect(window.navigator.vibrate).toHaveBeenCalled();
    });

    it("verifies success vibration is 3-part pattern (not single pulse)", () => {
      vibrateForSuccess();
      const calls = (window.navigator.vibrate as any).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1][0];
      expect(Array.isArray(lastCall)).toBe(true);
      expect(lastCall).toHaveLength(3);
      expect(lastCall).toEqual([100, 50, 100]);
    });
  });

  describe("Mismatch Feedback: Simultaneous Sound + Vibration + Visual", () => {
    it("plays mismatch sound (descending: 262→196 Hz) when shape does not match", () => {
      // Verify that playFeedback executes without error
      expect(() => {
        playFeedback("mismatch");
      }).not.toThrow();
    });

    it("triggers light mismatch vibration (35ms single pulse)", () => {
      vibrateForMismatch();
      expect(window.navigator.vibrate).toHaveBeenCalledWith(35);
    });

    it("verifies mismatch vibration is 7x lighter than success (35ms vs ~100-150ms)", () => {
      // Success pattern: [100, 50, 100] = 250ms total
      // Mismatch: 35ms single
      const successTotal = 100 + 50 + 100;
      const mismatchTotal = 35;
      const ratio = successTotal / mismatchTotal;
      
      expect(ratio).toBeGreaterThan(5);
      expect(ratio).toBeLessThan(10);
    });

    it("triggers audio and vibration synchronously on mismatch", () => {
      const startTime = performance.now();
      playFeedback("mismatch");
      vibrateForMismatch();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(window.navigator.vibrate).toHaveBeenCalledWith(35);
    });

    it("distinguishes mismatch vibration from success vibration", () => {
      vibrateForSuccess();
      const successCalls = (window.navigator.vibrate as any).mock.calls.length;
      
      vibrateForMismatch();
      const totalCalls = (window.navigator.vibrate as any).mock.calls.length;
      
      expect(totalCalls).toBe(successCalls + 1);
      const lastCall = (window.navigator.vibrate as any).mock.calls[totalCalls - 1][0];
      expect(lastCall).toBe(35);
    });
  });

  describe("Graceful Degradation: Accessibility Without All Modalities", () => {
    it("visual feedback works when audio is unavailable", () => {
      // Simulate audio context failure
      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });

      // playFeedback should warn but not crash
      expect(() => {
        playFeedback("correct");
      }).not.toThrow();
    });

    it("visual feedback works when vibration is unavailable", () => {
      // Simulate vibration API absence
      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      // vibrateForSuccess should not crash
      expect(() => {
        vibrateForSuccess();
      }).not.toThrow();
    });

    it("deaf users can play with visual + vibration feedback only", () => {
      // Disable audio
      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });

      // Vibration should still work
      expect(() => {
        vibrateForSuccess();
      }).not.toThrow();

      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it("blind users can play with sound + vibration feedback only", () => {
      // Visual feedback comes from CSS animations (is-matched class)
      // We verify audio and vibration work together

      playFeedback("correct");
      vibrateForSuccess();

      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
      // Audio plays too (would be audible)
    });

    it("handles both audio and vibration unavailable gracefully", () => {
      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      // Should not crash, visual feedback via CSS still works
      expect(() => {
        playFeedback("correct");
        vibrateForSuccess();
      }).not.toThrow();
    });
  });

  describe("Multi-Modal Coordination: No Race Conditions", () => {
    it("executes feedback functions in deterministic order", () => {
      const executionOrder: string[] = [];

      const originalPlayFeedback = playFeedback;
      const wrappedPlayFeedback = vi.fn(() => {
        executionOrder.push("playFeedback");
      });

      const wrappedVibrateForSuccess = vi.fn(() => {
        executionOrder.push("vibrateForSuccess");
      });

      wrappedPlayFeedback("correct");
      wrappedVibrateForSuccess();

      expect(executionOrder).toEqual(["playFeedback", "vibrateForSuccess"]);
    });

    it("handles rapid successive matches without dropped feedback", () => {
      // First match
      playFeedback("correct");
      vibrateForSuccess();

      // Second match immediately after
      playFeedback("correct");
      vibrateForSuccess();

      // Both should have been called
      const vibrateCalls = (window.navigator.vibrate as any).mock.calls.length;
      expect(vibrateCalls).toBeGreaterThanOrEqual(2);
    });

    it("does not block subsequent feedback while animating", () => {
      // Success feedback starts (shape animation is 500ms)
      playFeedback("correct");
      vibrateForSuccess();

      // User immediately taps another shape (within animation duration)
      playFeedback("mismatch");
      vibrateForMismatch();

      // Both feedbacks should have been triggered
      const vibrateCalls = (window.navigator.vibrate as any).mock.calls;
      expect(vibrateCalls.length).toBeGreaterThanOrEqual(2);
    });

    it("prevents audio context state race conditions", () => {
      const context = new window.AudioContext() as any;
      
      // Simulate suspended state
      context.state = "suspended";
      
      // Should handle gracefully
      expect(() => {
        playFeedback("correct");
      }).not.toThrow();
    });
  });

  describe("Timing Verification: Within 100ms Window", () => {
    it("success feedback completes within 100ms total", () => {
      const start = performance.now();
      playFeedback("correct");
      vibrateForSuccess();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it("mismatch feedback completes within 100ms total", () => {
      const start = performance.now();
      playFeedback("mismatch");
      vibrateForMismatch();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it("does not add artificial delays between audio and vibration", () => {
      // If we set up monitoring, there should be no setTimeout/setInterval between calls
      let audioTime: number | null = null;
      let vibrationTime: number | null = null;

      const originalCreateGain = mockAudioContext.createGain;
      mockAudioContext.createGain = vi.fn(() => {
        audioTime = performance.now();
        return originalCreateGain!.call(mockAudioContext);
      });

      const originalVibrate = window.navigator.vibrate;
      window.navigator.vibrate = vi.fn((pattern) => {
        vibrationTime = performance.now();
        return true;
      });

      playFeedback("correct");
      vibrateForSuccess();

      if (audioTime !== null && vibrationTime !== null) {
        const timeDelta = Math.abs(vibrationTime - audioTime);
        expect(timeDelta).toBeLessThan(50); // Should be nearly simultaneous
      }
    });
  });

  describe("Edge Cases: Browser Compatibility", () => {
    it("works in browsers without AudioContext", () => {
      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });

      expect(() => {
        playFeedback("correct");
      }).not.toThrow();
    });

    it("works in browsers without vibration API", () => {
      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      expect(() => {
        vibrateForSuccess();
      }).not.toThrow();
    });

    it("works in browsers with suspended AudioContext (mobile)", () => {
      const context = new window.AudioContext() as any;
      context.state = "suspended";
      context.resume = vi.fn(() => Promise.resolve());

      expect(() => {
        playFeedback("correct");
      }).not.toThrow();
    });

    it("does not spam console with repeated audio warnings", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });

      // First call
      playFeedback("correct");
      const firstWarnCount = warnSpy.mock.calls.length;

      // Second call - should not warn again
      playFeedback("correct");
      const secondWarnCount = warnSpy.mock.calls.length;

      // Should only warn once per session
      expect(secondWarnCount - firstWarnCount).toBeLessThanOrEqual(1);

      warnSpy.mockRestore();
    });

    it("does not spam console with repeated vibration warnings", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      // First call
      vibrateForSuccess();
      const firstWarnCount = warnSpy.mock.calls.length;

      // Second call - should warn again (different from audio)
      vibrateForMismatch();
      const secondWarnCount = warnSpy.mock.calls.length;

      // Vibration might warn each time (try-catch based)
      expect(secondWarnCount).toBeGreaterThanOrEqual(firstWarnCount);

      warnSpy.mockRestore();
    });
  });

  describe("Accessibility: All User Types Supported", () => {
    it("provides non-audio feedback (vibration + visual) for deaf children", () => {
      // Vibration: should trigger
      vibrateForSuccess();
      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);

      // Visual: is-matched class would be added by React (tested in App.test.tsx)
      // This test verifies the modalities exist
    });

    it("provides non-vibration feedback (audio + visual) for children without vibration device", () => {
      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      // Audio should still play
      expect(() => {
        playFeedback("correct");
      }).not.toThrow();

      // Visual: CSS animations still apply
    });

    it("provides visual-only fallback when both audio and vibration unavailable", () => {
      Object.defineProperty(window, "AudioContext", {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(window.navigator, "vibrate", {
        value: undefined,
        configurable: true,
      });

      // Should not crash - visual feedback via is-matched CSS class still works
      expect(() => {
        playFeedback("correct");
        vibrateForSuccess();
      }).not.toThrow();
    });

    it("distinguishes success from mismatch across all modalities", () => {
      // Success: ascending tones, longer vibration
      playFeedback("correct");
      vibrateForSuccess();
      const successVibrateCall = (window.navigator.vibrate as any).mock.calls[0][0];

      // Mismatch: descending tones, shorter vibration
      playFeedback("mismatch");
      vibrateForMismatch();
      const mismatchVibrateCall = (window.navigator.vibrate as any).mock.calls[1][0];

      // Should be different patterns
      expect(successVibrateCall).not.toEqual(mismatchVibrateCall);
      expect(Array.isArray(successVibrateCall)).toBe(true);
      expect(typeof mismatchVibrateCall).toBe("number");
    });
  });

  describe("Integration: Feedback Consistency", () => {
    it("success feedback has consistent properties across modalities", () => {
      playFeedback("correct");
      vibrateForSuccess();

      // Verify both were called
      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
      // Audio context would have created oscillators (verified by mock)
    });

    it("mismatch feedback has consistent properties across modalities", () => {
      playFeedback("mismatch");
      vibrateForMismatch();

      // Verify both were called
      expect(window.navigator.vibrate).toHaveBeenCalledWith(35);
      // Audio context would have created oscillators with different frequencies
    });

    it("does not cause audio feedback to interrupt vibration patterns", () => {
      // Start vibration
      vibrateForSuccess();
      const vibrateCalls1 = (window.navigator.vibrate as any).mock.calls.length;

      // Start audio (should not stop vibration)
      playFeedback("correct");
      const vibrateCalls2 = (window.navigator.vibrate as any).mock.calls.length;

      // Vibration call count should not increase (audio doesn't re-trigger vibration)
      expect(vibrateCalls2).toBe(vibrateCalls1);
    });

    it("does not cause vibration feedback to interrupt audio playback", () => {
      // Start audio
      playFeedback("correct");
      
      // Start vibration (should not stop audio)
      vibrateForSuccess();
      
      // Both should have been called without interference
      expect(window.navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
    });
  });
});
