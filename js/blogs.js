/* ==========================================================
   blogs.js — renders the Blogs page: articles + live Instagram
   video embeds (official Instagram oEmbed, no API key needed)
   ========================================================== */
function renderPage(){
  const B = CONTENT.blogs;

  document.getElementById('pageHeroRoot').innerHTML = `
    <div class="hero-orb o1"></div>
    <div class="hero-orb o2"></div>
    <div class="container">
      <div class="breadcrumb"><a href="index.html">Home</a> / <span>Blogs</span></div>
      <h1>${B.hero.title}</h1>
      <p>${B.hero.subtitle}</p>
    </div>
  `;

  /* ----- Instagram video section ----- */
  const igRoot = document.getElementById('instagramRoot');
  if(igRoot){
    // Instagram's embed needs a clean permalink — strip any ?utm_source / share tokens
    // that come along when you copy the link from the app.
    const cleanPermalink = url => String(url).split('?')[0].replace(/\/*$/, '/');

    const videosHtml = B.instagramVideos.map(v => `
      <div>
        <div class="ig-embed-wrap reveal">
          <blockquote class="instagram-media" data-instgrm-permalink="${cleanPermalink(v.url)}" data-instgrm-version="14" style="width:100%;"></blockquote>
        </div>
        ${v.caption ? `<div class="ig-caption">${v.caption}</div>` : ''}
      </div>
    `).join('');

    igRoot.innerHTML = `
      <div class="container">
        <div class="section-head reveal">
          <div class="ig-header">
            <div class="ig-icon-badge">${icon('instagram')}</div>
          </div>
          <span class="eyebrow-pill">${B.instagramSection.title}</span>
          <h2>${B.labels.instagramTitle}</h2>
          <p>${B.instagramSection.subtitle}</p>
        </div>
        <div class="ig-grid">
          ${videosHtml}
          <a href="${S.social.instagramUrl}" target="_blank" rel="noopener" class="ig-follow-card reveal">
            ${icon('instagram')}
            <h3>${B.labels.instagramFollowTitle}</h3>
            <p>${B.labels.instagramFollowDesc}</p>
            <span class="btn btn-glass btn-sm" style="margin-top:10px;">${B.labels.instagramFollowBtn}</span>
          </a>
        </div>
      </div>
    `;

    /* Load Instagram's official embed script (renders the blockquotes above live) */
    if(window.instgrm){
      window.instgrm.Embeds.process();
    } else {
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }

  /* ----- YouTube videos (thumbnail only — the iframe loads on click, keeping the page fast) ----- */
  const ytRoot = document.getElementById('youtubeRoot');
  if(ytRoot && B.youtubeVideos && B.youtubeVideos.length){
    ytRoot.innerHTML = `
      <div class="container">
        <div class="section-head reveal">
          <div class="yt-header"><div class="yt-icon-badge">${icon('youtube')}</div></div>
          <span class="eyebrow-pill">${B.youtubeSection.title}</span>
          <h2>${B.labels.youtubeTitle}</h2>
          <p>${B.youtubeSection.subtitle}</p>
        </div>
        <div class="grid-2 stagger">
          ${B.youtubeVideos.map(v => {
            const id = youtubeId(v.url);
            return `
            <div class="yt-card reveal" data-yt="${id}">
              <div class="yt-thumb">
                <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${v.title}" loading="lazy"
                     onerror="this.remove()">
                <span class="yt-play">${icon('play')}</span>
              </div>
              <div class="yt-title">${v.title}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
    ytRoot.querySelectorAll('[data-yt]').forEach(card => {
      card.addEventListener('click', () => openVideoModal({ type:'youtube', src: card.dataset.yt }));
    });
  }

  /* ----- Blog articles grid + category filter ----- */
  const gridRoot = document.getElementById('blogGridRoot');
  if(gridRoot){
    const categories = [B.labels.filterAll, ...new Set(B.posts.map(p => p.category))];

    function cardsHtml(list){
      return list.map(p => `
        <div class="blog-card reveal" data-cat="${p.category}" data-post-index="${B.posts.indexOf(p)}">
          <div class="blog-thumb">
            <img src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=700&auto=format&fit=crop'">
            <span class="blog-cat">${p.category}</span>
          </div>
          <div class="blog-body">
            <div class="blog-meta"><span>${p.date}</span><span>•</span><span>${p.readTime}</span></div>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <span class="blog-readmore">${B.labels.readMore} ${icon('arrow-right')}</span>
          </div>
        </div>
      `).join('');
    }

    gridRoot.innerHTML = `
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow-pill">${B.labels.articlesEyebrow}</span>
          <h2>${B.labels.articlesTitle}</h2>
          <p>${B.labels.articlesSubtitle}</p>
        </div>
        <div class="blog-filter reveal">
          ${categories.map((c,i) => `<button class="filter-chip ${i===0?'active':''}" data-filter="${c}">${c}</button>`).join('')}
        </div>
        <div class="grid-3 stagger" id="blogCards">${cardsHtml(B.posts)}</div>
      </div>
    `;

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        const list = filter === B.labels.filterAll ? B.posts : B.posts.filter(p => p.category === filter);
        document.getElementById('blogCards').innerHTML = cardsHtml(list);
        initReveal();
      });
    });
  }

  document.getElementById('blogsCtaRoot').innerHTML = `
    <div class="cta-band reveal-scale">
      <h2>${B.labels.ctaTitle}</h2>
      <p>${B.labels.ctaSubtitle}</p>
      <div class="cta-actions">
        <a href="${waLink()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${icon('whatsapp')} ${B.labels.ctaWhatsappBtn}</a>
        <a href="${telLink()}" class="btn btn-glass">${icon('phone')} ${B.labels.ctaCallBtn} ${S.phoneDisplay}</a>
      </div>
    </div>
  `;
}
