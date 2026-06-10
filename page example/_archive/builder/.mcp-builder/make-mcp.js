// Makini MCP page generator.
//  - Run:  node ".mcp-builder/make-mcp.js"   (paths resolve from this file)
//  - Generic page -> ../mcp.html ; each SERVICE below -> ../mcp-<slug>.html
//  - To add a per-service MCP page, append to SERVICES. `logo` is a filename
//    inside the "..._files" assets folder (reuse any integration logo there).
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const DIR = path.resolve(HERE, '..');                 // the "page example" folder
const A = './SAP EWM API integration – connect to anything – Makini_files';
const header  = fs.readFileSync(path.join(HERE,'blk_header.html'),'utf8');
const train   = fs.readFileSync(path.join(HERE,'blk_homeS2.html'),'utf8');
const footer  = fs.readFileSync(path.join(HERE,'blk_footer.html'),'utf8');
let explore   = fs.readFileSync(path.join(HERE,'blk_explore.html'),'utf8');
explore = explore.replace('Explore more integrations','2,000+ systems available over MCP');

// Add more services here to generate mcp-<slug>.html for each.
//   logo: filename in the assets folder; integrationUrl (optional): the matching
//   integration page — adds an Integration <-> MCP switcher to the hero.
const SERVICES = [
  { name:'SAP EWM', slug:'sap-ewm', logo:'67080ac3f5d59e851d4cbb00_VuUw59TdK1FK9dvmnJ0CSZFghJO0bbRC-DkxVUWtCzo.webp', integrationUrl:'index.html' },
  { name:'Blue Yonder', slug:'blue-yonder', logo:'65b3a8373d3ea3723f5477ee_f7Vgz5UfBJ0l9dc5VDQm-BGe6Al4R1GEis4GEmOMeCM.webp', integrationUrl:'https://www.makini.io/integrations/blue-yonder' },
];

const DOCS = 'https://docs.makini.io/docs/api-docs/branches/master/df956de0eed6b-makini-api';
const APP  = 'https://app.makini.io/register';

