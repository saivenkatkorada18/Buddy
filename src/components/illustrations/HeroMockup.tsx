import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useSessionOrchestratedLoad, useReducedMotion } from '../../lib/motion';
import { ShieldCheck, MapPin, Star, Sparkles } from 'lucide-react';

export const HeroMockup: React.FC<{ className?: string }> = ({ className }) => {
  const hasSeenSession = useSessionOrchestratedLoad('bb_hero_mockup_seen');
  const prefersReducedMotion = useReducedMotion();
  
  // Stagger deal-in stage
  const [dealStage, setDealStage] = useState(hasSeenSession || prefersReducedMotion ? 3 : 0);

  useEffect(() => {
    if (hasSeenSession || prefersReducedMotion) {
      setDealStage(3);
      return;
    }
    const t1 = setTimeout(() => setDealStage(1), 100);
    const t2 = setTimeout(() => setDealStage(2), 220);
    const t3 = setTimeout(() => setDealStage(3), 360);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hasSeenSession, prefersReducedMotion]);

  return (
    <div className={cn('relative w-full max-w-lg mx-auto select-none', className)} aria-hidden="true">
      {/* Ambient background glow ring */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-200/40 via-teal-100/30 to-amber-100/30 rounded-4xl filter blur-2xl -z-10 opacity-70"></div>

      {/* Main Container Layer with Subtle Rotation */}
      <div className="relative space-y-4">
        
        {/* Card 1: Top Priority Item (Casio Calculator with Sofia's 92 Trust Score) */}
        <div
          className={cn(
            'bg-paper rounded-3xl p-5 border border-line/80 shadow-raise transition-all duration-500 ease-spring transform',
            dealStage >= 1
              ? 'opacity-100 translate-y-0 rotate-1'
              : 'opacity-0 translate-y-8 rotate-3'
          )}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-line/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-heading font-bold text-xs flex items-center justify-center border border-teal-200">
                SM
              </div>
              <div>
                <div className="text-xs font-heading font-bold text-ink flex items-center gap-1">
                  Sofia Martínez
                  <ShieldCheck size={13} className="text-teal-600" />
                </div>
                <div className="text-[11px] text-muted">Engineering • 24 lends</div>
              </div>
            </div>

            {/* Animated Trust Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-bold text-teal-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="tabular-nums font-mono">92</span>
              <span className="text-[10px] font-normal text-teal-700">Trust</span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-18 h-18 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 p-2">
              {/* Mini vector Casio preview */}
              <div className="w-full h-full bg-indigo-900 rounded-lg p-1 flex flex-col justify-between shadow-xs">
                <div className="h-3 bg-teal-900 rounded-xs flex items-center justify-end px-1">
                  <div className="w-4 h-1 bg-emerald-400 rounded-xs"></div>
                </div>
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-1.5 bg-indigo-600 rounded-xs"></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span>Calculators</span>
                <span className="text-muted">•</span>
                <span className="text-muted flex items-center gap-0.5">
                  <Star size={11} className="text-amber-500 fill-amber-500" /> 4.9
                </span>
              </div>
              <h4 className="font-heading font-bold text-ink text-sm sm:text-base mt-0.5 truncate">
                Casio FX-991EX ClassWiz
              </h4>
              <div className="flex items-center justify-between text-xs text-muted mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-muted" /> Library Cafe (0.2km)
                </span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  Free
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Second Item (Chemistry Lab Coat) */}
        <div
          className={cn(
            'bg-paper/95 backdrop-blur-xs rounded-3xl p-4 border border-line/70 shadow-rest transition-all duration-500 ease-spring transform -ml-2',
            dealStage >= 2
              ? 'opacity-100 translate-y-0 -rotate-1'
              : 'opacity-0 translate-y-8 -rotate-3'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-700 font-bold">
                <Sparkles size={20} className="text-teal-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted">Science Building (0.5km)</div>
                <h5 className="font-heading font-bold text-ink text-sm">White Chemistry Lab Coat (M)</h5>
                <div className="text-[11px] text-teal-700 font-medium mt-0.5">Elena R. • 95 Trust Score</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">
                Available Now
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Third Stacked Item (Fast USB-C Charger) */}
        <div
          className={cn(
            'bg-paper/90 backdrop-blur-xs rounded-2xl p-3.5 border border-line/60 shadow-rest transition-all duration-500 ease-spring transform ml-4',
            dealStage >= 3
              ? 'opacity-100 translate-y-0 rotate-0'
              : 'opacity-0 translate-y-8 rotate-2'
          )}
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                ⚡
              </div>
              <span className="font-heading font-semibold text-ink">USB-C 65W Laptop Fast Charger</span>
            </div>
            <span className="text-muted tabular-nums">Student Union • 0.1km</span>
          </div>
        </div>

      </div>
    </div>
  );
};
