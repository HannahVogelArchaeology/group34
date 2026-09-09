---
layout: shelf2
title: "Second Shelf"
permalink: /shelves/second-shelf/
shelf_number: "SECOND SHELF"
shelf_title: "Second Shelf"
hero_image: "/assets/images/shelf2-main.jpg"
prev_url: "/shelves/first-shelf/"
prev_label: "FIRST SHELF"
next_url: "/shelves/third-shelf/"
next_label: "THIRD SHELF"
---

<section class="shelf-page second-shelf-page">

  <div class="shelf-page-header">
    <p class="shelf-eyebrow">SECOND SHELF</p>
    <h1>Second Shelf</h1>
  </div>

  <div class="object-card-grid">

    <article class="object-card">
      <img
        src="{{ '/assets/images/obj2.jpg' | relative_url }}"
        alt="Object 2"
      >

      <div class="object-card-content">
        <h2>Object 2</h2>

        <p>
          Short description of Object 2.
        </p>

        <a
          href="{{ '/objects/shelf2-object2/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj3.jpg' | relative_url }}"
        alt="Object 3"
      >

      <div class="object-card-content">
        <h2>Object 3</h2>

        <p>
          Short description of Object 3.
        </p>

        <a
          href="{{ '/objects/shelf2-object3/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj4.jpg' | relative_url }}"
        alt="Object 4"
      >

      <div class="object-card-content">
        <h2>Object 4</h2>

        <p>
          Short description of Object 4.
        </p>

        <a
          href="{{ '/objects/shelf2-object4/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj5.jpg' | relative_url }}"
        alt="Object 5"
      >

      <div class="object-card-content">
        <h2>Object 5</h2>

        <p>
          Short description of Object 5.
        </p>

        <a
          href="{{ '/objects/shelf2-object5/' | relative_url }}"
          class="view-button"
        >
          View
        </a>
      </div>
    </article>


    <article class="object-card">
      <img
        src="{{ '/assets/images/obj6.jpg' | relative_url }}"
        alt="Object 6"
      >

      <div class="object-card-content">
        <h2>Object 6</h2>

        <p>
          Short description of Object 6.
        </p>

        <a
          href="{{ '/objects/shelf2-object6/' | relative_url }}"
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
      href="{{ '/shelves/first-shelf/' | relative_url }}"
    >
      <span class="pagination-arrow">←</span>

      <span class="pagination-text">
        <small>BACK</small>
        <strong>FIRST SHELF</strong>
      </span>
    </a>

    <a
      class="shelf-pagination-button shelf-pagination-next"
      href="{{ '/shelves/third-shelf/' | relative_url }}"
    >
      <span class="pagination-text">
        <small>NEXT</small>
        <strong>THIRD SHELF</strong>
      </span>

      <span class="pagination-arrow">→</span>
    </a>

  </nav>

</section>
