import { Mission, Project, DonationRecord, UserProfile, UserRole, ImpactStory, OrgStats, FieldDispatch, WorkAssignment, TeamMember, OrganizationInfo } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  totalContribution: 25000,
  volunteerHours: 50,
  volunteerLevel: 'Gold Volunteer',
  volunteerNextTierHours: 75,
  phone: '+91 98765 43210',
  taxId: 'ABCDE1234F',
  currency: '₹',
  role: 'donor',
  title: 'Generous Donor & Community Patron'
};

export const ADMIN_USER: UserProfile = {
  name: 'Amarjeet Kumar',
  email: 'amar@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  totalContribution: 250000,
  volunteerHours: 420,
  volunteerLevel: 'Founder & National Managing Director',
  volunteerNextTierHours: 500,
  phone: '+91 94729 29856',
  taxId: 'TRUST9876A',
  currency: '₹',
  role: 'admin',
  title: 'Founder & National Managing Director (HELPS Welfare Society)'
};

export const MANAGEMENT_USER: UserProfile = {
  name: 'Priya Sharma',
  email: 'priya.mgmt@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  totalContribution: 45000,
  volunteerHours: 210,
  volunteerLevel: 'Field Operations Manager',
  volunteerNextTierHours: 300,
  phone: '+91 62837 77177',
  taxId: 'MGMT7788P',
  currency: '₹',
  role: 'management',
  title: 'Field Operations & Regional Logistics Manager'
};

export const MANAGEMENT_USER_MED: UserProfile = {
  name: 'Dr. Arvind Mehta',
  email: 'arvind.health@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  totalContribution: 60000,
  volunteerHours: 195,
  volunteerLevel: 'Medical Mission Lead',
  volunteerNextTierHours: 250,
  phone: '+91 94729 29856',
  taxId: 'DOC6655A',
  currency: '₹',
  role: 'management',
  title: 'Healthcare Initiatives & Clinical Van Lead'
};

export const GUEST_USER: UserProfile = {
  name: 'Guest Supporter',
  email: 'guest@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  totalContribution: 0,
  volunteerHours: 0,
  volunteerLevel: 'Guest Visitor',
  volunteerNextTierHours: 25,
  phone: '+91 94729 29856',
  taxId: 'PAN-GUEST-0000',
  currency: '₹',
  role: 'guest',
  title: 'Guest Community Explorer'
};

export const VOLUNTEER_USER: UserProfile = {
  name: 'Rahul Verma',
  email: 'volunteer@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  totalContribution: 5000,
  volunteerHours: 85,
  volunteerLevel: 'Platinum Field Volunteer',
  volunteerNextTierHours: 100,
  phone: '+91 62837 77177',
  taxId: 'VOLUN7890B',
  currency: '₹',
  role: 'volunteer',
  title: 'GNDEC Student Chapter Lead & AABHA Mentor'
};

export const VOLUNTEER_USER_SANYA: UserProfile = {
  name: 'Sanya Patel',
  email: 'sanya.vol@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  totalContribution: 8000,
  volunteerHours: 64,
  volunteerLevel: 'Senior STEM Mentor',
  volunteerNextTierHours: 75,
  phone: '+91 94729 29856',
  taxId: 'VOLUN8891S',
  currency: '₹',
  role: 'volunteer',
  title: 'AABHA Digital Literacy & Classroom Mentor'
};

export const FINANCE_USER: UserProfile = {
  name: 'Rajesh Singhania',
  email: 'finance@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  totalContribution: 120000,
  volunteerHours: 140,
  volunteerLevel: 'Finance & Statutory Compliance Officer',
  volunteerNextTierHours: 200,
  phone: '+91 98111 22334',
  taxId: 'FIN9988C',
  currency: '₹',
  role: 'finance',
  title: 'Chief Financial Officer & 80G Statutory Auditor'
};

export const CONTENT_MANAGER_USER: UserProfile = {
  name: 'Meera Deshmukh',
  email: 'content@helpsngo.in',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  totalContribution: 15000,
  volunteerHours: 110,
  volunteerLevel: 'Media & Field Communications Lead',
  volunteerNextTierHours: 150,
  phone: '+91 97222 33445',
  taxId: 'MED4433X',
  currency: '₹',
  role: 'content_manager',
  title: 'Content Strategy & Child Safeguarding Communications Officer'
};

export const APPLICANT_USER: UserProfile = {
  name: 'Simran Kaur',
  email: 'simran.kaur@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  totalContribution: 0,
  volunteerHours: 0,
  volunteerLevel: 'Applicant (Under Review)',
  volunteerNextTierHours: 10,
  phone: '+91 98765 43210',
  taxId: 'PAN-PENDING-APP',
  currency: '₹',
  role: 'volunteer_applicant',
  title: 'Prospective Volunteer (Awaiting Trustee Verification)',
  volunteerApplicationStatus: 'pending_review'
};

