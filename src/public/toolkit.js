// Toolkit modal: navegación, búsqueda, selector de lenguaje.
// Datos en window.TOOLKIT_DATA (toolkit-data.js)

(function () {
  const LANGS = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python',     label: 'Python' },
    { id: 'cpp',        label: 'C++' },
    { id: 'kotlin',     label: 'Kotlin' },
    { id: 'swift',      label: 'Swift' },
  ];

  const STORAGE_LANG = 'tk-lang';
  const STORAGE_LAST = 'tk-last';

  const data = window.TOOLKIT_DATA;
  if (!data) { console.warn('toolkit-data.js no cargo'); return; }

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'javascript';
  let currentId   = localStorage.getItem(STORAGE_LAST) || data.items[0].id;
  let query = '';

  const root        = document.getElementById('toolkit');
  const fab         = document.getElementById('toolkit-fab');
  const closeBtn    = document.getElementById('toolkit-close');
  const search      = document.getElementById('toolkit-search');
  const listEl      = document.getElementById('toolkit-list');
  const detailEl    = document.getElementById('toolkit-detail');
  const langTabsEl  = document.getElementById('toolkit-langs');
  if (!root) return;

  // ----- render -----

  function renderLangs() {
    langTabsEl.innerHTML = LANGS.map((l) =>
      `<button class="tk-lang${l.id === currentLang ? ' active' : ''}" data-lang="${l.id}">${l.label}</button>`
    ).join('');
  }

  function filteredItems() {
    const q = query.trim().toLowerCase();
    if (!q) return data.items;
    return data.items.filter((i) =>
      i.name.toLowerCase().includes(q) ||
      i.short.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }

  function renderList() {
    const items = filteredItems();
    const byCat = {};
    for (const it of items) (byCat[it.category] = byCat[it.category] || []).push(it);

    let html = '';
    for (const cat of data.categories) {
      const arr = byCat[cat.id];
      if (!arr || !arr.length) continue;
      html += `<div class="tk-cat">
        <div class="tk-cat-head">${cat.name}<span class="tk-cat-desc">${cat.desc}</span></div>
        <ul>${arr.map((it) => `
          <li>
            <button class="tk-item${it.id === currentId ? ' active' : ''}" data-id="${it.id}">
              <span class="tk-item-name">${it.name}</span>
              <span class="tk-item-short">${it.short}</span>
            </button>
          </li>`).join('')}
        </ul>
      </div>`;
    }
    if (!html) html = '<p class="tk-empty">Sin resultados.</p>';
    listEl.innerHTML = html;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderDetail() {
    const item = data.items.find((i) => i.id === currentId) || data.items[0];
    if (!item) return;
    const code = escapeHtml(item.examples[currentLang] || '// sin ejemplo en este lenguaje');
    detailEl.innerHTML = `
      <header class="tk-detail-head">
        <h2>${item.name}</h2>
        <p class="tk-short">${item.short}</p>
      </header>
      <section>
        <h3>Qué es</h3>
        <p>${item.description}</p>
      </section>
      <section>
        <h3>${item.category === 'smells' ? 'Cómo arreglarlo' : 'Cómo aplicarlo'}</h3>
        <p>${item.howToFix}</p>
      </section>
      <section>
        <h3>Ejemplo</h3>
        <pre class="tk-code">${code}</pre>
      </section>
    `;
  }

  function render() {
    renderLangs();
    renderList();
    renderDetail();
  }

  // ----- eventos -----

  function open() {
    root.classList.add('visible');
    document.body.style.overflow = 'hidden';
    setTimeout(() => search && search.focus(), 50);
  }
  function close() {
    root.classList.remove('visible');
    document.body.style.overflow = '';
  }

  fab && fab.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);

  // click fuera del panel
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });

  // teclas globales
  document.addEventListener('keydown', (e) => {
    // No activar si el usuario esta escribiendo en otro input/textarea
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';
    if (e.key === 'Escape' && root.classList.contains('visible')) {
      e.preventDefault(); close();
    } else if (e.key === '/' && !typing && !root.classList.contains('visible')) {
      e.preventDefault(); open();
    } else if ((e.key === 't' || e.key === 'T') && !typing && !root.classList.contains('visible')) {
      open();
    }
  });

  // selector de items
  listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.tk-item');
    if (!btn) return;
    currentId = btn.dataset.id;
    localStorage.setItem(STORAGE_LAST, currentId);
    // refrescar solo "active" en la lista sin re-render completo
    listEl.querySelectorAll('.tk-item.active').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderDetail();
  });

  // selector de lenguaje
  langTabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.tk-lang');
    if (!btn) return;
    currentLang = btn.dataset.lang;
    localStorage.setItem(STORAGE_LANG, currentLang);
    langTabsEl.querySelectorAll('.tk-lang.active').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderDetail();
  });

  // busqueda
  search.addEventListener('input', (e) => {
    query = e.target.value;
    renderList();
  });

  render();
})();
