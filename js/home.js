(function(){
var CL=window.CL,U=CL.url,I=CL.icon,A=CL.asset,e=CL.esc,img=CL.ui.img;
Promise.all([CL.data.catalog(),CL.data.settings(),CL.data.content()]).then(function(r){
 var P=r[0],S=r[1],C=r[2];
 CL.ui.init(S,P);
 document.getElementById('app').innerHTML=CL.ui.header()+'<main id="main">'+home(P,C,S)+'</main>'+CL.ui.footer();
 CL.ui.bind();slider();
});

function hero(slides){
 var tr=slides.map(function(s,i){return '<div class="slide'+(i?'':' on')+'" role="group" aria-roledescription="slide" aria-label="'+(i+1)+' من '+slides.length+'">'+pic(s.desktop,s.mobile,s.alt,i?' loading="lazy" decoding="async"':' fetchpriority="high"')+'<div class="hero-copy">'+(i?'<p class="slide-title" dir="auto">'+s.title+'</p>':'<h1 dir="auto">'+s.title+'</h1>')+'<p>'+e(s.sub)+'</p><a href="'+link(s.href)+'" class="btn">'+e(s.cta)+'</a></div></div>'}).join('');
 var dots=slides.map(function(s,i){return '<button type="button" class="dot'+(i?'':' on')+'" data-slide="'+i+'" aria-label="الشريحة '+(i+1)+'"'+(i?'':' aria-current="true"')+'></button>'}).join('');
 return '<section class="hero" role="region" aria-roledescription="carousel" aria-label="عروض Catchy Lens"><div class="hero-track">'+tr+'</div>'+(slides.length>1?'<div class="hero-ctrl"><button type="button" class="pp" data-pp aria-label="إيقاف مؤقت للعرض">'+I('pause')+'</button>'+dots+'</div>':'')+'</section>';
}
function slider(){
 var root=document.querySelector('.hero');if(!root)return;
 var sl=[].slice.call(root.querySelectorAll('.slide')),dots=[].slice.call(root.querySelectorAll('.dot')),pp=root.querySelector('[data-pp]');
 if(sl.length<2)return;
 var i=0,timer=null,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,x0=null;
 sl.forEach(function(s,k){s.inert=k!==0});
 function go(n){i=(n+sl.length)%sl.length;sl.forEach(function(s,k){s.classList.toggle('on',k===i);s.inert=k!==i});dots.forEach(function(d,k){d.classList.toggle('on',k===i);if(k===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')})}
 function stop(){clearInterval(timer);timer=null}
 function play(){stop();if(!paused&&!document.hidden)timer=setInterval(function(){go(i+1)},6500)}
 function label(){pp.innerHTML=paused?I('play'):I('pause');pp.setAttribute('aria-label',paused?'تشغيل العرض':'إيقاف مؤقت للعرض')}
 pp.addEventListener('click',function(){paused=!paused;label();play()});
 dots.forEach(function(d){d.addEventListener('click',function(){go(+d.dataset.slide);play()})});
 root.addEventListener('pointerenter',stop);root.addEventListener('pointerleave',play);root.addEventListener('focusin',stop);root.addEventListener('focusout',play);
 root.addEventListener('touchstart',function(ev){x0=ev.touches[0].clientX},{passive:true});
 root.addEventListener('touchend',function(ev){if(x0==null)return;var dx=ev.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));play()}});
 document.addEventListener('visibilitychange',play);
 label();play();
}
function brandsRow(list){
 return '<div class="brands" role="region" aria-label="الماركات" tabindex="0">'+list.map(function(b){return '<a class="brand-item" href="'+U.catalog+'?brand='+encodeURIComponent(b.name)+'"><span>'+e(b.name)+'</span>'+(b.image?img(b.image,b.name,' loading="lazy" decoding="async"'):'')+'</a>'}).join('')+'</div>';
}
function link(k){return U[k]||k||'#'}
function title(t,k){return '<div class="section-title"><h2>'+t+'</h2>'+(k?'<a class="textlink" href="'+link(k)+'">عرض الكل</a>':'')+'</div>'}
function grid(list){
 if(!list.length)return '<div class="section-empty">'+I('lens')+'<h3>الاختيارات هتظهر هنا قريب</h3><p>لسه مفيش منتجات متاحة في المجموعة دي.</p><a class="textlink" href="'+U.catalog+'">شوفي كل المنتجات</a></div>';
 return '<div class="products">'+list.map(CL.ui.card).join('')+'</div>';
}
function empty(icon,h,p){return '<div class="section-empty compact">'+I(icon)+'<p>'+h+'</p>'+(p?'<small>'+p+'</small>':'')+'</div>'}
function pic(d,m,alt,extra){
 var dd=CL.dims[d]||[];
 return '<picture>'+(m?'<source media="(max-width:800px)" srcset="'+A(m)+'">':'')+'<img src="'+A(d)+'" alt="'+e(alt||'')+'"'+(dd[0]?' width="'+dd[0]+'" height="'+dd[1]+'"':'')+(extra||'')+'></picture>';
}
function banner(b,cls){
 if(!b)return '';
 return '<section class="section"><div class="editorial">'+(b.mobile?pic(b.desktop,b.mobile,'',' loading="lazy" decoding="async"'):img(b.image,'',' loading="lazy" decoding="async"'))+'<div class="caption"><h2>'+e(b.title)+'</h2><a href="'+link(b.href)+'" class="btn'+(cls?' '+cls:'')+'">'+e(b.cta)+'</a></div></div></section>';
}
function home(P,C,S){
 var brands=S.brands&&S.brands.length?S.brands:(function(){var l=[],s={};P.forEach(function(p){if(!s[p.brand]){s[p.brand]=1;l.push({name:p.brand})}});return l})();
 var f=C.film||{};
 var cats=[['lenses','العدسات','lenses'],['care','محاليل وتعقيم','care'],['accessories','الإكسسوارات','accessories']];
 return '<div class="wrap">'+CL.ui.trust()
 +hero(C.heroSlides)
 +'<section class="section">'+brandsRow(brands)+'<div class="categories">'+cats.map(function(c){return '<a class="category" href="'+link(c[2])+'">'+img('img/category-'+c[0]+'.svg','')+c[1]+'</a>'}).join('')+'</div></section>'
 +'<section class="section">'+title('كل لون... حكاية')+'<div class="colors">'+C.colors.map(function(c){return '<a href="'+U.catalog+'?color='+e(c.id)+'">'+img(c.image,c.label,' loading="lazy" decoding="async"')+e(c.label)+'</a>'}).join('')+'</div></section>'
 +'<section class="section">'+title('الأكثر طلبًا','catalog')+grid(P.slice(0,4))+'</section>'
 +'<section class="section">'+title('فيديو البراند')+'<div class="film">'+img(f.cover,'عالم Catchy Lens',' loading="lazy" decoding="async"')+(f.url?'<a class="play" href="'+e(f.url)+'" aria-label="شغّلي الفيديو">'+I('play')+'</a>':'')+'</div>'+(f.url?'':empty('play','فيديو البراند هيظهر هنا بعد إضافته.'))+'</section>'
 +banner(C.quiz)+banner(C.offers,'alt')
 +'<section class="section">'+title('وصل حديثًا','catalog')+grid(P.slice(4,8))+'</section>'
 +banner(C.arrivals)
 +'<section class="section">'+title('Catchy Moments')+(C.moments&&C.moments.length?'<div class="moments">'+C.moments.map(function(m,i){return '<a href="'+e(m.url||'#')+'" aria-label="لحظة من كاتشي '+(i+1)+'">'+img(m.image,'لحظة من كاتشي '+(i+1),' loading="lazy" decoding="async"')+'</a>'}).join('')+'</div>':'')+(C.moments&&C.moments.some(function(m){return m.url})?'':empty('play','الفيديوهات وروابطها الأصلية لسه متضافتش.'))+'</section>'
 +'<section class="section narrow" style="text-align:center"><h2>تجاربكم بتكمل الحكاية</h2>'+(C.reviews&&C.reviews.length?'':empty('heart','لسه مفيش تقييمات منشورة.','تجاربكم وصوركم تُضاف بموافقتكم.'))+'</section></div>';
}
})();
