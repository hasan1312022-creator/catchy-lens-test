(function(){
var CL=window.CL,e=CL.esc,I=CL.icon,A=CL.asset;
var U=CL.url={home:'index.html',catalog:'catalog.html',lenses:'catalog.html?category=lenses',care:'catalog.html?category=care',accessories:'catalog.html?category=accessories',quiz:'quiz.html',tracking:'order.html',offers:'offers.html',tryon:'try-on.html',cart:'cart.html',wishlist:'wishlist.html',search:'catalog.html?focus=q',about:'about.html',faq:'faq.html',shipping:'shipping.html',returns:'returns.html',privacy:'privacy.html',terms:'terms.html',contact:'contact.html',
 product:function(p){return 'product.html?slug='+encodeURIComponent(p.slug)}};
U.cart='cart.html';var SOON=['quiz','tryon','wishlist'];U.offers='offers.html';SOON.forEach(function(k){U[k]='soon.html?p='+k});['about','faq','shipping','returns','privacy','terms','contact'].forEach(function(k){U[k]='page.html?p='+k});U.brands='brands.html';
var S={},PRODUCTS=[],LAST=null,SHP=null,self2=null;
function img(file,alt,extra){var d=CL.dims[file]||[];return '<img src="'+A(file)+'" alt="'+e(alt||'')+'"'+(d[0]?' width="'+d[0]+'" height="'+d[1]+'"':'')+(extra||'')+'>'}
var NAV=[['الرئيسية','home'],['العدسات','lenses'],['المحاليل والتعقيم','care'],['الإكسسوارات','accessories'],['اعثري على عدستك','quiz'],['تتبعي طلبك','tracking'],['العروض','offers'],['جرّبي اللون','tryon']];
CL.ui={
 img:img,
 init:function(s,p){S=s||{};PRODUCTS=p||[]},
 trust:function(){return '<div class="trust">'+[['eye','عدسات أصلية'],['truck','شحن سريع'],['bag','دفع عند الاستلام'],['return','استرجاع']].map(function(x){return '<span>'+I(x[0])+x[1]+'</span>'}).join('')+'</div>'},
 header:function(){
  var n=CL.cart.count();
  return '<a class="sr" href="#main">تخطي إلى المحتوى</a><div class="top">'+e(S.announcement||'')+'</div><header><div class="head"><div class="tools"><button class="iconbtn" data-menu aria-label="القائمة">'+I('menu')+'</button><a class="iconbtn" href="'+U.search+'" aria-label="بحث">'+I('search')+'</a><a class="iconbtn" href="'+U.catalog+'" aria-label="فلتر">'+I('filter')+'</a></div><a href="'+U.home+'" aria-label="Catchy Lens">'+img('logo.svg','Catchy Lens',' class="logo"')+'</a><div class="tools end"><a class="iconbtn desktop-only" href="'+U.wishlist+'" aria-label="المفضلة">'+I('heart')+'</a><a class="iconbtn" data-cartlink href="'+U.cart+'" aria-label="السلة">'+I('bag')+(n?'<span class="count">'+n+'</span>':'')+'</a></div></div><nav class="nav">'+NAV.map(function(x){return '<a href="'+U[x[1]]+'">'+x[0]+'</a>'}).join('')+'</nav></header><div class="drawer" hidden><nav aria-label="القائمة"><button class="x" data-menu aria-label="إغلاق">×</button>'+NAV.concat([['من نحن','about'],['الأسئلة الشائعة','faq'],['تواصلي معانا','contact']]).map(function(x){return '<a href="'+U[x[1]]+'">'+x[0]+'</a>'}).join('')+'</nav></div>';
 },
 footer:function(){
  var wa=S.whatsapp?'<a class="wa" href="https://wa.me/'+e(S.whatsapp)+'" aria-label="واتساب">'+I('chat')+'</a>':'';
  var D=CL.defaults||{},soc=[['فيسبوك',S.facebook||D.facebook],['إنستجرام',S.instagram||D.instagram],['تيك توك',S.tiktok||D.tiktok]].filter(function(x){return x[1]}),social=soc.length?'<div class="social">'+soc.map(function(x){return '<a href="'+e(x[1])+'" target="_blank" rel="noopener">'+x[0]+'</a>'}).join('')+'</div>':'';
  function col(h,l){return '<div><h3>'+h+'</h3>'+l.map(function(x){return '<a href="'+U[x[1]]+'">'+x[0]+'</a>'}).join('')+'</div>'}
  return '<footer class="footer"><div class="wrap"><div class="footgrid"><div>'+img('logo.svg','Catchy Lens')+'<p><bdi dir="ltr">Your Eyes. Your Magic.</bdi></p><small>عدسات وألوان... بطريقتك.</small></div>'+col('اكتشفي',[['كل المنتجات','catalog'],['الماركات','brands'],['اعثري على عدستك','quiz'],['المفضلة','wishlist'],['من نحن','about'],['العروض','offers'],['جرّبي اللون','tryon']])+col('نساعدك',[['تتبعي طلبك','tracking'],['الأسئلة الشائعة','faq'],['الشحن','shipping'],['الاستبدال والاسترجاع','returns'],['الخصوصية','privacy'],['الشروط','terms'],['تواصلي معانا','contact']])+'</div>'+social+'<div class="copyright">© Catchy Lens</div></div></footer>'+wa;
 },
 card:function(p){
  var d=CL.dims[p.image]||[],disc=p.oldPrice&&p.price&&p.oldPrice>p.price?Math.round((1-p.price/p.oldPrice)*100):0,href=U.product(p);
  var out=p.state==='out',chip=p.category==='lenses'&&p.powerType?'<span class="ptype" dir="ltr">'+(p.powerType==='both'?'Plano &amp; Power':'Plano')+'</span>':'';
  return '<article class="card"><button class="wish'+(CL.wish.has(p.id)?' selected':'')+'" data-wish="'+p.id+'" aria-label="المفضلة" aria-pressed="'+CL.wish.has(p.id)+'">'+I('heart')+'</button><a class="photo" href="'+href+'">'+img(p.image,p.name,' loading="lazy" decoding="async"')+(disc?'<span class="tag discount">-'+disc+'%</span>':'')+chip+'</a><div class="card-info"><span class="brand">'+e(p.brand)+'</span><a href="'+href+'"><h3>'+e(p.name)+'</h3></a><div class="price">'+CL.money(p.price)+'</div>'+(p.oldPrice?'<del class="old">السعر القديم: '+CL.money(p.oldPrice)+'</del>':'')+'<span class="stock '+(p.state==='in'?'':e(p.state))+'">'+(CL.state[p.state]||'')+'</span>'+(out?'<a class="btn" href="'+href+'">شوفي التفاصيل</a>':'<button type="button" class="btn" data-add="'+p.id+'">أضيفي للسلة</button>')+(p.state==='pre'?'<small>'+(S.leadDays?'تُجهّز خلال '+e(S.leadDays)+' أيام':'تُجهّز بالطلب')+'</small>':'')+'</div></article>';
 },
 sheet:function(p){
  LAST=document.activeElement;
  var pw=S.powers||[],o='<option value="">اختاري القوة</option><option value="0.00">بدون قوة (0.00)</option>'+pw.map(function(x){return '<option value="'+e(x)+'">'+e(x)+'</option>'}).join('');
  var h='<div class="sheet" data-sheet><div class="sheet-box" role="dialog" aria-modal="true" aria-labelledby="sh-t"><button type="button" class="x" data-close aria-label="إغلاق">×</button><span class="brand">'+e(p.brand)+'</span><h3 id="sh-t">'+e(p.name)+'</h3>'
   +'<div class="seg" role="radiogroup" aria-label="نوع العدسة"><label><input type="radio" name="pt" value="plano" checked> <span>بدون قوة (Plano)</span></label><label><input type="radio" name="pt" value="power"> <span>بقوة نظر</span></label></div>'
   +'<div class="powers" hidden><div class="two"><label>العين اليمنى<select name="r">'+o+'</select></label><label>العين اليسرى<select name="l">'+o+'</select></label></div><label class="same"><input type="checkbox" name="same"> <span>نفس القوة للعين التانية</span></label><p class="note">تأكدي من الروشتة قبل اختيار القوة.</p></div>'
   +'<p class="note sheetprice" data-sp></p>'
   +'<div class="qty"><span>الكمية</span><div dir="ltr"><button type="button" data-q="-1" aria-label="أقل">−</button><output>1</output><button type="button" data-q="1" aria-label="أكتر">+</button></div></div>'
   +(p.state==='pre'?'<p class="note">'+(S.leadDays?'تُجهّز خلال '+e(S.leadDays)+' أيام':'تُجهّز بالطلب')+'</p>':'')
   +'<p class="err" role="alert" hidden></p><button type="button" class="btn" data-confirm="'+p.id+'">أضيفي للسلة</button></div></div>';
  var d=document.createElement('div');d.innerHTML=h;document.body.appendChild(d.firstChild);document.documentElement.classList.add('lock');
  var sh=document.querySelector('[data-sheet]');sh.querySelector('input').focus();self2.sheetPrice(sh,p);SHP=p;
 },
 sheetPrice:function(sh,p){var el=sh.querySelector('[data-sp]');if(!el)return;var pt=sh.querySelector('input[name=pt]:checked').value,r=sh.querySelector('[name=r]').value,l=sh.querySelector('[name=l]').value,same=sh.querySelector('[name=same]').checked;if(same)l=r;
  var it=pt==='power'?{plano:false,r:r,l:l}:{plano:true};var u=CL.unitPrice(p,it),pp=p.powerPrice!=null?p.powerPrice:p.price;
  el.textContent=pt==='power'&&pp!==p.price?'سعر الزوج حسب اختيارك: '+CL.money(u)+(r&&l&&CL.eyePw(r)!==CL.eyePw(l)?' (متوسط سعر البلانو والباور)':''):'السعر: '+CL.money(u)},
 closeSheet:function(){var s=document.querySelector('[data-sheet]');if(!s)return;s.remove();document.documentElement.classList.remove('lock');if(LAST&&LAST.focus)LAST.focus()},
 bind:function(){
  var dr=document.querySelector('.drawer'),self=this;
  function byId(id){return PRODUCTS.filter(function(x){return x.id===+id})[0]}
  document.addEventListener('click',function(ev){
   var t=ev.target,m=t.closest('[data-menu]');if(m&&dr){dr.hidden=!dr.hidden;return}
   if(dr&&!dr.hidden&&t===dr){dr.hidden=true;return}
   var w=t.closest('[data-wish]');if(w){var on=CL.wish.toggle(+w.dataset.wish);w.classList.toggle('selected',on);w.setAttribute('aria-pressed',on);CL.toast(on?'اتضافت للمفضلة':'اتشالت من المفضلة');return}
   var a=t.closest('[data-add]');if(a){var p=byId(a.dataset.add);if(!p)return;if(p.powerType==='both'){self.sheet(p)}else{CL.cart.add({id:p.id,slug:p.slug,plano:true,q:1});CL.toast('اتضافت للسلة')}return}
   var sh=t.closest('[data-sheet]');if(!sh)return;
   if(t.closest('[data-close]')||t===sh){self.closeSheet();return}
   var q=t.closest('[data-q]');if(q){var o=sh.querySelector('output'),n=Math.max(1,Math.min(10,(+o.textContent)+(+q.dataset.q)));o.textContent=n;return}
   var c=t.closest('[data-confirm]');if(c){
    var p=byId(c.dataset.confirm),pt=sh.querySelector('input[name=pt]:checked').value,r=sh.querySelector('[name=r]').value,l=sh.querySelector('[name=l]').value,same=sh.querySelector('[name=same]').checked,er=sh.querySelector('.err'),qty=+sh.querySelector('output').textContent;
    if(pt==='power'){if(same)l=r;if(!r||!l){er.textContent='اختاري قوة العين اليمنى والعين اليسرى.';er.hidden=false;return}CL.cart.add(r==='0.00'&&l==='0.00'?{id:p.id,slug:p.slug,plano:true,q:qty}:{id:p.id,slug:p.slug,plano:false,r:r,l:l,q:qty})}
    else CL.cart.add({id:p.id,slug:p.slug,plano:true,q:qty});
    self.closeSheet();CL.toast('اتضافت للسلة');
   }
  });
  document.addEventListener('change',function(ev){
   var sh=ev.target.closest('[data-sheet]');if(!sh)return;
   if(ev.target.name==='pt')sh.querySelector('.powers').hidden=ev.target.value!=='power';
   if(ev.target.name==='same'||ev.target.name==='r'){var s=sh.querySelector('[name=same]').checked,L=sh.querySelector('[name=l]');L.disabled=s;if(s)L.value=sh.querySelector('[name=r]').value}
   if(SHP)CL.ui.sheetPrice(sh,SHP);
  });
  document.addEventListener('keydown',function(ev){
   if(ev.key==='Escape'){if(dr)dr.hidden=true;self.closeSheet();return}
   if(ev.key==='Tab'){var sh=document.querySelector('[data-sheet] .sheet-box');if(!sh)return;var f=[].slice.call(sh.querySelectorAll('button,input,select,a[href]')).filter(function(x){return !x.disabled&&x.offsetParent!==null});if(!f.length)return;var first=f[0],last=f[f.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}}
  });
 }
};
self2=CL.ui;
})();
