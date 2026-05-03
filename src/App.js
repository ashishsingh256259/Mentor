import { useState, useEffect, useRef } from "react";

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #07070F;
  --bg2: #0C0C1A;
  --bg3: #111122;
  --surface: rgba(255,255,255,0.04);
  --surface2: rgba(255,255,255,0.08);
  --border: rgba(255,255,255,0.08);
  --border2: rgba(255,255,255,0.14);
  --text: #F0F0FF;
  --text2: rgba(240,240,255,0.65);
  --text3: rgba(240,240,255,0.35);
  --amber: #F59E0B;
  --amber2: #D97706;
  --amber-dim: rgba(245,158,11,0.12);
  --green: #10B981;
  --red: #EF4444;
  --cyan: #06B6D4;
  --purple: #8B5CF6;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.3); border-radius: 4px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes bounce {
  0%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
}
@keyframes bar-slide {
  from { width: 0; }
  to { width: var(--tw); }
}
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}
@keyframes score-fill {
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: var(--target-offset); }
}

.shimmer-text {
  background: linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B, #D97706);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

.fade-up { animation: fadeUp 0.4s ease both; }

.btn-primary {
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--amber), var(--amber2));
  border: none;
  color: #000;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.35); }
.btn-primary:disabled { opacity: 0.45; transform: none; box-shadow: none; cursor: not-allowed; }

.btn-pro {
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8B5CF6, #4F46E5);
  border: none;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-pro:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(139,92,246,0.4); }

.btn-ghost {
  padding: 12px 24px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--text2);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { background: var(--surface2); color: var(--text); }

.input-field {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}
.input-field:focus { border-color: var(--amber); }
.input-field::placeholder { color: var(--text3); }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.5px;
}

.task-row { transition: background 0.2s; }
.task-row:hover { background: var(--bg3); }
.task-check {
  width: 20px; height: 20px; border-radius: 6px;
  border: 2px solid var(--border2);
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.2s;
}
.task-check.done { background: var(--green); border-color: var(--green); }

.weak-bar {
  height: 8px; border-radius: 10px;
  animation: bar-slide 1.2s ease both;
}

.res-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
.res-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }

.mentor-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
.mentor-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); border-color: var(--amber) !important; }

.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 12px; border-radius: 12px; border: none;
  background: transparent; color: var(--text3);
  cursor: pointer; font-family: var(--font-body); font-size: 11px;
  transition: all 0.2s; white-space: nowrap;
}
.nav-item:hover { color: var(--text2); background: var(--surface); }
.nav-item.active { color: var(--amber); background: var(--amber-dim); }

.pro-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 20px;
  background: linear-gradient(135deg, #8B5CF6, #4F46E5);
  color: #fff; font-size: 10px; font-weight: 700;
  font-family: var(--font-display);
}

.demand-badge-high { background: rgba(16,185,129,0.12); color: var(--green); border: 1px solid rgba(16,185,129,0.25); }
.demand-badge-medium { background: rgba(245,158,11,0.12); color: var(--amber); border: 1px solid rgba(245,158,11,0.25); }
.demand-badge-explosive { background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }

.glow-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
}
.glow-orb {
  position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12;
}

.score-ring {
  animation: score-fill 1.5s ease 0.3s both;
}

