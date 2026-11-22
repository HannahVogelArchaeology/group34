# Group 34 exhibition sandbox

Last verified: 2026-11-22

## Stack

Vendored Minima 2.5.2 templates, Jekyll 4.3.4 and Ruby 4.0.6. GitHub Pages
serves the repository as a project site under `/group34`.

## Commands

- `bundle exec jekyll serve` — local site at `http://127.0.0.1:4000/group34/`
- `bundle exec jekyll build` — static production build
- `npm test` (in `tests/`) — Playwright end-to-end checks of the built site

## Structure

- root Markdown files — student-editable pages
- `_config.yml` — identity, project path and navigation order
- `_includes/` and `_layouts/` — semantic shared structure
- `_sass/` and `assets/` — vendored theme and accessibility changes
- `scripts/` — helpers: `make-responsive-images.py` (smaller image copies), `minify-site.mjs` (HTML and JSON), `serve-compressed.mjs` (compressed local server for Lighthouse), `check-cdn-integrity.mjs` and `find-unused-assets.mjs`
- `tests/` — Playwright tests; `TESTING.md` lists the supported browsers
- `CITATION.cff` — contributors' preferred public attribution

## Conventions and boundaries

Read `AGENTS.md` before changing content. Keep archaeological claims tied to
evidence and keep rights records with media. Preserve `baseurl: "/group34"`,
Ruby and dependency locks, action pins, licensing, native navigation controls,
and keyboard-visible focus.
Commits to `main` become public automatically; Lighthouse reports regressions
but does not block the independent Pages deployment.
