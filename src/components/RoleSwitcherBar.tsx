import React from 'react';
import { UserProfile, UserRole } from '../types';
import { GUEST_USER } from '../data/mockData';
import { appendAuditLog } from '../services/rbacService';
import { authService } from '../services/authService';
import { 
  ShieldCheck, 
  Briefcase, 
  HeartHandshake, 
  Eye, 
  Lock, 
  FileCheck2, 
  Award,
  Users,
  UserCheck,
  GitBranch
} from 'lucide-react';

interface RoleSwitcherBarProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onOpenApprovalPipeline?: () => void;
  onOpenWorkAssignments?: () => void;
  onOpenCertificates?: () => void;
  onOpenAdminCertControl?: () => void;
  onOpenUserManagement?: () => void;
  onOpenHierarchy?: () => void;
  onOpenAuth?: () => void;
  pendingAdminApprovalCount?: number;
  pendingMgmtReviewCount?: number;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentUser,
  onSelectUser,
  onOpenApprovalPipeline,
  onOpenWorkAssignments,
  onOpenCertificates,
  onOpenAdminCertControl,
  onOpenUserManagement,
  onOpenHierarchy,
  onOpenAuth,
  pendingAdminApprovalCount = 2,
  pendingMgmtReviewCount = 1
}) => {
  const currentRole = (currentUser.role || 'guest') as UserRole;

  // In default Guest/Public mode, do not show internal banner to public visitors
  if (currentRole === 'guest') {
    return null;
  }

  const handleLogout = () => {
    authService.signOut(currentUser);
    appendAuditLog(
      'LOGOUT',
      currentUser,
      'user',
      currentUser.email,
      currentUser.name,
      `User ${currentUser.name} logged out to Public / Guest Mode`,
      `Active (${currentUser.role})`,
      'Public / Guest'
    );
    onSelectUser(GUEST_USER);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin (Full Control)',
          desc: 'Full System, User Roles & Certificate Authority Authorization',
          bg: 'bg-purple-900/90 text-purple-200 border-purple-700',
          accent: 'text-purple-400',
          icon: ShieldCheck
        };
      case 'management':
        return {
          label: 'Management (Operations)',
          desc: 'Field Operations & Volunteer Supervision',
          bg: 'bg-blue-900/90 text-blue-200 border-blue-700',
          accent: 'text-blue-400',
          icon: Briefcase
        };
      case 'volunteer':
        return {
          label: 'Volunteer (Field Work)',
          desc: 'Assigned Tasks & Service Hours (Enrolled on Signup)',
          bg: 'bg-emerald-900/90 text-emerald-200 border-emerald-700',
          accent: 'text-emerald-400',
          icon: HeartHandshake
        };
      case 'donor':
        return {
          label: 'Donor (Philanthropy)',
          desc: '80G Tax Exemption & Contribution Portfolio',
          bg: 'bg-amber-900/90 text-amber-200 border-amber-700',
          accent: 'text-amber-400',
          icon: Award
        };
      default:
        return {
          label: 'Public / Guest',
          desc: 'Public Website View',
          bg: 'bg-gray-800 text-gray-300 border-gray-700',
          accent: 'text-gray-400',
          icon: Eye
        };
    }
  };

  const currentBadgeInfo = getRoleBadge(currentRole);
  const CurrentIcon = currentBadgeInfo.icon;

  return (
    <section
      id="authenticated-session-banner"
      aria-label="Authenticated Role Session Bar"
      className="w-full bg-zinc-950 text-white border-b border-zinc-800 px-3 sm:px-4 py-2 shadow-md animate-fadeIn"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        {/* Left: Active Role Indicator & User Profile */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-xl border ${currentBadgeInfo.bg} flex items-center justify-center shrink-0`}>
            <CurrentIcon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {currentBadgeInfo.label}
              </span>
              <span className="text-[11px] font-semibold text-zinc-300 truncate">
                • {currentUser.name}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight truncate hidden md:block">
              {currentBadgeInfo.desc}
            </p>
          </div>
        </div>

        {/* Right: Role-specific action shortcuts + Switch/Logout */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* Admin Controls */}
          {currentRole === 'admin' && (
            <>
              {onOpenUserManagement && (
                <button
                  id="session-user-management-btn"
                  type="button"
                  onClick={onOpenUserManagement}
                  className="flex items-center gap-1 bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-purple-600/60 shadow-xs"
                  title="Admin: User Directory & Role Promotion"
                >
                  <Users className="w-3.5 h-3.5 text-purple-300" />
                  <span>User Roles</span>
                </button>
              )}

              {onOpenApprovalPipeline && (
                <button
                  id="session-approval-pipeline-btn"
                  type="button"
                  onClick={onOpenApprovalPipeline}
                  className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="Content & Task Approvals Queue"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Approvals</span>
                  {pendingAdminApprovalCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-black text-amber-300 font-black text-[9px] flex items-center justify-center">
                      {pendingAdminApprovalCount}
                    </span>
                  )}
                </button>
              )}

              {onOpenAdminCertControl && (
                <button
                  id="session-admin-cert-studio-btn"
                  type="button"
                  onClick={onOpenAdminCertControl}
                  className="flex items-center gap-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="Certificate Authority & Issuance Studio"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Cert Authority</span>
                </button>
              )}

              {onOpenWorkAssignments && (
                <button
                  id="session-work-assignments-btn"
                  type="button"
                  onClick={onOpenWorkAssignments}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="Field Operations & Task Manager"
                >
                  <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Task Manager</span>
                </button>
              )}
            </>
          )}

          {/* Management Controls */}
          {currentRole === 'management' && (
            <>
              {onOpenApprovalPipeline && (
                <button
                  id="session-mgmt-approval-btn"
                  type="button"
                  onClick={onOpenApprovalPipeline}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="Supervise Submissions & Batches"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Review Submissions</span>
                </button>
              )}
              {onOpenWorkAssignments && (
                <button
                  id="session-mgmt-tasks-btn"
                  type="button"
                  onClick={onOpenWorkAssignments}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="Manage Volunteer Operations"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Operations</span>
                </button>
              )}
              {onOpenCertificates && (
                <button
                  id="session-mgmt-certs-btn"
                  type="button"
                  onClick={onOpenCertificates}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="My Management Honors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">My Citations</span>
                </button>
              )}
            </>
          )}

          {/* Volunteer Controls */}
          {currentRole === 'volunteer' && (
            <>
              {onOpenWorkAssignments && (
                <button
                  id="session-vol-tasks-btn"
                  type="button"
                  onClick={onOpenWorkAssignments}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="View My Assigned Tasks"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">My Tasks</span>
                </button>
              )}
              {onOpenCertificates && (
                <button
                  id="session-vol-certs-btn"
                  type="button"
                  onClick={onOpenCertificates}
                  className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  title="View My Volunteer Certificates"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">My Certificates</span>
                </button>
              )}
            </>
          )}

          {/* Donor Controls */}
          {currentRole === 'donor' && onOpenCertificates && (
            <button
              id="session-donor-certs-btn"
              type="button"
              onClick={onOpenCertificates}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              title="Download My 80G Tax Exemption Certificates"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">80G Certificates</span>
            </button>
          )}

          {/* Hierarchy & Access Connections Map */}
          {onOpenHierarchy && (
            <button
              id="session-hierarchy-btn"
              type="button"
              onClick={onOpenHierarchy}
              className="flex items-center gap-1 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700 font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              title="Inspect 5-Tier Organizational Hierarchy, Chain of Command & Permissions"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Hierarchy Flow</span>
            </button>
          )}

          {/* Switch Account (Sign In / Register) */}
          {onOpenAuth && (
            <button
              id="session-switch-account-btn"
              type="button"
              onClick={onOpenAuth}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold border border-zinc-700 transition-all cursor-pointer"
              title="Sign in with another account"
            >
              Switch Account
            </button>
          )}

          {/* 1-Click Logout -> Public/Guest Mode */}
          <button
            id="session-logout-btn"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-[11px] font-bold transition-all cursor-pointer"
            title="Log Out and return to Guest/Public Mode"
          >
            <Lock className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );
};
