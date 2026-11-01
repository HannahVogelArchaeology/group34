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
`NOTICE.md`. The licences of the fonts, icons and build tools the site uses are listed in
`THIRD_PARTY_NOTICES.md`, with the full texts in the `LICENSES/` folder. Content and media added by the team may have different terms; record
those terms and the required credit beside each asset.
