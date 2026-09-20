/* ============================================================
   FORM BUILDER
   ------------------------------------------------------------
   Turns SCHEMA into real inputs bound to the content tree.
   Every change writes straight back into the tree; the Save
   button is what actually publishes it.
   ============================================================ */

const Editors = (function(){

  let dirtyCb = () => {};
  function setDirtyHandler(fn){ dirtyCb = fn; }

  /* Fields carrying a `showIf` hide themselves when their controlling field
     doesn't match — e.g. the YouTube box only appears when the source is
     set to YouTube. Re-checked after every edit. */
  let conditionals = [];
  function refreshConditions(){
    conditionals.forEach(({ box, def, node }) => {
      const cur = getPath(node, def.showIf.path);
      box.style.display = (cur === def.showIf.equals) ? '' : 'none';
    });
  }

  /* Every field handler calls this; it keeps conditions in sync and then
     tells the app something changed. */
  function onDirty(){
    refreshConditions();
    dirtyCb();
  }

  /* ---------- path helpers ---------- */

  function getPath(obj, path){
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function setPath(obj, path, value){
    const keys = path.split('.');
    const last = keys.pop();
    let cur = obj;
    for(const k of keys){
      if(cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    cur[last] = value;
  }

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if(cls) n.className = cls;
    if(html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  /* ---------- individual field types ---------- */

  function labelBlock(def){
    const wrap = el('div','fld-head');
    wrap.appendChild(el('label','fld-label', esc(def.label)));
    if(def.hint) wrap.appendChild(el('span','fld-hint', esc(def.hint)));
    return wrap;
  }

  function textField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));
    const input = def.type === 'textarea' ? el('textarea','inp') : el('input','inp');
    if(def.type !== 'textarea') input.type = def.type === 'number' ? 'number' : 'text';
    input.value = getPath(node, def.path) ?? '';
    if(def.type === 'textarea') input.rows = 3;
    input.addEventListener('input', () => {
      const v = def.type === 'number'
        ? (input.value === '' ? '' : Number(input.value))
        : input.value;
      setPath(node, def.path, v);
      onDirty();
    });
    box.appendChild(input);
    root.appendChild(box);
  }

  function boolField(root, def, node){
    const box = el('div','fld fld-bool');
    const sw = el('label','switch');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.checked = getPath(node, def.path) !== false;
    cb.addEventListener('change', () => { setPath(node, def.path, cb.checked); onDirty(); });
    sw.appendChild(cb);
    sw.appendChild(el('span','slider'));
    box.appendChild(sw);
    const txt = el('div','');
    txt.appendChild(el('label','fld-label', esc(def.label)));
    if(def.hint) txt.appendChild(el('span','fld-hint', esc(def.hint)));
    box.appendChild(txt);
    root.appendChild(box);
  }

  function selectField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));
    const sel = el('select','inp');
    (def.options || []).forEach(o => {
      const opt = el('option', null, esc(o.t));
      opt.value = o.v;
      sel.appendChild(opt);
    });
    sel.value = getPath(node, def.path) ?? (def.options[0] && def.options[0].v);
    sel.addEventListener('change', () => { setPath(node, def.path, sel.value); onDirty(); });
    box.appendChild(sel);
    root.appendChild(box);
  }

  function iconField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));
    const sel = el('select','inp');
    ICON_CHOICES.forEach(name => {
      const opt = el('option', null, name);
      opt.value = name;
      sel.appendChild(opt);
    });
    const cur = getPath(node, def.path);
    if(cur && !ICON_CHOICES.includes(cur)){
      const opt = el('option', null, cur); opt.value = cur; sel.appendChild(opt);
    }
    sel.value = cur || 'activity';
    const prev = el('span','icon-preview', icon(sel.value));
    sel.addEventListener('change', () => {
      setPath(node, def.path, sel.value);
      prev.innerHTML = icon(sel.value);
      onDirty();
    });
    const row = el('div','icon-row');
    row.appendChild(sel); row.appendChild(prev);
    box.appendChild(row);
    root.appendChild(box);
  }

  /* ---------- image ---------- */

  function imageField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));

    const wrap = el('div','img-field');
    const preview = el('div','img-preview');
    const controls = el('div','img-controls');

    const fileInput = el('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    const btnUp  = el('button','btn btn-sm', `${icon('upload')} Upload`);
    const btnClr = el('button','btn btn-sm btn-ghost', `${icon('trash')} Remove`);
    btnUp.type = btnClr.type = 'button';
    const status = el('div','img-status');

    function paint(){
      const val = getPath(node, def.path);
      if(!val){
        preview.innerHTML = `<span class="img-empty">${icon('image')}<span>No picture</span></span>`;
        btnClr.style.display = 'none';
        return;
      }
      btnClr.style.display = '';
      // A saved reference resolves to a real picture only after publishing;
      // show what we can either way.
      if(String(val).startsWith('media:')){
        const id = String(val).slice(6);
        preview.innerHTML = `<span class="img-empty">${icon('image')}<span>Stored picture</span></span>`;
        DB.getMedia(id).then(url => { if(url) preview.innerHTML = `<img src="${url}" alt="">`; });
      } else {
        // Content stores site-root-relative paths ("assets/images/x.jpg").
        // The admin lives one folder deeper, so step back up for the preview.
        const src = /^(https?:|data:|blob:|\/)/.test(val) ? val : '../' + val;
        const img = el('img');
        img.src = src;
        img.alt = '';
        img.addEventListener('error', () => {
          preview.innerHTML = `<span class="img-empty">${icon('image')}<span>not found</span></span>`;
        });
        preview.innerHTML = '';
        preview.appendChild(img);
      }
    }

    btnUp.addEventListener('click', () => fileInput.click());
    btnClr.addEventListener('click', () => {
      setPath(node, def.path, '');
      status.textContent = '';
      paint(); onDirty();
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if(!file) return;
      status.className = 'img-status';
      status.textContent = 'Compressing…';
      try {
        const out = await ImageTool.compress(file, def.kind || 'default');
        status.textContent = 'Saving…';
        const id = await DB.putMedia(out.dataUrl, { name: out.name, w: out.w, h: out.h });
        setPath(node, def.path, 'media:' + id);
        status.className = 'img-status ok';
        status.textContent =
          `${ImageTool.prettyBytes(out.originalBytes)} → ${ImageTool.prettyBytes(out.bytes)} · ${out.w}×${out.h}`;
        paint(); onDirty();
      } catch(err){
        status.className = 'img-status err';
        status.textContent = err.message;
      } finally {
        fileInput.value = '';
      }
    });

    controls.appendChild(btnUp);
    controls.appendChild(btnClr);
    controls.appendChild(fileInput);
    wrap.appendChild(preview);
    const right = el('div','img-right');
    right.appendChild(controls);
    right.appendChild(status);
    wrap.appendChild(right);
    box.appendChild(wrap);
    root.appendChild(box);
    paint();
  }

  /* ---------- list of plain strings ---------- */

  function stringsField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));
    const list = el('div','strings');

    function draw(){
      const arr = getPath(node, def.path) || [];
      list.innerHTML = '';
      arr.forEach((val, i) => {
        const row = el('div','string-row');
        const inp = el('textarea','inp');
        inp.rows = 1;
        inp.value = val;
        inp.addEventListener('input', () => {
          const a = getPath(node, def.path); a[i] = inp.value; onDirty();
        });
        const up = el('button','icon-btn', icon('arrow-right'));
        up.type='button'; up.title='Move up'; up.style.transform='rotate(-90deg)';
        up.addEventListener('click', () => {
          const a = getPath(node, def.path);
          if(i > 0){ [a[i-1],a[i]] = [a[i],a[i-1]]; draw(); onDirty(); }
        });
        const del = el('button','icon-btn danger', icon('trash'));
        del.type='button'; del.title='Delete';
        del.addEventListener('click', () => {
          const a = getPath(node, def.path); a.splice(i,1); draw(); onDirty();
        });
        row.appendChild(inp); row.appendChild(up); row.appendChild(del);
        list.appendChild(row);
      });
      const add = el('button','btn btn-sm btn-ghost', `${icon('plus')} Add line`);
      add.type='button';
      add.addEventListener('click', () => {
        let a = getPath(node, def.path);
        if(!Array.isArray(a)){ a = []; setPath(node, def.path, a); }
        a.push(''); draw(); onDirty();
      });
      list.appendChild(add);
    }
    draw();
    box.appendChild(list);
    root.appendChild(box);
  }

  /* ---------- article body blocks ---------- */

  const BLOCK_TYPES = [
    { v:'para',    t:'Paragraph' },
    { v:'heading', t:'Sub-heading' },
    { v:'list',    t:'Bullet list' },
    { v:'quote',   t:'Highlighted quote' }
  ];

  function blocksField(root, def, node){
    const box = el('div','fld');
    box.appendChild(labelBlock(def));
    const list = el('div','blocks');

    function draw(){
      let arr = getPath(node, def.path);
      if(!Array.isArray(arr)){ arr = []; setPath(node, def.path, arr); }
      list.innerHTML = '';

      arr.forEach((b, i) => {
        const card = el('div','block-card');
        const head = el('div','block-head');

        const sel = el('select','inp inp-sm');
        BLOCK_TYPES.forEach(t => {
          const o = el('option', null, t.t); o.value = t.v; sel.appendChild(o);
        });
        sel.value = b.type || 'para';
        sel.addEventListener('change', () => {
          b.type = sel.value;
          if(b.type === 'list' && !Array.isArray(b.items)) b.items = [''];
          if(b.type !== 'list' && b.text == null) b.text = '';
          draw(); onDirty();
        });

        const up = el('button','icon-btn', icon('arrow-right'));
        up.type='button'; up.title='Move up'; up.style.transform='rotate(-90deg)';
        up.addEventListener('click', () => {
          if(i > 0){ [arr[i-1],arr[i]] = [arr[i],arr[i-1]]; draw(); onDirty(); }
        });
        const down = el('button','icon-btn', icon('arrow-right'));
        down.type='button'; down.title='Move down'; down.style.transform='rotate(90deg)';
        down.addEventListener('click', () => {
          if(i < arr.length-1){ [arr[i+1],arr[i]] = [arr[i],arr[i+1]]; draw(); onDirty(); }
        });
        const del = el('button','icon-btn danger', icon('trash'));
        del.type='button'; del.title='Delete block';
        del.addEventListener('click', () => { arr.splice(i,1); draw(); onDirty(); });

        head.appendChild(sel);
        const spacer = el('div','spacer'); head.appendChild(spacer);
        head.appendChild(up); head.appendChild(down); head.appendChild(del);
        card.appendChild(head);

        if(b.type === 'list'){
          if(!Array.isArray(b.items)) b.items = [''];
          b.items.forEach((it, j) => {
            const row = el('div','string-row');
            const inp = el('input','inp');
            inp.value = it;
            inp.addEventListener('input', () => { b.items[j] = inp.value; onDirty(); });
            const rm = el('button','icon-btn danger', icon('trash'));
            rm.type='button';
            rm.addEventListener('click', () => { b.items.splice(j,1); draw(); onDirty(); });
            row.appendChild(inp); row.appendChild(rm);
            card.appendChild(row);
          });
          const addIt = el('button','btn btn-sm btn-ghost', `${icon('plus')} Add bullet`);
          addIt.type='button';
          addIt.addEventListener('click', () => { b.items.push(''); draw(); onDirty(); });
          card.appendChild(addIt);
        } else {
          const ta = el('textarea','inp');
          ta.rows = b.type === 'heading' ? 1 : 3;
          ta.value = b.text || '';
          ta.addEventListener('input', () => { b.text = ta.value; onDirty(); });
          card.appendChild(ta);
        }
        list.appendChild(card);
      });

      const bar = el('div','block-add');
      BLOCK_TYPES.forEach(t => {
        const btn = el('button','btn btn-sm btn-ghost', `${icon('plus')} ${t.t}`);
        btn.type='button';
        btn.addEventListener('click', () => {
          arr.push(t.v === 'list' ? { type:'list', items:[''] } : { type:t.v, text:'' });
          draw(); onDirty();
        });
        bar.appendChild(btn);
      });
      list.appendChild(bar);
    }
    draw();
    box.appendChild(list);
    root.appendChild(box);
  }

  /* ---------- list of records ---------- */

  function listField(root, def, node){
    const box = el('div','fld fld-list');
    box.appendChild(labelBlock(def));
    const list = el('div','records');

    function draw(){
      let arr = getPath(node, def.path);
      if(!Array.isArray(arr)){ arr = []; setPath(node, def.path, arr); }
      list.innerHTML = '';

      if(!arr.length) list.appendChild(el('div','empty-note','Nothing here yet — use the button below to add the first one.'));

      arr.forEach((rec, i) => {
        const card = el('div','record');
        const head = el('div','record-head');
        const title = (def.titleKey && rec[def.titleKey]) ? rec[def.titleKey] : `Item ${i+1}`;
        head.appendChild(el('div','record-title', esc(String(title).slice(0,70))));

        const tools = el('div','record-tools');
        const up = el('button','icon-btn', icon('arrow-right'));
        up.type='button'; up.title='Move up'; up.style.transform='rotate(-90deg)';
        up.addEventListener('click', e => {
          e.stopPropagation();
          if(i > 0){ [arr[i-1],arr[i]] = [arr[i],arr[i-1]]; draw(); onDirty(); }
        });
        const down = el('button','icon-btn', icon('arrow-right'));
        down.type='button'; down.title='Move down'; down.style.transform='rotate(90deg)';
        down.addEventListener('click', e => {
          e.stopPropagation();
          if(i < arr.length-1){ [arr[i+1],arr[i]] = [arr[i],arr[i+1]]; draw(); onDirty(); }
        });
        const del = el('button','icon-btn danger', icon('trash'));
        del.type='button'; del.title='Delete';
        del.addEventListener('click', e => {
          e.stopPropagation();
          if(confirm(`Delete "${title}"? This cannot be undone.`)){
            arr.splice(i,1); draw(); onDirty();
          }
        });
        const toggle = el('button','icon-btn', icon('chevron-down'));
        toggle.type='button'; toggle.title='Open / close';

        tools.appendChild(up); tools.appendChild(down);
        tools.appendChild(del); tools.appendChild(toggle);
        head.appendChild(tools);

        const body = el('div','record-body');
        def.item.forEach(f => buildField(body, f, rec));

        const openIt = () => {
          card.classList.toggle('open');
          toggle.style.transform = card.classList.contains('open') ? 'rotate(180deg)' : '';
        };
        head.addEventListener('click', openIt);
        toggle.addEventListener('click', e => { e.stopPropagation(); openIt(); });

        card.appendChild(head);
        card.appendChild(body);
        list.appendChild(card);
      });

      const add = el('button','btn btn-sm', `${icon('plus')} Add`);
      add.type='button';
      add.addEventListener('click', () => {
        const blank = {};
        def.item.forEach(f => {
          blank[f.path] = f.type === 'blocks' ? [{ type:'para', text:'' }]
                        : f.type === 'number' ? 0 : '';
        });
        arr.push(blank); draw(); onDirty();
        const last = list.querySelectorAll('.record');
        if(last.length) last[last.length-1].classList.add('open');
      });
      list.appendChild(add);
    }
    draw();
    box.appendChild(list);
    root.appendChild(box);
  }

  /* ---------- dispatcher ---------- */

  function buildField(root, def, node){
    const before = root.childElementCount;
    switch(def.type){
      case 'bool':     boolField(root, def, node); break;
      case 'select':   selectField(root, def, node); break;
      case 'icon':     iconField(root, def, node); break;
      case 'image':    imageField(root, def, node); break;
      case 'strings':  stringsField(root, def, node); break;
      case 'blocks':   blocksField(root, def, node); break;
      case 'list':     listField(root, def, node); break;
      default:         textField(root, def, node);
    }
    // Each builder appends exactly one box — that's the one to show/hide.
    if(def.showIf){
      const box = root.children[before];
      if(box) conditionals.push({ box, def, node });
    }
  }

  /* Renders a whole schema section into `root`, bound to `sectionNode`. */
  function buildSection(root, section, sectionNode){
    root.innerHTML = '';
    conditionals = [];
    const head = el('div','sec-head');
    head.appendChild(el('h2', null, esc(section.label)));
    if(section.blurb) head.appendChild(el('p','sec-blurb', esc(section.blurb)));
    root.appendChild(head);

    section.groups.forEach(g => {
      const card = el('section','group');
      const gh = el('div','group-head');
      gh.appendChild(el('h3', null, esc(g.title)));
      card.appendChild(gh);
      if(g.note) card.appendChild(el('div','group-note', `${icon('alert')}<span>${esc(g.note)}</span>`));
      const body = el('div','group-body');
      g.fields.forEach(f => buildField(body, f, sectionNode));
      card.appendChild(body);
      root.appendChild(card);
    });

    refreshConditions();   // hide anything that doesn't apply right now
  }

  return { buildSection, buildField, getPath, setPath, setDirtyHandler };
})();
