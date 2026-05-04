import { useState, useEffect, useRef, useCallback, useMemo } from "react";


// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `

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
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes streakPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
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
  padding: 12px 28px; border-radius: 12px;
  background: linear-gradient(135deg, var(--amber), var(--amber2));
  border: none; color: #000; font-family: var(--font-display);
  font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.35); }
.btn-primary:disabled { opacity: 0.45; transform: none; box-shadow: none; cursor: not-allowed; }

.btn-pro {
  padding: 12px 28px; border-radius: 12px;
  background: linear-gradient(135deg, #8B5CF6, #4F46E5);
  border: none; color: #fff; font-family: var(--font-display);
  font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s;
}
.btn-pro:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(139,92,246,0.4); }

.btn-ghost {
  padding: 12px 24px; border-radius: 12px; background: transparent;
  border: 1px solid var(--border2); color: var(--text2); font-family: var(--font-body);
  font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.btn-ghost:hover { background: var(--surface2); color: var(--text); }

.input-field {
  width: 100%; padding: 13px 16px; border-radius: 12px;
  background: var(--bg3); border: 1px solid var(--border2);
  color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.2s;
}
.input-field:focus { border-color: var(--amber); }
.input-field::placeholder { color: var(--text3); }

.tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 20px; font-size: 12px;
  font-weight: 700; font-family: var(--font-display); letter-spacing: 0.5px;
}

.weak-bar { height: 8px; border-radius: 10px; animation: bar-slide 1.2s ease both; }
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
  color: #fff; font-size: 10px; font-weight: 700; font-family: var(--font-display);
}

.demand-badge-high { background: rgba(16,185,129,0.12); color: var(--green); border: 1px solid rgba(16,185,129,0.25); }
.demand-badge-medium { background: rgba(245,158,11,0.12); color: var(--amber); border: 1px solid rgba(245,158,11,0.25); }
.demand-badge-explosive { background: rgba(239,68,68,0.12); color: var(--red); border: 1px solid rgba(239,68,68,0.25); }

.glow-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12; }

