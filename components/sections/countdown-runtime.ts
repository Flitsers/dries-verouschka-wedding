export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const elapsedTime: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function calculateTimeLeft(
  targetTimestamp: number,
  currentTimestamp: number,
): TimeLeft {
  const difference = targetTimestamp - currentTimestamp;

  if (!Number.isFinite(difference) || difference <= 0) {
    return elapsedTime;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

type CountdownRoot = HTMLElement & {
  __weddingCountdownStop?: () => void;
};

export function startCountdown(
  root: HTMLElement | null,
  targetTimestamp: number,
): () => void {
  if (!root) {
    return () => undefined;
  }

  const countdownRoot = root as CountdownRoot;
  countdownRoot.__weddingCountdownStop?.();

  let intervalId: number | undefined;
  let stopped = false;

  const render = () => {
    const difference = targetTimestamp - Date.now();
    const safeDifference =
      Number.isFinite(difference) && difference > 0 ? difference : 0;
    const timeLeft = {
      days: Math.floor(safeDifference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((safeDifference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((safeDifference / (1000 * 60)) % 60),
      seconds: Math.floor((safeDifference / 1000) % 60),
    };

    for (const unit of ["days", "hours", "minutes", "seconds"] as const) {
      const value = countdownRoot.querySelector<HTMLElement>(
        `[data-countdown-unit="${unit}"]`,
      );

      if (!value) {
        continue;
      }

      const display = value.shadowRoot ?? value.attachShadow({ mode: "open" });
      display.textContent = String(timeLeft[unit]);
    }

    if (safeDifference === 0 && intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const refreshWhenVisible = () => {
    if (document.visibilityState === "visible") {
      render();
    }
  };

  const stop = () => {
    if (stopped) {
      return;
    }

    stopped = true;

    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
    }

    document.removeEventListener("visibilitychange", refreshWhenVisible);
    window.removeEventListener("focus", render);
    window.removeEventListener("pageshow", render);

    if (countdownRoot.__weddingCountdownStop === stop) {
      delete countdownRoot.__weddingCountdownStop;
    }
  };

  countdownRoot.__weddingCountdownStop = stop;
  document.addEventListener("visibilitychange", refreshWhenVisible);
  window.addEventListener("focus", render);
  window.addEventListener("pageshow", render);

  render();

  if (Number.isFinite(targetTimestamp) && targetTimestamp > Date.now()) {
    intervalId = window.setInterval(render, 1000);
  }

  return stop;
}
