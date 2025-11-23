import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zztdvaryjokagjsakwca.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGR2YXJ5am9rYWdqc2Frd2NhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM1NzIzNiwiZXhwIjoyMDczOTMzMjM2fQ.XHslBrFJM1MFneRFvI655oZrhkPh49xM2jJ3ynlwOek"; // ⚠️ keep secret
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// 15 students + 15 recruiters with diverse backgrounds
const seedUsers = [
  // Students - Diverse backgrounds, schools, and majors
  { email: "alice@example.com", name: "Alice Johnson", role: "student", pic: "https://i.pravatar.cc/300?img=5", school: "MIT", major: "Computer Science", level: "Graduate", year: 2025, personality: ["Introvert"], words: ["Analytical", "Precise", "Methodical"], team: ["Individual Contributor"], startup: ["Steady Builder"], chaos: ["Systematic Planner"] },
  { email: "brian@example.com", name: "Brian Lee", role: "student", pic: "https://i.pravatar.cc/300?img=6", school: "UC Berkeley", major: "Data Science", level: "Undergraduate", year: 2026, personality: ["Extrovert"], words: ["Creative", "Curious", "Adaptable"], team: ["Collaborator"], startup: ["Fast Mover"], chaos: ["Creative Problem Solver"] },
  { email: "chloe@example.com", name: "Chloe Nguyen", role: "student", pic: "https://i.pravatar.cc/300?img=7", school: "Stanford University", major: "Mechanical Engineering", level: "Graduate", year: 2025, personality: ["Ambivert"], words: ["Innovative", "Persistent", "Detail-oriented"], team: ["Leader/Manager"], startup: ["Risk Taker"], chaos: ["Focused Worker"] },
  { email: "david@example.com", name: "David Kim", role: "student", pic: "https://i.pravatar.cc/300?img=8", school: "Georgia Tech", major: "Industrial Engineering", level: "Undergraduate", year: 2027, personality: ["Introvert"], words: ["Logical", "Efficient", "Reliable"], team: ["Specialist/Expert"], startup: ["Process Optimizer"], chaos: ["Calm Under Pressure"] },
  { email: "ella@example.com", name: "Ella Martinez", role: "student", pic: "https://i.pravatar.cc/300?img=9", school: "NYU", major: "Business Administration", level: "Undergraduate", year: 2026, personality: ["Extrovert"], words: ["Ambitious", "Charismatic", "Strategic"], team: ["Leader/Manager"], startup: ["Fast Mover"], chaos: ["Decisive Leader"] },
  { email: "frank@example.com", name: "Frank Miller", role: "student", pic: "https://i.pravatar.cc/300?img=10", school: "University of Texas at Austin", major: "Electrical Engineering", level: "Graduate", year: 2025, personality: ["Introvert"], words: ["Technical", "Thorough", "Patient"], team: ["Individual Contributor"], startup: ["Steady Builder"], chaos: ["Systematic Planner"] },
  { email: "grace@example.com", name: "Grace Zhao", role: "student", pic: "https://i.pravatar.cc/300?img=11", school: "Carnegie Mellon", major: "Human-Computer Interaction", level: "Graduate", year: 2025, personality: ["Ambivert"], words: ["Empathetic", "User-focused", "Innovative"], team: ["Collaborator"], startup: ["Design Thinker"], chaos: ["Creative Problem Solver"] },
  { email: "henry@example.com", name: "Henry Patel", role: "student", pic: "https://i.pravatar.cc/300?img=12", school: "University of Washington", major: "Information Systems", level: "Undergraduate", year: 2026, personality: ["Extrovert"], words: ["Communicative", "Organized", "Helpful"], team: ["Facilitator"], startup: ["Process Optimizer"], chaos: ["Team Coordinator"] },
  { email: "irene@example.com", name: "Irene Thomas", role: "student", pic: "https://i.pravatar.cc/300?img=13", school: "Harvard University", major: "Economics", level: "Undergraduate", year: 2027, personality: ["Introvert"], words: ["Analytical", "Critical", "Research-oriented"], team: ["Specialist/Expert"], startup: ["Data-driven"], chaos: ["Research & Analysis"] },
  { email: "jack@example.com", name: "Jack Wilson", role: "student", pic: "https://i.pravatar.cc/300?img=14", school: "University of Michigan", major: "Aerospace Engineering", level: "Graduate", year: 2025, personality: ["Ambivert"], words: ["Precise", "Ambitious", "Technical"], team: ["Individual Contributor"], startup: ["Risk Taker"], chaos: ["Focused Worker"] },
  { email: "maya@example.com", name: "Maya Singh", role: "student", pic: "https://i.pravatar.cc/300?img=25", school: "Caltech", major: "Physics", level: "Graduate", year: 2026, personality: ["Introvert"], words: ["Theoretical", "Deep-thinking", "Curious"], team: ["Specialist/Expert"], startup: ["Research-focused"], chaos: ["Systematic Planner"] },
  { email: "carlos@example.com", name: "Carlos Rodriguez", role: "student", pic: "https://i.pravatar.cc/300?img=26", school: "UCLA", major: "Graphic Design", level: "Undergraduate", year: 2026, personality: ["Extrovert"], words: ["Creative", "Visual", "Expressive"], team: ["Creative Lead"], startup: ["Design Thinker"], chaos: ["Creative Problem Solver"] },
  { email: "zoe@example.com", name: "Zoe Chen", role: "student", pic: "https://i.pravatar.cc/300?img=27", school: "University of Chicago", major: "Mathematics", level: "Undergraduate", year: 2027, personality: ["Introvert"], words: ["Logical", "Abstract", "Problem-solver"], team: ["Individual Contributor"], startup: ["Algorithm Designer"], chaos: ["Systematic Planner"] },
  { email: "omar@example.com", name: "Omar Al-Hassan", role: "student", pic: "https://i.pravatar.cc/300?img=28", school: "University of Pennsylvania", major: "Finance", level: "Graduate", year: 2025, personality: ["Extrovert"], words: ["Analytical", "Risk-aware", "Strategic"], team: ["Leader/Manager"], startup: ["Fast Mover"], chaos: ["Quick Decision Maker"] },
  { email: "luna@example.com", name: "Luna Park", role: "student", pic: "https://i.pravatar.cc/300?img=29", school: "Brown University", major: "Environmental Science", level: "Undergraduate", year: 2026, personality: ["Ambivert"], words: ["Sustainable", "Passionate", "Research-oriented"], team: ["Collaborator"], startup: ["Mission-driven"], chaos: ["Research & Analysis"] },

  // Recruiters - Diverse companies and industries
  { email: "sophia@example.com", name: "Sophia Brown", role: "recruiter", pic: "https://i.pravatar.cc/300?img=15", company: "Google", industry: "Technology", position: "Senior Technical Recruiter", looking: ["Software Engineers", "Data Scientists"], majors: ["Computer Science", "Statistics"], workType: "Hybrid" },
  { email: "michael@example.com", name: "Michael Johnson", role: "recruiter", pic: "https://i.pravatar.cc/300?img=16", company: "Goldman Sachs", industry: "Financial Services", position: "Campus Recruiting Manager", looking: ["Analysts", "Quantitative Researchers"], majors: ["Finance", "Mathematics", "Economics"], workType: "On-site" },
  { email: "olivia@example.com", name: "Olivia Garcia", role: "recruiter", pic: "https://i.pravatar.cc/300?img=17", company: "Tesla", industry: "Automotive/Clean Energy", position: "Engineering Recruiter", looking: ["Mechanical Engineers", "Electrical Engineers"], majors: ["Mechanical Engineering", "Electrical Engineering"], workType: "Hybrid" },
  { email: "daniel@example.com", name: "Daniel Kim", role: "recruiter", pic: "https://i.pravatar.cc/300?img=18", company: "Pfizer", industry: "Pharmaceuticals", position: "Life Sciences Recruiter", looking: ["Research Scientists", "Clinical Researchers"], majors: ["Biology", "Chemistry", "Biomedical Engineering"], workType: "On-site" },
  { email: "emma@example.com", name: "Emma Chen", role: "recruiter", pic: "https://i.pravatar.cc/300?img=19", company: "Netflix", industry: "Entertainment/Media", position: "Product Recruiter", looking: ["Product Managers", "UX Designers"], majors: ["Business", "Design", "Psychology"], workType: "Remote" },
  { email: "noah@example.com", name: "Noah Davis", role: "recruiter", pic: "https://i.pravatar.cc/300?img=20", company: "McKinsey & Company", industry: "Consulting", position: "Associate Recruiter", looking: ["Business Analysts", "Consultants"], majors: ["Business Administration", "Economics", "Engineering"], workType: "Hybrid" },
  { email: "ava@example.com", name: "Ava Martinez", role: "recruiter", pic: "https://i.pravatar.cc/300?img=21", company: "SpaceX", industry: "Aerospace", position: "Engineering Talent Acquisition", looking: ["Aerospace Engineers", "Software Engineers"], majors: ["Aerospace Engineering", "Computer Science"], workType: "On-site" },
  { email: "liam@example.com", name: "Liam Wilson", role: "recruiter", pic: "https://i.pravatar.cc/300?img=22", company: "Deloitte", industry: "Professional Services", position: "Campus Recruiting Lead", looking: ["Consultants", "Auditors", "Technology Analysts"], majors: ["Accounting", "Business", "Information Systems"], workType: "Hybrid" },
  { email: "mia@example.com", name: "Mia Robinson", role: "recruiter", pic: "https://i.pravatar.cc/300?img=23", company: "Johnson & Johnson", industry: "Healthcare", position: "Medical Device Recruiter", looking: ["Biomedical Engineers", "Clinical Researchers"], majors: ["Biomedical Engineering", "Biology"], workType: "Hybrid" },
  { email: "ethan@example.com", name: "Ethan White", role: "recruiter", pic: "https://i.pravatar.cc/300?img=24", company: "Amazon", industry: "E-commerce/Cloud Computing", position: "Software Development Recruiter", looking: ["Software Engineers", "Cloud Architects"], majors: ["Computer Science", "Software Engineering"], workType: "Hybrid" },
  { email: "isabella@example.com", name: "Isabella Lopez", role: "recruiter", pic: "https://i.pravatar.cc/300?img=30", company: "Procter & Gamble", industry: "Consumer Goods", position: "Brand Management Recruiter", looking: ["Brand Managers", "Marketing Analysts"], majors: ["Marketing", "Business Administration"], workType: "Hybrid" },
  { email: "james@example.com", name: "James Thompson", role: "recruiter", pic: "https://i.pravatar.cc/300?img=31", company: "Stripe", industry: "FinTech", position: "Technical Recruiter", looking: ["Backend Engineers", "Payment Engineers"], majors: ["Computer Science", "Mathematics"], workType: "Remote" },
  { email: "aria@example.com", name: "Aria Patel", role: "recruiter", pic: "https://i.pravatar.cc/300?img=32", company: "Airbnb", industry: "Travel/Hospitality Tech", position: "Product Design Recruiter", looking: ["Product Designers", "UX Researchers"], majors: ["Design", "Human-Computer Interaction"], workType: "Hybrid" },
  { email: "ryan@example.com", name: "Ryan O'Connor", role: "recruiter", pic: "https://i.pravatar.cc/300?img=33", company: "ExxonMobil", industry: "Energy", position: "Engineering Recruiter", looking: ["Petroleum Engineers", "Chemical Engineers"], majors: ["Petroleum Engineering", "Chemical Engineering"], workType: "On-site" },
  { email: "sophia.tech@example.com", name: "Sophia Kim", role: "recruiter", pic: "https://i.pravatar.cc/300?img=34", company: "Salesforce", industry: "Enterprise Software", position: "Sales & Marketing Recruiter", looking: ["Sales Engineers", "Marketing Specialists"], majors: ["Business", "Communications", "Engineering"], workType: "Hybrid" },
];

