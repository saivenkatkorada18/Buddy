import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateTrustScore } from '../lib/trust';
import { ScoreRing } from '../components/illustrations/ScoreRing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, Sliders } from 'lucide-react';

export const TrustSafetyView: React.FC = () => {
  const { addToast } = useAppContext();

  // Interactive Live Trust Score Simulator State
  const [onTimeReturns, setOnTimeReturns] = useState(18); // out of 20
  const [isVerified, setIsVerified] = useState(true);
  const [avgCondition, setAvgCondition] = useState(4.8); // out of 5
  const [completedTx, setCompletedTx] = useState(18);

  const breakdown = calculateTrustScore([onTimeReturns, 20], isVerified, avgCondition, completedTx);

  // Report Form State
  const [reportType, setReportType] = useState('');
  const [reportItem, setReportItem] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportErrors, setReportErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!reportType) errors.type = 'Please select an issue type.';
    if (!reportDesc || reportDesc.trim().length < 15) errors.desc = 'Please describe the incident in at least 15 characters.';
    if (!reportEmail || !reportEmail.includes('@')) errors.email = 'Please provide a valid student email address.';

    setReportErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReportSuccess(true);
      addToast('Incident report logged in demo mode', 'info');
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-heading font-bold text-teal-900 shadow-xs">
            <ShieldCheck size={16} className="text-teal-600" />
            <span>Community Safety Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight">
            Trust & Safety on Campus
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            BorrowBuddy is designed from the ground up for university accountability. Learn how Trust Scores are calculated and try the live simulator below.
          </p>
        </div>

        {/* 1. LIVE INTERACTIVE TRUST SCORE SIMULATOR */}
        <div className="bg-paper rounded-3xl p-6 sm:p-10 border border-line shadow-raise mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-line gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Sliders size={14} />
                <span>Interactive Formula Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
                Direct-Manipulation Trust Engine
              </h2>
            </div>
            <div className="text-xs text-muted max-w-xs">
              Drag the sliders to see how on-time returns, verified status, and condition reviews dynamically move your campus standing.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* On-Time Returns Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-ink">On-Time Returns (out of 20 total)</span>
                  <span className="text-indigo-600 font-mono font-bold">{onTimeReturns} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={onTimeReturns}
                  onChange={(e) => setOnTimeReturns(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-line rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted">
                  <span>0% on-time (0 pts)</span>
                  <span>Weight: 40% ({breakdown.onTimeComponent} pts)</span>
                  <span>100% on-time (40 pts)</span>
                </div>
              </div>

              {/* Verified Student Toggle */}
              <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-heading font-semibold text-ink">Verified University Email</div>
                  <div className="text-xs text-muted">Mandatory verification via student domain</div>
                </div>
                <Checkbox
                  checked={isVerified}
                  onChange={setIsVerified}
                  label={<span className="text-xs font-bold text-indigo-900">+25 pts</span>}
                />
              </div>

              {/* Average Condition Rating Slider */}
              <div className="pt-2 border-t border-line/60 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-ink">Average Item Condition Feedback</span>
                  <span className="text-indigo-600 font-mono font-bold">{avgCondition.toFixed(1)} / 5.0 ★</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={avgCondition}
                  onChange={(e) => setAvgCondition(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-line rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted">
                  <span>1.0 Star (Poor care)</span>
                  <span>Weight: 20% ({breakdown.conditionComponent} pts)</span>
                  <span>5.0 Stars (Perfect care)</span>
                </div>
              </div>

              {/* Completed Transactions Slider */}
              <div className="pt-2 border-t border-line/60 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-ink">Completed Campus Transactions</span>
                  <span className="text-indigo-600 font-mono font-bold">{completedTx} handoffs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={completedTx}
                  onChange={(e) => setCompletedTx(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-line rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted">
                  <span>0 (New student)</span>
                  <span>Weight: 15% ({breakdown.completedComponent} pts)</span>
                  <span>20+ (Experienced peer)</span>
                </div>
              </div>

            </div>

            {/* Right Live Gauge Card (5 cols) */}
            <div className="lg:col-span-5 bg-cream rounded-3xl p-6 sm:p-8 border border-line text-center space-y-6">
              <div className="inline-block">
                <ScoreRing
                  score={breakdown.score}
                  size={140}
                  strokeWidth={11}
                  bandLabel={breakdown.band}
                  strokeColor={breakdown.strokeColor}
                  live
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Simulated Standing
                </div>
                <div className="text-xl font-heading font-bold text-ink">
                  {breakdown.band}
                </div>
                <div className="text-xs text-muted mt-1">
                  Score: <span className="font-mono font-bold text-ink">{breakdown.score} / 100</span>
                </div>
              </div>

              {/* Point Breakdown Sum */}
              <div className="grid grid-cols-2 gap-2 text-xs text-left pt-3 border-t border-line">
                <div className="bg-paper p-2.5 rounded-xl border border-line">
                  <span className="text-muted block">Returns:</span>
                  <span className="font-bold text-ink font-mono">{breakdown.onTimeComponent} / 40</span>
                </div>
                <div className="bg-paper p-2.5 rounded-xl border border-line">
                  <span className="text-muted block">Verified:</span>
                  <span className="font-bold text-ink font-mono">{breakdown.verifiedComponent} / 25</span>
                </div>
                <div className="bg-paper p-2.5 rounded-xl border border-line">
                  <span className="text-muted block">Condition:</span>
                  <span className="font-bold text-ink font-mono">{breakdown.conditionComponent} / 20</span>
                </div>
                <div className="bg-paper p-2.5 rounded-xl border border-line">
                  <span className="text-muted block">Volume:</span>
                  <span className="font-bold text-ink font-mono">{breakdown.completedComponent} / 15</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. REPORT AN ISSUE DEMO FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
              Report an Issue or Dispute
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              If an item was returned late, damaged, or a meetup was missed, submit an incident report. All reports trigger automated review and mediation.
            </p>
            <div className="p-4 bg-paper rounded-2xl border border-line space-y-2 text-xs text-muted">
              <div className="font-bold text-ink">Privacy & Review Pledge:</div>
              <div>• Reports are confidential between both parties and campus safety.</div>
              <div>• Scores can be recalculated upon resolution of verified disputes.</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest">
            {reportSuccess ? (
              <div className="text-center py-8 space-y-4 animate-card-deal">
                <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold text-ink">Report Logged</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Your demonstration incident report has been registered. In live production, our campus trust team contacts both parties within 24 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setReportSuccess(false)}>
                  Submit another report
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <Select
                  label="Incident Category"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  options={[
                    { value: '', label: 'Select an issue type...' },
                    { value: 'late', label: 'Item returned past deadline' },
                    { value: 'damage', label: 'Item returned damaged or altered' },
                    { value: 'no-show', label: 'Borrower / Lender did not attend meetup' },
                    { value: 'deposit', label: 'Dispute over deposit refund' },
                    { value: 'other', label: 'Other community guideline concern' },
                  ]}
                  error={reportErrors.type}
                />

                <Input
                  label="Your University Email"
                  type="email"
                  placeholder="alex.moreau@university.edu"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  error={reportErrors.email}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-heading font-medium text-ink">
                    Incident Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what occurred, dates, and what resolution you are requesting..."
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    className={`w-full bg-paper border border-line rounded-xl p-3 text-sm text-ink placeholder:text-muted/60 transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none ${
                      reportErrors.desc ? 'border-rose-500 animate-shake' : 'hover:border-indigo-300'
                    }`}
                  />
                  {reportErrors.desc && (
                    <p className="text-xs font-medium text-rose-600">{reportErrors.desc}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={isSubmitting}>
                    Submit demonstration report
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
