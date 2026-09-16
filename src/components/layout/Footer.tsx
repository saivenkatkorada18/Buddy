import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { LoopMark } from '../brand/LoopMark';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setAuthModalOpen, setListItemModalOpen, isLoggedIn, addToast } = useAppContext();

  const handleLink = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  const handleDemoToast = (name: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    addToast(`${name} is documented in our Trust & Safety guide`, 'info');
  };

  return (
    <footer className="bg-indigo-900 text-white pt-16 pb-12 border-t border-indigo-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-indigo-800/80">
          
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" onClick={() => navigate('landing')} />
            <p className="text-indigo-200 text-sm leading-relaxed max-w-sm mt-3">
              BorrowBuddy connects university students to share everyday tools, gear, and study essentials. Save money, meet campus peers, and cut student waste.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-800/60 border border-indigo-700/50 text-xs text-teal-300 font-medium">
              <Shield size={14} className="text-teal-400" />
              <span>Verified university community</span>
            </div>
          </div>

          {/* Navigation Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li>
                <button onClick={handleLink(() => navigate('explore'))} className="hover:text-white transition-colors">
                  Explore items
                </button>
              </li>
              <li>
                <button
                  onClick={handleLink(() => {
                    if (!isLoggedIn) setAuthModalOpen(true);
                    else setListItemModalOpen(true);
                  })}
                  className="hover:text-white transition-colors"
                >
                  List an item
                </button>
              </li>
              <li>
                <button onClick={handleLink(() => navigate('how-it-works'))} className="hover:text-white transition-colors">
                  How it works
                </button>
              </li>
              <li>
                <button onClick={handleLink(() => navigate('trust-safety'))} className="hover:text-white transition-colors">
                  Trust & safety
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li>
                <button onClick={handleLink(() => navigate('explore'))} className="hover:text-white transition-colors">
                  Calculators & electronics
                </button>
              </li>
              <li>
                <button onClick={handleLink(() => navigate('explore'))} className="hover:text-white transition-colors">
                  Lab coats & goggles
                </button>
              </li>
              <li>
                <button onClick={handleLink(() => navigate('explore'))} className="hover:text-white transition-colors">
                  Chargers & adapters
                </button>
              </li>
              <li>
                <button onClick={handleLink(() => navigate('explore'))} className="hover:text-white transition-colors">
                  Textbooks & readers
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Safety & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li>
                <button onClick={handleDemoToast('Help Center')} className="hover:text-white transition-colors">
                  Help center
                </button>
              </li>
              <li>
                <button onClick={handleDemoToast('Community Guidelines')} className="hover:text-white transition-colors">
                  Community guidelines
                </button>
              </li>
              <li>
                <button onClick={handleDemoToast('Privacy Policy')} className="hover:text-white transition-colors">
                  Privacy policy
                </button>
              </li>
              <li>
                <button onClick={handleDemoToast('Terms of Service')} className="hover:text-white transition-colors">
                  Terms of service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <LoopMark size={20} className="text-indigo-400" />
            <span>© 2026 BorrowBuddy. Made for smarter student living.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-teal-300">
              <Sparkles size={13} />
              <span>Zero late fees with verified handoffs</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
