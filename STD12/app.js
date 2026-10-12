
/* Shared helpers used by every topic widget. */
window.TB=(function(){
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const subs=[];
  function canvas(el,h){ // returns {c,ctx,w,h}; redraws via cb on resize/theme
    const dpr=window.devicePixelRatio||1;
    const w=el.clientWidth||600, hh=h||el.clientHeight||260;
    el.width=Math.round(w*dpr); el.height=Math.round(hh*dpr); el.style.height=hh+'px';
    const ctx=el.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
    return {c:el,ctx:ctx,w:w,h:hh};
  }
  /* TB.live(root, draw): draw() runs now, on any input in root, on resize and on theme change. */
  function live(root,draw){
    const run=()=>{try{draw()}catch(e){console.error(e)}};
    root.addEventListener('input',run); root.addEventListener('change',run);
    subs.push(run); window.addEventListener('resize',run); run();
    root.querySelectorAll('.ctl input[type=range]').forEach(r=>{
      const o=r.closest('.ctl').querySelector('output'); if(o){const u=()=>o.textContent=(+r.value).toLocaleString('en-IN',{maximumFractionDigits:3})+(r.dataset.unit||'');r.addEventListener('input',u);u();}
    });
  }
  function themeChanged(){subs.forEach(f=>f())}
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',themeChanged);
  new MutationObserver(themeChanged).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const set=(root,sel,v)=>{const e=root.querySelector(sel); if(e) e.textContent=v};
  const fmt=(x,d)=>(+x).toLocaleString('en-IN',{maximumFractionDigits:d==null?2:d});
  return {css,canvas,live,set,fmt};
})();
document.addEventListener('DOMContentLoaded',function(){
/* Quiz: <div class="quiz"><p class="q">..</p><div class="opts"><button data-ok>..</button><button>..</button></div><p class="why" hidden>..</p></div> */
document.querySelectorAll('.quiz').forEach(q=>{
  q.querySelectorAll('.opts button').forEach(b=>b.addEventListener('click',()=>{
    q.querySelectorAll('.opts button').forEach(x=>{x.disabled=true; if(x.hasAttribute('data-ok'))x.classList.add('right')});
    if(!b.hasAttribute('data-ok'))b.classList.add('wrong');
    const w=q.querySelector('.why'); if(w)w.hidden=false;
  }));
});
/* Tabs: <div class="tabs" data-tabs><button>A</button><button>B</button></div><div class="tabpane">..</div><div class="tabpane">..</div> (panes follow the tabs, same order) */
document.querySelectorAll('[data-tabs]').forEach(t=>{
  const panes=[];let n=t.nextElementSibling;while(n&&n.classList.contains('tabpane')){panes.push(n);n=n.nextElementSibling}
  const btns=[...t.children];
  const show=i=>{btns.forEach((b,j)=>b.classList.toggle('on',i===j));panes.forEach((p,j)=>p.hidden=i!==j)};
  btns.forEach((b,i)=>b.addEventListener('click',()=>show(i)));show(0);
});
/* Site: theme toggle remembered per browser */
(function(){
  const r=document.documentElement;
  try{const t=localStorage.getItem('tb-theme');if(t)r.dataset.theme=t}catch(e){}
  const b=document.getElementById('theme');
  if(b)b.addEventListener('click',()=>{
    const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme=dark?'light':'dark';
    try{localStorage.setItem('tb-theme',r.dataset.theme)}catch(e){}
  });
})();

});