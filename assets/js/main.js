/* Font size */
let currentFontSize =
  parseInt(localStorage.getItem("userFontSize"), 10) || 100;

/* Return to the top of the page (used by the header button and the floating button) */
function scrollToTop() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  // Move keyboard focus to the start of the page, so the next Tab reaches "Skip to main content".
  const pageTop = document.getElementById("pageTop");
  if (pageTop) {
    pageTop.focus({ preventScroll: true });
  }
}

/* Keep the page content below the pinned header, whatever its height */
function syncHeaderHeight() {
  const header = document.querySelector(".pinned-header");

  if (header) {
    document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
  }
}

/* Keep the Back to top button above the audio bar while it is open */
function syncAudioBarOffset() {
  const bar = document.getElementById("bottomAudioBar");
  const isOpen = bar && bar.style.display !== "none" && bar.style.display !== "";

  document.documentElement.style.setProperty("--audio-bar-h", isOpen ? `${bar.offsetHeight}px` : "0px");
}

/* Show the current text size and mark the A - / A + button that has reached its limit (70% / 150%). */
function updateFontControls(size) {
  const value = document.getElementById("textSizeValue");
  if (value) value.textContent = `${size}%`;

  document.querySelectorAll(".font-btn").forEach((button) => {
    const label = button.getAttribute("aria-label") || "";
    const atLimit = (label.indexOf("Decrease") === 0 && size <= 70) || (label.indexOf("Increase") === 0 && size >= 150);
    if (atLimit) {
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("aria-disabled");
    }
  });
}

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}%`;
  updateFontControls(size);
  syncHeaderHeight();
  syncAudioBarOffset();
  updateSidebarScrollHint();
}

function changeFontSize(direction) {
  if (direction === 0) {currentFontSize = 100;
  } else {
    currentFontSize += direction * 10;
    currentFontSize = Math.min(150, Math.max(70, currentFontSize));
  }

  localStorage.setItem("userFontSize", currentFontSize);
  applyFontSize(currentFontSize);
}


/* Sidebar menu: always visible on desktop; collapsible drawer on mobile only (max-width: 779px) */
const mobileMenuQuery = window.matchMedia("(max-width: 779px)");

/* The down arrow shows while the open menu is taller than the screen and is still at the top (any screen size).
   Once the list has been scrolled down, the up arrow shows instead. Both are clickable for mouse and touch users. */
function updateSidebarScrollHint() {
  const menu = document.getElementById("sidebarMenu");
  const down = menu ? menu.querySelector(".sidebar-scroll-down") : null;
  const up = menu ? menu.querySelector(".sidebar-scroll-up") : null;

  if (!menu || !down) {
    return;
  }

  const canScroll = menu.scrollHeight > menu.clientHeight + 4;
  const atTop = menu.scrollTop <= 8;
  const isOpen = !mobileMenuQuery.matches || menu.classList.contains("active"); /* Always open on desktop */

  down.classList.toggle("is-visible", isOpen && canScroll && atTop);

  if (up) {
    up.classList.toggle("is-visible", isOpen && canScroll && !atTop);
  }
}

/* The arrows move the list to its end or back to its start (smoothly, unless the person prefers less motion). */
function scrollSidebarMenu(direction) {
  const menu = document.getElementById("sidebarMenu");

  if (!menu) {
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = direction === "top" ? 0 : menu.scrollHeight - menu.clientHeight;

  menu.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/* Keep the sidebar exposed to assistive technology and the keyboard only while it is visible:
   always on desktop, and only when the drawer is open on mobile. */
function syncSidebarAccessibility() {
  const menu = document.getElementById("sidebarMenu");

  if (!menu) {
    return;
  }

  const visible = !mobileMenuQuery.matches || menu.classList.contains("active");

  menu.setAttribute("aria-hidden", String(!visible));
  menu.inert = !visible;
}

function setPageBehindDrawerInert(menu, inert) {
  let node = menu;

  while (node && node !== document.body) {
    const parent = node.parentElement;

    if (parent) {
      Array.from(parent.children).forEach((sibling) => {
        if (sibling === node || sibling.id === "sidebarOverlay" || sibling.tagName === "SCRIPT") {
          return;
        }

        sibling.inert = inert;
      });
    }

    node = parent;
  }
}

function toggleSidebarMenu(forceState) {
  const menu = document.getElementById("sidebarMenu");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menu || !mobileMenuQuery.matches) {
    return;
  }

  const open = typeof forceState === "boolean" ? forceState : !menu.classList.contains("active");
  const focusWasInside = menu.contains(document.activeElement);

  menu.classList.toggle("active", open);

  if (open) {
    closeDisplaySettings();
  }

  if (overlay) {
    overlay.classList.toggle("active", open);
  }

  document.querySelectorAll(".mobile-menu-btn").forEach((button) => {
    button.setAttribute("aria-expanded", String(open));
  });

  if (open) {
    menu.scrollTop = 0;
  }

  syncSidebarAccessibility();
  updateSidebarScrollHint();
  setPageBehindDrawerInert(menu, open);

  if (open) {
    const closeButton = menu.querySelector(".close-sidebar");
    if (closeButton) { closeButton.focus(); }
  }

  /* Closing the drawer (Close button, Escape or the dark area) must not drop the keyboard focus: it returns to the Menu button. */
  if (!open && focusWasInside) {
    const menuButton = document.querySelector(".mobile-menu-btn");
    if (menuButton) { menuButton.focus(); }
  }
}

/* "Aa" display settings panel (phones only): holds the text size buttons and the dark mode button.
   The panel follows the "Aa" button in the page order, so keyboard users Tab straight into it. */
function closeDisplaySettings() {
  const panel = document.getElementById("displaySettings");
  const button = document.querySelector(".settings-btn");

  if (panel) {
    panel.classList.remove("open");
  }

  if (button) {
    button.setAttribute("aria-expanded", "false");
  }
}

function toggleDisplaySettings(forceState) {
  const panel = document.getElementById("displaySettings");
  const button = document.querySelector(".settings-btn");

  if (!panel || !button || !mobileMenuQuery.matches) {
    return;
  }

  const open = typeof forceState === "boolean" ? forceState : !panel.classList.contains("open");

  panel.classList.toggle("open", open);
  button.setAttribute("aria-expanded", String(open));
}

/* Reset the drawer when the screen grows to desktop size, and close it with the Escape key */
mobileMenuQuery.addEventListener("change", () => {
  const drawer = document.getElementById("sidebarMenu");

  if (drawer) {
    setPageBehindDrawerInert(drawer, false);
  }

  toggleSidebarMenu(false);
  closeDisplaySettings();
  syncSidebarAccessibility();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    const drawer = document.getElementById("sidebarMenu");

    if (drawer && drawer.classList.contains("active")) {
      const focusable = Array.from(drawer.querySelectorAll("a[href], button:not([tabindex='-1'])")).filter(
        (element) => element.getClientRects().length > 0
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    return;
  }

  if (event.key === "Escape") {
    const panel = document.getElementById("displaySettings");
    const settingsButton = document.querySelector(".settings-btn");

    // Escape closes the settings panel first and returns focus to the "Aa" button.
    if (panel && panel.classList.contains("open")) {
      closeDisplaySettings();

      if (settingsButton) {
        settingsButton.focus();
      }

      return;
    }

    const drawer = document.getElementById("sidebarMenu");

    if (drawer && drawer.classList.contains("active")) {
      toggleSidebarMenu(false);
      return;
    }

    const audioBar = document.getElementById("bottomAudioBar");

    if (audioBar && audioBar.style.display !== "none" && audioBar.style.display !== "") {
      closeAudioPlayer();
    }
  }
});

/* A click or tap outside the settings panel closes it. */
document.addEventListener("click", (event) => {
  const panel = document.getElementById("displaySettings");

  if (panel && panel.classList.contains("open") && !event.target.closest("#displaySettings, .settings-btn")) {
    closeDisplaySettings();
  }
});

/* The header button offers the mode that a click switches to: "Light Mode" (sun) while dark mode is on, "Dark Mode" (moon) otherwise.
   The visible label is the button's name, so the spoken name, the voice command and the screen all agree. The label tells the state, so
   the button has no aria-pressed (a pressed state plus a label that changes would read as a contradiction). The class "is-dark" is only for the switch drawn on it. */
function updateDarkModeButton(enabled) {
  const button = document.querySelector(".dark-mode-btn");
  if (!button) return;
  button.classList.toggle("is-dark", enabled);

  const label = button.querySelector(".dark-mode-label");
  const icon = button.querySelector("i");

  if (label) {
    label.textContent = enabled ? "Light Mode" : "Dark Mode";
  }

  if (icon) {
    icon.className = enabled ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

function toggleDarkMode() {
  const enabled = document.body.classList.toggle("dark-mode");
  try { localStorage.setItem("darkMode", enabled ? "enabled" : "disabled"); } catch (error) { /* Storage may be unavailable. */ }
  updateDarkModeButton(enabled);
}


// Show an object title such as "3. Bronze dancer (replica)" unchanged on screen, while assistive
// technology reads "Object number 3, Bronze dancer (replica)" so the number is not heard as a quantity.
function renderObjectTitle(element, title, extra) {
  const visible = extra ? `${title}, ${extra}` : title;
  const match = /^\s*(\d+)\.\s*(.*)$/.exec(title);
  const spoken = match
    ? `Object number ${match[1]}, ${match[2]}${extra ? `, ${extra}` : ""}`
    : visible;

  element.textContent = "";

  const visibleSpan = document.createElement("span");
  visibleSpan.setAttribute("aria-hidden", "true");
  visibleSpan.textContent = visible;

  const spokenSpan = document.createElement("span");
  spokenSpan.className = "sr-only";
  spokenSpan.textContent = spoken;

  element.append(visibleSpan, spokenSpan);
}





document.addEventListener("DOMContentLoaded", () => {
  try {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      updateDarkModeButton(true);
    }
  } catch (error) { /* Storage may be unavailable. */ }

  const topButton = document.createElement("button");
  topButton.type = "button";
  topButton.className = "back-to-top";
  const topIcon = document.createElement("i");
  topIcon.className = "fa-solid fa-arrow-up";
  topIcon.setAttribute("aria-hidden", "true");
  topButton.appendChild(topIcon);
  topButton.setAttribute("aria-label", "Return to the top of this page");
  topButton.addEventListener("click", scrollToTop);
  document.body.appendChild(topButton);

  // Keep the button above the footer: when the footer scrolls into view,
  // lift the button by the height of the visible part of the footer.
  const siteFooter = document.querySelector(".site-footer");

  function updateTopButtonOffset() {
    let overlap = 0;
    if (siteFooter) {
      const footerTop = siteFooter.getBoundingClientRect().top;
      overlap = Math.max(0, window.innerHeight - footerTop);
    }
    document.documentElement.style.setProperty("--footer-overlap", overlap + "px");
  }

  // On phones the round button only appears while the visitor scrolls up (they are heading back to the top).
  // While scrolling down it stays hidden, so it never covers text such as the Back and Next buttons at the end of a page.
  let lastScrollY = window.scrollY;
  let topButtonTimer = null;

  function hideTopButtonLater(delay) {
    clearTimeout(topButtonTimer);
    topButtonTimer = setTimeout(() => topButton.classList.remove("is-visible"), delay);
  }

  function updateTopButtonVisibility() {
    const y = window.scrollY;

    if (y <= 300) {
      clearTimeout(topButtonTimer);
      topButton.classList.remove("is-visible");
    } else if (y < lastScrollY - 4) {
      topButton.classList.add("is-visible");
      hideTopButtonLater(3500);
    } else if (y > lastScrollY + 4) {
      clearTimeout(topButtonTimer);
      topButton.classList.remove("is-visible");
    }

    if (Math.abs(y - lastScrollY) > 4) {
      lastScrollY = y;
    }
  }

  // Keyboard users: pressing Tab shows the button (below the first screen), and it stays while it has focus.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && window.scrollY > 300) {
      topButton.classList.add("is-visible");
      hideTopButtonLater(8000);
    }
  });
  topButton.addEventListener("focus", () => clearTimeout(topButtonTimer));
  topButton.addEventListener("blur", () => hideTopButtonLater(1500));

  window.addEventListener("scroll", updateTopButtonOffset, { passive: true });
  window.addEventListener("scroll", updateTopButtonVisibility, { passive: true });
  window.addEventListener("resize", updateTopButtonOffset);
  updateTopButtonOffset();

  applyFontSize(currentFontSize);
  window.addEventListener("resize", () => {
    syncHeaderHeight();
    syncAudioBarOffset();
  });
  window.addEventListener("load", syncHeaderHeight);

  const sidebarMenu = document.getElementById("sidebarMenu");

  if (sidebarMenu) {
    sidebarMenu.addEventListener("scroll", updateSidebarScrollHint, { passive: true });
    sidebarMenu.querySelectorAll(".sidebar-scroll-btn").forEach((button) => {
      button.addEventListener("click", () => scrollSidebarMenu(button.dataset.scroll));
    });
    window.addEventListener("resize", updateSidebarScrollHint);
    window.addEventListener("load", updateSidebarScrollHint);
    updateSidebarScrollHint();
  }
  if (typeof initialisePhotoViewer === "function") {
    initialisePhotoViewer();
  }

  // Initial accessibility state of the sidebar.
  syncSidebarAccessibility();

  // "Skip to main content": move focus straight into the main content (the navigation is not entered).
  const skipToMain = document.querySelector('.skip-link[href="#main-content"]');
  const mainContent = document.getElementById("main-content");

  if (skipToMain && mainContent) {
    skipToMain.addEventListener("click", (event) => {
      event.preventDefault();
      mainContent.focus();
    });
  }

  // "Go to navigation bar" skip link: open the drawer first on mobile, then move focus into the navigation.
  const skipToNavigation = document.getElementById("skipToNavigation");
  const sidebarNav = document.getElementById("sidebarNav");

  if (skipToNavigation && sidebarNav) {
    skipToNavigation.addEventListener("click", (event) => {
      event.preventDefault();

      if (mobileMenuQuery.matches) {
        toggleSidebarMenu(true);
      }

      sidebarNav.focus();
    });
  }
});

// Introduction video download option disable
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".introduction-video");

  videos.forEach(function (video) {
    video.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  });
});

/* Keep the alt-text disclosure independent from the whole-card navigation link. */
document.addEventListener("click", (event) => {
  const disclosure = event.target.closest("[data-alt-disclosure]");
  if (disclosure) {
    event.stopPropagation();
  }
});

/* "Explore the exhibition" (main page): scroll down slowly instead of jumping.
   The browser's own smooth scrolling takes about half a second, which is too fast to follow, so the page is moved by a script
   over about 1.6 seconds, easing in and out. People who ask their system for less motion get the plain jump. Keyboard focus moves to the
   section's heading at the end. Any wheel, touch or key press by the visitor stops the movement at once. */
(function () {
  const SLOW_SCROLL_MS = 1600;

  document.addEventListener("click", function (event) {
    const link = event.target.closest(".btn-explore-exhibition, .scroll-cue");
    if (!link) { return; }

    const target = document.getElementById("explore-the-exhibition");
    if (!target) { return; }

    event.preventDefault();

    const heading = target.querySelector("h2") || target;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const maxTop = document.documentElement.scrollHeight - window.innerHeight;
    const destination = Math.max(0, Math.min(maxTop, target.getBoundingClientRect().top + window.scrollY - margin));

    const finish = function () {
      if (!heading.hasAttribute("tabindex")) { heading.setAttribute("tabindex", "-1"); }
      heading.focus({ preventScroll: true });
      try { history.replaceState(null, "", "#explore-the-exhibition"); } catch (error) { /* Not critical. */ }
    };

    if (reduce) {
      window.scrollTo(0, destination);
      finish();
      return;
    }

    const start = window.scrollY;
    const distance = destination - start;
    const began = performance.now();
    let stopped = false;

    const stop = function () { stopped = true; };
    const stopEvents = ["wheel", "touchstart", "keydown", "mousedown"];
    stopEvents.forEach(function (name) { window.addEventListener(name, stop, { passive: true, once: true }); });

    const ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    const step = function (now) {
      if (stopped) { return; }
      const t = Math.min(1, (now - began) / SLOW_SCROLL_MS);
      window.scrollTo(0, start + distance * ease(t));

      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        stopEvents.forEach(function (name) { window.removeEventListener(name, stop); });
        finish();
      }
    };

    window.requestAnimationFrame(step);
  });
})();

/* Photo gallery: pressing a thumbnail shows that photo in the large frame on the same page.
   The photo viewer opens only from the large photo or its expand button, so their links follow the photo shown. */
document.addEventListener("click", function (event) {
  const thumb = event.target.closest("[data-gallery-thumb]");
  if (!thumb) { return; }
  const gallery = thumb.closest("[data-gallery]");
  if (!gallery) { return; }
  const data = thumb.dataset;
  const image = gallery.querySelector("[data-gallery-img]");
  if (image) {
    if (data.srcset) { image.setAttribute("srcset", data.srcset); } else { image.removeAttribute("srcset"); }
    image.setAttribute("src", data.src);
    image.setAttribute("alt", data.alt || "");
    if (image.hasAttribute("width") && data.width && data.height) {
      image.setAttribute("width", data.width);
      image.setAttribute("height", data.height);
    }
  }
  if (image && data.fit && image.hasAttribute("data-fit")) { image.setAttribute("data-fit", data.fit); }
  const caption = gallery.querySelector("[data-gallery-caption]");
  if (caption) { caption.textContent = data.caption || ""; }
  gallery.querySelectorAll("[data-gallery-link]").forEach(function (link) {
    link.setAttribute("href", link.getAttribute("href").replace(/index=\d+/, "index=" + data.index));
    link.setAttribute("aria-label", "Open the " + (data.label || "").toLowerCase() + " photo in the photo viewer");
  });
  gallery.querySelectorAll("[data-gallery-thumb]").forEach(function (other) {
    const isCurrent = other === thumb;
    other.classList.toggle("active", isCurrent);
    other.setAttribute("aria-pressed", isCurrent ? "true" : "false");
  });
  const status = gallery.querySelector("[data-gallery-status]");
  if (status) { status.textContent = "Showing the " + (data.label || "").toLowerCase() + " photo."; }
});

/* Keyboard Guide: the script is downloaded only when the visitor turns the guide on, or when it was left on in an earlier visit. */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("keyboardGuideToggle");

  if (!toggle || !toggle.dataset.script) {
    return;
  }

  let state = "idle";
  let clickedWhileLoading = false;

  function loadKeyboardGuide() {
    if (state !== "idle") {
      return;
    }

    state = "loading";
    const script = document.createElement("script");
    script.src = toggle.dataset.script;

    script.addEventListener("load", () => {
      state = "ready";
      toggle.removeEventListener("click", onFirstClick);

      if (clickedWhileLoading) {
        toggle.click();
      }
    });

    script.addEventListener("error", () => {
      state = "idle";
      clickedWhileLoading = false;
      script.remove();
    });

    document.body.appendChild(script);
  }

  function onFirstClick() {
    clickedWhileLoading = true;
    loadKeyboardGuide();
  }

  toggle.addEventListener("click", onFirstClick);

  let wasOn = false;
  try { wasOn = localStorage.getItem("keyboardGuide") === "on"; } catch (error) { /* Storage may be unavailable. */ }

  if (wasOn) {
    toggle.setAttribute("aria-pressed", "true");
    const stateLabel = toggle.querySelector(".kg-toggle-state");
    if (stateLabel) { stateLabel.textContent = "On"; }
    loadKeyboardGuide();
  }
});