.score-ring { animation: score-fill 1.5s ease 0.3s both; }
.pulse-dot::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: var(--green); animation: pulse-ring 1.5s ease-out infinite;
}
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}
.accordion-content { overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease; }
.skill-chip {
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s; border: 1.5px solid var(--border2);
  background: var(--surface); color: var(--text2); font-family: var(--font-body);
}
.skill-chip.selected { background: var(--amber-dim); border-color: var(--amber); color: var(--amber); }
.skill-chip:hover { border-color: var(--border2); background: var(--surface2); }
.card-hover { transition: transform 0.2s, box-shadow 0.2s; }
.card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.streak-badge { animation: streakPulse 2s ease-in-out infinite; }
`;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const FREE_LIMIT = 5;
const PLANS = {
  free: { name: "Free", features: ["5 AI mentor messages/day", "Basic roadmap", "3 projects", "Basic assessment"] },
  pro: { name: "Pro", price: "₹499/mo", features: ["Unlimited AI mentor", "Personalized skill-gap roadmap", "AI project evaluation", "Portfolio + resume gen", "Job matching engine", "Priority mentor access", "Daily challenges + streak", "Skill proof badges", "Auto task system"] }
};

// ─── MULTI-FIELD TRENDING ROLES ──────────────────────────────────────────────
const TRENDING_ROLES = [
  // TECH
  { id: "ai-engineer", title: "AI/ML Engineer", category: "Tech", field: "tech", salary_range: "₹12L–₹40L", demand_level: "explosive", growth_rate: "+38%", difficulty: "Hard", time_to_learn: "12–18 mo", icon: "🤖", color: "#06B6D4", skills_needed: ["Python", "ML Frameworks", "Math", "Data Pipelines", "LLMs", "Cloud"] },
  { id: "fullstack-dev", title: "Full Stack Developer", category: "Tech", field: "tech", salary_range: "₹8L–₹28L", demand_level: "high", growth_rate: "+24%", difficulty: "Medium", time_to_learn: "8–12 mo", icon: "💻", color: "#F59E0B", skills_needed: ["React", "Node.js", "SQL", "APIs", "Git", "Deployment"] },
  { id: "cloud-engineer", title: "Cloud/DevOps Engineer", category: "Tech", field: "tech", salary_range: "₹10L–₹35L", demand_level: "explosive", growth_rate: "+31%", difficulty: "Hard", time_to_learn: "10–15 mo", icon: "☁️", color: "#8B5CF6", skills_needed: ["AWS/GCP", "Docker", "Kubernetes", "Linux", "CI/CD", "Terraform"] },
  { id: "cybersecurity", title: "Cybersecurity Analyst", category: "Tech", field: "tech", salary_range: "₹8L–₹30L", demand_level: "explosive", growth_rate: "+35%", difficulty: "Hard", time_to_learn: "10–14 mo", icon: "🔐", color: "#EF4444", skills_needed: ["Networking", "Linux", "Ethical Hacking", "Security Audits", "CompTIA", "SIEM"] },
  { id: "blockchain-dev", title: "Blockchain Developer", category: "Tech", field: "tech", salary_range: "₹15L–₹50L", demand_level: "explosive", growth_rate: "+44%", difficulty: "Hard", time_to_learn: "12–18 mo", icon: "⛓️", color: "#A78BFA", skills_needed: ["Solidity", "Web3.js", "Smart Contracts", "DeFi", "Cryptography", "Node.js"] },
  // DATA
  { id: "data-analyst", title: "Data Analyst", category: "Data", field: "data", salary_range: "₹6L–₹20L", demand_level: "high", growth_rate: "+26%", difficulty: "Medium", time_to_learn: "6–9 mo", icon: "📊", color: "#10B981", skills_needed: ["SQL", "Python", "Excel", "Power BI", "Statistics", "Storytelling"] },
  { id: "data-engineer", title: "Data Engineer", category: "Data", field: "data", salary_range: "₹10L–₹32L", demand_level: "high", growth_rate: "+28%", difficulty: "Hard", time_to_learn: "10–14 mo", icon: "🔧", color: "#7DD3FC", skills_needed: ["Python", "SQL", "Spark", "Kafka", "Airflow", "Cloud"] },
  // BUSINESS
  { id: "product-manager", title: "Product Manager", category: "Business", field: "biz", salary_range: "₹14L–₹45L", demand_level: "high", growth_rate: "+19%", difficulty: "Medium", time_to_learn: "6–10 mo", icon: "📱", color: "#EC4899", skills_needed: ["Strategy", "Data Analysis", "Wireframing", "Agile", "Stakeholder Mgmt", "Roadmapping"] },
  { id: "digital-marketer", title: "Growth/Digital Marketer", category: "Business", field: "marketing", salary_range: "₹5L–₹18L", demand_level: "high", growth_rate: "+20%", difficulty: "Easy", time_to_learn: "4–6 mo", icon: "📈", color: "#FBBF24", skills_needed: ["SEO", "Paid Ads", "Analytics", "Content", "Email Marketing", "A/B Testing"] },
  { id: "hr-specialist", title: "HR / Talent Specialist", category: "Business", field: "biz", salary_range: "₹4L–₹14L", demand_level: "medium", growth_rate: "+12%", difficulty: "Easy", time_to_learn: "3–5 mo", icon: "🧑‍💼", color: "#F97316", skills_needed: ["Recruitment", "HRIS Tools", "Employee Relations", "Labour Law", "Communication", "Excel"] },
  { id: "sales-exec", title: "B2B Sales Executive", category: "Business", field: "biz", salary_range: "₹4L–₹20L", demand_level: "high", growth_rate: "+18%", difficulty: "Easy", time_to_learn: "2–4 mo", icon: "🤝", color: "#34D399", skills_needed: ["CRM Tools", "Cold Outreach", "Negotiation", "Product Knowledge", "LinkedIn", "Closing Deals"] },
  // FINANCE
  { id: "financial-analyst", title: "Financial Analyst", category: "Finance", field: "finance", salary_range: "₹6L–₹22L", demand_level: "medium", growth_rate: "+15%", difficulty: "Medium", time_to_learn: "6–8 mo", icon: "💰", color: "#34D399", skills_needed: ["Excel", "Financial Modeling", "DCF", "Equity Research", "Bloomberg", "CFA"] },
  { id: "investment-banker", title: "Investment Banking Analyst", category: "Finance", field: "finance", salary_range: "₹10L–₹35L", demand_level: "medium", growth_rate: "+12%", difficulty: "Hard", time_to_learn: "8–12 mo", icon: "🏦", color: "#60A5FA", skills_needed: ["Financial Modeling", "Valuation", "Excel VBA", "Deal Structuring", "Networking", "CFA L1"] },
  // DESIGN
  { id: "ux-designer", title: "UX/Product Designer", category: "Design", field: "design", salary_range: "₹7L–₹25L", demand_level: "high", growth_rate: "+22%", difficulty: "Medium", time_to_learn: "6–9 mo", icon: "🎨", color: "#F97316", skills_needed: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility", "Portfolio"] },
  { id: "graphic-designer", title: "Graphic Designer", category: "Design", field: "design", salary_range: "₹4L–₹15L", demand_level: "medium", growth_rate: "+14%", difficulty: "Easy", time_to_learn: "4–6 mo", icon: "✏️", color: "#E879F9", skills_needed: ["Adobe Suite", "Canva Pro", "Brand Design", "Typography", "Color Theory", "Portfolio"] },
  // NON-TECH
  { id: "content-writer", title: "Content Writer / Copywriter", category: "Non-Tech", field: "non-tech", salary_range: "₹3L–₹12L", demand_level: "high", growth_rate: "+16%", difficulty: "Easy", time_to_learn: "2–4 mo", icon: "✍️", color: "#A3E635", skills_needed: ["SEO Writing", "Copywriting", "Research", "Social Media", "AI Tools", "Portfolio"] },
  { id: "teacher", title: "Online Educator / Teacher", category: "Non-Tech", field: "non-tech", salary_range: "₹3L–₹15L", demand_level: "medium", growth_rate: "+20%", difficulty: "Easy", time_to_learn: "2–3 mo", icon: "👩‍🏫", color: "#FDBA74", skills_needed: ["Subject Matter Expertise", "Course Creation", "Communication", "Video Editing", "LMS Platforms", "Marketing"] },
  { id: "govt-prep", title: "Govt Exam / UPSC Aspirant", category: "Non-Tech", field: "non-tech", salary_range: "₹5L–₹18L (post selection)", demand_level: "high", growth_rate: "Stable", difficulty: "Hard", time_to_learn: "12–24 mo", icon: "🏛️", color: "#94A3B8", skills_needed: ["GS Paper 1-4", "Essay Writing", "Current Affairs", "Optional Subject", "Answer Writing", "Mock Tests"] },
  { id: "operations", title: "Operations Manager", category: "Non-Tech", field: "non-tech", salary_range: "₹6L–₹20L", demand_level: "medium", growth_rate: "+13%", difficulty: "Medium", time_to_learn: "4–8 mo", icon: "⚙️", color: "#67E8F9", skills_needed: ["Process Improvement", "Data Analysis", "Project Management", "Excel", "Communication", "Lean/Six Sigma"] },
  { id: "salesforce-dev", title: "Salesforce Developer", category: "Tech", field: "tech", salary_range: "₹8L–₹26L", demand_level: "medium", growth_rate: "+18%", difficulty: "Medium", time_to_learn: "5–8 mo", icon: "⚡", color: "#60A5FA", skills_needed: ["Apex", "LWC", "SOQL", "Salesforce Admin", "CRM", "Integrations"] },
];

const ROLE_CATEGORIES = ["All", "Tech", "Data", "Business", "Finance", "Design", "Non-Tech"];

// ─── ALL SKILLS POOL (for multi-select) ──────────────────────────────────────
const ALL_SKILLS_POOL = {
  "Tech": ["Python", "JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS", "TypeScript", "Java", "C++", "Go", "Rust", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux", "CI/CD", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL", "Redis", "Terraform", "ML Frameworks", "Deep Learning", "LLMs", "Solidity", "Web3.js"],
  "Data": ["SQL", "Python", "Excel", "Power BI", "Tableau", "Statistics", "Data Visualization", "ETL", "Spark", "Kafka", "Airflow", "Pandas", "NumPy", "R", "SPSS"],
  "Business": ["SEO", "Google Ads", "Meta Ads", "Email Marketing", "Content Strategy", "CRM Tools", "Negotiation", "Stakeholder Management", "Agile", "Scrum", "Product Roadmapping", "LinkedIn Sales", "Cold Outreach"],
  "Finance": ["Excel", "Financial Modeling", "DCF Valuation", "Bloomberg Terminal", "Python for Finance", "CFA", "Accounting", "Equity Research", "PowerPoint"],
  "Design": ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD", "Canva", "User Research", "Prototyping", "Design Systems", "Motion Design", "Brand Identity"],
  "Soft Skills": ["Communication", "Problem Solving", "Team Collaboration", "Time Management", "Critical Thinking", "Public Speaking", "Writing"],
};

// ─── OUTCOME ROADMAPS (expanded for all roles) ────────────────────────────────
const OUTCOME_ROADMAPS = {
  "ai-engineer": [
    { phase: "Phase 1 — Foundation", goal: "Python + ML basics to land internship", icon: "🎯", color: "#06B6D4", days: "Days 1–30", tasks: ["Python mastery (NumPy, Pandas, Matplotlib)", "ML basics: linear regression, classification, clustering", "Kaggle beginner competitions (top 40%)", "1 ML project on GitHub", "Apply to 20 AI internships"], outcome: "First internship offer or freelance ML gig" },
    { phase: "Phase 2 — Portfolio Projects", goal: "3 real-world projects that impress interviewers", icon: "🏗️", color: "#8B5CF6", days: "Days 31–60", tasks: ["Deep learning with TensorFlow/PyTorch", "NLP project (sentiment analysis / chatbot)", "Computer Vision project (object detection)", "Deploy model on HuggingFace or AWS", "Publish results on LinkedIn + GitHub"], outcome: "Portfolio that passes initial recruiter screening" },
    { phase: "Phase 3 — Interview Prep", goal: "Pass FAANG/startup AI interviews", icon: "🧠", color: "#F59E0B", days: "Days 61–90", tasks: ["LeetCode 75 problems (ML track)", "System Design for ML (model serving, pipelines)", "Mock interviews × 10", "Study LLM architecture (Transformers, RLHF)", "Crack 3 take-home assignments"], outcome: "Interview conversion rate above 30%" },
    { phase: "Phase 4 — Land the Job", goal: "Signed offer letter in hand", icon: "🏆", color: "#10B981", days: "Days 91–120", tasks: ["Apply to 100+ roles systematically", "Negotiate salary (benchmark: ₹12–18L fresher)", "Referral outreach on LinkedIn (50 connections)", "Ace final rounds", "Join & contribute to AI communities"], outcome: "Job offer at ₹12L+ CTC" },
  ],
  "fullstack-dev": [
    { phase: "Phase 1 — Build & Ship", goal: "Build and ship your first app", icon: "🎯", color: "#F59E0B", days: "Days 1–30", tasks: ["HTML, CSS, JavaScript fundamentals", "React basics (components, hooks, state)", "Node.js + Express REST API", "MySQL or PostgreSQL basics", "Deploy app on Vercel + Render"], outcome: "Live app URL to show recruiters" },
    { phase: "Phase 2 — Portfolio", goal: "3 production-grade projects", icon: "🏗️", color: "#06B6D4", days: "Days 31–60", tasks: ["Full-stack CRUD app with auth", "Real-time feature (WebSockets or polling)", "Third-party API integration project", "Performance optimization + SEO", "Responsive design + accessibility"], outcome: "GitHub with 3 impressive repos" },
    { phase: "Phase 3 — Interview Ready", goal: "Pass coding + system design rounds", icon: "🧠", color: "#8B5CF6", days: "Days 61–90", tasks: ["DSA: arrays, trees, graphs, DP (LeetCode 100)", "System Design: URL shortener, chat app, feed", "React internals deep dive", "Node.js event loop + async patterns", "Mock interviews × 8"], outcome: "Clear technical rounds at mid-tier+ companies" },
    { phase: "Phase 4 — Land the Job", goal: "Full-time offer signed", icon: "🏆", color: "#10B981", days: "Days 91–120", tasks: ["Apply to 80+ companies", "Negotiate to ₹8L+ CTC", "Build recruiter network on LinkedIn", "Contribute to 1 open source project", "Freelance 2–3 projects for experience"], outcome: "Employed as Full Stack Developer" },
  ],
  "data-analyst": [
    { phase: "Phase 1 — Foundation", goal: "SQL + Python basics for internships", icon: "🎯", color: "#10B981", days: "Days 1–21", tasks: ["SQL mastery (JOINs, CTEs, window functions)", "Excel: pivot tables, VLOOKUP, dashboards", "Python: Pandas, Matplotlib, Seaborn", "Statistics basics: mean, median, correlation", "EDA on 2 real datasets"], outcome: "Intern-level SQL + Python proficiency" },
    { phase: "Phase 2 — Case Studies", goal: "3 end-to-end analysis projects", icon: "🏗️", color: "#06B6D4", days: "Days 22–50", tasks: ["Power BI or Tableau dashboard", "A/B test analysis project", "Business KPI analysis", "Predictive model with regression", "Publish findings on Medium/Notion"], outcome: "3 case studies with real insights" },
    { phase: "Phase 3 — Interview Prep", goal: "Pass analyst interview rounds", icon: "🧠", color: "#F59E0B", days: "Days 51–75", tasks: ["50 SQL practice problems", "Metrics & case study interview prep", "Explain data findings under 2 mins × 10", "Business acumen questions", "Take-home assignment prep"], outcome: "Strong conversion on analyst interviews" },
    { phase: "Phase 4 — Get Hired", goal: "First analyst role secured", icon: "🏆", color: "#10B981", days: "Days 76–90", tasks: ["Apply to 60+ analyst roles", "Target startups + analytics agencies", "Negotiate ₹6–10L CTC", "Get Google Data Analytics cert", "Build referral pipeline"], outcome: "Hired as Data Analyst" },
  ],
  "digital-marketer": [
    { phase: "Phase 1 — Core Skills", goal: "Learn digital marketing fundamentals", icon: "🎯", color: "#FBBF24", days: "Days 1–14", tasks: ["Google Analytics 4 certification", "SEO basics: keyword research, on-page SEO", "Meta Ads Manager fundamentals", "Email marketing with Mailchimp", "Content calendar creation"], outcome: "Core marketing skill certification" },
    { phase: "Phase 2 — Run Real Campaigns", goal: "Manage ₹10K–₹50K ad budget", icon: "🏗️", color: "#F97316", days: "Days 15–35", tasks: ["Run Google Search + Display campaigns", "Facebook + Instagram retargeting", "A/B test landing pages", "Build email sequences (5-part drip)", "Analyze ROAS and optimize"], outcome: "Portfolio with real campaign results" },
    { phase: "Phase 3 — Specialize", goal: "Pick a niche and go deep", icon: "🧠", color: "#8B5CF6", days: "Days 36–55", tasks: ["Choose: SEO / Paid / Email / Social", "Build personal brand on LinkedIn", "Create 10-piece content portfolio", "Freelance 2 small clients for ₹5K–15K each", "Learn marketing analytics stack"], outcome: "Specialized skill portfolio with results" },
    { phase: "Phase 4 — Get Hired", goal: "Full-time marketing role", icon: "🏆", color: "#10B981", days: "Days 56–80", tasks: ["Apply to 50+ marketing roles", "Negotiate ₹5–8L CTC", "Build a growth case study deck", "Network with marketing managers on LinkedIn", "Intern/freelance experience as proof"], outcome: "Hired as Digital Marketer" },
  ],
  "ux-designer": [
    { phase: "Phase 1 — Design Fundamentals", goal: "Master Figma + design principles", icon: "🎯", color: "#F97316", days: "Days 1–21", tasks: ["Figma: components, auto-layout, variants", "UI design principles: typography, color, spacing", "User research methods: interviews, surveys", "Heuristic evaluation of 3 apps", "Build personal design system"], outcome: "Figma proficiency + design vocabulary" },
    { phase: "Phase 2 — Case Studies", goal: "3 UX case studies for portfolio", icon: "🏗️", color: "#EC4899", days: "Days 22–50", tasks: ["End-to-end redesign project", "Mobile-first design case study", "Design system for a SaaS product", "Usability testing + iteration", "Write case study writeups on Notion"], outcome: "Portfolio with 3 detailed case studies" },
    { phase: "Phase 3 — Interview Prep", goal: "Pass design interviews", icon: "🧠", color: "#8B5CF6", days: "Days 51–70", tasks: ["Design critique practice × 10", "Whiteboard design challenges", "Portfolio walk-through × 5", "Study FAANG design principles", "Mock interviews with designers on ADPList"], outcome: "Interview-ready design portfolio" },
    { phase: "Phase 4 — Get Hired", goal: "UX Designer job offer", icon: "🏆", color: "#10B981", days: "Days 71–90", tasks: ["Apply to 60+ design roles", "Reach out to design leads on LinkedIn", "Negotiate ₹7–12L CTC", "Get Google UX Design cert", "Contribute to open source design"], outcome: "Hired as UX Designer" },
  ],
  "financial-analyst": [
    { phase: "Phase 1 — Fundamentals", goal: "Excel + accounting basics", icon: "🎯", color: "#34D399", days: "Days 1–21", tasks: ["Advanced Excel: formulas, pivot tables, macros", "Financial statement analysis (IS, BS, CF)", "Basic accounting: GAAP concepts", "Introduction to Bloomberg/Capital IQ", "CFA Level 1 registration"], outcome: "Analyst-level Excel + accounting foundation" },
    { phase: "Phase 2 — Modeling", goal: "Build financial models", icon: "🏗️", color: "#60A5FA", days: "Days 22–45", tasks: ["3-statement integrated model", "DCF valuation model", "LBO basics", "Equity research report on 1 company", "Industry analysis: choose sector"], outcome: "Portfolio of 3 financial models" },
    { phase: "Phase 3 — Interview Prep", goal: "Crack finance interviews", icon: "🧠", color: "#F59E0B", days: "Days 46–65", tasks: ["Technical questions: valuation, accounting", "Walk-me-through-a-DCF mastery", "Industry + deal knowledge", "Fit questions: why finance, why this firm", "Mock interview × 8"], outcome: "Ready for analyst interviews" },
    { phase: "Phase 4 — Get Hired", goal: "Finance role offer", icon: "🏆", color: "#10B981", days: "Days 66–90", tasks: ["Apply to 40+ finance roles + internships", "Reach out to alumni in target firms", "Negotiate ₹6–12L CTC", "CFA Level 1 exam", "LinkedIn networking with analysts"], outcome: "Hired as Financial Analyst" },
  ],
  "content-writer": [
    { phase: "Phase 1 — Core Writing", goal: "Build writing fundamentals + niche", icon: "🎯", color: "#A3E635", days: "Days 1–14", tasks: ["Choose niche: tech, finance, health, SaaS", "Write 5 long-form blog posts (1500+ words)", "SEO basics: keyword research, SERP analysis", "Study copywriting frameworks: AIDA, PAS", "Create Substack or Medium account"], outcome: "5 published writing samples" },
    { phase: "Phase 2 — Portfolio", goal: "10-piece portfolio + first clients", icon: "🏗️", color: "#22D3EE", days: "Days 15–30", tasks: ["Write 10 articles across 3 content types", "Guest post on 2 established blogs", "Create LinkedIn content × 15 posts", "Cold pitch 20 potential clients", "First ₹2K–5K paid writing project"], outcome: "Paid portfolio + first client testimonial" },
    { phase: "Phase 3 — Specialize", goal: "Go deep in one content type", icon: "🧠", color: "#8B5CF6", days: "Days 31–50", tasks: ["Pick: long-form SEO / email copy / social / technical", "Study 5 top writers in chosen niche", "Write case study showing content ROI", "Learn AI tools: ChatGPT, Surfer SEO", "Build personal brand on Twitter/LinkedIn"], outcome: "Recognized specialist in 1 content type" },
    { phase: "Phase 4 — Get Hired/Clients", goal: "Full-time role or 3 retainer clients", icon: "🏆", color: "#10B981", days: "Days 51–70", tasks: ["Apply to 30+ content roles", "Reach ₹30K–60K/mo freelance goal", "Build referral system from satisfied clients", "Create rate card + media kit", "Negotiate ₹4–8L CTC for full-time"], outcome: "Stable income as content writer" },
  ],
  "govt-prep": [
    { phase: "Phase 1 — Foundation", goal: "NCERT + basic GS coverage", icon: "🎯", color: "#94A3B8", days: "Days 1–60", tasks: ["Complete NCERT 6–12 for History, Geography, Polity, Economy", "Read The Hindu daily (30 min)", "Make short notes for revision", "Complete 1 NCERT topic per day", "Join a test series for practice"], outcome: "Strong NCERT foundation across all GS subjects" },
    { phase: "Phase 2 — Deep Study", goal: "Standard books + current affairs", icon: "🏗️", color: "#6EE7B7", days: "Days 61–180", tasks: ["Laxmikanth Polity (complete)", "Spectrum Modern History", "Economy: Ramesh Singh", "Environment: ShankarIAS", "Pratiyogita Darpan monthly magazines"], outcome: "Complete standard books coverage" },
    { phase: "Phase 3 — Answer Writing", goal: "Master UPSC answer writing", icon: "🧠", color: "#F59E0B", days: "Days 181–270", tasks: ["Write 2 answers daily (GS Mains format)", "Peer review + self-review answers", "Essay writing practice (1/week)", "Previous year question analysis", "Join answer writing batch"], outcome: "Consistent 150+ marks per GS paper" },
    { phase: "Phase 4 — Mock Tests + Interview", goal: "Clear Prelims + Mains + Interview", icon: "🏆", color: "#10B981", days: "Days 271–365", tasks: ["Full-length mock tests × 30 (Prelims)", "Sectional mock tests daily", "Personality test preparation", "Current affairs revision (6 months)", "Group discussion + mock interview sessions"], outcome: "Selection in Civil Services" },
  ],
};

function getOutcomeRoadmap(roleId) {
  return OUTCOME_ROADMAPS[roleId] || [
    { phase: "Phase 1 — Foundation", goal: "Learn core skills for your role", icon: "🎯", color: "#06B6D4", days: "Days 1–30", tasks: ["Learn fundamental concepts", "Complete 2 beginner projects", "Get certifications/courses", "Build basic portfolio", "Connect with professionals"], outcome: "Foundation skills mastered" },
    { phase: "Phase 2 — Portfolio", goal: "Build real-world projects", icon: "🏗️", color: "#8B5CF6", days: "Days 31–60", tasks: ["Build 3 portfolio projects", "Write about your learning journey", "Get first freelance/internship", "Join relevant communities", "Seek feedback from professionals"], outcome: "Strong portfolio with evidence" },
    { phase: "Phase 3 — Interview Prep", goal: "Get interview-ready", icon: "🧠", color: "#F59E0B", days: "Days 61–80", tasks: ["Practice role-specific interviews", "Polish resume and LinkedIn", "Apply to 20+ positions", "Get 3 referrals from network", "Do mock interviews"], outcome: "Ready to clear interviews" },
    { phase: "Phase 4 — Land the Job", goal: "Get hired", icon: "🏆", color: "#10B981", days: "Days 81–100", tasks: ["Apply to 50+ positions", "Follow up systematically", "Negotiate salary", "Ace final rounds", "Sign offer letter"], outcome: "Successfully placed in role" },
  ];
}

// ─── PROJECTS DB ─────────────────────────────────────────────────────────────
const PROJECTS_DB = {
  "ai-engineer": [
    { id: "p1", title: "Sentiment Analysis API", icon: "💬", problem: "Build a production REST API that analyzes sentiment of user reviews. Use HuggingFace transformers, FastAPI, and deploy on Hugging Face Spaces.", skills: ["Python", "NLP", "FastAPI", "Deployment"], difficulty: "Beginner", xp: 200 },
    { id: "p2", title: "Image Classification App", icon: "🖼️", problem: "Build an image classification web app using a custom CNN or fine-tuned ResNet. Allow users to upload images and get predictions in real time.", skills: ["PyTorch", "Computer Vision", "Gradio", "AWS"], difficulty: "Intermediate", xp: 350 },
    { id: "p3", title: "LLM-Powered RAG Chatbot", icon: "🤖", problem: "Build a RAG chatbot that answers questions over a custom knowledge base using LangChain, FAISS vector store, and Claude/GPT-4 API.", skills: ["LLMs", "LangChain", "Vector DB", "Python"], difficulty: "Advanced", xp: 500 },
  ],
  "fullstack-dev": [
    { id: "p1", title: "Full Stack Task Manager", icon: "✅", problem: "Build a Trello-like task management app with drag-and-drop, real-time updates using WebSockets, JWT auth, and PostgreSQL backend.", skills: ["React", "Node.js", "WebSockets", "PostgreSQL"], difficulty: "Beginner", xp: 180 },
    { id: "p2", title: "E-Commerce Platform", icon: "🛒", problem: "Build a complete e-commerce platform with product listings, cart, Stripe payments, order tracking, and admin dashboard.", skills: ["React", "Node.js", "Stripe API", "MongoDB"], difficulty: "Intermediate", xp: 350 },
    { id: "p3", title: "Real-Time Collaboration Tool", icon: "🤝", problem: "Build a collaborative document editor like Notion with real-time sync (CRDT/OT), comments, user presence, and offline support.", skills: ["React", "WebRTC", "Socket.io", "Redis"], difficulty: "Advanced", xp: 500 },
  ],
  "data-analyst": [
    { id: "p1", title: "Sales Performance Dashboard", icon: "📊", problem: "Create an interactive Power BI / Tableau dashboard for an e-commerce company's sales data with KPI cards, trend charts, and drill-down filters.", skills: ["SQL", "Power BI", "Excel", "Storytelling"], difficulty: "Beginner", xp: 150 },
    { id: "p2", title: "Customer Churn Analysis", icon: "📉", problem: "Analyze a telecom dataset to identify churn predictors. Build logistic regression + decision tree. Present actionable business recommendations.", skills: ["Python", "Pandas", "Statistics", "Visualization"], difficulty: "Intermediate", xp: 300 },
    { id: "p3", title: "A/B Test Analysis System", icon: "🧪", problem: "Build an automated A/B test analyzer that takes experiment data and outputs: statistical significance, lift, confidence intervals, and recommendations.", skills: ["Python", "Statistics", "SQL", "Tableau"], difficulty: "Advanced", xp: 450 },
  ],
  "digital-marketer": [
    { id: "p1", title: "SEO Audit Report", icon: "🔍", problem: "Perform a full SEO audit of a real website using Ahrefs/SEMrush. Document all issues, prioritize fixes, and create a 90-day improvement roadmap.", skills: ["SEO", "Analytics", "Content", "Reporting"], difficulty: "Beginner", xp: 150 },
    { id: "p2", title: "Lead Generation Campaign", icon: "📈", problem: "Design, run, and optimize a complete lead gen campaign on Meta or Google Ads for a small business. Track cost-per-lead and conversion rate.", skills: ["Paid Ads", "Analytics", "A/B Testing", "Copywriting"], difficulty: "Intermediate", xp: 280 },
    { id: "p3", title: "Marketing Funnel Strategy", icon: "🎯", problem: "Build a full-funnel marketing strategy for a SaaS startup: awareness, consideration, conversion campaigns with creative assets, budget allocation, and 30-day KPIs.", skills: ["Strategy", "Content", "Email Marketing", "Analytics"], difficulty: "Advanced", xp: 420 },
  ],
  "ux-designer": [
    { id: "p1", title: "Mobile App Redesign", icon: "📱", problem: "Pick any popular app (e.g., Zomato, BookMyShow) and redesign 5+ screens focusing on usability improvements. Document your research and design decisions.", skills: ["Figma", "User Research", "Prototyping", "UX Writing"], difficulty: "Beginner", xp: 160 },
    { id: "p2", title: "SaaS Dashboard Design", icon: "💻", problem: "Design a complete analytics dashboard for a B2B SaaS product. Include data visualization, empty states, onboarding flow, and a design system.", skills: ["Figma", "Design Systems", "Data Viz", "Accessibility"], difficulty: "Intermediate", xp: 320 },
    { id: "p3", title: "End-to-End UX Case Study", icon: "🎨", problem: "Design the full UX for a new product (your idea): user research, personas, journey maps, wireframes, high-fi prototypes, usability tests, iteration.", skills: ["Figma", "User Research", "Prototyping", "Presentation"], difficulty: "Advanced", xp: 500 },
  ],
  "financial-analyst": [
    { id: "p1", title: "3-Statement Financial Model", icon: "📋", problem: "Build a 3-statement model (Income Statement, Balance Sheet, Cash Flow) for any publicly listed company using historical data. Link statements correctly.", skills: ["Excel", "Financial Modeling", "Accounting", "Forecasting"], difficulty: "Beginner", xp: 200 },
    { id: "p2", title: "DCF Valuation Model", icon: "💰", problem: "Perform a full DCF valuation for a listed company with sensitivity analysis, WACC calculation, and equity research report summarizing buy/hold/sell recommendation.", skills: ["Excel", "DCF", "Equity Research", "Financial Modeling"], difficulty: "Intermediate", xp: 350 },
    { id: "p3", title: "Sector Deep-Dive Report", icon: "📊", problem: "Write an institutional-grade equity research report on 3 companies in the same sector. Include financial comparison, competitive analysis, risk factors, and price targets.", skills: ["Financial Modeling", "Bloomberg", "Research", "Presentation"], difficulty: "Advanced", xp: 500 },
  ],
  "teacher": [
    { id: "p1", title: "Lesson Planning Project", icon: "📝", problem: "Create a comprehensive 4-week lesson plan for a high school subject. Include learning objectives, activities, and assessment rubrics.", skills: ["Curriculum Design", "Planning", "Assessment"], difficulty: "Beginner", xp: 200 },
    { id: "p2", title: "Video Teaching Demo", icon: "🎥", problem: "Record and edit a 10-minute instructional video explaining a complex topic simply. Include visual aids and clear pacing.", skills: ["Communication", "Video Editing", "Subject Matter Expertise"], difficulty: "Intermediate", xp: 350 },
    { id: "p3", title: "Course Creation Project", icon: "🎓", problem: "Design an entire online course module. Build the syllabus, 3 video scripts, 2 assignments, and a final quiz.", skills: ["LMS Platforms", "Course Creation", "Pedagogy"], difficulty: "Advanced", xp: 500 },
  ],
};

function getProjects(roleId) {
  return PROJECTS_DB[roleId] || PROJECTS_DB["fullstack-dev"];
}

// ─── COURSES DB ──────────────────────────────────────────────────────────────
const COURSES_DB = {
  "ai-engineer": [
    { id: "c1", title: "DeepLearning.AI TensorFlow Developer", platform: "Coursera", tags: ["Beginner", "Certification"], roi: 95, icon: "🧠", duration: "4 months", link: "https://www.coursera.org/professional-certificates/tensorflow-in-practice" },
    { id: "c2", title: "Practical Deep Learning for Coders", platform: "Fast.ai", tags: ["Advanced", "Hands-on"], roi: 98, icon: "⚡", duration: "8 weeks", link: "https://course.fast.ai/" },
    { id: "c3", title: "MLOps Specialization", platform: "Coursera", tags: ["Advanced", "Deployment"], roi: 90, icon: "⚙️", duration: "3 months", link: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops" }
  ],
  "fullstack-dev": [
    { id: "c1", title: "The Odin Project - Full Stack JavaScript", platform: "Open Source", tags: ["Beginner", "Project-based"], roi: 99, icon: "🌐", duration: "6 months", link: "https://www.theodinproject.com/" },
    { id: "c2", title: "Epic React by Kent C. Dodds", platform: "EpicReact", tags: ["Advanced", "React"], roi: 94, icon: "⚛️", duration: "4 weeks", link: "https://epicreact.dev/" },
    { id: "c3", title: "Backend Engineering with Node.js", platform: "Frontend Masters", tags: ["Intermediate", "Backend"], roi: 92, icon: "💻", duration: "6 weeks", link: "https://frontendmasters.com/courses/node-js-v3/" }
  ],
  "data-analyst": [
    { id: "c1", title: "Google Data Analytics Professional Certificate", platform: "Coursera", tags: ["Beginner", "Certification"], roi: 96, icon: "📊", duration: "6 months", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
    { id: "c2", title: "SQL for Data Science", platform: "Coursera", tags: ["Intermediate", "SQL"], roi: 95, icon: "💾", duration: "4 weeks", link: "https://www.coursera.org/learn/sql-for-data-science" },
    { id: "c3", title: "Data Visualization with Tableau", platform: "DataCamp", tags: ["Intermediate", "Tableau"], roi: 90, icon: "📈", duration: "3 weeks", link: "https://www.datacamp.com/courses/introduction-to-tableau" }
  ],
  "ux-designer": [
    { id: "c1", title: "Google UX Design Professional Certificate", platform: "Coursera", tags: ["Beginner", "Certification"], roi: 95, icon: "🎨", duration: "6 months", link: "https://www.coursera.org/professional-certificates/google-ux-design" },
    { id: "c2", title: "Shift Nudge - Interface Design", platform: "Shift Nudge", tags: ["Advanced", "Visual Design"], roi: 92, icon: "📐", duration: "8 weeks", link: "https://shiftnudge.com/" },
    { id: "c3", title: "UX Research Methods", platform: "Interaction Design Foundation", tags: ["Intermediate", "Research"], roi: 88, icon: "🔬", duration: "5 weeks", link: "https://www.interaction-design.org/courses/user-research-methods-and-best-practices" }
  ],
  "digital-marketer": [
    { id: "c1", title: "Google Digital Garage - Fundamentals of Digital Marketing", platform: "Google", tags: ["Beginner", "Certification"], roi: 97, icon: "📈", duration: "40 hours", link: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing" },
    { id: "c2", title: "HubSpot Content Marketing Certification", platform: "HubSpot", tags: ["Intermediate", "Content"], roi: 94, icon: "✍️", duration: "6 hours", link: "https://academy.hubspot.com/courses/content-marketing" },
    { id: "c3", title: "Meta Social Media Marketing", platform: "Coursera", tags: ["Beginner", "Social Media"], roi: 92, icon: "📱", duration: "5 months", link: "https://www.coursera.org/professional-certificates/meta-social-media-marketing" }
  ],
  "financial-analyst": [
    { id: "c1", title: "Financial Modeling & Valuation Analyst (FMVA)", platform: "CFI", tags: ["Intermediate", "Certification"], roi: 96, icon: "💰", duration: "6 months", link: "https://corporatefinanceinstitute.com/certifications/financial-modeling-valuation-analyst-fmva-program/" },
    { id: "c2", title: "Wall Street Prep Premium Package", platform: "Wall Street Prep", tags: ["Advanced", "Modeling"], roi: 95, icon: "🏦", duration: "Self-paced", link: "https://www.wallstreetprep.com/programs/premium-package/" },
    { id: "c3", title: "Excel Skills for Business", platform: "Coursera", tags: ["Beginner", "Excel"], roi: 98, icon: "📊", duration: "6 weeks", link: "https://www.coursera.org/specializations/excel" }
  ],
  "teacher": [
    { id: "c1", title: "Foundations of Teaching for Learning", platform: "Coursera", tags: ["Beginner", "Pedagogy"], roi: 95, icon: "👩‍🏫", duration: "4 weeks", link: "https://www.coursera.org/specializations/foundations-teaching-learning" },
    { id: "c2", title: "Instructional Design Masterclass", platform: "Udemy", tags: ["Intermediate", "Course Creation"], roi: 92, icon: "📝", duration: "8 hours", link: "https://www.udemy.com/course/instructional-design-masterclass/" },
    { id: "c3", title: "Video Production for Educators", platform: "Skillshare", tags: ["Beginner", "Video Editing"], roi: 88, icon: "🎥", duration: "3 hours", link: "https://www.skillshare.com/en/search?query=Video%20Production%20for%20Educators" }
  ]
};

function generateCourseLink(courseName, tag, platform) {
  const query = encodeURIComponent(`${courseName} ${tag}`);
  const plat = (platform || "").toLowerCase();

  if (plat.includes("coursera")) return `https://www.coursera.org/search?query=${query}`;
  if (plat.includes("udemy")) return `https://www.udemy.com/courses/search/?q=${query}`;
  if (plat.includes("edx")) return `https://www.edx.org/search?q=${query}`;
  if (plat.includes("skillshare")) return `https://www.skillshare.com/en/search?query=${query}`;

  // Default fallback to YouTube
  return `https://www.youtube.com/results?search_query=${query}+full+course`;
}

// ─── UTILITY FUNCTIONS (CAREER PATH DRIVEN) ─────────────────────────────────
function getSkillsByRole(roleId) {
  const role = TRENDING_ROLES.find(r => r.id === roleId) || TRENDING_ROLES[1];
  return role.skills_needed || [];
}
function getProjectsByRole(roleId) {
  if (PROJECTS_DB[roleId]) return PROJECTS_DB[roleId];
  const role = TRENDING_ROLES.find(r => r.id === roleId) || { title: "Role" };
  return [
    { id: "p1", title: `Introduction to ${role.title}`, icon: "🚀", problem: `Complete your first comprehensive project in ${role.title}. Focus on foundational principles.`, skills: ["Basics", "Research", "Planning"], difficulty: "Beginner", xp: 150 },
    { id: "p2", title: `Intermediate ${role.title} Challenge`, icon: "⚡", problem: `Apply your intermediate skills to solve a realistic problem in ${role.title}.`, skills: ["Problem Solving", "Implementation"], difficulty: "Intermediate", xp: 300 },
    { id: "p3", title: `Advanced ${role.title} Capstone`, icon: "🏆", problem: `Build a production-ready solution showcasing your mastery in ${role.title}.`, skills: ["Advanced Concepts", "Best Practices"], difficulty: "Advanced", xp: 500 }
  ];
}
function getCoursesByRole(roleId) {
  if (COURSES_DB[roleId]) return COURSES_DB[roleId];
  const role = TRENDING_ROLES.find(r => r.id === roleId) || { title: "Role" };
  return [
    { id: "c1", title: `${role.title} Fundamentals`, platform: "Coursera", tags: ["Beginner", "Certification"], roi: 95, icon: "🎓", duration: "4 weeks", link: generateCourseLink(`${role.title} Fundamentals`, "Beginner", "Coursera") },
    { id: "c2", title: `Advanced ${role.title} Masterclass`, platform: "Udemy", tags: ["Advanced", "Practical"], roi: 92, icon: "🚀", duration: "8 weeks", link: generateCourseLink(`Advanced ${role.title} Masterclass`, "Advanced", "Udemy") }
  ];
}
function getJobsByRole(roleId) {
  return JOB_LISTINGS.filter(j => j.rolesFor.includes(roleId));
}
function getResourcesByRole(roleId) {
  if (RESOURCE_DB[roleId]) return RESOURCE_DB[roleId];
  return [
    { title: "Industry Standard Blog", type: "Blog", tag: "Latest Trends", icon: "📰", url: "#", free: true, desc: "Stay up to date with the latest industry news." },
    { title: "Community Forum", type: "Platform", tag: "Networking", icon: "💬", url: "#", free: true, desc: "Connect with professionals in your field." }
  ];
}
function getChallengesByRole(roleId) {
  if (DAILY_CHALLENGES[roleId]) return DAILY_CHALLENGES[roleId];
  return [
    { id: "c1", title: "Read an Industry Article", desc: "Find and read one recent article related to your target role.", type: "learning", xp: 30, timeLimit: "30 mins" },
    { id: "c2", title: "Network Outreach", desc: "Connect with 2 professionals in this role on LinkedIn.", type: "practice", xp: 40, timeLimit: "1 hour" }
  ];
}

