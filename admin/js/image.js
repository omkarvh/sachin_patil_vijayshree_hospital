/* ============================================================
   IMAGE COMPRESSION (runs entirely in the browser)
   ------------------------------------------------------------
   Every picture is stored inside a database record instead of
   Firebase Storage, because Storage needs a paid plan and the
   database is free. A database record maxes out at 1 MiB, and
   base64 encoding inflates a file by about a third — so a photo
   straight off a phone (3-8 MB) must be shrunk before it can be
   stored at all.

   This resizes and re-encodes until the result fits the target,
   preferring WebP (much smaller than JPEG at the same quality)
   and falling back to JPEG on browsers that can't write WebP.
   ============================================================ */

const ImageTool = (function(){

  /* Presets per kind of picture — bigger where it shows bigger. */
  const PRESETS = {
    certificate: { maxW:1400, maxH:1400, target: 260*1024 },  // must stay readable
    portrait:    { maxW:1000, maxH:1250, target: 220*1024 },
    cover:       { maxW:1400, maxH:1000, target: 240*1024 },
    thumb:       { maxW: 800, maxH: 800,  target: 140*1024 },
    logo:        { maxW: 600, maxH: 600,  target:  90*1024 },
    default:     { maxW:1200, maxH:1200, target: 200*1024 }
  };

  function readFile(file){
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload  = () => resolve(fr.result);
      fr.onerror = () => reject(new Error('Could not read that file.'));
      fr.readAsDataURL(file);
    });
  }

  function loadImage(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error('That file is not an image this browser can open.'));
      img.src = src;
    });
  }

  /* Does this browser actually produce WebP from a canvas? */
  let webpOk = null;
  function supportsWebp(){
    if(webpOk !== null) return webpOk;
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    webpOk = c.toDataURL('image/webp').startsWith('data:image/webp');
    return webpOk;
  }

  function drawScaled(img, w, h){
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // White behind transparency so PNG logos don't turn black in JPEG.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  /* Compress `file` down to the preset's byte target.
     Returns { dataUrl, w, h, bytes, originalBytes, type }. */
  async function compress(file, kind){
    if(!file.type.startsWith('image/'))
      throw new Error('Please choose an image file (JPG, PNG or WebP).');

    const preset = PRESETS[kind] || PRESETS.default;
    const src = await readFile(file);
    const img = await loadImage(src);

    // Scale so the long edge fits the preset, never enlarging a small image.
    let ratio = Math.min(preset.maxW / img.width, preset.maxH / img.height, 1);
    let w = img.width * ratio, h = img.height * ratio;

    const mime = supportsWebp() ? 'image/webp' : 'image/jpeg';
    let quality = 0.86;
    let out = drawScaled(img, w, h).toDataURL(mime, quality);

    // Step quality down, then dimensions, until it fits.
    let guard = 0;
    while(out.length > preset.target && guard++ < 12){
      if(quality > 0.42){
        quality -= 0.1;
      } else {
        w *= 0.82; h *= 0.82;
        quality = 0.72;
      }
      out = drawScaled(img, w, h).toDataURL(mime, quality);
    }

    return {
      dataUrl: out,
      w: Math.round(w),
      h: Math.round(h),
      bytes: out.length,
      originalBytes: file.size,
      type: mime,
      name: file.name
    };
  }

  function prettyBytes(n){
    if(n < 1024) return n + ' B';
    if(n < 1024*1024) return (n/1024).toFixed(0) + ' KB';
    return (n/1024/1024).toFixed(1) + ' MB';
  }

  return { compress, prettyBytes, PRESETS };
})();
