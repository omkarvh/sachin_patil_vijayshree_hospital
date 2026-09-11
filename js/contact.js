/* ==========================================================
   contact.js — renders the Contact page from content.js
   Form has no backend (static site) — submitting builds a
   WhatsApp message so the request reaches the clinic instantly.
   ========================================================== */
function renderPage(){
  const C = CONTENT.contact;

  document.getElementById('pageHeroRoot').innerHTML = `
    <div class="hero-orb o1"></div>
    <div class="hero-orb o2"></div>
    <div class="container">
      <div class="breadcrumb"><a href="index.html">Home</a> / <span>Contact</span></div>
      <h1>${C.hero.title}</h1>
      <p>${C.hero.subtitle}</p>
    </div>
  `;

  document.getElementById('quickActionsRoot').innerHTML = `
    <div class="container">
      <div class="contact-actions-grid stagger">
        <div class="contact-action-card reveal">
          <div class="cac-icon whatsapp">${icon('whatsapp')}</div>
          <h3>${C.quickActions.whatsappTitle}</h3>
          <p>${C.quickActions.whatsappDesc}</p>
          <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">Chat Now</a>
        </div>
        <div class="contact-action-card reveal">
          <div class="cac-icon call">${icon('phone')}</div>
          <h3>${C.quickActions.callTitle}</h3>
          <p>${C.quickActions.callDesc}</p>
          <a href="${telLink()}" class="btn btn-primary btn-block">${S.phoneDisplay}</a>
        </div>
        <div class="contact-action-card reveal">
          <div class="cac-icon email">${icon('mail')}</div>
          <h3>${C.quickActions.emailTitle}</h3>
          <p>${C.quickActions.emailDesc}</p>
          <a href="${mailLink()}" class="btn btn-dark btn-block">Email Us</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('splitRoot').innerHTML = `
    <div class="container">
      <div class="contact-split">
        <div class="reveal">
          <span class="eyebrow-pill">${C.labels.clinicEyebrow}</span>
          <h2 style="margin-bottom:24px;">${C.labels.clinicTitle}</h2>
          <div class="info-block">
            <div class="info-icon">${icon('map-pin')}</div>
            <div><div class="info-label">Address</div><div class="info-value">${S.address}</div></div>
          </div>
          <div class="info-block">
            <div class="info-icon">${icon('clock')}</div>
            <div>
              <div class="info-label">Working Hours</div>
              ${S.workingHours.map(w => `<div class="info-value">${w.day}: ${w.time}</div>`).join('')}
            </div>
          </div>
          <div class="info-block">
            <div class="info-icon">${icon('phone')}</div>
            <div><div class="info-label">Phone</div><div class="info-value">${S.phoneDisplay}</div></div>
          </div>
          <div class="info-block">
            <div class="info-icon">${icon('mail')}</div>
            <div><div class="info-label">Email</div><div class="info-value">${S.email}</div></div>
          </div>
          <div class="map-frame reveal">
            <iframe src="${S.mapEmbedUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Clinic location"></iframe>
          </div>
        </div>

        <div class="form-card reveal">
          <h2 style="font-size:22px;">${C.formTitle}</h2>
          <p style="margin-bottom:24px;">${C.formSubtitle}</p>
          <form id="contactForm">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="cf-name" placeholder="Your name" required>
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="cf-phone" placeholder="Your phone number" required>
              </div>
            </div>
            <div class="form-group">
              <label>Reason for Visit</label>
              <select id="cf-reason">
                <option>New Patient Consultation</option>
                <option>Follow-up Visit</option>
                <option>Report Review</option>
                <option>General Query</option>
              </select>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea id="cf-message" placeholder="Tell us briefly what you need..."></textarea>
            </div>
            <button type="submit" class="btn btn-whatsapp btn-block">${icon('whatsapp')} Send via WhatsApp</button>
            <p class="form-note">Clicking send opens WhatsApp with your details pre-filled — nothing is stored on this site.</p>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const reason = document.getElementById('cf-reason').value;
    const message = document.getElementById('cf-message').value.trim();
    const text = `Hi Dr. ${S.doctorName.replace('Dr. ','')}, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nReason: ${reason}\nMessage: ${message || '-'}`;
    window.open(waLink(text), '_blank');
  });

  document.getElementById('faqRoot').innerHTML = `
    <div class="container" style="max-width:800px;">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${C.labels.faqEyebrow}</span>
        <h2>${C.faq.title}</h2>
      </div>
      <div class="reveal">
        ${C.faq.items.map((f,i) => `
          <div class="faq-item ${i===0?'open':''}">
            <div class="faq-q"><span>${f.q}</span>${icon('chevron-down','chev')}</div>
            <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
          </div>`).join('')}
      </div>
    </div>
  `;
}
