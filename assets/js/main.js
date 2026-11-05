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
  toggleSidebarMenu(false);
  closeDisplaySettings();
  syncSidebarAccessibility();
});
document.addEventListener("keydown", (event) => {
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

    toggleSidebarMenu(false);
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

  resetAudioSpeed();

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
  resetAudioSpeed();
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


/* Every time the player starts, it plays at the normal speed: a speed chosen earlier (0.5x or 1.5x) is not remembered. */
function resetAudioSpeed() {
  const audio = document.getElementById("exhibitionAudio");

  if (audio) {
    audio.defaultPlaybackRate = 1;
    audio.playbackRate = 1;
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

  /* Optional smaller WebP copies, written by scripts/make-responsive-images.py.
     Each entry can have srcset, thumb, width and height (the original file's size in pixels). */
  const imageInfo = galleryEntry ? galleryEntry.images : [];
  const VIEWER_IMAGE_SIZES = "(max-width: 779px) 100vw, 900px";
  let currentIndex = galleryEntry
    ? Math.min(Math.max(0, requestedIndex), images.length - 1)
    : Math.max(0, images.indexOf(currentImage));

  const mainImage = document.getElementById("photoMainImage");
  const counter = document.getElementById("photoCounter");
  const objectName = document.getElementById("photoObjectName");
  const viewLabel = document.getElementById("photoViewLabel");
  const viewCount = document.getElementById("photoViewCount");
  const imageCaption = document.getElementById("photoImageCaption");
  const thumbnails = document.getElementById("photoThumbnails");
  const closeButton = document.getElementById("photoClose");
  const previousButton = document.getElementById("photoPrev");
  const nextButton = document.getElementById("photoNext");
  const zoomFrame = document.getElementById("photoZoomFrame");
  const expandButton = document.getElementById("photoExpand");
  const expandExitButton = document.getElementById("photoExpandExit");

  /* Zooming in loads the original file: the screen-sized WebP copy would look soft at the magnified size. */
  function loadFullResolution() {
    const info = imageInfo[currentIndex] || {};

    if (!info.srcset || !mainImage) {
      return;
    }

    const indexAtRequest = currentIndex;
    const original = new Image();

    original.onload = () => {
      // Ignore the result when another photo was chosen while the original was loading.
      if (indexAtRequest !== currentIndex) {
        return;
      }

      // Without srcset the image uses its src, which is the original file.
      mainImage.removeAttribute("srcset");
      mainImage.removeAttribute("sizes");
    };
    original.src = images[currentIndex];
  }

  /* Magnify: select the photo (click, tap, Enter or Space) to zoom in; move the pointer to pan; select again to zoom out */
  const ZOOM_SCALE = 2.5;
  let isZoomed = false;
  let isExpanded = false;

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

    // While zoomed in, the top bar, the caption and the thumbnail strip are hidden so the photo can use the whole screen.
    viewer.classList.toggle("is-zoom-view", enabled);
    limitFrameHeight();

    if (enabled) {
      loadFullResolution();
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
    zoomFrame.addEventListener("click", (event) => {
      if (!isExpanded) { setZoom(!isZoomed, event); }
    });
    zoomFrame.addEventListener("pointermove", panZoom);
    zoomFrame.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isExpanded) { setZoom(!isZoomed); }
      }
    });
  }

  /* Fit the frame to the photo: pass the file's own proportions and width to the CSS.
     The CSS keeps the frame inside its column and below its maximum height. */
  function fitFrameToPhoto() {
    if (!zoomFrame || !mainImage) {
      return;
    }

    // Use the original file's size when it is known, so the frame is the same whichever copy is showing.
    const info = imageInfo[currentIndex] || {};
    const loaded = mainImage.naturalWidth > 0;
    const width = loaded && info.width > 0 ? info.width : mainImage.naturalWidth;
    const height = loaded && info.height > 0 ? info.height : mainImage.naturalHeight;

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
      zoomFrame.style.setProperty("--photo-max-h", `${Math.max(48, Math.min(1400, freeHeight - otherHeight))}px`);
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

  /* Labels typed in capitals ("HERO SHOT") are shown in sentence case ("Hero shot"). Mixed-case labels are left as they are. */
  const displayLabel = (index) => {
    const label = getLabel(index);
    return label === label.toUpperCase() ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() : label;
  };
  const getCaption = (index) => captions[index] || `${objectTitle} — ${getLabel(index)} image`;

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
      // Show a screen-sized WebP copy when one exists; the original is loaded when the visitor zooms in.
      const info = imageInfo[currentIndex] || {};
      if (info.srcset) {
        mainImage.sizes = VIEWER_IMAGE_SIZES;
        mainImage.srcset = info.srcset;
      } else {
        mainImage.removeAttribute("srcset");
        mainImage.removeAttribute("sizes");
      }
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
      viewLabel.textContent = displayLabel(currentIndex);
    }

    if (viewCount) {
      viewCount.textContent = `View ${currentIndex + 1} of ${images.length}`;
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
        const isActive = indexInGallery === currentIndex;
        thumbnail.classList.toggle("is-active", isActive);

        // The photo on view is marked for screen readers, and it is the strip's only Tab stop.
        // The other photos are reached with Previous, Next or the left and right arrow keys.
        if (isActive) {
          thumbnail.setAttribute("aria-current", "true");
        } else {
          thumbnail.removeAttribute("aria-current");
        }
        thumbnail.tabIndex = isActive ? 0 : -1;
      });

      centreActiveThumbnail();
    }
  }

  /* Thumbnail strip: keep the photo on view in the middle of the strip, and show a fade on the side that has more. */
  const thumbnailPanel = thumbnails ? thumbnails.closest(".photo-thumbnail-panel") : null;

  function updateThumbnailFades() {
    if (!thumbnails || !thumbnailPanel) {
      return;
    }

    const maxScroll = thumbnails.scrollWidth - thumbnails.clientWidth;
    thumbnailPanel.classList.toggle("has-more-left", thumbnails.scrollLeft > 2);
    thumbnailPanel.classList.toggle("has-more-right", maxScroll - thumbnails.scrollLeft > 2);
  }

  function centreActiveThumbnail() {
    if (!thumbnails) {
      return;
    }

    const active = thumbnails.querySelector(".photo-thumbnail.is-active");

    if (active && thumbnails.scrollWidth > thumbnails.clientWidth) {
      const left = active.offsetLeft - (thumbnails.clientWidth - active.offsetWidth) / 2;
      thumbnails.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    }

    updateThumbnailFades();
  }

  if (thumbnails) {
    // The strip has no scrollbar: the mouse wheel moves it sideways while it overflows.
    thumbnails.addEventListener("wheel", (event) => {
      if (thumbnails.scrollWidth > thumbnails.clientWidth && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        thumbnails.scrollLeft += event.deltaY;
      }
    }, { passive: false });
    thumbnails.addEventListener("scroll", updateThumbnailFades);
    window.addEventListener("resize", centreActiveThumbnail);
  }

  if (thumbnails) {
    thumbnails.innerHTML = "";

    images.forEach((src, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "photo-thumbnail";
      button.setAttribute("aria-label", `View ${getLabel(index)}`);

      const image = document.createElement("img");
      // Thumbnails use the smallest WebP copy when one exists.
      image.src = (imageInfo[index] && imageInfo[index].thumb) || src;
      image.alt = getCaption(index);

      const label = document.createElement("span");
      label.className = "photo-thumb-label";
      label.textContent = displayLabel(index);

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
  /* Expand: the photo fills the whole screen and everything else is ignored. The browser's full screen mode is used when it is
     available (the browser then also shows its own Esc hint). Esc or the X button leaves it. Where full screen mode is not
     available (for example some phones), the photo still fills the page. */
  function setExpanded(on) {
    if (!viewer || on === isExpanded) {
      return;
    }

    isExpanded = on;

    if (on) {
      setZoom(false);
    }

    viewer.classList.toggle("is-expanded", on);

    if (expandExitButton) {
      expandExitButton.hidden = !on;
    }

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    if (on) {
      const request = viewer.requestFullscreen || viewer.webkitRequestFullscreen;

      if (request) {
        try {
          const result = request.call(viewer);
          if (result && result.catch) { result.catch(() => {}); }
        } catch (error) { /* Full screen was refused: the page-filling view still works. */ }
      }

      if (expandExitButton) { expandExitButton.focus(); }
    } else {
      if (fullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) {
          try {
            const result = exit.call(document);
            if (result && result.catch) { result.catch(() => {}); }
          } catch (error) { /* Already out of full screen. */ }
        }
      }

      if (expandButton) { expandButton.focus(); }
    }

    limitFrameHeight();
  }

  if (expandButton) {
    expandButton.addEventListener("click", () => setExpanded(true));
  }

  if (expandExitButton) {
    expandExitButton.addEventListener("click", () => setExpanded(false));
  }

  // The browser's own Esc leaves full screen mode: leave the expanded view with it.
  const onFullscreenChange = () => {
    if (isExpanded && !(document.fullscreenElement || document.webkitFullscreenElement)) {
      setExpanded(false);
    }
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);

  const guideBackground = document.querySelectorAll(".photo-viewer-header, .photo-viewer-stage, .photo-thumbnail-panel");

  function isGuideOpen() {
    return Boolean(guide) && !guide.hidden;
  }

  /* The guide notes line up with the real parts of the page behind them: the height of the top bar, of the Previous / Next bar
     and of the thumbnail row are measured and handed to the style sheet. */
  function measureGuide() {
    if (!guide || guide.hidden) {
      return;
    }

    const header = document.querySelector(".photo-viewer-header");
    const stage = document.querySelector(".photo-viewer-stage");
    const panel = document.querySelector(".photo-thumbnail-panel");
    const barHeight = stage ? parseFloat(window.getComputedStyle(stage, "::after").height) : NaN;

    if (header) { guide.style.setProperty("--gd-head", `${header.getBoundingClientRect().height}px`); }
    if (panel) { guide.style.setProperty("--gd-panel", `${panel.getBoundingClientRect().height}px`); }
    if (!Number.isNaN(barHeight)) { guide.style.setProperty("--gd-bar", `${barHeight}px`); }

    /* Positions of the real parts (px from the top of the window), used by the phone layout of the guide. */
    const frame = document.getElementById("photoZoomFrame");
    const viewName = document.querySelector(".photo-viewer-figure figcaption");

    if (frame) { guide.style.setProperty("--gd-frame-bottom", `${frame.getBoundingClientRect().bottom}px`); }

    if (viewName) {
      const viewRect = viewName.getBoundingClientRect();
      guide.style.setProperty("--gd-meta-top", `${viewRect.top}px`);
      guide.style.setProperty("--gd-btn-top", `${viewRect.bottom}px`);
    }

    if (panel) { guide.style.setProperty("--gd-panel-top", `${panel.getBoundingClientRect().top}px`); }

    /* Phone: the notes sit over their own parts when they fit. If the notes at the top reach down into the view note, that note
       moves onto the view name; if they still do not fit, the notes follow each other instead (the guide scrolls). */
    guide.classList.remove("is-meta-over", "is-flow");

    if (window.matchMedia("(max-width: 779px)").matches) {
      const zoomNote = guide.querySelector(".guide-zoom");
      const viewNote = guide.querySelector(".guide-meta");

      const reachesViewNote = () => viewNote.getBoundingClientRect().top < zoomNote.getBoundingClientRect().bottom + 2;

      if (zoomNote && viewNote && reachesViewNote()) {
        guide.classList.add("is-meta-over");

        if (reachesViewNote()) {
          guide.classList.remove("is-meta-over");
          guide.classList.add("is-flow");
        }
      }
    }
  }

  window.addEventListener("resize", measureGuide);

  function setGuideOpen(open) {
    if (!guide) {
      return;
    }

    guide.hidden = !open;
    measureGuide();

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
      if (isExpanded) {
        setExpanded(false);
      } else if (isZoomed) {
        setZoom(false);
      } else {
        window.location.href = returnUrl;
      }
    }
  });

  renderPhoto(currentIndex);
  /* The guide opens by itself the first time the photo page is visited. After that it opens only when the Guide button is selected. */
  let guideSeen = false;

  try {
    guideSeen = localStorage.getItem("photoGuideSeen") === "yes";
  } catch (error) { /* Storage may be unavailable: then the guide opens each time, which is the safe choice. */ }

  if (!guideSeen) {
    setGuideOpen(true);

    try {
      localStorage.setItem("photoGuideSeen", "yes");
    } catch (error) { /* Storage may be unavailable. */ }
  }
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

/* "Explore the exhibition" (main page): scroll down slowly instead of jumping.
   The browser's own smooth scrolling takes about half a second, which is too fast to follow, so the page is moved by a script
   over about 1.6 seconds, easing in and out. People who ask their system for less motion get the plain jump. Keyboard focus moves to the
   section's heading at the end. Any wheel, touch or key press by the visitor stops the movement at once. */
(function () {
  const SLOW_SCROLL_MS = 1600;

  document.addEventListener("click", function (event) {
    const link = event.target.closest(".btn-explore-exhibition");
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
