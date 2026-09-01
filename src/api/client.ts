import {
  User,
  StudentProfile,
  Skill,
  StudentSkill,
  Role,
  Course,
  StudentCourse,
  Job,
  Application,
  ApplicationStatus,
  SkillMatchResult,
  SectorType,
  DashboardSummary,
  RealWorldProject,
  StudentProject,
} from '../types/index.js';

const TOKEN_KEY = 'career_compass_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data;
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    apiRequest<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiRequest<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (name?: string, email?: string) =>
    apiRequest<{ user: User; token: string }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),

  getMe: () =>
    apiRequest<{ user: User; profile: StudentProfile | null }>('/api/auth/me'),

  logout: () => {
    clearStoredToken();
    return apiRequest<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
  },

  // Metadata
  getSectors: () =>
    apiRequest<{ sectors: SectorType[]; companies: string[] }>('/api/meta/sectors'),

  getRoles: (sector?: SectorType) =>
    apiRequest<{ roles: Role[] }>(`/api/meta/roles${sector ? `?sector=${encodeURIComponent(sector)}` : ''}`),

  getSkills: (sector?: SectorType, role?: string) => {
    const params = new URLSearchParams();
    if (sector) params.append('sector', sector);
    if (role) params.append('role', role);
    const qs = params.toString();
    return apiRequest<{ skills: Skill[] }>(`/api/meta/skills${qs ? `?${qs}` : ''}`);
  },

  getRecommendedSkills: (sector?: SectorType, role?: string) => {
    const params = new URLSearchParams();
    if (sector) params.append('sector', sector);
    if (role) params.append('role', role);
    const qs = params.toString();
    return apiRequest<{ skills: Skill[] }>(`/api/meta/recommended-skills${qs ? `?${qs}` : ''}`);
  },

  getRoleRequiredSkills: (role: string) =>
    apiRequest<{ roleName: string; requiredSkills: string[] }>(`/api/meta/role-skills?role=${encodeURIComponent(role)}`),

  // Student Profile & Skills
  getStudentProfile: () =>
    apiRequest<{ profile: StudentProfile | null; skills: StudentSkill[]; skillMatch: SkillMatchResult | null }>('/api/student/profile'),

  updateStudentProfile: (data: {
    sector?: SectorType;
    desiredRole?: string;
    company?: string;
    branch?: string;
    year?: string;
    skills?: string[];
    careerInterests?: string[];
    educationLevel?: string;
    experienceLevel?: string;
    bio?: string;
  }) =>
    apiRequest<{ profile: StudentProfile; skillMatch: SkillMatchResult | null }>('/api/student/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStudentSkills: () =>
    apiRequest<{ skills: StudentSkill[] }>('/api/student/skills'),

  setStudentSkills: (skills: string[]) =>
    apiRequest<{ skills: StudentSkill[]; skillMatch: SkillMatchResult }>('/api/student/skills', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    }),

  addStudentSkill: (skillName: string) =>
    apiRequest<{ skill: StudentSkill; skillMatch: SkillMatchResult }>('/api/student/skills/add', {
      method: 'POST',
      body: JSON.stringify({ skillName }),
    }),

  removeStudentSkill: (skillName: string) =>
    apiRequest<{ success: boolean; skillMatch: SkillMatchResult }>(`/api/student/skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE',
    }),

  getSkillAnalysis: () =>
    apiRequest<{
      profile: StudentProfile | null;
      role: Role | undefined;
      analysis: SkillMatchResult;
    }>('/api/student/skill-analysis'),

  getDashboardSummary: () =>
    apiRequest<DashboardSummary>('/api/student/dashboard'),

  loadPreset: (preset: 'unskilled' | 'skilled' | 'hired') =>
    apiRequest<{
      success: boolean;
      profile: StudentProfile;
      skills: StudentSkill[];
      skillMatch: SkillMatchResult;
      applications: Application[];
    }>('/api/student/preset', {
      method: 'POST',
      body: JSON.stringify({ preset }),
    }),

  // Courses
  getCourses: () =>
    apiRequest<{ courses: (Course & { status: 'Recommended' | 'In Progress' | 'Completed'; progress: number; isMissingForUser: boolean })[] }>('/api/courses'),

  startCourse: (courseId: string) =>
    apiRequest<{ studentCourse: StudentCourse }>(`/api/courses/${courseId}/start`, {
      method: 'POST',
    }),

  completeCourse: (courseId: string) =>
    apiRequest<{ studentCourse: StudentCourse; skillAdded: string; skillMatch: SkillMatchResult }>(`/api/courses/${courseId}/complete`, {
      method: 'POST',
    }),

  // Projects
  getProjects: (sector?: SectorType, role?: string) => {
    const params = new URLSearchParams();
    if (sector) params.append('sector', sector);
    if (role) params.append('role', role);
    const qs = params.toString();
    return apiRequest<{
      projects: (RealWorldProject & { studentProject?: StudentProject })[];
      isUnlocked: boolean;
      totalMissingCourses: number;
      completedMissingCourses: number;
      allSkillCoursesCompleted: boolean;
      missingSkills: string[];
      selectedSector: string;
      selectedRole: string;
    }>(`/api/projects${qs ? `?${qs}` : ''}`);
  },

  startProject: (projectId: string) =>
    apiRequest<{ studentProject: StudentProject; success: boolean }>(`/api/projects/${projectId}/start`, {
      method: 'POST',
    }),

  completeProject: (projectId: string, notes?: string, addToResume: boolean = true) =>
    apiRequest<{ studentProject: StudentProject; success: boolean }>(`/api/projects/${projectId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes, addToResume }),
    }),

  toggleProjectResume: (projectId: string, addedToResume: boolean) =>
    apiRequest<{ studentProject: StudentProject; success: boolean }>(`/api/projects/${projectId}/toggle-resume`, {
      method: 'POST',
      body: JSON.stringify({ addedToResume }),
    }),

  getStudentProjects: () =>
    apiRequest<{ projects: StudentProject[] }>('/api/student/projects'),

  // Jobs
  getJobs: () =>
    apiRequest<{
      jobs: (Job & {
        matchedSkills: string[];
        missingSkills: string[];
        matchPercentage: number;
        isEligible: boolean;
        hasApplied: boolean;
        applicationId?: string;
        applicationStatus?: ApplicationStatus;
      })[];
    }>('/api/jobs'),

  getJobById: (id: string) =>
    apiRequest<{ job: Job }>(`/api/jobs/${id}`),

  // Applications
  getApplications: () =>
    apiRequest<{ applications: Application[] }>('/api/applications'),

  submitApplication: (data: { jobId: string; resumeFileName?: string; coverNote?: string }) =>
    apiRequest<{ application: Application }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) =>
    apiRequest<{ application: Application }>(`/api/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
};
