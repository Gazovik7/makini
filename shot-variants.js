const PW='C:/Users/gazov/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{
  const b=await chromium.launch({channel:'chrome'});
  const pg=await b.newPage({viewport:{width:1180,height:1000},deviceScaleFactor:1.6});
  await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
  await pg.goto('file:///d:/VSCODE/makini/page%20example/uc-variants.html',{waitUntil:'domcontentloaded'});
  await pg.waitForTimeout(700);
  for(const cls of ['A','C','B']){
    const el=await pg.$('.variant.'+cls);
    await el.scrollIntoViewIfNeeded();
    await pg.waitForTimeout(200);
    await el.screenshot({path:'d:/tmp/var_'+cls+'.png'});
  }
  await b.close();console.log('ok');
})().catch(e=>{console.error(e.message);process.exit(1);});
