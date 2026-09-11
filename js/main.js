/* ==========================================================
   main.js — shared site shell: navbar, footer, floating buttons,
   scroll animations, counters, video modal, FAQ accordion.
   Runs on every page. Page-specific rendering happens in
   home.js / about.js / blogs.js / contact.js
   ========================================================== */

const S = CONTENT.site;

function waLink(message){
  const msg = encodeURIComponent(message || S.whatsappDefaultMessage);
  return `https://wa.me/${S.whatsappNumber}?text=${msg}`;
}
function telLink(){ return `tel:${S.phoneDial}`; }

/* The square logo mark, falling back to the initials tile when no image is set */
function logoMarkHtml(){
  return S.logoMark
    ? `<img src="${S.logoMark}" alt="${S.clinicName}" class="nav-logo-img">`
    : `<div class="nav-logo">${S.logoInitials}</div>`;
}

/* Pulls the video ID out of any YouTube link format (watch?v= / youtu.be / shorts / embed),
   so whoever edits content.js can paste the link straight from the browser. */
function youtubeId(url){
  if(!url) return '';
  const m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : String(url).trim();
}
function mailLink(){ return `mailto:${S.email}`; }

/* ---------------- LOADING SCREEN ---------------- */
function initPreloader(){
  const el = document.getElementById('preloader');
  if(!el) return;
  const P = CONTENT.preloader || {};

  if(P.enabled === false){ el.remove(); return; }

  document.body.classList.add('loading');
  // Use the full logo (which already contains the name) when one is set,
  // otherwise fall back to the initials tile plus the clinic name in text.
  const brand = S.logoFull
    ? `<img src="${S.logoFull}" alt="${S.clinicName}" class="pre-logo-full">`
    : `<div class="pre-logo">${S.logoInitials}</div>
       <div class="pre-name">${S.clinicName}</div>`;

  el.innerHTML = `
    <div class="pre-inner">
      ${brand}
      <div class="pre-tagline">${P.tagline || S.tagline}</div>
      <div class="pre-ecg">
        <svg viewBox="0 0 190 42" aria-hidden="true">
          <path d="M0 21 H44 L52 21 L58 8 L66 34 L73 15 L79 25 L86 21 H110 L117 21 L123 11 L131 31 L137 21 H190"/>
        </svg>
      </div>
      <div class="pre-bar"><span id="preBar"></span></div>
    </div>
  `;

  /* Loading sound. Browsers block audio until the visitor has interacted with the
     site, so play() may be rejected — we swallow that quietly and try again on the
     first click/keypress in case the loader is still on screen. */
  let chime = null;
  const SND = P.sound || {};
  if(SND.enabled && SND.src){
    chime = new Audio(SND.src);
    chime.volume = SND.volume ?? 0.35;
    const tryPlay = () => { const p = chime.play(); if(p) p.catch(() => {}); };
    tryPlay();
    const onGesture = () => { if(!finished) tryPlay(); cleanupGesture(); };
    const cleanupGesture = () => {
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('keydown', onGesture);
    };
    document.addEventListener('pointerdown', onGesture, { once:true });
    document.addEventListener('keydown', onGesture, { once:true });
  }

  const bar = document.getElementById('preBar');
  const started = performance.now();
  const minDuration = P.minDuration ?? 700;
  const maxDuration = P.maxDuration ?? 3000;
  let progress = 0;
  let finished = false;

  // Creep the bar forward so it always feels like it's moving
  const creep = setInterval(() => {
    progress = Math.min(progress + Math.random() * 12, 90);
    bar.style.width = progress + '%';
  }, 180);

  function finish(){
    if(finished) return;
    finished = true;
    clearInterval(creep);
    bar.style.width = '100%';

    const elapsed = performance.now() - started;
    const wait = Math.max(minDuration - elapsed, 0) + 260;
    setTimeout(() => {
      el.classList.add('done');
      document.body.classList.remove('loading');
      setTimeout(() => el.remove(), 700);
    }, wait);
  }

  // Hide once everything has loaded, but never hold the visitor past maxDuration
  if(document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  setTimeout(finish, maxDuration);
}

/* ---------------- NAVBAR ---------------- */
function buildNavbar(){
  const root = document.getElementById('navbar-root');
  if(!root) return;
  const currentPage = document.body.dataset.page;

  const links = CONTENT.nav.map(n => {
    const active = (n.href.replace('.html','') === currentPage) ? 'active' : '';
    return `<a href="${n.href}" class="${active}">${n.label}</a>`;
  }).join('');

  const mobileLinks = CONTENT.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('');

  root.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="nav-brand">
          ${logoMarkHtml()}
          <div class="nav-brand-text">
            <div class="nav-clinic-name on-dark">${S.clinicName}</div>
            <div class="nav-doctor-name on-dark">${S.doctorName}</div>
          </div>
        </a>
        <div class="nav-links">${links}</div>
        <div class="nav-right">
          <a href="${telLink()}" class="nav-call">${icon('phone')} <span>${S.phoneDisplay}</span></a>
          <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${icon('whatsapp')} Book Now</a>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      ${mobileLinks}
      <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-primary">${icon('whatsapp')} Book on WhatsApp</a>
      <a href="${telLink()}" class="btn btn-glass">${icon('phone')} ${S.phoneDisplay}</a>
    </div>
  `;

  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function onScroll(){
    if(window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }));
}

/* ---------------- FOOTER ---------------- */
function buildFooter(){
  const root = document.getElementById('footer-root');
  if(!root) return;
  const F = CONTENT.footer;
  const navLinks = CONTENT.nav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('');

  root.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="footer-brand">
              ${logoMarkHtml()}
              <div>
                <div style="color:#fff;font-weight:700;font-family:'Sora',sans-serif;">${S.clinicName}</div>
                <div style="font-size:12.5px;color:rgba(255,255,255,.55);">${S.doctorName}</div>
              </div>
            </div>
            <p style="font-size:14px;color:rgba(255,255,255,.6);max-width:320px;">${F.about}</p>
            <div class="footer-social">
              <a href="${S.social.instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
              <a href="${S.social.facebookUrl}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
              <a href="${S.social.youtubeUrl}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a>
              <a href="${S.social.linkedinUrl}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>${F.quickLinksTitle}</h4>
            <ul>${navLinks}</ul>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="index.html#services">Insulin Management</a></li>
              <li><a href="index.html#services">Nutrition Therapy</a></li>
              <li><a href="index.html#services">Diabetic Foot Care</a></li>
              <li><a href="index.html#services">Thyroid Care</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>${F.contactTitle}</h4>
            <ul>
              <li><a href="${telLink()}">${S.phoneDisplay}</a></li>
              <li><a href="${mailLink()}">${S.email}</a></li>
              <li><a href="contact.html">${S.address}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">${F.copyright}</div>
      </div>
    </footer>
  `;
}

/* ---------------- FLOATING WHATSAPP + BACK TO TOP ---------------- */
function buildFloatButtons(){
  const root = document.getElementById('float-root');
  if(!root) return;
  root.innerHTML = `
    <a href="${waLink()}" target="_blank" rel="noopener" class="wa-float" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
    <button class="to-top" id="toTopBtn" aria-label="Back to top">${icon('arrow-right', '').replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(-90deg)"')}</button>
  `;
  const btn = document.getElementById('toTopBtn');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 500) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

/* ---------------- SCROLL REVEAL ---------------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal, .reveal-scale');
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------------- COUNTERS ---------------- */
function initCounters(){
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseFloat(e.target.dataset.count);
      const suffix = e.target.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        e.target.textContent = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString('en-IN')) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}

