import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";

const AD_DURATION_SECONDS = 30;
const REWARD_PER_AD = 50;

/**
 * Simulated video ad player with anti-cheating safeguards:
 *   - Timer driven by elapsed wall-clock time (interval ticks aren't trusted).
 *   - Pauses & rewinds elapsed accumulation while the tab is hidden, so a user
 *     can't background the tab to grind ads.
 *   - "Skip" / close controls are intentionally absent; the claim button is
 *     disabled until the full duration elapses.
 *   - Cooldown prevents instant re-clicks of the claim button.
 */
export default function AdWatchSection() {
  const { addCredits, adsWatched, hydrated } = useUser();

  const [phase, setPhase] = useState("idle"); // 'idle' | 'playing' | 'ready' | 'claimed'
  const [elapsed, setElapsed] = useState(0);
  const [toast, setToast] = useState(null);

  // Refs are used so the rAF tick reads the latest values without re-binding.
  const startedAtRef = useRef(null);
  const accumulatedRef = useRef(0); // seconds counted while tab was visible
  const lastVisibleAtRef = useRef(null);
  const rafRef = useRef(null);

  const cancelTick = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (lastVisibleAtRef.current != null) {
      const now = performance.now();
      const delta = (now - lastVisibleAtRef.current) / 1000;
      accumulatedRef.current += delta;
      lastVisibleAtRef.current = now;
    }
    const seconds = Math.min(AD_DURATION_SECONDS, accumulatedRef.current);
    setElapsed(seconds);
    if (seconds >= AD_DURATION_SECONDS) {
      setPhase("ready");
      cancelTick();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelTick]);

  // Pause/resume on tab visibility changes.
  useEffect(() => {
    if (phase !== "playing") return undefined;

    const onVisibility = () => {
      if (document.hidden) {
        // Pause: account for time accumulated up to now, then stop counting.
        if (lastVisibleAtRef.current != null) {
          const now = performance.now();
          accumulatedRef.current += (now - lastVisibleAtRef.current) / 1000;
        }
        lastVisibleAtRef.current = null;
        cancelTick();
      } else {
        // Resume: restart the clock from now.
        lastVisibleAtRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase, tick, cancelTick]);

  // Cleanup on unmount.
  useEffect(() => () => cancelTick(), [cancelTick]);

  const startAd = useCallback(() => {
    if (phase === "playing") return;
    accumulatedRef.current = 0;
    startedAtRef.current = performance.now();
    lastVisibleAtRef.current = performance.now();
    setElapsed(0);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(tick);
  }, [phase, tick]);

  const claim = useCallback(() => {
    if (phase !== "ready") return;
    addCredits(REWARD_PER_AD);
    setPhase("claimed");
    setToast(`+${REWARD_PER_AD} credits earned!`);
    setTimeout(() => setToast(null), 3500);
    // Reset for the next ad after a short cooldown.
    setTimeout(() => {
      setPhase("idle");
      setElapsed(0);
      accumulatedRef.current = 0;
    }, 1500);
  }, [phase, addCredits]);

  const remaining = Math.max(0, AD_DURATION_SECONDS - Math.floor(elapsed));
  const progress = Math.min(100, (elapsed / AD_DURATION_SECONDS) * 100);

  return (
    <section className="rounded-2xl border border-white/5 bg-ink-700/50 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Watch &amp; Earn</h2>
          <p className="mt-1 text-sm text-gray-400">
            Watch a {AD_DURATION_SECONDS}s sponsored video. Earn{" "}
            <span className="font-semibold text-white">
              {REWARD_PER_AD} credits
            </span>{" "}
            per completion.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-ink-800/60 px-3 py-1 text-xs text-gray-400">
          {hydrated ? `${adsWatched} ads watched` : "—"}
        </div>
      </div>

      {/* Simulated video frame */}
      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-black">
        <div className="aspect-video w-full">
          <div className="relative h-full w-full bg-gradient-to-br from-ink-800 via-ink-700 to-ink-600">
            {/* Faux content */}
            <div className="absolute inset-0 grid place-items-center text-center">
              {phase === "idle" && (
                <div className="space-y-2">
                  <div className="text-4xl">🎬</div>
                  <p className="text-sm text-gray-400">
                    Press <span className="font-semibold text-white">Watch Ad</span> to begin
                  </p>
                </div>
              )}

              {phase === "playing" && (
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-brand-400">
                    Sponsored • Cannot be skipped
                  </div>
                  <div className="font-mono text-6xl font-bold text-white tabular-nums">
                    {String(remaining).padStart(2, "0")}
                  </div>
                  <p className="max-w-xs text-xs text-gray-500">
                    Keep this tab visible. Switching away pauses the timer.
                  </p>
                </div>
              )}

              {phase === "ready" && (
                <div className="space-y-2">
                  <div className="text-4xl">✓</div>
                  <p className="text-sm text-emerald-400">
                    Ad complete — claim your reward below.
                  </p>
                </div>
              )}

              {phase === "claimed" && (
                <div className="space-y-2">
                  <div className="text-4xl">🎉</div>
                  <p className="text-sm text-emerald-400">
                    +{REWARD_PER_AD} credits added to your balance.
                  </p>
                </div>
              )}
            </div>

            {/* "LIVE / AD" tag */}
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-red-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Ad
            </div>

            {/* Fake disabled video controls (no skip) */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <button
                type="button"
                disabled
                aria-label="Play (controls disabled during ad)"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/60"
              >
                ▶
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-white/70 tabular-nums">
                {String(Math.floor(elapsed)).padStart(2, "0")} /{" "}
                {AD_DURATION_SECONDS}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          {phase === "playing"
            ? "Skipping is disabled. The claim button unlocks at 00."
            : "Reward credited automatically on claim."}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={startAd}
            disabled={phase === "playing" || phase === "ready"}
            className="rounded-lg border border-white/10 bg-ink-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-ink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {phase === "idle" || phase === "claimed" ? "Watch Ad" : "Playing…"}
          </button>
          <button
            type="button"
            onClick={claim}
            disabled={phase !== "ready"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-ink-600 disabled:text-gray-500 disabled:shadow-none"
          >
            Claim +{REWARD_PER_AD} credits
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 animate-fade-in"
        >
          {toast}
        </div>
      )}
    </section>
  );
}
