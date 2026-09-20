/* ============================================================
   CONTENT.js
   ------------------------------------------------------------
   EVERYTHING on this website is controlled from this ONE file.
   Change text, phone numbers, images, videos, blog posts and
   Instagram links here — the site updates everywhere it's used.
   No coding knowledge needed beyond editing the text between
   quotes " " . Do not remove commas or quotes.
   ============================================================ */

const CONTENT = {

  /* ---------- 1. SITE-WIDE SETTINGS (used on every page) ---------- */
  site: {
    doctorName: "Dr. Sachin Patil",
    credentials: "MBBS, MD (Internal Medicine), CPCDM",
    role: "Consultant Physician · Diabetologist · Critical Care",
    clinicName: "Vijayshree Healthcare",
    tagline: "Trusted Everyday Care in Bidar",
    /* LOGO
       logoMark = the square symbol, used in the header and footer
       logoFull = the full logo with the name, used on the loading screen
       Leave either empty ("") and it falls back to the `logoInitials` tile below. */
    logoMark: "assets/favicon/icon-192.png",
    logoFull: "assets/images/logo.png",
    logoInitials: "VH",

    // Contact details — used for click-to-call, WhatsApp buttons & footer
    phoneDisplay: "+91 91641 42111",
    phoneDial: "+919164142111",          // no spaces, used in tel: links
    whatsappNumber: "919164142111",       // country code + number, NO + or spaces
    whatsappDefaultMessage: "Hello Doctor, I would like to book an appointment. Please guide me.",
    email: "vijayshreehealthcare@gmail.com",

    address: "WG86+W54, Devi Colony, Bank Colony, Bidar, Karnataka 585401",
    mapEmbedUrl: "https://www.google.com/maps?q=Vijayshree+Healthcare+Devi+Colony+Bank+Colony+Bidar+Karnataka+585401&output=embed",

    workingHours: [
      { day: "Monday – Saturday (Morning OPD)", time: "10:00 AM – 4:00 PM" },
      { day: "Monday – Saturday (Evening OPD)", time: "6:00 PM – 9:00 PM" },
      { day: "Sunday", time: "By appointment — please call or WhatsApp first" }
    ],

    social: {
      instagramHandle: "@vijayshreehealthcare",
      instagramUrl: "https://www.instagram.com/vijayshreehealthcare/",
      facebookUrl: "https://www.facebook.com/profile.php?id=61587336047508",
      youtubeUrl: "https://www.youtube.com/@VijayshreeHealthcare",
      linkedinUrl: "https://www.linkedin.com/company/vijayshree-healthcare-bidar/"
    }
  },

  /* ---------- 1b. LOADING SCREEN (shown while the page loads) ---------- */
  preloader: {
    enabled: true,              // set to false to switch the loading screen off
    tagline: "Trusted Everyday Care in Bidar",
    minDuration: 700,           // always show for at least this long (milliseconds)
    maxDuration: 3000,          // never hold the visitor longer than this

    /* SOUND played while the loading screen is up.
       IMPORTANT — browsers (Chrome, Safari, Firefox) block sound on page load
       unless the visitor has already clicked something on the site. So this will
       often stay silent for a first-time visitor, and usually plays when moving
       between pages. That is a browser rule, not a bug, and it cannot be
       worked around. Nothing breaks when it is blocked — the page just loads quietly.

       Replace the file with your own clip any time (mp3 or wav both work).
       Keep it short and quiet — a long or loud clip on a clinic site annoys people. */
    sound: {
      enabled: true,
      src: "assets/audio/loading-chime.wav",
      volume: 0.35               // 0 = silent, 1 = full volume
    }
  },

  /* ---------- 2. NAVIGATION ---------- */
  nav: [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Blogs", href: "blogs.html" },
    { label: "Contact", href: "contact.html" }
  ],

  /* ---------- 3. HOME PAGE ---------- */
  home: {
    // Small labels above each section heading
    labels: {
      highlightsEyebrow: "Why Vijayshree",
      servicesEyebrow: "Our Services",
      testimonialsEyebrow: "Testimonials",
      blogsEyebrow: "Health Library",
      readMore: "Read Article",
      videoChip: "Silent clinic footage",
      scrollCue: "Scroll"
    },

    hero: {
      eyebrow: "Consultant Physician & Diabetologist in Bidar",

      // Headline is written line-by-line so it animates in beautifully.
      // Wrap any words in {{ }} to give them the glowing gradient effect.
      titleLines: [
        "Expert Care For",
        "{{Diabetes}} & Everyday",
        "Health Concerns."
      ],
      subtitle: "MBBS, MD (Internal Medicine) care for diabetes, blood pressure, breathing problems and general medicine — open all seven days at Vijayshree Healthcare, Bidar.",
      primaryBtn: "Book Appointment",
      secondaryBtn: "Watch Health Videos",

      /* -------- BACKGROUND VIDEO (plays silently on loop behind the hero) --------
         TWO WAYS TO DO THIS — just change `type` below to compare them:

         type: "youtube"  → plays a real video from the clinic's YouTube channel.
                            Nothing to upload. Uses `youtubeId` below.
                            (Sound is always off — it's a background, not a player.)

         type: "mp4"      → plays a video file from your own folder. Best quality and
                            fastest, but you must put the file at assets/video/hero-bg.mp4.
                            Record 15-20 seconds of the doctor consulting or talking,
                            keep it under ~10MB, and replace that file.

         The mp4 in the folder right now is temporary stock footage.                 */
      backgroundVideo: {
        type: "mp4",

        // Used when type is "youtube" — paste any YouTube link or just the video ID
        youtubeId: "lEsyGm4T2Mo",
        startAt: 3,          // skip this many seconds of intro

        /* The clinic's YouTube videos are vertical Reels/Shorts placed inside a wide
           frame, so on a wide screen they only fill the middle. `zoom` enlarges the
           video to fill the banner and `offsetY` slides the framing up or down so the
           doctor's face sits nicely. Tweak these two numbers and refresh:
             zoom: 1     = no zoom (you'll see filler bars at the sides)
             zoom: 2.4   = fills the banner, crops top and bottom
             offsetY: 0  = centred | -8 = move up | 8 = move down          */
        zoom: 2.4,
        offsetY: -4,

        // Used when type is "mp4"
        src: "assets/video/hero-bg.mp4",

        // Still image shown while the video loads (used by both)
        poster: "assets/images/clinic-reception.jpg"
      },

      // Small trust points shown under the hero buttons
      trustItems: [
        "MD (Internal Medicine), CPCDM",
        "Open All 7 Days",
        "Pride of Karnataka Awardee"
      ],

      /* -------- INTRO VIDEO (opens in a popup when the second button is clicked) ----
         type: "youtube" -> paste ONLY the YouTube video ID (the part after v=)
         type: "mp4"     -> path to a video file, e.g. "assets/video/intro.mp4"      */
      video: {
        type: "youtube",
        src: "7h_2sSgJKTo",
        poster: "assets/images/clinic-reception.jpg"
      }
    },

    // Scrolling ticker below the hero — conditions treated at the clinic
    marquee: [
      "Diabetes Care", "Blood Pressure", "Thyroid & Metabolic", "Asthma · COPD · TB",
      "Liver & Kidney Disorders", "Gastritis & Digestion", "Arthritis & Joint Pain",
      "Stroke Care", "Fever & Infections", "Medical Emergencies"
    ],

    stats: [
      { number: 13, suffix: "+", label: "Research Publications" },
      { number: 600, suffix: "+", label: "Screened at a Single Camp" },
      { number: 7, suffix: " Days", label: "Open Every Week" },
      { number: 9, suffix: " Hrs", label: "Daily OPD Availability" }
    ],

    highlights: {
      title: "Why Patients Choose Vijayshree Healthcare",
      subtitle: "Specialist-level internal medicine, available close to home",
      items: [
        {
          icon: "clock",
          title: "Open All Seven Days",
          desc: "Morning and evening OPD every day, with Sunday consultations available by appointment."
        },
        {
          icon: "activity",
          title: "Complete Diabetes Workup",
          desc: "HbA1c, fasting and post-meal sugars, lipid profile, kidney function and nerve checks — reviewed together, not in isolation."
        },
        {
          icon: "heart-pulse",
          title: "Critical Care Trained",
          desc: "Postgraduate training in intensive and emergency care means serious illness is recognised early."
        },
        {
          icon: "shield-check",
          title: "Community Health Camps",
          desc: "Free screening camps across Bidar district — Ladha, Yaranalli, Kamalanagar and more."
        }
      ]
    },

    services: {
      title: "Conditions We Treat",
      subtitle: "Full-spectrum internal medicine, with a special focus on diabetes",
      items: [
        { icon: "activity", title: "Diabetes & Sugar Control", desc: "Type 1, Type 2, gestational and secondary diabetes — tablets, insulin, diet and long-term monitoring." },
        { icon: "heart-pulse", title: "Blood Pressure & Heart Risk", desc: "Hypertension management with cholesterol and cardiovascular risk assessment." },
        { icon: "brain-circuit", title: "Asthma, COPD & TB", desc: "Diagnosis and treatment of long-term breathing problems, pneumonia and chest infections." },
        { icon: "shield-check", title: "Liver & Kidney Disorders", desc: "Investigation and ongoing care for liver and kidney conditions, including diabetes-related damage." },
        { icon: "utensils", title: "Gastritis & Digestive Issues", desc: "Acidity, gastritis and persistent digestive complaints assessed and treated properly." },
        { icon: "syringe", title: "General Medicine & Emergencies", desc: "Fever, viral illness, arthritis and joint pain, stroke care and acute medical emergencies." }
      ]
    },

    /* ⚠️ PATIENT REVIEWS — currently switched off.
       Never write reviews yourself. Copy real Google reviews here word-for-word,
       with the reviewer's real name, and the section will appear automatically.
       Example of one entry:
         { name: "Real Patient Name", role: "Google Review", text: "Their actual words.", rating: 5 }
    */
    testimonials: {
      title: "What Our Patients Say",
      items: []
    },

    /* Latest blogs strip on the Home page.
       The articles themselves are written once in `blogs.posts` below —
       this just decides how many of the newest ones appear on the Home page. */
    latestBlogs: {
      title: "Health Tips & Clinic Updates",
      subtitle: "Straightforward health guidance and news from Vijayshree Healthcare",
      count: 3,
      viewAllBtn: "View All Articles"
    },

    /* Social media strip on the Home page — teases Instagram & YouTube.
       Both "more" buttons take the visitor to the Blogs page, where the
       real Reels and videos actually play. */
    social: {
      eyebrow: "Follow Along",
      title: "Health Tips You Can Watch",
      subtitle: "Short reels on Instagram, full explainers on YouTube — in Kannada and English",
      instagram: {
        title: "Reels on Instagram",
        desc: "Quick, myth-busting health tips in under a minute.",
        btn: "Watch Reels"
      },
      youtube: {
        title: "Videos on YouTube",
        desc: "Longer explainers on diabetes, BP and everyday health.",
        btn: "Watch Videos"
      }
    },

    cta: {
      title: "Not Sure If You Need to Come In? Just Ask.",
      subtitle: "Send a WhatsApp message or call the clinic — we'll tell you honestly whether a visit is needed.",
      whatsappBtn: "Chat on WhatsApp",
      callBtn: "Call Now"
    }
  },

  /* ---------- 4. ABOUT PAGE (About the Doctor) ---------- */
  about: {
    // Section headings on the About page
    labels: {
      bioEyebrow: "About The Doctor",
      bioTitle: "A Physician's Practice Built on Listening",
      specEyebrow: "Areas of Expertise",
      specTitle: "Specializations",
      timelineEyebrow: "Journey",
      timelineTitle: "Training & Milestones",
      ctaTitle: "Book a Consultation with Dr. Patil",
      ctaSubtitle: "Open all seven days at Vijayshree Healthcare, Bidar.",
      ctaWhatsappBtn: "Book on WhatsApp",
      ctaCallBtn: "Call"
    },

    hero: {
      title: "Meet Dr. Sachin Patil",
      subtitle: "MBBS, MD (Internal Medicine), CPCDM · Consultant Physician, Diabetologist & Critical Care Specialist",
      image: "assets/images/doctor-portrait.jpg"
    },

    bio: [
      "Dr. Sachin Patil is a Consultant Physician and Diabetologist based in Bidar, and the founder and medical lead of Vijayshree Healthcare.",
      "He completed his MD in Internal Medicine under Rajiv Gandhi University of Health Sciences, Karnataka, with postgraduate residency training that covered general internal medicine, intensive care and emergency medicine. He also holds the CPCDM certification in diabetes management.",
      "Alongside his clinical practice, he has authored 13 peer-reviewed papers in national and international journals on subjects including liver disease, COPD, diabetes complications, neurological conditions and infectious diseases.",
      "He serves as an Executive Member of the Association of Physicians of India (API), Bidar Branch, and runs regular free health screening camps in villages across the district."
    ],

    credentialsList: [
      "MBBS",
      "MD (Internal Medicine) — Rajiv Gandhi University of Health Sciences, Karnataka",
      "CPCDM — Certificate Course in Diabetes Management",
      "Executive Member, Association of Physicians of India (API), Bidar Branch — 2025–26",
      "Honoured with 'Pride of Karnataka' recognition by Karnataka Media Club",
      "13 peer-reviewed publications in national and international journals"
    ],

    specializations: [
      "Diabetes & Metabolic Disorders",
      "General Internal Medicine",
      "Hypertension & Cardiovascular Risk",
      "Respiratory & Infectious Diseases",
      "Liver & Kidney Disorders",
      "Critical & Emergency Care",
      "Preventive Health Screening"
    ],

    timeline: [
      { year: "MBBS", event: "Completed undergraduate medical training" },
      { year: "MD", event: "MD in Internal Medicine, Rajiv Gandhi University of Health Sciences, Karnataka" },
      { year: "Residency", event: "Postgraduate training in internal medicine, intensive care and emergency medicine" },
      { year: "CPCDM", event: "Certified in diabetes management" },
      { year: "Founder", event: "Established Vijayshree Healthcare, Bidar" },
      { year: "2025–26", event: "Appointed Executive Member, API Bidar Branch" },
      { year: "2026", event: "Honoured with 'Pride of Karnataka' recognition by Karnataka Media Club" }
    ],

    achievements: [
      { number: "13+", label: "Research Publications" },
      { number: "7", label: "Days Open Weekly" },
      { number: "600+", label: "Screened in One Camp" },
      { number: "API", label: "Executive Member, Bidar" }
    ],

    /* ---------- CERTIFICATES & RECOGNITION ----------
       Degrees, certifications and awards, shown as a gallery on the About
       page. Clicking one opens it full size.

       `image` is filled in from the ADMIN PANEL — upload the scan or photo
       of the certificate there and it is stored automatically. An entry with
       no image still shows as a neat card with its title and issuer, so the
       list never looks broken while scans are still being collected. */
    certificates: {
      eyebrow: "Credentials",
      title: "Certificates & Recognition",
      subtitle: "Degrees, certifications and honours — tap any certificate to view it full size.",
      items: [
        { title: "MBBS", issuer: "Bachelor of Medicine, Bachelor of Surgery", year: "", image: "" },
        { title: "MD — Internal Medicine", issuer: "Rajiv Gandhi University of Health Sciences, Karnataka", year: "", image: "" },
        { title: "CPCDM", issuer: "Certificate Course in Diabetes Management", year: "", image: "" },
        { title: "Executive Member, API", issuer: "Association of Physicians of India, Bidar Branch", year: "2025-26", image: "" },
        { title: "Pride of Karnataka", issuer: "Karnataka Media Club", year: "2026", image: "" }
      ]
    },

    philosophy: {
      title: "Approach to Care",
      quote: "\"Good medicine is not about ordering every test — it's about listening carefully, explaining plainly, and treating what actually needs treating.\"",
      points: [
        "Explain the diagnosis in language patients understand",
        "Investigate what is necessary, not everything possible",
        "Treat the whole patient, not one reading in isolation",
        "Stay reachable between visits on WhatsApp"
      ]
    }
  },

  /* ---------- 5. BLOGS PAGE (Articles + Videos) ---------- */
  blogs: {
    // Section headings and button labels on the Blogs page
    labels: {
      articlesEyebrow: "Doctor's Notes",
      articlesTitle: "Latest Articles",
      articlesSubtitle: "Clear, practical guidance you can act on today",
      filterAll: "All",
      readMore: "Read Article",
      instagramTitle: "Short Health Tips on Instagram",
      instagramFollowTitle: "Follow for More",
      instagramFollowDesc: "New health tips and clinic updates every week",
      instagramFollowBtn: "Visit Profile",
      youtubeTitle: "Full Video Explainers",
      ctaTitle: "Have a Question About Your Health?",
      ctaSubtitle: "Don't self-diagnose from the internet. Ask Dr. Patil directly.",
      ctaWhatsappBtn: "Ask on WhatsApp",
      ctaCallBtn: "Call"
    },

    hero: {
      title: "Health Tips & Clinic Updates",
      subtitle: "Practical guidance on diabetes, blood pressure and everyday health — plus news from Vijayshree Healthcare."
    },

    // Shown at the bottom of every article popup
    articleModal: {
      disclaimer: "This article is general health information and is not a substitute for a personal consultation. Please do not start, stop or change any medication based on what you read here.",
      ctaText: "Have a question about your own health?",
      ctaBtn: "Ask Dr. Patil on WhatsApp"
    },

    /* ---- Written blog articles ----
       Clicking "Read Article" opens the full article in a popup.
       The full text goes in `content`, which is a list of blocks.
       You can use these four block types, in any order:

         { type: "para",    text: "A normal paragraph." }
         { type: "heading", text: "A sub-heading" }
         { type: "list",    items: ["First point", "Second point"] }
         { type: "quote",   text: "A highlighted tip or takeaway." }

       ORDER MATTERS: posts appear on the Blogs page in the order written below,
       and the first 3 also appear on the Home page. To feature something, move
       its whole { ... } block nearer the top.
    */
    posts: [
      {
        title: "Dr. Sachin Patil Honoured with 'Pride of Karnataka' Recognition",
        category: "Clinic Updates",
        date: "June 2026",
        excerpt: "The Karnataka Media Club recognised Dr. Patil's contribution to healthcare and community welfare in Bidar.",
        image: "assets/images/camp-1.jpg",
        readTime: "2 min read",
        content: [
          { type: "para", text: "Dr. Sachin Patil has been honoured with the 'Pride of Karnataka' recognition by the Karnataka Media Club." },
          { type: "para", text: "The recognition acknowledged his contribution to healthcare in the Bidar region, his community welfare work, and his patient-centred approach to medical practice." },
          { type: "heading", text: "A shared credit" },
          { type: "para", text: "Recognition of this kind reflects the work of the whole Vijayshree Healthcare team, and the trust placed in us by patients and families across the district." },
          { type: "quote", text: "Awards are encouraging, but the real measure of a clinic is whether patients get better and come back when they need us." }
        ]
      },
      {
        title: "Free Mega Health Camp Held with Rotary Club Bidar",
        category: "Clinic Updates",
        date: "April 2026",
        excerpt: "A free community health camp organised by Rotary Club Bidar, in association with the Anjali Kotarki Charitable Foundation.",
        image: "assets/images/clinic-1.jpg",
        readTime: "2 min read",
        content: [
          { type: "para", text: "Rotary Club Bidar organised a free mega health camp with the participation of Dr. Sachin Patil, held in association with the Anjali Kotarki Charitable Foundation." },
          { type: "heading", text: "What the camp offered" },
          { type: "list", items: [
            "General health consultations",
            "Blood pressure checks",
            "Blood sugar screening",
            "Guidance on follow-up care for those who needed it"
          ]},
          { type: "para", text: "The camp saw a strong turnout from the community. Vijayshree Healthcare has run similar free screening camps in Ladha, Yaranalli and Kamalanagar, with 500 to 600 people screened at the larger camps." },
          { type: "heading", text: "Why we do these camps" },
          { type: "para", text: "Diabetes and high blood pressure cause no symptoms in their early stages. Camps like these find people who had no idea anything was wrong, at a point where the condition is still easy to control." }
        ]
      },
      {
        title: "Stopped Your BP Medicines Because You Feel Fine?",
        category: "Heart & BP",
        date: "September 2026",
        excerpt: "Feeling perfectly well is exactly how controlled blood pressure is supposed to feel — it is not a sign you can stop treatment.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
        readTime: "4 min read",
        content: [
          { type: "para", text: "This is one of the most common — and most dangerous — decisions patients make on their own. The tablets are working, you feel completely normal, so you conclude the problem has resolved and quietly stop taking them." },
          { type: "heading", text: "Why feeling fine proves nothing" },
          { type: "para", text: "High blood pressure usually causes no symptoms at all. Most people with dangerously high readings feel absolutely normal right up until something serious happens. That is precisely why it is called a silent condition." },
          { type: "quote", text: "Your normal reading is not proof you are cured. It is proof the medicine is doing its job." },
          { type: "heading", text: "What happens when you stop" },
          { type: "list", items: [
            "Pressure typically climbs back within days to weeks",
            "Some medicines cause a sharp rebound rise if stopped suddenly",
            "Every uncontrolled year quietly adds strain to the heart, brain and kidneys",
            "The damage is cumulative and, in most cases, permanent"
          ]},
          { type: "heading", text: "The real risks of untreated hypertension" },
          { type: "list", items: [
            "Stroke and brain haemorrhage",
            "Heart attack and heart failure",
            "Kidney failure, eventually requiring dialysis",
            "Damage to the blood vessels in the eyes"
          ]},
          { type: "heading", text: "When medicines genuinely can be reduced" },
          { type: "para", text: "It does happen — after sustained weight loss, a change in diet, or when a reversible cause has been treated. But that decision follows a review of your readings over time, not a good day at home. Reducing a dose safely is a planned, supervised process." },
          { type: "para", text: "If you dislike your current medicine because of cost or side effects, tell me. There are almost always alternatives. Stopping silently is the one option with no upside." }
        ]
      },
      {
        title: "Understanding HbA1c: What Your Number Really Means",
        category: "Diabetes",
        date: "August 2026",
        excerpt: "A simple, jargon-free explanation of the test every person with diabetes should understand.",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop",
        readTime: "5 min read",
        content: [
          { type: "para", text: "If a daily sugar reading is a photograph, HbA1c is the film of the last three months. It is the single most useful number in your reports, and it is worth understanding properly." },
          { type: "heading", text: "What the test actually measures" },
          { type: "para", text: "Glucose in your blood sticks to haemoglobin, the protein inside red blood cells. Those cells live for around three months. So the percentage of haemoglobin carrying glucose tells us your average blood sugar over that period — not just today." },
          { type: "quote", text: "This is why one careful week before your appointment cannot rescue a difficult three months. The test simply doesn't work that way." },
          { type: "heading", text: "Reading your result" },
          { type: "list", items: [
            "Below 5.7% — normal range",
            "5.7% to 6.4% — pre-diabetes, and the best time to act",
            "6.5% and above — in the diabetes range",
            "Most people with diabetes are given a target around 7%, but this is individual"
          ]},
          { type: "para", text: "Your personal target depends on your age, how long you have had diabetes, other conditions you live with, and how prone you are to low sugars. A safe target for a 70-year-old on insulin is not the same as one for a 35-year-old newly diagnosed." },
          { type: "heading", text: "Why HbA1c alone isn't the whole story" },
          { type: "para", text: "Two people can share an HbA1c of 7% while living very different lives — one steady all day, the other swinging between highs and lows that average out. This is why I still want to see your daily readings alongside the lab report." },
          { type: "para", text: "Certain conditions, including anaemia, kidney disease and some haemoglobin disorders, can make HbA1c misleading. If your reported average doesn't match what your meter shows at home, tell me — it's a clue worth following up, not something to ignore." },
          { type: "heading", text: "How often should it be checked?" },
          { type: "para", text: "Every three months while we are actively adjusting your treatment, and every six months once you are stable and at target." }
        ]
      },
      {
        title: "Vitamin D: Are You Taking It the Right Way?",
        category: "Wellness",
        date: "July 2026",
        excerpt: "Vitamin D is one of the most commonly prescribed and most commonly misused supplements. Here's how to get it right.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop",
        readTime: "4 min read",
        content: [
          { type: "para", text: "Vitamin D deficiency is genuinely common in India — even in a sunny district like ours. But the way it gets taken is often wrong, which is why people return months later with the same tiredness and the same low level." },
          { type: "heading", text: "The mistakes I see most often" },
          { type: "list", items: [
            "Taking the weekly sachet on an empty stomach, where very little is absorbed",
            "Taking a high-dose sachet daily instead of weekly, by misreading the label",
            "Stopping after one sachet and assuming the deficiency is corrected",
            "Continuing high doses for months without ever rechecking the level"
          ]},
          { type: "heading", text: "How to take it properly" },
          { type: "para", text: "Vitamin D is fat-soluble, which means it needs fat present to be absorbed. Take it with a proper meal — not with tea on an empty stomach. Follow the exact frequency written on your prescription; weekly means weekly." },
          { type: "quote", text: "More is not better with vitamin D. It is stored in the body, and excessive doses over months can raise calcium to harmful levels." },
          { type: "heading", text: "Don't forget sunlight" },
          { type: "para", text: "Roughly 15–20 minutes of direct sun on the arms and face, a few times a week, contributes meaningfully. Sunlight through a window glass does not count." },
          { type: "heading", text: "Recheck before repeating" },
          { type: "para", text: "After completing a correction course, the level should be rechecked before deciding whether maintenance is needed. Taking supplements indefinitely without testing is guesswork — and occasionally harmful." }
        ]
      },
      {
        title: "5 Morning Habits That Help Control Blood Sugar",
        category: "Diabetes",
        date: "June 2026",
        excerpt: "Small changes in your first hour after waking up can make a measurable difference to your fasting sugar levels.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
        readTime: "4 min read",
        content: [
          { type: "para", text: "How you spend the first hour after waking has a surprisingly large effect on your readings for the rest of the day. Many patients see their fasting numbers settle within a few weeks of fixing their mornings — without any change in medication." },
          { type: "heading", text: "1. Drink water before anything else" },
          { type: "para", text: "You wake up mildly dehydrated, and dehydration concentrates the glucose in your blood. A large glass of plain water before your tea or coffee is the single easiest habit on this list." },
          { type: "heading", text: "2. Don't skip breakfast" },
          { type: "para", text: "Skipping breakfast often backfires — it leads to a bigger, faster-digesting lunch and a sharper spike. A breakfast with protein and fibre keeps the curve flat." },
          { type: "list", items: [
            "Add a protein: eggs, paneer, curd, sprouts or dal",
            "Choose whole grains over refined flour — millets, jowar, oats or whole wheat",
            "Keep fruit juice off the table; eat the whole fruit instead"
          ]},
          { type: "heading", text: "3. Walk for 10 minutes after eating" },
          { type: "para", text: "A short, easy walk after breakfast helps your muscles pull glucose out of your bloodstream. It does not need to be brisk, and 10 minutes is genuinely enough to make a difference." },
          { type: "heading", text: "4. Take your medication at a consistent time" },
          { type: "para", text: "Diabetes medication works best on a predictable schedule. Shifting your dose by two hours from one day to the next creates avoidable swings." },
          { type: "heading", text: "5. Test and write it down" },
          { type: "para", text: "A fasting reading noted in a diary or app turns guesswork into information. Bring that record to your consultation — it tells me far more than a single reading taken in the clinic." },
          { type: "quote", text: "Start with one habit, not all five. A habit you keep for a year beats a perfect routine you abandon in a week." }
        ]
      },
      {
        title: "Is Fruit Really Bad If You Have Diabetes?",
        category: "Nutrition",
        date: "May 2026",
        excerpt: "We break down portion sizes, juice versus whole fruit, and which fruits are genuinely safe to enjoy.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
        readTime: "5 min read",
        content: [
          { type: "para", text: "\"Doctor, I've stopped eating fruit completely.\" I hear this every single week, and it's almost always unnecessary. Whole fruit is not the enemy — the portion, the form and the timing are what matter." },
          { type: "heading", text: "Why whole fruit behaves differently from juice" },
          { type: "para", text: "Fruit contains sugar, but it also contains fibre and water. That fibre slows absorption, so the glucose enters your blood gradually. Juicing removes the fibre and leaves concentrated sugar — one glass of juice can carry the sugar of four oranges with none of the braking effect." },
          { type: "quote", text: "Eat your fruit. Don't drink it." },
          { type: "heading", text: "Fruits that are generally easier on blood sugar" },
          { type: "list", items: [
            "Guava, pear and apple, eaten with the skin",
            "Papaya and orange in measured portions",
            "Berries — among the lowest impact of all fruits",
            "Jamun, a traditional favourite for good reason"
          ]},
          { type: "heading", text: "Fruits to keep to smaller portions" },
          { type: "list", items: [
            "Mango, chikoo, custard apple and ripe banana",
            "Grapes — easy to eat far more than you intended",
            "All dried fruit: dates, raisins and figs are concentrated sugar"
          ]},
          { type: "para", text: "None of these are banned. A couple of slices of mango after a meal that contained protein and vegetables is very different from a whole mango eaten alone on an empty stomach." },
          { type: "heading", text: "Three rules that cover most situations" },
          { type: "list", items: [
            "One fist-sized portion at a time, not an unlimited bowl",
            "Pair fruit with nuts or curd to blunt the rise",
            "Eat it as part of or just after a meal, not as a standalone snack"
          ]},
          { type: "para", text: "The most reliable way to know how a particular fruit affects you is to test two hours after eating it. Your body's response is individual, and your own readings will settle the argument better than any list." }
        ]
      },
      {
        title: "BLS & CPR Training Conducted for Nursing Staff at Shubham Neuro Hospital",
        category: "Clinic Updates",
        date: "March 2026",
        excerpt: "Dr. Patil led a Basic Life Support and CPR training session to strengthen emergency response among nursing staff.",
        image: "assets/images/clinic-2.jpg",
        readTime: "2 min read",
        content: [
          { type: "para", text: "Dr. Sachin Patil conducted a Basic Life Support (BLS) and CPR training session for the nursing staff at Shubham Neuro Hospital, Bidar." },
          { type: "heading", text: "What the session covered" },
          { type: "list", items: [
            "Recognising cardiac arrest quickly",
            "Correct chest compression technique and depth",
            "Rescue breathing and airway management",
            "Working as a coordinated team during an emergency"
          ]},
          { type: "para", text: "In a cardiac arrest, the minutes before a doctor arrives decide the outcome. Nursing staff who can start effective CPR immediately save lives — which is why this training matters far more than its length suggests." },
          { type: "quote", text: "Every member of a hospital team should be able to start CPR confidently. It is a skill that needs refreshing, not learning once." }
        ]
      }
    ],

    /* ------------------------------------------------------------
       YOUTUBE VIDEOS
       Paste any YouTube link and it will play right on the website
       (a popup opens — the visitor never leaves your site).
       All of these link formats work, just paste and go:
         https://www.youtube.com/watch?v=XXXXXXXXXXX
         https://youtu.be/XXXXXXXXXXX
         https://www.youtube.com/shorts/XXXXXXXXXXX
    ------------------------------------------------------------ */
    youtubeSection: {
      title: "Watch on YouTube",
      subtitle: "Health explainers in Kannada and English from Dr. Sachin Patil"
    },
    youtubeVideos: [
      { url: "https://www.youtube.com/watch?v=7h_2sSgJKTo", title: "Diabetes ಇದ್ದರೆ Sugar Control ಮಾತ್ರ ಸಾಕಲ್ಲ | Diabetes Complications Explained in Kannada" },
      { url: "https://www.youtube.com/watch?v=lEsyGm4T2Mo", title: "Stopped BP Medicines? | Dr. Sachin Patil" },
      { url: "https://www.youtube.com/watch?v=vR9f19FlX_w", title: "Vitamin D — Are You Taking It Right? | Dr. Sachin Patil" },
      { url: "https://www.youtube.com/watch?v=euF4EFaRT3M", title: "Sepsis Screening 2026: NEWS2 Score Explained in 60 Seconds" }
    ],

    /* ------------------------------------------------------------
       INSTAGRAM VIDEOS
       To show a new Reel here:
         1. Open the Instagram post/reel on instagram.com
         2. Copy its URL (e.g. https://www.instagram.com/reel/XXXXXXXXX/)
         3. Paste it below as a new entry — that's it, no coding needed.
       These are OFFICIAL Instagram embeds (loaded live from Instagram),
       so views/likes stay accurate and always up to date.

       ⚠️ The three links below are placeholders. Open the clinic's
       Instagram profile, copy three real Reel links and paste them here.
    ------------------------------------------------------------ */
    instagramSection: {
      title: "Watch on Instagram",
      subtitle: "Short health tips from @vijayshreehealthcare"
    },
    /* `thumb` is ONLY used for the small preview tiles on the Home page.
       Instagram does not allow websites to fetch reel cover images automatically
       (YouTube does, Instagram doesn't), so these have to be added by hand — once:

         1. Open the reel, screenshot its cover frame (or reuse the cover you designed)
         2. Save it into  assets/images/reels/  as reel-1.jpg, reel-2.jpg ...
         3. Write that path in `thumb` below

       Leave `thumb` empty and the tile falls back to a coloured gradient — the site
       still works, it just looks plainer. The Blogs page is unaffected either way:
       the reels there are real live Instagram embeds and show their own covers.     */
    instagramVideos: [
      { url: "https://www.instagram.com/reel/DdBm0Afphbv/", caption: "", thumb: "assets/images/reels/reel-1.jpg" },
      { url: "https://www.instagram.com/reel/DcK02SRKrvo/", caption: "", thumb: "assets/images/reels/reel-2.jpg" },
      { url: "https://www.instagram.com/reel/DbpRKCnKaID/", caption: "", thumb: "assets/images/reels/reel-3.jpg" },
      { url: "https://www.instagram.com/reel/Db98ZStKn40/", caption: "", thumb: "assets/images/reels/reel-4.jpg" },
      { url: "https://www.instagram.com/reel/DbUkAP6KKq1/", caption: "", thumb: "assets/images/reels/reel-5.jpg" }
    ]
  },

  /* ---------- 6. CONTACT PAGE ---------- */
  contact: {
    // Section headings on the Contact page
    labels: {
      clinicEyebrow: "Visit The Clinic",
      clinicTitle: "Clinic Information",
      faqEyebrow: "FAQ"
    },

    hero: {
      title: "Get In Touch",
      subtitle: "Book an appointment or ask a quick question — WhatsApp is usually the fastest way to reach us."
    },
    quickActions: {
      whatsappTitle: "Chat on WhatsApp",
      whatsappDesc: "Fastest way to book an appointment or ask a question.",
      callTitle: "Call the Clinic",
      callDesc: "Speak directly with our front-desk team.",
      emailTitle: "Email Us",
      emailDesc: "For detailed queries or medical records."
    },
    formTitle: "Send a Message",
    formSubtitle: "Fill this in and we'll WhatsApp or call you back.",
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "Do I need an appointment or can I walk in?", a: "Walk-ins are welcome during OPD hours, but an appointment means far less waiting. Send a WhatsApp message or call and we'll give you a time." },
        { q: "What are the clinic timings?", a: "Morning OPD is 10:00 AM to 4:00 PM and evening OPD is 6:00 PM to 9:00 PM, Monday to Saturday. Sunday consultations are available by appointment — please call ahead." },
        { q: "What should I bring for my first visit?", a: "Any previous prescriptions, recent blood or sugar test reports, and a list of the medicines you currently take, including anything bought over the counter." },
        { q: "Do you treat conditions other than diabetes?", a: "Yes. Dr. Patil is a Consultant Physician in Internal Medicine, treating blood pressure, asthma and COPD, TB, liver and kidney disorders, gastritis, joint pain, fevers and infections, as well as medical emergencies." },
        { q: "Can I get my reports reviewed without coming in?", a: "For an existing patient, reports can often be sent on WhatsApp for a quick review. A new diagnosis, however, needs an in-person examination first." }
      ]
    }
  },

  /* ---------- 7. FOOTER ---------- */
  footer: {
    about: "Vijayshree Healthcare, Bidar — consultant physician and diabetes care led by Dr. Sachin Patil, MBBS, MD (Internal Medicine), open all seven days.",
    quickLinksTitle: "Quick Links",
    contactTitle: "Contact",
    followTitle: "Follow Us",
    copyright: "© 2026 Vijayshree Healthcare, Bidar. All rights reserved."
  }
};
