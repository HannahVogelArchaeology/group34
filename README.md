# Group 34 exhibition sandbox

This public repository is Group 34's working Jekyll site. Commits to `main` are
built and published automatically at
<https://hannahvogelarchaeology.github.io/group34/>.

## Work locally

The repository pins Ruby 4.0.6 in `.ruby-version`. With rbenv, install it once
with `rbenv install 4.0.6`; rbenv will select it automatically here. Then run:

```text
bundle install
bundle exec jekyll serve
```

Open <http://localhost:4000/group34/>. Before pushing, run:

```text
bundle exec jekyll build
```

The separate `Lighthouse` workflow audits pull requests and pushes against the
100/100/100/100 baseline shipped for accessibility, best practices, performance,
and SEO. A regression turns that workflow red and preserves its HTML report as
an artifact, but it does not interrupt the independent Pages deployment.

Edit Markdown pages at the repository root. Site-wide values are in
`_config.yml`; shared HTML is in `_includes` and `_layouts`; styling is under
`_sass` and `assets`.

Read `AGENTS.md` before using an AI coding assistant. Add preferred contributor
names to `CITATION.cff` rather than inferring them from accounts.

## Smaller files and unused-file check

When the site is built by GitHub Actions (`pages.yml` for the live site, `lighthouse.yml` for the audit), the text files
are made smaller before they are published:

- CSS is compressed by Jekyll (`sass: style: compressed` in `_config.yml`).
- JavaScript in `assets/js/` is minified with esbuild.
- `scripts/minify-site.mjs` removes comments and indentation from the built HTML and the whitespace from the built JSON.
  It leaves `<script>`, `<style>`, `<pre>` and `<textarea>` untouched. If it fails, the workflow shows a warning and
  publishes the original files.
- GitHub Pages then compresses text files for visitors (gzip). The Lighthouse workflow uses
  `scripts/serve-compressed.mjs`, a small local server that compresses the same way, so the audit measures what
  visitors receive.

To find files in `assets/` that no page uses, run `node scripts/find-unused-assets.mjs` and check the list before
deleting anything. When you delete a photo, also delete its smaller copies in `assets/images/responsive/`.

## Photos: smaller copies for each screen

The original photos in `assets/images/` are never changed. To keep the pages fast, a script writes smaller WebP copies
of them into `assets/images/responsive/` and a list of them into `_data/responsive_images.json`. The pages then give each
screen the copy that fits it, and the photo viewer loads the original file when a visitor zooms in.

Run this once after adding or replacing photos, then commit the new files:

```text
pip install Pillow
python scripts/make-responsive-images.py
```

Empty (0 KB) placeholder files and very small images are skipped and keep using the original file. Options such as
`--quality` and `--force` are described at the top of `scripts/make-responsive-images.py`.

## Photo viewer: one small data file per page

The photo viewer reads the gallery of the page the visitor came from (the list of photos with captions and alternative
text) from a small file in `photo-data/`, named after the page, for example `photo-data/middle-shelf-object3.json`. The
content comes from that page's front matter, so photo changes need no extra step. When you add a **new object or shelf
page**, copy any file in `photo-data/`, rename it, and change its `permalink` and the page address in the last line.

## Handover: adding the Auslan video later

The curator (Hannah Vogel) is producing a separate Auslan video and expected to send it by 27 November 2026, after the
project ended. Nobody has decided yet where it will go on the site. The accessibility page and `terms.md` already
mention Auslan videos, so that wording was kept on purpose. If the video never arrives, remove those mentions
(`accessibility.md`, `terms.md`).

At the moment the main page has one video only, the "Introduction Video" (`assets/video/introduction.mp4`), filled from
the front matter of `index.md`:

- `introduction_video`: the video file in `assets/video/`
- `introduction_captions_file`: the captions file (default `assets/video/introduction-captions.vtt`)
- `introduction_caption` and `introduction_transcript`: the text shown under the video

When the Auslan video arrives, decide where it goes first. To show it next to the introduction, copy the video section
in `_layouts/home.html` and give the copy its own front matter names, its own captions file and its own class names. The
class names in that block start with `introduction-`, and their styles are in `_sass/_home.scss` and
`_sass/_dark-mode.scss`, so copy those too. GitHub does not accept files over 100 MB in a normal repository, so compress
a large video first (keep the 1920x1080 size and the original audio) and read the free-quota limits of Git LFS before
using it.

## Licence and attribution

The code is derived from the MIT-licensed Minima theme. See `LICENSE` and
`NOTICE.md`. The licences of the fonts, icons and build tools the site uses are listed in
`THIRD_PARTY_NOTICES.md`, with the full texts in the `LICENSES/` folder. Content and media added by the team may have different terms; record
those terms and the required credit beside each asset.