.pulse-dot::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: var(--green); animation: pulse-ring 1.5s ease-out infinite;
}
`;

// ─── TRENDING ROLES (Market-Demand Driven) ───────────────────────────────────
const TRENDING_ROLES = [
  { id:"ai-engineer",       title:"AI/ML Engineer",         field:"tech",    salary_range:"₹12L–₹40L",   demand_level:"explosive", growth_rate:"+38%", difficulty:"Hard",   time_to_learn:"12–18 mo", icon:"🤖", color:"#06B6D4",  skills_needed:["Python","ML Frameworks","Math","Data Pipelines","LLMs","Cloud"] },
  { id:"fullstack-dev",     title:"Full Stack Developer",   field:"tech",    salary_range:"₹8L–₹28L",    demand_level:"high",      growth_rate:"+24%", difficulty:"Medium", time_to_learn:"8–12 mo",  icon:"💻", color:"#F59E0B",  skills_needed:["React","Node.js","SQL","APIs","Git","Deployment"] },
  { id:"data-analyst",      title:"Data Analyst",           field:"data",    salary_range:"₹6L–₹20L",    demand_level:"high",      growth_rate:"+26%", difficulty:"Medium", time_to_learn:"6–9 mo",   icon:"📊", color:"#10B981",  skills_needed:["SQL","Python","Excel","Power BI","Statistics","Storytelling"] },
  { id:"cloud-engineer",    title:"Cloud/DevOps Engineer",  field:"tech",    salary_range:"₹10L–₹35L",   demand_level:"explosive", growth_rate:"+31%", difficulty:"Hard",   time_to_learn:"10–15 mo", icon:"☁️", color:"#8B5CF6",  skills_needed:["AWS/GCP","Docker","Kubernetes","Linux","CI/CD","Terraform"] },
  { id:"product-manager",   title:"Product Manager",        field:"biz",     salary_range:"₹14L–₹45L",   demand_level:"high",      growth_rate:"+19%", difficulty:"Medium", time_to_learn:"6–10 mo",  icon:"📱", color:"#EC4899",  skills_needed:["Strategy","Data Analysis","Wireframing","Agile","Stakeholder Mgmt","Roadmapping"] },
  { id:"ux-designer",       title:"UX/Product Designer",    field:"design",  salary_range:"₹7L–₹25L",    demand_level:"high",      growth_rate:"+22%", difficulty:"Medium", time_to_learn:"6–9 mo",   icon:"🎨", color:"#F97316",  skills_needed:["Figma","User Research","Prototyping","Design Systems","Accessibility","Portfolio"] },
  { id:"cybersecurity",     title:"Cybersecurity Analyst",  field:"tech",    salary_range:"₹8L–₹30L",    demand_level:"explosive", growth_rate:"+35%", difficulty:"Hard",   time_to_learn:"10–14 mo", icon:"🔐", color:"#EF4444",  skills_needed:["Networking","Linux","Ethical Hacking","Security Audits","CompTIA","SIEM"] },
  { id:"financial-analyst", title:"Financial Analyst",      field:"finance", salary_range:"₹6L–₹22L",    demand_level:"medium",    growth_rate:"+15%", difficulty:"Medium", time_to_learn:"6–8 mo",   icon:"💰", color:"#34D399",  skills_needed:["Excel","Financial Modeling","DCF","Equity Research","Bloomberg","CFA"] },
  { id:"digital-marketer",  title:"Growth/Digital Marketer",field:"marketing",salary_range:"₹5L–₹18L",   demand_level:"high",      growth_rate:"+20%", difficulty:"Easy",   time_to_learn:"4–6 mo",   icon:"📈", color:"#FBBF24",  skills_needed:["SEO","Paid Ads","Analytics","Content","Email Marketing","A/B Testing"] },
  { id:"blockchain-dev",    title:"Blockchain Developer",   field:"tech",    salary_range:"₹15L–₹50L",   demand_level:"explosive", growth_rate:"+44%", difficulty:"Hard",   time_to_learn:"12–18 mo", icon:"⛓️", color:"#A78BFA",  skills_needed:["Solidity","Web3.js","Smart Contracts","DeFi","Cryptography","Node.js"] },
  { id:"data-engineer",     title:"Data Engineer",          field:"data",    salary_range:"₹10L–₹32L",   demand_level:"high",      growth_rate:"+28%", difficulty:"Hard",   time_to_learn:"10–14 mo", icon:"🔧", color:"#7DD3FC",  skills_needed:["Python","SQL","Spark","Kafka","Airflow","Data Warehousing","Cloud"] },
  { id:"salesforce-dev",    title:"Salesforce Developer",   field:"tech",    salary_range:"₹8L–₹26L",    demand_level:"medium",    growth_rate:"+18%", difficulty:"Medium", time_to_learn:"5–8 mo",   icon:"⚡", color:"#60A5FA",  skills_needed:["Apex","LWC","SOQL","Salesforce Admin","CRM","Integrations"] },
];

// ─── OUTCOME-BASED ROADMAPS ──────────────────────────────────────────────────
const OUTCOME_ROADMAPS = {
  "ai-engineer": [
    { phase:"Phase 1 — Get Internship Ready", goal:"Land your first AI/ML internship", icon:"🎯", color:"#06B6D4",
      tasks:["Python mastery (NumPy, Pandas, Matplotlib)","ML basics: linear regression, classification, clustering","Kaggle beginner competitions (top 40%)","1 ML project on GitHub","Apply to 20 AI internships"],
      outcome:"First internship offer or freelance ML gig" },
    { phase:"Phase 2 — Build Portfolio Projects", goal:"3 real-world projects that impress interviewers", icon:"🏗️", color:"#8B5CF6",
      tasks:["Deep learning with TensorFlow/PyTorch","NLP project (sentiment analysis / chatbot)","Computer Vision project (object detection)","Deploy model on HuggingFace or AWS","Publish results on LinkedIn + GitHub"],
      outcome:"Portfolio that passes initial recruiter screening" },
    { phase:"Phase 3 — Crack Technical Interviews", goal:"Pass FAANG/startup AI interviews", icon:"🧠", color:"#F59E0B",
      tasks:["LeetCode 75 problems (ML track)","System Design for ML (model serving, pipelines)","Mock interviews × 10","Study LLM architecture (Transformers, RLHF)","Crack 3 take-home assignments"],
      outcome:"Interview conversion rate above 30%" },
    { phase:"Phase 4 — Land the Job", goal:"Signed offer letter in hand", icon:"🏆", color:"#10B981",
      tasks:["Apply to 100+ roles systematically","Negotiate salary (benchmark: ₹12–18L fresher)","Referral outreach on LinkedIn (50 connections)","Ace final rounds","Join & contribute to AI communities"],
      outcome:"Job offer at ₹12L+ CTC" },
  ],
  "fullstack-dev": [
    { phase:"Phase 1 — Get Internship Ready", goal:"Build and ship your first app", icon:"🎯", color:"#F59E0B",
      tasks:["HTML, CSS, JavaScript fundamentals","React basics (components, hooks, state)","Node.js + Express REST API","MySQL or PostgreSQL basics","Deploy app on Vercel + Render"],
      outcome:"Live app URL to show recruiters" },
    { phase:"Phase 2 — Build Portfolio Projects", goal:"3 production-grade projects", icon:"🏗️", color:"#06B6D4",
      tasks:["Full-stack CRUD app with auth","Real-time feature (WebSockets or polling)","Third-party API integration project","Performance optimization + SEO","Responsive design + accessibility"],
      outcome:"GitHub with 3 impressive repos" },
    { phase:"Phase 3 — Crack Technical Interviews", goal:"Pass coding + system design rounds", icon:"🧠", color:"#8B5CF6",
      tasks:["DSA: arrays, trees, graphs, DP (LeetCode 100)","System Design: URL shortener, chat app, feed","React internals deep dive","Node.js event loop + async patterns","Mock interviews × 8"],
      outcome:"Clear technical rounds at mid-tier+ companies" },
    { phase:"Phase 4 — Land the Job", goal:"Full-time offer signed", icon:"🏆", color:"#10B981",
      tasks:["Apply to 80+ companies","Negotiate to ₹8L+ CTC","Build recruiter network on LinkedIn","Contribute to 1 open source project","Freelance 2–3 projects for experience"],
      outcome:"Employed as Full Stack Developer" },
  ],
  "data-analyst": [
    { phase:"Phase 1 — Get Internship Ready", goal:"Be hireable for analyst internships", icon:"🎯", color:"#10B981",
      tasks:["SQL mastery (JOINs, CTEs, window functions)","Excel: pivot tables, VLOOKUP, dashboards","Python: Pandas, Matplotlib, Seaborn","Statistics basics: mean, median, correlation, p-value","Exploratory data analysis on 2 real datasets"],
      outcome:"Intern-level SQL + Python proficiency" },
    { phase:"Phase 2 — Build Portfolio Projects", goal:"3 end-to-end analysis case studies", icon:"🏗️", color:"#06B6D4",
      tasks:["Power BI or Tableau dashboard","A/B test analysis project","Business KPI analysis (e-commerce / SaaS)","Predictive model with regression","Publish findings on Medium or Notion"],
      outcome:"Portfolio of 3 case studies with real insights" },
    { phase:"Phase 3 — Crack Technical Interviews", goal:"Pass analyst interview rounds", icon:"🧠", color:"#F59E0B",
      tasks:["50 SQL practice problems","Metrics & case study interview prep","Explain data findings under 2 mins (practice × 10)","Business acumen questions","Take-home assignment prep"],
      outcome:"Strong conversion on analyst interviews" },
    { phase:"Phase 4 — Land the Job", goal:"First analyst role secured", icon:"🏆", color:"#10B981",
      tasks:["Apply to 60+ analyst roles","Target startups + analytics agencies","Negotiate ₹6–10L CTC","Get Google Data Analytics cert","Build referral pipeline"],
      outcome:"Hired as Data Analyst" },
  ],
};

// Default roadmap for roles without specific data
function getOutcomeRoadmap(roleId) {
  return OUTCOME_ROADMAPS[roleId] || OUTCOME_ROADMAPS["fullstack-dev"];
}

// ─── MENTORS DATA ─────────────────────────────────────────────────────────────
const MENTORS = [
  { id:"m1", name:"Priya Sharma", role:"Senior ML Engineer", company:"Google DeepMind", expertise:["AI/ML","Python","Deep Learning","LLMs"], price_per_session:1499, rating:4.9, sessions_completed:312, available:true,  img:"👩🏽‍💻", specialFor:["ai-engineer","data-analyst","data-engineer"], bio:"Ex-IIT Delhi. 7 years in ML. Helped 200+ students crack FAANG AI roles. Specializes in LLM fine-tuning and MLOps." },
  { id:"m2", name:"Arjun Mehta",  role:"Staff Engineer",     company:"Swiggy",         expertise:["Full Stack","System Design","Node.js","React"], price_per_session:999, rating:4.8, sessions_completed:487, available:true,  img:"👨🏽‍💻", specialFor:["fullstack-dev","data-engineer"], bio:"Built systems serving 5M+ users. Ex-Flipkart, Swiggy. Helps with cracking system design and full stack interviews." },
  { id:"m3", name:"Sneha Rao",    role:"Head of Product",    company:"Razorpay",       expertise:["Product Management","Strategy","Agile","Analytics"], price_per_session:1799, rating:4.9, sessions_completed:198, available:false, img:"👩🏽‍💼", specialFor:["product-manager"], bio:"Built 3 products at Razorpay from 0→1. MBA from IIM-A. Expert in product metrics, roadmapping, and PM interviews." },
  { id:"m4", name:"Karan Verma",  role:"Cybersec Lead",      company:"KPMG",           expertise:["Cybersecurity","Penetration Testing","SIEM","CompTIA"], price_per_session:1299, rating:4.7, sessions_completed:156, available:true,  img:"👨🏽‍🔬", specialFor:["cybersecurity"], bio:"CEH + CISSP certified. Runs live CTF sessions. Built security programs for Fortune 500s. Helps with SOC analyst and pentesting roles." },
  { id:"m5", name:"Aarti Nair",   role:"Senior UX Designer", company:"Microsoft",      expertise:["UX Design","Figma","Design Systems","Research"], price_per_session:1199, rating:4.8, sessions_completed:234, available:true,  img:"👩🏽‍🎨", specialFor:["ux-designer"], bio:"Designed for 50M+ users at Microsoft. Portfolio review specialist. Helps with Figma mastery and cracking design interviews." },
  { id:"m6", name:"Rahul Gupta",  role:"Blockchain Architect",company:"Polygon",       expertise:["Solidity","Web3","DeFi","Smart Contracts"], price_per_session:2499, rating:4.9, sessions_completed:89,  available:true,  img:"👨🏽‍🔧", specialFor:["blockchain-dev"], bio:"Core contributor to Polygon ecosystem. Built DeFi protocols with $50M+ TVL. Expert in Solidity, auditing, and Web3 career strategy." },
  { id:"m7", name:"Divya Kapoor", role:"Finance Manager",    company:"Goldman Sachs",  expertise:["Financial Modeling","DCF","Equity Research","CFA"], price_per_session:1599, rating:4.7, sessions_completed:167, available:true,  img:"👩🏽‍💼", specialFor:["financial-analyst"], bio:"CFA Level 3. Ex-Goldman, now at ICICI AMC. Helps with financial modeling, CFA prep, and cracking investment banking interviews." },
];

const GROUP_SESSIONS = [
  { id:"g1", title:"AI/ML Interview Bootcamp", mentor:"Priya Sharma", price:299, spots_left:8,  total_spots:20, date:"Every Saturday 7 PM", duration:"2 hours", tags:["ai-engineer","data-analyst"] },
  { id:"g2", title:"System Design Masterclass", mentor:"Arjun Mehta", price:249, spots_left:3,  total_spots:15, date:"Every Sunday 6 PM",   duration:"90 mins", tags:["fullstack-dev","cloud-engineer","data-engineer"] },
  { id:"g3", title:"PM Interview Prep Circle",  mentor:"Sneha Rao",   price:349, spots_left:12, total_spots:25, date:"Every Wednesday 8 PM",duration:"2 hours", tags:["product-manager"] },
  { id:"g4", title:"UX Portfolio Workshop",     mentor:"Aarti Nair",  price:199, spots_left:6,  total_spots:15, date:"Every Friday 7 PM",   duration:"90 mins", tags:["ux-designer"] },
];

// ─── COURSES DATA (with affiliate tagging) ───────────────────────────────────
const COURSES_DB = {
  "ai-engineer": [
    { name:"Fast.ai – Practical Deep Learning", link:"https://fast.ai", free:true,  level:"Mid",      affiliate:false, tag:"Deep Learning",    roi:"High" },
    { name:"Andrew Ng – ML Specialization",     link:"https://coursera.org", free:false, level:"Beginner", affiliate:true,  tag:"ML Foundations",   roi:"Very High", affiliate_badge:"🎯 Best for Beginners" },
    { name:"Hugging Face NLP Course",           link:"https://huggingface.co/learn", free:true,  level:"Mid",   affiliate:false, tag:"NLP/LLMs",         roi:"Very High" },
    { name:"Full Stack Deep Learning",          link:"https://fullstackdeeplearning.com", free:true, level:"Advanced", affiliate:false, tag:"MLOps",    roi:"High" },
    { name:"DeepLearning.AI – LLMOps",          link:"https://coursera.org", free:false, level:"Mid", affiliate:true, tag:"Production AI",   roi:"Very High", affiliate_badge:"🔥 Trending 2024" },
  ],
  "fullstack-dev": [
    { name:"The Odin Project",                  link:"https://theodinproject.com", free:true,  level:"All",      affiliate:false, tag:"Full Stack",      roi:"Very High" },
    { name:"freeCodeCamp",                      link:"https://freecodecamp.org",   free:true,  level:"Beginner", affiliate:false, tag:"Web Dev",         roi:"High" },
    { name:"Josh Comeau – CSS for JS Devs",     link:"https://css-for-js.dev",    free:false, level:"Mid",      affiliate:true,  tag:"CSS Mastery",    roi:"High", affiliate_badge:"💡 Most Recommended" },
    { name:"Frontend Masters – React",          link:"https://frontendmasters.com",free:false, level:"Mid",      affiliate:true,  tag:"React Deep Dive", roi:"Very High", affiliate_badge:"⭐ Industry Standard" },
    { name:"Neetcode – DSA Course",             link:"https://neetcode.io",        free:false, level:"Mid",      affiliate:true,  tag:"Interview Prep",  roi:"Very High", affiliate_badge:"🎯 Interview Essential" },
  ],
  "data-analyst": [
    { name:"Mode SQL Tutorial",                 link:"https://mode.com/sql-tutorial", free:true, level:"Beginner", affiliate:false, tag:"SQL",            roi:"Very High" },
    { name:"Alex the Analyst – YouTube",        link:"https://youtube.com",           free:true, level:"All",      affiliate:false, tag:"Analyst Skills", roi:"High" },
    { name:"Google Data Analytics Cert",        link:"https://coursera.org",          free:false, level:"Beginner", affiliate:true, tag:"Google Cert",    roi:"Very High", affiliate_badge:"🏆 Employer Recognized" },
    { name:"Tableau Public Learning",           link:"https://public.tableau.com",    free:true,  level:"Mid",     affiliate:false, tag:"Data Viz",       roi:"High" },
    { name:"Kaggle – SQL + Python Tracks",      link:"https://kaggle.com/learn",      free:true,  level:"All",     affiliate:false, tag:"Hands-On",       roi:"Very High" },
  ],
};

function getCoursesForRole(roleId) {
  return COURSES_DB[roleId] || COURSES_DB["fullstack-dev"];
}

// ─── RESOURCE DB ─────────────────────────────────────────────────────────────
const RESOURCE_DB = {
  "ai-engineer":    [{ title:"Hugging Face",      type:"Platform", tag:"LLMs",        icon:"🤗", url:"https://huggingface.co", free:true,  desc:"The GitHub of AI models." },{ title:"Papers With Code",   type:"Research", tag:"SOTA Models",  icon:"📄", url:"https://paperswithcode.com", free:true,  desc:"Latest ML research + code." },{ title:"Kaggle",             type:"Practice",  tag:"Competitions", icon:"🏆", url:"https://kaggle.com", free:true, desc:"Real datasets. Real problems." },{ title:"DeepLearning.AI",    type:"Course",    tag:"Foundations",  icon:"🧠", url:"https://deeplearning.ai", free:false, desc:"Andrew Ng's flagship courses." },{ title:"Google Colab",       type:"Tool",      tag:"GPU Notebooks", icon:"💻", url:"https://colab.research.google.com", free:true, desc:"Free GPU for training models." }],
  "fullstack-dev":  [{ title:"The Odin Project",  type:"Course",   tag:"Full Stack",  icon:"🌐", url:"https://theodinproject.com", free:true, desc:"Best free full-stack curriculum." },{ title:"MDN Web Docs",        type:"Reference", tag:"Web Standards",icon:"📖", url:"https://developer.mozilla.org", free:true, desc:"The bible of web development." },{ title:"Neetcode.io",         type:"Practice",  tag:"DSA",          icon:"💡", url:"https://neetcode.io", free:true, desc:"Best structured DSA prep." },{ title:"Fireship – YouTube",  type:"YouTube",  tag:"Quick Concepts",icon:"▶️", url:"https://youtube.com/@Fireship", free:true, desc:"100s explainers. Pure gold." },{ title:"Vercel + Render",     type:"Tool",      tag:"Deployment",   icon:"🚀", url:"https://vercel.com", free:true, desc:"Free hosting for your projects." }],
  "data-analyst":   [{ title:"Mode Analytics Blog",type:"Blog",     tag:"SQL Tips",    icon:"📊", url:"https://mode.com/blog", free:true, desc:"Expert SQL guides and tutorials." },{ title:"Towards Data Science",type:"Blog",     tag:"Analysis",     icon:"✍️", url:"https://towardsdatascience.com", free:true, desc:"Top data science articles." },{ title:"Superset / Metabase", type:"Tool",     tag:"BI Dashboards", icon:"📈", url:"https://superset.apache.org", free:true, desc:"Open source BI tools to learn." },{ title:"Statsquest – YouTube",type:"YouTube",  tag:"Statistics",   icon:"▶️", url:"https://youtube.com/@statquest", free:true, desc:"Stats explained brilliantly." },{ title:"DBeaver",             type:"Tool",      tag:"SQL Client",   icon:"🗄️", url:"https://dbeaver.io", free:true, desc:"Best free SQL IDE." }],
};

function getResources(roleId) {
  return RESOURCE_DB[roleId] || RESOURCE_DB["fullstack-dev"];
}

// ─── JOB READINESS SCORE CALCULATOR ──────────────────────────────────────────
function calcJobReadiness(completedTasks, totalTasks, skillRatings, projectsBuilt) {
  const taskScore    = totalTasks > 0 ? (completedTasks / totalTasks) * 35 : 0;
  const skillScore   = skillRatings.length > 0
    ? (skillRatings.reduce((a, b) => a + b, 0) / (skillRatings.length * 5)) * 35
    : 0;
  const projectScore = Math.min(projectsBuilt * 10, 30);
  return Math.round(taskScore + skillScore + projectScore);
}

// ─── AI HELPER ───────────────────────────────────────────────────────────────
async function askClaude(messages, systemPrompt, userProfile) {
  const res = await fetch("https://forgeai-a8xi.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages,
      systemPrompt,
      userProfile
    })
  });

  const data = await res.json();
  return data.reply;
}

// ─── PLAN CONFIG ─────────────────────────────────────────────────────────────
const PLANS = {
  free: {
    name: "Free",
    price: "₹0",
    features: ["Basic roadmap (Phase 1 only)", "5 AI mentor messages/day", "Community resources", "Task tracker", "Basic job readiness score"],
    locked: ["Advanced roadmap (Phase 2–4)", "Unlimited AI mentor", "1:1 mentor booking", "Placement prep tools", "Resume & interview AI", "Priority support"],
  },
  pro: {
    name: "Pro",
    price: "₹499/mo",
    features: ["Full 4-phase job roadmap", "Unlimited AI mentor", "1:1 mentor booking (discounted)", "Resume builder + ATS checker", "Mock interview AI", "Placement tracker", "Job readiness optimizer", "Priority support", "All courses unlocked"],
    locked: [],
  },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function GlowBg() {
  return (
    <div className="glow-bg">
      <div className="glow-orb" style={{ width:600, height:600, top:-200, left:-200, background:"#F59E0B" }}/>
      <div className="glow-orb" style={{ width:500, height:500, bottom:-100, right:-100, background:"#8B5CF6" }}/>
      <div className="glow-orb" style={{ width:300, height:300, top:"40%", left:"50%", background:"#06B6D4", opacity:0.06 }}/>
    </div>
  );
}

// ── JOB READINESS SCORE RING ──────────────────────────────────────────────────
function ScoreRing({ score, size=120, strokeWidth=10 }) {
  const r      = (size - strokeWidth) / 2;
  const circum = 2 * Math.PI * r;
  const offset = circum - (score / 100) * circum;
  const color  = score < 30 ? "#EF4444" : score < 60 ? "#F59E0B" : "#10B981";

  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circum}
        style={{ strokeDashoffset: offset, transition:"stroke-dashoffset 1.5s ease 0.3s", "--target-offset": offset }}/>
    </svg>
  );
}

// ── PRO GATE (locked feature overlay) ────────────────────────────────────────
function ProGate({ feature, onUpgrade }) {
  return (
    <div style={{ padding:"32px 24px", borderRadius:16, background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.25)", textAlign:"center" }}>
      <div style={{ fontSize:36, marginBottom:12 }}>🔒</div>
      <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18, marginBottom:8 }}>Pro Feature</div>
      <p style={{ color:"var(--text2)", fontSize:14, marginBottom:20 }}>{feature} is available on the Pro plan.</p>
      <button className="btn-pro" style={{ padding:"12px 28px" }} onClick={onUpgrade}>Upgrade to Pro →</button>
    </div>
  );
}

// ── LANDING / AUTH ────────────────────────────────────────────────────────────
function PageLanding({ onStart, onAuthDone }) {
  const [authMode, setAuthMode] = useState("landing");
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPw:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAuth(e) {
    e.preventDefault();
    setError("");
    if (!form.email.includes("@")) { setError("Enter a valid email."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (authMode === "signup" && form.password !== form.confirmPw) { setError("Passwords don't match."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthDone({ prefillName: form.name || form.email.split("@")[0], prefillEmail: form.email, isNewUser: authMode === "signup" });
    }, 900);
  }

  if (authMode === "landing") {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
        <div style={{ animation:"float 4s ease-in-out infinite", marginBottom:32 }}>
          <div style={{ width:80, height:80, borderRadius:20, background:"linear-gradient(135deg,var(--amber),#D97706)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:900, fontSize:36, color:"#000", boxShadow:"0 0 40px rgba(245,158,11,0.4)" }}>F</div>
        </div>
        <div style={{ textAlign:"center", maxWidth:700, animation:"fadeUp 0.6s ease both" }}>
          <div className="tag" style={{ background:"var(--amber-dim)", color:"var(--amber)", border:"1px solid rgba(245,158,11,0.25)", marginBottom:20, display:"inline-flex" }}>
            🔥 Market-Demand Driven Career Platform
          </div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(44px,8vw,82px)", fontWeight:900, lineHeight:1.0, marginBottom:10, letterSpacing:-2 }}>
            <span className="shimmer-text">Get Hired Fast</span>
            <br/>
            <span style={{ color:"var(--text)" }}>Not Just Skilled</span>
          </h1>
          <p style={{ color:"var(--text2)", fontSize:18, lineHeight:1.7, margin:"20px 0 40px" }}>
            Forge maps the <em style={{ color:"var(--amber)" }}>highest-demand jobs</em> to your skills, closes the gap,
            and tracks your journey to a signed offer letter — not just a certificate.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary" style={{ padding:"15px 36px", fontSize:16, borderRadius:14 }} onClick={() => setAuthMode("signup")}>Get Hired Free →</button>
            <button className="btn-ghost"   style={{ padding:"15px 28px", fontSize:15, borderRadius:14 }} onClick={() => setAuthMode("login")}>Log In</button>
          </div>
          <button style={{ marginTop:16, background:"none", border:"none", color:"var(--text3)", fontSize:13, cursor:"pointer", fontFamily:"var(--font-body)", textDecoration:"underline" }} onClick={onStart}>
            Continue as Guest
          </button>
        </div>
        {/* Market stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:16, maxWidth:700, width:"100%", marginTop:64, animation:"fadeUp 0.6s ease 0.3s both" }}>
          {[["₹12L–40L","AI Engineer Salary"],["₹8L–28L","Full Stack Salary"],["38%","AI Job Growth YoY"],["10K+","Open Roles Today"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center", padding:"16px", borderRadius:14, background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:900, color:"var(--amber)" }}>{n}</div>
              <div style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
      <div style={{ width:"100%", maxWidth:440, animation:"fadeUp 0.4s ease" }}>
        <button style={{ background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:13, marginBottom:24, display:"flex", alignItems:"center", gap:6 }} onClick={() => { setAuthMode("landing"); setError(""); }}>← Back</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,var(--amber),#D97706)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:900, fontSize:18, color:"#000" }}>F</div>
          <span style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:800 }}>Forge</span>
        </div>
        <div style={{ display:"flex", background:"var(--surface)", borderRadius:12, padding:4, marginBottom:28, gap:4 }}>
          {[["signup","Sign Up"],["login","Log In"]].map(([id,lbl]) => (
            <button key={id} onClick={() => { setAuthMode(id); setError(""); }}
              style={{ flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"var(--font-display)", fontWeight:700, fontSize:14, transition:"all 0.2s", background:authMode===id?"var(--amber)":"transparent", color:authMode===id?"#000":"var(--text2)" }}>
              {lbl}
            </button>
          ))}
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:800, marginBottom:6 }}>{authMode==="signup" ? "Create your account" : "Welcome back"}</h2>
        <p style={{ color:"var(--text3)", fontSize:14, marginBottom:28 }}>{authMode==="signup" ? "Start your job-outcome journey" : "Continue your job hunt"}</p>
        <form onSubmit={handleAuth} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {authMode==="signup" && (
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:6, display:"block" }}>Full Name</label>
              <input className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
          )}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:6, display:"block" }}>Email Address</label>
            <input className="input-field" type="email" placeholder="you@email.com" value={form.email} required onChange={e=>setForm({...form,email:e.target.value})}/>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:6, display:"block" }}>Password</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password} required onChange={e=>setForm({...form,password:e.target.value})}/>
          </div>
          {authMode==="signup" && (
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:6, display:"block" }}>Confirm Password</label>
              <input className="input-field" type="password" placeholder="Re-enter password" value={form.confirmPw} onChange={e=>setForm({...form,confirmPw:e.target.value})}/>
            </div>
          )}
          {error && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"var(--red)", fontSize:13 }}>⚠️ {error}</div>}
          <button className="btn-primary" type="submit" style={{ padding:"15px", fontSize:16, marginTop:4 }} disabled={loading}>
            {loading ? "Please wait..." : authMode==="signup" ? "Create Account & Continue →" : "Log In →"}
          </button>
        </form>
        <button style={{ marginTop:16, background:"none", border:"none", color:"var(--text3)", fontSize:13, cursor:"pointer", fontFamily:"var(--font-body)", textDecoration:"underline", width:"100%", textAlign:"center" }} onClick={onStart}>Continue as Guest</button>
      </div>
    </div>
  );
}

// ── ONBOARDING (Market-Demand Driven) ────────────────────────────────────────
function PageOnboarding({ onComplete, prefill={} }) {
  const [step, setStep]       = useState(0);
  const [name, setName]       = useState(prefill.prefillName || "");
  const [eduLevel, setEduLevel] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [motivation, setMotivation] = useState("");
  const [timeCommit, setTimeCommit] = useState("");

  const totalSteps = 4;
  const pct = Math.round((step / totalSteps) * 100);

  function finish() {
    const roadmap  = getOutcomeRoadmap(selectedRole.id);
    const courses  = getCoursesForRole(selectedRole.id);
    const resources= getResources(selectedRole.id);
    const relevantMentors = MENTORS.filter(m => m.specialFor.includes(selectedRole.id));
    onComplete({
      name,
      email: prefill.prefillEmail || "",
      eduLevel,
      targetRole: selectedRole,
      motivation,
      timeCommit,
      skills: { have: [], missing: selectedRole.skills_needed },
      roadmap,
      courses,
      resources,
      mentors: relevantMentors,
    });
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", zIndex:1 }}>
      <div style={{ width:"100%", maxWidth:700 }}>
        {/* Progress bar */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text3)", marginBottom:8 }}>
            <span>Step {step+1} of {totalSteps}</span>
            <span style={{ color:"var(--amber)", fontWeight:700 }}>{pct}% complete</span>
          </div>
          <div style={{ height:4, borderRadius:4, background:"var(--surface2)" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:4, background:"linear-gradient(90deg,var(--amber),var(--amber2))", transition:"width 0.4s ease" }}/>
          </div>
        </div>

        {/* STEP 0: Name + edu */}
        {step === 0 && (
          <div className="fade-up">
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:44, marginBottom:12 }}>👋</div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:30, fontWeight:800, marginBottom:6 }}>
                {prefill.isNewUser !== false ? "Let's get you hired" : "Welcome back!"}
              </h2>
              <p style={{ color:"var(--text2)", fontSize:14 }}>This takes 2 minutes. We'll build your job plan.</p>
            </div>
            {prefill.prefillEmail && (
              <div style={{ padding:"12px 16px", borderRadius:12, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:"var(--green)", fontSize:16 }}>✅</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--green)" }}>Account Created</div>
                  <div style={{ fontSize:12, color:"var(--text3)" }}>Logged in as {prefill.prefillEmail}</div>
                </div>
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:6, display:"block" }}>What should we call you? *</label>
              <input className="input-field" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"var(--text2)", marginBottom:12, display:"block" }}>Current education level</label>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["High School (10th/12th)","Undergraduate (1st–2nd yr)","Undergraduate (3rd–4th yr)","Graduate / Postgraduate","Working Professional","Career Switch"].map(l => (
                  <button key={l} onClick={() => setEduLevel(l)}
                    style={{ padding:"13px 18px", borderRadius:12, border:`2px solid ${eduLevel===l?"var(--amber)":"var(--border)"}`, background:eduLevel===l?"var(--amber-dim)":"var(--surface)", color:"var(--text)", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:14, textAlign:"left", transition:"all 0.18s" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:"15px", fontSize:16 }} disabled={!name.trim() || !eduLevel} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {/* STEP 1: Choose from TOP HIGH-DEMAND ROLES */}
        {step === 1 && (
          <div className="fade-up">
            <div style={{ marginBottom:28 }}>
              <div className="tag" style={{ background:"rgba(239,68,68,0.08)", color:"var(--red)", border:"1px solid rgba(239,68,68,0.25)", marginBottom:16 }}>🔥 Market Data — Updated Weekly</div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, marginBottom:6 }}>Top High-Demand Careers Right Now</h2>
              <p style={{ color:"var(--text2)", fontSize:14 }}>Pick the role you want to <strong>get hired in</strong>. These are ranked by demand + salary.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:24 }}>
              {TRENDING_ROLES.map(role => {
                const isSelected = selectedRole?.id === role.id;
                const demandClass = `demand-badge-${role.demand_level}`;
                return (
                  <div key={role.id} onClick={() => setSelectedRole(role)}
                    style={{ padding:"18px 16px", borderRadius:16, border:`2px solid ${isSelected ? role.color : "var(--border)"}`, background:isSelected ? `${role.color}10` : "var(--surface)", cursor:"pointer", transition:"all 0.2s" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{role.icon}</div>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:13, color:isSelected ? role.color : "var(--text)", marginBottom:6, lineHeight:1.3 }}>{role.title}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:isSelected ? role.color : "var(--amber)", marginBottom:6 }}>{role.salary_range}</div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      <span className={`tag ${demandClass}`} style={{ padding:"2px 8px", fontSize:10 }}>
                        {role.demand_level === "explosive" ? "🔥 Explosive" : role.demand_level === "high" ? "📈 High" : "📊 Medium"}
                      </span>
                      <span style={{ padding:"2px 8px", borderRadius:20, background:"var(--surface2)", color:"var(--text3)", fontSize:10 }}>{role.growth_rate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedRole && (
              <div style={{ padding:"16px 20px", borderRadius:14, background:`${selectedRole.color}08`, border:`1px solid ${selectedRole.color}25`, marginBottom:16 }}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
                  <div style={{ fontSize:32 }}>{selectedRole.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:16, color:selectedRole.color }}>{selectedRole.title}</div>
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:4 }}>
                      {[["💰",selectedRole.salary_range],["⏱️",selectedRole.time_to_learn],["💪",selectedRole.difficulty],["📈",selectedRole.growth_rate]].map(([ico,val]) => (
                        <span key={val} style={{ fontSize:12, color:"var(--text2)" }}>{ico} {val}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button className="btn-primary" style={{ width:"100%", padding:"14px", fontSize:16 }} disabled={!selectedRole} onClick={() => setStep(2)}>Choose This Career →</button>
          </div>
        )}

        {/* STEP 2: Motivation */}
        {step === 2 && (
          <div className="fade-up">
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:800, marginBottom:6 }}>What's your goal?</h2>
            <p style={{ color:"var(--text2)", marginBottom:24, fontSize:14 }}>This helps us calibrate your roadmap intensity</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {[
                { id:"job",       label:"🎯 Land my first job ASAP",         desc:"Focus on minimum viable skills to get hired" },
                { id:"switch",    label:"🔄 Switch careers from current role", desc:"Transition plan with salary negotiation" },
                { id:"freelance", label:"💼 Build freelance income",           desc:"Client-ready skills + portfolio building" },
                { id:"startup",   label:"🚀 Start my own venture",             desc:"Technical co-founder / startup MVP skills" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setMotivation(opt.id)}
                  style={{ padding:"16px 20px", borderRadius:12, border:`2px solid ${motivation===opt.id?"var(--amber)":"var(--border)"}`, background:motivation===opt.id?"var(--amber-dim)":"var(--surface)", color:"var(--text)", cursor:"pointer", fontFamily:"var(--font-body)", textAlign:"left", transition:"all 0.18s" }}>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{opt.label}</div>
                  <div style={{ fontSize:12, color:"var(--text2)" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:"14px", fontSize:16 }} disabled={!motivation} onClick={() => setStep(3)}>Continue →</button>
          </div>
        )}

        {/* STEP 3: Time commitment */}
        {step === 3 && (
          <div className="fade-up">
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:800, marginBottom:6 }}>How much time can you commit?</h2>
            <p style={{ color:"var(--text2)", marginBottom:24, fontSize:14 }}>Be realistic — we'll adjust your timeline accordingly</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { id:"light",    label:"⚡ 1–2 hours/day",   desc:"Part-time learner · {role} in ~18 months" },
                { id:"moderate", label:"🔥 3–5 hours/day",   desc:"Solid pace · {role} in ~10 months" },
                { id:"intense",  label:"💪 6–8 hours/day",   desc:"Intensive track · {role} in ~6 months" },
                { id:"fulltime", label:"🎯 Full-time hustle", desc:"Max speed · {role} in 3–4 months" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setTimeCommit(opt.id)}
                  style={{ padding:"16px 20px", borderRadius:12, border:`2px solid ${timeCommit===opt.id?"var(--amber)":"var(--border)"}`, background:timeCommit===opt.id?"var(--amber-dim)":"var(--surface)", color:"var(--text)", cursor:"pointer", fontFamily:"var(--font-body)", textAlign:"left", transition:"all 0.18s" }}>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{opt.label}</div>
                  <div style={{ fontSize:12, color:"var(--text2)" }}>{opt.desc.replace("{role}", selectedRole?.title || "your role")}</div>
                </button>
              ))}
            </div>
            <button className="btn-primary" style={{ width:"100%", padding:"14px", fontSize:16 }} disabled={!timeCommit} onClick={finish}>Build My Job Plan 🚀</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, userName, plan, onChat }) {
  const navItems = [
    { id:"dashboard", label:"Home",     icon:"🏠" },
    { id:"roadmap",   label:"Roadmap",  icon:"🗺️" },
    { id:"courses",   label:"Courses",  icon:"📘" },
    { id:"tasks",     label:"Tasks",    icon:"✅" },
    { id:"weakspot",  label:"Gaps",     icon:"📉" },
    { id:"resources", label:"Resources",icon:"📚" },
    { id:"mentors",   label:"Mentors",  icon:"🧑‍🏫" },
    { id:"placement", label:"Placement",icon:"💼" },
    { id:"pricing",   label:"Pricing",  icon:"⭐" },
  ];
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(7,7,15,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", padding:"8px 16px" }}>
      <div style={{ maxWidth:1300, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:900, fontSize:22, color:"var(--amber)", letterSpacing:-1 }}>FORGE</div>
          {plan === "pro" && <span className="pro-badge">✦ PRO</span>}
        </div>
        <div style={{ display:"flex", gap:2, overflowX:"auto" }}>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item${page===item.id?" active":""}`} onClick={() => setPage(item.id)}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:"var(--text3)", fontSize:12 }}>{userName}</span>
          <button className="btn-primary" style={{ padding:"7px 14px", fontSize:12 }} onClick={onChat}>Chat</button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD (Job-Outcome Focused) ──────────────────────────────────────────
