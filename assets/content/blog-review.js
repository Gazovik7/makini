/* Review controls for the blog mockups, pinned to the top right of the page (strip them once the client has chosen):
   - on the listing: which blog to show, A "Current" or B "Full content" (all live posts). The choice lives in the URL (?v=full).
   - on the listing and on every article: which demo block to show instead of the newsletter, A to D. The choice is saved in localStorage.
   Exposes window.BlogReview = {ver, fill(el)} for blog-v2.js. Fills every [data-demo] element. */
(function(){
  var CAL='https://calendly.com/api-94107/makini-api-demo',REG='https://app.makini.io/register',MAIL='support@makini.io';
  var ARR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var SYSTEMS=['ServiceTitan','Fishbowl Advanced','NetSuite','Odoo','SAP S/4HANA','SAP EWM','Microsoft Dynamics 365','MaintainX','Fiix','UpKeep','IBM Maximo','CorrigoPro'];
  var VERS=[['cur','Current'],['full','Full content']];
  var TABSETS=[['a','Current'],['b','4 sections'],['c','5 sections']];
  var MENUS=[['a','List'],['b','Rail']];
  var STYLES=[['a','Current'],['b','Site style']];
  var DEMOS=[['a','Demo'],['b','Your system'],['c','Free trial'],['d','Two paths']];
  var qs=new URLSearchParams(location.search);
  var listing=!!document.getElementById('bv-grid');
  var ver=qs.get('v')==='full'?'full':'cur';
  var dv='a',tabs='a',menu='a',sty=document.documentElement.getAttribute('data-sm')==='site'?'b':'a';
  function applyStyle(){if(sty==='b')document.documentElement.setAttribute('data-sm','site');else document.documentElement.removeAttribute('data-sm');}
  try{var ms=qs.get('menu')||localStorage.getItem('bk-menu');if(ms&&MENUS.some(function(d){return d[0]===ms;}))menu=ms;}catch(e){}
  document.documentElement.setAttribute('data-menu',menu==='b'?'rail':'list');
  try{var ts=qs.get('tabs')||localStorage.getItem('bk-tabs');if(ts&&TABSETS.some(function(d){return d[0]===ts;}))tabs=ts;}catch(e){}
  try{var s=qs.get('demo')||localStorage.getItem('bk-demo');if(s&&DEMOS.some(function(d){return d[0]===s;}))dv=s;}catch(e){}

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var HTML={
    a:function(){return '<span class="dm-k">Product demo</span><h3>See Makini work with your system</h3>'
      +'<p>A short call with the Makini team. Tell us what you want to connect and we will show you how.</p>'
      +'<a class="dm-btn" href="'+CAL+'" target="_blank" rel="noopener">Book a demo</a>';},
    b:function(){return '<span class="dm-k">Book a demo</span><h3>Which system do you want to connect?</h3>'
      +'<form class="dm-f" autocomplete="off"><div class="dm-field"><input type="text" class="dm-in" placeholder="ServiceTitan, NetSuite, SAP..." aria-label="Your system"><div class="dm-sg" hidden></div></div>'
      +'<button type="submit" class="dm-btn">Book a demo</button></form>'
      +'<p class="dm-s">We will open the calendar with your system filled in.</p>';},
    c:function(){return '<span class="dm-k">Free trial</span><h3>Try the API yourself</h3>'
      +'<ol class="dm-steps"><li><b>Create an account</b></li><li><b>Connect a system in Makini Link</b></li><li><b>Get your API token</b></li></ol>'
      +'<a class="dm-btn" href="'+REG+'" target="_blank" rel="noopener">Start free trial</a>'
      +'<a class="dm-alt" href="'+CAL+'" target="_blank" rel="noopener">Book a demo</a>';},
    d:function(){return '<span class="dm-k">Next step</span><h3>Not sure where to start?</h3>'
      +'<div class="dm-rows"><a class="dm-row" href="'+CAL+'" target="_blank" rel="noopener"><span><b>Book a demo</b><i>Talk to the team about your system</i></span>'+ARR+'</a>'
      +'<a class="dm-row" href="'+REG+'" target="_blank" rel="noopener"><span><b>Start free trial</b><i>Create an account and connect a system</i></span>'+ARR+'</a>'
      +'<a class="dm-row" href="mailto:'+MAIL+'"><span><b>Ask support</b><i>'+MAIL+'</i></span>'+ARR+'</a></div>';}
  };
  function wireB(el){
    var f=el.querySelector('.dm-f');if(!f)return;
    var inp=f.querySelector('.dm-in'),sg=f.querySelector('.dm-sg'),idx=-1,items=[];
    function draw(){var q=inp.value.trim().toLowerCase();items=SYSTEMS.filter(function(x){return !q||x.toLowerCase().indexOf(q)>=0;}).slice(0,6);
      if(!items.length||(items.length===1&&items[0].toLowerCase()===q)){sg.hidden=true;return;}
      idx=-1;sg.innerHTML=items.map(function(x,i){return '<button type="button" data-i="'+i+'">'+esc(x)+'</button>';}).join('');sg.hidden=false;}
    function pick(x){inp.value=x;sg.hidden=true;}
    inp.addEventListener('input',draw);inp.addEventListener('focus',draw);
    inp.addEventListener('keydown',function(e){if(sg.hidden)return;
      var bs=sg.querySelectorAll('button');
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();idx=(idx+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;[].forEach.call(bs,function(b,j){b.classList.toggle('is-on',j===idx);});}
      else if(e.key==='Enter'&&idx>=0){e.preventDefault();pick(items[idx]);}
      else if(e.key==='Escape'){sg.hidden=true;}});
    sg.addEventListener('mousedown',function(e){var b=e.target.closest('button');if(!b)return;e.preventDefault();pick(items[+b.getAttribute('data-i')]);});
    inp.addEventListener('blur',function(){setTimeout(function(){sg.hidden=true;},120);});
    f.addEventListener('submit',function(e){e.preventDefault();var v=inp.value.trim();window.open(CAL+(v?'?a1='+encodeURIComponent(v):''),'_blank','noopener');});
  }
  function fill(el){el.innerHTML='<i class="dm-mark" aria-hidden="true"></i><div class="dm-in-w">'+HTML[dv]()+'</div>';el.setAttribute('data-dv',dv);if(dv==='b')wireB(el);}
  function fillAll(){[].forEach.call(document.querySelectorAll('[data-demo]'),fill);}

  /* ---------- the switcher ---------- */
  function row(label,list,cur,key){
    return '<div class="rv-row"><span class="rv-l">'+label+'</span>'+list.map(function(x,i){
      return '<button type="button" class="rv-b'+(x[0]===cur?' is-on':'')+'" data-key="'+key+'" data-v="'+x[0]+'" aria-pressed="'+(x[0]===cur)+'"><b>'+'ABCD'.charAt(i)+'</b><span>'+x[1]+'</span></button>';}).join('')+'</div>';
  }
  function panel(){
    var d=document.createElement('div');d.className='rv';d.setAttribute('role','group');d.setAttribute('aria-label','Review options');
    d.innerHTML=row('Style',STYLES,sty,'style')+(listing?row('Blog',VERS,ver,'ver')+row('Tabs',TABSETS,tabs,'tabs'):row('Menu',MENUS,menu,'menu'))+row('Block',DEMOS,dv,'demo');
    d.addEventListener('click',function(e){var b=e.target.closest('.rv-b');if(!b)return;var k=b.getAttribute('data-key'),v=b.getAttribute('data-v');
      if(k==='style'){sty=v;try{localStorage.setItem('bk-style',v==='b'?'site':'a');}catch(x){}applyStyle();
        try{var su=new URLSearchParams(location.search);if(su.has('style')){su.set('style',v==='b'?'site':'a');history.replaceState(null,'',location.pathname+'?'+su.toString());}}catch(x){}
        [].forEach.call(d.querySelectorAll('[data-key="style"]'),function(x){var on=x.getAttribute('data-v')===v;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on);});return;}
      if(k==='ver'){var u=new URLSearchParams(location.search);if(v==='full')u.set('v','full');else u.delete('v');u.delete('type');u.delete('q');u.delete('platform');
        location.href=location.pathname+(u.toString()?'?'+u.toString():'');return;}
      if(k==='menu'){menu=v;try{localStorage.setItem('bk-menu',v);}catch(x){}document.documentElement.setAttribute('data-menu',v==='b'?'rail':'list');
        [].forEach.call(d.querySelectorAll('[data-key="menu"]'),function(x){var on=x.getAttribute('data-v')===v;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on);});return;}
      if(k==='tabs'){try{localStorage.setItem('bk-tabs',v);}catch(x){}var w=new URLSearchParams(location.search);w.delete('tabs');w.delete('type');location.href=location.pathname+(w.toString()?'?'+w.toString():'');return;}
      dv=v;try{localStorage.setItem('bk-demo',v);}catch(x){}
      [].forEach.call(d.querySelectorAll('[data-key="demo"]'),function(x){var on=x.getAttribute('data-v')===v;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on);});
      fillAll();});
    document.body.appendChild(d);
  }
  window.BlogReview={ver:ver,tabs:tabs,fill:fill};
  function init(){fillAll();panel();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
