# Testing: minimum browser and device matrix

This is the smallest set of browsers and devices the site must work on. The automated rows run in
GitHub Actions (`.github/workflows/browser-matrix.yml`) on every push and pull request. The manual
rows are checked by a person before a release, because a robot cannot hear a screen reader.

## Automated matrix (GitHub Actions)

| Row (Playwright project) | Engine | Device or window | Why it is here |
| --- | --- | --- | --- |
| `desktop-chromium` | Chromium | Desktop, 1280 px | Chrome and Edge on Windows, macOS, ChromeOS |
| `desktop-firefox` | Firefox | Desktop, 1280 px | Firefox with NVDA is a common screen reader pairing |
| `desktop-webkit` | WebKit | Desktop, 1280 px | Stand-in for desktop Safari |
| `android-phone` | Chromium | Pixel 7 (touch) | Android Chrome |
| `iphone` | WebKit | iPhone 14 (touch) | iOS Safari |
| `ipad` | WebKit | iPad (gen 7) (touch) | Tablet, wide drawer layout |
| `width-780-sidebar` | Chromium | 780 px wide | Narrowest width that still shows the sidebar |
| `width-779-drawer` | Chromium | 779 px wide | Widest width that uses the drawer menu |
| `width-320-small-phone` | Chromium | 320 px wide | Smallest phone width (WCAG reflow) |

Every row runs the same checks on the Home, About Us, Top, Middle and Bottom Shelf, an object page,
the photo viewer, Privacy Policy and Terms and Conditions pages:

- the page loads with no script errors and no missing local files;
- the page does not scroll sideways;
- "Skip to main content" and "Go to navigation bar" are the first two keyboard stops.

Other checks: sidebar on wide screens and drawer on narrow ones, dark mode on and off, the audio player
opening (pause icon) and closing, Back to top staying above the footer, the object title spoken as
"Object number N", "Acquisition Number" in the information table, the photo viewer guide, no footer on
the photo viewer, and the Terms and Conditions page using the Privacy Policy layout.

WebKit on the CI runner is Playwright's WebKit build. It is close to Safari but it is not Safari.

## Outdated browser warning

- The warning is in `_layouts/default.html` (the first item inside the main content) and is hidden by default.
- A short script in `_includes/head.html` checks for the features the site needs: CSS custom properties,
  CSS grid, the `inset` property, `fetch`, `Promise`, `matchMedia`, `Element.closest` and modern JavaScript
  (script `noModule` support). If one is missing it adds the class `outdated-browser` to `<html>`, and the warning shows.
- The check tests features, not browser names or versions, so it keeps working as new browsers appear.
  If the site starts to use a new browser feature that older browsers lack, add that feature to the check.
- The automated tests confirm that the warning stays hidden in current browsers and appears when `fetch` is removed.
  Check it by eye once per release in the oldest browser you can find.

## Manual checks before a release

| Check | Browser and tool | Device |
| --- | --- | --- |
| Screen reader reading order and announcements | NVDA with Firefox and with Chrome | Windows |
| Screen reader reading order and announcements | VoiceOver with Safari | macOS and iPhone |
| Screen reader reading order and announcements | TalkBack with Chrome | Android phone |
| Keyboard only (Tab, Shift+Tab, Enter, Space, Escape), no mouse | Chrome and Safari | Desktop |
| Text size A+ (150%) and dark mode on every page type | Chrome | Desktop and phone |
| Real Safari rendering | Safari | macOS and iPhone |

## Third-party files (CDNs) and pinned hashes

- Every third-party stylesheet or script is loaded from a CDN at an exact version
  (for example `font-awesome/6.4.0`), never `latest`.
- Each one carries an `integrity` hash and `crossorigin="anonymous"`.
- The check `scripts/check-cdn-integrity.mjs` fails the build when a URL has no exact version or no hash,
  and in CI (`--verify`) it downloads each file and confirms that the hash is correct.
- Google Fonts (the Manrope font) are the exception. Google returns different CSS for
  each browser, so one hash cannot match. They are listed in the script as exempt.
- GitHub Actions are pinned to full commit hashes. `.github/dependabot.yml` proposes updates only for
  releases at least 14 days old.

## Running the tests on your own computer

```text
bundle exec jekyll build --destination ../site/group34
python3 -m http.server 4173 --directory ../site &
cd tests
npm install
npx playwright install chromium firefox webkit
npx playwright test
cd ..
node scripts/check-cdn-integrity.mjs ../site/group34 --verify
```

Run the commands from the project folder. The first command writes the built site one level above it,
so the build is not inside the project (the last command stops the server with `kill %1`). After the first `npm install`, commit `tests/package-lock.json`
so every run installs exactly the same packages.
