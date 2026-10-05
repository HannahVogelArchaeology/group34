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
  const viewer = document.getElementById("photo-viewer");
  if (!viewer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const objectTitle = params.get("object") || "Object";
  const returnUrl = params.get("return") || "/";
  const currentImage = params.get("image") || "";

  const galleryImages = (params.get("gallery") || currentImage)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const labels = (params.get("labels") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const captions = (params.get("captions") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const images = galleryImages.length ? galleryImages : [currentImage];
  let currentIndex = Math.max(0, images.indexOf(currentImage));

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
      objectName.textContent = objectTitle;
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      renderPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      renderPhoto(currentIndex + 1);
    } else if (event.key === "Escape") {
      window.location.href = returnUrl;
    }
  });

  renderPhoto(currentIndex);
}


document.addEventListener("DOMContentLoaded", () => {
  applyFontSize(currentFontSize);
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