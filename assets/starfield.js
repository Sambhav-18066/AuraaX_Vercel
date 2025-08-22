
// Subtle Starfield Background
(function(){
  const section = document.querySelector('.hero');
  if(!section) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  section.prepend(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let w=0,h=0, dpr=1, stars=[];
  const STAR_COUNT = 120; // subtle
  const SPEED = 0.08; // gentle drift

  function resize(){
    const rect = section.getBoundingClientRect();
    w = canvas.width = Math.floor(rect.width * (window.devicePixelRatio||1));
    h = canvas.height = Math.floor(rect.height * (window.devicePixelRatio||1));
    dpr = window.devicePixelRatio || 1;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    makeStars();
  }
  function rand(a,b){ return a + Math.random()*(b-a); }
  function makeStars(){
    stars = Array.from({length: STAR_COUNT}).map(()=> ({
      x: rand(0,w), y: rand(0,h),
      z: rand(0.2,1), r: rand(0.4,1.2),
      vx: rand(-0.05,0.05), vy: rand(-0.05,0.05)
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for(const s of stars){
      s.x += s.vx * s.z * SPEED * dpr;
      s.y += s.vy * s.z * SPEED * dpr;
      if(s.x < 0) s.x += w; if(s.x >= w) s.x -= w;
      if(s.y < 0) s.y += h; if(s.y >= h) s.y -= h;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI*2);
      ctx.fillStyle = `rgba(190,225,255,${0.25 + s.z*0.35})`;
      ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(section);
  resize();
  tick();
})();
