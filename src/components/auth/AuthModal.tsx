import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { useAppContext } from '../../context/AppContext';
import { Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, addToast } = useAppContext();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    setAuthModalOpen(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!email || !email.includes('@')) {
      errs.email = 'Please enter a valid university email address.';
    } else {
      const isUniDomain =
        email.endsWith('.edu') ||
        email.includes('.ac.') ||
        email.includes('univ') ||
        email.includes('campus');
      if (!isUniDomain) {
        errs.emailHint = 'Tip: Using a .edu or university domain grants an instant verified student badge!';
      }
    }

    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    if (mode === 'signup') {
      if (!name || name.trim().length < 2) {
        errs.name = 'Full name is required.';
      }
      if (password !== confirmPassword) {
        errs.confirm = 'Passwords do not match.';
      }
    }

    setErrors(errs);
    return !errs.email && !errs.password && (!errs.name && !errs.confirm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      login({
        id: 'l_alex',
        name: mode === 'signup' && name ? name : 'Alex Moreau',
        initials: mode === 'signup' && name ? name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'AM',
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

      setIsLoading(false);
      handleClose();
      addToast(
        mode === 'signup'
          ? 'Welcome to BorrowBuddy! Your verified student account is ready.'
          : 'Welcome back, Alex!',
        'success'
      );
    }, 500);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      title={mode === 'login' ? 'Sign in to BorrowBuddy' : 'Create Student Account'}
      maxWidth="sm"
    >
      <div className="space-y-4">
        
        {/* Sliding Tabs */}
        <div className="flex justify-center">
          <Tabs
            tabs={[
              { id: 'login', label: 'Sign in' },
              { id: 'signup', label: 'Register' },
            ]}
            activeTab={mode}
            onChange={(id) => {
              setMode(id as any);
              setErrors({});
            }}
          />
        </div>

        {/* Student Verification Helper Banner */}
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-2.5 text-xs text-teal-900">
          <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <strong>Campus verification active:</strong> Use your official university email (e.g. <code>.edu</code> or <code>.ac.uk</code>) to automatically earn verified status.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="e.g. Alex Moreau"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          )}

          <div>
            <Input
              label="Student Email"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            {errors.emailHint && (
              <p className="text-[11px] text-amber-700 mt-1 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                {errors.emailHint}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirm}
            />
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 text-[11px] text-muted">
          Demo platform mode — credentials are simulated locally.
        </div>
      </div>
    </Modal>
  );
};
