(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc;
var T={quiz:'اعثري على عدستك',tracking:'تتبعي طلبك',offers:'العروض',tryon:'جرّبي اللون',cart:'السلة',wishlist:'المفضلة',about:'من نحن',faq:'الأسئلة الشائعة',shipping:'الشحن',returns:'الاستبدال والاسترجاع',privacy:'الخصوصية',terms:'الشروط',contact:'تواصلي معانا'};
var k=new URLSearchParams(CL.qs()).get('p')||'',t=T[k]||'الصفحة';
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){
 CL.ui.init(r[1],r[0]);document.title=t+' | Catchy Lens';
 var a=document.getElementById('app');a.removeAttribute('aria-busy');
 a.innerHTML=CL.ui.header()+'<main id="main" class="wrap"><div class="section-empty">'+I('lens')+'<h1 style="font-size:26px;margin:6px 0">'+e(t)+'</h1><h3>الصفحة دي لسه تحت الإنشاء</h3><p>بنجهّزها دلوقتي. كمّلي تصفح باقي الموقع.</p><a class="btn" href="'+U.home+'">الرئيسية</a></div></main>'+CL.ui.footer();
 CL.ui.bind();
});
})();
