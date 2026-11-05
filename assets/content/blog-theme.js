/* Ambient light of the blog pages: the cover that is on screen is blown up and blurred behind the top of the page
   (the layer itself is drawn by blog-theme.css from the --amb variable). */
(function(){
  var root=document.querySelector('[data-bt]');if(!root)return;
  window.btAmbient=function(url){if(url)root.style.setProperty('--amb','url("'+new URL(url,document.baseURI).href+'")');};
  if(window.__btAmb)window.btAmbient(window.__btAmb);
})();
