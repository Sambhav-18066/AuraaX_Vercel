
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


// === GSAP Scroll & Cinematic Motion ===
(function(){
  if(typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance: brand/logo/nav + headline
  const hero = document.querySelector('.hero');
  if(hero){
    const brand = document.querySelector('.brand');
    const navLinks = document.querySelectorAll('nav a, .nav a');
    const h1 = hero.querySelector('h1');
    const h2 = hero.querySelector('h2');
    const lead = hero.querySelector('.lead');
    const tl = gsap.timeline({ defaults:{ ease:"power3.out", duration:.8 } });
    tl.from(brand, { y:-16, opacity:0 })
      .from(navLinks, { y:-10, opacity:0, stagger:0.05 }, "<")
      .to([h1,h2,lead].filter(Boolean), { opacity:1, y:0, stagger:0.08 }, "-=0.2");
  }

  // Parallax layers scrubbed with scroll
  document.querySelectorAll('[data-parallax]').forEach(layer=>{
    const depth = parseFloat(layer.dataset.parallax||0.05);
    gsap.to(layer, {
      yPercent: depth * -50,
      ease: "none",
      scrollTrigger: { trigger: layer.closest('.hero') || layer, start:"top top", end:"bottom top", scrub: true }
    });
  });

  // Generic "shot" reveal for sections
  document.querySelectorAll('.shot').forEach(el=>{
    gsap.to(el, {
      opacity:1, y:0, scale:1, duration:.9, ease:"power3.out",
      scrollTrigger: { trigger: el, start:"top 80%", toggleActions:"play none none reverse" }
    });
  });

  // Section pin + slow pan (cinematic)
  document.querySelectorAll('.section-pin').forEach(sec=>{
    ScrollTrigger.create({
      trigger: sec, start:"top top+=80", end:"+=80%", pin:true, pinSpacing:true
    });
  });
  // Ken Burns effect for any .ken-burns img
  document.querySelectorAll('.ken-burns img').forEach(img=>{
    gsap.fromTo(img, { scale:1.03 }, {
      scale:1.12, ease:"none",
      scrollTrigger:{ trigger: img, start:"top 90%", end:"bottom 10%", scrub:true }
    });
  });

  // Contact form cinematic rise
  const cform = document.querySelector('form.contact-form');
  if(cform){
    gsap.from(cform, {
      y:22, opacity:0, rotateX:6, transformOrigin:"top center", duration:.9,
      scrollTrigger:{ trigger:cform, start:"top 85%", toggleActions:"play none none reverse" }
    });
  }
})();
