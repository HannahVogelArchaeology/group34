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
names to `team.md` and `CITATION.cff` rather than inferring them from accounts.

## Licence and attribution

The code is derived from the MIT-licensed Minima theme. See `LICENSE` and
`NOTICE.md`. Content and media added by the team may have different terms; record
those terms and the required credit beside each asset.

```bash
v2_fixed
├─ .ruby-lsp
│  ├─ freshness_hash
│  ├─ Gemfile
│  ├─ Gemfile.lock
│  └─ last_updated
├─ .ruby-version
├─ 404.html
├─ about.md
├─ AGENTS.md
├─ assets
│  ├─ audio
│  │  ├─ object02-audio-description.mp3
│  │  ├─ object03-audio-description.mp3
│  │  ├─ object04-audio-description.mp3
│  │  ├─ object05-audio-description.mp3
│  │  ├─ object06-audio-description.mp3
│  │  ├─ object07-audio-description.mp3
│  │  ├─ object08-audio-description.mp3
│  │  ├─ object09-audio-description.mp3
│  │  ├─ object10-audio-description.mp3
│  │  ├─ object11-audio-description.mp3
│  │  └─ top-shelf-description.mp3
│  ├─ favicon.svg
│  ├─ images
│  │  ├─ bottom-shelf-main.jpg
│  │  ├─ hero-bg.jpg
│  │  ├─ middle-shelf-main.jpg
│  │  ├─ obj10.jpg
│  │  ├─ obj11.jpg
│  │  ├─ obj2.jpg
│  │  ├─ obj3.jpg
│  │  ├─ obj4.jpg
│  │  ├─ obj5.jpg
│  │  ├─ obj6.jpg
│  │  ├─ obj7.jpg
│  │  ├─ obj8.jpg
│  │  ├─ obj9.jpg
│  │  ├─ Placeholder1_HomePageFullDisplay.jpeg
│  │  ├─ top-shelf-main.jpg
│  │  ├─ top-shelf-thumb1.jpg
│  │  ├─ top-shelf-thumb2.jpg
│  │  ├─ top-shelf-thumb3.jpg
│  │  └─ top-shelf-thumb4.jpg
│  ├─ js
│  │  └─ main.js
│  ├─ main.scss
│  ├─ minima-social-icons.svg
│  └─ video
│     └─ auslan.mp4
├─ CITATION.cff
├─ CLAUDE.md
├─ Gemfile
├─ Gemfile.lock
├─ index.md
├─ LICENSE
├─ NOTICE.md
├─ objects
│  ├─ bottom-shelf-object10.md
│  ├─ bottom-shelf-object11.md
│  ├─ bottom-shelf-object9.md
│  ├─ middle-shelf-object2.md
│  ├─ middle-shelf-object3.md
│  ├─ middle-shelf-object4.md
│  ├─ middle-shelf-object5.md
│  ├─ middle-shelf-object6.md
│  ├─ middle-shelf-object7.md
│  └─ middle-shelf-object8.md
├─ photo.md
├─ privacy.md
├─ README.md
├─ shelves
│  ├─ bottom-shelf.md
│  ├─ middle-shelf.md
│  └─ top-shelf.md
├─ team.md
├─ terms.md
├─ _config.yml
├─ _includes
│  ├─ audio-player.html
│  ├─ footer.html
│  ├─ head.html
│  ├─ header.html
│  ├─ icon-github.html
│  ├─ icon-github.svg
│  ├─ icon-twitter.html
│  ├─ icon-twitter.svg
│  ├─ menu.html
│  ├─ navigation.html
│  ├─ pagination.html
│  └─ social.html
├─ _layouts
│  ├─ bottom-shelf.html
│  ├─ default.html
│  ├─ home.html
│  ├─ middle-shelf.html
│  ├─ object.html
│  ├─ page.html
│  ├─ photo.html
│  └─ top-shelf.html
└─ _sass
   ├─ minima
   │  ├─ _base.scss
   │  ├─ _layout.scss
   │  └─ _syntax-highlighting.scss
   ├─ minima.scss
   ├─ _about.scss
   ├─ _base.scss
   ├─ _bottom-shelf.scss
   ├─ _footer.scss
   ├─ _header.scss
   ├─ _home.scss
   ├─ _middle-shelf.scss
   ├─ _object.scss
   ├─ _photo.scss
   ├─ _privacy.scss
   ├─ _responsive.scss
   ├─ _top-shelf.scss
   └─ _variables.scss

```
