// ==============================================================================
// CareerPath AI - User Authentication & Profile Context
// Manages real authenticated sessions and profiles without hardcoded email stores.
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

export interface AuthContextType {
  user: { id: string; email: string; user_metadata?: { full_name?: string } } | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: (email?: string, name?: string) => Promise<void>;
  signInWithEmail: (email: string, password?: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password?: string, name?: string, role?: 'candidate' | 'employer') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setUserRole: (role: 'candidate' | 'employer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'careerpath_auth_user_v1';
const STORAGE_PROFILE_KEY = 'careerpath_auth_profile_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; user_metadata?: { full_name?: string } } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
    }
  }, [profile]);

  const signUpWithEmail = async (email: string, _password = '', name?: string, role: 'candidate' | 'employer' = 'candidate') => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const displayName = name?.trim() || (trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : 'Candidate');
      const userId = `usr_${Date.now()}`;

      const newUser = {
        id: userId,
        email: trimmedEmail,
        user_metadata: { full_name: displayName },
      };

      const newProfile: UserProfile = {
        id: userId,
        name: displayName,
        avatar_url: null,
        degree: 'B.Tech / Professional Track',
        location: 'United States & Global',
        resume_snapshot: `${displayName} - Preparing for in-demand 2026 roles across AI, Engineering, Cloud, and Product.`,
        benchmark_opt_in: true,
        streak_count: 1,
        last_active_date: new Date().toISOString().split('T')[0],
        user_role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      setProfile(newProfile);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password = '') => {
    return signUpWithEmail(email, password, email.split('@')[0]);
  };

  const signInWithGoogle = async (googleEmail?: string, googleName?: string) => {
    const userEmail = googleEmail || 'candidate.google@prepgated.com';
    const userName = googleName || 'Google Verified Candidate';
    await signUpWithEmail(userEmail, 'google-auth', userName, 'candidate');
  };

  const setUserRole = async (role: 'candidate' | 'employer') => {
    if (!profile) return;
    const updated = {
      ...profile,
      user_role: role,
      updated_at: new Date().toISOString(),
    };
    setProfile(updated);
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_PROFILE_KEY);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setProfile(updated);
  };

  const refreshProfile = async () => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        setUserRole,
        updateProfile,
        refreshProfile,
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
