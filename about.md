---
layout: page
title: About Us
permalink: /about/
---

<div class="about-container" x-data="{ tab: 'visitor' }">
  <div class="about-tabs">
    <button :class="{ 'active': tab === 'visitor' }" @click="tab = 'visitor'" class="tab-btn">Visitor Information & Accessibility</button>
    <button :class="{ 'active': tab === 'curation' }" @click="tab = 'curation'" class="tab-btn">Curation & Acknowledgement</button>
  </div>

  <!-- Tab 1: Visitor Information & Accessibility -->
  <div x-show="tab === 'visitor'" class="tab-content">
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
        <td>Auslan videos, text scaling, high-contrast toggle, transcript support</td>
      </tr>
    </table>
    <p>This digital platform is engineered to deliver an inclusive high-resolution experience across desktop, tablet, and mobile devices.</p>

    <h4>On Campus</h4>
    <table class="info-table">
      <tr>
        <th>Location</th>
        <td>Macquarie University History Museum, Arts Precinct</td>
      </tr>
      <tr>
        <th>Opening Hours</th>
        <td>Mon, Tue, Wed, Thu, Fri, Sat | 9:00am - 5:00pm</td>
      </tr>
    </table>
    <p>Physical exhibits are fully accessible via wheelchair ramps and elevators. Guided sensory tours are offered every Tuesday.</p>

  </div>

  <!-- Tab 2: Curation & Acknowledgements -->
  <div x-show="tab === 'curation'" class="tab-content">
    <div class="quote-gradient-box">
      <p class="quote-body">"Every artifact holds a multi-layered narrative waiting to be re-discovered."</p>
      <p class="quote-author">— Hannah Vogel, Lead Researcher</p>
    </div>

    <h2>Curation and Acknowledgements</h2>

    <h3>Curation</h3>
    <h4>By Group 34 Archaeology Team</h4>
    <p>This collection has been curated with emphasis on material analysis, precise photogrammetry, and public engagement.</p>

    <table class="info-table">
      <tr>
        <th>Contact</th>
        <td>Email: contact@archaeologygroup34.org</td>
        <td><a href="#"><i class="fab fa-twitter"></i> Twitter</a></td>
      </tr>
    </table>

    <h3>Funding</h3>
    <h4>Macquarie University Innovation Grant</h4>
    <p>Generously funded by the Faculty of Arts research initiatives support scheme.</p>

    <h4>Digital Humanities Heritage Trust</h4>
    <p>Provided equipment funding for 3D digitization laser scanning and NIRA hosting implementation.</p>

    <h3>Acknowledgements</h3>
    <p>Special thanks to the technical advisors, digital conservators, and student researchers who rendered these models accessible to the public.</p>

    <h3>Website Development Team</h3>
    <div class="team-container" x-data="{ selectedTeam: 0 }">
      <div class="team-circles">
        <button @click="selectedTeam = 0" :class="{ 'active': selectedTeam === 0 }" class="circle-btn">HV</button>
        <button @click="selectedTeam = 1" :class="{ 'active': selectedTeam === 1 }" class="circle-btn">JD</button>
        <button @click="selectedTeam = 2" :class="{ 'active': selectedTeam === 2 }" class="circle-btn">AS</button>
        <button @click="selectedTeam = 3" :class="{ 'active': selectedTeam === 3 }" class="circle-btn">MK</button>
        <button @click="selectedTeam = 4" :class="{ 'active': selectedTeam === 4 }" class="circle-btn">LW</button>
        <button @click="selectedTeam = 5" :class="{ 'active': selectedTeam === 5 }" class="circle-btn">RC</button>
      </div>
      <div class="team-indicator-line">
        <div class="triangle-pointer" :style="'left: ' + (selectedTeam * 16.66 + 8.33) + '%'"></div>
      </div>

      <div class="team-details">
        <table class="info-table">
          <tr><th>Name</th><td>Macquarie University Student Developer</td></tr>
          <tr><th>Role</th><td>3D Modeling & Web Architecture</td></tr>
          <tr><th>Contact</th><td>Email: devteam@macquarie.edu.au | <i class="fab fa-github"></i> GitHub</td></tr>
        </table>
      </div>
    </div>

  </div>
</div>
