---
layout: default
title: About Us
---

<div class="about-page-container">
  <h1 class="page-title">About Us</h1>

  <!-- Navigation Buttons -->
  <div class="tab-navigation">
    <button class="tab-btn active" onclick="switchTab('visitor-tab', this)">Visitor Information and Accessibility</button>
    <button class="tab-btn" onclick="switchTab('curation-tab', this)">Curation and Acknowledgement</button>
  </div>

  <!-- Quote Banner -->
  <div id="quote-banner" class="quote-banner" style="display: none;">
    <h2>" Quote here if needed "</h2>
    <p>- John Doe, Someone of Business Enterprise</p>
  </div>

  <!-- Visitor Information and Accessibility -->
  <div id="visitor-tab" class="tab-content active">
    <h2 class="main-tab-title">Visitor Information and Accessibility</h2>

    <section class="content-section">
      <h3 class="gold-heading">Visitor Information</h3>

      <!-- For Website Subsection -->
      <div class="sub-block">
        <h4 class="sub-title">For Website</h4>
        <table class="info-table">
          <tr>
            <td class="label-col">Location</td>
            <td class="value-col"><a href="https://www.google.com" class="inline-link">https://www.google.com</a></td>
          </tr>
          <tr>
            <td class="label-col">Lorem Ipsum</td>
            <td class="value-col">Lorem Ipsum</td>
          </tr>
        </table>
        <p class="section-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula. Nulla ante felis, ultrices sit amet magna nec, efficitur porta purus. Nulla posuere posuere tellus, dictum dictum diam pharetra ac.</p>
      </div>

      <!-- On Campus Subsection -->
      <div class="sub-block">
        <h4 class="sub-title">On Campus</h4>
        <table class="info-table">
          <tr>
            <td class="label-col">Location</td>
            <td class="value-col">Wallys Walk 999, Somewhere, Building B201</td>
          </tr>
          <tr>
            <td class="label-col" rowspan="6">Opening hours</td>
            <td class="value-col hours-row"><span>Monday</span><span>9:00 AM - 5:00 PM</span></td>
          </tr>
          <tr><td class="value-col hours-row"><span>Tuesday</span><span>9:00 AM - 5:00 PM</span></td></tr>
          <tr><td class="value-col hours-row"><span>Wednesday</span><span>9:00 AM - 5:00 PM</span></td></tr>
          <tr><td class="value-col hours-row"><span>Thursday</span><span>9:00 AM - 5:00 PM</span></td></tr>
          <tr><td class="value-col hours-row"><span>Friday</span><span>9:00 AM - 5:00 PM</span></td></tr>
          <tr><td class="value-col hours-row"><span>Saturday</span><span>9:00 AM - 5:00 PM</span></td></tr>
        </table>
        <p class="section-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula. Nulla ante felis, ultrices sit amet magna nec, efficitur porta purus. Nulla posuere posuere tellus, dictum dictum diam pharetra ac.</p>
      </div>
    </section>

  </div>

  <!-- Curation and Acknowledgement -->
  <div id="curation-tab" class="tab-content">
    <h2 class="main-tab-title">Curation and acknowledgements</h2>

    <!-- Curation Section -->
    <section class="content-section">
      <h3 class="gold-heading">Curation</h3>
      <p class="author-sub">by Hannah Vogel</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula.</p>

      <table class="info-table">
        <tr>
          <td class="label-col">Credentials</td>
          <td class="value-col">Lorem Ipsum</td>
        </tr>
        <tr>
          <td class="label-col" rowspan="2">Contact</td>
          <td class="value-col">Email: abcde12345@gmail.com</td>
        </tr>
        <tr>
          <td class="value-col">Social: <a href="#" aria-label="LinkedIn" class="inline-link"><i class="fab fa-linkedin"></i></a></td>
        </tr>
      </table>
    </section>

    <!-- Funding Section -->
    <section class="content-section">
      <h3 class="gold-heading">Funding</h3>
      <div class="sub-block">
        <h4 class="sub-title">Lorem ipsum dolor sit amet</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula. Nulla ante felis, ultrices sit amet magna nec, efficitur porta purus.</p>
      </div>
      <div class="sub-block">
        <h4 class="sub-title">Lorem ipsum dolor sit amet</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula. Nulla ante felis, ultrices sit amet magna nec, efficitur porta purus.</p>
      </div>
    </section>

    <!-- Acknowledgements Section -->
    <section class="content-section">
      <h3 class="gold-heading">Acknowledgements</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget justo ac tortor maximus scelerisque. Cras ornare, ex et tempus sodales, risus libero ullamcorper turpis, ac laoreet turpis est sed ligula. Nulla ante felis, ultrices sit amet magna nec, efficitur porta purus.</p>
    </section>

    <!-- Website Development Team Section -->

