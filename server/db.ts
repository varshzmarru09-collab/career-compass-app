import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { initFirebase } from './firebase.js';
import {
  User,
  UserRole,
  StudentProfile,
  SkillGapResult,
  Skill,
  StudentSkill,
  Role,
  RoleRequiredSkill,
  Course,
  CourseEnrollment,
  Trainer,
  Job,
  Application,
  ApplicationStatus,
  SkillMatchResult,
  SectorType,
  RealWorldProject,
  StudentProject,
} from '../src/types/index.js';
import {
  SECTORS,
  INITIAL_SKILLS,
  INITIAL_ROLES,
  INITIAL_COURSES,
  INITIAL_TRAINERS,
  INITIAL_JOBS,
  INITIAL_PROJECTS,
} from './seedData.js';

// ==========================================
// HOSTED FIRESTORE DATABASE INTERFACE
// 1. Users
// 2. Student Profiles
// 3. Skill Gap Results
// 4. Courses
// 5. Course Enrollments
// 6. Trainers
// 7. Real-World Projects & Student Projects
// (+ Skills, Student Skills, Roles, Jobs, Applications)
// ==========================================
interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> password (secured)
  studentProfiles: StudentProfile[];
  skillGapResults: SkillGapResult[];
  courses: Course[];
  courseEnrollments: CourseEnrollment[];
  trainers: Trainer[];
  skills: Skill[];
  studentSkills: StudentSkill[];
  roles: Role[];
  roleRequiredSkills: RoleRequiredSkill[];
  jobs: Job[];
  applications: Application[];
  projects: RealWorldProject[];
  studentProjects: StudentProject[];
}

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), 'data', 'career_compass_db.json');

class HostedDatabaseStore {
  private data: DatabaseSchema = {
    users: [],
    passwords: {},
    studentProfiles: [],
    skillGapResults: [],
    courses: [],
    courseEnrollments: [],
    trainers: [],
    skills: [],
    studentSkills: [],
    roles: [],
    roleRequiredSkills: [],
    jobs: [],
    applications: [],
    projects: [],
    studentProjects: [],
  };

  private firestore: Firestore | null = null;
  private isInitialized = false;

  constructor() {
    this.seedInitialDefaults();
    this.init();
  }

  private async init() {
    try {
      // Initialize Firebase Firestore connection
      const { db } = initFirebase();
      this.firestore = db;

      if (this.firestore) {
        console.log('[Database] Connecting to hosted Firestore...');
        await this.syncFromFirestore();
      } else {
        console.log('[Database] Using local data cache with default datasets.');
        this.loadLocalCache();
      }
      this.isInitialized = true;
    } catch (err) {
      console.warn('[Database] Error initializing Firestore sync, using local cache:', err);
      this.loadLocalCache();
      this.isInitialized = true;
    }
  }

