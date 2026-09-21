import React, { useState } from 'react';
import { AnimatedWordmark } from '../components/brand/AnimatedWordmark';
import { AuthPanel } from '../components/auth/AuthPanel';
import { Button } from '../components/ui/Button';
import { LoopMark } from '../components/brand/LoopMark';
import { continueAsGuest } from '../lib/auth';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { ShieldCheck, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface WelcomeGateViewProps {
  onResolved: (user: User, isGuest?: boolean) => void;
}

export const WelcomeGateView: React.FC<WelcomeGateViewProps> = ({ onResolved }) => {
  const { addToast } = useAppContext();
  const [viewState, setViewState] = useState<'choice' | 'form'>('choice');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isExiting, setIsExiting] = useState(false);

  // Trigger choice -> form transition in place
  const handleOpenForm = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setViewState('form');
  };

  const handleBackToChoice = () => {
    setViewState('choice');
  };

  // Successful auth or guest trigger -> run exit transition
  const handleAuthSuccess = (user: User, isGuest = false) => {
    setIsExiting(true);
    setTimeout(() => {
      onResolved(user, isGuest);
    }, 420);
  };

  const handleGuestContinue = () => {
    const { user, isGuest } = continueAsGuest();
    handleAuthSuccess(user, isGuest);
  };

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col md:flex-row h-screen w-screen overflow-hidden select-none bg-cream"
      aria-label="BorrowBuddy Welcome Gate"
    >
      {/* =========================================================================
          LEFT PANEL (55% on Desktop, Top Collapsed Band on Mobile) - indigo-900
          ========================================================================= */}
      <section
        className={cn(
          'relative flex flex-col justify-between w-full md:w-[55%] bg-indigo-900 text-paper p-6 sm:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-indigo-800/80 shrink-0 overflow-hidden',
          isExiting && 'animate-gate-exit-up'
        )}
        aria-labelledby="welcome-heading"
      >
        {/* Subtle noise / dot texture */}
        <div className="absolute inset-0 bg-grid-dark opacity-35 pointer-events-none" aria-hidden="true" />

        {/* Ambient Gradient Glow */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header & Animated Wordmark */}
        <div className="relative z-10 space-y-6">
          <h1 id="welcome-heading" className="sr-only">
            BorrowBuddy — Borrow instead of buy
          </h1>

          {/* Animated Wordmark component */}
          <AnimatedWordmark size="hero" showTagline={true} />

          {/* Value statement */}
          <p
            className="text-sm sm:text-base md:text-lg text-indigo-100/90 font-sans max-w-xl leading-relaxed hidden sm:block"
            style={{
              opacity: 0,
              animation: 'fade-rise 300ms var(--ease-out-soft) 1100ms forwards',
            }}
          >
            Find what you need from students on your campus — calculators, lab coats, chargers, books and sports gear.
          </p>
        </div>

        {/* Bottom Trust Proof Points (Staggered fade-rise in sequence) */}
        <div
          className="relative z-10 pt-6 mt-auto hidden md:flex items-center gap-6 border-t border-indigo-800/60"
          style={{
            opacity: 0,
            animation: 'fade-rise 300ms var(--ease-out-soft) 1180ms forwards',
          }}
        >
          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-indigo-200">
            <span className="p-1 rounded-lg bg-indigo-800/80 text-teal-300 border border-indigo-700/50">
              <ShieldCheck size={14} />
            </span>
            <span>Student verified</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-indigo-200">
            <span className="p-1 rounded-lg bg-indigo-800/80 text-amber-300 border border-indigo-700/50">
              <MapPin size={14} />
            </span>
            <span>Nearby campus</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-indigo-200">
            <span className="p-1 rounded-lg bg-indigo-800/80 text-teal-300 border border-indigo-700/50">
              <Sparkles size={14} />
            </span>
            <span>Free or low deposit</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RIGHT PANEL (45% on Desktop, Main Form on Mobile) - cream ground
          ========================================================================= */}
      <section
        className={cn(
          'relative flex flex-col justify-center items-center w-full md:w-[45%] flex-grow bg-cream p-6 sm:p-10 lg:p-12 overflow-y-auto',
          isExiting && 'animate-gate-exit-down'
        )}
      >
        {/* Slow 8s ambient rotation loop mark behind panel at 6% opacity */}
        <div
          className="absolute pointer-events-none select-none text-indigo-950 opacity-[0.06] animate-ambient-spin"
          aria-hidden="true"
        >
          <LoopMark size={380} />
        </div>

        {/* Panel Content Container */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md my-auto">
          {viewState === 'choice' ? (
            /* Choice State: Log in or Create Account buttons */
            <div
              className="space-y-6 text-center"
              style={{
                opacity: 0,
                animation: 'fade-rise 300ms var(--ease-out-soft) 1150ms forwards',
              }}
            >
              <div className="space-y-1.5 text-left sm:text-center">
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                  Welcome to campus sharing
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  Connect with students to borrow or lend essential gear.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenForm('login')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-paper font-heading font-bold text-sm shadow-sm transition-all duration-180 ease-out-soft flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  <span>Log in</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenForm('signup')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-paper hover:bg-stone-50 text-ink border border-line font-heading font-bold text-sm shadow-xs transition-all duration-180 ease-out-soft flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  <span>Create account</span>
                </button>

                {/* Quiet Guest Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGuestContinue}
                    className="text-xs font-heading font-semibold text-stone-500 hover:text-indigo-900 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 rounded px-2 py-1"
                  >
                    Continue as guest
                  </button>
                </div>
              </div>

              {/* Live Notice Footnote */}
              <p className="text-[11px] text-stone-500 font-sans font-medium pt-2 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Mode • Connected to Supabase Cloud & Prisma Engine</span>
              </p>
            </div>
          ) : (
            /* Form State: In-place transformed AuthPanel */
            <div
              className="w-full"
              style={{
                opacity: 0,
                transform: 'translateY(12px)',
                animation: 'fade-rise 280ms var(--ease-out-soft) forwards',
              }}
            >
              <AuthPanel
                initialTab={activeTab}
                onSuccess={(user) => handleAuthSuccess(user, false)}
                onBack={handleBackToChoice}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
