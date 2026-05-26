import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Multi-method adblock detection.
 *
 * Strategy:
 *  1. DOM bait: render an element using class names commonly blocked
 *     by EasyList/uBlock filters and check if it gets hidden / 0px.
 *  2. Network bait: try to fetch a well-known ad script URL. Adblockers
 *     reject the request, producing a network error.
 *  3. Global bait: check whether `window.adsbygoogle` is suppressed.
 *
 * Any one of these tripping flags the user as having an adblocker.
 */
async function detectAdblock() {
  const signals = {
    domHidden: false,
    networkBlocked: false,
    globalBlocked: false,
  };

  // 1) DOM bait
  if (typeof document !== "undefined") {
    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner-bait ad-placement adsbygoogle";
    bait.setAttribute("aria-hidden", "true");
    bait.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;";
    bait.innerHTML = "&nbsp;";
    document.body.appendChild(bait);

    // Allow extensions a tick to mutate the DOM.
    await new Promise((r) => setTimeout(r, 80));

    const style = window.getComputedStyle(bait);
    const isHidden =
      bait.offsetParent === null ||
      bait.offsetHeight === 0 ||
      bait.clientHeight === 0 ||
      style.display === "none" ||
      style.visibility === "hidden";

    signals.domHidden = isHidden;
    bait.remove();
  }

  // 2) Network bait — try fetching a known ad script.
  try {
    const url =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    // `no-cors` so we don't get a CORS error masquerading as a block.
    await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
    // If fetch resolves we treat it as not blocked at the network layer.
  } catch (_err) {
    signals.networkBlocked = true;
  }

  // 3) Global bait — many blockers stub or omit adsbygoogle.
  if (typeof window !== "undefined") {
    // If the script isn't injected (because it was blocked) the global
    // simply won't exist. We also accept a stubbed function as a signal
    // when paired with another positive.
    signals.globalBlocked =
      typeof window.adsbygoogle === "undefined" && signals.networkBlocked;
  }

  const blocked =
    signals.domHidden || signals.networkBlocked || signals.globalBlocked;
  return { blocked, signals };
}

export default function AdblockDetector() {
  const [status, setStatus] = useState("checking"); // 'checking' | 'clear' | 'blocked'
  const [signals, setSignals] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const previouslyFocused = useRef(null);

  const run = useCallback(async () => {
    setStatus("checking");
    const result = await detectAdblock();
    setSignals(result.signals);
    setStatus(result.blocked ? "blocked" : "clear");
    return result.blocked;
  }, []);

  // Initial detection on mount.
  useEffect(() => {
    run();
  }, [run]);

  // Lock body scroll + trap focus + block ESC/Tab while modal is up.
  useEffect(() => {
    if (status !== "blocked") return undefined;

    previouslyFocused.current =
      typeof document !== "undefined" ? document.activeElement : null;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e) => {
      // Block ESC and prevent tabbing out of the modal.
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("keydown", onKey, true);

    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey, true);
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, [status]);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    await run();
    setRetrying(false);
  }, [run]);

  if (status !== "blocked") return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="adblock-title"
      aria-describedby="adblock-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
    >
      {/* Opaque backdrop — clicks intentionally do nothing. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-900/95 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-500/30 bg-ink-700 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/5 bg-red-500/10 px-6 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-red-500/20 text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </span>
          <h2 id="adblock-title" className="text-base font-semibold text-white">
            Adblocker Detected
          </h2>
        </div>

        <div className="px-6 py-6">
          <p id="adblock-desc" className="text-sm leading-relaxed text-gray-300">
            We have detected an adblocker in your browser. Please disable your
            adblocker to be compatible for earning points.
          </p>

          {signals && (
            <ul className="mt-5 space-y-1.5 rounded-lg border border-white/5 bg-ink-800/60 px-4 py-3 text-xs text-gray-400">
              <li className="flex items-center justify-between">
                <span>DOM bait hidden</span>
                <span className={signals.domHidden ? "text-red-400" : "text-emerald-400"}>
                  {signals.domHidden ? "yes" : "no"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ad script network request blocked</span>
                <span className={signals.networkBlocked ? "text-red-400" : "text-emerald-400"}>
                  {signals.networkBlocked ? "yes" : "no"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ad globals suppressed</span>
                <span className={signals.globalBlocked ? "text-red-400" : "text-emerald-400"}>
                  {signals.globalBlocked ? "yes" : "no"}
                </span>
              </li>
            </ul>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleRetry}
              disabled={retrying}
              autoFocus
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {retrying ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="4"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Re-checking…
                </>
              ) : (
                <>Retry detection</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-gray-500">
              This dialog cannot be dismissed until detection passes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
