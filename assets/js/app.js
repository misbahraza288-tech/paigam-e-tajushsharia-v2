
/* Paighaam-e-Tajushshariah v2 — public site (single app, hash routes). */
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I = (n,c)=>window.ico(n,c);
let D = null;          // data
let P = {};            // device prefs
const ist = () => new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
const todayKey = () => new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
const addDays = (k,n) => { const d = new Date(k+'T12:00:00+05:30'); d.setDate(d.getDate()+n); return d.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}); };
const fmt = k => { try{ return new Date(k+'T12:00:00+05:30').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}); }catch(e){ return k; } };
const hijri = k => { try{ return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(k+'T12:00:00+05:30')); }catch(e){ return ''; } };
const S = () => D.site;
const T = (key, def) => (S().texts && S().texts[key] != null) ? S().texts[key] : def;
const E = (key, def, tag='span', cls='') => `<${tag} class="${cls}" data-edit="${esc(key)}">${esc(T(key,def))}</${tag}>`;
const secOn = key => (S().sections||{})[key] !== false;
const sec = (key, html) => secOn(key) ? html : (document.body.classList.contains('editing') ? `<div class="sec" style="opacity:.35"><div class="wrap"><span class="sample">Section off: ${esc(key)}</span></div></div>` : '');
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('on'), 2600); };
const lastRead = () => { try{ return JSON.parse(localStorage.getItem('tajv2.lastread')||'null'); }catch(e){ return null; } };
const demoBadge = () => TajStore.live ? '' : `<div class="demo-banner">DEMO MODE — not secure. Ye sirf preview hai, data is phone me hi rehta hai. <b>Live backend setup: README dekhen.</b></div>`;

/* ---------- shell ---------- */
function shell(){
  const brand = S().brand || 'Paighaam-e-Tajushshariah';
  document.getElementById('app-header').innerHTML = `
    <div class="topbar"><div class="row">
      <button class="iconbtn" id="btnMenu" aria-label="Menu">${I('menu')}</button>
      <a class="brand-box" href="#/" aria-label="Home"><span class="b1" data-edit="brand">${esc(T('brand',brand))}</span><span class="b2">Taj · Ilm · Adab</span><span class="b3">پیغامِ تاج الشریعہ</span></a>
      <button class="iconbtn" id="btnSettings" aria-label="Settings">${I('settings')}</button>
    </div></div>`;
  const links = [['#/','home','Home'],['#/library','book','Taj Library'],['#/quiz','quiz','Taj Quiz'],['#/paigham','sparkle','Aaj Ka Paigham'],['#/updates','bell','Updates'],['#/videos','video','Videos'],['#/gallery','image','Gallery'],['#/about','info','About'],['#/tawwun','heart','Tawwun'],['#/khidmat','users','Hamari Khidmat'],['#/contact','mail','Share Your Thoughts']];
  document.getElementById('app-drawer').innerHTML = `
    <div class="drawer" id="drawer" role="dialog" aria-label="Menu">
      <header><span class="serif" style="font-size:20px">Menu</span><button class="iconbtn" data-close>${I('close')}</button></header>
      <nav>${links.map(([h,i,l])=>`<a href="${h}" data-close>${I(i)}<span>${esc(l)}</span></a>`).join('')}
        ${TajStore.isAdmin()? `<a href="admin.html">${I('dashboard')}<span>Admin panel</span></a>`:''}</nav>
      <div class="legal">
        <button data-legal="privacy">Privacy Policy <span class="draft">(draft)</span></button>
        <button data-legal="terms">Terms of Use <span class="draft">(draft)</span></button>
        <button data-legal="donation">Donation / Ta'awun Rules <span class="draft">(draft)</span></button>
      </div>
    </div>
    <div class="sheet" id="sheet" role="dialog" aria-label="Settings">
      <div class="body">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="serif" style="font-size:20px">Settings</span><button class="iconbtn" data-close>${I('close')}</button></header>
        <div class="setting"><label>Theme</label>
          <div class="seg" id="segTheme"><button data-theme="light">Light</button><button data-theme="dark">Dark</button></div></div>
        <div class="setting"><label>Font size <span class="muted small" id="fsVal"></span></label>
          <input type="range" class="range" id="fsRange" min="85" max="130" step="5"></div>
        <div class="setting"><label>Language</label>
          <div class="seg" id="segLang"><button data-lang="en">English</button><button data-lang="roman">Roman</button></div>
          <p class="small muted" style="margin:8px 0 0">Ye pasand abhi save hoti hai; labels ka poora Roman/Urdu switch agle step mein.</p></div>
        <div class="setting"><label>Notifications</label>
          <button class="btn ghost sm" id="btnNotify">${P.notify?'Band karein':'Naye update ke liye on karein'}</button>
          <p class="small muted" style="margin:8px 0 0">Ye browser notification hai. Phone band ho to push nahi aayega (abhi push ka backend nahi hai).</p></div>
        <div class="version">Version 1.0.2 · Powered by QENLYX</div>
      </div>
    </div>
    <div class="scrim" id="scrim"></div>`;
  document.getElementById('app-footer').innerHTML = `
    <footer class="site"><div class="wrap">
      <div class="secret" id="secretBrand" style="display:flex;align-items:center;gap:10px">${I('emblem','l')}<div><div class="serif" style="font-size:20px">${esc(brand)}</div><div class="small muted">Ilm · Adab · Khidmat</div></div></div>
      <div class="socials">
        ${[['facebook','Facebook'],['instagram','Instagram'],['youtube','YouTube'],['x','X']].map(([k,l])=>`<a href="${esc(S().links[k]||'#')}" aria-label="${l}" ${S().links[k]?'target="_blank" rel="noopener"':''}>${I(k==='x'?'xsocial':k)}</a>`).join('')}
      </div>
      <div class="small" style="display:flex;gap:14px;flex-wrap:wrap">
        <button data-legal="privacy" class="muted">Privacy</button><button data-legal="terms" class="muted">Terms</button><button data-legal="donation" class="muted">Ta'awun rules</button><a href="#/contact">Contact</a>
      </div>
      <div class="fine">Original site ke claims (stats, readers) owner ke hain aur unverified hain. Sample tags wale text owner ko replace karna hai. Kisi bhi Quran/Hadees ka text yahan se nahi likha gaya.</div>
    </div></footer>`;
  $('#btnMenu').onclick = openDrawer; $('#btnSettings').onclick = openSheet;
  $('#scrim').onclick = closeAll;
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeAll(); });
  $$('[data-close]').forEach(b=>b.onclick=closeAll);
  $$('#app-drawer [data-legal], #app-footer [data-legal]').forEach(b=>b.onclick=()=>{ closeAll(); openLegal(b.dataset.legal); });
  $$('#app-drawer nav a, #app-drawer .drawer a').forEach(a=>a.addEventListener('click',()=>closeAll()));
  $$('#segTheme button').forEach(b=>b.onclick=()=>setTheme(b.dataset.theme));
  $$('#segLang button').forEach(b=>b.onclick=()=>{ P.lang=b.dataset.lang; TajStore.setPrefs({lang:P.lang}); paintSeg(); });
  $('#fsRange').oninput = e=>{ P.fs=+e.target.value; TajStore.setPrefs({fs:P.fs}); applySize(); };
  $('#btnNotify').onclick = async ()=>{ if(P.notify){ P.notify=false; TajStore.setPrefs({notify:false}); toast('Notifications band'); shell(); openSheet(); return; }
    if(!('Notification' in window)){ toast('Ye browser notification support nahi karta'); return; }
    const r = await Notification.requestPermission(); P.notify = r==='granted'; TajStore.setPrefs({notify:P.notify}); toast(P.notify?'Naye update par alert milega (is browser par)':'Permission nahi mili'); shell(); openSheet(); };
  $('#secretBrand').addEventListener('click', tapSecret);
  paintSeg();
}
let taps=[]; function tapSecret(){ const now=Date.now(); taps=taps.filter(t=>now-t<2000); taps.push(now); if(taps.length>=3){ taps=[]; adminGate(); } }
function adminGate(){
  openModal(`<div class="top"><span class="serif" style="font-size:22px">Admin login</span><button class="iconbtn" data-close>${I('close')}</button></div>
    <p class="small muted">Owner ka ID aur password. ${TajStore.live?'':'<span class="sample">DEMO: demo / demo</span>'}</p>
    <form id="gateForm"><div class="field"><span>ID / Email</span><input class="in" name="email" autocomplete="username" required></div>
    <div class="field"><span>Password</span><input class="in" type="password" name="password" autocomplete="current-password" required></div>
    <p class="small draft" id="gateMsg"></p><button class="btn" type="submit" style="width:100%">Login</button></form>`);
  $('#gateForm').onsubmit = async e=>{ e.preventDefault(); const f=new FormData(e.target); const r = await TajStore.login(f.get('email'), f.get('password')); if(r.ok){ location.href='admin.html'; } else $('#gateMsg').textContent = r.msg; };
}
function paintSeg(){ $$('#segTheme button').forEach(b=>b.classList.toggle('on', (P.theme||'light')===b.dataset.theme)); $$('#segLang button').forEach(b=>b.classList.toggle('on', (P.lang||'en')===b.dataset.lang)); }
function setTheme(t){ P.theme=t; TajStore.setPrefs({theme:t}); document.body.classList.toggle('dark', t==='dark'); paintSeg(); }
function applySize(){ const site = S().sizes||{}; const base = (window.innerWidth<720? (site.mobile||100) : (site.desktop||100)); const u = (P.fs||100); document.documentElement.style.setProperty('--fs', (base*u/10000).toFixed(3)); const v=$('#fsVal'); if(v) v.textContent = u+'%'; const r=$('#fsRange'); if(r) r.value = u; }
function openDrawer(){ $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); }
function openSheet(){ $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); const r=$('#fsRange'); if(r) r.value=P.fs||100; applySize(); const n=$('#btnNotify'); if(n) n.textContent = P.notify?'Band karein':'Naye update ke liye on karein'; }
function closeAll(){ ['#drawer','#sheet'].forEach(s=>{ const e=$(s); if(e) e.classList.remove('on'); }); const sc=$('#scrim'); if(sc && !$('#modal').classList.contains('on')) sc.classList.remove('on'); }
function openModal(html){ const m=$('#modal'); m.querySelector('.box').innerHTML = html; m.classList.add('on'); $('#scrim').classList.add('on'); $$('#modal [data-close]').forEach(b=>b.onclick=closeModal); m.onclick = e=>{ if(e.target===m) closeModal(); }; }
function closeModal(){ $('#modal').classList.remove('on'); $('#scrim').classList.remove('on'); }
function openLegal(name){ const L = S().legal||{}; const titles={privacy:'Privacy Policy',terms:'Terms of Use',donation:"Donation / Ta'awun Rules"}; openModal(`<div class="top"><span class="serif" style="font-size:22px">${titles[name]||''}</span><button class="iconbtn" data-close>${I('close')}</button></div><p class="draft" style="margin-bottom:12px">Draft — owner to review</p><p>${esc(L[name]||'')}</p>`); }

