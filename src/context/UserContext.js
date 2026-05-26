import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "api-rewards-hub::user";

const defaultState = {
  credits: 0,
  history: [], // [{ id, apiId, apiName, provider, cost, key, redeemedAt }]
  totalEarned: 0,
  adsWatched: 0,
};

const UserContext = createContext({
  ...defaultState,
  addCredits: () => {},
  redeem: () => ({ ok: false, reason: "uninitialized" }),
  reset: () => {},
  hydrated: false,
});

// Generate a fake but realistic-looking API key for redeemed items.
function generateApiKey(prefix = "ark") {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 32; i += 1) {
    body += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_live_${body}`;
}

export function UserProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...defaultState, ...parsed });
      }
    } catch (err) {
      // Corrupt storage — fall back to defaults.
      console.warn("Failed to read user state from localStorage", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to persist user state", err);
    }
  }, [state, hydrated]);

  const addCredits = useCallback((amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setState((prev) => ({
      ...prev,
      credits: prev.credits + amount,
      totalEarned: prev.totalEarned + amount,
      adsWatched: prev.adsWatched + 1,
    }));
  }, []);

  const redeem = useCallback((api) => {
    if (!api) return { ok: false, reason: "missing-api" };
    let result = { ok: false, reason: "insufficient-credits" };
    setState((prev) => {
      if (prev.credits < api.cost) {
        return prev;
      }
      const entry = {
        id: `${api.id}-${Date.now()}`,
        apiId: api.id,
        apiName: api.name,
        provider: api.provider,
        cost: api.cost,
        key: generateApiKey(api.id.split("-")[0]),
        redeemedAt: new Date().toISOString(),
      };
      result = { ok: true, entry };
      return {
        ...prev,
        credits: prev.credits - api.cost,
        history: [entry, ...prev.history].slice(0, 50),
      };
    });
    return result;
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({ ...state, addCredits, redeem, reset, hydrated }),
    [state, addCredits, redeem, reset, hydrated]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
