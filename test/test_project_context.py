from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ProjectContextTest(unittest.TestCase):
    def test_claude_context_is_dated_and_operational(self) -> None:
        source = (ROOT / "CLAUDE.md").read_text(encoding="utf-8")

        self.assertIn("Last verified: 2026-08-20", source)
        self.assertIn("Ruby 4.0.6", source)
        self.assertIn("Jekyll 4.4.1", source)
        self.assertIn("bundle exec jekyll build", source)
        self.assertIn("`/group34`", source)
        self.assertIn("AGENTS.md", source)


if __name__ == "__main__":
    unittest.main()
