const PW='C:/Users/gazov/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{
  const b=await chromium.launch({channel:'chrome'});
  const pg=await b.newPage();
  for(const f of ['logo-tfg-trim.png','logo-tfg-w.png']){
    const url='file:///d:/VSCODE/makini/page%20example/SAP%20EWM%20API%20integration%20%E2%80%93%20connect%20to%20anything%20%E2%80%93%20Makini_files/'+f;
    const r=await pg.evaluate(u=>new Promise(res=>{const i=new Image();i.onload=()=>res({ok:1,w:i.naturalWidth,h:i.naturalHeight});i.onerror=e=>res({ok:0,err:String(e)});i.src=u;}),url);
    console.log(f,JSON.stringify(r));
  }
  await b.close();
})().catch(e=>{console.error(e.message);process.exit(1);});
