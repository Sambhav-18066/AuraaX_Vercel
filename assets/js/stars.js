const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d',{alpha:false});
let w=0,h=0,dpr=Math.min(2,window.devicePixelRatio||1);
function resize(){
  // Use viewport, not CSS-dependent clientHeight
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener('resize', resize); resize();

function drawBlueStar(x,y,r,twinkle){
  // Dark blue star with soft glow
  const g1 = ctx.createRadialGradient(x,y,0, x,y, r*4);
  g1.addColorStop(0.0, 'rgba(5,16,54,0.95)');     // very dark navy
  g1.addColorStop(0.35,'rgba(13,37,95,0.70)');    // deep blue
  g1.addColorStop(0.55,'rgba(37,99,235,0.30)');   // blue halo
  g1.addColorStop(1.0, 'rgba(59,130,246,0.00)');  // fade

  const scale = 1 + Math.sin(twinkle)*0.08;
  const R = r*scale;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.arc(x,y,R*2.2,0,Math.PI*2);
  ctx.fill();

  const g2 = ctx.createRadialGradient(x,y,0, x,y, R);
  g2.addColorStop(0.0, 'rgba(2,8,23,0.95)');
  g2.addColorStop(0.6, 'rgba(13,37,95,0.35)');
  g2.addColorStop(1.0, 'rgba(13,37,95,0.00)');
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(x,y,R,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}


// Background stars
const STARS=[];
for(let i=0;i<520;i++){
  STARS.push({x:Math.random()*w, y:Math.random()*h*1.5, z:Math.random(), r:Math.random()*1.1+.2, tw:Math.random()*Math.PI*2});
}

// Shooting stars
const SHOOT=[];
function spawnShoot(){
  const y=Math.random()*h*.6;
  SHOOT.push({x:-100,y, vx:8+Math.random()*5, vy:2+Math.random()*1.5, life:0, max:120});
  setTimeout(spawnShoot, 1500 + Math.random()*2500);
}
spawnShoot();

/* ===== Animated constellation of logo ===== */
let CONST = [], READY = false, T0 = 0;

(function(){
  const img = new Image(); 
  img.src = '/assets/img/logo.svg'; 
  img.crossOrigin='anonymous';

  img.onload = ()=>{
    const s=260, off=document.createElement('canvas'); 
    off.width=s; off.height=s;
    const o=off.getContext('2d');

    // Draw svg into a square
    o.fillStyle='#000'; 
    o.fillRect(0,0,s,s);
    const mw=img.naturalWidth||s, mh=img.naturalHeight||s;
    const scale=Math.min(s/mw,s/mh), dw=mw*scale, dh=mh*scale, dx=(s-dw)/2, dy=(s-dh)/2;
    o.drawImage(img,dx,dy,dw,dh);

    // Sample opaque pixels
    const data=o.getImageData(0,0,s,s).data;
    const pts=[]; const tries=26000, want=90;
    for(let t=0;t<tries && pts.length<want;t++){
      const x=(Math.random()*s)|0, y=(Math.random()*s)|0, i=(y*s+x)*4, a=data[i+3];
      if(a>40) pts.push({x,y});
    }

    // Map to screen-space targets
    const cx=w*.78, cy=Math.max(120, h*.28), out=Math.max(80,Math.min(w,h)*0.18)/s;

    // Create animated particles (start off-screen, fly in)
    CONST = pts.map(p=>{
      const tx = cx + (p.x - s/2)*out;
      const ty = cy + (p.y - s/2)*out;

      const angle = Math.random()*Math.PI*2;
      const R = Math.max(w,h) * (0.6 + Math.random()*0.4);
      const px = tx + Math.cos(angle)*R;
      const py = ty + Math.sin(angle)*R;

      return {
        // target (landing spot)
        tx, ty,
        // starting point
        px, py,
        // current (updated each frame)
        cx: px, cy: py,
        // animation params
        delay: Math.random()*800,           // ms
        speed: 900 + Math.random()*700,     // ms to land
        phase: Math.random()*Math.PI*2,     // for twinkle/jitter
        amp: 0.6 + Math.random()*0.6        // jitter amplitude
      };
    });

    READY = true;
    T0 = performance.now();
  };
})();

function draw(){
  // Fill bg (match your site’s dark tone)
  ctx.fillStyle='#ffffff'; 
  ctx.fillRect(0,0,w,h);

  // Background stars (twinkle)
  for(const s of STARS){
    s.tw += 0.05;
    const flick = 0.6 + Math.sin(s.tw)*0.4;
    ctx.globalAlpha = (0.3 + s.z*0.7) * flick;
    ctx.fillStyle = '#65b1f8ff';
    ctx.beginPath(); ctx.arc(s.x, s.y*0.8, s.r*(1+s.z*0.4), 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ==== Animated constellation ====
  if(READY && CONST.length){
    const now = performance.now();

    // easing helpers
    const clamp01 = v => Math.max(0, Math.min(1, v));
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    // optional slow drift of the whole constellation
    const driftX = Math.sin(now * 0.0002) * 6;
    const driftY = Math.cos(now * 0.00016) * 4;

    for(const p of CONST){
      // progress with per-star delay/speed
      const t = clamp01((now - T0 - p.delay) / p.speed);
      const e = easeOutCubic(t);

      // lerp start -> target
      p.cx = p.px + (p.tx - p.px) * e;
      p.cy = p.py + (p.ty - p.py) * e;

      // subtle jitter/orbit + twinkle
      const tw = 0.004; // twinkle speed
      const jx = Math.sin(now*0.002 * (0.8 + 0.6*Math.cos(p.phase)) + p.phase) * p.amp;
      const jy = Math.cos(now*0.0018 * (0.7 + 0.5*Math.sin(p.phase*1.3)) + p.phase) * p.amp;
      const flick = 0.65 + 0.35 * Math.sin(now*tw + p.phase);

      // brightness grows as it lands
      const glowAlpha = 0.25 + 0.75 * e;

      ctx.save();
      ctx.globalAlpha = glowAlpha * flick;
      ctx.shadowColor = '#78b3ff';
      ctx.shadowBlur = 14 * (0.6 + 0.4*e);
      ctx.fillStyle = '#a8d6ff';

      const r = 1.6 + (e*0.8) + (flick*0.4);
      ctx.beginPath();
      ctx.arc(p.cx + jx + driftX, p.cy + jy + driftY, r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    // Lines fade in after stars mostly settle
    ctx.save();
    const settle = clamp01((now - T0) / 1400); // overall line alpha
    ctx.globalAlpha = 0.35 * settle * settle;
    ctx.strokeStyle = 'rgba(121,168,255,.8)';
    ctx.lineWidth = 1;

    for(let i=0;i<CONST.length;i+=3){
      const p = CONST[i];
      for(let j=1;j<=2;j++){
        const q = CONST[(i + j*5) % CONST.length];
        ctx.beginPath();
        ctx.moveTo(p.cx + driftX, p.cy + driftY);
        ctx.lineTo(q.cx + driftX, q.cy + driftY);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Shooting stars
  for(let i=SHOOT.length-1;i>=0;i--){
    const s=SHOOT[i]; s.x+=s.vx; s.y+=s.vy; s.life++;
    ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-40,s.y-12); ctx.stroke();
    if(s.life>s.max || s.x>w+120 || s.y>h+80) SHOOT.splice(i,1);
  }

  requestAnimationFrame(draw);
}
draw();
