# API Rewards Hub

> Unlock the power of AI for free. Watch ads, earn credits, redeem keys for premium AI APIs.

A modern, dark-themed Next.js web app that lets users earn credits by watching short
video advertisements. Credits can then be redeemed for keys to popular AI APIs
(Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, Llama 3.1 405B, Mistral Large,
Perplexity Sonar).

This is a front-end prototype: state is persisted to `localStorage`, and the
"video ad" is simulated with a 30-second countdown.

## Features

- **Landing page** with a dark hero, 3-step explainer (Watch → Earn → Redeem),
  and a `Get Started` CTA.
- **Dashboard** displaying:
  - **Credit Balance** — prominent gradient hero card with totals and stats.
  - **Watch & Earn** — non-skippable 30s ad with anti-cheat protections.
  - **Redeem Section** — grid of API cards with cost, badge, and redeem flow.
  - **History** — log of recent redemptions with masked keys and timestamps.
- **Anti-Adblock System**: a non-closeable modal that detects adblockers via three
  independent signals (DOM bait, network bait, missing globals).

## Tech stack

- [Next.js 14](https://nextjs.org/) — Pages Router
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- React Context API + `localStorage` for client-side state

## Folder structure

```
API-Rewards-Hub/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── src/
    ├── components/
    │   ├── AdblockDetector.js   # Non-closeable adblock modal
    │   ├── AdWatchSection.js    # 30s countdown ad + claim
    │   ├── Dashboard.js         # Page composition
    │   ├── History.js           # Recent redemptions list
    │   ├── LandingPage.js       # Hero + how-it-works + CTA
    │   ├── Navbar.js            # Sticky header w/ credit balance
    │   ├── PointsBalance.js     # Credit balance hero card
    │   └── RedeemSection.js     # API grid + redemption modal
    ├── context/
    │   └── UserContext.js       # Credits, history, persistence
    ├── data/
    │   └── mockApis.js          # API catalog (id, cost, copy)
    ├── pages/
    │   ├── _app.js              # Providers, head, global wiring
    │   ├── dashboard.js         # /dashboard route
    │   └── index.js             # / (landing) route
    └── styles/
        └── globals.css          # Tailwind layers + bait selectors
```

## Running locally

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

## How the ad-watch mechanism works

1. User clicks **Watch Ad**. A 30s simulated player starts.
2. The countdown is driven by `performance.now()` deltas — not by trusting
   interval ticks — so throttled timers don't grant extra credits.
3. `document.visibilitychange` pauses the timer when the tab is hidden.
   This prevents users from backgrounding the tab to grind ads.
4. The **Claim** button is disabled until the elapsed time hits 30s.
5. On claim, **+50 credits** are added to the balance via React Context and
   persisted to `localStorage` under `api-rewards-hub::user`.

## How the adblock detector works

`AdblockDetector` runs three independent checks on mount:

1. **DOM bait**: a hidden `<div>` is appended with class names that
   EasyList/uBlock filters target (`.adsbox`, `.adsbygoogle`,
   `.ad-banner-bait`, `.ad-placement`). After 80ms, the element's computed
   style and dimensions are inspected. If it was hidden/zero-sized, the user
   is flagged.
2. **Network bait**: a `HEAD` request to a known ad script
   (`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`) is fired with
   `mode: "no-cors"`. If it rejects, an adblocker likely intercepted it.
3. **Global bait**: presence of `window.adsbygoogle` is checked. Combined
   with a network block, an absent global is treated as further evidence.

If any signal trips, a non-closeable modal renders:

- The backdrop swallows clicks.
- A capture-phase `keydown` listener blocks `Escape`.
- `document.body.style.overflow` is locked to `hidden`.
- The only interactive element is a **Retry detection** button that re-runs
  all three checks.

## Notes

- The "API keys" generated on redemption are random strings — they are not
  real credentials and won't authenticate against any provider.
- All state lives in the browser. Clearing site data resets the user.
