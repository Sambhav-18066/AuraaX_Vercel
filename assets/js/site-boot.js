
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
  // Ensure starfield script is loaded
  (function(){
    if(!window.__stars_loaded__){
      const s = document.createElement('script');
      s.src = '/assets/js/stars.js';
      s.defer = true;
      s.onload = ()=>{ window.__stars_loaded__ = true; };
      document.head.appendChild(s);
    }
  })();

    // ensure canvas exists + inline full-viewport styles (no CSS dependency)
    var c = document.getElementById('starfield');
    if(!c){
      c = document.createElement('canvas'); c.id='starfield';
      c.style.position='fixed'; c.style.top='0'; c.style.left='0'; c.style.right='0'; c.style.bottom='0';
      c.style.width='100vw'; c.style.height='100vh'; c.style.zIndex='-2'; c.style.display='block';
      document.body.prepend(c);
    }else{
      // enforce full viewport in case existing styles restrict height
      c.style.position='fixed'; c.style.top='0'; c.style.left='0'; c.style.right='0'; c.style.bottom='0';
      c.style.width='100vw'; c.style.height='100vh'; c.style.zIndex='-2'; c.style.display='block';
    }

    // figure out asset base path (absolute vs relative include)
    var boot = document.currentScript || document.querySelector('script[src*="site-boot.js"]');
    var src  = boot && boot.getAttribute('src') || "";
    var base = (src.startsWith("/") ? "/" : "");

    function addScript(src, cb){
      if(document.querySelector('script[src="'+src+'"]')){ cb&&cb(); return; }
      var s=document.createElement('script'); s.src=src; s.onload=cb||null; document.body.appendChild(s);
    }

    // Load stars first, then scroll
    addScript(base + "assets/js/stars.js", function(){
      addScript(base + "assets/js/scroll.js");
    });
  });
})();


(function(){
  const root = document.documentElement;

  function applyTheme(mode){
    root.setAttribute('data-theme', mode);
    try{ localStorage.setItem('theme', mode); }catch(e){}
    // notify other scripts (e.g., starfield) to refresh
    window.dispatchEvent(new CustomEvent('themechange', { detail: mode }));
  }

  function initialTheme(){
    try{
      const saved = localStorage.getItem('theme');
      if(saved === 'light' || saved === 'dark') return saved;
    }catch(e){}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // init
  applyTheme(initialTheme());

  // Add a toggle into the header
  function mountToggle(){
    const header = document.querySelector('header .nav') || document.querySelector('header') || document.body;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label','Toggle color theme');
    btn.innerHTML = '<span class="icon" aria-hidden="true">🌙</span><span class="t">Theme</span>';
    btn.addEventListener('click', ()=>{
      const cur = root.getAttribute('data-theme') || 'light';
      const next = (cur === 'light') ? 'dark' : 'light';
      applyTheme(next);
      btn.querySelector('.icon').textContent = next === 'dark' ? '🌙' : '☀️';
    });
    header && header.appendChild(btn);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mountToggle);
  }else{
    mountToggle();
  }
})();