function PageDashboard({ user, plan, onUpgrade, completedTasks, totalTasks, projectsBuilt, skillRatings }) {
  const role        = user.targetRole;
  const score       = calcJobReadiness(completedTasks, totalTasks, skillRatings, projectsBuilt);
  const scoreColor  = score < 30 ? "var(--red)" : score < 60 ? "var(--amber)" : "var(--green)";
  const improvements = [
    { action:"Complete 5 more tasks",       points:"+10%", done: completedTasks >= 5 },
    { action:`Learn ${role.skills_needed[0]}`, points:"+8%",  done: skillRatings[0] > 3 },
    { action:`Learn ${role.skills_needed[1]}`, points:"+8%",  done: skillRatings[1] > 3 },
    { action:"Build 2 projects",             points:"+20%", done: projectsBuilt >= 2 },
    { action:"Get a mentor session",          points:"+15%", done: false },
  ].filter(i => !i.done).slice(0, 3);

  const demandColor = role.demand_level === "explosive" ? "var(--red)" : role.demand_level === "high" ? "var(--green)" : "var(--amber)";

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:1100, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>

      {/* Hero card */}
      <div style={{ padding:"28px 32px", borderRadius:24, background:`linear-gradient(135deg,${role.color}12,rgba(139,92,246,0.06))`, border:`1px solid ${role.color}25`, marginBottom:24, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ fontSize:56 }}>{role.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:role.color, fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>Target Role</div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, marginBottom:4 }}>
            {role.title} <span style={{ fontSize:16, color:"var(--text2)", fontWeight:400 }}>for {user.name}</span>
          </h1>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:8 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--amber)" }}>💰 {role.salary_range}</span>
            <span style={{ fontSize:14, color:demandColor, fontWeight:600 }}>
              {role.demand_level === "explosive" ? "🔥 Explosive Demand" : role.demand_level === "high" ? "📈 High Demand" : "📊 Medium Demand"}
            </span>
            <span style={{ fontSize:14, color:"var(--text2)" }}>📈 {role.growth_rate} YoY growth</span>
            <span style={{ fontSize:14, color:"var(--text2)" }}>⏱️ ~{role.time_to_learn} to hire</span>
          </div>
        </div>
        {plan !== "pro" && (
          <button className="btn-pro" style={{ padding:"12px 20px", fontSize:13, whiteSpace:"nowrap" }} onClick={onUpgrade}>
            ✦ Upgrade to Pro
          </button>
        )}
      </div>

      {/* Job Readiness Score + Improvements */}
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:20, marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ padding:"28px", borderRadius:20, background:"var(--surface)", border:"1px solid var(--border)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, minWidth:200 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text2)", letterSpacing:2, textTransform:"uppercase" }}>Job Readiness Score</div>
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ScoreRing score={score} size={130} strokeWidth={10}/>
            <div style={{ position:"absolute", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, color:scoreColor }}>{score}%</div>
              <div style={{ fontSize:10, color:"var(--text3)" }}>Hireable</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:scoreColor, fontWeight:700, textAlign:"center" }}>
            {score < 30 ? "Just Getting Started" : score < 60 ? "Building Momentum" : score < 80 ? "Almost There!" : "Ready to Apply!"}
          </div>
        </div>
        <div style={{ padding:"24px", borderRadius:20, background:"var(--surface)", border:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, marginBottom:16, color:"var(--amber)" }}>⚡ Improve Your Score</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {improvements.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:12, background:"var(--bg3)", border:"1px solid var(--border)" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"var(--green)", fontWeight:700, flexShrink:0 }}>{item.points}</div>
                <span style={{ fontSize:14, color:"var(--text2)" }}>{item.action}</span>
              </div>
            ))}
          </div>
          {/* Skill coverage progress */}
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text2)", marginBottom:8 }}>
              <span>Skills covered</span>
              <span style={{ fontWeight:700, color:"var(--cyan)" }}>{skillRatings.filter(r=>r>2).length}/{role.skills_needed.length}</span>
            </div>
            <div style={{ height:6, borderRadius:6, background:"var(--surface2)" }}>
              <div style={{ height:"100%", width:`${(skillRatings.filter(r=>r>2).length/role.skills_needed.length)*100}%`, borderRadius:6, background:"linear-gradient(90deg,var(--cyan),var(--purple))", transition:"width 0.6s" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:24 }}>
        {[
          { icon:"✅", label:"Tasks Done",      val:`${completedTasks}/${totalTasks}`, color:"var(--green)" },
          { icon:"🏗️", label:"Projects Built",  val:projectsBuilt,                   color:"var(--cyan)" },
          { icon:"🎯", label:"Skills to Learn", val:role.skills_needed.length,        color:"var(--amber)" },
          { icon:"💰", label:"Target Salary",   val:role.salary_range,               color:"var(--purple)" },
        ].map(s => (
          <div key={s.label} style={{ padding:"20px 16px", borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)", textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:900, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Required skills */}
      <div style={{ padding:"24px", borderRadius:20, background:"var(--surface)", border:"1px solid var(--border)" }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, marginBottom:14 }}>
          🎓 Skills Required for {role.title}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {role.skills_needed.map((skill, i) => {
            const rating = skillRatings[i] || 0;
            const learned = rating > 2;
            return (
              <span key={skill} style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600, background:learned?"rgba(16,185,129,0.1)":"var(--bg3)", color:learned?"var(--green)":"var(--text3)", border:`1px solid ${learned?"rgba(16,185,129,0.25)":"var(--border)"}` }}>
                {learned ? "✓ " : ""}{skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── ROADMAP (Outcome-Based) ──────────────────────────────────────────────────
function PageRoadmap({ user, plan, onUpgrade }) {
  const role    = user.targetRole;
  const roadmap = user.roadmap;
  const [expanded, setExpanded] = useState(0);

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:860, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:`${role.color}18`, color:role.color, border:`1px solid ${role.color}30`, marginBottom:20 }}>🗺️ Job-Outcome Roadmap</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Your Path to {role.title}</h1>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:32 }}>
        <span style={{ fontSize:14, color:"var(--amber)", fontWeight:700 }}>💰 {role.salary_range}</span>
        <span style={{ fontSize:14, color:"var(--text2)" }}>⏱️ ~{role.time_to_learn}</span>
        <span style={{ fontSize:14, color:"var(--text2)" }}>📈 {role.growth_rate} growth</span>
      </div>

      {roadmap.map((phase, pi) => {
        const isLocked = plan !== "pro" && pi >= 2;
        const isOpen   = expanded === pi;
        return (
          <div key={pi} style={{ marginBottom:16 }}>
            <div onClick={() => !isLocked && setExpanded(isOpen ? -1 : pi)}
              style={{ padding:"20px 24px", borderRadius:isOpen ? "16px 16px 0 0" : 16, background:isOpen ? `${phase.color}08` : "var(--surface)", border:`1px solid ${isOpen ? phase.color + "30" : "var(--border)"}`, cursor:isLocked ? "default" : "pointer", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${phase.color},${phase.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{phase.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:16, color:isLocked ? "var(--text3)" : phase.color }}>{phase.phase}</div>
                <div style={{ fontSize:13, color:"var(--text2)", marginTop:2 }}>{phase.goal}</div>
              </div>
              {isLocked
                ? <span className="pro-badge">🔒 PRO</span>
                : <span style={{ color:"var(--text3)", fontSize:18 }}>{isOpen ? "▲" : "▼"}</span>}
            </div>
            {isOpen && (
              <div style={{ padding:"0 24px 24px", borderRadius:"0 0 16px 16px", background:`${phase.color}05`, border:`1px solid ${phase.color}20`, borderTop:"none" }}>
                <div style={{ paddingTop:16, display:"grid", gap:10, marginBottom:16 }}>
                  {phase.tasks.map((task, ti) => (
                    <div key={ti} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", borderRadius:12, background:"var(--bg)", border:"1px solid var(--border)" }}>
                      <div style={{ width:24, height:24, borderRadius:7, background:`${phase.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:11, color:phase.color, flexShrink:0, marginTop:1 }}>{ti+1}</div>
                      <span style={{ fontSize:14 }}>{task}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"14px 18px", borderRadius:12, background:`${phase.color}10`, border:`1px solid ${phase.color}25`, display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:18 }}>🏆</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:phase.color, marginBottom:2 }}>Expected Outcome</div>
                    <div style={{ fontSize:14, color:"var(--text2)" }}>{phase.outcome}</div>
                  </div>
                </div>
              </div>
            )}
            {isLocked && (
              <div style={{ marginTop:4 }}>
                <ProGate feature={`Phases 2–4 of your ${role.title} roadmap`} onUpgrade={onUpgrade}/>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── COURSES ──────────────────────────────────────────────────────────────────
function PageCourses({ user, plan }) {
  const courses = user.courses;
  const role    = user.targetRole;
  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:860, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:`${role.color}18`, color:role.color, border:`1px solid ${role.color}30`, marginBottom:20 }}>📘 Curated Courses</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Best Courses for {role.title}</h1>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>{courses.filter(c=>c.free).length} free · {courses.filter(c=>c.affiliate).length} affiliate-tagged · sorted by ROI</p>
      <div style={{ display:"grid", gap:14 }}>
        {courses.map((c,i) => (
          <div key={i} style={{ padding:"22px 24px", borderRadius:16, background:"var(--surface)", border:`1px solid ${c.affiliate?"rgba(245,158,11,0.3)":"var(--border)"}`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", position:"relative", overflow:"hidden" }}>
            {c.affiliate && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,var(--amber),transparent)" }}/>}
            <div>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:16 }}>{c.name}</div>
                {c.affiliate_badge && <span style={{ padding:"2px 8px", borderRadius:20, background:"var(--amber-dim)", color:"var(--amber)", fontSize:11, fontWeight:700 }}>{c.affiliate_badge}</span>}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ padding:"3px 10px", borderRadius:6, background:c.free?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.1)", color:c.free?"var(--green)":"var(--red)", fontSize:11, fontWeight:700 }}>{c.free?"✓ FREE":"PAID"}</span>
                <span style={{ padding:"3px 10px", borderRadius:6, background:"rgba(139,92,246,0.12)", color:"var(--purple)", fontSize:11 }}>{c.level}</span>
                <span style={{ padding:"3px 10px", borderRadius:6, background:"var(--surface2)", color:"var(--text2)", fontSize:11 }}>{c.tag}</span>
                <span style={{ padding:"3px 10px", borderRadius:6, background:c.roi==="Very High"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.08)", color:c.roi==="Very High"?"var(--green)":"var(--amber)", fontSize:11, fontWeight:700 }}>ROI: {c.roi}</span>
                {c.affiliate && <span style={{ padding:"3px 10px", borderRadius:6, background:"rgba(245,158,11,0.08)", color:"var(--amber)", fontSize:10 }}>🔗 Affiliate</span>}
              </div>
            </div>
            <a href={c.link} target="_blank" rel="noreferrer"
              style={{ padding:"11px 22px", borderRadius:10, background:`linear-gradient(135deg,${role.color},${role.color}88)`, color:"#000", fontFamily:"var(--font-display)", fontWeight:700, fontSize:13, textDecoration:"none", whiteSpace:"nowrap" }}>
              Start Learning →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TASK TRACKER ─────────────────────────────────────────────────────────────
function PageTaskTracker({ user, onTaskUpdate }) {
  const role    = user.targetRole;
  const today   = new Date().toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long" });
  const defaultTasks = [
    ...(user.roadmap[0]?.tasks||[]).slice(0,4).map((item,i) => ({ id:`r${i}`, text:item, category:"📘 Learning", done:i<1 })),
    { id:"t1", text:"Review yesterday's notes for 15 mins",    category:"🔁 Revision", done:false },
    { id:"t2", text:"Solve 1 practice problem / exercise",     category:"💪 Practice", done:false },
    { id:"t3", text:"Watch 1 video / read 1 article",          category:"📺 Resource", done:false },
    { id:"t4", text:"Log your progress",                       category:"📝 Admin",    done:false },
  ];

  const [tasks, setTasks]   = useState(defaultTasks);
  const [newTask, setNewTask] = useState("");
  const [newCat, setNewCat]   = useState("📘 Learning");
  const [streak]              = useState(3);

  const done = tasks.filter(t=>t.done).length;
  const pct  = tasks.length > 0 ? Math.round((done/tasks.length)*100) : 0;

  useEffect(() => { onTaskUpdate(done, tasks.length); }, [done, tasks.length]);

  const categories  = ["📘 Learning","💪 Practice","🔁 Revision","📺 Resource","📝 Admin","🔗 Networking","🏗️ Project"];
  const catColors   = {
    "📘 Learning":{ bg:"rgba(6,182,212,0.08)",     border:"rgba(6,182,212,0.2)",    text:"var(--cyan)" },
    "💪 Practice":{ bg:"rgba(245,158,11,0.08)",    border:"rgba(245,158,11,0.2)",   text:"var(--amber)" },
    "🔁 Revision":{ bg:"rgba(139,92,246,0.08)",    border:"rgba(139,92,246,0.2)",   text:"var(--purple)" },
    "📺 Resource":{ bg:"rgba(16,185,129,0.08)",    border:"rgba(16,185,129,0.2)",   text:"var(--green)" },
    "📝 Admin":   { bg:"rgba(148,163,184,0.08)",   border:"rgba(148,163,184,0.2)",  text:"var(--text2)" },
    "🔗 Networking":{ bg:"rgba(236,72,153,0.08)",  border:"rgba(236,72,153,0.2)",   text:"#EC4899" },
    "🏗️ Project":{ bg:"rgba(245,158,11,0.08)",     border:"rgba(245,158,11,0.2)",   text:"var(--amber)" },
  };

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:900, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:"rgba(16,185,129,0.08)", color:"var(--green)", border:"1px solid rgba(16,185,129,0.2)", marginBottom:20 }}>✅ Daily Task Tracker</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:4 }}>Today's Mission</h1>
          <p style={{ color:"var(--text3)", fontSize:13 }}>{today} · Goal: {role.title}</p>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ padding:"12px 20px", borderRadius:14, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:900, color:"var(--amber)" }}>🔥 {streak}</div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>Day Streak</div>
          </div>
          <div style={{ padding:"12px 20px", borderRadius:14, background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.18)", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:900, color:"var(--green)" }}>{done}/{tasks.length}</div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>Completed</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)", marginBottom:8 }}>
          <span>Daily Progress</span>
          <span style={{ fontWeight:700, color:pct===100?"var(--green)":"var(--amber)" }}>{pct}%{pct===100?" 🎉 All done!":""}</span>
        </div>
        <div style={{ height:10, borderRadius:10, background:"var(--surface2)", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, borderRadius:10, background:pct===100?"var(--green)":"linear-gradient(90deg,var(--amber),var(--amber2))", transition:"width 0.5s ease" }}/>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ display:"grid", gap:10, marginBottom:28 }}>
        {tasks.map(task => {
          const cc = catColors[task.category] || catColors["📝 Admin"];
          return (
            <div key={task.id} className="task-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:14, background:"var(--surface)", border:`1px solid ${task.done?"rgba(16,185,129,0.2)":"var(--border)"}`, opacity:task.done?0.7:1 }}>
              <div className={`task-check${task.done?" done":""}`} onClick={() => setTasks(ts => ts.map(t => t.id===task.id ? {...t,done:!t.done} : t))}>
                {task.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ flex:1, fontSize:14, fontWeight:500, color:task.done?"var(--text3)":"var(--text)", textDecoration:task.done?"line-through":"none", transition:"all 0.2s" }}>{task.text}</div>
              <span style={{ padding:"3px 10px", borderRadius:20, background:cc.bg, border:`1px solid ${cc.border}`, color:cc.text, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{task.category}</span>
              <button onClick={() => setTasks(ts => ts.filter(t => t.id!==task.id))} style={{ background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:18, lineHeight:1, opacity:0.5 }}>×</button>
            </div>
          );
        })}
      </div>

      {/* Add task */}
      <div style={{ padding:20, borderRadius:16, background:"var(--surface)", border:"1px solid var(--border2)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"var(--text2)", marginBottom:14 }}>+ Add a Custom Task</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <input value={newTask} onChange={e=>setNewTask(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&newTask.trim()) { setTasks(ts=>[...ts,{id:Date.now().toString(),text:newTask.trim(),category:newCat,done:false}]); setNewTask(""); }}}
            placeholder="What do you want to accomplish today?"
            style={{ flex:2, minWidth:200, padding:"11px 14px", borderRadius:10, background:"var(--bg3)", border:"1px solid var(--border2)", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:14, outline:"none" }}/>
          <select value={newCat} onChange={e=>setNewCat(e.target.value)}
            style={{ flex:1, minWidth:150, padding:"11px 14px", borderRadius:10, background:"var(--bg3)", border:"1px solid var(--border2)", color:"var(--text2)", fontFamily:"var(--font-body)", fontSize:13, outline:"none" }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-primary" style={{ padding:"11px 22px", fontSize:14 }} onClick={() => { if(!newTask.trim()) return; setTasks(ts=>[...ts,{id:Date.now().toString(),text:newTask.trim(),category:newCat,done:false}]); setNewTask(""); }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ── WEAK ANALYSIS ─────────────────────────────────────────────────────────────
function PageWeakAnalysis({ user, onSkillUpdate }) {
  const role    = user.targetRole;
  const missing = role.skills_needed;
  const [ratings, setRatings] = useState(() => Object.fromEntries(missing.map((s,i) => [s, Math.max(1, 3-(i%3))])));
  const [submitted, setSubmitted] = useState(false);
  const [aiRec, setAiRec]         = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const ratingLabels = {1:"Very Weak",2:"Weak",3:"Average",4:"Good",5:"Strong"};
  const ratingColors = {1:"var(--red)",2:"#F97316",3:"var(--amber)",4:"var(--cyan)",5:"var(--green)"};
  const sorted       = [...missing].sort((a,b) => ratings[a]-ratings[b]);

  useEffect(() => { onSkillUpdate(Object.values(ratings)); }, [JSON.stringify(ratings)]);

  async function getAIAnalysis() {
    setAiLoading(true);
    const weakList = sorted.slice(0,4).map(s=>`${s}(${ratings[s]}/5)`).join(", ");
    const sys   = `You are an expert career mentor. Analyze weak skill areas and give a specific improvement plan. Be concise, encouraging, actionable. Max 200 words.`;
    const prompt = `Student targeting ${role.title}. Salary target: ${role.salary_range}. Weakest skills: ${weakList}. Give: 1) Top priority to fix first, 2) Quick win strategy, 3) How it impacts their job readiness score.`;
    const reply  = await askClaude([{role:"user",content:prompt}], sys);
    setAiRec(reply);
    setAiLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:960, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:"rgba(239,68,68,0.08)", color:"var(--red)", border:"1px solid rgba(239,68,68,0.25)", marginBottom:20 }}>📉 Skill Gap Analysis</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Know Your Exact Gaps</h1>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>Rate your confidence in each skill required for <strong style={{ color:role.color }}>{role.title}</strong>. This updates your Job Readiness Score.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, marginBottom:16, color:"var(--text2)" }}>🎯 Rate Your Confidence (1–5)</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {missing.map(skill => {
              const r = ratings[skill];
              return (
                <div key={skill} style={{ padding:"16px 18px", borderRadius:14, background:"var(--surface)", border:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:14, fontWeight:600 }}>{skill}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:ratingColors[r], padding:"3px 10px", borderRadius:20, background:`${ratingColors[r]}15` }}>{ratingLabels[r]}</span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRatings(prev => ({...prev,[skill]:n}))}
                        style={{ width:36, height:36, borderRadius:8, border:`2px solid ${r>=n?ratingColors[n]:"var(--border2)"}`, background:r>=n?`${ratingColors[n]}18`:"var(--bg3)", color:r>=n?ratingColors[n]:"var(--text3)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"var(--font-display)", transition:"all 0.18s" }}>{n}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-primary" style={{ width:"100%", padding:"14px", fontSize:15, marginTop:20 }} onClick={getAIAnalysis} disabled={aiLoading}>
            {aiLoading ? "Analyzing..." : "🤖 Get AI Gap Analysis →"}
          </button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ padding:20, borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, marginBottom:16 }}>📊 Skill Strength Map</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {sorted.map(skill => {
                const r = ratings[skill]; const w = (r/5)*100;
                return (
                  <div key={skill}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                      <span style={{ color:"var(--text2)" }}>{skill}</span>
                      <span style={{ fontWeight:700, color:ratingColors[r] }}>{r}/5</span>
                    </div>
                    <div style={{ height:8, borderRadius:10, background:"var(--surface2)" }}>
                      <div className="weak-bar" style={{ "--tw":`${w}%`, width:`${w}%`, background:`linear-gradient(90deg,${ratingColors[r]},${ratingColors[Math.min(r+1,5)]})` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding:20, borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, marginBottom:14 }}>🚨 Fix These First (Job Impact)</div>
            {sorted.slice(0,3).map((sk,i) => (
              <div key={sk} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<2?"1px solid var(--border)":"none" }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${ratingColors[ratings[sk]]}18`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:13, color:ratingColors[ratings[sk]], flexShrink:0 }}>#{i+1}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{sk}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>Current: {ratingLabels[ratings[sk]]} · Target: Strong</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:"var(--green)" }}>+{[8,7,6][i]}% score</div>
              </div>
            ))}
          </div>

          {submitted && (
            <div style={{ padding:20, borderRadius:16, background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.2)", animation:"fadeUp 0.4s ease" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, color:"var(--purple)", marginBottom:10 }}>🤖 AI Gap Analysis</div>
              <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{aiLoading ? "Thinking..." : aiRec}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── RESOURCES ─────────────────────────────────────────────────────────────────
function PageResources({ user }) {
  const resources = user.resources;
  const role      = user.targetRole;
  const [searchQ, setSearchQ]       = useState("");
  const [showFreeOnly, setShowFree] = useState(false);
  const [aiPicks, setAiPicks]       = useState([]);
  const [aiLoading, setAiLoading]   = useState(false);

  const filtered = resources.filter(r => {
    const mFree   = !showFreeOnly || r.free;
    const mSearch = !searchQ || r.title.toLowerCase().includes(searchQ.toLowerCase()) || r.tag.toLowerCase().includes(searchQ.toLowerCase());
    return mFree && mSearch;
  });

  const typeColors = { "Website":"var(--cyan)", "Course":"var(--amber)", "YouTube":"#EF4444", "Platform":"var(--green)", "Blog":"var(--text2)", "Practice":"#F97316", "Reference":"var(--text2)", "Tool":"var(--purple)", "Research":"var(--cyan)" };

  async function getAIPicks() {
    setAiLoading(true);
    const sys  = `You are a career mentor. Recommend exactly 3 specific learning resources (real websites/courses) for this student. Return ONLY a JSON array like: [{"title":"...","url":"...","why":"one sentence why it's perfect for them"}]. No other text.`;
    const prompt = `Student targeting ${role.title} (salary: ${role.salary_range}). Missing skills: ${role.skills_needed.join(", ")}.`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, system:sys, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      const clean= text.replace(/```json|```/g,"").trim();
      setAiPicks(JSON.parse(clean));
    } catch { setAiPicks([{ title:"Error", url:"#", why:"Could not fetch picks. Please try again." }]); }
    setAiLoading(false);
  }

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:1000, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:"rgba(6,182,212,0.08)", color:"var(--cyan)", border:"1px solid rgba(6,182,212,0.25)", marginBottom:20 }}>📚 Resource Library</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Resources for {role.title}</h1>
      <p style={{ color:"var(--text2)", marginBottom:28 }}>Curated for <strong style={{ color:role.color }}>{role.title}</strong> · {resources.filter(r=>r.free).length} free included</p>

      {/* AI Picks Banner */}
      <div style={{ padding:"20px 24px", borderRadius:18, background:"linear-gradient(135deg,rgba(245,158,11,0.08),rgba(139,92,246,0.06))", border:"1px solid rgba(245,158,11,0.2)", marginBottom:24, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:32 }}>🤖</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700, marginBottom:4 }}>AI-Picked Resources, Just for You</div>
          <p style={{ color:"var(--text2)", fontSize:13, margin:0 }}>Based on your target role, skill gaps, and fastest path to hire.</p>
        </div>
        <button className="btn-primary" style={{ padding:"11px 22px", fontSize:13, whiteSpace:"nowrap" }} onClick={getAIPicks} disabled={aiLoading}>
          {aiLoading ? "Picking..." : "Get My Picks →"}
        </button>
      </div>

      {aiPicks.length > 0 && (
        <div style={{ marginBottom:24, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, animation:"fadeUp 0.3s ease" }}>
          {aiPicks.map((p,i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer"
              style={{ padding:"18px 20px", borderRadius:16, background:"rgba(245,158,11,0.05)", border:"2px solid rgba(245,158,11,0.25)", textDecoration:"none", display:"block", transition:"all 0.2s" }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                <span style={{ fontSize:20 }}>⭐</span>
                <div style={{ fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"var(--amber)" }}>AI Pick #{i+1}</div>
              </div>
              <div style={{ fontWeight:600, fontSize:15, color:"var(--text)", marginBottom:6 }}>{p.title}</div>
              <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5 }}>{p.why}</div>
              <div style={{ fontSize:11, color:"var(--amber)", marginTop:10, fontWeight:600 }}>Visit Resource →</div>
            </a>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
        <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search resources..."
          style={{ padding:"9px 14px", borderRadius:10, background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:13, outline:"none", width:200 }}/>
        <button onClick={() => setShowFree(!showFreeOnly)}
          style={{ padding:"7px 14px", borderRadius:20, border:`1px solid ${showFreeOnly?"var(--green)":"var(--border2)"}`, background:showFreeOnly?"rgba(16,185,129,0.1)":"transparent", color:showFreeOnly?"var(--green)":"var(--text2)", fontSize:12, fontWeight:showFreeOnly?700:400, cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.2s" }}>
          {showFreeOnly ? "✓ Free Only" : "Free Only"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {filtered.map((r,i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="res-card"
            style={{ display:"block", padding:"20px 22px", borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)", textDecoration:"none" }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{r.title}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <span style={{ padding:"2px 9px", borderRadius:20, background:`${typeColors[r.type]||"var(--text2)"}12`, color:typeColors[r.type]||"var(--text2)", fontSize:10, fontWeight:700 }}>{r.type}</span>
                  <span style={{ padding:"2px 9px", borderRadius:20, background:"var(--surface2)", color:"var(--text3)", fontSize:10, fontWeight:600 }}>{r.tag}</span>
                  {r.free && <span style={{ padding:"2px 9px", borderRadius:20, background:"rgba(16,185,129,0.1)", color:"var(--green)", fontSize:10, fontWeight:700 }}>FREE</span>}
                </div>
              </div>
            </div>
            <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, margin:"0 0 12px" }}>{r.desc}</p>
            <div style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>Open Resource →</div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── MENTOR PAGE (NEW) ─────────────────────────────────────────────────────────
function PageMentors({ user, plan, onUpgrade }) {
  const role       = user.targetRole;
  const [tab, setTab] = useState("1on1");
  const relevantMentors = MENTORS.filter(m => m.specialFor.includes(role.id));
  const otherMentors    = MENTORS.filter(m => !m.specialFor.includes(role.id));

  function BookButton({ mentor }) {
    if (plan !== "pro") {
      return (
        <button className="btn-pro" style={{ padding:"10px 18px", fontSize:13, whiteSpace:"nowrap" }} onClick={onUpgrade}>
          🔒 Book (Pro)
        </button>
      );
    }
    return (
      <button className="btn-primary" style={{ padding:"10px 18px", fontSize:13, whiteSpace:"nowrap" }} onClick={() => alert(`Booking session with ${mentor.name}! (Payment integration needed)`)}>
        Book Session →
      </button>
    );
  }

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:1000, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:"rgba(139,92,246,0.08)", color:"var(--purple)", border:"1px solid rgba(139,92,246,0.25)", marginBottom:20 }}>🧑‍🏫 Mentorship</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Get Mentored by Industry Experts</h1>
      <p style={{ color:"var(--text2)", marginBottom:28 }}>1:1 sessions, group bootcamps, and AI mentor — all in one place</p>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, background:"var(--surface)", borderRadius:12, padding:4, marginBottom:28, width:"fit-content" }}>
        {[["1on1","👤 1:1 Mentors"],["group","👥 Group Sessions"],["ai","🤖 AI Mentor"]].map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:"10px 20px", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"var(--font-display)", fontWeight:700, fontSize:13, transition:"all 0.2s", background:tab===id?"var(--amber)":"transparent", color:tab===id?"#000":"var(--text2)" }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* 1:1 Mentors */}
      {tab === "1on1" && (
        <div>
          {relevantMentors.length > 0 && (
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:12, fontWeight:700, color:role.color, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>⭐ Top Picks for {role.title}</div>
              <div style={{ display:"grid", gap:16 }}>
                {relevantMentors.map(mentor => (
                  <div key={mentor.id} className="mentor-card" style={{ padding:"24px", borderRadius:20, background:"var(--surface)", border:`1px solid ${role.color}25`, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${role.color},transparent)` }}/>
                    <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
                      <div style={{ width:60, height:60, borderRadius:16, background:`${role.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{mentor.img}</div>
                      <div style={{ flex:1, minWidth:200 }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                          <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:18 }}>{mentor.name}</div>
                          {!mentor.available && <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(239,68,68,0.1)", color:"var(--red)", fontSize:11, fontWeight:700 }}>Fully Booked</span>}
                          {mentor.available && <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(16,185,129,0.1)", color:"var(--green)", fontSize:11, fontWeight:700 }}>● Available</span>}
                        </div>
                        <div style={{ color:"var(--text2)", fontSize:14, marginBottom:8 }}>{mentor.role} at <strong style={{ color:"var(--text)" }}>{mentor.company}</strong></div>
                        <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, marginBottom:12 }}>{mentor.bio}</p>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {mentor.expertise.map(e => (
                            <span key={e} style={{ padding:"3px 10px", borderRadius:20, background:"var(--surface2)", color:"var(--text2)", fontSize:11, fontWeight:600 }}>{e}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign:"center", minWidth:120 }}>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, color:"var(--amber)", marginBottom:2 }}>₹{mentor.price_per_session.toLocaleString()}</div>
                        <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4 }}>per session</div>
                        <div style={{ fontSize:13, color:"var(--text2)", marginBottom:10 }}>⭐ {mentor.rating} · {mentor.sessions_completed} sessions</div>
                        <BookButton mentor={mentor}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Other mentors */}
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)", letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>All Mentors</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
            {otherMentors.map(mentor => (
              <div key={mentor.id} className="mentor-card" style={{ padding:"20px", borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)" }}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{mentor.img}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, marginBottom:2 }}>{mentor.name}</div>
                    <div style={{ fontSize:12, color:"var(--text2)" }}>{mentor.role} · {mentor.company}</div>
                    <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>⭐ {mentor.rating} · {mentor.sessions_completed} sessions</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"var(--amber)" }}>₹{mentor.price_per_session.toLocaleString()}<span style={{ fontSize:12, color:"var(--text3)", fontWeight:400 }}>/session</span></div>
                  <BookButton mentor={mentor}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Sessions */}
      {tab === "group" && (
        <div style={{ display:"grid", gap:16 }}>
          {GROUP_SESSIONS.map(session => {
            const isFull = session.spots_left === 0;
            return (
              <div key={session.id} style={{ padding:"24px", borderRadius:16, background:"var(--surface)", border:"1px solid var(--border)", display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:17 }}>{session.title}</div>
                    {isFull && <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(239,68,68,0.1)", color:"var(--red)", fontSize:11, fontWeight:700 }}>Full</span>}
                    {!isFull && session.spots_left <= 5 && <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(245,158,11,0.1)", color:"var(--amber)", fontSize:11, fontWeight:700 }}>🔥 Only {session.spots_left} left!</span>}
                  </div>
                  <div style={{ fontSize:13, color:"var(--text2)", marginBottom:8 }}>
                    by <strong>{session.mentor}</strong> · {session.date} · {session.duration}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>Spots: {session.total_spots - session.spots_left}/{session.total_spots} filled</div>
                    <div style={{ width:80, height:6, borderRadius:6, background:"var(--surface2)", marginTop:3 }}>
                      <div style={{ height:"100%", width:`${((session.total_spots-session.spots_left)/session.total_spots)*100}%`, borderRadius:6, background:"var(--amber)" }}/>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:900, color:"var(--green)", marginBottom:4 }}>₹{session.price}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:10 }}>per person</div>
                  <button className={isFull?"btn-ghost":"btn-primary"} style={{ padding:"10px 20px", fontSize:13 }} disabled={isFull} onClick={() => !isFull && alert(`Booking group session: ${session.title}`)}>
                    {isFull ? "Waitlist" : "Join Session →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Mentor */}
      {tab === "ai" && (
        <div style={{ textAlign:"center", padding:"40px 0" }}>
          <div style={{ width:80, height:80, borderRadius:24, background:"linear-gradient(135deg,var(--purple),var(--cyan))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px", boxShadow:"0 0 40px rgba(139,92,246,0.3)" }}>🤖</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, marginBottom:10 }}>AI Career Mentor</h2>
          <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:32, maxWidth:500, margin:"0 auto 32px" }}>
            Knows your profile, your role, your skill gaps. Gives personalized advice 24/7 for <strong style={{ color:role.color }}>{role.title}</strong>.
            {plan !== "pro" && <span style={{ color:"var(--text3)", fontSize:13, display:"block", marginTop:4 }}>Free plan: 5 messages/day. Pro: Unlimited.</span>}
          </p>
          <button className="btn-primary" style={{ padding:"16px 40px", fontSize:17 }} onClick={() => alert("Opening AI Chat")}>💬 Open AI Chat →</button>
        </div>
      )}
    </div>
  );
}

// ── PLACEMENT ─────────────────────────────────────────────────────────────────
function PagePlacement({ user, plan, onUpgrade, onChat }) {
  const role = user.targetRole;
  const tools = [
    { icon:"📝", title:"AI Resume Builder",         desc:`ATS-optimized resume for ${role.title} roles. Keyword-optimized.`, color:"var(--amber)",   pro:true  },
    { icon:"🎤", title:"Mock Interview AI",          desc:`Practice ${role.title} interview questions with real-time feedback.`, color:"var(--cyan)", pro:true  },
    { icon:"💼", title:"Job Board Aggregator",       desc:`Top ${role.title} openings from LinkedIn, Naukri, Wellfound.`, color:"var(--green)",     pro:false },
    { icon:"🌐", title:"Portfolio Builder",          desc:"Build a portfolio site in minutes. Deploy to GitHub Pages.", color:"var(--purple)",         pro:true  },
    { icon:"📊", title:"Salary Negotiation Guide",  desc:`Benchmark salaries for ${role.title}. Target: ${role.salary_range}`, color:"#EC4899",      pro:true  },
    { icon:"🔗", title:"Referral Network",           desc:"Connect with hiring managers at top companies.", color:"var(--amber)",                      pro:true  },
  ];

  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:860, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background:"rgba(236,72,153,0.08)", color:"#EC4899", border:"1px solid rgba(236,72,153,0.25)", marginBottom:20 }}>💼 Placement Tools</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:900, marginBottom:6 }}>Get Hired as {role.title}</h1>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>Target salary: <strong style={{ color:"var(--amber)" }}>{role.salary_range}</strong> · Demand: {role.growth_rate} growth</p>
      <div style={{ display:"grid", gap:14 }}>
        {tools.map((item,i) => (
          <div key={i} style={{ padding:"24px", background:"var(--surface)", border:`1px solid ${item.pro&&plan!=="pro"?"rgba(139,92,246,0.2)":"var(--border)"}`, borderRadius:16, display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ fontSize:40 }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:17, color:item.color }}>{item.title}</div>
                {item.pro && plan !== "pro" && <span className="pro-badge">🔒 PRO</span>}
              </div>
              <div style={{ color:"var(--text2)", fontSize:14, lineHeight:1.5 }}>{item.desc}</div>
            </div>
            {item.pro && plan !== "pro"
              ? <button className="btn-pro" style={{ padding:"12px 22px", fontSize:13, whiteSpace:"nowrap" }} onClick={onUpgrade}>Upgrade →</button>
              : <button onClick={onChat} style={{ padding:"12px 22px", borderRadius:10, background:"linear-gradient(135deg,#8B5CF6,#4F46E5)", border:"none", color:"#fff", fontFamily:"var(--font-display)", fontWeight:700, cursor:"pointer", fontSize:13, whiteSpace:"nowrap" }}>Open with AI →</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PRICING PAGE (NEW) ────────────────────────────────────────────────────────
function PagePricing({ plan, onUpgrade }) {
  return (
    <div style={{ padding:"80px 24px 40px", maxWidth:860, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div className="tag" style={{ background:"rgba(139,92,246,0.08)", color:"var(--purple)", border:"1px solid rgba(139,92,246,0.25)", marginBottom:20, display:"inline-flex" }}>⭐ Pricing</div>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:38, fontWeight:900, marginBottom:10 }}>Invest in Your Career</h1>
        <p style={{ color:"var(--text2)", fontSize:16 }}>One tool. Everything you need to go from learning → hired.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* FREE */}
        <div style={{ padding:"32px", borderRadius:24, background:"var(--surface)", border:"1px solid var(--border)" }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:800, marginBottom:4 }}>Free</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:900, color:"var(--text)" }}>₹0<span style={{ fontSize:16, color:"var(--text3)", fontWeight:400 }}>/mo</span></div>
            <div style={{ fontSize:13, color:"var(--text3)", marginTop:4 }}>Forever free</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {PLANS.free.features.map(f => (
              <div key={f} style={{ display:"flex", gap:10, fontSize:14, color:"var(--text2)" }}>
                <span style={{ color:"var(--green)", flexShrink:0 }}>✓</span>{f}
              </div>
            ))}
            <div style={{ height:1, background:"var(--border)", margin:"6px 0" }}/>
            {PLANS.free.locked.map(f => (
              <div key={f} style={{ display:"flex", gap:10, fontSize:14, color:"var(--text3)" }}>
                <span style={{ flexShrink:0 }}>🔒</span>{f}
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ width:"100%", padding:"14px", fontSize:15 }} disabled={plan==="free"}>
            {plan === "free" ? "✓ Current Plan" : "Downgrade"}
          </button>
        </div>

        {/* PRO */}
        <div style={{ padding:"32px", borderRadius:24, background:"linear-gradient(135deg,rgba(139,92,246,0.1),rgba(79,70,229,0.08))", border:"2px solid rgba(139,92,246,0.4)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--purple),var(--cyan))" }}/>
          <div style={{ position:"absolute", top:16, right:16, padding:"4px 12px", borderRadius:20, background:"linear-gradient(135deg,var(--purple),#4F46E5)", color:"#fff", fontSize:11, fontWeight:700, fontFamily:"var(--font-display)" }}>MOST POPULAR</div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:800, marginBottom:4, color:"var(--purple)" }}>Pro</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:900, color:"var(--purple)" }}>₹499<span style={{ fontSize:16, color:"var(--text3)", fontWeight:400 }}>/mo</span></div>
            <div style={{ fontSize:13, color:"var(--text3)", marginTop:4 }}>or ₹3,999/year (save 33%)</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {PLANS.pro.features.map(f => (
              <div key={f} style={{ display:"flex", gap:10, fontSize:14, color:"var(--text)" }}>
                <span style={{ color:"var(--purple)", flexShrink:0 }}>✦</span>{f}
              </div>
            ))}
          </div>
          <button className="btn-pro" style={{ width:"100%", padding:"15px", fontSize:16 }} disabled={plan==="pro"} onClick={onUpgrade}>
            {plan === "pro" ? "✓ Current Plan" : "Upgrade to Pro →"}
          </button>
          <div style={{ fontSize:12, color:"var(--text3)", textAlign:"center", marginTop:12 }}>7-day free trial · Cancel anytime</div>
        </div>
      </div>

      {/* Mentorship add-on */}
      <div style={{ marginTop:24, padding:"28px", borderRadius:20, background:"linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.02))", border:"1px solid rgba(245,158,11,0.25)" }}>
        <div style={{ display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:40 }}>🧑‍🏫</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:800, marginBottom:4 }}>1:1 Mentorship Sessions</div>
            <p style={{ color:"var(--text2)", fontSize:14, margin:0 }}>Book individual sessions with industry experts. Pro members get 20% off all sessions.</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, color:"var(--text2)" }}>Starting from</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, color:"var(--amber)" }}>₹999</div>
            <div style={{ fontSize:12, color:"var(--text3)" }}>per session</div>
          </div>
          <button className="btn-primary" style={{ padding:"12px 24px", fontSize:14 }} onClick={() => alert("Navigate to Mentors tab")}>View Mentors →</button>
        </div>
      </div>
    </div>
  );
}

// ── AI CHATBOT ─────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display:"flex", gap:6, padding:"12px 16px", background:"rgba(255,255,255,0.05)", borderRadius:16, width:"fit-content", alignItems:"center" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"var(--cyan)", animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }}/>
      ))}
    </div>
  );
}

