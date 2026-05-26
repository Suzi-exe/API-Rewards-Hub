import { useUser } from "@/context/UserContext";

export default function PointsBalance() {
  const { credits, totalEarned, adsWatched, hydrated } = useUser();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-brand-600/30 via-ink-700/60 to-fuchsia-600/20 p-6 sm:p-8 shadow-glow">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-300">
            Credit Balance
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums text-white sm:text-6xl">
              {hydrated ? credits.toLocaleString() : "—"}
            </span>
            <span className="text-base font-medium text-gray-400">credits</span>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Spend credits to redeem keys for premium AI APIs.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-right">
          <div className="rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3">
            <dt className="text-[11px] uppercase tracking-wider text-gray-500">
              Total earned
            </dt>
            <dd className="mt-1 text-lg font-semibold text-white tabular-nums">
              {hydrated ? totalEarned.toLocaleString() : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3">
            <dt className="text-[11px] uppercase tracking-wider text-gray-500">
              Ads watched
            </dt>
            <dd className="mt-1 text-lg font-semibold text-white tabular-nums">
              {hydrated ? adsWatched : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
