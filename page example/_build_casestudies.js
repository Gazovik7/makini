// Builds the MCP "Use cases" block into mcp.html (after "How it works").
//
//   node _build_casestudies.js        -> writes the block into mcp.html
//   node _build_casestudies.js json   -> prints the CASES payload
//
// The original six client cases and an independent library of thirty Spectrum images.
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SVC = '{SAP EWM}';

const HEAD = {
  eyebrow: 'USE CASES',
  h2: `What teams actually run on the ${SVC} MCP server`,
  sub: `Six jobs agents do on live ${SVC} data today, over one MCP endpoint, ` +
       `with no custom integration behind any of them.`,
};

// ---------------------------------------------------------------- content
// Original client copy, preserved verbatim.
const CASES = [
  {
    "title": "Rank cycle count variances by bin and item",
    "text": "The agent reads cycle counts and the inventory adjustments posted from RF-SMART scans and ranks the largest variances by bin, item and counter. Inventory control leads decide which bins to recount and where receiving or picking habits need correcting."
  },
  {
    "title": "List orders that will miss today's carrier cutoff",
    "text": "Open sales orders are compared with item fulfillments and their carrier and ship status, and orders not yet picked or packed near the cutoff are listed by ship method. Shipping supervisors move pickers or warn customer service while there is still time."
  },
  {
    "title": "Set preferred bins for newly received items",
    "text": "Where the connection exposes bin settings, the agent lists recently received items with no preferred bin at their location, along with the bins where their stock now sits. Warehouse leads assign preferred bins so RF-SMART putaway and picking stop depending on who remembers where things go."
  },
  {
    "title": "Chase partly received purchase orders",
    "text": "Purchase order lines are compared with the item receipts scanned at the dock, and lines still short or overdue are listed by vendor with the quantities outstanding. Buyers follow up with the vendor before the missing stock delays customer orders."
  },
  {
    "title": "Find transfer orders stuck in transit",
    "text": "The agent compares transfer orders fulfilled at the shipping location with item receipts scanned at the destination and lists lines still pending receipt, with quantities and ship dates. Warehouse managers at both sites trace the missing stock before it shows up as a false shortage."
  },
  {
    "title": "Stage components for tomorrow's production runs",
    "text": "The agent reads tomorrow's production schedule from your MES through the same Makini endpoint and checks component availability by bin in the ERP behind RF-SMART. Material handlers get a shortage list and draft transfers to line-side staging bins to review."
  }
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------- markup
const ASSETS = './assets/use-cases';
const CATALOG = JSON.parse(fs.readFileSync(path.join(HERE, 'assets/use-cases/catalog.json'), 'utf8'));
if (CATALOG.length < CASES.length) throw new Error('Every case must have its own image.');
const background = i =>
  `<img src="${ASSETS}/processed/spectrum/${CATALOG[i].id}.webp" width="1200" height="800" alt="${esc(CATALOG[i].title)}" loading="lazy" decoding="async" style="object-position:${CATALOG[i].focus || '50% 50%'}" data-asset="${CATALOG[i].id}">`;

const ARROW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';
const ARROW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

const head = () =>
  `<div class="mc-head"><div class="s2-upheading center mc-eyebrow">${HEAD.eyebrow}</div>` +
  `<h2 class="h2">${HEAD.h2}</h2><p class="mc-sub">${HEAD.sub}</p></div>`;

// The open panel is wide, the next ones step down to slivers, the caption sits on the image,
// and a counter, progress bars and arrows sit underneath.
function gallery() {
  const panels = CASES.map((c, i) =>
    `<div class="cg-item" role="button" aria-label="${esc(c.title)}" data-i="${i}">${background(i)}` +
    `<div class="cg-over"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div></div>`).join('');
  const dots = CASES.map((c, i) =>
    `<button class="cg-dot" type="button" aria-label="${esc(c.title)}"></button>`).join('');
  return '<div class="cg" data-cg>' +
    `<div class="cg-track">${panels}</div>` +
    '<div class="cg-ctrl"><div class="cg-prog"><span class="cg-count" aria-live="off"></span>' +
    `<div class="cg-dots">${dots}</div></div>` +
    '<div class="cg-nav">' +
    `<button class="cg-btn cg-prev" type="button" aria-label="Previous use case">${ARROW_L}</button>` +
    `<button class="cg-btn cg-next" type="button" aria-label="Next use case">${ARROW_R}</button>` +
    '</div></div></div>';
}

function library() {
  const categories = ['All','Warehouse','Logistics','Manufacturing','Maintenance','Infrastructure'];
  return '\n<!-- S: Industrial image library -->\n' +
    '<section class="mc-sec bg-a mc-image-library" id="industrial-images" aria-label="Industrial image library"><div class="m-container">' +
    '<div class="mc-image-tabs" role="tablist" aria-label="Image categories">' +
    categories.map((c,i)=>`<button type="button" role="tab" id="mc-image-tab-${i}" data-image-category="${c}" aria-controls="mc-image-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${c}</button>`).join('') +
    '</div><div id="mc-image-panel" role="tabpanel" aria-labelledby="mc-image-tab-0" tabindex="0"><div class="mc-image-grid">' +
    CATALOG.map(a=>`<img src="${ASSETS}/processed/spectrum/${a.id}.webp" alt="${esc(a.title)}" width="1200" height="800" loading="lazy" decoding="async" data-image-industry="${a.category}">`).join('') +
    '</div></div><script src="./assets/use-cases/review.js"></script></div></section>\n';
}

// Layout runs from a ResizeObserver, so it is right at load and after any resize.
const GALLERY_JS = `<script>(function(){
var S=document.currentScript.closest('section');
[].forEach.call(S.querySelectorAll('[data-cg]'),function(g){
  var track=g.querySelector('.cg-track');
  var items=[].slice.call(track.children),n=items.length,i=0;
  var prev=g.querySelector('.cg-prev'),next=g.querySelector('.cg-next');
  var dots=[].slice.call(g.querySelectorAll('.cg-dot')),count=g.querySelector('.cg-count');
  // The track loops: after the last case the first one is already waiting on the right, and
  // the arrows never dead-end. Copies of the panels make that possible. They are built here
  // rather than in the HTML, so the page source carries each case once, and they stay out of
  // the accessibility tree and the tab order. There must be enough of them on both sides for
  // the biggest single move (a click on the farthest visible panel jumps FOLLOW cases, and the
  // panel it lands on still needs FOLLOW panels after it) plus a burst of quick clicks before
  // the track gets a chance to settle: at least 8 panels before the real ones, 16 after.
  var FOLLOW=5;
  var before=Math.max(1,Math.ceil(8/n)),after=Math.max(1,Math.ceil(16/n));
  var mk=function(el){var c=el.cloneNode(true);c.classList.add('cg-clone');c.setAttribute('aria-hidden','true');
    c.removeAttribute('role');c.removeAttribute('aria-label');c.tabIndex=-1;return c;};
  var lead=document.createDocumentFragment();
  for(var c=0;c<before;c++)items.forEach(function(el){lead.appendChild(mk(el));});
  track.insertBefore(lead,track.firstChild);
  for(c=0;c<after;c++)items.forEach(function(el){track.appendChild(mk(el));});
  var base=before*n;
  items=[].slice.call(track.children);i=base;
  // A lazy image loads only once it is on screen, so a copy sliding in could show up blank for
  // a frame. Once the gallery is near the screen, load them all; the copies reuse the same
  // files, so this adds no requests.
  var imgs=[].slice.call(g.querySelectorAll('img'));
  var eager=function(){imgs.forEach(function(im){im.loading='eager';});};
  if('IntersectionObserver' in window){var po=new IntersectionObserver(function(en){
    if(en[0].isIntersecting){eager();po.disconnect();}},{rootMargin:'800px 0px'});po.observe(g);}else eager();
  var clone=function(el){return el.classList.contains('cg-clone');};
  // Every caption gets the height of the longest one, so titles sit on one line across slides
  var overs=[].slice.call(g.querySelectorAll('.cg-item:not(.cg-clone) .cg-over'));
  function fit(){g.style.setProperty('--cg-over-h','auto');
    var h=0;overs.forEach(function(o){h=Math.max(h,o.offsetHeight);});if(h)g.style.setProperty('--cg-over-h',h+'px');}
  function instant(fn){track.classList.add('cg-noanim');fn();void track.offsetWidth;track.classList.remove('cg-noanim');}
  function sizes(){
    var W=track.clientWidth;if(!W)return;
    var mob=W<900,tail=mob?[40,12]:[200,96,48,12,12],gap=mob?10:16;
    var w=items.map(function(_,k){return k<i?0:(k===i?-1:(tail[k-i-1]||0));});
    var last=-1,shown=0,rest=0;
    w.forEach(function(x,k){if(x!==0){last=k;shown++;}if(x>0)rest+=x;});
    var act=W-rest-gap*(shown-1);
    g.style.setProperty('--cg-act-w',act+'px');
    items.forEach(function(el,k){
      var x=w[k]===-1?act:w[k];
      el.style.width=x+'px';
      el.style.marginRight=(x>0&&k<last)?gap+'px':'0px';
      if(!clone(el)){el.tabIndex=x>0?0:-1;el.setAttribute('aria-hidden',x>0?'false':'true');}
    });
    track.classList.add('is-ready');
  }
  function mark(){items.forEach(function(el,j){el.classList.toggle('is-active',j===i);
    if(!clone(el))el.setAttribute('aria-current',j===i?'true':'false');});}
  function render(){
    var c=((i%n)+n)%n;
    mark();
    dots.forEach(function(d,j){d.classList.toggle('is-on',j===c);});
    count.textContent=('0'+(c+1)).slice(-2)+' / '+('0'+n).slice(-2);
    sizes();
  }
  // Going back from a copy to the real panels shows exactly the same pictures in the same
  // places, so it is done without animation. It waits until the gallery has settled after the
  // last move (1.3s, longer than the slowest transition, the 1.2s image zoom), so it never cuts
  // into a running animation. Only a burst long enough to run out of copies forces it early.
  var settle=null;
  function home(){return base+((i%n)+n)%n;}
  function norm(){var m=home();if(m===i)return;i=m;instant(function(){mark();sizes();});}
  function go(d){
    if(i+d<1||i+d+FOLLOW>items.length-1)norm();
    i+=d;render();
    clearTimeout(settle);settle=setTimeout(norm,1300);
  }
  function step(d){go(d);}
  function toCase(j){go(j-((i%n)+n)%n);}
  items.forEach(function(el,k){
    el.addEventListener('click',function(){step(k-i);});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();step(k-i);}});
  });
  prev.addEventListener('click',function(){step(-1);});
  next.addEventListener('click',function(){step(1);});
  dots.forEach(function(d,j){d.addEventListener('click',function(){toCase(j);});});
  g.addEventListener('keydown',function(e){if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);});

  // Swipe on touch screens. Vertical drags still scroll the page (touch-action: pan-y in the
  // CSS); a mostly horizontal drag of 40px or more moves one case, and the tap that a swipe
  // can leave behind is ignored so it does not also open the panel under the finger.
  var sx=0,sy=0,touching=false,swipedAt=0;
  track.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;touching=true;},{passive:true});
  track.addEventListener('touchend',function(e){if(!touching)return;touching=false;
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)*1.2){swipedAt=Date.now();step(dx<0?1:-1);}},{passive:true});
  track.addEventListener('touchcancel',function(){touching=false;},{passive:true});
  track.addEventListener('click',function(e){if(Date.now()-swipedAt<400){e.stopPropagation();e.preventDefault();}},true);

  // Autoplay, one case per --cg-dur (6s). The
  // active progress bar is the timer: when its fill animation ends, the gallery moves on, so
  // any pause of the fill pauses the gallery and any move restarts the count. It pauses while
  // a mouse is over the gallery, while keyboard focus is inside it, while it is mostly
  // off-screen and while the tab is hidden. Touch does not stop it, like the tabs on the site.
  // Reduced motion turns it off.
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){g.classList.add('cg-static');}
  else{
    var hold={hover:false,focus:false,off:true,hidden:document.hidden};
    var apply=function(){g.classList.toggle('cg-paused',hold.hover||hold.focus||hold.off||hold.hidden);};
    var fine=matchMedia('(hover:hover) and (pointer:fine)');
    g.addEventListener('mouseenter',function(){if(fine.matches){hold.hover=true;apply();}});
    g.addEventListener('mouseleave',function(){hold.hover=false;apply();});
    // keyboard focus only: a tap or click on an arrow also focuses it, and that must not stop it
    g.addEventListener('focusin',function(e){if(e.target.matches(':focus-visible')){hold.focus=true;apply();}});
    g.addEventListener('focusout',function(e){if(!g.contains(e.relatedTarget)){hold.focus=false;apply();}});
    document.addEventListener('visibilitychange',function(){hold.hidden=document.hidden;apply();});
    if('IntersectionObserver' in window)new IntersectionObserver(function(en){hold.off=!en[0].isIntersecting;apply();},{threshold:.35}).observe(g);
    else hold.off=false;
    dots.forEach(function(d){d.addEventListener('animationend',function(e){
      if(e.animationName==='cg-fill'&&d.classList.contains('is-on'))step(1);});});
    apply();
  }

  if('ResizeObserver' in window)new ResizeObserver(function(){instant(function(){sizes();fit();});}).observe(track);
  instant(function(){render();fit();});
});
})();</script>`;

function section() {
  return '\n<!-- S: Use cases -->\n' +
    '<section class="mc-sec mc-glow-tr bg-a mc-divide" id="use-cases"><div class="m-container">' +
    head() + gallery() + GALLERY_JS + '</div></section>\n' + library();
}

// ---------------------------------------------------------------- write into mcp.html
const read = p => fs.readFileSync(path.join(HERE, p), 'utf8');

function ship() {
  let h = read('mcp.html');
  // mcp.html has been saved with Windows line endings; match either, and write back in kind
  const eol = h.includes('\r\n') ? '\r\n' : '\n';
  // earlier builds used the "Case studies" name; remove either
  const before = (h.match(/<!-- S: (Case studies|Use cases)/g) || []).length;
  h = h.replace(/\r?\n<!-- S: (Case studies|Use cases).*?<\/section>\r?\n/gs, '');
  h = h.replace(/\r?\n<!-- S: Industrial image library -->.*?<\/section>\r?\n/gs, '');
  h = h.replace(/<!-- (casestudies|usecases)-css -->.*?<\/style>/gs, '');
  if (/<!-- S: (Case studies|Use cases)/.test(h)) throw new Error('old block could not be removed');
  const frag = read('_frag_casestudies.html');
  const css = '<!-- usecases-css -->' + frag.slice(frag.indexOf('<style>')).trim().replace(/\r?\n/g, eol);
  h = h.replace('</head>', css + '</head>');
  // after "How it works", before "Why Makini MCP": the reader has just seen the mechanism,
  // the cases answer "what do I do with it", Capabilities then argues on top of the evidence
  const anchor = '<section class="mc-sec mc-glow-bl bg-a mc-divide sec-hero-h" id="capabilities">';
  if (!h.includes(anchor)) throw new Error('anchor section #capabilities not found');
  h = h.replace(anchor, section().replace(/\n/g, eol) + anchor);
  fs.writeFileSync(path.join(HERE, 'mcp.html'), h);
  const workflows = CASES.map((c,i) => ({...c, id:CATALOG[i].id, category:CATALOG[i].category,
    image:`processed/spectrum/${CATALOG[i].id}.webp`, original:`originals/${CATALOG[i].id}.jpg`}));
  fs.writeFileSync(path.join(HERE, 'assets/use-cases/workflows.json'), JSON.stringify(workflows,null,2)+'\n');
  console.log(`mcp.html: use cases block written (replaced ${before} old block)`);
}

const cmd = process.argv[2] || 'ship';
if (cmd === 'ship') ship();
else if (cmd === 'json') console.log(JSON.stringify(CASES, null, 2));
else { console.error('usage: node _build_casestudies.js [ship | json]'); process.exit(1); }