<section class="content-section">
  <h3 class="gold-heading">Website Development Team</h3>

  <!-- Interactive Avatars -->
  <div class="team-avatars" id="avatar-container">
    <div class="avatar active" onclick="selectMember(0, this)">AB</div>
    <div class="avatar" onclick="selectMember(1, this)">CD</div>
    <div class="avatar" onclick="selectMember(2, this)">EF</div>
    <div class="avatar" onclick="selectMember(3, this)">GH</div>
    <div class="avatar" onclick="selectMember(4, this)">IJ</div>
    <div class="avatar" onclick="selectMember(5, this)">KL</div>
  </div>

  <!-- Dynamic Pointer Line -->
  <div class="gold-divider-line">
    <div class="pointer-arrow" id="pointer-arrow"></div>
  </div>

  <!-- Member Information Table -->
  <table class="info-table">
    <tr>
      <td class="label-col">Name</td>
      <td class="value-col" id="member-name">ABCDEF GHIJKL</td>
    </tr>
    <tr>
      <td class="label-col">Macquarie University</td>
      <td class="value-col" id="member-degree">Bachelor of Information Technology<br>Software Technology</td>
    </tr>
    <tr>
      <td class="label-col">Role</td>
      <td class="value-col" id="member-role">Lorem Ipsum</td>
    </tr>
    <tr>
      <td class="label-col" rowspan="2">Contact</td>
      <td class="value-col" id="member-email">Email: abcde12345@gmail.com</td>
    </tr>
    <tr>
      <td class="value-col" id="member-social">Social: <a href="#" aria-label="LinkedIn" id="member-link" class="inline-link"><i class="fab fa-linkedin"></i></a></td>
    </tr>
  </table>
</section>

<script>
  // Team Data Store
  const teamMembers = [
    {
      name: "ABCDEF GHIJKL",
      degree: "Bachelor of Information Technology<br>Software Technology",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    },
    {
      name: "MNOPQ RSTUVW",
      degree: "Bachelor of Cyber Security<br>Information Systems",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    },
    {
      name: "AaBbCc DeEeFf",
      degree: "Bachelor of Game Design<br>Interactive Media",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    },
    {
      name: "GgHhIi JjKkLl",
      degree: "Bachelor of Information Technology<br>Data Science",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    },
    {
      name: "MmNnOo PpQqRr",
      degree: "Bachelor of Computer Science<br>Software Engineering",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    },
    {
      name: "SsTtUu VvWwXxYyZz",
      degree: "Bachelor of Information Technology<br>Web Design",
      role: "Lorem Ipsum",
      email: "Email: abcde12345@gmail.com",
      link: "#"
    }
  ];

  // Tab switching between top level tabs
  function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    if (btn) {
      btn.classList.add('active');
    } else {
      // Find and activate matching button if triggered by URL hash
      const matchingBtn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
      if (matchingBtn) matchingBtn.classList.add('active');
    }

    const banner = document.getElementById('quote-banner');
    if (banner) {
      banner.style.display = (tabId === 'curation-tab') ? 'block' : 'none';
    }
  }

  // Check URL hash on page load and open the corresponding tab
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#curation-tab') {
      switchTab('curation-tab');
    }
  });



  // Member selection logic
  function selectMember(index, element) {
    // 1. Update active styling on avatar circles
    document.querySelectorAll('#avatar-container .avatar').forEach(avatar => {
      avatar.classList.remove('active');
    });
    element.classList.add('active');

    // 2. Reposition the triangle pointer beneath selected circle
    const avatarWidth = element.offsetWidth;
    const avatarOffsetLeft = element.offsetLeft;
    const pointer = document.getElementById('pointer-arrow');
    pointer.style.left = `${avatarOffsetLeft + (avatarWidth / 2) - 8}px`;

    // 3. Populate member details into the table
    const data = teamMembers[index];
    document.getElementById('member-name').innerHTML = data.name;
    document.getElementById('member-degree').innerHTML = data.degree;
    document.getElementById('member-role').innerHTML = data.role;
    document.getElementById('member-email').innerHTML = data.email;
    document.getElementById('member-link').href = data.link;
  }
</script>
