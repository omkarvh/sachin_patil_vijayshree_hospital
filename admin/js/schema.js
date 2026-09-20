/* ============================================================
   ADMIN SCHEMA
   ------------------------------------------------------------
   Describes every field the clinic can edit. The admin panel
   builds itself from this — so adding a new editable field is
   one line here, with no UI code to write.

   types:
     text      single line
     textarea  paragraph
     number    numeric
     bool      on/off switch
     image     upload (compressed in-browser, stored in the database)
     strings   list of plain lines (e.g. bio paragraphs)
     list      list of records, `item` describes one record
     blocks    a blog article body (paragraphs/headings/lists/quotes)

   `path` is dotted, relative to the section's root in content.js.
   ============================================================ */

const SCHEMA = [

  /* ---------------------------------------------------------- */
  {
    key:'site', label:'Clinic & Contact', icon:'settings',
    blurb:'Name, phone, address and social links. These appear on every page.',
    groups:[
      { title:'Identity', fields:[
        { path:'doctorName',  label:'Doctor name',   type:'text' },
        { path:'credentials', label:'Credentials',   type:'text', hint:'e.g. MBBS, MD (Internal Medicine)' },
        { path:'role',        label:'Role / titles', type:'text' },
        { path:'clinicName',  label:'Clinic name',   type:'text' },
        { path:'tagline',     label:'Tagline',       type:'text' },
        { path:'logoMark',    label:'Logo mark (square, header & footer)', type:'image', kind:'logo' },
        { path:'logoFull',    label:'Full logo (loading screen)',          type:'image', kind:'logo' },
        { path:'logoInitials',label:'Fallback initials', type:'text', hint:'Shown if no logo is uploaded' }
      ]},
      { title:'Contact', fields:[
        { path:'phoneDisplay', label:'Phone (as shown)', type:'text' },
        { path:'phoneDial',    label:'Phone (for dialling)', type:'text', hint:'No spaces, e.g. +919164142111' },
        { path:'whatsappNumber', label:'WhatsApp number', type:'text', hint:'Country code + number, no + or spaces' },
        { path:'whatsappDefaultMessage', label:'Default WhatsApp message', type:'textarea' },
        { path:'email',   label:'Email',   type:'text' },
        { path:'address', label:'Address', type:'textarea' },
        { path:'mapEmbedUrl', label:'Google Maps embed URL', type:'textarea',
          hint:'Google Maps → Share → Embed a map → copy the src="..." link' }
      ]},
      { title:'Working hours', fields:[
        { path:'workingHours', label:'Hours', type:'list', titleKey:'day', item:[
          { path:'day',  label:'Day(s)', type:'text' },
          { path:'time', label:'Time',   type:'text' }
        ]}
      ]},
      { title:'Social links', fields:[
        { path:'social.instagramHandle', label:'Instagram handle', type:'text' },
        { path:'social.instagramUrl',    label:'Instagram URL',    type:'text' },
        { path:'social.facebookUrl',     label:'Facebook URL',     type:'text' },
        { path:'social.youtubeUrl',      label:'YouTube URL',      type:'text' },
        { path:'social.linkedinUrl',     label:'LinkedIn URL',     type:'text' }
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'home', label:'Home Page', icon:'layout',
    blurb:'The banner, the scrolling strip, statistics, services and calls to action.',
    groups:[
      { title:'Banner', fields:[
        { path:'hero.eyebrow',   label:'Small label above the headline', type:'text' },
        { path:'hero.titleLines', label:'Headline lines', type:'strings',
          hint:'One line per row. Wrap words in {{ }} to give them the glowing colour.' },
        { path:'hero.subtitle',  label:'Sub-heading', type:'textarea' },
        { path:'hero.primaryBtn',   label:'Main button text', type:'text' },
        { path:'hero.secondaryBtn', label:'Second button text', type:'text' },
        { path:'hero.trustItems', label:'Trust points under the buttons', type:'strings' }
      ]},
      { title:'Banner background video',
        note:'The silent video looping behind the headline. Paste a YouTube link, or point at a video file. Only the boxes that apply to your choice are shown.',
        fields:[
        { path:'hero.backgroundVideo.type', label:'Where the video comes from', type:'select',
          options:[{v:'youtube',t:'A YouTube link'},{v:'mp4',t:'A video file'}] },

        { path:'hero.backgroundVideo.youtubeId', label:'YouTube link', type:'text',
          hint:'Paste the whole address — youtube.com/watch, youtu.be and /shorts links all work',
          showIf:{ path:'hero.backgroundVideo.type', equals:'youtube' } },
        { path:'hero.backgroundVideo.startAt', label:'Skip the first … seconds', type:'number',
          hint:'Jump past an intro or title card',
          showIf:{ path:'hero.backgroundVideo.type', equals:'youtube' } },
        { path:'hero.backgroundVideo.zoom', label:'Zoom', type:'number',
          hint:'1 = none. Vertical Reels need about 2.4 to fill a wide banner.',
          showIf:{ path:'hero.backgroundVideo.type', equals:'youtube' } },
        { path:'hero.backgroundVideo.offsetY', label:'Move the framing up or down (%)', type:'number',
          hint:'Negative moves up, positive moves down',
          showIf:{ path:'hero.backgroundVideo.type', equals:'youtube' } },

        { path:'hero.backgroundVideo.src', label:'Video file', type:'text',
          hint:'A file in the site folder (assets/video/hero-bg.mp4) or a full https:// link to an .mp4',
          showIf:{ path:'hero.backgroundVideo.type', equals:'mp4' } },

        { path:'hero.backgroundVideo.poster', label:'Still picture shown while the video loads', type:'image', kind:'cover' }
      ]},

      { title:'"Watch Health Videos" popup',
        note:'The video that opens when someone clicks the second button on the banner.',
        fields:[
        { path:'hero.video.type', label:'Where the video comes from', type:'select',
          options:[{v:'youtube',t:'A YouTube link'},{v:'mp4',t:'A video file'}] },
        { path:'hero.video.src',  label:'YouTube link or video file', type:'text',
          hint:'Paste the whole YouTube address (any format) — or a path like assets/video/intro.mp4' }
      ]},
      { title:'Scrolling strip', fields:[
        { path:'marquee', label:'Conditions treated', type:'strings' }
      ]},
      { title:'Statistics', fields:[
        { path:'stats', label:'Figures', type:'list', titleKey:'label', item:[
          { path:'number', label:'Number', type:'number' },
          { path:'suffix', label:'Suffix', type:'text', hint:'e.g. + or " Days"' },
          { path:'label',  label:'Caption', type:'text' }
        ]}
      ]},
      { title:'Why choose us', fields:[
        { path:'highlights.title',    label:'Heading', type:'text' },
        { path:'highlights.subtitle', label:'Sub-heading', type:'text' },
        { path:'highlights.items', label:'Points', type:'list', titleKey:'title', item:[
          { path:'icon',  label:'Icon', type:'icon' },
          { path:'title', label:'Title', type:'text' },
          { path:'desc',  label:'Description', type:'textarea' }
        ]}
      ]},
      { title:'Conditions we treat', fields:[
        { path:'services.title',    label:'Heading', type:'text' },
        { path:'services.subtitle', label:'Sub-heading', type:'text' },
        { path:'services.items', label:'Services', type:'list', titleKey:'title', item:[
          { path:'icon',  label:'Icon', type:'icon' },
          { path:'title', label:'Title', type:'text' },
          { path:'desc',  label:'Description', type:'textarea' }
        ]}
      ]},
      { title:'Patient reviews', note:'Only ever paste real reviews, word for word. Leave empty to hide the section.', fields:[
        { path:'testimonials.title', label:'Heading', type:'text' },
        { path:'testimonials.items', label:'Reviews', type:'list', titleKey:'name', item:[
          { path:'name',   label:'Patient name', type:'text' },
          { path:'role',   label:'Source', type:'text', hint:'e.g. Google Review' },
          { path:'text',   label:'Review', type:'textarea' },
          { path:'rating', label:'Stars (1-5)', type:'number' }
        ]}
      ]},
      { title:'Closing call to action', fields:[
        { path:'cta.title',       label:'Heading', type:'text' },
        { path:'cta.subtitle',    label:'Sub-heading', type:'textarea' },
        { path:'cta.whatsappBtn', label:'WhatsApp button', type:'text' },
        { path:'cta.callBtn',     label:'Call button', type:'text' }
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'about', label:'About & Certificates', icon:'award',
    blurb:'The doctor\'s biography, qualifications, career timeline and certificate gallery.',
    groups:[
      { title:'Page banner', fields:[
        { path:'hero.title',    label:'Heading', type:'text' },
        { path:'hero.subtitle', label:'Sub-heading', type:'textarea' },
        { path:'hero.image',    label:'Portrait photo', type:'image', kind:'portrait' }
      ]},
      { title:'Biography', fields:[
        { path:'labels.bioTitle', label:'Section heading', type:'text' },
        { path:'bio', label:'Biography paragraphs', type:'strings' },
        { path:'credentialsList', label:'Qualifications list', type:'strings' }
      ]},

      /* --- the piece the live site was missing --- */
      { title:'Certificates & recognition',
        note:'Upload the scan or photo of each certificate. Pictures are shrunk automatically so they stay free to store. An entry with no picture still shows as a card with its title.',
        fields:[
          { path:'certificates.eyebrow',  label:'Small label', type:'text' },
          { path:'certificates.title',    label:'Heading', type:'text' },
          { path:'certificates.subtitle', label:'Sub-heading', type:'textarea' },
          { path:'certificates.items', label:'Certificates', type:'list', titleKey:'title', item:[
            { path:'title',  label:'Certificate name', type:'text' },
            { path:'issuer', label:'Issued by', type:'text' },
            { path:'year',   label:'Year', type:'text' },
            { path:'image',  label:'Certificate picture', type:'image', kind:'certificate' }
          ]}
      ]},

      { title:'Key figures', fields:[
        { path:'achievements', label:'Figures', type:'list', titleKey:'label', item:[
          { path:'number', label:'Figure', type:'text' },
          { path:'label',  label:'Caption', type:'text' }
        ]}
      ]},
      { title:'Specializations', fields:[
        { path:'labels.specTitle', label:'Section heading', type:'text' },
        { path:'specializations',  label:'Areas of expertise', type:'strings' }
      ]},
      { title:'Training & milestones', fields:[
        { path:'labels.timelineTitle', label:'Section heading', type:'text' },
        { path:'timeline', label:'Milestones', type:'list', titleKey:'year', item:[
          { path:'year',  label:'Year / stage', type:'text' },
          { path:'event', label:'What happened', type:'textarea' }
        ]}
      ]},
      { title:'Approach to care', fields:[
        { path:'philosophy.title',  label:'Heading', type:'text' },
        { path:'philosophy.quote',  label:'Quote', type:'textarea' },
        { path:'philosophy.points', label:'Points', type:'strings' }
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'blogs', label:'Articles & Videos', icon:'file-text',
    blurb:'Health articles, YouTube videos and Instagram reels.',
    groups:[
      { title:'Page banner', fields:[
        { path:'hero.title',    label:'Heading', type:'text' },
        { path:'hero.subtitle', label:'Sub-heading', type:'textarea' }
      ]},
      { title:'Articles',
        note:'The newest three also appear on the Home page. Drag to reorder.',
        fields:[
          { path:'posts', label:'Articles', type:'list', titleKey:'title', item:[
            { path:'title',    label:'Title', type:'text' },
            { path:'category', label:'Category', type:'text' },
            { path:'date',     label:'Date', type:'text', hint:'e.g. June 2026' },
            { path:'readTime', label:'Reading time', type:'text', hint:'e.g. 4 min read' },
            { path:'excerpt',  label:'Short summary', type:'textarea' },
            { path:'image',    label:'Cover picture', type:'image', kind:'cover' },
            { path:'content',  label:'Article body', type:'blocks' }
          ]}
      ]},
      { title:'Article popup footer', fields:[
        { path:'articleModal.disclaimer', label:'Medical disclaimer', type:'textarea' },
        { path:'articleModal.ctaText',    label:'Prompt text', type:'text' },
        { path:'articleModal.ctaBtn',     label:'Button text', type:'text' }
      ]},
      { title:'YouTube videos', fields:[
        { path:'youtubeSection.title',    label:'Heading', type:'text' },
        { path:'youtubeSection.subtitle', label:'Sub-heading', type:'text' },
        { path:'youtubeVideos', label:'Videos', type:'list', titleKey:'title', item:[
          { path:'url',   label:'YouTube link', type:'text', hint:'Any format — watch, youtu.be or shorts' },
          { path:'title', label:'Title shown on the site', type:'text' }
        ]}
      ]},
      { title:'Instagram reels',
        note:'The account must be public for reels to display.',
        fields:[
          { path:'instagramSection.title',    label:'Heading', type:'text' },
          { path:'instagramSection.subtitle', label:'Sub-heading', type:'text' },
          { path:'instagramVideos', label:'Reels', type:'list', titleKey:'caption', item:[
            { path:'url',     label:'Reel link', type:'text' },
            { path:'caption', label:'Caption', type:'text' },
            { path:'thumb',   label:'Cover picture (Home page tile)', type:'image', kind:'thumb' }
          ]}
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'contact', label:'Contact Page', icon:'mail',
    blurb:'The contact page banner, quick actions and frequently asked questions.',
    groups:[
      { title:'Page banner', fields:[
        { path:'hero.title',    label:'Heading', type:'text' },
        { path:'hero.subtitle', label:'Sub-heading', type:'textarea' }
      ]},
      { title:'Quick action cards', fields:[
        { path:'quickActions.whatsappTitle', label:'WhatsApp card title', type:'text' },
        { path:'quickActions.whatsappDesc',  label:'WhatsApp card text', type:'textarea' },
        { path:'quickActions.callTitle',     label:'Call card title', type:'text' },
        { path:'quickActions.callDesc',      label:'Call card text', type:'textarea' },
        { path:'quickActions.emailTitle',    label:'Email card title', type:'text' },
        { path:'quickActions.emailDesc',     label:'Email card text', type:'textarea' }
      ]},
      { title:'Message form', fields:[
        { path:'formTitle',    label:'Form heading', type:'text' },
        { path:'formSubtitle', label:'Form sub-heading', type:'text' }
      ]},
      { title:'Frequently asked questions', fields:[
        { path:'faq.title', label:'Section heading', type:'text' },
        { path:'faq.items', label:'Questions', type:'list', titleKey:'q', item:[
          { path:'q', label:'Question', type:'text' },
          { path:'a', label:'Answer', type:'textarea' }
        ]}
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'footer', label:'Footer', icon:'layout',
    blurb:'The bottom of every page.',
    groups:[
      { title:'Footer', fields:[
        { path:'about',     label:'About text', type:'textarea' },
        { path:'copyright', label:'Copyright line', type:'text' }
      ]}
    ]
  },

  /* ---------------------------------------------------------- */
  {
    key:'preloader', label:'Loading Screen', icon:'clock',
    blurb:'The splash shown while a page loads.',
    groups:[
      { title:'Loading screen', fields:[
        { path:'enabled',  label:'Show the loading screen', type:'bool' },
        { path:'tagline',  label:'Tagline', type:'text' },
        { path:'minDuration', label:'Minimum time on screen (ms)', type:'number' },
        { path:'maxDuration', label:'Maximum time on screen (ms)', type:'number' },
        { path:'sound.enabled', label:'Play the chime', type:'bool',
          hint:'Browsers block sound until the visitor clicks something — this often stays silent on a first visit.' },
        { path:'sound.volume',  label:'Volume (0 to 1)', type:'number' }
      ]}
    ]
  }
];

/* Icon names offered in the "icon" picker — these are the ones that suit
   the medical cards on the site. */
const ICON_CHOICES = [
  'activity','heart-pulse','shield-check','syringe','utensils','salad',
  'brain-circuit','footprints','baby','smartphone','clock','check-circle',
  'award','book-open','calendar','mail','map-pin','phone','eye','file-text'
];
