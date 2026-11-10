/* Makini blog proposal - behaviour.
   Listing: one shared state (search, type, platform, agent, page size) mirrored to the URL and rendered
   into all three layout variants. Post: table of contents highlighting, reading progress, related posts. */
(function(){
  'use strict';
  var D=window.BLOG_DATA;
  if(!D)return;
  var POSTS=D.posts,TYPES=D.types,TOPICS=D.topics,AGENTS=D.agents;
  if(window.BLOG_LIVE&&BLOG_LIVE.covers)POSTS.forEach(function(p){if(BLOG_LIVE.covers[p.slug])p.cover=BLOG_LIVE.covers[p.slug];});
  var T={};TYPES.forEach(function(t){T[t.id]=t;});
  document.documentElement.classList.add('bl-js');
  var PAGE=9;
  var POST_HREF='blog-post.html';

  function $(s,r){return (r||document).querySelector(s);}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
  function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmt(iso){var a=iso.split('-');return MON[+a[1]-1]+' '+(+a[2])+', '+a[0];}
  function initials(n){return n.split(/\s+/).map(function(w){return w.charAt(0);}).slice(0,2).join('').toUpperCase();}

  var I={
    search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    link:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    empty:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/></svg>',
    chev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>'
  };

  /* ---------------------------------------------------------------- shared post templates */
  var tokens=[];
  function hl(text){
    if(!tokens.length)return esc(text);
    var re=new RegExp('('+tokens.map(escRe).join('|')+')','ig');
    return text.split(re).map(function(piece,i){return i%2?'<mark class="bl-hit">'+esc(piece)+'</mark>':esc(piece);}).join('');
  }
  function glow(i){return ['','g-violet','g-pink'][i%3];}
  function badge(p){
    var t=T[p.type];
    return '<span class="ct-badge '+t.badge+'">'+esc(t.label)+'</span>'+(p.sample?'<span class="ct-sample">Sample</span>':'');
  }
  function plats(p,max){
    var all=p.platforms.map(function(x){return {n:x,a:0};}).concat(p.agents.map(function(x){return {n:x,a:1};}));
    if(!all.length)return '';
    return '<div class="bl-plats">'+all.slice(0,max||4).map(function(x){return '<span class="bl-plat'+(x.a?' is-agent':'')+'">'+esc(x.n)+'</span>';}).join('')+'</div>';
  }
  function meta(p,short){
    return '<div class="bl-meta">'+
      (short?'':'<span class="bl-av" aria-hidden="true">'+esc(initials(p.author))+'</span><span class="bl-au">'+esc(p.author)+'</span><span class="bl-sep" aria-hidden="true">&middot;</span>')+
      '<time datetime="'+p.date+'">'+fmt(p.date)+'</time><span class="bl-sep" aria-hidden="true">&middot;</span><span>'+p.read+' min read</span></div>';
  }
  function img(p){return '<img src="'+p.cover+'" alt="" loading="lazy" decoding="async" width="1200" height="800">';}
  function title(p,tag){return '<'+(tag||'h3')+' class="bl-title"><a href="'+POST_HREF+'">'+hl(p.title)+'</a></'+(tag||'h3')+'>';}

  function card(p,i,big){
    return '<article class="ct-card hov bl-card '+glow(i)+(big?' is-big':'')+'">'+
      '<a class="bl-cover" href="'+POST_HREF+'" tabindex="-1" aria-hidden="true">'+img(p)+'</a>'+
      '<div class="bl-card-b"><div class="bl-tags">'+badge(p)+'</div>'+title(p)+
      (big?'<p class="bl-sum">'+hl(p.summary)+'</p>':'')+plats(p)+meta(p)+'</div></article>';
  }
  function feat(p){
    return '<article class="bl-feat"><span class="bl-feat-img">'+img(p)+'</span><div class="bl-feat-c"><div class="bl-tags">'+badge(p)+'</div>'+
      '<h3 class="bl-title">'+esc(p.title)+'</h3><p class="bl-sum">'+esc(p.summary)+'</p>'+meta(p)+'</div></article>';
  }
  function side(p,i){
    return '<article class="ct-card hov bl-side '+glow(i+1)+'"><a class="bl-cover" href="'+POST_HREF+'" tabindex="-1" aria-hidden="true">'+img(p)+'</a>'+
      '<div class="bl-side-b"><div class="bl-tags">'+badge(p)+'</div>'+title(p)+meta(p,true)+'</div></article>';
  }
  function row(p,i){
    return '<article class="ct-card hov bl-row '+glow(i)+'"><a class="bl-cover" href="'+POST_HREF+'" tabindex="-1" aria-hidden="true">'+img(p)+'</a>'+
      '<div class="bl-row-b"><div class="bl-tags">'+badge(p)+'</div>'+title(p)+'<p class="bl-sum">'+hl(p.summary)+'</p>'+plats(p,5)+meta(p)+'</div></article>';
  }
  function mini(p){
    return '<article class="bl-mini"><a class="bl-cover" href="'+POST_HREF+'" tabindex="-1" aria-hidden="true">'+img(p)+'</a>'+
      '<div class="bl-mini-b"><div class="bl-tags">'+badge(p)+'</div>'+title(p,'h3')+meta(p,true)+'</div></article>';
  }

  /* ---------------------------------------------------------------- LISTING */
  var blk=$('[data-ct-block="blog-listing"]');
  var state={q:'',types:[],platform:'',agent:'',shown:PAGE};
  var PLATFORMS=[];
  if(blk){
    (function(){
      var c={};POSTS.forEach(function(p){p.platforms.forEach(function(n){c[n]=(c[n]||0)+1;});});
      PLATFORMS=Object.keys(c).sort(function(a,b){return c[b]-c[a]||a.localeCompare(b);}).map(function(n){return {n:n,s:slug(n)};});
    })();
    POSTS.forEach(function(p){
      p._h=(p.title+' '+p.summary+' '+p.platforms.join(' ')+' '+p.agents.join(' ')+' '+p.author+' '+T[p.type].label).toLowerCase();
    });
    initListing();
  }
  function platByName(s){var r=null;PLATFORMS.forEach(function(x){if(x.s===s)r=x;});return r;}
  function agentByName(s){var r='';AGENTS.forEach(function(a){if(slug(a)===s)r=a;});return r;}

  function readURL(){
    var p=new URLSearchParams(location.search);
    state.q=(p.get('q')||'').slice(0,120);
    state.types=(p.get('type')||'').split(',').filter(function(x){return T[x];});
    var pl=platByName(p.get('platform')||'');state.platform=pl?pl.n:'';
    state.agent=agentByName(p.get('agent')||'');
  }
  function writeURL(){
    var parts=[];
    function enc(v){return encodeURIComponent(v).replace(/%2C/g,',');}
    if(state.q.trim())parts.push('q='+enc(state.q.trim()));
    if(state.types.length)parts.push('type='+enc(state.types.join(',')));
    if(state.platform)parts.push('platform='+slug(state.platform));
    if(state.agent)parts.push('agent='+slug(state.agent));
    try{history.replaceState(null,'',location.pathname+(parts.length?'?'+parts.join('&'):'')+location.hash);}catch(e){}
  }

  function matches(p,skip){
    if(skip!=='type'&&state.types.length&&state.types.indexOf(p.type)<0)return false;
    if(skip!=='platform'&&state.platform&&p.platforms.indexOf(state.platform)<0)return false;
    if(skip!=='agent'&&state.agent&&p.agents.indexOf(state.agent)<0)return false;
    if(skip!=='q'&&tokens.length){for(var i=0;i<tokens.length;i++){if(p._h.indexOf(tokens[i].toLowerCase())<0)return false;}}
    return true;
  }
  function filtered(skip){return POSTS.filter(function(p){return matches(p,skip);});}
  function isDefault(){return !tokens.length&&!state.types.length&&!state.platform&&!state.agent;}
  function sameSet(a,b){return a.length===b.length&&a.every(function(x){return b.indexOf(x)>=0;});}

  function initListing(){
    /* controls are generated once from the data, afterwards only classes and counts change */
    $$('[data-bl-chips]').forEach(function(w){
      w.innerHTML='<button type="button" class="bl-chip" data-bl-type="">All</button>'+TYPES.map(function(t){
        return '<button type="button" class="bl-chip" data-bl-type="'+t.id+'">'+esc(t.label)+'</button>';}).join('');
    });
    $$('[data-bl-checks]').forEach(function(w){
      w.innerHTML=TYPES.map(function(t){
        return '<label class="bl-check"><input type="checkbox" data-bl-typechk="'+t.id+'"><span class="bl-box">'+I.check+'</span><span class="bl-check-l">'+esc(t.label)+'</span><small data-bl-tc="'+t.id+'">0</small></label>';}).join('');
    });
    $$('[data-bl-agents]').forEach(function(w){
      w.innerHTML=AGENTS.map(function(a){return '<button type="button" class="bl-chip is-sm" data-bl-agent="'+esc(a)+'">'+esc(a)+'</button>';}).join('');
    });
    $$('[data-bl-topics]').forEach(function(w){
      w.innerHTML=TOPICS.map(function(t){
        return '<button type="button" role="tab" class="bl-tab" data-bl-topic="'+t.id+'"><span>'+esc(t.label)+'</span><small data-bl-topc="'+t.id+'">0</small></button>';}).join('');
    });
    $$('select[data-bl-select="platform"]').forEach(function(s){
      s.innerHTML='<option value="">All platforms</option>'+PLATFORMS.map(function(x){return '<option value="'+esc(x.n)+'">'+esc(x.n)+'</option>';}).join('');
    });
    $$('select[data-bl-select="agent"]').forEach(function(s){
      s.innerHTML='<option value="">All agents</option>'+AGENTS.map(function(a){return '<option value="'+esc(a)+'">'+esc(a)+'</option>';}).join('');
    });

    readURL();
    wire();
    update(true);
  }

  function setTypes(arr){state.types=arr.slice();state.shown=PAGE;update();}
  function reset(){state.q='';state.types=[];state.platform='';state.agent='';state.shown=PAGE;update(true);}

  function wire(){
    document.addEventListener('input',function(e){
      var t=e.target;
      if(t.matches&&t.matches('input[data-bl-q]')){state.q=t.value;state.shown=PAGE;update();}
      else if(t.matches&&t.matches('input[data-bl-pfq]')){renderPlatformList();}
    });
    document.addEventListener('change',function(e){
      var t=e.target;
      if(t.matches('input[data-bl-typechk]')){
        var id=t.getAttribute('data-bl-typechk'),i=state.types.indexOf(id);
        if(t.checked&&i<0)state.types.push(id);if(!t.checked&&i>=0)state.types.splice(i,1);
        state.shown=PAGE;update();
      }else if(t.matches('select[data-bl-select]')){
        state[t.getAttribute('data-bl-select')]=t.value;state.shown=PAGE;update();
      }
    });
    document.addEventListener('click',function(e){
      var el=e.target.closest?e.target.closest('button,a,[data-bl-act]'):null;
      var t;
      if(!el){if(!(e.target.closest&&e.target.closest('.bl-pf')))closePlatform();return;}
      if((t=el.getAttribute('data-bl-type'))!==null){
        if(t==='')setTypes([]);else setTypes(state.types.length===1&&state.types[0]===t?[]:[t]);
      }else if((t=el.getAttribute('data-bl-topic'))){
        var tp=TOPICS.filter(function(x){return x.id===t;})[0];
        setTypes(sameSet(state.types,tp.types)?[]:tp.types);
      }else if((t=el.getAttribute('data-bl-agent'))){
        state.agent=state.agent===t?'':t;state.shown=PAGE;update();
      }else if(el.hasAttribute('data-bl-suggest')){
        state.q=el.getAttribute('data-bl-suggest');state.shown=PAGE;update(true);
        var inp=activeInput();if(inp)inp.focus();
      }else if(el.hasAttribute('data-bl-more')){
        state.shown+=PAGE;update();
      }else if(el.hasAttribute('data-bl-reset')){
        reset();
      }else if(el.hasAttribute('data-bl-clearq')){
        state.q='';state.shown=PAGE;update(true);var i2=activeInput();if(i2)i2.focus();
      }else if((t=el.getAttribute('data-bl-remove'))){
        var k=t.split(':');
        if(k[0]==='q')state.q='';
        if(k[0]==='type')state.types=state.types.filter(function(x){return x!==k[1];});
        if(k[0]==='platform')state.platform='';
        if(k[0]==='agent')state.agent='';
        state.shown=PAGE;update(true);
      }else if(el.hasAttribute('data-bl-copy')){
        copyLink(el);
      }else if(el.hasAttribute('data-bl-pfbtn')){
        var box=el.closest('.bl-pf');box.classList.toggle('is-open');
        el.setAttribute('aria-expanded',box.classList.contains('is-open'));
        if(box.classList.contains('is-open')){var pq=$('[data-bl-pfq]',box);if(pq){pq.value='';renderPlatformList();pq.focus();}}
        return;
      }else if(el.hasAttribute('data-bl-pfopt')){
        state.platform=el.getAttribute('data-bl-pfopt');state.shown=PAGE;closePlatform();update();
      }else if(el.hasAttribute('data-bl-drawer-open')){
        setDrawer(true);
      }else if(el.hasAttribute('data-bl-drawer-close')){
        setDrawer(false);
      }
      if(!(el.closest&&el.closest('.bl-pf')))closePlatform();
    });
    document.addEventListener('keydown',function(e){
      var tag=(e.target.tagName||'').toLowerCase();
      var typing=tag==='input'||tag==='textarea'||tag==='select';
      if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){
        var i=activeInput();if(i){e.preventDefault();i.focus();i.select();}
      }else if(e.key==='Escape'){
        if($('.bl-filters.is-open'))setDrawer(false);
        else if(e.target.matches&&e.target.matches('input[data-bl-q]')&&state.q){state.q='';state.shown=PAGE;update(true);}
        closePlatform();
      }else if((e.key==='ArrowDown'||e.key==='ArrowUp')&&e.target.closest&&e.target.closest('.bl-cmd')){
        var items=$$('.bl-quick-i',e.target.closest('.bl-cmd'));if(!items.length)return;
        var idx=items.indexOf(document.activeElement);
        if(e.key==='ArrowDown'){e.preventDefault();(items[idx+1]||items[0]).focus();}
        else{e.preventDefault();if(idx<=0){activeInput().focus();}else items[idx-1].focus();}
      }
    });
    $$('form[data-bl-news]').forEach(function(f){
      f.addEventListener('submit',function(e){
        e.preventDefault();
        f.innerHTML='<div class="bl-news-done">'+I.check+'<span>Thanks for joining our newsletter.</span></div>';
      });
    });
  }

  function activeInput(){
    var v=$('.ct-v[data-v="'+blk.getAttribute('data-active')+'"]',blk);
    return v?$('input[data-bl-q]',v):null;
  }
  function closePlatform(){$$('.bl-pf.is-open').forEach(function(b){b.classList.remove('is-open');var bt=$('[data-bl-pfbtn]',b);if(bt)bt.setAttribute('aria-expanded','false');});}
  function setDrawer(on){
    $$('.bl-filters').forEach(function(d){d.classList.toggle('is-open',on);});
    $$('.bl-backdrop').forEach(function(d){d.classList.toggle('is-on',on);});
    document.body.classList.toggle('bl-lock',on);
    $$('[data-bl-drawer-open]').forEach(function(b){b.setAttribute('aria-expanded',on);});
  }
  function copyLink(el){
    var done=function(){var l=$('span',el);var o=l.textContent;l.textContent='Link copied';setTimeout(function(){l.textContent=o;},1600);};
    try{navigator.clipboard.writeText(location.href).then(done,done);}catch(e){done();}
  }

  function renderPlatformList(){
    $$('.bl-pf').forEach(function(box){
      var q=($('[data-bl-pfq]',box)||{value:''}).value.trim().toLowerCase();
      var counts={};filtered('platform').forEach(function(p){p.platforms.forEach(function(n){counts[n]=(counts[n]||0)+1;});});
      var html='<li><button type="button" class="bl-pf-opt'+(state.platform?'':' is-on')+'" data-bl-pfopt="">All platforms</button></li>';
      var n=0;
      PLATFORMS.forEach(function(x){
        if(q&&x.n.toLowerCase().indexOf(q)<0)return;
        n++;
        html+='<li><button type="button" class="bl-pf-opt'+(state.platform===x.n?' is-on':'')+'" data-bl-pfopt="'+esc(x.n)+'"><span>'+esc(x.n)+'</span><small>'+(counts[x.n]||0)+'</small></button></li>';
      });
      if(!n)html+='<li class="bl-pf-none">No platform matches</li>';
      $('[data-bl-pflist]',box).innerHTML=html;
      var lab=$('[data-bl-pflabel]',box);if(lab)lab.textContent=state.platform||'All platforms';
    });
  }

  function update(syncInputs){
    tokens=state.q.trim().split(/\s+/).filter(Boolean);
    var list=filtered();
    var n=list.length;
    var def=isDefault();

    /* sync inputs / selects without stealing focus */
    $$('input[data-bl-q]').forEach(function(i){if(document.activeElement!==i||syncInputs)i.value=state.q;});
    $$('[data-bl-clearq]').forEach(function(b){b.hidden=!state.q;});
    $$('select[data-bl-select="platform"]').forEach(function(s){s.value=state.platform;});
    $$('select[data-bl-select="agent"]').forEach(function(s){s.value=state.agent;});

    /* chips / checks / agents / tabs */
    $$('[data-bl-type]').forEach(function(b){
      var id=b.getAttribute('data-bl-type');
      var on=id===''?!state.types.length:state.types.indexOf(id)>=0;
      b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on);
    });
    var tcount={};filtered('type').forEach(function(p){tcount[p.type]=(tcount[p.type]||0)+1;});
    $$('[data-bl-typechk]').forEach(function(c){c.checked=state.types.indexOf(c.getAttribute('data-bl-typechk'))>=0;});
    $$('[data-bl-tc]').forEach(function(s){s.textContent=tcount[s.getAttribute('data-bl-tc')]||0;});
    var acount={};filtered('agent').forEach(function(p){p.agents.forEach(function(a){acount[a]=(acount[a]||0)+1;});});
    $$('[data-bl-agent]').forEach(function(b){var a=b.getAttribute('data-bl-agent');b.classList.toggle('is-on',state.agent===a);b.setAttribute('aria-pressed',state.agent===a);b.setAttribute('data-n',acount[a]||0);});
    var tot=filtered('type');
    $$('[data-bl-topic]').forEach(function(b){
      var tp=TOPICS.filter(function(x){return x.id===b.getAttribute('data-bl-topic');})[0];
      var cnt=tp.types.length?tot.filter(function(p){return tp.types.indexOf(p.type)>=0;}).length:tot.length;
      $('[data-bl-topc]',b).textContent=cnt;
      var on=sameSet(state.types,tp.types);b.classList.toggle('is-on',on);b.setAttribute('aria-selected',on);
    });
    renderPlatformList();

    /* result bar */
    var label=n+' post'+(n===1?'':'s')+(tokens.length?' for “'+esc(state.q.trim())+'”':'');
    $$('[data-bl-count]').forEach(function(c){c.innerHTML=label;});
    var pills='';
    if(state.q.trim())pills+='<button type="button" class="bl-pill" data-bl-remove="q:">Search: '+esc(state.q.trim())+I.x+'</button>';
    state.types.forEach(function(id){pills+='<button type="button" class="bl-pill" data-bl-remove="type:'+id+'">'+esc(T[id].label)+I.x+'</button>';});
    if(state.platform)pills+='<button type="button" class="bl-pill" data-bl-remove="platform:">'+esc(state.platform)+I.x+'</button>';
    if(state.agent)pills+='<button type="button" class="bl-pill" data-bl-remove="agent:">'+esc(state.agent)+I.x+'</button>';
    if(pills)pills+='<button type="button" class="bl-pill-clear" data-bl-reset>Clear all</button>';
    $$('[data-bl-active]').forEach(function(a){a.innerHTML=pills;a.hidden=!pills;});
    $$('[data-bl-fcount]').forEach(function(b){var k=(state.types.length)+(state.platform?1:0)+(state.agent?1:0);b.textContent=k?k:'';b.hidden=!k;});
    $$('[data-bl-show]').forEach(function(b){b.textContent='Show '+n+' post'+(n===1?'':'s');});

    /* lists */
    var empty=n===0;
    $$('[data-bl-empty]').forEach(function(e){e.hidden=!empty;});
    $$('[data-bl-body]').forEach(function(e){e.hidden=empty;});

    renderA(list,def);renderB(list);renderC(list);renderQuick(list);

    $$('[data-bl-more-wrap]').forEach(function(w){
      var v=w.getAttribute('data-bl-more-wrap');
      var total=v==='a'?restA(list,def).length:n;
      var shown=Math.min(v==='c'?cCount():state.shown,total);
      $('[data-bl-showing]',w).textContent='Showing '+shown+' of '+total;
      w.hidden=total<=shown;
    });
    writeURL();
  }

  function featList(){return POSTS.filter(function(p){return p.feat;}).sort(function(a,b){return a.feat-b.feat;});}
  function restA(list,def){
    if(!def)return list;
    var ids={};featList().forEach(function(p){ids[p.slug]=1;});
    return list.filter(function(p){return !ids[p.slug];});
  }
  function renderA(list,def){
    var fw=$('[data-bl-feat]');if(!fw)return;
    var fl=def?featList():[];
    fw.hidden=!fl.length;
    if(fl.length){
      fw.innerHTML='<a class="bl-feat-a" href="'+POST_HREF+'" aria-label="'+esc(fl[0].title)+'">'+feat(fl[0])+'</a><div class="bl-side-col">'+fl.slice(1,3).map(function(p,i){return side(p,i);}).join('')+'</div>';
    }
    $('[data-bl-grid="a"]').innerHTML=restA(list,def).slice(0,state.shown).map(function(p,i){return card(p,i);}).join('');
    var head=$('[data-bl-gridhead]');if(head)head.hidden=!def;
  }
  function renderB(list){
    var w=$('[data-bl-list="b"]');if(!w)return;
    w.innerHTML=list.slice(0,state.shown).map(function(p,i){return row(p,i);}).join('');
  }
  function cCount(){return state.shown+(state.shown%2?1:0);}
  function renderC(list){
    var w=$('[data-bl-list="c"]');if(!w)return;
    var items=list.slice(0,cCount());
    var big=items.slice(0,2),rest=items.slice(2);
    $('[data-bl-big]',w).innerHTML=big.map(function(p,i){return card(p,i,true);}).join('');
    $('[data-bl-minis]',w).innerHTML=rest.map(mini).join('');
  }
  function renderQuick(list){
    $$('[data-bl-quick]').forEach(function(q){
      if(tokens.join('').length<2||!list.length){q.hidden=true;q.innerHTML='';return;}
      q.hidden=false;
      q.innerHTML='<div class="bl-quick-h">Top matches</div>'+list.slice(0,4).map(function(p){
        return '<a class="bl-quick-i" href="'+POST_HREF+'"><span class="ct-badge '+T[p.type].badge+'">'+esc(T[p.type].label)+'</span><span class="bl-quick-t">'+hl(p.title)+'</span>'+I.arrow+'</a>';}).join('')+
        '<div class="bl-quick-f"><span>'+list.length+' result'+(list.length===1?'':'s')+' in the list below</span><span class="bl-quick-k"><kbd>&uarr;</kbd><kbd>&darr;</kbd> to browse</span></div>';
    });
  }

  /* ---------------------------------------------------------------- POST */
  var pb=$('[data-ct-block="post-layout"]');
  if(pb)initPost();

  function initPost(){
    var CUR='servicetitan-connection-guide';
    var me=POSTS.filter(function(p){return p.slug===CUR;})[0];
    if(me)$$('img[data-bl-cover]').forEach(function(i){i.src=me.cover;});
    /* related by platform, then by type, then newest */
    var rel=POSTS.filter(function(p){return p.slug!==CUR;}).map(function(p){
      var s=0;if(me){p.platforms.forEach(function(x){if(me.platforms.indexOf(x)>=0)s+=3;});if(p.type===me.type)s+=1;}
      return {p:p,s:s};
    }).sort(function(a,b){return b.s-a.s||(a.p.date<b.p.date?1:-1);}).slice(0,3).map(function(x){return x.p;});
    $$('[data-bl-related]').forEach(function(w){
      var st=w.getAttribute('data-bl-related');
      w.innerHTML=rel.map(function(p,i){return st==='b'?row(p,i):card(p,i,st==='c');}).join('');
    });

    var raf=0;
    function active(){return pb.getAttribute('data-active');}
    function spy(){
      raf=0;
      var v=$('.ct-v[data-v="'+active()+'"]',pb);if(!v)return;
      var heads=$$('[data-toc]',v).filter(function(h){return h.getBoundingClientRect().top<=150;});
      $$('.bl-toc, .bl-chipnav, .bl-rail',v).forEach(function(nav){
        var links=$$('a',nav),cur=null;
        /* the last passed heading that this navigation lists (chips list only the H2s) */
        heads.forEach(function(h){links.forEach(function(a){if(a.getAttribute('href')==='#'+h.id)cur=a;});});
        links.forEach(function(a){
          a.classList.toggle('is-on',a===cur);
          if(a===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
        });
      });
      if(active()==='c'){
        var art=$('[data-bl-article]',v);
        if(art){
          var r=art.getBoundingClientRect(),vh=window.innerHeight;
          var pr=Math.max(0,Math.min(1,(vh*0.15-r.top)/Math.max(1,r.height-vh*0.3)));
          var bar=$('.bl-progress i',v);if(bar)bar.style.transform='scaleX('+pr.toFixed(4)+')';
          var rail=$('.bl-rail',v);if(rail)rail.classList.toggle('is-on',r.top<vh*0.6&&r.bottom>vh*0.4);
        }
      }
    }
    function tick(){if(!raf)raf=requestAnimationFrame(spy);}
    window.addEventListener('scroll',tick,{passive:true});
    window.addEventListener('resize',tick);
    $$('.ct-switch button',pb).forEach(function(b){b.addEventListener('click',function(){setTimeout(tick,30);});});
    tick();
  }
})();
