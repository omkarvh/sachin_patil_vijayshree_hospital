# GlucoCare — Diabetologist Website

Static site (HTML + CSS + vanilla JS). No build step, no Node, no hosting requirements —
upload the folder to any host (Hostinger, cPanel, Netlify drop, GitHub Pages) and it works.

## Run it

Just double-click `index.html`. (Or serve the folder with any static server.)

## Everything is edited in ONE file: `content.js`

| What you want to change | Where in `content.js` |
|---|---|
| Doctor name, clinic name, tagline | `site` |
| Phone number / WhatsApp number | `site.phoneDisplay`, `site.phoneDial`, `site.whatsappNumber` |
| Address, map, working hours | `site.address`, `site.mapEmbedUrl`, `site.workingHours` |
| Instagram / social links | `site.social` |
| Home page text, stats, services, testimonials | `home` |
| Home page video | `home.hero.video` |
| Doctor bio, credentials, timeline | `about` |
| Blog articles | `blogs.posts` |
| **Instagram videos shown on Blogs page** | `blogs.instagramVideos` |
| Contact page + FAQ | `contact` |

### Loading screen
Controlled by `preloader` in content.js:

```js
preloader: {
  enabled: true,       // false switches the loading screen off completely
  tagline: "Trusted Everyday Care in Bidar",
  minDuration: 700,    // always show for at least this long (milliseconds)
  maxDuration: 3000    // never hold the visitor longer than this
}
```

It shows the clinic logo, name and an ECG heartbeat line while the page loads, then fades
away. `maxDuration` is a safety net — even on a very slow connection the visitor is never
stuck behind it. The logo and clinic name come from the `site` section automatically.

**Loading sound** (`preloader.sound`): a short chime plays while the loader is up.

```js
sound: { enabled: true, src: "assets/audio/loading-chime.wav", volume: 0.35 }
```

⚠️ **Browsers block sound on page load.** Chrome, Safari and Firefox all refuse to play
audio until the visitor has clicked something on the site. So the chime usually stays
silent for a first-time visitor and plays when they move between pages. This is a browser
rule that cannot be worked around — when it is blocked the page simply loads quietly,
nothing breaks and no error appears.

Swap in your own clip by replacing the file (mp3 and wav both work) or pointing `src`
somewhere else. `enabled: false` turns it off entirely.

### Hero background video (the silent looping clip behind the headline)
`home.hero.backgroundVideo` in `content.js`. There are **two modes** — change `type` to switch:

```js
backgroundVideo: {
  type: "youtube",          // "youtube" or "mp4"

  youtubeId: "lEsyGm4T2Mo", // used when type is "youtube"
  startAt: 3,               // skip intro seconds
  zoom: 2.4,                // enlarge to fill the banner
  offsetY: -4,              // slide framing up (-) or down (+)

  src: "assets/video/hero-bg.mp4",   // used when type is "mp4"
  poster: "assets/images/clinic-reception.jpg"
}
```

**type: "youtube"** — plays a real video from the clinic's channel. Nothing to upload.
Because the clinic's videos are vertical Reels sitting inside a wide frame, they only fill
the middle of a wide screen at `zoom: 1`. `zoom: 2.4` crops them to fill the banner properly.
Zooming softens the picture slightly, since it enlarges part of the frame.

**type: "mp4"** — sharpest and fastest, but needs a file at `assets/video/hero-bg.mp4`.
For the best possible hero, record **15–20 seconds of landscape (horizontal) footage** —
the doctor consulting, or talking to camera — keep it under ~10MB and replace that file.
No zoom is then needed. The file there now is temporary stock footage.

Either way the video is **always silent** and loops — it's a background, not a player.

### Home page intro video (the "Watch Intro Video" popup)
```js
video: { type: "youtube", src: "VIDEO_ID" }          // YouTube: paste only the ID (after v=)
video: { type: "mp4", src: "assets/video/intro.mp4" } // Or a local video file
```

