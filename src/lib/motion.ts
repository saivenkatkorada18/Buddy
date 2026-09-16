import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect whether the user has requested reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Trigger an effect once when an element enters the viewport.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView, threshold]);

  return [ref, isInView];
}

/**
 * Smooth tabular count-up for numbers with reduced motion and tabular formatting support.
 */
export function useCountUp(
  endValue: number,
  durationMs = 1200,
  startTrigger = true,
  decimals = 0
): number {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!startTrigger) return;
    if (prefersReducedMotion) {
      setCount(endValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * endValue;
      
      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, durationMs, startTrigger, decimals, prefersReducedMotion]);

  return count;
}

/**
 * Ensures the hero orchestrated animation only plays once per session.
 */
export function useSessionOrchestratedLoad(key = 'bb_hero_orchestrated_seen'): boolean {
  const [hasPlayed, setHasPlayed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!hasPlayed) {
      try {
        sessionStorage.setItem(key, 'true');
      } catch {
        // storage disabled fallback
      }
    }
  }, [hasPlayed, key]);

  return hasPlayed;
}

/**
 * Accessible Focus Trap Hook for Modals and Drawers.
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const element = containerRef.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}
