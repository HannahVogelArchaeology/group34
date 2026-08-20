# Working with AI in this repository

Last verified: 2026-08-20

AI may help with code, prose, planning, and troubleshooting, but it does not own
the project decision. Before asking an AI to change files, write down:

1. the visitor and outcome the change is for;
2. the evidence or project material the change may rely on;
3. the smallest change that could achieve the outcome; and
4. how the group will check that it worked.

Inspect the relevant files before editing. Ask the group when intent or ownership
is unclear. Do not invent archaeological claims, citations, permissions, image
descriptions, contributor identities, or test results.

Keep licensed code, prose, images, audio, video, and 3D assets distinct. Do not
upload third-party material until its owner, permitted use, and required credit
are documented.

Preserve accessibility. Use semantic HTML, a logical heading order, descriptive
links, keyboard-operable controls, captions or transcripts where required, and
meaningful alternative text written from the image's purpose in context. Never
use colour alone to communicate meaning.

After changing the site, run:

```text
bundle exec jekyll build
python3 -m unittest discover -s test -v
```

Read the output. Do not describe a build or test as passing unless that exact
version of the files produced a successful result.

Lighthouse is a separate, non-blocking GitHub workflow. A red score does not
stop deployment, but the group should inspect its saved report before deciding
whether the change is acceptable.
