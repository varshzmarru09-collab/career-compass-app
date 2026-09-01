import { SectorType, Role, Course, Job, Skill, Trainer, RealWorldProject } from '../src/types/index.js';

export const SECTORS: SectorType[] = [
  'IT & Software',
  'Manufacturing',
  'Healthcare',
  'Agriculture',
  'Construction',
  'Banking & Finance',
  'Logistics',
  'Retail',
  'Tourism & Hospitality',
  'Public Services',
];

export const INITIAL_SKILLS: Skill[] = [
  // IT & Software
  { id: 'sk-python', name: 'Python', category: 'IT & Software' },
  { id: 'sk-java', name: 'Java', category: 'IT & Software' },
  { id: 'sk-c', name: 'C', category: 'IT & Software' },
  { id: 'sk-cpp', name: 'C++', category: 'IT & Software' },
  { id: 'sk-sql', name: 'SQL', category: 'IT & Software' },
  { id: 'sk-html', name: 'HTML', category: 'IT & Software' },
  { id: 'sk-css', name: 'CSS', category: 'IT & Software' },
  { id: 'sk-javascript', name: 'JavaScript', category: 'IT & Software' },
  { id: 'sk-react', name: 'React', category: 'IT & Software' },
  { id: 'sk-nodejs', name: 'Node.js', category: 'IT & Software' },
  { id: 'sk-apis', name: 'APIs', category: 'IT & Software' },
  { id: 'sk-ml', name: 'Machine Learning', category: 'IT & Software' },
  { id: 'sk-stats', name: 'Statistics', category: 'IT & Software' },
  { id: 'sk-dsa', name: 'Data Structures', category: 'IT & Software' },
  { id: 'sk-data-analysis', name: 'Data Analysis', category: 'IT & Software' },
  { id: 'sk-cybersec', name: 'Cybersecurity Fundamentals', category: 'IT & Software' },
  { id: 'sk-network', name: 'Network Security', category: 'IT & Software' },
  { id: 'sk-cloud-aws', name: 'Cloud Computing (AWS)', category: 'IT & Software' },
  { id: 'sk-git', name: 'Git & Version Control', category: 'IT & Software' },
  { id: 'sk-git-simple', name: 'Git', category: 'IT & Software' },

  // Manufacturing & Mechanical & Electrical
  { id: 'sk-autocad', name: 'AutoCAD', category: 'Manufacturing' },
  { id: 'sk-solidworks', name: 'SolidWorks', category: 'Manufacturing' },
  { id: 'sk-cad-general', name: 'CAD', category: 'Manufacturing' },
  { id: 'sk-mech-design', name: 'Mechanical Design', category: 'Manufacturing' },
  { id: 'sk-cad', name: 'AutoCAD & SolidWorks', category: 'Manufacturing' },
  { id: 'sk-cnc-simple', name: 'CNC', category: 'Manufacturing' },
  { id: 'sk-cnc', name: 'CNC Machine Programming', category: 'Manufacturing' },
  { id: 'sk-plc-simple', name: 'PLC', category: 'Manufacturing' },
  { id: 'sk-plc', name: 'PLC & SCADA Systems', category: 'Manufacturing' },
  { id: 'sk-lean-mfg', name: 'Lean Manufacturing', category: 'Manufacturing' },
  { id: 'sk-six-sigma-simple', name: 'Six Sigma', category: 'Manufacturing' },
  { id: 'sk-six-sigma', name: 'Six Sigma & Lean', category: 'Manufacturing' },
  { id: 'sk-qc', name: 'Quality Control', category: 'Manufacturing' },
  { id: 'sk-tqm', name: 'Total Quality Management', category: 'Manufacturing' },
  { id: 'sk-gdt', name: 'GD&T', category: 'Manufacturing' },
  { id: 'sk-mfg-safety', name: 'Industrial Safety Standards', category: 'Manufacturing' },
  { id: 'sk-circuit-analysis', name: 'Circuit Analysis', category: 'Manufacturing' },
  { id: 'sk-embedded-sys', name: 'Embedded Systems', category: 'Manufacturing' },
  { id: 'sk-pcb-design', name: 'PCB Design', category: 'Manufacturing' },
  { id: 'sk-elec-safety', name: 'Electrical Safety', category: 'Manufacturing' },

  // Healthcare
  { id: 'sk-med-term', name: 'Medical Terminology', category: 'Healthcare' },
  { id: 'sk-patient-care', name: 'Patient Care', category: 'Healthcare' },
  { id: 'sk-clin-doc', name: 'Clinical Documentation', category: 'Healthcare' },
  { id: 'sk-health-safety', name: 'Healthcare Safety', category: 'Healthcare' },
  { id: 'sk-health-stats', name: 'Biostatistics', category: 'Healthcare' },
  { id: 'sk-ehr', name: 'Electronic Health Records (EHR)', category: 'Healthcare' },
  { id: 'sk-med-lab', name: 'Clinical Diagnostics', category: 'Healthcare' },
  { id: 'sk-hipaa', name: 'Healthcare Compliance & HIPAA', category: 'Healthcare' },
  { id: 'sk-epidemiology', name: 'Epidemiology Basics', category: 'Healthcare' },

  // Banking & Finance
  { id: 'sk-accounting-simple', name: 'Accounting', category: 'Banking & Finance' },
  { id: 'sk-accounting', name: 'Accounting Principles (GAAP)', category: 'Banking & Finance' },
  { id: 'sk-fin-analysis', name: 'Financial Analysis', category: 'Banking & Finance' },
  { id: 'sk-fin-modeling', name: 'Financial Modeling', category: 'Banking & Finance' },
  { id: 'sk-corp-finance', name: 'Corporate Finance', category: 'Banking & Finance' },
  { id: 'sk-tally', name: 'Tally', category: 'Banking & Finance' },
  { id: 'sk-banking-ops', name: 'Banking Operations', category: 'Banking & Finance' },
  { id: 'sk-risk-mgmt', name: 'Risk Management', category: 'Banking & Finance' },
  { id: 'sk-taxation', name: 'Taxation & Auditing', category: 'Banking & Finance' },
  { id: 'sk-powerbi', name: 'Power BI & Tableau', category: 'Banking & Finance' },

  // Agriculture
  { id: 'sk-soil-mgmt', name: 'Soil Management', category: 'Agriculture' },
  { id: 'sk-crop-mgmt', name: 'Crop Management', category: 'Agriculture' },
  { id: 'sk-irrigation', name: 'Irrigation', category: 'Agriculture' },
  { id: 'sk-agri-tech', name: 'Agricultural Technology', category: 'Agriculture' },
  { id: 'sk-precision-agri', name: 'Precision Agriculture Tools', category: 'Agriculture' },
  { id: 'sk-soil-science', name: 'Soil & Crop Science', category: 'Agriculture' },
  { id: 'sk-gis', name: 'GIS & Drone Mapping', category: 'Agriculture' },
  { id: 'sk-agri-supply', name: 'Agri-Supply Chain Management', category: 'Agriculture' },

  // Construction
  { id: 'sk-revit-simple', name: 'Revit', category: 'Construction' },
  { id: 'sk-staad-simple', name: 'STAAD.Pro', category: 'Construction' },
  { id: 'sk-qty-surveying', name: 'Quantity Surveying', category: 'Construction' },
  { id: 'sk-struct-analysis-simple', name: 'Structural Analysis', category: 'Construction' },
  { id: 'sk-bim', name: 'BIM & Revit Architecture', category: 'Construction' },
  { id: 'sk-site-eng', name: 'Civil Site Supervision', category: 'Construction' },
  { id: 'sk-struct-analysis', name: 'Structural Analysis (STAAD)', category: 'Construction' },
  { id: 'sk-cost-est', name: 'Cost Estimation & BOQ', category: 'Construction' },

  // Logistics
  { id: 'sk-supply-chain', name: 'Supply Chain Operations', category: 'Logistics' },
  { id: 'sk-warehouse-mgmt', name: 'Warehouse Management Systems', category: 'Logistics' },
  { id: 'sk-inventory-control', name: 'Inventory Forecasting', category: 'Logistics' },
  { id: 'sk-freight', name: 'Freight Forwarding & Customs', category: 'Logistics' },

  // Retail
  { id: 'sk-ecom-mgmt', name: 'E-commerce Store Operations', category: 'Retail' },
  { id: 'sk-merchandising', name: 'Visual Merchandising', category: 'Retail' },
  { id: 'sk-customer-exp', name: 'Customer Experience Management', category: 'Retail' },
  { id: 'sk-pos-inventory', name: 'Point of Sale (POS) Systems', category: 'Retail' },

  // Tourism & Hospitality
  { id: 'sk-hotel-ops', name: 'Front Desk & Hotel Operations', category: 'Tourism & Hospitality' },
  { id: 'sk-f-and-b', name: 'Food & Beverage Service', category: 'Tourism & Hospitality' },
  { id: 'sk-event-planning', name: 'Event Management & Protocol', category: 'Tourism & Hospitality' },
  { id: 'sk-travel-booking', name: 'GDS & Travel Booking Engines', category: 'Tourism & Hospitality' },

  // Public Services
  { id: 'sk-public-policy', name: 'Public Administration & Policy', category: 'Public Services' },
  { id: 'sk-community-outreach', name: 'Community Stakeholder Outreach', category: 'Public Services' },
  { id: 'sk-gov-procure', name: 'Government Tendering & Procurement', category: 'Public Services' },
  { id: 'sk-rti-compliance', name: 'Regulatory & RTI Compliance', category: 'Public Services' },

  // Universal / Cross-functional
  { id: 'sk-excel', name: 'Excel', category: 'Productivity' },
  { id: 'sk-comm', name: 'Communication', category: 'Soft Skills' },
  { id: 'sk-problem-solving', name: 'Problem Solving', category: 'Soft Skills' },
  { id: 'sk-teamwork', name: 'Teamwork', category: 'Soft Skills' },
];

