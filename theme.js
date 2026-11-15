/* Shared light/dark switch. Applies the saved choice before first paint (load in <head>) and adds a
   button next to the "Study home" link. Uses the same storage key as the Study home and STD12 pages. */
(function(){
  var r=document.documentElement,K='tb-theme';
  try{var t=localStorage.getItem(K);if(t==='light'||t==='dark')r.dataset.theme=t}catch(e){}
  function isDark(){return r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
  function label(b){var d=isDark();b.textContent=d?'☀ Light':'☾ Dark';b.setAttribute('aria-label',d?'Switch to light theme':'Switch to dark theme');b.setAttribute('aria-pressed',String(d))}
  function init(){
    if(document.getElementById('theme')||document.querySelector('.study-theme'))return;
    var b=document.createElement('button');b.type='button';b.className='study-theme';label(b);
    b.addEventListener('click',function(){r.dataset.theme=isDark()?'light':'dark';try{localStorage.setItem(K,r.dataset.theme)}catch(e){}label(b)});
    try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){label(b)})}catch(e){}
    var a=document.querySelector('a.study-back');
    if(a){var w=document.createElement('div');w.className='study-nav';a.parentNode.insertBefore(w,a);w.appendChild(a);w.appendChild(b)}
    else{b.classList.add('floating');document.body.appendChild(b)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
