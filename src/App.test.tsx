// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import App from "./App";
import { playFeedback, vibrateForMismatch, vibrateForSuccess } from "./game/feedback";

vi.mock("./game/feedback", () => ({
  playFeedback: vi.fn(),
  vibrateForMismatch: vi.fn(),
  vibrateForSuccess: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Shape Sorter interactions", () => {
  it("dispatches the correct feedback for matching and mismatching taps", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryAllByRole("button", { name: /^Select / }).length).toBeGreaterThanOrEqual(6);
    }, { timeout: 3000 });

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0]!;
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);
    fireEvent.click(
      screen.getByRole("button", { name: `${firstShape} silhouette target` }),
    );

    expect(playFeedback).toHaveBeenCalledWith("correct");
    // After match, the colored shape is removed from DOM, so check for silhouette being matched
    expect(
      screen.getByRole("button", { name: `${firstShape} silhouette matched` }),
    ).toBeDefined();

    const nextSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const nextShape = nextSource.getAttribute("aria-label")!.replace("Select ", "");
    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => button.getAttribute("aria-label") !== `${nextShape} silhouette target`);

    expect(wrongTarget).toBeDefined();
    fireEvent.click(nextSource);
    fireEvent.click(wrongTarget!);

    expect(playFeedback).toHaveBeenNthCalledWith(2, "mismatch");
    expect(vibrateForMismatch).toHaveBeenCalledOnce();
    // After mismatch, shape should remain selected for immediate retry
    expect(nextSource.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe(
      "Not a match. Try a different silhouette.",
    );
    expect(
      screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    ).toBe("1");
  });

  it("triggers success vibration when shapes match", () => {
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);
    fireEvent.click(
      screen.getByRole("button", { name: `${firstShape} silhouette target` }),
    );

    expect(vibrateForSuccess).toHaveBeenCalledOnce();
  });

  it("animates matched shape to silhouette position with is-matched class", () => {
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");
    const silhouette = screen.getByRole("button", {
      name: `${firstShape} silhouette target`,
    });

    fireEvent.click(firstSource);
    fireEvent.click(silhouette);

    // After match, colored shape is removed from DOM, silhouette now shows as matched
    expect(silhouette.classList.contains("is-matched")).toBe(true);
    expect(silhouette.hasAttribute("disabled")).toBe(true);
    // Colored shape should no longer exist in DOM
    expect(screen.queryAllByRole("button", { name: `Select ${firstShape}` })).toHaveLength(0);
  });

  it("prevents re-entry during matched shape animation", () => {
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);
    fireEvent.click(
      screen.getByRole("button", { name: `${firstShape} silhouette target` }),
    );

    // After match, colored shape is removed, silhouette is now disabled and matched
    const matchedSilhouette = screen.getByRole("button", {
      name: `${firstShape} silhouette matched`,
    });
    expect(matchedSilhouette.hasAttribute("disabled")).toBe(true);
    expect(matchedSilhouette.classList.contains("is-matched")).toBe(true);
    // Original colored shape should be gone from DOM
    expect(screen.queryAllByRole("button", { name: `Select ${firstShape}` })).toHaveLength(0);
  });

  it("supports keyboard selection, completion, and replay", async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    async function activateWithKeyboard(button: HTMLElement) {
      for (let tab = 0; tab < 20 && document.activeElement !== button; tab += 1) {
        await user.tab();
      }

      expect(document.activeElement).toBe(button);
      await user.keyboard("{Enter}");
    }

    await activateWithKeyboard(firstSource);
    expect(firstSource.getAttribute("aria-pressed")).toBe("true");
    expect(firstSource.classList.contains("is-selected")).toBe(true);

    const selectedName = firstSource.getAttribute("aria-label")!.replace("Select ", "");
    await activateWithKeyboard(
      screen.getByRole("button", { name: `${selectedName} silhouette target` }),
    );

    for (let match = 1; match < 5; match += 1) {
      const source = screen.getAllByRole("button", { name: /^Select / })[0];
      const shapeName = source.getAttribute("aria-label")!.replace("Select ", "");
      await activateWithKeyboard(source);
      await activateWithKeyboard(
        screen.getByRole("button", { name: `${shapeName} silhouette target` }),
      );
    }

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("5");
    const replayButton = screen.getByRole("button", { name: "Play again" });
    expect(replayButton).toBeDefined();
    await activateWithKeyboard(replayButton);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("applies shake animation class to target silhouette on mismatch", () => {
    render(<App />);

    // Select the first shape
    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);

    // Find a target that doesn't match
    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => !button.getAttribute("aria-label")?.includes(firstShape));

    expect(wrongTarget).toBeDefined();

    // Tap the wrong target
    fireEvent.click(wrongTarget!);

    // Verify the target has the shake animation class
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(true);
  });

  it("removes shake animation class after animation duration", async () => {
    vi.useFakeTimers();

    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);

    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => !button.getAttribute("aria-label")?.includes(firstShape));

    expect(wrongTarget).toBeDefined();
    fireEvent.click(wrongTarget!);

    // Animation class should be applied
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(true);

    // Fast-forward through the 400ms animation duration
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // Animation class should be removed
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(false);

    vi.useRealTimers();
  });

  it("prevents repeated clicks during shake animation", () => {
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);

    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => !button.getAttribute("aria-label")?.includes(firstShape));

    expect(wrongTarget).toBeDefined();

    // Click once to trigger mismatch
    fireEvent.click(wrongTarget!);
    expect(playFeedback).toHaveBeenCalledWith("mismatch");

    const callCountAfterFirst = vi.mocked(playFeedback).mock.calls.length;

    // Try to click again while animating
    fireEvent.click(wrongTarget!);

    // Should not trigger another mismatch sound
    expect(vi.mocked(playFeedback).mock.calls.length).toBe(callCountAfterFirst);
  });

  it("allows retry with same selected shape after mismatch", () => {
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);
    expect(firstSource.getAttribute("aria-pressed")).toBe("true");

    // Tap wrong target
    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => !button.getAttribute("aria-label")?.includes(firstShape));

    fireEvent.click(wrongTarget!);
    expect(playFeedback).toHaveBeenCalledWith("mismatch");

    // Shape should still be selected for retry
    expect(firstSource.getAttribute("aria-pressed")).toBe("true");
    expect(firstSource.classList.contains("is-selected")).toBe(true);

    // Can tap correct target now
    const correctTarget = screen.getByRole("button", {
      name: `${firstShape} silhouette target`,
    });

    fireEvent.click(correctTarget);
    expect(playFeedback).toHaveBeenCalledWith("correct");
  });

  it("handles rapid mismatch attempts without breaking state", async () => {
    vi.useFakeTimers();
    render(<App />);

    const firstSource = screen.getAllByRole("button", { name: /^Select / })[0];
    const firstShape = firstSource.getAttribute("aria-label")!.replace("Select ", "");

    fireEvent.click(firstSource);

    const wrongTarget = screen
      .getAllByRole("button", { name: /silhouette target$/ })
      .find((button) => !button.getAttribute("aria-label")?.includes(firstShape));

    // First mismatch
    fireEvent.click(wrongTarget!);
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(true);

    // Try to click again immediately (should be ignored)
    fireEvent.click(wrongTarget!);

    // Advance time to clear first animation
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(false);

    // Should be able to attempt another mismatch
    fireEvent.click(wrongTarget!);
    expect(wrongTarget?.classList.contains("is-shaking")).toBe(true);

    vi.useRealTimers();
  });
});
