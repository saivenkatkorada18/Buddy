import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Menu, X, PlusCircle, LayoutDashboard, Shield, Compass, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../lib/motion';

export const Navbar: React.FC = () => {
  const { currentView, navigate, isLoggedIn, user, setAuthModalOpen, setListItemModalOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isMobileMenuOpen, drawerRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Explore', view: 'explore' as const, icon: <Compass size={18} /> },
    { label: 'How It Works', view: 'how-it-works' as const, icon: <HelpCircle size={18} /> },
    { label: 'Trust & Safety', view: 'trust-safety' as const, icon: <Shield size={18} /> },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 h-20 transition-all duration-200 ease-out-soft flex items-center',
          isScrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-line shadow-rest'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Logo onClick={() => navigate('landing')} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-paper/80 backdrop-blur-xs p-1.5 rounded-2xl border border-line/60 shadow-rest">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => navigate(link.view)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-180 ease-out-soft select-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'text-muted hover:text-ink hover:bg-line/40'
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalOpen(true);
                } else {
                  setListItemModalOpen(true);
                }
              }}
              className="gap-1.5"
            >
              <PlusCircle size={16} />
              <span>List an item</span>
            </Button>

            {isLoggedIn && user ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate('dashboard')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('dashboard');
                  }
                }}
                className={cn(
                  'flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                  currentView === 'dashboard'
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-paper border-line hover:border-indigo-200'
                )}
              >
                <Avatar initials={user.initials} colorClass={user.avatarColor} size="sm" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-heading font-bold text-ink">{user.name.split(' ')[0]}</div>
                  <div className="text-[11px] font-mono text-teal-700 font-semibold">{user.trustScore} Trust</div>
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                Get started
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-ink hover:bg-line/40 focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Open mobile navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Slide-In Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-paper p-6 shadow-float border-l border-line flex flex-col justify-between overflow-y-auto animate-card-deal"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
                <Logo onClick={() => { navigate('landing'); setIsMobileMenuOpen(false); }} size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-line/40"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => {
                      navigate(link.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-heading font-semibold text-base transition-colors',
                      currentView === link.view
                        ? 'bg-indigo-50 text-indigo-900'
                        : 'text-muted hover:text-ink hover:bg-line/30'
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                ))}

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      navigate('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-heading font-semibold text-base transition-colors',
                      currentView === 'dashboard'
                        ? 'bg-indigo-50 text-indigo-900'
                        : 'text-muted hover:text-ink hover:bg-line/30'
                    )}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-line space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (!isLoggedIn) setAuthModalOpen(true);
                  else setListItemModalOpen(true);
                }}
              >
                <PlusCircle size={18} className="mr-2" />
                <span>List an item</span>
              </Button>

              {!isLoggedIn ? (
                <Button
                  className="w-full justify-center"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                >
                  Get started
                </Button>
              ) : (
                <div className="p-3 bg-cream rounded-2xl border border-line flex items-center gap-3">
                  <Avatar initials={user?.initials || 'ST'} colorClass={user?.avatarColor || 'bg-indigo-100 text-indigo-700'} size="md" />
                  <div>
                    <div className="font-heading font-bold text-sm text-ink">{user?.name}</div>
                    <div className="text-xs text-muted">{user?.course}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
