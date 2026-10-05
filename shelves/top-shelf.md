---
layout: top-shelf
title: "Top Shelf"
permalink: /shelves/top-shelf/
shelf_number: "TOP SHELF"
shelf_title: "Top Shelf"
object_title: "Object 1"
hero_image: "/assets/images/top-shelf-main.jpg"
prev_url: "/"
prev_label: "MAIN PAGE"
next_url: "/shelves/middle-shelf/"
next_label: "MIDDLE SHELF"
gallery_images:
  - src: "/assets/images/top-shelf-main.jpg"
    label: "FRONT"
    caption: "Object 1 — Front image"
  - src: "/assets/images/top-shelf-thumb1.jpg"
    label: "FRONT SCENE"
    caption: "Object 1 — Front scene image"
  - src: "/assets/images/top-shelf-thumb2.jpg"
    label: "BACK"
    caption: "Object 1 — Back image"
audio_src: "/assets/audio/top-shelf-description.mp3"
transcript_text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
---

<section class="shelf-page top-shelf-page">

  <div class="shelf-page-header">
    <p class="shelf-eyebrow">TOP SHELF</p>
    <h1>Top Shelf</h1>
  </div>

  <div class="top-shelf-content">

    <div class="shelf-main-image">
      <button class="image-expand-button" type="button" aria-label="Expand image">
        <span>↗</span>
      </button>

      <img
        src="{{ '/assets/images/top-shelf-main.jpg' | relative_url }}"
        alt="Top shelf main object"
      >
    </div>

    <div class="shelf-thumbnails">
      <img src="{{ '/assets/images/top-shelf-thumb1.jpg' | relative_url }}" alt="Top shelf thumbnail 1">
      <img src="{{ '/assets/images/top-shelf-thumb2.jpg' | relative_url }}" alt="Top shelf thumbnail 2">
      <img src="{{ '/assets/images/top-shelf-thumb3.jpg' | relative_url }}" alt="Top shelf thumbnail 3">
      <img src="{{ '/assets/images/top-shelf-thumb4.jpg' | relative_url }}" alt="Top shelf thumbnail 4">
    </div>

    <div class="shelf-actions">
      <button type="button" class="image-zoom-button" aria-label="Zoom image">
        <span>⌕</span>
      </button>

      <button type="button" class="explore-3d-btn">
        Explore in 3D
      </button>
    </div>

    <section class="shelf-section">
      <h2>Overview</h2>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Replace this text with the final exhibition description.
      </p>
    </section>

    <section class="shelf-section audio-section">
      <h2>Listen to this story</h2>

      <div class="audio-description-layout">

        <button class="audio-description-button" type="button">
          <span>▶</span>
          Audio Description
        </button>

        <button class="transcript-button" type="button">
          READ TRANSCRIPT
        </button>

      </div>

      <div class="audio-player">
        {% include audio-player.html %}
      </div>
    </section>

    <section class="shelf-section">
      <h2>Object Information</h2>

      <div class="object-information">

        <div class="information-row">
          <span>Time period</span>
          <span>343–343 BCE</span>
        </div>

        <div class="information-row">
          <span>Material</span>
          <span>Lorem Ipsum</span>
        </div>

        <div class="information-row">
          <span>Provenance</span>
          <span>Lorem Ipsum</span>
        </div>

        <div class="information-row">
          <span>Culture</span>
          <span>Lorem Ipsum</span>
        </div>

      </div>
    </section>

  </div>

  <!-- SAME BUTTON STRUCTURE USED BY SHELF 2 / SHELF 3 -->
  <nav class="shelf-pagination" aria-label="Shelf navigation">

    <a
      class="shelf-pagination-button shelf-pagination-back"
      href="{{ '/' | relative_url }}"
    >
      <span class="pagination-arrow">←</span>

      <span class="pagination-text">
        <small>BACK</small>
        <strong>MAIN PAGE</strong>
      </span>
    </a>

    <a
      class="shelf-pagination-button shelf-pagination-next"
      href="{{ '/shelves/middle-shelf/' | relative_url }}"
    >
      <span class="pagination-text">
        <small>NEXT</small>
        <strong>MIDDLE SHELF</strong>
      </span>

      <span class="pagination-arrow">→</span>
    </a>

  </nav>

</section>
