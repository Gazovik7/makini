/* Makini blog proposal - data layer (stands in for the Webflow CMS).
   15 real posts (titles, authors, read times and types taken from the live /blog and the saved post pages)
   + 10 clearly marked samples (sample:true) so the filters have content of every new type.
   Dates are normalized to ISO. The live CMS date field is inconsistent (see dateSrc). */
(function(){
  var TYPES=[
    {id:'announcement',   label:'Announcement',   badge:'t-release', cms:'Announcements'},
    {id:'product-update', label:'Product update', badge:'t-product', cms:''},
    {id:'case-study',     label:'Case study',     badge:'t-case',    cms:''},
    {id:'guide',          label:'Guide',          badge:'t-guide',   cms:'Connection Setup Guides'},
    {id:'agent-guide',    label:'Agent guide',    badge:'t-mcp',     cms:''},
    {id:'opinion',        label:'Expert opinion', badge:'t-news',    cms:'Expert opinion'},
    {id:'company-news',   label:'Company news',   badge:'t-news',    cms:''},
    {id:'partnership',    label:'Partnership',    badge:'t-news',    cms:''}
  ];
  /* topic tabs (variant C) group several types, the URL still carries ?type= */
  var TOPICS=[
    {id:'all',       label:'All posts',        types:[]},
    {id:'releases',  label:'Releases',         types:['announcement','product-update']},
    {id:'guides',    label:'Setup guides',     types:['guide','agent-guide']},
    {id:'customers', label:'Customer stories', types:['case-study']},
    {id:'insights',  label:'Opinion',          types:['opinion']},
    {id:'company',   label:'Company',          types:['company-news','partnership']}
  ];
  var AGENTS=['Claude','ChatGPT','Copilot','Cursor'];

  /* dateSrc: 'listing' = shown on the live blog list, 'schema' = only in the post Article schema,
              'estimated' = the live CMS has no date at all, neutral placeholder date */
  var P=[
    {slug:'introducing-makini-mcp-your-agent-can-finally-touch-the-real-world',title:'Introducing Makini MCP: your agent can finally touch the real world',type:'announcement',platforms:[],agents:[],author:'George Surovtsev',date:'2026-06-24',read:4,feat:1,dateSrc:'listing',
      summary:'Makini MCP connects any AI agent to 2,000+ industrial systems through one connection, using the login you already have.'},
    {slug:'fishbowl-advanced-connection-guide',title:'Fishbowl Advanced - How do I connect via API Authentication?',type:'guide',platforms:['Fishbowl'],agents:[],author:'Roman Kinyakin',date:'2026-06-20',read:4,feat:3,dateSrc:'listing',
      summary:'How to connect Fishbowl Advanced to Makini with API authentication.'},
    {slug:'direct-vs-third-party-mcp-servers-the-industrial-edition',title:'Direct vs. third-party MCP servers: the industrial edition',type:'opinion',platforms:[],agents:[],author:'George Surovtsev',date:'2026-07-01',read:5,feat:2,dateSrc:'listing',
      summary:'A look at direct versus third-party MCP servers for industrial systems.'},
    {slug:'servicetitan-connection-guide',title:'ServiceTitan - How do I connect via API Authentication?',type:'guide',platforms:['ServiceTitan'],agents:[],author:'Roman Kinyakin',date:'2026-05-12',read:5,dateSrc:'schema',
      summary:'This guide walks you through registering a Makini app in the ServiceTitan Developer Portal, connecting it to your ServiceTitan installation, and retrieving the credentials needed to complete your Makini integration.'},
    {slug:'odoo---how-do-i-connect-via-api-authentication',title:'Odoo - How do I connect via API Authentication?',type:'guide',platforms:['Odoo'],agents:[],author:'Roman Kinyakin',date:'2024-08-07',read:6,dateSrc:'listing',
      summary:'How to connect Odoo to Makini with API authentication.'},
    {slug:'netsutie-how-do-i-link-via-machine-to-machine-m2m-setup',title:'NetSuite - How do I link via Machine to Machine (M2M) setup',type:'guide',platforms:['NetSuite'],agents:[],author:'Roman Kinyakin',date:'2025-05-20',read:7,dateSrc:'listing',
      summary:'How to link NetSuite to Makini with a Machine to Machine (M2M) setup.'},
    {slug:'introducing-api-and-webhook-logs',title:'Introducing API and Webhook logs',type:'announcement',platforms:[],agents:[],author:'George Surovtsev',date:'2023-03-09',read:5,dateSrc:'listing',
      summary:'Introducing API and Webhook logs in Makini.'},
    {slug:'eam-erp-wms-integrations',title:'Differentiate with EAM/ERP/WMS integrations',type:'opinion',platforms:[],agents:[],author:'George Surovtsev',date:'2023-03-09',read:3,dateSrc:'listing',
      summary:'Why EAM, ERP and WMS integrations help you stand out.'},
    {slug:'makini-and-sap-s4hana',title:'Makini API & SAP S/4HANA: the Modern Supply Chain Cloud',type:'announcement',platforms:['SAP S/4HANA'],agents:[],author:'Carolyn Fernandes',date:'2023-03-09',read:7,dateSrc:'listing',
      summary:'Learn how the integration between the Makini API and SAP S/4HANA helps make your supply chain cloud-native for data access, automation, and customization.'},
    {slug:'makini-and-microsoft-dynamics-365',title:'Makini API and Microsoft Dynamics 365: A Winning Formula for Seamless ERP',type:'announcement',platforms:['Microsoft Dynamics 365'],agents:[],author:'Carolyn Fernandes',date:'2023-03-07',read:6,dateSrc:'listing',
      summary:'How the Makini API and Microsoft Dynamics 365 work together for ERP integration.'},
    {slug:'eqcentric-is-now-makini',title:'Eqcentric is now Makini',type:'company-news',platforms:[],agents:[],author:'George Surovtsev',date:'2022-10-22',read:5,dateSrc:'listing',
      summary:'Eqcentric is now Makini.'},
    {slug:'makini-partners-with-shipkart',title:'Makini partners with marine procurement platform ShipsKart',type:'partnership',platforms:['ShipsKart'],agents:[],author:'George Surovtsev',date:'2025-07-30',read:2,dateSrc:'schema',
      summary:'We are proud to add ShipsKart, the world’s first B2B eCommerce platform for marine procurement, to our list of partners.'},
    {slug:'makini-joins-shipdex',title:'Makini Joins the Shipdex Community!',type:'partnership',platforms:['Shipdex'],agents:[],author:'Chris Grayson',date:'2025-08-12',read:2,dateSrc:'estimated',
      summary:'Makini joins the Shipdex community.'},
    {slug:'cmms-vs-eam-differences-and-overlaps',title:'CMMS vs EAM: Differences and Overlaps',type:'guide',platforms:[],agents:[],author:'George Surovtsev',date:'2024-08-06',read:6,dateSrc:'listing',
      summary:'The differences and overlaps between CMMS and EAM systems.'},
    {slug:'ipaas-solutions-for-enterprise-integrations',title:'iPaaS solutions for enterprise integrations',type:'opinion',platforms:[],agents:[],author:'George Surovtsev',date:'2024-06-27',read:10,dateSrc:'listing',
      summary:'iPaaS solutions for enterprise integrations.'},

    /* ---- samples: new content types, generic placeholders, no metrics or customer names ---- */
    {slug:'sample-release-notes',title:'Release notes title goes here',type:'product-update',platforms:[],agents:[],author:'Makini team',date:'2026-10-14',read:3,sample:true,
      summary:'Placeholder for a release note: what is new, what changed and what was fixed.'},
    {slug:'sample-connect-maintainx-to-claude',title:'Connect MaintainX to Claude',type:'agent-guide',platforms:['MaintainX'],agents:['Claude'],author:'Makini team',date:'2026-10-20',read:5,sample:true,
      summary:'Placeholder: connect MaintainX to Claude through Makini MCP, step by step.'},
    {slug:'sample-sap-ewm-mcp-live',title:'SAP EWM MCP server is live',type:'announcement',platforms:['SAP EWM'],agents:[],author:'Makini team',date:'2026-09-30',read:3,sample:true,
      summary:'Placeholder for a platform release announcement: what is available and how to start.'},
    {slug:'sample-connect-servicetitan-to-chatgpt',title:'Connect ServiceTitan to ChatGPT',type:'agent-guide',platforms:['ServiceTitan'],agents:['ChatGPT'],author:'Makini team',date:'2026-09-24',read:5,sample:true,
      summary:'Placeholder: connect ServiceTitan to ChatGPT through Makini MCP, step by step.'},
    {slug:'sample-customer-story-sap',title:'Customer story title goes here',type:'case-study',platforms:['SAP S/4HANA'],agents:[],author:'Makini team',date:'2026-09-10',read:6,sample:true,
      summary:'Placeholder for a customer story: the situation, the integration and what changed.'},
    {slug:'sample-connect-netsuite-to-copilot',title:'Connect NetSuite to Copilot',type:'agent-guide',platforms:['NetSuite'],agents:['Copilot'],author:'Makini team',date:'2026-09-02',read:6,sample:true,
      summary:'Placeholder: connect NetSuite to Copilot through Makini MCP, step by step.'},
    {slug:'sample-product-update-netsuite',title:'Product update title goes here',type:'product-update',platforms:['NetSuite'],agents:[],author:'Makini team',date:'2026-08-27',read:3,sample:true,
      summary:'Placeholder for a product update about a single capability or integration.'},
    {slug:'sample-maintainx-mcp-live',title:'MaintainX MCP server is live',type:'announcement',platforms:['MaintainX'],agents:[],author:'Makini team',date:'2026-08-05',read:3,sample:true,
      summary:'Placeholder for a platform release announcement: what is available and how to start.'},
    {slug:'sample-connect-odoo-to-cursor',title:'Connect Odoo to Cursor',type:'agent-guide',platforms:['Odoo'],agents:['Cursor'],author:'Makini team',date:'2026-07-22',read:6,sample:true,
      summary:'Placeholder: connect Odoo to Cursor through Makini MCP, step by step.'},
    {slug:'sample-customer-story-servicetitan',title:'Customer story title goes here',type:'case-study',platforms:['ServiceTitan'],agents:[],author:'Makini team',date:'2026-07-09',read:5,sample:true,
      summary:'Placeholder for a customer story: the situation, the integration and what changed.'}
  ];

  /* covers: existing local images only. Guides and product updates take the abstract set,
     everything else takes the duotone photo set; consecutive posts always get different pictures. */
  var ABS_DIR='./SAP%20EWM%20API%20integration%20%E2%80%93%20connect%20to%20anything%20%E2%80%93%20Makini_files/';
  var ABS=[1,2,3,4,5,6].map(function(n){return ABS_DIR+'cs-abs-'+n+'.webp';});
  var PH=['01-inventory-robot','02-outbound-truck','03-forklift-racking','04-receiving-dock','05-highway-freight','06-assembly-robots','07-pallet-stock','08-dispatch-yard','09-autonomous-pallet','10-port-receiving','11-freight-rail','12-cnc-machining','13-rf-scanning','14-parcel-sortation','15-automated-storage','16-air-cargo','17-container-vessel','18-automotive-line','19-turbine-inspection','20-mining-haul-truck','21-parts-warehouse','22-pump-service','23-terminal-agv','24-bottling-line','25-inventory-drone','26-electric-fleet','27-cold-storage','28-rail-transloading','29-forklift-transfer','30-gearbox-service']
    .map(function(n){return './assets/use-cases/processed/spectrum/'+n+'.webp';});
  var absTypes={'guide':1,'agent-guide':1,'product-update':1};
  var order=P.slice().sort(function(a,b){return a.date<b.date?1:-1;});
  var pa=0,pp=3;
  order.forEach(function(p){
    if(absTypes[p.type]){p.cover=ABS[pa%ABS.length];pa+=1;}
    else{p.cover=PH[pp%PH.length];pp+=7;}
  });

  window.BLOG_DATA={types:TYPES,topics:TOPICS,agents:AGENTS,posts:order};
})();
