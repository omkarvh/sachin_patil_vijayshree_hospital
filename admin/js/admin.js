/* ============================================================
   ADMIN APP — sign-in, navigation, saving, media library.
   ============================================================ */

const App = (function(){

  const state = {
    tree: null,       // working copy of the whole content tree
    dirty: false,
    section: SCHEMA[0].key,
    saving: false
  };

  const $ = sel => document.querySelector(sel);

  /* Deep clone that survives the defaults→saved merge. */
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg, kind){
    const t = $('#toast');
    t.className = 'toast show ' + (kind || '');
    t.innerHTML = `${icon(kind === 'err' ? 'alert' : 'check-circle')}<span>${msg}</span>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, kind === 'err' ? 6000 : 3000);
  }

  /* ---------------- dirty tracking ---------------- */
  function markDirty(){
    state.dirty = true;
    $('#saveBtn').classList.add('is-dirty');
    $('#dirtyDot').style.display = '';
  }
  function markClean(){
    state.dirty = false;
    $('#saveBtn').classList.remove('is-dirty');
    $('#dirtyDot').style.display = 'none';
  }

  window.addEventListener('beforeunload', e => {
    if(state.dirty){ e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------------- navigation ---------------- */

  function buildNav(){
    const nav = $('#nav');
    nav.innerHTML = '';
    SCHEMA.forEach(sec => {
      const b = document.createElement('button');
      b.className = 'nav-item' + (sec.key === state.section ? ' active' : '');
      b.innerHTML = `${icon(sec.icon)}<span>${sec.label}</span>`;
      b.addEventListener('click', () => { state.section = sec.key; render(); });
      nav.appendChild(b);
    });

    const media = document.createElement('button');
    media.className = 'nav-item' + (state.section === '__media' ? ' active' : '');
    media.innerHTML = `${icon('image')}<span>Pictures</span>`;
    media.addEventListener('click', () => { state.section = '__media'; render(); });
    nav.appendChild(media);
  }

  function render(){
    buildNav();
    const root = $('#panel');
    if(state.section === '__media') return renderMedia(root);

    const sec = SCHEMA.find(s => s.key === state.section);
    if(!state.tree[sec.key]) state.tree[sec.key] = {};
    Editors.buildSection(root, sec, state.tree[sec.key]);
    root.scrollTop = 0;
  }

  /* ---------------- media library ---------------- */

  async function renderMedia(root){
    root.innerHTML = `
      <div class="sec-head">
        <h2>Pictures</h2>
        <p class="sec-blurb">Every picture uploaded to the site. Each one is shrunk
        automatically and kept in the free database — Firebase Storage, which costs
        money, is never used.</p>
      </div>
      <section class="group"><div class="group-body" id="mediaBody">Loading…</div></section>`;

    const body = $('#mediaBody');
    try {
      const list = await DB.listMedia();
      const total = list.reduce((n,m) => n + (m.bytes||0), 0);

      body.innerHTML = `
        <div class="usage">
          <div><strong>${list.length}</strong> pictures</div>
          <div><strong>${ImageTool.prettyBytes(total)}</strong> used</div>
          <div class="usage-note">Free allowance is 1 GB — plenty of room.</div>
        </div>
        <div class="media-grid" id="mediaGrid"></div>`;

      const grid = $('#mediaGrid');
      if(!list.length){
        grid.innerHTML = `<div class="empty-note">No pictures uploaded yet. Upload one from
          any "Picture" box in the sections on the left.</div>`;
        return;
      }

      list.forEach(m => {
        const card = document.createElement('figure');
        card.className = 'media-card';
        card.innerHTML = `
          <div class="media-thumb"><span class="img-empty">${icon('image')}</span></div>
          <figcaption>
            <div class="media-name">${m.name || 'image'}</div>
            <div class="media-meta">${ImageTool.prettyBytes(m.bytes||0)}${m.w ? ` · ${m.w}×${m.h}` : ''}</div>
            <code class="media-id">media:${m.id}</code>
          </figcaption>
          <button class="icon-btn danger media-del" title="Delete">${icon('trash')}</button>`;
        grid.appendChild(card);

        DB.getMedia(m.id).then(url => {
          if(url) card.querySelector('.media-thumb').innerHTML = `<img src="${url}" alt="">`;
        });

        card.querySelector('.media-del').addEventListener('click', async () => {
          if(!confirm(`Delete this picture permanently?\n\nIf it is still used anywhere on the site, that spot will go blank.`)) return;
          try { await DB.deleteMedia(m.id); toast('Picture deleted'); renderMedia(root); }
          catch(err){ toast(err.message, 'err'); }
        });
      });
    } catch(err){
      body.innerHTML = `<div class="empty-note">Could not load pictures: ${err.message}</div>`;
    }
  }

  /* ---------------- saving ---------------- */

  async function save(){
    if(state.saving) return;
    state.saving = true;
    const btn = $('#saveBtn');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `${icon('save')} Saving…`;
    try {
      const res = await DB.saveContent(state.tree);
      markClean();
      toast(`Published · ${ImageTool.prettyBytes(res.bytes)} of content`);
    } catch(err){
      toast(err.message, 'err');
    } finally {
      state.saving = false;
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  /* Throws away unsaved edits and reloads what is actually published. */
  async function revert(){
    if(state.dirty && !confirm('Discard your unsaved changes?')) return;
    await loadTree();
    markClean();
    render();
    toast('Reloaded the published version');
  }

  /* ---------------- boot ---------------- */

  async function loadTree(){
    // Start from the site's built-in defaults, then layer saved content on top,
    // so a brand-new database still gives the clinic a full site to edit.
    const base = clone(CONTENT);
    let saved = null;
    try { saved = await DB.loadContent(); }
    catch(err){ console.warn('load failed', err); }
    if(saved) Store.deepMergeInto(base, saved);
    state.tree = base;
  }

  function showApp(user){
    $('#login').style.display = 'none';
    $('#app').style.display = '';
    $('#whoami').textContent = user && user.email ? user.email : 'signed in';
  }

  async function start(user){
    showApp(user);
    await loadTree();
    Editors.setDirtyHandler(markDirty);
    markClean();
    render();
  }

  async function init(){
    // Mode banner
    if(IS_LOCAL_MODE){
      $('#modeBanner').style.display = '';
    }

    let mode;
    try { mode = await DB.init(); }
    catch(err){
      $('#loginError').textContent = err.message;
      $('#loginError').style.display = '';
      return;
    }

    if(mode.mode === 'local'){
      // No Firebase yet — go straight in; nothing leaves this browser.
      await start({ email:'local preview' });
      return;
    }

    DB.onAuth(async user => {
      if(user) await start(user);
      else {
        $('#app').style.display = 'none';
        $('#login').style.display = '';
      }
    });
  }

  /* ---------------- wire up ---------------- */

  document.addEventListener('DOMContentLoaded', () => {
    $('#saveBtn').addEventListener('click', save);
    $('#revertBtn').addEventListener('click', revert);

    $('#logoutBtn').addEventListener('click', async () => {
      if(state.dirty && !confirm('You have unsaved changes. Sign out anyway?')) return;
      await DB.signOut();
      location.reload();
    });

    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const err = $('#loginError');
      err.style.display = 'none';
      const btn = $('#loginBtn');
      btn.disabled = true; btn.textContent = 'Signing in…';
      try {
        await DB.signIn($('#email').value, $('#password').value);
      } catch(ex){
        err.textContent = friendlyAuthError(ex);
        err.style.display = '';
      } finally {
        btn.disabled = false; btn.textContent = 'Sign in';
      }
    });

    // Ctrl/Cmd+S saves
    document.addEventListener('keydown', e => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
        e.preventDefault();
        if($('#app').style.display !== 'none') save();
      }
    });

    init();
  });

  function friendlyAuthError(ex){
    const code = (ex && ex.code) || '';
    if(code.includes('wrong-password') || code.includes('invalid-credential'))
      return 'That email and password do not match.';
    if(code.includes('user-not-found')) return 'No account found for that email.';
    if(code.includes('too-many-requests')) return 'Too many attempts. Please wait a minute and try again.';
    if(code.includes('network')) return 'No internet connection.';
    return (ex && ex.message) || 'Could not sign in.';
  }

  return { save, state };
})();
