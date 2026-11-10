/* Article page: reading progress, table of contents with scroll spy, copy buttons, ambient light from the cover. */
(function(){
  var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
  /* ambient background follows the cover */
  var cover=$('.ba-cover img');
  if(cover){window.__btAmb=cover.getAttribute('src');if(window.btAmbient)window.btAmbient(window.__btAmb);}
  /* reading progress */
  var bar=$('.ba-progress i'),sheet=$('.ba-sheet');
  function prog(){if(!bar||!sheet)return;var r=sheet.getBoundingClientRect(),h=r.height-window.innerHeight*.6,p=Math.min(1,Math.max(0,(-r.top+window.innerHeight*.2)/h));bar.style.width=(p*100)+'%';}
  window.addEventListener('scroll',prog,{passive:true});window.addEventListener('resize',prog);prog();
  /* scroll spy over h2 and h3 with ids */
  var heads=$$('.ba-prose h2[id],.ba-prose h3[id]'),links=$$('.ba-toc .ba-toc-l a');
  function spy(){var cur=heads[0]&&heads[0].id;heads.forEach(function(h){if(h.getBoundingClientRect().top<130)cur=h.id;});
    links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+cur);});}
  window.addEventListener('scroll',spy,{passive:true});spy();
  /* contents links: own scroll, so nothing else can cancel it */
  var anim=null;
  function stopAnim(){if(anim){cancelAnimationFrame(anim);anim=null;}}
  ['wheel','touchstart','keydown'].forEach(function(ev){window.addEventListener(ev,stopAnim,{passive:true});});
  function goTo(id){var el=document.getElementById(id);if(!el)return;
    function target(){return Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-96);}
    var from=window.pageYOffset,t0=null,dur=Math.min(900,Math.max(350,Math.abs(target()-from)*.18));
    stopAnim();
    try{history.replaceState(null,'','#'+id);}catch(e){}
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo(0,target());return;}
    /* the target is measured again on every frame, because pictures above it may still be loading */
    function step(ts){if(t0===null)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,to=target();
      window.scrollTo(0,from+(to-from)*e);
      if(k<1)anim=requestAnimationFrame(step);
      else{window.scrollTo(0,to);anim=null;setTimeout(function(){var t=target();if(Math.abs(t-window.pageYOffset)>4)window.scrollTo(0,t);},350);}}
    anim=requestAnimationFrame(step);}
  document.addEventListener('click',function(e){var a=e.target.closest('.ba-toc a[href^="#"],.ba-toc-in a[href^="#"]');if(!a)return;
    e.preventDefault();e.stopImmediatePropagation();goTo(a.getAttribute('href').slice(1));},true);
  /* copy buttons */
  $$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
    var t=b.closest('.ba-code').querySelector('code').textContent;
    try{navigator.clipboard.writeText(t);}catch(e){}b.textContent='Copied';setTimeout(function(){b.textContent='Copy';},1600);});});
  var cl=$('[data-copylink]');
  if(cl)cl.addEventListener('click',function(){var s=cl.querySelector('span'),o=s.textContent;
    try{navigator.clipboard.writeText(location.href);}catch(e){}s.textContent='Copied';setTimeout(function(){s.textContent=o;},1600);});
  /* the contents box inside the sheet closes after a jump on small screens */
  $$('.ba-toc-in a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.open=false;});});
  if(location.hash&&document.getElementById(location.hash.slice(1)))setTimeout(function(){goTo(location.hash.slice(1));},300);
})();
