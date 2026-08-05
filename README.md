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

**Cache-busting**: `css/style.css` and `js/main.js` are referenced in
`index.html` with a `?v=YYYYMMDD` query string. Many hosts (and CDNs in
front of them) cache static CSS/JS/images far more aggressively than
HTML, so after deploying a CSS or JS change, bump that date so caches
treat it as a new file — otherwise visitors (and you) may see new HTML
paired with a stale stylesheet, which looks like layout bugs that
aren't actually in the code anymore.

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

### Light/dark mode

The header includes a light/dark toggle. It defaults to the visitor's OS
preference, remembers an explicit choice in `localStorage`, and an inline
script in `<head>` applies it before first paint (no flash of the wrong
theme). All color tokens live in `css/style.css`'s `:root` block and are
re-defined for dark mode in three places: a `prefers-color-scheme: dark`
media query (OS default), `:root[data-theme="dark"]`, and
`:root[data-theme="light"]` (explicit overrides from the toggle). Add new
colors as tokens there rather than hardcoding hex/rgba values in component
rules, so they stay theme-aware automatically.

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
- **Hosting package feature lists** (`index.html`, both the pricing-grid
  cards and the matching `dialog-hosting-*` popups): Standard now
  includes a quarterly live check-in in addition to its monthly response
  time; Premium's uptime monitoring is worded "with notifications" (vs.
  Standard's "with alerts") and its priority response time reads "same
  business day." Keep the short pricing-card list and the full dialog
  list in sync when either changes.
- **Contact form** (`index.html`, `#contact`): submits to Formspree
  (`https://formspree.io/f/mrenwkqw`) via `fetch` in `js/main.js`, so
  visitors stay on the page and see an inline success/error message.
  Includes a honeypot field (`_gotcha`) for basic spam filtering. Check
  the Formspree dashboard for submissions and to adjust notification
  email / spam settings.
