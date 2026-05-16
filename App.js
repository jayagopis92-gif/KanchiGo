import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// DATA & CONSTANTS
// ═══════════════════════════════════════════════════════
const SERVICES = [
  { id:1, icon:"🔧", name:"Repair",      tamil:"பழுது",      color:"#7C3AED", bg:"rgba(255,107,53,0.12)" },
  { id:2, icon:"🧹", name:"Cleaning",    tamil:"சுத்தம்",    color:"#4ECDC4", bg:"rgba(78,205,196,0.12)" },
  { id:3, icon:"🚚", name:"Delivery",    tamil:"டெலிவரி",    color:"#45B7D1", bg:"rgba(69,183,209,0.12)" },
  { id:4, icon:"🎨", name:"Painting",    tamil:"பெயிண்ட்",   color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
  { id:5, icon:"⚡", name:"Electrical",  tamil:"மின்சாரம்",  color:"#FBBF24", bg:"rgba(251,191,36,0.12)" },
  { id:6, icon:"🪴", name:"Gardening",   tamil:"தோட்டம்",    color:"#34D399", bg:"rgba(52,211,153,0.12)" },
  { id:7, icon:"🍳", name:"Cooking",     tamil:"சமையல்",     color:"#F87171", bg:"rgba(248,113,113,0.12)" },
  { id:8, icon:"🚗", name:"Car Wash",    tamil:"கார் கழுவல்",color:"#60A5FA", bg:"rgba(96,165,250,0.12)" },
];

const PROVIDERS = [
  { id:1, name:"Rajan Kumar",   service:"Repair",     rating:4.8, jobs:142, price:300, avatar:"RK", location:"Chennai",     available:true,  earnings:12400, joined:"Jan 2024" },
  { id:2, name:"Priya Devi",    service:"Cleaning",   rating:4.9, jobs:98,  price:250, avatar:"PD", location:"Coimbatore", available:true,  earnings:9800,  joined:"Mar 2024" },
  { id:3, name:"Suresh M",      service:"Delivery",   rating:4.7, jobs:210, price:150, avatar:"SM", location:"Madurai",    available:false, earnings:18200, joined:"Nov 2023" },
  { id:4, name:"Kavitha R",     service:"Painting",   rating:4.6, jobs:67,  price:500, avatar:"KR", location:"Chennai",     available:true,  earnings:8900,  joined:"Feb 2024" },
  { id:5, name:"Anbu Selvan",   service:"Electrical", rating:4.5, jobs:55,  price:400, avatar:"AS", location:"Chennai",     available:true,  earnings:7200,  joined:"Apr 2024" },
  { id:6, name:"Deepa K",       service:"Gardening",  rating:4.7, jobs:80,  price:200, avatar:"DK", location:"Coimbatore", available:true,  earnings:6400,  joined:"May 2024" },
];

const STATUS_STEPS = ["Order Placed","Accepted","In Progress","Completed"];
const STATUS_COLOR = { "Order Placed":"#FBBF24","Accepted":"#60A5FA","In Progress":"#A78BFA","Completed":"#34D399" };

const SAMPLE_ORDERS = [
  { id:"ORD4521", customer:"Vikram S",  service:"Repair",   desc:"AC not cooling",    price:350, status:"Completed",   statusIndex:3, provider:"Rajan Kumar",  time:"2h ago",  rating:5 },
  { id:"ORD4520", customer:"Meena R",   service:"Cleaning", desc:"House deep clean",  price:800, status:"In Progress", statusIndex:2, provider:"Priya Devi",   time:"4h ago",  rating:null },
  { id:"ORD4519", customer:"Karthik P", service:"Delivery", desc:"Grocery delivery",  price:120, status:"Accepted",    statusIndex:1, provider:"Suresh M",     time:"1d ago",  rating:null },
  { id:"ORD4518", customer:"Anjali T",  service:"Painting", desc:"Living room walls", price:2500,status:"Completed",   statusIndex:3, provider:"Kavitha R",    time:"2d ago",  rating:4 },
];

const NOTIFICATIONS = [
  { id:1, icon:"✅", title:"Order Accepted",      msg:"Rajan Kumar accepted your repair request",      time:"5 min ago",  read:false },
  { id:2, icon:"🔔", title:"Provider Nearby",     msg:"Your provider is 2km away",                    time:"20 min ago", read:false },
  { id:3, icon:"⭐", title:"Rate your service",   msg:"How was Priya Devi's cleaning service?",        time:"2h ago",     read:true  },
  { id:4, icon:"💰", title:"Payment Received",    msg:"₹350 credited to your wallet",                  time:"3h ago",     read:true  },
  { id:5, icon:"🎉", title:"New Order!",           msg:"You have a new cleaning order from Meena R",   time:"5h ago",     read:true  },
];

const REVIEWS = [
  { id:1, customer:"Vikram S",  rating:5, comment:"Excellent service! Rajan fixed my AC in 30 mins.",  service:"Repair",   time:"2 days ago",  avatar:"VS" },
  { id:2, customer:"Anjali T",  rating:4, comment:"Good painting work. Clean and professional.",        service:"Painting",  time:"4 days ago",  avatar:"AT" },
  { id:3, customer:"Karthik P", rating:5, comment:"Super fast delivery. Very happy!",                  service:"Delivery",  time:"1 week ago",  avatar:"KP" },
  { id:4, customer:"Meena R",   rating:5, comment:"Priya did amazing cleaning. Will book again!",       service:"Cleaning",  time:"1 week ago",  avatar:"MR" },
];

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════
const C = {
  bg:      "#080B14",
  surface: "#0F1628",
  card:    "#141D35",
  border:  "rgba(255,255,255,0.07)",
  orange:  "#7C3AED",
  blue:    "#4B8EFF",
  green:   "#34D399",
  text:    "#F0F4FF",
  muted:   "#6B7A9F",
  input:   "#1A2440",
};

const g = {
  app:   { fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:C.bg, color:C.text, maxWidth:480, margin:"0 auto", position:"relative", overflowX:"hidden" },
  card:  { background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:20, marginBottom:14 },
  btn:   (c=C.orange,full=true) => ({ background:`linear-gradient(135deg,${c},${c}cc)`, color:"#fff", border:"none", borderRadius:14, padding:"14px 20px", fontSize:14, fontWeight:700, cursor:"pointer", width:full?"100%":"auto", marginBottom:10, boxShadow:`0 6px 20px ${c}30`, transition:"all 0.2s" }),
  btnGhost: { background:"transparent", border:`1px solid ${C.border}`, color:C.muted, borderRadius:14, padding:"12px 20px", fontSize:13, fontWeight:600, cursor:"pointer", width:"100%", marginBottom:10 },
  input: { background:C.input, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px 16px", fontSize:14, color:C.text, width:"100%", marginBottom:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  label: { fontSize:12, color:C.muted, marginBottom:5, display:"block", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" },
  badge: (c) => ({ background:c+"18", color:c, border:`1px solid ${c}30`, borderRadius:30, padding:"4px 12px", fontSize:11, fontWeight:700, display:"inline-block", letterSpacing:"0.03em" }),
  page:  { padding:"16px 18px 100px" },
  hdr:   { background:`linear-gradient(180deg,${C.surface},${C.bg}00)`, padding:"20px 18px 16px", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" },
  row:   { display:"flex", alignItems:"center", gap:10 },
  btw:   { display:"flex", justifyContent:"space-between", alignItems:"center" },
  tab:   { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", padding:"10px 0 14px", zIndex:100, backdropFilter:"blur(20px)" },
  tItem: (a) => ({ flex:1, textAlign:"center", cursor:"pointer", color:a?C.orange:C.muted, fontSize:9, fontWeight:a?800:500, transition:"all 0.2s" }),
  notif: (t) => ({ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", background:t==="error"?"#EF4444":t==="info"?"#3B82F6":"#10B981", color:"#fff", padding:"12px 24px", borderRadius:50, fontSize:13, fontWeight:700, zIndex:9999, boxShadow:"0 8px 30px rgba(0,0,0,0.4)", whiteSpace:"nowrap", letterSpacing:"0.02em" }),
  avatar:(c=C.orange,size=42) => ({ width:size, height:size, borderRadius:size/2, background:`linear-gradient(135deg,${c},${c}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:size*0.35, color:"#fff", flexShrink:0 }),
  star:  { color:"#FBBF24", fontSize:13 },
  divider: { height:1, background:C.border, margin:"16px 0" },
  chip:  (c=C.orange) => ({ background:c+"15", color:c, border:`1px solid ${c}25`, borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", display:"inline-block" }),
};

// ═══════════════════════════════════════════════════════
// SMALL REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════
const Toast = ({notif}) => notif ? <div style={g.notif(notif.type)}>{notif.msg}</div> : null;
const Badge = ({status}) => <span style={g.badge(STATUS_COLOR[status]||C.muted)}>{status}</span>;
const Stars = ({n=5}) => <span style={g.star}>{"★".repeat(Math.floor(n))}{"☆".repeat(5-Math.floor(n))} <span style={{color:C.muted,fontSize:11}}>{n}</span></span>;
const Divider = () => <div style={g.divider}/>;

const AvatarCircle = ({text,color=C.orange,size=42}) => (
  <div style={g.avatar(color,size)}>{text?.slice(0,2).toUpperCase()}</div>
);

const BackHeader = ({title,sub,onBack,right}) => (
  <div style={g.hdr}>
    <div style={g.btw}>
      <div style={g.row}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.orange,fontSize:22,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
        <div>
          <div style={{fontWeight:800,fontSize:17,color:C.text}}>{title}</div>
          {sub && <div style={{fontSize:12,color:C.muted,marginTop:1}}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  </div>
);

const StatCard = ({val,label,color,icon}) => (
  <div style={{...g.card,textAlign:"center",marginBottom:0,padding:"16px 12px"}}>
    <div style={{fontSize:20}}>{icon}</div>
    <div style={{fontSize:22,fontWeight:900,color,marginTop:4,letterSpacing:"-0.02em"}}>{val}</div>
    <div style={{fontSize:11,color:C.muted,marginTop:3,fontWeight:600}}>{label}</div>
  </div>
);

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [screen,    setScreen]    = useState("landing");
  const [userType,  setUserType]  = useState(null);
  const [user,      setUser]      = useState(null);
  const [form,      setForm]      = useState({name:"",phone:"",email:"",location:"",service:""});
  const [selSvc,    setSelSvc]    = useState(null);
  const [selProv,   setSelProv]   = useState(null);
  const [bookDesc,  setBookDesc]  = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [orders,    setOrders]    = useState(SAMPLE_ORDERS);
  const [activeOrd, setActiveOrd] = useState(null);
  const [provOrds,  setProvOrds]  = useState([
    {id:"ORD4525",customer:"Vikram S",service:"Repair",  desc:"AC not cooling",  price:350,status:"Order Placed",statusIndex:0,time:"5 min ago"},
    {id:"ORD4524",customer:"Meena R", service:"Repair",  desc:"Fan making noise",price:200,status:"Order Placed",statusIndex:0,time:"20 min ago"},
    {id:"ORD4523",customer:"Raj K",   service:"Repair",  desc:"Fridge leaking",  price:450,status:"Accepted",   statusIndex:1,time:"1h ago"},
  ]);
  const [notifs,    setNotifs]    = useState(NOTIFICATIONS);
  const [tab,       setTab]       = useState("home");
  const [toast,     setToast]     = useState(null);
  const [adminTab,  setAdminTab]  = useState("overview");
  const [ratingVal, setRatingVal] = useState(0);
  const [reviewText,setReviewText]= useState("");
  const [payMethod, setPayMethod] = useState("upi");
  const [searchQ,   setSearchQ]   = useState("");

  const go = (s) => { setScreen(s); setTab("home"); window.scrollTo(0,0); };
  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const unreadCount = notifs.filter(n=>!n.read).length;

  const doRegister = () => {
    if(!form.name||!form.phone){showToast("பேரு & Phone தேவை!","error");return;}
    setUser({...form,type:userType});
    showToast(`வரவேற்கிறோம், ${form.name}! 🎉`);
    go(userType==="customer"?"cust":userType==="provider"?"prov":"admin");
  };

  const placeOrder = () => {
    if(!bookDesc||!bookPrice){showToast("விவரம் & விலை கொடுங்க!","error");return;}
    const o={id:"ORD"+Math.floor(Math.random()*9000+1000),customer:user?.name||"You",service:selSvc,desc:bookDesc,price:bookPrice,status:"Order Placed",statusIndex:0,provider:selProv?.name,time:"just now",rating:null};
    setOrders(p=>[o,...p]);
    setActiveOrd(o);
    setBookDesc("");setBookPrice("");
    showToast("Order போச்சு! ✅");
    setScreen("track");
  };

  const advanceOrder = (oid) => {
    const upd = arr => arr.map(o=>o.id===oid&&o.statusIndex<STATUS_STEPS.length-1?{...o,statusIndex:o.statusIndex+1,status:STATUS_STEPS[o.statusIndex+1]}:o);
    setOrders(upd);
    setActiveOrd(prev=>prev&&prev.id===oid?{...prev,statusIndex:Math.min(prev.statusIndex+1,3),status:STATUS_STEPS[Math.min(prev.statusIndex+1,3)]}:prev);
    showToast("Status updated! 🔔","info");
  };

  const acceptProv=(id)=>{setProvOrds(p=>p.map(o=>o.id===id?{...o,status:"Accepted",statusIndex:1}:o));showToast("Accept பண்ணீங்க! 👍");};
  const rejectProv=(id)=>{setProvOrds(p=>p.filter(o=>o.id!==id));showToast("Reject பண்ணீங்க","error");};
  const completeProv=(id)=>{setProvOrds(p=>p.map(o=>o.id===id?{...o,status:"Completed",statusIndex:3}:o));showToast("Complete! 💰 ₹ credited");};
  const markAllRead=()=>{setNotifs(p=>p.map(n=>({...n,read:true})));showToast("எல்லாமே read! ✅","info");};
  const submitReview=()=>{if(!ratingVal){showToast("Rating கொடுங்க!","error");return;}showToast("Review submit ஆச்சு! ⭐");setRatingVal(0);setReviewText("");go("cust");};

  const filteredProviders = PROVIDERS.filter(p =>
    (!searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.service.toLowerCase().includes(searchQ.toLowerCase()))
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: LANDING
  // ─────────────────────────────────────────────────────
  if(screen==="landing") return (
    <div style={{...g.app,minHeight:"100vh",display:"flex",flexDirection:"column",background:`radial-gradient(ellipse at top,#1a2540 0%,${C.bg} 60%)`}}>
      <Toast notif={toast}/>
      {/* Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px 24px",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#7C3AED,#9333EA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:24,boxShadow:"0 20px 60px rgba(255,107,53,0.35)"}}>🤝</div>
        <div style={{fontSize:38,fontWeight:900,letterSpacing:"-0.03em",marginBottom:8,lineHeight:1.1}}>
          <span style={{background:"linear-gradient(90deg,#7C3AED,#9333EA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Kanchi</span>
          <span style={{color:C.text}}>Connect</span>
        </div>
        <div style={{fontSize:15,color:C.muted,marginBottom:6,fontWeight:500}}>காஞ்சியின் நம்பகமான சேவை</div>
        <div style={{fontSize:13,color:"#3a4560",marginBottom:40}}>Kanchipuram-ல் உடனே உதவி கிடைக்கும்!</div>

        {/* Feature pills */}
        <div style={{display:"flex",gap:8,marginBottom:36,flexWrap:"wrap",justifyContent:"center"}}>
          {["✅ Fast Service","💰 Set Your Price","⭐ Verified Pros","🔒 Secure Pay"].map(f=>(
            <div key={f} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 14px",fontSize:11,color:C.muted,fontWeight:600}}>{f}</div>
          ))}
        </div>

        {/* Role selection */}
        <div style={{width:"100%",maxWidth:360}}>
          <div style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:14,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>நீங்கள் யார்?</div>
          <button style={g.btn()} onClick={()=>{setUserType("customer");go("auth");}}>
            🛒 Customer — எனக்கு உதவி வேணும்
          </button>
          <button style={g.btn("#4ECDC4")} onClick={()=>{setUserType("provider");go("auth");}}>
            🔨 Service Provider — நான் உதவி செய்வேன்
          </button>
          <button style={g.btn("#6B7A9F")} onClick={()=>{setUserType("admin");go("auth");}}>
            🛡️ Admin — Platform Manage பண்றேன்
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{background:"rgba(255,255,255,0.03)",borderTop:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",justifyContent:"space-around"}}>
        {[["1,200+","Providers"],["8,500+","Orders"],["4.8 ⭐","Rating"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontWeight:800,fontSize:16,color:C.orange}}>{v}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: AUTH (Login / Register)
  // ─────────────────────────────────────────────────────
  if(screen==="auth") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title="Register" sub={userType==="customer"?"Customer ஆக இணையுங்கள்":userType==="provider"?"Provider ஆக இணையுங்கள்":"Admin Login"} onBack={()=>go("landing")}/>
      <div style={g.page}>
        {/* Type badge */}
        <div style={{...g.card,textAlign:"center",marginBottom:20,padding:24}}>
          <div style={{fontSize:48,marginBottom:10}}>{userType==="customer"?"🛒":userType==="provider"?"🔨":"🛡️"}</div>
          <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:4}}>
            {userType==="customer"?"Customer Account":userType==="provider"?"Provider Account":"Admin Account"}
          </div>
          <div style={{fontSize:13,color:C.muted}}>{userType==="customer"?"Service book பண்ணுங்கள்":userType==="provider"?"Skill வைத்து சம்பாரியுங்கள்":"Platform manage பண்ணுங்கள்"}</div>
        </div>

        <label style={g.label}>பேரு *</label>
        <input style={g.input} placeholder="உங்கள் பேரு" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <label style={g.label}>Phone *</label>
        <input style={g.input} placeholder="9876543210" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <label style={g.label}>Email</label>
        <input style={g.input} placeholder="email@example.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <label style={g.label}>Location</label>
        <input style={g.input} placeholder="Chennai / Coimbatore / Madurai..." value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>

        {userType==="provider" && <>
          <label style={g.label}>உங்கள் Service என்ன? *</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {SERVICES.map(s=>(
              <div key={s.id} onClick={()=>setForm({...form,service:s.name})}
                style={{...g.card,display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"12px 14px",marginBottom:0,border:form.service===s.name?`2px solid ${s.color}`:`1px solid ${C.border}`,background:form.service===s.name?s.bg:C.card,transition:"all 0.2s"}}>
                <span style={{fontSize:24}}>{s.icon}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.tamil}</div></div>
              </div>
            ))}
          </div>
        </>}

        <button style={g.btn()} onClick={doRegister}>✅ Register பண்ணுங்கள்</button>
        <div style={{textAlign:"center",fontSize:12,color:C.muted}}>Free Registration · No hidden fees</div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: CUSTOMER HOME
  // ─────────────────────────────────────────────────────
  if(screen==="cust") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      {/* Header */}
      <div style={g.hdr}>
        <div style={g.btw}>
          <div>
            <div style={{fontSize:13,color:C.muted,fontWeight:600}}>வணக்கம் 👋</div>
            <div style={{fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-0.02em"}}>{user?.name||"Guest"}</div>
          </div>
          <div style={g.row}>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("notif")}>
              <div style={{fontSize:22}}>🔔</div>
              {unreadCount>0 && <div style={{position:"absolute",top:-4,right:-4,background:C.orange,borderRadius:10,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{unreadCount}</div>}
            </div>
            <div style={{...g.avatar(C.orange,36),cursor:"pointer",fontSize:13}} onClick={()=>setTab("profile")}>{user?.name?.slice(0,2)||"G"}</div>
          </div>
        </div>
        {/* Search */}
        <div style={{position:"relative",marginTop:12}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔍</span>
          <input style={{...g.input,paddingLeft:40,marginBottom:0,borderRadius:50,background:C.input}} placeholder="Service search பண்ணுங்க..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} onFocus={()=>{setSearchQ("");go("provlist");}}/>
        </div>
      </div>

      <div style={g.page}>
        {tab==="home" && <>
          {/* Services */}
          <div style={{fontSize:15,fontWeight:800,marginBottom:14,color:C.text}}>என்ன Service வேணும்? 🔍</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
            {SERVICES.map(s=>(
              <div key={s.id} onClick={()=>{setSelSvc(s.name);go("provlist");}}
                style={{background:s.bg,border:`1px solid ${s.color}25`,borderRadius:18,padding:"16px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all 0.2s"}}>
                <div style={{fontSize:30}}>{s.icon}</div>
                <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.tamil}</div></div>
              </div>
            ))}
          </div>

          {/* Active orders */}
          <div style={g.btw}><div style={{fontSize:15,fontWeight:800,color:C.text}}>Recent Orders</div><span style={{...g.chip(),fontSize:11}} onClick={()=>setTab("orders")}>View All →</span></div>
          <div style={{marginTop:12}}>
            {orders.slice(0,3).map(o=>(
              <div key={o.id} style={{...g.card,cursor:"pointer"}} onClick={()=>{setActiveOrd(o);setScreen("track");}}>
                <div style={g.btw}>
                  <div style={g.row}>
                    <div style={{fontSize:22}}>{SERVICES.find(s=>s.name===o.service)?.icon||"🔧"}</div>
                    <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{o.service} — {o.desc}</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>#{o.id} · {o.time}</div></div>
                  </div>
                  <Badge status={o.status}/>
                </div>
                <Divider/>
                <div style={g.btw}>
                  <div style={{fontSize:12,color:C.muted}}>👨‍🔧 {o.provider}</div>
                  <div style={{fontWeight:800,color:C.orange,fontSize:14}}>₹{o.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Providers */}
          <div style={{fontSize:15,fontWeight:800,marginTop:8,marginBottom:14,color:C.text}}>Top Providers ⭐</div>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none"}}>
            {PROVIDERS.filter(p=>p.available).map(p=>(
              <div key={p.id} style={{...g.card,minWidth:160,marginBottom:0,cursor:"pointer",flexShrink:0}} onClick={()=>{setSelProv(p);go("book");}}>
                <div style={{textAlign:"center"}}>
                  <AvatarCircle text={p.avatar} color={SERVICES.find(s=>s.name===p.service)?.color||C.orange} size={44}/>
                  <div style={{fontWeight:700,fontSize:13,marginTop:8,color:C.text}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.muted}}>{p.service}</div>
                  <Stars n={p.rating}/>
                  <div style={{fontSize:12,fontWeight:700,color:C.orange,marginTop:6}}>From ₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {tab==="orders" && <>
          <div style={{fontSize:15,fontWeight:800,marginBottom:14,color:C.text}}>📋 என் Orders</div>
          {orders.map(o=>(
            <div key={o.id} style={{...g.card,cursor:"pointer"}} onClick={()=>{setActiveOrd(o);setScreen("track");}}>
              <div style={g.btw}><div style={{fontWeight:800,fontSize:12,color:C.muted}}>#{o.id}</div><Badge status={o.status}/></div>
              <div style={{fontSize:14,fontWeight:600,margin:"8px 0",color:C.text}}>{o.service} — {o.desc}</div>
              <div style={g.btw}>
                <div style={{fontSize:12,color:C.muted}}>👨‍🔧 {o.provider} · {o.time}</div>
                <div style={{fontWeight:800,color:C.orange}}>₹{o.price}</div>
              </div>
              {o.status==="Completed" && o.rating && <div style={{marginTop:8}}><Stars n={o.rating}/></div>}
            </div>
          ))}
        </>}

        {tab==="profile" && (
          <div>
            <div style={{...g.card,textAlign:"center",padding:28}}>
              <AvatarCircle text={user?.name} size={72}/>
              <div style={{fontSize:20,fontWeight:900,marginTop:12,color:C.text}}>{user?.name}</div>
              <div style={{color:C.muted,fontSize:13,marginTop:4}}>{user?.phone}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>📍 {user?.location||"Location not set"}</div>
              <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>
                <span style={g.badge(C.green)}>Customer</span>
                <span style={g.badge(C.blue)}>Active</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <StatCard val={orders.length} label="Orders" color={C.orange} icon="📋"/>
              <StatCard val={orders.filter(o=>o.status==="Completed").length} label="Done" color={C.green} icon="✅"/>
              <StatCard val="4.9" label="Rating" color="#FBBF24" icon="⭐"/>
            </div>
            <div style={g.card}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>Account Settings</div>
              {["📱 Edit Profile","🔔 Notifications","💳 Payment Methods","🔒 Privacy","❓ Help & Support"].map(item=>(
                <div key={item} style={{...g.btw,padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
                  <div style={{fontSize:13,color:C.text}}>{item}</div>
                  <div style={{color:C.muted}}>›</div>
                </div>
              ))}
            </div>
            <button style={g.btn("#EF4444")} onClick={()=>{setUser(null);setOrders(SAMPLE_ORDERS);go("landing");}}>Logout</button>
          </div>
        )}
      </div>

      <div style={g.tab}>
        {[["🏠","Home","home"],["📋","Orders","orders"],["🔔","Alerts","notif"],["👤","Profile","profile"]].map(([icon,label,key])=>(
          <div key={key} style={g.tItem(tab===key)} onClick={()=>key==="notif"?go("notif"):setTab(key)}>
            <div style={{fontSize:22,position:"relative",display:"inline-block"}}>
              {icon}
              {key==="notif"&&unreadCount>0&&<div style={{position:"absolute",top:-4,right:-4,background:C.orange,borderRadius:10,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff"}}>{unreadCount}</div>}
            </div>
            <div style={{marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: PROVIDERS LIST
  // ─────────────────────────────────────────────────────
  if(screen==="provlist") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title={selSvc ? `${selSvc} Providers` : "All Providers"} sub="உங்கள் area-ல available providers" onBack={()=>go("cust")}/>
      <div style={g.page}>
        <input style={g.input} placeholder="🔍 Provider / Service search..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <span style={{...g.chip(C.orange),fontSize:11}} onClick={()=>setSelSvc(null)}>All</span>
          {SERVICES.map(s=><span key={s.id} style={{...g.chip(s.color),fontSize:11}} onClick={()=>setSelSvc(s.name)}>{s.icon} {s.name}</span>)}
        </div>

        {filteredProviders.map(p=>{
          const svc = SERVICES.find(s=>s.name===p.service);
          return (
            <div key={p.id} style={{...g.card,opacity:p.available?1:0.55}}>
              <div style={{...g.row,alignItems:"flex-start",marginBottom:p.available?12:0}}>
                <AvatarCircle text={p.avatar} color={svc?.color||C.orange} size={50}/>
                <div style={{flex:1}}>
                  <div style={g.btw}>
                    <div style={{fontWeight:800,fontSize:15,color:C.text}}>{p.name}</div>
                    <span style={g.badge(p.available?C.green:"#666")}>{p.available?"Available":"Busy"}</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,margin:"4px 0"}}>{svc?.icon} {p.service} · 📍 {p.location}</div>
                  <div style={{...g.row,gap:16,fontSize:12}}>
                    <Stars n={p.rating}/>
                    <span style={{color:C.muted}}>✅ {p.jobs} jobs</span>
                    <span style={{color:C.orange,fontWeight:800}}>From ₹{p.price}</span>
                  </div>
                </div>
              </div>
              {p.available && (
                <div style={{display:"flex",gap:8}}>
                  <button style={{...g.btn(C.orange,false),flex:1,marginBottom:0,padding:"11px"}} onClick={()=>{setSelProv(p);go("book");}}>Book Now →</button>
                  <button style={{...g.btn(C.blue,false),flex:0,marginBottom:0,padding:"11px 16px"}} onClick={()=>showToast(`${p.name} ஐ contact பண்ணலாம்`,"info")}>💬</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: BOOK SERVICE
  // ─────────────────────────────────────────────────────
  if(screen==="book") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title="Book Service" sub="விவரங்கள் கொடுங்கள்" onBack={()=>go("provlist")}/>
      <div style={g.page}>
        {/* Provider info */}
        <div style={{...g.card,...g.row,marginBottom:20}}>
          <AvatarCircle text={selProv?.avatar} color={SERVICES.find(s=>s.name===selProv?.service)?.color||C.orange} size={56}/>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:C.text}}>{selProv?.name}</div>
            <Stars n={selProv?.rating}/>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>✅ {selProv?.jobs} completed · 📍 {selProv?.location}</div>
          </div>
        </div>

        <label style={g.label}>என்ன உதவி வேணும்? *</label>
        <textarea style={{...g.input,height:90,resize:"none"}} placeholder="விவரமாக சொல்லுங்க... (AC பழுது, fan sound வருது, etc.)" value={bookDesc} onChange={e=>setBookDesc(e.target.value)}/>

        <label style={g.label}>நீங்கள் கொடுக்க ready இருக்கீங்க (₹) *</label>
        <input style={g.input} placeholder="உ.தா: 300" type="number" value={bookPrice} onChange={e=>setBookPrice(e.target.value)}/>

        <label style={g.label}>எப்போ வேணும்?</label>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["இப்பவே","Today","Tomorrow","Schedule"].map(t=>(
            <span key={t} style={{...g.chip(C.blue),fontSize:11}}>{t}</span>
          ))}
        </div>

        <div style={{background:"rgba(255,107,53,0.08)",border:"1px solid rgba(255,107,53,0.2)",borderRadius:14,padding:14,marginBottom:20}}>
          <div style={{fontSize:12,color:C.orange,fontWeight:700}}>💡 Provider Suggested Price: ₹{selProv?.price}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>நீங்க சொல்ற விலையை provider accept/reject பண்ணுவாங்க. Negotiate பண்ணலாம்!</div>
        </div>

        <button style={g.btn()} onClick={placeOrder}>🚀 Order Place பண்ணுங்க</button>
        <button style={g.btnGhost} onClick={()=>go("provlist")}>வேற Provider பாரு</button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: ORDER TRACKING
  // ─────────────────────────────────────────────────────
  if(screen==="track"&&activeOrd) return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title={`Order #${activeOrd.id}`} sub="Live Tracking" onBack={()=>go("cust")}/>
      <div style={g.page}>
        {/* Progress */}
        <div style={{...g.card,padding:"20px 16px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
            {STATUS_STEPS.map((step,i)=>(
              <div key={step} style={{display:"flex",alignItems:"center",flex:i<STATUS_STEPS.length-1?1:"initial"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:i<activeOrd.statusIndex?C.green:i===activeOrd.statusIndex?C.orange:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",transition:"all 0.3s",boxShadow:i===activeOrd.statusIndex?`0 0 0 4px ${C.orange}30`:"none"}}>
                    {i<activeOrd.statusIndex?"✓":i+1}
                  </div>
                  <div style={{fontSize:9,color:i<=activeOrd.statusIndex?C.text:C.muted,marginTop:5,fontWeight:i===activeOrd.statusIndex?800:500,textAlign:"center",maxWidth:60}}>{step}</div>
                </div>
                {i<STATUS_STEPS.length-1&&<div style={{flex:1,height:2,background:i<activeOrd.statusIndex?C.green:"rgba(255,255,255,0.08)",margin:"0 4px",marginBottom:20,transition:"all 0.3s"}}/>}
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <Badge status={activeOrd.status}/>
          </div>
        </div>

        {/* Order details */}
        <div style={g.card}>
          <div style={{fontSize:13,color:C.muted,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>Order Details</div>
          {[["Service",activeOrd.service],["Description",activeOrd.desc],["Provider",activeOrd.provider||"-"],["Amount",`₹${activeOrd.price}`],["Order ID",`#${activeOrd.id}`],["Time",activeOrd.time]].map(([k,v])=>(
            <div key={k} style={{...g.btw,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,color:C.muted}}>{k}</div>
              <div style={{fontSize:13,fontWeight:700,color:k==="Amount"?C.orange:C.text}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {activeOrd.statusIndex<STATUS_STEPS.length-1 ? (
          <div style={{background:"rgba(75,142,255,0.08)",border:"1px solid rgba(75,142,255,0.2)",borderRadius:16,padding:16}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:10}}>🎮 Demo: Status simulate பண்ணுங்க</div>
            <button style={g.btn(C.blue)} onClick={()=>advanceOrder(activeOrd.id)}>Next Status Simulate →</button>
          </div>
        ):(
          <div>
            <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:16,padding:24,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:44}}>🎉</div>
              <div style={{fontWeight:900,color:C.green,marginTop:10,fontSize:18}}>Service Complete!</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>₹{activeOrd.price} paid successfully</div>
            </div>
            {!activeOrd.rating && <button style={g.btn("#FBBF24")} onClick={()=>go("review")}>⭐ Rate & Review</button>}
            <button style={g.btn(C.blue)} onClick={()=>go("payment")}>💳 Payment Details</button>
          </div>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: NOTIFICATIONS
  // ─────────────────────────────────────────────────────
  if(screen==="notif") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title="Notifications 🔔" sub={`${unreadCount} unread`} onBack={()=>go(user?.type==="provider"?"prov":"cust")}
        right={<button onClick={markAllRead} style={{background:"none",border:"none",color:C.orange,fontSize:12,fontWeight:700,cursor:"pointer"}}>Mark All Read</button>}/>
      <div style={g.page}>
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
            style={{...g.card,opacity:n.read?0.6:1,borderLeft:n.read?"none":`3px solid ${C.orange}`,cursor:"pointer",transition:"all 0.2s"}}>
            <div style={g.row}>
              <div style={{fontSize:28,minWidth:36}}>{n.icon}</div>
              <div style={{flex:1}}>
                <div style={g.btw}>
                  <div style={{fontWeight:700,fontSize:13,color:C.text}}>{n.title}</div>
                  {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:C.orange}}/>}
                </div>
                <div style={{fontSize:12,color:C.muted,marginTop:3}}>{n.msg}</div>
                <div style={{fontSize:10,color:"#3a4560",marginTop:4}}>{n.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: REVIEWS & RATINGS
  // ─────────────────────────────────────────────────────
  if(screen==="review") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title="Rate & Review ⭐" sub="உங்கள் experience share பண்ணுங்கள்" onBack={()=>go("cust")}/>
      <div style={g.page}>
        <div style={{...g.card,textAlign:"center",padding:28}}>
          <div style={{fontSize:48,marginBottom:12}}>⭐</div>
          <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:4}}>Service எப்படி இருந்துச்சு?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:20}}>உங்கள் rating மற்றவர்களுக்கு help ஆகும்</div>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:20}}>
            {[1,2,3,4,5].map(s=>(
              <div key={s} onClick={()=>setRatingVal(s)} style={{fontSize:36,cursor:"pointer",transition:"all 0.2s",opacity:s<=ratingVal?1:0.3,transform:s<=ratingVal?"scale(1.2)":"scale(1)"}}>⭐</div>
            ))}
          </div>
          {ratingVal>0 && <div style={{fontSize:14,color:C.orange,fontWeight:700}}>{["","மோசம்","சரியா இல்ல","சரியா இருந்துச்சு","நல்லா இருந்துச்சு","அருமையா இருந்துச்சு!"][ratingVal]}</div>}
        </div>

        <label style={g.label}>உங்கள் Review</label>
        <textarea style={{...g.input,height:100,resize:"none"}} placeholder="Service பத்தி சொல்லுங்க..." value={reviewText} onChange={e=>setReviewText(e.target.value)}/>

        <div style={{fontSize:13,fontWeight:800,marginBottom:12,color:C.text}}>Recent Reviews</div>
        {REVIEWS.map(r=>(
          <div key={r.id} style={g.card}>
            <div style={g.row}>
              <AvatarCircle text={r.avatar} color={C.blue} size={38}/>
              <div style={{flex:1}}>
                <div style={g.btw}><div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.customer}</div><div style={{fontSize:11,color:C.muted}}>{r.time}</div></div>
                <Stars n={r.rating}/>
              </div>
            </div>
            <div style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>{r.comment}</div>
            <div style={{marginTop:8}}><span style={g.badge(SERVICES.find(s=>s.name===r.service)?.color||C.orange)}>{r.service}</span></div>
          </div>
        ))}

        <button style={g.btn()} onClick={submitReview}>Submit Review ⭐</button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: PAYMENTS
  // ─────────────────────────────────────────────────────
  if(screen==="payment") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <BackHeader title="Payment 💳" sub="Secure payment gateway" onBack={()=>go("track")}/>
      <div style={g.page}>
        <div style={g.card}>
          <div style={{fontSize:13,color:C.muted,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>Order Summary</div>
          {[["Service","Repair"],["Provider","Rajan Kumar"],["Base Price","₹300"],["Platform Fee","₹30"],["GST (18%)","₹54"],["Total","₹384"]].map(([k,v],i)=>(
            <div key={k} style={{...g.btw,padding:"8px 0",borderBottom:i<5?`1px solid ${C.border}`:"none",fontWeight:i===5?800:400}}>
              <div style={{fontSize:i===5?14:12,color:i===5?C.text:C.muted}}>{k}</div>
              <div style={{fontSize:i===5?16:13,color:i===5?C.orange:C.text}}>{v}</div>
            </div>
          ))}
        </div>

        <label style={g.label}>Payment Method</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["💸","UPI","upi"],["💳","Card","card"],["🏦","Net Banking","netbank"],["💰","Wallet","wallet"]].map(([icon,label,key])=>(
            <div key={key} onClick={()=>setPayMethod(key)}
              style={{...g.card,textAlign:"center",cursor:"pointer",marginBottom:0,border:payMethod===key?`2px solid ${C.orange}`:`1px solid ${C.border}`,background:payMethod===key?"rgba(255,107,53,0.08)":C.card,padding:"14px 10px",transition:"all 0.2s"}}>
              <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{label}</div>
            </div>
          ))}
        </div>

        {payMethod==="upi" && <>
          <label style={g.label}>UPI ID</label>
          <input style={g.input} placeholder="yourname@upi"/>
        </>}
        {payMethod==="card" && <>
          <label style={g.label}>Card Number</label>
          <input style={g.input} placeholder="1234 5678 9012 3456"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={g.label}>Expiry</label><input style={{...g.input,marginBottom:0}} placeholder="MM/YY"/></div>
            <div><label style={g.label}>CVV</label><input style={{...g.input,marginBottom:0}} placeholder="***"/></div>
          </div>
          <div style={{marginTop:12}}/>
        </>}

        <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:12,marginBottom:16}}>
          <div style={{fontSize:12,color:C.green,fontWeight:700}}>🔒 Secured by Razorpay · SSL Encrypted</div>
        </div>

        <button style={g.btn(C.green)} onClick={()=>{showToast("Payment Successful! ✅");setTimeout(()=>go("cust"),1500);}}>Pay ₹384 Now 🔒</button>
        <button style={g.btnGhost} onClick={()=>go("cust")}>Pay Later (COD)</button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: PROVIDER HOME
  // ─────────────────────────────────────────────────────
  if(screen==="prov") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <div style={g.hdr}>
        <div style={g.btw}>
          <div>
            <div style={{fontSize:12,color:C.muted,fontWeight:700}}>Provider Dashboard</div>
            <div style={{fontSize:19,fontWeight:900,color:C.text}}>{user?.name||"Provider"}</div>
          </div>
          <div style={g.row}>
            <span style={g.badge(C.green)}>🟢 Online</span>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("notif")}>
              <div style={{fontSize:22}}>🔔</div>
              {unreadCount>0&&<div style={{position:"absolute",top:-4,right:-4,background:C.orange,borderRadius:10,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{unreadCount}</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={g.page}>
        {tab==="home" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            <StatCard val="₹12,400" label="Total Earned" color={C.orange} icon="💰"/>
            <StatCard val={provOrds.length} label="Total Orders" color={C.blue} icon="📋"/>
            <StatCard val="4.8 ⭐" label="My Rating" color="#FBBF24" icon="⭐"/>
            <StatCard val={provOrds.filter(o=>o.status==="Order Placed").length} label="Pending" color="#F87171" icon="🔔"/>
          </div>

          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>📥 New Orders ({provOrds.filter(o=>o.status==="Order Placed").length})</div>
          {provOrds.map(o=>(
            <div key={o.id} style={g.card}>
              <div style={{...g.btw,marginBottom:10}}>
                <div style={{fontWeight:800,fontSize:12,color:C.muted}}>#{o.id}</div>
                <Badge status={o.status}/>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>👤 {o.customer}</div>
              <div style={{fontSize:13,color:C.muted,marginBottom:10}}>📝 {o.desc}</div>
              <div style={{...g.btw,marginBottom:12}}>
                <div style={{fontSize:12,color:C.muted}}>🕐 {o.time}</div>
                <div style={{fontSize:18,fontWeight:900,color:C.orange}}>₹{o.price}</div>
              </div>
              {o.status==="Order Placed" && (
                <div style={{display:"flex",gap:8}}>
                  <button style={{...g.btn(C.green,false),flex:1,marginBottom:0,padding:"11px"}} onClick={()=>acceptProv(o.id)}>✅ Accept</button>
                  <button style={{...g.btn("#EF4444",false),flex:1,marginBottom:0,padding:"11px"}} onClick={()=>rejectProv(o.id)}>❌ Reject</button>
                </div>
              )}
              {o.status==="Accepted" && <button style={{...g.btn("#A78BFA"),marginBottom:0}} onClick={()=>completeProv(o.id)}>✅ Mark as Complete</button>}
              {o.status==="Completed" && <div style={{textAlign:"center",color:C.green,fontSize:13,fontWeight:700}}>✓ Completed · ₹{o.price} credited to wallet</div>}
            </div>
          ))}
        </>}

        {tab==="orders" && <>
          <div style={{fontSize:15,fontWeight:800,marginBottom:14,color:C.text}}>📊 Order History</div>
          {provOrds.map(o=>(
            <div key={o.id} style={g.card}>
              <div style={g.btw}><div style={{fontWeight:700,fontSize:13,color:C.text}}>#{o.id} — {o.customer}</div><Badge status={o.status}/></div>
              <div style={{fontSize:12,color:C.muted,marginTop:6}}>{o.desc} · <span style={{color:C.orange,fontWeight:700}}>₹{o.price}</span> · {o.time}</div>
            </div>
          ))}
        </>}

        {tab==="profile" && (
          <div>
            <div style={{...g.card,textAlign:"center",padding:28}}>
              <AvatarCircle text={user?.name} color={SERVICES.find(s=>s.name===user?.service)?.color||C.orange} size={72}/>
              <div style={{fontSize:20,fontWeight:900,marginTop:12,color:C.text}}>{user?.name}</div>
              <div style={{fontSize:13,color:C.muted,marginTop:4}}>{user?.phone}</div>
              <div style={{marginTop:8}}><span style={g.badge(C.orange)}>{user?.service||"Not set"}</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <StatCard val={provOrds.length} label="Orders" color={C.orange} icon="📋"/>
              <StatCard val="4.8" label="Rating" color="#FBBF24" icon="⭐"/>
              <StatCard val="₹12.4k" label="Earned" color={C.green} icon="💰"/>
            </div>
            <button style={g.btn("#EF4444")} onClick={()=>{setUser(null);go("landing");}}>Logout</button>
          </div>
        )}
      </div>

      <div style={g.tab}>
        {[["🏠","Home","home"],["📊","Orders","orders"],["🔔","Alerts","notif"],["👤","Profile","profile"]].map(([icon,label,key])=>(
          <div key={key} style={g.tItem(tab===key)} onClick={()=>key==="notif"?go("notif"):setTab(key)}>
            <div style={{fontSize:22}}>{icon}</div>
            <div style={{marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // SCREEN: ADMIN PANEL
  // ─────────────────────────────────────────────────────
  if(screen==="admin") return (
    <div style={g.app}>
      <Toast notif={toast}/>
      <div style={g.hdr}>
        <div style={g.btw}>
          <div>
            <div style={{fontSize:12,color:C.muted,fontWeight:700}}>🛡️ Admin Panel</div>
            <div style={{fontSize:18,fontWeight:900,color:C.text}}>KanchiGo HQ</div>
          </div>
          <button onClick={()=>{setUser(null);go("landing");}} style={{background:"none",border:"none",color:"#EF4444",fontSize:12,fontWeight:700,cursor:"pointer"}}>Logout</button>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto",scrollbarWidth:"none"}}>
          {["overview","users","orders","analytics","settings"].map(t=>(
            <div key={t} onClick={()=>setAdminTab(t)}
              style={{...g.chip(adminTab===t?C.orange:C.muted),fontSize:11,flexShrink:0,textTransform:"capitalize"}}>{t}</div>
          ))}
        </div>
      </div>

      <div style={g.page}>
        {adminTab==="overview" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            <StatCard val="8,542" label="Total Orders"   color={C.orange} icon="📋"/>
            <StatCard val="1,284" label="Providers"      color={C.blue}   icon="🔨"/>
            <StatCard val="24,891"label="Customers"      color={C.green}  icon="🛒"/>
            <StatCard val="₹4.2L" label="Revenue"        color="#FBBF24"  icon="💰"/>
          </div>

          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>📊 Today's Activity</div>
          {[["New Orders","142","+12% ↑",C.green],["New Users","89","+8% ↑",C.green],["Revenue","₹28,400","+15% ↑",C.green],["Cancelled","7","-3% ↓","#EF4444"]].map(([l,v,ch,c])=>(
            <div key={l} style={{...g.card,...g.btw}}>
              <div style={{fontSize:13,color:C.muted}}>{l}</div>
              <div style={g.row}>
                <div style={{fontSize:18,fontWeight:900,color:C.text}}>{v}</div>
                <div style={{fontSize:12,color:c,fontWeight:700}}>{ch}</div>
              </div>
            </div>
          ))}

          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>🔥 Top Services</div>
          {[["🔧","Repair","₹1,24,000","34%"],["🧹","Cleaning","₹98,000","27%"],["🚚","Delivery","₹72,000","20%"],["🎨","Painting","₹68,000","19%"]].map(([icon,name,rev,pct])=>(
            <div key={name} style={{...g.card,...g.btw}}>
              <div style={g.row}><span style={{fontSize:22}}>{icon}</span><div style={{fontWeight:700,color:C.text}}>{name}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.orange,fontSize:13}}>{rev}</div><div style={{fontSize:11,color:C.muted}}>{pct} of total</div></div>
            </div>
          ))}
        </>}

        {adminTab==="users" && <>
          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>👥 All Providers</div>
          {PROVIDERS.map(p=>(
            <div key={p.id} style={g.card}>
              <div style={{...g.row,marginBottom:8}}>
                <AvatarCircle text={p.avatar} color={SERVICES.find(s=>s.name===p.service)?.color||C.orange} size={42}/>
                <div style={{flex:1}}>
                  <div style={g.btw}>
                    <div style={{fontWeight:700,color:C.text}}>{p.name}</div>
                    <span style={g.badge(p.available?C.green:"#666")}>{p.available?"Active":"Offline"}</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted}}>{p.service} · {p.location} · Joined {p.joined}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12,textAlign:"center"}}>
                <div style={{background:C.surface,borderRadius:8,padding:"6px"}}><div style={{fontWeight:800,color:C.orange}}>₹{p.earnings.toLocaleString()}</div><div style={{color:C.muted,fontSize:10}}>Earned</div></div>
                <div style={{background:C.surface,borderRadius:8,padding:"6px"}}><div style={{fontWeight:800,color:C.blue}}>{p.jobs}</div><div style={{color:C.muted,fontSize:10}}>Jobs</div></div>
                <div style={{background:C.surface,borderRadius:8,padding:"6px"}}><div style={{fontWeight:800,color:"#FBBF24"}}>⭐{p.rating}</div><div style={{color:C.muted,fontSize:10}}>Rating</div></div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button style={{...g.btn(C.blue,false),flex:1,marginBottom:0,padding:"9px",fontSize:12}} onClick={()=>showToast(`${p.name} - Profile viewed`,"info")}>View Profile</button>
                <button style={{...g.btn("#EF4444",false),flex:1,marginBottom:0,padding:"9px",fontSize:12}} onClick={()=>showToast(`${p.name} - Action taken`,"error")}>Suspend</button>
              </div>
            </div>
          ))}
        </>}

        {adminTab==="orders" && <>
          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>📋 All Orders</div>
          {[...SAMPLE_ORDERS,...provOrds].map(o=>(
            <div key={o.id} style={g.card}>
              <div style={g.btw}><div style={{fontWeight:700,fontSize:12,color:C.muted}}>#{o.id}</div><Badge status={o.status}/></div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,margin:"6px 0"}}>{o.service} — {o.desc}</div>
              <div style={g.btw}>
                <div style={{fontSize:12,color:C.muted}}>👤 {o.customer} · 🕐 {o.time}</div>
                <div style={{fontWeight:800,color:C.orange}}>₹{o.price}</div>
              </div>
            </div>
          ))}
        </>}

        {adminTab==="analytics" && <>
          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>📈 Analytics</div>
          {[["Jan","₹1.8L",72],["Feb","₹2.1L",84],["Mar","₹2.4L",96],["Apr","₹2.8L",100],["May","₹3.2L",85],["Jun","₹4.2L",100]].map(([m,rev,pct])=>(
            <div key={m} style={{...g.card,...g.btw}}>
              <div style={{fontWeight:700,color:C.text,minWidth:40}}>{m}</div>
              <div style={{flex:1,margin:"0 12px",height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${C.orange},#9333EA)`,borderRadius:4}}/>
              </div>
              <div style={{fontWeight:800,color:C.orange,minWidth:60,textAlign:"right"}}>{rev}</div>
            </div>
          ))}

          <div style={{fontSize:14,fontWeight:800,marginBottom:12,marginTop:8,color:C.text}}>📍 City Wise</div>
          {[["Chennai","4,200 orders","₹1.8L"],["Coimbatore","2,100 orders","₹92K"],["Madurai","1,400 orders","₹61K"],["Trichy","800 orders","₹35K"]].map(([city,orders,rev])=>(
            <div key={city} style={{...g.card,...g.btw}}>
              <div><div style={{fontWeight:700,color:C.text}}>{city}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{orders}</div></div>
              <div style={{fontWeight:800,color:C.green}}>{rev}</div>
            </div>
          ))}
        </>}

        {adminTab==="settings" && <>
          <div style={{fontSize:14,fontWeight:800,marginBottom:12,color:C.text}}>⚙️ Platform Settings</div>
          {[["Commission Rate","10%"],["Min Order Value","₹50"],["Max Providers/City","500"],["Auto Accept Orders","Disabled"],["SMS Notifications","Enabled"],["Payment Gateway","Razorpay"]].map(([k,v])=>(
            <div key={k} style={{...g.card,...g.btw}}>
              <div style={{fontSize:13,color:C.text}}>{k}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.orange}}>{v}</div>
            </div>
          ))}
          <button style={g.btn(C.blue)} onClick={()=>showToast("Settings saved! ✅","info")}>Save Settings</button>
          <button style={g.btn("#EF4444")} onClick={()=>{setUser(null);go("landing");}}>Logout Admin</button>
        </>}
      </div>
    </div>
  );

  return null;
}
