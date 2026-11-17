(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc;
var ST={new:'تم استلام طلبك',preparing:'جاري تجهيز طلبك',shipped:'تم تسليم الطلب لشركة الشحن',indelivery:'طلبك في الطريق إليكِ',delivered:'تم تسليم الطلب',refused:'تم رفض الاستلام',unavailable:'أحد المنتجات غير متاح حالياً، هنتواصل معاكِ',partial:'تم تسليم جزء من الطلب',cancelled:'تم إلغاء الطلب'};
var FLOW=['new','preparing','shipped','indelivery','delivered'],FL={new:'تم الاستلام',preparing:'التجهيز',shipped:'الشحن',indelivery:'في الطريق',delivered:'التسليم'};
var S={},qs=new URLSearchParams(CL.qs()),last=CL.store.get('cl-last',null);
function timeline(st){
 var i=FLOW.indexOf(st);
 if(i<0)return '<p class="statusbox">'+e(ST[st]||st)+'</p>';
 return '<ol class="steps">'+FLOW.map(function(s,k){return '<li class="'+(k<i?'s-done':k===i?'s-now':'')+'"><span></span>'+FL[s]+'</li>'}).join('')+'</ol><p class="statusbox">'+e(ST[st])+'</p>';
}
function result(o){
 if(!o)return '<p class="err">مفيش طلب بالبيانات دي. اتأكدي من الرقم والموبايل.</p>';
 return '<div class="trackcard"><h3>طلب رقم '+e(qs.get('id')||'')+'</h3>'+timeline(o.status)+'<p class="note">'+e(o.items||'')+'</p><p><b>الإجمالي: '+CL.money(o.total)+'</b>'+(o.zone?' — '+e(o.zone):'')+'</p>'+(o.waybill?'<p class="note">رقم بوليصة الشحن: <bdi dir="ltr">'+e(o.waybill)+'</bdi></p>':'')+'</div>';
}
function render(){
 var a=document.getElementById('app'),isNew=qs.get('new')==='1'&&last&&String(last.id)===qs.get('id');
 var h=CL.ui.header()+'<main id="main" class="wrap orderpage">';
 if(isNew)h+='<div class="success"><div class="ok">'+I('eye')+'</div><h1>تم استلام طلبك</h1><p>رقم طلبك <b>'+e(last.id)+'</b>. احتفظي بيه لتتبع الطلب.</p><p>إجمالي الطلب <b>'+CL.money(last.total)+'</b> (شامل الشحن '+(last.fee?CL.money(last.fee):'مجاني')+') — الدفع عند الاستلام.</p>'+(last.offer?'<p>العرض المطبّق: <b>'+e(last.offer)+'</b>'+(last.gift?' — '+e(last.gift):'')+'</p>':'')
  +'<p>هنكلمك على الموبايل لتأكيد الطلب قبل الشحن.'+(last.supplier?' بما إن فيه قوة نظر، بنجهّزها من المورد وممكن تاخد وقت أطول.':'')+'</p>'+(S.whatsapp?'<a class="btn alt" href="https://wa.me/'+e(S.whatsapp)+'" target="_blank" rel="noopener">كلمينا على واتساب</a> ':'')+'<a class="btn" href="'+U.catalog+'">كمّلي تسوق</a></div>';
 h+='<section class="trackform"><h2 style="font-size:24px">'+(isNew?'تتبعي طلبك':'تتبعي طلبك')+'</h2><form id="tf" novalidate><label>رقم الطلب<input name="id" inputmode="numeric" dir="ltr" value="'+e(qs.get('id')||(last&&last.id)||'')+'" required></label><label>رقم الموبايل<input name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="01xxxxxxxxx" value="'+e(last&&last.phone||'')+'" required></label><button class="btn" type="submit">تتبعي</button></form><div id="tr" aria-live="polite"></div></section></main>'+CL.ui.footer();
 a.innerHTML=h;a.removeAttribute('aria-busy');CL.ui.bind();
 document.getElementById('tf').addEventListener('submit',function(ev){
  ev.preventDefault();var f=ev.target,id=+f.elements.id.value.trim(),ph=f.elements.phone.value.trim(),box=document.getElementById('tr');
  if(!id||ph.replace(/\D/g,'').length<10){box.innerHTML='<p class="err">اكتبي رقم الطلب ورقم الموبايل.</p>';return}
  if(CL.config.mode!=='live'){box.innerHTML='<p class="err">التتبع غير متاح في وضع المعاينة.</p>';return}
  box.innerHTML='<p class="note">جاري البحث...</p>';qs.set('id',String(id));
  CL.data.track(id,ph).then(function(r){box.innerHTML=r&&r.ok?result(r.order):'<p class="err">حصلت مشكلة، حاولي تاني.</p>'}).catch(function(){box.innerHTML='<p class="err">تعذر الاتصال، حاولي تاني.</p>'});
 });
 if(qs.get('id')&&last&&String(last.id)===qs.get('id')&&CL.config.mode==='live')document.getElementById('tf').requestSubmit();
}
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){S=r[1];CL.ui.init(S,r[0]);document.title='طلبك | Catchy Lens';render()}).catch(function(){S={};render()});
})();
