const fs = require('fs');
const F = 'd:/VSCODE/makini/page example/index.html';
const ASSETS_DIR = 'd:/VSCODE/makini/page example/SAP EWM API integration – connect to anything – Makini_files';
const ASSETS_REL = './SAP EWM API integration – connect to anything – Makini_files';
let h = fs.readFileSync(F, 'utf8');
// returns relative src if a real logo file exists for this slug, else null
function logoSrc(slug){
  for (const ext of ['svg','png','webp']){
    if (fs.existsSync(ASSETS_DIR + '/logo-' + slug + '.' + ext)) return ASSETS_REL + '/logo-' + slug + '.' + ext;
  }
  return null;
}

const anchor = '<section class="s5"><div class="m-container"><h2 class="h2 white">Explore more integrations</h2>';
const anchorIdx = h.indexOf(anchor);
if (anchorIdx === -1) { console.error('anchor not found'); process.exit(1); }

// remove the previously-injected block: from the <style> that contains .uc-sec up to the anchor
const ucMark = h.indexOf('.uc-sec{padding:80px 0');
if (ucMark !== -1) {
  const styleStart = h.lastIndexOf('<style>', ucMark);
  h = h.slice(0, styleStart) + h.slice(anchorIdx);
}
const insertAt = h.indexOf(anchor); // recompute after removal

// ---------- improved CSS: centered horizontal tabs + makini-card panel ----------
const STYLE = `<style>
  .uc-sec{padding:80px 0;position:relative;z-index:2;overflow:hidden}
  .uc-sec::before{content:"";position:absolute;z-index:-1;width:780px;height:480px;border-radius:50%;filter:blur(140px);opacity:.4;top:-160px;left:50%;transform:translateX(-50%);background:radial-gradient(circle,#9468f23d,transparent 70%);pointer-events:none}
  .uc-head{max-width:760px;margin:0 auto 40px;text-align:center;position:relative;z-index:1}
  .uc-tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:1040px;margin:0 auto 28px;position:relative;z-index:1}
  .uc-tab{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:3px;text-align:left;padding:14px 22px;min-width:218px;border-radius:14px;border:1px solid #ffffff14;background:#ffffff08;color:#c6c7cc;font-family:inherit;cursor:pointer;transition:.2s}
  .uc-tab:hover{border-color:#ffffff2e;background:#ffffff0d;transform:translateY(-1px)}
  .uc-tab.active{border-color:#71a1ff66;background:linear-gradient(135deg,#71a1ff24,#ef68f218);box-shadow:0 8px 26px #9468f22e}
  .uc-tab-bg{position:absolute;z-index:0;pointer-events:none;right:16px;top:50%;transform:translateY(-50%);height:30px;width:auto;max-width:52%;object-fit:contain;object-position:right center;opacity:.32;-webkit-mask-image:linear-gradient(to left,#000 75%,transparent);mask-image:linear-gradient(to left,#000 75%,transparent)}
  .uc-tab.active .uc-tab-bg{opacity:.46}
  .uc-tab-bg.logo{height:24px;width:104px;max-width:none;object-fit:contain;object-position:right center;opacity:.22}
  .uc-tab.active .uc-tab-bg.logo{opacity:.3}
  .uc-tab-bg.mono{height:auto;max-width:none;right:16px;font-size:50px;font-weight:800;line-height:1;letter-spacing:-2px;color:#fff;opacity:.08}
  .uc-tab.active .uc-tab-bg.mono{opacity:.13}
  .uc-tab-txt{position:relative;z-index:1;display:flex;flex-direction:column;gap:3px}
  .uc-tab-name{color:#fff;font-size:15px;font-weight:600;line-height:20px}
  .uc-tab-cat{font-size:12px;line-height:16px;color:#959599}
  .uc-tab.active .uc-tab-cat{color:#c6c7cc}
  .uc-panelwrap{display:grid;align-items:start;max-width:1040px;margin:0 auto;position:relative;background-image:radial-gradient(circle at 100% 0,#212433,#1b1921);border:1px solid #ffffff14;border-radius:20px;padding:36px 40px;overflow:hidden}
  .uc-panelwrap::after{content:"";position:absolute;z-index:0;top:-30px;right:-26px;width:200px;height:200px;border-radius:100%;filter:blur(75px);opacity:.5;background:#b355d166;pointer-events:none}
  .uc-panel{grid-area:1/1;position:relative;z-index:1;visibility:hidden;opacity:0;pointer-events:none;transition:opacity .25s ease}
  .uc-panel.active{visibility:visible;opacity:1;pointer-events:auto}
  .uc-panel-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px;min-height:54px}
  .uc-panel-cust{color:#fff;font-size:24px;font-weight:600;line-height:32px}
  .uc-panel-cust span{display:block;color:#959599;font-size:13px;font-weight:400;line-height:18px;margin-top:2px}
  .uc-cat-badge{display:inline-flex;align-items:center;padding:7px 14px;border-radius:999px;font-size:13px;color:#dfe7ff;background:linear-gradient(135deg,#71a1ff29,#ef68f21f);border:1px solid #71a1ff45;white-space:nowrap}
  .uc-conn{display:flex;flex-wrap:wrap;align-items:center;gap:22px;padding-bottom:22px;border-bottom:1px solid #ffffff14;margin-bottom:24px}
  .uc-conn-label{color:#959599;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-right:2px}
  .uc-conn-item{display:inline-flex;align-items:center;gap:10px}
  .uc-circle{width:40px;height:40px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff}
  .uc-circle img{width:30px;height:30px;object-fit:contain;display:block}
  .uc-circle.mono{color:#fff;font-size:13px;font-weight:700;letter-spacing:.3px}
  .uc-conn-name{color:#fff;font-size:14px;font-weight:500}
  .uc-blocks{display:flex;flex-direction:column;gap:22px}
  .uc-block{display:grid;grid-template-columns:110px 1fr;gap:20px;align-items:start}
  .uc-bh3{min-height:80px}
  .uc-bh2{min-height:56px}
  .uc-block-label{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;padding-top:3px}
  .uc-block-label .d{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
  .uc-l-problem{color:#ff8a8a}.uc-l-problem .d{background:#ff8a8a}
  .uc-l-before{color:#959599}.uc-l-before .d{background:#959599}
  .uc-l-after{color:#7ee7b1}.uc-l-after .d{background:#7ee7b1}
  .uc-block p{margin:0;color:#c6c7cc;font-size:15px;line-height:25px}
  @media (max-width:767px){.uc-sec{padding:56px 0}.uc-tab{flex:1 1 140px}.uc-panelwrap{padding:24px}.uc-block{grid-template-columns:1fr;gap:6px}}
</style>`;

