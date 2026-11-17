/* Catchy Lens runtime config. TEST project values (publishable key is public by design).
   mode: 'demo' = data/demo.json only | 'live' = products/settings from Supabase, banners/content still from demo.json */
(function(){
var CL=window.CL;
CL.config.mode='live';
CL.config.supabaseUrl='https://hmmcqbxgsxowewtxifib.supabase.co';
CL.config.anonKey='sb_publishable_UzZY5mzEr0P8ckELfHDKcQ_bYXS9bl_';
CL.config.fnUrl=CL.config.supabaseUrl+'/functions/v1/store-api';
})();
