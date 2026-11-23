export type FeedbackKind = "correct" | "mismatch";

let sharedAudioContext: AudioContext | null = null;
let audioUnavailableWarned = false;

function warnAudioUnavailable(error?: unknown): void {
  if (audioUnavailableWarned) {
    return;
  }

  audioUnavailableWarned = true;
  console.warn("Audio feedback is unavailable.", error);
}

export function playFeedback(kind: FeedbackKind): void {
  if (typeof window === "undefined" || typeof window.AudioContext !== "function") {
    warnAudioUnavailable();
    return;
  }

  try {
    sharedAudioContext ??= new window.AudioContext();
    const context = sharedAudioContext;
    const playTones = () => {
      const tone =
        kind === "correct"
          ? {
              frequencies: [784, 988, 1175],
              type: "sine" as OscillatorType,
              peak: 0.14,
              spacing: 0.1,
              duration: 0.23,
            }
          : {
              frequencies: [262, 196],
              type: "square" as OscillatorType,
              peak: 0.2,
              spacing: 0.12,
              duration: 0.28,
            };

      tone.frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const startTime = context.currentTime + index * tone.spacing;

        oscillator.type = tone.type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(tone.peak, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + tone.duration - 0.02,
        );
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + tone.duration);
      });
    };

    if (context.state === "suspended") {
      void context.resume().then(playTones).catch(warnAudioUnavailable);
    } else {
      playTones();
    }
  } catch (error) {
    warnAudioUnavailable(error);
  }
}

export function vibrateForMismatch(): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  try {
    navigator.vibrate(35);
  } catch (error) {
    console.warn("Vibration feedback is unavailable.", error);
  }
}

export function vibrateForSuccess(): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  try {
    navigator.vibrate([100, 50, 100]);
  } catch (error) {
    console.warn("Vibration feedback is unavailable.", error);
  }
}