### Writing a blog article
Clicking "Read Article" on any card (Home or Blogs page) opens the full article in a popup.
The full text lives in that post's `content` list in `blogs.posts`. Four block types are available:

```js
content: [
  { type: "para",    text: "A normal paragraph." },
  { type: "heading", text: "A sub-heading" },
  { type: "list",    items: ["First point", "Second point"] },
  { type: "quote",   text: "A highlighted takeaway." }
]
```

Mix them in any order, as many as you like. The popup automatically adds the doctor's name,
a medical disclaimer and a WhatsApp button (pre-filled with the article title) at the bottom —
edit those in `blogs.articleModal`.

To add a new article, copy an existing `{ ... }` block inside `blogs.posts` and edit it.
The newest posts (top of the list) are the ones that show on the Home page.

### YouTube videos on the Blogs page
Paste any YouTube link into `blogs.youtubeVideos` and it plays in a popup on your own site:

```js
youtubeVideos: [
  { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: "Video title shown under the thumbnail" }
]
```

Every link format works — `watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, with or without `&t=`.
Thumbnails are pulled from YouTube automatically; the video itself only loads when someone
clicks, so the page stays fast.

### Instagram reel thumbnails (Home page tiles)
The small reel tiles in the "Follow Along" section on the Home page use `thumb` in each
`blogs.instagramVideos` entry. **Instagram does not let websites fetch reel covers
automatically** (unlike YouTube), so these have to be added by hand, once:

1. Open the reel, screenshot its cover frame (or reuse the cover image you designed)
2. Save it into `assets/images/reels/` as `reel-1.jpg`, `reel-2.jpg` …
3. That path is already written in `thumb` in content.js — the tile picks it up

Leave `thumb` empty (or the file missing) and the tile falls back to a coloured gradient
with a play icon. Nothing breaks either way. The Blogs page is unaffected — the reels
there are live Instagram embeds that show their own covers.

### Instagram videos on the Blogs page
The doctor's Instagram Reels are embedded **live** using Instagram's official embed —
no API key, no token, nothing expires. To add a video:

1. Open the Reel/post on instagram.com
2. Copy the URL, e.g. `https://www.instagram.com/reel/Cxxxxxxxxxx/`
3. Paste it into `blogs.instagramVideos` in `content.js`

```js
instagramVideos: [
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", caption: "Your caption here" }
]
```

> The URLs currently in `content.js` are placeholders and will show blank boxes until you
> replace them with the doctor's real Reel URLs. The Instagram account must be **public**.

## Booking flow
- Every "Book Appointment" button opens WhatsApp with a pre-filled message (`wa.me`).
- Every phone button dials directly (`tel:`) on mobile.
- The contact form has no backend — it builds a WhatsApp message from the fields and opens
  WhatsApp. Nothing is stored on the site, so there's no server to maintain.

## Images
Image paths in `content.js` currently point at free stock photos so the site looks complete
out of the box. Replace each URL with a local file once you have real photos:

1. Put the photo in `assets/images/` (e.g. `doctor-portrait.jpg`)
2. In `content.js`, change the long `https://images.unsplash.com/...` URL to `"assets/images/doctor-portrait.jpg"`

Needed: the doctor's portrait (tall, 4:5) and six blog thumbnails (16:10).

## Design
Palette: midnight navy base, neon-mint primary (`#00E5A0`), electric violet secondary (`#7C5CFF`).
Dark and light sections alternate down the page. All colors live as CSS variables at the top of
`css/style.css` — change `--mint-400` / `--violet-500` there to re-skin the entire site.

## Files
```
index.html / about.html / blogs.html / contact.html
content.js          ← all editable content
css/style.css       ← design system, animations
js/icons.js         ← inline SVG icon set
js/main.js          ← navbar, footer, WhatsApp float, scroll animations
js/home.js  js/about.js  js/blogs.js  js/contact.js
```
