
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
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
