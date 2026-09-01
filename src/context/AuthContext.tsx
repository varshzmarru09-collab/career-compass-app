import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, StudentProfile, SkillMatchResult } from '../types/index.js';
import { api, getStoredToken, setStoredToken, clearStoredToken } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  skillMatch: SkillMatchResult | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (name?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loadPreset: (preset: 'unskilled' | 'skilled' | 'hired') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skillMatch, setSkillMatch] = useState<SkillMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async () => {
    try {
      if (!getStoredToken()) {
        setUser(null);
        setProfile(null);
        setSkillMatch(null);
        return;
      }
      const meData = await api.getMe();
      setUser(meData.user);
      setProfile(meData.profile);

      if (meData.profile) {
        const studentData = await api.getStudentProfile();
        setSkillMatch(studentData.skillMatch);
      } else {
        setSkillMatch(null);
      }
    } catch (err) {
      console.warn('Session check failed or expired:', err);
      clearStoredToken();
      setUser(null);
      setProfile(null);
      setSkillMatch(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = getStoredToken();
      if (token) {
        await refreshProfile();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setStoredToken(res.token);
      setUser(res.user);
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password);
      setStoredToken(res.token);
      setUser(res.user);
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (name?: string, email?: string) => {
    setIsLoading(true);
    try {
      const res = await api.googleLogin(name, email);
      setStoredToken(res.token);
      setUser(res.user);
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    } finally {
      clearStoredToken();
      setUser(null);
      setProfile(null);
      setSkillMatch(null);
      setIsLoading(false);
    }
  };

  const loadPreset = async (preset: 'unskilled' | 'skilled' | 'hired') => {
    setIsLoading(true);
    try {
      const res = await api.loadPreset(preset);
      setProfile(res.profile);
      setSkillMatch(res.skillMatch);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        skillMatch,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        refreshProfile,
        loadPreset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
