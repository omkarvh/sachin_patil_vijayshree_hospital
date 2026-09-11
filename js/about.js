/* ==========================================================
   about.js — renders the About page from content.js
   ========================================================== */
function renderPage(){
  const A = CONTENT.about;

  document.getElementById('pageHeroRoot').innerHTML = `
    <div class="hero-orb o1"></div>
    <div class="hero-orb o2"></div>
    <div class="container">
      <div class="breadcrumb"><a href="index.html">Home</a> / <span>About</span></div>
      <h1>${A.hero.title}</h1>
      <p>${A.hero.subtitle}</p>
    </div>
  `;

  document.getElementById('bioRoot').innerHTML = `
    <div class="container">
      <div class="about-grid">
        <div class="about-portrait reveal-scale">
          <img src="${A.hero.image}" alt="${S.doctorName}" onerror="this.src='https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop'">
          <div class="about-badge">
            <div class="name">${S.doctorName}</div>
            <div class="cred">${S.credentials}</div>
          </div>
        </div>
        <div class="reveal">
          <span class="eyebrow-pill">${A.labels.bioEyebrow}</span>
          <h2>${A.labels.bioTitle}</h2>
          ${A.bio.map(p => `<p>${p}</p>`).join('')}
          <ul class="credential-list">
            ${A.credentialsList.map(c => `<li>${icon('check-circle')} <span>${c}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById('achieveRoot').innerHTML = `
    <div class="container">
      <div class="achieve-grid stagger">
        ${A.achievements.map(a => `
          <div class="achieve-card reveal">
            <div class="achieve-number">${a.number}</div>
            <div class="achieve-label">${a.label}</div>
          </div>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('specRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${A.labels.specEyebrow}</span>
        <h2>${A.labels.specTitle}</h2>
      </div>
      <div class="reveal" style="text-align:center;">
        ${A.specializations.map(s => `<span class="tag-pill">${s}</span>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('timelineRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${A.labels.timelineEyebrow}</span>
        <h2>${A.labels.timelineTitle}</h2>
      </div>
      <div class="timeline reveal">
        ${A.timeline.map(t => `
          <div class="timeline-item">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
          </div>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('philosophyRoot').innerHTML = `
    <div class="container">
      <div class="philosophy-block reveal-scale">
        <div>
          <span class="eyebrow-pill" >${A.philosophy.title}</span>
          <blockquote>${A.philosophy.quote}</blockquote>
        </div>
        <ul class="philosophy-points">
          ${A.philosophy.points.map(p => `<li>${icon('check')} <span>${p}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  document.getElementById('aboutCtaRoot').innerHTML = `
    <div class="cta-band reveal-scale">
      <h2>${A.labels.ctaTitle}</h2>
      <p>${A.labels.ctaSubtitle}</p>
      <div class="cta-actions">
        <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${icon('whatsapp')} ${A.labels.ctaWhatsappBtn}</a>
        <a href="${telLink()}" class="btn btn-glass">${icon('phone')} ${A.labels.ctaCallBtn} ${S.phoneDisplay}</a>
      </div>
    </div>
  `;
}
