# Copilot/Agent Instructions — Portfolio Site

Purpose: Short, actionable guide to help an AI coding agent be productive in this repository.

## Big picture
- Tiny static portfolio website (no backend). Core functionality is client-side DOM + GitHub API fetches.
- Key pages: `portfolio.html` (main site) and `all-projects.html` (dynamically lists GitHub repos).
- JavaScript is vanilla ES2020+ (no build system, no bundler). Keep edits lightweight and dependency-free.

## Key files & responsibilities
- `portfolio.html` — markup and accessibility attributes; contains sections: About, Projects, Certifications, Publications, and site header.
- `portfolio.js` — theme handling (localStorage), smooth scroll & scrollspy (IntersectionObserver), cite modal (aria handling & clipboard fallback).
  - Theme stored in `localStorage` key `theme` and applied via `applyTheme()`.
  - Navigation is id-based: nav anchors call `showSection('...')` or use `href="#section"` + smooth scroll.
- `all-projects.js` — fetches GitHub repos for user `GITHUB_USERNAME` via the public GitHub API. Search, hide-forks and sorting live here.
  - Change the GitHub username at top by editing `GITHUB_USERNAME`. Rate limits / auth handled via headers (see notes below).
- `portfolio.css` — main styling. Keep class names and accessibility-focused markup intact when refactoring.
- `Images/` — static assets referenced directly from HTML.

## Project-specific conventions & patterns
- No build/test tooling — changes should work by opening files in the browser or serving via a simple HTTP server (see run commands below).
- Defensive DOM handling: code checks for missing elements (e.g., `document.getElementById(...)` then `.filter(Boolean)`) — preserve that pattern.
- XSS safety: `escapeHtml()` in `all-projects.js` is used for any GitHub-provided strings — reuse or preserve this when rendering external data.
- Topics display is capped (`topics.slice(0, 6)`); sorting is by `updated_at` descending.
- Accessibility: modals use `aria-hidden`, `role="dialog"`, and `aria-live` status updates. Keep keyboard handlers (Escape) and focus management if you refactor modal logic.

## Common tasks & how to do them
- Run locally (simple):
  - Open `portfolio.html` in the browser (file://) OR run a small static server:
    - Python 3: `python -m http.server 8000` then open `http://localhost:8000/portfolio.html`
- Debugging: Open DevTools (Console/Network). Check fetch responses from `api.github.com`. `all-projects.js` reports errors to console and sets `#status` text.
- If GitHub API fails due to rate limiting, test by adding a temporary local token in `all-projects.js` (DO NOT commit tokens):

```js
// all-projects.js (dev only)
const GITHUB_TOKEN = undefined; // set locally for manual testing
...
const headers = {
  Accept: 'application/vnd.github+json',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};
```

## Mini style guide for changes
- Keep the site dependency-free (no new npm/project tooling) unless we intentionally adopt a build step and add a README migration plan.
- Prefer small, focused edits (one behavior change per PR) and include screenshots or a short GIF for visual changes.
- Keep accessibility attributes intact and add tests (manual) to verify keyboard and screen-reader interactions for modals and navigation.

## Known issues & suggestions (discovered during analysis)
- HTML: there are two stray `</button>` closing tags after the theme toggle button in `portfolio.html` — these are extraneous and should be removed.
- JavaScript: `sectionIds` in `portfolio.js` includes `"contact"` but the DOM has no corresponding `#contact` element. Either add the section or remove the id from the list.

## Good-first tasks for contributors/agents
- Fix the stray `</button>` tags in `portfolio.html` (small markup cleanup).
- Decide whether to add a `contact` section or remove it from `sectionIds` in `portfolio.js`.
- Add a brief `README.md` describing local run/debug steps and the GitHub API caveat (rate limits / token usage).

---
If anything here is unclear or you'd like me to expand a section (examples, test suggestions, or automated checks), tell me which part to expand and I will iterate. ✅