/* ---------- reveal + count-up ---------- */
const io = ('IntersectionObserver' in window) ? new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); if(en.target.dataset.count) countUp(en.target); io.unobserve(en.target); } }), {rootMargin:'0px 0px -8% 0px', threshold:.08}) : null;
function reveal(root){ $$('.fade-up,[data-count],.tick,.ornament',root).forEach(el=>{ if(io) io.observe(el); else el.classList.add('in'); }); $$('.tick',root).forEach(t=>{ if(!io) t.classList.add('on'); }); }
function countUp(el){ const end=+el.dataset.count, suf=el.dataset.suffix||''; const t0=performance.now(), dur=1600; const step=t=>{ const k=Math.min(1,(t-t0)/dur); const v=Math.round(end*(1-Math.pow(1-k,3))); el.textContent=v.toLocaleString('en-IN')+suf; if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

/* ---------- data helpers ---------- */
const groups = () => D.books;
const catList = () => ['All', ...Array.from(new Set(D.books.map(b=>b.category))).sort()];
const paighamFor = k => { const p = (D.paigham||{})[k]; return p ? Object.assign({date:k}, p) : {date:k, text:'Is din ka paigham abhi owner ne nahi daala. Admin se likha jayega.', ref:'', sample:true, placeholder:true}; };
const sortedAttempts = () => (D.attempts||[]).filter(a=>a.score!=null).slice().sort((a,b)=> b.score-a.score || String(a.created).localeCompare(String(b.created)));
function youtubeId(u){ if(!u) return ''; const m = String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m?m[1]:''; }
const firstName = n => String(n||'').trim().split(/\s+/)[0] || 'Guest';
const cover = (b, cls='') => `<div class="cover ${cls}">${b.cover?`<img loading="lazy" src="${esc(b.cover)}" alt="" onerror="this.style.display='none'">`:''}<div class="ph">${esc(b.title)}</div></div>`;

/* ---------- views ---------- */
const V = {};
V.home = () => {
  const today = todayKey(); const pg = paighamFor(today); const up = (D.updates||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const top = sortedAttempts()[0];
  const sl = (S().heroSlides||[]);
  const stats = (S().stats||[]).map(s=>`<div class="stat"><b data-count="${s.value}" data-suffix="${esc(s.suffix||'')}">${s.value}${esc(s.suffix||'')}</b><span>${esc(s.label)}${s.claimed?' <span class="sample">owner claim</span>':''}</span></div>`).join('');
  const ylink = youtubeId(S().youtube.url);
  return `
  ${sec('hero', `
  <section class="hero"><div class="wrap grid">
    <div class="fade-up">
      <div class="eyebrow">Paighaam-e-Tajushshariah</div>
      <h1>${E('hero.tagline', S().tagline)}</h1>
      <p class="lead" style="margin-top:14px">${E('hero.sub', S().sub, 'span')}</p>
      <div class="actions">
        <a class="btn" href="#/library">${I('book')} Explore Library</a>
        <a class="btn ghost" href="#/quiz">${I('quiz')} Today's Quiz</a>
      </div>
      <a href="#/about" class="learn" style="display:inline-flex;gap:8px;align-items:center;margin-top:20px;font-weight:600" data-edit-link="link.learn">Learn more ${I('right','s')}</a>
    </div>
    <div class="hero-art fade-up" aria-label="Hero">
      <svg class="ornament" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1" style="inset:auto;right:-60px;top:-60px;width:260px"><path d="M100 10 L130 50 L175 40 L165 85 L190 100 L165 115 L175 160 L130 150 L100 190 L70 150 L25 160 L35 115 L10 100 L35 85 L25 40 L70 50 Z"/><circle cx="100" cy="100" r="42"/><path d="M100 58 L142 100 L100 142 L58 100 Z"/></svg>
      ${sl.map((src,i)=>`<div class="slide ${i===0?'on':''}"><img alt="" src="${esc(src)}"></div>`).join('')}
      <div class="dots">${sl.map((_,i)=>`<i class="${i===0?'on':''}"></i>`).join('')}</div>
      ${S().heroCaption?`<div class="cap">${esc(S().heroCaption)}</div>`:''}
    </div>
  </div></section>`)}
  ${sec('stats', `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="stats fade-up">${stats}</div></div></section>`)}
  ${sec('explore', `<section class="sec"><div class="wrap">
    <div class="eyebrow">Explore</div><h2>Ilm ki do raahein</h2>
    <div class="cards" style="margin-top:20px">
      <a class="card fade-up" href="#/library" style="text-decoration:none;color:inherit"><div class="feature-ico">${I('book','l')}</div><h3>Taj Library</h3><p>Kitabon ki list, jild ke hisaab se. Search aur category ke saath.</p><span class="more">Kholiye ${I('right','s')}</span></a>
      <a class="card fade-up" href="#/quiz" style="text-decoration:none;color:inherit"><div class="feature-ico">${I('quiz','l')}</div><h3>Taj Quiz</h3><p>Roz ka quiz, countdown aur leaderboard. Naam aur phone sirf admin dekhega.</p><span class="more">Quiz dein ${I('right','s')}</span></a>
    </div></div></section>`)}
  ${sec('paigham', `<section class="sec"><div class="wrap">
    <div class="eyebrow">Aaj Ka Paigham</div>
    <div class="paigham fade-up" id="homePaigham">
      <div class="date"><span>${fmt(today)}</span><span>${esc(hijri(today))}</span></div>
      <p class="text">${esc(pg.text)}</p>
      <div class="ref">${esc(pg.ref||'')} ${pg.sample?'<span class="sample">sample — owner to replace</span>':''}</div>
      <div class="tools"><button class="btn ghost sm" data-listen="${esc(today)}">${I('play','s')} Listen</button><a class="btn ghost sm" href="#/paigham">Poora paigham ${I('right','s')}</a>${shareBtn(today)}</div>
    </div></div></section>`)}
  ${sec('updates', `<section class="sec"><div class="wrap">
    <div class="eyebrow">Latest Updates</div><h2>Naya kya hai</h2>
    <div class="timeline" style="margin-top:22px">${up.slice(0,3).map(u=>`<div class="tl fade-up"><div class="d">${fmt(u.date)} ${u.isNew?'<span class="pulse" title="new"></span>':''}</div><p style="margin-top:4px">${esc(u.text)} ${u.sample?'<span class="sample">sample</span>':''}</p></div>`).join('') || '<div class="empty">Abhi koi update nahi.</div>'}</div>
    <a class="btn ghost sm" href="#/updates" style="margin-top:18px">Saare updates ${I('right','s')}</a></div></section>`)}
  ${sec('media', `<section class="sec"><div class="wrap">
    <div class="eyebrow">Media</div><h2>Video aur Gallery</h2>
    <div style="margin-top:20px" class="fade-up">${ylink?`<div class="frame"><iframe class="yt" src="https://www.youtube-nocookie.com/embed/${ylink}" title="${esc(S().youtube.title||'Video')}" allowfullscreen loading="lazy"></iframe></div>`:`<div class="frame"><div class="ph"><div>${I('video','l')}<p style="margin-top:8px">Featured video yahan aayega. Owner YouTube ka link admin se daalega.</p><span class="sample">placeholder</span></div></div></div>`}</div>
    <div class="masonry" style="margin-top:20px;columns:3">${(D.gallery||[]).slice(0,3).map(g=>`<figure class="fade-up" data-lb="${esc(g.src)}" data-cap="${esc(g.caption)}"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.caption)}"></figure>`).join('')}</div>
    <a class="btn ghost sm" href="#/gallery" style="margin-top:6px">Poori gallery ${I('right','s')}</a></div></section>`)}
  ${sec('about', `<section class="sec"><div class="wrap">
    <div class="eyebrow">About</div><h2>Mission</h2>
    <p class="lead" style="margin-top:10px">${E('about.mission', S().about.mission, 'span')}</p>
    <a class="btn ghost sm" href="#/about" style="margin-top:16px">About page ${I('right','s')}</a></div></section>`)}
  ${sec('khidmat', `<section class="sec"><div class="wrap"><div class="eyebrow">Hamari Khidmat</div><div class="cards">${(S().khidmat||[]).map(k=>`<div class="card fade-up"><div class="feature-ico">${I('users')}</div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div>`).join('')}</div></div></section>`)}
  ${sec('taawun', `<section class="sec"><div class="wrap"><div class="card fade-up"><div class="eyebrow">Ta'awun</div><h3>${esc(S().taawun.label)}</h3><div class="bar" style="margin:14px 0 8px"><i data-w="${Math.min(100, Math.round(100*(S().taawun.raised||0)/Math.max(1,S().taawun.goal||1)))}"></i></div><div class="small muted">${esc(S().taawun.currency||'')}${(S().taawun.raised||0).toLocaleString('en-IN')} / ${esc(S().taawun.currency||'')}${(S().taawun.goal||0).toLocaleString('en-IN')} · <span class="sample">owner update karega</span></div><a class="btn ghost sm" href="#/tawwun" style="margin-top:12px">Ta'awun page ${I('right','s')}</a></div></div></section>`)}
  ${sec('contact', `<section class="sec" id="contact"><div class="wrap">
    <div class="eyebrow">Connect</div><h2>Share Your Thoughts</h2>
    <p class="lead" style="margin-top:8px">Apna naam, email aur message bhejiye. Owner dekhenge.</p>
    <div style="max-width:560px;margin-top:18px">${contactForm()}</div></div></section>`)}
  ${sec('comments', `<section class="sec"><div class="wrap">
    <div class="eyebrow">Comments</div><h2>Aapki raaye</h2>
    <div style="margin:18px 0">${commentForm()}</div>
    <div id="commentList">${(D.comments||[]).filter(c=>c.status==='approved').map(c=>`<div class="comment"><b>${esc(c.name)}</b> <small>${esc(c.created||'')}</small><p style="margin:6px 0 0">${esc(c.text)}</p></div>`).join('') || '<div class="empty">Abhi koi approved comment nahi. Pehla comment aap likhiye.</div>'}</div>
  </div></section>`)}
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="card small"><div class="eyebrow">Taj Scholar of the Day</div>${top?`<b>${esc(firstName(top.name))}</b> · score ${top.score} ${top.sample?'<span class="sample">sample</span>':''}`:'<span class="muted">Quiz ke baad yahan naam aayega.</span>'}</div></div></section>`;
};
function shareBtn(k){ return `<button class="btn ghost sm" data-share="${esc(k)}">${I('whatsapp','s')} Status poster</button>`; }
function contactForm(){ return `<form id="contactForm" class="fade-up">
  <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="field"><span>Naam</span><input class="in" name="name" required maxlength="80"></div>
  <div class="field"><span>Email</span><input class="in" type="email" name="email" required maxlength="120"></div>
  <div class="field"><span>Message</span><textarea class="in" name="message" required maxlength="1500"></textarea></div>
  <div class="field"><span>WhatsApp number (optional — owner WhatsApp par jawab de sakega)</span><input class="in" type="tel" name="phone" maxlength="15" inputmode="tel" placeholder="+91…"></div>
  <button class="btn" type="submit">${I('mail','s')} Bhejiye</button>
  <div id="contactOk" style="display:none;margin-top:16px;text-align:center"><svg class="tick" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40"/><path d="M26 47 L40 61 L65 33"/></svg><p>${esc(S().contact.thanks)}</p></div>
</form>`; }
function commentForm(){ return `<form id="commentForm" class="card" style="padding:16px">
  <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="field"><span>Naam</span><input class="in" name="name" required maxlength="60"></div>
  <div class="field"><span>Comment</span><textarea class="in" name="text" required maxlength="500" style="min-height:80px"></textarea></div>
  <button class="btn sm" type="submit">Comment bhejiye</button><p class="small muted" style="margin:10px 0 0">Comment owner ke approve karne ke baad dikhega.</p></form>`; }

V.library = () => {
  const cats = catList(); const rl = lastRead();
  return `<section class="sec" style="padding-top:34px"><div class="wrap">
    <div class="eyebrow">Taj Library</div><h2>Kitabein</h2>
    <p class="lead" style="margin-top:6px">Title, writer aur jild ke saath. Read Now par kitab usi waqt khul jaati hai.</p>
    ${rl?`<div class="resume fade-up"><div><b>Resume Reading</b><div class="small muted">${esc(rl.title)} · Jild ${esc(rl.volume)}</div></div><a class="btn sm" href="#/book/${esc(rl.gid)}">Wahin se shuru ${I('right','s')}</a></div>`:''}
    <div style="display:grid;gap:10px;margin:18px 0 12px">
      <div class="srch">${I('search','s')}<input class="in" id="libSearch" placeholder="Search: title, writer, ya urdu naam" style="padding-left:42px"></div>
      <div class="chips" id="libChips">${cats.map((c,i)=>`<button class="chip ${i===0?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    </div>
    <div class="book-grid" id="bookGrid"></div>
    <div id="libEmpty" class="empty" style="display:none;margin-top:14px">Koi kitab nahi mili. Search badal kar dekhiye.</div>
  </div></section>`;
};
function paintLibrary(){
  const q = ($('#libSearch')||{}).value ? $('#libSearch').value.trim().toLowerCase() : '';
  const cat = (($('#libChips .chip.on'))||{}).dataset ? $('#libChips .chip.on').dataset.cat : 'All';
  const list = D.books.map((g,gid)=>({g,gid})).filter(({g})=> (cat==='All'||g.category===cat) && (!q || [g.title,g.writer,g.urdu_title,g.urdu_writer,g.category].join(' ').toLowerCase().includes(q)));
  $('#bookGrid').innerHTML = list.map(({g,gid})=>`<a class="book fade-up in" href="#/book/${gid}">${cover(g)}<div><div class="vol">${esc(g.category)}</div><h4>${esc(g.title)}</h4><div class="ur ur-t">${esc(g.urdu_title)}</div><div class="meta">${esc(g.writer)}</div><div class="meta">${g.volumes.length} jild</div></div></a>`).join('');
  $('#libEmpty').style.display = list.length? 'none':'block';
}
V.book = (gid) => {
  const g = D.books[+gid]; if(!g) return `<section class="sec"><div class="wrap"><div class="empty">Ye kitab nahi mili. <a href="#/library">Library par wapas</a></div></div></section>`;
  const rl = lastRead(); const sel = (rl && rl.gid==+gid) ? rl.volIdx : 0;
  const v0 = g.volumes[sel] || g.volumes[0];
  return `<section class="sec" style="padding-top:28px"><div class="wrap">
    <a class="small muted" href="#/library">${I('left','s')} Library</a>
    <div class="book-hero" style="margin-top:14px">
      ${cover(g,'fade-up')}
      <div class="fade-up">
        <div class="vol">${esc(g.category)} · ${g.volumes.length} jild</div>
        <h2 style="margin:6px 0 4px">${esc(g.title)}</h2>
        <div class="ur" style="font-size:20px">${esc(g.urdu_title)}</div>
        <p class="muted" style="margin:10px 0 0">${esc(g.writer)}</p>
        <div class="small muted ur">${esc(g.urdu_writer)}</div>
      </div>
    </div>
    <h3 style="margin:26px 0 12px">Jild chunein</h3>
    <div id="volList">${g.volumes.map((v,i)=>`<div class="vol-row"><span>Jild ${esc(v.volume)}</span>${v.read_url?`<button class="btn sm" data-read="${gid}:${i}">${I('book','s')} Read Now</button>`:`<span class="small muted">Link abhi nahi</span>`}</div>`).join('')}</div>
    <div style="margin-top:20px" id="readerBox">
      <div class="frame fade-up" id="readFrame"><iframe title="${esc(g.title)}" src="${esc(v0.read_url||'about:blank')}" allow="autoplay" loading="lazy"></iframe></div>
      <p class="small muted" style="margin-top:8px">Jild ${esc(v0.volume)} · Agar frame nahi khule to <a href="${esc(v0.read_url||'#')}" target="_blank" rel="noopener">naye tab me kholiye</a>. Ye kitab ka original link hai.</p>
    </div></div></section>`;
};
V.quiz = () => {
  const today = todayKey(); const qz = (D.quizzes||{})[today];
  return `<section class="sec" style="padding-top:28px"><div class="wrap">
    <div class="eyebrow">Taj Quiz</div><h2>Aaj ka Quiz</h2>
    <div class="cards" style="margin-top:18px;grid-template-columns:1fr">
      <div class="card fade-up" id="quizCard">${qz? quizStart(qz,today) : `<div class="small muted" style="letter-spacing:.4px;text-transform:uppercase">Agla quiz aane mein</div><div class="countdown" id="cd" style="margin-top:10px"></div><p style="margin-top:12px">No active quiz found — aaj ka quiz abhi live nahi hai. Countdown khatam hone par naya quiz khulega.</p>`}</div>
    </div>
    <h3 style="margin:28px 0 10px">Rules</h3>
    <ol class="rules">${(S().rules||[]).map(r=>`<li>${esc(r)} ${/sample/i.test(r)?'<span class="sample">sample</span>':''}</li>`).join('')}</ol>
    <h3 style="margin:28px 0 10px">Leaderboard <span class="sample">naam + score sirf</span></h3>
    <div class="card" style="padding:8px 14px"><table class="lb"><thead><tr><th>#</th><th>Naam</th><th>Score</th></tr></thead><tbody>${sortedAttempts().slice(0,10).map((a,i)=>`<tr><td>${i+1}</td><td>${esc(firstName(a.name))} ${a.sample?'<span class="sample">sample</span>':''}</td><td>${a.score}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">Abhi koi score nahi.</td></tr>'}</tbody></table></div>
  </div></section>`;
};
function quizStart(qz,k){ return `<div class="eyebrow">${esc(qz.title||'Quiz')} ${qz.sample?'<span class="sample">sample questions — owner replace karega</span>':''}</div>
  <p class="muted small">${qz.questions.length} sawaal · Naam, phone aur address sirf admin dekhega.</p>
  <form id="quizForm" style="margin-top:12px">
    <div class="field"><span>Naam</span><input class="in" name="name" required maxlength="60"></div>
    <div class="field"><span>Phone</span><input class="in" name="phone" required inputmode="numeric" maxlength="15" pattern="[0-9+ ]{8,15}"></div>
    <div class="field"><span>Address (optional)</span><input class="in" name="address" maxlength="160"></div>
    <button class="btn" type="submit">Quiz shuru karein ${I('right','s')}</button>
  </form>`; }
function quizRun(qz,k,who){
  const st={i:0, score:0, ans:[]};
  const draw=()=>{ const q=qz.questions[st.i];
    $('#quizCard').innerHTML = `<div class="small muted">Sawaal ${st.i+1} / ${qz.questions.length}</div>
      <div class="bar" style="margin:8px 0 14px"><i style="width:${Math.round(100*st.i/qz.questions.length)}%"></i></div>
      <h3 style="margin-bottom:12px">${esc(q.q)}</h3>
      ${q.options.map((o,j)=>`<button class="opt" data-o="${j}"><span class="k">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}`;
    $$('#quizCard .opt').forEach(b=>b.onclick=()=>{ const j=+b.dataset.o; $$('#quizCard .opt').forEach(x=>x.style.pointerEvents='none'); const ok=j===q.answer; if(ok) st.score++; b.classList.add(ok?'right':'wrong'); if(!ok) $$('#quizCard .opt')[q.answer].classList.add('right'); setTimeout(()=>{ st.i++; if(st.i<qz.questions.length) draw(); else finish(); }, 900); });
  };
  const finish=async()=>{
    $('#quizCard').innerHTML = `<svg class="tick" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40"/><path d="M26 47 L40 61 L65 33"/></svg><div class="center"><h3>${esc(firstName(who.name))}, aapka score ${st.score} / ${qz.questions.length}</h3><p class="muted">Result save ho gaya. Leaderboard par sirf naam aur score dikhega.</p></div>`;
    requestAnimationFrame(()=>$$('#quizCard .tick').forEach(t=>t.classList.add('on')));
    try{ await TajStore.submit('attempts', {name:who.name, phone:who.phone, address:who.address||'', score:st.score, total:qz.questions.length, quizDate:k, created: todayKey()}); D.attempts = (D.attempts||[]); D.attempts.unshift({id:'x'+Date.now(), name:who.name, score:st.score, created:todayKey()}); }catch(e){ toast('Save nahi hua, dobara try karein'); }
  };
  draw();
}
V.paigham = (k) => {
  k = k || todayKey(); const p = paighamFor(k); const isToday = k===todayKey();
  return `<section class="sec" style="padding-top:28px"><div class="wrap">
    <div class="eyebrow">Aaj Ka Paigham</div>
    <div class="paigham fade-up" style="margin-top:8px">
      <div class="date"><span>${fmt(k)}</span><span>${esc(hijri(k))}</span></div>
      <p class="text" id="pText">${esc(p.text)}</p>
      <div class="ref">${esc(p.ref||'')} ${p.sample||p.placeholder?'<span class="sample">sample — owner to replace</span>':''}</div>
      <div class="tools">
        <button class="listen btn ghost sm" data-listen="${esc(k)}" id="listenBtn">${I('play','s')} Listen</button>
        <button class="btn ghost sm" data-share="${esc(k)}">${I('whatsapp','s')} WhatsApp status poster</button>
        <button class="btn ghost sm" data-share-text="${esc(k)}">${I('share','s')} Text share</button>
      </div>
      <p class="small muted" style="margin-top:14px">Listen browser ki awaaz hai, Quran ki tilawat nahi. Roman/Urdu paragraph text ke liye.</p>
    </div>
    <div class="tools" style="margin-top:18px"><a class="btn ghost sm" href="#/paigham/${addDays(k,-1)}">${I('left','s')} Kal</a>${isToday?'':`<a class="btn ghost sm" href="#/paigham">Aaj</a>`}<a class="btn ghost sm" href="#/paigham/${addDays(k,1)}">Agla ${I('right','s')}</a></div>
  </div></section>`;
};
V.updates = () => { const up=(D.updates||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))); return `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="eyebrow">Latest Updates & Announcements</div><div class="timeline" style="margin-top:14px">${up.map(u=>`<div class="tl fade-up"><div class="d">${fmt(u.date)} ${u.isNew?'<span class="pulse"></span>':''}</div><p style="margin-top:4px">${esc(u.text)} ${u.sample?'<span class="sample">sample</span>':''}</p></div>`).join('') || '<div class="empty">Abhi koi update nahi.</div>'}</div></div></section>`; };
V.videos = () => { const id = youtubeId(S().youtube.url); return `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="eyebrow">Videos</div><h2>Featured</h2><div class="frame" style="margin-top:14px">${id?`<iframe class="yt" src="https://www.youtube-nocookie.com/embed/${id}" allowfullscreen title="${esc(S().youtube.title||'')}"></iframe>`:`<div class="ph"><div>${I('video','l')}<p style="margin-top:8px">Video link admin se daala jayega (YouTube link paste karne par title aur thumbnail auto aate hain).</p><span class="sample">placeholder</span></div></div>`}</div><p class="small muted" style="margin-top:10px">${id?esc(S().youtube.title||''):''}</p></div></section>`; };
V.gallery = () => `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="eyebrow">Gallery</div><h2>Tasveerein</h2><p class="small muted" style="margin:6px 0 16px">Tile par click karke bada dekhiye. Sab tiles abhi sample hain.</p><div class="masonry">${(D.gallery||[]).map(g=>`<figure class="fade-up" data-lb="${esc(g.src)}" data-cap="${esc(g.caption)}"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.caption)}" style="aspect-ratio:${g.h?'auto':'1'}"><figcaption>${esc(g.caption)} ${g.sample?'<span class="sample">sample</span>':''}</figcaption></figure>`).join('')}</div></div></section>`;
V.about = () => `<section class="sec" style="padding-top:28px"><div class="wrap">
  <div class="eyebrow">About</div><h2>Hamara Mission</h2><p class="lead" style="margin-top:10px">${E('about.mission', S().about.mission, 'span')}</p>
  <p class="muted" style="margin-top:12px">${E('about.trust', S().about.trust, 'span')}</p>
  <h3 style="margin:34px 0 12px">Our History</h3>
  <div class="hscroll" style="display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 14px">${(S().about.history||[]).map(h=>`<div class="card" style="min-width:240px;scroll-snap-align:start"><div class="vol">${esc(h.year)}</div><p style="margin:6px 0 0">${esc(h.text)}</p></div>`).join('')}</div>
  <h3 style="margin:30px 0 12px">Hamari Khidmat</h3><div class="cards">${(S().khidmat||[]).map(k=>`<div class="card"><div class="feature-ico">${I('users')}</div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div>`).join('')}</div>
</div></section>`;
V.khidmat = () => `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="eyebrow">Hamari Khidmat</div><div class="cards">${(S().khidmat||[]).map(k=>`<div class="card fade-up"><div class="feature-ico">${I('users')}</div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div>`).join('')}</div></div></section>`;
V.tawwun = () => { const t=S().tawwun; const g=S().taawun; const pct=Math.min(100, Math.round(100*(g.raised||0)/Math.max(1,g.goal||1))); return `<section class="sec" style="padding-top:28px"><div class="wrap">
  <div class="eyebrow">Tawwun Page</div><h2>${esc(t.trust)}</h2><p class="muted" style="margin-top:6px">${esc(t.address)}</p>
  <div class="cards" style="margin-top:18px">${t.options.map(o=>`<div class="card fade-up"><div class="feature-ico">${I('heart')}</div><h3>${esc(o)}</h3><p class="small">Owner is option ki details likhega.</p></div>`).join('')}</div>
  <div class="card" style="margin-top:18px"><div class="eyebrow">Ta'awun Goal</div><h3>${esc(g.label)}</h3><div class="bar" style="margin:14px 0 8px"><i data-w="${pct}"></i></div><div class="small muted">${esc(g.currency||'')}${(g.raised||0).toLocaleString('en-IN')} / ${esc(g.currency||'')}${(g.goal||0).toLocaleString('en-IN')} <span class="sample">owner update karega</span></div></div>
  <div class="card" style="margin-top:14px"><p class="small">${esc(t.note)}</p><a class="btn ghost sm" href="#/contact">Owner se contact karein ${I('right','s')}</a></div>
</div></section>`; };
V.contact = () => `<section class="sec" style="padding-top:28px"><div class="wrap"><div class="eyebrow">Connect</div><h2>Share Your Thoughts</h2><div style="max-width:560px;margin-top:16px">${contactForm()}</div></div></section>`;

