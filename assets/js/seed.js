
/* Paighaam-e-Tajushshariah v2 — seed content (demo mode + first-run defaults).
   RECOVERED from the live original: book titles, writers, volumes, Read links, cover URLs, Tawwun trust name/address, section names.
   FILLER (marked sample): stats, updates, paigham texts, quiz questions, gallery tiles, comments, leaderboard, rules, legal drafts, mission text.
   Nothing here is a quote from Quran or Hadees. */
window.TAJ_SEED = {
  version: 1,
  site: {
    brand: "Paighaam-e-Tajushshariah",
    tagline: "Ilm ko samjhiye, adab ke saath",
    sub: "Kitabein, roz ka paigham, quiz aur ilm ki raah — ek saaf aur aasan jagah.",
    heroSlides: ["assets/img/hero.jpg"],
    heroCaption: "Hero photo slot — owner ki photo yahan aayegi",
    stats: [
      {label:"Resources", value:1000, suffix:"+", claimed:true},
      {label:"Readers", value:50, suffix:"K+", claimed:true},
      {label:"Quiz Questions", value:700, suffix:"+", claimed:true},
      {label:"Access", value:24, suffix:"/7", claimed:false}
    ],
    taawun: {label:"Welfare fund (sample — owner set karega)", goal:100000, raised:0, currency:"₹"},
    youtube: {url:"", title:"Featured video — owner link paste karega", thumb:""},
    sections: {stats:true, explore:true, paigham:true, updates:true, media:true, about:true, contact:true, comments:true, taawun:true, khidmat:true, tawwun:true},
    sizes: {mobile:100, desktop:100},
    texts: {},
    links: {facebook:"", instagram:"", youtube:"", x:""},
    about: {
      mission: "Sample — owner yahan apna official mission likhega. Ye jagah abhi filler hai.",
      trust: "Trust ka introduction (sample — owner likhega).",
      history: [
        {year:"Sample", text:"Owner ki history ka pehla point yahan aayega."},
        {year:"Sample", text:"Doosra milestone (sample)."},
        {year:"Sample", text:"Aaj ki sthiti (sample)."}
      ]
    },
    khidmat: [
      {title:"Muslim Bachhiyo Ke Liye School", text:"Sample — school ki details owner likhega."},
      {title:"Deeni Library Bareilly Me", text:"Sample — library ki details owner likhega."}
    ],
    tawwun: {
      trust: "Paigam-e-Tajushshariah Welfare Trust",
      address: "92 murav pura, gadhi chowki Bareilly (U.P.)",
      options: ["Zakaat","Sadqah","Atiyat","Qurbani"],
      note: "Bank / UPI details is page par nahi daale gaye. Owner jab de, tab yahin add hogi. Koi payment yahan process nahi hota."
    },
    rules: [
      "Quiz roz ek baar, us din ke paigham ke mutabiq — sample rule",
      "Naam, phone aur address sirf admin ko dikhega, public par sirf pehla naam aur score",
      "Ek phone number se ek hi entry — sample rule",
      "Result aur leaderboard owner ke control mein hain — sample rule"
    ],
    legal: {
      privacy: "DRAFT — owner to review. Hum aapka naam, email aur phone sirf us kaam ke liye lete hain jiske liye aap form bharte hain. Ye data public nahi hota. Kisi third party ko bechna nahi hai.",
      terms: "DRAFT — owner to review. Site ka content sirf padhne aur ilm ke liye hai. Content ka galat istemal na karein.",
      donation: "DRAFT — owner to review. Ta'awun ke niyam owner tay karega. Is site par payment process nahi hota."
    },
    contact: {thanks:"Shukriya — aapka paigam mil gaya. Owner jald dekhenge.", replyNote:"Replies WhatsApp par owner khud bhejega."},
    notice: "NEW FEATURES COMING SOON"
  },
  books: [],
  paigham: {
    "2026-11-04": {text:"Sample — owner yahan is din ka paigham likhega. Asli Quran/Hadees ka text owner khud daalega.", ref:"Sample reference", sample:true},
    "2026-11-05": {text:"Sample — owner yahan is din ka paigham likhega.", ref:"Sample reference", sample:true},
    "2026-11-06": {text:"Sample — owner yahan is din ka paigham likhega.", ref:"Sample reference", sample:true}
  },
  updates: [
    {id:"u1", date:"2026-11-04", text:"Sample — naya update yahan likha jayega (owner).", isNew:true, sample:true},
    {id:"u2", date:"2026-10-20", text:"Sample — purana update ka example.", isNew:false, sample:true}
  ],
  gallery: [
    {id:"g1", src:"assets/img/gallery-1.jpg", caption:"Sample tile — owner photo dalega", kind:"photo", sample:true, h:1.25},
    {id:"g2", src:"assets/img/gallery-2.jpg", caption:"Sample tile", kind:"photo", sample:true, h:0.8},
    {id:"g3", src:"assets/img/gallery-3.jpg", caption:"Sample tile", kind:"photo", sample:true, h:1},
    {id:"g4", src:"assets/img/gallery-4.jpg", caption:"Sample tile", kind:"photo", sample:true, h:1.3},
    {id:"g5", src:"assets/img/gallery-5.jpg", caption:"Sample tile", kind:"photo", sample:true, h:0.9},
    {id:"g6", src:"assets/img/gallery-6.jpg", caption:"Sample tile", kind:"photo", sample:true, h:1.1}
  ],
  quizzes: {
    "2026-11-05": {title:"Sample quiz", sample:true, questions:[
      {q:"Sample question 1 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:0},
      {q:"Sample question 2 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:2},
      {q:"Sample question 3 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:1}
    ]},
    "2026-11-04": {title:"Sample quiz", sample:true, questions:[
      {q:"Sample question 1 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:0},
      {q:"Sample question 2 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:2},
      {q:"Sample question 3 — owner asli sawal yahan daalega", options:["Option A","Option B","Option C","Option D"], answer:1}
    ]}
  },
  messages: [],
  comments: [
    {id:"c1", name:"Sample reader", text:"Sample comment — approve hone ke baad yahan dikhega.", created:"2026-11-03", status:"approved", sample:true}
  ],
  attempts: [
    {id:"a1", name:"Sample", score:3, phone:"", address:"", created:"2026-11-04", sample:true},
    {id:"a2", name:"Demo", score:2, phone:"", address:"", created:"2026-11-04", sample:true}
  ]
};
