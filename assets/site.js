
// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Lightbox for gallery
const lb = document.querySelector('.lightbox');
if(lb){
  const img = lb.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(th=>{
    th.addEventListener('click', ()=>{
      img.src = th.dataset.full || th.src;
      lb.classList.add('show');
    });
  });
  lb.querySelector('.close').addEventListener('click', ()=> lb.classList.remove('show'));
  lb.addEventListener('click', (e)=>{ if(e.target===lb) lb.classList.remove('show'); });
}


// Parallax on scroll
(function(){
  const layers = document.querySelectorAll('[data-parallax]');
  if(!layers.length) return;
  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop;
    layers.forEach(el=>{
      const depth = parseFloat(el.dataset.parallax || 0.04);
      el.style.transform = `translate3d(0, ${y * depth * -1}px, 0)`;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
})();

// Reveal on view
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('reveal-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
})();

// Animated logo entrance
(function(){
  const logo = document.querySelector('.logo');
  if(!logo) return;
  logo.classList.add('logo-in');
})();
