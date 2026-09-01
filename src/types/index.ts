export type SectorType =
  | 'IT & Software'
  | 'Manufacturing'
  | 'Healthcare'
  | 'Agriculture'
  | 'Construction'
  | 'Banking & Finance'
  | 'Logistics'
  | 'Retail'
  | 'Tourism & Hospitality'
  | 'Public Services';

export type UserRole = 'student' | 'trainer' | 'government';

// 1. Users Table
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// 2. Student Profiles Table
export interface StudentProfile {
  id: string;
  userId: string;
  branch: string;
  year: string;
  skills: string[];
  careerInterests: string[];
  sector: SectorType;
  desiredRole: string;
  company?: string;
  educationLevel?: string;
  experienceLevel?: string;
  bio?: string;
  updatedAt: string;
}

// 3. Skill Gap Results Table
export interface SkillGapResult {
  id: string;
  studentId: string;
  selectedCompany: string;
  selectedRole: string;
  currentSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  matchPercentage: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  status: 'acquired' | 'in_progress' | 'target';
  addedAt: string;
}

export interface Role {
  id: string;
  sector: SectorType;
  name: string;
  description: string;
  averageSalary: string;
  demandLevel: 'High' | 'Very High' | 'Medium';
}

export interface RoleRequiredSkill {
  roleId: string;
  skillId: string;
  skillName: string;
  importance: 'essential' | 'preferred';
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Recommended' | 'In Progress' | 'Completed';

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
}

// 4. Courses Table
export interface Course {
  id: string;
  courseName?: string;
  name: string; // backwards & seed compatibility
  description: string;
  duration: string;
  skillsCovered?: string[];
  skillId: string;
  skillName: string;
  sector?: SectorType;
  difficulty: CourseDifficulty;
  provider: string;
  rating: number;
  enrolledCount: number;
  syllabus: CourseLesson[];
  createdAt?: string;
}

// 5. Course Enrollments Table
export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // 0 - 100
  status: CourseStatus;
  enrolledAt: string;
  completedAt?: string;
}

// Backwards compatibility alias
export type StudentCourse = CourseEnrollment;

// 6. Trainers Table
export interface Trainer {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  specialization: string;
  createdAt: string;
}

// 7. Role-Based Real-World Projects
export interface RealWorldProject {
  id: string;
  title: string;
  description: string;
  sector: SectorType;
  role: string;
  skills: string[];
  difficulty: CourseDifficulty;
  whyRelevant: string;
  deliverables?: string[];
  estimatedDuration?: string;
}

export interface StudentProject {
  id: string;
  studentId: string;
  projectId: string;
  title: string;
  description: string;
  skills: string[];
  sector: SectorType;
  role: string;
  difficulty: CourseDifficulty;
  status: 'in_progress' | 'completed';
  addedToResume: boolean;
  whyRelevant?: string;
  notes?: string;
  startedAt: string;
  completedAt?: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  sector: SectorType;
  location: string;
  jobType: JobType;
  salary: string;
  experienceRequired: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[]; // skill names
  postedDate: string;
  openings: number;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Hired';

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  notes: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: JobType;
  applicationDate: string;
  status: ApplicationStatus;
  resumeFileName?: string;
  coverNote?: string;
  matchPercentage: number;
  timeline: ApplicationTimelineEvent[];
  updatedAt: string;
}

export interface SkillMatchResult {
  studentSkills: string[];
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  isEligible: boolean;
  totalRequired: number;
  matchedCount: number;
}

export interface RoadmapStage {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  actionLabel?: string;
  actionRoute?: string;
  badge?: string;
}

export interface DashboardSummary {
  user: User;
  profile: StudentProfile | null;
  skillMatch: SkillMatchResult | null;
  skills: StudentSkill[];
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  recommendedCoursesCount: number;
  matchingJobsCount: number;
  eligibleJobsCount: number;
  applicationsCount: number;
  hiredCount: number;
  latestApplication?: Application;
  currentRoadmapStage: string;
}
