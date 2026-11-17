(function(){
var CL=window.CL;
/* Data adapter: the pages only call these methods.
   demo: data/demo.json. live: products+settings from Supabase (store_catalog), content/banners from demo.json until the admin dashboard exists. */
var DUR={'يومية':'daily','شهرية':'monthly','ربع سنوية':'quarterly','نصف سنوية':'semiannual','سنوية':'yearly'};
function post(path,body){
 var c=CL.config;
 return fetch(c.supabaseUrl+path,{method:'POST',headers:{'Content-Type':'application/json',apikey:c.anonKey,Authorization:'Bearer '+c.anonKey},body:JSON.stringify(body||{})})
  .then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()});
}
/* one frontend card per colour variant: id = variant id (this is what the order API expects) */
function explode(list){
 var out=[];
 (list||[]).forEach(function(p){
  (p.variants||[]).forEach(function(v){
   var imgs=(p.images||[]).slice();
   out.push({id:v.id,slug:p.slug+'-'+v.id,brand:p.brand,name:v.color||p.name,fullName:p.name,category:p.category,
    color:v.swatch||'',duration:DUR[p.duration]||p.duration||'',price:p.price,oldPrice:p.oldPrice,state:v.state,
    powerType:p.powerType,image:imgs[0]||'img/lens-box.webp',images:imgs.length?imgs:['img/lens-box.webp'],description:p.description||''});
  });
 });
 return out;
}
CL.data={
 _p:null,_l:null,
 load:function(){
  if(window.__DEMO)return Promise.resolve(window.__DEMO);
  if(!this._p)this._p=fetch(CL.config.base+'data/demo.json').then(function(r){return r.json()});
  return this._p;
 },
 live:function(){
  if(CL.config.mode!=='live')return Promise.resolve(null);
  if(!this._l)this._l=post('/rest/v1/rpc/store_catalog',{});
  return this._l;
 },
 catalog:function(){
  if(CL.config.mode!=='live')return this.load().then(function(d){return d.products});
  return this.live().then(function(d){return explode(d.products)});
 },
 settings:function(){
  var self=this;
  return this.load().then(function(d){
   if(CL.config.mode!=='live')return d.settings;
   return self.live().then(function(l){
    var s=Object.assign({},d.settings),x=l.settings||{};
    if(x.whatsapp)s.whatsapp=x.whatsapp;
    s.freeShipMin=x.free_ship_min||0;s.prepTime=x.prep_time||'';s.zones=l.zones||[];
    return s;
   });
  });
 },
 content:function(){return this.load().then(function(d){return d.content})},
 order:function(payload){
  var c=CL.config;payload.action='order';
  return fetch(c.fnUrl,{method:'POST',headers:{'Content-Type':'application/json',apikey:c.anonKey,Authorization:'Bearer '+c.anonKey},body:JSON.stringify(payload)}).then(function(r){return r.json()});
 },
 track:function(id,phone){
  var c=CL.config;
  return fetch(c.fnUrl,{method:'POST',headers:{'Content-Type':'application/json',apikey:c.anonKey,Authorization:'Bearer '+c.anonKey},body:JSON.stringify({action:'track',order:id,phone:phone})}).then(function(r){return r.json()});
 }
};
})();
