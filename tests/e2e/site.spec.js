// End-to-end checks that run on every row of the browser and device matrix (see playwright.config.js).
const { test, expect } = require("@playwright/test");

const PAGES = [
  { name: "Home", path: "./" },
  { name: "About Us", path: "about/" },
  { name: "Top Shelf", path: "shelves/top-shelf/" },
  { name: "Middle Shelf", path: "shelves/middle-shelf/" },
  { name: "Bottom Shelf", path: "shelves/bottom-shelf/" },
  { name: "Object page", path: "objects/middle-shelf-object3/" },
  { name: "Photo viewer", path: "photo/?key=%2Fgroup34%2Fobjects%2Fmiddle-shelf-object3%2F&index=0" },
  { name: "Privacy Policy", path: "privacy/" },
  { name: "Terms and Conditions", path: "terms/" }
];

const isDesktopWidth = (page) => (page.viewportSize() || { width: 0 }).width > 700;

// Closes the Quick Guidance dialog on the photo viewer and moves the keyboard starting point back to the top of the page.
const closeGuideAndRestartFocus = async (page) => {
  await page.locator("#photoGuideClose").click();
  await expect(page.locator("#photoGuide")).toBeHidden();
  await page.evaluate(() => {
    document.activeElement.blur();
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
    document.body.removeAttribute("tabindex");
  });
};

