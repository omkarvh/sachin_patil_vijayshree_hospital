/* ============================================================
   ADMIN DATA LAYER
   ------------------------------------------------------------
   One API, two backends:

     LOCAL MODE    — saves into this browser's storage. No Firebase
                     account needed; perfect for building/testing.
     FIREBASE MODE — signs in with Firebase Auth and reads/writes
                     Firestore. Switches on automatically the moment
                     js/firebase-config.js is filled in.

   IMAGES: Firebase Storage is deliberately never used (it needs the
   paid Blaze plan). Pictures are compressed in the browser and stored
   as data-URLs inside Firestore documents, which is free.
   ============================================================ */

const DB = (function(){

  const LS_CONTENT = 'vh_content';
  const LS_MEDIA   = 'vh_localmedia_';        // + id   (store.js reads this too)
  const LS_MEDIA_IX= 'vh_localmedia_index';

  /* Firestore hard limit is 1 MiB per document. Stay well under it so a
     document always fits with room for its metadata. */
  const MAX_DOC_BYTES = 900 * 1024;

  let fb = null;      // { app, auth, db }  in Firebase mode

  /* ---------------- init / auth ---------------- */

  async function init(){
    if(IS_LOCAL_MODE) return { mode:'local' };

    if(typeof firebase === 'undefined')
      throw new Error('Firebase SDK failed to load. Check your internet connection.');

    const app  = firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth();
    const db   = firebase.firestore();
    fb = { app, auth, db };
    return { mode:'firebase' };
  }

  function onAuth(cb){
    if(IS_LOCAL_MODE){ cb({ email:'local@device', local:true }); return () => {}; }
    return fb.auth.onAuthStateChanged(u => cb(u));
  }

  async function signIn(email, password){
    if(IS_LOCAL_MODE) return { email, local:true };
    if(ADMIN_EMAIL && email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase())
      throw new Error('This account is not allowed to manage the site.');
    const cred = await fb.auth.signInWithEmailAndPassword(email.trim(), password);
    return cred.user;
  }

  async function signOut(){
    if(IS_LOCAL_MODE) return;
    await fb.auth.signOut();
  }

  /* ---------------- content ---------------- */

  async function loadContent(){
    if(IS_LOCAL_MODE){
      try { return JSON.parse(localStorage.getItem(LS_CONTENT) || 'null'); }
      catch { return null; }
    }
    const snap = await fb.db.collection('site').doc('content').get();
    if(!snap.exists) return null;
    const d = snap.data();
    return d && d.data ? d.data : d;
  }

  async function saveContent(tree){
    const payload = JSON.parse(JSON.stringify(tree));
    const bytes = new Blob([JSON.stringify(payload)]).size;
    if(bytes > MAX_DOC_BYTES){
      throw new Error(
        `Content is ${(bytes/1024).toFixed(0)} KB, over the ${(MAX_DOC_BYTES/1024).toFixed(0)} KB ` +
        `limit for one database record. Remove some text or images and try again.`
      );
    }

    if(IS_LOCAL_MODE){
      localStorage.setItem(LS_CONTENT, JSON.stringify(payload));
      return { bytes };
    }
    await fb.db.collection('site').doc('content').set({
      data: payload,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { bytes };
  }

  /* ---------------- media ----------------
     Ids are minted fresh on every upload and never reused, so a replaced
     picture always gets a new id — which makes every cache everywhere
     self-invalidating with no version tracking. */

  function newId(){
    return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function localIndex(){
    try { return JSON.parse(localStorage.getItem(LS_MEDIA_IX) || '[]'); }
    catch { return []; }
  }
  function setLocalIndex(list){
    localStorage.setItem(LS_MEDIA_IX, JSON.stringify(list));
  }

  /* Stores an already-compressed data URL. Returns the new media id. */
  async function putMedia(dataUrl, meta){
    const id = newId();
    const bytes = dataUrl.length;

    if(bytes > MAX_DOC_BYTES)
      throw new Error(`That picture is still ${(bytes/1024).toFixed(0)} KB after compressing — too large to store.`);

    const record = {
      dataUrl,
      name:  (meta && meta.name)  || 'image',
      w:     (meta && meta.w)     || 0,
      h:     (meta && meta.h)     || 0,
      bytes
    };

    if(IS_LOCAL_MODE){
      try { localStorage.setItem(LS_MEDIA + id, dataUrl); }
      catch { throw new Error('This browser is out of local storage. Delete some images and retry.'); }
      const ix = localIndex();
      ix.unshift({ id, name:record.name, bytes, w:record.w, h:record.h, createdAt:Date.now() });
      setLocalIndex(ix);
      return id;
    }

    await fb.db.collection('media').doc(id).set({
      ...record,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return id;
  }

  async function getMedia(id){
    if(IS_LOCAL_MODE){
      try { return localStorage.getItem(LS_MEDIA + id); } catch { return null; }
    }
    const snap = await fb.db.collection('media').doc(id).get();
    return snap.exists ? snap.data().dataUrl : null;
  }

  async function listMedia(){
    if(IS_LOCAL_MODE) return localIndex();
    const snap = await fb.db.collection('media').orderBy('createdAt','desc').limit(200).get();
    return snap.docs.map(d => {
      const v = d.data();
      return { id:d.id, name:v.name, bytes:v.bytes, w:v.w, h:v.h,
               createdAt: v.createdAt ? v.createdAt.toMillis() : 0 };
    });
  }

  async function deleteMedia(id){
    if(IS_LOCAL_MODE){
      localStorage.removeItem(LS_MEDIA + id);
      setLocalIndex(localIndex().filter(m => m.id !== id));
      return;
    }
    await fb.db.collection('media').doc(id).delete();
  }

  /* Total bytes held in media — shown in the admin so the free tier
     (1 GiB on Firestore) is never a surprise. */
  async function mediaUsage(){
    const list = await listMedia();
    return {
      count: list.length,
      bytes: list.reduce((n, m) => n + (m.bytes || 0), 0)
    };
  }

  return {
    init, onAuth, signIn, signOut,
    loadContent, saveContent,
    putMedia, getMedia, listMedia, deleteMedia, mediaUsage,
    MAX_DOC_BYTES
  };
})();
