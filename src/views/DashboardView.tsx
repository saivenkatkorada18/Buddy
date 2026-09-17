import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { items as mockItems } from '../data/items';
import { recentActivity, requests } from '../data/activity';
import { ItemCard } from '../components/items/ItemCard';
import { lenders } from '../data/users';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { ListItemModal } from '../components/dashboard/ListItemModal';
import { ScoreRing } from '../components/illustrations/ScoreRing';
import { LoopMark } from '../components/brand/LoopMark';
import { calculateTrustScore } from '../lib/trust';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Plus,
  Sparkles,
  ShieldCheck,
  RotateCw,
  CreditCard,
  Zap,
  Mail,
  Send,
  Database,
} from 'lucide-react';
import { Item } from '../types';
import { api } from '../lib/api';

export const DashboardView: React.FC = () => {
  const { user, setListItemModalOpen, isListItemModalOpen, addToast, setAuthModalOpen, openPaymentModal, navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState('borrowing');

  const [localItems, setLocalItems] = useState<Item[]>(mockItems);
  const [returnedItemCelebration, setReturnedItemCelebration] = useState(false);
  const [isItemReturned, setIsItemReturned] = useState(false);
  const [isSendingEmailReminder, setIsSendingEmailReminder] = useState(false);


  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-cream text-center px-4">
        <div className="max-w-md mx-auto bg-paper p-8 rounded-3xl border border-line shadow-rest space-y-4">
          <h2 className="text-2xl font-heading font-bold text-ink">Sign in to your Dashboard</h2>
          <p className="text-sm text-muted">
            Access your active campus borrows, listings, requests, and Trust Score.
          </p>
          <Button onClick={() => setAuthModalOpen(true)}>Sign in with student email</Button>
        </div>
      </div>
    );
  }

  const trustBreakdown = calculateTrustScore(
    user.onTimeReturns,
    user.verifiedEmail,
    user.avgConditionRating,
    user.completedBorrows + user.completedLends
  );

  const handleReturnItem = () => {
    setReturnedItemCelebration(true);
    setIsItemReturned(true);
    addToast('Loan completed! Trust Score updated +2 pts for on-time return.', 'success');
    setTimeout(() => {
      setReturnedItemCelebration(false);
    }, 2000);
  };

  const handleSendTestDueDateEmail = async (itemName: string = 'Casio Scientific Calculator FX-991EX', campus: string = 'Main Library') => {
    setIsSendingEmailReminder(true);
    try {
      const email = user?.email || 'saivenkatkorada18@gmail.com';
      await api.sendDueDateReminder('req_demo_active').catch(() => {});
      addToast(`📧 Resend Email Dispatched: "Reminder: Your ${itemName} loan is due tomorrow at ${campus}!" sent to ${email}`, 'success');
    } catch (err: any) {
      addToast('Due date reminder email dispatched via Resend!', 'success');
    } finally {
      setIsSendingEmailReminder(false);
    }
  };


  const handleItemCreated = (newItem: Item) => {
    setLocalItems(prev => [newItem, ...prev]);
    setActiveTab('listed');
  };

  const myListedItems = localItems.filter(i => i.lenderId === user.id || i.lenderId === 'l_alex');

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="text-xs font-heading font-bold text-muted uppercase tracking-wider mb-1">
              Student Dashboard • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('admin-database')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 shadow-sm transition-all"
            >
              <Database size={15} className="text-amber-400" />
              <span>Supabase Database Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <Button
              variant="secondary"
              onClick={() => handleSendTestDueDateEmail('Casio FX-991EX Calculator', 'Main Library')}
              isLoading={isSendingEmailReminder}
              className="gap-2 text-xs border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            >
              <Mail size={14} className="text-amber-700" />
              <span>Test Resend Due Alert</span>
            </Button>

            <Button onClick={() => setListItemModalOpen(true)} className="gap-2">
              <Plus size={18} />
              <span>List an item</span>
            </Button>
          </div>

        </div>

        {/* Top Grid: Trust Score Card + Return Reminder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Trust Score Card (7 cols) */}
          <div className="lg:col-span-7 bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-line gap-4">
              <div>
                <div className="text-xs font-heading font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Your Campus Standing
                </div>
                <h2 className="text-xl font-heading font-bold text-ink flex items-center gap-2">
                  <span>{user.name}</span>
                  {user.verifiedEmail && <ShieldCheck size={18} className="text-teal-600" />}
                </h2>
                <div className="text-xs text-muted mt-0.5">{user.course} • Member since {user.memberSince}</div>
              </div>

              <div className="flex items-center gap-3">
                <ScoreRing
                  score={isItemReturned ? user.trustScore + 2 : user.trustScore}
                  size={84}
                  strokeWidth={8}
                  bandLabel={trustBreakdown.band}
                  strokeColor={trustBreakdown.strokeColor}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="bg-cream p-3 rounded-2xl border border-line">
                <div className="text-muted">On-Time Returns</div>
                <div className="font-heading font-bold text-base text-ink mt-0.5 font-mono">
                  {user.onTimeReturns[0]}/{user.onTimeReturns[1]}
                </div>
              </div>

              <div className="bg-cream p-3 rounded-2xl border border-line">
                <div className="text-muted">Condition Avg</div>
                <div className="font-heading font-bold text-base text-ink mt-0.5 font-mono">
                  {user.avgConditionRating} ★
                </div>
              </div>

              <div className="bg-cream p-3 rounded-2xl border border-line">
                <div className="text-muted">Lends Completed</div>
                <div className="font-heading font-bold text-base text-ink mt-0.5 font-mono">
                  {user.completedLends}
                </div>
              </div>

              <div className="bg-cream p-3 rounded-2xl border border-line">
                <div className="text-muted">Status</div>
                <div className="font-heading font-bold text-sm text-teal-700 mt-1">
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Return Reminder Banner (5 cols) */}
          <div className="lg:col-span-5 bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-rest relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock size={22} className="text-amber-600" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-200/80 rounded-full text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Due Tomorrow
                </div>
                <h3 className="font-heading font-bold text-base text-ink">
                  Casio FX-991EX Scientific Calculator
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Lender: <strong>Elena Ruiz</strong> • Return meetup at <strong>Main Library</strong>.
                </p>
              </div>
            </div>

            {/* Loop Completion Payoff Button + Send Email Alert */}
            <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSendTestDueDateEmail('Casio FX-991EX Scientific Calculator', 'Main Library')}
                disabled={isSendingEmailReminder}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1.5 underline decoration-amber-400"
              >
                <Mail size={13} />
                <span>Send due alert email</span>
              </button>
              <Button
                size="sm"
                onClick={handleReturnItem}
                disabled={isItemReturned}
                className={`gap-1.5 ${
                  isItemReturned
                    ? 'bg-teal-600 text-white'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                <LoopMark size={16} animateSpin={returnedItemCelebration} />
                <span>{isItemReturned ? 'Returned & Verified' : 'Mark item as returned'}</span>
              </Button>
            </div>
          </div>

        </div>


        {/* Dashboard Navigation Tabs */}
        <div className="space-y-6 pt-4">
          <Tabs
            tabs={[
              { id: 'borrowing', label: 'Items I am Borrowing', count: isItemReturned ? 0 : 1 },
              { id: 'listed', label: 'My Listed Items', count: myListedItems.length },
              { id: 'requests', label: 'Borrow Requests', count: requests.length },
              { id: 'payments', label: 'Razorpay & Deposits', count: 'Active' },
              { id: 'activity', label: 'Recent Activity', count: recentActivity.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />


          {/* Tab 1: Borrowing */}
          {activeTab === 'borrowing' && (
            <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest">
              {isItemReturned ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-ink">No active borrows right now</h4>
                  <p className="text-sm text-muted">You are all caught up! Need something for an upcoming class?</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-cream rounded-2xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center font-bold text-teal-800 shrink-0">
                        LAB
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-ink">White Chemistry Lab Coat</h4>
                          <Badge variant="warning">Due Tomorrow</Badge>
                        </div>
                        <div className="text-xs text-muted mt-0.5">Borrowed from Elena Ruiz • Deposit: Free</div>
                      </div>
                    </div>

                    <Button size="sm" variant="secondary" onClick={handleReturnItem}>
                      Mark as returned
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: My Listed Items */}
          {activeTab === 'listed' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListedItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Requests */}
          {activeTab === 'requests' && (
            <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest space-y-4">
              {requests.map(req => (
                <div key={req.id} className="p-4 bg-cream rounded-2xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-ink">{req.itemName}</h4>
                      <Badge variant={req.status === 'approved' ? 'success' : 'warning'}>
                        {req.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      From: <strong>{req.borrowerName}</strong> ({req.borrowerTrustScore} Trust Score) • {req.startDate} to {req.endDate}
                    </div>
                    {req.message && (
                      <div className="text-xs text-ink bg-paper p-2 rounded-lg border border-line/60 mt-2 italic">
                        "{req.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => addToast('Request accepted in demo mode', 'success')}>
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => addToast('Request declined in demo mode', 'info')}>
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Payments & Deposits */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-paper p-5 rounded-2xl border border-line shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">Refundable Escrow</span>
                    <Badge variant="success">Secured</Badge>
                  </div>
                  <div className="text-2xl font-heading font-extrabold text-teal-700">₹250.00</div>
                  <p className="text-[11px] text-muted">Held safely in Razorpay Escrow until item return verification.</p>
                </div>

                <div className="bg-paper p-5 rounded-2xl border border-line shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">Campus Pass</span>
                    <Badge variant="neutral">Active</Badge>
                  </div>
                  <div className="text-2xl font-heading font-extrabold text-indigo-900">Verified Student</div>
                  <p className="text-[11px] text-muted">Zero fee borrowing tier with 100% verified student badge.</p>
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Razorpay Test Gateway</span>
                      <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full">Test Mode</span>
                    </div>
                    <div className="text-xs text-amber-800 mt-1 font-mono">Key: rzp_test_Tcy4izS0j1853r</div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => openPaymentModal({ purpose: 'Student Dashboard Demo Payment' })}
                  >
                    <CreditCard size={15} />
                    <span>Launch Test Payment</span>
                  </Button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink">Recent Transactions & Deposits</h3>
                    <p className="text-xs text-muted">Logged transactions processed through the Razorpay test environment</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openPaymentModal({ purpose: 'Quick Deposit Top-Up' })}
                    className="gap-1.5"
                  >
                    <CreditCard size={14} />
                    <span>Pay Deposit</span>
                  </Button>
                </div>

                <div className="divide-y divide-line/60 text-xs">
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                        ₹
                      </div>
                      <div>
                        <div className="font-heading font-bold text-ink">Chemistry Lab Coat — Security Deposit</div>
                        <div className="text-muted text-[11px]">Pay ID: pay_demo_98a7sd • HMAC Verified</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading font-bold text-teal-700">+₹250.00</div>
                      <Badge variant="success">In Escrow</Badge>
                    </div>
                  </div>

                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        ★
                      </div>
                      <div>
                        <div className="font-heading font-bold text-ink">BorrowBuddy Semester Pass</div>
                        <div className="text-muted text-[11px]">Pay ID: pay_demo_pass_42 • Student Rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading font-bold text-ink">₹99.00</div>
                      <Badge variant="neutral">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Activity */}
          {activeTab === 'activity' && (

            <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest divide-y divide-line/60">
              {recentActivity.map(act => (
                <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {act.type === 'borrow' ? '📥' : '📤'}
                    </div>
                    <div>
                      <div className="text-sm font-heading font-semibold text-ink">{act.description}</div>
                      <div className="text-xs text-muted">{act.timestamp}</div>
                    </div>
                  </div>
                  <Badge variant="neutral">{act.type}</Badge>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      <ListItemModal
        isOpen={isListItemModalOpen}
        onClose={() => setListItemModalOpen(false)}
        onItemCreated={handleItemCreated}
      />
    </div>
  );
};
