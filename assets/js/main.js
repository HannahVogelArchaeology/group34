/* Font size */
let currentFontSize =
  parseInt(localStorage.getItem("userFontSize"), 10) || 100;

/* Return to the top of the page (used by the header button and the floating button) */
function scrollToTop() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
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

  updateSidebarScrollHint();
}

/* Reset the drawer when the screen grows to desktop size, and close it with the Escape key */
mobileMenuQuery.addEventListener("change", () => toggleSidebarMenu(false));
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


    audio.addEventListener("ended", () => {
        const playIcon = document.getElementById("playIcon");
        if (playIcon) {
          playIcon.className = "fas fa-play";
        }
      }
    );
  }
);


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


function toggleAudioPlayer() {
  const bar = document.getElementById( "bottomAudioBar");

  if (!bar) {
    return;
  }

  const isHidden = bar.style.display === "none" || bar.style.display === "";
  bar.style.display = isHidden ? "flex" : "none";
  syncAudioBarOffset();

  if (isHidden) {
    toggleAudioPlay();
  }
}


function toggleAudioPlay() {
  const audio = document.getElementById("exhibitionAudio");
  const playIcon = document.getElementById("playIcon");

  if (!audio) {
    return;
  }

  if (audio.paused) {
    audio.play() .then(() => {
        if (playIcon) {
          playIcon.className = "fas fa-pause";
        }
      })
      .catch(() => {});
  } else {
    audio.pause();
    if (playIcon) {
      playIcon.className = "fas fa-play";
    }
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
    popup.style.display = (popup.style.display === "flex" || popup.style.display === "block") ? "none" : "block";
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

function toggleTranscript() {
  /* Reserved for future transcript modal.... */
}


/* Image thumbnails */
function initialiseThumbnails() {
  const thumbnails = document.querySelectorAll("[data-thumbnail-src]");

  thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click",() => {
          const image = document.getElementById("shelfMainImage");
          const source = thumbnail.dataset.thumbnailSrc;

          if (!image || !source) {
            return;
          }

          image.src = source;
          thumbnails.forEach((item) => {
              item.classList.remove("active");
            }
          );
          thumbnail.classList.add("active");
        }
      );
    }
  );

}


/* Image overlay */
function createImageOverlay(source, altText) {
  const existing = document.getElementById("imageLightbox");
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "imageLightbox";

  Object.assign(overlay.style,{ // move this part to the css???
      position: "fixed",
      inset: "0",
      background: "rgba(0, 0, 0, 0.85)",
      zIndex: "3000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px",
      boxSizing: "border-box"
    }
  );


  const image = document.createElement("img");

  image.src = source;
  image.alt = altText || "";
  Object.assign(image.style,{ // move this part to the css???
      maxWidth: "95%",
      maxHeight: "90%",
      objectFit: "contain"
    }
  );

  const closeButton = document.createElement("button");

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close enlarged image");
  closeButton.textContent ="×";

  Object.assign(closeButton.style, { // move this part to the css???
      position: "absolute",
      top: "20px",
      right: "25px",
      fontSize: "2rem",
      background:
        "transparent",
      border: "0",
      color: "#fff",
      cursor: "pointer"
    }
  );

  closeButton.addEventListener("click", () => overlay.remove());

  overlay.addEventListener("click", (event) => {
      if (
        event.target === overlay
      ) {
        overlay.remove();
      }
    }
  );

  overlay.appendChild(image);
  overlay.appendChild(closeButton);

  document.body.appendChild(overlay);
}


function initialiseImageExpand() {
  const buttons = document.querySelectorAll("[data-expand-image]");

  buttons.forEach((button) => {
      button.addEventListener("click",() => {
          const selector = button.dataset.expandImage;
          const image = selector === "closest" ? button .closest(".hero-image-wrapper") ?.querySelector("img") : document.querySelector(selector);

          if (image) {
            createImageOverlay(image.src, image.alt);
          }
        }
      );
    }
  );
}


/* Shelf image dialog */
document.addEventListener(
  "DOMContentLoaded",() => {
    document
      .querySelectorAll(".expand-btn[aria-controls]")
      .forEach(
        (button) => {
          const dialog = document.getElementById(button.getAttribute("aria-controls"));
          if (!dialog) {
            return;
          }

          button.addEventListener("click", () => {
              if (typeof dialog.showModal === "function") {
                dialog.showModal();
              } else {
                dialog.setAttribute("open","");
              }
            }
          );

          dialog.addEventListener("close", () => button.focus());
        }
      );
  }
);


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

  if (zoomFrame) {
    zoomFrame.addEventListener("click", (event) => setZoom(!isZoomed, event));
    zoomFrame.addEventListener("pointermove", panZoom);
    zoomFrame.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setZoom(!isZoomed);
      }
    });
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
      objectName.textContent = museumNumber
        ? `${objectTitle}, ${museumNumber}`
        : objectTitle;
    }

    if (viewLabel) {
      viewLabel.textContent = `[${label}]`;
    }

    if (imageCaption) {
      imageCaption.textContent = caption;
    }

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
      button.addEventListener("click", () => renderPhoto(index));

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
  initialiseThumbnails();
  initialiseImageExpand();
  initialisePhotoViewer();

  const audio = document.getElementById("exhibitionAudio");
  const playIcon = document.getElementById("playIcon");

  if (audio && playIcon) {
    audio.addEventListener("play", () => {
      playIcon.className = "fas fa-pause";
    });

    audio.addEventListener("pause", () => {
      playIcon.className = "fas fa-play";
    });

    audio.addEventListener("ended", () => {
      playIcon.className = "fas fa-play";
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
