import React from 'react';
import { cn } from '../../lib/utils';

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {}

export const LoopIcon: React.FC<IllustrationProps> = ({ className, ...props }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-10 h-10", className)}
    aria-hidden="true"
    {...props}
  >
    <path 
      d="M30 50 C30 20, 70 20, 70 50 C70 80, 30 80, 30 50 Z" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-indigo-600"
    />
    <path 
      d="M20 40 L30 50 L40 40" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-indigo-600"
    />
  </svg>
);

export const StepIllustration: React.FC<IllustrationProps & { step: 1 | 2 | 3 }> = ({ step, className, ...props }) => {
  return (
    <svg 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="60" cy="60" r="50" className="fill-indigo-50" />
      {step === 1 && (
        <>
          <rect x="40" y="30" width="40" height="60" rx="4" className="fill-indigo-200" />
          <path d="M45 40 H75 M45 50 H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="70" r="10" className="fill-indigo-500" />
        </>
      )}
      {step === 2 && (
        <>
          <path d="M30 60 Q60 30 90 60 Q60 90 30 60 Z" className="fill-teal-200" />
          <circle cx="60" cy="60" r="15" className="fill-teal-500" />
          <path d="M55 60 L60 65 L68 55" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {step === 3 && (
        <>
          <rect x="35" y="45" width="50" height="40" rx="4" className="fill-amber-200" />
          <path d="M35 55 Q60 70 85 55" stroke="white" strokeWidth="4" />
          <circle cx="60" cy="35" r="12" className="fill-amber-500" />
        </>
      )}
    </svg>
  );
};

export const ImpactVisual: React.FC<IllustrationProps & { type: 'money' | 'waste' | 'community' }> = ({ type, className, ...props }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-16 h-16", className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="50" cy="50" r="45" className={cn(
        type === 'money' && "fill-indigo-100",
        type === 'waste' && "fill-teal-100",
        type === 'community' && "fill-amber-100"
      )} />
      {type === 'money' && (
        <path d="M35 50 H65 M50 35 V65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-indigo-600" />
      )}
      {type === 'waste' && (
        <path d="M35 60 L50 35 L65 60 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" className="text-teal-600" />
      )}
      {type === 'community' && (
        <g className="text-amber-600">
          <circle cx="40" cy="40" r="10" fill="currentColor" />
          <circle cx="60" cy="40" r="10" fill="currentColor" />
          <path d="M25 70 Q50 50 75 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

export { HeroMockup } from './HeroMockup';
