import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { credits, hydrated } = useUser();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white font-bold shadow-glow">
            AR
          </span>
          <span className="text-base font-semibold tracking-tight text-white group-hover:text-brand-400 transition">
            API Rewards Hub
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden sm:inline text-sm text-gray-300 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:inline text-sm text-gray-300 hover:text-white transition"
          >
            Dashboard
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-700/60 px-3 py-1.5 text-sm">
            <span aria-hidden className="text-amber-400">★</span>
            <span className="font-medium text-white">
              {hydrated ? credits.toLocaleString() : "—"}
            </span>
            <span className="text-gray-400">credits</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