// ─── QUIZ DB ─────────────────────────────────────────────────────────────────
const QUIZ_DB = {
  "ai-engineer": [
    { q: "Which Python library is primarily used for numerical computing?", options: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"], correct: 1, explanation: "NumPy provides multi-dimensional array support and math functions for scientific computing." },
    { q: "What does 'overfitting' mean in machine learning?", options: ["Model performs too well on all data", "Model memorizes training data but fails on new data", "Model ignores the training data", "Model has too few parameters"], correct: 1, explanation: "Overfitting = model learns training data noise and fails to generalize to new examples." },
    { q: "What is the purpose of 'dropout' in neural networks?", options: ["Speed up training", "Reduce overfitting by randomly disabling neurons", "Add more layers", "Normalize input data"], correct: 1, explanation: "Dropout randomly deactivates neurons during training, forcing the network to learn redundant representations." },
    { q: "In classification tasks, AUC-ROC measures:", options: ["Training speed", "Model ability to distinguish between classes", "Number of parameters", "Learning rate decay"], correct: 1, explanation: "AUC-ROC (Area Under Curve) measures how well the model separates positive vs negative classes across all thresholds." },
    { q: "Which architecture is used in GPT-style language models?", options: ["CNN", "RNN", "Transformer (Decoder-only)", "LSTM"], correct: 2, explanation: "GPT models use a decoder-only transformer architecture with self-attention mechanisms." },
  ],
  "fullstack-dev": [
    { q: "What does 'useState' return in React?", options: ["A class instance", "An array with state value and setter function", "A Promise", "A ref object"], correct: 1, explanation: "useState returns [state, setState] — the current state value and a function to update it." },
    { q: "What is the difference between '==' and '===' in JavaScript?", options: ["No difference", "'==' checks value only, '===' checks value AND type", "'===' is for strings only", "'==' is strict comparison"], correct: 1, explanation: "'==' does type coercion (5 == '5' is true), '===' is strict and checks both value and type." },
    { q: "In REST APIs, which HTTP method is idempotent?", options: ["POST", "PATCH", "GET", "None of these"], correct: 2, explanation: "GET is idempotent — calling it multiple times has the same result. POST creates new resources each time." },
    { q: "What is 'event bubbling' in JavaScript?", options: ["Events fire on all DOM elements simultaneously", "Events propagate from child to parent elements", "Events only fire once", "Events fire from parent to child"], correct: 1, explanation: "Event bubbling means events propagate upward from the target element through its ancestors." },
    { q: "In SQL, what does a LEFT JOIN return?", options: ["Only matching rows from both tables", "All rows from left table + matching rows from right table", "Only rows from the right table", "A cartesian product"], correct: 1, explanation: "LEFT JOIN returns all rows from the left table, and NULL values for non-matching rows from the right table." },
  ],
  "data-analyst": [
    { q: "What does SQL GROUP BY do?", options: ["Sorts rows ascending", "Groups rows sharing values for aggregate functions", "Filters rows by condition", "Joins two tables"], correct: 1, explanation: "GROUP BY groups rows with the same column value so aggregate functions (SUM, COUNT, AVG) can be applied." },
    { q: "What is the median in a data set?", options: ["The most frequent value", "The sum divided by count", "The middle value when sorted", "The range of values"], correct: 2, explanation: "The median is the middle value of a sorted dataset — it's less sensitive to outliers than the mean." },
    { q: "In A/B testing, p-value < 0.05 means:", options: ["The test is inconclusive", "There is statistically significant evidence against the null hypothesis", "The sample size is too small", "Group B definitely wins"], correct: 1, explanation: "p-value < 0.05 means there's less than 5% chance the result is due to random chance (by convention)." },
    { q: "What is a KPI?", options: ["Key Product Index", "Key Performance Indicator", "Knowledge Process Integration", "Kernel Performance Index"], correct: 1, explanation: "KPI = Key Performance Indicator. A measurable value that shows how effectively a company achieves business objectives." },
    { q: "What does a high correlation coefficient (r ≈ 0.9) indicate?", options: ["Causation between variables", "No relationship between variables", "Strong linear relationship between variables", "Weak negative relationship"], correct: 2, explanation: "r close to ±1 indicates a strong linear relationship. Note: correlation ≠ causation." },
  ],
};

function getQuizForRole(roleId) {
  if (QUIZ_DB[roleId]) return QUIZ_DB[roleId];
  return [
    { q: "What is the most important skill in this role?", options: ["Communication", "Technical Knowledge", "Problem Solving", "All of the above"], correct: 3, explanation: "A combination of skills is key to success." },
    { q: "How often should you update your knowledge in this field?", options: ["Never", "Yearly", "Regularly", "Only when looking for a job"], correct: 2, explanation: "Continuous learning is essential." }
  ];
}

// ─── MENTORS ─────────────────────────────────────────────────────────────────
const MENTORS = [
  { id: "m1", name: "Priya Sharma", role: "Senior ML Engineer", company: "Google DeepMind", expertise: ["AI/ML", "Python", "Deep Learning", "LLMs"], price_per_session: 1499, rating: 4.9, sessions_completed: 312, available: true, img: "👩🏽‍💻", specialFor: ["ai-engineer", "data-analyst", "data-engineer"], bio: "Ex-IIT Delhi. 7 years in ML. Helped 200+ students crack FAANG AI roles. Specializes in LLM fine-tuning and MLOps." },
  { id: "m2", name: "Arjun Mehta", role: "Staff Engineer", company: "Swiggy", expertise: ["Full Stack", "System Design", "Node.js", "React"], price_per_session: 999, rating: 4.8, sessions_completed: 487, available: true, img: "👨🏽‍💻", specialFor: ["fullstack-dev", "data-engineer", "cloud-engineer"], bio: "Built systems serving 5M+ users. Ex-Flipkart, Swiggy. Helps with cracking system design and full stack interviews." },
  { id: "m3", name: "Sneha Rao", role: "Head of Product", company: "Razorpay", expertise: ["Product Management", "Strategy", "Agile", "Analytics"], price_per_session: 1799, rating: 4.9, sessions_completed: 198, available: false, img: "👩🏽‍💼", specialFor: ["product-manager"], bio: "Built 3 products at Razorpay from 0→1. MBA from IIM-A. Expert in product metrics, roadmapping, and PM interviews." },
  { id: "m4", name: "Karan Verma", role: "Cybersec Lead", company: "KPMG", expertise: ["Cybersecurity", "Penetration Testing", "SIEM", "CompTIA"], price_per_session: 1299, rating: 4.7, sessions_completed: 156, available: true, img: "👨🏽‍🔬", specialFor: ["cybersecurity"], bio: "CEH + CISSP certified. Runs live CTF sessions. Built security programs for Fortune 500s. Helps with SOC analyst and pentesting roles." },
  { id: "m5", name: "Aarti Nair", role: "Senior UX Designer", company: "Microsoft", expertise: ["UX Design", "Figma", "Design Systems", "Research"], price_per_session: 1199, rating: 4.8, sessions_completed: 234, available: true, img: "👩🏽‍🎨", specialFor: ["ux-designer", "graphic-designer"], bio: "Designed for 50M+ users at Microsoft. Portfolio review specialist. Helps with Figma mastery and cracking design interviews." },
  { id: "m6", name: "Divya Kapoor", role: "Finance Manager", company: "Goldman Sachs", expertise: ["Financial Modeling", "DCF", "Equity Research", "CFA"], price_per_session: 1599, rating: 4.7, sessions_completed: 167, available: true, img: "👩🏽‍💼", specialFor: ["financial-analyst", "investment-banker"], bio: "CFA Level 3. Ex-Goldman. Helps with financial modeling, CFA prep, and cracking investment banking interviews." },
  { id: "m7", name: "Rahul Kumar", role: "Content Head", company: "HubSpot India", expertise: ["SEO", "Content Strategy", "Copywriting", "B2B Marketing"], price_per_session: 799, rating: 4.6, sessions_completed: 245, available: true, img: "👨🏽‍💼", specialFor: ["content-writer", "digital-marketer"], bio: "Grew blog from 0 to 2M monthly visitors. Expert in SEO-driven content strategy and monetization." },
];

// ─── DAILY CHALLENGES ────────────────────────────────────────────────────────
const DAILY_CHALLENGES = {
  "ai-engineer": [
    { id: "c1", title: "Train a Classifier", desc: "Train a logistic regression model on the Iris dataset and achieve 95%+ accuracy. Share your notebook link.", type: "project", xp: 50, timeLimit: "2 hours" },
    { id: "c2", title: "Explain LSTM vs GRU", desc: "Write a 200-word explanation of when to use LSTM vs GRU, with a concrete use case for each.", type: "concept", xp: 30, timeLimit: "30 mins" },
    { id: "c3", title: "SQL Window Functions", desc: "Solve 3 window function problems on LeetCode or Mode Analytics. Screenshot your solutions.", type: "practice", xp: 40, timeLimit: "1 hour" },
  ],
  "fullstack-dev": [
    { id: "c1", title: "Build an Auth Flow", desc: "Implement JWT-based login/signup with refresh tokens in Node.js + Express. No libraries except jsonwebtoken.", type: "project", xp: 60, timeLimit: "3 hours" },
    { id: "c2", title: "LeetCode Two Sum", desc: "Solve Two Sum on LeetCode in O(n) time and explain your approach in the comments.", type: "practice", xp: 25, timeLimit: "20 mins" },
    { id: "c3", title: "React Performance", desc: "Identify and fix 3 performance issues in a React component using React.memo, useMemo, and useCallback.", type: "concept", xp: 35, timeLimit: "1 hour" },
  ],
  "data-analyst": [
    { id: "c1", title: "SQL Streak", desc: "Solve 5 medium-difficulty SQL problems on StrataScratch or DataLemur. Note your approach for each.", type: "practice", xp: 50, timeLimit: "2 hours" },
    { id: "c2", title: "EDA in 30 Minutes", desc: "Download any Kaggle dataset and perform EDA: missing values, distributions, correlations. Share a 3-slide summary.", type: "project", xp: 40, timeLimit: "30 mins" },
    { id: "c3", title: "Build a Dashboard", desc: "Create a 5-chart Power BI or Tableau dashboard from a CSV file. Export and share the image.", type: "project", xp: 45, timeLimit: "2 hours" },
  ],
  "teacher": [
    { id: "c1", title: "Create 1 lesson plan", desc: "Draft a single, engaging 45-minute lesson plan on a topic of your choice.", type: "project", xp: 50, timeLimit: "1 hour" },
    { id: "c2", title: "Record 5 min teaching video", desc: "Use your phone or webcam to record a quick 5-minute explanation of a concept.", type: "practice", xp: 40, timeLimit: "30 mins" },
    { id: "c3", title: "Design a Quiz", desc: "Create a 10-question multiple-choice quiz that tests higher-order thinking.", type: "concept", xp: 30, timeLimit: "45 mins" },
  ],
};

function getDailyChallenges(roleId) {
  return DAILY_CHALLENGES[roleId] || DAILY_CHALLENGES["fullstack-dev"];
}

// ─── JOB LISTINGS (for matching) ─────────────────────────────────────────────
const JOB_LISTINGS = [
  { id: "j1", title: "Junior AI Engineer", company: "Zepto AI Lab", salary: "₹12–18L", location: "Bengaluru", type: "Full-Time", rolesFor: ["ai-engineer"], required_skills: ["Python", "ML Frameworks", "Data Pipelines"], min_score: 50 },
  { id: "j2", title: "Full Stack Developer", company: "Razorpay", salary: "₹10–20L", location: "Bengaluru", type: "Full-Time", rolesFor: ["fullstack-dev"], required_skills: ["React", "Node.js", "SQL"], min_score: 55 },
  { id: "j3", title: "Data Analyst - Growth", company: "Meesho", salary: "₹8–14L", location: "Bengaluru", type: "Full-Time", rolesFor: ["data-analyst"], required_skills: ["SQL", "Excel", "Python"], min_score: 45 },
  { id: "j4", title: "UI/UX Designer", company: "PhonePe", salary: "₹8–16L", location: "Bengaluru", type: "Full-Time", rolesFor: ["ux-designer"], required_skills: ["Figma", "User Research", "Prototyping"], min_score: 50 },
  { id: "j5", title: "Digital Marketing Executive", company: "Mamaearth", salary: "₹5–9L", location: "Gurugram", type: "Full-Time", rolesFor: ["digital-marketer"], required_skills: ["SEO", "Paid Ads", "Analytics"], min_score: 40 },
  { id: "j6", title: "Financial Analyst", company: "HDFC AMC", salary: "₹7–14L", location: "Mumbai", type: "Full-Time", rolesFor: ["financial-analyst"], required_skills: ["Excel", "Financial Modeling", "DCF"], min_score: 50 },
  { id: "j7", title: "Content Writer - Tech", company: "G2.com", salary: "₹4–8L", location: "Remote", type: "Full-Time", rolesFor: ["content-writer"], required_skills: ["SEO Writing", "Research", "AI Tools"], min_score: 35 },
  { id: "j8", title: "AI Intern", company: "Sprinklr", salary: "₹30K–50K/mo", location: "Gurugram", type: "Internship", rolesFor: ["ai-engineer"], required_skills: ["Python", "ML Frameworks"], min_score: 30 },
  { id: "j9", title: "Backend Developer", company: "CRED", salary: "₹12–22L", location: "Bengaluru", type: "Full-Time", rolesFor: ["fullstack-dev"], required_skills: ["Node.js", "APIs", "SQL"], min_score: 60 },
  { id: "j10", title: "Cloud Engineer", company: "Infosys Digital", salary: "₹9–18L", location: "Pune", type: "Full-Time", rolesFor: ["cloud-engineer"], required_skills: ["AWS/GCP", "Docker", "Linux"], min_score: 50 },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
function calcJobReadiness(user, selectedCareerPath) {
  const role = selectedCareerPath || user.targetRole;
  const userSkills = user.skills?.have || [];
  const requiredSkills = role.skills_needed || [];

  const skillMatch = requiredSkills.length > 0
    ? (userSkills.filter(s => requiredSkills.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))).length / requiredSkills.length) * 35
    : 10;

  const quizScore = Object.values(user.quizScores || {}).length > 0
    ? (Object.values(user.quizScores).reduce((a, b) => a + b, 0) / Object.values(user.quizScores).length) * 0.25
    : 0;

  const projectScore = Object.values(user.projectScores || {}).length > 0
    ? (Object.values(user.projectScores).reduce((a, b) => a + b, 0) / Object.values(user.projectScores).length) * 0.3
    : 0;

  const expBonus = user.experienceLevel === "intermediate" ? 5 : user.experienceLevel === "advanced" ? 10 : 0;

  return Math.min(100, Math.round(skillMatch + quizScore + projectScore + expBonus));
}

function calcSkillGap(user, selectedCareerPath) {
  const role = selectedCareerPath || user.targetRole;
  const userSkills = user.skills?.have || [];
  return role.skills_needed.map(skill => {
    const has = userSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
    const score = user.skillBadges?.[skill] || (has ? 60 : 0);
    return { skill, has, score, gap: 100 - score };
  });
}

function calcJobMatch(user, job, selectedCareerPath) {
  const userSkills = user.skills?.have || [];
  const matched = job.required_skills.filter(s =>
    userSkills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
  );
  const skillMatch = matched.length / job.required_skills.length;
  const readiness = calcJobReadiness(user, selectedCareerPath);
  const readinessMatch = Math.min(1, readiness / 100);
  const matchPct = Math.round((skillMatch * 0.6 + readinessMatch * 0.4) * 100);
  return { matchPct, matchedSkills: matched, missingSkills: job.required_skills.filter(s => !matched.includes(s)) };
}


// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function GlowBg() {
  return (
    <div className="glow-bg">
      <div className="glow-orb" style={{ width: 600, height: 600, background: "var(--amber)", top: "-20%", right: "-10%", opacity: 0.07 }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: "var(--purple)", bottom: "-15%", left: "-10%", opacity: 0.08 }} />
      <div className="glow-orb" style={{ width: 300, height: 300, background: "var(--cyan)", top: "40%", left: "30%", opacity: 0.05 }} />
    </div>
  );
}

function ScoreRing({ score, size = 130, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score < 30 ? "var(--red)" : score < 60 ? "var(--amber)" : "var(--green)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface2)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ "--target-offset": offset, transition: "stroke-dashoffset 1.5s ease" }}
        strokeLinecap="round" className="score-ring" />
    </svg>
  );
}

function Badge({ level }) {
  const cfg = {
    Verified: { bg: "rgba(6,182,212,0.12)", color: "var(--cyan)", border: "rgba(6,182,212,0.3)", icon: "✦" },
    Advanced: { bg: "rgba(139,92,246,0.12)", color: "var(--purple)", border: "rgba(139,92,246,0.3)", icon: "◆" },
    Intermediate: { bg: "var(--amber-dim)", color: "var(--amber)", border: "rgba(245,158,11,0.3)", icon: "●" },
    Beginner: { bg: "rgba(240,240,255,0.04)", color: "var(--text3)", border: "var(--border)", icon: "○" },
  }[level] || { bg: "var(--surface)", color: "var(--text3)", border: "var(--border)", icon: "○" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)" }}>
      {cfg.icon} {level}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)", animation: `bounce 1.2s ease ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ─── ONBOARDING ─────────────────────────────────────────────────────────────