/* ---------- route + paint ---------- */
function route(){
  const h = location.hash || '#/';
  let html='', kind='home', arg=null;
  if(h==='#/'||h==='#'||h==='') { kind='home'; }
  else if(h==='#/library'){ kind='library'; }
  else if(h.startsWith('#/book/')){ kind='book'; arg=h.split('/')[2]; }
  else if(h==='#/quiz'){ kind='quiz'; }
  else if(h.startsWith('#/paigham')){ kind='paigham'; arg=h.split('/')[2]||null; }
  else if(h==='#/updates'){ kind='updates'; }
  else if(h==='#/videos'){ kind='videos'; }
  else if(h==='#/gallery'){ kind='gallery'; }
  else if(h==='#/about'){ kind='about'; }
  else if(h==='#/tawwun'){ kind='tawwun'; }
  else if(h==='#/khidmat'){ kind='khidmat'; }
  else if(h==='#/contact'){ kind='contact'; }
  else kind='home';
  const fn = {home:V.home, library:V.library, book:()=>V.book(arg), quiz:V.quiz, paigham:()=>V.paigham(arg), updates:V.updates, videos:V.videos, gallery:V.gallery, about:V.about, tawwun:V.tawwun, khidmat:V.khidmat, contact:V.contact}[kind];
  html = fn();
  const main = $('#app'); main.innerHTML = html;
  $$('#app .sec').forEach(s=>{ if(!s.querySelector('.wrap') && s.innerHTML.trim()==='') s.remove(); });
  if(kind==='library'){ paintLibrary(); }
  bind(main, kind, arg);
  reveal(main);
  setTimeout(()=>{ $$('[data-w]',main).forEach(i=>i.style.width=i.dataset.w+'%'); },120);
  applySize();
  if(!location.hash.startsWith('#/quiz') && window._quizTimer){ clearInterval(window._quizTimer); }
  if(kind==='home' && !location.hash.includes('#/')) window.scrollTo(0,0);
  else if(!(location.hash.startsWith('#/contact')) ) window.scrollTo({top:0, behavior:'instant'});
  document.title = (kind==='home'?'':'') + (S().brand||'Paighaam-e-Tajushshariah');
  $$('#drawer nav a').forEach(a=>a.classList.toggle('cur', a.getAttribute('href')===(location.hash||'#/')));
}
function bind(root, kind, arg){
  // library
  const ls = $('#libSearch'); if(ls) ls.oninput = paintLibrary;
  $$('#libChips .chip').forEach(c=>c.onclick=()=>{ $$('#libChips .chip').forEach(x=>x.classList.toggle('on', x===c)); paintLibrary(); });
  // reading
  $$('[data-read]',root).forEach(b=>b.onclick=()=>{ const [gid,i]=b.dataset.read.split(':').map(Number); const g=D.books[gid]; const v=g.volumes[i];
    TajStore.setPrefs({}); localStorage.setItem('tajv2.lastread', JSON.stringify({gid, volIdx:i, title:g.title, volume:v.volume}));
    $('#readFrame iframe').src = v.read_url; $('#readFrame').scrollIntoView({behavior:'smooth', block:'center'}); toast('Jild '+v.volume+' khul rahi hai');
    $$('#volList .vol-row').forEach((r,j)=>r.style.borderColor = j===i?'var(--sage-d)':''); });
  // paigham + listen + share
  $$('[data-listen]',root).forEach(b=>b.onclick=()=>listen(b));
  $$('[data-share]',root).forEach(b=>b.onclick=()=>poster(b.dataset.share));
  $$('[data-share-text]',root).forEach(b=>b.onclick=()=>{ const p=paighamFor(b.dataset.shareText); const url = `https://wa.me/?text=${encodeURIComponent(p.text+(p.ref?'\n— '+p.ref:'')+'\n\n'+location.href.split('#')[0])}`; window.open(url,'_blank','noopener'); });
  // lightbox
  $$('[data-lb]',root).forEach(f=>f.onclick=()=>lightbox(f.dataset.lb, f.dataset.cap));
  // progress bars on in-view
  // quiz
  if(kind==='quiz'){
    const card = $('#quizCard'); const today=todayKey(); const qz=(D.quizzes||{})[today];
    if(qz){ const form=$('#quizForm'); form.onsubmit=e=>{ e.preventDefault(); const f=new FormData(form); const who={name:f.get('name').trim(), phone:f.get('phone').trim(), address:(f.get('address')||'').trim()}; if(who.phone.replace(/\D/g,'').length<8){ toast('Phone number sahi daaliye'); return; } quizRun(qz,today,who); }; }
    else { startCountdown(); }
  }
  // forms
  const cf = $('#contactForm'); if(cf) cf.onsubmit = async e=>{ e.preventDefault(); const f=new FormData(cf); if(f.get('website')) return; if(!rateOk('contact')) { toast('Thoda ruk kar dobara bhejiye'); return; }
    const row={name:f.get('name').trim(), email:f.get('email').trim(), phone:(f.get('phone')||'').trim(), message:f.get('message').trim(), created:todayKey(), read:false, status:'new'};
    try{ await TajStore.submit('messages', row); D.messages=(D.messages||[]); D.messages.unshift(Object.assign({id:'x'+Date.now()}, row)); cf.querySelectorAll('.field,.btn').forEach(x=>x.style.display='none'); $('#contactOk').style.display='block'; requestAnimationFrame(()=>$('#contactOk .tick').classList.add('on')); }catch(err){ toast('Message nahi gaya. Dobara try karein.'); } };
  const cm = $('#commentForm'); if(cm) cm.onsubmit = async e=>{ e.preventDefault(); const f=new FormData(cm); if(f.get('website')) return; if(!rateOk('comment')) { toast('Thoda ruk kar dobara bhejiye'); return; }
    try{ await TajStore.submit('comments', {name:f.get('name').trim(), text:f.get('text').trim(), created:todayKey(), status:'pending'}); cm.reset(); toast('Shukriya — comment owner ke approve karne ke baad dikhega'); }catch(err){ toast('Comment nahi gaya'); } };
  // hero slideshow
  const slides = $$('.hero-art .slide', root); if(slides.length>1){ let n=0; const dots=$$('.hero-art .dots i', root); clearInterval(window._heroT); window._heroT=setInterval(()=>{ slides[n].classList.remove('on'); dots[n]&&dots[n].classList.remove('on'); n=(n+1)%slides.length; slides[n].classList.add('on'); dots[n]&&dots[n].classList.add('on'); }, 5200); }
  // learn more + smooth anchors ok
  // gallery/photos
  if(kind==='home' && $('#homePaigham')) {}
  // settings in drawer
  // edit mode
  if(document.body.classList.contains('editing')) enableEditing(root);
}
function rateOk(k){ const key='tajv2.rate.'+k; const last=+(localStorage.getItem(key)||0); if(Date.now()-last<30000) return false; localStorage.setItem(key, String(Date.now())); return true; }
function startCountdown(){ const el=$('#cd'); if(!el) return; const tick=()=>{ const now=ist(); const next=new Date(now); next.setHours(24,0,0,0); let s=Math.max(0,Math.floor((next-now)/1000)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; el.innerHTML=`<div><b>${String(h).padStart(2,'0')}</b><span>Ghante</span></div><div><b>${String(m).padStart(2,'0')}</b><span>Minute</span></div><div><b>${String(x).padStart(2,'0')}</b><span>Second</span></div>`; }; tick(); clearInterval(window._quizTimer); window._quizTimer=setInterval(tick,1000); }
function lightbox(src, cap){ let lb=$('#lightbox'); if(!lb){ lb=document.createElement('div'); lb.id='lightbox'; lb.className='lightbox'; document.body.appendChild(lb); } lb.innerHTML=`<button class="x iconbtn" aria-label="Close">${I('close')}</button><img src="${esc(src)}" alt=""><p>${esc(cap||'')}</p>`; requestAnimationFrame(()=>lb.classList.add('on')); lb.onclick=()=>lb.classList.remove('on'); }
let speaking=null;
function listen(btn){ const k=btn.dataset.listen; const p=paighamFor(k); if(!('speechSynthesis' in window)){ toast('Is browser me awaaz nahi hai'); return; }
  if(speechSynthesis.speaking){ speechSynthesis.cancel(); btn.classList.remove('on'); btn.innerHTML=I('play','s')+' Listen'; return; }
  const u=new SpeechSynthesisUtterance(p.text); u.lang = P.lang==='roman'?'en-IN':'en-IN'; u.rate=.92; u.onend=()=>{ btn.classList.remove('on'); btn.innerHTML=I('play','s')+' Listen'; }; speechSynthesis.speak(u); btn.classList.add('on'); btn.innerHTML=I('pause','s')+' Stop'; }
function poster(k){ const p=paighamFor(k); const c=document.createElement('canvas'); c.width=1080; c.height=1350; const x=c.getContext('2d');
  x.fillStyle='#FBF8F1'; x.fillRect(0,0,1080,1350); x.strokeStyle='#B8924A'; x.lineWidth=6; x.strokeRect(50,50,980,1250); x.lineWidth=1.5; x.strokeRect(70,70,940,1210);
  x.fillStyle='#5B7560'; x.font='600 44px Georgia,serif'; x.textAlign='center'; x.fillText('PAIGHAAM-E-TAJUSHSHARIAH',540,160);
  x.fillStyle='#B8924A'; x.font='500 30px Georgia,serif'; x.fillText(fmt(k)+'  ·  '+hijri(k),540,220);
  x.fillStyle='#2E3A33'; x.font='400 58px Georgia,serif'; wrap(x,p.text,540,470,840,80);
  x.fillStyle='#B8924A'; x.font='italic 34px Georgia,serif'; x.fillText(p.ref||'',540,1180);
  x.fillStyle='#6C7A70'; x.font='24px Georgia,serif'; x.fillText(p.sample||p.placeholder?'Sample — owner to replace':'',540,1240);
  c.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='paigham-'+k+'.png'; document.body.appendChild(a); a.click(); a.remove(); toast('Poster ban gaya — WhatsApp status me daal dijiye'); }, 'image/png'); }
