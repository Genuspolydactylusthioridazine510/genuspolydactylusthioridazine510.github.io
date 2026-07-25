# jude-zekra portfolio

Source for the personal portfolio site, built as plain HTML/CSS/JS with no build step, deployed via GitHub Pages.

## Structure

`index.html` (hero / about / projects / contact), `resume.html`, `404.html`.
Styles in `assets/css` (variables → base → layout → components → animations),
behavior in `assets/js` (`nav.js`, `scroll-reveal.js`, `smooth-scroll.js`, `motion.js`).

There is no blog — the placeholder posts were removed. To add one later, create
`blog/index.html` plus a page per post and re-add a nav link.

## Before going live, replace these placeholders

- **Content**: bio text, project descriptions/links, blog posts — currently placeholder copy tailored to an MIS + AI + Legal Studies profile.
- **`assets/resume/jude-zekra-resume.pdf`** — currently a minimal placeholder PDF. Replace with your real resume (keep the same filename, or update the references in `resume.html`).
- **Contact** — currently a direct `mailto:` card (no backend, always works). If you'd rather have a real form, create a free form at formspree.io and swap the card in `index.html` for a `<form action="https://formspree.io/f/YOUR_ID" method="POST">`.
- ~~Social links~~ — done: LinkedIn and GitHub point at the real profiles.
- **Project/blog images** — `assets/img/projects/*.svg` and `assets/img/blog/*.svg` are hand-drawn placeholder mockups. Swap in real screenshots/photos when available.

## Local preview

Install the free "Live Server" VS Code extension, then right-click `index.html` → "Open with Live Server".

## Deploy

See the project plan / conversation for step-by-step GitHub Pages deployment instructions.
