import AdWatchSection from "./AdWatchSection";
import History from "./History";
import PointsBalance from "./PointsBalance";
import RedeemSection from "./RedeemSection";

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Watch ads, earn credits, redeem premium AI API keys.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PointsBalance />
          <AdWatchSection />
          <RedeemSection />
        </div>
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <History />
          </div>
        </aside>
      </div>
    </main>
  );
}