function wrap(x,t,cx,y,max,lh){ const words=t.split(' '); let line=''; const lines=[]; words.forEach(w=>{ const test=line+w+' '; if(x.measureText(test).width>max && line){ lines.push(line.trim()); line=w+' '; } else line=test; }); lines.push(line.trim()); lines.slice(0,12).forEach((l,i)=>x.fillText(l,cx,y+i*lh)); }

/* ---------- edit mode (admin opens the real page with ?edit=1) ---------- */
function enableEditing(root){
  document.body.classList.add('editing');
  if(!$('#editBar')){ const b=document.createElement('div'); b.id='editBar'; b.style.cssText='position:fixed;left:0;right:0;bottom:0;background:#2F4A3A;color:#F5EED8;padding:10px 14px;font-size:13px;z-index:150;text-align:center'; b.innerHTML='Edit mode: pencil icon par click karke text ya link badlo. Bahar click karne par save ho jata hai. <a href="admin.html" style="color:#E7D6AE">Admin par wapas</a>'; document.body.appendChild(b); }
  $$('[data-edit]',root).forEach(el=>{ if(el.dataset.ed) return; el.dataset.ed='1'; el.style.outline='1px dashed var(--gold)'; el.style.outlineOffset='3px';
    const pb=document.createElement('button'); pb.className='iconbtn'; pb.style.cssText='display:inline-grid;width:28px;height:28px;margin-left:4px;vertical-align:middle;background:var(--gold-l)'; pb.innerHTML=I('pencil','s'); pb.title='Edit'; pb.onclick=(e)=>{ e.preventDefault(); e.stopPropagation(); el.contentEditable='true'; el.focus(); };
    el.after(pb);
    el.addEventListener('blur', async ()=>{ if(el.contentEditable!=='true') return; el.contentEditable='false'; const key=el.dataset.edit; const val=el.innerText.trim(); S().texts = Object.assign({}, S().texts||{}, {[key]: val}); await TajStore.saveSite({texts:S().texts}); toast('Save ho gaya'); });
    el.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); el.blur(); } });
  });
  $$('[data-edit-link]',root).forEach(a=>{ const pb=document.createElement('button'); pb.className='iconbtn'; pb.style.cssText='display:inline-grid;width:28px;height:28px;background:var(--gold-l)'; pb.innerHTML=I('link','s'); pb.onclick=async e=>{ e.preventDefault(); const nu=prompt('Naya link (https://...)', a.getAttribute('href')||''); if(nu){ a.setAttribute('href',nu); S().links=Object.assign({}, S().links||{}); await TajStore.saveSite({links:S().links, texts:S().texts}); toast('Link save ho gaya'); } }; a.after(pb); });
  // show hidden sections dimmed in edit mode is handled by sec()
}

