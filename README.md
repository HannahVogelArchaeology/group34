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
group34
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
│  │  └─ shelf1-description.mp3
│  ├─ favicon.svg
│  ├─ images
│  │  ├─ hero-bg.jpg
│  │  ├─ obj2.jpg
│  │  ├─ obj3.jpg
│  │  ├─ obj4.jpg
│  │  ├─ obj5.jpg
│  │  ├─ obj6.jpg
│  │  ├─ obj7.jpg
│  │  ├─ obj8.jpg
│  │  ├─ obj9.jpg
│  │  ├─ shelf1-main.jpg
│  │  ├─ shelf1-thumb1.jpg
│  │  ├─ shelf1-thumb2.jpg
│  │  ├─ shelf1-thumb3.jpg
│  │  ├─ shelf1-thumb4.jpg
│  │  ├─ shelf2-main.jpg
│  │  └─ shelf3-main.jpg
│  ├─ js
│  │  └─ main.js
│  ├─ main.scss
│  └─ minima-social-icons.svg
├─ CITATION.cff
├─ CLAUDE.md
├─ Gemfile
├─ Gemfile.lock
├─ index.md
├─ LICENSE
├─ NOTICE.md
├─ objects
│  ├─ shelf2-object2.md
│  ├─ shelf2-object3.md
│  ├─ shelf2-object4.md
│  ├─ shelf2-object5.md
│  ├─ shelf2-object6.md
│  ├─ shelf3-object7.md
│  ├─ shelf3-object8.md
│  └─ shelf3-object9.md
├─ privacy.md
├─ README.md
├─ shelves
│  ├─ first-shelf.md
│  ├─ second-shelf.md
│  └─ third-shelf.md
├─ team.md
├─ terms.md
├─ _config.yml
├─ _includes
│  ├─ audio-player.html
│  ├─ cookie-banner.html
│  ├─ disqus_comments.html
│  ├─ footer.html
│  ├─ google-analytics.html
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
│  ├─ default.html
│  ├─ home.html
│  ├─ object.html
│  ├─ page.html
│  ├─ post.html
│  ├─ shelf1.html
│  ├─ shelf2.html
│  └─ shelf3.html
└─ _sass
   ├─ minima
   │  ├─ _base.scss
   │  ├─ _layout.scss
   │  └─ _syntax-highlighting.scss
   ├─ minima.scss
   ├─ _about.scss
   ├─ _base.scss
   ├─ _footer.scss
   ├─ _header.scss
   ├─ _home.scss
   ├─ _object.scss
   ├─ _privacy.scss
   ├─ _responsive.scss
   ├─ _shelf1.scss
   ├─ _shelf2.scss
   ├─ _shelf3.scss
   └─ _variables.scss
```