export interface SeedCredential {
  email: string;
  password: string;
  role: UserRole;
  userProfile: UserProfile;
}

export const SEEDED_ACCOUNTS: SeedCredential[] = [
  {
    email: 'amar@helpsngo.in',
    password: 'Amarjeetkumar@12345',
    role: 'admin',
    userProfile: ADMIN_USER
  },
  {
    email: 'admin@helpsngo.in',
    password: 'Amarjeetkumar@12345',
    role: 'admin',
    userProfile: ADMIN_USER
  },
  {
    email: 'helpsngoteam@gmail.com',
    password: 'Amarjeetkumar@12345',
    role: 'admin',
    userProfile: ADMIN_USER
  },
  {
    email: 'priya.mgmt@helpsngo.in',
    password: 'mgmt123',
    role: 'program_manager',
    userProfile: MANAGEMENT_USER
  },
  {
    email: 'arvind.health@helpsngo.in',
    password: 'mgmt123',
    role: 'program_manager',
    userProfile: MANAGEMENT_USER_MED
  },
  {
    email: 'finance@helpsngo.in',
    password: 'fin123',
    role: 'finance',
    userProfile: FINANCE_USER
  },
  {
    email: 'content@helpsngo.in',
    password: 'content123',
    role: 'content_manager',
    userProfile: CONTENT_MANAGER_USER
  },
  {
    email: 'alex.johnson@example.com',
    password: 'donor123',
    role: 'donor',
    userProfile: INITIAL_USER
  },
  {
    email: 'volunteer@helpsngo.in',
    password: 'vol123',
    role: 'volunteer',
    userProfile: VOLUNTEER_USER
  },
  {
    email: 'sanya.vol@helpsngo.in',
    password: 'vol123',
    role: 'volunteer',
    userProfile: VOLUNTEER_USER_SANYA
  },
  {
    email: 'simran.kaur@gmail.com',
    password: 'app123',
    role: 'volunteer_applicant',
    userProfile: APPLICANT_USER
  },
  {
    email: 'guest@helpsngo.in',
    password: 'guest123',
    role: 'guest',
    userProfile: GUEST_USER
  }
];

export const TEAM_MANAGEMENT_ROSTER: TeamMember[] = [
  {
    id: 'mgmt-1',
    name: 'Priya Sharma',
    email: 'priya.mgmt@helpsngo.in',
    role: 'management',
    title: 'Field Operations & Regional Logistics Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '+91 62837 77177',
    location: 'Ludhiana Central Hub & GNDEC Unit',
    activeTasksCount: 3,
    completedTasksCount: 28
  },
  {
    id: 'mgmt-2',
    name: 'Dr. Arvind Mehta',
    email: 'arvind.health@helpsngo.in',
    role: 'management',
    title: 'Medical Mission & Mobile Clinic Lead',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    phone: '+91 94729 29856',
    location: 'Punjab Rural Health Belts & Mobile Vans',
    activeTasksCount: 2,
    completedTasksCount: 34
  },
  {
    id: 'mgmt-3',
    name: 'Sunita Rao',
    email: 'sunita.edu@helpsngo.in',
    role: 'management',
    title: 'AABHA Education Program Coordinator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '+91 94729 29856',
    location: 'Ludhiana & Northern Learning Centers',
    activeTasksCount: 1,
    completedTasksCount: 19
  }
];

export const TEAM_VOLUNTEER_ROSTER: TeamMember[] = [
  {
    id: 'vol-1',
    name: 'Rahul Verma',
    email: 'volunteer@helpsngo.in',
    role: 'volunteer',
    title: 'Platinum Field Volunteer & GNDEC Chapter Lead',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    phone: '+91 62837 77177',
    location: 'GNDEC Campus & Ludhiana Slums',
    activeTasksCount: 2,
    completedTasksCount: 14
  },
  {
    id: 'vol-2',
    name: 'Sanya Patel',
    email: 'sanya.vol@helpsngo.in',
    role: 'volunteer',
    title: 'Senior AABHA Education Mentor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+91 94729 29856',
    location: 'AABHA Evening Learning Center',
    activeTasksCount: 1,
    completedTasksCount: 18
  },
  {
    id: 'vol-3',
    name: 'Ankit Joshi',
    email: 'ankit.vol@helpsngo.in',
    role: 'volunteer',
    title: 'Green Earth Plantation & Environment Volunteer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+91 62837 77177',
    location: 'Ludhiana Eco & Cleanliness Drives',
    activeTasksCount: 1,
    completedTasksCount: 9
  },
  {
    id: 'vol-4',
    name: 'Kavita Sen',
    email: 'kavita.vol@helpsngo.in',
    role: 'volunteer',
    title: 'Community Health & Nutrition Volunteer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phone: '+91 94729 29856',
    location: 'Ludhiana Community Nutrition Center',
    activeTasksCount: 0,
    completedTasksCount: 12
  }
];

