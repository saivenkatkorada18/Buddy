import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import {
  signIn,
  signUp,
  isValidEmail,
  isValidUniversityEmail,
  calculatePasswordStrength,
} from '../../lib/auth';
import { User } from '../../types';
import {
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthPanelProps {
  initialTab?: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onBack?: () => void;
  isModal?: boolean;
  className?: string;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  initialTab = 'login',
  onSuccess,
  onBack,
  isModal = false,
  className,
}) => {
  const { addToast } = useAppContext();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  const handleFillSuperAdmin = () => {
    setTab('login');
    setEmail('borrowbuddy@superadmin.in');
    setPassword('ChangeThePassword@123!');
    setErrors({});
    addToast('⚡ SuperAdmin credentials auto-filled! Click Log in.', 'info');
  };

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Interaction / Error Tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakingField, setShakingField] = useState<string | null>(null);
  const [submitErrorAnnouncement, setSubmitErrorAnnouncement] = useState('');

  // Submit / Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field Refs for Auto-Focus & Shake
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const signupTabRef = useRef<HTMLButtonElement>(null);

  // Password strength calculation
  const strength = calculatePasswordStrength(password);

  // Focus the first field when tab or panel changes
  useEffect(() => {
    if (tab === 'login') {
      emailRef.current?.focus();
    } else {
      nameRef.current?.focus();
    }
  }, [tab]);

  // Tab Keyboard Navigation (Left / Right Arrow)
  const handleTabKeyDown = (e: React.KeyboardEvent, current: 'login' | 'signup') => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextTab = current === 'login' ? 'signup' : 'login';
      setTab(nextTab);
      if (nextTab === 'login') loginTabRef.current?.focus();
      else signupTabRef.current?.focus();
    }
  };

  // Field Validation Helper
  const validateField = (field: string, val: string): string => {
    if (field === 'name') {
      if (!val || val.trim().length < 2) {
        return 'Enter your full name (at least 2 characters).';
      }
    }

    if (field === 'email') {
      if (!val || !val.trim()) {
        return 'University email is required.';
      }
      if (!isValidEmail(val)) {
        return 'Enter a valid email address.';
      }
      if (tab === 'signup' && !isValidUniversityEmail(val)) {
        return 'That looks like a personal address — use your university email so we can verify you.';
      }
    }

    if (field === 'password') {
      if (!val || val.length < 8) {
        return 'Password must be at least 8 characters long.';
      }
    }

    if (field === 'confirmPassword') {
      if (!val) {
        return 'Please confirm your password.';
      }
      if (val !== password) {
        return 'Passwords do not match.';
      }
    }

    return '';
  };

  // Handle Blur Validation
  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  // Handle Change Re-Validation (Live clearing once errored)
  const handleChange = (field: string, val: string, setter: (v: string) => void) => {
    setter(val);
    if (touched[field] || errors[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const triggerShake = (fieldName: string, element: HTMLInputElement | null) => {
    setShakingField(fieldName);
    element?.focus();
    setTimeout(() => setShakingField(null), 400);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    const newErrors: Record<string, string> = {};

    if (tab === 'login') {
      const emailErr = validateField('email', email);
      const passErr = validateField('password', password);
      if (emailErr) newErrors.email = emailErr;
      if (passErr) newErrors.password = passErr;
    } else {
      const nameErr = validateField('name', name);
      const emailErr = validateField('email', email);
      const passErr = validateField('password', password);
      const confirmErr = validateField('confirmPassword', confirmPassword);
      if (nameErr) newErrors.name = nameErr;
      if (emailErr) newErrors.email = emailErr;
      if (passErr) newErrors.password = passErr;
      if (confirmErr) newErrors.confirmPassword = confirmErr;
    }

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus and shake the first errored field
      const firstKey = Object.keys(newErrors)[0];
      setSubmitErrorAnnouncement(`Form has errors: ${newErrors[firstKey]}`);

      if (firstKey === 'name') triggerShake('name', nameRef.current);
      else if (firstKey === 'email') triggerShake('email', emailRef.current);
      else if (firstKey === 'password') triggerShake('password', passwordRef.current);
      else if (firstKey === 'confirmPassword') triggerShake('confirmPassword', confirmPasswordRef.current);
      return;
    }

    setSubmitErrorAnnouncement('');
    setIsSubmitting(true);

    try {
      let resultUser: User;
      if (tab === 'login') {
        const res = await signIn(email, password, rememberMe);
        resultUser = res.user;
      } else {
        const res = await signUp(name, email, password, confirmPassword);
        resultUser = res.user;
      }

      // Success state: draw checkmark, then trigger onSuccess
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess(resultUser);
      }, 280);
    } catch (err: any) {
      setIsSubmitting(false);
      addToast(err?.message || 'Authentication error', 'error');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast("Demo build — password reset isn't available.", 'info');
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Back Control */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-muted hover:text-indigo-900 transition-colors mb-4 px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Back to choice screen"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      )}

      {/* Accessible Tab Header with Sliding Indicator */}
      <div
        role="tablist"
        aria-label="Authentication Options"
        className="relative grid grid-cols-2 p-1 bg-stone-200/80 rounded-2xl mb-5 select-none"
      >
        {/* Sliding indicator pill */}
        <div
          className={cn(
            'absolute top-1 bottom-1 w-[calc(50%-4px)] bg-paper rounded-xl shadow-xs transition-transform duration-200 ease-out-soft',
            tab === 'signup' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
          )}
          aria-hidden="true"
        />

        <button
          ref={loginTabRef}
          role="tab"
          id="tab-login"
          aria-selected={tab === 'login'}
          aria-controls="panel-login"
          tabIndex={tab === 'login' ? 0 : -1}
          type="button"
          onClick={() => {
            setTab('login');
            setErrors({});
          }}
          onKeyDown={(e) => handleTabKeyDown(e, 'login')}
          className={cn(
            'relative z-10 py-2 text-sm font-heading font-bold text-center rounded-xl transition-colors duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
            tab === 'login' ? 'text-indigo-950' : 'text-muted hover:text-ink'
          )}
        >
          Log in
        </button>

        <button
          ref={signupTabRef}
          role="tab"
          id="tab-signup"
          aria-selected={tab === 'signup'}
          aria-controls="panel-signup"
          tabIndex={tab === 'signup' ? 0 : -1}
          type="button"
          onClick={() => {
            setTab('signup');
            setErrors({});
          }}
          onKeyDown={(e) => handleTabKeyDown(e, 'signup')}
          className={cn(
            'relative z-10 py-2 text-sm font-heading font-bold text-center rounded-xl transition-colors duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
            tab === 'signup' ? 'text-indigo-950' : 'text-muted hover:text-ink'
          )}
        >
          Sign up
        </button>
      </div>

      {/* Live Error Announcement Region for Screen Readers */}
      <div aria-live="assertive" className="sr-only">
        {submitErrorAnnouncement}
      </div>

      {/* 1-Click SuperAdmin Quick-Fill Badge */}
      {tab === 'login' && (
        <div className="flex items-center justify-end pb-1">
          <button
            type="button"
            onClick={handleFillSuperAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-heading font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 shadow-2xs transition-all hover:scale-102 focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <Zap size={13} className="text-amber-600 fill-amber-500" />
            <span>⚡ 1-Click SuperAdmin Fill</span>
          </button>
        </div>
      )}

      {/* Form Container with Smooth Height Transition */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
        id={tab === 'login' ? 'panel-login' : 'panel-signup'}
        role="tabpanel"
        aria-labelledby={tab === 'login' ? 'tab-login' : 'tab-signup'}
      >
        {/* Sign up Notice */}
        {tab === 'signup' && (
          <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
            <GraduationCap size={16} className="text-indigo-600 shrink-0" />
            <span>Use your university email to become verified.</span>
          </div>
        )}

        {/* Full Name (Sign up only) */}
        {tab === 'signup' && (
          <div className={cn('space-y-1', shakingField === 'name' && 'animate-shake')}>
            <label
              htmlFor="auth-name"
              className="block text-xs font-heading font-bold text-ink"
            >
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              id="auth-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="e.g. Alex Moreau"
              value={name}
              onChange={(e) => handleChange('name', e.target.value, setName)}
              onBlur={(e) => handleBlur('name', e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'error-auth-name' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 bg-paper rounded-xl border text-sm text-ink placeholder:text-stone-400 transition-all duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
                errors.name
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-line hover:border-stone-300'
              )}
            />
            {errors.name && (
              <p id="error-auth-name" className="text-xs text-red-600 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
              </p>
            )}
          </div>
        )}

        {/* University Email */}
        <div className={cn('space-y-1', shakingField === 'email' && 'animate-shake')}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="auth-email"
              className="block text-xs font-heading font-bold text-ink"
            >
              University email <span className="text-red-500">*</span>
            </label>
          </div>
          <input
            ref={emailRef}
            id="auth-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="e.g. alex.moreau@univ.edu"
            value={email}
            onChange={(e) => handleChange('email', e.target.value, setEmail)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-auth-email' : undefined}
            className={cn(
              'w-full px-3.5 py-2.5 bg-paper rounded-xl border text-sm text-ink placeholder:text-stone-400 transition-all duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
              errors.email
                ? 'border-red-400 bg-red-50/30'
                : 'border-line hover:border-stone-300'
            )}
          />
          {errors.email && (
            <p id="error-auth-email" className="text-xs text-red-600 font-medium flex items-center gap-1 pt-0.5">
              <AlertCircle size={12} className="shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className={cn('space-y-1', shakingField === 'password' && 'animate-shake')}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="auth-password"
              className="block text-xs font-heading font-bold text-ink"
            >
              Password <span className="text-red-500">*</span>
            </label>
            {tab === 'login' && (
              <a
                href="#forgot-password"
                onClick={handleForgotPassword}
                className="text-xs font-heading font-medium text-indigo-700 hover:text-indigo-900 underline focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
              >
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              ref={passwordRef}
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => handleChange('password', e.target.value, setPassword)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'error-auth-password' : undefined}
              className={cn(
                'w-full pl-3.5 pr-10 py-2.5 bg-paper rounded-xl border text-sm text-ink placeholder:text-stone-400 transition-all duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
                errors.password
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-line hover:border-stone-300'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p id="error-auth-password" className="text-xs text-red-600 font-medium flex items-center gap-1 pt-0.5">
              <AlertCircle size={12} />
              <span>{errors.password}</span>
            </p>
          )}

          {/* Password Strength Meter (Sign up only) */}
          {tab === 'signup' && password.length > 0 && (
            <div className="pt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-muted">
                <span>Password strength:</span>
                <span
                  aria-live="polite"
                  className={cn(
                    strength.score === 2 && 'text-emerald-700',
                    strength.score === 1 && 'text-amber-700',
                    strength.score === 0 && 'text-rose-600'
                  )}
                >
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1.5" aria-hidden="true">
                <div
                  className={cn(
                    'rounded-full transition-colors duration-200',
                    strength.score >= 0 ? (strength.score === 0 ? 'bg-rose-500' : strength.score === 1 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-stone-200'
                  )}
                />
                <div
                  className={cn(
                    'rounded-full transition-colors duration-200',
                    strength.score >= 1 ? (strength.score === 1 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-stone-200'
                  )}
                />
                <div
                  className={cn(
                    'rounded-full transition-colors duration-200',
                    strength.score === 2 ? 'bg-emerald-500' : 'bg-stone-200'
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password (Sign up only) */}
        {tab === 'signup' && (
          <div className={cn('space-y-1', shakingField === 'confirmPassword' && 'animate-shake')}>
            <label
              htmlFor="auth-confirm-password"
              className="block text-xs font-heading font-bold text-ink"
            >
              Confirm password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={confirmPasswordRef}
                id="auth-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value, setConfirmPassword)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'error-auth-confirm' : undefined}
                className={cn(
                  'w-full pl-3.5 pr-10 py-2.5 bg-paper rounded-xl border text-sm text-ink placeholder:text-stone-400 transition-all duration-180 focus-visible:ring-2 focus-visible:ring-indigo-600',
                  errors.confirmPassword
                    ? 'border-red-400 bg-red-50/30'
                    : 'border-line hover:border-stone-300'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded focus-visible:ring-2 focus-visible:ring-indigo-600"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="error-auth-confirm" className="text-xs text-red-600 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle size={12} />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        )}

        {/* Remember me (Log in only) */}
        {tab === 'login' && (
          <div className="flex items-center gap-2 pt-1">
            <input
              id="auth-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-line focus:ring-indigo-600 focus-visible:ring-2"
            />
            <label htmlFor="auth-remember-me" className="text-xs text-muted select-none cursor-pointer">
              Remember me for this session
            </label>
          </div>
        )}

        {/* Fixed Width Submit Button with Crossfade Spinner & Checkmark */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={cn(
              'w-full min-h-[48px] px-6 py-3 rounded-2xl font-heading font-bold text-sm text-paper flex items-center justify-center transition-all duration-200 ease-out-soft select-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
              isSuccess
                ? 'bg-emerald-600'
                : 'bg-indigo-900 hover:bg-indigo-950 active:scale-[0.99] shadow-sm'
            )}
          >
            {isSuccess ? (
              <span className="inline-flex items-center gap-2 text-paper">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    style={{
                      strokeDasharray: 32,
                      strokeDashoffset: 0,
                      animation: 'checkmark-draw 240ms var(--ease-out-soft) forwards',
                    }}
                  />
                </svg>
                <span>Success!</span>
              </span>
            ) : isSubmitting ? (
              <span className="inline-flex items-center gap-2 text-paper">
                <svg
                  className="w-5 h-5 animate-spin text-paper"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{tab === 'login' ? 'Logging in…' : 'Creating account…'}</span>
              </span>
            ) : (
              <span>{tab === 'login' ? 'Log in' : 'Create account'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
