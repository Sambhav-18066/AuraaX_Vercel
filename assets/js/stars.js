
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

// Constellation of logo (tolerates CORS failure)
let CONST=[], READY=false;
(function(){
  const img = new Image(); img.src = '/assets/img/logo.svg'; img.crossOrigin='anonymous';
  img.onload = ()=>{
    const s=260, off=document.createElement('canvas'); off.width=s; off.height=s;
    const o=off.getContext('2d');
    o.fillStyle='#000'; o.fillRect(0,0,s,s);
    const mw=img.naturalWidth||s, mh=img.naturalHeight||s;
    const scale=Math.min(s/mw,s/mh), dw=mw*scale, dh=mh*scale, dx=(s-dw)/2, dy=(s-dh)/2;
    o.drawImage(img,dx,dy,dw,dh);
    const data=o.getImageData(0,0,s,s).data;
    const pts=[]; const tries=26000, want=90;
    for(let t=0;t<tries && pts.length<want;t++){
      const x=(Math.random()*s)|0, y=(Math.random()*s)|0, i=(y*s+x)*4, a=data[i+3];
      if(a>40) pts.push({x,y});
    }
    const cx=w*.78, cy=Math.max(120, h*.28), out=Math.max(80,Math.min(w,h)*0.18)/s;
    CONST = pts.map(p=>({x:cx+(p.x-s/2)*out, y:cy+(p.y-s/2)*out}));
    READY=true;
  };
})();

function draw(){
  // Fill bg (match your site’s dark tone)
  ctx.fillStyle = '#0b1120'; ctx.fillRect(0,0,w,h);

  for(const s of STARS){
    s.tw += 0.05;
    const flick = 0.6 + Math.sin(s.tw)*0.4;
    ctx.globalAlpha = (0.3 + s.z*0.7) * flick;
    ctx.fillStyle = '#cfe8ff';
    ctx.beginPath(); ctx.arc(s.x, s.y*0.8, s.r*(1+s.z*0.4), 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  if(READY){
    for(let i=0;i<CONST.length;i++){
      const p=CONST[i]; ctx.shadowColor='#78b3ff'; ctx.shadowBlur=14; ctx.fillStyle='#a8d6ff';
      ctx.beginPath(); ctx.arc(p.x,p.y,1.9+(i%9===0?.9:0),0,Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur=0; ctx.strokeStyle='rgba(121,168,255,.35)'; ctx.lineWidth=1;
    for(let i=0;i<CONST.length;i+=3){
      const p=CONST[i]; for(let j=1;j<=2;j++){ const q=CONST[(i+j*5)%CONST.length];
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }
  }

  for(let i=SHOOT.length-1;i>=0;i--){
    const s=SHOOT[i]; s.x+=s.vx; s.y+=s.vy; s.life++;
    ctx.strokeStyle='rgba(255,255,255,.9)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-40,s.y-12); ctx.stroke();
    if(s.life>s.max || s.x>w+120 || s.y>h+80) SHOOT.splice(i,1);
  }
  requestAnimationFrame(draw);
}
draw();