  private loadLocalCache() {
    try {
      if (fs.existsSync(LOCAL_FALLBACK_FILE)) {
        const raw = fs.readFileSync(LOCAL_FALLBACK_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          this.data = { ...this.data, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not read local cache:', e);
    }
  }

  private persistLocal() {
    try {
      const dir = path.dirname(LOCAL_FALLBACK_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      // non-blocking
    }
  }

  private async syncFromFirestore() {
    if (!this.firestore) return;

    try {
      // 1. Fetch Users
      const usersSnap = await getDocs(collection(this.firestore, 'users'));
      if (!usersSnap.empty) {
        this.data.users = usersSnap.docs.map((d) => d.data() as User);
      }

      // 2. Fetch Student Profiles
      const profilesSnap = await getDocs(collection(this.firestore, 'studentProfiles'));
      if (!profilesSnap.empty) {
        this.data.studentProfiles = profilesSnap.docs.map((d) => d.data() as StudentProfile);
      }

      // 3. Fetch Skill Gap Results
      const skillGapSnap = await getDocs(collection(this.firestore, 'skillGapResults'));
      if (!skillGapSnap.empty) {
        this.data.skillGapResults = skillGapSnap.docs.map((d) => d.data() as SkillGapResult);
      }

      // 4. Fetch Courses
      const coursesSnap = await getDocs(collection(this.firestore, 'courses'));
      if (!coursesSnap.empty) {
        this.data.courses = coursesSnap.docs.map((d) => d.data() as Course);
      }

      // 5. Fetch Course Enrollments
      const enrollmentsSnap = await getDocs(collection(this.firestore, 'courseEnrollments'));
      if (!enrollmentsSnap.empty) {
        this.data.courseEnrollments = enrollmentsSnap.docs.map((d) => d.data() as CourseEnrollment);
      }

      // 6. Fetch Trainers
      const trainersSnap = await getDocs(collection(this.firestore, 'trainers'));
      if (!trainersSnap.empty) {
        this.data.trainers = trainersSnap.docs.map((d) => d.data() as Trainer);
      }

      // 7. Fetch Student Skills
      const studentSkillsSnap = await getDocs(collection(this.firestore, 'studentSkills'));
      if (!studentSkillsSnap.empty) {
        this.data.studentSkills = studentSkillsSnap.docs.map((d) => d.data() as StudentSkill);
      }

      // 8. Fetch Applications
      const appsSnap = await getDocs(collection(this.firestore, 'applications'));
      if (!appsSnap.empty) {
        this.data.applications = appsSnap.docs.map((d) => d.data() as Application);
      }

      // Seed remote collections if empty
      if (usersSnap.empty) {
        console.log('[Database] Populating initial dataset to hosted Firestore...');
        await this.pushAllToFirestore();
      }

      this.persistLocal();
      console.log('[Database] Hosted Firestore synchronization completed.');
    } catch (err) {
      console.warn('[Database] Warning during Firestore read sync (using cached defaults):', err);
    }
  }

  private async pushAllToFirestore() {
    if (!this.firestore) return;
    try {
      for (const u of this.data.users) {
        await this.setRemoteDoc('users', u.id, u);
      }
      for (const p of this.data.studentProfiles) {
        await this.setRemoteDoc('studentProfiles', p.id, p);
      }
      for (const c of this.data.courses) {
        await this.setRemoteDoc('courses', c.id, c);
      }
      for (const t of this.data.trainers) {
        await this.setRemoteDoc('trainers', t.id, t);
      }
      for (const ss of this.data.studentSkills) {
        await this.setRemoteDoc('studentSkills', ss.id, ss);
      }
      for (const sgr of this.data.skillGapResults) {
        await this.setRemoteDoc('skillGapResults', sgr.id, sgr);
      }
      for (const j of this.data.jobs) {
        await this.setRemoteDoc('jobs', j.id, j);
      }
    } catch (err) {
      console.warn('[Database] Initial Firestore batch seeding warning:', err);
    }
  }

  private async setRemoteDoc(collectionName: string, docId: string, data: any) {
    if (!this.firestore) return;
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await setDoc(docRef, JSON.parse(JSON.stringify(data)), { merge: true });
    } catch (err) {
      console.warn(`[Database] Error saving document to ${collectionName}/${docId}:`, err);
    }
  }

  private async deleteRemoteDoc(collectionName: string, docId: string) {
    if (!this.firestore) return;
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn(`[Database] Error deleting document ${collectionName}/${docId}:`, err);
    }
  }

  private seedInitialDefaults() {
    this.data.skills = [...INITIAL_SKILLS];
    this.data.projects = [...INITIAL_PROJECTS];
    this.data.studentProjects = [];
    this.data.courses = INITIAL_COURSES.map((c) => ({
      ...c,
      courseName: c.courseName || c.name,
      skillsCovered: c.skillsCovered || [c.skillName],
      createdAt: c.createdAt || new Date(Date.now() - 30 * 86400000).toISOString(),
    }));
    this.data.trainers = [...INITIAL_TRAINERS];
    this.data.jobs = [...INITIAL_JOBS];

    const rolesList: Role[] = [];
    const roleReqs: RoleRequiredSkill[] = [];

    INITIAL_ROLES.forEach((item) => {
      rolesList.push(item.role);
      item.requiredSkills.forEach((skillName) => {
        const foundSkill = INITIAL_SKILLS.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        const skillId = foundSkill ? foundSkill.id : `sk-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        roleReqs.push({
          roleId: item.role.id,
          skillId: skillId,
          skillName: skillName,
          importance: 'essential',
        });
      });
    });

    this.data.roles = rolesList;
    this.data.roleRequiredSkills = roleReqs;

    // 1. Seed Demo Student User
    const demoUserId = 'usr-demo-student';
    const demoUser: User = {
      id: demoUserId,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.edu',
      role: 'student',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    };
    this.data.users.push(demoUser);
    this.data.passwords[demoUserId] = 'Demo@1234';

    // 2. Seed Demo Student Profile
    const demoProfile: StudentProfile = {
      id: 'prof-demo-1',
      userId: demoUserId,
      branch: 'Computer Science & Engineering',
      year: 'Final Year (4th Year)',
      skills: ['Python', 'SQL', 'C'],
      careerInterests: ['Artificial Intelligence', 'Cloud Engineering', 'Full Stack Development'],
      sector: 'IT & Software',
      desiredRole: 'AI/ML Engineer',
      company: 'Google Cloud India',
      educationLevel: 'B.Tech in Computer Science',
      experienceLevel: 'Final Year Student',
      bio: 'Aspiring AI engineer passionate about predictive analytics, natural language processing, and scalable systems.',
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };
    this.data.studentProfiles.push(demoProfile);

    // Initial student skills
    const initialSkillNames = ['Python', 'SQL', 'C'];
    initialSkillNames.forEach((sName) => {
      const sk = INITIAL_SKILLS.find((s) => s.name.toLowerCase() === sName.toLowerCase());
      const sId = sk ? sk.id : `sk-${sName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      this.data.studentSkills.push({
        id: `ss-${crypto.randomUUID()}`,
        studentId: demoUserId,
        skillId: sId,
        skillName: sName,
        status: 'acquired',
        addedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      });
    });

    // 3. Seed initial Skill Gap Result for demo user
    this.data.skillGapResults.push({
      id: `sgr-${crypto.randomUUID()}`,
      studentId: demoUserId,
      selectedCompany: 'Google Cloud India',
      selectedRole: 'AI/ML Engineer',
      currentSkills: ['Python', 'SQL', 'C'],
      missingSkills: ['Machine Learning', 'Statistics', 'Data Structures'],
      recommendedSkills: ['Machine Learning', 'Statistics', 'Data Structures', 'Git & Version Control'],
      matchPercentage: 50,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    });

    // 4. Seed demo trainer users
    INITIAL_TRAINERS.forEach((tr) => {
      const trUser: User = {
        id: tr.userId,
        name: tr.name || 'Trainer Faculty',
        email: tr.email || `${tr.id}@trainer.gov.in`,
        role: 'trainer',
        createdAt: tr.createdAt,
      };
      this.data.users.push(trUser);
      this.data.passwords[tr.userId] = 'Trainer@1234';
    });

    // 5. Seed demo government officer
    const govUserId = 'usr-gov-officer';
    this.data.users.push({
      id: govUserId,
      name: 'Dr. Vivek Saxena (NSDC / NCVET)',
      email: 'director@ncvet.gov.in',
      role: 'government',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    });
    this.data.passwords[govUserId] = 'GovAdmin@2026';
  }

  // ====================================================
  // 1. USERS COLLECTION
  // (id, name, email, role: student/trainer/government, createdAt)
  // ====================================================
  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getAllUsers(roleFilter?: UserRole): User[] {
    if (roleFilter) {
      return this.data.users.filter((u) => u.role === roleFilter);
    }
    return this.data.users;
  }

  verifyPassword(userId: string, passwordAttempt: string): boolean {
    return this.data.passwords[userId] === passwordAttempt;
  }

  createUser(name: string, email: string, password?: string, role: UserRole = 'student'): User {
    const id = `usr-${crypto.randomUUID()}`;
    const user: User = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'student',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(user);
    if (password) {
      this.data.passwords[id] = password;
    } else {
      this.data.passwords[id] = 'GoogleAuthDemoPass';
    }

    this.persistLocal();
    this.setRemoteDoc('users', user.id, user);
    return user;
  }

  // ====================================================
  // 2. STUDENT PROFILES COLLECTION
  // (userId, branch, year, skills, career interests)
  // ====================================================
  getStudentProfile(userId: string): StudentProfile | undefined {
    const profile = this.data.studentProfiles.find((p) => p.userId === userId);
    if (profile) {
      const studentSkillList = this.getStudentSkills(userId).map((s) => s.skillName);
      if (studentSkillList.length > 0) {
        profile.skills = studentSkillList;
      }
    }
    return profile;
  }

  upsertStudentProfile(
    userId: string,
    data: Partial<StudentProfile> & { sector?: SectorType; desiredRole?: string }
  ): StudentProfile {
    let profile = this.data.studentProfiles.find((p) => p.userId === userId);
    const existingSkills = this.getStudentSkills(userId).map((s) => s.skillName);

    const branch = data.branch || (data.educationLevel?.includes('Computer') ? 'Computer Science & Engineering' : data.educationLevel) || profile?.branch || 'Engineering / Technical Studies';
    const year = data.year || data.experienceLevel || profile?.year || 'Final Year';
    const skills = data.skills !== undefined ? data.skills : (profile?.skills || existingSkills || []);
    const sector = (data.sector || profile?.sector || '') as SectorType;
    const desiredRole = data.desiredRole !== undefined ? data.desiredRole : (profile?.desiredRole || '');
    const careerInterests = data.careerInterests || [sector, desiredRole].filter(Boolean);

    if (profile) {
      if (data.sector !== undefined) profile.sector = data.sector;
      if (data.desiredRole !== undefined) profile.desiredRole = data.desiredRole;
      if (data.company !== undefined) profile.company = data.company;
      if (data.branch !== undefined) profile.branch = data.branch;
      if (data.year !== undefined) profile.year = data.year;
      if (data.skills !== undefined) profile.skills = data.skills;
      if (data.careerInterests !== undefined) profile.careerInterests = data.careerInterests;
      if (data.educationLevel !== undefined) profile.educationLevel = data.educationLevel;
      if (data.experienceLevel !== undefined) profile.experienceLevel = data.experienceLevel;
      if (data.bio !== undefined) profile.bio = data.bio;
      profile.updatedAt = new Date().toISOString();
    } else {
      profile = {
        id: `prof-${crypto.randomUUID()}`,
        userId,
        branch,
        year,
        skills,
        careerInterests,
        sector,
        desiredRole,
        company: data.company || '',
        educationLevel: data.educationLevel || 'Undergraduate Student',
        experienceLevel: data.experienceLevel || 'Fresher (0 Years)',
        bio: data.bio || '',
        updatedAt: new Date().toISOString(),
      };
      this.data.studentProfiles.push(profile);
    }

    if (data.skills && Array.isArray(data.skills)) {
      this.setStudentSkills(userId, data.skills);
    }

    this.persistLocal();
    this.setRemoteDoc('studentProfiles', profile.id, profile);
    return profile;
  }

  // ====================================================
  // 3. SKILL GAP RESULTS COLLECTION
  // (studentId, selectedCompany, selectedRole, currentSkills, missingSkills, recommendedSkills, createdAt)
  // ====================================================
  saveSkillGapResult(data: {
    studentId: string;
    selectedCompany?: string;
    selectedRole?: string;
    currentSkills: string[];
    missingSkills: string[];
    recommendedSkills?: string[];
    matchPercentage?: number;
    createdAt?: string;
  }): SkillGapResult {
    const profile = this.getStudentProfile(data.studentId);
    const selectedCompany = data.selectedCompany || profile?.company || 'Industry Benchmark';
    const selectedRole = data.selectedRole || profile?.desiredRole || 'Target Role';

    const matchPercentage =
      data.matchPercentage !== undefined
        ? data.matchPercentage
        : data.missingSkills.length === 0
        ? 100
        : Math.round((data.currentSkills.length / (data.currentSkills.length + data.missingSkills.length)) * 100);

    const recommendedSkills =
      data.recommendedSkills && data.recommendedSkills.length > 0
        ? data.recommendedSkills
        : [...data.missingSkills, 'Problem Solving', 'Git & Version Control'];

    const record: SkillGapResult = {
      id: `sgr-${crypto.randomUUID()}`,
      studentId: data.studentId,
      selectedCompany,
      selectedRole,
      currentSkills: data.currentSkills,
      missingSkills: data.missingSkills,
      recommendedSkills,
      matchPercentage,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    this.data.skillGapResults.unshift(record);
    this.persistLocal();
    this.setRemoteDoc('skillGapResults', record.id, record);
    return record;
  }

  getSkillGapHistory(studentId: string): SkillGapResult[] {
    return this.data.skillGapResults
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getLatestSkillGapResult(studentId: string): SkillGapResult | undefined {
    const list = this.getSkillGapHistory(studentId);
    return list[0];
  }

  // ====================================================
  // 4. COURSES COLLECTION
  // (id, courseName, description, duration, skillsCovered, createdAt)
  // ====================================================
  getAllCourses(): Course[] {
    return this.data.courses.map((c) => ({
      ...c,
      courseName: c.courseName || c.name,
      name: c.name || c.courseName || '',
      skillsCovered: c.skillsCovered || [c.skillName],
      createdAt: c.createdAt || new Date(Date.now() - 30 * 86400000).toISOString(),
    }));
  }

  getCourseById(courseId: string): Course | undefined {
    const c = this.data.courses.find((course) => course.id === courseId);
    if (!c) return undefined;
    return {
      ...c,
      courseName: c.courseName || c.name,
      name: c.name || c.courseName || '',
      skillsCovered: c.skillsCovered || [c.skillName],
      createdAt: c.createdAt || new Date().toISOString(),
    };
  }

  // ====================================================
  // 5. COURSE ENROLLMENTS COLLECTION
  // (studentId, courseId, progress, status, enrolledAt, completedAt)
  // ====================================================
  getCourseEnrollments(studentId: string): CourseEnrollment[] {
    return this.data.courseEnrollments.filter((ce) => ce.studentId === studentId);
  }

  getStudentCourses(studentId: string): CourseEnrollment[] {
    return this.getCourseEnrollments(studentId);
  }

  startCourse(studentId: string, courseId: string): CourseEnrollment {
    let enrollment = this.data.courseEnrollments.find(
      (ce) => ce.studentId === studentId && ce.courseId === courseId
    );

    if (!enrollment) {
      enrollment = {
        id: `ce-${crypto.randomUUID()}`,
        studentId,
        courseId,
        status: 'In Progress',
        progress: 25,
        enrolledAt: new Date().toISOString(),
      };
      this.data.courseEnrollments.push(enrollment);
    } else if (enrollment.status === 'Recommended') {
      enrollment.status = 'In Progress';
      enrollment.progress = Math.max(enrollment.progress, 25);
    }

    this.persistLocal();
    this.setRemoteDoc('courseEnrollments', enrollment.id, enrollment);
    return enrollment;
  }

  updateCourseProgress(studentId: string, courseId: string, progress: number): CourseEnrollment {
    let enrollment = this.data.courseEnrollments.find(
      (ce) => ce.studentId === studentId && ce.courseId === courseId
    );

    const clampedProgress = Math.min(100, Math.max(0, progress));
    const newStatus = clampedProgress >= 100 ? 'Completed' : 'In Progress';

    if (!enrollment) {
      enrollment = {
        id: `ce-${crypto.randomUUID()}`,
        studentId,
        courseId,
        status: newStatus,
        progress: clampedProgress,
        enrolledAt: new Date().toISOString(),
        completedAt: clampedProgress >= 100 ? new Date().toISOString() : undefined,
      };
      this.data.courseEnrollments.push(enrollment);
    } else {
      enrollment.progress = clampedProgress;
      enrollment.status = newStatus;
      if (clampedProgress >= 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date().toISOString();
      }
    }

    if (clampedProgress >= 100) {
      const course = this.getCourseById(courseId);
      if (course) {
        (course.skillsCovered || [course.skillName]).forEach((sk) => {
          if (sk) this.addStudentSkill(studentId, sk);
        });
      }
    }

    this.persistLocal();
    this.setRemoteDoc('courseEnrollments', enrollment.id, enrollment);
    return enrollment;
  }

  completeCourse(studentId: string, courseId: string): { studentCourse: CourseEnrollment; skillAdded: string } {
    let enrollment = this.data.courseEnrollments.find(
      (ce) => ce.studentId === studentId && ce.courseId === courseId
    );
    const course = this.getCourseById(courseId);
    const skillName = course ? course.skillName : '';

    if (!enrollment) {
      enrollment = {
        id: `ce-${crypto.randomUUID()}`,
        studentId,
        courseId,
        status: 'Completed',
        progress: 100,
        enrolledAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      this.data.courseEnrollments.push(enrollment);
    } else {
      enrollment.status = 'Completed';
      enrollment.progress = 100;
      enrollment.completedAt = new Date().toISOString();
    }

    if (skillName) {
      this.addStudentSkill(studentId, skillName);
    }
    if (course && course.skillsCovered) {
      course.skillsCovered.forEach((s) => this.addStudentSkill(studentId, s));
    }

    this.persistLocal();
    this.setRemoteDoc('courseEnrollments', enrollment.id, enrollment);
    return { studentCourse: enrollment, skillAdded: skillName };
  }

  // ====================================================
  // 6. TRAINERS COLLECTION
  // (userId, specialization, createdAt)
  // ====================================================
  getAllTrainers(): Trainer[] {
    return this.data.trainers;
  }

  getTrainerByUserId(userId: string): Trainer | undefined {
    return this.data.trainers.find((t) => t.userId === userId);
  }

  createTrainer(userId: string, specialization: string, name?: string, email?: string): Trainer {
    const existing = this.data.trainers.find((t) => t.userId === userId);
    if (existing) {
      existing.specialization = specialization;
      if (name) existing.name = name;
      if (email) existing.email = email;
      this.persistLocal();
      this.setRemoteDoc('trainers', existing.id, existing);
      return existing;
    }

    const trainer: Trainer = {
      id: `tr-${crypto.randomUUID()}`,
      userId,
      name,
      email,
      specialization,
      createdAt: new Date().toISOString(),
    };
    this.data.trainers.push(trainer);
    this.persistLocal();
    this.setRemoteDoc('trainers', trainer.id, trainer);
    return trainer;
  }

  // ====================================================
  // SKILLS & COMPETENCY CATALOG
  // ====================================================
  getAllSkills(): Skill[] {
    return this.data.skills;
  }

  findOrCreateSkill(name: string, category: string = 'Custom'): Skill {
    const normalized = name.trim();
    let skill = this.data.skills.find((s) => s.name.toLowerCase() === normalized.toLowerCase());
    if (!skill) {
      skill = {
        id: `sk-${normalized.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
        name: normalized,
        category,
      };
      this.data.skills.push(skill);
      this.persistLocal();
      this.setRemoteDoc('skills', skill.id, skill);
    }
    return skill;
  }

  getStudentSkills(userId: string): StudentSkill[] {
    return this.data.studentSkills.filter((ss) => ss.studentId === userId);
  }

  setStudentSkills(userId: string, skillNames: string[]): StudentSkill[] {
    const previous = this.data.studentSkills.filter((ss) => ss.studentId === userId);
    previous.forEach((p) => this.deleteRemoteDoc('studentSkills', p.id));

    this.data.studentSkills = this.data.studentSkills.filter((ss) => ss.studentId !== userId);

    const result: StudentSkill[] = [];
    const uniqueNames = Array.from(new Set(skillNames.map((s) => s.trim()).filter(Boolean)));

    uniqueNames.forEach((sName) => {
      const skill = this.findOrCreateSkill(sName);
      const studentSkill: StudentSkill = {
        id: `ss-${crypto.randomUUID()}`,
        studentId: userId,
        skillId: skill.id,
        skillName: skill.name,
        status: 'acquired',
        addedAt: new Date().toISOString(),
      };
      this.data.studentSkills.push(studentSkill);
      this.setRemoteDoc('studentSkills', studentSkill.id, studentSkill);
      result.push(studentSkill);
    });

    const profile = this.data.studentProfiles.find((p) => p.userId === userId);
    if (profile) {
      profile.skills = uniqueNames;
      this.setRemoteDoc('studentProfiles', profile.id, profile);
    }

    this.persistLocal();
    return result;
  }

  addStudentSkill(userId: string, skillName: string): StudentSkill {
    const trimmed = skillName.trim();
    const existing = this.data.studentSkills.find(
      (ss) => ss.studentId === userId && ss.skillName.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      return existing;
    }
    const skill = this.findOrCreateSkill(trimmed);
    const newSkill: StudentSkill = {
      id: `ss-${crypto.randomUUID()}`,
      studentId: userId,
      skillId: skill.id,
      skillName: skill.name,
      status: 'acquired',
      addedAt: new Date().toISOString(),
    };
    this.data.studentSkills.push(newSkill);

    const profile = this.data.studentProfiles.find((p) => p.userId === userId);
    if (profile && !profile.skills.includes(trimmed)) {
      profile.skills.push(trimmed);
      this.setRemoteDoc('studentProfiles', profile.id, profile);
    }

    this.persistLocal();
    this.setRemoteDoc('studentSkills', newSkill.id, newSkill);
    return newSkill;
  }

  removeStudentSkill(userId: string, skillName: string): boolean {
    const target = this.data.studentSkills.find(
      (ss) => ss.studentId === userId && ss.skillName.toLowerCase() === skillName.trim().toLowerCase()
    );
    if (target) {
      this.deleteRemoteDoc('studentSkills', target.id);
    }

    const initLen = this.data.studentSkills.length;
    this.data.studentSkills = this.data.studentSkills.filter(
      (ss) => !(ss.studentId === userId && ss.skillName.toLowerCase() === skillName.trim().toLowerCase())
    );
    const changed = this.data.studentSkills.length !== initLen;

    const profile = this.data.studentProfiles.find((p) => p.userId === userId);
    if (profile) {
      profile.skills = profile.skills.filter((s) => s.toLowerCase() !== skillName.trim().toLowerCase());
      this.setRemoteDoc('studentProfiles', profile.id, profile);
    }

    if (changed) this.persistLocal();
    return changed;
  }

  // ====================================================
  // ROLES & REQUIRED SKILLS
  // ====================================================
  getAllRoles(): Role[] {
    return this.data.roles;
  }

  getRolesBySector(sector: SectorType): Role[] {
    return this.data.roles.filter((r) => r.sector === sector);
  }

  getRoleByNameOrId(nameOrId: string): Role | undefined {
    return this.data.roles.find(
      (r) => r.id === nameOrId || r.name.toLowerCase() === nameOrId.toLowerCase()
    );
  }

  getRequiredSkillsForRole(roleName: string): string[] {
    const role = this.data.roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      return [];
    }
    return this.data.roleRequiredSkills
      .filter((req) => req.roleId === role.id)
      .map((req) => req.skillName);
  }

  getRecommendedSkillsForSectorAndRole(sector?: SectorType, roleName?: string): Skill[] {
    const results: Skill[] = [];
    const addedNames = new Set<string>();

    const addSkillByName = (name: string, fallbackCategory?: string) => {
      const lower = name.toLowerCase();
      if (addedNames.has(lower)) return;

      const found = this.data.skills.find((s) => s.name.toLowerCase() === lower);
      if (found) {
        results.push(found);
        addedNames.add(lower);
      } else {
        const newSkill: Skill = {
          id: `sk-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: name,
          category: fallbackCategory || sector || 'General',
        };
        results.push(newSkill);
        addedNames.add(lower);
      }
    };

    let resolvedSector = sector;

    if (roleName) {
      const role = this.data.roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
      if (role && !resolvedSector) {
        resolvedSector = role.sector;
      }
      const roleSkills = this.getRequiredSkillsForRole(roleName);
      roleSkills.forEach((sName) => addSkillByName(sName, role?.sector || resolvedSector));
    }

    if (resolvedSector) {
      const sectorRoles = this.getRolesBySector(resolvedSector);
      sectorRoles.forEach((r) => {
        const rSkills = this.getRequiredSkillsForRole(r.name);
        rSkills.forEach((sName) => addSkillByName(sName, resolvedSector));
      });

      const secLower = resolvedSector.toLowerCase();
      this.data.skills
        .filter((s) => {
          const catLower = (s.category || '').toLowerCase();
          return catLower.includes(secLower) || secLower.includes(catLower);
        })
        .forEach((s) => addSkillByName(s.name, resolvedSector));
    }

    const universalSkills = ['Problem Solving', 'Teamwork', 'Communication', 'Excel'];
    universalSkills.forEach((uSkill) => addSkillByName(uSkill, 'General'));

    if (results.length === 0) {
      return this.getAllSkills();
    }

    return results;
  }

  // ====================================================
  // DYNAMIC SKILL GAP ANALYSIS ENGINE
  // ====================================================
  calculateSkillMatch(userId: string, roleName?: string, shouldPersist: boolean = true): SkillMatchResult {
    const profile = this.getStudentProfile(userId);
    const targetRole = roleName || profile?.desiredRole || '';
    const studentSkills = this.getStudentSkills(userId).map((s) => s.skillName);

    if (!targetRole) {
      return {
        studentSkills,
        requiredSkills: [],
        matchedSkills: [],
        missingSkills: [],
        matchPercentage: 0,
        isEligible: false,
        totalRequired: 0,
        matchedCount: 0,
      };
    }

    const requiredSkills = this.getRequiredSkillsForRole(targetRole);
    if (requiredSkills.length === 0) {
      return {
        studentSkills,
        requiredSkills: [],
        matchedSkills: [],
        missingSkills: [],
        matchPercentage: 100,
        isEligible: true,
        totalRequired: 0,
        matchedCount: 0,
      };
    }

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    requiredSkills.forEach((reqSkill) => {
      const isMatched = studentSkills.some(
        (stSkill) => stSkill.toLowerCase() === reqSkill.toLowerCase()
      );
      if (isMatched) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    const isEligible = matchPercentage === 100 || missingSkills.length === 0;

    if (shouldPersist && profile) {
      try {
        const recommendedSkills = this.getRecommendedSkillsForSectorAndRole(profile.sector, targetRole).map((s) => s.name);
        this.saveSkillGapResult({
          studentId: userId,
          selectedCompany: profile.company || 'Industry Leader',
          selectedRole: targetRole,
          currentSkills: studentSkills,
          missingSkills,
          recommendedSkills: recommendedSkills.slice(0, 8),
          matchPercentage,
        });
      } catch (err) {
        console.warn('Failed to auto-save skill gap result:', err);
      }
    }

    return {
      studentSkills,
      requiredSkills,
      matchedSkills,
      missingSkills,
      matchPercentage,
      isEligible,
      totalRequired: requiredSkills.length,
      matchedCount: matchedSkills.length,
    };
  }

  // ====================================================
  // JOBS & APPLICATIONS
  // ====================================================
  getAllJobs(): Job[] {
    return this.data.jobs;
  }

  getJobById(jobId: string): Job | undefined {
    return this.data.jobs.find((j) => j.id === jobId);
  }

  getApplicationsForUser(userId: string): Application[] {
    return this.data.applications
      .filter((app) => app.studentId === userId)
      .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
  }

  createApplication(
    userId: string,
    jobId: string,
    extra?: { resumeFileName?: string; coverNote?: string }
  ): Application {
    const user = this.findUserById(userId);
    const job = this.getJobById(jobId);
    if (!user || !job) {
      throw new Error('User or Job not found');
    }

    const studentSkills = this.getStudentSkills(userId).map((s) => s.skillName.toLowerCase());
    let matchedCount = 0;
    job.requiredSkills.forEach((req) => {
      if (studentSkills.includes(req.toLowerCase())) {
        matchedCount++;
      }
    });
    const matchPercentage =
      job.requiredSkills.length > 0
        ? Math.round((matchedCount / job.requiredSkills.length) * 100)
        : 100;

    const application: Application = {
      id: `app-${crypto.randomUUID()}`,
      studentId: userId,
      studentName: user.name,
      studentEmail: user.email,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      applicationDate: new Date().toISOString(),
      status: 'Applied',
      resumeFileName: extra?.resumeFileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`,
      coverNote: extra?.coverNote || '',
      matchPercentage,
      timeline: [
        {
          status: 'Applied',
          date: new Date().toISOString(),
          notes: 'Application submitted successfully via Career Compass platform.',
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    this.data.applications.push(application);
    this.persistLocal();
    this.setRemoteDoc('applications', application.id, application);
    return application;
  }

  updateApplicationStatus(applicationId: string, newStatus: ApplicationStatus, notes?: string): Application {
    const app = this.data.applications.find((a) => a.id === applicationId);
    if (!app) {
      throw new Error('Application not found');
    }

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();

    const noteText = notes || `Status updated to ${newStatus} in recruitment tracking.`;
    app.timeline.push({
      status: newStatus,
      date: new Date().toISOString(),
      notes: noteText,
    });

    this.persistLocal();
    this.setRemoteDoc('applications', app.id, app);
    return app;
  }

  // ====================================================
  // 7. ROLE-BASED REAL-WORLD PROJECTS
  // ====================================================
  getAllProjects(): RealWorldProject[] {
    return this.data.projects && this.data.projects.length > 0
      ? this.data.projects
      : [...INITIAL_PROJECTS];
  }

  getProjectsForStudent(
    studentId: string,
    overrideSector?: SectorType,
    overrideRole?: string
  ): {
    projects: (RealWorldProject & { studentProject?: StudentProject })[];
    isUnlocked: boolean;
    totalMissingCourses: number;
    completedMissingCourses: number;
    allSkillCoursesCompleted: boolean;
    missingSkills: string[];
    selectedSector: string;
    selectedRole: string;
  } {
    const profile = this.getStudentProfile(studentId);
    const targetSector = overrideSector || profile?.sector || 'IT & Software';
    const targetRole = overrideRole || profile?.desiredRole || 'AI/ML Engineer';

    // 1. Calculate Skill Match & Missing Skills
    const skillMatch = this.calculateSkillMatch(studentId, targetRole, false);
    const missingSkills = skillMatch.missingSkills || [];

    // 2. Determine Courses for Missing Skills
    const allCourses = this.getAllCourses();
    const studentEnrollments = this.getCourseEnrollments(studentId);

    // Courses that specifically address student's missing required skills
    const missingSkillCourses = allCourses.filter((course) => {
      const covers = course.skillsCovered || [course.skillName];
      return covers.some((cSkill) =>
        missingSkills.some((mSkill) => mSkill.toLowerCase() === cSkill.toLowerCase())
      );
    });

    const totalMissingCourses = missingSkillCourses.length;
    const completedMissingCourses = missingSkillCourses.filter((course) => {
      const enrollment = studentEnrollments.find((e) => e.courseId === course.id);
      return enrollment && enrollment.status === 'Completed';
    }).length;

    // Logic: Projects unlock when:
    // - Skill match is 100% (0 missing skills), OR
    // - All courses covering the missing skills have been completed, OR
    // - No required courses exist for the role / totalMissingCourses === 0.
    const allSkillCoursesCompleted =
      missingSkills.length === 0 ||
      (totalMissingCourses > 0 && completedMissingCourses >= totalMissingCourses);

    const isUnlocked = allSkillCoursesCompleted;

    // 3. Filter Projects Specifically Relevant to BOTH Sector + Desired Job Role
    const allProjects = this.getAllProjects();
    let matchedProjects = allProjects.filter((p) => {
      const matchSector = p.sector.toLowerCase() === targetSector.toLowerCase();
      const matchRole =
        p.role.toLowerCase() === targetRole.toLowerCase() ||
        p.role.toLowerCase().includes(targetRole.toLowerCase()) ||
        targetRole.toLowerCase().includes(p.role.toLowerCase());
      return matchSector && matchRole;
    });

    // Fallback if role has no direct projects: find projects in that sector
    if (matchedProjects.length === 0) {
      matchedProjects = allProjects.filter(
        (p) => p.sector.toLowerCase() === targetSector.toLowerCase()
      );
    }

    // Secondary fallback: top 3 projects from all
    if (matchedProjects.length === 0) {
      matchedProjects = allProjects.slice(0, 3);
    }

    // Attach student project state (if started/completed/added to resume)
    const studentProjects = this.getStudentProjects(studentId);
    const enrichedProjects = matchedProjects.map((proj) => {
      const sp = studentProjects.find((p) => p.projectId === proj.id);
      return {
        ...proj,
        studentProject: sp,
      };
    });

    return {
      projects: enrichedProjects,
      isUnlocked,
      totalMissingCourses,
      completedMissingCourses,
      allSkillCoursesCompleted,
      missingSkills,
      selectedSector: targetSector,
      selectedRole: targetRole,
    };
  }

  getStudentProjects(studentId: string): StudentProject[] {
    return (this.data.studentProjects || []).filter((sp) => sp.studentId === studentId);
  }

  startProject(studentId: string, projectId: string): StudentProject {
    const allProjects = this.getAllProjects();
    const proj = allProjects.find((p) => p.id === projectId);
    if (!proj) {
      throw new Error('Project not found');
    }

    if (!this.data.studentProjects) {
      this.data.studentProjects = [];
    }

    let studentProject = this.data.studentProjects.find(
      (sp) => sp.studentId === studentId && sp.projectId === projectId
    );

    if (!studentProject) {
      studentProject = {
        id: `sp-${crypto.randomUUID()}`,
        studentId,
        projectId,
        title: proj.title,
        description: proj.description,
        skills: proj.skills,
        sector: proj.sector,
        role: proj.role,
        difficulty: proj.difficulty,
        status: 'in_progress',
        addedToResume: false,
        whyRelevant: proj.whyRelevant,
        startedAt: new Date().toISOString(),
      };
      this.data.studentProjects.push(studentProject);
    }

    this.persistLocal();
    this.setRemoteDoc('studentProjects', studentProject.id, studentProject);
    return studentProject;
  }

  completeProject(
    studentId: string,
    projectId: string,
    notes?: string,
    addToResume: boolean = true
  ): StudentProject {
    const allProjects = this.getAllProjects();
    const proj = allProjects.find((p) => p.id === projectId);
    if (!proj) {
      throw new Error('Project not found');
    }

    if (!this.data.studentProjects) {
      this.data.studentProjects = [];
    }

    let studentProject = this.data.studentProjects.find(
      (sp) => sp.studentId === studentId && sp.projectId === projectId
    );

    if (!studentProject) {
      studentProject = {
        id: `sp-${crypto.randomUUID()}`,
        studentId,
        projectId,
        title: proj.title,
        description: proj.description,
        skills: proj.skills,
        sector: proj.sector,
        role: proj.role,
        difficulty: proj.difficulty,
        status: 'completed',
        addedToResume: addToResume,
        whyRelevant: proj.whyRelevant,
        notes,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      this.data.studentProjects.push(studentProject);
    } else {
      studentProject.status = 'completed';
      studentProject.completedAt = new Date().toISOString();
      studentProject.addedToResume = addToResume;
      if (notes) studentProject.notes = notes;
    }

    this.persistLocal();
    this.setRemoteDoc('studentProjects', studentProject.id, studentProject);
    return studentProject;
  }

  toggleProjectResume(studentId: string, projectIdOrStudentProjId: string, addedToResume: boolean): StudentProject {
    if (!this.data.studentProjects) {
      this.data.studentProjects = [];
    }

    let studentProject = this.data.studentProjects.find(
      (sp) =>
        sp.studentId === studentId &&
        (sp.id === projectIdOrStudentProjId || sp.projectId === projectIdOrStudentProjId)
    );

    if (!studentProject) {
      const allProjects = this.getAllProjects();
      const proj = allProjects.find((p) => p.id === projectIdOrStudentProjId);
      if (!proj) {
        throw new Error('Project not found');
      }
      studentProject = {
        id: `sp-${crypto.randomUUID()}`,
        studentId,
        projectId: proj.id,
        title: proj.title,
        description: proj.description,
        skills: proj.skills,
        sector: proj.sector,
        role: proj.role,
        difficulty: proj.difficulty,
        status: 'completed',
        addedToResume,
        whyRelevant: proj.whyRelevant,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      this.data.studentProjects.push(studentProject);
    } else {
      studentProject.addedToResume = addedToResume;
    }

    this.persistLocal();
    this.setRemoteDoc('studentProjects', studentProject.id, studentProject);
    return studentProject;
  }

  resetToPreset(userId: string, presetType: 'unskilled' | 'skilled' | 'hired') {
    const user = this.findUserById(userId);
    if (!user) return;

    if (presetType === 'unskilled') {
      this.upsertStudentProfile(userId, {
        sector: 'IT & Software',
        desiredRole: 'AI/ML Engineer',
        company: 'Google Cloud India',
      });
      this.setStudentSkills(userId, ['Python', 'SQL', 'C']);
      this.data.courseEnrollments = this.data.courseEnrollments.filter((sc) => sc.studentId !== userId);
      this.data.applications = this.data.applications.filter((a) => a.studentId !== userId);
      this.data.studentProjects = (this.data.studentProjects || []).filter((sp) => sp.studentId !== userId);
    } else if (presetType === 'skilled') {
      this.upsertStudentProfile(userId, {
        sector: 'IT & Software',
        desiredRole: 'AI/ML Engineer',
        company: 'Google Cloud India',
      });
      this.setStudentSkills(userId, [
        'Python',
        'SQL',
        'Machine Learning',
        'Statistics',
        'Data Structures',
        'Git & Version Control',
      ]);
      this.data.courseEnrollments = this.data.courseEnrollments.filter((sc) => sc.studentId !== userId);
      this.data.applications = this.data.applications.filter((a) => a.studentId !== userId);
      this.data.studentProjects = (this.data.studentProjects || []).filter((sp) => sp.studentId !== userId);
    } else if (presetType === 'hired') {
      this.upsertStudentProfile(userId, {
        sector: 'IT & Software',
        desiredRole: 'AI/ML Engineer',
        company: 'Google Cloud India',
      });
      this.setStudentSkills(userId, [
        'Python',
        'SQL',
        'Machine Learning',
        'Statistics',
        'Data Structures',
      ]);
      const job = this.getJobById('job-aiml-google') || this.data.jobs[0];
      this.data.applications = this.data.applications.filter((a) => a.studentId !== userId);
      const app = this.createApplication(userId, job.id);
      this.updateApplicationStatus(app.id, 'Under Review');
      this.updateApplicationStatus(app.id, 'Shortlisted');
      this.updateApplicationStatus(app.id, 'Interview');
      this.updateApplicationStatus(app.id, 'Selected');
      this.updateApplicationStatus(app.id, 'Hired', 'Offer letter accepted! Starting as Junior AI/ML Engineer.');
      
      // Auto-complete a real-world project for hired state
      this.completeProject('proj-aiml-1', userId, 'Completed with distinction', true);
    }

    this.persistLocal();
  }
}

export const db = new HostedDatabaseStore();
