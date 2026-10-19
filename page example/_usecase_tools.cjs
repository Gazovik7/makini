/* Local image baking and visual review. No production dependency is added. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {createRequire} = require('node:module');
const HERE = __dirname;
const ASSETS = path.join(HERE,'assets/use-cases');
const catalog = JSON.parse(fs.readFileSync(path.join(ASSETS,'catalog.json'),'utf8'));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
function server() {
  return http.createServer((req,res)=>{
    if (req.method !== 'GET') {res.writeHead(405);return res.end();}
    let file;
    try {file=path.resolve(HERE,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}
    catch (_) {res.writeHead(400);return res.end();}
    if (!file.startsWith(HERE+path.sep)) {res.writeHead(403);return res.end();}
    fs.stat(file,(err,stat)=>{
      if(err||!stat.isFile()){res.writeHead(404);return res.end();}
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
      const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);
    });
  });
}
function playwright() {
  if(process.env.PLAYWRIGHT_MODULE)return require(process.env.PLAYWRIGHT_MODULE);
  try{return require('playwright');}catch(_){
    return createRequire(path.join(process.env.USERPROFILE,'tools/playwright/package.json'))('playwright');
  }
}
async function bake(pw,base) {
  const browser=await pw.chromium.launch({channel:'chrome',executablePath:pw.chromium.executablePath(),headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage();await page.goto(base+'/assets/use-cases/catalog.json');
    await page.addScriptTag({url:base+'/assets/use-cases/grade.js'});
    const limit=Number((process.argv.find(a=>a.startsWith('--limit='))||'').split('=')[1])||catalog.length;
    let count=0;
    for(const asset of catalog.slice(0,limit)){
      const original=path.join(ASSETS,'originals',asset.id+'.jpg');
      if(!fs.existsSync(original)){console.log('Not generated yet:',asset.id);continue;}
      for(const preset of ['spectrum']){
        const output=path.join(ASSETS,'processed',preset,asset.id+'.webp');
        const thumb=path.join(ASSETS,'thumbs',preset,asset.id+'.webp');
        if(!process.argv.includes('--force')&&fs.existsSync(output)&&fs.existsSync(thumb))continue;
        const data=await page.evaluate(async ({url,preset})=>{
          const image=new Image();image.src=url;await image.decode();
          const canvas=window.MakiniGrade(image,preset,1200);
          const result=canvas.toDataURL('image/webp',.87).split(',')[1];
          const small=document.createElement('canvas');small.width=360;small.height=240;
          small.getContext('2d').drawImage(canvas,0,0,360,240);
          return {result,thumb:small.toDataURL('image/webp',.80).split(',')[1]};
        },{url:base+'/assets/use-cases/originals/'+asset.id+'.jpg',preset});
        fs.mkdirSync(path.dirname(output),{recursive:true});fs.mkdirSync(path.dirname(thumb),{recursive:true});
        fs.writeFileSync(output,Buffer.from(data.result,'base64'));fs.writeFileSync(thumb,Buffer.from(data.thumb,'base64'));
      }
      count++;console.log('Processed',asset.id);
    }
    console.log('Assets processed:',count);
  }finally{await browser.close();}
}
async function verify(pw,base){
  const browser=await pw.chromium.launch({channel:'chrome',executablePath:pw.chromium.executablePath(),headless:true});
  const out=path.join(HERE,'review');fs.mkdirSync(out,{recursive:true});
  const report={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    // A formerly saved style must not override the selected Spectrum artwork.
    await page.addInitScript(()=>localStorage.setItem('makini-industrial-image-treatment-v1','duotone'));
    await page.goto(base+'/mcp.html',{waitUntil:'load'});await page.locator('#use-cases').scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>{const i=document.querySelector('#use-cases .cg-item.is-active img');return i&&i.complete&&i.naturalWidth>0;});
    report.decodedAssets=await page.evaluate(async assets=>{
      const urls=assets.map(a=>'./assets/use-cases/processed/spectrum/'+a.id+'.webp');
      for(let start=0;start<urls.length;start+=6)await Promise.all(urls.slice(start,start+6).map(async src=>{const i=new Image();i.src=src;try{await i.decode();}catch(e){throw new Error('Image decode failed: '+src+' '+e.message);}if(!i.naturalWidth)throw new Error('Invalid image: '+src);}));
      return urls.length;
    },catalog);
    report.scenarios=await page.locator('#use-cases .cg-item:not(.cg-clone)').count();
    report.caseImages=await page.locator('#use-cases .cg-item:not(.cg-clone) img').evaluateAll(images=>new Set(images.map(i=>i.src)).size);
    report.dots=await page.locator('#use-cases .cg-dot').count();
    report.libraryImages=await page.locator('#industrial-images .mc-image-grid img').count();
    report.removedControls=await page.locator('.cg-direction,.cg-browse,.cg-library,[data-treatment],[data-scenario]').count();
    report.onlySpectrum=await page.locator('#use-cases img,#industrial-images img').evaluateAll(images=>images.every(i=>i.src.includes('/processed/spectrum/')));
    report.separateSections=await page.evaluate(()=>{const c=document.querySelector('#use-cases'),l=document.querySelector('#industrial-images');return c.parentElement===l.parentElement&&c.nextElementSibling===l;});
    await page.locator('.cg-prev').click();report.loopBackward=await page.locator('.cg-count').textContent();
    await page.locator('.cg-next').click();report.loopForward=await page.locator('.cg-count').textContent();
    await page.locator('#use-cases .cg-dot').nth(2).click();
    const caseState=()=>page.evaluate(()=>JSON.stringify({count:document.querySelector('#use-cases .cg-count').textContent,title:document.querySelector('#use-cases .cg-item.is-active h3').textContent,images:Array.from(document.querySelectorAll('#use-cases .cg-item:not(.cg-clone) img'),i=>i.src)}));
    const beforeTabs=await caseState();
    report.libraryIndependent=true;
    for(const category of ['All','Warehouse','Logistics','Manufacturing','Maintenance','Infrastructure']){
      await page.locator('[data-image-category="'+category+'"]').click();
      const visible=await page.locator('#industrial-images .mc-image-grid img:visible').count();
      report['filter'+category]=visible;
      const expected=category==='All'?catalog.length:catalog.filter(a=>a.category===category).length;
      if(visible!==expected)throw new Error('Wrong category count: '+category);
      await page.locator('#industrial-images .mc-image-grid img:visible').first().click();
      if(await caseState()!==beforeTabs)report.libraryIndependent=false;
    }
    await page.locator('[data-image-category="All"]').click();
    await page.locator('[data-image-category="All"]').focus();await page.keyboard.press('ArrowRight');
    report.keyboardTab=await page.locator('#industrial-images [role="tab"][aria-selected="true"]').textContent();
    await page.keyboard.press('End');report.keyboardEnd=await page.locator('#industrial-images [role="tab"][aria-selected="true"]').textContent();
    await page.keyboard.press('Home');
    if(await caseState()!==beforeTabs)report.libraryIndependent=false;
    await page.locator('#industrial-images').screenshot({path:path.join(out,'mcp-use-cases-library.png'),style:'.m-header{visibility:hidden!important}'});
    await page.locator('#use-cases .cg-dot').nth(0).click();
    await page.locator('#use-cases').screenshot({path:path.join(out,'mcp-use-cases-desktop.png'),style:'.m-header{visibility:hidden!important}'});
    fs.copyFileSync(path.join(out,'mcp-use-cases-desktop.png'),path.join(out,'mcp-use-cases-spectrum.png'));
    await page.setViewportSize({width:390,height:844});
    await page.locator('#use-cases').scrollIntoViewIfNeeded();
    await page.locator('#use-cases').screenshot({path:path.join(out,'mcp-use-cases-mobile.png'),style:'.m-header{visibility:hidden!important}'});
    report.mobile=await page.evaluate(()=>{
      const s=document.querySelector('#use-cases'),a=s.querySelector('.cg-item.is-active'),p=a.querySelector('.cg-over');
      return {viewport:innerWidth,section:s.getBoundingClientRect().width,document:document.documentElement.scrollWidth,activeWidth:a.clientWidth,captionHeight:p.offsetHeight,panelHeight:a.clientHeight};
    });
    await page.locator('#industrial-images').screenshot({path:path.join(out,'mcp-image-library-mobile.png'),style:'.m-header{visibility:hidden!important}'});
    await page.setViewportSize({width:320,height:740});
    await page.waitForFunction(()=>{const t=document.querySelector('#use-cases .cg-track'),a=t.querySelector('.is-active');return Math.abs(a.clientWidth-(t.clientWidth-72))<2;});
    report.narrowMobile=await page.evaluate(()=>{const a=document.querySelector('#use-cases .cg-item.is-active');return {viewport:innerWidth,document:document.documentElement.scrollWidth,captionHeight:a.querySelector('.cg-over').offsetHeight,panelHeight:a.clientHeight};});
    report.errors=errors;
    if(report.scenarios!==6||report.caseImages!==6||report.dots!==6||report.libraryImages!==30||report.decodedAssets!==30||report.removedControls!==0||!report.onlySpectrum||!report.separateSections||!report.libraryIndependent||report.loopBackward!=='06 / 06'||report.loopForward!=='01 / 06'||report.keyboardTab!=='Warehouse'||report.keyboardEnd!=='Infrastructure'||errors.length)throw new Error('Review checks failed: '+JSON.stringify(report));
    if(report.mobile.document>report.mobile.viewport||report.mobile.captionHeight>report.mobile.panelHeight)throw new Error('Mobile overflow: '+JSON.stringify(report.mobile));
    if(report.narrowMobile.document>report.narrowMobile.viewport||report.narrowMobile.captionHeight>report.narrowMobile.panelHeight)throw new Error('Narrow mobile overflow: '+JSON.stringify(report.narrowMobile));
    fs.writeFileSync(path.join(out,'use-cases-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  }finally{await browser.close();}
}
(async()=>{
  const command=process.argv[2]||'serve';const app=server();
  await new Promise(resolve=>app.listen(command==='serve'?4173:0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+app.address().port;
  if(command==='serve'){console.log('Preview: '+base+'/mcp.html#use-cases');return;}
  try{if(command==='bake')await bake(playwright(),base);else if(command==='verify')await verify(playwright(),base);else throw new Error('Use serve, bake or verify.');}
  finally{await new Promise(resolve=>app.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
