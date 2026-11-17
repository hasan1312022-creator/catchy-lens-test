(function(){
var C=window.CL.config,URL=C.supabaseUrl,KEY=C.anonKey,BUCKET='store-images';
var root=document.getElementById('root'),S={tok:null,ref:null,uid:null,tab:'products',products:[],settings:{},coupons:[],q:'',flt:'all'};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var DUR=[['','غير محدد'],['daily','يومية'],['monthly','شهرية'],['quarterly','ربع سنوية'],['semiannual','نصف سنوية'],['yearly','سنوية']];
var SW=[['','بدون'],['gray','رمادي'],['blue','أزرق'],['brown','بني'],['green','أخضر'],['hazel','هازل'],['honey','عسلي'],['lilac','بنفسجي'],['cocoa','كاكاو']];
var CAT=[['lenses','عدسات'],['care','محاليل وعناية'],['accessories','إكسسوارات']];
function opts(list,v){return list.map(function(x){return '<option value="'+esc(x[0])+'"'+(x[0]===v?' selected':'')+'>'+esc(x[1])+'</option>'}).join('')}
function msg(t,bad){var d=document.createElement('div');d.className='msg'+(bad?' err':'');d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove()},bad?5000:2200)}
function save(){try{sessionStorage.setItem('cl-adm',JSON.stringify({t:S.tok,r:S.ref,u:S.uid}))}catch(e){}}
function load(){try{var o=JSON.parse(sessionStorage.getItem('cl-adm')||'null');if(o){S.tok=o.t;S.ref=o.r;S.uid=o.u}}catch(e){}}
function hdr(extra){var h={apikey:KEY,Authorization:'Bearer '+(S.tok||KEY)};for(var k in (extra||{}))h[k]=extra[k];return h}
function refresh(){
 if(!S.ref)return Promise.reject(new Error('no-ref'));
 return fetch(URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:S.ref})})
  .then(function(r){if(!r.ok)throw new Error('refresh');return r.json()}).then(function(j){S.tok=j.access_token;S.ref=j.refresh_token;save()});
}
function api(path,o,retry){
 o=o||{};var h=hdr(o.headers);if(o.body!==undefined&&!(o.body instanceof Blob))h['Content-Type']='application/json';
 return fetch(URL+path,{method:o.method||'GET',headers:h,body:o.body instanceof Blob?o.body:(o.body!==undefined?JSON.stringify(o.body):undefined)}).then(function(r){
  if(r.status===401&&!retry)return refresh().then(function(){return api(path,o,true)});
  return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null}catch(e){}
   if(!r.ok)throw new Error((j&&(j.message||j.error||j.msg))||('http '+r.status));return j});
 });
}
/* ---------- login ---------- */
function loginView(err){
 root.innerHTML='<div class="login"><form class="card" id="lf"><h2>دخول لوحة التحكم</h2><label>البريد الإلكتروني<input name="e" type="email" autocomplete="username" dir="ltr" required></label><label>كلمة المرور<input name="p" type="password" autocomplete="current-password" dir="ltr" required></label>'+(err?'<p style="color:#a3263d;margin:0">'+esc(err)+'</p>':'')+'<button class="btn" type="submit">دخول</button><small style="color:#6a5662">لحساب الأدمن بتاع السيستم فقط.</small></form></div>';
 document.getElementById('lf').addEventListener('submit',function(ev){
  ev.preventDefault();var f=ev.target,b=f.querySelector('button');b.disabled=true;b.textContent='جاري الدخول...';
  fetch(URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:f.e.value.trim(),password:f.p.value})})
   .then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error('bad');return j})})
   .then(function(j){S.tok=j.access_token;S.ref=j.refresh_token;S.uid=j.user.id;save();return start()})
   .catch(function(){loginView('البريد أو كلمة المرور غير صحيحة.')});
 });
}
function start(){
 return api('/rest/v1/profiles?id=eq.'+S.uid+'&select=role,name').then(function(r){
  if(!r||!r[0]||r[0].role!=='admin'){S.tok=null;save();loginView('الحساب ده مش أدمن.');return}
  return loadAll().then(render);
 }).catch(function(){S.tok=null;save();loginView('انتهت الجلسة، ادخلي تاني.')});
}
function loadAll(){
 return Promise.all([
  api('/rest/v1/store_products?select=*,store_variants(id,stock_id,color_label,swatch,active,sort,images,stock(qty))&order=sort.asc,id.asc'),
  api('/rest/v1/store_settings?select=key,value'),
  api('/rest/v1/store_coupons?select=*&order=code.asc')
 ]).then(function(r){S.products=r[0]||[];S.settings={};(r[1]||[]).forEach(function(x){S.settings[x.key]=x.value});S.coupons=r[2]||[]});
}
/* ---------- shell ---------- */
function render(){
 root.innerHTML='<div class="bar"><b>Catchy Lens — لوحة التحكم</b><span class="sp"></span><button id="out">خروج</button></div><div class="tabs" role="tablist">'
  +[['products','المنتجات'],['settings','الإعدادات'],['coupons','الكوبونات']].map(function(t){return '<button role="tab" data-tab="'+t[0]+'" aria-selected="'+(S.tab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div><main id="m"></main>';
 document.getElementById('out').onclick=function(){S.tok=null;S.ref=null;save();loginView()};
 [].forEach.call(root.querySelectorAll('[data-tab]'),function(b){b.onclick=function(){S.tab=b.dataset.tab;render()}});
 ({products:productsView,settings:settingsView,coupons:couponsView})[S.tab]();
}
/* ---------- products ---------- */
function stockOf(p){return (p.store_variants||[]).reduce(function(n,v){return n+((v.stock&&v.stock.qty)||0)},0)}
function filtered(){
 return S.products.filter(function(p){
  if(S.q&&(p.name+' '+p.brand).indexOf(S.q)<0)return false;
  if(S.flt==='active')return p.active;if(S.flt==='inactive')return !p.active;if(S.flt==='noprice')return !(p.price>0);return true;
 });
}
function rows(){
 return filtered().map(function(p){
  var nv=(p.store_variants||[]).length,noimg=(p.store_variants||[]).filter(function(v){return !(v.images&&v.images.length)}).length;
  return '<tr data-id="'+p.id+'"><td><b>'+esc(p.name)+'</b><br><small>'+nv+' لون — مخزون '+stockOf(p)+'</small></td><td><select data-f="category">'+opts(CAT,p.category)+'</select></td><td><input data-f="price" type="number" min="0" step="1" value="'+(p.price||'')+'" aria-label="السعر"></td><td><input data-f="old_price" type="number" min="0" step="1" value="'+(p.old_price||'')+'" aria-label="السعر قبل الخصم"></td><td>'+(nv-noimg)+' / '+nv+' لون ليه صور</td><td><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-f="active"'+(p.active?' checked':'')+'><span class="tag '+(p.active?'on':'off')+'">'+(p.active?'ظاهر':'مخفي')+'</span></label></td><td><button class="btn sm alt" data-edit="'+p.id+'">تعديل</button> <button class="btn sm" data-save="'+p.id+'">حفظ</button></td></tr>';
 }).join('')||'<tr><td colspan="7" style="text-align:center;padding:24px">مفيش منتجات بالفلتر ده.</td></tr>';
}
function productsView(){
 var m=document.getElementById('m'),n=S.products.length,act=S.products.filter(function(p){return p.active}).length;
 m.innerHTML='<h2>المنتجات</h2><p style="margin:0 0 12px;color:#6a5662">'+n+' منتج، الظاهر منهم في الموقع: '+act+'. المنتج ما يظهرش غير لما يتحط له سعر وتفعّليه.</p><div class="tools"><input id="q" type="search" placeholder="ابحثي بالاسم أو الماركة" value="'+esc(S.q)+'"><select id="flt"><option value="all">الكل</option><option value="active">الظاهر</option><option value="inactive">المخفي</option><option value="noprice">من غير سعر</option></select></div><div class="tw"><table><thead><tr><th>المنتج</th><th>القسم</th><th>السعر (ج.م)</th><th>قبل الخصم</th><th>صور الألوان</th><th>الظهور</th><th></th></tr></thead><tbody id="tb">'+rows()+'</tbody></table></div>';
 document.getElementById('flt').value=S.flt;
 document.getElementById('q').oninput=function(e){S.q=e.target.value.trim();document.getElementById('tb').innerHTML=rows()};
 document.getElementById('flt').onchange=function(e){S.flt=e.target.value;document.getElementById('tb').innerHTML=rows()};
 document.getElementById('tb').onclick=function(e){
  var s=e.target.closest('[data-save]'),d=e.target.closest('[data-edit]');
  if(d)return editor(+d.dataset.edit);
  if(s){var tr=s.closest('tr'),p=S.products.filter(function(x){return x.id===+s.dataset.save})[0];quickSave(p,tr,s)}
 };
}
function quickSave(p,tr,btn){
 var g=function(f){return tr.querySelector('[data-f='+f+']')},price=+g('price').value||0,old=g('old_price').value===''?null:+g('old_price').value,act=g('active').checked;
 if(act&&!(price>0))return msg('لازم تحطي سعر أكبر من صفر قبل ما تظهري المنتج.',true);
 if(old!=null&&old<=price)old=null;
 btn.disabled=true;
 api('/rest/v1/store_products?id=eq.'+p.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:{price:price,old_price:old,active:act,category:g('category').value}})
  .then(function(){p.price=price;p.old_price=old;p.active=act;p.category=g('category').value;msg('اتحفظ: '+p.name);productsView()})
  .catch(function(e){msg('ما اتحفظش: '+e.message,true)}).then(function(){btn.disabled=false});
}
function editor(id){
 var p=S.products.filter(function(x){return x.id===id})[0],imgs=(p.images||[]).slice(),vs=(p.store_variants||[]).slice().sort(function(a,b){return a.sort-b.sort||a.id-b.id});
 var orig={};vs.forEach(function(v){v.images=(v.images||[]).slice();orig[v.id]=JSON.stringify([v.color_label,v.swatch,v.active,v.images])});
 var ov=document.createElement('div');ov.className='ov';
 function paint(){
  ov.innerHTML='<div class="modal" role="dialog" aria-modal="true"><h2>'+esc(p.name)+'</h2><div class="grid">'
   +'<label>الاسم الظاهر<input id="e-name" value="'+esc(p.name)+'" maxlength="160"></label><label>الماركة<input id="e-brand" value="'+esc(p.brand)+'"></label>'
   +'<label>القسم<select id="e-cat">'+opts(CAT,p.category)+'</select></label><label>المدة<select id="e-dur">'+opts(DUR,p.duration)+'</select></label>'
   +'<label>نوع القوة<select id="e-pt">'+opts([['plano','بدون قوة فقط (Plano)'],['both','Plano وبقوة نظر']],p.power_type)+'</select></label>'
   +'<label>السعر<input id="e-price" type="number" min="0" value="'+(p.price||'')+'"></label><label>السعر قبل الخصم<input id="e-old" type="number" min="0" value="'+(p.old_price||'')+'"></label>'
   +'<label>الترتيب (الأصغر الأول)<input id="e-sort" type="number" value="'+(p.sort||0)+'"></label></div>'
   +'<label style="margin-top:12px">الوصف<textarea id="e-desc" rows="4" maxlength="4000">'+esc(p.description)+'</textarea></label>'
   +'<label style="margin-top:12px">وسوم (مفصولة بفاصلة) — للاختبار واقتراح العدسة<input id="e-tags" value="'+esc((p.tags||[]).join(', '))+'"></label>'
   +'<h3>صور عامة للماركة (بتظهر بس للون اللي ملوش صور خاصة)</h3><div class="imgs">'+imgs.map(function(u,i){return '<figure><img src="'+esc(u)+'" alt="" loading="lazy">'+(i===0?'<span class="main">رئيسية</span>':'')+'<button data-rm="'+i+'" aria-label="حذف">×</button></figure>'}).join('')+'</div><div class="tools" style="margin-top:10px"><label class="btn alt sm" style="display:inline-grid;place-items:center">إضافة صور<input id="e-file" type="file" accept="image/*" multiple hidden></label><span id="up" style="color:#6a5662"></span></div>'
   +'<h3>الألوان (مربوطة بالمخزون)</h3><div class="tw"><table><thead><tr><th>اسم اللون</th><th>لون الفلتر</th><th>المخزون</th><th>ظاهر</th><th>صور اللون (الأولى رئيسية)</th></tr></thead><tbody>'+vs.map(function(v){return '<tr data-v="'+v.id+'"><td><input data-vf="color_label" value="'+esc(v.color_label)+'" style="max-width:none"></td><td><select data-vf="swatch">'+opts(SW,v.swatch)+'</select></td><td>'+((v.stock&&v.stock.qty)!=null?v.stock.qty:'—')+'</td><td><input type="checkbox" data-vf="active"'+(v.active?' checked':'')+'></td><td><div class="imgs vi">'+v.images.map(function(u,i){return '<figure style="width:64px"><img style="width:64px;height:64px" src="'+esc(u)+'" alt="" loading="lazy"><button data-vrm="'+v.id+':'+i+'" aria-label="حذف">\u00d7</button></figure>'}).join('')+'</div><label class="btn alt sm" style="display:inline-grid;place-items:center;margin-top:6px">إضافة صور<input type="file" accept="image/*" multiple hidden data-vfile="'+v.id+'"></label></td></tr>'}).join('')+'</tbody></table></div>'
   +'<div class="tools" style="margin-top:16px"><button class="btn" id="e-save">حفظ</button><button class="btn alt" id="e-close">إغلاق</button></div></div>';
  ov.querySelector('#e-close').onclick=function(){ov.remove();productsView()};
  ov.querySelector('#e-save').onclick=doSave;
  ov.querySelector('#e-file').onchange=upload;
  [].forEach.call(ov.querySelectorAll('[data-vfile]'),function(i){i.onchange=function(ev){vupload(+i.dataset.vfile,ev)}});
  [].forEach.call(ov.querySelectorAll('[data-vrm]'),function(b){b.onclick=function(){var a=b.dataset.vrm.split(':'),v=vs.filter(function(x){return x.id===+a[0]})[0];readIn();var u=v.images.splice(+a[1],1)[0];paint();rmFile(u)}});
  [].forEach.call(ov.querySelectorAll('[data-rm]'),function(b){b.onclick=function(){var u=imgs.splice(+b.dataset.rm,1)[0];readIn();paint();rmFile(u)}});
 }
 function readVars(){[].forEach.call(ov.querySelectorAll('[data-v]'),function(tr){var v=vs.filter(function(x){return x.id===+tr.dataset.v})[0];v.color_label=tr.querySelector('[data-vf=color_label]').value;v.swatch=tr.querySelector('[data-vf=swatch]').value;v.active=tr.querySelector('[data-vf=active]').checked})}
 function rmFile(u){if(u&&u.indexOf('/public/'+BUCKET+'/')>0)api('/storage/v1/object/'+BUCKET+'/'+decodeURIComponent(u.split('/public/'+BUCKET+'/')[1]),{method:'DELETE'}).catch(function(){})}
 function readIn(){readVars();
  var g=function(i){var e=ov.querySelector(i);return e?e.value:null};
  if(g('#e-name')!=null){p.name=g('#e-name').trim();p.brand=g('#e-brand').trim();p.category=g('#e-cat');p.duration=g('#e-dur');p.power_type=g('#e-pt');p.price=+g('#e-price')||0;p.old_price=g('#e-old')===''?null:+g('#e-old');p.sort=+g('#e-sort')||0;p.description=g('#e-desc');p.tags=g('#e-tags').split(',').map(function(x){return x.trim()}).filter(Boolean)}
 }
 function resize(file){
  return createImageBitmap(file).then(function(bm){var r=Math.min(1,1200/Math.max(bm.width,bm.height)),c=document.createElement('canvas');c.width=Math.round(bm.width*r);c.height=Math.round(bm.height*r);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);return new Promise(function(ok){c.toBlob(ok,'image/webp',0.82)})});
 }
function vupload(id,ev){
  var files=[].slice.call(ev.target.files);if(!files.length)return;readIn();var v=vs.filter(function(x){return x.id===id})[0],n=0;
  files.reduce(function(pr,f){return pr.then(function(){return resize(f).then(function(b){var path='v'+id+'/'+Date.now()+'-'+(++n)+'.webp';return api('/storage/v1/object/'+BUCKET+'/'+path,{method:'POST',headers:{'Content-Type':'image/webp','x-upsert':'false'},body:b}).then(function(){v.images.push(URL+'/storage/v1/object/public/'+BUCKET+'/'+path)})})})},Promise.resolve())
   .then(function(){paint()}).catch(function(e){msg('فشل رفع الصورة: '+e.message,true)});
 }
 function upload(ev){
  var files=[].slice.call(ev.target.files);if(!files.length)return;readIn();var up=ov.querySelector('#up'),n=0;
  files.reduce(function(pr,f){return pr.then(function(){up.textContent='جاري رفع '+(++n)+' من '+files.length+'...';return resize(f).then(function(b){var path='p'+p.id+'/'+Date.now()+'-'+n+'.webp';return api('/storage/v1/object/'+BUCKET+'/'+path,{method:'POST',headers:{'Content-Type':'image/webp','x-upsert':'false'},body:b}).then(function(){imgs.push(URL+'/storage/v1/object/public/'+BUCKET+'/'+path)})})})},Promise.resolve())
   .then(function(){paint()}).catch(function(e){up.textContent='';msg('فشل رفع الصورة: '+e.message,true)});
 }
 function doSave(){
  readIn();
  if(p.active&&!(p.price>0))return msg('المنتج ظاهر ومن غير سعر. حطي سعر أو أخفيه.',true);
  if(p.old_price!=null&&p.old_price<=p.price)p.old_price=null;
  var b=ov.querySelector('#e-save');b.disabled=true;
  var vrows=[].slice.call(ov.querySelectorAll('[data-v]'));
  api('/rest/v1/store_products?id=eq.'+p.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:{name:p.name,brand:p.brand,category:p.category,duration:p.duration,power_type:p.power_type,price:p.price,old_price:p.old_price,sort:p.sort,description:p.description,tags:p.tags,images:imgs}})
   .then(function(){p.images=imgs;return Promise.all(vrows.map(function(tr){
     var v=vs.filter(function(x){return x.id===+tr.dataset.v})[0],cl=(v.color_label||'').trim()||v.color_label;
     var sig=JSON.stringify([v.color_label,v.swatch,v.active,v.images]);if(sig===orig[v.id])return null;
     return api('/rest/v1/store_variants?id=eq.'+v.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:{color_label:cl,swatch:v.swatch,active:v.active,images:v.images}}).then(function(){orig[v.id]=sig});
   }))}).then(function(){msg('اتحفظ');paint()}).catch(function(e){msg('ما اتحفظش: '+e.message,true)}).then(function(){b.disabled=false});
 }
 document.body.appendChild(ov);paint();
}
/* ---------- settings ---------- */
var SET=[['announcement','نص الشريط العلوي','text'],['free_ship_min','الحد الأدنى للشحن المجاني (ج.م) — 0 معناه مفيش شحن مجاني','number'],['prep_time','مدة التجهيز (تظهر للعميلة)','text'],['whatsapp','رقم واتساب (بصيغة 2010xxxxxxxx من غير +)','text']];
function settingsView(){
 var m=document.getElementById('m');
 m.innerHTML='<h2>الإعدادات</h2><form class="card" id="sf" style="display:grid;gap:14px;max-width:560px">'+SET.map(function(s){var v=S.settings[s[0]];return '<label>'+esc(s[1])+'<input name="'+s[0]+'" type="'+s[2]+'" '+(s[2]==='number'?'min="0" ':'')+'value="'+esc(v==null?'':v)+'"></label>'}).join('')+'<button class="btn" type="submit">حفظ الإعدادات</button></form>';
 document.getElementById('sf').onsubmit=function(ev){
  ev.preventDefault();var f=ev.target,btn=f.querySelector('button'),body=SET.map(function(s){var v=f.elements[s[0]].value.trim();return {key:s[0],value:s[2]==='number'?(+v||0):v,public:true}});
  btn.disabled=true;
  api('/rest/v1/store_settings?on_conflict=key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:body}).then(function(){body.forEach(function(x){S.settings[x.key]=x.value});msg('اتحفظت الإعدادات')}).catch(function(e){msg('ما اتحفظش: '+e.message,true)}).then(function(){btn.disabled=false});
 };
}
/* ---------- coupons ---------- */
function couponsView(){
 var m=document.getElementById('m');
 m.innerHTML='<h2>الكوبونات</h2><form class="card grid" id="cf"><label>الكود<input name="code" required dir="ltr" style="text-transform:uppercase" maxlength="30"></label><label>النوع<select name="kind"><option value="percent">نسبة %</option><option value="fixed">مبلغ ثابت</option></select></label><label>القيمة<input name="value" type="number" min="1" required></label><label>أقل إجمالي للطلب<input name="min_total" type="number" min="0" value="0"></label><label>أقصى عدد استخدامات (فاضي = مفتوح)<input name="max_uses" type="number" min="1"></label><label>ينتهي في (اختياري)<input name="expires_at" type="date"></label><div style="display:flex;align-items:end"><button class="btn" type="submit">إضافة كوبون</button></div></form>'
  +'<div class="tw"><table><thead><tr><th>الكود</th><th>الخصم</th><th>أقل إجمالي</th><th>الاستخدام</th><th>ينتهي</th><th>الحالة</th><th></th></tr></thead><tbody>'+(S.coupons.map(function(c){return '<tr><td dir="ltr"><b>'+esc(c.code)+'</b></td><td>'+(c.kind==='percent'?esc(c.value)+'%':esc(c.value)+' ج.م')+'</td><td>'+esc(c.min_total)+'</td><td>'+esc(c.used)+(c.max_uses?' / '+esc(c.max_uses):'')+'</td><td>'+(c.expires_at?esc(c.expires_at.slice(0,10)):'—')+'</td><td><span class="tag '+(c.active?'on':'off')+'">'+(c.active?'شغال':'موقوف')+'</span></td><td><button class="btn sm alt" data-tg="'+esc(c.code)+'">'+(c.active?'إيقاف':'تشغيل')+'</button> <button class="btn sm alt" data-dl="'+esc(c.code)+'">حذف</button></td></tr>'}).join('')||'<tr><td colspan="7" style="text-align:center;padding:20px">مفيش كوبونات.</td></tr>')+'</tbody></table></div>';
 document.getElementById('cf').onsubmit=function(ev){
  ev.preventDefault();var f=ev.target,b={code:f.code.value.trim().toUpperCase(),kind:f.kind.value,value:+f.value.value,min_total:+f.min_total.value||0,max_uses:f.max_uses.value?+f.max_uses.value:null,expires_at:f.expires_at.value?f.expires_at.value+'T23:59:59+02:00':null,active:true};
  if(b.kind==='percent'&&b.value>100)return msg('النسبة لازم تكون 100 أو أقل.',true);
  api('/rest/v1/store_coupons',{method:'POST',headers:{Prefer:'return=representation'},body:b}).then(function(r){S.coupons.push(r[0]);S.coupons.sort(function(a,b){return a.code<b.code?-1:1});msg('اتضاف الكوبون');couponsView()}).catch(function(e){msg('ما اتضافش: '+e.message,true)});
 };
 m.onclick=function(e){
  var t=e.target.closest('[data-tg]'),d=e.target.closest('[data-dl]');
  if(t){var c=S.coupons.filter(function(x){return x.code===t.dataset.tg})[0];api('/rest/v1/store_coupons?code=eq.'+encodeURIComponent(c.code),{method:'PATCH',headers:{Prefer:'return=minimal'},body:{active:!c.active}}).then(function(){c.active=!c.active;couponsView()}).catch(function(e){msg(e.message,true)})}
  if(d&&confirm('تحذفي الكوبون '+d.dataset.dl+'؟'))api('/rest/v1/store_coupons?code=eq.'+encodeURIComponent(d.dataset.dl),{method:'DELETE',headers:{Prefer:'return=minimal'}}).then(function(){S.coupons=S.coupons.filter(function(x){return x.code!==d.dataset.dl});couponsView()}).catch(function(e){msg(e.message,true)});
 };
}
/* ---------- boot ---------- */
load();
if(S.tok&&S.uid)start();else loginView();
})();
