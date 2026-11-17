(function(){
var CL=window.CL,U=CL.url,e=CL.esc;
Promise.all([CL.data.catalog(),CL.data.settings(),CL.data.offers()]).then(function(r){
 var P=r[0]||[],s=r[1]||{},O=r[2]||[];CL.ui.init(s,P);
 var a=document.getElementById('app');a.removeAttribute('aria-busy');document.title='العروض | Catchy Lens';
 function brands(o){var m={},l=[];P.forEach(function(x){if(o.productIds&&o.productIds.indexOf(x.pid)>-1&&!m[x.brand]){m[x.brand]=1;l.push(x.brand)}});return l}
 function cond(o){
  var b=brands(o),w=b.length?' من '+b.join('، '):'';
  var parts=[];if(o.minQty>0)parts.push('اشتري '+(o.minQty===1?'عدسة واحدة':o.minQty===2?'عدستين':o.minQty+' عدسات')+w);
  if(o.minTotal>0)parts.push('بقيمة '+CL.num(o.minTotal)+' ج.م أو أكتر');
  return parts.join(' ')||'على المنتجات المشمولة';
 }
 var h=CL.ui.header()+'<main id="main" class="wrap"><h1>العروض</h1>';
 if(!O.length)h+='<div class="section-empty"><h3>مفيش عروض شغالة دلوقتي</h3><p>تابعينا، بنجهّز عروض جديدة.</p><a class="btn" href="'+U.catalog+'">تصفحي المنتجات</a></div>';
 else h+='<div class="offers-grid">'+O.map(function(o){
  var b=brands(o),link=b.length===1?U.catalog+'?brand='+encodeURIComponent(b[0]):U.lenses;
  return '<article class="offer-card"><span class="reward">'+e(CL.rewardText(o,P))+'</span><h2>'+e(o.name)+'</h2><p>'+e(cond(o))+'</p>'+(o.description?'<p>'+e(o.description)+'</p>':'')+(o.endsAt?'<p>العرض ساري لحد '+new Date(o.endsAt).toLocaleDateString('ar-EG',{day:'numeric',month:'long'})+'</p>':'')+'<a class="btn" href="'+link+'">تسوقي العرض</a></article>'}).join('')+'</div>';
 a.innerHTML=h+'</main>'+CL.ui.footer();CL.ui.bind();
});
})();
