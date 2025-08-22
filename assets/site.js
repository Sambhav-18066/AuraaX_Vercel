
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
