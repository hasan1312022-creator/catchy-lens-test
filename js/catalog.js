(function(){
var CL=window.CL,U=CL.url,I=CL.icon,e=CL.esc,PAGE=8;
var DUR={daily:'يومية',monthly:'شهرية',quarterly:'٣ شهور',semiannual:'٦ شهور',yearly:'سنوية'};
var CAT={'':'كل المنتجات',lenses:'اكتشفي عدستك',care:'المحاليل والتعقيم',accessories:'الإكسسوارات'};
var AV=[['in','متوفر'],['low','كمية قليلة'],['pre','بالطلب'],['out','نفد المخزون']];
var TYPE=[['plano','Plano'],['both','Plano & Power']];
var ARR=['brand','color','type','dur','avail'];
var P=[],S={},st,CATL;
function parse(){
 var q=new URLSearchParams(CL.qs()),o={brand:[],color:[],type:[],dur:[],avail:[],minp:'',maxp:'',q:'',sort:'rec',n:PAGE,category:'',focus:q.get('focus')||''};
 ARR.forEach(function(k){o[k]=q.getAll(k).filter(Boolean)});
 ['minp','maxp','q','sort','category'].forEach(function(k){if(q.get(k))o[k]=q.get(k)});
 if(!CAT.hasOwnProperty(o.category))o.category='';
 return o;
}
function sync(){
 var q=new URLSearchParams();
 ARR.forEach(function(k){st[k].forEach(function(v){q.append(k,v)})});
 ['minp','maxp','q'].forEach(function(k){if(st[k])q.set(k,st[k])});
 if(st.sort!=='rec')q.set('sort',st.sort);if(st.category)q.set('category',st.category);
 var s=q.toString();try{history.replaceState(null,'',location.pathname+(s?'?'+s:''))}catch(x){}
}
function has(k,v){return st[k].indexOf(v)>-1}
function inCat(){return P.filter(function(p){return !st.category||p.category===st.category})}
function filtered(){
 var q=st.q.trim().toLowerCase(),mn=parseFloat(st.minp),mx=parseFloat(st.maxp);
 var l=inCat().filter(function(p){
  if(st.brand.length&&st.brand.indexOf(p.brand)<0)return false;
  if(st.color.length&&st.color.indexOf(p.color)<0)return false;
  if(st.dur.length&&st.dur.indexOf(p.duration)<0)return false;
  if(st.avail.length&&st.avail.indexOf(p.state)<0)return false;
  if(st.type.length&&st.type.indexOf(p.powerType)<0)return false;
  if(q&&(p.name+' '+p.brand).toLowerCase().indexOf(q)<0)return false;
  if(!isNaN(mn)&&(p.price==null||p.price<mn))return false;
  if(!isNaN(mx)&&(p.price==null||p.price>mx))return false;
  return true});
 if(st.sort==='new')l=l.slice().sort(function(a,b){return b.id-a.id});
 if(st.sort==='plow')l=l.slice().sort(function(a,b){return (a.price==null)-(b.price==null)||a.price-b.price});
 if(st.sort==='phigh')l=l.slice().sort(function(a,b){return (a.price==null)-(b.price==null)||b.price-a.price});
 return l;
}
function uniq(f){var o=[];inCat().forEach(function(p){var v=f(p);if(v&&o.indexOf(v)<0)o.push(v)});return o}
function group(title,key,opts){
 if(!opts.length)return '';
 return '<fieldset class="fgroup"><legend>'+title+'</legend>'+opts.map(function(o){var id='f-'+key+'-'+o[0];return '<label class="fopt" for="'+e(id)+'"><input type="checkbox" id="'+e(id)+'" data-f="'+key+'" value="'+e(o[0])+'"'+(has(key,o[0])?' checked':'')+'><span>'+e(o[1])+'</span></label>'}).join('')+'</fieldset>';
}
function filters(){
 var priced=P.some(function(p){return p.price!=null}),lens=!st.category||st.category==='lenses';
 var brands=uniq(function(p){return p.brand}).map(function(b){return [b,b]});
 var colors=uniq(function(p){return p.color}).map(function(c){return [c,(S.colorLabels||{})[c]||c]});
 var durs=Object.keys(DUR).filter(function(k){return inCat().some(function(p){return p.duration===k})}).map(function(k){return [k,DUR[k]]});
 return '<aside class="filters" id="filters" aria-label="الفلاتر"><div class="f-head"><h2>فلتر المنتجات</h2><button type="button" class="textlink" data-clear>مسح الكل</button><button type="button" class="x" data-fclose aria-label="إغلاق الفلتر">×</button></div>'
  +group('الماركة','brand',brands)+(lens?group('اللون','color',colors)+group('مدة الاستخدام','dur',durs)+group('النوع','type',TYPE):'')
  +(priced?'<fieldset class="fgroup"><legend>السعر (ج.م)</legend><div class="two"><label>من<input type="number" inputmode="numeric" min="0" data-p="minp" value="'+e(st.minp)+'"></label><label>إلى<input type="number" inputmode="numeric" min="0" data-p="maxp" value="'+e(st.maxp)+'"></label></div></fieldset>':'')
  +group('التوفر','avail',AV)
  +'<div class="f-foot"><button type="button" class="btn" data-fclose>عرض النتائج (<span data-count></span>)</button></div></aside>';
}
function chips(){
 var c=[];
 ARR.forEach(function(k){st[k].forEach(function(v){var lab=k==='color'?((S.colorLabels||{})[v]||v):k==='dur'?DUR[v]:k==='avail'?(CL.state[v]):k==='type'?(v==='both'?'Plano & Power':'Plano'):v;c.push('<button type="button" class="chip" data-rm="'+k+'|'+e(v)+'">'+e(lab)+' <span aria-hidden="true">×</span><span class="sr">إزالة</span></button>')})});
 if(st.q)c.push('<button type="button" class="chip" data-rm="q|">بحث: '+e(st.q)+' <span aria-hidden="true">×</span><span class="sr">إزالة</span></button>');
 return c.length?'<div class="chips" aria-label="الفلاتر المطبّقة">'+c.join('')+'<button type="button" class="textlink" data-clear>مسح الكل</button></div>':'';
}
function results(){
 var l=filtered(),sh=l.slice(0,st.n);
 var body=!l.length?'<div class="section-empty">'+I('lens')+'<h3>مفيش نتايج بالفلاتر دي</h3><p>جرّبي تقلّلي الفلاتر أو تغيّري البحث.</p><button type="button" class="btn" data-clear>مسح الكل</button></div>'
  :'<div class="products">'+sh.map(CL.ui.card).join('')+'</div>'+(sh.length<l.length?'<div class="more"><button type="button" class="btn alt" data-more>عرض المزيد</button></div>':'');
 return {html:body,count:l.length,shown:sh.length};
}
function paint(keepFocus){
 var r=results();
 document.getElementById('results').innerHTML=r.html;
 document.getElementById('chips').innerHTML=chips();
 document.getElementById('count').textContent=r.count+' منتج';
 document.getElementById('live').textContent=r.count?'تم عرض '+r.shown+' من '+r.count+' منتج':'مفيش نتايج';
 document.querySelectorAll('[data-count]').forEach(function(x){x.textContent=r.count});
 var fb=document.querySelector('[data-open-filters] .n');if(fb){var n=ARR.reduce(function(a,k){return a+st[k].length},0)+(st.minp?1:0)+(st.maxp?1:0);fb.textContent=n?'('+n+')':''}
 sync();
}
function page(){
 var priced=P.some(function(p){return p.price!=null});
 return '<div class="wrap catalog"><h1 class="cat-title">'+CAT[st.category]+'</h1>'
  +'<div class="toolbar"><button type="button" class="btn alt" data-open-filters>فلتر <span class="n"></span></button><label class="search"><span class="sr">ابحثي بالاسم</span><input type="search" id="q" placeholder="ابحثي بالاسم أو الماركة" value="'+e(st.q)+'"></label><label class="sort"><span>الترتيب</span><select id="sort"><option value="rec">المقترحة</option><option value="new">الأحدث</option>'+(priced?'<option value="plow">السعر: الأقل</option><option value="phigh">السعر: الأعلى</option>':'')+'</select></label></div>'
  +'<div class="meta"><span id="count"></span><span id="live" class="sr" aria-live="polite"></span></div><div id="chips"></div>'
  +'<div class="shop">'+filters()+'<div id="results"></div></div></div>';
}
function bind(){
 var fl=document.getElementById('filters'),last=null;
 function open(){last=document.activeElement;fl.classList.add('open');document.documentElement.classList.add('lock');var f=fl.querySelector('input,button');if(f)f.focus()}
 function close(){fl.classList.remove('open');document.documentElement.classList.remove('lock');if(last&&last.focus)last.focus()}
 document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.closest('[data-open-filters]'))return open();
  if(t.closest('[data-fclose]'))return close();
  if(t.closest('[data-clear]')){ARR.forEach(function(k){st[k]=[]});st.minp=st.maxp=st.q='';st.n=PAGE;document.getElementById('q').value='';fl.querySelectorAll('input[type=checkbox]').forEach(function(x){x.checked=false});fl.querySelectorAll('[data-p]').forEach(function(x){x.value=''});return paint()}
  var rm=t.closest('[data-rm]');if(rm){var a=rm.dataset.rm.split('|');if(a[0]==='q'){st.q='';document.getElementById('q').value=''}else{st[a[0]]=st[a[0]].filter(function(v){return v!==a[1]});var cb=fl.querySelector('[data-f="'+a[0]+'"][value="'+a[1]+'"]');if(cb)cb.checked=false}st.n=PAGE;return paint()}
  if(t.closest('[data-more]')){st.n+=PAGE;var before=document.querySelectorAll('.products .card').length;paint();var c=document.querySelectorAll('.products .card a.photo')[before];if(c)c.focus()}
 });
 document.addEventListener('change',function(ev){
  var t=ev.target;
  if(t.dataset.f){var k=t.dataset.f,v=t.value,i=st[k].indexOf(v);if(t.checked&&i<0)st[k].push(v);if(!t.checked&&i>-1)st[k].splice(i,1);st.n=PAGE;paint()}
  if(t.id==='sort'){st.sort=t.value;paint()}
 });
 var tm;document.addEventListener('input',function(ev){
  var t=ev.target;clearTimeout(tm);
  if(t.id==='q'){tm=setTimeout(function(){st.q=t.value;st.n=PAGE;paint()},180)}
  if(t.dataset.p){tm=setTimeout(function(){st[t.dataset.p]=t.value;st.n=PAGE;paint()},300)}
 });
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&fl.classList.contains('open'))close()});
 document.getElementById('sort').value=st.sort;
}
function error(){document.getElementById('app').innerHTML='<div class="wrap"><div class="section-empty">'+I('lens')+'<h3>حصلت مشكلة في تحميل المنتجات</h3><p>اتأكدي من الاتصال وجرّبي تاني.</p><button type="button" class="btn" onclick="location.reload()">حاولي تاني</button></div></div>'}
Promise.all([CL.data.catalog(),CL.data.settings()]).then(function(r){
 P=r[0];S=r[1];CL.ui.init(S,P);st=parse();
 document.title=CAT[st.category]+' | Catchy Lens';
 var app=document.getElementById('app');app.removeAttribute('aria-busy');
 app.innerHTML=CL.ui.header()+'<main id="main">'+page()+'</main>'+CL.ui.footer();
 CL.ui.bind();bind();paint();
 if(st.focus==='q')document.getElementById('q').focus();
}).catch(error);
})();
