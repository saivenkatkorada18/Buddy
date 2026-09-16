export interface TrustBreakdown {
  score: number;
  onTimeComponent: number;
  verifiedComponent: number;
  conditionComponent: number;
  completedComponent: number;
  band: 'Highly Trusted' | 'Trusted' | 'Building Trust' | 'New Member';
  color: string;
  badgeBg: string;
  badgeText: string;
  strokeColor: string;
}

export const calculateTrustScore = (
  onTimeReturns: [number, number], // [on-time, total]
  verifiedEmail: boolean,
  avgConditionRating: number, // 0-5
  completedTransactions: number // borrows + lends
): TrustBreakdown => {
  // 40% on-time returns
  const onTimeRatio = onTimeReturns[1] > 0 ? (onTimeReturns[0] / onTimeReturns[1]) : 1;
  const onTimeComponent = Math.round(onTimeRatio * 40);

  // 25% verified student status
  const verifiedComponent = verifiedEmail ? 25 : 0;

  // 20% item condition feedback
  const conditionRatio = Math.max(0, Math.min(avgConditionRating / 5, 1));
  const conditionComponent = Math.round(conditionRatio * 20);

  // 15% completed transactions (caps at 20 transactions for full points)
  const completedRatio = Math.min(completedTransactions / 20, 1);
  const completedComponent = Math.round(completedRatio * 15);

  const score = Math.min(Math.max(onTimeComponent + verifiedComponent + conditionComponent + completedComponent, 0), 100);
  
  let band: TrustBreakdown['band'] = 'New Member';
  let color = 'bg-stone-100 text-stone-700';
  let badgeBg = '#F5F5F4';
  let badgeText = '#44403C';
  let strokeColor = '#78716C';

  if (score >= 85) {
    band = 'Highly Trusted';
    color = 'bg-teal-100 text-teal-800';
    badgeBg = '#CCFBF1';
    badgeText = '#115E59';
    strokeColor = '#0D9488';
  } else if (score >= 70) {
    band = 'Trusted';
    color = 'bg-indigo-100 text-indigo-800';
    badgeBg = '#E0E7FF';
    badgeText = '#312E81';
    strokeColor = '#4338CA';
  } else if (score >= 50) {
    band = 'Building Trust';
    color = 'bg-amber-100 text-amber-800';
    badgeBg = '#FEF3C7';
    badgeText = '#92400E';
    strokeColor = '#F59E0B';
  }

  return {
    score,
    onTimeComponent,
    verifiedComponent,
    conditionComponent,
    completedComponent,
    band,
    color,
    badgeBg,
    badgeText,
    strokeColor,
  };
};