/* ---------- boot ---------- */
async function boot(){
  P = TajStore.prefs();
  try{ D = await TajStore.load(); }catch(e){ console.error(e); D = (window.TajStore.exportDemo&&TajStore.exportDemo()) || {}; toast('Data load nahi hua — demo data dikh raha hai'); }
  D.site = Object.assign({}, window.TAJ_SEED.site, D.site||{});
  D.site.texts = D.site.texts||{}; D.site.sections = D.site.sections||{}; D.site.sizes = D.site.sizes||{mobile:100,desktop:100}; D.site.links = D.site.links||{};
  D.site.about = Object.assign({}, window.TAJ_SEED.site.about, D.site.about||{});
  D.site.taawun = Object.assign({}, window.TAJ_SEED.site.taawun, D.site.taawun||{});
  D.site.youtube = Object.assign({}, window.TAJ_SEED.site.youtube, D.site.youtube||{});
  D.site.tawwun = Object.assign({}, window.TAJ_SEED.site.tawwun, D.site.tawwun||{});
  D.books = (D.books&&D.books.length)? D.books : (window.TAJ_BOOKS||[]).map((g,i)=>Object.assign({}, g));
  D.paigham = D.paigham||{}; D.updates = D.updates||[]; D.gallery = D.gallery||[]; D.quizzes = D.quizzes||{}; D.comments = D.comments||[]; D.attempts = D.attempts||[];
  if(new URLSearchParams(location.search).get('edit')==='1' && TajStore.isAdmin()) document.body.classList.add('editing');
  if(P.theme==='dark') document.body.classList.add('dark');
  if(P.lang==null) P.lang='en';
  shell();
  if(demoOn()) $('#app-banner').innerHTML = demoBanner();
  window.addEventListener('hashchange', ()=>{ closeAll(); route(); });
  let rt; window.addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(applySize,200); });
  route();
  // header scroll effect
  window.addEventListener('scroll', ()=>{ document.querySelector('.topbar')?.classList.toggle('scrolled', scrollY>10); }, {passive:true});
}
function demoOn(){ return !TajStore.live; }
function demoBanner(){ return `<div class="demo-banner">DEMO MODE — not secure · preview sirf is phone par data rakhta hai · <b>live backend ke liye README</b></div>`; }
window.TAJ = { route, paighamFor, todayKey, D:()=>D };
document.addEventListener('DOMContentLoaded', boot);
})();
