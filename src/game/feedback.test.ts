import { afterEach, describe, expect, it, vi } from "vitest";

function createAudioContextStub(
  state: "running" | "suspended" = "running",
  resumeImplementation: () => Promise<void> = () => Promise.resolve(),
) {
  class FakeAudioContext {
    static latest: FakeAudioContext;

    state = state;
    currentTime = 0;
    destination = {};
    oscillatorCount = 0;
    oscillatorFrequencies: number[] = [];
    oscillators: { type: OscillatorType }[] = [];
    resume = vi.fn(resumeImplementation);

    constructor() {
      FakeAudioContext.latest = this;
    }

    createOscillator() {
      this.oscillatorCount += 1;
      const oscillator = {
        type: "sine" as OscillatorType,
        frequency: {
          setValueAtTime: vi.fn((frequency: number) =>
            this.oscillatorFrequencies.push(frequency),
          ),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      this.oscillators.push(oscillator);
      return oscillator;
    }

    createGain() {
      return {
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
    }
  }

  return FakeAudioContext;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("browser feedback", () => {
  it("plays feedback tones and requests a short vibration for a mismatch", async () => {
    const FakeAudioContext = createAudioContextStub();
    const vibrate = vi.fn();
    vi.stubGlobal("window", { AudioContext: FakeAudioContext });
    vi.stubGlobal("navigator", { vibrate });

    const { playFeedback, vibrateForMismatch } = await import("./feedback");
    playFeedback("correct");
    playFeedback("mismatch");
    vibrateForMismatch();

    expect(FakeAudioContext.latest.oscillatorCount).toBe(5);
    expect(FakeAudioContext.latest.oscillatorFrequencies).toEqual([
      784,
      988,
      1175,
      262,
      196,
    ]);
    expect(FakeAudioContext.latest.oscillators.map(({ type }) => type)).toEqual([
      "sine",
      "sine",
      "sine",
      "square",
      "square",
    ]);
    expect(vibrate).toHaveBeenCalledWith(35);
  });

  it("resumes a suspended audio context before playing the success chime", async () => {
    const FakeAudioContext = createAudioContextStub("suspended");
    vi.stubGlobal("window", { AudioContext: FakeAudioContext });

    const { playFeedback } = await import("./feedback");
    playFeedback("correct");

    await vi.waitFor(() =>
      expect(FakeAudioContext.latest.oscillatorCount).toBe(3),
    );
    expect(FakeAudioContext.latest.resume).toHaveBeenCalledOnce();
  });

  it("warns when a suspended audio context cannot resume", async () => {
    const FakeAudioContext = createAudioContextStub("suspended", () =>
      Promise.reject(new Error("Audio is blocked.")),
    );
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal("window", { AudioContext: FakeAudioContext });

    const { playFeedback } = await import("./feedback");
    playFeedback("mismatch");

    await vi.waitFor(() => expect(warning).toHaveBeenCalledOnce());
    expect(FakeAudioContext.latest.oscillatorCount).toBe(0);
  });

  it("keeps the game usable when audio and vibration are unavailable", async () => {
    vi.resetModules();
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", {});
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const { playFeedback, vibrateForMismatch } = await import("./feedback");

    expect(() => playFeedback("correct")).not.toThrow();
    expect(() => vibrateForMismatch()).not.toThrow();
    expect(warning).toHaveBeenCalledOnce();
  });
});
