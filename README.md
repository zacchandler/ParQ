# ParQ

> Never circle Pavia again.

ParQ is an AI-powered parking intelligence prototype for the University of Miami. Mobile-first, demo-grade, deployed to GitHub Pages.

## Demo

Live: **https://zacchandler.github.io/ParQ/**

Add to your iPhone home screen for the full app feel: Safari → Share → "Add to Home Screen".

## Tech

- Next.js 15 (App Router) with `output: 'export'` for static GitHub Pages hosting
- TypeScript
- Tailwind CSS v4 (`@theme` directive, OKLCH-friendly tokens)
- Motion (Framer Motion) for transitions and micro-interactions
- Lucide React icons
- Pure SVG campus map (no external map dependencies — never breaks on stage)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for GitHub Pages

```bash
npm run build
# → outputs static site to ./out
```

A GitHub Actions workflow at `.github/workflows/deploy.yml` automatically builds and deploys on every push to `main`.

The site is served under the repo basePath (`/ParQ`) in production via `next.config.mjs`.

## Demo script

1. **Splash** — `Sign in with CaneID` (auth is simulated, always succeeds)
2. **Home** — Live map with garage pins, "Leave in 14 minutes" alert, upcoming parking
3. **Garage detail** — `Pavia` shows live floor occupancy bars (numbers wobble every 4s)
4. **Schedule** — Auto-imported class schedule, each card has "Park for this class"
5. **Alerts** — Morning insight, system updates, parking confirmations
6. **Profile** — Stats, refer-a-friend card
7. **Voice** (`/voice`) — Tap the mic, watch the response stream in. Uses browser SpeechSynthesis for realism.

## Known limitations (this is a pitch demo)

- Auth is cosmetic. The CaneID button is fake — never blocks
- All data is in-memory. Reload returns to defaults
- No real backend, no API calls
- Garage occupancy "ticks" via a sine wave to feel live
