import { useState } from "react";
import mockApis from "@/data/mockApis";
import { useUser } from "@/context/UserContext";

function ApiCard({ api, balance, onRedeem }) {
  const canAfford = balance >= api.cost;
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-700/40 p-6 transition hover:border-brand-500/40 ${
        !canAfford ? "opacity-90" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${api.accent} opacity-60`}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest text-gray-400">
            {api.provider}
          </span>
          {api.badge && (
            <span className="rounded-full border border-white/10 bg-ink-800/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-300">
              {api.badge}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-lg font-semibold text-white">{api.name}</h3>
        <p className="mt-2 min-h-[3.5rem] text-sm leading-relaxed text-gray-400">
          {api.description}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500">
              Cost
            </p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {api.cost.toLocaleString()}
              <span className="ml-1 text-sm font-medium text-gray-400">
                credits
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRedeem(api)}
            disabled={!canAfford}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-ink-600 disabled:text-gray-500"
          >
            {canAfford ? "Redeem" : "Locked"}
          </button>
        </div>

        {!canAfford && (
          <p className="mt-3 text-[11px] text-gray-500">
            Need {(api.cost - balance).toLocaleString()} more credits.
          </p>
        )}
      </div>
    </article>
  );
}

function RedeemModal({ entry, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!entry) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="redeem-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/30 bg-ink-700 p-6 shadow-2xl animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400">
              Redeemed
            </p>
            <h2 id="redeem-title" className="mt-1 text-xl font-semibold text-white">
              {entry.apiName}
            </h2>
            <p className="text-sm text-gray-400">{entry.provider}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-ink-800/70 p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500">
            Your API Key
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 break-all rounded-md bg-ink-900/80 px-3 py-2 font-mono text-xs text-emerald-300">
              {entry.key}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-md bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-500"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-gray-500">
            Demo key — for prototype purposes only. Store it somewhere safe.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-white/10 bg-ink-800 px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-ink-600"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function RedeemSection() {
  const { credits, redeem, hydrated } = useUser();
  const [redeemed, setRedeemed] = useState(null);
  const [error, setError] = useState(null);

  const handleRedeem = (api) => {
    setError(null);
    const result = redeem(api);
    if (result.ok) {
      setRedeemed(result.entry);
    } else {
      setError("Not enough credits to redeem this API.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Redeem an API</h2>
          <p className="mt-1 text-sm text-gray-400">
            Spend credits to unlock keys for premium AI models.
          </p>
        </div>
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockApis.map((api) => (
          <ApiCard
            key={api.id}
            api={api}
            balance={hydrated ? credits : 0}
            onRedeem={handleRedeem}
          />
        ))}
      </div>

      <RedeemModal entry={redeemed} onClose={() => setRedeemed(null)} />
    </section>
  );
}
