# Third-party licences

This file lists the code, fonts and icons that this website uses besides the team's own code,
with the licence of each one. Full licence texts are in this repository:

| Licence                                        | Text                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| MIT                                            | [`LICENSE`](LICENSE)                                 |
| Apache License 2.0                             | [`LICENSES/Apache-2.0.txt`](LICENSES/Apache-2.0.txt) |
| SIL Open Font License 1.1                      | [`LICENSES/OFL-1.1.txt`](LICENSES/OFL-1.1.txt)       |
| Creative Commons Attribution 4.0 International | [`LICENSES/CC-BY-4.0.txt`](LICENSES/CC-BY-4.0.txt)   |

## Loaded by visitors' browsers from CDNs

These are not copied into the repository. They are requested from the CDN named below when a page opens.

| Component                              | Version                          | Licence                                         | Copyright and source                                                                                                                             |
| -------------------------------------- | -------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Font Awesome Free (CSS and icon fonts) | 6.4.0                            | Icons: CC BY 4.0. Fonts: SIL OFL 1.1. Code: MIT | Copyright 2023 Fonticons, Inc. <https://fontawesome.com/license/free> (served by cdnjs)                                                          |
| Manrope (font)                         | Google Fonts, weights 400 to 800 | SIL OFL 1.1                                     | Copyright The Manrope Project Authors. <https://fonts.google.com/specimen/Manrope> (exact copyright line: see the font's `OFL.txt` on that page) |

Font Awesome icons are licensed CC BY 4.0, which requires attribution. The attribution is the notice above and the licence header that Font Awesome's own CSS file carries.

## Used to build the site (not part of the published pages)

| Component                                                                    | Version in `Gemfile.lock` | Licence                      |
| ---------------------------------------------------------------------------- | ------------------------- | ---------------------------- |
| Jekyll                                                                       | 4.3.4                     | MIT                          |
| Minima (templates and styles vendored into this repository, see `NOTICE.md`) | 2.5.2                     | MIT                          |
| kramdown                                                                     | 2.5.2                     | MIT                          |
| sass-embedded (Dart Sass)                                                    | 1.102.0                   | MIT                          |
| csv                                                                          | 3.3.6                     | Ruby licence or BSD-2-Clause |
| base64                                                                       | 0.3.0                     | Ruby licence or BSD-2-Clause |
| bigdecimal                                                                   | 4.1.2                     | Ruby licence or BSD-2-Clause |
| rexml                                                                        | 3.4.4                     | BSD-2-Clause                 |
| webrick                                                                      | 1.9.2                     | BSD-2-Clause                 |
| tzinfo-data                                                                  | 1.2026.3                  | MIT                          |
| Playwright Test (`@playwright/test`, used only by the checks in `tests/`)    | 1.63.0 (`tests/package.json`) | Apache License 2.0       |
| Pillow (Python library, used only by `scripts/make-responsive-images.py`)    | not in `Gemfile.lock`     | HPND (MIT-style)             |

Each gem ships its own licence file. Run `bundle exec gem contents <gem name>` to read it.

Pillow is installed with `pip install Pillow`. It is run on a team member's computer to make the smaller photo copies and is not part of the repository or the published pages. Its licence (HPND) is a permissive licence that allows commercial use. The photo copies it writes carry no Pillow licence terms.

## The team's own code

The code written or changed by the team (`assets/js/main.js`, the styles in `_sass/`, the changes to the layouts and includes, `scripts/make-responsive-images.py`, `_includes/responsive-lookup.html` and `_includes/responsive-attrs.html`) is released under the MIT licence in `LICENSE`. The project's IT consultant confirmed that MIT and Apache 2.0 are both acceptable for this project. To release the team's own code under Apache 2.0 instead, replace `LICENSE` with `LICENSES/Apache-2.0.txt` for those files, keep the MIT notice for the Minima-derived files, and change `license:` in `CITATION.cff`.

## Content and media

Images, audio, video, 3D assets and text on the site are supplied by the client. They are not covered by the code licences above. The rights and the required credit for each item are recorded beside that item. The smaller copies of images in `assets/images/responsive/` (WebP files made by `scripts/make-responsive-images.py`) are the same works as the originals, so the same rights and the same required credit apply to them.
