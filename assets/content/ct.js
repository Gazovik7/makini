/* Makini content system - shared behaviour: variant switchers, annotation toggle, review panel, inner tabs. */
(function(){
  var KEY='ct-variant-', ANNO='ct-anno';
  function get(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function set(k,v){try{localStorage.setItem(k,v);}catch(e){}}

  /* ---- variant switchers: one per .ct-block, choice saved per block id ---- */
  document.querySelectorAll('.ct-block').forEach(function(b){
    var id=b.getAttribute('data-ct-block'),vs=b.querySelectorAll(':scope .ct-v');
    var letters=[];vs.forEach(function(v){var l=v.getAttribute('data-v');if(letters.indexOf(l)<0)letters.push(l);});
    var saved=get(KEY+id);
    b.setAttribute('data-active',letters.indexOf(saved)>=0?saved:letters[0]);
    var sw=b.querySelector(':scope .ct-switch');
    if(!sw)return;
    sw.querySelectorAll('button').forEach(function(btn){
      btn.classList.toggle('is-on',btn.getAttribute('data-v')===b.getAttribute('data-active'));
      btn.addEventListener('click',function(){
        var v=btn.getAttribute('data-v');b.setAttribute('data-active',v);set(KEY+id,v);
        sw.querySelectorAll('button').forEach(function(x){x.classList.toggle('is-on',x===btn);});
        window.dispatchEvent(new Event('resize'));
      });
    });
  });

  /* ---- inner tabs: [data-ct-tabs] with [data-tab] buttons and [data-pane] panels ---- */
  document.querySelectorAll('[data-ct-tabs]').forEach(function(root){
    var btns=root.querySelectorAll('[data-tab]'),panes=root.querySelectorAll('[data-pane]');
    function open(n){btns.forEach(function(b){var on=b.getAttribute('data-tab')===n;b.classList.toggle('is-on',on);b.setAttribute('aria-selected',on);});
      panes.forEach(function(p){p.hidden=p.getAttribute('data-pane')!==n;});}
    btns.forEach(function(b){b.addEventListener('click',function(){open(b.getAttribute('data-tab'));});});
    if(btns.length)open(btns[0].getAttribute('data-tab'));
  });

  /* ---- filter chips: [data-ct-filter] with [data-f] buttons filtering [data-t] rows ---- */
  document.querySelectorAll('[data-ct-filter]').forEach(function(root){
    var btns=root.querySelectorAll('[data-f]'),rows=root.querySelectorAll('[data-t]');
    btns.forEach(function(b){b.addEventListener('click',function(){
      var f=b.getAttribute('data-f');
      btns.forEach(function(x){x.classList.toggle('is-on',x===b);});
      rows.forEach(function(r){r.hidden=!(f==='all'||r.getAttribute('data-t')===f);});
    });});
  });

  /* ---- real video: poster until clicked, chapters seek, "Watch" tile opens the video variant ---- */
  function startVideo(box,t){
    var v=box.querySelector('video');
    document.querySelectorAll('[data-cb-video] video').forEach(function(o){if(o!==v)o.pause();});
    if(!v){
      v=document.createElement('video');v.src=box.getAttribute('data-cb-video');v.controls=true;v.preload='auto';
      v.setAttribute('playsinline','');box.appendChild(v);box.classList.add('is-playing');
      v.addEventListener('loadedmetadata',function(){if(t)v.currentTime=t;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});});
      v.addEventListener('timeupdate',function(){
        var wrap=box.closest('.cb-guide-b');if(!wrap)return;var now=null;
        wrap.querySelectorAll('button.cb-chap').forEach(function(c){if(parseFloat(c.getAttribute('data-t'))<=v.currentTime+0.3)now=c;});
        wrap.querySelectorAll('button.cb-chap').forEach(function(c){c.classList.toggle('is-now',c===now);});
      });
    }else{if(t!=null)v.currentTime=t;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}
  }
  document.querySelectorAll('[data-cb-video]').forEach(function(box){
    box.addEventListener('click',function(e){if(e.target.tagName==='VIDEO')return;if(!box.classList.contains('is-playing'))startVideo(box,0);});
    box.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&!box.classList.contains('is-playing')){e.preventDefault();startVideo(box,0);}});
  });
  document.querySelectorAll('button.cb-chap[data-t]').forEach(function(c){
    c.addEventListener('click',function(){
      var wrap=c.closest('.cb-guide-b'),box=wrap&&wrap.querySelector('[data-cb-video]');
      if(box)startVideo(box,parseFloat(c.getAttribute('data-t')));
    });
  });
  document.querySelectorAll('[data-cb-watch]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();var blk=a.closest('.ct-block');if(!blk)return;
      var btn=blk.querySelector('.ct-switch button[data-v="b"]');if(btn)btn.click();
      var box=blk.querySelector('.cb-guide-b [data-cb-video]');if(box){box.scrollIntoView({behavior:'smooth',block:'center'});startVideo(box,0);}
    });
  });

  /* ---- review panel ---- */
  var pages=[['platform-maintainx-cases.html','MaintainX, Customer stories','/integrations/maintain-x'],
             ['platform-maintainx-data.html','MaintainX, Supported data','/integrations/maintain-x'],
             ['mcp-servicetitan.html','ServiceTitan MCP, real data','/mcp/servicetitan'],
             ['platform-servicetitan.html','ServiceTitan, real data','/integrations/servicetitan'],
             ['platform-content.html','Platform page','/integrations/{platform}'],
             ['platform-corrigopro.html','CorrigoPro, real video','/integrations/corrigo-pro'],
             ['platform-maintainx.html','MaintainX, real content','/integrations/maintain-x'],
             ['mcp-content.html','MCP page','/mcp/{platform}'],
             ['index-content.html','Home','/'],
             ['blog-v2.html','Blog listing, new style','/blog'],
             ['blog.html','Blog listing, old','/blog'],
             ['blog-post.html','Blog post','/blog/{slug}'],
             ['case-study.html','Case study','/blog/{slug}, Type = Case']];
  var here=location.pathname.split('/').pop();
  var panel=document.createElement('div');panel.className='ct-panel';
  var links=pages.map(function(p){return '<a href="./'+encodeURI(p[0])+'"'+(p[0]===here?' class="is-here"':'')+'>'+p[1]+'<small>'+p[2]+'</small></a>';}).join('');
  panel.innerHTML='<div class="ct-panel-box"><label><input type="checkbox" id="ct-anno-toggle"> Highlight new blocks</label><h4>Pages in this review</h4>'+links+'</div><button class="ct-panel-btn" type="button"><i></i>Content blocks</button>';
  document.body.appendChild(panel);
  panel.querySelector('.ct-panel-btn').addEventListener('click',function(){panel.classList.toggle('is-open');});
  var cb=panel.querySelector('#ct-anno-toggle');
  var on=get(ANNO);on=on===null?'1':on;
  cb.checked=on==='1';document.body.classList.toggle('ct-show-anno',cb.checked);
  cb.addEventListener('change',function(){set(ANNO,cb.checked?'1':'0');document.body.classList.toggle('ct-show-anno',cb.checked);});
})();
