/* Data for the blog mockup, applied on top of blog-data.js.
   covers: the Spectrum use-case images (assets/use-cases/processed/spectrum), one per post by topic, so every cover is in the Makini palette
   people: photos from the Core Team block of /careers (cropped). Roles as given by the client:
           George Surovtsev, CEO. Roman Kinyakin, CTO (the careers page says "Co-Founder, Engineering").
   extra:  the first video post. The CorrigoPro guide is real (docs.makini.io) and so is the video,
           but this post does not exist on the live blog yet, it is a proposal. */
window.BLOG_LIVE={
  covers:{
    'introducing-makini-mcp-your-agent-can-finally-touch-the-real-world':'./assets/use-cases/processed/spectrum/09-autonomous-pallet.webp',
    'direct-vs-third-party-mcp-servers-the-industrial-edition':'./assets/use-cases/processed/spectrum/23-terminal-agv.webp',
    'servicetitan-connection-guide':'./assets/use-cases/processed/spectrum/22-pump-service.webp',
    'fishbowl-advanced-connection-guide':'./assets/use-cases/processed/spectrum/07-pallet-stock.webp',
    'netsutie-how-do-i-link-via-machine-to-machine-m2m-setup':'./assets/use-cases/processed/spectrum/13-rf-scanning.webp',
    'odoo---how-do-i-connect-via-api-authentication':'./assets/use-cases/processed/spectrum/18-automotive-line.webp',
    'cmms-vs-eam-differences-and-overlaps':'./assets/use-cases/processed/spectrum/30-gearbox-service.webp',
    'ipaas-solutions-for-enterprise-integrations':'./assets/use-cases/processed/spectrum/15-automated-storage.webp',
    'eam-erp-wms-integrations':'./assets/use-cases/processed/spectrum/03-forklift-racking.webp',
    'introducing-api-and-webhook-logs':'./assets/use-cases/processed/spectrum/19-turbine-inspection.webp',
    'makini-and-sap-s4hana':'./assets/use-cases/processed/spectrum/21-parts-warehouse.webp',
    'makini-and-microsoft-dynamics-365':'./assets/use-cases/processed/spectrum/08-dispatch-yard.webp',
    'makini-joins-shipdex':'./assets/use-cases/processed/spectrum/17-container-vessel.webp',
    'makini-partners-with-shipkart':'./assets/use-cases/processed/spectrum/10-port-receiving.webp',
    'eqcentric-is-now-makini':'./assets/use-cases/processed/spectrum/01-inventory-robot.webp'
  },
  people:{
    'George Surovtsev':{photo:'./assets/content/people/george.jpg',role:'CEO'},
    'Roman Kinyakin':{photo:'./assets/content/people/roman.jpg',role:'CTO'}
  },
  extra:[
    {slug:'connecting-corrigopro',title:'Connecting Your CorrigoPro Account',type:'guide',platforms:['CorrigoPro'],agents:[],author:'Makini',date:'2026-10-21',read:2,video:'1:46',
     cover:'./assets/content/corrigopro-poster.jpg',
     summary:'This guide walks you through connecting CorrigoPro through Makini Link, so your work orders can be brought across automatically.'}
  ]
};