export const INITIAL_WORK_ASSIGNMENTS: WorkAssignment[] = [
  {
    id: 'TASK-101',
    title: 'AABHA — Ek Nayi Kiran: Setup Evening Tutorial & Digital Kit Camp',
    description: 'Coordinate evening learning sessions for 150+ slum children, distribute notebook kits and uniforms, and onboard volunteer tutors from GNDEC.',
    category: 'Education',
    priority: 'Urgent',
    deadline: '2026-08-25',
    location: 'Ludhiana Slum Learning Center, Punjab',
    estimatedHours: 16,
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'Founder & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    assignedTo: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management',
      title: 'Field Operations & Regional Logistics Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    status: 'in_progress',
    checklist: [
      { id: 'c1', text: 'Enroll 150 underprivileged students', completed: true },
      { id: 'c2', text: 'Distribute 150 AABHA school bags & stationery packs', completed: true },
      { id: 'c3', text: 'Assign GNDEC student mentor schedules', completed: false },
      { id: 'c4', text: 'Log student attendance into learning database', completed: false }
    ],
    createdAt: '2026-08-14'
  },
  {
    id: 'TASK-102',
    title: 'Green Earth with Bharat: Plant 500 Saplings & Swachh Bharat Drive',
    description: 'Execute community environmental protection drive near GNDEC campus and Gill Road. Plant native shade and fruit trees, and conduct zero-waste segregation workshops.',
    category: 'Environment',
    priority: 'High',
    deadline: '2026-08-22',
    location: 'GNDEC Campus & Gill Road Belt, Ludhiana',
    estimatedHours: 6,
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'Founder & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    assignedTo: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer',
      title: 'GNDEC Student Chapter Lead & Mentor',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
    },
    status: 'pending',
    checklist: [
      { id: 'c1', text: 'Procure 500 tree saplings and organic fertilizer', completed: false },
      { id: 'c2', text: 'Mobilize 40 GNDEC student volunteers', completed: false },
      { id: 'c3', text: 'Tag tree locations and establish watering roster', completed: false }
    ],
    createdAt: '2026-08-15'
  },
  {
    id: 'TASK-103',
    title: 'Ludhiana Community Nutrition & Mega-Kitchen Meal Packing',
    description: 'Supervise clean preparation of 2,500 hot nutritious meal packets and dispatch via volunteer teams to daily wage laborer colonies and slum pockets.',
    category: 'Hunger',
    priority: 'High',
    deadline: '2026-08-20',
    location: 'Ludhiana Central Community Kitchen Hub',
    estimatedHours: 5,
    assignedBy: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management',
      title: 'Field Operations Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    assignedTo: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer',
      title: 'GNDEC Student Chapter Lead',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
    },
    status: 'in_progress',
    checklist: [
      { id: 'c1', text: 'Sanitation inspection of cooking utensils', completed: true },
      { id: 'c2', text: 'Pack 2,500 sealed thermal foil meal boxes', completed: false },
      { id: 'c3', text: 'Handover to volunteer distribution teams', completed: false }
    ],
    createdAt: '2026-08-15'
  },
  {
    id: 'TASK-104',
    title: 'Rural Punjab Free Medical Camp & Diagnostic Checkups',
    description: 'Assist Dr. Arvind with free blood sugar, hemoglobin, ECG, and general health checkups for 200+ rural villagers and dispense free prescribed medicines.',
    category: 'Healthcare',
    priority: 'Medium',
    deadline: '2026-08-18',
    location: 'Village Health Camp, Ludhiana Rural',
    estimatedHours: 8,
    assignedBy: {
      name: 'Dr. Arvind Mehta',
      email: 'arvind.health@helpsngo.in',
      role: 'management',
      title: 'Medical Mission Lead',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    },
    assignedTo: {
      name: 'Sanya Patel',
      email: 'sanya.vol@helpsngo.in',
      role: 'volunteer',
      title: 'Senior Volunteer & AABHA Mentor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    status: 'completed',
    checklist: [
      { id: 'c1', text: 'Setup mobile diagnostic station and registration desk', completed: true },
      { id: 'c2', text: 'Log 210 patient vitals into offline portal', completed: true },
      { id: 'c3', text: 'Dispense free prescribed multivitamins and medicines', completed: true }
    ],
    completionNotes: 'Successfully examined 210 villagers. Free eye drops and essential cardiac/diabetes medications distributed.',
    submittedHours: 8,
    completedAt: '2026-08-16',
    reviewedBy: 'Dr. Arvind Mehta (Approved)',
    createdAt: '2026-08-14'
  },
  {
    id: 'TASK-105',
    title: 'Women Empowerment Vocational Stitching Batch Onboarding',
    description: 'Finalize selection of 40 rural women for the 3-month certified tailoring and self-reliance batch. Inspect 20 sewing machines and distribute fabric starter kits.',
    category: 'Community',
    priority: 'Urgent',
    deadline: '2026-08-28',
    location: 'HELPS Vocational Training Center, Ludhiana',
    estimatedHours: 12,
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'Founder & Managing Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    assignedTo: {
      name: 'Sunita Rao',
      email: 'sunita.edu@helpsngo.in',
      role: 'management',
      title: 'AABHA Education & Livelihood Coordinator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    },
    status: 'pending',
    checklist: [
      { id: 'c1', text: 'Verify applicant documentation from low-income households', completed: false },
      { id: 'c2', text: 'Inspect sewing machines and tooling', completed: false },
      { id: 'c3', text: 'Introduce master tailoring instructor & syllabus', completed: false }
    ],
    createdAt: '2026-08-16'
  }
];

