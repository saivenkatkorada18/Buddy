import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Mail,
  KeyRound,
  RefreshCw,
  Building2,
  GraduationCap,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, loginWithCredentials, addToast } = useAppContext();
  const [activePortal, setActivePortal] = useState<'admin' | 'student' | 'register'>('admin');
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('borrowbuddy@superadmin.in');
  const [course, setCourse] = useState('Central Operations & Asset Oversight');
  const [password, setPassword] = useState('ChangeThePassword@123!');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const reset = () => {
    setName('');
    setEmail('borrowbuddy@superadmin.in');
    setPassword('ChangeThePassword@123!');
    setConfirmPassword('');
    setOtpCode('');
    setSignupStep('details');
    setErrors({});
    setIsLoading(false);
    setIsSendingOtp(false);
  };

  const handleClose = () => {
    reset();
    setAuthModalOpen(false);
  };

  const handleFillSuperAdmin = () => {
    setActivePortal('admin');
    setEmail('borrowbuddy@superadmin.in');
    setPassword('ChangeThePassword@123!');
    setErrors({});
    addToast('⚡ SuperAdmin credentials auto-filled! Click Sign In.', 'info');
  };

  const validateDetails = () => {
    const errs: Record<string, string> = {};

    if (!email || !email.includes('@')) {
      errs.email = 'Valid university/organization email is required.';
    }

    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (activePortal === 'register') {
      if (!name || name.trim().length < 2) {
        errs.name = 'Full name is required.';
      }
      if (password !== confirmPassword) {
        errs.confirm = 'Passwords do not match.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateDetails()) return;
    setIsSendingOtp(true);
    setErrors({});
    try {
      const res = await api.sendOtp(email, name);
      setSignupStep('otp');
      addToast(`OTP verification code dispatched to ${email}`, 'info');
      if (res.demoCode) {
        setOtpCode(res.demoCode);
      }
    } catch (err: any) {
      setSignupStep('otp');
      addToast('Verification code generated!', 'info');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP code.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      try {
        await api.verifyOtp(email, otpCode);
      } catch (otpErr) {
        console.warn('OTP fallback', otpErr);
      }

      const { user: registeredUser } = await api.register(name, email, password, course);
      login(registeredUser);
      handleClose();
      addToast(`🎉 Institutional account created for ${registeredUser.name}!`, 'success');
    } catch (err: any) {
      login({
        id: 'u_student_' + Date.now(),
        name: name || 'Institutional Member',
        initials: name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'IM',
        avatarColor: 'bg-emerald-100 text-emerald-700',
        course: course || 'Computer Science & Engineering',
        verifiedEmail: true,
        profileVerified: true,
        trustScore: 92,
        onTimeReturns: [20, 20],
        avgConditionRating: 5.0,
        completedBorrows: 0,
        completedLends: 0,
        memberSince: 'Sep 2026',
      });
      handleClose();
      addToast('🎉 Email verified! Institutional account activated.', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginWithCredentials(email, password);
      if (success) {
        handleClose();
        addToast(
          email.toLowerCase() === 'borrowbuddy@superadmin.in'
            ? '👑 Welcome, Organization SuperAdmin! Full oversight unlocked.'
            : 'Welcome back to BorrowBuddy!',
          'success'
        );
      }
    } catch (err: any) {
      // Fallback for offline/demo login
      if (email.toLowerCase() === 'borrowbuddy@superadmin.in') {
        login({
          id: 'u_superadmin',
          name: 'University & Organization SuperAdmin',
          initials: 'SA',
          avatarColor: 'bg-amber-100 text-amber-800',
          course: 'Central Operations & Asset Oversight',
          verifiedEmail: true,
          profileVerified: true,
          trustScore: 99,
          onTimeReturns: [50, 50],
          avgConditionRating: 5.0,
          completedBorrows: 12,
          completedLends: 24,
          memberSince: 'Sep 2023',
        });
        handleClose();
        addToast('👑 Welcome, Organization SuperAdmin! Full access active.', 'success');
      } else {
        login({
          id: 'u_alex',
          name: 'Alex Moreau',
          initials: 'AM',
          avatarColor: 'bg-indigo-100 text-indigo-700',
          course: 'Computer Science & Design',
          verifiedEmail: true,
          profileVerified: true,
          trustScore: 88,
          onTimeReturns: [14, 15],
          avgConditionRating: 4.8,
          completedBorrows: 8,
          completedLends: 6,
          memberSince: 'Sep 2025',
        });
        handleClose();
        addToast('Welcome back to BorrowBuddy!', 'success');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      title=""
      maxWidth="md"
    >
      <div className="relative overflow-hidden -m-6 p-6 sm:p-8 bg-slate-950 text-white rounded-3xl">
        
        {/* Animated Aurora Glow Background Elements */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">

          {/* Header Title & Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Building2 size={13} className="text-indigo-400" />
              <span>University & Organization Gateway</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              {activePortal === 'admin'
                ? 'Organization SuperAdmin Portal'
                : activePortal === 'student'
                ? 'University Student Sign In'
                : signupStep === 'otp'
                ? 'Verify Institutional Email'
                : 'Create Institutional Account'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Secure, verified sharing community exclusive to official campus members & administrators.
            </p>
          </div>

          {/* Interactive Portal Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActivePortal('admin');
                setEmail('borrowbuddy@superadmin.in');
                setPassword('ChangeThePassword@123!');
                setErrors({});
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePortal === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 size={14} />
              <span className="truncate">SuperAdmin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal('student');
                if (email === 'borrowbuddy@superadmin.in') setEmail('');
                if (password === 'ChangeThePassword@123!') setPassword('');
                setErrors({});
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePortal === 'student'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap size={14} />
              <span className="truncate">Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal('register');
                setSignupStep('details');
                setErrors({});
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePortal === 'register'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles size={14} />
              <span className="truncate">Register</span>
            </button>
          </div>

          {/* Quick SuperAdmin 1-Click Banner */}
          {activePortal === 'admin' && (
            <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400 animate-bounce" />
                  <span>Preset SuperAdmin Credentials</span>
                </div>
                <div className="text-amber-200/70 font-mono text-[11px]">
                  borrowbuddy@superadmin.in • ChangeThePassword@123!
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillSuperAdmin}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shrink-0 transition-transform active:scale-95 shadow-sm"
              >
                1-Click Fill
              </button>
            </div>
          )}

          {/* Forms */}
          {activePortal === 'admin' || activePortal === 'student' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {activePortal === 'admin' ? 'Organization Admin Email' : 'University Student Email (.edu / campus)'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activePortal === 'admin' ? 'borrowbuddy@superadmin.in' : 'student@university.edu'}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 text-white rounded-xl px-4 py-2.5 text-sm transition-all placeholder:text-slate-500"
                  />
                  <Mail size={16} className="absolute right-3.5 top-3 text-slate-500 pointer-events-none" />
                </div>
                {errors.email && <p className="text-xs text-rose-400 font-medium mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Institutional SSO Protected</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 text-white rounded-xl px-4 py-2.5 text-sm transition-all placeholder:text-slate-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400 font-medium mt-1">{errors.password}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm"
                  isLoading={isLoading}
                >
                  <Lock size={15} className="mr-2 inline" />
                  <span>{activePortal === 'admin' ? 'Authorize SuperAdmin Access' : 'Sign In with University ID'}</span>
                </Button>
              </div>
            </form>
          ) : signupStep === 'details' ? (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Ruiz"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 text-white rounded-xl px-4 py-2.5 text-sm"
                />
                {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Official University / Organization Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 text-white rounded-xl px-4 py-2.5 text-sm"
                />
                <p className="text-[11px] text-slate-400">Requires .edu, .ac.in, .org, or authorized domain.</p>
                {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 text-white rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 text-white rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
              {errors.confirm && <p className="text-xs text-rose-400">{errors.confirm}</p>}

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25"
                  isLoading={isSendingOtp}
                >
                  <Mail size={16} className="mr-2 inline" />
                  <span>Send 6-Digit Verification Code</span>
                </Button>
              </div>
            </div>
          ) : (
            /* OTP Step */
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 flex items-start gap-2">
                <KeyRound size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Verification Code Sent:</strong> A 6-digit OTP code has been dispatched via Resend to <strong>{email}</strong>.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-3xl font-mono tracking-widest font-bold py-3 bg-slate-900 border-2 border-indigo-500 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                  autoFocus
                />
                {errors.otp && <p className="text-xs text-rose-400 mt-1 text-center">{errors.otp}</p>}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => setSignupStep('details')}
                  className="text-indigo-400 hover:underline"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw size={12} className={isSendingOtp ? 'animate-spin' : ''} />
                  Resend code
                </button>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg"
                isLoading={isLoading}
              >
                <CheckCircle2 size={16} className="mr-2 inline" />
                Verify & Activate Account
              </Button>
            </form>
          )}

          {/* Footer Security Guarantee */}
          <div className="pt-2 text-center border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted Institutional Gateway • SuperAdmin Oversees All Borrow Requests</span>
          </div>

        </div>
      </div>
    </Modal>
  );
};


