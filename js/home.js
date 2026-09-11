/* ==========================================================
   home.js — renders the Home page from content.js
   ========================================================== */
function renderPage(){
  const H = CONTENT.home;

  /* ----- HERO (silent looping background video + ticker strip at its base) ----- */
  const bg = H.hero.backgroundVideo;
  const marqueeItems = H.marquee.map(m => `<span class="marquee-item"><span class="dot"></span>${m}</span>`).join('');
  const headline = H.hero.titleLines.map(line => {
    const html = line.replace(/\{\{(.+?)\}\}/g, '<span class="gradient-text">$1</span>');
    return `<span class="line"><span>${html}</span></span>`;
  }).join('');

  // Background is either a real YouTube clip or a local mp4 — set by `type` in content.js
  let heroBg;
  if(bg.type === 'youtube'){
    const id = youtubeId(bg.youtubeId);
    const params = `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1` +
                   `&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&start=${bg.startAt || 0}`;
    const zoom = bg.zoom || 1;
    const offsetY = bg.offsetY || 0;
    heroBg = `
      <div class="hero-yt-wrap" style="background-image:url('${bg.poster}')">
        <iframe src="https://www.youtube.com/embed/${id}?${params}"
                style="transform:translate(-50%,calc(-50% + ${offsetY}%)) scale(${zoom})"
                title="Clinic background video" frameborder="0"
                allow="autoplay; encrypted-media" tabindex="-1" aria-hidden="true"></iframe>
      </div>`;
  } else {
    heroBg = `
      <video class="hero-video-bg" autoplay muted loop playsinline preload="auto" poster="${bg.poster}">
        <source src="${bg.src}" type="video/mp4">
      </video>`;
  }

  document.getElementById('heroRoot').innerHTML = `
    ${heroBg}
    <div class="hero-overlay"></div>
    <div class="hero-noise"></div>
    <div class="hero-orb o1"></div>
    <div class="hero-orb o2"></div>

    <div class="container">
      <div class="hero-inner">
        <div class="hero-badge"><span class="live-dot"></span> ${H.hero.eyebrow}</div>
        <h1>${headline}</h1>
        <p class="lead">${H.hero.subtitle}</p>
        <div class="hero-actions">
          <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-primary">${icon('whatsapp')} ${H.hero.primaryBtn}</a>
          <button class="btn btn-glass" id="heroPlayBtn">${icon('play')} ${H.hero.secondaryBtn}</button>
        </div>
        <div class="hero-trust">
          ${H.hero.trustItems.map(t => `<div class="trust-item">${icon('check-circle')}<span>${t}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="hero-videochip">
      <span class="bars"><i></i><i></i><i></i><i></i></span> ${H.labels.videoChip}
    </div>
    <div class="scroll-cue"><span>${H.labels.scrollCue}</span><span class="rail"></span></div>

    <div class="marquee hero-marquee">
      <div class="marquee-track">${marqueeItems}${marqueeItems}</div>
    </div>
  `;
  document.getElementById('heroPlayBtn').addEventListener('click', () => openVideoModal(H.hero.video));

  /* ----- STATS ----- */
  document.getElementById('statsRoot').innerHTML = `
    <div class="container"><div class="stats-grid">
      ${H.stats.map(s => `
        <div class="stat-item">
          <div class="stat-number" data-count="${s.number}" data-suffix="${s.suffix}">0${s.suffix}</div>
          <div class="stat-label">${s.label}</div>
        </div>`).join('')}
    </div></div>
  `;

  /* ----- HIGHLIGHTS ----- */
  document.getElementById('highlightsRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${H.labels.highlightsEyebrow}</span>
        <h2>${H.highlights.title}</h2>
        <p>${H.highlights.subtitle}</p>
      </div>
      <div class="grid-4 stagger">
        ${H.highlights.items.map((i, idx) => `
          <div class="feature-card reveal">
            <div class="feature-icon ${idx % 2 ? 'violet' : ''}">${icon(i.icon)}</div>
            <h3>${i.title}</h3>
            <p>${i.desc}</p>
          </div>`).join('')}
      </div>
    </div>
  `;

  /* ----- SERVICES ----- */
  document.getElementById('servicesRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${H.labels.servicesEyebrow}</span>
        <h2>${H.services.title}</h2>
        <p>${H.services.subtitle}</p>
      </div>
      <div class="grid-3 stagger">
        ${H.services.items.map(i => `
          <div class="service-card reveal">
            <div class="service-icon">${icon(i.icon)}</div>
            <div>
              <h3>${i.title}</h3>
              <p>${i.desc}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;

  /* ----- TESTIMONIALS (section hides itself until real reviews are added) ----- */
  const tRoot = document.getElementById('testimonialsRoot');
  if(!H.testimonials.items.length){
    tRoot.style.display = 'none';
  } else {
  tRoot.innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${H.labels.testimonialsEyebrow}</span>
        <h2>${H.testimonials.title}</h2>
      </div>
      <div class="testimonial-track reveal">
        ${H.testimonials.items.map(t => `
          <div class="testimonial-card">
            <div class="quote-mark">"</div>
            <div class="stars">${icon('star').repeat(t.rating)}</div>
            <p>"${t.text}"</p>
            <div class="testimonial-person">
              <div class="testimonial-avatar">${t.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <div class="testimonial-name">${t.name}</div>
                <div class="testimonial-role">${t.role}</div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
  }

  /* ----- LATEST BLOGS (newest posts from blogs.posts) ----- */
  const LB = H.latestBlogs;
  const latest = CONTENT.blogs.posts.slice(0, LB.count);
  document.getElementById('latestBlogsRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${H.labels.blogsEyebrow}</span>
        <h2>${LB.title}</h2>
        <p>${LB.subtitle}</p>
      </div>
      <div class="grid-3 stagger">
        ${latest.map((p, i) => `
          <div class="blog-card reveal" data-post-index="${i}">
            <div class="blog-thumb">
              <img src="${p.image}" alt="${p.title}" loading="lazy">
              <span class="blog-cat">${p.category}</span>
            </div>
            <div class="blog-body">
              <div class="blog-meta"><span>${p.date}</span><span>•</span><span>${p.readTime}</span></div>
              <h3>${p.title}</h3>
              <p>${p.excerpt}</p>
              <span class="blog-readmore">${H.labels.readMore} ${icon('arrow-right')}</span>
            </div>
          </div>`).join('')}
      </div>
      <div class="section-foot reveal">
        <a href="blogs.html" class="btn btn-dark">${LB.viewAllBtn} ${icon('arrow-right')}</a>
      </div>
    </div>
  `;

  /* ----- SOCIAL (Instagram + YouTube teaser → Blogs page) ----- */
  const SO = H.social;
  const ytPreview = CONTENT.blogs.youtubeVideos.slice(0, 2);
  const reelCount = CONTENT.blogs.instagramVideos.length;

  document.getElementById('socialRoot').innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow-pill">${SO.eyebrow}</span>
        <h2>${SO.title}</h2>
        <p>${SO.subtitle}</p>
      </div>
      <div class="grid-2 stagger">

        <a href="blogs.html#instagramRoot" class="social-card social-ig reveal">
          <div class="social-card-top">
            <span class="social-badge ig">${icon('instagram')}</span>
            <div>
              <h3>${SO.instagram.title}</h3>
              <span class="social-handle">${S.social.instagramHandle}</span>
            </div>
          </div>
          <p>${SO.instagram.desc}</p>
          <div class="social-reels">
            ${CONTENT.blogs.instagramVideos.slice(0, 4).map(v => `
              <span class="reel-tile">
                ${v.thumb ? `<img src="${v.thumb}" alt="${v.caption || 'Instagram reel'}" loading="lazy" onerror="this.remove()">` : ''}
                <span class="reel-play">${icon('play')}</span>
              </span>`).join('')}
            ${reelCount > 4 ? `<span class="reel-tile more">+${reelCount - 4}</span>` : ''}
          </div>
          <span class="social-btn">${SO.instagram.btn} ${icon('arrow-right')}</span>
        </a>

        <a href="blogs.html#youtubeRoot" class="social-card social-yt reveal">
          <div class="social-card-top">
            <span class="social-badge yt">${icon('youtube')}</span>
            <div>
              <h3>${SO.youtube.title}</h3>
              <span class="social-handle">${CONTENT.blogs.youtubeVideos.length} videos</span>
            </div>
          </div>
          <p>${SO.youtube.desc}</p>
          <div class="social-thumbs">
            ${ytPreview.map(v => `
              <span class="social-thumb">
                <img src="https://i.ytimg.com/vi/${youtubeId(v.url)}/hqdefault.jpg" alt="${v.title}" loading="lazy">
                <span class="thumb-play">${icon('play')}</span>
              </span>`).join('')}
          </div>
          <span class="social-btn">${SO.youtube.btn} ${icon('arrow-right')}</span>
        </a>

      </div>
    </div>
  `;

  /* ----- CTA ----- */
  document.getElementById('ctaRoot').innerHTML = `
    <div class="cta-band reveal-scale">
      <h2>${H.cta.title}</h2>
      <p>${H.cta.subtitle}</p>
      <div class="cta-actions">
        <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${icon('whatsapp')} ${H.cta.whatsappBtn}</a>
        <a href="${telLink()}" class="btn btn-glass">${icon('phone')} ${H.cta.callBtn}</a>
      </div>
    </div>
  `;
}