export const INITIAL_ORG_STATS: OrgStats = {
  livesTouched: '100K+',
  mealsServed: '500,000+',
  childrenEducated: '50,000+',
  waterWellsInstalled: '1,200+',
  volunteersActive: '4,500+',
  missionHeadline: 'Keep them alive. Help to needy one.',
  missionDescription: 'HELPS Welfare Society is dedicated to Health, Education, Liberty, Peace, and Service. Registered in Chandigarh under Society Registration Act XXI of 1860 (Est. 2016), we empower communities across Punjab and India through AABHA Child Education, Green Earth initiatives, free medical clinics, and hunger relief.',
  trustRegistration: 'SOCIETY-CHD-ACT-XXI-1860 • 80G/12A Registered'
};

export const INITIAL_STATS = {
  livesTouched: '100K+',
  mealsServed: '500K+',
  childrenEducated: '50K+',
  waterWellsInstalled: '1,200+',
  volunteersActive: '4,500+'
};

export const INITIAL_FIELD_DISPATCHES: FieldDispatch[] = [
  {
    id: 'disp-1',
    title: 'AABHA Learning Center Evening Camp',
    meta: '180 Children Receiving Free Evening Classes & Books',
    category: 'Education',
    date: '2 days ago',
    iconType: 'classroom'
  },
  {
    id: 'disp-2',
    title: 'Free Diagnostic Medical Camp in Rural Punjab',
    meta: '150+ Camps Held • 1,200 Health Screenings Conducted',
    category: 'Healthcare',
    date: '5 days ago',
    iconType: 'clinic'
  },
  {
    id: 'disp-3',
    title: 'Green Earth Plantation Drive at GNDEC Ludhiana',
    meta: '500+ Saplings Planted with Student Volunteers',
    category: 'Water',
    date: '1 week ago',
    iconType: 'water'
  }
];

export const IMAGE_PRESETS = [
  {
    name: 'AABHA Child Education Classroom',
    category: 'Education',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Green Earth Plantation & Environment',
    category: 'Environment',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Free Health Camp & Medical Van',
    category: 'Healthcare',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Daily Meal & Nutrition Drive',
    category: 'Hunger',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Women Empowerment & Vocational Stitching',
    category: 'Community',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Clean Water Borewell & Sanitation',
    category: 'Water',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'GNDEC Student Volunteers & Youth',
    category: 'Community',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Doctor & Patient Healthcare Screening',
    category: 'Healthcare',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80'
  }
];

