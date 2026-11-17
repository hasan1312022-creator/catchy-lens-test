(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc;
var k=new URLSearchParams(CL.qs()).get('p')||'about';
function fill(t,s){
 var D=CL.defaults||{},wa=String(s.whatsapp||'').replace(/\D/g,'');if(wa.charAt(0)==='0')wa=wa.slice(1);else if(wa.indexOf('20')===0)wa=wa.slice(2);
 var v={shipCairo:s.shipCairo||D.ship_cairo,shipDelta:s.shipDelta||D.ship_delta,shipUpper:s.shipUpper||D.ship_upper,returnWindow:s.returnWindow||D.return_window,hours:s.hours||D.hours,
  whatsapp:wa?'0'+wa:'',freeShipLine:s.freeShipMin?'الشحن مجاني للطلبات اللي فوق '+CL.num(s.freeShipMin)+' ج.م.':''};
 return t.replace(/\{\{(\w+)\}\}/g,function(m,n){return v[n]!=null?v[n]:''});
}
function render(body,faq){
 var lines=String(body||'').replace(/\r/g,'').split('\n'),out=[],list=null,open=false,para=[];
 function flushP(){if(para.length){out.push('<p>'+para.join('<br>')+'</p>');para=[]}}
 function flushL(){if(list){out.push('<ul>'+list.join('')+'</ul>');list=null}}
 function closeD(){if(open){out.push('</div></details>');open=false}}
 lines.forEach(function(L){
  var t=L.trim();
  if(t.indexOf('# ')===0){flushP();flushL();closeD();var h=e(t.slice(2));if(faq){out.push('<details><summary>'+h+'</summary><div class="ans">');open=true}else out.push('<h2>'+h+'</h2>');return}
  if(t.indexOf('- ')===0){flushP();(list=list||[]).push('<li>'+e(t.slice(2))+'</li>');return}
  if(!t){flushP();flushL();return}
  flushL();para.push(e(t));
 });
 flushP();flushL();closeD();
 return out.join('');
}
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){
 var s=r[1]||{},D=CL.pageDefaults||{},def=D[k],saved=(s.pages||{})[k];
 CL.ui.init(s,r[0]);
 var a=document.getElementById('app');a.removeAttribute('aria-busy');
 if(!def){a.innerHTML=CL.ui.header()+'<main id="main" class="wrap"><div class="section-empty"><h1 style="font-size:26px">الصفحة مش موجودة</h1><a class="btn" href="'+U.home+'">الرئيسية</a></div></main>'+CL.ui.footer();CL.ui.bind();return}
 var title=(saved&&saved.title)||def.title,body=fill((saved&&saved.body!=null)?saved.body:def.body,s);
 document.title=title+' | Catchy Lens';
 var extra='';
 if(k==='contact'){
  var wa=String(s.whatsapp||'').replace(/\D/g,'');if(wa.charAt(0)==='0')wa='2'+wa;
  var items=[];
  if(wa)items.push(['chat','واتساب','https://wa.me/'+wa,'0'+wa.slice(2)]);
  if(s.facebook)items.push(['link','فيسبوك',s.facebook,'Catchy Lens']);
  if(s.instagram)items.push(['link','إنستجرام',s.instagram,'@catchy_lens_']);
  if(s.tiktok)items.push(['link','تيك توك',s.tiktok,'@catchy.lens']);
  extra='<div class="contacts">'+items.map(function(c){return '<a class="contact" href="'+e(c[2])+'" target="_blank" rel="noopener">'+I(c[0])+'<b>'+c[1]+'</b><span dir="ltr">'+e(c[3])+'</span></a>'}).join('')+'</div>';
 }
 a.innerHTML=CL.ui.header()+'<main id="main" class="wrap prose'+(k==='faq'?' faqp':'')+'"><h1>'+e(title)+'</h1>'+render(body,k==='faq')+extra+'</main>'+CL.ui.footer();
 CL.ui.bind();
});
})();
