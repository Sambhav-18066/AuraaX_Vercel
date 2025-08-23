
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function(){
    // detect base path from current script tag to support subfolders
    var boot = document.currentScript || (function(){
      var s = document.querySelector('script[src*="site-boot.js"]');
      return s;
    })();
    var base = "/";
    if (boot && boot.getAttribute('src')){
      var src = boot.getAttribute('src'); // e.g., /assets/js/site-boot.js or assets/js/site-boot.js
      if (src.indexOf('/assets/js/site-boot.js') === -1) {
        // relative include like "assets/js/site-boot.js"
        // build a relative base from current path
        base = ""; // use relative paths
      }
    }

    function addCSS(href){
      if(!document.querySelector('link[href*="'+href+'"]')){
        var l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
      }
    }
    function addScript(src, cb){
      if(document.querySelector('script[src="'+src+'"]')){ cb&&cb(); return; }
      var s=document.createElement('script'); s.src=src; s.onload=cb||null; document.body.appendChild(s);
    }

    // Ensure body exists (if this ran in <head>)
    if(!document.body){ document.body = document.getElementsByTagName('body')[0] || document.createElement('body'); }

    // Ensure canvas
    if(!document.getElementById('starfield')){
      var c=document.createElement('canvas'); c.id='starfield'; document.body.prepend(c);
    }

    // Load CSS and scripts (order matters)
    addCSS(base + "assets/css/main.css");
    addScript(base + "assets/js/stars.js", function(){
      addScript(base + "assets/js/scroll.js");
    });
  });
})();
