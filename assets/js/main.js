// Dynamic font size adjustment
let currentFontSize = 100;
function changeFontSize(direction) {
  currentFontSize += direction * 10;
  if (currentFontSize < 70) currentFontSize = 70;
  if (currentFontSize > 150) currentFontSize = 150;
  document.body.style.fontSize = currentFontSize + '%';
}

// Menu overlay toggle
function toggleSidebarMenu() {
  const menu = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('sidebarOverlay');
  if (menu && overlay) {
    menu.classList.toggle('active');
    overlay.style.display = menu.classList.contains('active') ? 'block' : 'none';
  }
}

// Cookie Banner handlers
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  closeCookieBanner();
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  closeCookieBanner();
}

function closeCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('cookieConsent')) {
    closeCookieBanner();
  }
});


// Audio Bar toggles
function toggleAudioPlayer() {
  const bar = document.getElementById('bottomAudioBar');
  if (bar) {
    bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
    toggleAudioPlay();
  }
}

function toggleAudioPlay() {
  const audio = document.getElementById('exhibitionAudio');
  const playIcon = document.getElementById('playIcon');
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    if (playIcon) playIcon.className = 'fas fa-pause';
  } else {
    audio.pause();
    if (playIcon) playIcon.className = 'fas fa-play';
  }
}

function changeAudioSpeed(speed) {
  const audio = document.getElementById('exhibitionAudio');
  if (audio) audio.playbackRate = speed;
}

function toggleMute() {
  const audio = document.getElementById('exhibitionAudio');
  const volumeIcon = document.getElementById('volumeIcon');
  if (!audio) return;

  audio.muted = !audio.muted;
  if (volumeIcon) {
    volumeIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
  }
}