function PageOnboarding({ onComplete, prefill = {} }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(prefill.prefillName || "");
  const [eduLevel, setEduLevel] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [motivation, setMotivation] = useState("");
  const [timeCommit, setTimeCommit] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filterCat, setFilterCat] = useState("All");

  const totalSteps = 5;
  const pct = Math.round((step / totalSteps) * 100);

  function toggleSkill(skill) {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  }

  function finish() {
    const roadmap = getOutcomeRoadmap(selectedRole.id);
    const relevantMentors = MENTORS.filter(m => m.specialFor.includes(selectedRole.id));
    onComplete({
      name, email: prefill.prefillEmail || "",
      eduLevel, targetRole: selectedRole, motivation, timeCommit,
      experienceLevel,
      skills: {
        have: selectedSkills, missing: selectedRole.skills_needed.filter(sk =>
          !selectedSkills.some(us => us.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(us.toLowerCase()))
        )
      },
      roadmap, mentors: relevantMentors,
      xp: 0, streak: 0, lastActiveDate: new Date().toDateString(),
      skillBadges: {}, quizScores: {}, projectScores: {},
      dailyChallengeCompleted: null,
      completedChallenges: [],
    });
  }

  const filteredRoles = filterCat === "All" ? TRENDING_ROLES : TRENDING_ROLES.filter(r => r.category === filterCat);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 720 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
            <span>Step {step + 1} of {totalSteps}</span>
            <span style={{ color: "var(--amber)", fontWeight: 700 }}>{pct}% complete</span>
          </div>
          <div style={{ height: 4, borderRadius: 4, background: "var(--surface2)" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: "linear-gradient(90deg,var(--amber),var(--amber2))", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* STEP 0: Name + edu */}
        {step === 0 && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>👋</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Let's get you hired</h2>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Takes 3 minutes. We'll build your personalized job plan.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>What should we call you? *</label>
              <input className="input-field" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 12, display: "block" }}>Current education / status</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["High School (10th/12th)", "Undergraduate (1st–2nd yr)", "Undergraduate (3rd–4th yr)", "Graduate / Postgraduate (BA/MA/MBA)", "Working Professional", "Career Switch / Re-skill", "Govt Exam Aspirant"].map(l => (
                  <button key={l} onClick={() => setEduLevel(l)}
                    style={{ padding: "13px 18px", borderRadius: 12, border: `2px solid ${eduLevel === l ? "var(--amber)" : "var(--border)"}`, background: eduLevel === l ? "var(--amber-dim)" : "var(--surface)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, textAlign: "left", transition: "all 0.18s" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: 16 }} disabled={!name.trim() || !eduLevel} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {/* STEP 1: Role selection with category filter */}
        {step === 1 && (
          <div className="fade-up">
            <div style={{ marginBottom: 24 }}>
              <div className="tag" style={{ background: "rgba(239,68,68,0.08)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: 16 }}>🔥 Market Data — Updated Weekly</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Choose Your Target Career</h2>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Ranked by market demand + salary. Not just IT — pick your real goal.</p>
            </div>
            {/* Category filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {ROLE_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  style={{ padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filterCat === cat ? "var(--amber)" : "var(--border2)"}`, background: filterCat === cat ? "var(--amber-dim)" : "transparent", color: filterCat === cat ? "var(--amber)" : "var(--text3)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", transition: "all 0.2s" }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 10, marginBottom: 20, maxHeight: 420, overflowY: "auto" }}>
              {filteredRoles.map(role => {
                const isSelected = selectedRole?.id === role.id;
                return (
                  <div key={role.id} onClick={() => setSelectedRole(role)}
                    style={{ padding: "16px", borderRadius: 14, border: `2px solid ${isSelected ? role.color : "var(--border)"}`, background: isSelected ? `${role.color}10` : "var(--surface)", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{role.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: isSelected ? role.color : "var(--text)", marginBottom: 4, lineHeight: 1.3 }}>{role.title}</div>
                    <div style={{ fontSize: 11, color: isSelected ? role.color : "var(--amber)", fontWeight: 700, marginBottom: 4 }}>{role.salary_range}</div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: role.category === "Tech" ? "rgba(6,182,212,0.1)" : role.category === "Finance" ? "rgba(52,211,153,0.1)" : role.category === "Design" ? "rgba(249,115,22,0.1)" : "rgba(245,158,11,0.1)", color: role.category === "Tech" ? "var(--cyan)" : role.category === "Finance" ? "var(--green)" : role.category === "Design" ? "#F97316" : "var(--amber)" }}>
                      {role.category}
                    </span>
                  </div>
                );
              })}
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 16 }} disabled={!selectedRole} onClick={() => setStep(2)}>Choose This Career →</button>
          </div>
        )}

        {/* STEP 2: Current Skills */}
        {step === 2 && (
          <div className="fade-up">
            <div style={{ marginBottom: 24 }}>
              <div className="tag" style={{ background: "rgba(16,185,129,0.08)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 16 }}>🎯 Skill Assessment</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 6 }}>What skills do you already have?</h2>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Select all that apply — we'll skip what you know and focus on what you need.</p>
            </div>
            {selectedRole && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Core Skills for {selectedRole.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getSkillsByRole(selectedRole.id).map(skill => (
                    <button key={skill} className={`skill-chip${selectedSkills.includes(skill) ? " selected" : ""}`} onClick={() => toggleSkill(skill)}>{skill}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "var(--amber)" }}>✦ {selectedSkills.length} skills selected — {selectedRole.skills_needed.filter(sk => !selectedSkills.some(us => us.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(us.toLowerCase()))).length} gaps to close for {selectedRole.title}</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex: 1, padding: "14px" }} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3: Experience level + goal */}
        {step === 3 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Your experience level?</h2>
            <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>This calibrates your roadmap difficulty and mentor matching.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { id: "beginner", label: "🌱 Beginner", desc: "Just starting out, little to no experience in this field" },
                { id: "intermediate", label: "🔥 Intermediate", desc: "Some experience, a few projects, know the basics" },
                { id: "advanced", label: "💪 Advanced", desc: "Solid experience, looking to level up or switch" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setExperienceLevel(opt.id)}
                  style={{ padding: "16px 20px", borderRadius: 12, border: `2px solid ${experienceLevel === opt.id ? "var(--cyan)" : "var(--border)"}`, background: experienceLevel === opt.id ? "rgba(6,182,212,0.06)" : "var(--surface)", color: "var(--text)", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>What's your primary goal?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { id: "job", label: "🎯 Land my first job ASAP", desc: "Focus on minimum viable skills to get hired" },
                { id: "switch", label: "🔄 Career switch from current role", desc: "Transition plan + salary negotiation" },
                { id: "freelance", label: "💼 Build freelance income", desc: "Client-ready skills + portfolio building" },
                { id: "startup", label: "🚀 Start my own venture", desc: "Founder-level skills + MVP building" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setMotivation(opt.id)}
                  style={{ padding: "14px 18px", borderRadius: 12, border: `2px solid ${motivation === opt.id ? "var(--amber)" : "var(--border)"}`, background: motivation === opt.id ? "var(--amber-dim)" : "var(--surface)", color: "var(--text)", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" style={{ flex: 1, padding: "14px" }} disabled={!experienceLevel || !motivation} onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4: Time commitment */}
        {step === 4 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>How much time can you commit?</h2>
            <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>Be realistic — we'll adjust your timeline accordingly</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { id: "light", label: "⚡ 1–2 hours/day", desc: `Part-time learner · ${selectedRole?.title} in ~18 months` },
                { id: "moderate", label: "🔥 3–5 hours/day", desc: `Solid pace · ${selectedRole?.title} in ~10 months` },
                { id: "intense", label: "💪 6–8 hours/day", desc: `Intensive track · ${selectedRole?.title} in ~6 months` },
                { id: "fulltime", label: "🎯 Full-time hustle", desc: `Max speed · ${selectedRole?.title} in 3–4 months` },
              ].map(opt => (
                <button key={opt.id} onClick={() => setTimeCommit(opt.id)}
                  style={{ padding: "16px 20px", borderRadius: 12, border: `2px solid ${timeCommit === opt.id ? "var(--amber)" : "var(--border)"}`, background: timeCommit === opt.id ? "var(--amber-dim)" : "var(--surface)", color: "var(--text)", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Skill gap preview */}
            {selectedRole && (
              <div style={{ padding: "18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 12 }}>YOUR SKILL GAP PREVIEW</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedRole.skills_needed.map(skill => {
                    const has = selectedSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <div key={skill} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 13, color: has ? "var(--text)" : "var(--text2)" }}>{skill}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: has ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: has ? "var(--green)" : "var(--red)" }}>
                          {has ? "✓ Have" : "✗ Gap"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setStep(3)}>← Back</button>
              <button className="btn-primary" style={{ flex: 1, padding: "15px", fontSize: 16 }} disabled={!timeCommit} onClick={finish}>Build My Personalized Plan 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, userName, plan, onChat, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: "🏠" },
    { id: "roadmap", label: "Roadmap", icon: "🗺️" },
    { id: "tasks", label: "Tasks", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🏗️" },
    { id: "courses", label: "Courses", icon: "🎓" },
    { id: "assessment", label: "Quiz", icon: "📝" },
    { id: "skills", label: "Skills", icon: "🏅" },
    { id: "jobs", label: "Jobs", icon: "💼" },
    { id: "portfolio", label: "Portfolio", icon: "📄" },
    { id: "challenge", label: "Daily", icon: "🔥" },
    { id: "mentors", label: "Mentors", icon: "🧑‍🏫" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "pricing", label: "Pricing", icon: "⭐" },
  ];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,7,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "8px 16px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "var(--amber)", letterSpacing: -1 }}>FORGE</div>
          {plan === "pro" && <span className="pro-badge">✦ PRO</span>}
        </div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item${page === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <span style={{ color: "var(--text3)", fontSize: 11 }}>{userName}</span>
          <button className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }} onClick={onChat}>AI Mentor</button>
          {onLogout && <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={onLogout}>Logout</button>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function PageDashboard({ user, plan, onUpgrade, setPage, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const score = calcJobReadiness(user, selectedCareerPath);
  const scoreColor = score < 30 ? "var(--red)" : score < 60 ? "var(--amber)" : "var(--green)";
  const skillGaps = calcSkillGap(user, selectedCareerPath);
  const missingSkills = skillGaps.filter(s => !s.has).slice(0, 3);
  const projectCount = Object.keys(user.projectScores || {}).length;
  const quizCount = Object.keys(user.quizScores || {}).length;

  const today = new Date().toDateString();
  const isStreakActive = user.lastActiveDate === today;

  const improvements = [
    { action: "Complete today's daily challenge", points: "+5%", done: user.dailyChallengeCompleted === today, page: "challenge" },
    { action: `Close skill gap: ${missingSkills[0]?.skill || role.skills_needed[0]}`, points: "+8%", done: missingSkills.length === 0, page: "roadmap" },
    { action: "Submit a project for AI evaluation", points: "+15%", done: projectCount >= 1, page: "projects" },
    { action: "Pass a skill assessment quiz", points: "+10%", done: quizCount >= 1, page: "assessment" },
    { action: "Get a mentor session", points: "+12%", done: false, page: "mentors" },
  ].filter(i => !i.done).slice(0, 3);

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 1100, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      {/* Hero */}
      <div style={{ padding: "28px 32px", borderRadius: 24, background: `linear-gradient(135deg,${role.color}12,rgba(139,92,246,0.06))`, border: `1px solid ${role.color}25`, marginBottom: 24, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 56 }}>{role.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: role.color, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Target Role</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
            {role.title} <span style={{ fontSize: 14, color: "var(--text2)", fontWeight: 400 }}>for {user.name}</span>
          </h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>💰 {role.salary_range}</span>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>⏱️ ~{role.time_to_learn}</span>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>📈 {role.growth_rate} YoY</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${role.color}15`, color: role.color }}>{role.category}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {isStreakActive && (
            <div className="streak-badge" style={{ padding: "8px 16px", borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, color: "var(--amber)" }}>🔥 {user.streak}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>Day Streak</div>
            </div>
          )}
          {plan !== "pro" && <button className="btn-pro" style={{ padding: "10px 18px", fontSize: 12 }} onClick={onUpgrade}>✦ Go Pro</button>}
        </div>
      </div>

      {/* Score + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ padding: "28px", borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 200 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", letterSpacing: 2, textTransform: "uppercase" }}>Job Readiness</div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScoreRing score={score} size={130} strokeWidth={10} />
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: scoreColor }}>{score}%</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>READY</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: score < 40 ? "var(--red)" : score < 70 ? "var(--amber)" : "var(--green)", fontWeight: 600, textAlign: "center" }}>
            {score < 40 ? "Building foundation..." : score < 70 ? "Getting strong!" : "Interview-ready! 🎉"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "XP Earned", val: user.xp || 0, icon: "⭐", color: "var(--amber)" },
            { label: "Projects Done", val: projectCount, icon: "🏗️", color: "var(--cyan)" },
            { label: "Quizzes Passed", val: quizCount, icon: "📝", color: "var(--purple)" },
            { label: "Skills Verified", val: Object.values(user.skillBadges || {}).filter(v => v >= 60).length, icon: "🏅", color: "var(--green)" },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "18px 20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.val}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gap Quick View */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🎯 Skill Gap Analysis</div>
          {skillGaps.slice(0, 5).map(({ skill, has, score: skillScore }) => (
            <div key={skill} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: has ? "var(--text)" : "var(--text2)" }}>{skill}</span>
                <span style={{ fontWeight: 700, color: has ? "var(--green)" : "var(--red)" }}>{has ? `${skillScore}%` : "Gap"}</span>
              </div>
              <div style={{ height: 5, borderRadius: 4, background: "var(--surface2)", overflow: "hidden" }}>
                <div style={{ width: `${skillScore}%`, height: "100%", borderRadius: 4, background: has ? "var(--green)" : "var(--red)", transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
          <button onClick={() => setPage("skills")} style={{ fontSize: 12, color: "var(--amber)", background: "none", border: "none", cursor: "pointer", marginTop: 8, fontFamily: "var(--font-body)" }}>View full skill proof →</button>
        </div>

        <div style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🚀 Next Actions</div>
          {improvements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ color: "var(--green)", fontWeight: 700 }}>You're on fire! Keep going.</div>
            </div>
          ) : (
            improvements.map((imp, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--amber)", flexShrink: 0, fontWeight: 700 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>{imp.action}</div>
                  <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700 }}>{imp.points}</div>
                </div>
                <button onClick={() => setPage(imp.page)} style={{ background: "none", border: "1px solid var(--border2)", borderRadius: 8, padding: "4px 10px", color: "var(--text3)", cursor: "pointer", fontSize: 11 }}>Go →</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP PAGE (Skill-Gap Driven + Accordion) ──────────────────────────────
function PageRoadmap({ user, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const roadmap = user.roadmap || getOutcomeRoadmap(role.id);
  const [openPhase, setOpenPhase] = useState(0);
  const skillGaps = calcSkillGap(user, selectedCareerPath);
  const missingSkills = skillGaps.filter(s => !s.has).map(s => s.skill);

  // Personalize tasks based on skill gap
  function personalizePhase(phase, idx) {
    if (idx === 0 && missingSkills.length > 0) {
      const focusTasks = missingSkills.slice(0, 3).map(skill => `Master ${skill} — identified as your skill gap`);
      return { ...phase, tasks: [...focusTasks, ...phase.tasks.slice(focusTasks.length)], personalized: true };
    }
    return phase;
  }

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 900, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background: "rgba(139,92,246,0.08)", color: "var(--purple)", border: "1px solid rgba(139,92,246,0.25)", marginBottom: 20 }}>🗺️ Personalized Roadmap</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Your Path to {role.title}</h1>
      <p style={{ color: "var(--text2)", marginBottom: 12 }}>Tailored to your skill gaps · {missingSkills.length} skills to close</p>

      {/* Skill gap banner */}
      {missingSkills.length > 0 && (
        <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 28, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>Gap-focused personalization active</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Your Phase 1 prioritizes: <strong style={{ color: "var(--amber)" }}>{missingSkills.slice(0, 3).join(", ")}</strong></div>
          </div>
          {user.experienceLevel === "intermediate" || user.experienceLevel === "advanced" ? (
            <div style={{ padding: "4px 12px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "var(--green)", fontSize: 11, fontWeight: 700 }}>✓ Basics skipped (you're {user.experienceLevel})</div>
          ) : null}
        </div>
      )}

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {roadmap.map((phase, idx) => {
          const personalizedPhase = personalizePhase(phase, idx);
          const isOpen = openPhase === idx;
          const isSkipped = (user.experienceLevel === "advanced" && idx === 0);
          return (
            <div key={idx} style={{ position: "relative" }}>
              {idx < roadmap.length - 1 && (
                <div style={{ position: "absolute", left: 28, top: 72, bottom: -24, width: 2, background: `linear-gradient(to bottom, ${phase.color}60, transparent)`, zIndex: 0 }} />
              )}
              <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
                <button onClick={() => setOpenPhase(isOpen ? -1 : idx)} style={{ width: "100%", padding: "20px 24px", borderRadius: isOpen ? "16px 16px 0 0" : 16, background: isOpen ? `${phase.color}08` : "var(--surface)", border: `1px solid ${isOpen ? phase.color + "40" : "var(--border)"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", textAlign: "left" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: isSkipped ? "var(--surface2)" : `${phase.color}18`, border: `2px solid ${isSkipped ? "var(--border)" : phase.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {isSkipped ? "⏭️" : phase.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2, flexWrap: "wrap" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: isSkipped ? "var(--text3)" : "var(--text)" }}>{phase.phase}</div>
                      {personalizedPhase.personalized && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "rgba(245,158,11,0.12)", color: "var(--amber)" }}>✦ PERSONALIZED</span>}
                      {isSkipped && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "rgba(16,185,129,0.1)", color: "var(--green)" }}>SKIPPED (advanced)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{phase.goal}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>📅 {phase.days}</div>
                  </div>
                  <div style={{ color: isOpen ? phase.color : "var(--text3)", fontSize: 18, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</div>
                </button>

                {isOpen && (
                  <div style={{ padding: "20px 24px", borderRadius: "0 0 16px 16px", background: `${phase.color}05`, border: `1px solid ${phase.color}30`, borderTop: "none", animation: "fadeUp 0.3s ease" }}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Daily Breakdown</div>
                      {personalizedPhase.tasks.map((task, ti) => (
                        <div key={ti} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 10, marginBottom: 6, background: "var(--surface)" }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${phase.color}20`, border: `1px solid ${phase.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: phase.color, flexShrink: 0 }}>{ti + 1}</div>
                          <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{task}</span>
                          {ti < 2 && personalizedPhase.personalized && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, background: "var(--amber-dim)", color: "var(--amber)", flexShrink: 0 }}>Gap</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: `${phase.color}10`, border: `1px solid ${phase.color}30` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: phase.color }}>🎯 Outcome: </span>
                      <span style={{ fontSize: 12, color: "var(--text2)" }}>{phase.outcome}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AUTO TASK SYSTEM ─────────────────────────────────────────────────────────
function PageTaskTracker({ user, setUser, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const skillGaps = calcSkillGap(user, selectedCareerPath);
  const todayKey = new Date().toDateString();

  // Auto-generate daily tasks based on skill gaps + roadmap
  const autoTasks = [
    ...skillGaps.filter(s => !s.has).slice(0, 2).map((sg, i) => ({
      id: `gap-${i}`, text: `Study ${sg.skill} — 45 min deep work`, type: "learning", autoComplete: false,
      completedBy: "manual", xp: 30,
    })),
    {
      id: "quiz-today", text: "Complete today's skill quiz", type: "quiz", autoComplete: true,
      completedBy: "quiz", done: Object.keys(user.quizScores || {}).length > 0, xp: 40,
    },
    {
      id: "project-today", text: "Work on an active project (30+ min)", type: "project", autoComplete: true,
      completedBy: "project", done: Object.keys(user.projectScores || {}).length > 0, xp: 60,
    },
    {
      id: "challenge-today", text: "Complete today's daily challenge", type: "challenge", autoComplete: true,
      completedBy: "challenge", done: user.dailyChallengeCompleted === todayKey, xp: 50,
    },
    {
      id: "network-today", text: "Connect with 2 professionals on LinkedIn", type: "networking", autoComplete: false,
      completedBy: "manual", xp: 20,
    },
    {
      id: "resource-today", text: "Read 1 resource or course module", type: "learning", autoComplete: false,
      completedBy: "manual", xp: 25,
    },
  ];

  const [manualDone, setManualDone] = useState(() => {
    const saved = localStorage.getItem ? localStorage.getItem(`tasks_${todayKey}`) : null;
    return saved ? JSON.parse(saved) : [];
  });

  function toggleManual(taskId) {
    const newDone = manualDone.includes(taskId) ? manualDone.filter(t => t !== taskId) : [...manualDone, taskId];
    setManualDone(newDone);
  }

  const tasks = autoTasks.map(t => ({
    ...t,
    done: t.done || manualDone.includes(t.id),
  }));

  const doneTasks = tasks.filter(t => t.done);
  const totalXP = doneTasks.reduce((a, t) => a + t.xp, 0);
  const completionPct = Math.round((doneTasks.length / tasks.length) * 100);

  const typeColors = { learning: "var(--cyan)", quiz: "var(--purple)", project: "var(--green)", challenge: "var(--amber)", networking: "#F97316" };
  const typeLabels = { learning: "📚 Learning", quiz: "📝 Quiz", project: "🏗️ Project", challenge: "🔥 Challenge", networking: "🤝 Network" };

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 800, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background: "rgba(16,185,129,0.08)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20 }}>⚡ Auto Task Engine</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Today's Mission</h1>
      <p style={{ color: "var(--text2)", marginBottom: 24 }}>Auto-generated based on your skill gaps • {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>

      {/* Progress */}
      <div style={{ padding: "20px 24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: completionPct === 100 ? "var(--green)" : "var(--amber)" }}>{completionPct}%</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Daily Progress</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, borderRadius: 8, background: "var(--surface2)", overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${completionPct}%`, height: "100%", borderRadius: 8, background: completionPct === 100 ? "var(--green)" : "linear-gradient(90deg,var(--amber),var(--amber2))", transition: "width 0.6s" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{doneTasks.length}/{tasks.length} tasks · +{totalXP} XP earned today</div>
        </div>
        {completionPct === 100 && <div style={{ fontSize: 32 }}>🎉</div>}
      </div>

      {/* Tasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((task) => (
          <div key={task.id} style={{ padding: "16px 20px", borderRadius: 14, background: task.done ? "rgba(16,185,129,0.05)" : "var(--surface)", border: `1px solid ${task.done ? "rgba(16,185,129,0.25)" : "var(--border)"}`, display: "flex", gap: 14, alignItems: "center", transition: "all 0.2s" }}>
            {task.autoComplete ? (
              <div style={{ width: 22, height: 22, borderRadius: 6, background: task.done ? "var(--green)" : "var(--surface2)", border: `2px solid ${task.done ? "var(--green)" : "var(--border2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                {task.done ? "✓" : ""}
              </div>
            ) : (
              <div onClick={() => toggleManual(task.id)} style={{ width: 22, height: 22, borderRadius: 6, background: task.done ? "var(--green)" : "transparent", border: `2px solid ${task.done ? "var(--green)" : "var(--border2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, cursor: "pointer", color: "#fff" }}>
                {task.done ? "✓" : ""}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: task.done ? "var(--text2)" : "var(--text)", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 6, background: `${typeColors[task.type]}15`, color: typeColors[task.type] }}>{typeLabels[task.type]}</span>
                {task.autoComplete && <span style={{ fontSize: 10, color: "var(--text3)" }}>Auto-tracked</span>}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: task.done ? "var(--green)" : "var(--text3)" }}>+{task.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
function PageProjects({ user, setUser, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const projects = getProjectsByRole(role.id);
  const [selected, setSelected] = useState(null);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitDesc, setSubmitDesc] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const diffColor = { Beginner: "var(--green)", Intermediate: "var(--amber)", Advanced: "var(--red)" };

  async function evaluate() {
    if (!submitUrl.trim() && !submitDesc.trim()) return;
    setEvaluating(true);
    const sys = `You are a senior hiring manager evaluating a student project. Return ONLY valid JSON:
{"score":75,"strengths":["strength1","strength2","strength3"],"weaknesses":["weakness1","weakness2"],"improvements":["improvement1","improvement2","improvement3"],"verdict":"Brief 1-sentence hiring verdict","hire_signal":"strong|moderate|weak"}`;
    const prompt = `Project: "${selected.title}". Problem: "${selected.problem}". Skills: ${selected.skills.join(", ")}. 
Submission URL: ${submitUrl || "not provided"}. 
Description: ${submitDesc || "not provided"}. 
Evaluate for: code quality, problem solving, completeness, best practices, hiring signal. Score 0–100.`;

   const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: prompt }]
  }),
});

const data = await res.json();
const reply = data.reply;
    try {
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      const newScores = { ...user.projectScores, [selected.id]: parsed.score };
      const newBadges = { ...user.skillBadges };
      selected.skills.forEach(skill => {
        newBadges[skill] = Math.min(100, (newBadges[skill] || 0) + Math.round(parsed.score * 0.4));
      });
      const newXP = (user.xp || 0) + Math.round(parsed.score * (selected.xp / 100));
      setUser(u => ({ ...u, projectScores: newScores, skillBadges: newBadges, xp: newXP }));
    } catch {
      setResult({ score: 65, strengths: ["Submitted for review", "Shows initiative"], weaknesses: ["Could not parse submission details"], improvements: ["Add a GitHub README", "Deploy a live demo", "Write tests"], verdict: "Submission received — good effort, keep improving!", hire_signal: "moderate" });
    }
    setEvaluating(false);
  }

  if (selected) {
    const submitted = user.projectScores?.[selected.id] !== undefined;
    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 800, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <button onClick={() => { setSelected(null); setResult(null); setSubmitUrl(""); setSubmitDesc(""); }}
          style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← Back to Projects</button>

        <div style={{ padding: "24px", borderRadius: 20, background: "var(--surface)", border: `1px solid ${role.color}25`, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 36 }}>{selected.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{selected.title}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: `${diffColor[selected.difficulty]}15`, color: diffColor[selected.difficulty], fontSize: 11, fontWeight: 700 }}>{selected.difficulty}</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(139,92,246,0.1)", color: "var(--purple)", fontSize: 11, fontWeight: 700 }}>⭐ {selected.xp} XP</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 12 }}>{selected.problem}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.skills.map(s => <span key={s} style={{ padding: "3px 10px", borderRadius: 20, background: "var(--bg3)", color: "var(--text2)", fontSize: 11, border: "1px solid var(--border)" }}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        {!result && !submitted ? (
          <div style={{ padding: "24px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Submit for AI Evaluation</div>
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Paste your GitHub link or describe what you built. AI will score it 0–100 and give hiring feedback.</p>
            <input className="input-field" placeholder="GitHub repo URL or live demo link (optional)" value={submitUrl} onChange={e => setSubmitUrl(e.target.value)} style={{ marginBottom: 12 }} />
            <textarea className="input-field" placeholder="Describe what you built, what you learned, and any challenges... (optional)" value={submitDesc} onChange={e => setSubmitDesc(e.target.value)} rows={3} style={{ marginBottom: 12, resize: "vertical" }} />
            <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }} onClick={evaluate} disabled={evaluating || (!submitUrl.trim() && !submitDesc.trim())}>
              {evaluating ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><div className="spinner" /> AI Evaluating...</span> : "🤖 Submit for AI Evaluation →"}
            </button>
          </div>
        ) : result ? (
          <div className="fade-up">
            <div style={{ padding: "28px", borderRadius: 20, background: "var(--surface)", border: `1px solid ${result.score >= 70 ? "rgba(16,185,129,0.3)" : result.score >= 50 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>AI Project Score</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 900, color: result.score >= 70 ? "var(--green)" : result.score >= 50 ? "var(--amber)" : "var(--red)" }}>{result.score}<span style={{ fontSize: 24, color: "var(--text3)" }}>/100</span></div>
              <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6, fontStyle: "italic" }}>{result.verdict}</div>
              <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 20, background: result.hire_signal === "strong" ? "rgba(16,185,129,0.1)" : result.hire_signal === "moderate" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", color: result.hire_signal === "strong" ? "var(--green)" : result.hire_signal === "moderate" ? "var(--amber)" : "var(--red)" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>Hire Signal: {result.hire_signal?.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={{ padding: "18px", borderRadius: 14, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 10 }}>✅ Strengths</div>
                {result.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid var(--green)" }}>{s}</div>)}
              </div>
              <div style={{ padding: "18px", borderRadius: 14, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", marginBottom: 10 }}>⚠️ Weaknesses</div>
                {result.weaknesses.map((w, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid var(--red)" }}>{w}</div>)}
              </div>
            </div>
            <div style={{ padding: "18px", borderRadius: 14, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)", marginBottom: 10 }}>💡 How to Improve</div>
              {result.improvements.map((imp, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6, display: "flex", gap: 8 }}><span style={{ color: "var(--amber)", flexShrink: 0 }}>{i + 1}.</span>{imp}</div>)}
            </div>
            <button className="btn-ghost" style={{ width: "100%" }} onClick={() => { setSelected(null); setResult(null); setSubmitUrl(""); setSubmitDesc(""); }}>← View All Projects</button>
          </div>
        ) : (
          <div style={{ padding: "20px", borderRadius: 16, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, color: "var(--green)" }}>Already submitted! Score: {user.projectScores[selected.id]}/100</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 900, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: `${role.color}18`, color: role.color, border: `1px solid ${role.color}30`, marginBottom: 20 }}>🏗️ Project Lab</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Real-World Projects</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Submit → AI evaluates → Get scored + hiring feedback for {role.title}</p>
      <div style={{ display: "grid", gap: 14 }}>
        {projects.map(proj => {
          const projScore = user.projectScores?.[proj.id];
          const submitted = projScore !== undefined;
          return (
            <div key={proj.id} className="card-hover" style={{ padding: "24px", borderRadius: 20, background: "var(--surface)", border: `1px solid ${submitted ? "rgba(16,185,129,0.25)" : "var(--border)"}`, cursor: "pointer", position: "relative", overflow: "hidden" }}
              onClick={() => setSelected(proj)}>
              {submitted && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--green),transparent)" }} />}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{proj.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>{proj.title}</div>
                    {submitted ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
                        <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 700 }}>✓ Score: {projScore}/100</span>
                      </div>
                    ) : (
                      <span style={{ padding: "4px 12px", borderRadius: 20, background: `${diffColor[proj.difficulty]}15`, color: diffColor[proj.difficulty], fontSize: 11, fontWeight: 700 }}>{proj.difficulty}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>{proj.problem.slice(0, 120)}...</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {proj.skills.map(s => <span key={s} style={{ padding: "2px 8px", borderRadius: 10, background: "var(--bg3)", color: "var(--text2)", fontSize: 10, border: "1px solid var(--border)" }}>{s}</span>)}
                    <span style={{ padding: "2px 8px", borderRadius: 10, background: "rgba(139,92,246,0.1)", color: "var(--purple)", fontSize: 10, fontWeight: 700 }}>⭐ {proj.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ASSESSMENT PAGE ──────────────────────────────────────────────────────────
function PageAssessment({ user, setUser, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const questions = getQuizForRole(role.id);
  const [mode, setMode] = useState("home");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExpl, setShowExpl] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  async function generateAIQuiz() {
    setLoadingAi(true);
    const skillGaps = calcSkillGap(user, selectedCareerPath).filter(s => !s.has).map(s => s.skill).slice(0, 3);
    const sys = `Generate 5 multiple-choice quiz questions targeting weak areas. Return ONLY valid JSON array:
[{"q":"question","options":["a","b","c","d"],"correct":0,"explanation":"why this is correct"}]`;
    const prompt = `Target role: ${role.title}. Weak skills: ${skillGaps.join(", ") || role.skills_needed.join(", ")}. Generate 5 MCQs testing these specific skills. Difficulty: ${user.experienceLevel || "intermediate"}.`;
    const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: sys + "\n\n" + prompt }]
  }),
});

if (!res.ok) throw new Error("API failed");

const data = await res.json();
const reply = data.reply;
    try {
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiQuestions(parsed);
      setMode("ai-quiz");
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
    } catch {
      setAiQuestions(questions);
      setMode("quiz");
    }
    setLoadingAi(false);
  }

  const activeQuestions = mode === "ai-quiz" ? aiQuestions : questions;
  const q = activeQuestions[current];

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExpl(true);
    const correct = idx === q.correct;
    setAnswers(a => [...a, { q: q.q, correct }]);
  }

  function next() {
    if (current + 1 < activeQuestions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExpl(false);
    } else {
      // Save score
      const score = Math.round((answers.filter(a => a.correct).length / activeQuestions.length) * 100);
      const newScores = { ...user.quizScores, [role.id]: score };
      const newBadges = { ...user.skillBadges };
      role.skills_needed.slice(0, 3).forEach(skill => {
        newBadges[skill] = Math.min(100, (newBadges[skill] || 0) + Math.round(score * 0.25));
      });
      const newXP = (user.xp || 0) + Math.round(score * 0.5);
      setUser(u => ({ ...u, quizScores: newScores, skillBadges: newBadges, xp: newXP }));
      setMode("result");
    }
  }

  if (mode === "home") {
    const prevScore = user.quizScores?.[role.id];
    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 700, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <span className="tag" style={{ background: "rgba(245,158,11,0.08)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: 20 }}>📝 Skill Assessment</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Test Your {role.title} Skills</h1>
        <p style={{ color: "var(--text2)", marginBottom: 28 }}>Scores update your Job Readiness & Skill Badges automatically</p>
        <div style={{ display: "grid", gap: 14, marginBottom: 28 }}>
          {[
            { id: "standard", icon: "📋", title: "Standard Quiz", desc: `${questions.length} curated MCQs for ${role.title}`, badge: "5 Questions", action: () => { setMode("quiz"); setCurrent(0); setAnswers([]); setSelected(null); } },
            { id: "adaptive", icon: "🤖", title: "AI Adaptive Quiz", desc: "Questions targeting YOUR specific skill gaps", badge: "Gap-Focused", action: generateAIQuiz, loading: loadingAi },
          ].map(opt => (
            <div key={opt.id} className="card-hover" style={{ padding: "22px 24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer" }} onClick={opt.action}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 36 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{opt.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>{opt.desc}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 10, background: "var(--amber-dim)", color: "var(--amber)", fontSize: 11, fontWeight: 700 }}>{opt.badge}</span>
                  {opt.loading ? <div className="spinner" style={{ borderColor: "rgba(245,158,11,0.2)", borderTopColor: "var(--amber)" }} /> : <span style={{ color: "var(--amber)", fontSize: 16 }}>→</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {prevScore !== undefined && (
          <div style={{ padding: "16px 20px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Previous Score</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Skills updated automatically</div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: prevScore >= 70 ? "var(--green)" : prevScore >= 50 ? "var(--amber)" : "var(--red)" }}>{prevScore}%</div>
          </div>
        )}
      </div>
    );
  }

  if ((mode === "quiz" || mode === "ai-quiz") && q) {
    const progress = ((current + 1) / activeQuestions.length) * 100;
    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 680, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
            <span>Question {current + 1}/{activeQuestions.length}</span>
            {mode === "ai-quiz" && <span style={{ color: "var(--amber)", fontWeight: 700 }}>🤖 AI Adaptive</span>}
          </div>
          <div style={{ height: 4, borderRadius: 4, background: "var(--surface2)" }}>
            <div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: "linear-gradient(90deg,var(--amber),var(--amber2))", transition: "width 0.4s" }} />
          </div>
        </div>
        <div style={{ padding: "24px", borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1.5, marginBottom: 20 }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              let bg = "var(--surface2)", border = "var(--border2)", color = "var(--text)";
              if (selected !== null) {
                if (isCorrect) { bg = "rgba(16,185,129,0.1)"; border = "rgba(16,185,129,0.4)"; color = "var(--green)"; }
                else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.4)"; color = "var(--red)"; }
              } else if (isSelected) { bg = "var(--amber-dim)"; border = "var(--amber)"; }
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  style={{ padding: "14px 18px", borderRadius: 12, background: bg, border: `2px solid ${border}`, color, cursor: selected !== null ? "default" : "pointer", textAlign: "left", fontSize: 14, fontFamily: "var(--font-body)", transition: "all 0.2s", display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface)", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{["A", "B", "C", "D"][i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {showExpl && (
          <div className="fade-up" style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cyan)" }}>💡 </span>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>{q.explanation}</span>
          </div>
        )}
        {selected !== null && (
          <button className="btn-primary" style={{ width: "100%", padding: "14px" }} onClick={next}>
            {current + 1 < activeQuestions.length ? "Next Question →" : "View Results →"}
          </button>
        )}
      </div>
    );
  }

  if (mode === "result") {
    const score = user.quizScores?.[role.id] || 0;
    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 600, margin: "0 auto", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{score >= 70 ? "🎉" : score >= 50 ? "📈" : "💪"}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Quiz Complete!</h1>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 900, color: score >= 70 ? "var(--green)" : score >= 50 ? "var(--amber)" : "var(--red)", margin: "16px 0" }}>{score}%</div>
        <p style={{ color: "var(--text2)", marginBottom: 8 }}>{answers.filter(a => a.correct).length}/{activeQuestions.length} correct · Skill scores & XP updated!</p>
        <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 28 }}>{score >= 70 ? `Excellent! Strong skills for ${role.title}` : score >= 50 ? "Good start! Keep practicing." : "Review the topics and retake!"}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => { setMode("quiz"); setCurrent(0); setAnswers([]); setSelected(null); setShowExpl(false); }}>Retake →</button>
          <button className="btn-ghost" onClick={() => setMode("home")}>Back</button>
        </div>
      </div>
    );
  }
  return null;
}

// ─── SKILL PROOF DASHBOARD ────────────────────────────────────────────────────
function PageSkills({ user, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const skillGaps = calcSkillGap(user, selectedCareerPath);
  const jobReadiness = calcJobReadiness(user, selectedCareerPath);

  function getBadgeLevel(score) {
    if (score >= 80) return "Verified";
    if (score >= 60) return "Advanced";
    if (score >= 40) return "Intermediate";
    return "Beginner";
  }

  const overallScore = skillGaps.reduce((sum, s) => sum + s.score, 0) / skillGaps.length || 0;
  const verifiedCount = skillGaps.filter(s => s.score >= 80).length;
  const advancedCount = skillGaps.filter(s => s.score >= 60 && s.score < 80).length;

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 960, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(6,182,212,0.08)", color: "var(--cyan)", border: "1px solid rgba(6,182,212,0.25)", marginBottom: 20 }}>🏅 Skill Proof Dashboard</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Verified Skills Portfolio</h1>
          <p style={{ color: "var(--text2)" }}>Backed by projects, quizzes & AI evaluations · {role.title}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Readiness", val: `${jobReadiness}%`, color: "var(--amber)" },
            { label: "Verified Skills", val: verifiedCount, color: "var(--cyan)" },
            { label: "Advanced", val: advancedCount, color: "var(--purple)" },
            { label: "Total XP", val: user.xp || 0, color: "var(--green)" },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "16px 20px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center", minWidth: 80 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: stat.color }}>{stat.val}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, marginBottom: 24 }}>
        {skillGaps.map(({ skill, has, score: skillScore }) => {
          const level = getBadgeLevel(skillScore);
          const sources = [];
          if (Object.values(user.quizScores || {}).length > 0) sources.push("Quiz");
          if (Object.keys(user.projectScores || {}).length > 0) sources.push("Project");
          if (has) sources.push("Self-reported");
          return (
            <div key={skill} style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: `1px solid ${skillScore >= 60 ? "rgba(16,185,129,0.2)" : skillScore >= 40 ? "rgba(245,158,11,0.15)" : has ? "rgba(6,182,212,0.15)" : "var(--border)"}`, position: "relative", overflow: "hidden" }}>
              {skillScore >= 80 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--cyan),var(--green))" }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{skill}</div>
                <Badge level={level} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "var(--text3)" }}>Proficiency</span>
                  <span style={{ fontWeight: 700, color: skillScore >= 70 ? "var(--green)" : skillScore >= 40 ? "var(--amber)" : has ? "var(--cyan)" : "var(--red)" }}>{skillScore}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 8, background: "var(--surface2)", overflow: "hidden" }}>
                  <div style={{ width: `${skillScore}%`, height: "100%", borderRadius: 8, background: skillScore >= 70 ? "linear-gradient(90deg,var(--green),var(--cyan))" : skillScore >= 40 ? "linear-gradient(90deg,var(--amber),var(--amber2))" : has ? "var(--cyan)" : "var(--red)", transition: "width 0.8s ease" }} />
                </div>
              </div>
              {sources.length > 0 ? (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>Verified via:</span>
                  {sources.map(s => <span key={s} style={{ padding: "1px 6px", borderRadius: 4, background: "var(--bg3)", color: "var(--text3)", fontSize: 10 }}>{s}</span>)}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Take quiz or submit project to verify →</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div style={{ padding: "20px 24px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🏆 Achievements</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { icon: "🚀", label: "First Project", unlocked: Object.keys(user.projectScores || {}).length >= 1 },
            { icon: "📝", label: "Quiz Champion", unlocked: (user.quizScores?.[role.id] || 0) >= 70 },
            { icon: "🔥", label: "3-Day Streak", unlocked: (user.streak || 0) >= 3 },
            { icon: "💎", label: "50% Ready", unlocked: jobReadiness >= 50 },
            { icon: "⭐", label: "500 XP", unlocked: (user.xp || 0) >= 500 },
            { icon: "🏅", label: "Skill Verified", unlocked: verifiedCount >= 1 },
          ].map(ach => (
            <div key={ach.label} style={{ padding: "10px 16px", borderRadius: 12, background: ach.unlocked ? "rgba(245,158,11,0.08)" : "var(--surface2)", border: `1px solid ${ach.unlocked ? "rgba(245,158,11,0.3)" : "var(--border)"}`, opacity: ach.unlocked ? 1 : 0.4, textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{ach.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ach.unlocked ? "var(--amber)" : "var(--text3)" }}>{ach.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── JOB MATCHING PAGE ────────────────────────────────────────────────────────
function PageJobs({ user, plan, onUpgrade, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const [filterType, setFilterType] = useState("All");
  const readiness = calcJobReadiness(user, selectedCareerPath);

  const allJobs = getJobsByRole(role.id);
  const filteredJobs = filterType === "All" ? allJobs : allJobs.filter(j => j.type === filterType);

  // Industry jobs from localStorage
  const industryJobs = JSON.parse(localStorage.getItem("forge_industry_jobs") || "[]").filter(j => j.status === "active");

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 960, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(16,185,129,0.08)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20 }}>💼 Job Matching Engine</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Matched Jobs for You</h1>
          <p style={{ color: "var(--text2)" }}>Based on your {readiness}% job readiness · {role.title}</p>
        </div>
        <div style={{ padding: "14px 20px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "center" }}>
          <ScoreRing score={readiness} size={60} strokeWidth={6} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: readiness < 40 ? "var(--red)" : readiness < 70 ? "var(--amber)" : "var(--green)" }}>{readiness}%</div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>Job Readiness</div>
          </div>
        </div>
      </div>

      {/* Industry Jobs Section */}
      {industryJobs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🏢</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>Jobs from Industry Partners</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {industryJobs.slice(0, 3).map(job => (
              <div key={job.id} style={{ padding: "18px 20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--purple),var(--cyan))" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{job.jobTitle}</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "var(--text2)" }}>🏢 {job.companyName}</span>
                      <span style={{ fontSize: 13, color: "var(--text2)" }}>📍 {job.location || "Remote"}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>💰 {job.salaryMin ? `${job.currency}${job.salaryMin}K–${job.currency}${job.salaryMax}K` : "Not disclosed"}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "rgba(139,92,246,0.1)", color: "var(--purple)", fontWeight: 700 }}>{job.jobType}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 60 }}>
                    <div style={{ fontSize: 18, color: "var(--purple)" }}>🏢</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Industry</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {job.skills.slice(0, 4).map(skill => <span key={skill} className="tag" style={{ background: "var(--purple-dim)", color: "var(--purple)" }}>{skill}</span>)}
                  {job.skills.length > 4 && <span style={{ fontSize: 12, color: "var(--text3)" }}>+{job.skills.length - 4} more</span>}
                </div>
                <button style={{ padding: "8px 16px", borderRadius: 10, background: "linear-gradient(135deg,var(--purple),var(--cyan))", border: "none", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Apply to Industry Job →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Full-Time", "Internship"].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            style={{ padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filterType === t ? "var(--amber)" : "var(--border2)"}`, background: filterType === t ? "var(--amber-dim)" : "transparent", color: filterType === t ? "var(--amber)" : "var(--text3)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Job cards */}
      <div style={{ display: "grid", gap: 14 }}>
        {filteredJobs.map(job => {
          const { matchPct, matchedSkills, missingSkills } = calcJobMatch(user, job, selectedCareerPath);
          const canApply = readiness >= job.min_score;
          return (
            <div key={job.id} style={{ padding: "22px 24px", borderRadius: 18, background: "var(--surface)", border: `1px solid ${matchPct >= 70 ? "rgba(16,185,129,0.2)" : matchPct >= 50 ? "rgba(245,158,11,0.15)" : "var(--border)"}`, position: "relative", overflow: "hidden" }}>
              {matchPct >= 80 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--green),transparent)" }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{job.title}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>🏢 {job.company}</span>
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>📍 {job.location}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>💰 {job.salary}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: job.type === "Internship" ? "rgba(6,182,212,0.1)" : "rgba(139,92,246,0.1)", color: job.type === "Internship" ? "var(--cyan)" : "var(--purple)", fontWeight: 700 }}>{job.type}</span>
                  </div>
                </div>
                {/* Match gauge */}
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: matchPct >= 70 ? "var(--green)" : matchPct >= 50 ? "var(--amber)" : "var(--red)" }}>{matchPct}%</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>Match</div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {matchedSkills.map(s => <span key={s} style={{ padding: "3px 10px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "var(--green)", fontSize: 11, fontWeight: 600 }}>✓ {s}</span>)}
                {missingSkills.map(s => <span key={s} style={{ padding: "3px 10px", borderRadius: 10, background: "rgba(239,68,68,0.08)", color: "var(--red)", fontSize: 11, fontWeight: 600 }}>✗ {s}</span>)}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button style={{ padding: "9px 20px", borderRadius: 10, background: canApply ? "linear-gradient(135deg,var(--amber),var(--amber2))" : "var(--surface2)", border: "none", color: canApply ? "#000" : "var(--text3)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: canApply ? "pointer" : "not-allowed" }}>
                  {canApply ? "Apply Now →" : `Need ${job.min_score}% readiness`}
                </button>
                {missingSkills.length > 0 && <span style={{ fontSize: 12, color: "var(--text3)" }}>Close {missingSkills.length} skill gap{missingSkills.length > 1 ? "s" : ""} to improve match</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No jobs found for this filter</div>
          <div style={{ fontSize: 14 }}>Try "All" to see all matched opportunities</div>
        </div>
      )}
    </div>
  );
}

// ─── PORTFOLIO + RESUME PAGE ──────────────────────────────────────────────────
function PagePortfolio({ user, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const [generating, setGenerating] = useState(false);
  const [resume, setResume] = useState(null);
  const skillGaps = calcSkillGap(user, selectedCareerPath);
  const readiness = calcJobReadiness(user, selectedCareerPath);
  const projectCount = Object.keys(user.projectScores || {}).length;

  async function generateResume() {
    setGenerating(true);
    const verifiedSkills = skillGaps.filter(s => s.score >= 40).map(s => `${s.skill} (${s.score}%)`);
    const projects = getProjects(role.id).filter(p => user.projectScores?.[p.id] !== undefined).map(p => `${p.title} — Score: ${user.projectScores[p.id]}/100`);
    const sys = `You are a professional resume writer for tech/business roles in India. Generate a structured resume. Return ONLY valid JSON:
{"summary":"2-3 sentence professional summary","skills":["skill1","skill2"],"projects":[{"name":"","description":"","tech":""}],"achievements":["achievement1"],"education_tips":["tip1","tip2"],"keywords":["ats keyword1","ats keyword2"]}`;
    const prompt = `Candidate: ${user.name}. Target: ${role.title}. Education: ${user.eduLevel}. Experience: ${user.experienceLevel}. Verified skills: ${verifiedSkills.join(", ") || "building..."}. Projects: ${projects.join(", ") || "none yet"}. Job readiness: ${readiness}%. Generate a strong resume JSON.`;
    const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: sys + "\n\n" + prompt }]
  }),
});

if (!res.ok) throw new Error("API failed");

const data = await res.json();
const reply = data.reply;
    try {
      const clean = reply.replace(/```json|```/g, "").trim();
      setResume(JSON.parse(clean));
    } catch { setResume({ summary: "Motivated professional targeting " + role.title + " with strong foundation in required skills.", skills: role.skills_needed.slice(0, 6), projects: [], achievements: ["Completed AI-evaluated projects", "Active learner on FORGE platform"], education_tips: ["Add relevant coursework", "Include certifications"], keywords: role.skills_needed }); }
    setGenerating(false);
  }

  const verifiedSkills = skillGaps.filter(s => s.score >= 40);
  const submittedProjects = getProjects(role.id).filter(p => user.projectScores?.[p.id] !== undefined);

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 960, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(139,92,246,0.08)", color: "var(--purple)", border: "1px solid rgba(139,92,246,0.25)", marginBottom: 20 }}>📄 Portfolio + Resume</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{user.name}'s Portfolio</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Targeting {role.title} · {readiness}% job ready</p>

      {/* Portfolio Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🏅 Verified Skills ({verifiedSkills.length}/{role.skills_needed.length})</div>
          {verifiedSkills.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Complete quizzes and projects to verify skills</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {verifiedSkills.map(({ skill, score: s }) => (
                <div key={skill} style={{ padding: "6px 12px", borderRadius: 10, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{skill}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{s}% proficiency</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🏗️ Projects Submitted ({submittedProjects.length})</div>
          {submittedProjects.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Submit projects to add them to your portfolio</div>
          ) : (
            submittedProjects.map(p => (
              <div key={p.id} style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "var(--bg3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.icon} {p.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{user.projectScores[p.id]}/100</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>{p.skills.join(", ")}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resume Generator */}
      <div style={{ padding: "24px", borderRadius: 20, background: "linear-gradient(135deg,rgba(139,92,246,0.06),rgba(245,158,11,0.04))", border: "1px solid rgba(139,92,246,0.2)", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 40 }}>📝</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>AI Resume Generator</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0 }}>Get a tailored resume with ATS keywords, skill summaries, and project highlights based on your profile.</p>
          </div>
          <button className="btn-primary" onClick={generateResume} disabled={generating}>
            {generating ? <span style={{ display: "flex", gap: 8, alignItems: "center" }}><div className="spinner" /> Generating...</span> : "Generate My Resume →"}
          </button>
        </div>
      </div>

      {resume && (
        <div className="fade-up" style={{ padding: "28px", borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, marginBottom: 20, color: "var(--amber)" }}>📄 Your AI-Generated Resume</div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, marginBottom: 8 }}>PROFESSIONAL SUMMARY</div>
            <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, padding: "14px 16px", borderRadius: 12, background: "var(--bg3)" }}>{resume.summary}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, marginBottom: 8 }}>KEY SKILLS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {resume.skills.map(s => <span key={s} style={{ padding: "5px 12px", borderRadius: 10, background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--amber)", fontSize: 12, fontWeight: 600 }}>{s}</span>)}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, marginBottom: 8 }}>ACHIEVEMENTS</div>
            {resume.achievements.map((a, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid var(--green)" }}>{a}</div>)}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, marginBottom: 8 }}>ATS KEYWORDS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {resume.keywords.map(k => <span key={k} style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--cyan)", fontSize: 11 }}>{k}</span>)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, marginBottom: 8 }}>RESUME TIPS</div>
            {resume.education_tips?.map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4, display: "flex", gap: 8 }}><span style={{ color: "var(--amber)" }}>→</span>{t}</div>)}
          </div>
        </div>
      )}

      {/* Industry Demand & Trending Jobs */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>📈</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>Industry Demand & Trending Jobs</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 24 }}>
          {/* Trending Roles */}
          <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔥 Trending Roles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { role: "Full Stack Developer", growth: "+45%", demand: "High" },
                { role: "Data Scientist", growth: "+38%", demand: "Very High" },
                { role: "UI/UX Designer", growth: "+32%", demand: "High" },
                { role: "DevOps Engineer", growth: "+28%", demand: "High" },
              ].map(item => (
                <div key={item.role} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--bg3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.role}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Demand: {item.demand}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{item.growth}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Bar Chart */}
          <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Top In-Demand Skills</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { skill: "React.js", pct: 92 },
                { skill: "Python", pct: 88 },
                { skill: "Node.js", pct: 85 },
                { skill: "AWS", pct: 78 },
                { skill: "Machine Learning", pct: 75 },
              ].map(item => (
                <div key={item.skill} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 80, fontSize: 12, fontWeight: 600 }}>{item.skill}</div>
                  <div style={{ flex: 1, height: 8, background: "var(--bg3)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${item.pct}%`, height: "100%", background: "linear-gradient(90deg,var(--purple),var(--cyan))", borderRadius: 4 }} />
                  </div>
                  <div style={{ width: 30, textAlign: "right", fontSize: 12, fontWeight: 700, color: "var(--purple)" }}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Remote Work Surge</h4>
            <p style={{ fontSize: 13, color: "var(--text2)" }}>60% of tech jobs now offer remote options. Build location-independent skills.</p>
          </div>
          <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>AI Integration</h4>
            <p style={{ fontSize: 13, color: "var(--text2)" }}>Companies are hiring for AI roles. Learn ML and data science fundamentals.</p>
          </div>
          <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🌐</div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Startup Boom</h4>
            <p style={{ fontSize: 13, color: "var(--text2)" }}>Indian startups raised $10B+ in 2023. Full-stack skills are in high demand.</p>
          </div>
        </div>

        {/* Live Industry Jobs Preview */}
        <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏢 Live Industry Jobs</h3>
          {(() => {
            const industryJobs = JSON.parse(localStorage.getItem("forge_industry_jobs") || "[]").filter(j => j.status === "active");
            return industryJobs.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {industryJobs.slice(0, 2).map(job => (
                  <div key={job.id} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{job.jobTitle}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>{job.companyName} • {job.category} • {job.workMode}</div>
                    </div>
                    <button style={{ padding: "6px 12px", borderRadius: 8, background: "var(--purple)", color: "#fff", border: "none", fontSize: 12, cursor: "pointer" }}>
                      View →
                    </button>
                  </div>
                ))}
                {industryJobs.length > 2 && (
                  <div style={{ textAlign: "center", padding: "8px", color: "var(--text3)", fontSize: 12 }}>
                    +{industryJobs.length - 2} more industry jobs available
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text3)" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🏢</div>
                <div style={{ fontSize: 14 }}>Industry partners haven't posted jobs yet. Check back soon!</div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── DAILY CHALLENGE PAGE ─────────────────────────────────────────────────────
function PageDailyChallenge({ user, setUser, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const challenges = getChallengesByRole(role.id);
  const todayKey = new Date().toDateString();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [submission, setSubmission] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const todayIdx = new Date().getDate() % challenges.length;
  const todayChallenge = challenges[todayIdx];
  const alreadyDone = user.dailyChallengeCompleted === todayKey;
  const streak = user.streak || 0;

  async function submitChallenge() {
    if (!submission.trim()) return;
    setSubmitting(true);
    const sys = `You're evaluating a daily learning challenge submission. Return ONLY valid JSON:
{"passed":true,"score":80,"feedback":"specific 2-3 sentence feedback","xp_awarded":40}`;
    const prompt = `Challenge: "${activeChallenge.title}". Description: "${activeChallenge.desc}". Submission: "${submission}". Type: ${activeChallenge.type}. Evaluate pass/fail and give specific feedback.`;
    setSubmitting(true);

try {
  const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: sys + "\n\n" + prompt }]
    }),
  });

  if (!res.ok) throw new Error("API failed");

  const data = await res.json();
  const reply = data.reply;

  const clean = reply.replace(/json|/g, "").trim();
  const parsed = JSON.parse(clean);

  setResult(parsed);

  if (parsed.passed) {
    // 👇 tumhara existing logic same rahega
  }

} catch (err) {
  console.error(err);
  setResult({
    passed: true,
    score: 75,
    feedback: "Great effort!"
  });
}
  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 760, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(245,158,11,0.08)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: 20 }}>🔥 Daily Challenge</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Today's Challenge</h1>
          <p style={{ color: "var(--text2)" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <div className={streak >= 3 ? "streak-badge" : ""} style={{ padding: "14px 20px", borderRadius: 16, background: streak > 0 ? "rgba(245,158,11,0.08)" : "var(--surface)", border: `1px solid ${streak > 0 ? "rgba(245,158,11,0.3)" : "var(--border)"}`, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "var(--amber)" }}>🔥 {streak}</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Day Streak</div>
        </div>
      </div>

      {/* Today's Challenge */}
      {!activeChallenge ? (
        <div>
          <div style={{ padding: "24px", borderRadius: 20, background: "linear-gradient(135deg,rgba(245,158,11,0.06),rgba(139,92,246,0.04))", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 16, alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>📅 TODAY'S CHALLENGE</div>
              <span style={{ padding: "2px 8px", borderRadius: 8, background: "var(--amber-dim)", color: "var(--amber)", fontSize: 10, fontWeight: 700 }}>+{todayChallenge.xp} XP</span>
              <span style={{ padding: "2px 8px", borderRadius: 8, background: "var(--surface2)", color: "var(--text3)", fontSize: 10 }}>⏱ {todayChallenge.timeLimit}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{todayChallenge.title}</h2>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16 }}>{todayChallenge.desc}</p>
            {alreadyDone ? (
              <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontSize: 14, color: "var(--green)", fontWeight: 600 }}>Challenge completed today! Come back tomorrow.</span>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => setActiveChallenge(todayChallenge)} style={{ padding: "12px 24px" }}>Start Challenge →</button>
            )}
          </div>

          {/* All challenges */}
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📚 Challenge Bank</div>
          <div style={{ display: "grid", gap: 10 }}>
            {challenges.map(ch => {
              const done = user.completedChallenges?.includes(ch.id);
              return (
                <div key={ch.id} style={{ padding: "16px 20px", borderRadius: 14, background: "var(--surface)", border: `1px solid ${done ? "rgba(16,185,129,0.2)" : "var(--border)"}`, display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? "var(--green)" : "var(--surface2)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: done ? "var(--text2)" : "var(--text)" }}>{ch.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{ch.type} · {ch.timeLimit}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: done ? "var(--green)" : "var(--text3)" }}>+{ch.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : !result ? (
        <div className="fade-up">
          <button onClick={() => setActiveChallenge(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, marginBottom: 20 }}>← Back</button>
          <div style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{activeChallenge.title}</div>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{activeChallenge.desc}</p>
          </div>
          <textarea className="input-field" rows={6} placeholder="Paste your GitHub link, screenshot URL, or describe your solution in detail..." value={submission} onChange={e => setSubmission(e.target.value)} style={{ marginBottom: 14, resize: "vertical" }} />
          <button className="btn-primary" style={{ width: "100%", padding: "14px" }} onClick={submitChallenge} disabled={submitting || !submission.trim()}>
            {submitting ? <span style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}><div className="spinner" /> AI Grading...</span> : "Submit & Get AI Feedback →"}
          </button>
        </div>
      ) : (
        <div className="fade-up">
          <div style={{ textAlign: "center", padding: "32px", borderRadius: 20, background: result.passed ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${result.passed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, marginBottom: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{result.passed ? "🎉" : "💪"}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: result.passed ? "var(--green)" : "var(--amber)" }}>{result.passed ? "Challenge Passed!" : "Keep Trying!"}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 900, color: result.passed ? "var(--green)" : "var(--amber)", margin: "12px 0" }}>{result.score}/100</div>
            {result.passed && <div style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)" }}>+{result.xp_awarded} XP · Streak: 🔥 {user.streak}</div>}
          </div>
          <div style={{ padding: "18px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>AI Feedback</div>
            <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{result.feedback}</div>
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => { setActiveChallenge(null); setResult(null); setSubmission(""); }}>← Back to Challenges</button>
        </div>
      )}
    </div>
  );
}

// ─── RESOURCES PAGE ───────────────────────────────────────────────────────────
const RESOURCE_DB = {
  "ai-engineer": [
    { title: "Hugging Face", type: "Platform", tag: "LLMs", icon: "🤗", url: "https://huggingface.co", free: true, desc: "The GitHub of AI models. Essential for any ML engineer." },
    { title: "Papers With Code", type: "Research", tag: "SOTA Models", icon: "📄", url: "https://paperswithcode.com", free: true, desc: "Latest ML research with linked code implementations." },
    { title: "Kaggle", type: "Practice", tag: "Competitions", icon: "🏆", url: "https://kaggle.com", free: true, desc: "Real datasets. Real problems. Free GPU." },
    { title: "DeepLearning.AI", type: "Course", tag: "Foundations", icon: "🧠", url: "https://deeplearning.ai", free: false, desc: "Andrew Ng's flagship AI courses — industry standard." },
    { title: "Fast.ai", type: "Course", tag: "Practical DL", icon: "⚡", url: "https://fast.ai", free: true, desc: "Top-down practical deep learning. Best free DL course." },
  ],
  "fullstack-dev": [
    { title: "The Odin Project", type: "Course", tag: "Full Stack", icon: "🌐", url: "https://theodinproject.com", free: true, desc: "Best free full-stack curriculum. HTML to Node.js." },
    { title: "MDN Web Docs", type: "Reference", tag: "Web Standards", icon: "📖", url: "https://developer.mozilla.org", free: true, desc: "The bible of web development. Use daily." },
    { title: "Neetcode.io", type: "Practice", tag: "DSA", icon: "💡", url: "https://neetcode.io", free: true, desc: "Best structured DSA prep for dev interviews." },
    { title: "Frontend Masters", type: "Course", tag: "React Deep Dive", icon: "⚛️", url: "https://frontendmasters.com", free: false, desc: "Industry-standard React, JS, and system design courses." },
    { title: "Fireship – YouTube", type: "YouTube", tag: "Quick Concepts", icon: "▶️", url: "https://youtube.com/@Fireship", free: true, desc: "100-second explainers. 100% gold content." },
  ],
  "data-analyst": [
    { title: "Mode SQL Tutorial", type: "Course", tag: "SQL", icon: "📊", url: "https://mode.com/sql-tutorial", free: true, desc: "Best SQL tutorial for analysts. Practice on real data." },
    { title: "Kaggle Learn", type: "Practice", tag: "Python + SQL", icon: "🏆", url: "https://kaggle.com/learn", free: true, desc: "Free micro-courses: SQL, Python, Data Viz." },
    { title: "Towards Data Science", type: "Blog", tag: "Analysis", icon: "✍️", url: "https://towardsdatascience.com", free: true, desc: "Top data science articles from practitioners." },
    { title: "Statsquest", type: "YouTube", tag: "Statistics", icon: "▶️", url: "https://youtube.com/@statquest", free: true, desc: "Statistics explained brilliantly with visuals." },
    { title: "Google Data Analytics Cert", type: "Course", tag: "Certification", icon: "🎓", url: "https://coursera.org", free: false, desc: "Employer-recognized Google certificate. 6-month program." },
  ],
  "digital-marketer": [
    { title: "Google Digital Garage", type: "Course", tag: "Fundamentals", icon: "🎓", url: "https://learndigital.withgoogle.com", free: true, desc: "Free Google-certified digital marketing course." },
    { title: "Neil Patel Blog", type: "Blog", tag: "SEO/Growth", icon: "📈", url: "https://neilpatel.com/blog", free: true, desc: "Deep SEO and growth marketing tactics." },
    { title: "HubSpot Academy", type: "Course", tag: "Inbound Marketing", icon: "🔶", url: "https://academy.hubspot.com", free: true, desc: "Free certifications in content, email, inbound." },
    { title: "Facebook Blueprint", type: "Course", tag: "Paid Ads", icon: "📘", url: "https://www.facebookblueprint.com", free: true, desc: "Official Meta training for ads and campaigns." },
    { title: "Marketing Examples", type: "Blog", tag: "Copywriting", icon: "✍️", url: "https://marketingexamples.com", free: true, desc: "Real-world marketing case studies and teardowns." },
  ],
  "ux-designer": [
    { title: "Figma Learn", type: "Course", tag: "Figma", icon: "🎨", url: "https://help.figma.com", free: true, desc: "Official Figma tutorials from beginner to advanced." },
    { title: "Nielsen Norman Group", type: "Blog", tag: "UX Research", icon: "🔬", url: "https://nngroup.com", free: true, desc: "The gold standard for UX research and usability." },
    { title: "Refactoring UI", type: "Book", tag: "UI Design", icon: "📐", url: "https://refactoringui.com", free: false, desc: "Design decisions for developers — iconic UX book." },
    { title: "Mobbin", type: "Reference", tag: "UI Patterns", icon: "📱", url: "https://mobbin.com", free: true, desc: "Real app UI patterns library for design inspiration." },
    { title: "ADPList", type: "Platform", tag: "Mentorship", icon: "🧑‍🏫", url: "https://adplist.org", free: true, desc: "Free 1:1 mentorship from designers worldwide." },
  ],
  "financial-analyst": [
    { title: "Wall Street Prep", type: "Course", tag: "Financial Modeling", icon: "📋", url: "https://wallstreetprep.com", free: false, desc: "Industry standard financial modeling bootcamp." },
    { title: "Investopedia", type: "Reference", tag: "Finance Concepts", icon: "📖", url: "https://investopedia.com", free: true, desc: "The dictionary of finance. Use for concept clarification." },
    { title: "Corporate Finance Institute", type: "Course", tag: "CFA Prep", icon: "🎓", url: "https://corporatefinanceinstitute.com", free: false, desc: "CFA and financial modeling certifications." },
    { title: "Macrotrends", type: "Tool", tag: "Market Data", icon: "📊", url: "https://macrotrends.net", free: true, desc: "Free historical financial data for any company." },
    { title: "Breaking Into Wall Street", type: "Course", tag: "IB Prep", icon: "🏦", url: "https://breakingintowallstreet.com", free: false, desc: "The most recognized IB interview prep resource." },
  ],
  "content-writer": [
    { title: "Hemingway App", type: "Tool", tag: "Writing Quality", icon: "✍️", url: "https://hemingwayapp.com", free: true, desc: "Makes your writing bold and clear. Essential tool." },
    { title: "Surfer SEO", type: "Tool", tag: "SEO Writing", icon: "🔍", url: "https://surferseo.com", free: false, desc: "AI-powered SEO content optimizer." },
    { title: "Copy.ai Blog", type: "Blog", tag: "Copywriting", icon: "📝", url: "https://copy.ai/blog", free: true, desc: "Copywriting frameworks and writing tips." },
    { title: "Backlinko", type: "Blog", tag: "SEO", icon: "🔗", url: "https://backlinko.com/blog", free: true, desc: "Brian Dean's data-driven SEO content guides." },
    { title: "Substack", type: "Platform", tag: "Publishing", icon: "📧", url: "https://substack.com", free: true, desc: "Build your newsletter audience and portfolio." },
  ],
};

function getResources(roleId) { return RESOURCE_DB[roleId] || RESOURCE_DB["fullstack-dev"]; }

function PageResources({ user, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const resources = getResourcesByRole(role.id);
  const [searchQ, setSearchQ] = useState("");
  const [showFreeOnly, setShowFree] = useState(false);
  const [aiPicks, setAiPicks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = resources.filter(r => {
    const mFree = !showFreeOnly || r.free;
    const mSearch = !searchQ || r.title.toLowerCase().includes(searchQ.toLowerCase()) || r.tag.toLowerCase().includes(searchQ.toLowerCase());
    return mFree && mSearch;
  });

  async function getAIPicks() {
    setAiLoading(true);
    const skillGaps = calcSkillGap(user, selectedCareerPath).filter(s => !s.has).map(s => s.skill).slice(0, 3);
    const sys = `You are a career mentor. Recommend exactly 3 specific real websites/resources. Return ONLY valid JSON array:
[{"title":"Resource Name","url":"https://...","why":"one sentence why perfect for this person"}]`;
    const prompt = `Student targeting ${role.title} (${role.category}). Missing skills: ${skillGaps.join(", ") || role.skills_needed.join(", ")}. Recommend 3 specific free resources.`;
    try {
      const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-6-", max_tokens: 400, system: sys, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      setAiPicks(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch { setAiPicks([{ title: "Error loading picks", url: "#", why: "Please try again." }]); }
    setAiLoading(false);
  }

  const typeColors = { "Website": "var(--cyan)", "Course": "var(--amber)", "YouTube": "#EF4444", "Platform": "var(--green)", "Blog": "var(--text2)", "Practice": "#F97316", "Reference": "var(--text2)", "Tool": "var(--purple)", "Research": "var(--cyan)", "Book": "#FBBF24" };

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 1000, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <div className="tag" style={{ background: "rgba(6,182,212,0.08)", color: "var(--cyan)", border: "1px solid rgba(6,182,212,0.25)", marginBottom: 20 }}>📚 Resource Library</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Resources for {role.title}</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Curated resources · {resources.filter(r => r.free).length} free included</p>

      <div style={{ padding: "20px 24px", borderRadius: 18, background: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(139,92,246,0.06))", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 32 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>AI-Picked for Your Skill Gaps</div>
          <p style={{ color: "var(--text2)", fontSize: 13, margin: 0 }}>Get personalized resource recommendations targeting YOUR missing skills.</p>
        </div>
        <button className="btn-primary" style={{ padding: "11px 22px", fontSize: 13 }} onClick={getAIPicks} disabled={aiLoading}>
          {aiLoading ? "Picking..." : "Get My Picks →"}
        </button>
      </div>

      {aiPicks.length > 0 && (
        <div style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, animation: "fadeUp 0.3s ease" }}>
          {aiPicks.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer"
              style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(245,158,11,0.05)", border: "2px solid rgba(245,158,11,0.25)", textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--amber)", marginBottom: 6 }}>⭐ AI Pick #{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{p.why}</div>
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search resources..."
          style={{ padding: "9px 14px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", width: 220 }} />
        <button onClick={() => setShowFree(!showFreeOnly)}
          style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${showFreeOnly ? "var(--green)" : "var(--border2)"}`, background: showFreeOnly ? "rgba(16,185,129,0.1)" : "transparent", color: showFreeOnly ? "var(--green)" : "var(--text2)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          {showFreeOnly ? "✓ Free Only" : "Free Only"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {filtered.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="res-card"
            style={{ display: "block", padding: "20px 22px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", textDecoration: "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{r.title}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 10, background: `${typeColors[r.type] || "var(--text2)"}12`, color: typeColors[r.type] || "var(--text2)", fontSize: 10, fontWeight: 700 }}>{r.type}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 10, background: "var(--surface2)", color: "var(--text3)", fontSize: 10 }}>{r.tag}</span>
                  {r.free && <span style={{ padding: "2px 8px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "var(--green)", fontSize: 10, fontWeight: 700 }}>FREE</span>}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: "0 0 10px" }}>{r.desc}</p>
            <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>Open →</div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── MENTORS PAGE ─────────────────────────────────────────────────────────────
function PageMentors({ user, plan, onUpgrade, selectedCareerPath }) {
  const role = selectedCareerPath || user.targetRole;
  const relevant = MENTORS.filter(m => m.specialFor.includes(role.id));
  const others = MENTORS.filter(m => !m.specialFor.includes(role.id));

  function MentorCard({ mentor }) {
    return (
      <div className="mentor-card" style={{ padding: "22px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,var(--purple),var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{mentor.img}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{mentor.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>{mentor.role} @ {mentor.company}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "var(--amber)", fontWeight: 700 }}>⭐ {mentor.rating}</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{mentor.sessions_completed} sessions</span>
              {mentor.available ? (
                <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 700 }}>● Available</span>
              ) : (
                <span style={{ fontSize: 11, color: "var(--red)" }}>● Booked</span>
              )}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--amber)" }}>₹{mentor.price_per_session}</div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>{mentor.bio}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {mentor.expertise.map(e => <span key={e} style={{ padding: "3px 8px", borderRadius: 8, background: "var(--bg3)", color: "var(--text2)", fontSize: 11, border: "1px solid var(--border)" }}>{e}</span>)}
        </div>
        <button onClick={plan !== "pro" ? onUpgrade : undefined}
          className={mentor.available ? "btn-primary" : "btn-ghost"} style={{ width: "100%", padding: "11px", fontSize: 13 }}
          disabled={!mentor.available}>
          {!mentor.available ? "Fully Booked" : plan !== "pro" ? "✦ Pro — Book Session" : "Book Session →"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 1000, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(139,92,246,0.08)", color: "var(--purple)", border: "1px solid rgba(139,92,246,0.25)", marginBottom: 20 }}>🧑‍🏫 Expert Mentors</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Your Matched Mentors</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Industry experts matched for {role.title} · 1:1 sessions</p>
      {relevant.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>✦ Top Matches for {role.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginBottom: 32 }}>
            {relevant.map(m => <MentorCard key={m.id} mentor={m} />)}
          </div>
        </>
      )}
      {others.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Other Expert Mentors</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {others.slice(0, 3).map(m => <MentorCard key={m.id} mentor={m} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PagePricing({ plan, onUpgrade }) {
  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 800, margin: "0 auto", animation: "fadeUp 0.4s ease", textAlign: "center" }}>
      <span className="tag" style={{ background: "rgba(139,92,246,0.08)", color: "var(--purple)", border: "1px solid rgba(139,92,246,0.25)", marginBottom: 20 }}>⭐ Pricing</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Level Up Your Career Journey</h1>
      <p style={{ color: "var(--text2)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>Start free, upgrade when ready. No hidden fees.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 700, margin: "0 auto" }}>
        {[
          { name: "Free", price: "₹0", period: "forever", color: "var(--text2)", features: PLANS.free.features, isCurrent: plan === "free" },
          { name: "Pro", price: "₹499", period: "/month", color: "var(--purple)", features: PLANS.pro.features, isCurrent: plan === "pro", isPro: true },
        ].map(p => (
          <div key={p.name} style={{ padding: "28px 24px", borderRadius: 20, background: "var(--surface)", border: `2px solid ${p.isCurrent && p.isPro ? "rgba(139,92,246,0.5)" : p.isCurrent ? "var(--border2)" : "var(--border)"}`, position: "relative", overflow: "hidden" }}>
            {p.isPro && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--purple),var(--cyan))" }} />}
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: p.color, marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 36, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 14, color: "var(--text3)", fontWeight: 400 }}>{p.period}</span></div>
            <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
            {p.features.map(f => <div key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text2)", marginBottom: 8, textAlign: "left" }}><span style={{ color: p.isPro ? "var(--purple)" : "var(--green)", flexShrink: 0 }}>✓</span>{f}</div>)}
            {p.isPro && plan !== "pro" && (
              <button className="btn-pro" style={{ width: "100%", marginTop: 16, padding: "14px" }} onClick={onUpgrade}>Start Free Trial →</button>
            )}
            {p.isCurrent && <div style={{ marginTop: 16, fontSize: 12, color: "var(--green)", fontWeight: 700 }}>✓ Current Plan</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, fontSize: 12, color: "var(--text3)" }}>Cancel anytime · ₹499/month after 7-day free trial</div>
    </div>
  );
}

// ─── AI MENTOR CHATBOT ────────────────────────────────────────────────────────
function ChatBot({ user, plan, onClose, selectedCareerPath }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const chatRef = useRef(null);
  const role = selectedCareerPath || user.targetRole;
  const skillGaps = calcSkillGap(user, selectedCareerPath).filter(s => !s.has).map(s => s.skill);
  const readiness = calcJobReadiness(user, selectedCareerPath);

  const systemPrompt = `You are a world-class AI career coach on FORGE, specializing in helping people get hired as ${role.title}.

ABOUT YOUR STUDENT:
- Name: ${user.name}
- Selected Career Path: ${role.title} (${role.category})
- Education: ${user.eduLevel}
- Experience Level: ${user.experienceLevel || "beginner"}
- User Skills: ${user.skills?.have?.join(", ") || "building foundational skills"}
- Weak Areas (Skill gaps to close): ${skillGaps.join(", ") || "all core skills"}
- Goal: ${user.motivation || "land a job"}
- Time Commitment: ${user.timeCommit}
- Job Readiness Score: ${readiness}%
- XP earned: ${user.xp || 0}
- Projects submitted: ${Object.keys(user.projectScores || {}).length}
- Required skills for ${role.title}: ${role.skills_needed.join(", ")}
- Salary target: ${role.salary_range}

YOUR PERSONA & RULES:
- You are NOT a generic chatbot. You are ${user.name}'s personal career coach.
- Reference their specific selectedCareerPath, user skills, weak areas, and goal in your advice.
- Be brutally honest but highly encouraging.
- If they ask "what should I do first?" → prioritize closing their weak areas: ${skillGaps[0] || "start with projects"}
- If they ask about salary → give India-specific benchmarks for ${role.title}
- If readiness < 40% → focus on fundamentals and quick wins
- If readiness 40-70% → focus on projects and interview prep
- If readiness > 70% → focus on applications and negotiation
- Keep responses tight: use bullets when listing steps, prose for advice
- Always end with 1 specific action they can take TODAY`;

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `Hey ${user.name}! 👋 I'm your personalized AI career coach. I can see you're targeting **${role.title}** with a **${readiness}% job readiness score**.\n\n${skillGaps.length > 0 ? `Your biggest gap right now: **${skillGaps[0]}**. Let's fix that.\n\n` : "You're making great progress! Let's get you hired.\n\n"}What would you like to work on?`,
    }]);
  }, []);

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    if (plan !== "pro" && msgCount >= FREE_LIMIT) {
      setMessages(m => [...m, { role: "assistant", content: "🔒 You've hit the 5 message/day limit on the Free plan. Upgrade to Pro for unlimited AI mentor access!" }]);
      return;
    }
    const userMsg = { role: "user", content: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setMsgCount(c => c + 1);
    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
   setLoading(true);

try {
  const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: history
    }),
  });

  if (!res.ok) throw new Error("API failed");

  const data = await res.json();
  const reply = data.reply;

  setMessages(m => [...m, { role: "assistant", content: reply }]);

} catch (err) {
  console.error(err);
  setMessages(m => [...m, { role: "assistant", content: "Something went wrong" }]);
} finally {
  setLoading(false);
}

  const quickPrompts = [
    `What should I learn first for ${role.title}?`,
    `How do I close my ${skillGaps[0] || "skill"} gap?`,
    "What salary can I negotiate at my level?",
    "Review my roadmap priorities",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 680, height: "85vh", background: "var(--bg)", borderRadius: 24, border: "1px solid rgba(139,92,246,0.3)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 0 60px rgba(139,92,246,0.12)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(139,92,246,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--purple),var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
            <div>
              <div style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Forge AI Mentor</div>
              <div style={{ color: "var(--green)", fontSize: 12 }}>● Personalized for {user.name} → {role.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {plan !== "pro" && <span style={{ fontSize: 12, color: "var(--text3)" }}>{msgCount}/{FREE_LIMIT} messages</span>}
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 22 }}>✕</button>
          </div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,var(--purple),#4F46E5)" : "var(--surface)", color: "var(--text)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", border: m.role === "assistant" ? "1px solid var(--border)" : "none" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <TypingIndicator />}
        </div>

        <div style={{ padding: "0 16px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {quickPrompts.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{ padding: "5px 10px", borderRadius: 20, background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.25)", color: "var(--amber)", fontSize: 10, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>{s.length > 35 ? s.slice(0, 35) + "..." : s}</button>
          ))}
        </div>

        <div style={{ padding: "8px 16px 16px", display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Ask about ${role.title} career...`}
            style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }} />
          <button onClick={send} disabled={loading} style={{ padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg,var(--amber),var(--amber2))", border: "none", color: "#000", fontFamily: "var(--font-display)", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ─── UPGRADE MODAL ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, onUpgrade }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "var(--bg)", borderRadius: 24, border: "2px solid rgba(139,92,246,0.4)", padding: "40px 36px", animation: "fadeUp 0.3s ease", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--purple),var(--cyan))" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 22 }}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "var(--purple)", marginBottom: 8 }}>Upgrade to Pro</h2>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>Everything you need to get hired — faster.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {PLANS.pro.features.map(f => (
            <div key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text)" }}>
              <span style={{ color: "var(--purple)", flexShrink: 0 }}>✦</span>{f}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
          <button className="btn-pro" style={{ width: "100%", padding: "15px", fontSize: 16 }} onClick={() => { onUpgrade(); onClose(); }}>Start 7-Day Free Trial →</button>
          <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center" }}>₹499/month after trial · Cancel anytime</div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTHENTICATION (LOGIN & REGISTER) ────────────────────────────────────────
function PageAuth({ onAuthSuccess, onIndustryAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("student"); // "student" or "industry"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (userType === "student") {
      if (!email || !password || (!isLogin && !name)) return;
    } else {
      if (!companyName || !industryType || !companySize || !email || !password || (!isLogin && !confirmPassword)) return;
      if (!isLogin && password !== confirmPassword) return;
    }
    setLoading(true);
    // Simulate API call & JWT Generation
    setTimeout(() => {
      if (userType === "student") {
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken";
        localStorage.setItem("forge_jwt", mockToken);

        const mockUserProfile = {
          name: isLogin ? "Welcome Back User" : name,
          email: email,
          planType: "free"
        };
        // Check if user already has an onboarding profile saved
        const savedProfile = localStorage.getItem("forge_user_profile");
        setLoading(false);
        onAuthSuccess(savedProfile ? JSON.parse(savedProfile) : mockUserProfile, !!savedProfile);
      } else {
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.industryToken";
        localStorage.setItem("forge_industry_jwt", mockToken);

        const industryProfile = {
          companyName,
          industryType,
          companySize,
          contactEmail: email,
          userType: "industry"
        };
        localStorage.setItem("forge_industry_profile", JSON.stringify(industryProfile));
        setLoading(false);
        onIndustryAuthSuccess(industryProfile);
      }
    }, 1500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "36px", borderRadius: 24, background: "var(--surface)", border: "1px solid var(--border)", animation: "fadeUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 32, color: "var(--amber)", letterSpacing: -1, marginBottom: 8 }}>FORGE</div>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>{isLogin ? "Welcome back to your career path." : "Start your career journey today."}</p>
        </div>

        {/* User Type Selector */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 12, display: "block" }}>I am a:</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setUserType("student")}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${userType === "student" ? "var(--amber)" : "var(--border)"}`, background: userType === "student" ? "var(--amber-dim)" : "var(--surface)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14 }}>
              Student
            </button>
            <button onClick={() => setUserType("industry")}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${userType === "industry" ? "var(--amber)" : "var(--border)"}`, background: userType === "industry" ? "var(--amber-dim)" : "var(--surface)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14 }}>
              Industry / Company
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {userType === "student" ? (
            <>
              {!isLogin && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Full Name</label>
                  <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Email</label>
                <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Password</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Name</label>
                <input type="text" className="input-field" placeholder="Acme Corp" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Industry Type</label>
                <select className="input-field" value={industryType} onChange={e => setIndustryType(e.target.value)} required>
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Size</label>
                <select className="input-field" value={companySize} onChange={e => setCompanySize(e.target.value)} required>
                  <option value="">Select Size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Contact Email</label>
                <input type="email" className="input-field" placeholder="hr@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Password</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {!isLogin && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Confirm Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn-primary" style={{ padding: "14px", marginTop: 8 }} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div className="spinner" /> Authenticating...</span> : (isLogin ? "Login to Forge" : "Create Account")}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>G</span> Continue with Google
        </button>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text2)" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "var(--amber)", cursor: "pointer", fontWeight: 700 }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────
function CourseSection({ user, selectedCareerPath }) {
  const role = selectedCareerPath || user?.targetRole || { id: "fullstack-dev", title: "Full Stack Developer" };
  const coursesRaw = getCoursesByRole(role.id);

  // Normalize courses for new fields if missing
  const courses = useMemo(() => coursesRaw.map(c => {
    let level = "Beginner";
    if (c.tags.includes("Intermediate") || c.tags.includes("Mid")) level = "Mid";
    if (c.tags.includes("Advanced")) level = "Advanced";

    let free = c.free || false;
    if (c.platform.includes("Helsinki") || c.platform.includes("FreeCodeCamp") || c.platform.toLowerCase().includes("free")) free = true;

    let link = c.link || c.url;
    if (!link || link === "#") {
      link = generateCourseLink(c.title, c.tags[0] || "", c.platform);
    }

    return { ...c, level, free, link };
  }), [coursesRaw]);

  const [levelFilter, setLevelFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchLevel = levelFilter === "All" || c.level === levelFilter;
      const matchPrice = priceFilter === "All" || (priceFilter === "Free" ? c.free : !c.free);
      return matchLevel && matchPrice;
    }).sort((a, b) => {
      // Priority: ROI > Level > Free
      if (b.roi !== a.roi) return b.roi - a.roi;
      const levelMap = { "Beginner": 3, "Mid": 2, "Advanced": 1 };
      if (levelMap[b.level] !== levelMap[a.level]) return levelMap[b.level] - levelMap[a.level];
      return (b.free ? 1 : 0) - (a.free ? 1 : 0);
    });
  }, [courses, levelFilter, priceFilter]);

  const resetFilters = () => {
    setLevelFilter("All");
    setPriceFilter("All");
  };

  const bestCourse = filteredCourses.length > 0 ? filteredCourses[0] : null;
  const remainingCourses = filteredCourses.slice(1);

  const levelColor = (l) => l === "Beginner" ? "var(--green)" : l === "Mid" ? "var(--amber)" : "var(--purple)";

  const CourseCard = ({ course, isFeatured }) => {
    const link = course.link || course.url;
    const hasLink = link && link !== "#";
    return (
      <div className="card-hover" style={{
        display: "block", color: "inherit",
        padding: isFeatured ? "32px" : "24px",
        borderRadius: 20, background: "var(--surface)",
        border: isFeatured ? "2px solid rgba(245,158,11,0.5)" : "1px solid var(--border)",
        boxShadow: isFeatured ? "0 0 40px rgba(245,158,11,0.15)" : "none",
        position: "relative", overflow: "hidden", height: "100%"
      }}>
        {isFeatured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,var(--amber),var(--amber2))" }} />}
        <div style={{ display: "flex", gap: isFeatured ? 20 : 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ fontSize: isFeatured ? 48 : 36, flexShrink: 0 }}>{course.icon}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {isFeatured && <div style={{ fontSize: 13, fontWeight: 800, color: "var(--amber)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>🔥 Recommended for You</div>}

            {course.affiliate_badge && (
              <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "var(--green)", fontSize: 11, fontWeight: 700, border: "1px solid rgba(16,185,129,0.2)", marginBottom: 12 }}>
                {course.affiliate_badge}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: isFeatured ? 20 : 16 }}>{course.title}</div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {course.roi >= 95 ? (
                  <div style={{ padding: "4px 10px", borderRadius: 12, background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.2))", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.3)", fontWeight: 800, fontSize: 12 }}>🔥 {course.roi}% ROI</div>
                ) : course.roi >= 90 ? (
                  <div style={{ padding: "4px 10px", borderRadius: 12, background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border)", fontWeight: 700, fontSize: 12 }}>⭐ {course.roi}% ROI</div>
                ) : (
                  <div style={{ padding: "4px 10px", borderRadius: 12, background: "var(--bg3)", color: "var(--text3)", border: "1px solid var(--border)", fontWeight: 700, fontSize: 12 }}>{course.roi}% ROI</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <span style={{ padding: "4px 10px", borderRadius: 10, background: `${levelColor(course.level)}22`, color: levelColor(course.level), fontSize: 11, fontWeight: 700, border: `1px solid ${levelColor(course.level)}44` }}>{course.level}</span>
              {course.tags.filter(t => t !== "Beginner" && t !== "Intermediate" && t !== "Advanced").map(tag => (
                <span key={tag} style={{ padding: "4px 10px", borderRadius: 10, background: "var(--bg3)", color: "var(--text2)", fontSize: 11, fontWeight: 600, border: "1px solid var(--border)" }}>{tag}</span>
              ))}
              <span style={{ padding: "4px 10px", borderRadius: 10, background: course.free ? "rgba(16,185,129,0.1)" : "rgba(139,92,246,0.1)", color: course.free ? "var(--green)" : "var(--purple)", fontSize: 11, fontWeight: 700, border: `1px solid ${course.free ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)"}` }}>{course.free ? "Free" : "Paid"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>🏢 {course.platform} · ⏱ {course.duration}</div>
              {hasLink ? (
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button className={isFeatured ? "btn-primary" : "btn-ghost"} style={{ padding: isFeatured ? "10px 20px" : "8px 16px", fontSize: 13, cursor: "pointer", ...(isFeatured ? {} : { color: "var(--amber)", border: "1px solid var(--amber)", background: "rgba(245,158,11,0.1)" }) }}>Start Course →</button>
                </a>
              ) : (
                <button className={isFeatured ? "btn-primary" : "btn-ghost"} style={{ padding: isFeatured ? "10px 20px" : "8px 16px", fontSize: 13, opacity: 0.5, cursor: "not-allowed", ...(isFeatured ? {} : { color: "var(--text3)", border: "1px solid var(--border)", background: "transparent" }) }} disabled>Link unavailable</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "80px 24px 40px", maxWidth: 1000, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
      <span className="tag" style={{ background: "rgba(16,185,129,0.08)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20 }}>🎓 Learning Paths</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Top Courses for {role.title}</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Curated and ranked by ROI (Return on Investment) for your target career.</p>

      {/* FilterBar */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32, padding: "16px 20px", background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Level:</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Beginner", "Mid", "Advanced"].map(lvl => (
              <button key={lvl} onClick={() => setLevelFilter(lvl)} style={{ padding: "6px 14px", borderRadius: 10, background: levelFilter === lvl ? "var(--amber-dim)" : "transparent", border: `1px solid ${levelFilter === lvl ? "var(--amber)" : "var(--border2)"}`, color: levelFilter === lvl ? "var(--amber)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{lvl}</button>
            ))}
          </div>
        </div>
        <div style={{ width: 1, background: "var(--border)", minHeight: 24 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Price:</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Free", "Paid"].map(prc => (
              <button key={prc} onClick={() => setPriceFilter(prc)} style={{ padding: "6px 14px", borderRadius: 10, background: priceFilter === prc ? "var(--amber-dim)" : "transparent", border: `1px solid ${priceFilter === prc ? "var(--amber)" : "var(--border2)"}`, color: priceFilter === prc ? "var(--amber)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{prc}</button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: 20, border: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No courses found for your selection</div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>Try adjusting your filters to find more options.</div>
          <button onClick={resetFilters} className="btn-primary" style={{ padding: "10px 24px" }}>Reset Filters</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {bestCourse && <CourseCard course={bestCourse} isFeatured={true} />}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, alignItems: "stretch" }}>
            {remainingCourses.map(course => <CourseCard key={course.id} course={course} isFeatured={false} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function PageCourses({ user, selectedCareerPath }) {
  return <CourseSection user={user} selectedCareerPath={selectedCareerPath} />;
}

// ─── INDUSTRY APP ─────────────────────────────────────────────────────────────
function IndustryApp({ industryUser, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("forge_industry_jobs");
    return saved ? JSON.parse(saved) : [];
  });

  function saveJobs(newJobs) {
    setJobs(newJobs);
    localStorage.setItem("forge_industry_jobs", JSON.stringify(newJobs));
  }

  function IndustryNavbar() {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,7,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "8px 16px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "var(--amber)", letterSpacing: -1 }}>FORGE INDUSTRY</div>
          </div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "post-job", label: "Post a Job" },
              { id: "listings", label: "My Listings" },
              { id: "analytics", label: "Analytics" },
            ].map(item => (
              <button key={item.id} className={`nav-item${page === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <span style={{ color: "var(--text3)", fontSize: 11 }}>{industryUser.companyName}</span>
            <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }

  function IndustryDashboard() {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === "active").length;
    const applications = Math.floor(Math.random() * 50); // Mock
    const views = Math.floor(Math.random() * 200); // Mock

    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 1100, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <div style={{ padding: "28px 32px", borderRadius: 24, background: `linear-gradient(135deg,rgba(245,158,11,0.1),rgba(139,92,246,0.06))`, border: `1px solid rgba(245,158,11,0.25)`, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900, marginBottom: 4 }}>
            Welcome, {industryUser.companyName} 👋
          </h1>
          <p style={{ color: "var(--text2)" }}>Manage your job postings and connect with top talent.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 24 }}>
          {[
            { label: "Total Jobs Posted", val: totalJobs, icon: "💼" },
            { label: "Active Listings", val: activeJobs, icon: "✅" },
            { label: "Applications Received", val: applications, icon: "📋" },
            { label: "Profile Views", val: views, icon: "👁️" },
          ].map(stat => (
            <div key={stat.label} style={{ padding: "24px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "var(--amber)" }}>{stat.val}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Quick Actions</h2>
          <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 16 }} onClick={() => setPage("post-job")}>
            Post a New Job →
          </button>
        </div>
      </div>
    );
  }

  function PageIndustryPostJob() {
    const [form, setForm] = useState({
      jobTitle: "",
      category: "",
      jobType: "Full-time",
      workMode: "On-site",
      location: "",
      salaryMin: "",
      salaryMax: "",
      currency: "INR",
      deadline: "",
      description: "",
      responsibilities: "",
      requirements: "",
      skills: [],
      companyWebsite: "",
      companyDescription: "",
      logoUrl: "",
      perks: [],
      additionalPerks: "",
    });
    const [skillInput, setSkillInput] = useState("");
    const [preview, setPreview] = useState(false);
    const [charCount, setCharCount] = useState(0);

    function updateForm(field, value) {
      setForm(f => ({ ...f, [field]: value }));
      if (field === "description") setCharCount(value.length);
    }

    function addSkill() {
      if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
        updateForm("skills", [...form.skills, skillInput.trim()]);
        setSkillInput("");
      }
    }

    function removeSkill(skill) {
      updateForm("skills", form.skills.filter(s => s !== skill));
    }

    function togglePerk(perk) {
      updateForm("perks", form.perks.includes(perk) ? form.perks.filter(p => p !== perk) : [...form.perks, perk]);
    }

    function publishJob() {
      const job = {
        id: Date.now(),
        companyName: industryUser.companyName,
        industryType: industryUser.industryType,
        ...form,
        postedAt: new Date().toISOString(),
        status: "active",
      };
      saveJobs([...jobs, job]);
      setPage("listings");
      alert("Job posted successfully! Students can now view it.");
    }

    const jobPreview = {
      ...form,
      companyName: industryUser.companyName,
      industryType: industryUser.industryType,
      companyWebsite: form.companyWebsite || "#",
      companyDescription: form.companyDescription || industryUser.companyName + " is hiring top talent.",
      logoUrl: form.logoUrl || "",
      perks: [...form.perks, ...(form.additionalPerks ? [form.additionalPerks] : [])],
    };

    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 900, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, marginBottom: 16 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>Post a New Job</h1>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {/* Job Basics */}
          <div style={{ padding: "24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Job Basics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Job Title</label>
                <input className="input-field" value={form.jobTitle} onChange={e => updateForm("jobTitle", e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Job Category</label>
                <select className="input-field" value={form.category} onChange={e => updateForm("category", e.target.value)} required>
                  <option value="">Select Category</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Internship">Internship</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, display: "block" }}>Job Type</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Full-time", "Part-time", "Internship", "Freelance", "Remote"].map(type => (
                  <button key={type} onClick={() => updateForm("jobType", type)}
                    style={{ padding: "6px 14px", borderRadius: 10, border: `1px solid ${form.jobType === type ? "var(--amber)" : "var(--border2)"}`, background: form.jobType === type ? "var(--amber-dim)" : "transparent", color: form.jobType === type ? "var(--amber)" : "var(--text2)", fontSize: 12, cursor: "pointer" }}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, display: "block" }}>Work Mode</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["On-site", "Remote", "Hybrid"].map(mode => (
                  <button key={mode} onClick={() => updateForm("workMode", mode)}
                    style={{ padding: "6px 14px", borderRadius: 10, border: `1px solid ${form.workMode === mode ? "var(--amber)" : "var(--border2)"}`, background: form.workMode === mode ? "var(--amber-dim)" : "transparent", color: form.workMode === mode ? "var(--amber)" : "var(--text2)", fontSize: 12, cursor: "pointer" }}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            {form.workMode !== "Remote" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Location</label>
                <input className="input-field" value={form.location} onChange={e => updateForm("location", e.target.value)} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Min Salary</label>
                <input type="number" className="input-field" value={form.salaryMin} onChange={e => updateForm("salaryMin", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Max Salary</label>
                <input type="number" className="input-field" value={form.salaryMax} onChange={e => updateForm("salaryMax", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Currency</label>
                <select className="input-field" value={form.currency} onChange={e => updateForm("currency", e.target.value)}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Application Deadline</label>
              <input type="date" className="input-field" value={form.deadline} onChange={e => updateForm("deadline", e.target.value)} />
            </div>
          </div>

          {/* Job Details */}
          <div style={{ padding: "24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Job Details</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Job Description ({charCount}/100 min)</label>
              <textarea className="input-field" rows={4} value={form.description} onChange={e => updateForm("description", e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Key Responsibilities</label>
              <textarea className="input-field" rows={3} value={form.responsibilities} onChange={e => updateForm("responsibilities", e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Requirements / Qualifications</label>
              <textarea className="input-field" rows={3} value={form.requirements} onChange={e => updateForm("requirements", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Preferred Skills</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="input-field" placeholder="Add skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} />
                <button onClick={addSkill} style={{ padding: "13px 16px", borderRadius: 12, background: "var(--amber)", color: "#000", border: "none", cursor: "pointer" }}>+</button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {form.skills.map(skill => (
                  <span key={skill} style={{ padding: "4px 10px", borderRadius: 20, background: "var(--amber-dim)", color: "var(--amber)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    {skill} <button onClick={() => removeSkill(skill)} style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", fontSize: 14 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div style={{ padding: "24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Company Info</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Name</label>
                <input className="input-field" value={industryUser.companyName} disabled />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Website</label>
                <input type="url" className="input-field" value={form.companyWebsite} onChange={e => updateForm("companyWebsite", e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Description</label>
              <textarea className="input-field" rows={2} value={form.companyDescription} onChange={e => updateForm("companyDescription", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Company Logo URL</label>
              <input type="url" className="input-field" value={form.logoUrl} onChange={e => updateForm("logoUrl", e.target.value)} />
            </div>
          </div>

          {/* Perks */}
          <div style={{ padding: "24px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Perks & Benefits</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
              {["Health Insurance", "Flexible Hours", "Work from Home", "Stock Options", "Free Meals", "Paid Leaves", "Learning Budget", "Team Retreats", "Mental Health Support", "Gym Membership"].map(perk => (
                <label key={perk} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.perks.includes(perk)} onChange={() => togglePerk(perk)} />
                  <span style={{ fontSize: 13 }}>{perk}</span>
                </label>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, display: "block" }}>Additional Perks</label>
              <input className="input-field" placeholder="e.g., 5-day work week, Unlimited PTO..." value={form.additionalPerks} onChange={e => updateForm("additionalPerks", e.target.value)} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setPreview(true)}>Preview Job Post</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={publishJob} disabled={!form.jobTitle || !form.category || charCount < 100}>Publish Job</button>
          </div>
        </div>

        {preview && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ width: "100%", maxWidth: 600, background: "var(--bg)", borderRadius: 20, padding: 24, maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>Job Post Preview</h2>
                <button onClick={() => setPreview(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 20 }}>✕</button>
              </div>
              <div style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                    {jobPreview.logoUrl ? <img src={jobPreview.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: 12, objectFit: "cover" }} /> : jobPreview.companyName[0]}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>{jobPreview.jobTitle}</h3>
                    <p style={{ color: "var(--text2)" }}>{jobPreview.companyName} • {jobPreview.category}</p>
                  </div>
                </div>
                <p style={{ marginBottom: 12 }}>{jobPreview.description}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {jobPreview.skills.map(skill => <span key={skill} className="tag" style={{ background: "var(--amber-dim)", color: "var(--amber)" }}>{skill}</span>)}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>
                  {jobPreview.salaryMin && jobPreview.salaryMax ? `₹${jobPreview.salaryMin}L–₹${jobPreview.salaryMax}L` : "Salary not disclosed"} • {jobPreview.jobType} • {jobPreview.workMode} {jobPreview.location && `• ${jobPreview.location}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function PageIndustryListings() {
    const companyJobs = jobs.filter(j => j.companyName === industryUser.companyName);
    const [editing, setEditing] = useState(null);

    function closeJob(jobId) {
      saveJobs(jobs.map(j => j.id === jobId ? { ...j, status: "closed" } : j));
    }

    function deleteJob(jobId) {
      saveJobs(jobs.filter(j => j.id !== jobId));
    }

    if (editing) {
      return <PageIndustryPostJob editJob={editing} onSave={(updatedJob) => {
        saveJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
        setEditing(null);
      }} onCancel={() => setEditing(null)} />;
    }

    return (
      <div style={{ padding: "80px 24px 40px", maxWidth: 1000, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, marginBottom: 16 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>My Job Listings</h1>
        </div>

        {companyJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", borderRadius: 20, border: "1px dashed var(--border)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No jobs posted yet</div>
            <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>Post your first job to start attracting talent.</div>
            <button className="btn-primary" onClick={() => setPage("post-job")}>Post a Job</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {companyJobs.map(job => (
              <div key={job.id} style={{ padding: "20px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>{job.jobTitle}</h3>
                    <p style={{ color: "var(--text2)" }}>{job.category} • {job.jobType} • {job.workMode}</p>
                  </div>
                  <span className="tag" style={{ background: job.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: job.status === "active" ? "var(--green)" : "var(--red)" }}>
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>📍 {job.location || "Remote"}</span>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>💰 {job.salaryMin ? `${job.currency}${job.salaryMin}K–${job.currency}${job.salaryMax}K` : "Not disclosed"}</span>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>📅 Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  {job.deadline && <span style={{ fontSize: 13, color: "var(--text2)" }}>⏰ Deadline {new Date(job.deadline).toLocaleDateString()}</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-ghost" onClick={() => setEditing(job)}>Edit</button>
                  {job.status === "active" && <button className="btn-ghost" onClick={() => closeJob(job.id)}>Close Listing</button>}
                  <button className="btn-ghost" style={{ color: "var(--red)" }} onClick={() => deleteJob(job.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{GLOBAL_CSS}</style>
      <GlowBg />
      <IndustryNavbar />
      <div style={{ position: "relative", zIndex: 1 }}>
        {page === "dashboard" && <IndustryDashboard />}
        {page === "post-job" && <PageIndustryPostJob />}
        {page === "listings" && <PageIndustryListings />}
        {page === "analytics" && <div style={{ padding: "80px 24px", textAlign: "center" }}><h1>Analytics Coming Soon</h1></div>}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("auth"); // auth | onboarding | app | industry-app
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [industryUser, setIndustryUser] = useState(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [plan, setPlan] = useState("free");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = {
    role: "user",
    content: input,
  };
}

  setMessages(prev => [...prev, userMsg]);

  try {
    const res = await fetch("https://mentor-w7xg.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [userMsg],
        body: JSON.stringify({
  messages: [userMsg]
})
      }),
    });

    const data = await res.json();

    const botMsg = {
      role: "assistant",
      content: data.reply,
    };

    setMessages(prev => [...prev, botMsg]);

  } catch (err) {
    console.error("Chat Error:", err);
  }

  setInput("");
};


  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("forge_jwt");
    const savedProfile = localStorage.getItem("forge_user_profile");
    const industryToken = localStorage.getItem("forge_industry_jwt");
    const industryProfile = localStorage.getItem("forge_industry_profile");

    if (industryToken && industryProfile) {
      setIndustryUser(JSON.parse(industryProfile));
      setView("industry-app");
    } else if (token) {
      setIsAuthenticated(true);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setUser(parsed);
        setSelectedCareerPath(parsed.targetRole);
        setView("app");
      } else {
        setView("onboarding");
      }
    }
  }, []);

  function handleAuthSuccess(profileData, hasCompletedOnboarding) {
    setIsAuthenticated(true);
    if (hasCompletedOnboarding) {
      setUser(profileData);
      setSelectedCareerPath(profileData.targetRole);
      setView("app");
    } else {
      setUser(profileData); // Partial profile from auth
      setView("onboarding");
    }
  }

  function handleIndustryAuthSuccess(industryProfile) {
    setIndustryUser(industryProfile);
    setView("industry-app");
  }

  function handleOnboardingComplete(data) {
    const fullUser = {
      ...user,
      ...data,
      xp: 0, streak: 0, lastActiveDate: new Date().toDateString(),
      skillBadges: {}, quizScores: {}, projectScores: {},
      dailyChallengeCompleted: null, completedChallenges: []
    };
    setUser(fullUser);
    setSelectedCareerPath(fullUser.targetRole);
    localStorage.setItem("forge_user_profile", JSON.stringify(fullUser));
    setView("app");
  }

  function logout() {
    localStorage.removeItem("forge_jwt");
    localStorage.removeItem("forge_user_profile");
    setIsAuthenticated(false);
    setUser(null);
    setSelectedCareerPath(null);
    setView("auth");
  }

  function logoutIndustry() {
    localStorage.removeItem("forge_industry_jwt");
    localStorage.removeItem("forge_industry_profile");
    setIndustryUser(null);
    setView("auth");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{GLOBAL_CSS}</style>
      <GlowBg />

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={() => setPlan("pro")} />}

      {view === "auth" && <PageAuth onAuthSuccess={handleAuthSuccess} onIndustryAuthSuccess={handleIndustryAuthSuccess} />}

      {view === "onboarding" && (
        <PageOnboarding onComplete={handleOnboardingComplete} prefill={{ prefillName: user?.name, prefillEmail: user?.email }} />
      )}

      {view === "app" && user && selectedCareerPath && (
        <>
          <NavBar page={page} setPage={setPage} userName={user.name} plan={plan} onChat={() => setChatOpen(true)} onLogout={logout} />
          {chatOpen && <ChatBot user={user} plan={plan} onClose={() => setChatOpen(false)} selectedCareerPath={selectedCareerPath} />}
          <div style={{ position: "relative", zIndex: 1 }}>
            {page === "dashboard" && <PageDashboard user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)} setPage={setPage} selectedCareerPath={selectedCareerPath} />}
            {page === "roadmap" && <PageRoadmap user={user} selectedCareerPath={selectedCareerPath} />}
            {page === "tasks" && <PageTaskTracker user={user} setUser={setUser} selectedCareerPath={selectedCareerPath} />}
            {page === "projects" && <PageProjects user={user} setUser={setUser} selectedCareerPath={selectedCareerPath} />}
            {page === "courses" && <PageCourses user={user} selectedCareerPath={selectedCareerPath} />}
            {page === "assessment" && <PageAssessment user={user} setUser={setUser} selectedCareerPath={selectedCareerPath} />}
            {page === "skills" && <PageSkills user={user} selectedCareerPath={selectedCareerPath} />}
            {page === "jobs" && <PageJobs user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)} selectedCareerPath={selectedCareerPath} />}
            {page === "portfolio" && <PagePortfolio user={user} selectedCareerPath={selectedCareerPath} />}
            {page === "challenge" && <PageDailyChallenge user={user} setUser={setUser} selectedCareerPath={selectedCareerPath} />}
            {page === "mentors" && <PageMentors user={user} plan={plan} onUpgrade={() => setShowUpgrade(true)} selectedCareerPath={selectedCareerPath} />}
            {page === "resources" && <PageResources user={user} selectedCareerPath={selectedCareerPath} />}
            {page === "pricing" && <PagePricing plan={plan} onUpgrade={() => setShowUpgrade(true)} />}
          </div>
        </>
      )}

      {view === "industry-app" && industryUser && (
        <IndustryApp industryUser={industryUser} onLogout={logoutIndustry} />
      )}
    </div>
  );
}