const grads = ['linear-gradient(135deg,#71a1ff,#9468f2)','linear-gradient(135deg,#9468f2,#ef68f2)','linear-gradient(135deg,#ef68f2,#71a1ff)'];
function initials(name){
  const w = name.trim().split(/\s+/);
  if (w.length > 1) return w.slice(0,3).map(s=>s[0]).join('').toUpperCase();
  return (name.length <= 4 && name === name.toUpperCase()) ? name : name.slice(0,2);
}
const connItem = (name, slug, i) => {
  const src = logoSrc(slug);
  const circle = src
    ? `<span class="uc-circle"><img src="${src}" loading="lazy" alt="${name} logo"></span>`
    : `<span class="uc-circle mono" style="background:${grads[i%grads.length]}">${initials(name)}</span>`;
  return `<span class="uc-conn-item">${circle}<span class="uc-conn-name">${name}</span></span>`;
};
const cases = [
  { key:'tfg', name:'The Facilities Group', sub:'', cat:'Integrated Facility Management',
    conn:[['Corrigo','corrigo']],
    problem:'TFG runs preventive maintenance at 30,000+ buildings across North America. Every facility owner they serve runs a different FSM — Corrigo, Fexa, ServiceChannel — so every new account historically meant another integration.',
    before:'TFG engineers rebuilt the same work-order, status, notes and attachment sync from scratch for every new FSM. The cost of saying “yes” to a new client kept rising with every win.',
    after:'TFG’s JAN-IT platform speaks one Makini object model. Each new client tenant is a connection, not an engineering project — eight bidirectional workflows cover PM and non-PM work orders, status, check-in/check-out, notes and attachments across every supported FSM.' },
  { key:'mcim', name:'MCIM', sub:'by Fulcrum Collaborations', cat:'Mission-Critical Facility Management',
    conn:[['NTT','ntt']],
    problem:'MCIM is the EAM/CMMS/APM platform for mission-critical data centers. Subscribers like NTT also run ERP, ITSM and DCIM tools where the same asset and work-order data has to live — but data was locked inside each system.',
    before:'Every subscriber expected MCIM to deliver integrations into their stack, but building them one-by-one meant slow onboarding and a growing backlog of one-off connectors. New subscribers waited months for basic data flow.',
    after:'MCIM uses Makini’s Universal API to deliver hundreds of pre-built ERP, MES and WMS integrations to subscribers like NTT through one common connector layer. New subscriber onboarding is a connection, not a custom build.' },
  { key:'servicetitan', name:'ServiceTitan', sub:'', cat:'Field Service Management',
    conn:[['Corrigo','corrigo'],['ServiceChannel','servicechannel'],['Fexa','fexa']],
    problem:'Commercial contractors on ServiceTitan get work assignments from the CMMS platforms their facility-owner clients run — Corrigo, Corrigo Pro, ServiceChannel, Fexa, Verisae, Maximo, FM:Systems. Each platform is a different integration with a different data shape.',
    before:'Contractors manually retyped work orders from each CMMS into ServiceTitan as Bookings and logged into multiple systems to push status updates — Dispatched, Arrived, Working, Completed.',
    after:'Work orders flow from any supported CMMS into ServiceTitan as Bookings automatically. Accept/Decline responses and technician check-in/check-out events sync back to the CMMS as activity-log entries — one Makini connection per contractor’s CMMS account.' },
  { key:'brightly', name:'Brightly Software', sub:'Asset Essentials', cat:'CMMS / EAM',
    conn:[['Licking County Utilities','licking']],
    problem:'Brightly’s customers like Licking County Utilities were running legacy on-premises CMMSes (MP2 on Antero, Tier II) and needed to move to Asset Essentials — but migration meant pulling sites, assets, work orders and history out of an aging system before any of it could be useful in the new one.',
    before:'Each subscriber migration was a custom extraction project — sites, hierarchies, assets and work-order history had to be pulled, mapped and loaded by hand, slowing every onboarding.',
    after:'Brightly uses Makini to extract data directly from the legacy CMMS and migrate it into Asset Essentials inside a 30-day project window — sites, assets and work-order history flow into AE through one repeatable connector pattern instead of a one-off ETL each time.' },
];

