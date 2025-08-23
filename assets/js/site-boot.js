
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
