(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc,A=CL.asset;
var DUR={daily:'يومية',monthly:'شهرية',quarterly:'٣ شهور',semiannual:'٦ شهور',yearly:'سنوية'};
var CATN={lenses:'العدسات',care:'المحاليل والتعقيم',accessories:'الإكسسوارات'};
var P,S={},ALL=[],cur=0;
function slug(){return new URLSearchParams(CL.qs()).get('slug')||window.__SLUG||''}
function powerOpts(sel){return '<option value="0.00">بدون قوة (0.00)</option>'+(S.powers||[]).map(function(x){return '<option value="'+e(x)+'"'+(x===sel?' selected':'')+'>'+e(x)+'</option>'}).join('')}
function gallery(){
 var imgs=P.images&&P.images.length?P.images:[P.image];
 return '<div class="gal"><div class="gal-main">'+CL.ui.img(imgs[0],P.name,' id="gmain" fetchpriority="high"')+'</div>'+(imgs.length>1?'<div class="gal-thumbs" role="group" aria-label="صور المنتج">'+imgs.map(function(f,i){return '<button type="button" class="thumb'+(i?'':' on')+'" data-img="'+e(f)+'" aria-label="الصورة '+(i+1)+'" aria-pressed="'+(i===0)+'">'+CL.ui.img(f,'',' loading="lazy" decoding="async"')+'</button>'}).join('')+'</div>':'')+'</div>';
}
function stateNote(){
 if(P.state==='pre')return '<p class="note">'+(S.leadDays?'تُجهّز خلال '+e(S.leadDays)+' أيام':'تُجهّز بالطلب')+'</p>';
 return '';
}
function buy(){
 var lens=P.category==='lenses',out=P.state==='out',disc=P.oldPrice&&P.price&&P.oldPrice>P.price?Math.round((1-P.price/P.oldPrice)*100):0;
 var h='<div class="buy"><a class="brand" href="'+U.catalog+'?brand='+encodeURIComponent(P.brand)+'">'+e(P.brand)+'</a><h1>'+e(P.name)+'</h1>'
  +'<div class="pricebox"><span class="price">'+CL.money(P.price)+'</span>'+(P.oldPrice?'<del class="old">'+CL.money(P.oldPrice)+'</del>':'')+(disc?'<span class="tag discount">-'+disc+'%</span>':'')+'</div>'+(lens&&P.powerType==='both'&&P.powerPrice!=null&&P.powerPrice!==P.price?'<p class="note">سعر العدسة بقوة نظر: <b>'+CL.money(P.powerPrice)+'</b> (لو عين بدون قوة وعين بقوة السعر متوسط السعرين).</p>':'')
  +'<div class="chips-row"><span class="stock '+(P.state==='in'?'':e(P.state))+'">'+(CL.state[P.state]||'')+'</span>'+(lens&&P.powerType?'<span class="ptype inline" dir="ltr">'+(P.powerType==='both'?'Plano &amp; Power':'Plano')+'</span>':'')+'</div>'+stateNote();
 if(lens&&P.powerType==='both'){
  h+='<div class="powerbox"><a class="textlink" href="#" data-help>إزاي أعرف قوة نظري؟</a><p class="note">تأكدي من الروشتة قبل اختيار القوة.</p><div class="two"><label>العين اليمنى<select id="pr">'+powerOpts()+'</select></label><label>العين اليسرى<select id="pl">'+powerOpts()+'</select></label></div><label class="same"><input type="checkbox" id="same"> <span>نفس القوة للعين التانية</span></label></div>';
 }else if(lens){h+='<p class="note">العدسة دي Plano فقط (بدون قوة نظر).</p>'}
 h+='<div class="qty"><span>الكمية</span><div dir="ltr"><button type="button" data-q="-1" aria-label="أقل">−</button><output id="qty">1</output><button type="button" data-q="1" aria-label="أكتر">+</button></div></div>'
  +(lens&&P.powerType==='both'?'<p class="note" id="pcur"></p>':'')+'<p class="err" id="perr" role="alert" hidden></p>'
  +'<button type="button" class="btn buybtn" id="addmain" data-pdp-add'+(out?' disabled':'')+'>'+(out?'نفد المخزون':'أضيفي للسلة')+'</button></div>';
 return h;
}
function details(){
 var specs=[['الماركة',P.brand]];
 if(P.color&&S.colorLabels&&S.colorLabels[P.color])specs.push(['اللون',S.colorLabels[P.color]]);
 if(P.duration&&DUR[P.duration])specs.push(['مدة الاستخدام',DUR[P.duration]]);
 if(P.category==='lenses'&&P.powerType)specs.push(['النوع',P.powerType==='both'?'Plano & Power':'Plano']);
 var t='<table class="specs"><tbody>'+specs.map(function(r){return '<tr><th scope="row">'+e(r[0])+'</th><td>'+e(r[1])+'</td></tr>'}).join('')+'</tbody></table>';
 var d=P.desc?'<p>'+e(P.desc)+'</p>':'<p class="muted">وصف المنتج هيظهر هنا بعد إضافته.</p>';
 return '<div class="acc"><details open><summary>تفاصيل المنتج</summary><div class="acc-body">'+d+t+'</div></details>'
  +'<details><summary>الشحن والاسترجاع</summary><div class="acc-body">'+(S.shippingText?'<p>'+e(S.shippingText)+'</p>':'<p class="muted">سياسة الشحن والاسترجاع المعتمدة هتظهر هنا.</p>')+'<p><a class="textlink" href="'+U.shipping+'">الشحن</a> · <a class="textlink" href="'+U.returns+'">الاستبدال والاسترجاع</a></p></div></details>'
  +'<details><summary>التقييمات</summary><div class="acc-body"><p class="muted">لسه مفيش تقييمات للمنتج ده.</p></div></details></div>';
}
function related(){
 var r=ALL.filter(function(x){return x.id!==P.id&&x.category===P.category&&(x.brand===P.brand||x.color===P.color)});
 if(r.length<4)r=r.concat(ALL.filter(function(x){return x.id!==P.id&&x.category===P.category&&r.indexOf(x)<0}));
 r=r.slice(0,4);
 return r.length?'<section class="section"><div class="section-title"><h2>منتجات مشابهة</h2></div><div class="products">'+r.map(CL.ui.card).join('')+'</div></section>':'';
}
function jsonld(){
 if(P.price==null)return;
 var av={in:'InStock',low:'LimitedAvailability',out:'OutOfStock',pre:'PreOrder'}[P.state];
 var o={'@context':'https://schema.org','@type':'Product',name:P.name,brand:{'@type':'Brand',name:P.brand},image:(P.images||[P.image]).map(function(f){return new URL(A(f),location.href).href}),offers:{'@type':'Offer',priceCurrency:'EGP',price:String(P.price),availability:'https://schema.org/'+av}};
 var s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(o);document.head.appendChild(s);
}
function page(){
 return '<div class="wrap has-bar">'+CL.ui.trust()+'<nav class="crumbs" aria-label="مسار الصفحة"><a href="'+U.home+'">الرئيسية</a> › <a href="'+U.catalog+'?category='+e(P.category)+'">'+e(CATN[P.category]||'المنتجات')+'</a> › <span aria-current="page">'+e(P.name)+'</span></nav><div class="pdp">'+gallery()+buy()+'</div>'+details()+related()+'</div><div class="stickybar" id="sticky" aria-hidden="true"><div><span class="price">'+CL.money(P.price)+'</span></div><button type="button" class="btn" data-pdp-add'+(P.state==='out'?' disabled':'')+' tabindex="-1">'+(P.state==='out'?'نفد المخزون':'أضيفي للسلة')+'</button></div>';
}
function curPrice(){var el=document.getElementById('pcur');if(!el)return;var r=value('pr'),l=document.getElementById('same').checked?r:value('pl'),u=CL.unitPrice(P,{plano:false,r:r,l:l});el.textContent='سعر الزوج حسب اختيارك: '+CL.money(u)}
function value(id){var x=document.getElementById(id);return x?x.value:'0.00'}
function add(){
 var q=+document.getElementById('qty').textContent,er=document.getElementById('perr'),it={id:P.id,slug:P.slug,q:q};
 if(P.category==='lenses'&&P.powerType==='both'){
  var r=value('pr'),l=document.getElementById('same').checked?r:value('pl');
  it.plano=(r==='0.00'&&l==='0.00');if(!it.plano){it.r=r;it.l=l}
 }else it.plano=true;
 er.hidden=true;CL.cart.add(it);CL.toast('اتضافت للسلة');
}
function helpModal(){
 var last=document.activeElement,d=document.createElement('div');d.className='sheet';d.setAttribute('data-helpsheet','');
 d.innerHTML='<div class="sheet-box" role="dialog" aria-modal="true" aria-labelledby="hp-t"><button type="button" class="x" aria-label="إغلاق" data-hclose>×</button><h3 id="hp-t">إزاي أعرف قوة نظري؟</h3><p>'+e(S.powerHelp||'قوة النظر مكتوبة في روشتة دكتور العيون لكل عين: العين اليمنى (OD) والعين اليسرى (OS). لو مش متأكدة من القوة، استشيري دكتور العيون قبل الطلب.')+'</p><button type="button" class="btn" data-hclose>تمام</button></div>';
 document.body.appendChild(d);document.documentElement.classList.add('lock');d.querySelector('[data-hclose]').focus();
 function close(){d.remove();document.documentElement.classList.remove('lock');document.removeEventListener('keydown',k);if(last&&last.focus)last.focus()}
 function k(ev){if(ev.key==='Escape')close()}
 d.addEventListener('click',function(ev){if(ev.target===d||ev.target.closest('[data-hclose]'))close()});document.addEventListener('keydown',k);
}
function bind(){
 document.addEventListener('click',function(ev){
  var t=ev.target,th=t.closest('[data-img]');
  if(th){document.getElementById('gmain').src=A(th.dataset.img);document.querySelectorAll('.thumb').forEach(function(b){var on=b===th;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});return}
  if(t.closest('[data-help]')){ev.preventDefault();helpModal();return}
  var q=t.closest('.buy [data-q]');if(q){var o=document.getElementById('qty');o.textContent=Math.max(1,Math.min(10,(+o.textContent)+(+q.dataset.q)));return}
  if(t.closest('[data-pdp-add]')&&!t.closest('[disabled]'))add();
 });
 document.addEventListener('change',function(ev){if(ev.target.id==='same'){var L=document.getElementById('pl');L.disabled=ev.target.checked;if(ev.target.checked)L.value=value('pr')}if(ev.target.id==='pr'&&document.getElementById('same').checked)document.getElementById('pl').value=value('pr');if(ev.target.id==='pr'||ev.target.id==='pl'||ev.target.id==='same')curPrice()});
 curPrice();
 var main=document.getElementById('addmain'),bar=document.getElementById('sticky');
 if(main&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var v=!en[0].isIntersecting;bar.classList.toggle('show',v);bar.setAttribute('aria-hidden',!v);bar.querySelector('button').tabIndex=v?0:-1}).observe(main)}
}
function notFound(){document.getElementById('app').innerHTML=CL.ui.header()+'<main id="main" class="wrap"><div class="section-empty">'+I('lens')+'<h3>المنتج مش موجود</h3><p>يمكن الرابط قديم أو المنتج اتشال.</p><a class="btn" href="'+U.catalog+'">شوفي كل المنتجات</a></div></main>'+CL.ui.footer();CL.ui.bind();document.title='المنتج مش موجود | Catchy Lens'}
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){
 ALL=r[0];S=r[1];CL.ui.init(S,ALL);P=ALL.filter(function(x){return x.slug===slug()})[0];
 document.getElementById('app').removeAttribute('aria-busy');
 if(!P)return notFound();
 document.title=P.name+' | '+P.brand+' | Catchy Lens';
 var m=document.querySelector('meta[name=description]');if(m)m.content=P.name+' من '+P.brand+' على Catchy Lens.';
 document.getElementById('app').innerHTML=CL.ui.header()+'<main id="main">'+page()+'</main>'+CL.ui.footer();
 CL.ui.bind();bind();jsonld();
}).catch(function(){document.getElementById('app').innerHTML='<div class="wrap"><div class="section-empty"><h3>حصلت مشكلة في التحميل</h3><button type="button" class="btn" onclick="location.reload()">حاولي تاني</button></div></div>'});
})();