// ===== per-service config; svc=null => generic Makini MCP page =====
function build(svc){
const NAME = svc ? svc.name : 'Makini';
const SLUG = svc ? svc.slug : 'sap-ewm';
const H1A  = svc ? svc.name : 'The Makini';
const H1B  = ' MCP Server';
const SUBLEAD = svc
  ? `Give your AI agents secure, real-time access to ${svc.name} — and 2,000+ other systems — through one&nbsp;`
  : `Give your AI agents secure, real-time access to 2,000+ CMMS, EAM, WMS and ERP systems — through one&nbsp;`;
const BREAD = svc ? svc.name : 'MCP Server';
const HEROLOGO = svc ? `<img loading="lazy" alt="" src="${A}/${svc.logo}" class="int-logo">` : '';
const TITLE = svc ? `${svc.name} MCP – connect AI agents to ${svc.name}` : 'Makini MCP Server – connect AI agents to your systems';
const DESC = svc
  ? `Connect AI agents to ${svc.name} through the Model Context Protocol. The Makini MCP server exposes ${svc.name} data and actions — plus 2,000+ other systems — over one secure endpoint.`
  : 'The Makini MCP server gives AI agents secure, real-time access to 2,000+ CMMS, EAM, WMS and ERP systems through one Model Context Protocol endpoint.';
const OGT = svc ? `${svc.name} MCP Server` : 'Makini MCP Server';
const WHAT_H2 = svc ? `Connect agents to ${svc.name}` : 'Connect agents to your operational data';
const WHAT_P1 = svc
  ? `The Model Context Protocol (MCP) is an open standard that lets AI agents securely connect to external tools and data. Makini implements MCP as a managed server in front of ${svc.name} and your wider operational stack.`
  : `The Model Context Protocol (MCP) is an open standard that lets AI agents and LLM apps securely connect to external tools and data. Makini implements MCP as a managed server in front of your maintenance, warehouse and ERP stack.`;
const NODE3T = svc ? svc.name : '2,000+ systems';
const NODE3S = svc ? 'plus 2,000+ other systems' : 'CMMS · EAM · WMS · ERP';
const CTA_H2 = svc ? `Connect your agent to ${svc.name}` : 'Connect your first agent';
const OGIMG = svc ? 'og-mcp-service.png' : 'og-mcp.png';
const TOGGLE = (svc && svc.integrationUrl) ? `<svg aria-hidden="true" width="0" height="0" style="position:absolute"><filter id="lg-refract" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="7" result="t"/><feGaussianBlur in="t" stdDeviation="2.2" result="b"/><feDisplacementMap in="SourceGraphic" in2="b" scale="46" xChannelSelector="R" yChannelSelector="G"/></filter></svg><div class="mode-switch-wrap"><div class="mode-switch" role="tablist">
    <a class="mode-opt" href="${svc.integrationUrl}" role="tab" aria-selected="false">Integration</a>
    <a class="mode-opt active" href="#" role="tab" aria-selected="true"><span class="dot"></span>MCP server</a>
  </div></div>` : '';

const SUP = `
  .m-body{overflow-x:hidden}
  .mode-switch-wrap{display:flex;justify-content:center;margin-bottom:30px}
  .mode-switch{display:inline-flex;gap:4px;padding:5px;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(2px) saturate(150%);backdrop-filter:url(#lg-refract) blur(2px) saturate(150%);box-shadow:inset 1.5px 1.5px 1px -1px rgba(255,255,255,.55),inset -1.5px -1.5px 1px -1px rgba(255,255,255,.30),inset 0 0 10px rgba(255,255,255,.05),0 8px 26px rgba(0,0,0,.30)}
  .mode-opt{position:relative;display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:500;color:#c6c7cc;transition:.25s ease;white-space:nowrap}
  .mode-opt:hover{color:#fff}
  .mode-opt.active{color:#fff;background:rgba(120,128,255,.16);border:1px solid rgba(255,255,255,.22);-webkit-backdrop-filter:blur(2px) saturate(170%);backdrop-filter:url(#lg-refract) blur(2px) saturate(170%);box-shadow:inset 1.5px 1.5px 1px -1px rgba(255,255,255,.70),inset -1.5px -1.5px 1px -1px rgba(255,255,255,.40),inset 0 0 14px rgba(148,104,242,.22),0 6px 20px rgba(148,104,242,.28)}
  .mode-opt .dot{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.7}
  @media(max-width:600px){.mode-switch{width:100%}.mode-opt{flex:1;justify-content:center;padding:10px 14px;font-size:13px}}
  .mc-sec{padding:80px 0;position:relative;z-index:2;overflow:hidden}
  /* ambient section glows — varied per section so backgrounds aren't flat */
  .mc-sec::before{content:"";position:absolute;z-index:-1;width:720px;height:460px;border-radius:50%;filter:blur(130px);opacity:.5;pointer-events:none}
  .mc-glow-tl::before{background:radial-gradient(circle,#71a1ff45,transparent 70%);top:-160px;left:-140px}
  .mc-glow-tr::before{background:radial-gradient(circle,#ef68f23d,transparent 70%);top:-170px;right:-140px}
  .mc-glow-bl::before{background:radial-gradient(circle,#9468f240,transparent 70%);bottom:-180px;left:-120px}
  .mc-glow-br::before{background:radial-gradient(circle,#71a1ff3d,transparent 70%);bottom:-180px;right:-140px}
  .mc-glow-c::before{background:radial-gradient(circle,#9468f238,transparent 70%);top:-200px;left:50%;transform:translateX(-50%);width:900px}
  .mc-head{max-width:760px;margin:0 auto 48px;text-align:center;position:relative;z-index:1}
  .mc-sub{color:#c6c7cc;max-width:680px;margin:8px auto 0;font-size:15px;line-height:24px}
  .mc-card{position:relative;overflow:hidden;background-image:radial-gradient(circle at 100% 0,#212433,#1b1921);border:1px solid #ffffff14;border-radius:16px;padding:24px}
  /* makini-style corner glow inside cards, color cycles so cards differ */
  .mc-card::after{content:"";position:absolute;z-index:0;top:-26px;right:-22px;width:150px;height:150px;border-radius:100%;filter:blur(70px);opacity:.55;background:#b355d166;pointer-events:none}
  .mc-card>*{position:relative;z-index:1}
  .mc-grid-3 .mc-card:nth-child(3n+1)::after{background:#71a1ff80}
  .mc-grid-3 .mc-card:nth-child(3n+2)::after{background:#9468f280}
  .mc-grid-3 .mc-card:nth-child(3n)::after{background:#ef68f280}
  .mc-grid-2 .mc-card:nth-child(4n+1)::after{background:#71a1ff80}
  .mc-grid-2 .mc-card:nth-child(4n+2)::after{background:#ef68f280}
  .mc-grid-2 .mc-card:nth-child(4n+3)::after{background:#9468f280}
  .mc-grid-2 .mc-card:nth-child(4n)::after{background:#71a1ff80}
  .mc-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .mc-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
  .mc-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#dfe7ff;background:linear-gradient(135deg,#71a1ff3d,#ef68f230);border:1px solid #ffffff1f;box-shadow:0 0 20px #9468f22e;margin-bottom:16px}
  .mc-icon svg{width:23px;height:23px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .mc-card h3{margin:0 0 8px;color:#fff;font-size:18px;line-height:26px;font-weight:600}
  .mc-card p{margin:0;color:#c6c7cc;font-size:15px;line-height:24px}
  /* what-is-mcp two column + flow diagram */
  .mc-2col{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
  .mc-2col h2{margin:0 0 16px;color:#fff;font-size:36px;line-height:46px;font-weight:400}
  .mc-2col p{margin:0 0 14px;color:#c6c7cc;font-size:16px;line-height:27px}
  .mc-flow{display:flex;flex-direction:column;gap:14px}
  .mc-node{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:14px;background:#ffffff08;border:1px solid #ffffff14}
  .mc-node.accent{background-image:linear-gradient(120deg,#71a1ff24,#ef68f21f);border-color:#71a1ff45;box-shadow:0 0 40px #9468f21f}
  .mc-node-ico{width:42px;height:42px;border-radius:10px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;color:#dfe7ff;background:#ffffff0f;border:1px solid #ffffff1f}
  .mc-node-ico svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .mc-node-t{color:#fff;font-size:15px;font-weight:600;line-height:20px}
  .mc-node-s{color:#959599;font-size:13px;line-height:18px;margin-top:2px}
  .mc-flow-arrow{align-self:center;color:#71a1ff;opacity:.7;line-height:1}
  /* steps */
  .mc-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;counter-reset:s}
  .mc-step{position:relative;overflow:hidden;padding:28px 24px;border-radius:16px;background-image:linear-gradient(180deg,#ffffff0d,#ffffff05);border:1px solid #ffffff1f}
  .mc-step::after{content:"";position:absolute;z-index:0;bottom:-40px;left:-30px;width:160px;height:160px;border-radius:100%;filter:blur(70px);opacity:.5;pointer-events:none}
  .mc-step>*{position:relative;z-index:1}
  .mc-step:nth-child(1)::after{background:#71a1ff80}
  .mc-step:nth-child(2)::after{background:#9468f280}
  .mc-step:nth-child(3)::after{background:#ef68f280}
  .mc-step-no{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;font-size:14px;font-weight:600;color:#fff;margin-bottom:16px;background:linear-gradient(135deg,#71a1ff,#ef68f2)}
  .mc-step h3{margin:0 0 8px;color:#fff;font-size:18px;line-height:26px;font-weight:600}
  .mc-step p{margin:0;color:#c6c7cc;font-size:15px;line-height:24px}
  /* code */
  .mc-code-wrap{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .mc-code{background:#0e0e14;border:1px solid #ffffff14;border-radius:16px;overflow:hidden}
  .mc-code-bar{display:flex;align-items:center;gap:8px;padding:12px 18px;border-bottom:1px solid #ffffff0d}
  .mc-code-bar .d{width:11px;height:11px;border-radius:50%;background:#ffffff26}
  .mc-code-bar span{margin-left:8px;color:#959599;font-size:13px}
  .mc-code pre{margin:0;padding:20px;overflow-x:auto;color:#c6c7cc;font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;font-size:13.5px;line-height:22px;white-space:pre}
  .mc-code .k{color:#71a1ff}.mc-code .s{color:#7ee7b1}.mc-code .c{color:#666}
  /* clients */
  .mc-clients{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
  .mc-client{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:24px 16px;border-radius:14px;background:#ffffff08;border:1px solid #ffffff14}
  .mc-client .mc-node-ico{width:52px;height:52px;border-radius:12px}
  .mc-logo{width:30px;height:30px;object-fit:contain;filter:brightness(0) invert(1);opacity:.95}
  .mc-client-t{color:#fff;font-size:14px;font-weight:600}
  .mc-pill-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:18px}
  .mc-pill{display:inline-flex;align-items:center;gap:8px;background:#ffffff0f;border:1px solid #ffffff1a;border-radius:999px;padding:8px 14px;font-size:13px;color:#c6c7cc}
  .mc-dot{width:8px;height:8px;border-radius:50%;background:#7ee7b1}
  @media (max-width:991px){
    .mc-grid-3,.mc-steps{grid-template-columns:1fr 1fr}
    .mc-2col,.mc-code-wrap{grid-template-columns:1fr}
    .mc-clients{grid-template-columns:repeat(3,1fr)}
  }
  @media (max-width:767px){
    .mc-sec{padding:56px 0}
    .mc-grid-3,.mc-grid-2,.mc-steps,.mc-clients{grid-template-columns:1fr}
    .mc-2col h2{font-size:30px;line-height:40px}
  }
`;

const primary = (t,h) => `<a class="btn-blue w-button" href="${h}" target="_blank" rel="noopener noreferrer">${t}</a>`;
const secondary = (t,h) => `<a class="price-card-btn s2-btn2 w-inline-block" href="${h}" target="_blank" rel="noopener noreferrer"><div class="price-card-btn-text">${t}</div></a>`;

// icons
const I = {
  bolt:'<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  db:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  msg:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.8L3 21l1.9-4.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>',
  sync:'<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 12A9 9 0 0 1 18 5.3L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  log:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M9 12h6M9 16h6M9 8h3"/></svg>',
  agent:'<svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4M9 12h.01M15 12h.01M9 18v2M15 18v2"/></svg>',
  hub:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',
  grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5z"/></svg>',
  key:'<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="5"/><path d="M11.5 11.5 21 2M17 6l3 3M14 9l2 2"/></svg>',
  globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>',
};

// ---- HERO ----
const HERO = `<section class="s1"><div class="m-container">
  <div class="breadcrumb"><a href="https://www.makini.io/" class="breadcrumb-link">Home</a><div class="slash">/</div><a href="https://www.makini.io/integrations" class="breadcrumb-link">MCP</a><div class="slash">/</div><div class="title-text">${BREAD}</div></div>
  <div class="s1-box">
    ${TOGGLE}
    ${HEROLOGO}
    <div class="s1-h1-box"><h1 class="s1-h1 inline"><div class="inline">${H1A} </div><div class="inline">${H1B.trim()}</div></h1></div>
    <div class="s1-subheading-box"><div class="s1-subheading">${SUBLEAD}</div><div class="s1-subheading">Model Context Protocol</div><div class="s1-subheading">&nbsp;endpoint.</div></div>
    <div class="s1-btn-box">${primary('Get your MCP endpoint', APP)}${secondary('Read the MCP docs', DOCS)}</div>
    <div class="s1-list-features">
      <div class="item_features"><div class="text_features">One endpoint</div></div>
      <div class="s1-line"></div>
      <div class="item_features"><div class="text_features">2,000+ systems</div></div>
      <div class="s1-line"></div>
      <div class="item_features"><div class="text_features">SOC 2 Type II</div></div>
    </div>
  </div>
</div>
<img src="${A}/630dee899f2fade382f4fb81_s1-dec1.svg" loading="lazy" alt="" class="s1-dec2">
<img src="${A}/630deee52b4487b24cdc08f5_s1-dec2.svg" loading="lazy" alt="" class="s1-dec3"></section>`;

// ---- WHAT IS MCP (2col + flow) ----
const WHAT = `<section class="mc-sec mc-glow-tr" id="what"><div class="m-container"><div class="mc-2col">
  <div>
    <div class="s2-upheading left" style="margin-bottom:14px">One protocol, every system</div>
    <h2>${WHAT_H2}</h2>
    <p>${WHAT_P1}</p>
    <p>Your agent talks to a single Makini MCP endpoint. Makini handles authentication, normalization and rate-limiting across every connected system — so you never build a one-off tool integration again.</p>
    <div class="mc-pill-row" style="justify-content:flex-start"><span class="mc-pill"><span class="mc-dot"></span>Tools &amp; resources</span><span class="mc-pill"><span class="mc-dot"></span>Streaming SSE</span><span class="mc-pill"><span class="mc-dot"></span>Scoped tokens</span></div>
  </div>
  <div class="mc-flow">
    <div class="mc-node"><div class="mc-node-ico">${I.agent}</div><div><div class="mc-node-t">AI agent</div><div class="mc-node-s">Claude, Cursor, ChatGPT, custom</div></div></div>
    <div class="mc-flow-arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>
    <div class="mc-node accent"><div class="mc-node-ico">${I.hub}</div><div><div class="mc-node-t">Makini MCP server</div><div class="mc-node-s">Auth · normalization · logging</div></div></div>
    <div class="mc-flow-arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>
    <div class="mc-node"><div class="mc-node-ico">${I.grid}</div><div><div class="mc-node-t">${NODE3T}</div><div class="mc-node-s">${NODE3S}</div></div></div>
  </div>
</div></div></section>`;

// ---- CAPABILITIES (6 cards) ----
const cap = (ico,h,p)=>`<div class="mc-card"><div class="mc-icon">${ico}</div><h3>${h}</h3><p>${p}</p></div>`;
const CAPS = `<section class="mc-sec mc-glow-tl" id="capabilities"><div class="m-container">
  <div class="mc-head"><div class="s2-upheading center">Capabilities</div><h2 class="h2">Everything your agent can do over MCP</h2><p class="mc-sub">Makini exposes each connected system through the full MCP surface — so agents can both read context and take action.</p></div>
  <div class="mc-grid-3">
    ${cap(I.bolt,'Tools (actions)','Let agents create work orders, post purchase orders, update stock and trigger workflows through typed, validated MCP tools.')}
    ${cap(I.db,'Resources (data)','Expose assets, inventory, orders and maintenance history as MCP resources your agent can read on demand.')}
    ${cap(I.msg,'Prompts','Ship reusable, system-aware prompt templates so agents follow your operational playbooks out of the box.')}
    ${cap(I.sync,'Real-time sync','Stream changes over SSE and webhooks. Agents always work against fresh, normalized data — not stale exports.')}
    ${cap(I.lock,'Auth &amp; scopes','Issue scoped, revocable tokens per agent. Limit which systems, objects and actions each connection can touch.')}
    ${cap(I.log,'Audit logging','Every tool call and resource read is logged with full payloads, so you can review exactly what an agent did.')}
  </div>
</div></section>`;

// ---- HOW IT WORKS (3 steps) ----
const STEPS = `<section class="mc-sec mc-glow-br" id="how"><div class="m-container">
  <div class="mc-head"><div class="s2-upheading center">How it works</div><h2 class="h2">Live in three steps</h2><p class="mc-sub">From zero to an agent acting on real operational data — usually in under a day.</p></div>
  <div class="mc-steps">
    <div class="mc-step"><div class="mc-step-no">1</div><h3>Connect a system</h3><p>Link any of 2,000+ CMMS, EAM, WMS or ERP systems with Makini's managed authentication flow.</p></div>
    <div class="mc-step"><div class="mc-step-no">2</div><h3>Get your MCP endpoint</h3><p>Generate a scoped API key and your unique MCP URL from the Makini dashboard.</p></div>
    <div class="mc-step"><div class="mc-step-no">3</div><h3>Point your agent at it</h3><p>Add the endpoint to Claude, Cursor or your own MCP client and start calling tools immediately.</p></div>
  </div>
</div></section>`;

// ---- CODE ----
const CODE = `<section class="mc-sec mc-glow-c" id="code"><div class="m-container">
  <div class="mc-head"><div class="s2-upheading center">Drop-in setup</div><h2 class="h2">Add Makini to your agent</h2><p class="mc-sub">Standard MCP configuration — no SDK lock-in. Works with any MCP-compatible client.</p></div>
  <div class="mc-code-wrap">
    <div class="mc-code"><div class="mc-code-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span>mcp.config.json</span></div><pre>{
  <span class="k">"mcpServers"</span>: {
    <span class="k">"makini"</span>: {
      <span class="k">"url"</span>: <span class="s">"https://mcp.makini.io/sse"</span>,
      <span class="k">"headers"</span>: {
        <span class="k">"Authorization"</span>: <span class="s">"Bearer &lt;YOUR_API_KEY&gt;"</span>
      }
    }
  }
}</pre></div>
    <div class="mc-code"><div class="mc-code-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span>example tool call</span></div><pre><span class="c">// agent asks Makini to act on a connected system</span>
<span class="k">await</span> agent.callTool(<span class="s">"makini.create_work_order"</span>, {
  system: <span class="s">"${SLUG}"</span>,
  asset_id: <span class="s">"AST-10293"</span>,
  priority: <span class="s">"high"</span>,
  description: <span class="s">"Conveyor motor overheating"</span>
})

<span class="c">// → returns the created work order as an MCP resource</span></pre></div>
  </div>
</div></section>`;

// ---- CLIENTS ----
const client=(file,t)=>`<div class="mc-client"><div class="mc-node-ico"><img class="mc-logo" src="${A}/${file}" loading="lazy" alt="${t} logo"></div><div class="mc-client-t">${t}</div></div>`;
const CLIENTS = `<section class="mc-sec mc-glow-tr" id="clients"><div class="m-container">
  <div class="mc-head"><div class="s2-upheading center">Compatibility</div><h2 class="h2">Works with your favorite agents</h2><p class="mc-sub">Any MCP-compatible client can connect to Makini — no custom adapters required.</p></div>
  <div class="mc-clients">
    ${client('logo-claude.svg','Claude Desktop')}
    ${client('logo-chatgpt.svg','ChatGPT')}
    ${client('logo-cursor.svg','Cursor')}
    ${client('logo-langchain.svg','LangChain')}
    ${client('logo-mcp.svg','Custom MCP SDK')}
  </div>
</div></section>`;

// ---- SECURITY (4 cards) ----
const SEC = `<section class="mc-sec mc-glow-bl" id="security"><div class="m-container">
  <div class="mc-head"><div class="s2-upheading center">Security &amp; governance</div><h2 class="h2">Built for agents you can trust</h2><p class="mc-sub">Give autonomous agents access to production systems without giving up control.</p></div>
  <div class="mc-grid-2">
    ${cap(I.key,'Scoped, revocable tokens','Each agent gets its own key limited to specific systems, objects and actions. Revoke access instantly.')}
    ${cap(I.log,'Full audit trail','Every MCP call is logged with inputs and outputs for compliance review and incident investigation.')}
    ${cap(I.shield,'SOC 2 Type II','Makini is independently audited with 36 passing controls across five domains, continuously monitored.')}
    ${cap(I.globe,'Data residency','Run Makini in your region or self-hosted, so operational data never leaves your boundary.')}
  </div>
</div></section>`;

// ---- FAQ ----
const CHEVRON = '<div class="icon_arrow w-embed"><svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7L12 12L7 17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 7L12 12L17 17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>';
const faqs = [
  ['What is the Model Context Protocol (MCP)?','MCP is an open standard for connecting AI agents and LLM applications to external tools and data sources. Instead of building bespoke integrations per system, an agent speaks MCP to a server that exposes tools, resources and prompts. Makini provides a managed MCP server in front of 2,000+ operational systems.'],
  ['Which MCP clients are supported?','Any MCP-compatible client works, including Claude Desktop, Cursor, ChatGPT and custom agents built with the MCP SDK. You add the Makini endpoint and API key to your client config and the tools appear automatically.'],
  ['How is authentication and access control handled?','You generate scoped, revocable API keys from the Makini dashboard. Each key can be limited to specific systems, objects and actions, and every call is logged. Makini handles the underlying credentials for each connected system on your behalf.'],
  ['What data and actions can an agent access?','Agents can read resources (assets, inventory, orders, maintenance history) and call tools to take actions (create work orders, post purchase orders, update stock, trigger workflows). Exactly what is available depends on the connected system and the scopes on the token.'],
  ['Can I self-host or keep data in my region?','Yes. Makini supports region-specific cloud hosting and self-hosted deployments for customers with data residency or high-availability requirements, so operational data stays within your chosen boundary.'],
];
const faqItems = faqs.map(f=>`<div role="listitem" class="faq_item w-dyn-item"><div data-hover="false" data-delay="0" class="dropdown_faq w-dropdown"><div class="dropdown-toggle_faq w-dropdown-toggle"><div class="title-faq white">${f[0]}</div>${CHEVRON}</div><nav class="dropdown-list_faq w-dropdown-list"><div class="dropdown-list-item_faq"><div class="description-faq w-richtext"><p>${f[1]}</p></div></div></nav></div></div>`).join('');
const FAQ = `<div class="s5 faq" id="faq"><div class="m-container flex-center"><h2 class="h2-36 size-mobile-28">Frequently Asked&nbsp;Questions</h2><p class="t-15">Everything you need to know about the Makini MCP server</p></div><div class="m-container mt-60"><div class="faq_list w-dyn-list"><div role="list" class="wrapper-dropdown w-dyn-items">${faqItems}</div></div></div></div>`;

// ---- CTA (getting) ----
const CTA = `<div class="getting"><div class="skew-box"><div class="m-container skew"><div class="skew-box-contant"><div class="u-s5-left"><h2 class="h2 white _2">${CTA_H2}</h2><div class="u-s5-box-text">Spin up a Makini MCP endpoint, point your agent at it, and start reading and acting on real operational data in minutes.</div><div class="price-s2-left-btns">${primary('Get your MCP endpoint', APP)}${secondary('Read the MCP docs', DOCS)}</div></div><img src="${A}/mcp-hero.webp" loading="lazy" width="460" sizes="(max-width: 479px) 95vw, 460px" alt="${svc ? svc.name + ' over MCP' : 'AI agents connect to your systems over MCP'}" class="skew-box-img"></div></div><img src="${A}/630df2e36671aa7e747178ca_getting-dec1.svg" loading="lazy" alt="" class="skew-box-dec1"><img src="${A}/630df354bf383e28caafd39f_getting-dec2.svg" loading="lazy" alt="" class="skew-box-dec2"></div><div class="skew-bg"></div></div>`;

const SCRIPTS = `<script src="${A}/jquery-3.5.1.min.dc5e7f18c8.js" type="text/javascript"></script>
<script src="${A}/webflow.schunk.1a807f015b216e46.js" type="text/javascript"></script>
<script src="${A}/webflow.schunk.9b5bd8e84658d2a4.js" type="text/javascript"></script>
<script src="${A}/webflow.847938a1.8836ea3eb6313895.js" type="text/javascript"></script>`;

const HEAD = `<!DOCTYPE html>
<html lang="en" class=" w-mod-js"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${TITLE}</title>
<meta content="${DESC}" name="description">
<meta content="${OGT}" property="og:title">
<meta content="${A}/${OGIMG}" property="og:image">
<meta content="summary_large_image" name="twitter:card">
<meta content="${OGT}" name="twitter:title">
<meta content="${A}/${OGIMG}" name="twitter:image">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="https://cdn.prod.website-files.com/" rel="preconnect">
<link href="${A}/makini.webflow.shared.b087ea904.min.css" rel="stylesheet" type="text/css">
<script type="text/javascript">!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);</script>
<link href="https://cdn.prod.website-files.com/6075c27738665c833a39fd83/6087764e8ff33d5dbc62d11c_Frame%2010.png" rel="shortcut icon" type="image/x-icon">
<style>${SUP}</style>
</head><body class="m-body black">`;

  return HEAD + header +
    HERO + train + WHAT + CAPS + STEPS + CODE + CLIENTS + SEC + explore + FAQ + CTA +
    footer + SCRIPTS + '</body></html>';
}

// generic Makini MCP page
fs.writeFileSync(path.join(DIR,'mcp.html'), build(null), 'utf8');
const made = ['mcp.html'];
// one page per service
for (const svc of SERVICES) {
  const out = 'mcp-' + svc.slug + '.html';
  fs.writeFileSync(path.join(DIR, out), build(svc), 'utf8');
  made.push(out);
}
console.log('written:', made.join(', '));
