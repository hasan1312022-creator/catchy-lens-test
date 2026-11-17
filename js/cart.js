(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc,A=CL.asset;
var MSG={gift_required:'اختاري لون العدسة الهدية من العرض.',bad_gift:'العدسة الهدية دي مش متاحة في العرض، اختاري غيرها.',bad_phone:'رقم الموبايل غير صحيح، لازم يبدأ بـ 01 ويكون 11 رقم.',bad_name:'من فضلك اكتبي الاسم بشكل صحيح.',bad_address:'من فضلك اكتبي العنوان بالتفصيل (8 حروف على الأقل).',bad_notes:'الملاحظات طويلة جداً.',bad_zone:'من فضلك اختاري المنطقة من القائمة.',bad_lines:'السلة فاضية أو فيها عدد كبير من المنتجات.',bad_qty:'الكمية غير صحيحة.',bad_variant:'أحد المنتجات لم يعد متاحاً. حدّثي السلة وحاولي تاني.',bad_power:'قوة النظر غير صحيحة.',bad_coupon:'كود الخصم غير صالح.',too_many:'عملتي طلبات كتير في وقت قصير. حاولي بعد شوية.',server:'حصلت مشكلة، حاولي تاني بعد شوية.'};
var S={},P=[],Z=[],O=[],busy=false;
function evl(){return CL.evalOffers(lines(),O,P)}
function giftOpts(o){return P.filter(function(x){return x.category==='lenses'&&x.state!=='out'&&(o.giftProductIds||[]).indexOf(x.pid)>-1})}
function giftSel(o){var id=+CL.store.get('cl-gift',0),opts=giftOpts(o);return opts.filter(function(x){return x.id===id})[0]||null}
function key(it){return [it.id,it.plano?1:0,it.r||'',it.l||''].join('|')}
function prod(id){return P.filter(function(p){return p.id===id})[0]}
function lines(){return CL.cart.items().map(function(it){var p=prod(it.id);return {it:it,p:p,ok:!!(p&&p.state!=='out'&&p.price!=null)}})}
function subtotal(){return lines().reduce(function(n,x){return n+(x.ok?CL.unitPrice(x.p,x.it)*x.it.q:0)},0)}
function zone(){var v=(document.querySelector('[name=zone]')||{}).value;return Z.filter(function(z){return z.name===(v||'').trim()})[0]}
function fee(){var z=zone(),sub=subtotal(),E=evl();if(!z)return null;if(E.free)return 0;if(S.freeShipMin&&sub-E.disc>=S.freeShipMin)return 0;return +z.fee}
function item(x){
 var it=x.it,p=x.p;
 if(!p)return '<li class="ci off"><div class="ci-body"><b>منتج لم يعد متاحاً</b><button type="button" class="link" data-del="'+e(key(it))+'">إزالة</button></div></li>';
 var pw=it.plano?'بدون قوة (Plano)':'يمين '+(CL.eyePw(it.r)?e(it.r):'بدون قوة')+' / شمال '+(CL.eyePw(it.l)?e(it.l):'بدون قوة');
 return '<li class="ci'+(x.ok?'':' off')+'"><a class="ci-img" href="'+U.product(p)+'">'+CL.ui.img(p.image,p.name,' loading="lazy"')+'</a><div class="ci-body"><span class="brand">'+e(p.brand)+'</span><a href="'+U.product(p)+'"><b>'+e(p.name)+'</b></a><small>'+pw+'</small>'
  +(x.ok?'<div class="ci-row"><div class="qty sm" dir="ltr"><button type="button" data-qk="'+e(key(it))+'" data-d="-1" aria-label="أقل">−</button><output>'+it.q+'</output><button type="button" data-qk="'+e(key(it))+'" data-d="1" aria-label="أكتر">+</button></div><strong>'+CL.money(CL.unitPrice(p,it)*it.q)+'</strong></div>':'<p class="err">'+(p.state==='out'?'نفد المخزون حالياً':'غير متاح للطلب')+'</p>')
  +'<button type="button" class="link" data-del="'+e(key(it))+'">إزالة</button></div></li>';
}
function offerBox(){
 var E=evl(),h='';
 if(E.offer){
  h+='<div class="offerbox on"><b>'+e(E.offer.name)+'</b>';
  if(E.free)h+='<span>الشحن مجاني</span>';
  else if(E.disc)h+='<span>وفّرتي '+CL.money(E.disc)+'</span>';
  else if(E.gift)h+='<span>هدية: '+e(E.gift.fullName?E.gift.fullName+' '+E.gift.name:E.gift.name)+'</span>';
  else if(E.pickGift){var opts=giftOpts(E.offer),sel=giftSel(E.offer);
   h+='<label>اختاري لون العدسة الهدية<select id="gsel"><option value="">اختاري</option>'+opts.map(function(x){return '<option value="'+x.id+'"'+(sel&&sel.id===x.id?' selected':'')+'>'+e(x.brand+' - '+x.name)+'</option>'}).join('')+'</select></label>'}
  h+='</div>';
 }else if(E.hint){h+='<div class="offerbox"><b>'+e(E.hint.o.name)+'</b><span>ضيفي '+E.hint.need+' عدسة كمان وخدي '+e(CL.rewardText(E.hint.o,P))+'</span></div>'}
 return h;
}
function totals(){
 var sub=subtotal(),E=evl(),f=fee(),t=f==null?null:sub-E.disc+f,need=!E.free&&S.freeShipMin&&sub-E.disc<S.freeShipMin?S.freeShipMin-(sub-E.disc):0;
 return '<dl class="sum"><div><dt>المنتجات</dt><dd>'+CL.money(sub)+'</dd></div>'+(E.disc?'<div><dt>'+e(E.offer.name)+'</dt><dd>− '+CL.money(E.disc)+'</dd></div>':'')+'<div><dt>الشحن</dt><dd>'+(f==null?'يتحدد بعد اختيار المنطقة':(f===0?'مجاني':CL.money(f)))+'</dd></div><div class="tot"><dt>الإجمالي</dt><dd>'+(t==null?'—':CL.money(t))+'</dd></div></dl>'
  +(need>0?'<p class="note">باقي '+CL.money(need)+' ويبقى الشحن مجاني.</p>':'')+'<p class="note">الدفع عند الاستلام. لو فيه كود خصم، بيتطبق عند تأكيد الطلب.</p>';
}
function render(){
 var a=document.getElementById('app'),L=lines(),n=L.length;
 var head=CL.ui.header(),foot=CL.ui.footer();
 if(!n){a.innerHTML=head+'<main id="main" class="wrap"><div class="section-empty">'+I('bag')+'<h1 style="font-size:26px;margin:6px 0">السلة فاضية</h1><h3>لسه ما ضفتيش حاجة</h3><a class="btn" href="'+U.catalog+'">تصفحي المنتجات</a></div></main>'+foot;CL.ui.bind();return}
 var okAny=L.some(function(x){return x.ok});
 a.innerHTML=head+'<main id="main" class="wrap cartpage"><h1 style="font-size:28px">السلة</h1><div class="cartgrid"><section aria-label="المنتجات"><ul class="ci-list">'+L.map(item).join('')+'</ul></section>'
  +'<aside class="checkout"><h2 style="font-size:22px;margin:0 0 10px">بيانات التوصيل</h2><form id="co" novalidate autocomplete="on">'
  +'<label>الاسم<input name="customer" autocomplete="name" required maxlength="120"></label>'
  +'<label>رقم الموبايل<input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="01xxxxxxxxx" required maxlength="14"></label>'
  +'<label>المنطقة<input name="zone" list="zl" autocomplete="off" placeholder="اكتبي أو اختاري المنطقة" required><datalist id="zl">'+Z.map(function(z){return '<option value="'+e(z.name)+'">'}).join('')+'</datalist></label>'
  +'<label>العنوان بالتفصيل<textarea name="address" rows="3" required maxlength="400" placeholder="الشارع، رقم العمارة، الدور، علامة مميزة"></textarea></label>'
  +'<label>ملاحظات (اختياري)<textarea name="notes" rows="2" maxlength="500"></textarea></label>'
  +'<label>كود خصم (اختياري)<input name="coupon" autocomplete="off" dir="ltr" style="text-transform:uppercase"></label>'
  +'<input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp">'
  +'<div id="offerbox">'+offerBox()+'</div><div id="tot">'+totals()+'</div><p class="err" role="alert" id="er" hidden></p>'
  +'<button class="btn buybtn" type="submit"'+(okAny?'':' disabled')+'>تأكيد الطلب</button><p class="note">هنكلمك على الموبايل لتأكيد الطلب قبل الشحن'+(S.prepTime?'، والتجهيز '+e(S.prepTime):'')+'.</p></form></aside></div></main>'+foot;
 CL.ui.bind();
 var z=document.querySelector('[name=zone]');z.addEventListener('input',function(){document.getElementById('tot').innerHTML=totals()});
 var saved=CL.store.get('cl-contact',null);if(saved){var f=document.getElementById('co');['customer','phone','address'].forEach(function(k){if(saved[k])f.elements[k].value=saved[k]})}
 document.getElementById('co').addEventListener('submit',submit);
 var gs=document.getElementById('gsel');if(gs)gs.addEventListener('change',function(){CL.store.set('cl-gift',+gs.value||0)});
}
function err(m){var x=document.getElementById('er');x.textContent=m;x.hidden=!m;if(m)x.scrollIntoView({block:'center',behavior:'smooth'})}
function submit(ev){
 ev.preventDefault();if(busy)return;err('');
 var f=ev.target,v=function(k){return f.elements[k].value.trim()},L=lines().filter(function(x){return x.ok});
 if(!L.length)return err('السلة مفيهاش منتجات متاحة.');
 if(v('customer').length<2)return err(MSG.bad_name);
 var ph=v('phone').replace(/[^0-9]/g,'');if(ph.indexOf('20')===0&&ph.length===12)ph='0'+ph.slice(2);
 if(!/^01[0125][0-9]{8}$/.test(ph))return err(MSG.bad_phone);
 if(!zone())return err(MSG.bad_zone);
 if(v('address').length<8)return err(MSG.bad_address);
 if(CL.config.mode!=='live')return err('الطلب غير متاح في وضع المعاينة.');
 var E=evl();if(E.pickGift&&!giftSel(E.offer))return err('اختاري لون العدسة الهدية من العرض.');
 var btn=f.querySelector('button[type=submit]');busy=true;btn.disabled=true;btn.textContent='جاري إرسال الطلب...';
 var payload={customer:v('customer'),phone:ph,zone:v('zone'),address:v('address'),notes:v('notes'),coupon:v('coupon').toUpperCase(),website:v('website'),
  lines:L.map(function(x){return {variant:x.it.id,q:x.it.q,pr:x.it.plano?null:x.it.r,pl:x.it.plano?null:x.it.l}})};
 if(E.pickGift)payload.lines.push({variant:giftSel(E.offer).id,q:1,pr:'gift',pl:null});
 CL.data.order(payload).then(function(r){
  if(r&&r.ok){CL.store.set('cl-contact',{customer:payload.customer,phone:ph,address:payload.address});
   CL.store.set('cl-last',{id:r.order.order_id,phone:ph,total:r.order.total,fee:r.order.ship_fee,supplier:!!r.order.needs_supplier,offer:r.order.offer||'',gift:r.order.gift||''});
   CL.store.set('cl-cart',[]);location.href='order.html?id='+encodeURIComponent(r.order.order_id)+'&new=1';return}
  err((r&&(MSG[r.error]||r.message))||MSG.server);
 }).catch(function(){err('تعذر الاتصال. اتأكدي من الإنترنت وحاولي تاني.')}).then(function(){busy=false;if(btn&&document.body.contains(btn)){btn.disabled=false;btn.textContent='تأكيد الطلب'}});
}
document.addEventListener('click',function(ev){
 var d=ev.target.closest('[data-del]'),q=ev.target.closest('[data-qk]');
 if(d){CL.store.set('cl-cart',CL.cart.items().filter(function(x){return key(x)!==d.dataset.del}));render();CL.cart.refresh();return}
 if(q){var l=CL.cart.items();l.forEach(function(x){if(key(x)===q.dataset.qk)x.q=Math.max(1,Math.min(10,x.q+(+q.dataset.d)))});CL.store.set('cl-cart',l);var keep=document.getElementById('co')?[].slice.call(document.getElementById('co').elements).map(function(el){return el.value}):null;render();if(keep)[].slice.call(document.getElementById('co').elements).forEach(function(el,i){if(keep[i]!=null&&el.name)el.value=keep[i]});document.getElementById('tot')&&(document.getElementById('tot').innerHTML=totals());CL.cart.refresh()}
});
Promise.all([CL.data.catalog(),CL.data.settings(),CL.data.offers()]).then(function(r){
 P=r[0];S=r[1];O=r[2]||[];Z=S.zones||[];CL.ui.init(S,P);document.getElementById('app').removeAttribute('aria-busy');render();
}).catch(function(){
 document.getElementById('app').innerHTML='<main class="wrap"><div class="section-empty"><h3>تعذر تحميل السلة</h3><p>اتأكدي من الإنترنت وحاولي تاني.</p><a class="btn" href="cart.html">إعادة المحاولة</a></div></main>';
});
})();
