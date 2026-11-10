/* Blog listing v2: slider banner, tabs with counts, search, platform filter, mixed card sizes.
   Real posts and real covers (blog-live.js). State lives in the URL. */
(function(){
  var D=window.BLOG_DATA,L=window.BLOG_LIVE||{covers:{},people:{},extra:[]};if(!D)return;
  var RV=window.BlogReview||{ver:'cur',fill:function(){}};
  var FULL=RV.ver==='full'&&window.BLOG_FULL;
  var posts,people;
  if(FULL){
    /* version B: every live post, live covers, every post is a real page */
    posts=window.BLOG_FULL.posts.slice();people=window.BLOG_FULL.people;
  }else{
    posts=D.posts.filter(function(p){return !p.sample;});
    posts.forEach(function(p){if(L.covers[p.slug])p.cover=L.covers[p.slug];});
    (L.extra||[]).forEach(function(p){posts.push(p);});
    people=L.people;
  }
  posts.sort(function(a,b){return a.date<b.date?1:-1;});
  /* TEST section: the article with every element of a post. It shows only in the TEST tab, never in All, the slider or the counts of the other tabs. */
  var testP=[{slug:'all-article-elements',title:'All article elements',type:'test',test:true,platforms:[],agents:[],author:'George Surovtsev',date:'2026-11-03',read:3,
    cover:'./assets/use-cases/processed/spectrum/21-parts-warehouse.webp',href:'blog-article-elements.html',
    summary:'Headings, text, lists, quotes, callouts, code, tables, images, video and more, one after another.'}];
  var everything=posts.concat(testP);
  /* Sections of the blog. A is the current set (by post type). B and C are proposals, sorted by what the reader needs:
     a post belongs to one section, new posts of the same kind go to the same place. */
  var SLUGS={
    mcp:['introducing-makini-mcp-your-agent-can-finally-touch-the-real-world','direct-vs-third-party-mcp-servers-the-industrial-edition'],
    guides:['fishbowl-advanced-connection-guide','servicetitan-connection-guide','netsutie-how-do-i-link-via-machine-to-machine-m2m-setup','odoo---how-do-i-connect-via-api-authentication','connecting-corrigopro'],
    product:['introducing-api-and-webhook-logs','makini-and-sap-s4hana','makini-and-microsoft-dynamics-365'],
    insights:['eam-erp-wms-integrations','ipaas-solutions-for-enterprise-integrations','cmms-vs-eam-differences-and-overlaps'],
    company:['eqcentric-is-now-makini','makini-partners-with-shipkart','makini-joins-shipdex']
  };
  function cat(a,b){return a.concat(b);}
  var SETS={
    a:[{id:'all',label:'All'},
      {id:'releases',label:'Announcements',types:['announcement','product-update']},
      {id:'guides',label:'Guides',types:['guide','agent-guide']},
      {id:'insights',label:'Expert opinion',types:['opinion']},
      {id:'company',label:'Company',types:['company-news','partnership']}],
    b:[{id:'all',label:'All'},
      {id:'product',label:'Product',slugs:cat(SLUGS.product,SLUGS.mcp.slice(0,1))},
      {id:'guides',label:'Setup guides',slugs:SLUGS.guides},
      {id:'insights',label:'Insights',slugs:cat(SLUGS.insights,SLUGS.mcp.slice(1))},
      {id:'company',label:'Company and partners',slugs:SLUGS.company}],
    c:[{id:'all',label:'All'},
      {id:'mcp',label:'AI and MCP',slugs:SLUGS.mcp},
      {id:'guides',label:'Setup guides',slugs:SLUGS.guides},
      {id:'product',label:'Product',slugs:SLUGS.product},
      {id:'insights',label:'Insights',slugs:SLUGS.insights},
      {id:'company',label:'Company and partners',slugs:SLUGS.company}]
  };
  var ALIAS={releases:'product'};  /* old ?type= links from article pages */
  function inTab(p,t){
    if(p.test)return !!t.test;
    if(t.test)return false;
    if(t.id==='all')return true;
    return !!((t.types&&t.types.indexOf(p.type)>=0)||(t.slugs&&t.slugs.indexOf(p.slug)>=0));
  }
  var TABS=SETS[RV.tabs||'a'].filter(function(t){return posts.some(function(p){return inTab(p,t);});}).concat([{id:'test',label:'TEST',test:true}]);
  var TYPE_LABEL={test:'Test'};D.types.forEach(function(t){TYPE_LABEL[t.id]=t.label;});
  var $=function(s,r){return (r||document).querySelector(s);};
  var grid=$('#bv-grid'),tabsEl=$('#bv-tabs'),slider=$('#bv-feature'),qEl=$('#bv-q'),suggEl=$('#bv-sugg'),clrEl=$('#bv-qclear'),moreEl=$('#bv-more'),cntEl=$('#bv-count'),emptyEl=$('#bv-empty'),totEl=$('#bv-total');
  var STEP=9,shown=STEP,st={tab:'all',q:'',platform:''};
  var REAL={'servicetitan-connection-guide':'blog-article-servicetitan.html','direct-vs-third-party-mcp-servers-the-industrial-edition':'blog-article-direct-vs-third-party.html','fishbowl-advanced-connection-guide':'blog-article-fishbowl.html'};
  function href(p){return p.href||REAL[p.slug]||'blog-article.html';}
  var PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function fmt(d){var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],x=d.split('-');return m[+x[1]-1]+' '+(+x[2])+', '+x[0];}
  function ini(n){return n.split(' ').map(function(w){return w[0];}).join('').slice(0,2);}
  function who(p,withRole){
    var pe=people[p.author];
    var av=pe?'<img class="bv-av is-photo" src="'+pe.photo+'" alt="">':'<span class="bv-av">'+esc(ini(p.author))+'</span>';
    return av+'<span class="bv-by"><b>'+esc(p.author)+'</b>'+(pe&&withRole?'<i>'+esc(pe.role)+'</i>':'')+'</span>';
  }
  function typeLine(p){return esc(TYPE_LABEL[p.type]||p.type)+(p.video?', video':'');}
  function match(p){
    var tab=TABS.filter(function(t){return t.id===st.tab;})[0];
    if(tab&&!inTab(p,tab))return false;
    if(st.platform&&p.platforms.indexOf(st.platform)<0)return false;
    if(st.q){var h=(p.title+' '+p.summary+' '+p.platforms.join(' ')+' '+p.author+' '+(TYPE_LABEL[p.type]||'')).toLowerCase();
      return st.q.toLowerCase().split(/\s+/).every(function(w){return h.indexOf(w)>=0;});}
    return true;
  }
  /* ---------- slider banner ---------- */
  var order=posts.slice().sort(function(a,b){return (a.feat||99)-(b.feat||99);});
  var slides=[];
  [order.filter(function(p){return p.slug==='introducing-makini-mcp-your-agent-can-finally-touch-the-real-world';})[0],
   order.filter(function(p){return p.video;})[0]].forEach(function(p){if(p&&slides.indexOf(p)<0)slides.push(p);});
  order.forEach(function(p){if(slides.length<4&&slides.indexOf(p)<0&&!p.video)slides.push(p);});
  var AR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  slider.innerHTML='<div class="bv-slides">'+slides.map(function(p,i){
    return '<a class="bv-slide'+(i?'':' is-on')+'" href="'+href(p)+'" style="background-image:url('+p.cover+')">'
      +'<div class="bv-fbody"><span class="bv-type">'+typeLine(p)+'</span><h2>'+esc(p.title)+'</h2><p>'+esc(p.summary)+'</p>'
      +'<div class="bv-meta">'+(p.video?'<span class="bv-vplay">'+PLAY+'</span>':'')+who(p,true)+'<span>'+fmt(p.date)+'</span><span>'+(p.video?'Video, '+p.video:p.read+' min read')+'</span></div></div></a>';
  }).join('')+'</div>'
  +'<div class="bv-sctl"><span class="bv-scount">01 / 0'+slides.length+'</span><div class="bv-sbars">'+slides.map(function(p,i){return '<button type="button" class="bv-sbar'+(i?'':' is-on')+'" data-i="'+i+'" aria-label="Slide '+(i+1)+'"></button>';}).join('')+'</div>'
  +'<div class="bv-sarrows"><button type="button" class="bv-sa" data-d="-1" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button><button type="button" class="bv-sa" data-d="1" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div>';
  var si=0,timer=null,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(k){si=(k+slides.length)%slides.length;
    [].forEach.call(slider.querySelectorAll('.bv-slide'),function(s,j){s.classList.toggle('is-on',j===si);});
    var bars=slider.querySelectorAll('.bv-sbar');[].forEach.call(bars,function(s){s.classList.remove('is-on');});void slider.offsetWidth;bars[si].classList.add('is-on');
    slider.querySelector('.bv-scount').textContent='0'+(si+1)+' / 0'+slides.length;
    window.__btAmb=slides[si].cover;if(window.btAmbient)window.btAmbient(slides[si].cover);}
  slider.addEventListener('click',function(e){var a=e.target.closest('.bv-sa'),b=e.target.closest('.bv-sbar');
    if(a){e.preventDefault();go(si+parseInt(a.getAttribute('data-d'),10));}
    if(b){e.preventDefault();go(parseInt(b.getAttribute('data-i'),10));}});
  var x0=null;slider.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  slider.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(si+(dx<0?1:-1));}x0=null;});
  window.__btAmb=slides[0].cover;
  /* Autoplay like the use cases gallery on the MCP pages: the active bar fills over one step (--bv-dur, 6s) and its animationend moves
     the slider on, so pausing the fill pauses the slider and any move restarts the count. Paused while the mouse is over it, while keyboard
     focus is inside, while it is mostly off screen and while the tab is hidden. Touch does not stop it. Reduced motion turns it off. */
  (function(){
    var bars=[].slice.call(slider.querySelectorAll('.bv-sbar'));
    if(reduce){slider.classList.add('bv-static');return;}
    var hold={hover:false,focus:false,off:true,hidden:document.hidden};
    function apply(){slider.classList.toggle('bv-paused',hold.hover||hold.focus||hold.off||hold.hidden);}
    var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
    slider.addEventListener('mouseenter',function(){if(fine.matches){hold.hover=true;apply();}});
    slider.addEventListener('mouseleave',function(){hold.hover=false;apply();});
    slider.addEventListener('focusin',function(e){if(e.target.matches(':focus-visible')){hold.focus=true;apply();}});
    slider.addEventListener('focusout',function(e){if(!slider.contains(e.relatedTarget)){hold.focus=false;apply();}});
    document.addEventListener('visibilitychange',function(){hold.hidden=document.hidden;apply();});
    if('IntersectionObserver' in window)new IntersectionObserver(function(en){hold.off=!en[0].isIntersecting;apply();},{threshold:.35}).observe(slider);
    else hold.off=false;
    bars.forEach(function(b){b.addEventListener('animationend',function(e){if(e.animationName==='bv-fill'&&b.classList.contains('is-on'))go(si+1);});});
    apply();
  })();
  /* ---------- tabs, cards ---------- */
  function counts(){return TABS.map(function(t){return everything.filter(function(p){return inTab(p,t);}).length;});}
  function drawTabs(){var c=counts();
    tabsEl.innerHTML=TABS.map(function(t,i){return '<button type="button" class="bv-tab'+(t.id===st.tab?' is-on':'')+'" data-tab="'+t.id+'">'+esc(t.label)+'<b>'+c[i]+'</b></button>';}).join('');}
  function sync(){var u=new URLSearchParams();if(FULL)u.set('v','full');if(st.tab!=='all')u.set('type',st.tab);if(st.q)u.set('q',st.q);if(st.platform)u.set('platform',st.platform);
    var s=u.toString();try{history.replaceState(null,'',location.pathname+(s?'?'+s:''));}catch(e){}}
  function card(p){
    return '<a class="bv-card" href="'+href(p)+'"><div class="bv-img"><img src="'+p.cover+'" alt="" loading="lazy">'+(p.video?'<span class="bv-vplay is-lg">'+PLAY+'</span>':'')+'</div>'
      +'<div class="bv-cbody"><div class="bv-top"><span class="bv-type">'+typeLine(p)+'</span><time datetime="'+p.date+'">'+fmt(p.date)+'</time></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p>'
      +'<div class="bv-foot">'+who(p,true)+'<span class="bv-read">'+(p.video?'Video, '+p.video:p.read+' min read')+'</span></div></div></a>';
  }
  var cards=everything.map(function(p){
    var t=document.createElement('div');t.innerHTML=card(p);var el=t.firstChild;el._p=p;el.setAttribute('data-type',p.type);grid.appendChild(el);return el;});
  /* the block that sits in the grid after the first row: a demo / trial block (variants A to D, see blog-review.js) */
  var promo=document.createElement('div');promo.className='bv-card bv-dm dm dm-card';promo.setAttribute('data-demo','card');RV.fill(promo);
  /* rows are always full: [wide+narrow], [3 narrow], [narrow+wide], [3 narrow], repeating.
     A last row that cannot be full is stretched (1 card = full width, 2 cards = halves). */
  var PAT=[[4,2],[2,2,2],[2,4],[2,2,2]];
  function render(){
    var filtering=st.tab!=='all'||st.q||st.platform;
    var list=cards.filter(function(el){return match(el._p)&&(filtering||slides.indexOf(el._p)<0);});
    var all=list.slice();
    if(!filtering&&all.length>3)all.splice(3,0,promo);
    var rows=[],idx=0,r=0;
    while(idx<all.length){
      var pat=PAT[r%PAT.length],take=all.slice(idx,idx+pat.length),spans=pat.slice(0,take.length);
      if(take.length<pat.length)spans=take.length===1?[6]:[3,3];
      rows.push({items:take,spans:spans});idx+=take.length;r++;
    }
    var vis=[],spanOf=[],posts=0,k=0;
    while(k<rows.length&&posts<shown){
      rows[k].items.forEach(function(el,n){vis.push(el);spanOf.push(rows[k].spans[n]);if(el!==promo)posts++;});
      k++;
    }
    [].forEach.call(grid.children,function(el){el.hidden=true;});
    vis.forEach(function(el,i){
      ['is-w','s3','s6','lastodd','c1','c2','c3','c4'].forEach(function(c){el.classList.remove(c);});
      var s=spanOf[i];
      if(s===4||s===6)el.classList.add('is-w');
      if(s===3)el.classList.add('s3');
      if(s===6)el.classList.add('s6');
      if(el!==promo)el.classList.add('c'+(1+(i%4)));
      if(i===vis.length-1&&vis.length%2===1)el.classList.add('lastodd');
      el.hidden=false;grid.appendChild(el);
    });
    emptyEl.hidden=list.length>0;
    moreEl.hidden=k>=rows.length;
    cntEl.textContent=list.length?('Showing '+posts+' of '+list.length+' posts'):'';if(totEl){var tn=cards.filter(function(el){return match(el._p);}).length;totEl.textContent=tn+(tn===1?' post':' posts');}
    drawTabs();sync();
  }
  /* ---------- search with platform suggestions (replaces the "All platforms" select) ---------- */
  var plat={};posts.forEach(function(p){p.platforms.forEach(function(x){plat[x]=(plat[x]||0)+1;});});
  var platList=Object.keys(plat).sort(function(a,b){return plat[b]-plat[a]||(a<b?-1:1);});
  var sIdx=-1,sItems=[];
  function drawSugg(){
    var q=qEl.value.trim().toLowerCase();
    sItems=platList.filter(function(x){return !q||x.toLowerCase().indexOf(q)>=0;});
    if(!sItems.length||st.platform&&qEl.value===st.platform){suggEl.hidden=true;return;}
    sIdx=-1;
    suggEl.innerHTML='<span class="bv-sugg-t">Platforms</span>'+sItems.map(function(x,i){
      return '<button type="button" class="bv-sg" role="option" data-i="'+i+'"><span>'+esc(x)+'</span><i>'+plat[x]+(plat[x]===1?' post':' posts')+'</i></button>';}).join('');
    suggEl.hidden=false;
  }
  function mark(i){sIdx=i;[].forEach.call(suggEl.querySelectorAll('.bv-sg'),function(b,j){b.classList.toggle('is-on',j===i);});}
  function pick(x){st.platform=x;st.q='';qEl.value=x;suggEl.hidden=true;shown=STEP;render();}
  function clearQ(){st.platform='';st.q='';qEl.value='';suggEl.hidden=true;shown=STEP;render();qEl.focus();}
  var u=new URLSearchParams(location.search);
  var want=ALIAS[u.get('type')]&&!TABS.some(function(t){return t.id===u.get('type');})?ALIAS[u.get('type')]:u.get('type');
  if(want&&TABS.some(function(t){return t.id===want;}))st.tab=want;
  st.q=u.get('q')||'';
  if(u.get('platform')&&plat[u.get('platform')]){st.platform=u.get('platform');st.q='';}
  qEl.value=st.platform||st.q;
  tabsEl.addEventListener('click',function(e){var b=e.target.closest('[data-tab]');if(!b)return;st.tab=b.getAttribute('data-tab');shown=STEP;render();});
  qEl.addEventListener('input',function(){st.platform='';st.q=qEl.value.trim();shown=STEP;drawSugg();render();});
  qEl.addEventListener('focus',function(){if(!st.platform)drawSugg();});
  qEl.addEventListener('keydown',function(e){
    if(suggEl.hidden){if(e.key==='ArrowDown'&&!st.platform)drawSugg();return;}
    if(e.key==='ArrowDown'){e.preventDefault();mark((sIdx+1)%sItems.length);}
    else if(e.key==='ArrowUp'){e.preventDefault();mark((sIdx-1+sItems.length)%sItems.length);}
    else if(e.key==='Enter'&&sIdx>=0){e.preventDefault();pick(sItems[sIdx]);}
    else if(e.key==='Escape'){suggEl.hidden=true;}
  });
  suggEl.addEventListener('mousedown',function(e){var b=e.target.closest('.bv-sg');if(!b)return;e.preventDefault();pick(sItems[+b.getAttribute('data-i')]);});
  document.addEventListener('mousedown',function(e){if(!e.target.closest('.bv-find'))suggEl.hidden=true;});
  clrEl.addEventListener('click',clearQ);
  $('#bv-morebtn').addEventListener('click',function(){shown+=STEP;render();});
  $('#bv-clear').addEventListener('click',function(){st={tab:'all',q:'',platform:''};qEl.value='';suggEl.hidden=true;shown=STEP;render();});
  render();
})();
