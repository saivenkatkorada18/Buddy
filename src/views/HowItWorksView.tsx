import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { LoopMark } from '../components/brand/LoopMark';
import { ShieldCheck, UserCheck, CheckCircle2, ArrowRight, HeartHandshake, Sparkles, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const HowItWorksView: React.FC = () => {
  const { navigate, setAuthModalOpen, isLoggedIn } = useAppContext();
  const [activeMobileTrack, setActiveMobileTrack] = useState<'borrower' | 'lender'>('borrower');

  const borrowerSteps = [
    {
      num: '1',
      title: 'Sign in with university email',
      desc: 'Verify your student credentials in 30 seconds to join your campus network.',
    },
    {
      num: '2',
      title: 'Search & request gear',
      desc: 'Browse verified listings nearby. Choose pickup dates and send a request with a short note.',
    },
    {
      num: '3',
      title: 'Safe campus handoff',
      desc: 'Meet at an agreed public campus location (e.g., library reception or SU cafe).',
    },
    {
      num: '4',
      title: 'Return on time & build trust',
      desc: 'Return the item in great condition before the deadline to earn Trust Score points.',
    },
  ];

  const lenderSteps = [
    {
      num: '1',
      title: 'List an idle item',
      desc: 'Snap a photo or pick an illustrated category. Set deposit preferences and borrow rules.',
    },
    {
      num: '2',
      title: 'Review student requests',
      desc: 'Check the borrower’s campus Trust Score, on-time history, and proposed dates.',
    },
    {
      num: '3',
      title: 'Meet & hand over',
      desc: 'Meet your peer on campus. Hand over the tool and collect optional refundable deposit.',
    },
    {
      num: '4',
      title: 'Confirm return & rate care',
      desc: 'Inspect your item upon return. Mark it complete, release deposit, and leave positive feedback.',
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-heading font-bold text-indigo-900 shadow-xs">
            <LoopMark size={16} className="text-indigo-600" animateDraw />
            <span>The Circular Student Flow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight">
            How BorrowBuddy Works
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Borrowing instead of buying saves money, cuts carbon, and fosters peer collaboration. Here is how both sides of the circle operate.
          </p>
        </div>

        {/* Mobile Track Switcher */}
        <div className="md:hidden flex justify-center mb-8">
          <div className="bg-paper p-1 rounded-2xl border border-line shadow-rest flex gap-1">
            <button
              onClick={() => setActiveMobileTrack('borrower')}
              className={`px-5 py-2 rounded-xl text-sm font-heading font-bold transition-all ${
                activeMobileTrack === 'borrower' ? 'bg-indigo-600 text-white shadow-sm' : 'text-muted'
              }`}
            >
              Borrower Track
            </button>
            <button
              onClick={() => setActiveMobileTrack('lender')}
              className={`px-5 py-2 rounded-xl text-sm font-heading font-bold transition-all ${
                activeMobileTrack === 'lender' ? 'bg-teal-600 text-white shadow-sm' : 'text-muted'
              }`}
            >
              Lender Track
            </button>
          </div>
        </div>

        {/* Dual Timeline (Side-by-Side on Desktop, Toggled on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* Borrower Track */}
          <div
            className={`bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-raise space-y-8 ${
              activeMobileTrack === 'lender' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-line">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                📥
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-ink">For Borrowers</h2>
                <div className="text-xs text-muted">Get tools you need for free or small deposit</div>
              </div>
            </div>

            <div className="space-y-6">
              {borrowerSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink">{step.title}</h3>
                    <p className="text-xs text-muted leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-line">
              <Button className="w-full" onClick={() => navigate('explore')}>
                Start browsing items
              </Button>
            </div>
          </div>

          {/* Lender Track */}
          <div
            className={`bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-raise space-y-8 ${
              activeMobileTrack === 'borrower' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-line">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                📤
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-ink">For Lenders</h2>
                <div className="text-xs text-muted">Put your idle tools and equipment to good use</div>
              </div>
            </div>

            <div className="space-y-6">
              {lenderSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink">{step.title}</h3>
                    <p className="text-xs text-muted leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-line">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  if (!isLoggedIn) setAuthModalOpen(true);
                  else navigate('dashboard');
                }}
              >
                List your first item
              </Button>
            </div>
          </div>

        </div>

        {/* Safety & Community Pledge */}
        <div className="bg-indigo-900 text-white rounded-4xl p-8 sm:p-12 border border-indigo-800 shadow-float">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-800 text-teal-300 flex items-center justify-center mx-auto">
              <ShieldCheck size={28} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold">
              The Campus Borrowing Pledge
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-4">
              <div className="p-4 bg-indigo-800/60 rounded-2xl border border-indigo-700/50 space-y-2">
                <div className="font-heading font-bold text-sm text-teal-300">1. Public Campus Handoffs</div>
                <div className="text-xs text-indigo-200 leading-relaxed">
                  Always meet in well-lit, public university areas like the library foyer or student union cafe.
                </div>
              </div>

              <div className="p-4 bg-indigo-800/60 rounded-2xl border border-indigo-700/50 space-y-2">
                <div className="font-heading font-bold text-sm text-teal-300">2. Inspect Before & After</div>
                <div className="text-xs text-indigo-200 leading-relaxed">
                  Take a 10-second look at the item condition together during handoff and return.
                </div>
              </div>

              <div className="p-4 bg-indigo-800/60 rounded-2xl border border-indigo-700/50 space-y-2">
                <div className="font-heading font-bold text-sm text-teal-300">3. Respect Due Dates</div>
                <div className="text-xs text-indigo-200 leading-relaxed">
                  Return items promptly. Other students rely on shared gear for their upcoming labs and exams.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
