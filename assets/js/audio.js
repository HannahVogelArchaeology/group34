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

  showAudioSpeed(1, false);
}


function changeAudioSpeed(speed) {
  const audio = document.getElementById("exhibitionAudio");
  if (audio) {
    audio.playbackRate = speed;
  }

  showAudioSpeed(speed, true);
}

/* One button changes the speed: 1.0x -> 1.5x -> 0.5x -> 1.0x. The last step takes the listener back to the normal speed. */
function cycleAudioSpeed() {
  const audio = document.getElementById("exhibitionAudio");
  const current = audio ? audio.playbackRate : 1;
  const next = current === 1 ? 1.5 : (current === 1.5 ? 0.5 : 1);

  changeAudioSpeed(next);
}

/* The button shows the current speed. Its name tells what the next press does, and screen readers hear the new speed. */
function showAudioSpeed(speed, announce) {
  const button = document.getElementById("audioSpeedBtn");
  const status = document.getElementById("audioSpeedStatus");
  const names = { 0.5: "half speed (0.5x)", 1: "normal (1.0x)", 1.5: "fast (1.5x)" };
  const next = speed === 1 ? 1.5 : (speed === 1.5 ? 0.5 : 1);
  const nextText = { 0.5: "play slower (0.5x)", 1: "go back to normal speed (1.0x)", 1.5: "play faster (1.5x)" };

  if (button) {
    button.textContent = speed.toFixed(1) + "x";
    button.setAttribute("aria-label", "Playback speed: " + names[speed] + ". Press to " + nextText[next]);
  }

  if (status) {
    status.textContent = announce ? "Speed " + speed.toFixed(1) + "x" : "";
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