async function main() {
  for (const user of seedUsers) {
    // 1. Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: "Password123!",
      email_confirm: true,
    });

    if (error || !data?.user) {
      console.error(`❌ Error creating ${user.email}:`, error?.message);
      continue;
    }

    const userId = data.user.id;

    // 2. Insert into profiles
    await supabase.from("profiles").upsert({
      id: userId,
      role: user.role,
      name: user.name,
      profile_pic_url: user.pic,
    });

    // 3. Student-specific details
    if (user.role === "student") {
      await supabase.from("student_details").upsert({
        id: userId,
        school: user.school,
        birthday: "2000-01-01",
        education_level: user.level,
        major: user.major,
        graduation_year: user.year,
        industries: getIndustriesForMajor(user.major as string),
        role_types: ["Internship", "Full-time", "Co-op"],
      });

      await supabase.from("student_habits").upsert({
        id: userId,
        personality: user.personality,
        three_words: user.words,
        team_role: user.team,
        startup_style: user.startup,
        chaos_response: user.chaos,
      });
    }

    // 4. Recruiter-specific details
    if (user.role === "recruiter") {
      await supabase.from("recruiter_details").upsert({
        id: userId,
        company_name: user.company,
        company_industry: user.industry,
        user_role: user.position,
        looking_for: user.looking,
        preferred_majors: user.majors,
        work_type: user.workType,
      });

      await supabase.from("recruiter_habits").upsert({
        id: userId,
        values_most: getValuesForIndustry(user.industry as string),
        work_style: getWorkStyleForCompany(user.company as string),
        interview_theme: getInterviewThemeForRole(user.looking as string[]),
        leader_traits: getLeaderTraitsForIndustry(user.industry as string),
      });
    }

    console.log(`✅ Seeded ${user.email} (${user.role}) - ${user.role === 'student' ? user.school : user.company}`);
  }
}

