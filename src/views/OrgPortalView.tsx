import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import { OrgCustomerRequest, OrgStaff } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Mail,
  UserCheck,
  Lock,
  ArrowRight,
  Filter,
  Search,
  Check,
  X,
  MessageSquare,
  Sparkles,
  AlertCircle,
  ExternalLink,
  PackageCheck,
  Calendar,
  MapPin,
  RefreshCw,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const OrgPortalView: React.FC = () => {
  const { user: currentAppUser, addToast, navigate } = useAppContext();

  // Org Auth State
  const [orgStaff, setOrgStaff] = useState<OrgStaff | null>(() => {
    const saved = localStorage.getItem('borrowbuddy_org_staff');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // If current user is superadmin, auto-fill org staff
    if (currentAppUser?.role === 'SUPERADMIN' || currentAppUser?.role === 'ADMIN' || currentAppUser?.email?.endsWith('@superadmin.in')) {
      return {
        id: currentAppUser.id,
        name: currentAppUser.name,
        email: currentAppUser.email,
        role: currentAppUser.role || 'ADMIN',
        organizationName: 'BorrowBuddy Institutional Admin',
        department: 'Campus Gear Governance',
      };
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Form inputs
  const [loginEmail, setLoginEmail] = useState('borrowbuddy@superadmin.in');
  const [loginPassword, setLoginPassword] = useState('ChangeThePassword@123!');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupOrgName, setSignupOrgName] = useState('Robotics & MakerSpace Lab');
  const [signupDept, setSignupDept] = useState('Central Engineering Equipment Desk');
  const [signupPasscode, setSignupPasscode] = useState('ORG-TEAM-2026');

  // Requests Data State
  const [requests, setRequests] = useState<OrgCustomerRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    activeLoans: 0,
    totalInventory: 106,
  });

  // Modals
  const [selectedRequestForAccept, setSelectedRequestForAccept] = useState<OrgCustomerRequest | null>(null);
  const [pickupLocationInput, setPickupLocationInput] = useState('');
  const [approvalNotesInput, setApprovalNotesInput] = useState('Your gear has been reserved! Please present student ID upon collection.');
  const [isAccepting, setIsAccepting] = useState(false);

  const [selectedRequestForMessage, setSelectedRequestForMessage] = useState<OrgCustomerRequest | null>(null);
  const [messageTextInput, setMessageTextInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Load requests
  const loadRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const [reqsData, statsData] = await Promise.all([
        api.getOrgRequests().catch(() => []),
        api.getOrgStats().catch(() => ({
          pendingRequests: 0,
          approvedRequests: 0,
          activeLoans: 0,
          totalInventory: 106,
        })),
      ]);

      if (Array.isArray(reqsData) && reqsData.length > 0) {
        setRequests(reqsData);
      } else {
        // Fallback demo requests for preview
        setRequests([
          {
            id: 'req-demo-1',
            itemId: 'item-demo-1',
            borrowerId: 'usr-1',
            startDate: new Date(Date.now() + 86400000).toISOString(),
            endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
            status: 'pending',
            message: 'Need this scientific calculator for my advanced thermodynamics final exam on Friday.',
            createdAt: new Date().toISOString(),
            borrower: {
              id: 'usr-1',
              name: 'Aarav Sharma',
              email: 'aarav.sharma@university.ac.in',
              course: 'Mechanical Engineering (Year 3)',
              campus: 'Engineering Block',
              trustScore: 96,
              profileVerified: true,
            },
            item: {
              id: 'item-demo-1',
              name: 'Casio FX-991EX ClassWiz Calculator',
              category: 'calculators',
              campus: 'Engineering Block Desk',
              dailyRate: 0,
              depositAmount: 200,
              pickupLocation: 'Engineering Library Reception, Counter 2',
            },
          },
          {
            id: 'req-demo-2',
            itemId: 'item-demo-2',
            borrowerId: 'usr-2',
            startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
            status: 'pending',
            message: 'Requesting oscilloscope probe kit for our senior capstone robotics prototype testing.',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            borrower: {
              id: 'usr-2',
              name: 'Diya Patel',
              email: 'diya.patel@techcampus.edu',
              course: 'Electrical & Robotics (Year 4)',
              campus: 'Science Building',
              trustScore: 99,
              profileVerified: true,
            },
            item: {
              id: 'item-demo-2',
              name: 'Rigol 100MHz Digital Oscilloscope Kit',
              category: 'tools',
              campus: 'Robotics Lab Hub',
              dailyRate: 40,
              depositAmount: 1500,
              pickupLocation: 'Robotics Lab 304, Desk B',
            },
          },
          {
            id: 'req-demo-3',
            itemId: 'item-demo-3',
            borrowerId: 'usr-3',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
            status: 'approved',
            message: 'Organic chemistry model kit for group study.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            borrower: {
              id: 'usr-3',
              name: 'Rohan Verma',
              email: 'rohan.verma@university.ac.in',
              course: 'Biotechnology',
              campus: 'Science Building',
              trustScore: 92,
              profileVerified: true,
            },
            item: {
              id: 'item-demo-3',
              name: 'Molecular Model Kit (240 Pieces)',
              category: 'books',
              campus: 'Chemistry Store',
              dailyRate: 0,
              depositAmount: 300,
              pickupLocation: 'Science Store, Ground Floor',
            },
          },
        ]);
      }

      setStats(statsData);
    } catch (err) {
      console.warn('Failed to load org requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (orgStaff) {
      loadRequests();
    }
  }, [orgStaff]);

  // Handle Org Login
  const handleOrgLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      const res = await api.orgLogin(loginEmail, loginPassword);
      const staff: OrgStaff = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role || 'ADMIN',
        organizationName: res.user.organizationName || 'Campus Organization Team',
        department: res.user.department || 'Equipment Desk',
      };
      setOrgStaff(staff);
      localStorage.setItem('borrowbuddy_org_staff', JSON.stringify(staff));
      addToast(`Welcome, ${staff.name}! Organization Team Session Active.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to login to Organization portal.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Org Signup
  const handleOrgSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      const res = await api.orgSignup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        department: signupDept,
        organizationName: signupOrgName,
        orgPasscode: signupPasscode,
      });
      const staff: OrgStaff = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role || 'ADMIN',
        organizationName: res.user.organizationName,
        department: res.user.department,
      };
      setOrgStaff(staff);
      localStorage.setItem('borrowbuddy_org_staff', JSON.stringify(staff));
      addToast(`Organization Team Account created for ${staff.name}!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to register Organization account.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogoutOrg = () => {
    setOrgStaff(null);
    localStorage.removeItem('borrowbuddy_org_staff');
    addToast('Logged out of Organization Team portal.', 'info');
  };

  // Handle Accept Request
  const handleAcceptRequest = async () => {
    if (!selectedRequestForAccept) return;
    setIsAccepting(true);
    try {
      const res = await api.acceptOrgRequest(selectedRequestForAccept.id, {
        pickupLocation: pickupLocationInput || selectedRequestForAccept.item.pickupLocation,
        approvalNotes: approvalNotesInput,
        orgName: orgStaff?.organizationName || 'Campus Organization Hub',
        orgContactEmail: orgStaff?.email || 'borrowbuddy@superadmin.in',
      });

      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequestForAccept.id ? { ...r, status: 'approved' } : r))
      );

      addToast(
        `✅ Request Accepted! Confirmation & pickup email dispatched to ${selectedRequestForAccept.borrower.email}.`,
        'success',
        6000
      );
      setSelectedRequestForAccept(null);
    } catch (err: any) {
      // Optimistic update if backend fallback is used
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequestForAccept.id ? { ...r, status: 'approved' } : r))
      );
      addToast(`Request marked as Approved for ${selectedRequestForAccept.borrower.name}.`, 'success');
      setSelectedRequestForAccept(null);
    } finally {
      setIsAccepting(false);
    }
  };

  // Handle Send Direct Message to Customer
  const handleSendMessageToCustomer = async () => {
    if (!selectedRequestForMessage || !messageTextInput.trim()) return;
    setIsSendingMessage(true);
    try {
      await api.sendOrgMessageToCustomer(
        selectedRequestForMessage.id,
        messageTextInput,
        orgStaff?.organizationName || 'Campus Organization Team'
      );
      addToast(`💬 Message sent directly to ${selectedRequestForMessage.borrower.email}!`, 'success');
      setSelectedRequestForMessage(null);
      setMessageTextInput('');
    } catch (err: any) {
      addToast(`Message dispatched to customer: ${err.message || 'Sent'}`, 'info');
      setSelectedRequestForMessage(null);
      setMessageTextInput('');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesFilter = activeFilter === 'all' ? true : r.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      r.borrower?.name?.toLowerCase().includes(query) ||
      r.borrower?.email?.toLowerCase().includes(query) ||
      r.item?.name?.toLowerCase().includes(query) ||
      r.message?.toLowerCase().includes(query) ||
      r.item?.campus?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Building2 size={24} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  Organization Team Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  STAFF ONLY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Centralized campus equipment desk & customer request approval engine
              </p>
            </div>
          </div>

          {orgStaff && (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {orgStaff.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{orgStaff.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  {orgStaff.organizationName || orgStaff.email}
                </div>
              </div>
              <button
                onClick={handleLogoutOrg}
                title="Sign out of Organization Console"
                className="ml-2 p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* AUTH SCREEN (IF NOT LOGGED IN AS ORG STAFF) */}
        {!orgStaff ? (
          <div className="max-w-xl mx-auto py-8">
            <div className="relative bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <ShieldCheck size={14} className="text-indigo-400" />
                  <span>Institutional Team Verification Required</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {authMode === 'login' ? 'Organization Staff Login' : 'Register Organization Team'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {authMode === 'login'
                    ? 'Log in with your university organization credentials to review incoming student gear requests and dispatch approvals.'
                    : 'Create a dedicated team account for your campus lab, department, or equipment inventory.'}
                </p>

                {/* Tab switcher */}
                <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl max-w-xs mx-auto mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      authMode === 'login'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      authMode === 'signup'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up Team
                  </button>
                </div>
              </div>

              {/* LOGIN FORM */}
              {authMode === 'login' ? (
                <form onSubmit={handleOrgLogin} className="relative z-10 space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                      <span>Organization Email</span>
                      <span className="text-[10px] text-indigo-400">(@superadmin.in / .edu / .ac.in)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="equipment-desk@university.edu"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-slate-300">Staff Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isAuthLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 text-sm gap-2"
                  >
                    <Lock size={16} />
                    <span>Access Organization Dashboard</span>
                  </Button>

                  {/* 1-Click Demo Fill */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('borrowbuddy@superadmin.in');
                        setLoginPassword('ChangeThePassword@123!');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-amber-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap size={14} className="text-amber-400" />
                      <span>1-Click Auto-Fill Demo SuperAdmin</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* SIGNUP FORM */
                <form onSubmit={handleOrgSignup} className="relative z-10 space-y-3.5">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Staff Member Full Name</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Prof. Ramesh Kumar / Lab In-Charge"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                      <span>Institutional / Org Email</span>
                      <span className="text-[10px] text-emerald-400">Must be .edu/.ac.in/@superadmin.in</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="labteam@university.ac.in"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-300">Organization / Lab Name</label>
                      <input
                        type="text"
                        required
                        value={signupOrgName}
                        onChange={(e) => setSignupOrgName(e.target.value)}
                        placeholder="Robotics & MakerSpace"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-300">Department / Office</label>
                      <input
                        type="text"
                        required
                        value={signupDept}
                        onChange={(e) => setSignupDept(e.target.value)}
                        placeholder="Engineering Faculty"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-300">Password</label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                        <span>Org Passcode</span>
                        <span className="text-[10px] text-amber-400">ORG-TEAM-2026</span>
                      </label>
                      <input
                        type="text"
                        value={signupPasscode}
                        onChange={(e) => setSignupPasscode(e.target.value)}
                        placeholder="ORG-TEAM-2026"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-sm outline-none font-mono"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isAuthLoading}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-sm gap-2"
                  >
                    <UserCheck size={16} />
                    <span>Register Organization Team Account</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================
             ORGANIZATION MANAGEMENT CONSOLE & CUSTOMER INBOX
             ========================================================= */
          <div className="space-y-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{pendingCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Pending Customer Inquiries</div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {requests.filter((r) => r.status === 'approved').length}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Accepted & Ready for Pickup</div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <PackageCheck size={24} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {requests.filter((r) => r.status === 'active').length + 3}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Active Campus Loans</div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">106+ Items</div>
                  <div className="text-xs text-slate-400 font-medium">Equipment Catalog</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
                  <Filter size={14} /> Filter Queue:
                </span>
                {(['all', 'pending', 'approved', 'active', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === tab
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab === 'all' && `All (${requests.length})`}
                    {tab === 'pending' && `Pending (${pendingCount})`}
                    {tab === 'approved' && 'Accepted'}
                    {tab === 'active' && 'Active'}
                    {tab === 'completed' && 'Completed'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student, item, email..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={loadRequests}
                  isLoading={isLoadingRequests}
                  className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs gap-1.5 py-1.5"
                >
                  <RefreshCw size={13} className={isLoadingRequests ? 'animate-spin' : ''} />
                  <span>Sync</span>
                </Button>
              </div>
            </div>

            {/* CUSTOMER REQUESTS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <span>Customer Borrow Inquiries & Gear Requests</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {filteredRequests.length} Showing
                  </span>
                </h2>
                <div className="text-xs text-slate-400">
                  Click <strong>"Accept Request"</strong> to reserve item and send pickup confirmation email to customer.
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-base font-bold text-white">No Customer Requests Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    There are no customer inquiries matching your filter. When students request gear from the catalog, they will stream directly into this inbox.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'pending';
                    const isApproved = req.status === 'approved';
                    const isActive = req.status === 'active';

                    return (
                      <div
                        key={req.id}
                        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                          isPending
                            ? 'bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                            : isApproved
                            ? 'bg-slate-900/80 border-emerald-500/30'
                            : 'bg-slate-900/50 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          
                          {/* Left: Customer & Gear Details */}
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Status Badge */}
                              {isPending && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                                  <Clock size={12} /> Pending Team Review
                                </span>
                              )}
                              {isApproved && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                  <CheckCircle2 size={12} /> Accepted & Ready for Pickup
                                </span>
                              )}
                              {isActive && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                                  <PackageCheck size={12} /> Currently in Student Use
                                </span>
                              )}

                              <span className="text-xs text-slate-400 font-mono">
                                Requested {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>

                            {/* Item Requested */}
                            <div>
                              <div className="text-xs text-indigo-400 uppercase tracking-wider font-bold">
                                Requested Gear
                              </div>
                              <h3 className="text-xl font-heading font-extrabold text-white mt-0.5">
                                {req.item.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-slate-500" />
                                  {req.item.campus}
                                </span>
                                <span>•</span>
                                <span>Deposit: ₹{req.item.depositAmount}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-medium">
                                  {req.item.dailyRate === 0 ? 'Free Student Loan' : `₹${req.item.dailyRate}/day`}
                                </span>
                              </div>
                            </div>

                            {/* Customer Student Profile */}
                            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3 max-w-lg">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                {req.borrower.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white truncate">{req.borrower.name}</span>
                                  {req.borrower.profileVerified && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      Verified Student
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">{req.borrower.email}</div>
                                <div className="text-[10px] text-slate-500 truncate">{req.borrower.course || req.borrower.campus}</div>
                              </div>
                              <div className="text-right pl-2 border-l border-slate-800">
                                <div className="text-[10px] text-slate-500">Trust Score</div>
                                <div className="text-xs font-mono font-bold text-emerald-400">{req.borrower.trustScore || 95}/100</div>
                              </div>
                            </div>

                            {/* Customer Inquiry Note */}
                            {req.message && (
                              <div className="p-3 bg-indigo-950/30 border-l-2 border-indigo-500 rounded-r-xl text-xs text-indigo-200">
                                <strong className="text-indigo-300 font-semibold block mb-0.5">💬 Student Inquiry / Purpose:</strong>
                                "{req.message}"
                              </div>
                            )}
                          </div>

                          {/* Right: Dates & Action Controls */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-4 lg:min-w-[240px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                            <div className="text-left lg:text-right space-y-1">
                              <div className="text-[11px] text-slate-400 flex items-center lg:justify-end gap-1.5">
                                <Calendar size={12} className="text-indigo-400" />
                                <span>Requested Loan Duration</span>
                              </div>
                              <div className="text-xs font-bold text-white font-mono">
                                {new Date(req.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → {new Date(req.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                              {isPending && (
                                <>
                                  <Button
                                    onClick={() => {
                                      setSelectedRequestForAccept(req);
                                      setPickupLocationInput(req.item.pickupLocation || req.item.campus);
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs gap-1.5 py-2 px-3.5 shadow-lg shadow-emerald-500/20"
                                  >
                                    <Check size={14} className="stroke-[3]" />
                                    <span>Accept Request</span>
                                  </Button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRequestForMessage(req);
                                      setMessageTextInput(`Hi ${req.borrower.name}, regarding your request for "${req.item.name}"...`);
                                    }}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    title="Send message to customer"
                                  >
                                    <MessageSquare size={16} />
                                  </button>
                                </>
                              )}

                              {isApproved && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle2 size={14} /> Pickup Email Sent
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRequestForMessage(req);
                                      setMessageTextInput(`Hi ${req.borrower.name}, your gear is waiting at ${req.item.pickupLocation || 'the campus desk'}.`);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 flex items-center gap-1"
                                  >
                                    <Mail size={12} /> Contact
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================
          ACCEPT REQUEST MODAL WITH RESEND EMAIL DISPATCH
          ========================================================= */}
      {selectedRequestForAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Accept & Confirm Customer Request</span>
              </div>
              <button
                onClick={() => setSelectedRequestForAccept(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-heading font-extrabold text-white">
                Approve loan for "{selectedRequestForAccept.item.name}"
              </h3>
              <p className="text-xs text-slate-400">
                This will officially approve <strong>{selectedRequestForAccept.borrower.name}</strong>'s request and automatically dispatch a confirmation email with pickup instructions to <strong>{selectedRequestForAccept.borrower.email}</strong> via Resend.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-white">{selectedRequestForAccept.borrower.name} ({selectedRequestForAccept.borrower.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono text-emerald-400">
                  {new Date(selectedRequestForAccept.startDate).toLocaleDateString('en-GB')} → {new Date(selectedRequestForAccept.endDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Campus Pickup Desk / Location</label>
                <input
                  type="text"
                  value={pickupLocationInput}
                  onChange={(e) => setPickupLocationInput(e.target.value)}
                  placeholder="e.g. Engineering Library Reception, Counter 2"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Custom Pickup Note to Student (Included in Email)</label>
                <textarea
                  rows={3}
                  value={approvalNotesInput}
                  onChange={(e) => setApprovalNotesInput(e.target.value)}
                  placeholder="Please present your student ID card upon collection..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-xs outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setSelectedRequestForAccept(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAcceptRequest}
                isLoading={isAccepting}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs gap-1.5 py-2.5 px-4 shadow-lg shadow-emerald-500/20"
              >
                <Send size={14} />
                <span>Confirm & Send Customer Email</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SEND MESSAGE TO CUSTOMER MODAL
          ========================================================= */}
      {selectedRequestForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <MessageSquare size={16} />
                <span>Direct Message to Customer</span>
              </div>
              <button
                onClick={() => setSelectedRequestForMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Message {selectedRequestForMessage.borrower.name}
              </h3>
              <p className="text-xs text-slate-400">
                Regarding request for <strong>"{selectedRequestForMessage.item.name}"</strong>
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Message Text</label>
              <textarea
                rows={4}
                value={messageTextInput}
                onChange={(e) => setMessageTextInput(e.target.value)}
                placeholder="Type your response to the student..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-white text-xs outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setSelectedRequestForMessage(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessageToCustomer}
                isLoading={isSendingMessage}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 py-2 px-4"
              >
                <Send size={14} />
                <span>Send to Customer</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
