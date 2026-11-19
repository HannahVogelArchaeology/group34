/* Photo viewer page */

/* Short links (?key=...&index=...) read one small gallery file (photo-data/<page name>.json) for the
   page they came from, so the viewer never downloads the galleries of every other page.
   Old long links (?image=...&gallery=...) still work without any file. */
function initialisePhotoViewer() {
  const viewer = document.getElementById("photo-viewer");
  if (!viewer) {
    return;
  }

  const galleryKey = new URLSearchParams(window.location.search).get("key");
  const dataFolder = viewer.getAttribute("data-gallery-folder");

  if (!galleryKey || !dataFolder) {
    startPhotoViewer(null);
    return;
  }

  // The file is named after the last part of the page address, for example .../objects/middle-shelf-object3/ -> middle-shelf-object3.json
  const pageName = galleryKey.replace(/\/+$/, "").split("/").pop();

  // The page already asked for the file while it was loading (see the small script in _layouts/photo.html), so the answer is usually here by now.
  const galleryRequest =
    window.photoGalleryRequest ||
    fetch(dataFolder + encodeURIComponent(pageName) + ".json")
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null);

  galleryRequest.then((galleryEntry) => startPhotoViewer(galleryEntry && Array.isArray(galleryEntry.images) ? galleryEntry : null));
}

function startPhotoViewer(galleryEntry) {
  const viewer = document.getElementById("photo-viewer");
  if (!viewer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

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

  /* The stage and the thumbnails stay hidden (see _photo.scss) until the frame has its size, so nothing visibly jumps. */
  const showViewer = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => viewer.classList.add("is-ready")));
  };

  if (mainImage) {
    mainImage.addEventListener("load", () => {
      fitFrameToPhoto();
      limitFrameHeight();
      showViewer();
    });
    mainImage.addEventListener("error", () => {
      fitFrameToPhoto();
      limitFrameHeight();
      showViewer();
    });
  }

  window.setTimeout(showViewer, 1500);

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

  const guideSkipped = new URLSearchParams(window.location.search).get("guide") === "off";

  if (!guideSeen && !guideSkipped) {
    setGuideOpen(true);

    try {
      localStorage.setItem("photoGuideSeen", "yes");
    } catch (error) { /* Storage may be unavailable. */ }
  }
}
