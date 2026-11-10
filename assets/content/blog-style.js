/* Sets the style variant of the blog before the first paint: A "Current" or B "Site style" (html[data-sm="site"]).
   ?style=site / ?style=a in the URL wins and is remembered, otherwise the last choice is used. blog-review.js draws the switch. */
(function(){
  try{
    var p=new URLSearchParams(location.search).get('style'),v=p;
    if(p==='site'||p==='b'||p==='a'||p==='cur'){localStorage.setItem('bk-style',(p==='site'||p==='b')?'site':'a');}
    else v=localStorage.getItem('bk-style');
    if(v==='site'||v==='b')document.documentElement.setAttribute('data-sm','site');
  }catch(e){}
})();
