import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Compass,
  LayoutDashboard,
  Award,
  BookOpen,
  Briefcase,
  Send,
  TrendingUp,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, activeTab, onNavigate }) => {
  const activeKey = currentTab || activeTab || 'dashboard';
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skills', label: 'My Skills', icon: Award },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Send },
    { id: 'progress', label: 'Career Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top National/Government & Career platform branding ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">National Student Skill-to-Employment Portal</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Skill Assessment & Direct Job Matching Engine</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            id="nav-brand-logo"
            onClick={() => onNavigate(user ? 'dashboard' : 'welcome')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Compass className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">Career Compass</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Student Module
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">From Skills to Careers</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeKey === item.id || (item.id === 'progress' && activeKey === 'roadmap');
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Section: User Profile & Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* User Pill & Logout */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs border border-blue-200">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px]">
                        {user.name || 'Student'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                        {profile?.desiredRole || 'Setup Career'}
                      </div>
                    </div>
                  </div>

                  <button
                    id="btn-nav-logout"
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-signin"
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Sign In
                </button>
                <button
                  id="btn-nav-getstarted"
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {user && mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{user.email}</span>
            </div>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
