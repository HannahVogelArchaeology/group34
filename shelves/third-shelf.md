---
layout: shelf3
title: "Third Shelf"
permalink: /shelves/third-shelf/
shelf_number: "THIRD SHELF"
shelf_title: "Third Shelf"
hero_image: "/assets/images/shelf3-main.jpg"
prev_url: "/shelves/second-shelf/"
prev_label: "SECOND SHELF"
next_url: "/"
next_label: "MAIN PAGE"
---

<section class="shelf-page third-shelf-page">

  <div class="shelf-page-header">
    <p class="shelf-eyebrow">THIRD SHELF</p>
    <h1>Third Shelf</h1>
  </div>

  <div class="object-card-grid">

    <article class="object-card">
      <img
        src="{{ '/assets/images/obj7.jpg' | relative_url }}"
        alt="Object 7"
      >

      <div class="object-card-content">
        <h2>Object 7</h2>

        <p>
          Short description of Object 7.
        </p>

        <a
          href="{{ '/objects/shelf3-object7/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj8.jpg' | relative_url }}"
        alt="Object 8"
      >

      <div class="object-card-content">
        <h2>Object 8</h2>

        <p>
          Short description of Object 8.
        </p>

        <a
          href="{{ '/objects/shelf3-object8/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj9.jpg' | relative_url }}"
        alt="Object 9"
      >

      <div class="object-card-content">
        <h2>Object 9</h2>

        <p>
          Short description of Object 9.
        </p>

        <a
          href="{{ '/objects/shelf3-object9/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>

  </div>

  <nav class="shelf-pagination" aria-label="Shelf navigation">

    <a
      class="shelf-pagination-button shelf-pagination-back"
      href="{{ '/shelves/second-shelf/' | relative_url }}"
    >
      <span class="pagination-arrow">←</span>

      <span class="pagination-text">
        <small>BACK</small>
        <strong>SECOND SHELF</strong>
      </span>
    </a>

    <a
      class="shelf-pagination-button shelf-pagination-next"
      href="{{ '/' | relative_url }}"
    >
      <span class="pagination-text">
        <small>NEXT</small>
        <strong>MAIN PAGE</strong>
      </span>

      <span class="pagination-arrow">→</span>
    </a>

  </nav>

</section>
