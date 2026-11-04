
/* Admin panel. Demo: demo / demo (bannered). Live: Supabase email + password (owner's own account, listed in admin_users). */
(function(){
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I=(n,c)=>window.ico(n,c);
const todayKey=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
const addDays=(k,n)=>{ const d=new Date(k+'T12:00:00+05:30'); d.setDate(d.getDate()+n); return d.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}); };
const cfg=window.TAJ_CONFIG||{};
let D=null, tab='dash';
const toast=m=>{ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'),2400); };
const ytId=u=>{ const m=String(u||'').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m?m[1]:''; };

function loginView(){
  $('#adm-root').innerHTML = `<div class="adm-login"><div class="adm-card fade-up in">
    <div class="eyebrow">Admin</div><h2 style="margin-bottom:6px">Login</h2>
    <p class="small muted">${TajStore.live?'Owner ka email aur password.':'<span class="sample">DEMO MODE — not secure</span> Demo login: demo / demo'}</p>
    <form id="lf"><div class="field"><span>ID / Email</span><input class="in" name="email" required autocomplete="username"></div>
    <div class="field"><span>Password</span><input class="in" type="password" name="password" required autocomplete="current-password"></div>
    <p class="draft" id="lm"></p><button class="btn" style="width:100%">Login</button></form>
    <p class="small muted" style="margin-top:14px"><a href="index.html">Website par wapas</a></p></div></div>`;
  $('#lf').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); const r=await TajStore.login(f.get('email'),f.get('password')); if(r.ok) start(); else $('#lm').textContent=r.msg; };
}
async function start(){ if(!TajStore.isAdmin()){ loginView(); return; } D = await TajStore.load(); D.site=Object.assign({}, TAJ_SEED.site, D.site||{}); D.site.sections=D.site.sections||{}; D.site.sizes=D.site.sizes||{mobile:100,desktop:100}; D.site.texts=D.site.texts||{}; D.site.links=D.site.links||{}; D.site.youtube=Object.assign({url:'',title:'',thumb:''}, D.site.youtube||{}); D.site.taawun=Object.assign({}, TAJ_SEED.site.taawun, D.site.taawun||{}); D.site.about=Object.assign({}, TAJ_SEED.site.about, D.site.about||{}); D.site.tawwun=Object.assign({}, TAJ_SEED.site.tawwun, D.site.tawwun||{}); D.books=(D.books&&D.books.length)?D.books:(window.TAJ_BOOKS||[]).map((g,i)=>Object.assign({id:'b'+i},g)); D.paigham=D.paigham||{}; D.quizzes=D.quizzes||{}; D.updates=D.updates||[]; D.gallery=D.gallery||[]; D.messages=D.messages||[]; D.comments=D.comments||[]; D.attempts=D.attempts||[]; shell(); }
const TABS=[['dash','dashboard','Dashboard'],['editor','pencil','Visual editor'],['sections','settings','Sections & sizes'],['books','book','Books'],['paigham','calendar','Paigham (30 din)'],['updates','bell','Updates'],['quiz','quiz','Quiz'],['media','image','Media'],['messages','mail','Messages'],['comments','message','Comments'],['board','star','Leaderboard'],['stats','heart','Ta\'awun & stats'],['settings2','shield','Settings']];
function shell(){
  $('#adm-root').innerHTML = `<div class="adm"><nav class="adm-nav"><div class="who"><div class="serif" style="font-size:19px">Admin panel</div><div class="small muted">${TajStore.live?'Live':'DEMO MODE — not secure'}</div></div>
    ${TABS.map(([k,i,l])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${I(i,'s')}<span>${esc(l)}</span></button>`).join('')}
    <button data-tab="logout">${I('logout','s')}<span>Logout</span></button></nav>
    <div class="adm-main" id="admMain"></div></div>`;
  $$('[data-tab]').forEach(b=>b.onclick=()=>{ if(b.dataset.tab==='logout'){ TajStore.logout(); location.href='index.html'; return; } tab=b.dataset.tab; shell(); });
  const panels={dash,editor,sections,books,paigham,updates,quiz,media,messages,comments,board,stats,settings2};
  (panels[tab]||dash)();
}
const M=()=>$('#admMain');
const pill=(t,cls='')=>`<span class="sample ${cls}">${esc(t)}</span>`;
function dash(){
  const books=D.books.length, vols=D.books.reduce((a,b)=>a+b.volumes.length,0);
  const unread=D.messages.filter(m=>!m.read).length, pend=D.comments.filter(c=>c.status==='pending').length;
  const samples=[]; if(D.updates.some(u=>u.sample)) samples.push('updates'); if(Object.values(D.paigham).some(p=>p.sample)) samples.push('paigham'); if(Object.values(D.quizzes).some(q=>q.sample)) samples.push('quiz'); if(D.gallery.some(g=>g.sample)) samples.push('gallery tiles'); if(D.comments.some(c=>c.sample)) samples.push('comments'); if(D.attempts.some(a=>a.sample)) samples.push('leaderboard'); if(!D.site.youtube.url) samples.push('featured video'); if(!D.site.heroSlides||D.site.heroSlides[0]==='assets/img/hero.jpg') samples.push('hero photo');
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Dashboard</div><h2>Ek nazar mein</h2></div>${TajStore.live?'':'<span class="sample">DEMO MODE — not secure</span>'}</div>
  <div class="kpis fade-up in">
    <div class="kpi"><b>${books}</b><span>Kitabein (titles)</span></div>
    <div class="kpi"><b>${vols}</b><span>Jild (volumes)</span></div>
    <div class="kpi"><b>${Object.keys(D.paigham).length}</b><span>Paigham entries</span></div>
    <div class="kpi"><b>${Object.keys(D.quizzes).length}</b><span>Quiz din</span></div>
    <div class="kpi"><b>${D.attempts.length}</b><span>Quiz entries</span></div>
    <div class="kpi"><b>${unread}</b><span>Naye messages (${D.messages.length} total)</span></div>
    <div class="kpi"><b>${pend}</b><span>Comments pending</span></div>
    <div class="kpi"><b>${D.gallery.length}</b><span>Gallery tiles</span></div>
  </div>
  <div class="adm-card" style="margin-top:16px"><h3>Abhi sample hai (owner ko replace karna hai)</h3>
    <p class="small muted">${samples.length?samples.map(s=>pill(s)).join(' '):'Sab kuch real hai.'}</p>
    <p class="small muted" style="margin-top:8px">Stats (1000+, 50K+, 700+) original site ke claims hain, unverified. Hadees/ayat ka asli text owner khud daale.</p></div>
  <div class="adm-card"><h3>Quick actions</h3><div class="tools" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-go="editor">${I('pencil','s')} Visual editor</button><button class="btn ghost sm" data-go="paigham">Paigham likhein</button><button class="btn ghost sm" data-go="messages">Messages dekhein</button><a class="btn ghost sm" href="index.html" target="_blank">Site kholiye ${I('external','s')}</a></div></div>`;
  $$('[data-go]').forEach(b=>b.onclick=()=>{ tab=b.dataset.go; shell(); });
}
function editor(){
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Visual editor</div><h2>Asli page par edit karein</h2></div></div>
   <div class="adm-card"><p class="small">Neeche site dikhegi. Pencil par click karke text badlein; bahar click karne par save ho jayega. Links ke liye link icon. Sab kuch isi page par hota hai — code nahi chhedna.</p>
   <div class="tools" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><a class="btn sm" href="index.html?edit=1" target="_blank">Naye tab mein edit mode ${I('external','s')}</a></div></div>
   <div class="frame" style="height:72vh"><iframe src="index.html?edit=1" style="width:100%;height:100%;border:0" title="Site editor"></iframe></div>`;
}
function sections(){
  const keys=[['hero','Hero (slogan + photo)'],['stats','Stats bar'],['explore','Explore cards'],['paigham','Aaj Ka Paigham'],['updates','Latest updates'],['media','Media (video + gallery)'],['about','About'],['khidmat','Hamari Khidmat'],['taawun',"Ta'awun bar"],['contact','Share Your Thoughts form'],['comments','Comments']];
  const on=k=>D.site.sections[k]!==false;
  const sz=(k,l)=>`<div class="srow" style="display:block"><div class="srow" style="border:0;padding:0"><b>${l}</b><span class="small muted" id="v_${k}">${D.site.sizes[k]||100}%</span></div><input class="range" type="range" min="80" max="140" step="5" value="${D.site.sizes[k]||100}" data-size="${k}"></div>`;
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Sections & sizes</div><h2>Kya dikhe, kitna bada</h2></div></div>
   <div class="adm-card"><h3>Sections</h3>${keys.map(([k,l])=>`<div class="srow"><span>${l}</span><button class="toggle ${on(k)?'on':''}" data-sec="${k}" aria-label="toggle ${l}"><i></i></button></div>`).join('')}
   <p class="small muted" style="margin-top:8px">Band kiya hua section site se gayab ho jata hai. Layout nahi tootta.</p></div>
   <div class="adm-card"><h3>Text size (site ke liye)</h3>${sz('mobile','Mobile (phone)')}${sz('desktop','Desktop')}<p class="small muted" style="margin-top:8px">Visitor apne settings mein aur badha/ghata sakte hain.</p></div>`;
  $$('[data-sec]').forEach(b=>b.onclick=async()=>{ const k=b.dataset.sec; D.site.sections[k]=!on(k); b.classList.toggle('on'); await save({sections:D.site.sections}); toast('Save ho gaya'); });
  $$('[data-size]').forEach(r=>{ r.oninput=()=>{ $('#v_'+r.dataset.size).textContent=r.value+'%'; }; r.onchange=async()=>{ D.site.sizes[r.dataset.size]=+r.value; await save({sizes:D.site.sizes}); toast('Size save ho gaya'); }; });
}
async function save(patch){ await TajStore.saveSite(patch); }
function books(){
  const list=D.books.map((g,i)=>({g,i}));
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Books</div><h2>Taj Library</h2></div><button class="btn sm" id="bNew">${I('plus','s')} Nayi kitab</button></div>
  <div class="adm-card"><div class="wrapx"><table class="tbl"><thead><tr><th>Title</th><th>Writer</th><th>Category</th><th>Jild</th><th></th></tr></thead><tbody>${list.map(({g,i})=>`<tr><td><b>${esc(g.title)}</b><div class="ur small muted">${esc(g.urdu_title)}</div></td><td>${esc(g.writer)}</td><td>${esc(g.category)}</td><td>${g.volumes.length}</td><td style="white-space:nowrap"><button class="btn ghost sm" data-ebk="${i}">Edit</button> <button class="btn ghost sm" data-dbk="${i}">${I('trash','s')}</button></td></tr>`).join('')}</tbody></table></div></div>
  <div id="bkForm"></div>`;
  $('#bNew').onclick=()=>bookForm(null);
  $$('[data-ebk]').forEach(b=>b.onclick=()=>bookForm(+b.dataset.ebk));
  $$('[data-dbk]').forEach(b=>b.onclick=async()=>{ if(!confirm('Ye kitab delete karein?')) return; D.books.splice(+b.dataset.dbk,1); await TajStore.remove('books', 'b'+b.dataset.dbk); toast('Delete ho gaya'); books(); });
}
function bookForm(i){
  const g = i==null ? {title:'',writer:'',urdu_title:'',urdu_writer:'',category:'Other',cover:'',volumes:[{volume:'1',read_url:''}]} : D.books[i];
  const cats=['Hadees','Fatawa','Fiqh','Tafseer','Sharah','Tasawwuf','Namaz','Radd e Batil','Lughat','Naat','Aqaid','Nahw','Meeras','Other'];
  $('#bkForm').innerHTML = `<div class="adm-card" id="bkCard"><h3>${i==null?'Nayi kitab':'Edit: '+esc(g.title)}</h3>
   <div class="grid2"><div class="field"><span>Title (English)</span><input class="in" id="bt" value="${esc(g.title)}"></div><div class="field"><span>Urdu title</span><input class="in ur" id="bu" value="${esc(g.urdu_title)}"></div>
   <div class="field"><span>Writer (English)</span><input class="in" id="bw" value="${esc(g.writer)}"></div><div class="field"><span>Writer (Urdu)</span><input class="in ur" id="bwu" value="${esc(g.urdu_writer||'')}"></div>
   <div class="field"><span>Category</span><select class="in" id="bc">${cats.map(c=>`<option ${c===g.category?'selected':''}>${c}</option>`).join('')}</select></div>
   <div class="field"><span>Cover image link (optional)</span><input class="in" id="bcv" value="${esc(g.cover||'')}"></div></div>
   <div class="field"><span>Jild (ek line: jild | Read link)</span><textarea class="in" id="bv" style="min-height:140px">${g.volumes.map(v=>`${esc(v.volume)} | ${esc(v.read_url||'')}`).join('\n')}</textarea></div>
   <div class="tools" style="display:flex;gap:8px"><button class="btn sm" id="bSave">Save</button><button class="btn ghost sm" id="bCancel">Cancel</button></div></div>`;
  $('#bCancel').onclick=()=>$('#bkForm').innerHTML='';
  $('#bSave').onclick=async()=>{ const vols=$('#bv').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{ const [v,u]=l.split('|'); return {volume:(v||'').trim(), read_url:(u||'').trim()}; });
    if(!$('#bt').value.trim()||!vols.length){ toast('Title aur kam se kam ek jild chahiye'); return; }
    const row={title:$('#bt').value.trim(), writer:$('#bw').value.trim(), urdu_title:$('#bu').value.trim(), urdu_writer:$('#bwu').value.trim(), category:$('#bc').value, cover:$('#bcv').value.trim(), volumes:vols};
    const id = i==null ? 'b'+Date.now().toString(36) : D.books[i].id || ('b'+i);
    await TajStore.save('books', Object.assign({id}, row)); D.books = await reloadBooks(); toast('Kitab save ho gayi'); books(); };
}
async function reloadBooks(){ const d=await TajStore.load(); return d.books; }
function paigham(){
  const start = $('#pStart')?$('#pStart').value:todayKey();
  let rows=[]; for(let n=0;n<30;n++){ const k=addDays(start,n); const p=D.paigham[k]||{}; rows.push({k,text:p.text||'',ref:p.ref||'',sample:!!p.sample}); }
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Content scheduler</div><h2>Aaj Ka Paigham — 30 din</h2></div></div>
   <div class="adm-card"><div class="field"><span>Shuru ki date</span><input type="date" class="in" id="pStart" value="${start}" style="max-width:220px"></div>
   <p class="small muted">Har din ka text us din raat 12 baje (IST) se khud dikhega. Quran/Hadees ka text owner khud daale; sample wali lines par "sample" tag rahega jab tak aap use hatayein.</p></div>
   <div class="adm-card"><div class="wrapx"><table class="tbl" id="pTbl"><thead><tr><th>Date</th><th>Paigham text</th><th>Reference</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td style="white-space:nowrap">${r.k}</td><td><textarea class="in" data-pt="${i}" style="min-height:64px">${esc(r.text)}</textarea></td><td><input class="in" data-pr="${i}" value="${esc(r.ref)}"></td></tr>`).join('')}</tbody></table></div>
   <div class="tools" style="margin-top:12px"><button class="btn sm" id="pSave">30 din save karein</button></div></div>`;
  $('#pStart').onchange=paigham;
  $('#pSave').onclick=async()=>{ let n=0; for(let i=0;i<rows.length;i++){ const t=$(`[data-pt="${i}"]`).value.trim(); const r=$(`[data-pr="${i}"]`).value.trim(); if(!t){ if(D.paigham[rows[i].k]){ await TajStore.remove('paigham', rows[i].k); delete D.paigham[rows[i].k]; } continue; } const isSample=/^sample/i.test(t); await TajStore.save('paigham', {date:rows[i].k, text:t, ref:r, sample:isSample}); D.paigham[rows[i].k]={text:t,ref:r,sample:isSample}; n++; } toast(n+' din save ho gaye'); };
}
function updates(){
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Updates</div><h2>Naya update</h2></div></div>
  <div class="adm-card"><div class="grid2"><div class="field"><span>Date</span><input type="date" class="in" id="uD" value="${todayKey()}"></div><label class="field"><span>Naya (pulse dot)</span><select class="in" id="uN"><option value="1">Haan</option><option value="0">Nahi</option></select></label></div>
  <div class="field"><span>Update text</span><textarea class="in" id="uT"></textarea></div><button class="btn sm" id="uAdd">Add update</button></div>
  <div class="adm-card"><div class="wrapx"><table class="tbl"><tbody>${D.updates.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(u=>`<tr><td style="white-space:nowrap">${esc(u.date)}</td><td>${esc(u.text)} ${u.sample?pill('sample'):''} ${u.isNew?pill('new'):''}</td><td><button class="btn ghost sm" data-du="${esc(u.id)}">${I('trash','s')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
  $('#uAdd').onclick=async()=>{ const t=$('#uT').value.trim(); if(!t){ toast('Text likhiye'); return; } const id='u'+Date.now().toString(36); await TajStore.save('updates', {id, date:$('#uD').value, text:t, isNew:$('#uN').value==='1', sample:false}); D.updates.unshift({id,date:$('#uD').value,text:t,isNew:$('#uN').value==='1'}); toast('Update add ho gaya'); updates(); };
  $$('[data-du]').forEach(b=>b.onclick=async()=>{ await TajStore.remove('updates', b.dataset.du); D.updates=D.updates.filter(u=>u.id!==b.dataset.du); updates(); });
}
function quiz(){
  const k=$('#qDate')?$('#qDate').value:todayKey(); const q=D.quizzes[k]||{title:'',questions:[]};
  const qs=[0,1,2,3].map(i=>q.questions[i]||{q:'',options:['','','',''],answer:0});
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Quiz</div><h2>Quiz set karein</h2></div></div>
  <div class="adm-card"><div class="grid2"><div class="field"><span>Date (quiz us din khulega)</span><input type="date" class="in" id="qDate" value="${k}"></div><div class="field"><span>Quiz title</span><input class="in" id="qT" value="${esc(q.title||'')}"></div></div>
  ${qs.map((x,i)=>`<div style="border-top:1px solid var(--line);padding-top:12px;margin-top:12px"><div class="small muted">Sawaal ${i+1}</div><input class="in" data-qq="${i}" placeholder="Sawaal" value="${esc(x.q)}" style="margin:6px 0">
   <div class="grid2">${[0,1,2,3].map(j=>`<input class="in" data-qo="${i}-${j}" placeholder="Option ${'ABCD'[j]}" value="${esc(x.options[j]||'')}">`).join('')}</div>
   <div class="field" style="margin-top:8px"><span>Sahi jawab</span><select class="in" data-qa="${i}" style="max-width:200px">${[0,1,2,3].map(j=>`<option value="${j}" ${x.answer===j?'selected':''}>${'ABCD'[j]}</option>`).join('')}</select></div></div>`).join('')}
  <div class="tools" style="margin-top:14px;display:flex;gap:8px"><button class="btn sm" id="qSave">Quiz save</button><button class="btn ghost sm" id="qDel">Is din ka quiz hatayein</button></div></div>
  <div class="adm-card"><h3>Quiz din</h3><p class="small muted">${Object.keys(D.quizzes).sort().map(d=>`<span class="sample" style="margin:2px">${d}</span>`).join(' ') || 'Abhi koi quiz set nahi.'}</p></div>`;
  $('#qDate').onchange=quiz;
  $('#qSave').onclick=async()=>{ const questions=[]; for(let i=0;i<4;i++){ const t=$(`[data-qq="${i}"]`).value.trim(); if(!t) continue; const opts=[0,1,2,3].map(j=>$(`[data-qo="${i}-${j}"]`).value.trim()||('Option '+'ABCD'[j])); questions.push({q:t, options:opts, answer:+$(`[data-qa="${i}"]`).value}); }
    if(!questions.length){ toast('Kam se kam ek sawaal'); return; } const sample = questions.some(x=>/sample/i.test(x.q)); const row={date:k, title:$('#qT').value.trim()||'Taj Quiz', questions, sample}; await TajStore.save('quizzes', row); D.quizzes[k]={title:row.title,questions,sample}; toast('Quiz save ho gaya'); quiz(); };
  $('#qDel').onclick=async()=>{ if(!confirm('Is din ka quiz hatayein?')) return; await TajStore.remove('quizzes', k); delete D.quizzes[k]; toast('Hat gaya'); quiz(); };
}
function media(){
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Media manager</div><h2>Photo aur video</h2></div></div>
  <div class="adm-card"><h3>Photo upload</h3><p class="small muted">Phone se photo chuniye. Ye browser mein chhoti (compress, crop) hokar save hogi, phir gallery, hero ya book cover mein lagegi.</p>
   <label class="dz" id="dz">${I('upload','l')}<div style="margin-top:6px">Photo chuniye</div><input type="file" accept="image/*" id="mFile" hidden></label>
   <div class="grid2" style="margin-top:12px"><div class="field"><span>Kahan lagaayein</span><select class="in" id="mWhere"><option value="gallery">Gallery</option><option value="hero">Hero slideshow (add)</option><option value="hero1">Hero slideshow (replace)</option><option value="cover">Book cover</option></select></div>
   <div class="field"><span>Caption</span><input class="in" id="mCap" placeholder="Photo ka naam"></div></div>
   <div class="field" id="mBookWrap" style="display:none"><span>Kitab (cover ke liye)</span><select class="in" id="mBook">${D.books.map((g,i)=>`<option value="${i}">${esc(g.title)}</option>`).join('')}</select></div>
   <div id="mPrev"></div><button class="btn sm" id="mSave" disabled>Save</button>
   <p class="small draft" id="mMsg"></p></div>
  <div class="adm-card"><h3>YouTube video</h3><p class="small muted">Link paste karein. Title aur thumbnail apne aap aayenge.</p>
   <div class="field"><span>YouTube link</span><input class="in" id="yUrl" value="${esc(D.site.youtube.url||'')}" placeholder="https://youtu.be/..."></div>
   <div class="tools" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="yFetch">Title aur thumbnail lein</button><button class="btn ghost sm" id="yClear">Hatayein</button></div>
   <div id="yPrev" style="margin-top:12px">${D.site.youtube.url?`<img class="thumb" src="${esc(D.site.youtube.thumb||'')}" alt=""><div><b>${esc(D.site.youtube.title||'')}</b></div>`:''}</div></div>
  <div class="adm-card"><h3>Gallery</h3><div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))">${D.gallery.map((g,i)=>`<div><img src="${esc(g.src)}" style="width:100%;border-radius:10px;border:1px solid var(--line)"><div class="small muted">${esc(g.caption)}</div><button class="btn ghost sm" data-dg="${i}">${I('trash','s')} Hatayein</button></div>`).join('')||'<span class="muted small">Abhi koi tile nahi.</span>'}</div></div>`;
  let pending=null;
  $('#mFile').onchange=async e=>{ const f=e.target.files[0]; if(!f) return; const data=await compress(f, $('#mWhere').value==='cover'?600:1280); pending=data; $('#mPrev').innerHTML=`<img class="thumb" src="${data}" alt="">`; $('#mSave').disabled=false; $('#mMsg').textContent=`Compress ho gaya (${Math.round(data.length*0.75/1024)} KB)`; };
  $('#mWhere').onchange=()=>{ $('#mBookWrap').style.display=$('#mWhere').value==='cover'?'grid':'none'; };
  $('#mSave').onclick=async()=>{ if(!pending) return; const where=$('#mWhere').value; const cap=$('#mCap').value.trim()||'Photo';
    try{ let url=pending; if(TajStore.live){ url = await uploadLive(pending); }
      if(where==='gallery'){ const id='g'+Date.now().toString(36); const row={id, src:url, caption:cap, kind:'photo', sample:false}; await TajStore.save('gallery', row); D.gallery.unshift(row); }
      else if(where==='hero'||where==='hero1'){ const slides = where==='hero1'? [url] : [...(D.site.heroSlides||[]), url]; D.site.heroSlides=slides; await TajStore.saveSite({heroSlides:slides}); }
      else if(where==='cover'){ const g=D.books[+$('#mBook').value]; g.cover=url; await TajStore.save('books', Object.assign({id:g.id||('b'+$('#mBook').value)}, g)); }
      toast('Photo laga diya'); pending=null; $('#mSave').disabled=true; media(); }catch(err){ $('#mMsg').textContent='Save nahi hua: '+err.message; } };
  $$('[data-dg]').forEach(b=>b.onclick=async()=>{ const g=D.gallery[+b.dataset.dg]; await TajStore.remove('gallery', g.id); D.gallery.splice(+b.dataset.dg,1); media(); });
  $('#yFetch').onclick=async()=>{ const id=ytId($('#yUrl').value.trim()); if(!id){ toast('YouTube link sahi nahi lag raha'); return; }
    let title=''; try{ const r=await fetch('https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)); const j=await r.json(); title=j.title||''; }catch(e){ title=''; }
    const thumb='https://img.youtube.com/vi/'+id+'/hqdefault.jpg'; D.site.youtube={url:'https://www.youtube.com/watch?v='+id, title: title||'Video', thumb}; await TajStore.saveSite({youtube:D.site.youtube}); toast(title?'Title aa gaya':'Video save hua (title nahi mila, naam likh dein)'); media(); };
  $('#yClear').onclick=async()=>{ D.site.youtube={url:'',title:'',thumb:''}; await TajStore.saveSite({youtube:D.site.youtube}); media(); };
}
function compress(file, max){ return new Promise((res,rej)=>{ const img=new Image(); const url=URL.createObjectURL(file); img.onload=()=>{ const s=Math.min(1, max/Math.max(img.width,img.height)); const c=document.createElement('canvas'); c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext('2d').drawImage(img,0,0,c.width,c.height); let q=0.82; let out=c.toDataURL('image/jpeg',q); while(out.length>380000*1.37 && q>0.4){ q-=0.08; out=c.toDataURL('image/jpeg',q); } URL.revokeObjectURL(url); res(out); }; img.onerror=rej; img.src=url; }); }
async function uploadLive(dataUrl){ const blob=await (await fetch(dataUrl)).blob(); const path='m/'+Date.now().toString(36)+'.jpg'; const tok=sessionStorage.getItem('tajv2.token'); const r=await fetch(cfg.SUPABASE_URL.replace(/\/$/,'')+'/storage/v1/object/media/'+path,{method:'POST',headers:{apikey:cfg.SUPABASE_ANON_KEY,Authorization:'Bearer '+tok,'Content-Type':'image/jpeg'},body:blob}); if(!r.ok) throw new Error('upload '+r.status); return cfg.SUPABASE_URL.replace(/\/$/,'')+'/storage/v1/object/public/media/'+path; }
function messages(){
  const rows=D.messages.slice().sort((a,b)=>String(b.created).localeCompare(String(a.created)));
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Messages</div><h2>Share Your Thoughts — tracker</h2></div></div>
  <div class="adm-card"><p class="small muted">Naye messages bold hain. WhatsApp par reply ke liye phone number chahiye (contact form mein optional field hai). Telegram par forwarding ke liye README dekhen.</p>
  <div class="wrapx"><table class="tbl"><thead><tr><th>Date</th><th>Naam / contact</th><th>Message</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(m=>`<tr class="${m.read?'':'unread'}"><td style="white-space:nowrap">${esc(m.created||'')}</td><td><b>${esc(m.name)}</b><div class="small muted">${esc(m.email||'')}</div>${m.phone?`<div class="small"><a href="https://wa.me/${esc(String(m.phone).replace(/\D/g,''))}" target="_blank" rel="noopener">${I('whatsapp','s')} WhatsApp reply</a></div>`:''}</td><td style="max-width:360px">${esc(m.message)}</td><td>${m.read?'Read':'<b>Unread</b>'}</td><td style="white-space:nowrap"><button class="btn ghost sm" data-mr="${esc(m.id)}">${m.read?'Unread karein':'Read'}</button> <button class="btn ghost sm" data-md="${esc(m.id)}">${I('trash','s')}</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">Abhi koi message nahi.</td></tr>'}</tbody></table></div></div>`;
  $$('[data-mr]').forEach(b=>b.onclick=async()=>{ const m=D.messages.find(x=>x.id===b.dataset.mr); m.read=!m.read; await TajStore.save('messages', m); messages(); });
  $$('[data-md]').forEach(b=>b.onclick=async()=>{ if(!confirm('Delete karein?')) return; await TajStore.remove('messages', b.dataset.md); D.messages=D.messages.filter(x=>x.id!==b.dataset.md); messages(); });
}
function comments(){
  const rows=D.comments.slice();
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Comments</div><h2>Moderation</h2></div></div>
  <div class="adm-card"><div class="wrapx"><table class="tbl"><thead><tr><th>Naam</th><th>Comment</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.text)} ${c.sample?pill('sample'):''}</td><td>${esc(c.status)}</td><td style="white-space:nowrap"><button class="btn sm" data-ca="${esc(c.id)}">Approve</button> <button class="btn ghost sm" data-cr="${esc(c.id)}">Hatayein</button></td></tr>`).join('')||'<tr><td colspan="4" class="muted">Abhi koi comment nahi.</td></tr>'}</tbody></table></div></div>`;
  $$('[data-ca]').forEach(b=>b.onclick=async()=>{ const c=D.comments.find(x=>x.id===b.dataset.ca); c.status='approved'; await TajStore.save('comments', c); comments(); });
  $$('[data-cr]').forEach(b=>b.onclick=async()=>{ await TajStore.remove('comments', b.dataset.cr); D.comments=D.comments.filter(x=>x.id!==b.dataset.cr); comments(); });
}
function board(){
  const rows=D.attempts.slice().sort((a,b)=>b.score-a.score);
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Leaderboard</div><h2>Quiz entries</h2></div></div>
  <div class="adm-card"><p class="small muted">Public par sirf pehla naam aur score dikhta hai. Phone aur address sirf yahan.</p><div class="wrapx"><table class="tbl"><thead><tr><th>Score</th><th>Naam</th><th>Phone</th><th>Address</th><th>Din</th><th></th></tr></thead><tbody>${rows.map(a=>`<tr><td><b>${a.score}</b>${a.total?' / '+a.total:''}</td><td>${esc(a.name)} ${a.sample?pill('sample'):''}</td><td>${esc(a.phone||'')}</td><td>${esc(a.address||'')}</td><td>${esc(a.created||'')}</td><td><button class="btn ghost sm" data-ba="${esc(a.id)}">${I('trash','s')}</button></td></tr>`).join('')||'<tr><td colspan="6" class="muted">Abhi koi entry nahi.</td></tr>'}</tbody></table></div></div>`;
  $$('[data-ba]').forEach(b=>b.onclick=async()=>{ await TajStore.remove('attempts', b.dataset.ba); D.attempts=D.attempts.filter(x=>x.id!==b.dataset.ba); board(); });
}
function stats(){
  const g=D.site.taawun, st=D.site.stats||[];
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Ta'awun & stats</div><h2>Owner ke numbers</h2></div></div>
  <div class="adm-card"><h3>Ta'awun progress</h3><div class="grid2"><div class="field"><span>Label</span><input class="in" id="tLab" value="${esc(g.label)}"></div><div class="field"><span>Currency symbol</span><input class="in" id="tCur" value="${esc(g.currency||'')}"></div><div class="field"><span>Goal</span><input class="in" type="number" id="tGoal" value="${g.goal||0}"></div><div class="field"><span>Raised (owner ka number)</span><input class="in" type="number" id="tRaised" value="${g.raised||0}"></div></div>
  <button class="btn sm" id="tSave">Save</button><p class="small muted" style="margin-top:8px">Koi payment yahan process nahi hota. Ye sirf progress bar ka number hai.</p></div>
  <div class="adm-card"><h3>Stats bar</h3><p class="small muted">Ye numbers original site ke claims hain. Owner check karke badle.</p>${st.map((s,i)=>`<div class="grid2" style="grid-template-columns:2fr 1fr 1fr;align-items:end;margin-bottom:8px"><div class="field"><span>Label</span><input class="in" data-sl="${i}" value="${esc(s.label)}"></div><div class="field"><span>Value</span><input class="in" type="number" data-sv="${i}" value="${s.value}"></div><div class="field"><span>Suffix</span><input class="in" data-ss="${i}" value="${esc(s.suffix||'')}"></div></div>`).join('')}<button class="btn sm" id="stSave">Stats save</button></div>`;
  $('#tSave').onclick=async()=>{ D.site.taawun={label:$('#tLab').value, currency:$('#tCur').value, goal:+$('#tGoal').value||0, raised:+$('#tRaised').value||0}; await TajStore.saveSite({taawun:D.site.taawun}); toast('Save ho gaya'); };
  $('#stSave').onclick=async()=>{ D.site.stats=st.map((s,i)=>({label:$(`[data-sl="${i}"]`).value, value:+$(`[data-sv="${i}"]`).value||0, suffix:$(`[data-ss="${i}"]`).value, claimed:s.claimed})); await TajStore.saveSite({stats:D.site.stats}); toast('Stats save ho gaye'); };
}
function settings2(){
  M().innerHTML = `<div class="adm-top"><div><div class="eyebrow">Settings</div><h2>Backend & data</h2></div></div>
  <div class="adm-card"><h3>Status</h3><p>${TajStore.live?'Live: Supabase se judi hai.':'<span class="sample">DEMO MODE — not secure</span> Data sirf is browser mein hai. Live backend ke liye README ke 8 steps.'}</p>
  <div class="tools" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" id="sExp">Backup (JSON) download</button>${TajStore.live?'':'<button class="btn ghost sm" id="sRes">Demo data reset</button>'}</div></div>
  <div class="adm-card"><h3>Admin login</h3><p class="small muted">${TajStore.live?'Password sirf Supabase Auth mein hai; site ke code mein kuch nahi.':'Demo login: demo / demo (demo mode mein hi).'}</p><button class="btn danger sm" id="sOut">Logout</button></div>`;
  $('#sExp').onclick=()=>{ const blob=new Blob([JSON.stringify(TajStore.exportDemo?TajStore.exportDemo():D,null,1)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='tajv2-backup.json'; a.click(); };
  if($('#sRes')) $('#sRes').onclick=async()=>{ if(!confirm('Demo data reset karein? Sab demo changes hat jayenge.')) return; await TajStore.resetDemo(); location.reload(); };
  $('#sOut').onclick=()=>{ TajStore.logout(); location.href='index.html'; };
}
window.addEventListener('DOMContentLoaded', ()=>{ start(); });
})();