// Helper functions for more realistic data
function getIndustriesForMajor(major: string): string[] {
  const industryMap: { [key: string]: string[] } = {
    "Computer Science": ["Tech", "Finance", "Healthcare", "Gaming"],
    "Data Science": ["Tech", "Finance", "Healthcare", "E-commerce"],
    "Mechanical Engineering": ["Automotive", "Aerospace", "Manufacturing", "Energy"],
    "Electrical Engineering": ["Tech", "Energy", "Telecommunications", "Automotive"],
    "Business Administration": ["Finance", "Consulting", "Retail", "Healthcare"],
    "Industrial Engineering": ["Manufacturing", "Logistics", "Consulting", "Healthcare"],
    "Human-Computer Interaction": ["Tech", "Design", "Healthcare", "Education"],
    "Information Systems": ["Tech", "Finance", "Healthcare", "Government"],
    "Economics": ["Finance", "Consulting", "Government", "Research"],
    "Aerospace Engineering": ["Aerospace", "Defense", "Tech", "Research"],
    "Physics": ["Research", "Tech", "Energy", "Defense"],
    "Graphic Design": ["Design", "Marketing", "Entertainment", "Tech"],
    "Mathematics": ["Finance", "Tech", "Research", "Insurance"],
    "Finance": ["Finance", "Banking", "Investment", "Insurance"],
    "Environmental Science": ["Energy", "Government", "Consulting", "Non-profit"],
  };
  return industryMap[major] || ["Tech", "Consulting"];
}