for (const target of PAGES) {
  test.describe(target.name, () => {
    test("loads without script errors or broken local files", async ({ page, baseURL }) => {
      const problems = [];
      const origin = new URL(baseURL).origin;

      page.on("pageerror", (error) => problems.push(`script error: ${error.message}`));
      page.on("response", (response) => {
        if (response.url().startsWith(origin) && response.status() >= 400) {
          problems.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto(target.path);
      await page.waitForLoadState("load");
      expect(problems).toEqual([]);
    });

    test("does not scroll sideways", async ({ page }) => {
      await page.goto(target.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });

    test("skip links are the first two keyboard stops", async ({ page }) => {
      await page.goto(target.path);
      if (target.name === "Photo viewer") {
        // The Quick Guidance dialog opens with this page and keeps the focus on its close button (see the
        // "Quick Guidance dialog" tests below), so close it and start from the top of the page.
        await closeGuideAndRestartFocus(page);
      }
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveText("Skip to main content");
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveText("Go to navigation bar");
    });
  });
}

test.describe("Site structure", () => {
  test("pages other than the photo viewer have a footer; the photo viewer has none", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator(".site-footer")).toHaveCount(1);

    await page.goto(PAGES.find((item) => item.name === "Photo viewer").path);
    await expect(page.locator(".site-footer")).toHaveCount(0);
  });

  test("navigation: sidebar on wide screens, drawer on narrow screens", async ({ page }) => {
    await page.goto("./");
    const sidebar = page.locator("#sidebarMenu");

    if (isDesktopWidth(page)) {
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toHaveAttribute("aria-hidden", "false");
    } else {
      await expect(sidebar).toHaveAttribute("aria-hidden", "true");
      await page.locator(".mobile-menu-btn").first().click();
      await expect(sidebar).toHaveAttribute("aria-hidden", "false");
      await expect(sidebar).toBeVisible();
    }
  });

  test("dark mode can be switched on and off", async ({ page }) => {
    await page.goto("about/");
    const button = page.locator(".dark-mode-btn").first();

    await button.click();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);
    await button.click();
    await expect(page.locator("body")).not.toHaveClass(/dark-mode/);
  });

  test("Terms and Conditions uses the same layout as the Privacy Policy", async ({ page }) => {
    await page.goto("terms/");
    await expect(page.locator(".privacy-hero")).toBeVisible();
    await expect(page.locator(".toc-card")).toBeVisible();
    await expect(page.locator(".policy-section").first()).toBeVisible();
  });
});

test.describe("Object page", () => {
  test("title is spoken as 'Object number N' and the table says Acquisition Number", async ({ page }) => {
    await page.goto("objects/middle-shelf-object3/");
    await expect(page.locator("h1.object-heading .sr-only")).toContainText("Object number 3");
    await expect(page.locator(".object-meta-table .sr-only").first()).toHaveText("Acquisition Number");
  });

  test("keyboard order follows title, overview, audio, information, photo, pagination", async ({ page }) => {
    await page.goto("objects/middle-shelf-object3/");
    const order = await page.evaluate(() => {
      const selectors = [
        ".object-heading",
        ".overview-section",
        ".audio-section",
        ".metadata-section",
        ".media-column",
        ".shelf-pagination"
      ];
      const elements = selectors.map((selector) => document.querySelector(selector));
      return elements.map((element, index) => {
        const next = elements[index + 1];
        return !next || Boolean(element.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
    });
    expect(order.every(Boolean)).toBe(true);
  });

  test("audio player opens, shows the pause icon, and closes", async ({ page }) => {
    await page.goto("objects/middle-shelf-object3/");
    const bar = page.locator("#bottomAudioBar");

    await page.locator(".audio-section .audio-play-btn").click();
    await expect(bar).toBeVisible();
    await expect(page.locator("#playIcon")).toHaveClass(/fa-pause/);

    await page.getByRole("button", { name: "Close audio player" }).click();
    await expect(bar).toBeHidden();
    await expect(page.locator("#playIcon")).toHaveClass(/fa-play/);
  });

  test("Back to top stays above the footer (wide screens)", async ({ page }) => {
    test.skip(!isDesktopWidth(page), "The floating button is hidden on narrow screens.");

    await page.goto("objects/middle-shelf-object3/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    const button = await page.locator(".back-to-top").boundingBox();
    const footer = await page.locator(".site-footer").boundingBox();
    expect(button.y + button.height).toBeLessThanOrEqual(footer.y + 1);
  });
});

test.describe("Photo viewer", () => {
  test("shows the Quick Guidance first, then the photo with labelled text", async ({ page }) => {
    await page.goto(PAGES.find((item) => item.name === "Photo viewer").path);
    const guide = page.locator("#photoGuide");

    await expect(guide).toBeVisible();
    await expect(page.locator("#photoGuideTitle")).toHaveText("Quick Guidance in the Photo Page");

    await page.locator("#photoGuideClose").click();
    await expect(guide).toBeHidden();
    await expect(page.locator("#photoFigure .sr-only").first()).toContainText("This is the caption");
  });

  test("Quick Guidance dialog: opens with the page, keeps the focus inside, closes with Escape", async ({ page }) => {
    await page.goto(PAGES.find((item) => item.name === "Photo viewer").path);
    const guide = page.locator("#photoGuide");
    const closeButton = page.locator("#photoGuideClose");

    await expect(guide).toBeVisible();
    await expect(guide).toHaveAttribute("role", "dialog");
    await expect(guide).toHaveAttribute("aria-modal", "true");
    await expect(page.locator("#photoGuideTitle")).toHaveText("Quick Guidance in the Photo Page");
    await expect(page.locator(".photo-guide-items li").first()).toBeVisible();

    // The focus starts on the close button and Tab and Shift+Tab cannot leave it
    await expect(closeButton).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(closeButton).toBeFocused();

    // The page behind the dialog cannot be reached while it is open
    const behindIsInert = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".photo-viewer-header, .photo-viewer-stage, .photo-thumbnail-panel")).every(
        (element) => element.inert
      )
    );
    expect(behindIsInert).toBe(true);

    // Escape closes the dialog and gives the focus back to the Guide button
    await page.keyboard.press("Escape");
    await expect(guide).toBeHidden();
    await expect(page.locator("#photoGuideButton")).toBeFocused();
    await expect(page.locator("#photoGuideButton")).toHaveAttribute("aria-expanded", "false");
  });

  test("Quick Guidance dialog: the Guide button opens it again", async ({ page }) => {
    await page.goto(PAGES.find((item) => item.name === "Photo viewer").path);
    const guide = page.locator("#photoGuide");

    await page.locator("#photoGuideClose").click();
    await expect(guide).toBeHidden();

    await page.locator("#photoGuideButton").click();
    await expect(guide).toBeVisible();
    await expect(page.locator("#photoGuideButton")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#photoGuideClose")).toBeFocused();
    await expect(page.locator("#photoGuideTitle")).toHaveText("Quick Guidance in the Photo Page");

    await page.locator("#photoGuideClose").click();
    await expect(guide).toBeHidden();
    await expect(page.locator("#photoGuideButton")).toBeFocused();
  });
});

test.describe("Outdated browser warning", () => {
  test("is hidden in a current browser", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator(".browser-warning")).toBeHidden();
  });

  test("is shown when a required browser feature is missing", async ({ page }) => {
    // Simulate an old browser: no fetch(). The check in _includes/head.html looks for missing features.
    await page.addInitScript(() => {
      delete window.fetch;
    });
    await page.goto("./");
    await expect(page.locator(".browser-warning")).toBeVisible();
    await expect(page.locator(".browser-warning a")).toHaveAttribute("href", "https://browsehappy.com/");
  });
});