function ChatBot({ user, plan, onClose }) {
  const role = user.targetRole;
  const [messages, setMessages] = useState([{
    role:"assistant",
    content:`Hi ${user.name}! 👋 I'm your AI career mentor on Forge.\n\nI know you're targeting **${role.title}** (${role.salary_range} salary range). I know your skill gaps and your roadmap phases.\n\nAsk me anything — what to learn next, how to get hired faster, resume tips, or how to negotiate salary!`
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef               = useRef(null);
  const [msgCount, setMsgCount] = useState(0);
  const FREE_LIMIT            = 5;

  const systemPrompt = `You are an expert AI career mentor on Forge - a Job Outcome Platform.

Student Profile:
- Name: ${user.name}
- Target Role: ${role.title}
- Salary Target: ${role.salary_range}
- Demand Level: ${role.demand_level} (${role.growth_rate} YoY growth)
- Education: ${user.eduLevel}
- Motivation: ${user.motivation}
- Time Commitment: ${user.timeCommit}
- Required Skills: ${role.skills_needed.join(", ")}

Your ONLY goal is to help this person get HIRED as a ${role.title}.
- Be specific, actionable, and employer-focused
- Prioritize speed to hire over breadth of learning  
- Recommend free resources when possible
- Always connect advice back to getting the job
- Keep responses tight and high-value (use bullets when listing)`;

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    if (plan !== "pro" && msgCount >= FREE_LIMIT) {
      setMessages(m => [...m, { role:"assistant", content:"🔒 You've reached the 5 message/day limit on the Free plan. Upgrade to Pro for unlimited AI mentor access!" }]);
      return;
    }
    const userMsg = { role:"user", content:input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setMsgCount(c => c+1);
    const history = [...messages, userMsg].map(m => ({ role:m.role, content:m.content }));
    const reply   = await askClaude(history, systemPrompt);
    setMessages(m => [...m, { role:"assistant", content:reply }]);
    setLoading(false);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:680, height:"85vh", background:"var(--bg)", borderRadius:24, border:"1px solid rgba(139,92,246,0.3)", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 0 60px rgba(139,92,246,0.12)" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(139,92,246,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,var(--purple),var(--cyan))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
            <div>
              <div style={{ color:"var(--text)", fontFamily:"var(--font-display)", fontWeight:700, fontSize:15 }}>Forge AI Mentor</div>
              <div style={{ color:"var(--green)", fontSize:12 }}>● Online · Personalized for {role.title}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            {plan !== "pro" && <span style={{ fontSize:12, color:"var(--text3)" }}>{msgCount}/{FREE_LIMIT} messages</span>}
            <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:22 }}>✕</button>
          </div>
        </div>

        <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:14 }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              <div style={{ maxWidth:"82%", padding:"12px 16px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?"linear-gradient(135deg,var(--purple),#4F46E5)":"var(--surface)", color:"var(--text)", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap", border:m.role==="assistant"?"1px solid var(--border)":"none" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <TypingIndicator/>}
        </div>

        <div style={{ padding:"0 16px 8px", display:"flex", gap:8, flexWrap:"wrap" }}>
          {["What should I learn first?","How fast can I get hired?","Review my skill gaps","Salary negotiation tips"].map(s => (
            <button key={s} onClick={() => setInput(s)} style={{ padding:"6px 12px", borderRadius:20, background:"var(--amber-dim)", border:"1px solid rgba(245,158,11,0.25)", color:"var(--amber)", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"var(--font-body)" }}>{s}</button>
          ))}
        </div>

        <div style={{ padding:"8px 16px 16px", display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask your AI career mentor anything..."
            style={{ flex:1, padding:"12px 16px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--text)", fontFamily:"var(--font-body)", fontSize:14, outline:"none" }}/>
          <button onClick={send} style={{ padding:"12px 20px", borderRadius:12, background:"linear-gradient(135deg,var(--amber),var(--amber2))", border:"none", color:"#000", fontFamily:"var(--font-display)", fontWeight:700, cursor:"pointer", fontSize:14 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, onUpgrade }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:480, background:"var(--bg)", borderRadius:24, border:"2px solid rgba(139,92,246,0.4)", padding:"40px 36px", animation:"fadeUp 0.3s ease", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--purple),var(--cyan))" }}/>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:22 }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✦</div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:28, fontWeight:900, color:"var(--purple)", marginBottom:8 }}>Upgrade to Pro</h2>
          <p style={{ color:"var(--text2)", fontSize:14, lineHeight:1.6 }}>Unlock everything you need to get hired fast</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
          {PLANS.pro.features.map(f => (
            <div key={f} style={{ display:"flex", gap:10, fontSize:14, color:"var(--text)" }}>
              <span style={{ color:"var(--purple)", flexShrink:0 }}>✦</span>{f}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, flexDirection:"column" }}>
          <button className="btn-pro" style={{ width:"100%", padding:"15px", fontSize:16 }} onClick={() => { onUpgrade(); onClose(); }}>
            Start 7-Day Free Trial →
          </button>
          <div style={{ fontSize:12, color:"var(--text3)", textAlign:"center" }}>₹499/month after trial · Cancel anytime</div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]     = useState("landing");
  const [prefill, setPrefill] = useState({});
  const [user, setUser]     = useState(null);
  const [page, setPage]     = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [plan, setPlan]     = useState("free"); // "free" | "pro"
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Job readiness tracking
  const [completedTasks, setCompletedTasks] = useState(1);
  const [totalTasks, setTotalTasks]         = useState(8);
  const [skillRatings, setSkillRatings]     = useState([3,2,1,2,1,2]);
  const [projectsBuilt, setProjectsBuilt]   = useState(0);

  function handleAuthDone(pf) { setPrefill(pf); setView("onboarding"); }
  function handleOnboardingComplete(data) { setUser(data); setView("app"); }
  function handleTaskUpdate(done, total) { setCompletedTasks(done); setTotalTasks(total); }
  function handleSkillUpdate(ratings) { setSkillRatings(ratings); }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", fontFamily:"var(--font-body)" }}>
      <style>{GLOBAL_CSS}</style>
      <GlowBg/>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={() => setPlan("pro")}/>}

      {view === "landing" && (
        <PageLanding onStart={() => setView("onboarding")} onAuthDone={handleAuthDone}/>
      )}

      {view === "onboarding" && (
        <PageOnboarding onComplete={handleOnboardingComplete} prefill={prefill}/>
      )}

      {view === "app" && user && (
        <>
          <NavBar page={page} setPage={setPage} userName={user.name} plan={plan} onChat={() => setChatOpen(true)}/>
          {chatOpen && <ChatBot user={user} plan={plan} onClose={() => setChatOpen(false)}/>}
          <div style={{ position:"relative", zIndex:1 }}>
            {page === "dashboard" && (
              <PageDashboard
                user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)}
                completedTasks={completedTasks} totalTasks={totalTasks}
                projectsBuilt={projectsBuilt} skillRatings={skillRatings}
              />
            )}
            {page === "roadmap"   && <PageRoadmap   user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)}/>}
            {page === "courses"   && <PageCourses   user={user} plan={plan}/>}
            {page === "tasks"     && <PageTaskTracker user={user} onTaskUpdate={handleTaskUpdate}/>}
            {page === "weakspot"  && <PageWeakAnalysis user={user} onSkillUpdate={handleSkillUpdate}/>}
            {page === "resources" && <PageResources user={user}/>}
            {page === "mentors"   && <PageMentors   user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)}/>}
            {page === "placement" && <PagePlacement user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)} onChat={() => setChatOpen(true)}/>}
            {page === "pricing"   && <PagePricing   plan={plan} onUpgrade={() => setShowUpgrade(true)}/>}
          </div>
        </>
      )}
    </div>
  );
}
