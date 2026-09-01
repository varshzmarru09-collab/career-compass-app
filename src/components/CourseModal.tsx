import React, { useState } from 'react';
import { Course, CourseStatus } from '../types/index.js';
import {
  X,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  PlayCircle,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseModalProps {
  course: (Course & { status: CourseStatus; progress: number }) | null;
  onClose: () => void;
  onStartCourse: (courseId: string) => Promise<void>;
  onCompleteCourse: (courseId: string) => Promise<void>;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onStartCourse,
  onCompleteCourse,
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!course) return null;

  const handleStart = async () => {
    setIsProcessing(true);
    try {
      await onStartCourse(course.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await onCompleteCourse(course.id);
      // Trigger subtle celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Ignore confetti if not supported
      }
      setSuccessMessage(`Skill "${course.skillName}" verified & added to your profile!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  const activeLesson = course.syllabus[activeLessonIndex] || course.syllabus[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="course-detail-modal"
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            id="btn-close-course-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {course.difficulty} Level
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Teaches: {course.skillName}
            </span>
            {course.status === 'Completed' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{course.name}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{course.provider}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{course.rating} ★ ({course.enrolledCount.toLocaleString()} learners)</span>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successMessage}</span>
            </div>
            <span>Match Recalculated</span>
          </div>
        )}

        {/* Content: Syllabus & Interactive Lesson Viewer */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lesson List (Left) */}
          <div className="md:col-span-1 border-r border-slate-100 pr-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
              Module Curriculum ({course.syllabus.length} Lessons)
            </h4>
            <div className="space-y-1.5">
              {course.syllabus.map((lesson, idx) => {
                const isActive = activeLessonIndex === idx;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="leading-tight">{lesson.title}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{lesson.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Lesson Content (Right) */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Lesson {activeLessonIndex + 1} of {course.syllabus.length}
                </span>
                <span className="text-xs text-slate-500">{activeLesson.duration}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">{activeLesson.title}</h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
                <p>
                  <strong>Lesson Overview:</strong> {activeLesson.summary}
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5 text-xs">
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                    Interactive Competency Check:
                  </div>
                  <p className="text-slate-600 text-xs">
                    Review practical concepts, execute code snippets, and complete validation exercises for{' '}
                    <span className="font-semibold text-blue-700">{course.skillName}</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Status:{' '}
                <span className="font-bold text-slate-800">{course.status || 'Recommended'}</span>
              </div>

              <div className="flex items-center gap-2">
                {course.status !== 'Completed' && (
                  <>
                    {course.status !== 'In Progress' && (
                      <button
                        id="btn-start-course"
                        onClick={handleStart}
                        disabled={isProcessing}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                      >
                        Start Course
                      </button>
                    )}
                    <button
                      id="btn-complete-course"
                      onClick={handleComplete}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Completed & Verify Skill
                    </button>
                  </>
                )}

                {course.status === 'Completed' && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Skill Verified in Profile
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
