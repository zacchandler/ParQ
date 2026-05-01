# ParQ — Design System

> Premium college parking app. Editorial type meets fintech materials. Confident, restrained, distinctive.

---

## 1. Aesthetic Direction

**Editorial-Tech with Coastal Warmth**

ParQ rejects the generic-purple-SaaS look. We pair an opinionated display sans (Cabinet Grotesk) with a warm italic serif (Instrument Serif) used as a *single-word accent* — never headlines, never body — to signal that we care about words. Colors lean into a single-hue purple system warmed by coral; backgrounds are white-cream rather than pure white. Materials are real glass (backdrop-filter), not flat translucent slabs. Numbers are tabular and prominent; we treat *the number itself* as a piece of typography (`num-display`).

**Anti-patterns we avoid**
- Generic Inter at every weight ❌
- Purple-on-white flat slabs ❌
- Emoji as UI icons ❌
- Decorative cards with no informational job ❌
- Fake "AI sparkle" backgrounds with no design intent ❌

---

## 2. Typography

| Role | Family | Weights | Use |
|---|---|---|---|
| Display | **Cabinet Grotesk** (Fontshare) | 700, 800 | Headlines, big numbers, action labels |
| Body | **Satoshi** (Fontshare) | 400, 500, 700, 900 | Paragraphs, UI text, controls |
| Editorial accent | **Instrument Serif** (Google) | 400 italic | One-word accents inside headlines (`back.`, `map`, `schedule`) |
| Numerals | **JetBrains Mono** (Google) | 500, 700 | Times, percentages, occupancy figures |

**Headline pattern (signature):**
```tsx
<h1 className="font-display text-[40px] font-extrabold tracking-[-0.04em]">
  Good morning,<br/>
  <span className="font-serif italic font-normal text-[var(--color-purple-600)]">Alex.</span>
</h1>
```

**Type scale** (display headlines): 28 / 32 / 40 / 44 — never smaller than 22 for h2. Body: 13 / 14 / 15. Captions: 10 / 11 / 12 with `tracking-widest uppercase` for editorial labels.

---

## 3. Color

```css
/* Brand */
--color-purple-50  #F6F0FB
--color-purple-100 #EADBF6
--color-purple-300 #BD92E4
--color-purple-500 #7E3DC6   /* primary brand */
--color-purple-600 #5E1FA8   /* primary CTA */
--color-purple-700 #461382
--color-purple-900 #1B0438   /* deep stage */

/* Warm accent */
--color-coral-400  #FFA37A
--color-coral-500  #FF7849   /* time, "you have N spots" */
--color-coral-600  #E85829

/* Status */
--color-status-green  #1AAF6E   /* plenty */
--color-status-yellow #E8A33D   /* limited */
--color-status-red    #E63946   /* full */

/* Neutrals */
--color-bg       #FBF9FC   /* page */
--color-bg-deep  #F2ECF6   /* track behind progress */
--color-surface  #FFFFFF
--color-ink      #100A1C   /* near-black with violet tint */
--color-ink-soft #3A2F50
--color-mute     #7A6F8A
--color-line     #ECE3F1
```

Rules:
- **Purple is the brand** — never substitute. Coral is the accent, used sparingly for "live" data.
- Backgrounds carry violet bias, never pure neutrals.
- Status colors are reserved for *actual* state (green = available, yellow = scarce, red = full).
- The deep purple (`#1B0438`) is reserved for: the desktop phone-frame stage, dark hero cards, and OS chrome.

---

## 4. Materials & Elevation

- **`.glass`** — frosted white panel for nav and floating chips. `backdrop-filter: saturate(180%) blur(24px)`.
- **`.glass-dark`** — frosted purple panel for hero cards on dark backgrounds.
- **`--shadow-soft`** — default card shadow, tinted purple.
- **`--shadow-glass`** — hover state, deeper purple shadow + inner highlight.
- **`--shadow-deep`** — hero cards, heavily tinted, dramatic.
- **Grain overlay** — applied via `.grain::before` on the desktop stage for analog warmth.

---

## 5. Layout & Composition

