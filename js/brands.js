(function(){
var CL=window.CL,U=CL.url,e=CL.esc;
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){
 var P=r[0]||[],s=r[1]||{};CL.ui.init(s,P);
 var m={},order=[];P.forEach(function(p){if(!m[p.brand]){m[p.brand]={n:0,img:p.image};order.push(p.brand)}m[p.brand].n++});
 var a=document.getElementById('app');a.removeAttribute('aria-busy');document.title='الماركات | Catchy Lens';
 a.innerHTML=CL.ui.header()+'<main id="main" class="wrap"><h1>الماركات</h1><p class="lead">اختاري الماركة واتفرّجي على كل ألوانها.</p><div class="brandgrid">'
  +order.map(function(b){return '<a class="brandcard" href="'+U.catalog+'?brand='+encodeURIComponent(b)+'">'+(m[b].img?CL.ui.img(m[b].img,b,' loading="lazy" decoding="async"'):'')+'<b>'+e(b)+'</b><span>'+m[b].n+' لون</span></a>'}).join('')+'</div></main>'+CL.ui.footer();
 CL.ui.bind();
});
})();
