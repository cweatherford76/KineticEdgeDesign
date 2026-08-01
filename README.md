# Kinetic Edge Design

Marketing site for Kinetic Edge Design — a web design and managed hosting
business for small and mid-sized businesses.

**Modern websites. Managed hosting. Moving business forward.**

Live domains (once hosting is set up): `kineticedge.design`, redirecting
from `kineticedgedesign.com`.

## Tech stack

Plain HTML, CSS, and vanilla JS — no framework, no build step, no
dependencies. Any static host (Hostinger, Netlify, GitHub Pages, S3, etc.)
can serve this repo's contents as-is.

## Project structure

```
index.html              All page content and markup (single page, anchor nav)
css/style.css           All styling — colors, layout, animations
js/main.js              Mobile nav toggle, scroll-reveal, footer year
assets/
  favicon-32.png        Browser tab icon
  favicon-180.png        Apple touch icon
  favicon-512.png        General-purpose / PWA icon
  logo/
    kinetic-edge-logo-transparent.png   Full logo (icon + wordmark), transparent bg
    kinetic-edge-logo-white.png         Full logo, white bg
    kinetic-edge-icon.png               Icon mark only, transparent bg
```

## Previewing locally

No build step — just serve the folder and open it:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`.

## Deploying

Upload the repo contents (or point the host at this repo) to whatever
static hosting is chosen. No server-side code, no environment variables,
no build command required.

## Brand reference

Colors are defined as CSS custom properties at the top of `css/style.css`:

| Token | Hex | Use |
|---|---|---|
| `--blue` | `#009cfe` | Primary accent — links, highlights, gradients |
| `--navy` | `#1a2732` | Primary text, buttons, headings |
| `--yellow` | `#ffdb2b` | Sparing accent only — "Most Popular" tags, the trust-strip star icon, the capacity-badge dot, the offer callout |
| `--bg` / `--bg-alt` | `#ffffff` / `#f1f6ff` | Page background / alternating section tint |

Logo source files live in `assets/logo/`. Use the transparent version on
white/light backgrounds (the whole site) and the white-background version
anywhere a flat backing is needed (email signatures, social profiles,
print).

## Content that needs periodic upkeep

- **Hero capacity badge** (`index.html`, marked `<!-- UPDATE PERIODICALLY -->`
  just above it): states current project backlog ("1–2 weeks"). Update this
  whenever actual turnaround time changes — a stale claim here undercuts
  the trust the rest of the site is built on.
- **Pricing page copy** — the original brand brief flagged several things
  to pin down before pricing goes fully public: number of revisions
  included per package, deposit/final payment split, exact scope of a
  "basic monthly update," backup retention by hosting tier, and the
  precise limits on Premium's monthly updates/seasonal refreshes. Worth
  finalizing these with the client before launch.
- **Contact form** (`index.html`, `#contact`): currently submits via
  `mailto:info@kineticedge.design` since there's no backend yet. Swap for
  a real form handler (Formspree, a Stripe-connected backend, etc.) once
  hosting is chosen.
