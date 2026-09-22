
/* Font size */
let currentFontSize =
  parseInt(localStorage.getItem("userFontSize"), 10) || 100;

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}%`;
}

function changeFontSize(direction) {
  if (direction === 0) {
    currentFontSize = 100;
  } else {
    currentFontSize += direction * 10;
    currentFontSize = Math.min(150, Math.max(70, currentFontSize));
  }

  localStorage.setItem("userFontSize", currentFontSize);
  applyFontSize(currentFontSize);
}


/* Sidebar Menu */
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




/* Audio Player */
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("exhibitionAudio");
  const progressBar = document.getElementById("audioProgress");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");

  if (!audio) return;

  // If Metadata is loaded set the duration
  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  // Update the time
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  // If the audio is finished, change the icon
  audio.addEventListener("ended", () => {
    const playIcon = document.getElementById("playIcon");
    if (playIcon) playIcon.className = "fas fa-play";
  });
});

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
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
  const bar = document.getElementById("bottomAudioBar");
  if (!bar) return;

  const isHidden = bar.style.display === "none" || bar.style.display === "";
  bar.style.display = isHidden ? "flex" : "none";

  if (isHidden) toggleAudioPlay();
}

function toggleAudioPlay() {
  const audio = document.getElementById("exhibitionAudio");
  const playIcon = document.getElementById("playIcon");
  if (!audio) return;

  if (audio.paused) {
    audio.play()
      .then(() => { if (playIcon) playIcon.className = "fas fa-pause"; })
      .catch((error) => console.error("Audio playback failed:", error));
  } else {
    audio.pause();
    if (playIcon) playIcon.className = "fas fa-play";
  }
}

function changeAudioSpeed(speed) {
  const audio = document.getElementById("exhibitionAudio");
  if (audio) audio.playbackRate = speed;
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
  if (!audio) return;

  audio.volume = value;
  audio.muted = (value == 0);

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
  // Script modal or toggle call here...
  // alert("Transcript button clicked");
}


/* Image Thumbnails */
function initialiseThumbnails() {
  const thumbnails = document.querySelectorAll(
    "[data-thumbnail-src]"
  );

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const image = document.getElementById("shelfMainImage");
      const source = thumbnail.dataset.thumbnailSrc;

      if (!image || !source) {
        return;
      }

      image.src = source;

      thumbnails.forEach((item) => {
        item.classList.remove("active");
      });

      thumbnail.classList.add("active");
    });
  });
}


/* Image Expand*/

function createImageOverlay(source, altText) {
  const existing = document.getElementById("imageLightbox");

  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");

  overlay.id = "imageLightbox";

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.85)",
    zIndex: "3000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    boxSizing: "border-box"
  });

  const image = document.createElement("img");

  image.src = source;
  image.alt = altText || "";

  Object.assign(image.style, {
    maxWidth: "95%",
    maxHeight: "90%",
    objectFit: "contain"
  });

  const closeButton = document.createElement("button");

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close enlarged image");
  closeButton.textContent = "×";

  Object.assign(closeButton.style, {
    position: "absolute",
    top: "20px",
    right: "25px",
    fontSize: "2rem",
    background: "transparent",
    border: "0",
    color: "#fff",
    cursor: "pointer"
  });

  closeButton.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });

  overlay.appendChild(image);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);
}

function initialiseImageExpand() {
  const buttons = document.querySelectorAll(
    "[data-expand-image]"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let image;

      const selector = button.dataset.expandImage;

      if (selector === "closest") {
        image = button
          .closest(".hero-image-wrapper")
          ?.querySelector("img");
      } else {
        image = document.querySelector(selector);
      }

      if (!image) {
        return;
      }

      createImageOverlay(
        image.src,
        image.alt
      );
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // aria-controls, find expand button
  const expandButtons = document.querySelectorAll('.expand-btn[aria-controls]');

  expandButtons.forEach(button => {
    const dialogId = button.getAttribute('aria-controls');
    const dialog = document.getElementById(dialogId);

    if (dialog) {
      // Open modal when clicked
      button.addEventListener('click', () => {
        dialog.showModal();
      });

      // Recover focus when modal is closed
      dialog.addEventListener('close', () => {
        button.focus();
      });
    }
  });
});



/* Page Initialisation*/
document.addEventListener("DOMContentLoaded", () => {
  applyFontSize(currentFontSize);

  initialiseThumbnails();
  initialiseImageExpand();

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
