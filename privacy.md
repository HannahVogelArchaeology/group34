---
layout: default
title: "Privacy Policy"
permalink: /privacy/
---

<div
  class="photo-viewer-page"
  data-photo-viewer
  data-site-root="{{ '/' | relative_url }}"
  data-fallback-image="{{ '/assets/images/hero-bg.jpg' | relative_url }}"
>

  <div class="photo-viewer-header">

    <a
      href="#"
      class="photo-back-link"
      data-photo-return
    >
      <span aria-hidden="true">←</span>
      Back to object
    </a>

    <span
      class="photo-counter"
      data-photo-counter
    >
      1/5
    </span>

    <button
      class="photo-close"
      type="button"
      data-photo-return
      aria-label="Close photo viewer"
    >
      ×
    </button>

  </div>

  <div class="photo-viewer-stage">

    <button
      class="photo-arrow photo-arrow-prev"
      type="button"
      data-photo-prev
      aria-label="Previous photo"
    >
      <span aria-hidden="true">‹</span>
    </button>


    <figure class="photo-viewer-figure">

      <img
        src=""
        alt=""
        data-photo-main
      >

      <figcaption data-photo-caption></figcaption>

    </figure>


    <button
      class="photo-arrow photo-arrow-next"
      type="button"
      data-photo-next
      aria-label="Next photo"
    >
      <span aria-hidden="true">›</span>
    </button>

  </div>

  <div
    class="photo-thumbnail-panel"
    aria-label="Photo views"
  >

    <div
      class="photo-thumbnail-handle"
      aria-hidden="true"
    ></div>

    <div
      class="photo-thumbnails"
      data-photo-thumbnails
    ></div>

  </div>

</div>