- **Mobile canvas**: 390–440px. Page padding `px-5` (20px). Section vertical rhythm `space-y-7`.
- **Desktop**: app renders inside a 420×860 iPhone bezel against the deep purple stage. Real safe-area insets honored on mobile via `safe-top` / `safe-bottom`.
- **Cards**: radius `20–28px`. Real cards have `border + shadow + tinted bg`. Hero cards use radial gradients + aurora blur blobs.
- **Sticky elements**: AppHeader uses `glass`. BottomNav uses `glass` over real content.

---

## 6. Motion

- Page entry: stagger sections at `delay: 0.05–0.32s`, `duration: 0.4–0.45s`, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Tap: `scale: 0.97`, spring `stiffness: 400, damping: 25`.
- Bottom-nav indicator uses Motion `layoutId` for shared-element transitions.
- Map pins: subtle `pulse-ring` for the "you are here" dot.
- Progress bars: spring fill (`stiffness: 80, damping: 18`).
- Respects `prefers-reduced-motion` via Motion's defaults.

---

## 7. Maps

The live map is **Leaflet + CARTO Voyager tiles** (free, no API key). A CSS filter (`saturate(0.55) brightness(1.04) hue-rotate(258deg)`) shifts the basemap into the brand's purple palette so the map *feels* like part of ParQ rather than a foreign embed.

Markers are HTML `divIcon`s rendered with the same Cabinet Grotesk type as the rest of the app, using `statusColor` (green / yellow / red) per garage. The marker contains a label pill + custom SVG pin shape with drop shadow.

Clicking a marker uses `useRouter().push` (not `<a>` inside SVG, which breaks).

---

## 8. Components

| Component | Path | Notes |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | `primary` (magenta), `purple` (purple), `outline`, `ghost`, `soft`. Motion-wrapped. |
| `Card` | `components/ui/Card.tsx` | Base white card, used by feature surfaces. |
| `AppHeader` | `components/AppHeader.tsx` | Glass top bar with logo + bell + optional back/search. |
| `BottomNav` | `components/BottomNav.tsx` | 4 tabs, active indicator with `layoutId`. |
| `LiveMap` / `LiveMapInner` | `components/LiveMap*.tsx` | Dynamic-imported Leaflet map. Static-export safe. |
| `PhoneFrame` | `components/PhoneFrame.tsx` | Wraps app in iPhone bezel on desktop. |

---

## 9. Auth

The sign-in screen is **provider-agnostic** ("Email or Cane ID" — fits any college). Visual primitives:
- Logo slot at top-left (`/public/logo.svg`, swappable)
- BETA pill (live-status dot + word)
- Headline with serif accent (`Welcome / back.`)
- Email + password fields with `4px ring` focus state in purple
- Show/hide password eye toggle
- Custom checkbox for Remember me (animated checkmark)
- Sign in button (purple, deep shadow)
- Divider with `OR CONTINUE WITH`
- Google + Microsoft OAuth buttons (real brand SVG icons, white-bg / line border)

The actual auth is simulated — the button just routes to `/home` after a 1.1s delay regardless of input.

---

## 10. File map

```
app/
  page.tsx              ← Sign-in
  home/page.tsx         ← Home with hero + live map
  schedule/page.tsx     ← Class list + map
  garage/[id]/page.tsx  ← Garage detail (+ generateStaticParams)
  alerts/page.tsx
  profile/page.tsx
  voice/page.tsx
  layout.tsx            ← Wraps everything in PhoneFrame
  globals.css           ← Tokens + utilities
components/
  PhoneFrame.tsx        ← Desktop iPhone bezel
  AppHeader.tsx
  BottomNav.tsx
  LiveMap.tsx           ← dynamic-import wrapper
  LiveMapInner.tsx      ← Leaflet map
  ui/Button.tsx
  ui/Card.tsx
lib/
  mockData.ts           ← Garages with real lat/lng, mock spot counts
  utils.ts              ← cn(), asset(), basePath, time formatting
public/
  logo.svg              ← Brand mark (swappable)
  manifest.webmanifest  ← PWA install metadata
```
