/* Keyboard Guide
   A mode that the visitor turns on from the navigation menu. While it is on, a keycap badge sits next to each link and
   button and shows the keys that reach it. The badges are drawn in an overlay on top of the page, so the page itself
   (its markup, its tab order and what screen readers read) is not changed. The choice is remembered between pages. */
(function () {
  "use strict";

  var STORAGE_KEY = "keyboardGuide";
  var BODY_CLASS = "keyboard-guide-on";

  /* A badge shows its keys as steps. A step is a list of alternative keys.
     ">" is shown between steps ("then") and "/" between alternatives ("or"). */
  var BUTTON = [["Tab"], ["Enter", "Space"]];
  var LINK = [["Tab"], ["Enter"]];

  /* Targets on every page except the photo viewer. Fields: sel (CSS selector), keys, label, place (below, above, left,
     inside-tr, inside-bl, header; default below), first (only the first match), compact (keys only, no label), nobox (no dashed outline), belowHeader (never above the bottom edge of the fixed header). */
  var SITE_TARGETS = [
    { sel: ".pinned-header .exhibition-title", keys: LINK, label: "Go to the home page", place: "header" },
    { sel: ".pinned-header .text-resizers", keys: BUTTON, label: "Change the text size", place: "header" },
    { sel: ".pinned-header .settings-btn", keys: BUTTON, label: "Text size and dark mode. Esc closes", place: "header" },
    { sel: ".pinned-header .mobile-menu-btn", keys: BUTTON, label: "Open the menu. Esc closes it", place: "header" },
    { sel: ".pinned-header .dark-mode-btn", keys: BUTTON, label: "Dark or light mode", place: "header" },
    { sel: ".pinned-header .header-top-btn", keys: BUTTON, label: "Back to top", place: "header" },
    { sel: ".back-to-top", keys: BUTTON, label: "Back to top", place: "above" },
    { sel: "#sidebarNav", keys: LINK, label: "Choose a page or an object", place: "left", nobox: true, belowHeader: true },
    { sel: ".btn-explore-exhibition", keys: LINK, label: "Go to the shelves" },
    { sel: ".btn-curator-bio", keys: LINK, label: "Open About Us" },
    { sel: ".shelf-card", keys: LINK, label: "Open this shelf", place: "above" },
    { sel: ".auslan-video", keys: [["Tab"], ["Space"]], label: "Play or pause the video", place: "inside-tr" },
    { sel: ".ack-right a", keys: LINK, label: "Open the link", first: true },
    { sel: ".about-toc", keys: LINK, label: "Jump to a section", place: "inside-tr" },
    { sel: ".team-avatars", keys: BUTTON, label: "Choose a team member" },
    /* About Us: one badge for each table or paragraph that holds links (the other tables and paragraphs have none). */
    { sel: ".about-page-container .visitor-info-table, .about-page-container .curation-info-table, .about-page-container .content-section p, #member-social", withLink: true, keys: LINK, label: "Open a link" },
    { sel: ".toc-card", keys: LINK, label: "Jump to a section", place: "inside-tr" },
    { sel: ".back-link", keys: LINK, label: "Back to the shelf" },
    { sel: ".object-carousel-link", keys: LINK, compact: true, spot: "mid" },
    { sel: ".expand-btn", keys: LINK, label: "Open the photo viewer", place: "left" },
    { sel: ".thumbnails-row, .thumbnail-list", keys: LINK, label: "Open a photo in the viewer" },
    { sel: "a.explore-3d-btn", keys: LINK, label: "Open the 3D model" },
    { sel: "button.explore-3d-btn", keys: BUTTON, label: "Open the 3D model" },
    { sel: ".audio-controls .audio-play-btn, .audio-actions .audio-play-btn", keys: BUTTON, label: "Play the audio description" },
    { sel: ".shelf-pagination .nav-back", keys: LINK, label: "Go to the previous page" },
    { sel: ".shelf-pagination .nav-next", keys: LINK, label: "Go to the next page" },
    { sel: "#bottomAudioBar .audio-left", keys: BUTTON, label: "Play, pause or change the speed", place: "above" },
    { sel: "#audioProgress", keys: [["Tab"], ["←", "→"]], label: "Skip back or forward", place: "above" },
    { sel: ".legal-links", keys: LINK, label: "Open Privacy or Terms" },
    { sel: ".footer-right .submit-btn", keys: BUTTON, label: "Send an enquiry email" }
  ];

  /* Targets on the photo viewer, which covers the header and the menu. */
  var PHOTO_TARGETS = [
    { sel: "#photoGuideButton", keys: BUTTON, label: "Open the guide" },
    { sel: "#photoExpand", keys: BUTTON, label: "Show the photo full screen" },
    { sel: "#photoExpand", keys: [["Esc"]], label: "Leave full screen" },
    { sel: "#photoClose", keys: BUTTON, label: "Close the viewer" },
    { sel: "#photoClose", keys: [["Esc"]], label: "Close the viewer" },
    { sel: "#photoZoomFrame", keys: BUTTON, label: "Zoom in or out", place: "inside-tr" },
    { sel: "#photoZoomFrame", keys: [["Esc"]], label: "Zoom out, then close", place: "inside-bl" },
    { sel: "#photoPrev", keys: [["←"]], label: "Previous photo" },
    { sel: "#photoPrev", keys: BUTTON, label: "Previous photo" },
    { sel: "#photoNext", keys: [["→"]], label: "Next photo" },
    { sel: "#photoNext", keys: BUTTON, label: "Next photo" },
    { sel: "#photoThumbnails", keys: BUTTON, label: "Choose a photo", place: "above" },
    { sel: "#photoGuideClose", keys: [["Enter", "Space", "Esc"]], label: "Close the guide" }
  ];

  var legendRows = [
    [[["Tab"]], [["Shift+Tab"]], "Move to the next link or button, or back to the previous one"],
    [[["Enter"]], null, "Open a link or press a button"],
    [[["Space"]], [["Shift+Space"]], "Press a button. On the page itself, scroll down, or up with Shift"],
    [[["Esc"]], null, "Close the menu or a dialog"],
    [[["\u2190", "\u2192"]], null, "Move through the photos (photo viewer) or along a slider"]
  ];

  var isOn = false;
  var docLayer = null;
  var fixedLayer = null;
  var legend = null;
  var legendWrap = null;
  var frame = 0;
  var isPhotoPage = Boolean(document.getElementById("photo-viewer"));
  /* True while the header is the top of the sidebar on the right (wide screens). It is read from the layout itself,
     not from the screen width, so it is always right whatever the zoom level. */
  function sidebarHeader() {
    var bar = document.querySelector(".pinned-header");
    if (!bar) { return false; }
    var rect = bar.getBoundingClientRect();
    var viewport = document.documentElement.clientWidth;
    return rect.width < viewport * 0.6 && rect.left > viewport * 0.4;
  }

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY) === "on"; } catch (error) { return false; }
  }

  function store(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? "on" : "off"); } catch (error) { /* Storage may be unavailable. */ }
  }

  function make(tag, className, text) {
    var element = document.createElement(tag);
    if (className) { element.className = className; }
    if (text) { element.textContent = text; }
    return element;
  }

  function keyCap(name) {
    return make("kbd", "kg-key", name);
  }

  function buildKeys(steps) {
    var row = make("div", "kg-keys");

    steps.forEach(function (alternatives, stepIndex) {
      if (stepIndex > 0) { row.appendChild(make("span", "kg-then", "›")); }

      alternatives.forEach(function (name, index) {
        if (index > 0) { row.appendChild(make("span", "kg-or", "/")); }

        /* "Shift+Tab" is two keys pressed together. */
        name.split("+").forEach(function (part, partIndex) {
          if (partIndex > 0) { row.appendChild(make("span", "kg-or", "+")); }
          row.appendChild(keyCap(part));
        });
      });
    });

    return row;
  }

  function buildBadge(entry) {
    var badge = make("div", "kg-badge" + (entry.compact ? " kg-compact" : ""));
    badge.appendChild(buildKeys(entry.keys));
    if (entry.label && !entry.compact) { badge.appendChild(make("span", "kg-label", entry.label)); }
    return badge;
  }

  /* An element inside a fixed ancestor (such as the header) stays where it is while the page scrolls. */
  function isFixed(element) {
    for (var node = element; node && node !== document.documentElement; node = node.parentElement) {
      if (window.getComputedStyle(node).position === "fixed") { return true; }
    }
    return false;
  }

  function isShown(element) {
    if (!element.getClientRects().length) { return false; }
    if (element.closest("[inert], [hidden]")) { return false; }
    if (window.getComputedStyle(element).visibility === "hidden") { return false; }
    var rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function overlaps(a, b) {
    var gap = 4;
    return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
  }

  function overlapArea(a, b) {
    var w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    var h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(value, Math.max(low, high)));
  }

  /* The rectangles of the page's text (and, with less weight, its pictures), in page coordinates. A badge that is not
     fixed to the screen is placed where it covers as little of them as possible. */
  function collectOccupied() {
    var list = [];
    var scrollX = window.pageXOffset;
    var scrollY = window.pageYOffset;
    var range = document.createRange();
    var shown = typeof Map === "function" ? new Map() : null;

    function visible(element) {
      if (!shown) { return isShown(element); }
      if (!shown.has(element)) { shown.set(element, isShown(element)); }
      return shown.get(element);
    }

    [document.getElementById("main-content"), document.querySelector(".site-footer")].forEach(function (root) {
      if (!root) { return; }

      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          var parent = node.parentElement;
          if (!parent || !node.nodeValue.trim()) { return NodeFilter.FILTER_REJECT; }
          if (parent.closest(".kg-layer, .kg-legend-wrap, .sr-only, script, style, noscript")) { return NodeFilter.FILTER_REJECT; }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      for (var node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!visible(node.parentElement)) { continue; }
        range.selectNodeContents(node);
        Array.prototype.forEach.call(range.getClientRects(), function (rect) {
          if (rect.width > 2 && rect.height > 2) {
            list.push({ x: rect.left + scrollX, y: rect.top + scrollY, w: rect.width, h: rect.height, weight: 1 });
          }
        });
      }

      Array.prototype.forEach.call(root.querySelectorAll("img, video, canvas, svg"), function (element) {
        if (element.closest(".kg-layer, .kg-legend-wrap") || !visible(element)) { return; }
        var rect = element.getBoundingClientRect();
        list.push({ x: rect.left + scrollX, y: rect.top + scrollY, w: rect.width, h: rect.height, weight: 0.1 });
      });
    });

    if (legendWrap) {
      var panel = legendWrap.getBoundingClientRect();
      list.push({ x: panel.left + scrollX, y: panel.top + scrollY, w: panel.width, h: panel.height, weight: 1 });
    }

    return list;
  }

  /* Places to try for a badge of size w by h next to a box, best first. Each has a name that an entry can ask for. */
  function candidatePlaces(box, w, h) {
    var gap = 8;
    var right = box.x + box.w - w;
    var bottom = box.y + box.h - h;
    var midX = box.x + (box.w - w) / 2;
    var midY = box.y + (box.h - h) / 2;
    var list = [];

    [0, 30, 64, 100].forEach(function (extra, index) {
      list.push({ name: index ? "below+" : "below", x: box.x, y: box.y + box.h + gap + extra });
      list.push({ name: index ? "above+" : "above", x: box.x, y: box.y - h - gap - extra });
    });

    list.push({ name: "right", x: box.x + box.w + gap, y: box.y });
    list.push({ name: "left", x: box.x - w - gap, y: box.y });
    list.push({ name: "right-mid", x: box.x + box.w + gap, y: midY });
    list.push({ name: "left-mid", x: box.x - w - gap, y: midY });
    list.push({ name: "below-mid", x: midX, y: box.y + box.h + gap });
    list.push({ name: "above-mid", x: midX, y: box.y - h - gap });
    list.push({ name: "below-right", x: right, y: box.y + box.h + gap });
    list.push({ name: "above-right", x: right, y: box.y - h - gap });
    list.push({ name: "inside-tr", x: right - 8, y: box.y + 8, inside: true });
    list.push({ name: "inside-br", x: right - 8, y: bottom - 8, inside: true });
    list.push({ name: "inside-tl", x: box.x + 8, y: box.y + 8, inside: true });
    list.push({ name: "inside-bl", x: box.x + 8, y: bottom - 8, inside: true });
    list.push({ name: "inside-mid-right", x: right - 8, y: midY, inside: true });
    list.push({ name: "inside-mid-left", x: box.x + 8, y: midY, inside: true });
    list.push({ name: "inside-mid", x: midX, y: midY, inside: true });
    return list;
  }

  /* More places to try when the usual ones are crowded: a grid of positions around the box. */
  function gridPlaces(box, w, h, reach) {
    var list = [];
    var step = 24;

    for (var y = box.y - h - reach; y <= box.y + box.h + reach; y += step) {
      for (var x = box.x - w - reach; x <= box.x + box.w + reach; x += step) {
        list.push({ name: "grid", x: x, y: y, grid: true });
      }
    }

    return list;
  }

  function rectGap(a, b) {
    var dx = Math.max(0, Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)));
    var dy = Math.max(0, Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h)));
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* How much of the text a straight line from the badge to its element would cross. */
  function lineCost(rect, box, texts) {
    var tx = clamp(rect.x + rect.w / 2, box.x, box.x + box.w);
    var ty = clamp(rect.y + rect.h / 2, box.y, box.y + box.h);
    var bx = clamp(tx, rect.x, rect.x + rect.w);
    var by = clamp(ty, rect.y, rect.y + rect.h);
    var hits = 0;

    for (var i = 1; i < 8; i += 1) {
      var px = bx + (tx - bx) * i / 8;
      var py = by + (ty - by) * i / 8;

      for (var k = 0; k < texts.length; k += 1) {
        var t = texts[k];
        if (px > t.x && px < t.x + t.w && py > t.y && py < t.y + t.h) { hits += 1; break; }
      }
    }

    return hits * 400;
  }

  /* A thin line from a badge to the element it belongs to. */
  function connect(layer, badgeRect, box) {
    var ns = "http://www.w3.org/2000/svg";
    var tx = clamp(badgeRect.x + badgeRect.w / 2, box.x, box.x + box.w);
    var ty = clamp(badgeRect.y + badgeRect.h / 2, box.y, box.y + box.h);
    var bx = clamp(tx, badgeRect.x, badgeRect.x + badgeRect.w);
    var by = clamp(ty, badgeRect.y, badgeRect.y + badgeRect.h);

    if (Math.abs(tx - bx) + Math.abs(ty - by) < 2) { return; }

    var left = Math.min(tx, bx) - 3;
    var top = Math.min(ty, by) - 3;
    var svg = document.createElementNS(ns, "svg");
    var line = document.createElementNS(ns, "line");
    svg.setAttribute("class", "kg-tail-line");
    svg.setAttribute("width", String(Math.abs(tx - bx) + 6));
    svg.setAttribute("height", String(Math.abs(ty - by) + 6));
    svg.style.left = left + "px";
    svg.style.top = top + "px";
    line.setAttribute("x1", String(bx - left));
    line.setAttribute("y1", String(by - top));
    line.setAttribute("x2", String(tx - left));
    line.setAttribute("y2", String(ty - top));
    svg.appendChild(line);
    layer.insertBefore(svg, layer.firstChild);
  }

  function draw() {
    frame = 0;

    if (!isOn || !docLayer || !fixedLayer) { return; }

    /* The overlay must never make the page longer. Its height is set to the height of the page without it, and it
       clips anything that would hang beyond that (a badge under the last line of the footer, for example). */
    docLayer.style.height = "0px";
    docLayer.textContent = "";
    fixedLayer.textContent = "";
    var docHeight = document.documentElement.scrollHeight;
    docLayer.style.height = docHeight + "px";

    var targets = isPhotoPage ? PHOTO_TARGETS : SITE_TARGETS;
    var placed = { doc: [], fixed: [] };
    var lowestFixed = 0;
    var beside = sidebarHeader();
    var pinnedBar = document.querySelector(".pinned-header");
    var barLeft = pinnedBar ? pinnedBar.getBoundingClientRect().left : 0;
    var width = document.documentElement.clientWidth;
    var scrollX = window.pageXOffset;
    var scrollY = window.pageYOffset;
    var pending = [];
    var sideRows = [];

    targets.forEach(function (entry) {
      var matches = Array.prototype.slice.call(document.querySelectorAll(entry.sel)).filter(isShown);
      if (entry.withLink) { matches = matches.filter(function (element) { return Boolean(element.querySelector("a[href]")); }); }
      if (entry.first) { matches = matches.slice(0, 1); }

      matches.forEach(function (element) {
        var fixed = isFixed(element);
        var layer = fixed ? fixedLayer : docLayer;
        var rect = element.getBoundingClientRect();
        var box = {
          x: rect.left + (fixed ? 0 : scrollX),
          y: rect.top + (fixed ? 0 : scrollY),
          w: rect.width,
          h: rect.height
        };

        if (!entry.nobox) {
          var outline = make("div", "kg-target-box");
          outline.style.left = box.x + "px";
          outline.style.top = box.y + "px";
          outline.style.width = box.w + "px";
          outline.style.height = box.h + "px";
          layer.appendChild(outline);
        }

        /* Badges for things in the page are placed after all the boxes are known (see below). */
        if (!fixed) {
          pending.push({ entry: entry, box: box });
          return;
        }

        /* The buttons in the header and the menu are described in the panel at the top of the page (beside the sidebar
           or under the title on a phone), so no badge has to cover the page text next to them. */
        if (entry.place === "header" || entry.sel === "#sidebarNav") {
          sideRows.push(entry);
          return;
        }

        var badge = buildBadge(entry);
        layer.appendChild(badge);

        var w = badge.offsetWidth;
        var h = badge.offsetHeight;
        var place = entry.place || "below";
        var x = box.x;
        var y = box.y + box.h + 8;

        if (place === "header") {
          /* Under the whole fixed header, so a badge never covers a header button, and centred on its button. */
          x = box.x + box.w / 2 - w / 2;
          y = (pinnedBar ? pinnedBar.getBoundingClientRect().bottom : box.y + box.h) + 8;
        }
        if (place === "above") { y = box.y - h - 8; }
        if (place === "left") { x = box.x - w - 10; y = box.y; }
        if (entry.belowHeader && pinnedBar) { y = Math.max(y, pinnedBar.getBoundingClientRect().bottom + 8); }
        if (place === "inside-tr") { x = box.x + box.w - w - 8; y = box.y + 8; }
        if (place === "inside-bl") { x = box.x + 8; y = box.y + box.h - h - 8; }

        x = Math.max(4, Math.min(x, width - w - 4));
        y = Math.max(4, y);

        var current = { x: x, y: y, w: w, h: h };
        for (var attempt = 0; attempt < 12; attempt += 1) {
          var hit = placed.fixed.filter(function (other) { return overlaps(current, other); })[0];
          if (!hit) { break; }

          if (place === "header") {
            /* Badges under the header make one row, so they take as little height as possible: slide sideways first. */
            var slid = hit.x + hit.w + 4;

            if (slid >= 4 && slid + w <= width - 4) {
              current.x = slid;
              continue;
            }

            current.x = Math.max(4, Math.min(box.x + box.w / 2 - w / 2, width - w - 4));
            current.y = hit.y + hit.h + 4;
          } else {
            current.y = place === "above" ? hit.y - h - 4 : hit.y + hit.h + 4;
          }
        }
        placed.fixed.push(current);
        /* Only the badges that hang below the header count, not the one beside the "Back to top" button at the bottom of the screen. */
        if (!beside && (entry.place === "header" || entry.belowHeader)) { lowestFixed = Math.max(lowestFixed, current.y + h); }

        badge.style.left = current.x + "px";
        badge.style.top = current.y + "px";
        connect(layer, current, box);
      });
    });

    /* Badges for things in the page. Each one goes where it covers the least text, picture or other badge. */
    if (pending.length) {
      var occupied = collectOccupied();
      var limitRight = beside ? barLeft : width;

      pending.forEach(function (item) {
        occupied.push({ x: item.box.x, y: item.box.y, w: item.box.w, h: item.box.h, weight: 2, owner: item });
      });

      pending.forEach(function (item) {
        var entry = item.entry;
        var box = item.box;
        var badge = buildBadge(entry);
        docLayer.appendChild(badge);

        var w = badge.offsetWidth;
        var h = badge.offsetHeight;
        var scale = 1;

        /* A badge wider than its element (a narrow card) is made smaller so that neighbours do not collide. */
        if (entry.compact && w > box.w - 8) {
          scale = Math.max(0.7, (box.w - 8) / w);
          badge.style.transformOrigin = "0 0";
          badge.style.transform = "scale(" + scale + ")";
          w *= scale;
          h *= scale;
        }

        var spot;

        if (entry.spot === "mid") {
          /* The same place on every card: a little below the top, between the number and the text of the card. */
          spot = { x: box.x + (box.w - w) / 2, y: box.y + box.h * 0.3, inside: true };
        } else {
          var reach = 260;
          var zone = { x: box.x - w - reach, y: box.y - h - reach, w: box.w + 2 * w + 2 * reach, h: box.h + 2 * h + 2 * reach };
          var near = occupied.filter(function (other) { return other.owner !== item && overlapArea(zone, other) > 0; });
          var texts = near.filter(function (other) { return other.weight >= 1 && other.weight < 5; });

          /* The best place for a badge of the given size. */
          var search = function (bw, bh, extraCost) {
            var found = null;
            var options = candidatePlaces(box, bw, bh).concat(gridPlaces(box, bw, bh, reach));

            options.forEach(function (option, rank) {
              var rect = {
                x: clamp(option.x, 4, limitRight - bw - 4),
                y: clamp(option.y, 4, docHeight - bh - 4),
                w: bw,
                h: bh
              };
              var cost = extraCost;

              near.forEach(function (other) { cost += overlapArea(rect, other) * other.weight * 10; });

              var distance = rectGap(rect, box);

              if (option.grid) { cost += 300 + distance * 2; }
              else { cost += (rank + (entry.place && option.name === entry.place ? -2 : 0)) * 25; }

              if (!option.inside && distance > 4 && cost < (found ? found.cost : Infinity)) { cost += lineCost(rect, box, texts); }

              if (!found || cost < found.cost) { found = { cost: cost, rect: rect, inside: option.inside }; }
            });

            return found;
          };

          /* When the page is crowded, a narrower badge (its text on two lines) may fit where the wide one does not. */
          var chosen = null;
          [false, true].forEach(function (narrow) {
            if (narrow && entry.compact) { return; }
            badge.classList.toggle("kg-narrow", narrow);
            var found = search(badge.offsetWidth, badge.offsetHeight, narrow ? 150 : 0);
            if (!chosen || found.cost < chosen.found.cost) {
              chosen = { found: found, narrow: narrow, w: badge.offsetWidth, h: badge.offsetHeight };
            }
          });

          badge.classList.toggle("kg-narrow", chosen.narrow);
          w = chosen.w;
          h = chosen.h;
          spot = { x: chosen.found.rect.x, y: chosen.found.rect.y, inside: chosen.found.inside };
        }

        var current = { x: spot.x, y: spot.y, w: w, h: h };
        occupied.push({ x: current.x, y: current.y, w: w, h: h, weight: 5 });
        placed.doc.push(current);

        badge.style.left = current.x + "px";
        badge.style.top = current.y + "px";
        if (!spot.inside) { connect(docLayer, current, box); }
      });
    }

    /* The panel at the top of the page also lists the buttons beside the sidebar. */
    updateSideRows(sideRows);

    /* The badges that hang below the header must not hide the start of the panel, so the panel starts below them. */
    if (legend && legendWrap) {
      var base = legendWrap.getBoundingClientRect().top + scrollY;
      var margin = Math.max(16, Math.ceil(lowestFixed + 12 - base));

      if (legendWrap.style.paddingTop !== margin + "px") { legendWrap.style.paddingTop = margin + "px"; }

      /* The band around the panel has the colour of the section below it, so no differently coloured strip shows. */
      /* The first section after the panel that is really on the page (a hidden warning box or a text for screen readers may come first). */
      var below = legendWrap.nextElementSibling;
      while (below && (below.classList.contains("sr-only") || !(below.getBoundingClientRect().height > 1))) { below = below.nextElementSibling; }
      var tint = below ? window.getComputedStyle(below).backgroundColor : "";
      legendWrap.style.backgroundColor = tint && tint !== "rgba(0, 0, 0, 0)" && tint !== "transparent" ? tint : "";

      /* The panel lines up with the page content below it: same left edge and the same right edge. */
      var wrapBox = legendWrap.getBoundingClientRect();
      var left = Infinity;
      var right = -Infinity;
      if (below) {
        Array.prototype.forEach.call(below.querySelectorAll("h1, h2, h3, p, img, figure, video, table, ul, ol"), function (item) {
          if (item.closest(".sr-only") || item.classList.contains("sr-only") || !isShown(item)) { return; }
          var itemBox = item.getBoundingClientRect();
          /* A title bar as wide as the page says nothing about where the content starts. */
          if (itemBox.width >= wrapBox.width - 2) { return; }
          left = Math.min(left, itemBox.left);
          right = Math.max(right, itemBox.right);
        });
      }

      if (left !== Infinity && right - left > 280) {
        var offset = Math.max(0, Math.min(left - wrapBox.left, wrapBox.width - 280));
        legend.style.marginLeft = offset + "px";
        legend.style.marginRight = "0px";
        legend.style.width = Math.max(280, Math.min(right - left, wrapBox.width - offset, 1200)) + "px";
      } else {
        legend.style.marginLeft = "";
        legend.style.marginRight = "";
        legend.style.width = "";
      }
    }
  }

  /* The list of the buttons beside the sidebar, in the panel at the top of the page (only while they sit beside it). */
  function updateSideRows(entries) {
    if (!legend) { return; }

    var signature = entries.map(function (entry) { return entry.label + "|" + JSON.stringify(entry.keys); }).join(";");
    var current = legend.querySelector(".kg-legend-sidebar");

    if (current && current.getAttribute("data-signature") === signature) { return; }
    if (current) { current.parentNode.removeChild(current); }
    if (!entries.length) { return; }

    var group = make("div", "kg-legend-sidebar");
    group.setAttribute("data-signature", signature);
    group.appendChild(make("h3", "kg-legend-sub", "Buttons in the header and the menu"));

    var list = make("ul", "kg-legend-list");
    entries.forEach(function (entry) {
      var item = make("li", "kg-legend-item");
      var keys = make("span", "kg-legend-keys");
      keys.appendChild(buildKeys(entry.keys));
      item.appendChild(keys);
      item.appendChild(make("span", "kg-legend-text", entry.label));
      list.appendChild(item);
    });

    group.appendChild(list);
    legend.appendChild(group);
  }

  function schedule() {
    if (isOn && !frame) { frame = window.requestAnimationFrame(draw); }
  }

  function buildLegend() {
    var box = make("section", "kg-legend");
    box.setAttribute("aria-labelledby", "kgLegendTitle");

    var head = make("div", "kg-legend-head");
    var title = make("h2", "kg-legend-title", "Keyboard Guide");
    title.id = "kgLegendTitle";
    var off = make("button", "kg-legend-off", "Turn off");
    off.type = "button";
    off.addEventListener("click", function () {
      setMode(false);
      var toggle = document.getElementById("keyboardGuideToggle");
      var target = toggle && toggle.getClientRects().length ? toggle : document.getElementById("main-content");
      if (target) { target.focus(); }
    });
    head.appendChild(title);
    head.appendChild(off);
    box.appendChild(head);

    box.appendChild(make("p", "kg-legend-intro", "The keycaps on this page show how to reach each link and button with the keyboard. The sign › means “then” and the sign / means “or”. For example, Tab › Enter means: press Tab until the item is selected, then press Enter."));

    var list = make("ul", "kg-legend-list");
    legendRows.forEach(function (row) {
      var item = make("li", "kg-legend-item");
      var keys = make("span", "kg-legend-keys");
      keys.appendChild(buildKeys(row[0]));
      if (row[1]) {
        keys.appendChild(make("span", "kg-or", "or"));
        keys.appendChild(buildKeys(row[1]));
      }
      item.appendChild(keys);
      item.appendChild(make("span", "kg-legend-text", row[2]));
      list.appendChild(item);
    });
    box.appendChild(list);

    return box;
  }

  function updateToggle() {
    var toggle = document.getElementById("keyboardGuideToggle");
    if (!toggle) { return; }

    toggle.setAttribute("aria-pressed", String(isOn));
    var state = toggle.querySelector(".kg-toggle-state");
    if (state) { state.textContent = isOn ? "On" : "Off"; }
  }

  function setMode(on, persist) {
    isOn = on;
    document.body.classList.toggle(BODY_CLASS, on);
    if (persist !== false) { store(on); }
    updateToggle();

    if (on) {
      docLayer = docLayer || make("div", "kg-layer kg-layer-doc");
      fixedLayer = fixedLayer || make("div", "kg-layer kg-layer-fixed");
      docLayer.setAttribute("aria-hidden", "true");
      fixedLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(docLayer);
      document.body.appendChild(fixedLayer);

      var main = document.getElementById("main-content");
      if (!isPhotoPage && main && !legend) {
        legend = buildLegend();
        legendWrap = make("div", "kg-legend-wrap");
        legendWrap.appendChild(legend);
        main.insertBefore(legendWrap, main.firstChild);
      }

      schedule();
    } else {
      [docLayer, fixedLayer, legendWrap].forEach(function (element) {
        if (element && element.parentNode) { element.parentNode.removeChild(element); }
      });
      legend = null;
      legendWrap = null;
    }
  }

  function init() {
    var toggle = document.getElementById("keyboardGuideToggle");

    if (toggle) {
      toggle.addEventListener("click", function () {
        setMode(!isOn);

        /* On a phone the menu is a drawer. Close it so the page and its badges can be seen. */
        if (typeof toggleSidebarMenu === "function") { toggleSidebarMenu(false); }
      });
    }

    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("transitionend", schedule, true);
    document.addEventListener("load", schedule, true);

    if (window.ResizeObserver) { new ResizeObserver(schedule).observe(document.body); }

    if (window.MutationObserver) {
      new MutationObserver(function (records) {
        var relevant = records.some(function (record) {
          var node = record.target;
          var element = node.nodeType === 1 ? node : node.parentElement;
          return element && !element.closest(".kg-layer, .kg-legend-wrap");
        });
        if (relevant) { schedule(); }
      }).observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class", "hidden", "inert", "aria-hidden"]
      });
    }

    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(schedule); }

    if (readStored()) { setMode(true, false); } else { updateToggle(); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
