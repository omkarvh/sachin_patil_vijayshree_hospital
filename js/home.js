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
  const usingYouTube = bg.type === 'youtube';

  if(usingYouTube){
    /* The poster image is shown first and the video is faded in only once it is
       genuinely PLAYING. Without that, YouTube briefly paints its own player
       chrome (the big play button and control bar) while the embed boots —
       `controls=0` does not suppress that opening flash. */
    const zoom = bg.zoom || 1;
    const offsetY = bg.offsetY || 0;
    heroBg = `
      <div class="hero-yt-wrap" id="heroYtWrap" style="background-image:url('${bg.poster}')">
        <div class="hero-yt-stage" style="transform:translate(-50%,calc(-50% + ${offsetY}%)) scale(${zoom})">
          <div id="heroYtPlayer"></div>
        </div>
        <div class="hero-yt-shield"></div>
      </div>`;
  } else {
    /* disablepictureinpicture + controlsList stop the browser offering its own
       picture-in-picture and media buttons over what is only a backdrop. */
    heroBg = `
      <video class="hero-video-bg" autoplay muted loop playsinline preload="auto"
             disablepictureinpicture
             controlslist="nodownload noplaybackrate nofullscreen noremoteplayback"
             poster="${bg.poster}">
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

  if(usingYouTube) initHeroYouTube(youtubeId(bg.youtubeId), bg.startAt || 0);

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

  /* ----- SHORT DOCTOR INTRO (links through to the full About page) ----- */
  const DI = H.doctorIntro;
  const diRoot = document.getElementById('doctorIntroRoot');
  if(diRoot){
    if(!DI || !(DI.paragraphs || []).length){
      diRoot.style.display = 'none';           // nothing written yet — hide it
    } else {
      diRoot.innerHTML = `
        <div class="container">
          <div class="doc-intro">
            <div class="doc-intro-media reveal-scale">
              <img src="${DI.image || ''}" alt="${DI.title || S.doctorName}" loading="lazy"
                   onerror="this.closest('.doc-intro-media').classList.add('no-img')">
              <div class="doc-intro-badge">
                <div class="name">${DI.title || S.doctorName}</div>
                <div class="cred">${DI.subtitle || S.credentials}</div>
              </div>
            </div>
            <div class="doc-intro-body reveal">
              <span class="eyebrow-pill">${DI.eyebrow || 'Meet Your Doctor'}</span>
              <h2>${DI.title || S.doctorName}</h2>
              <p class="doc-intro-cred">${DI.subtitle || S.credentials}</p>
              ${DI.paragraphs.map(t => `<p>${t}</p>`).join('')}
              ${(DI.points || []).length ? `
                <ul class="doc-intro-points">
                  ${DI.points.map(pt => `<li>${icon('check-circle')}<span>${pt}</span></li>`).join('')}
                </ul>` : ''}
              <a href="about.html" class="btn btn-dark doc-intro-btn">
                ${DI.btn || 'Read More'} ${icon('arrow-right')}
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

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

/* ==========================================================
   HERO YOUTUBE BACKGROUND
   ----------------------------------------------------------
   A raw YouTube embed flashes its own player UI — big play
   button, control bar, title — for a moment while it starts,
   and `controls=0` does not prevent that opening frame.

   So the video is held invisible behind the poster image and
   faded in only once the player reports it is actually PLAYING.
   The clip is muted and looping: it is a backdrop, never a
   player the visitor interacts with.
   ========================================================== */
function initHeroYouTube(videoId, startAt){
  const wrap = document.getElementById('heroYtWrap');
  if(!wrap || !videoId) return;

  /* If the clip can't play — private, deleted, or embedding turned off by its
     owner — YouTube renders its own "This video is unavailable" screen, complete
     with player controls. That must never appear on the clinic's front page, so
     a failed video stays hidden and the visitor simply keeps the poster image. */
  let failed = false;

  // Safety net for a slow (but working) start: reveal anyway rather than
  // leaving the visitor on a still image forever.
  const failSafe = setTimeout(() => { if(!failed) wrap.classList.add('ready'); }, 6000);

  const reveal = () => {
    if(failed) return;
    clearTimeout(failSafe);
    wrap.classList.add('ready');
  };
  const giveUp = (why) => {
    failed = true;
    clearTimeout(failSafe);
    wrap.classList.remove('ready');
    console.warn('[hero] background video unavailable — showing the poster image instead.', why);
  };

  function build(){
    new YT.Player('heroYtPlayer', {
      videoId,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: videoId,
        playsinline: 1, modestbranding: 1, rel: 0, iv_load_policy: 3,
        disablekb: 1, fs: 0, start: startAt
      },
      events: {
        onReady(e){
          e.target.mute();          // required for autoplay to be allowed
          e.target.playVideo();
        },
        onStateChange(e){
          if(e.data === YT.PlayerState.PLAYING){
            /* Playback has begun, but YouTube paints its control overlay over
               the opening seconds and only fades it once it decides the viewer
               is idle. Waiting that out before fading in means the visitor
               never sees a play button or scrub bar on the banner.
               (A local video file avoids all of this — see the README.) */
            setTimeout(reveal, 2600);
          }
          // A looping single video ends rather than loops on some browsers.
          if(e.data === YT.PlayerState.ENDED) e.target.playVideo();
        },
        onError(e){ giveUp('YouTube error code ' + e.data); }
      }
    });
  }

  if(window.YT && window.YT.Player) return build();

  // The API calls this global once it has loaded.
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function(){
    if(typeof prev === 'function') prev();
    build();
  };

  if(!document.getElementById('yt-iframe-api')){
    const s = document.createElement('script');
    s.id = 'yt-iframe-api';
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => giveUp('YouTube API script blocked');
    document.head.appendChild(s);
  }
}
