
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

// === Moonshot-like Timelines ===
(function(){
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  const hero = document.querySelector('.hero-moon');
  if(hero){
    const tl = gsap.timeline({ defaults:{ ease:"power3.out", duration:.9 }});
    tl.from(hero.querySelector('.display'), { y:18, opacity:0 })
      .from(hero.querySelector('.lead'), { y:12, opacity:0 }, "-=0.5")
      .from(hero.querySelector('.btn'), { y:10, opacity:0 }, "-=0.4");
    const bg = hero.querySelector('img,video');
    if(bg){
      gsap.to(bg, { scale: 1.08, ease: "none",
        scrollTrigger: { trigger: hero, start:"top top", end:"bottom top", scrub:true }
      });
    }
  }
  document.querySelectorAll('.statement.section-pin').forEach(sec=>{
    ScrollTrigger.create({ trigger: sec, start:"top top+=80", end:"+=80%", pin:true, pinSpacing:true });
  });
  document.querySelectorAll('.case img').forEach(img=>{
    gsap.to(img, { yPercent: -10, ease:"none",
      scrollTrigger: { trigger: img, start:"top bottom", end:"bottom top", scrub:true }
    });
  });
})();
