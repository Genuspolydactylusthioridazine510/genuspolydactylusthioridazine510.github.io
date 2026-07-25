# judezekra.github.io

Personal portfolio for Jude Zekra — MIS student at the University of Georgia.
Plain HTML/CSS/JS, no build step, deployed straight from `main` via GitHub Pages.

## Structure

```
index.html      hero / about / experience / projects / contact
resume.html     full résumé in HTML
blog/           blog index (empty state — no posts written yet)
404.html
robots.txt, sitemap.xml
assets/css/     variables → base → layout → components → animations
assets/js/      nav.js, scroll-reveal.js, smooth-scroll.js, motion.js
assets/img/     favicons, og-image, project artwork
```

CSS loads in that order and later files depend on earlier ones — `variables.css`
holds every colour, spacing and type token, so start there for design changes.

## Content

All content is real, taken from the June 2026 résumé. Two deliberate omissions
for a public page: **phone number and street address are not published**, since
the site is indexed by search engines and scraped by bots. City-level location
(Athens, GA) is included.

There is no downloadable PDF résumé on the site — `resume.html` is the résumé.
If you add a PDF later, redact the phone number first.

## Motion

`motion.js` handles the scroll progress bar, count-up stats, magnetic buttons
and card tilt; `scroll-reveal.js` handles entrance animations. Everything is
gated behind `prefers-reduced-motion`, and pointer effects additionally check
for a fine pointer so touch devices skip them.

Deliberately avoided: `blur()` filters on large elements, `backdrop-filter` on
the sticky header, and `will-change` on many elements — each caused noticeable
jank on lower-powered machines.

## Local preview

Open `index.html` directly, or use the VS Code "Live Server" extension for
auto-reload.

## Deploy

Commit and push to `main`. GitHub Pages rebuilds automatically within a minute.
Asset paths are case-sensitive when served (Linux) but not locally (Windows) —
mismatched casing 404s only after deploy.