/* ---------------- VIDEO MODAL ---------------- */
function buildVideoModal(){
  const root = document.getElementById('modal-root');
  if(!root) return;
  root.innerHTML = `
    <div class="video-modal" id="videoModal">
      <div class="video-modal-inner" id="videoModalInner"></div>
      <button class="video-modal-close" id="videoModalClose">${icon('x')}</button>
    </div>
  `;
  const modal = document.getElementById('videoModal');
  const inner = document.getElementById('videoModalInner');
  document.getElementById('videoModalClose').addEventListener('click', closeVideoModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeVideoModal(); });

  window.openVideoModal = function(video){
    if(video.type === 'youtube'){
      inner.innerHTML = `<iframe src="https://www.youtube.com/embed/${video.src}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      inner.innerHTML = `<video src="${video.src}" controls autoplay></video>`;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  function closeVideoModal(){
    modal.classList.remove('active');
    inner.innerHTML = '';
    document.body.style.overflow = '';
  }
}

/* ---------------- ARTICLE POPUP ---------------- */
function buildArticleModal(){
  const root = document.getElementById('article-modal-root');
  if(!root) return;
  root.innerHTML = `
    <div class="article-modal" id="articleModal">
      <div class="article-panel" id="articlePanel">
        <button class="article-close" id="articleClose" aria-label="Close article">${icon('x')}</button>
        <div class="article-scroll" id="articleScroll"></div>
      </div>
    </div>
  `;
  const modal = document.getElementById('articleModal');
  const scroll = document.getElementById('articleScroll');

  function blockHtml(b){
    if(b.type === 'heading') return `<h3>${b.text}</h3>`;
    if(b.type === 'list') return `<ul class="article-list">${b.items.map(i => `<li>${icon('check')}<span>${i}</span></li>`).join('')}</ul>`;
    if(b.type === 'quote') return `<blockquote class="article-quote">${b.text}</blockquote>`;
    return `<p>${b.text}</p>`;
  }

  window.openArticleModal = function(post){
    const M = CONTENT.blogs.articleModal;
    const body = (post.content || []).map(blockHtml).join('');
    scroll.innerHTML = `
      <div class="article-cover">
        <img src="${post.image}" alt="${post.title}">
        <span class="blog-cat">${post.category}</span>
      </div>
      <div class="article-body">
        <div class="article-meta">
          <span>${post.date}</span><span>•</span><span>${post.readTime}</span>
        </div>
        <h2>${post.title}</h2>
        <div class="article-author">
          <div class="testimonial-avatar">${S.doctorName.replace('Dr. ','').split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div class="article-author-name">${S.doctorName}</div>
            <div class="article-author-cred">${S.credentials}</div>
          </div>
        </div>
        ${body || `<p>${post.excerpt}</p>`}
        <div class="article-disclaimer">${M.disclaimer}</div>
        <div class="article-cta">
          <p>${M.ctaText}</p>
          <a href="${waLink('Hi, I just read your article: ' + post.title)}" target="_blank" rel="noopener" class="btn btn-whatsapp">${icon('whatsapp')} ${M.ctaBtn}</a>
        </div>
      </div>
    `;
    scroll.scrollTop = 0;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function close(){
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('articleClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if(e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('active')) close(); });
}

/* Opens the right article when any blog card is clicked (works after filtering too) */
function initBlogCardClicks(){
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-post-index]');
    if(!card) return;
    e.preventDefault();
    const post = CONTENT.blogs.posts[parseInt(card.dataset.postIndex, 10)];
    if(post) openArticleModal(post);
  });
}

/* ---------------- FAQ ACCORDION ---------------- */
function initFaqAccordion(){
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  buildNavbar();
  buildFooter();
  buildFloatButtons();
  buildVideoModal();
  buildArticleModal();
  initBlogCardClicks();

  if(typeof renderPage === 'function') renderPage();

  initReveal();
  initCounters();
  initFaqAccordion();
});
