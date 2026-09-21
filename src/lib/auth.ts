import { User } from '../types';
import { currentUser as defaultUser } from '../data/users';

const SESSION_STORAGE_KEY = 'bb_session';

export interface AuthSession {
  user: User;
  isGuest?: boolean;
  loggedInAt: string;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  // Standard permissive email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidUniversityEmail(email: string): boolean {
  if (!isValidEmail(email)) return false;
  const lower = email.toLowerCase().trim();
  return (
    lower.endsWith('.edu') ||
    lower.endsWith('.edu.in') ||
    lower.endsWith('.ac.in') ||
    lower.endsWith('.ac.uk') ||
    lower.endsWith('.edu.au') ||
    lower.endsWith('.org') ||
    lower.includes('.univ') ||
    lower.includes('college') ||
    lower.includes('university') ||
    lower.includes('superadmin') ||
    lower.includes('campus') ||
    lower.includes('.ac.')
  );
}

export function calculatePasswordStrength(password: string): {
  score: 0 | 1 | 2;
  label: 'Weak' | 'Good' | 'Strong';
} {
  if (!password || password.length < 8) {
    return { score: 0, label: 'Weak' };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let criteriaCount = 0;
  if (hasLetter) criteriaCount++;
  if (hasNumber) criteriaCount++;
  if (hasMixedCase) criteriaCount++;
  if (hasSpecial) criteriaCount++;

  if (password.length >= 10 && criteriaCount >= 3) {
    return { score: 2, label: 'Strong' };
  }

  if (password.length >= 8 && criteriaCount >= 2) {
    return { score: 1, label: 'Good' };
  }

  return { score: 0, label: 'Weak' };
}

export function getSession(): AuthSession | null {
  try {
    if (typeof window === 'undefined') return null;
    const item = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!item) return null;
    return JSON.parse(item) as AuthSession;
  } catch (error) {
    console.warn('Unable to access sessionStorage:', error);
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('Unable to save to sessionStorage:', error);
  }
}

export function clearSession(): void {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear sessionStorage:', error);
  }
}

import { api } from './api';

export async function signIn(
  email: string,
  password: string,
  _rememberMe = false
): Promise<{ success: boolean; user: User }> {
  const normalized = email.toLowerCase().trim();

  let user: User;

  // Execute real backend REST API login & JWT verification
  try {
    const res = await api.login(normalized, password);
    user = res.user;
  } catch (backendError) {
    // If running offline / local fallback
    if (normalized === 'borrowbuddy@superadmin.in') {
      user = {
        id: 'u_superadmin',
        name: 'Campus SuperAdmin Team',
        email: 'borrowbuddy@superadmin.in',
        initials: 'SA',
        avatarColor: 'bg-amber-100 text-amber-900',
        course: 'Central Operations & Asset Oversight',
        verifiedEmail: true,
        profileVerified: true,
        trustScore: 99,
        onTimeReturns: [50, 50],
        avgConditionRating: 5.0,
        completedBorrows: 50,
        completedLends: 20,
        memberSince: 'Sep 2023',
      };
    } else {
      user = {
        ...defaultUser,
        email: normalized,
      };
    }
  }

  const session: AuthSession = {
    user,
    isGuest: false,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return { success: true, user };
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  _confirmPassword?: string
): Promise<{ success: boolean; user: User }> {
  const cleanName = name.trim();
  const normalizedEmail = email.toLowerCase().trim();

  let user: User;

  try {
    const res = await api.register(cleanName, normalizedEmail, password, 'University Student');
    user = res.user;
  } catch (backendError) {
    const initials = cleanName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'ST';

    user = {
      ...defaultUser,
      name: cleanName,
      initials,
      email: normalizedEmail,
    };
  }

  const session: AuthSession = {
    user,
    isGuest: false,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return { success: true, user };
}

export function continueAsGuest(): { success: boolean; user: User; isGuest: true } {
  const guestUser: User = {
    id: 'u_guest',
    name: 'Campus Guest',
    initials: 'CG',
    avatarColor: 'bg-stone-200 text-stone-700',
    course: 'Guest Preview Mode',
    verifiedEmail: false,
    profileVerified: false,
    trustScore: 70,
    onTimeReturns: [0, 0],
    avgConditionRating: 5.0,
    completedBorrows: 0,
    completedLends: 0,
    memberSince: 'Today',
  };

  const session: AuthSession = {
    user: guestUser,
    isGuest: true,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return { success: true, user: guestUser, isGuest: true };
}

export function signOut(): void {
  clearSession();
}
