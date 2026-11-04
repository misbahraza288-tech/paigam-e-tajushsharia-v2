
/* Data layer. DEMO mode = localStorage (no backend, clearly bannered).
   LIVE mode = Supabase REST + Auth (needs config.js filled and supabase/schema.sql run).
   Writes from the public site are limited to inserts (messages, comments, quiz attempts); the admin does the rest. */
(function(){
  const KEY = 'tajv2.demo.v1';
  const TABLES = ['books','paigham','updates','gallery','quizzes','messages','comments','attempts'];
  const cfg = window.TAJ_CONFIG || {};
  const LIVE = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.DEMO);

  function seedData(){
    const seed = JSON.parse(JSON.stringify(window.TAJ_SEED));
    seed.books = (window.TAJ_BOOKS || []).map((g,i)=>Object.assign({id:'b'+i}, g));
    const d = {site: seed.site, books: seed.books, paigham: seed.paigham, updates: seed.updates, gallery: seed.gallery, quizzes: seed.quizzes, messages: [], comments: seed.comments, attempts: seed.attempts};
    return d;
  }
  function arrFromObj(o){ return Object.keys(o||{}).map(k=>Object.assign({id:k, date:k}, o[k])); }
  function objFromArr(a){ const o={}; a.forEach(x=>{ const {id, ...rest}=x; o[id]=rest; }); return o; }

  // ---------- DEMO ----------
  function demoRead(){
    try{ const raw = localStorage.getItem(KEY); if(raw) return JSON.parse(raw); }catch(e){}
    const d = seedData(); localStorage.setItem(KEY, JSON.stringify(d)); return d;
  }
  function demoWrite(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

  // ---------- LIVE ----------
  function h(){ const t = sessionStorage.getItem('tajv2.token'); return {apikey: cfg.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + (t || cfg.SUPABASE_ANON_KEY), 'Content-Type':'application/json'}; }
  async function rest(method, table, body, q){
    const url = cfg.SUPABASE_URL.replace(/\/$/,'') + '/rest/v1/' + table + (q||'');
    const r = await fetch(url, {method, headers: Object.assign(h(), method==='POST'?{Prefer:'resolution=merge-duplicates,return=minimal'}:{}), body: body?JSON.stringify(body):undefined});
    if(!r.ok) throw new Error(table+' '+r.status+' '+(await r.text()).slice(0,200));
    const t = await r.text(); return t ? JSON.parse(t) : null;
  }
  async function liveRead(){
    const d = seedData();
    const site = await rest('GET','site',null,'?id=eq.main&select=data');
    if(site && site[0]) d.site = Object.assign(d.site, site[0].data);
    for(const t of ['books','paigham','updates','gallery','quizzes','comments']){
      try{ const rows = await rest('GET', t, null, '?select=id,data&order=created_at.desc&limit=2000');
        d[t] = (rows||[]).map(r=>Object.assign({id:r.id}, r.data));
      }catch(e){ console.warn(e); }
    }
    // visitors read the leaderboard VIEW (first name + score only); the owner reads the full attempts table (phone, address)
    try{
      if(sessionStorage.getItem('tajv2.admin')==='1'){ const rows = await rest('GET','attempts',null,'?select=id,data&order=created_at.desc&limit=2000'); d.attempts=(rows||[]).map(r=>Object.assign({id:r.id}, r.data)); }
      else { const rows = await rest('GET','leaderboard',null,'?select=name,score,created&limit=200'); d.attempts=(rows||[]).map((r,i)=>Object.assign({id:'lb'+i}, r)); }
    }catch(e){ console.warn(e); d.attempts=[]; }
    if(d.books.length===0) d.books = seedData().books;
    return d;
  }

  const Store = {
    live: LIVE,
    async load(){ return LIVE ? liveRead() : demoRead(); },
    // upsert one row of a table
    async save(table, row){
      if(LIVE){ const {id, ...rest} = row; const rid = String(id || ('r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)));
        await rest('POST', table, [{id: rid, data: rest}]); return rid; }
      const d = demoRead(); const id = row.id || ('r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
      const arr = d[table]; if(table==='paigham'){ d.paigham[row.date] = Object.assign({}, row, {date:undefined, id:undefined}); demoWrite(d); return row.date; }
      if(table==='quizzes'){ d.quizzes[row.date] = Object.assign({}, row, {date:undefined, id:undefined}); demoWrite(d); return row.date; }
      const i = arr.findIndex(x=>x.id===id); const obj = Object.assign({}, row, {id});
      if(i>=0) arr[i]=obj; else arr.unshift(obj); demoWrite(d); return id;
    },
    async remove(table, id){
      if(LIVE){ await rest('DELETE', table, null, '?id=eq.'+encodeURIComponent(id)); return; }
      const d = demoRead(); if(table==='paigham'||table==='quizzes'){ delete d[table][id]; } else d[table] = d[table].filter(x=>x.id!==id); demoWrite(d);
    },
    async saveSite(patch){
      if(LIVE){ const cur = await rest('GET','site',null,'?id=eq.main&select=data'); const data = Object.assign({}, (cur&&cur[0]&&cur[0].data)||{}, patch); await rest('POST','site',[{id:'main', data}]); return data; }
      const d = demoRead(); d.site = Object.assign({}, d.site, patch); demoWrite(d); return d.site;
    },
    // public submissions (insert only)
    async submit(table, row){
      const rid = 'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
      if(LIVE){ await rest('POST', table, [{id:rid, data: Object.assign({}, row, {status: row.status||'pending'})}]); return rid; }
      const d = demoRead(); d[table].unshift(Object.assign({id:rid}, row)); demoWrite(d); return rid;
    },
    async resetDemo(){ localStorage.removeItem(KEY); },
    exportDemo(){ return demoRead(); },
    async login(email, password){
      if(!LIVE){ if(email==='demo' && password==='demo'){ sessionStorage.setItem('tajv2.admin','1'); return {ok:true, demo:true}; } return {ok:false, msg:'Demo login galat hai. Demo: demo / demo'}; }
      const r = await fetch(cfg.SUPABASE_URL.replace(/\/$/,'')+'/auth/v1/token?grant_type=password', {method:'POST', headers:{apikey:cfg.SUPABASE_ANON_KEY,'Content-Type':'application/json'}, body: JSON.stringify({email, password})});
      const j = await r.json().catch(()=>({})); if(!r.ok || !j.access_token) return {ok:false, msg:'Login nahi hua. Email/password check karein.'};
      sessionStorage.setItem('tajv2.token', j.access_token); sessionStorage.setItem('tajv2.admin','1'); return {ok:true};
    },
    logout(){ sessionStorage.removeItem('tajv2.token'); sessionStorage.removeItem('tajv2.admin'); },
    isAdmin(){ return sessionStorage.getItem('tajv2.admin') === '1'; },
    // per-device preferences (never leave the device)
    prefs(){ try{ return JSON.parse(localStorage.getItem('tajv2.prefs')||'{}'); }catch(e){ return {}; } },
    setPrefs(p){ localStorage.setItem('tajv2.prefs', JSON.stringify(Object.assign(this.prefs(), p))); }
  };
  window.TajStore = Store;
  window.TAJ_TABLES = TABLES;
  window.TajUtil = { arrFromObj, objFromArr };
})();
