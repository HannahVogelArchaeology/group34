---
layout: top-shelf
title: "Top Shelf"
permalink: /shelves/top-shelf/
shelf_number: "TOP SHELF"
shelf_title: "Top Shelf"
object_title: "1. Pelike"
hero_image: "/assets/images/top-shelf-main.jpg"
prev_url: "/"
prev_label: "MAIN PAGE"
next_url: "/shelves/middle-shelf/"
next_label: "MIDDLE SHELF"
gallery_images:
  - src: "/assets/images/top-shelf-main.jpg"
    label: "FRONT"
    alt: "Object 1. A Pelike. A large Greek-style vase. The scene depicts two men facing each other. One appears to use a staff, possibly as a mobility aid."
    caption: "Pelike, MU4759, front view © Gale History Museum"
  - src: "/assets/images/top-shelf-thumb1.jpg"
    label: "FRONT SCENE"
    alt: "Object 1. Close-up of the scene on a pelike. A large Greek-style vase. The scene depicts two men facing each other. One appears to use a staff, possibly as a mobility aid."
    caption: "Pelike, MU4759, front close-up of scene © Gale History Museum"
  - src: "/assets/images/top-shelf-thumb2.jpg"
    label: "BACK"
    alt: "Object 1. A Pelike. A large Greek-style vase. The scene depicts one seated man and one standing woman facing each other. The woman holds a fan and the man a dish of some sort. Flower-like shapes border the top, scrolls and swirls line the sides, and a Greek key runs along the bottom."
    caption: "Pelike, MU4759, back view © Gale History Museum"
audio_src: "/assets/audio/top-shelf-description.mp3"
transcript_text: "This large ceramic vessel has a wide, thick rim upon a flared neck. A line of leaf-like decorations wraps around the neck. It has one handle on either side, starting below the rim and meeting at the shoulder of the vessel, which becomes a wide, bulbous body upon a circular base. The vessel is black in colour with a light orange scene in the centre. The scene depicts two young men facing each other. Both men are barefoot, have curly hair and wear large toga-style tunics that cover their bodies to the ankle, draping across one shoulder and leaving the other exposed. The man on the left is holding a long staff with his right hand; his arm is bent at the elbow. His right leg is outlined by the fabric and appears to be slightly bent forward, while his right shoulder is facing downwards, as if he is being supported by this staff. The other figure holds a shorter, curved object with his right hand around shoulder height; his arm is bent at the elbow. The two figures are standing on a geometric pattern above the vessel base and are framed by swirling patterns on either side.  "
overview: "This pelike depicts the use of a mobility aid: a staff or cane. In ancient Greece, staff-like objects were also symbols of power, authority and justice. Archaeological narratives are selective about how these artefacts are interpreted, often rejecting the possibility of disability coinciding with symbols of power."
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
          <span>Acq. No</span>
          <span>MU4759</span>
        </div>

        <div class="information-row">
          <span>Material</span>
          <span>Ceramic</span>
        </div>

        <div class="information-row">
          <span>Dimensions</span>
          <span>??mm x ??mm</span>
        </div>

        <div class="information-row">
          <span>Details</span>
          <span>Painter of Bari 8010, Southern Italy, 350-340 B.C.E. Purchase, 2013</span>
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
