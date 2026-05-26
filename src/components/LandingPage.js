import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Watch Ads",
    body: "Watch short, non-skippable video ads from our network. Each completed ad rewards you with credits.",
    icon: "▶",
  },
  {
    n: "02",
    title: "Earn Points",
    body: "Credits accumulate in your balance instantly. Track your progress on a clean, modern dashboard.",
    icon: "★",
  },
  {
    n: "03",
    title: "Redeem API Keys",
    body: "Spend credits on premium AI APIs — Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, and more.",
    icon: "🔑",
  },
];

const featuredApis = [
  { name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { name: "GPT-4o", provider: "OpenAI" },
  { name: "Gemini 1.5 Pro", provider: "Google" },
  { name: "Llama 3.1 405B", provider: "Meta" },
];

export default function LandingPage() {
  return (
    <main className="relative isolate overflow-hidden">
      {/* Hero */}
      <section className="relative bg-grid">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              No credit card. No subscription. Just watch and earn.
            </div>
            <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              Unlock the Power of AI for Free.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              Earn credits by watching short video ads, then redeem them for
              keys to the world's most powerful AI APIs. Build smarter apps
              without burning through your wallet.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500"
              >
                Get Started
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-300 hover:text-white transition"
              >
                How it works
              </a>
            </div>

            {/* Featured APIs ticker */}
            <div className="mt-14">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Redeem keys for
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {featuredApis.map((api) => (
                  <div
                    key={api.name}
                    className="rounded-full border border-white/10 bg-ink-700/60 px-4 py-1.5 text-sm text-gray-300"
                  >
                    <span className="font-medium text-white">{api.name}</span>
                    <span className="ml-2 text-gray-500">{api.provider}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative border-t border-white/5 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three steps. Zero friction.
            </h2>
            <p className="mt-4 text-gray-400">
              Watch Ads → Earn Points → Redeem API Keys.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-ink-700/40 p-6 transition hover:border-brand-500/40 hover:bg-ink-700/70"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-lg text-brand-400">
                    {s.icon}
                  </span>
                  <span className="font-mono text-xs text-gray-500">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            Ready to start earning?
          </h3>
          <p className="mt-3 text-gray-400">
            Open the dashboard and watch your first ad in less than a minute.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gray-100"
          >
            Go to Dashboard
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} API Rewards Hub — A demo project.
      </footer>
    </main>
  );
}
