import { useUser } from "@/context/UserContext";

function maskKey(key) {
  if (!key || key.length < 12) return key;
  return `${key.slice(0, 10)}…${key.slice(-4)}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function History() {
  const { history, hydrated } = useUser();

  return (
    <section className="rounded-2xl border border-white/5 bg-ink-700/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent redemptions</h2>
        <span className="text-xs text-gray-500">
          {hydrated ? `${history.length} total` : ""}
        </span>
      </div>

      {!hydrated ? (
        <p className="mt-6 text-sm text-gray-500">Loading…</p>
      ) : history.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-ink-800/40 p-8 text-center">
          <p className="text-sm text-gray-400">
            No redemptions yet. Watch some ads, then spend your credits!
          </p>
        </div>
      ) : (
        <ul className="scroll-thin mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
          {history.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-ink-800/50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {h.apiName}
                  <span className="ml-2 text-xs text-gray-500">
                    {h.provider}
                  </span>
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-gray-500">
                  {maskKey(h.key)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-white tabular-nums">
                  −{h.cost.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500">
                  {formatDate(h.redeemedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
