/* ============================================================
   STORE — the bridge between the website and its content.
   ------------------------------------------------------------
   content.js stays the DEFAULT content (and the safety net).
   Whatever the admin panel has saved is layered on top of it.

   Two backends, same behaviour:
     LOCAL MODE    → reads what the admin panel saved in this
                     browser (no Firebase account needed yet)
     FIREBASE MODE → reads the live content from Firestore

   Firestore is read over the plain REST API on purpose: visitors
   download ZERO Firebase SDK (~300KB saved). The admin panel is
   the only page that loads the real SDK.

   IMAGES: never Firebase Storage (that needs a paid plan). Every
   picture lives as a compressed data-URL inside its own Firestore
   document in the `media` collection, and is referenced from the
   content as the string  "media:<id>".
   ============================================================ */

const Store = (function(){

  const LS_CONTENT = 'vh_content';
  const LS_MEDIA   = 'vh_media_';       // + id
  const MEDIA_RE   = /^media:([A-Za-z0-9_-]+)$/;

  /* ---------- tiny helpers ---------- */

  const isPlainObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);

  /* Merge `src` INTO `dst`, keeping dst's object identity.
     That identity matters: main.js holds `const S = CONTENT.site`,
     so CONTENT.site must be mutated, never replaced. */
  function deepMergeInto(dst, src){
    if(!isPlainObject(src)) return dst;
    for(const key of Object.keys(src)){
      const val = src[key];
      if(Array.isArray(val)){
        dst[key] = val;                       // arrays replace wholesale
      } else if(isPlainObject(val)){
        if(!isPlainObject(dst[key])) dst[key] = {};
        deepMergeInto(dst[key], val);
      } else if(val !== undefined){
        dst[key] = val;
      }
    }
    return dst;
  }

  /* Walk every string in the tree and hand it to `fn`, replacing it
     with whatever fn returns. Used to swap "media:xyz" for a real image. */
  function mapStrings(node, fn){
    if(Array.isArray(node)){
      for(let i = 0; i < node.length; i++){
        if(typeof node[i] === 'string') node[i] = fn(node[i]);
        else mapStrings(node[i], fn);
      }
    } else if(isPlainObject(node)){
      for(const k of Object.keys(node)){
        if(typeof node[k] === 'string') node[k] = fn(node[k]);
        else mapStrings(node[k], fn);
      }
    }
    return node;
  }

  function collectMediaIds(node, out){
    out = out || new Set();
    mapStrings(JSON.parse(JSON.stringify(node)), s => {
      const m = MEDIA_RE.exec(s);
      if(m) out.add(m[1]);
      return s;
    });
    return out;
  }

  /* ---------- media cache (localStorage, best-effort) ----------
     Media ids are immutable — a re-upload mints a brand new id — so a
     cached entry can never go stale and needs no version checking. */

  function cacheGet(id){
    try { return localStorage.getItem(LS_MEDIA + id); } catch { return null; }
  }
  function cacheSet(id, dataUrl){
    // Don't let one huge picture blow the whole localStorage quota.
    if(!dataUrl || dataUrl.length > 900000) return;
    try { localStorage.setItem(LS_MEDIA + id, dataUrl); }
    catch {
      // Quota full — drop cached media and try once more.
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(LS_MEDIA))
          .forEach(k => localStorage.removeItem(k));
        localStorage.setItem(LS_MEDIA + id, dataUrl);
      } catch { /* give up quietly; the image just refetches next time */ }
    }
  }

  /* ---------- Firestore REST decoding ----------
     Firestore returns values tagged by type; turn that back into plain JS. */

  function decodeValue(v){
    if(v == null) return null;
    if('stringValue'    in v) return v.stringValue;
    if('booleanValue'   in v) return v.booleanValue;
    if('integerValue'   in v) return Number(v.integerValue);
    if('doubleValue'    in v) return Number(v.doubleValue);
    if('nullValue'      in v) return null;
    if('timestampValue' in v) return v.timestampValue;
    if('mapValue'       in v) return decodeFields(v.mapValue.fields || {});
    if('arrayValue'     in v) return (v.arrayValue.values || []).map(decodeValue);
    return null;
  }
  function decodeFields(fields){
    const out = {};
    for(const k of Object.keys(fields)) out[k] = decodeValue(fields[k]);
    return out;
  }

  function restBase(){
    return `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}` +
           `/databases/(default)/documents`;
  }

  async function restGetDoc(path){
    const url = `${restBase()}/${path}?key=${encodeURIComponent(FIREBASE_CONFIG.apiKey)}`;
    const res = await fetch(url);
    if(res.status === 404) return null;              // nothing published yet
    if(!res.ok) throw new Error(`Firestore ${res.status} on ${path}`);
    const json = await res.json();
    return decodeFields(json.fields || {});
  }

  async function restBatchGet(paths){
    if(!paths.length) return {};
    const url = `${restBase()}:batchGet?key=${encodeURIComponent(FIREBASE_CONFIG.apiKey)}`;
    const prefix = `projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: paths.map(p => prefix + p) })
    });
    if(!res.ok) throw new Error(`Firestore batchGet ${res.status}`);
    const rows = await res.json();
    const out = {};
    for(const row of rows){
      if(!row.found) continue;
      const id = row.found.name.split('/').pop();
      out[id] = decodeFields(row.found.fields || {});
    }
    return out;
  }

  /* ---------- loading content ---------- */

  async function fetchContent(){
    if(IS_LOCAL_MODE){
      try { return JSON.parse(localStorage.getItem(LS_CONTENT) || 'null'); }
      catch { return null; }
    }
    return await restGetDoc('site/content');
  }

  async function fetchMedia(ids){
    const out = {};
    const missing = [];

    for(const id of ids){
      const hit = cacheGet(id);
      if(hit) out[id] = hit;
      else missing.push(id);
    }
    if(!missing.length) return out;

    if(IS_LOCAL_MODE){
      for(const id of missing){
        try {
          const raw = localStorage.getItem('vh_localmedia_' + id);
          if(raw) out[id] = raw;
        } catch { /* ignore */ }
      }
      return out;
    }

    const docs = await restBatchGet(missing.map(id => 'media/' + id));
    for(const id of Object.keys(docs)){
      const url = docs[id].dataUrl;
      if(url){ out[id] = url; cacheSet(id, url); }
    }
    return out;
  }

  /* ---------- public API ---------- */

  /* Loads saved content and folds it into the global CONTENT object,
     in place. Safe to call before any rendering happens.
     Never throws: if anything goes wrong the site simply renders the
     defaults that shipped in content.js. */
  async function load(){
    let remote = null;
    try {
      remote = await fetchContent();
    } catch(err){
      console.warn('[store] content load failed, using defaults:', err.message);
      return { ok:false, source:'defaults' };
    }

    if(remote && remote.data) remote = remote.data;   // content doc wraps the tree
    if(!remote) return { ok:true, source:'defaults' };

    deepMergeInto(CONTENT, remote);

    // Swap every "media:<id>" reference for its actual picture.
    try {
      const ids = collectMediaIds(CONTENT);
      if(ids.size){
        const media = await fetchMedia([...ids]);
        mapStrings(CONTENT, s => {
          const m = MEDIA_RE.exec(s);
          if(!m) return s;
          return media[m[1]] || '';      // missing picture → empty, never a broken ref
        });
      }
    } catch(err){
      console.warn('[store] media load failed:', err.message);
      mapStrings(CONTENT, s => MEDIA_RE.test(s) ? '' : s);
    }

    return { ok:true, source: IS_LOCAL_MODE ? 'local' : 'firebase' };
  }

  return { load, deepMergeInto, mapStrings, collectMediaIds, decodeFields, MEDIA_RE };
})();
