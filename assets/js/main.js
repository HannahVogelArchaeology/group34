/* Font size */
let currentFontSize =
  parseInt(localStorage.getItem("userFontSize"), 10) || 100;

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}%`;
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


/* Sidebar menu */
function toggleSidebarMenu() {
  const menu = document.getElementById("sidebarMenu");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menu || !overlay) {
    return;
  }

  const isOpen = menu.classList.toggle("active");
  overlay.classList.toggle("active", isOpen);
  overlay.style.display = isOpen ? "block" : "none";
  document.body.classList.toggle("menu-open", isOpen);
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
  const root = document.querySelector("[data-photo-viewer]");

  if (!root) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const objectName = params.get("object") || "Object";
  const returnUrl = params.get("return") || root.dataset.siteRoot || "/";
  const mainImage = root.querySelector("[data-photo-main]");
  const caption = root.querySelector("[data-photo-caption]");
  const counter = root.querySelector("[data-photo-counter]");
  const thumbnails = root.querySelector("[data-photo-thumbnails]");
  const previous = root.querySelector("[data-photo-prev]");
  const next = root.querySelector("[data-photo-next]");
  const returnLinks = root.querySelectorAll("[data-photo-return]");

  let images = (params.get("gallery") || params.get("image") || "")
      .split(",")
      .filter(Boolean);

  if (!images.length) {
    images = [root.dataset.fallbackImage || ""];
  }

  let current = 0;


  /* Return to object page */
  returnLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = returnUrl;
    });
  });


  /* Render selected image */
  function renderPhoto(index) {
    current = (index + images.length) % images.length;
    mainImage.src = images[current];
    mainImage.alt = `${objectName} photo view ${current + 1}`;

    caption.textContent = `${objectName} • [` + `${current === 0 ? "Front View" : `Photo View ${current + 1}`}` + `]`;
    counter.textContent = `${current + 1}/${images.length}`;

    thumbnails
      .querySelectorAll(".photo-thumbnail")
      .forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("is-active", thumbIndex === current);
      });
  }


  /* Create thumbnail buttons */
  images.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "photo-thumbnail";
    button.setAttribute("aria-label", `View photo ${index + 1}`);

    const image = document.createElement("img");
    image.src = src;
    image.alt = "";

    button.appendChild(image);
    button.addEventListener("click", () => renderPhoto(index));

    thumbnails.appendChild(button);
  });


  /* Previous */
  previous.addEventListener("click", () => renderPhoto(current - 1));

  /* Next */
  next.addEventListener("click", () => renderPhoto(current + 1));

  /* Keyboard navigation */
  document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        renderPhoto(current - 1);
      }

      if (event.key === "ArrowRight") {
        renderPhoto(current + 1);
      }

      if (event.key === "Escape") {
        window.location.href =
          returnUrl;
      }
    }
  );
  renderPhoto(0);
}


/* Page initialisation */
document.addEventListener(
  "DOMContentLoaded",() => {
    applyFontSize(currentFontSize);
    initialiseThumbnails();
    initialiseImageExpand();
    initialisePhotoViewer();

    const audio = document.getElementById("exhibitionAudio");
    const playIcon = document.getElementById("playIcon");

    if (audio && playIcon) {
      audio.addEventListener("play",() => {
          playIcon.className = "fas fa-pause";
        }
      );

      audio.addEventListener("pause", () => {
          playIcon.className = "fas fa-play";
        }
      );

      audio.addEventListener("ended", () => {
          playIcon.className = "fas fa-play";
        }
      );
    }
  }
);

/* Photo viewer page */
document.addEventListener("DOMContentLoaded", function() {

  // Check if we are on the Photo Viewer page
  const photoViewer = document.getElementById('photo-viewer');
  if (!photoViewer) return;

  // Parse URL search parameters
  const params = new URLSearchParams(window.location.search);
  const currentImage = params.get('image') || '';
  const objectTitle = params.get('object') || 'Object';
  const returnUrl = params.get('return') || 'javascript:history.back()';
  
  // Split gallery param into an array or fallback to current image
  const galleryRaw = params.get('gallery');
  let galleryImages = galleryRaw ? galleryRaw.split(',') : [currentImage];
  galleryImages = galleryImages.filter(url => url.trim() !== '');

  if (galleryImages.length === 0 && currentImage) {
    galleryImages = [currentImage];
  }

  const defaultViews = ["FRONT", "LEFT SIDE", "RIGHT SIDE", "BACK"];

  let currentIndex = galleryImages.indexOf(currentImage);
  if (currentIndex === -1) currentIndex = 0;

  // DOM elements
  const mainImg = document.getElementById('photoMainImage');
  const counterEl = document.getElementById('photoCounter');
  const nameEl = document.getElementById('photoObjectName');
  const viewLabelEl = document.getElementById('photoViewLabel');
  const backLink = document.getElementById('photoBackLink');
  const closeBtn = document.getElementById('photoClose');
  const prevBtn = document.getElementById('photoPrev');
  const nextBtn = document.getElementById('photoNext');
  const thumbsContainer = document.getElementById('photoThumbnails');

  // Setup top links
  if (backLink) backLink.href = returnUrl;
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      window.location.href = returnUrl;
    });
  }

  // Function to update display
  function updateViewer(index) {
    if (galleryImages.length === 0) return;
    
    currentIndex = index;
    const activeUrl = galleryImages[currentIndex];
    const viewName = defaultViews[currentIndex] || `VIEW ${currentIndex + 1}`;

    if (mainImg) {
      mainImg.src = activeUrl;
      mainImg.alt = `${objectTitle} - ${viewName}`;
    }
    if (nameEl) nameEl.textContent = objectTitle;
    if (viewLabelEl) viewLabelEl.textContent = `[${viewName}]`;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

    // Update thumbnails selection 
    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll('.photo-thumbnail');
      thumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('is-active', idx === currentIndex);
      });
    }
  }

  // Render thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    galleryImages.forEach((url, idx) => {
      const viewName = defaultViews[idx] || `VIEW ${idx + 1}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `photo-thumbnail ${idx === currentIndex ? 'is-active' : ''}`;
      btn.setAttribute('aria-label', viewName);

      btn.innerHTML = `
        <span class="photo-thumb-label" style="display:block; font-size:0.7rem; margin-bottom:2px; text-transform:uppercase;">${viewName}</span>
        <img src="${url}" alt="${viewName}">
      `;

      btn.addEventListener('click', function() {
        updateViewer(idx);
      });

      thumbsContainer.appendChild(btn);
    });
  }

  // Arrow navigation controls
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = galleryImages.length - 1;
      updateViewer(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      let newIndex = currentIndex + 1;
      if (newIndex >= galleryImages.length) newIndex = 0;
      updateViewer(newIndex);
    });
  }

  // Initialize page view
  updateViewer(currentIndex);
});
