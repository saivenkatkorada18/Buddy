import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Accordion } from '../components/ui/Accordion';
import { ScoreRing } from '../components/illustrations/ScoreRing';
import { HeroMockup } from '../components/illustrations/HeroMockup';
import { LoopMark } from '../components/brand/LoopMark';
import { LoopDivider } from '../components/brand/LoopDivider';
import { items } from '../data/items';
import { lenders } from '../data/users';
import { faqs } from '../data/faqs';
import { testimonials } from '../data/testimonials';
import { ItemCard } from '../components/items/ItemCard';
import { ItemArtwork } from '../components/items/ItemArtwork';
import { Avatar } from '../components/ui/Avatar';
import {
  ShieldCheck,
  Leaf,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  CreditCard,
  Zap,
} from 'lucide-react';
import { Category } from '../types';
import { useInViewOnce, useCountUp } from '../lib/motion';

export const LandingView: React.FC = () => {
  const { navigate, setFilters, setAuthModalOpen, setListItemModalOpen, isLoggedIn, openPaymentModal } = useAppContext();


  // Impact Count-Up on first view
  const [impactRef, impactInView] = useInViewOnce<HTMLElement>(0.2);
  const itemsSharedCount = useCountUp(2500, 1200, impactInView);
  const moneySavedCount = useCountUp(18000, 1200, impactInView);
  const studentsCount = useCountUp(1200, 1200, impactInView);

  const popularItems = items.slice(0, 4);

  const categoriesData: { id: Category; label: string; count: number; span: string }[] = [
    { id: 'calculators', label: 'Calculators & Electronics', count: 4, span: 'sm:col-span-2' },
    { id: 'lab-coats', label: 'Lab Coats & Goggles', count: 3, span: 'sm:col-span-1' },
    { id: 'chargers', label: 'Chargers & Adapters', count: 3, span: 'sm:col-span-1' },
    { id: 'books', label: 'Textbooks & Readers', count: 2, span: 'sm:col-span-1' },
    { id: 'sports', label: 'Sports & Fitness Gear', count: 3, span: 'sm:col-span-1' },
    { id: 'tools', label: 'Fix-it & DIY Tools', count: 2, span: 'sm:col-span-1' },
    { id: 'kitchen', label: 'Dorm Kitchen Items', count: 4, span: 'sm:col-span-1' },
    { id: 'stationery', label: 'Drafting & Architecture', count: 3, span: 'sm:col-span-1' },
    { id: 'decor', label: 'Dorm Decor & Mood Lights', count: 4, span: 'sm:col-span-2' },
  ];

  const handleCategorySelect = (category: Category) => {
    setFilters(prev => ({ ...prev, category }));
    navigate('explore');
  };

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION (Asymmetric 7/5 Split, Left Weighted) */}
      <section className="relative overflow-hidden bg-cream pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-line bg-grid-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (7 cols): Graphic Headline Block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-900 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>The student borrowing network</span>
              </div>

              {/* Graphic Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-ink tracking-tight leading-[1.04]">
                Borrow what you need.<br />
                <span className="text-indigo-600">Share what you have.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl">
                BorrowBuddy helps university students find everyday essentials nearby — scientific calculators, lab coats, fast chargers, textbooks, and sports equipment.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Button size="lg" onClick={() => navigate('explore')} className="gap-2">
                  <Compass size={18} />
                  <span>Explore items near you</span>
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    if (!isLoggedIn) setAuthModalOpen(true);
                    else setListItemModalOpen(true);
                  }}
                >
                  List an item
                </Button>
              </div>

              {/* Trust & Proximity Pills */}
              <div className="pt-6 border-t border-line/80 flex flex-wrap gap-6 text-xs font-medium text-ink">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Student verified email</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <MapPin size={13} />
                  </div>
                  <span>Nearby campus pickup</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles size={13} />
                  </div>
                  <span>Save money, zero waste</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Orchestrated SVG App Mockup */}
            <div className="lg:col-span-5">
              <HeroMockup />
            </div>

          </div>
        </div>
      </section>

      {/* 2. IMPACT STRIP (Count-Up on First View) */}
      <section ref={impactRef} className="bg-indigo-900 text-white py-14 border-b border-indigo-800 bg-grid-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-indigo-800/80">
            <div className="px-4">
              <div className="text-3xl sm:text-5xl font-heading font-extrabold text-teal-300 tabular-nums leading-none mb-2">
                {itemsSharedCount.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-indigo-200">Items shared on campus</div>
            </div>

            <div className="px-4">
              <div className="text-3xl sm:text-5xl font-heading font-extrabold text-amber-400 tabular-nums leading-none mb-2">
                ₹{moneySavedCount.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-indigo-200">Saved by students</div>
            </div>

            <div className="px-4">
              <div className="text-3xl sm:text-5xl font-heading font-extrabold text-indigo-300 tabular-nums leading-none mb-2">
                {studentsCount.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-indigo-200">Verified members</div>
            </div>

            <div className="px-4">
              <div className="text-3xl sm:text-5xl font-heading font-extrabold text-paper tabular-nums leading-none mb-2">
                4.9/5
              </div>
              <div className="text-sm font-medium text-indigo-200">Community condition rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRIC CATEGORIES GRID */}
      <section className="py-20 bg-paper border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-heading font-bold text-indigo-600 uppercase tracking-wider mb-2">
                Browse by category
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
                Everything you need, without buying it.
              </h2>
            </div>
            <Button variant="ghost" onClick={() => navigate('explore')} className="self-start md:self-auto gap-1 text-indigo-600">
              <span>View all 9 categories</span>
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesData.map((cat) => (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCategorySelect(cat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategorySelect(cat.id);
                  }
                }}
                className={`group p-5 bg-cream rounded-2xl border border-line shadow-rest hover:shadow-raise hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between ${cat.span}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-xl bg-paper border border-line p-1 flex items-center justify-center shrink-0">
                    <ItemArtwork category={cat.id} size="sm" />
                  </div>
                  <span className="text-xs font-mono font-bold bg-paper px-2.5 py-1 rounded-full border border-line text-muted">
                    {cat.count} listings
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="font-heading font-bold text-base text-ink group-hover:text-indigo-600 transition-colors">
                    {cat.label}
                  </h3>
                  <div className="text-xs text-muted mt-1">Available for quick campus handoff</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR ITEMS NEAR CAMPUS */}
      <section className="py-20 bg-cream border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-heading font-bold text-teal-700 uppercase tracking-wider mb-2">
                Available right now
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
                Popular items near campus
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate('explore')}>
              Explore all items
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS TEASER (Threaded on the Living Loop) */}
      <section className="py-24 bg-paper border-b border-line overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 mb-3">
              <LoopMark size={14} className="text-indigo-600" />
              <span>Simple 3-step loop</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
              How BorrowBuddy works
            </h2>
            <p className="text-muted mt-3">
              A transparent, safe circle for borrowing and returning gear in your student halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-cream rounded-3xl p-8 border border-line shadow-rest relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-xl font-heading font-bold text-ink mb-2">
                Find what you need
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Search verified listings from students in your department or residence halls. Filter by distance, availability, and deposit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-cream rounded-3xl p-8 border border-line shadow-rest relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-xl font-heading font-bold text-ink mb-2">
                Request & meet up
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Send a quick request with your dates. Meet at a safe campus landmark like the library foyer or student union for the handoff.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-cream rounded-3xl p-8 border border-line shadow-rest relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-heading font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                3
              </div>
              <h3 className="text-xl font-heading font-bold text-ink mb-2">
                Return & grow trust
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Hand the item back on time in great condition. Complete the loop, leave feedback, and boost your campus Trust Score.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" onClick={() => navigate('how-it-works')}>
              Read the full borrower & lender guide
            </Button>
          </div>
        </div>
      </section>

      {/* 5.5 RAZORPAY INSTANT CAMPUS ESCROW & DEMO PAYMENTS */}
      <section className="py-20 bg-gradient-to-b from-paper to-cream border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-paper rounded-3xl p-8 sm:p-12 border border-line shadow-raise flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background ambient decoration */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-heading font-bold text-amber-900">
                <CreditCard size={15} className="text-amber-600" />
                <span>Powered by Razorpay Payments</span>
                <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-full">Test Gateway</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
                Zero friction security deposits & instant escrow.
              </h2>

              <p className="text-muted text-sm sm:text-base leading-relaxed">
                Experience seamless micro-transactions for refundable campus deposits, student passes, and item protection waivers — securely verified with HMAC-SHA256 signatures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-cream rounded-2xl border border-line text-xs">
                  <div className="font-heading font-bold text-ink">100% Refundable</div>
                  <div className="text-muted text-[11px] mt-0.5">Automated return release</div>
                </div>
                <div className="p-3 bg-cream rounded-2xl border border-line text-xs">
                  <div className="font-heading font-bold text-ink">Cards & UPI</div>
                  <div className="text-muted text-[11px] mt-0.5">Instant checkout popup</div>
                </div>
                <div className="p-3 bg-cream rounded-2xl border border-line text-xs">
                  <div className="font-heading font-bold text-ink">Trust Score Boost</div>
                  <div className="text-muted text-[11px] mt-0.5">+5 pts for verified deposits</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 relative z-10">
              <Button
                size="lg"
                className="gap-2 justify-center shadow-sm"
                onClick={() => openPaymentModal({ purpose: 'Landing Page Interactive Demo' })}
              >
                <CreditCard size={18} />
                <span>Test Razorpay Checkout</span>
                <ArrowRight size={16} />
              </Button>
              <div className="text-center text-[11px] text-muted">
                Test API Key: <code className="font-mono text-ink">rzp_test_Tcy4izS0j1853r</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST SCORE CENTERPIECE (Indigo-900 Dark Inversion Block) */}

      <section className="py-24 bg-indigo-900 text-white border-b border-indigo-800 bg-grid-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (6 cols): The Trust Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-800/80 border border-indigo-700 text-xs font-semibold text-teal-300">
                <ShieldCheck size={16} className="text-teal-400" />
                <span>Transparent Community Scoring</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
                Built entirely on accountability.
              </h2>

              <p className="text-indigo-200 text-base sm:text-lg leading-relaxed">
                Every member has a transparent Trust Score built from real handoffs. You always know who you're meeting, their on-time track record, and condition history.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-white">40% On-Time Returns</div>
                    <div className="text-xs text-indigo-300">Timely returns build peer reliability.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-white">25% Verified Student Email</div>
                    <div className="text-xs text-indigo-300">Locked to active university domains.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-white">20% Care & Condition Feedback</div>
                    <div className="text-xs text-indigo-300">Reviewed by lenders after every loan.</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="bg-teal-500 text-indigo-950 hover:bg-teal-400 border-0"
                  onClick={() => navigate('trust-safety')}
                >
                  Try the Trust Score Simulator
                </Button>
              </div>
            </div>

            {/* Right Column (6 cols): Sample Profile Card with Live Ring */}
            <div className="lg:col-span-6">
              <div className="bg-paper text-ink rounded-3xl p-6 sm:p-8 shadow-float border border-line max-w-md mx-auto">
                <div className="flex items-center justify-between pb-6 border-b border-line">
                  <div className="flex items-center gap-4">
                    <Avatar initials="SM" colorClass="bg-teal-100 text-teal-800" size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-ink">
                        Sofia Martínez
                        <ShieldCheck size={16} className="text-teal-600" />
                      </div>
                      <div className="text-xs text-muted">Mechanical Engineering • 2nd Year</div>
                    </div>
                  </div>

                  <ScoreRing score={92} size={76} strokeWidth={7} bandLabel="Highly Trusted" />
                </div>

                {/* Breakdown Progress Bars */}
                <div className="mt-6 space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-muted">On-time returns (18/19)</span>
                      <span className="text-ink font-mono">38 / 40 pts</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-[95%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-muted">Verified student status</span>
                      <span className="text-ink font-mono">25 / 25 pts</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-muted">Item condition rating (4.9 / 5.0)</span>
                      <span className="text-ink font-mono">20 / 20 pts</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-[98%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-muted">Completed borrows (24)</span>
                      <span className="text-ink font-mono">15 / 15 pts</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>

                {/* Honesty Footnote */}
                <div className="mt-6 pt-4 border-t border-line text-[11px] text-muted leading-tight">
                  Demonstration scoring model. All ratings are transparent community feedback, subject to review and dispute.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SUSTAINABILITY & THE CALCULATOR EFFECT */}
      <section className="py-20 bg-cream border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-heading font-bold text-teal-700 uppercase tracking-wider mb-2">
              Environmental impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
              Better for your budget. Better for the planet.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Impact 1 */}
            <div className="bg-paper p-8 rounded-3xl border border-line shadow-rest">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-ink mb-2">Prevent duplicate purchases</h3>
              <p className="text-sm text-muted leading-relaxed">
                Most specialized items like lab coats and graphing calculators are used for just one module and then discarded. Borrowing keeps them in active use.
              </p>
            </div>

            {/* Impact 2: The Calculator Effect */}
            <div className="bg-teal-900 text-white p-8 rounded-3xl border border-teal-800 shadow-raise lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
                  The Calculator Effect
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">
                  If 100 students borrow a calculator instead of buying one:
                </h3>
                <p className="text-teal-100 text-base leading-relaxed mb-6">
                  The campus avoids 100 redundant plastic and electronic manufacturing cycles. That saves students over €3,000 in disposable exam spending and prevents kilograms of electronic waste every semester.
                </p>
              </div>

              <div className="pt-4 border-t border-teal-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-teal-200">Start sharing today</span>
                <Button size="sm" className="bg-white text-teal-950 hover:bg-teal-50 border-0" onClick={() => navigate('explore')}>
                  Browse items
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Static Grid, Zero Carousel) */}
      <section className="py-20 bg-paper border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
              Trusted by students everywhere
            </h2>
            <p className="text-muted mt-2">
              Real experiences from students who borrowed before buying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-cream rounded-3xl p-6 border border-line shadow-rest flex flex-col justify-between"
              >
                <p className="text-sm text-ink leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-line/60">
                  <Avatar initials={t.initials} colorClass={t.avatarColor} size="md" />
                  <div>
                    <div className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                      {t.name}
                      {t.hasTrustBadge && <ShieldCheck size={14} className="text-teal-600" />}
                    </div>
                    <div className="text-xs text-muted">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-20 bg-cream border-b border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
              Frequently asked questions
            </h2>
            <p className="text-muted mt-2">
              Everything you need to know about deposits, safety, and campus meetups.
            </p>
          </div>

          <Accordion items={faqs} />
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden bg-grid-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-800 text-teal-300 mb-2">
            <LoopMark size={36} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Your campus already has what you need.
          </h2>

          <p className="text-indigo-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Join a trusted university network that shares more and wastes less. Start borrowing essentials or list something you barely use.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-teal-500 text-indigo-950 hover:bg-teal-400 border-0"
              onClick={() => {
                if (!isLoggedIn) setAuthModalOpen(true);
                else navigate('explore');
              }}
            >
              Join BorrowBuddy
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-indigo-800 text-white hover:bg-indigo-700 border-indigo-700"
              onClick={() => navigate('explore')}
            >
              Browse items
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
