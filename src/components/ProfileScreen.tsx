import React, { useState, useMemo } from 'react';
import { UserProfile, DonationRecord, TabType } from '../types';
import { 
  Settings, 
  LogOut, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Utensils, 
  Award, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Plus,
  Sliders,
  FolderKanban,
  Edit3,
  LogIn,
  UserPlus,
  HeartHandshake,
  Sparkles,
  Briefcase,
  FileCheck2,
  GitBranch,
  Building2,
  FileText,
  Smartphone
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { ImpactMilestones } from './ImpactMilestones';
import { WorkAssignment } from '../types';
import { MessageSquare, Users, Lock, CheckCircle2 } from 'lucide-react';
import { 
  ADMIN_USER, 
  MANAGEMENT_USER, 
  VOLUNTEER_USER, 
  INITIAL_USER 
} from '../data/mockData';
import { 
  PublicProfileBadgesShelf, 
  BadgesSystemSection, 
  VirtualMedalDetailModal, 
  VirtualMedal 
} from './BadgesSystem';

interface ProfileScreenProps {
  user: UserProfile;
  donations: DonationRecord[];
  onOpenSettings: () => void;
  onOpenCertificate: () => void;
  onViewReceipt: (donation: DonationRecord) => void;
  onNavigate: (tab: TabType) => void;
  onLogout: () => void;
  onOpenAdminStudio?: () => void;
  onOpenApprovals?: () => void;
  onAddNewProject?: () => void;
  onEditStats?: () => void;
  onOpenAuth?: () => void;
  onSelectUser?: (user: UserProfile) => void;
  workAssignments?: WorkAssignment[];
  onOpenWorkAssignments?: () => void;
  onOpenWebhooks?: () => void;
  onOpenApprovalPipeline?: () => void;
  onOpenAdminCertControl?: () => void;
  onOpenUserManagement?: () => void;
  onOpenAboutOrg?: () => void;
  onOpenTaxCert?: () => void;
  onOpenCorporateCSR?: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { month: string; fullName: string; amount: number; count: number } }>;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    const safeAmount = Number(data.amount ?? 0);
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg border border-gray-800 pointer-events-none z-50">
        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
          {data.fullName || ''}
        </p>
        <p className="text-sm font-extrabold mt-0.5 text-white">
          ₹{safeAmount.toLocaleString('en-IN')} INR
        </p>
        <p className="text-[10px] text-zinc-400">
          {data.count ?? 0} {(data.count ?? 0) === 1 ? 'donation' : 'donations'}
        </p>
      </div>
    );
  }
  return null;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  donations,
  onOpenSettings,
  onOpenCertificate,
  onViewReceipt,
  onNavigate,
  onLogout,
  onOpenAdminStudio,
  onOpenApprovals,
  onAddNewProject,
  onEditStats,
  onOpenAuth,
  workAssignments = [],
  onOpenWorkAssignments,
  onOpenWebhooks,
  onOpenApprovalPipeline,
  onOpenAdminCertControl,
  onOpenUserManagement,
  onOpenAboutOrg,
  onOpenHierarchy,
  onOpenTaxCert,
  onOpenCorporateCSR,
  onOpenPlayStoreExport,
  onSelectUser
}) => {
  const [showAllHistory, setShowAllHistory] = useState<boolean>(false);
  const [selectedMedal, setSelectedMedal] = useState<VirtualMedal | null>(null);
  const badgesSectionRef = React.useRef<HTMLDivElement | null>(null);

  const handleScrollToBadges = () => {
    if (badgesSectionRef.current) {
      badgesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isGuest = !user || user.role === 'guest';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManagement = user?.role === 'management' || user?.role === 'program_manager' || user?.role === 'finance_manager' || user?.role === 'content_manager';
  const isVolunteer = user?.role === 'volunteer';
  const isDonor = user?.role === 'donor';
  const isApplicant = user?.role === 'volunteer_applicant';

  // Filter donations strictly belonging to this user (or all if admin)
  const userDonations = useMemo(() => {
    if (isAdmin) {
      return donations;
    }
    const currentEmail = user?.email?.toLowerCase() || '';
    return donations.filter(d => 
      (d.donorEmail && d.donorEmail.toLowerCase() === currentEmail) ||
      (!d.donorEmail && currentEmail === 'alex.johnson@example.com')
    );
  }, [donations, user, isAdmin]);

  const pendingApprovalsCount = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending').length;

  // Compute 6-Month Monthly Contribution History
  const monthlyData = useMemo(() => {
    const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthFullNames: Record<string, string> = {
      May: 'May 2023',
      Jun: 'June 2023',
      Jul: 'July 2023',
      Aug: 'August 2023',
      Sep: 'September 2023',
      Oct: 'October 2023'
    };

    const totals: Record<string, { amount: number; count: number }> = {
      May: { amount: 0, count: 0 },
      Jun: { amount: 0, count: 0 },
      Jul: { amount: 0, count: 0 },
      Aug: { amount: 0, count: 0 },
      Sep: { amount: 0, count: 0 },
      Oct: { amount: 0, count: 0 }
    };

    userDonations.forEach((d) => {
      const dateStr = (d.date || '').toLowerCase();
      if (dateStr.includes('may')) {
        totals.May.amount += d.amount;
        totals.May.count += 1;
      } else if (dateStr.includes('jun')) {
        totals.Jun.amount += d.amount;
        totals.Jun.count += 1;
      } else if (dateStr.includes('jul')) {
        totals.Jul.amount += d.amount;
        totals.Jul.count += 1;
      } else if (dateStr.includes('aug')) {
        totals.Aug.amount += d.amount;
        totals.Aug.count += 1;
      } else if (dateStr.includes('sep')) {
        totals.Sep.amount += d.amount;
        totals.Sep.count += 1;
      } else if (dateStr.includes('oct') || dateStr.includes('today') || dateStr.includes('just now')) {
        totals.Oct.amount += d.amount;
        totals.Oct.count += 1;
      } else {
        totals.Oct.amount += d.amount;
        totals.Oct.count += 1;
      }
    });

    return monthLabels.map((m) => ({
      month: m,
      fullName: monthFullNames[m],
      amount: totals[m].amount,
      count: totals[m].count
    }));
  }, [userDonations]);

  const totalSixMonths = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthlyData]);

  const averageMonthly = useMemo(() => {
    return Math.round(totalSixMonths / 6);
  }, [totalSixMonths]);

  const peakMonthly = useMemo(() => {
    return Math.max(...monthlyData.map((m) => m.amount), 0);
  }, [monthlyData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education':
        return {
          icon: GraduationCap,
          bg: 'bg-blue-50',
          color: 'text-blue-600'
        };
      case 'Healthcare':
        return {
          icon: HeartPulse,
          bg: 'bg-emerald-50',
          color: 'text-emerald-600'
        };
      case 'Water':
        return {
          icon: Droplets,
          bg: 'bg-cyan-50',
          color: 'text-cyan-600'
        };
      case 'Hunger':
        return {
          icon: Utensils,
          bg: 'bg-amber-50',
          color: 'text-amber-600'
        };
      default:
        return {
          icon: GraduationCap,
          bg: 'bg-orange-50',
          color: 'text-orange-600'
        };
    }
  };

  const displayedDonations = showAllHistory ? userDonations : userDonations.slice(0, 3);

  // =========================================================================
  // PUBLIC / GUEST VIEW: HIDE ALL INTERNAL METRICS, BADGES, AND ADMIN TOOLS
  // Display only the clean, high-trust Authority Access & Sign-In Portal
  // =========================================================================
  if (isGuest) {
    return (
      <div className="pb-12 p-3.5 sm:p-4 space-y-4 animate-fadeIn max-w-2xl mx-auto text-gray-900 dark:text-gray-100">
        {/* Authority Access Portal */}
        <section className="bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 text-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-zinc-800 relative overflow-hidden text-center space-y-5">
          {/* Background glowing accents */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 border border-orange-400/30">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full inline-block mb-1.5">
                Authorized Personnel & Supporter Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Sign In as per Your Authority
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mt-1">
                To protect beneficiary privacy and statutory records, all internal workspaces, task assignments, and philanthropic portfolios are restricted to authorized accounts.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {onOpenAuth && (
              <button
                type="button"
                id="portal-sign-in-btn"
                onClick={onOpenAuth}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Credentials / OTP</span>
              </button>
            )}

            {onOpenAuth && (
              <button
                type="button"
                id="portal-register-btn"
                onClick={onOpenAuth}
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register for Authority</span>
              </button>
            )}
          </div>

          {/* Authority Role Capabilities Matrix */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left text-xs pt-2">
            <div 
              onClick={onOpenAuth}
              className="p-3.5 bg-zinc-800/60 hover:bg-zinc-800/90 rounded-2xl border border-zinc-700/60 hover:border-purple-500/60 space-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-purple-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Trustee Administration</span>
                </div>
                <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/60">Full Control</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Full statutory governance, user role directory, approval pipelines &amp; 80G financial audits.
              </p>
            </div>

            <div 
              onClick={onOpenAuth}
              className="p-3.5 bg-zinc-800/60 hover:bg-zinc-800/90 rounded-2xl border border-zinc-700/60 hover:border-blue-500/60 space-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Operations Management</span>
                </div>
                <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/60">Field Lead</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Field task dispatching, logistics supervision, and ground verification review.
              </p>
            </div>

            <div 
              onClick={onOpenAuth}
              className="p-3.5 bg-zinc-800/60 hover:bg-zinc-800/90 rounded-2xl border border-zinc-700/60 hover:border-emerald-500/60 space-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span>Field Volunteer</span>
                </div>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60">Field Ops</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Assigned village center tasks, digital attendance checklists, and official service certificates.
              </p>
            </div>

            <div 
              onClick={onOpenAuth}
              className="p-3.5 bg-zinc-800/60 hover:bg-zinc-800/90 rounded-2xl border border-zinc-700/60 hover:border-amber-500/60 space-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Verified Donor</span>
                </div>
                <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60">Benefactor</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                80G Form 10BE tax exemption certificates, signed citations &amp; virtual medals portfolio.
              </p>
            </div>
          </div>
        </section>

        {/* Public Transparency: Official Entity & Statutory Registration */}
        {onOpenAboutOrg && (
          <div 
            onClick={onOpenAboutOrg}
            className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between hover:border-orange-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 px-1.5 py-0.2 rounded">
                    Official Entity
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Est. 2016</span>
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  HELPS Welfare Society (Official Registry)
                </h4>
                <p className="text-[10px] text-gray-500">
                  Societies Act XXI 1860 • 12A / 80G Certified • Ludhiana, Punjab
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View Data</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED USER DASHBOARD (SHOWN STRICTLY AS PER AUTHORITY)
  // =========================================================================
  return (
    <div className="pb-8 p-3.5 sm:p-4 space-y-4 animate-fadeIn">
      {/* Bento Profile Overview Tile */}
      <section className="bg-white border border-gray-200 rounded-[2rem] p-6 text-center shadow-xs relative overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-3">
            {user.name}
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
              user?.role === 'admin' || user?.role === 'super_admin'
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                : user?.role === 'finance_manager'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : user?.role === 'content_manager'
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                : user?.role === 'management' || user?.role === 'program_manager'
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                : user?.role === 'volunteer_applicant'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : isVolunteer
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800'
            }`}>
              {user?.role === 'super_admin'
                ? '👑 Super Admin (Full Governance)'
                : user?.role === 'admin'
                ? '🛡️ Trustee Admin (Full Control)'
                : user?.role === 'finance_manager'
                ? '💰 Finance Manager (80G & Ledgers)'
                : user?.role === 'content_manager'
                ? '✍️ Content Manager (Media Review)'
                : user?.role === 'management' || user?.role === 'program_manager'
                ? '💼 Program Manager (Field Ops)'
                : user?.role === 'volunteer_applicant'
                ? '⏳ Volunteer Applicant (Pending Trustee Verification)'
                : isVolunteer 
                ? '🤝 Field Volunteer (Assigned Tasks)' 
                : '👤 Verified Philanthropic Donor'}
            </span>
            {user?.authProvider === 'otp' && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                💬 WhatsApp OTP Verified
              </span>
            )}
            {user?.authProvider === 'password' && (
              <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                🔒 Email & Password
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
              80G Tax Exemption
            </span>
          </div>

          {/* Public Profile Badges & Medals Shelf (Only for donors and admins) */}
          {(isDonor || isAdmin) && (
            <PublicProfileBadgesShelf
              user={user}
              donations={donations}
              onSelectMedal={(m) => setSelectedMedal(m)}
              onViewAllBadges={handleScrollToBadges}
            />
          )}
        </div>
      </section>

      {/* Volunteer Applicant Pending Notice Banner */}
      {isApplicant && (
        <section className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 rounded-[2rem] p-5 sm:p-6 shadow-sm space-y-3 relative overflow-hidden animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold flex-shrink-0">
              ⏳
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
                  Verification in Progress
                </span>
                <span className="text-xs font-mono text-amber-700 dark:text-amber-300">Phase 1: Screening</span>
              </div>
              <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-100">
                Your Volunteer Application is Under Trustee Review
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                In compliance with <strong>Audit Point 3 & Statutory Child Safeguarding</strong> protocols, newly registered volunteer accounts are placed in the Trustee Verification Queue for ID and background verification before live field deployment privileges are granted.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Admin Content Operations Center (Only shown for Admin role) */}
      {isAdmin && (
        <section className="bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-800 text-white rounded-[2rem] p-5 shadow-md border border-zinc-700 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  NGO Admin Operations & Media Hub
                </h3>
                <p className="text-[10px] text-zinc-300">
                  Manage programs, local image uploads, metrics & impact stories
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase bg-purple-900/80 text-purple-200 border border-purple-700 px-2 py-0.5 rounded-full">
              Full Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onOpenUserManagement && (
              <button
                id="profile-launch-user-management-btn"
                onClick={onOpenUserManagement}
                className="p-3 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-purple-700 shadow-xs col-span-1 sm:col-span-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-300" />
                  <span>User Directory & Role Permissions Console</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-purple-700 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Admin Exclusive
                  </span>
                  <ChevronRight className="w-4 h-4 text-purple-300" />
                </div>
              </button>
            )}

            {onOpenApprovalPipeline && (
              <button
                id="profile-launch-approval-flow-btn"
                onClick={onOpenApprovalPipeline}
                className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs col-span-1 sm:col-span-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-white" />
                  <span>Content Approval Workflow & Batch Manager</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {onOpenAdminCertControl && (
              <button
                id="profile-launch-cert-studio-btn"
                onClick={onOpenAdminCertControl}
                className="p-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs col-span-1 sm:col-span-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Certificate Authority & Batch Issuance Studio</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {onOpenWorkAssignments && (
              <button
                id="profile-launch-work-assignments-btn"
                onClick={onOpenWorkAssignments}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Work & Task Assignments</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {workAssignments.length}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            )}

            {onOpenApprovals && (
              <button
                id="profile-launch-approvals-btn"
                onClick={onOpenApprovals}
                className="p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>80G Approvals Queue</span>
                </div>
                <div className="flex items-center gap-1">
                  {pendingApprovalsCount > 0 && (
                    <span className="bg-black text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      {pendingApprovalsCount} PENDING
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-black" />
                </div>
              </button>
            )}

            {onOpenAdminStudio && (
              <button
                id="profile-launch-content-studio-btn"
                onClick={onOpenAdminStudio}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <span>Content Studio</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {onAddNewProject && (
              <button
                id="profile-create-campaign-btn"
                onClick={onAddNewProject}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-400" />
                  <span>+ New Program (Media Upload)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            )}

            {onEditStats && (
              <button
                onClick={onEditStats}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Update Org Metrics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            )}

            <button
              onClick={() => onNavigate('projects')}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                <span>Campaigns Directory</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </section>
      )}

      {/* Management Operations Center (Shown for Management role) */}
      {isManagement && (
        <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-[2rem] p-5 shadow-md border border-blue-800/80 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Management Operations Center
                </h3>
                <p className="text-[10px] text-blue-200">
                  Field operations supervision, content batch reviews & task delegation
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase bg-blue-900 text-blue-200 border border-blue-700 px-2 py-0.5 rounded-full">
              Operations Lead
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onOpenWorkAssignments && (
              <button
                onClick={onOpenWorkAssignments}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Field Operations & Task Manager</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {onOpenApprovalPipeline && (
              <button
                onClick={onOpenApprovalPipeline}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  <span>Review Content Batches & Submissions</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenCertificate}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>My Leadership Citations</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                <span>Explore Active Programs</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Volunteer Field Workspace (Shown for Volunteer role) */}
      {isVolunteer && (
        <section className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-[2rem] p-5 shadow-md border border-emerald-800/80 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Volunteer Field Workspace
                </h3>
                <p className="text-[10px] text-emerald-200">
                  Assigned ground tasks, service records & official honors
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase bg-emerald-900 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full">
              Field Volunteer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onOpenWorkAssignments && (
              <button
                onClick={onOpenWorkAssignments}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>My Assigned Tasks & Checklists</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="volunteer-view-my-cert-btn"
              onClick={onOpenCertificate}
              className="p-3 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>My Volunteer Service Certificate</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onOpenApprovalPipeline && (
              <button
                onClick={onOpenApprovalPipeline}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-slate-700 cursor-pointer col-span-1 sm:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Submit Field Media & Verification Draft</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Registered Benefactor & Donor Workspace (Shown for Donor role) */}
      {isDonor && (
        <section className="bg-gradient-to-br from-amber-950 via-zinc-900 to-amber-950 text-white rounded-[2rem] p-5 shadow-md border border-amber-800/80 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Award className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Philanthropic Benefactor Portal
                </h3>
                <p className="text-[10px] text-amber-200">
                  80G tax deductions, verified Form 10BE & signed citations
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase bg-amber-900 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-full">
              Verified Donor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onOpenTaxCert && (
              <button
                id="donor-tax-cert-btn"
                onClick={onOpenTaxCert}
                className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>80G Form 10BE Tax Exemption</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="donor-view-certificate-btn"
              onClick={onOpenCertificate}
              className="p-3 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>My Appreciation Citation</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onOpenCorporateCSR && (
              <button
                id="donor-csr-inquiry-btn"
                onClick={onOpenCorporateCSR}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Corporate CSR & Matching Gift</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('donate')}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between border border-zinc-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Fund Active Village Need</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Impact Profile Sections: Visible as per user role and profile (Hidden for Public and Guest users) */}
      {!isGuest && (
        <>
          {/* Bento 2-Column Impact Stats */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-orange-600 text-white rounded-[2rem] p-5 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200">
                Total Donated
              </span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  ₹{(user?.totalContribution ?? 0).toLocaleString('en-IN')}
                </h3>
                <p className="text-orange-100 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                  100% Impact Score
                </p>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-[2rem] p-5 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Volunteer Hours
              </span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user.volunteerHours} hrs
                </h3>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate">
                  {user.volunteerLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Bento Monthly Contribution Bar Chart Tile */}
          <section className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Giving Overview
                  </h3>
                  <p className="text-sm font-extrabold text-gray-900 tracking-tight">
                    6-Month Contribution Trend
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Past 6M
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 8, right: 6, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 500, fill: '#94A3B8' }}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip
                    content={<CustomChartTooltip />}
                    cursor={{ fill: 'rgba(249, 115, 22, 0.06)', radius: 6 }}
                  />
                  <Bar
                    dataKey="amount"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                    animationDuration={600}
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={entry.amount > 0 ? (entry.amount === peakMonthly ? '#EA580C' : '#F97316') : '#E5E7EB'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Metrics Summary Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100 text-center">
              <div className="bg-gray-50 rounded-xl p-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                  6M Total
                </span>
                <span className="text-xs font-black text-gray-900">
                  ₹{(totalSixMonths ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                  Monthly Avg
                </span>
                <span className="text-xs font-black text-orange-600">
                  ₹{(averageMonthly ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                  Peak Month
                </span>
                <span className="text-xs font-black text-emerald-600">
                  ₹{(peakMonthly ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </section>

          {/* Bento Volunteer Level Progress Tile */}
          <section className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Changemaker Tier & Field Directives
              </h3>
              <div className="flex items-center gap-3">
                {onOpenWorkAssignments && (
                  <button
                    id="profile-view-tasks-btn"
                    onClick={onOpenWorkAssignments}
                    className="text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Tasks ({workAssignments.length})</span>
                  </button>
                )}
                <button
                  id="view-cert-btn"
                  onClick={onOpenCertificate}
                  className="text-[11px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-orange-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((user.volunteerHours / user.volunteerNextTierHours) * 100, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-900">{user.volunteerHours} / {user.volunteerNextTierHours} Hours</span>
              <span className="text-gray-500 text-[11px]">
                {Math.max(user.volunteerNextTierHours - user.volunteerHours, 0)} hrs to Next Tier
              </span>
            </div>
          </section>

          {/* Personal Impact Milestones & Visual Badges */}
          <div ref={badgesSectionRef}>
            <BadgesSystemSection
              user={user}
              donations={donations}
              onNavigate={onNavigate}
              onSelectMedal={(m) => setSelectedMedal(m)}
            />
          </div>

          <ImpactMilestones user={user} donations={donations} />

          {/* Bento Donation History Section */}
          <section className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {isAdmin ? 'All NGO Donations Log' : 'My Donation History'}
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                  {userDonations.length}
                </span>
              </div>
              {userDonations.length > 3 && (
                <button
                  id="toggle-history-btn"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="text-[11px] font-bold text-orange-600 uppercase tracking-wider hover:underline"
                >
                  {showAllHistory ? 'Less' : `All (${userDonations.length})`}
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {userDonations.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                  <Sparkles className="w-6 h-6 text-orange-400 mx-auto" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    No Donations Recorded Yet
                  </h4>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    Support rural education, mobile medical clinics, or clean water to receive 80G tax exemption receipts.
                  </p>
                  <button
                    onClick={() => onNavigate('donate')}
                    className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-xs transition-all"
                  >
                    Donate to a Cause
                  </button>
                </div>
              ) : (
                displayedDonations.map((item) => {
                  const { icon: CatIcon, bg, color } = getCategoryIcon(item.category);
                  const status = item.approvalStatus || 'pending';
                  const isApproved = status === 'approved';
                  const isPending = status === 'pending';
                  const isRejected = status === 'rejected';

                  return (
                    <div
                      key={item.id}
                      id={`donation-history-item-${item.id}`}
                      onClick={() => onViewReceipt(item)}
                      className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-orange-200 hover:bg-orange-50/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center ${color} flex-shrink-0`}>
                          <CatIcon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {item.date} {isAdmin && item.donorName ? `• ${item.donorName}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-2">
                        <div className="text-sm font-extrabold text-gray-900">
                          ₹{(item?.amount ?? 0).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {isApproved ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                              <span>✓ 80G Certified</span>
                            </span>
                          ) : isPending ? (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                              <span>⏳ Verification Pending</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                              <span>✕ Rejected</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </>
      )}

      {/* Organizational Hierarchy & Access Connection Matrix Card */}
      {onOpenHierarchy && (
        <div 
          id="profile-open-hierarchy-btn"
          onClick={onOpenHierarchy}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between hover:border-purple-400 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-200/80 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-1.5 py-0.2 rounded">
                  Chain of Command & RBAC
                </span>
                <span className="text-[10px] text-gray-500 font-medium">5-Tier Structure</span>
              </div>
              <h4 className="text-xs font-black text-gray-900 dark:text-white">
                Organizational Hierarchy & Access Matrix
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                Admin ➔ Management ➔ Volunteer ➔ Donor ➔ Guest permissions & workflow connections
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Inspect Flow</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* Official NGO Profile & Statutory Registry Card */}
      {onOpenAboutOrg && (
        <div 
          onClick={onOpenAboutOrg}
          className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-orange-200 dark:border-gray-700 flex items-center justify-between hover:border-orange-400 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-200/80 dark:bg-orange-950 text-orange-800 dark:text-orange-300 px-1.5 py-0.2 rounded">
                  Official Entity
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Est. 2016</span>
              </div>
              <h4 className="text-xs font-black text-gray-900 dark:text-white">
                HELPS Welfare Society (Official Registry)
              </h4>
              <p className="text-[10px] text-gray-500">
                Societies Act XXI 1860 • 12A / 80G Certified • Ludhiana, PB
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View Data</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* Action Buttons: Settings & Logout */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          id="profile-settings-btn"
          onClick={onOpenSettings}
          className="bg-white hover:bg-gray-50 active:scale-98 text-gray-900 border border-gray-200 font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <Settings className="w-4 h-4 text-gray-600" />
          <span>Settings</span>
        </button>

        {isGuest ? (
          <button
            id="profile-login-btn"
            onClick={onOpenAuth}
            className="bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        ) : (
          <button
            id="profile-logout-btn"
            onClick={onLogout}
            className="bg-white hover:bg-rose-50 active:scale-98 text-rose-600 border border-rose-200 font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Virtual Medal Detail & Honor Certificate Modal */}
      <VirtualMedalDetailModal
        medal={selectedMedal}
        onClose={() => setSelectedMedal(null)}
        onDonateToUnlock={() => onNavigate('donate')}
      />
    </div>
  );
};
