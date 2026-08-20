from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github" / "workflows" / "lighthouse.yml"


class LighthouseWorkflowTest(unittest.TestCase):
    def test_lighthouse_is_an_independent_ci_workflow(self):
        self.assertTrue(WORKFLOW.is_file(), "missing Lighthouse workflow")
        source = WORKFLOW.read_text(encoding="utf-8")
        self.assertIn("name: Lighthouse", source)
        self.assertIn("pull_request:", source)
        self.assertIn("push:", source)
        self.assertIn("http://127.0.0.1:4173/group34/", source)

    def test_actions_are_immutable_and_all_four_scores_are_gated(self):
        self.assertTrue(WORKFLOW.is_file(), "missing Lighthouse workflow")
        source = WORKFLOW.read_text(encoding="utf-8")
        self.assertIn(
            "foo-software/lighthouse-check-action@a80267da2e0244b8a2e457a8575fc47590615852",
            source,
        )
        self.assertIn(
            "foo-software/lighthouse-check-status-action@2b9d5101f7a0de86ddb153a0d77ad7046aac1052",
            source,
        )
        for score in (
            "minAccessibilityScore",
            "minBestPracticesScore",
            "minPerformanceScore",
            "minSeoScore",
        ):
            self.assertIn(score, source)


if __name__ == "__main__":
    unittest.main()
