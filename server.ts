import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { SECTORS, INITIAL_COMPANIES } from './server/seedData.js';
import { SectorType, ApplicationStatus, UserRole } from './src/types/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to extract authenticated user from Authorization header or session token
  const getAuthUser = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userId = authHeader.substring(7).trim();
      return db.findUserById(userId);
    }
    const uid = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    if (uid) {
      return db.findUserById(uid);
    }
    return undefined;
  };

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Career Compass API & Persistent Database',
      database: 'Connected (Google Firebase Firestore)',
      projectId: 'probable-unfolding-2thv3',
      firestoreDatabaseId: 'ai-studio-careercompass-1d84451d-008f-4ae6-9b3e-2b0eedf5addb',
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // 1. AUTH & USERS
  // ==========================================
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      const existing = db.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists. Please Sign In.' });
      }
      const userRole: UserRole = role === 'trainer' || role === 'government' ? role : 'student';
      const user = db.createUser(name, email, password, userRole);
      res.json({ user, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isValid = db.verifyPassword(user.id, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ user, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  app.post('/api/auth/google', (req, res) => {
    try {
      const { name, email } = req.body;
      const userEmail = email || 'student.demo@careercompass.gov.in';
      const userName = name || 'Priya Sharma';

      let user = db.findUserByEmail(userEmail);
      if (!user) {
        user = db.createUser(userName, userEmail, undefined, 'student');
      }
      res.json({ user, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Google Auth failed' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const profile = db.getStudentProfile(user.id);
    const skills = db.getStudentSkills(user.id);
    const enrollments = db.getCourseEnrollments(user.id);
    const skillGapHistory = db.getSkillGapHistory(user.id);

    res.json({
      user,
      profile,
      skills,
      enrollments,
      skillGapHistory,
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true });
  });

  app.get('/api/users', (req, res) => {
    try {
      const role = req.query.role as UserRole | undefined;
      const users = db.getAllUsers(role);
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch users' });
    }
  });

  // ==========================================
  // 2. METADATA (Sectors, Roles, Skills)
  // ==========================================
  app.get('/api/meta/sectors', (req, res) => {
    res.json({
      sectors: SECTORS,
      companies: INITIAL_COMPANIES,
    });
  });

  app.get('/api/meta/roles', (req, res) => {
    const sector = req.query.sector as SectorType | undefined;
    if (sector) {
      const roles = db.getRolesBySector(sector);
      return res.json({ roles });
    }
    res.json({ roles: db.getAllRoles() });
  });

  app.get('/api/meta/skills', (req, res) => {
    const sector = req.query.sector as SectorType | undefined;
    const role = req.query.role as string | undefined;
    if (sector || role) {
      const skills = db.getRecommendedSkillsForSectorAndRole(sector, role);
      return res.json({ skills });
    }
    res.json({ skills: db.getAllSkills() });
  });

  app.get('/api/meta/recommended-skills', (req, res) => {
    const sector = req.query.sector as SectorType | undefined;
    const role = req.query.role as string | undefined;
    const skills = db.getRecommendedSkillsForSectorAndRole(sector, role);
    res.json({ skills });
  });

  app.get('/api/meta/role-skills', (req, res) => {
    const roleName = (req.query.role as string) || '';
    const skills = db.getRequiredSkillsForRole(roleName);
    res.json({ roleName, requiredSkills: skills });
  });

  // ==========================================
  // 3. STUDENT PROFILES & SKILLS
  // ==========================================
  app.get('/api/student/profile', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const profile = db.getStudentProfile(user.id);
      const skills = db.getStudentSkills(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;

      res.json({ profile, skills, skillMatch });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch student profile' });
    }
  });

  app.post('/api/student/profile', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { sector, desiredRole, company, branch, year, skills, careerInterests, educationLevel, experienceLevel, bio } = req.body;
      if (!sector && !desiredRole && !company && !bio && !skills) {
        return res.status(400).json({ error: 'At least one profile field is required' });
      }

      const profile = db.upsertStudentProfile(user.id, {
        sector,
        desiredRole,
        company,
        branch,
        year,
        skills,
        careerInterests,
        educationLevel,
        experienceLevel,
        bio,
      });

      const skillMatch = profile && profile.desiredRole ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;
      res.json({ profile, skillMatch });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update student profile' });
    }
  });

  app.get('/api/student/skills', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const studentSkills = db.getStudentSkills(user.id);
      res.json({ skills: studentSkills });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch skills' });
    }
  });

  app.post('/api/student/skills', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { skills } = req.body; // Array of skill names
      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills must be an array of strings' });
      }

      const updated = db.setStudentSkills(user.id, skills);
      const profile = db.getStudentProfile(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;

      res.json({ skills: updated, skillMatch });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update student skills' });
    }
  });

  app.post('/api/student/skills/add', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { skillName } = req.body;
      if (!skillName) {
        return res.status(400).json({ error: 'skillName is required' });
      }

      const studentSkill = db.addStudentSkill(user.id, skillName);
      const profile = db.getStudentProfile(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;

      res.json({ skill: studentSkill, skillMatch });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add student skill' });
    }
  });

  app.delete('/api/student/skills/:name', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const skillName = decodeURIComponent(req.params.name);
      db.removeStudentSkill(user.id, skillName);
      const profile = db.getStudentProfile(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;

      res.json({ success: true, skillMatch });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to remove skill' });
    }
  });

  // ==========================================
  // 4. SKILL GAP RESULTS & ANALYSIS
  // ==========================================
  app.get('/api/student/skill-analysis', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const profile = db.getStudentProfile(user.id);
      const targetRole = profile?.desiredRole || 'AI/ML Engineer';
      const roleDetails = db.getRoleByNameOrId(targetRole);

      // Calculates match and automatically persists to skillGapResults collection
      const analysis = db.calculateSkillMatch(user.id, targetRole, true);

      res.json({
        profile,
        role: roleDetails,
        analysis,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to perform skill analysis' });
    }
  });

  app.post('/api/student/skill-analysis/save', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { selectedCompany, selectedRole, currentSkills, missingSkills, recommendedSkills, matchPercentage } = req.body;
      const record = db.saveSkillGapResult({
        studentId: user.id,
        selectedCompany,
        selectedRole,
        currentSkills: currentSkills || [],
        missingSkills: missingSkills || [],
        recommendedSkills,
        matchPercentage,
      });

      res.json({ result: record });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save skill gap result' });
    }
  });

  app.get('/api/student/skill-gap-history', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const history = db.getSkillGapHistory(user.id);
      res.json({ history });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve skill gap history' });
    }
  });

  // ==========================================
  // 5. COURSES & ENROLLMENTS
  // ==========================================
  app.get('/api/courses', (req, res) => {
    try {
      const user = getAuthUser(req);
      const allCourses = db.getAllCourses();
      const studentCourses = user ? db.getCourseEnrollments(user.id) : [];
      const profile = user ? db.getStudentProfile(user.id) : null;
      const skillMatch = user && profile ? db.calculateSkillMatch(user.id, profile.desiredRole, false) : null;
      const missingSkillNames = skillMatch ? skillMatch.missingSkills.map((s) => s.toLowerCase()) : [];

      const enriched = allCourses.map((c) => {
        const enrolled = studentCourses.find((sc) => sc.courseId === c.id);
        let status: 'Recommended' | 'In Progress' | 'Completed' = 'Recommended';
        let progress = 0;

        if (enrolled) {
          status = enrolled.status;
          progress = enrolled.progress;
        } else if (missingSkillNames.includes(c.skillName.toLowerCase())) {
          status = 'Recommended';
        } else if (user && db.getStudentSkills(user.id).some((s) => s.skillName.toLowerCase() === c.skillName.toLowerCase())) {
          status = 'Completed';
          progress = 100;
        }

        return {
          ...c,
          courseName: c.courseName || c.name,
          skillsCovered: c.skillsCovered || [c.skillName],
          status,
          progress,
          isMissingForUser: missingSkillNames.includes(c.skillName.toLowerCase()),
        };
      });

      res.json({ courses: enriched });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to load courses' });
    }
  });

  app.get('/api/student/enrollments', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const enrollments = db.getCourseEnrollments(user.id);
      res.json({ enrollments });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch course enrollments' });
    }
  });

  app.post('/api/courses/:id/start', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const courseId = req.params.id;
      const studentCourse = db.startCourse(user.id, courseId);
      res.json({ studentCourse, enrollment: studentCourse });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to start course' });
    }
  });

  app.post('/api/courses/:id/enroll', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const courseId = req.params.id;
      const studentCourse = db.startCourse(user.id, courseId);
      res.json({ studentCourse, enrollment: studentCourse });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to enroll in course' });
    }
  });

  app.post('/api/courses/:id/progress', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const courseId = req.params.id;
      const { progress } = req.body;
      const enrollment = db.updateCourseProgress(user.id, courseId, Number(progress) || 0);
      res.json({ enrollment });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update course progress' });
    }
  });

  app.post('/api/courses/:id/complete', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const courseId = req.params.id;
      const result = db.completeCourse(user.id, courseId);
      const profile = db.getStudentProfile(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;

      res.json({
        studentCourse: result.studentCourse,
        enrollment: result.studentCourse,
        skillAdded: result.skillAdded,
        skillMatch,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to complete course' });
    }
  });

  // ==========================================
  // 5B. ROLE-BASED REAL-WORLD PROJECTS
  // ==========================================
  app.get('/api/projects', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const sector = (req.query.sector as any) || undefined;
      const role = (req.query.role as string) || undefined;

      const projectData = db.getProjectsForStudent(user.id, sector, role);
      res.json(projectData);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to load projects' });
    }
  });

  app.post('/api/projects/:id/start', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const studentProject = db.startProject(user.id, req.params.id);
      res.json({ studentProject, success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to start project' });
    }
  });

  app.post('/api/projects/:id/complete', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { notes, addToResume } = req.body;
      const studentProject = db.completeProject(
        user.id,
        req.params.id,
        notes,
        addToResume !== undefined ? Boolean(addToResume) : true
      );
      res.json({ studentProject, success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to complete project' });
    }
  });

  app.post('/api/projects/:id/toggle-resume', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { addedToResume } = req.body;
      const studentProject = db.toggleProjectResume(
        user.id,
        req.params.id,
        Boolean(addedToResume)
      );
      res.json({ studentProject, success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to toggle resume status' });
    }
  });

  app.get('/api/student/projects', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const studentProjects = db.getStudentProjects(user.id);
      res.json({ projects: studentProjects });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch student projects' });
    }
  });

  // ==========================================
  // 6. TRAINERS
  // ==========================================
  app.get('/api/trainers', (req, res) => {
    try {
      const trainers = db.getAllTrainers();
      res.json({ trainers });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch trainers' });
    }
  });

  app.get('/api/trainers/:userId', (req, res) => {
    try {
      const trainer = db.getTrainerByUserId(req.params.userId);
      if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
      res.json({ trainer });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch trainer' });
    }
  });

  app.post('/api/trainers', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { specialization, name, email } = req.body;
      if (!specialization) return res.status(400).json({ error: 'Specialization is required' });

      const trainer = db.createTrainer(user.id, specialization, name || user.name, email || user.email);
      res.json({ trainer });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save trainer profile' });
    }
  });

  // ==========================================
  // DASHBOARD SUMMARY
  // ==========================================
  app.get('/api/student/dashboard', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const profile = db.getStudentProfile(user.id);
      const skills = db.getStudentSkills(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole, false) : null;

      const studentCourses = db.getCourseEnrollments(user.id);
      const enrolledCoursesCount = studentCourses.filter((c) => c.status === 'In Progress').length;
      const completedCoursesCount = studentCourses.filter((c) => c.status === 'Completed').length;

      const missingSkills = skillMatch ? skillMatch.missingSkills : [];
      const recommendedCoursesCount = missingSkills.length;

      const allJobs = db.getAllJobs();
      const userSkillNames = skills.map((s) => s.skillName.toLowerCase());

      const matchingJobs = allJobs.filter((j) => {
        if (profile && j.sector === profile.sector) return true;
        const matched = j.requiredSkills.filter((req) => userSkillNames.includes(req.toLowerCase()));
        return matched.length > 0;
      });

      const eligibleJobs = allJobs.filter((j) => {
        const matched = j.requiredSkills.filter((req) => userSkillNames.includes(req.toLowerCase()));
        return matched.length === j.requiredSkills.length;
      });

      const applications = db.getApplicationsForUser(user.id);
      const hiredCount = applications.filter((a) => a.status === 'Hired').length;

      let currentRoadmapStage = 'Career Goal';
      if (!profile) {
        currentRoadmapStage = 'Career Goal';
      } else if (skillMatch && skillMatch.missingSkills.length > 0 && completedCoursesCount === 0) {
        currentRoadmapStage = 'Skill Gap & Training';
      } else if (skillMatch && skillMatch.isEligible && applications.length === 0) {
        currentRoadmapStage = 'Job Eligibility & Matching';
      } else if (applications.length > 0) {
        if (hiredCount > 0) {
          currentRoadmapStage = 'Hired';
        } else if (applications.some((a) => a.status === 'Interview')) {
          currentRoadmapStage = 'Interview';
        } else {
          currentRoadmapStage = 'Application Tracking';
        }
      }

      res.json({
        user,
        profile: profile || null,
        skillMatch,
        skills,
        enrolledCoursesCount,
        completedCoursesCount,
        recommendedCoursesCount,
        matchingJobsCount: matchingJobs.length,
        eligibleJobsCount: eligibleJobs.length,
        applicationsCount: applications.length,
        hiredCount,
        latestApplication: applications[0] || null,
        currentRoadmapStage,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to load dashboard' });
    }
  });

  // ==========================================
  // JOBS & APPLICATIONS
  // ==========================================
  app.get('/api/jobs', (req, res) => {
    try {
      const user = getAuthUser(req);
      const allJobs = db.getAllJobs();
      const studentSkills = user ? db.getStudentSkills(user.id).map((s) => s.skillName.toLowerCase()) : [];
      const applications = user ? db.getApplicationsForUser(user.id) : [];

      const enrichedJobs = allJobs.map((job) => {
        const matchedSkills = job.requiredSkills.filter((req) =>
          studentSkills.includes(req.toLowerCase())
        );
        const missingSkills = job.requiredSkills.filter(
          (req) => !studentSkills.includes(req.toLowerCase())
        );

        const matchPercentage =
          job.requiredSkills.length > 0
            ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
            : 100;

        const isEligible = matchPercentage === 100 || missingSkills.length === 0;
        const existingApp = applications.find((a) => a.jobId === job.id);

        return {
          ...job,
          matchedSkills,
          missingSkills,
          matchPercentage,
          isEligible,
          hasApplied: !!existingApp,
          applicationId: existingApp ? existingApp.id : undefined,
          applicationStatus: existingApp ? existingApp.status : undefined,
        };
      });

      res.json({ jobs: enrichedJobs });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch jobs' });
    }
  });

  app.get('/api/jobs/:id', (req, res) => {
    try {
      const job = db.getJobById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      res.json({ job });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch job' });
    }
  });

  app.get('/api/applications', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const apps = db.getApplicationsForUser(user.id);
      res.json({ applications: apps });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch applications' });
    }
  });

  app.post('/api/applications', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { jobId, resumeFileName, coverNote } = req.body;
      if (!jobId) return res.status(400).json({ error: 'jobId is required' });

      const application = db.createApplication(user.id, jobId, {
        resumeFileName,
        coverNote,
      });
      res.json({ application });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit application' });
    }
  });

  app.patch('/api/applications/:id/status', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { status, notes } = req.body as { status: ApplicationStatus; notes?: string };
      if (!status) return res.status(400).json({ error: 'status is required' });

      const updated = db.updateApplicationStatus(req.params.id, status, notes);
      res.json({ application: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update application status' });
    }
  });

  // Demo Preset loader for testing
  app.post('/api/student/preset', (req, res) => {
    try {
      const user = getAuthUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { preset } = req.body as { preset: 'unskilled' | 'skilled' | 'hired' };
      db.resetToPreset(user.id, preset || 'unskilled');

      const profile = db.getStudentProfile(user.id);
      const skills = db.getStudentSkills(user.id);
      const skillMatch = profile ? db.calculateSkillMatch(user.id, profile.desiredRole) : null;
      const apps = db.getApplicationsForUser(user.id);

      res.json({
        success: true,
        profile,
        skills,
        skillMatch,
        applications: apps,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to apply preset' });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career Compass Server & Database running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Career Compass server:', err);
});