function getValuesForIndustry(industry: string): string[] {
  const valuesMap: { [key: string]: string[] } = {
    "Technology": ["Innovation and Creativity", "Skills and Competence"],
    "Financial Services": ["Skills and Competence", "Results and Performance"],
    "Automotive/Clean Energy": ["Innovation and Creativity", "Mission and Impact"],
    "Pharmaceuticals": ["Mission and Impact", "Skills and Competence"],
    "Entertainment/Media": ["Cultural Fit", "Innovation and Creativity"],
    "Consulting": ["Skills and Competence", "Results and Performance"],
    "Aerospace": ["Skills and Competence", "Mission and Impact"],
    "Professional Services": ["Cultural Fit", "Skills and Competence"],
    "Healthcare": ["Mission and Impact", "Cultural Fit"],
    "E-commerce/Cloud Computing": ["Innovation and Creativity", "Results and Performance"],
  };
  return valuesMap[industry] || ["Skills and Competence"];
}

function getWorkStyleForCompany(company: string): string[] {
  const styleMap: { [key: string]: string[] } = {
    "Google": ["Collaborative", "Independent"],
    "Goldman Sachs": ["Structured", "Fast-paced"],
    "Tesla": ["Fast-paced", "Independent"],
    "Netflix": ["Independent", "Results-oriented"],
    "SpaceX": ["Fast-paced", "Mission-driven"],
  };
  return styleMap[company] || ["Collaborative"];
}

function getInterviewThemeForRole(roles: string[]): string[] {
  if (roles.some(r => r.includes("Engineer"))) return ["Technical Skills", "Problem Solving"];
  if (roles.some(r => r.includes("Designer"))) return ["Creativity", "Portfolio Review"];
  if (roles.some(r => r.includes("Analyst"))) return ["Analytical Thinking", "Case Studies"];
  return ["Problem Solving", "Behavioral Questions"];
}

function getLeaderTraitsForIndustry(industry: string): string[] {
  const traitsMap: { [key: string]: string[] } = {
    "Technology": ["Innovation and Vision", "Confidence and Initiative"],
    "Financial Services": ["Decision Making", "Confidence and Initiative"],
    "Healthcare": ["Empathy and Support", "Decision Making"],
    "Consulting": ["Communication Skills", "Analytical Thinking"],
  };
  return traitsMap[industry] || ["Confidence and Initiative"];
}

main();
