---
layout: default
title: About Us
---

<div class="main-container page-padding">
  <h1 class="page-title">About Us</h1>

  <!-- Navigation Tabs -->
  <div class="tab-navigation">
    <button class="tab-btn active" data-tab="visitor">Visitor Information & Accessibility</button>
    <button class="tab-btn" data-tab="curation">Curation & Acknowledgement</button>
  </div>

  <!-- Tab Content: Visitor Information -->
  <div id="tab-visitor" class="tab-content active">
    <h2>Visitor Information and Accessibility</h2>
    <h3>Visitor Information</h3>
    <h4>For Website</h4>
    <table class="info-table">
      <tr>
        <th>Compatibility</th>
        <td>WebGL-enabled browsers (Chrome, Firefox, Safari, Edge)</td>
      </tr>
      <tr>
        <th>Accessibility Features</th>
        <td>Auslan videos, text scaling, transcript support</td>
      </tr>
    </table>
  </div>

  <!-- Tab Content: Curation & Acknowledgements -->
  <div id="tab-curation" class="tab-content">
    <h2>Curation & Acknowledgement</h2>
    <div class="author-bio-section">
      <h3>Author's Bio</h3>
      <p>Content regarding curation details and author biography...</p>
    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    function switchTab(targetTab) {
      tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === targetTab));
      contents.forEach(content => content.classList.toggle('active', content.id === `tab-${targetTab}`));
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Check for hash link from Author's Bio button
    if (window.location.hash === '#curation') {
      switchTab('curation');
    }
  });
</script>
