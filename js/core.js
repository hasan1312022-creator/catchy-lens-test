(function(){
var CL=window.CL=window.CL||{};
CL.config={mode:'demo',base:''};
CL.qs=function(){return location.search};
CL.asset=function(p){if(/^https?:\/\//.test(p))return p;var a=window.__ASSETS;return a&&a[p]?a[p]:CL.config.base+'assets/'+p};
CL.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
CL.num=function(n){return new Intl.NumberFormat('en-US').format(n)};
CL.money=function(n){return n==null?'\u2014 \u062c.\u0645':CL.num(n)+' \u062c.\u0645'};
CL.icons={pause:'M9 5v14M15 5v14',menu:'M4 6h16M4 12h16M4 18h16',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',filter:'M3 6h18M3 12h18M3 18h18M7 3v6M17 9v6M10 15v6',heart:'M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3a5 5 0 0 0 0-7.1',bag:'M5 7h14l2 14H3L5 7zM8 7V5a4 4 0 0 1 8 0v2',user:'M20 21v-2a8 8 0 0 0-16 0v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',lens:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M6 12a6 6 0 0 1 6-6',truck:'M1 4h13v13H1zM14 9h5l4 5v3h-9M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',return:'M4 5v6h6M4 11a8 8 0 1 1 1 7',close:'M6 6l12 12M18 6 6 18',check:'M4 12l5 5L20 6',chat:'M21 11a9 9 0 0 1-9 9H4l-3 3 1-7A9 9 0 1 1 21 11M7 8c1 4 3 6 7 7l2-2-3-2-1 1-2-2 1-1-2-3z',play:'M8 4l13 8-13 8z'};
CL.icon=function(k){return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(CL.icons[k]||CL.icons.eye)+'"/></svg>'};
CL.state={in:'\u0645\u062a\u0648\u0641\u0631',low:'\u0643\u0645\u064a\u0629 \u0642\u0644\u064a\u0644\u0629',out:'\u0646\u0641\u062f \u0627\u0644\u0645\u062e\u0632\u0648\u0646',pre:'\u0628\u0627\u0644\u0637\u0644\u0628'};
CL.dims={"img/hero-desktop.webp": [2400, 1000], "img/hero-mobile.webp": [1080, 1350], "img/brand-video-cover.webp": [1920, 1080], "img/lens-quiz.webp": [1200, 800], "img/offers-desktop.webp": [1600, 600], "img/offers-mobile.webp": [1080, 800], "img/new-arrivals-desktop.webp": [1600, 600], "img/new-arrivals-mobile.webp": [1080, 800], "img/catchy-moments-01.webp": [1080, 1920], "img/catchy-moments-02.webp": [1080, 1920], "img/catchy-moments-03.webp": [1080, 1920], "img/lens-box.webp": [1536, 1024], "img/eye-honey.webp": [800, 800], "img/eye-green.webp": [800, 800], "img/eye-blue.webp": [800, 800], "img/eye-gray.webp": [800, 800], "img/eye-brown.webp": [800, 800], "img/eye-hazel.webp": [800, 800], "img/eye-lilac.webp": [800, 800], "img/eye-cocoa.webp": [800, 800]};
CL.store={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
CL.wish={list:function(){return CL.store.get('cl-wish',[])},has:function(id){return this.list().indexOf(id)>-1},toggle:function(id){var l=this.list(),i=l.indexOf(id);if(i>-1)l.splice(i,1);else l.push(id);CL.store.set('cl-wish',l);return i<0}};
CL.cart={
 items:function(){return CL.store.get('cl-cart',[])},
 count:function(){return this.items().reduce(function(n,i){return n+(i.q||0)},0)},
 add:function(it){var l=this.items(),k=[it.id,it.plano?1:0,it.r||'',it.l||''].join('|'),f=l.filter(function(x){return [x.id,x.plano?1:0,x.r||'',x.l||''].join('|')===k})[0];if(f)f.q=Math.min(10,(f.q||0)+(it.q||1));else{it.q=it.q||1;l.push(it)}CL.store.set('cl-cart',l);this.refresh()},
 refresh:function(){var n=this.count();document.querySelectorAll('[data-cartlink]').forEach(function(a){var b=a.querySelector('.count');if(n){if(!b){b=document.createElement('span');b.className='count';a.appendChild(b)}b.textContent=n}else if(b)b.remove()})}
};
CL.toast=function(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.className='show';clearTimeout(CL._t);CL._t=setTimeout(function(){t.className=''},2400)};
})();