export const MISSIONS: Mission[] = [
  {
    id: 'health',
    title: 'Health & Medical Aid',
    shortDesc: 'Free healthcare, medical camps & medicines.',
    fullDesc: 'HELPS Welfare Society conducts free diagnostic medical camps, eye screenings, and medicine distribution across rural Punjab and marginalized slums, with 150+ camps successfully organized.',
    iconName: 'HeartPulse',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    stat: '150+',
    statLabel: 'Medical Camps Held'
  },
  {
    id: 'education',
    title: 'Education (AABHA)',
    shortDesc: 'AABHA — Ek Nayi Kiran for every child.',
    fullDesc: 'Free evening tutorial classes, school bags, stationery, uniforms, and digital tablets for underprivileged, slum, and differently-abled children, mentored by GNDEC youth volunteers.',
    iconName: 'GraduationCap',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    stat: '50,000+',
    statLabel: 'Children Educated'
  },
  {
    id: 'environment',
    title: 'Environment (Green Earth)',
    shortDesc: 'Green Earth with Bharat & Swachh drives.',
    fullDesc: 'Large-scale tree plantation drives, Swachh Bharat cleanliness campaigns, waste management workshops, and clean water installations for eco-sustainable communities.',
    iconName: 'Droplets',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    stat: '50,000+',
    statLabel: 'Trees Planted'
  },
  {
    id: 'hunger-relief',
    title: 'Hunger Relief & Langar',
    shortDesc: 'Fighting hunger with daily nutritious meals.',
    fullDesc: 'Serving hot, nutritious meals and ration kits daily to underprivileged families, slum clusters, and hospital attendants, eradicating hunger and malnutrition.',
    iconName: 'Utensils',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    stat: '500,000+',
    statLabel: 'Meals Served'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'AABHA — Ek Nayi Kiran (Child Education)',
    description: 'Free evening classes, digital tablets & school kit distribution for slum children.',
    longDescription: 'AABHA — Ek Nayi Kiran is the flagship child education initiative of HELPS Welfare Society. Spearheaded with passionate student mentors from GNDEC Ludhiana, we provide free evening tutorial classes, school bags, notebooks, uniforms, and digital literacy devices to ensure underprivileged and marginalized children build a bright academic foundation.',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    raisedAmount: 700000,
    targetAmount: 1000000,
    percentage: 70,
    location: 'Ludhiana Slum Clusters & Punjab Villages',
    beneficiariesCount: '3,400+ Children across learning centers',
    urgency: 'Normal',
    updates: [
      {
        date: 'Last week',
        title: 'Distributed 500 AABHA school kits',
        description: 'New backpacks, workbooks, geometry boxes, and uniforms delivered to slum learning centers in Ludhiana.'
      },
      {
        date: 'Last month',
        title: 'Digital Tablet Lab Onboarding',
        description: 'Enabling interactive Hindi and Punjabi learning modules for Grade 1-8 students.'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Green Earth with Bharat & Clean Water',
    description: 'Massive tree plantations, Swachh Bharat cleanliness drives, and clean water wells.',
    longDescription: 'An environmental protection movement by HELPS Welfare Society organizing mass tree plantations, community plastic cleanups, and clean drinking water installations across Punjab to combat climate degradation and water contamination.',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    raisedAmount: 450000,
    targetAmount: 1000000,
    percentage: 45,
    location: 'GNDEC Ludhiana, Gill Road & Rural Punjab',
    beneficiariesCount: '18,000+ Community Members',
    urgency: 'High',
    updates: [
      {
        date: '2 days ago',
        title: '500 Neem & Peepal saplings planted',
        description: 'Joint plantation drive with student volunteers along Gill Road and surrounding rural schools.'
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'Mobile Healthcare & Free Medical Camps',
    description: 'Free doctor consultations, diagnostic tests, and essential medicine distribution.',
    longDescription: 'HELPS Welfare Society operates free medical diagnostic camps with certified physicians, conducting general health checkups, blood sugar and hemoglobin screenings, eye tests, and free pharmaceutical distribution for underserved rural and slum communities.',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    raisedAmount: 100000,
    targetAmount: 500000,
    percentage: 20,
    location: 'Punjab Rural Belts & Slum Communities',
    beneficiariesCount: '45,000+ Screenings & Patients',
    urgency: 'High',
    updates: [
      {
        date: '3 weeks ago',
        title: '150th Free Medical Camp Milestone',
        description: 'Successfully treated over 600 rural residents in a 2-day multi-specialty health camp.'
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'Daily Nutrition & Hunger Relief Drive',
    description: 'Distributing warm nutritious meals and dry ration kits to destitute families.',
    longDescription: 'Combating acute childhood stunting and poverty through daily freshly prepared meals, dry ration kits (wheat, rice, pulses, cooking oil), and nutritious food drives for daily wage families and slum children.',
    category: 'Hunger',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
    raisedAmount: 850000,
    targetAmount: 1000000,
    percentage: 85,
    location: 'Ludhiana Slum Belts & Hospital Annapoorna Points',
    beneficiariesCount: '12,000+ Daily Warm Meals',
    urgency: 'Normal',
    updates: [
      {
        date: 'Yesterday',
        title: '2,500 Meal Boxes Distributed',
        description: 'Hot nutritious khichdi and fresh fruit packs delivered to labor settlements.'
      }
    ]
  },
  {
    id: 'proj-5',
    title: 'Women Empowerment & Vocational Stitching',
    description: 'Tailoring, handicrafts, and self-reliance skill training for rural women.',
    longDescription: 'Providing women from low-income families with certified tailoring machines, design instruction, and business literacy to enable home-based micro-enterprises and financial dignity.',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    raisedAmount: 320000,
    targetAmount: 500000,
    percentage: 64,
    location: 'HELPS Vocational Training Center, Ludhiana',
    beneficiariesCount: '850+ Women Empowered',
    urgency: 'Normal',
    updates: [
      {
        date: '1 week ago',
        title: '30 Sewing Machines Handed Over',
        description: 'Graduation ceremony for Batch 4 certified tailoring candidates.'
      }
    ]
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'DON-98214',
    title: 'AABHA — Ek Nayi Kiran (Child Education)',
    date: 'Oct 26, 2023',
    amount: 1500,
    currency: '₹',
    category: 'Education',
    status: 'Completed',
    receiptNumber: 'HLP-80G-2023-9821',
    isMonthly: true,
    paymentMethod: 'UPI (alex@oksbi)',
    taxDeductible: true,
    donorEmail: 'alex.johnson@example.com',
    donorName: 'Alex Johnson',
    donorTaxId: 'ABCDE1234F',
    approvalStatus: 'approved',
    approvedAt: 'Oct 26, 2023',
    approvedBy: 'Amarjeet Kumar (Founder & Director)'
  },
  {
    id: 'DON-87431',
    title: 'Mobile Healthcare & Free Medical Camp',
    date: 'Sep 15, 2023',
    amount: 2500,
    currency: '₹',
    category: 'Healthcare',
    status: 'Completed',
    receiptNumber: 'HLP-80G-2023-8743',
    isMonthly: false,
    paymentMethod: 'UPI (alex@ybl)',
    taxDeductible: true,
    donorEmail: 'alex.johnson@example.com',
    donorName: 'Alex Johnson',
    donorTaxId: 'ABCDE1234F',
    approvalStatus: 'approved',
    approvedAt: 'Sep 15, 2023',
    approvedBy: 'Amarjeet Kumar (Founder & Director)'
  },
  {
    id: 'DON-76120',
    title: 'Green Earth with Bharat & Clean Water',
    date: 'Aug 02, 2023',
    amount: 5000,
    currency: '₹',
    category: 'Water',
    status: 'Completed',
    receiptNumber: 'HLP-80G-2023-7612',
    isMonthly: false,
    paymentMethod: 'Net Banking (HDFC Bank)',
    taxDeductible: true,
    donorEmail: 'alex.johnson@example.com',
    donorName: 'Alex Johnson',
    donorTaxId: 'ABCDE1234F',
    approvalStatus: 'approved',
    approvedAt: 'Aug 02, 2023',
    approvedBy: 'Amarjeet Kumar (Founder & Director)'
  },
  {
    id: 'DON-64219',
    title: 'Daily Nutrition & Hunger Relief',
    date: 'Jun 18, 2023',
    amount: 10000,
    currency: '₹',
    category: 'Hunger',
    status: 'Completed',
    receiptNumber: 'HLP-80G-2023-6421',
    isMonthly: true,
    paymentMethod: 'RuPay Card (•••• 4242)',
    taxDeductible: true,
    donorEmail: 'alex.johnson@example.com',
    donorName: 'Alex Johnson',
    donorTaxId: 'ABCDE1234F',
    approvalStatus: 'approved',
    approvedAt: 'Jun 18, 2023',
    approvedBy: 'Amarjeet Kumar (Founder & Director)'
  },
  {
    id: 'DON-52011',
    title: 'Women Empowerment Vocational Stitching',
    date: 'Apr 10, 2023',
    amount: 6000,
    currency: '₹',
    category: 'Community',
    status: 'Completed',
    receiptNumber: 'HLP-80G-2023-5201',
    isMonthly: false,
    paymentMethod: 'Google Pay (UPI)',
    taxDeductible: true,
    donorEmail: 'alex.johnson@example.com',
    donorName: 'Alex Johnson',
    donorTaxId: 'ABCDE1234F',
    approvalStatus: 'approved',
    approvedAt: 'Apr 10, 2023',
    approvedBy: 'Amarjeet Kumar (Founder & Director)'
  }
];

export const SKILL_OPTIONS = [
  'AABHA Tutoring & Child Mentorship',
  'Healthcare & Free Medical Camps',
  'Green Earth Tree Plantation & Cleanliness',
  'Field Logistics & Relief Distribution',
  'Women Vocational Stitching & Skill Training',
  'Photography, Media & Storytelling',
  'Fundraising & Public Outreach',
  'Tech & Web Development'
];

export const AVAILABILITY_OPTIONS = [
  'Weekends (4-6 hrs)',
  'Weekdays (Morning/Evening AABHA Classes)',
  'Full-time Field Deployment',
  'Remote / Virtual Mentorship',
  'Emergency Relief Call-on-Duty'
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: 'story-1',
    name: 'Gurpreet Kaur',
    age: 13,
    role: 'AABHA Learning Center Scholar',
    category: 'Education',
    location: 'Ludhiana, Punjab',
    quote: 'Before the AABHA evening classes, I struggled with basic reading and maths. Now, with the help of GNDEC student mentors, I stood first in my school examination!',
    story: 'HELPS Welfare Society provided Gurpreet with school uniforms, stationery kits, and daily evening tutoring at the AABHA center near her neighborhood.',
    impactMetric: '1st in School Exams',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'story-2',
    name: 'Harpreet & Balwinder Singh',
    age: 48,
    role: 'Village Panchayat & Farming Family',
    category: 'Environment',
    location: 'Ludhiana Rural District, Punjab',
    quote: 'The Green Earth team planted over 300 shaded and fruit trees in our village school and commons. The community now participates actively in keeping our surroundings clean.',
    story: 'Mass plantation and cleanliness drives organized by HELPS Welfare Society restored green cover and established community rainwater and potable water access.',
    impactMetric: '300+ Trees Planted',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'story-3',
    name: 'Simranjeet Kaur',
    age: 26,
    role: 'Vocational Stitching Graduate',
    category: 'Community',
    location: 'Ludhiana Training Center',
    quote: 'The vocational tailoring training gave me a livelihood. I now take orders from local boutiques and support my family with pride.',
    story: 'Simranjeet completed the certified 3-month tailoring and fashion handicraft program and received a subsidized sewing machine from HELPS.',
    impactMetric: 'Self-Reliant Entrepreneur',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'story-4',
    name: 'Dr. Surinder Pal',
    age: 52,
    role: 'Consulting Physician & Health Camp Volunteer',
    category: 'Healthcare',
    location: 'Punjab Rural Health Belts',
    quote: 'Conducting over 150 free diagnostic camps with HELPS has brought life-saving early detection of diabetes, hypertension, and eye issues to thousands of villagers.',
    story: 'HELPS Welfare Society coordinates regular health screenings and free pharmaceutical supplies in remote rural zones.',
    impactMetric: '150+ Free Health Camps',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
  }
];

export const ORGANIZATION_INFO: OrganizationInfo = {
  name: 'HELPS Welfare Society',
  legalName: 'HELPS Welfare Society (Regd.)',
  shortName: 'HELPS NGO',
  acronymMeaning: 'Health, Education, Liberty, Peace, and Service',
  registrationNumber: 'Regd. under Society Registration Act XXI of 1860 (Chandigarh)',
  governingAct: 'Societies Registration Act, 1860 (Act XXI of 1860)',
  taxStatus: '12A & 80G Certified • Form CSR-1 Approved (MCA, Govt. of India) • 50% Tax Exemption Under Sec 80G',
  foundedYear: '2016',
  address: {
    street: 'H.No-2, Gill Road, Near Guru Nanak Dev Engineering College (GNDEC)',
    landmark: 'Opposite GNDEC Main Gate',
    city: 'Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    pinCode: '141006',
    country: 'India',
    fullFormatted: 'H.No-2, Gill Road, Near Guru Nanak Dev Engineering College (GNDEC), Ludhiana, Punjab – 141006, India'
  },
  phone: {
    primary: '+91 94729 29856',
    secondary: '+91 62837 77177',
    helpline: '+91 98030 54088'
  },
  email: {
    primary: 'helpsngoteam@gmail.com',
    general: 'info@helpsngo.in',
    support: 'amar@helpsngo.in'
  },
  website: 'https://helpsngo.in/',
  mission: 'To serve humanity with compassion, creating positive and sustainable change through holistic welfare programs in child education, healthcare assistance, environmental protection, women skill empowerment, and social justice across Punjab and all of India.',
  vision: 'A compassionate, equitable world where every individual—irrespective of social background—has unhindered access to quality education, essential healthcare, clean water, dignified nutrition, and life-changing opportunities to thrive.',
  coreValues: [
    'Compassion & Empathy for the Underprivileged',
    'Integrity & 100% Transparent Governance',
    'Community Empowerment through Quality Education',
    'Environmental Sustainability & Green Living',
    'Accountability & Verified Public Trust'
  ],
  programs: [
    {
      id: 'prog-aabha',
      name: 'AABHA — Ek Nayi Kiran (Child Education)',
      category: 'Education',
      headline: 'Free Evening Classes & School Supplies for Slum & Differently-Abled Children',
      description: 'The flagship education project of HELPS Welfare Society providing daily evening tutorial classes, digital tablets, school bags, notebooks, uniforms, and mentorship to slum children and differently-abled students across Ludhiana and Punjab.',
      impactHighlight: '50,000+ Children Educated & Mentored',
      iconName: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'prog-health',
      name: 'Medical Assistance & Free Health Camps',
      category: 'Healthcare',
      headline: 'Free Physician Consultations, Diagnostic Screenings & Medicines',
      description: 'Regular diagnostic healthcare camps with certified doctors providing free screenings for diabetes, hypertension, ECG, vision/cataract checks, and dispensing prescribed medications across remote rural villages.',
      impactHighlight: '150+ Free Health Camps Organized',
      iconName: 'HeartPulse',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'prog-green',
      name: 'Green Earth with Bharat & Clean Water',
      category: 'Environment',
      headline: 'Mass Tree Plantations, Swachh Bharat Drives & Solar Water Installations',
      description: 'Dedicated environmental protection drives involving youth volunteers for mass tree plantations, community hygiene and cleanliness campaigns, and providing clean drinking water access in underserved rural areas.',
      impactHighlight: '50,000+ Trees Planted across Punjab',
      iconName: 'Droplets',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'prog-hunger',
      name: 'Hunger Relief & Annapoorna Nutritious Meals',
      category: 'Hunger',
      headline: 'Daily Nutritious Food & Dry Ration Kits for Destitute Families',
      description: 'Fighting malnutrition and acute hunger by serving daily freshly prepared nutritious meals (langar and food boxes) and dry ration parcels to labor settlements, hospital attendants, and slum clusters.',
      impactHighlight: '500,000+ Nutritious Meals Served',
      iconName: 'Utensils',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'prog-women',
      name: 'Women Empowerment & Vocational Stitching',
      category: 'Community',
      headline: 'Tailoring, Fashion Handicrafts & Livelihood Training for Rural Women',
      description: 'Certified 3-month vocational sewing, embroidery, and entrepreneurship training centers equipped with subsidized sewing machines to empower rural women with financial independence.',
      impactHighlight: '850+ Women Graduated & Self-Employed',
      iconName: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'prog-disaster',
      name: 'Disaster Relief & Child Protection (Bharat Yatra)',
      category: 'Social Justice',
      headline: 'Emergency Relief, Rehabilitation & Anti-Trafficking Advocacy',
      description: 'Rapid response during seasonal flooding, winter cold waves with warm blanket drives, and active participation in national child protection campaigns like Bharat Yatra against child trafficking and abuse.',
      impactHighlight: 'Active across Punjab, Chandigarh & National Chapters',
      iconName: 'ShieldCheck',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'
    }
  ],
  impactMetrics: {
    livesTouched: '100K+',
    childrenEducated: '50,000+',
    mealsServed: '500,000+',
    medicalCamps: '150+',
    treesPlanted: '50,000+',
    volunteersActive: '4,500+',
    womenEmpowered: '850+'
  },
  leadership: [
    {
      id: 'lead-1',
      name: 'Amarjeet Kumar',
      role: 'Founder & National Managing Director',
      title: 'Trustee & Managing Director (HELPS Welfare Society)',
      bio: 'Leading HELPS Welfare Society since its founding in 2016, driving strategic community interventions, AABHA education centers, disaster response, and nation-wide volunteer chapters.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      email: 'amar@helpsngo.in',
      phone: '+91 94729 29856',
      location: 'Ludhiana, Punjab'
    },
    {
      id: 'lead-2',
      name: 'Priya Sharma',
      role: 'Field Operations & Regional Logistics Manager',
      title: 'Field Operations & Regional Logistics Lead',
      bio: 'Oversees daily field relief dispatches, supply chain for AABHA learning centers, nutrition distribution, and coordinator networks across Punjab.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'priya.mgmt@helpsngo.in',
      phone: '+91 62837 77177',
      location: 'Ludhiana / Chandigarh'
    },
    {
      id: 'lead-3',
      name: 'Dr. Arvind Mehta',
      role: 'Healthcare & Medical Missions Lead',
      title: 'Chief Medical Officer & Health Camp Coordinator',
      bio: 'Leads our team of volunteer physicians, diagnostics teams, and free pharmaceutical distribution during monthly rural health camps.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      email: 'arvind.health@helpsngo.in',
      phone: '+91 94729 29856',
      location: 'Punjab Rural Health Belts'
    },
    {
      id: 'lead-4',
      name: 'Rahul Verma',
      role: 'GNDEC Student Chapter Lead & AABHA Mentor',
      title: 'Student Volunteer Coordinator',
      bio: 'Mobilizes university youth from Guru Nanak Dev Engineering College (GNDEC) and regional colleges to mentor slum students in evening AABHA classrooms.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      email: 'volunteer@helpsngo.in',
      phone: '+91 62837 77177',
      location: 'GNDEC Campus, Ludhiana'
    }
  ],
  socialLinks: {
    facebook: 'https://facebook.com/helpsngo',
    instagram: 'https://instagram.com/helpsngo',
    youtube: 'https://youtube.com/@helpsngo_in',
    linkedin: 'https://linkedin.com/company/helps-welfare-society',
    twitter: 'https://twitter.com/helpsngo',
    website: 'https://helpsngo.in/'
  }
};
