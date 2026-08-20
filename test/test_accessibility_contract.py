from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class TemplateParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tags: list[tuple[str, dict[str, str | None]]] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        self.tags.append((tag, dict(attrs)))


def parse_template(path: Path) -> TemplateParser:
    parser = TemplateParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


class AccessibilityContractTest(unittest.TestCase):
    def test_base_layout_has_skip_link_and_named_main_landmark(self) -> None:
        parser = parse_template(ROOT / "_layouts" / "default.html")

        skip_links = [
            attrs
            for tag, attrs in parser.tags
            if tag == "a"
            and "skip-link" in (attrs.get("class") or "").split()
            and attrs.get("href") == "#content"
        ]
        main_landmarks = [
            attrs
            for tag, attrs in parser.tags
            if tag == "main"
            and attrs.get("id") == "content"
            and attrs.get("aria-label")
        ]

        self.assertEqual(len(skip_links), 1, "expected one skip link to #content")
        self.assertEqual(
            len(main_landmarks), 1, "expected one identified and named main landmark"
        )

    def test_header_has_named_navigation_and_native_disclosure(self) -> None:
        parser = parse_template(ROOT / "_includes" / "header.html")

        named_navigation = [
            attrs
            for tag, attrs in parser.tags
            if tag == "nav" and attrs.get("aria-label") == "Primary"
        ]
        disclosure = [attrs for tag, attrs in parser.tags if tag == "summary"]

        self.assertEqual(
            len(named_navigation), 1, "expected one Primary navigation landmark"
        )
        self.assertEqual(
            len(disclosure), 1, "expected a keyboard-native details/summary menu"
        )

    def test_styles_provide_skip_link_and_visible_keyboard_focus(self) -> None:
        stylesheet = (ROOT / "_sass" / "minima" / "_base.scss").read_text(
            encoding="utf-8"
        )

        self.assertIn(".skip-link", stylesheet)
        self.assertIn(":focus-visible", stylesheet)


if __name__ == "__main__":
    unittest.main()
