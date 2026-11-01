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

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}%`;
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


/* Sidebar menu: always visible on desktop; collapsible drawer on mobile only (max-width: 700px) */
const mobileMenuQuery = window.matchMedia("(max-width: 700px)");

/* Show the scroll hint only while the open menu is taller than the screen and is still at the top (any screen size) */
function updateSidebarScrollHint() {
  const menu = document.getElementById("sidebarMenu");
  const hint = menu ? menu.querySelector(".sidebar-scroll-hint") : null;

  if (!menu || !hint) {
    return;
  }

  const canScroll = menu.scrollHeight > menu.clientHeight + 4;
  const atTop = menu.scrollTop <= 8;
  const isOpen = !mobileMenuQuery.matches || menu.classList.contains("active"); /* Always open on desktop */

  hint.classList.toggle("is-visible", isOpen && canScroll && atTop);
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

function toggleSidebarMenu(forceState) {
  const menu = document.getElementById("sidebarMenu");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menu || !mobileMenuQuery.matches) {
    return;
  }

  const open = typeof forceState === "boolean" ? forceState : !menu.classList.contains("active");

  menu.classList.toggle("active", open);

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
}

/* Reset the drawer when the screen grows to desktop size, and close it with the Escape key */
mobileMenuQuery.addEventListener("change", () => {
  toggleSidebarMenu(false);
  syncSidebarAccessibility();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleSidebarMenu(false);
  }
});

function toggleDarkMode() {
  const enabled = document.body.classList.toggle("dark-mode");
  try { localStorage.setItem("darkMode", enabled ? "enabled" : "disabled"); } catch (error) { /* Storage may be unavailable. */ }
  const button = document.querySelector(".dark-mode-btn");
  if (button) button.setAttribute("aria-pressed", String(enabled));
}


/* Audio player */
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("exhibitionAudio");
    const progressBar = document.getElementById("audioProgress");
    const currentTimeEl = document.getElementById("currentTime");
    const durationTimeEl = document.getElementById("durationTime");

    if (!audio) {
      return;
    }

    audio.addEventListener("loadedmetadata", () => {
        if (durationTimeEl) {
          durationTimeEl.textContent = formatTime(audio.duration);
        }
      }
    );

    audio.addEventListener("timeupdate", () => {
        if (!isNaN(audio.duration)) {
          if (progressBar) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
          }

          if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
          }
        }
      }
    );


    // When playback finishes, return the button to the play icon.
    audio.addEventListener("ended", () => {
        setAudioPlayingState(false);
      }
    );
  }
);


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


function formatTime(seconds) {
  if (isNaN(seconds)) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}


function seekAudio(value) {
  const audio = document.getElementById("exhibitionAudio");
  if (audio && !isNaN(audio.duration)) {
    audio.currentTime = (value / 100) * audio.duration;
  }
}


// UI play state. The icon follows this flag (not the audio events), so the
// button always flips on a press, even while the audio file is still a
// placeholder that the browser cannot actually play.
let audioIsPlaying = false;


// Switch the play button between the play and pause Font Awesome icons.
function setAudioPlayingState(isPlaying) {
  audioIsPlaying = isPlaying;
  const playIcon = document.getElementById("playIcon");

  if (playIcon) {
    playIcon.className = isPlaying ? "fas fa-pause" : "fas fa-play";
  }
}


// The button that opened the audio player, so focus can return to it when the player closes.
let audioPlayerTrigger = null;


// Show the audio player. It is placed right after the button that opened it, so the
// keyboard and screen reader order is: Audio Description button, player controls, then
// the rest of the page (the audio transcript first).
function openAudioPlayer() {
  const bar = document.getElementById("bottomAudioBar");

  if (!bar) {
    return;
  }

  const active = document.activeElement;
  const trigger = active && active !== document.body && !bar.contains(active)
    ? active
    : document.querySelector("main .audio-play-btn");

  audioPlayerTrigger = trigger || null;

  const anchor = trigger ? trigger.closest(".audio-actions, .audio-controls") || trigger : null;
  if (anchor) {
    anchor.insertAdjacentElement("afterend", bar);
  }

  bar.style.display = "flex";
  syncAudioBarOffset();

  // Start playback (the pause icon shows after the first press).
  if (!audioIsPlaying) {
    toggleAudioPlay();
  }

  // Move focus to the player itself (not to the seek bar, whose changing time would be read out
  // every second). Screen readers announce the player and its instructions; Tab then reaches the controls.
  bar.focus();
}


// Close the audio player: stop the audio, hide the player and return focus to the button that opened it.
function closeAudioPlayer() {
  const bar = document.getElementById("bottomAudioBar");
  const audio = document.getElementById("exhibitionAudio");

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  setAudioPlayingState(false);

  const volumePopup = document.getElementById("volumePopup");
  if (volumePopup) {
    volumePopup.style.display = "none";
  }
  document.body.classList.remove("volume-popup-open");

  if (bar) {
    bar.style.display = "none";
  }
  syncAudioBarOffset();

  if (audioPlayerTrigger && document.contains(audioPlayerTrigger)) {
    audioPlayerTrigger.focus();
  }
}


// The Audio Description button on the page opens the player, or closes it when it is already open.
function toggleAudioPlayer() {
  const bar = document.getElementById("bottomAudioBar");

  if (!bar) {
    return;
  }

  const isHidden = bar.style.display === "none" || bar.style.display === "";

  if (isHidden) {
    openAudioPlayer();
  } else {
    closeAudioPlayer();
  }
}


function toggleAudioPlay() {
  const audio = document.getElementById("exhibitionAudio");

  if (!audio) {
    return;
  }

  if (!audioIsPlaying) {
    setAudioPlayingState(true);
    const result = audio.play();
    if (result && typeof result.catch === "function") {
      // A rejected play() (for example a placeholder file) keeps the icon state.
      result.catch(() => {});
    }
  } else {
    audio.pause();
    setAudioPlayingState(false);
  }
}


function changeAudioSpeed(speed) {
  const audio = document.getElementById("exhibitionAudio");
  if (audio) {
    audio.playbackRate = speed;
  }
}


function toggleVolumePopup() {
  const popup = document.getElementById("volumePopup");
  if (popup) {
    const willOpen = !(popup.style.display === "flex" || popup.style.display === "block");
    popup.style.display = willOpen ? "block" : "none";
    // While the volume slider is open, the Back to top button moves up so it never covers the slider.
    document.body.classList.toggle("volume-popup-open", willOpen);
  }
}


function setVolume(value) {
  const audio = document.getElementById("exhibitionAudio");
  const volumeIcon = document.getElementById("volumeIcon");

  if (!audio) {
    return;
  }

  audio.volume = value;
  audio.muted = value == 0;

  if (volumeIcon) {
    if (value == 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (value < 0.5) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  }
}

/* Photo viewer page */

function initialisePhotoViewer() {
  const viewer = document.getElementById("photo-viewer");
  if (!viewer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  /* Short links (?key=...&index=...) read the gallery from the JSON block in photo.html,
     which keeps the address short enough for any web server. Old long links still work. */
  let galleryEntry = null;
  const galleryKey = params.get("key");
  const galleryDataElement = document.getElementById("photoGalleryData");

  if (galleryKey && galleryDataElement) {
    try {
      galleryEntry = JSON.parse(galleryDataElement.textContent).find((item) => item.key === galleryKey) || null;
    } catch (error) {
      galleryEntry = null;
    }
  }

  const requestedIndex = parseInt(params.get("index"), 10) || 0;
  const objectTitle = galleryEntry ? galleryEntry.object || "Object" : params.get("object") || "Object";
  const museumNumber = galleryEntry ? galleryEntry.museumNumber || "" : params.get("museum") || "";
  const returnUrl = galleryEntry ? galleryEntry.return || "/" : params.get("return") || "/";
  const currentImage = galleryEntry
    ? ((galleryEntry.images[requestedIndex] || galleryEntry.images[0] || {}).src || "")
    : params.get("image") || "";

  const galleryImages = galleryEntry
    ? galleryEntry.images.map((item) => item.src)
    : (params.get("gallery") || currentImage)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  /* Read gallery metadata by index so each caption remains paired with its image. */
  const indexedValues = (prefix) => {
    const values = [];

    for (let index = 0; ; index += 1) {
      const value = params.get(`${prefix}${index}`);

      if (value === null) {
        break;
      }

      values.push(value);
    }

    return values;
  };

  const labels = indexedValues("label");
  const captions = indexedValues("caption");

  /* Keep compatibility with older photo links that used pipe-separated metadata. */
  if (!labels.length) {
    labels.push(
      ...(params.get("labels") || "")
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean)
    );
  }

  if (!captions.length) {
    captions.push(
      ...(params.get("captions") || "")
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean)
    );
  }

  if (galleryEntry) {
    labels.length = 0;
    captions.length = 0;
    galleryEntry.images.forEach((item) => {
      labels.push(item.label || "");
      captions.push(item.caption || "");
    });
  }

  const images = galleryImages.length ? galleryImages : [currentImage];
  let currentIndex = galleryEntry
    ? Math.min(Math.max(0, requestedIndex), images.length - 1)
    : Math.max(0, images.indexOf(currentImage));

  const mainImage = document.getElementById("photoMainImage");
  const counter = document.getElementById("photoCounter");
  const objectName = document.getElementById("photoObjectName");
  const viewLabel = document.getElementById("photoViewLabel");
  const imageCaption = document.getElementById("photoImageCaption");
  const thumbnails = document.getElementById("photoThumbnails");
  const backLink = document.getElementById("photoBackLink");
  const closeButton = document.getElementById("photoClose");
  const previousButton = document.getElementById("photoPrev");
  const nextButton = document.getElementById("photoNext");
  const zoomFrame = document.getElementById("photoZoomFrame");

  /* Magnify: select the photo (click, tap, Enter or Space) to zoom in; move the pointer to pan; select again to zoom out */
  const ZOOM_SCALE = 2.5;
  let isZoomed = false;

  function panZoom(event) {
    if (!isZoomed || !zoomFrame || !mainImage) {
      return;
    }

    const rect = zoomFrame.getBoundingClientRect();
    const x = event && typeof event.clientX === "number" ? ((event.clientX - rect.left) / rect.width) * 100 : 50;
    const y = event && typeof event.clientY === "number" ? ((event.clientY - rect.top) / rect.height) * 100 : 50;

    mainImage.style.transformOrigin = `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`;
  }

  function setZoom(enabled, event) {
    if (!zoomFrame || !mainImage) {
      return;
    }

    isZoomed = enabled;
    zoomFrame.classList.toggle("is-zoomed", enabled);
    zoomFrame.setAttribute("aria-pressed", String(enabled));

    if (enabled) {
      panZoom(event);
      mainImage.style.transform = `scale(${ZOOM_SCALE})`;
    } else {
      mainImage.style.transform = "";
      mainImage.style.transformOrigin = "50% 50%";
    }
  }

  /* The magnifier icon follows the mouse pointer inside the frame (not for touch). */
  function movePointerIcon(event) {
    if (!zoomFrame || event.pointerType === "touch") {
      return;
    }

    const rect = zoomFrame.getBoundingClientRect();
    zoomFrame.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    zoomFrame.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    zoomFrame.classList.add("has-pointer-icon");
  }

  if (zoomFrame) {
    zoomFrame.addEventListener("pointerenter", movePointerIcon);
    zoomFrame.addEventListener("pointermove", movePointerIcon);
    zoomFrame.addEventListener("pointerleave", () => zoomFrame.classList.remove("has-pointer-icon"));
    zoomFrame.addEventListener("click", (event) => setZoom(!isZoomed, event));
    zoomFrame.addEventListener("pointermove", panZoom);
    zoomFrame.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setZoom(!isZoomed);
      }
    });
  }

  /* Fit the frame to the photo: pass the file's own proportions and width to the CSS.
     The CSS keeps the frame inside its column and below its maximum height. */
  function fitFrameToPhoto() {
    if (!zoomFrame || !mainImage) {
      return;
    }

    const width = mainImage.naturalWidth;
    const height = mainImage.naturalHeight;

    if (width > 0 && height > 0) {
      zoomFrame.style.setProperty("--photo-ratio", String(width / height));
      zoomFrame.style.setProperty("--photo-natural-w", `${width}px`);
    } else {
      // The file did not load (or has no size): fall back to the default frame from the CSS.
      zoomFrame.style.removeProperty("--photo-ratio");
      zoomFrame.style.removeProperty("--photo-natural-w");
    }
  }

  /* Limit the frame height to the space left in the stage after the caption, the title line and the gaps.
     This keeps the frame clear of the top bar and the thumbnail panel, on desktop and on mobile. */
  const photoStage = viewer.querySelector(".photo-viewer-stage");
  const photoFigure = document.getElementById("photoFigure");

  function limitFrameHeight() {
    if (!zoomFrame || !photoStage || !photoFigure) {
      return;
    }

    const stageStyle = window.getComputedStyle(photoStage);
    const freeHeight =
      photoStage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
    const otherHeight = photoFigure.offsetHeight - zoomFrame.offsetHeight;

    if (freeHeight > 0) {
      zoomFrame.style.setProperty("--photo-max-h", `${Math.max(48, Math.min(600, freeHeight - otherHeight))}px`);
    }
  }

  if (mainImage) {
    mainImage.addEventListener("load", () => {
      fitFrameToPhoto();
      limitFrameHeight();
    });
    mainImage.addEventListener("error", () => {
      fitFrameToPhoto();
      limitFrameHeight();
    });
  }

  if (photoStage && "ResizeObserver" in window) {
    new ResizeObserver(limitFrameHeight).observe(photoStage);
  } else {
    window.addEventListener("resize", limitFrameHeight);
  }

  const defaultLabel = (index) => {
    if (index === 0) {
      return "FRONT";
    }
    return `VIEW ${index + 1}`;
  };

  const getLabel = (index) => labels[index] || defaultLabel(index);
  const getCaption = (index) => captions[index] || `${objectTitle} — ${getLabel(index)} image`;

  if (backLink) {
    backLink.href = returnUrl;
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      window.location.href = returnUrl;
    });
  }

  function renderPhoto(index) {
    currentIndex = (index + images.length) % images.length;
    setZoom(false);

    const label = getLabel(currentIndex);
    const caption = getCaption(currentIndex);

    if (mainImage) {
      mainImage.src = images[currentIndex];
      mainImage.alt = caption;
    }

    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    if (objectName) {
      renderObjectTitle(objectName, objectTitle, museumNumber);
    }

    if (viewLabel) {
      viewLabel.textContent = `[${label}]`;
    }

    if (imageCaption) {
      imageCaption.textContent = caption;
    }

    // Spoken, labelled copy of the alternative text (the image itself is hidden from screen readers).
    const altText = document.getElementById("photoAltText");
    if (altText) {
      altText.textContent = caption;
    }

    // The caption may wrap to a different number of lines, so measure the free height again.
    limitFrameHeight();

    if (thumbnails) {
      thumbnails.querySelectorAll(".photo-thumbnail").forEach((thumbnail, indexInGallery) => {
        thumbnail.classList.toggle("is-active", indexInGallery === currentIndex);
      });
    }
  }

  if (thumbnails) {
    thumbnails.innerHTML = "";

    images.forEach((src, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "photo-thumbnail";
      button.setAttribute("aria-label", `View ${getLabel(index)}`);

      const image = document.createElement("img");
      image.src = src;
      image.alt = getCaption(index);

      const label = document.createElement("span");
      label.className = "photo-thumb-label";
      label.textContent = getLabel(index);

      button.appendChild(label);
      button.appendChild(image);
      button.addEventListener("click", (event) => {
        renderPhoto(index);

        // Chosen with the keyboard: move to the photo information, so it is read in order
        // (caption, alternative text, object title), then Previous and Next follow.
        const photoFigure = document.getElementById("photoFigure");
        if (event.detail === 0 && photoFigure) {
          photoFigure.focus();
        }
      });

      thumbnails.appendChild(button);
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => renderPhoto(currentIndex - 1));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => renderPhoto(currentIndex + 1));
  }

  /* Guide (modal): opens together with the photo page and again with the Guide button */
  const guide = document.getElementById("photoGuide");
  const guideButton = document.getElementById("photoGuideButton");
  const guideCloseButton = document.getElementById("photoGuideClose");
  const guideBackground = document.querySelectorAll(".photo-viewer-header, .photo-viewer-stage, .photo-thumbnail-panel");

  function isGuideOpen() {
    return Boolean(guide) && !guide.hidden;
  }

  function setGuideOpen(open) {
    if (!guide) {
      return;
    }

    guide.hidden = !open;

    /* The page behind the guide cannot be reached with the keyboard or a screen reader while it is open */
    guideBackground.forEach((element) => {
      element.inert = open;
    });

    if (guideButton) {
      guideButton.setAttribute("aria-expanded", String(open));
    }

    if (open && guideCloseButton) {
      guideCloseButton.focus();
    } else if (!open && guideButton) {
      guideButton.focus();
    }
  }

  if (guide) {
    if (guideButton) {
      guideButton.addEventListener("click", () => setGuideOpen(true));
    }

    if (guideCloseButton) {
      guideCloseButton.addEventListener("click", () => setGuideOpen(false));
    }

    /* The close button is the only control inside the guide, so Tab keeps the focus on it */
    guide.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();

        if (guideCloseButton) {
          guideCloseButton.focus();
        }
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (isGuideOpen()) {
      if (event.key === "Escape") {
        setGuideOpen(false);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      renderPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      renderPhoto(currentIndex + 1);
    } else if (event.key === "Escape") {
      if (isZoomed) {
        setZoom(false);
      } else {
        window.location.href = returnUrl;
      }
    }
  });

  renderPhoto(currentIndex);
  setGuideOpen(true); /* Show the guide every time the photo page opens */
}


document.addEventListener("DOMContentLoaded", () => {
  try {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      const darkButton = document.querySelector(".dark-mode-btn");
      if (darkButton) darkButton.setAttribute("aria-pressed", "true");
    }
  } catch (error) { /* Storage may be unavailable. */ }

  const topButton = document.createElement("button");
  topButton.type = "button";
  topButton.className = "back-to-top";
  topButton.textContent = "Back to top";
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

  window.addEventListener("scroll", updateTopButtonOffset, { passive: true });
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
    window.addEventListener("resize", updateSidebarScrollHint);
    window.addEventListener("load", updateSidebarScrollHint);
    updateSidebarScrollHint();
  }
  initialisePhotoViewer();

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

// Auslan video download option disable
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".auslan-video");

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