const MARK = { tfg:'TFG', mcim:'MCIM', servicetitan:'ST', brightly:'BR' };
// per-tab background logo (white silhouette in assets); falls back to letters if absent
const TAB_LOGO = { tfg:'logo-tfg-trim.png', mcim:'logo-mcim-trim.png', servicetitan:'logo-servicetitan-trim.png', brightly:'logo-brightly-trim.png' };
const tabs = cases.map((c,i)=>{
  const lf = TAB_LOGO[c.key];
  const bg = (lf && fs.existsSync(ASSETS_DIR + '/' + lf))
    ? `<img class="uc-tab-bg logo" src="${ASSETS_REL}/${lf}" loading="lazy" alt="" aria-hidden="true">`
    : `<span class="uc-tab-bg mono" aria-hidden="true">${MARK[c.key]||initials(c.name)}</span>`;
  return `<button class="uc-tab${i===0?' active':''}" type="button" data-uc="${c.key}" role="tab" aria-selected="${i===0}">${bg}<span class="uc-tab-txt"><span class="uc-tab-name">${c.name}</span><span class="uc-tab-cat">${c.cat}</span></span></button>`;
}).join('');
const panels = cases.map((c,i)=>`<div class="uc-panel${i===0?' active':''}" id="uc-${c.key}" role="tabpanel">
  <div class="uc-panel-top"><div class="uc-panel-cust">${c.name}${c.sub?`<span>${c.sub}</span>`:''}</div><span class="uc-cat-badge">${c.cat}</span></div>
  <div class="uc-blocks">
    <div class="uc-block uc-bh3"><span class="uc-block-label uc-l-problem"><span class="d"></span>Problem</span><p>${c.problem}</p></div>
    <div class="uc-block uc-bh2"><span class="uc-block-label uc-l-before"><span class="d"></span>Before</span><p>${c.before}</p></div>
    <div class="uc-block uc-bh3"><span class="uc-block-label uc-l-after"><span class="d"></span>After</span><p>${c.after}</p></div>
  </div>
</div>`).join('');

const SECTION = `<section class="uc-sec" id="use-cases"><div class="m-container">
  <div class="uc-head"><div class="s2-upheading center">Case study</div><h2 class="h2">One integration, every customer</h2><div class="s3-subheading">How facility, field-service and CMMS platforms use Makini to turn each new client into a connection — not an engineering project.</div></div>
  <div class="uc-tabs" role="tablist">${tabs}</div>
  <div class="uc-panelwrap">${panels}</div>
</div></section>`;

const SCRIPT = `<script>(function(){var t=document.querySelectorAll('.uc-tab'),p=document.querySelectorAll('.uc-panel');t.forEach(function(b){b.addEventListener('click',function(){t.forEach(function(x){x.classList.remove('active');x.setAttribute('aria-selected','false')});p.forEach(function(x){x.classList.remove('active')});b.classList.add('active');b.setAttribute('aria-selected','true');var el=document.getElementById('uc-'+b.getAttribute('data-uc'));if(el)el.classList.add('active')})})})();</script>`;

h = h.slice(0, insertAt) + STYLE + SECTION + SCRIPT + h.slice(insertAt);
fs.writeFileSync(F, h, 'utf8');
console.log('use-cases improved; file now', h.length, 'chars');