export const INITIAL_ROLES: {
  role: Role;
  requiredSkills: string[]; // names of skills
}[] = [
  // IT & Software
  {
    role: {
      id: 'role-swe',
      sector: 'IT & Software',
      name: 'Software Developer',
      description: 'Design, write, test, and maintain robust client and server software systems.',
      averageSalary: '₹6.5 - ₹12 LPA / $75,000',
      demandLevel: 'Very High',
    },
    requiredSkills: ['Data Structures', 'Java', 'SQL', 'Git & Version Control', 'Problem Solving'],
  },
  {
    role: {
      id: 'role-web-dev',
      sector: 'IT & Software',
      name: 'Web Developer',
      description: 'Build responsive, accessible, dynamic web applications and backend APIs.',
      averageSalary: '₹5.5 - ₹10 LPA / $68,000',
      demandLevel: 'High',
    },
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
  },
  {
    role: {
      id: 'role-data-analyst',
      sector: 'IT & Software',
      name: 'Data Analyst',
      description: 'Extract insights from complex datasets using SQL, Python, Excel, and BI tools.',
      averageSalary: '₹6.0 - ₹11 LPA / $70,000',
      demandLevel: 'Very High',
    },
    requiredSkills: ['SQL', 'Python', 'Data Analysis', 'Excel', 'Statistics'],
  },
  {
    role: {
      id: 'role-ai-ml',
      sector: 'IT & Software',
      name: 'AI/ML Engineer',
      description: 'Train, evaluate, and deploy intelligent machine learning and deep learning models.',
      averageSalary: '₹8.5 - ₹16 LPA / $95,000',
      demandLevel: 'Very High',
    },
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Structures'],
  },
  {
    role: {
      id: 'role-cybersec',
      sector: 'IT & Software',
      name: 'Cybersecurity Analyst',
      description: 'Protect enterprise infrastructure, networks, and applications against threats.',
      averageSalary: '₹6.5 - ₹13 LPA / $80,000',
      demandLevel: 'High',
    },
    requiredSkills: ['Cybersecurity Fundamentals', 'Network Security', 'Python', 'Problem Solving'],
  },

  // Manufacturing
  {
    role: {
      id: 'role-prod-eng',
      sector: 'Manufacturing',
      name: 'Production Engineer',
      description: 'Oversee plant assembly lines, optimize yield, and minimize downtime.',
      averageSalary: '₹5.0 - ₹9 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['AutoCAD & SolidWorks', 'Six Sigma & Lean', 'Industrial Safety Standards', 'Problem Solving'],
  },
  {
    role: {
      id: 'role-qa-eng',
      sector: 'Manufacturing',
      name: 'Quality Engineer',
      description: 'Maintain strict quality control systems and root-cause analysis.',
      averageSalary: '₹4.8 - ₹8.5 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Six Sigma & Lean', 'Total Quality Management', 'Statistics', 'Teamwork'],
  },
  {
    role: {
      id: 'role-maint-eng',
      sector: 'Manufacturing',
      name: 'Maintenance Engineer',
      description: 'Ensure automated machines, robotics, and electrical systems operate smoothly.',
      averageSalary: '₹4.5 - ₹8.0 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['PLC & SCADA Systems', 'Industrial Safety Standards', 'Problem Solving'],
  },
  {
    role: {
      id: 'role-prod-sup',
      sector: 'Manufacturing',
      name: 'Production Supervisor',
      description: 'Lead shop floor teams, enforce shift schedules, and hit production targets.',
      averageSalary: '₹4.2 - ₹7.5 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Industrial Safety Standards', 'Communication', 'Teamwork', 'Excel'],
  },

  // Healthcare
  {
    role: {
      id: 'role-health-data',
      sector: 'Healthcare',
      name: 'Healthcare Data Analyst',
      description: 'Analyze clinical outcomes, patient admissions, and hospital operational data.',
      averageSalary: '₹6.0 - ₹11 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Biostatistics', 'Electronic Health Records (EHR)', 'Data Analysis', 'SQL'],
  },
  {
    role: {
      id: 'role-health-admin',
      sector: 'Healthcare',
      name: 'Healthcare Administrator',
      description: 'Manage hospital operations, patient flow, and regulatory compliance.',
      averageSalary: '₹5.0 - ₹9.5 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Healthcare Compliance & HIPAA', 'Electronic Health Records (EHR)', 'Communication', 'Excel'],
  },
  {
    role: {
      id: 'role-med-lab-tech',
      sector: 'Healthcare',
      name: 'Medical Laboratory Technician',
      description: 'Perform diagnostic testing on patient samples using high-precision equipment.',
      averageSalary: '₹4.0 - ₹7.0 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Clinical Diagnostics', 'Healthcare Compliance & HIPAA', 'Problem Solving'],
  },

  // Banking & Finance
  {
    role: {
      id: 'role-fin-analyst',
      sector: 'Banking & Finance',
      name: 'Financial Analyst',
      description: 'Evaluate investments, build valuation models, and guide portfolio decisions.',
      averageSalary: '₹6.5 - ₹12 LPA',
      demandLevel: 'Very High',
    },
    requiredSkills: ['Financial Modeling', 'Corporate Finance', 'Excel', 'Power BI & Tableau', 'Statistics'],
  },
  {
    role: {
      id: 'role-bank-assoc',
      sector: 'Banking & Finance',
      name: 'Banking Associate',
      description: 'Handle customer portfolio relations, credit underwriting, and retail banking.',
      averageSalary: '₹4.5 - ₹8.0 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Corporate Finance', 'Accounting Principles (GAAP)', 'Communication', 'Excel'],
  },
  {
    role: {
      id: 'role-accountant',
      sector: 'Banking & Finance',
      name: 'Accountant',
      description: 'Prepare balance sheets, tax filings, payroll audits, and financial ledgers.',
      averageSalary: '₹4.2 - ₹7.5 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Accounting Principles (GAAP)', 'Taxation & Auditing', 'Excel', 'Problem Solving'],
  },

  // Agriculture
  {
    role: {
      id: 'role-agri-tech',
      sector: 'Agriculture',
      name: 'Agri-Tech Specialist',
      description: 'Deploy IoT crop sensors, drone soil surveillance, and smart irrigation systems.',
      averageSalary: '₹5.0 - ₹9.0 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Precision Agriculture Tools', 'Soil & Crop Science', 'GIS & Drone Mapping'],
  },
  {
    role: {
      id: 'role-farm-ops',
      sector: 'Agriculture',
      name: 'Farm Operations Supervisor',
      description: 'Manage crop lifecycle, agronomy staff, harvesting, and yield distribution.',
      averageSalary: '₹4.0 - ₹7.5 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Soil & Crop Science', 'Agri-Supply Chain Management', 'Teamwork'],
  },

  // Construction
  {
    role: {
      id: 'role-civil-site',
      sector: 'Construction',
      name: 'Civil Site Engineer',
      description: 'Direct on-site construction works, ensure quality benchmarks and code compliance.',
      averageSalary: '₹4.8 - ₹9 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Civil Site Supervision', 'Cost Estimation & BOQ', 'Problem Solving', 'Teamwork'],
  },
  {
    role: {
      id: 'role-bim-spec',
      sector: 'Construction',
      name: 'BIM Specialist',
      description: 'Create 3D structural, MEP, and architectural models using Autodesk Revit & BIM.',
      averageSalary: '₹5.5 - ₹10 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['BIM & Revit Architecture', 'Structural Analysis (STAAD)', 'AutoCAD & SolidWorks'],
  },

  // Logistics
  {
    role: {
      id: 'role-supply-analyst',
      sector: 'Logistics',
      name: 'Supply Chain Analyst',
      description: 'Model inventory bottlenecks, forecast fleet delivery times, and optimize freight.',
      averageSalary: '₹5.5 - ₹10 LPA',
      demandLevel: 'Very High',
    },
    requiredSkills: ['Supply Chain Operations', 'Inventory Forecasting', 'Data Analysis', 'Excel'],
  },
  {
    role: {
      id: 'role-warehouse-mgr',
      sector: 'Logistics',
      name: 'Warehouse Operations Manager',
      description: 'Direct fulfillment center sorting, inventory picking, safety, and dispatch.',
      averageSalary: '₹5.0 - ₹9.0 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Warehouse Management Systems', 'Supply Chain Operations', 'Teamwork', 'Communication'],
  },

  // Retail
  {
    role: {
      id: 'role-retail-ops',
      sector: 'Retail',
      name: 'Retail Operations Manager',
      description: 'Drive store revenue, staff coaching, stock merchandising, and customer satisfaction.',
      averageSalary: '₹4.5 - ₹8.5 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Point of Sale (POS) Systems', 'Visual Merchandising', 'Customer Experience Management', 'Communication'],
  },
  {
    role: {
      id: 'role-ecom-spec',
      sector: 'Retail',
      name: 'E-commerce Specialist',
      description: 'Manage marketplace catalog listings, conversion rate optimization, and order fulfillment.',
      averageSalary: '₹5.0 - ₹9.5 LPA',
      demandLevel: 'Very High',
    },
    requiredSkills: ['E-commerce Store Operations', 'Data Analysis', 'Customer Experience Management'],
  },

  // Tourism & Hospitality
  {
    role: {
      id: 'role-hotel-ops',
      sector: 'Tourism & Hospitality',
      name: 'Hotel Operations Supervisor',
      description: 'Oversee guest concierge, guest relations, front desk, and hospitality standards.',
      averageSalary: '₹4.0 - ₹7.5 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Front Desk & Hotel Operations', 'Customer Experience Management', 'Communication', 'Teamwork'],
  },
  {
    role: {
      id: 'role-event-coord',
      sector: 'Tourism & Hospitality',
      name: 'Event Coordinator',
      description: 'Coordinate corporate conventions, weddings, logistics, and VIP hospitality services.',
      averageSalary: '₹4.5 - ₹8.0 LPA',
      demandLevel: 'High',
    },
    requiredSkills: ['Event Management & Protocol', 'Communication', 'Problem Solving', 'Teamwork'],
  },

  // Public Services
  {
    role: {
      id: 'role-pub-policy',
      sector: 'Public Services',
      name: 'Public Policy Assistant',
      description: 'Research citizen feedback, draft scheme briefs, and assist administrative heads.',
      averageSalary: '₹4.5 - ₹8.5 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Public Administration & Policy', 'Data Analysis', 'Communication', 'Excel'],
  },
  {
    role: {
      id: 'role-outreach-spec',
      sector: 'Public Services',
      name: 'Community Outreach Specialist',
      description: 'Liaise between civic bodies, welfare initiatives, and diverse neighborhood groups.',
      averageSalary: '₹4.0 - ₹7.0 LPA',
      demandLevel: 'Medium',
    },
    requiredSkills: ['Community Stakeholder Outreach', 'Communication', 'Teamwork', 'Problem Solving'],
  },
];

export const INITIAL_COURSES: Course[] = [
  // IT / CS Skills
  {
    id: 'crs-ml-mastery',
    name: 'Machine Learning Engineering & Core Algorithms',
    description: 'Learn supervised & unsupervised algorithms, feature engineering, scikit-learn, and model deployment in production.',
    skillId: 'sk-ml',
    skillName: 'Machine Learning',
    sector: 'IT & Software',
    duration: '4 Weeks (24 Hours)',
    difficulty: 'Intermediate',
    provider: 'National Skill Development Corp & IIT Madras AI Hub',
    rating: 4.9,
    enrolledCount: 14200,
    syllabus: [
      { id: 'l1', title: 'Foundations of Supervised Learning (Regression & Classification)', duration: '45 mins', summary: 'Linear regression, logistic classifiers, loss functions.' },
      { id: 'l2', title: 'Ensemble Methods: Random Forests & XGBoost', duration: '60 mins', summary: 'Gradient boosted decision trees and hyperparameter optimization.' },
      { id: 'l3', title: 'Model Evaluation, Cross-Validation & Metric Selection', duration: '50 mins', summary: 'ROC-AUC, Precision-Recall curves, F1 score and bias-variance tradeoff.' },
      { id: 'l4', title: 'Deploying ML Pipelines via FastAPI & Docker', duration: '60 mins', summary: 'Packaging trained models into scalable inference APIs.' },
    ],
  },
  {
    id: 'crs-stats-data',
    name: 'Practical Statistics & Probability for Tech & Analytics',
    description: 'Master hypothesis testing, normal distributions, p-values, regression modeling, and Bayesian inferences.',
    skillId: 'sk-stats',
    skillName: 'Statistics',
    sector: 'IT & Software',
    duration: '3 Weeks (18 Hours)',
    difficulty: 'Beginner',
    provider: 'Govt Tech Skill Alliance',
    rating: 4.8,
    enrolledCount: 18900,
    syllabus: [
      { id: 's1', title: 'Descriptive Statistics & Exploratory Data Analysis', duration: '40 mins', summary: 'Mean, median, standard deviations, quartiles, and boxplots.' },
      { id: 's2', title: 'Probability Distributions (Gaussian, Binomial, Poisson)', duration: '50 mins', summary: 'PDFs, CDFs, and the Central Limit Theorem.' },
      { id: 's3', title: 'Inferential Statistics & Hypothesis Testing (A/B Tests)', duration: '55 mins', summary: 'Z-tests, t-tests, ANOVA, and p-value interpretations.' },
    ],
  },
  {
    id: 'crs-dsa-mastery',
    name: 'Data Structures & Algorithmic Problem Solving',
    description: 'Deep dive into arrays, trees, graphs, dynamic programming, and asymptotic complexity analysis.',
    skillId: 'sk-dsa',
    skillName: 'Data Structures',
    sector: 'IT & Software',
    duration: '6 Weeks (36 Hours)',
    difficulty: 'Intermediate',
    provider: 'National Computing Academy',
    rating: 4.9,
    enrolledCount: 29500,
    syllabus: [
      { id: 'd1', title: 'Big-O Notation, Arrays, Strings & Two-Pointers', duration: '60 mins', summary: 'Time and space complexity with pointer optimizations.' },
      { id: 'd2', title: 'Linked Lists, Stacks, Queues & Hash Maps', duration: '60 mins', summary: 'Implementing fundamental dynamic memory structures.' },
      { id: 'd3', title: 'Binary Trees, BSTs, Heaps & Graph Traversals (BFS/DFS)', duration: '75 mins', summary: 'Tree balancing, topological sorts, and Dijkstra shortest path.' },
      { id: 'd4', title: 'Dynamic Programming & Memoization Patterns', duration: '80 mins', summary: '1D/2D DP arrays, knapsack, and longest common subsequence.' },
    ],
  },
  {
    id: 'crs-python-bootcamp',
    name: 'Python for Modern Software & Data Engineering',
    description: 'Learn Python syntax, OOP, virtual environments, file processing, requests, and testing frameworks.',
    skillId: 'sk-python',
    skillName: 'Python',
    sector: 'IT & Software',
    duration: '3 Weeks (20 Hours)',
    difficulty: 'Beginner',
    provider: 'Open Skills Initiative',
    rating: 4.8,
    enrolledCount: 42000,
    syllabus: [
      { id: 'p1', title: 'Core Syntax, Collections & Control Flow', duration: '45 mins', summary: 'Lists, dicts, tuples, comprehensions, and generators.' },
      { id: 'p2', title: 'Object-Oriented Programming & Modular Code', duration: '55 mins', summary: 'Classes, inheritance, dunder methods, and modules.' },
      { id: 'p3', title: 'Working with Files, APIs & JSON Data', duration: '50 mins', summary: 'HTTP requests, REST consuming, and data parsing.' },
    ],
  },
  {
    id: 'crs-sql-database',
    name: 'Mastering SQL & Relational Database Architecture',
    description: 'Query optimization, joins, indexing, transactions, window functions, and schema normalization.',
    skillId: 'sk-sql',
    skillName: 'SQL',
    sector: 'IT & Software',
    duration: '3 Weeks (16 Hours)',
    difficulty: 'Beginner',
    provider: 'Database Systems Consortium',
    rating: 4.9,
    enrolledCount: 31000,
    syllabus: [
      { id: 'sq1', title: 'Relational Model, CRUD & Multi-Table JOINs', duration: '45 mins', summary: 'INNER, LEFT, RIGHT, and FULL OUTER joins.' },
      { id: 'sq2', title: 'Aggregations, Grouping & HAVING Clauses', duration: '50 mins', summary: 'Summarizing and slicing transactional data.' },
      { id: 'sq3', title: 'Advanced Window Functions (RANK, PARTITION BY, LEAD/LAG)', duration: '60 mins', summary: 'Complex reporting and analytical calculations.' },
    ],
  },
  {
    id: 'crs-react-frontend',
    name: 'Modern Frontend with React & Modern JavaScript',
    description: 'Component architecture, state management, hooks, routing, and modern UI integration.',
    skillId: 'sk-react',
    skillName: 'React',
    sector: 'IT & Software',
    duration: '4 Weeks (22 Hours)',
    difficulty: 'Intermediate',
    provider: 'Frontend Engineers Guild',
    rating: 4.8,
    enrolledCount: 22000,
    syllabus: [
      { id: 'r1', title: 'React Core: Components, Props & JSX', duration: '50 mins', summary: 'Building atomic reusable components.' },
      { id: 'r2', title: 'Hooks Mastery: useState, useEffect, useMemo, useCallback', duration: '65 mins', summary: 'Managing side effects and state lifecycles.' },
      { id: 'r3', title: 'Client-Side Routing & Async Data Fetching', duration: '60 mins', summary: 'Handling transitions, loaders, and API states.' },
    ],
  },
  {
    id: 'crs-node-backend',
    name: 'Node.js & Express RESTful API Development',
    description: 'Build secure, scalable backends with middleware, JWT auth, database connectors, and logging.',
    skillId: 'sk-nodejs',
    skillName: 'Node.js',
    sector: 'IT & Software',
    duration: '3 Weeks (18 Hours)',
    difficulty: 'Intermediate',
    provider: 'Backend Developers Council',
    rating: 4.7,
    enrolledCount: 16500,
    syllabus: [
      { id: 'n1', title: 'Asynchronous JavaScript & Event Loop in Node', duration: '45 mins', summary: 'Promises, async/await, and non-blocking I/O.' },
      { id: 'n2', title: 'Express Routing, Middleware & Error Handlers', duration: '55 mins', summary: 'Structuring modular controllers and error propagation.' },
      { id: 'n3', title: 'Authentication, Security Headers & Rate Limiting', duration: '55 mins', summary: 'CORS, Helmet, token verification, and input validation.' },
    ],
  },
  {
    id: 'crs-cybersec-fund',
    name: 'Cybersecurity Fundamentals & Defense Strategies',
    description: 'Learn threat vectors, vulnerability assessment, cryptography, and network defense.',
    skillId: 'sk-cybersec',
    skillName: 'Cybersecurity Fundamentals',
    sector: 'IT & Software',
    duration: '4 Weeks (20 Hours)',
    difficulty: 'Beginner',
    provider: 'Cyber Defense Academy',
    rating: 4.8,
    enrolledCount: 12000,
    syllabus: [
      { id: 'c1', title: 'Threat Intelligence, Malware & OWASP Top 10', duration: '50 mins', summary: 'Understanding modern exploits and attack surfaces.' },
      { id: 'c2', title: 'Cryptography, Public Key Infrastructure & SSL/TLS', duration: '55 mins', summary: 'Symmetric/asymmetric encryption and certificate chains.' },
      { id: 'c3', title: 'Security Incident Response & Log Auditing', duration: '50 mins', summary: 'SIEM tools, incident playbooks, and mitigation.' },
    ],
  },

  // Finance & Business Skills
  {
    id: 'crs-fin-modeling',
    name: 'Financial Modeling & Valuation Valuation Workshop',
    description: 'Build 3-statement models, DCF valuations, scenario models, and sensitivity analyses.',
    skillId: 'sk-fin-modeling',
    skillName: 'Financial Modeling',
    sector: 'Banking & Finance',
    duration: '4 Weeks (20 Hours)',
    difficulty: 'Intermediate',
    provider: 'Chartered Financial Institute',
    rating: 4.9,
    enrolledCount: 9800,
    syllabus: [
      { id: 'fm1', title: '3-Statement Financial Modeling (P&L, Balance Sheet, Cash Flow)', duration: '60 mins', summary: 'Dynamic interlinking of core financial statements.' },
      { id: 'fm2', title: 'Discounted Cash Flow (DCF) & WACC Calculations', duration: '65 mins', summary: 'Cost of equity, debt weights, and terminal value modeling.' },
      { id: 'fm3', title: 'Sensitivity Tables & Scenario Managers', duration: '50 mins', summary: 'Stress testing models against macroeconomic variables.' },
    ],
  },
  {
    id: 'crs-corp-finance',
    name: 'Corporate Finance & Capital Structure',
    description: 'Master working capital management, dividend policy, capital budgeting, and financial risk.',
    skillId: 'sk-corp-finance',
    skillName: 'Corporate Finance',
    sector: 'Banking & Finance',
    duration: '3 Weeks (16 Hours)',
    difficulty: 'Beginner',
    provider: 'National Banking Institute',
    rating: 4.7,
    enrolledCount: 11400,
    syllabus: [
      { id: 'cf1', title: 'Capital Budgeting: NPV, IRR & Payback Period', duration: '45 mins', summary: 'Project evaluation and capital allocation strategies.' },
      { id: 'cf2', title: 'Working Capital & Liquidity Management', duration: '50 mins', summary: 'Cash conversion cycles and accounts receivable policies.' },
    ],
  },
  {
    id: 'crs-bi-tableau',
    name: 'Business Intelligence with Power BI & Tableau',
    description: 'Create executive dashboards, DAX queries, ETL transformations, and data stories.',
    skillId: 'sk-powerbi',
    skillName: 'Power BI & Tableau',
    sector: 'Banking & Finance',
    duration: '3 Weeks (16 Hours)',
    difficulty: 'Beginner',
    provider: 'Analytics Skill Hub',
    rating: 4.8,
    enrolledCount: 17200,
    syllabus: [
      { id: 'bi1', title: 'Data Ingestion & Power Query Transformations', duration: '45 mins', summary: 'Cleaning and reshaping raw records.' },
      { id: 'bi2', title: 'DAX Calculations & Interactive Visualizations', duration: '55 mins', summary: 'Measures, calculated columns, and KPI drill-downs.' },
    ],
  },

  // Manufacturing & Engineering
  {
    id: 'crs-six-sigma',
    name: 'Lean Six Sigma Green Belt Certification',
    description: 'DMAIC methodology, statistical process control, value stream mapping, and defect reduction.',
    skillId: 'sk-six-sigma',
    skillName: 'Six Sigma & Lean',
    sector: 'Manufacturing',
    duration: '4 Weeks (22 Hours)',
    difficulty: 'Intermediate',
    provider: 'Quality Excellence Council',
    rating: 4.8,
    enrolledCount: 13500,
    syllabus: [
      { id: 'ss1', title: 'DMAIC: Define, Measure, Analyze, Improve, Control', duration: '55 mins', summary: 'Systematic problem solving framework for plants.' },
      { id: 'ss2', title: 'Statistical Process Control (SPC) & Control Charts', duration: '50 mins', summary: 'Cp, Cpk, and process capability analysis.' },
    ],
  },
  {
    id: 'crs-cad-solidworks',
    name: 'Industrial AutoCAD & 3D SolidWorks Design',
    description: 'Parametric part modeling, assembly drawings, GD&T tolerancing, and sheet metal design.',
    skillId: 'sk-cad',
    skillName: 'AutoCAD & SolidWorks',
    sector: 'Manufacturing',
    duration: '5 Weeks (28 Hours)',
    difficulty: 'Intermediate',
    provider: 'Engineering Design Center',
    rating: 4.9,
    enrolledCount: 8900,
    syllabus: [
      { id: 'cad1', title: '2D Drafting, Geometric Dimensioning & Tolerancing (GD&T)', duration: '60 mins', summary: 'Creating standard technical blueprints.' },
      { id: 'cad2', title: '3D Parametric Part & Assembly Modeling', duration: '75 mins', summary: 'Extrusions, lofts, mates, and motion simulations.' },
    ],
  },

  // Healthcare
  {
    id: 'crs-ehr-systems',
    name: 'Electronic Health Records (EHR) & Clinical Workflows',
    description: 'Master clinical documentation, Epic/Cerner navigation, ICD-10 coding, and patient confidentiality.',
    skillId: 'sk-ehr',
    skillName: 'Electronic Health Records (EHR)',
    sector: 'Healthcare',
    duration: '3 Weeks (15 Hours)',
    difficulty: 'Beginner',
    provider: 'National Healthcare Training Board',
    rating: 4.7,
    enrolledCount: 7600,
    syllabus: [
      { id: 'ehr1', title: 'EHR Architecture, Patient Charting & Order Entry', duration: '45 mins', summary: 'Digital records navigation and lab result review.' },
      { id: 'ehr2', title: 'Medical Terminologies & Diagnostic Coding (ICD-10)', duration: '50 mins', summary: 'Standardized disease classification and billing codes.' },
    ],
  },
  {
    id: 'crs-biostats',
    name: 'Biostatistics & Clinical Trial Data Analysis',
    description: 'Survival curves, odds ratios, clinical sample sizing, and medical research methodology.',
    skillId: 'sk-health-stats',
    skillName: 'Biostatistics',
    sector: 'Healthcare',
    duration: '4 Weeks (20 Hours)',
    difficulty: 'Intermediate',
    provider: 'Health Sciences Institute',
    rating: 4.8,
    enrolledCount: 6200,
    syllabus: [
      { id: 'bs1', title: 'Clinical Trial Designs & Randomization', duration: '50 mins', summary: 'Double-blind, crossover, and observational studies.' },
      { id: 'bs2', title: 'Survival Analysis & Kaplan-Meier Estimation', duration: '55 mins', summary: 'Hazard ratios and longitudinal healthcare metrics.' },
    ],
  },

  // Soft Skills
  {
    id: 'crs-workplace-comm',
    name: 'High-Impact Workplace Communication & Presentation',
    description: 'Executive speaking, email etiquette, stakeholder alignment, and active listening in cross-functional teams.',
    skillId: 'sk-comm',
    skillName: 'Communication',
    duration: '2 Weeks (10 Hours)',
    difficulty: 'Beginner',
    provider: 'Professional Leadership Academy',
    rating: 4.9,
    enrolledCount: 38000,
    syllabus: [
      { id: 'cm1', title: 'Structuring Clear Executive Summaries & Emails', duration: '35 mins', summary: 'The Pyramid Principle and actionable workplace writing.' },
      { id: 'cm2', title: 'Presenting Technical Concepts to Non-Technical Audiences', duration: '45 mins', summary: 'Visual slide storytelling and handling Q&A under pressure.' },
    ],
  },
  {
    id: 'crs-problem-solving',
    name: 'Structured Problem Solving & Root-Cause Engineering',
    description: '5 Whys, Fishbone diagrams, First Principles thinking, and rapid prototyping under constraints.',
    skillId: 'sk-problem-solving',
    skillName: 'Problem Solving',
    duration: '2 Weeks (12 Hours)',
    difficulty: 'Beginner',
    provider: 'Global Innovation Hub',
    rating: 4.8,
    enrolledCount: 26000,
    syllabus: [
      { id: 'ps1', title: 'First Principles & Hypothesis-Driven Problem Breakdown', duration: '40 mins', summary: 'Deconstructing complex challenges into testable components.' },
      { id: 'ps2', title: 'Root-Cause Analysis & Decision Matrix Prioritization', duration: '45 mins', summary: 'Using impact vs. effort matrices and weighted decision scoring.' },
    ],
  },
  {
    id: 'crs-excel-pro',
    name: 'Advanced Microsoft Excel for Business & Data Analysis',
    description: 'VLOOKUP/XLOOKUP, Pivot Tables, Power Query, What-If Analysis, and Dashboard automation.',
    skillId: 'sk-excel',
    skillName: 'Excel',
    duration: '3 Weeks (15 Hours)',
    difficulty: 'Beginner',
    provider: 'Productivity Excellence Center',
    rating: 4.9,
    enrolledCount: 54000,
    syllabus: [
      { id: 'ex1', title: 'Dynamic Formulas: XLOOKUP, INDEX-MATCH, FILTER, UNIQUE', duration: '50 mins', summary: 'Modern array formulas and relational lookups.' },
      { id: 'ex2', title: 'Pivot Tables, Slicers & Dynamic Dashboard Design', duration: '55 mins', summary: 'Building automated multi-dimensional summary reports.' },
    ],
  },
  {
    id: 'crs-data-analysis',
    name: 'Exploratory Data Analysis with Pandas & Python',
    description: 'Data wrangling, cleaning dirty datasets, time-series analysis, and Seaborn data visual storytelling.',
    skillId: 'sk-data-analysis',
    skillName: 'Data Analysis',
    sector: 'IT & Software',
    duration: '3 Weeks (18 Hours)',
    difficulty: 'Beginner',
    provider: 'Data Science Academy',
    rating: 4.8,
    enrolledCount: 28000,
    syllabus: [
      { id: 'da1', title: 'Pandas DataFrames, Indexing & Data Cleansing', duration: '50 mins', summary: 'Handling missing values, types, and deduplication.' },
      { id: 'da2', title: 'Aggregations, Merges, Reshaping & Time-Series', duration: '60 mins', summary: 'Pivot tables, rolling averages, and date-time indexing.' },
      { id: 'da3', title: 'Visual Exploratory Analysis with Matplotlib & Seaborn', duration: '50 mins', summary: 'Heatmaps, pairplots, and distribution histograms.' },
    ],
  },
];

export const INITIAL_COMPANIES = [
  'ABC Technologies',
  'Tata Consultancy Services',
  'Infosys',
  'Wipro',
  'Google Cloud India',
  'Microsoft Corporation',
  'Amazon Development Centre',
  'Apollo Hospitals',
  'Fortis Healthcare',
  'HDFC Bank',
  'ICICI Bank',
  'Larsen & Toubro (L&T)',
  'Mahindra & Mahindra',
  'Tata Motors',
  'Reliance Retail',
  'Flipkart Logistics',
  'Delhivery',
  'ITC Agri-Business',
  'Taj Hotels & Resorts',
  'National Informatics Centre',
];

export const INITIAL_JOBS: Job[] = [
  // IT & Software Jobs
  {
    id: 'job-swe-abc',
    title: 'Software Developer (Associate)',
    company: 'ABC Technologies',
    sector: 'IT & Software',
    location: 'Hyderabad',
    jobType: 'Full-time',
    salary: '₹7.5 - ₹10.5 LPA',
    experienceRequired: '0 - 2 Years (Freshers Welcome)',
    description: 'Join our flagship cloud platforms engineering group to build high-scale distributed microservices.',
    responsibilities: [
      'Write clean, modular, and maintainable backend code in Java and SQL',
      'Optimize database queries and participate in weekly code reviews',
      'Collaborate with agile sprint teams to deliver product features',
    ],
    requiredSkills: ['Data Structures', 'Java', 'SQL', 'Git & Version Control', 'Problem Solving'],
    postedDate: '2026-08-20',
    openings: 5,
  },
  {
    id: 'job-aiml-google',
    title: 'Junior AI/ML Engineer',
    company: 'Google Cloud India',
    sector: 'IT & Software',
    location: 'Bengaluru / Hybrid',
    jobType: 'Full-time',
    salary: '₹12.0 - ₹18.0 LPA',
    experienceRequired: '0 - 1 Year',
    description: 'Work on cutting-edge generative AI, predictive models, and customer intelligence systems.',
    responsibilities: [
      'Develop machine learning models using Python, TensorFlow, and PyTorch',
      'Conduct statistical data exploration and feature engineering',
      'Deploy and monitor machine learning inference microservices',
    ],
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Structures'],
    postedDate: '2026-08-22',
    openings: 3,
  },
  {
    id: 'job-web-infy',
    title: 'Full Stack Web Developer',
    company: 'Infosys',
    sector: 'IT & Software',
    location: 'Pune / Remote',
    jobType: 'Full-time',
    salary: '₹6.0 - ₹9.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Build enterprise web portals and responsive customer journeys with modern React & Node.js stacks.',
    responsibilities: [
      'Implement accessible responsive UI views using React, HTML5, and CSS3',
      'Design RESTful API endpoints and integrate backend persistence',
      'Collaborate with UX designers and QA test automation engineers',
    ],
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    postedDate: '2026-08-24',
    openings: 8,
  },
  {
    id: 'job-data-tcs',
    title: 'Data Analyst Associate',
    company: 'Tata Consultancy Services',
    sector: 'IT & Software',
    location: 'Chennai / Hyderabad',
    jobType: 'Full-time',
    salary: '₹5.5 - ₹8.5 LPA',
    experienceRequired: '0 - 1 Year',
    description: 'Transform raw enterprise transactions into executive analytics and automated BI reports.',
    responsibilities: [
      'Write complex SQL queries and aggregate multi-terabyte transactional datasets',
      'Develop Python analytical scripts and automated Excel dashboards',
      'Present statistical summaries to client engagement directors',
    ],
    requiredSkills: ['SQL', 'Python', 'Data Analysis', 'Excel', 'Statistics'],
    postedDate: '2026-08-25',
    openings: 6,
  },
  {
    id: 'job-cyber-wipro',
    title: 'Cybersecurity Operations Analyst',
    company: 'Wipro',
    sector: 'IT & Software',
    location: 'Bengaluru',
    jobType: 'Full-time',
    salary: '₹6.5 - ₹10.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Monitor 24/7 Security Operations Center (SOC), investigate alerts, and harden network firewalls.',
    responsibilities: [
      'Triage SIEM threat alerts and perform root-cause vulnerability assessments',
      'Write Python automation scripts for routine security log audits',
      'Enforce cybersecurity compliance policies across internal endpoints',
    ],
    requiredSkills: ['Cybersecurity Fundamentals', 'Network Security', 'Python', 'Problem Solving'],
    postedDate: '2026-08-21',
    openings: 4,
  },

  // Manufacturing Jobs
  {
    id: 'job-prod-tatamotors',
    title: 'Graduate Production Engineer',
    company: 'Tata Motors',
    sector: 'Manufacturing',
    location: 'Pune Plant',
    jobType: 'Full-time',
    salary: '₹6.0 - ₹9.0 LPA',
    experienceRequired: '0 - 1 Year',
    description: 'Manage electric vehicle assembly lines, implement lean manufacturing, and maximize plant output.',
    responsibilities: [
      'Analyze CAD blueprints and optimize manufacturing cycle times',
      'Apply Lean Six Sigma techniques to reduce shop floor bottlenecks',
      'Ensure 100% adherence to industrial safety and environmental protocols',
    ],
    requiredSkills: ['AutoCAD & SolidWorks', 'Six Sigma & Lean', 'Industrial Safety Standards', 'Problem Solving'],
    postedDate: '2026-08-19',
    openings: 4,
  },
  {
    id: 'job-qa-mahindra',
    title: 'Quality Assurance Engineer',
    company: 'Mahindra & Mahindra',
    sector: 'Manufacturing',
    location: 'Nashik / Mumbai',
    jobType: 'Full-time',
    salary: '₹5.5 - ₹8.5 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Enforce automotive component tolerances and lead zero-defect quality programs.',
    responsibilities: [
      'Conduct statistical process control (SPC) and capability studies',
      'Lead root-cause analysis (8D/Fishbone) for supplier defect claims',
      'Manage Total Quality Management (TQM) documentation and audits',
    ],
    requiredSkills: ['Six Sigma & Lean', 'Total Quality Management', 'Statistics', 'Teamwork'],
    postedDate: '2026-08-23',
    openings: 3,
  },

  // Banking & Finance Jobs
  {
    id: 'job-fin-hdfc',
    title: 'Financial Analyst (Corporate Banking)',
    company: 'HDFC Bank',
    sector: 'Banking & Finance',
    location: 'Mumbai / BKC',
    jobType: 'Full-time',
    salary: '₹7.0 - ₹12.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Perform credit appraisal, build dynamic DCF valuation models, and prepare syndicate loan pitches.',
    responsibilities: [
      'Construct detailed 3-statement financial models and sensitivity matrices',
      'Design Power BI executive dashboards for senior credit committee reviews',
      'Analyze corporate balance sheets, debt service ratios, and macroeconomic trends',
    ],
    requiredSkills: ['Financial Modeling', 'Corporate Finance', 'Excel', 'Power BI & Tableau', 'Statistics'],
    postedDate: '2026-08-24',
    openings: 5,
  },
  {
    id: 'job-bank-icici',
    title: 'Banking Associate - Wealth & Retail',
    company: 'ICICI Bank',
    sector: 'Banking & Finance',
    location: 'New Delhi / Gurgaon',
    jobType: 'Full-time',
    salary: '₹5.0 - ₹8.0 LPA',
    experienceRequired: '0 - 1 Year',
    description: 'Manage retail banking client relationships, deposit portfolios, and credit operations.',
    responsibilities: [
      'Deliver consultative financial advice and cross-sell banking products',
      'Evaluate retail loan applications according to strict compliance standards',
      'Manage branch ledger reconciliation and customer communications',
    ],
    requiredSkills: ['Corporate Finance', 'Accounting Principles (GAAP)', 'Communication', 'Excel'],
    postedDate: '2026-08-25',
    openings: 7,
  },

  // Healthcare Jobs
  {
    id: 'job-health-apollo',
    title: 'Healthcare Operations & Data Analyst',
    company: 'Apollo Hospitals',
    sector: 'Healthcare',
    location: 'Hyderabad / Chennai',
    jobType: 'Full-time',
    salary: '₹6.0 - ₹10.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Drive clinical process improvements, patient flow analytics, and EHR data governance.',
    responsibilities: [
      'Extract clinical records and conduct biostatistical trend analysis',
      'Work with medical directors to reduce average length of stay (ALOS)',
      'Ensure EHR database security and HIPAA compliance standard operating procedures',
    ],
    requiredSkills: ['Biostatistics', 'Electronic Health Records (EHR)', 'Data Analysis', 'SQL'],
    postedDate: '2026-08-22',
    openings: 3,
  },
  {
    id: 'job-admin-fortis',
    title: 'Healthcare Administrator Trainee',
    company: 'Fortis Healthcare',
    sector: 'Healthcare',
    location: 'Noida / NCR',
    jobType: 'Full-time',
    salary: '₹5.0 - ₹8.0 LPA',
    experienceRequired: '0 - 1 Year',
    description: 'Coordinate patient admissions, insurance desk operations, and medical compliance.',
    responsibilities: [
      'Manage digital EHR registrations and insurance pre-authorizations',
      'Coordinate inter-departmental staffing schedules and patient feedback loops',
      'Prepare monthly operational expense statements in Excel',
    ],
    requiredSkills: ['Healthcare Compliance & HIPAA', 'Electronic Health Records (EHR)', 'Communication', 'Excel'],
    postedDate: '2026-08-20',
    openings: 4,
  },

  // Construction & Civil
  {
    id: 'job-civil-lt',
    title: 'Civil Site Engineer (Infrastructure Projects)',
    company: 'Larsen & Toubro (L&T)',
    sector: 'Construction',
    location: 'Ahmedabad / Mumbai',
    jobType: 'Full-time',
    salary: '₹5.5 - ₹9.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Supervise metro rail & bridge construction, verify bill of quantities (BOQ), and enforce site safety.',
    responsibilities: [
      'Oversee day-to-day site concreting, reinforcement, and structural erection',
      'Verify contractor measurement sheets and prepare cost estimation reports',
      'Resolve site structural clashes in coordination with design consultants',
    ],
    requiredSkills: ['Civil Site Supervision', 'Cost Estimation & BOQ', 'Problem Solving', 'Teamwork'],
    postedDate: '2026-08-18',
    openings: 5,
  },

  // Logistics
  {
    id: 'job-log-delhivery',
    title: 'Supply Chain Operations Analyst',
    company: 'Delhivery',
    sector: 'Logistics',
    location: 'Gurgaon / Bengaluru',
    jobType: 'Full-time',
    salary: '₹6.0 - ₹10.0 LPA',
    experienceRequired: '0 - 2 Years',
    description: 'Optimize pan-India middle-mile logistics networks, route forecasting, and automated sorting centers.',
    responsibilities: [
      'Build predictive inventory demand and line-haul turnaround models in Excel & SQL',
      'Optimize hub sorting efficiency and decrease shipment transit variances',
      'Present weekly logistics KPI reports to senior operations managers',
    ],
    requiredSkills: ['Supply Chain Operations', 'Inventory Forecasting', 'Data Analysis', 'Excel'],
    postedDate: '2026-08-21',
    openings: 6,
  },
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr-1',
    userId: 'usr-trainer-1',
    name: 'Dr. Rajesh Nair',
    email: 'rajesh.nair@trainer.gov.in',
    specialization: 'Artificial Intelligence & Machine Learning',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'tr-2',
    userId: 'usr-trainer-2',
    name: 'Sunita Mehra',
    email: 'sunita.mehra@trainer.gov.in',
    specialization: 'Lean Manufacturing & Six Sigma Quality',
    createdAt: '2026-01-15T11:30:00.000Z',
  },
  {
    id: 'tr-3',
    userId: 'usr-trainer-3',
    name: 'Anand Kulkarni',
    email: 'anand.kulkarni@trainer.gov.in',
    specialization: 'Financial Modeling & Enterprise Risk Management',
    createdAt: '2026-02-01T09:15:00.000Z',
  },
];

export const INITIAL_PROJECTS: RealWorldProject[] = [
  // ==========================================
  // IT & SOFTWARE - AI/ML Engineer
  // ==========================================
  {
    id: 'proj-aiml-1',
    title: 'End-to-End Customer Churn Predictive Classification Pipeline',
    description:
      'Train, cross-validate, and deploy a supervised machine learning classification pipeline with exploratory statistical analysis, feature engineering, and model explainability (SHAP).',
    sector: 'IT & Software',
    role: 'AI/ML Engineer',
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Analysis'],
    difficulty: 'Intermediate',
    whyRelevant:
      'AI/ML Engineers routinely design supervised predictive pipelines that forecast enterprise attrition and provide feature importance metrics to stakeholders.',
    deliverables: [
      'Exploratory data analysis and collinearity check in Python',
      'Trained XGBoost / Random Forest classifier with ROC-AUC evaluation',
      'SHAP value feature explainability plots and business mitigation report',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-aiml-2',
    title: 'Real-Time Image Defect Classification & Fast Inference API',
    description:
      'Construct a Convolutional Neural Network (CNN) image classification model and expose high-throughput REST inference endpoints for automated quality inspection.',
    sector: 'IT & Software',
    role: 'AI/ML Engineer',
    skills: ['Python', 'Machine Learning', 'APIs', 'Data Structures'],
    difficulty: 'Advanced',
    whyRelevant:
      'Validates your ability to take a trained computer vision model and serve real-time predictions via production-ready API interfaces.',
    deliverables: [
      'Transfer learning pipeline with PyTorch/TensorFlow',
      'FastAPI / Flask inference service with image preprocessing',
      'Benchmarked latency, throughput, and error boundary handling',
    ],
    estimatedDuration: '6 - 8 hours',
  },
  {
    id: 'proj-aiml-3',
    title: 'Streaming Time-Series Anomaly Detection & Alert Engine',
    description:
      'Develop an unsupervised machine learning model to detect system outliers and unexpected traffic spikes in live streaming server telemetry.',
    sector: 'IT & Software',
    role: 'AI/ML Engineer',
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Structures'],
    difficulty: 'Advanced',
    whyRelevant:
      'Highlights strong statistical foundation in probability distributions, rolling z-score analysis, and unsupervised clustering algorithms.',
    deliverables: [
      'Statistical baseline modeling and Isolation Forest algorithm',
      'Dynamic threshold calculation for anomaly alerts',
      'Interactive dashboard visualizer for flagged data points',
    ],
    estimatedDuration: '5 - 7 hours',
  },

  // ==========================================
  // IT & SOFTWARE - Data Analyst
  // ==========================================
  {
    id: 'proj-da-1',
    title: 'Multi-Channel E-Commerce Sales & Revenue Intelligence Dashboard',
    description:
      'Clean complex transaction datasets, execute advanced multi-table relational SQL queries, and construct an interactive executive BI dashboard analyzing cohort retention and margin trends.',
    sector: 'IT & Software',
    role: 'Data Analyst',
    skills: ['SQL', 'Data Analysis', 'Statistics', 'Excel'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Data Analysts are expected to extract actionable revenue drivers, calculate customer lifetime value, and present insights via clear interactive visuals.',
    deliverables: [
      'Relational schema design and CTE/Window SQL analytical queries',
      'Customer cohort retention matrix and monthly recurring revenue breakdown',
      'Executive KPI presentation summary with actionable optimization takeaways',
    ],
    estimatedDuration: '3 - 5 hours',
  },
  {
    id: 'proj-da-2',
    title: 'Customer Behavioral Segmentation & RFM Clustering Study',
    description:
      'Perform exploratory data analysis and Recency-Frequency-Monetary (RFM) clustering in Python to classify customer groups into distinct behavioral tiers.',
    sector: 'IT & Software',
    role: 'Data Analyst',
    skills: ['Python', 'Data Analysis', 'Statistics', 'SQL'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Demonstrates applied statistical distributions, data wrangling with Pandas, and translating statistical clusters into commercial growth strategies.',
    deliverables: [
      'Automated RFM score generation script in Python',
      'Statistical distribution plots and percentile boundary definitions',
      'Marketing campaign targeting recommendations for each customer segment',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-da-3',
    title: 'Business Performance & Churn Diagnostic Report',
    description:
      'Aggregate multi-quarter business metrics, calculate unit economics, and formulate root-cause statistical breakdowns for executive decision-makers.',
    sector: 'IT & Software',
    role: 'Data Analyst',
    skills: ['SQL', 'Data Analysis', 'Statistics', 'Problem Solving'],
    difficulty: 'Beginner',
    whyRelevant:
      'Tests core analytical problem solving, data hygiene, and the ability to formulate statistical hypotheses to solve business bottlenecks.',
    deliverables: [
      'Structured root-cause diagnostic workbook',
      'Variance analysis across product categories and regions',
      'One-page strategic executive summary memo',
    ],
    estimatedDuration: '3 - 4 hours',
  },

  // ==========================================
  // IT & SOFTWARE - Software Developer
  // ==========================================
  {
    id: 'proj-swe-1',
    title: 'Scalable Distributed Task Scheduler & REST Backend Engine',
    description:
      'Build a robust, multi-threaded backend service utilizing optimal data structures, relational database indexing, and transactional integrity under concurrent load.',
    sector: 'IT & Software',
    role: 'Software Developer',
    skills: ['Java', 'Data Structures', 'SQL', 'Git & Version Control', 'Problem Solving'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Software Developers must write maintainable, algorithmic code that manages database transactions and handles concurrent background jobs smoothly.',
    deliverables: [
      'Core priority queue and thread pool task worker implementation in Java',
      'Relational database schema with optimized indexing and foreign keys',
      'Comprehensive unit and integration test suite with Git commit history',
    ],
    estimatedDuration: '5 - 7 hours',
  },
  {
    id: 'proj-swe-2',
    title: 'High-Performance In-Memory Cache & Query Optimization Service',
    description:
      'Implement an LRU (Least Recently Used) caching mechanism with O(1) read/write complexity and seamless fallback to a persistent relational SQL store.',
    sector: 'IT & Software',
    role: 'Software Developer',
    skills: ['Java', 'Data Structures', 'SQL', 'Git & Version Control'],
    difficulty: 'Advanced',
    whyRelevant:
      'Demonstrates advanced mastery of hash map + doubly linked list data structures, caching policies, and database query profiling.',
    deliverables: [
      'Custom generic LRU cache with eviction policies and synchronization',
      'Benchmark comparison showing latency drop across 10,000 requests',
      'Documented API endpoints with Swagger/OpenAPI specifications',
    ],
    estimatedDuration: '4 - 6 hours',
  },

  // ==========================================
  // IT & SOFTWARE - Web Developer
  // ==========================================
  {
    id: 'proj-web-1',
    title: 'Modern Cloud Workspace & Responsive SaaS Application',
    description:
      'Develop a full-featured single-page application with modular component hierarchy, client-side state management, and seamless RESTful API communication.',
    sector: 'IT & Software',
    role: 'Web Developer',
    skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'APIs'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Web Developers must build responsive, accessible web interfaces that interact cleanly with asynchronous backend API services.',
    deliverables: [
      'Responsive React frontend with component-driven styling',
      'REST API backend endpoints for CRUD resource management',
      'Optimized client-side caching and responsive mobile layout',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-web-2',
    title: 'Interactive Real-Time Analytics & Workflow Kanban Board',
    description:
      'Build a drag-and-drop workflow tracking board with state persistence, interactive data filtering, and responsive CSS grid styling.',
    sector: 'IT & Software',
    role: 'Web Developer',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'APIs'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Showcases DOM interaction patterns, complex React state updates, and intuitive user experience design.',
    deliverables: [
      'Drag-and-drop state manager with optimistic UI updates',
      'Search and multi-tag filtering component',
      'Persistent local and remote server synchronization',
    ],
    estimatedDuration: '3 - 5 hours',
  },

  // ==========================================
  // IT & SOFTWARE - Cybersecurity Analyst
  // ==========================================
  {
    id: 'proj-cyber-1',
    title: 'Enterprise Threat Hunting & Network Intrusion Detection Lab',
    description:
      'Analyze network packet captures (PCAPs), detect malicious reconnaissance signatures, and draft an incident response containment blueprint.',
    sector: 'IT & Software',
    role: 'Cybersecurity Analyst',
    skills: ['Cybersecurity Fundamentals', 'Network Security', 'Problem Solving'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Cybersecurity Analysts must parse network traffic, identify unauthorized port scanning, and implement defensive perimeter rules.',
    deliverables: [
      'PCAP traffic analysis report identifying infected host IPs',
      'Snort / Suricata signature detection rules for zero-day payloads',
      'Formal cybersecurity incident mitigation and hardening strategy',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-cyber-2',
    title: 'Automated Security Posture & Vulnerability Scanner',
    description:
      'Construct an automated script to audit open service ports, flag unpatched software versions, and generate a prioritized remediation report.',
    sector: 'IT & Software',
    role: 'Cybersecurity Analyst',
    skills: ['Cybersecurity Fundamentals', 'Network Security', 'Python'],
    difficulty: 'Advanced',
    whyRelevant:
      'Combines scripting automation with vulnerability classification to secure corporate networks proactively.',
    deliverables: [
      'Modular network scanner with configurable CIDR subnet ranges',
      'CVE risk ranking scoring engine based on CVSS benchmarks',
      'Automated PDF/Markdown compliance audit report generator',
    ],
    estimatedDuration: '5 - 7 hours',
  },

  // ==========================================
  // MANUFACTURING - Production Engineer
  // ==========================================
  {
    id: 'proj-mfg-pe-1',
    title: 'Assembly Line Balancing & Lean DMAIC Bottleneck Reduction',
    description:
      'Apply Lean Manufacturing principles and Six Sigma DMAIC methodology to map a value stream, identify line bottlenecks, and reduce assembly cycle times.',
    sector: 'Manufacturing',
    role: 'Production Engineer',
    skills: ['Lean Manufacturing', 'Six Sigma & Lean', 'Quality Control', 'GD&T'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Production Engineers are tasked with maximizing shop-floor throughput, reducing work-in-progress (WIP), and ensuring dimensional quality.',
    deliverables: [
      'Current vs Future State Value Stream Map (VSM)',
      'Takt time calculation and workstation line balancing chart',
      'Standard Operating Procedure (SOP) documentation with Poka-Yoke safeguards',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-mfg-pe-2',
    title: 'Automated PLC Conveyor & Safety Interlock Sequencing Testbench',
    description:
      'Design ladder logic programs for a multi-station automated sorting conveyor with optical sensor triggers and emergency stop interlocks.',
    sector: 'Manufacturing',
    role: 'Production Engineer',
    skills: ['PLC & SCADA Systems', 'Industrial Safety Standards', 'Mechanical Design'],
    difficulty: 'Advanced',
    whyRelevant:
      'Validates PLC programming competency, machine integration, and adherence to industrial safety standards.',
    deliverables: [
      'IEC 61131-3 compliant Ladder Logic routine with timer/counter blocks',
      'I/O mapping sheet and electrical wiring schematic',
      'Safety hazard analysis conforming to industrial ISO/OSHA protocols',
    ],
    estimatedDuration: '5 - 7 hours',
  },

  // ==========================================
  // MANUFACTURING - Quality Engineer
  // ==========================================
  {
    id: 'proj-mfg-qe-1',
    title: 'Statistical Process Control (SPC) & Six Sigma Defect Elimination',
    description:
      'Establish X-bar and R control charts, calculate process capability (Cp/Cpk), and conduct root cause analysis for machined components.',
    sector: 'Manufacturing',
    role: 'Quality Engineer',
    skills: ['Six Sigma & Lean', 'Quality Control', 'GD&T', 'Total Quality Management'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Quality Engineers rely on statistical control charts to detect process shifts before out-of-spec scrap is produced.',
    deliverables: [
      'SPC control charts with upper and lower control limits (UCL/LCL)',
      'Process capability index report (Cp, Cpk > 1.33 verification)',
      'Fishbone (Ishikawa) diagram and 5-Why corrective action plan (CAPA)',
    ],
    estimatedDuration: '4 - 5 hours',
  },

  // ==========================================
  // HEALTHCARE - Healthcare Data Analyst
  // ==========================================
  {
    id: 'proj-hc-hda-1',
    title: 'Clinical Patient Flow & 30-Day Hospital Readmission Risk Model',
    description:
      'Analyze anonymized Electronic Health Records (EHR) and biometric telemetry data to evaluate predictors of 30-day emergency readmission.',
    sector: 'Healthcare',
    role: 'Healthcare Data Analyst',
    skills: ['Electronic Health Records (EHR)', 'Biostatistics', 'Medical Terminology', 'Healthcare Compliance & HIPAA'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Healthcare Data Analysts evaluate clinical metrics to enhance patient care outcomes while upholding HIPAA data governance.',
    deliverables: [
      'EHR cohort extraction and data de-identification pipeline',
      'Biostatistical logistic regression model evaluating risk odds ratios',
      'Clinical executive dashboard highlighting vulnerable patient profiles',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-hc-hda-2',
    title: 'Clinical Trial Survival Analysis & Treatment Efficacy Study',
    description:
      'Perform Kaplan-Meier survival curves and hypothesis tests across treatment and control patient groups in a multi-phase trial.',
    sector: 'Healthcare',
    role: 'Healthcare Data Analyst',
    skills: ['Biostatistics', 'Electronic Health Records (EHR)', 'Clinical Documentation'],
    difficulty: 'Advanced',
    whyRelevant:
      'Crucial for pharmaceutical and clinical research analytics to establish statistically significant therapeutic efficacy.',
    deliverables: [
      'Survival curve calculations and log-rank statistical test results',
      'Hazard ratio estimation with 95% confidence intervals',
      'Standardized clinical trial summary document for regulatory review',
    ],
    estimatedDuration: '5 - 7 hours',
  },

  // ==========================================
  // BANKING & FINANCE - Financial Analyst
  // ==========================================
  {
    id: 'proj-bf-fa-1',
    title: 'Dynamic Discounted Cash Flow (DCF) Valuation & Sensitivity Model',
    description:
      'Construct a 3-statement financial model, estimate Weighted Average Cost of Capital (WACC), and run multi-scenario sensitivity tables for an enterprise acquisition.',
    sector: 'Banking & Finance',
    role: 'Financial Analyst',
    skills: ['Financial Modeling', 'Financial Analysis', 'Corporate Finance', 'Excel'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Financial Analysts must develop dynamic valuation models that support corporate budgeting, M&A appraisals, and investor presentations.',
    deliverables: [
      'Fully linked Income Statement, Balance Sheet, and Cash Flow model',
      'Unlevered Free Cash Flow (UFCF) projection and terminal value calculation',
      '2D sensitivity matrix analyzing EBITDA margins vs WACC fluctuations',
    ],
    estimatedDuration: '4 - 6 hours',
  },
  {
    id: 'proj-bf-fa-2',
    title: 'Portfolio Value at Risk (VaR) & Macro Stress Testing Framework',
    description:
      'Quantify portfolio risk distributions, calculate historical and parametric Value at Risk (VaR), and stress test assets against market shocks.',
    sector: 'Banking & Finance',
    role: 'Financial Analyst',
    skills: ['Financial Analysis', 'Financial Modeling', 'Corporate Finance', 'Excel'],
    difficulty: 'Advanced',
    whyRelevant:
      'Demonstrates portfolio risk management, volatility modeling, and hedging strategy assessment for institutional asset managers.',
    deliverables: [
      'Variance-covariance matrix and historical 99% VaR calculations',
      'Stress testing simulation modeling interest rate and currency shocks',
      'Risk-adjusted capital allocation recommendations',
    ],
    estimatedDuration: '4 - 6 hours',
  },

  // ==========================================
  // AGRICULTURE - Agri-Tech Specialist
  // ==========================================
  {
    id: 'proj-ag-ats-1',
    title: 'Multispectral Drone NDVI Crop Health & Precision Irrigation System',
    description:
      'Process spatial multispectral drone imagery to calculate Normalized Difference Vegetation Index (NDVI) and formulate precision irrigation zones.',
    sector: 'Agriculture',
    role: 'Agri-Tech Specialist',
    skills: ['GIS & Drone Mapping', 'Precision Agriculture Tools', 'Agricultural Technology', 'Soil & Crop Science'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Agri-Tech specialists combine spatial data and IoT sensor telemetry to maximize crop yields and conserve water resources.',
    deliverables: [
      'NDVI crop stress heatmaps across farm zones',
      'Variable-rate irrigation schedule based on soil moisture data',
      'Cost-benefit economic yield forecast report',
    ],
    estimatedDuration: '4 - 5 hours',
  },

  // ==========================================
  // CONSTRUCTION - Civil Site Engineer
  // ==========================================
  {
    id: 'proj-cn-cse-1',
    title: 'Reinforced Concrete Structural Load Analysis & BOQ Estimation',
    description:
      'Perform dead and live structural load analysis for a multi-story commercial building and compile a detailed Bill of Quantities (BOQ).',
    sector: 'Construction',
    role: 'Civil Site Engineer',
    skills: ['Structural Analysis (STAAD)', 'Cost Estimation & BOQ', 'Civil Site Supervision'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Civil engineers must ensure structural stability under standard load codes while forecasting material costs and construction timelines accurately.',
    deliverables: [
      'Shear force and bending moment calculations across key structural members',
      'Itemized Bill of Quantities (BOQ) with material rate analysis',
      'Site safety supervision checklist and quality assurance protocol',
    ],
    estimatedDuration: '4 - 6 hours',
  },

  // ==========================================
  // LOGISTICS - Supply Chain Analyst
  // ==========================================
  {
    id: 'proj-lg-sca-1',
    title: 'Multi-Echelon Inventory Demand Forecasting & Route Optimization',
    description:
      'Forecast safety stock requirements and model line-haul distribution routes across national fulfillment hubs to minimize transit delays.',
    sector: 'Logistics',
    role: 'Supply Chain Analyst',
    skills: ['Supply Chain Operations', 'Inventory Forecasting', 'Data Analysis', 'Excel'],
    difficulty: 'Intermediate',
    whyRelevant:
      'Logistics analysts balance inventory holding costs against stockout risks and transportation turnaround times.',
    deliverables: [
      'Safety stock and reorder point model with lead-time variability',
      'Hub-and-spoke transportation route cost matrix',
      'Supply chain resilience and supplier SLA scorecard',
    ],
    estimatedDuration: '4 - 5 hours',
  },

  // ==========================================
  // RETAIL - E-commerce Specialist / Retail Operations
  // ==========================================
  {
    id: 'proj-rt-ecs-1',
    title: 'Omnichannel Merchandising & Digital Checkout Conversion Audit',
    description:
      'Analyze customer cart abandonment bottlenecks, evaluate visual product placement, and implement a digital checkout conversion plan.',
    sector: 'Retail',
    role: 'E-commerce Specialist',
    skills: ['E-commerce Store Operations', 'Customer Experience Management', 'Data Analysis'],
    difficulty: 'Beginner',
    whyRelevant:
      'Prepares retail specialists to boost store conversion rates, improve visual merchandising, and streamline checkout operations.',
    deliverables: [
      'Funnel drop-off diagnostic analysis with checkout optimization tactics',
      'A/B test design for visual merchandising layout',
      'Customer lifetime value (LTV) and repurchase rate strategy',
    ],
    estimatedDuration: '3 - 4 hours',
  },

  // ==========================================
  // TOURISM & HOSPITALITY - Hotel Operations Supervisor
  // ==========================================
  {
    id: 'proj-th-hos-1',
    title: 'Dynamic RevPAR Room Yield & Front Desk Service Blueprint',
    description:
      'Model seasonal room occupancy rates, configure dynamic pricing tiers, and design a high-touch front desk guest satisfaction workflow.',
    sector: 'Tourism & Hospitality',
    role: 'Hotel Operations Supervisor',
    skills: ['Front Desk & Hotel Operations', 'Food & Beverage Service', 'Event Management & Protocol'],
    difficulty: 'Beginner',
    whyRelevant:
      'Hospitality leaders must balance revenue management with guest satisfaction and flawless front-of-house operations.',
    deliverables: [
      'RevPAR yield spreadsheet with occupancy and rate tiers',
      'Front desk standard operating procedure (SOP) manual',
      'Guest feedback resolution and service recovery protocol',
    ],
    estimatedDuration: '3 - 4 hours',
  },

  // ==========================================
  // PUBLIC SERVICES - Public Policy Assistant
  // ==========================================
  {
    id: 'proj-ps-ppa-1',
    title: 'Municipal Civic Service Delivery & Demographic Policy Brief',
    description:
      'Synthesize regional demographic datasets, draft a citizen welfare policy brief, and verify compliance with public regulatory frameworks.',
    sector: 'Public Services',
    role: 'Public Policy Assistant',
    skills: ['Public Administration & Policy', 'Community Stakeholder Outreach', 'Regulatory & RTI Compliance'],
    difficulty: 'Beginner',
    whyRelevant:
      'Public Policy professionals synthesize demographic data into actionable civic policy recommendations and regulatory compliance briefs.',
    deliverables: [
      'Evidence-based public policy memo with stakeholder impact assessment',
      'Citizen grievance redressal workflow map',
      'Transparency and RTI compliance documentation guide',
    ],
    estimatedDuration: '3 - 5 hours',
  },
];