// === Color Picker & Gradient Presets ===
(function(){
  const root = document.documentElement;

  function setVar(name, val){
    root.style.setProperty(name, val);
    try{ localStorage.setItem('var:'+name, val); }catch(e){}
  }
  function getVar(name){
    const stored = (localStorage.getItem('var:'+name)||'').trim();
    if(stored) return stored;
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  // derive a lighter accent from brand
  function lighten(hex, pct){
    if(!/^#([0-9a-f]{6})$/i.test(hex)) return hex;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const L = (v)=> Math.min(255, Math.round(v + (255 - v)*pct));
    const toHex = (v)=> v.toString(16).padStart(2,'0');
    return '#'+toHex(L(r))+toHex(L(g))+toHex(L(b));
  }

  function applyBrand(hex){
    setVar('--brand', hex);
    setVar('--accent', lighten(hex, .25));
    // also map stars halo to brand-ish hue for coherence in light mode
    if((root.getAttribute('data-theme')||'light') === 'light'){
      setVar('--star-halo2', hex);
      setVar('--star-halo1', lighten(hex,.35));
    }
    window.dispatchEvent(new CustomEvent('colorchange', { detail: { brand: hex } }));
  }

  // gradient presets (white + blue family)
  const gradients = [
    {id:'g1', css:'radial-gradient(1000px 600px at 70% -10%, rgba(59,130,246,.10), transparent 55%), linear-gradient(180deg, rgba(59,130,246,.06), transparent 22%)'},
    {id:'g2', css:'radial-gradient(900px 540px at 30% -10%, rgba(29,78,216,.12), transparent 50%), linear-gradient(180deg, rgba(29,78,216,.05), transparent 25%)'},
    {id:'g3', css:'radial-gradient(1200px 700px at 50% -20%, rgba(96,165,250,.14), transparent 60%), linear-gradient(180deg, rgba(96,165,250,.07), transparent 20%)'},
    {id:'g4', css:'radial-gradient(850px 520px at 80% -10%, rgba(37,99,235,.14), transparent 50%), radial-gradient(700px 420px at 10% -10%, rgba(14,165,233,.10), transparent 50%)'},
    {id:'g5', css:'radial-gradient(1000px 500px at 60% -15%, rgba(59,130,246,.18), transparent 55%), linear-gradient(180deg, rgba(2,6,23,.08), transparent 30%)'}
  ];

  function applyGradient(id){
    const g = gradients.find(x=>x.id===id) || gradients[0];
    setVar('--bg-grad', g.css);
    try{ localStorage.setItem('gradient', id); }catch(e){}
    window.dispatchEvent(new Event('colorchange'));
  }

  function restore(){
    // restore vars
    ['--brand','--accent','--star-halo1','--star-halo2','--bg-grad'].forEach(k=>{
      const v = localStorage.getItem('var:'+k);
      if(v) root.style.setProperty(k, v);
    });
    const gid = localStorage.getItem('gradient');
    if(gid) applyGradient(gid);
  }

  function mountPanel(){
    const panel = document.createElement('div');
    panel.className = 'color-panel';

    const btn = document.createElement('button');
    btn.className='color-floating-btn';
    btn.innerHTML = '<span>🎨 Color</span>';
    btn.addEventListener('click', ()=>{
      card.style.display = (card.style.display==='none' || !card.style.display) ? 'block' : 'none';
    });

    const card = document.createElement('div');
    card.className='color-card';
    card.style.display='none';
    card.innerHTML = `
      <h4>Appearance</h4>
      <div class="row">
        <label>Brand</label>
        <input type="color" id="brandPick" value="#3b82f6" />
      </div>
      <div class="row"><label>Gradients</label></div>
      <div class="gradients" id="gradGrid"></div>
    `;

    // mount
    panel.appendChild(btn);
    panel.appendChild(card);
    document.body.appendChild(panel);

    // brand picker
    const brand = document.getElementById('brandPick');
    const currentBrand = getVar('--brand') || '#3b82f6';
    brand.value = /^#[0-9a-f]{6}$/i.test(currentBrand) ? currentBrand : '#3b82f6';
    brand.addEventListener('input', (e)=> applyBrand(e.target.value));

    // gradient swatches
    const grid = document.getElementById('gradGrid');
    gradients.forEach(g=>{
      const el = document.createElement('button');
      el.className='grad';
      el.title = g.id;
      el.style.background = g.css;
      el.addEventListener('click', ()=>{
        [...grid.children].forEach(c=>c.classList.remove('active'));
        el.classList.add('active');
        applyGradient(g.id);
      });
      grid.appendChild(el);
    });

    // set active saved gradient
    const saved = localStorage.getItem('gradient') || 'g1';
    const idx = gradients.findIndex(x=>x.id===saved);
    if(idx>=0 && grid.children[idx]) grid.children[idx].classList.add('active');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{ restore(); mountPanel(); });
  else { restore(); mountPanel(); }
})();
