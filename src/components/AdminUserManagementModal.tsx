import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, VolunteerApplication, Permission, DpdpErasureRequest } from '../types';
import { authService } from '../services/authService';
import { dpdpService } from '../services/dpdpService';
import { 
  getStoredVolunteerApplications, 
  reviewVolunteerApplication, 
  ROLE_PERMISSIONS_MAP,
  sanitizeDonorRecord 
} from '../services/rbacService';
import { 
  X, 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  UserCheck, 
  Briefcase, 
  HeartHandshake, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Mail,
  Calendar,
  Lock,
  Edit3,
  GitBranch,
  FileCheck,
  UserPlus,
  Clock,
  Check,
  Ban,
  HelpCircle,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated?: (updatedUser: UserProfile) => void;
}

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'applicants' | 'erasure'>('directory');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [erasureRequests, setErasureRequests] = useState<DpdpErasureRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [applicantFilter, setApplicantFilter] = useState<string>('all');
  const [erasureFilter, setErasureFilter] = useState<'all' | 'pending' | 'approved_deleted' | 'rejected'>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Selected user for editing role
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  const [customTitle, setCustomTitle] = useState<string>('');

  // Application action state
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [assignedSquad, setAssignedSquad] = useState<string>('');

  // Erasure action state
  const [selectedErasureId, setSelectedErasureId] = useState<string | null>(null);
  const [erasureActionNotes, setErasureActionNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const loadData = () => {
    const list = authService.getAllUsers();
    setUsers(list);
    const apps = getStoredVolunteerApplications();
    setApplications(apps);
    const erasures = dpdpService.getErasureRequests();
    setErasureRequests(erasures);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFeedback(null);
      setEditingEmail(null);
      setSelectedAppId(null);
      setSelectedErasureId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Applicants List
  const filteredApplicants = applications.filter((app) => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = applicantFilter === 'all' || app.status === applicantFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Role Elevation / Change
  const handleSaveRole = (targetEmail: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      setFeedback({
        type: 'error',
        text: 'Access Denied: Only Admin can modify user roles and grant permissions.'
      });
      return;
    }

    const res = authService.updateUserRole(targetEmail, selectedRole, currentUser, customTitle || undefined);
    
    if (res.success && res.updatedUser) {
      setFeedback({
        type: 'success',
        text: `Permissions updated! ${res.updatedUser.name} is now ${res.updatedUser.role.toUpperCase()} (${res.updatedUser.title}).`
      });
      setEditingEmail(null);
      loadData();

      if (onUserUpdated && currentUser.email.toLowerCase() === targetEmail.toLowerCase()) {
        onUserUpdated(res.updatedUser);
      }
    } else {
      setFeedback({
        type: 'error',
        text: res.error || 'Failed to update user role.'
      });
    }
  };

  const handleReviewApplicant = (appId: string, decision: 'approve' | 'reject' | 'hold') => {
    const res = reviewVolunteerApplication(
      currentUser,
      appId,
      decision,
      reviewNotes || undefined,
      assignedSquad || undefined
    );

    if (res.success) {
      setFeedback({
        type: 'success',
        text: `Volunteer application ${appId} successfully ${decision === 'approve' ? 'APPROVED & VERIFIED' : decision === 'reject' ? 'REJECTED' : 'PLACED ON HOLD'}.`
      });
      setSelectedAppId(null);
      setReviewNotes('');
      setAssignedSquad('');
      loadData();
    } else {
      setFeedback({
        type: 'error',
        text: res.error || 'Failed to review application.'
      });
    }
  };

  const startEditing = (u: UserProfile) => {
    setEditingEmail(u.email);
    setSelectedRole(u.role || 'volunteer');
    setCustomTitle(u.title || '');
    setFeedback(null);
  };

  const handleApproveErasure = (reqId: string, notes?: string) => {
    const res = dpdpService.approveAndExecuteErasure(reqId, currentUser, notes);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setSelectedErasureId(null);
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.error || res.message });
    }
  };

  const handleRejectErasure = (reqId: string) => {
    if (!rejectionReason.trim()) {
      setFeedback({ type: 'error', text: 'Please provide a justification for rejecting the statutory erasure request.' });
      return;
    }
    const res = dpdpService.rejectErasureRequest(reqId, currentUser, rejectionReason);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setSelectedErasureId(null);
      setRejectionReason('');
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.error || res.message });
    }
  };

  const handleDirectDeleteUser = (targetEmail: string, targetName: string) => {
    const confirmed = window.confirm(
      `Statutory Action: Are you sure you want to permanently delete user "${targetName}" (${targetEmail}) under the DPDP Act 2023?\n\nThis will permanently purge this account from the registered user directory.`
    );
    if (!confirmed) return;

    const res = authService.deleteAccountByAdmin(targetEmail, currentUser);
    if (res.success) {
      setFeedback({
        type: 'success',
        text: `Account for ${targetName} (${targetEmail}) permanently purged under DPDP Act 2023 Section 12.`
      });
      loadData();
    } else {
      setFeedback({
        type: 'error',
        text: res.error || 'Failed to delete account.'
      });
    }
  };

  // Counts
  const totalCount = users.length;
  const pendingAppsCount = applications.filter(a => a.status === 'pending_review').length;
  const verifiedAppsCount = applications.filter(a => a.status === 'verified_active').length;
  const pendingErasureCount = erasureRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-800/80 border border-purple-600/50 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-purple-700/80 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/40">
                  Trustee Console
                </span>
                <span className="text-xs text-purple-200 font-mono">RBAC & Lifecycle Verification</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-0.5">
                Statutory Authorization & Applicant Verification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800/80 text-purple-200 flex items-center justify-center hover:bg-purple-700 hover:text-white transition-colors cursor-pointer border border-purple-600/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-gray-200 dark:border-zinc-800 bg-purple-50/40 dark:bg-purple-950/20 overflow-x-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('directory'); setFeedback(null); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-zinc-900 text-purple-900 dark:text-purple-200 border-purple-600 dark:border-purple-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>User Directory & 10-Role RBAC ({totalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('applicants'); setFeedback(null); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'applicants'
                ? 'bg-white dark:bg-zinc-900 text-purple-900 dark:text-purple-200 border-purple-600 dark:border-purple-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>Volunteer Queue</span>
            {pendingAppsCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingAppsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('erasure'); setFeedback(null); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'erasure'
                ? 'bg-white dark:bg-zinc-900 text-rose-900 dark:text-rose-200 border-rose-600 dark:border-rose-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>DPDP Erasure Requests (National Admin)</span>
            {pendingErasureCount > 0 && (
              <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingErasureCount}
              </span>
            )}
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 py-2.5 bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/50 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <span className="text-[11px]">
              {activeTab === 'directory' 
                ? 'Zero-Trust RBAC Matrix: Granular tokens enforce server-side validation. UI buttons reflect verified credentials.'
                : 'Applicant Lifecycle: New applicants require ID proof verification before participating in field squads.'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
            Trustee: {currentUser.name}
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 mx-4 mt-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span className="flex-1">{feedback.text}</span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'directory' ? "Search users by name, email, or designation..." : "Search applications by name, skills, location..."}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {activeTab === 'directory' ? (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="all">All Roles ({totalCount})</option>
                <option value="volunteer_applicant">Applicants</option>
                <option value="volunteer">Volunteers</option>
                <option value="program_manager">Program Managers</option>
                <option value="content_manager">Content Managers</option>
                <option value="finance">Finance Officers</option>
                <option value="donor">Donors</option>
                <option value="admin">Trustee Admins</option>
                <option value="super_admin">Super Admins</option>
              </select>
            ) : (
              <select
                value={applicantFilter}
                onChange={(e) => setApplicantFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="all">All Applications ({applications.length})</option>
                <option value="pending_review">Pending Review ({pendingAppsCount})</option>
                <option value="verified_active">Verified & Active ({verifiedAppsCount})</option>
                <option value="on_hold">On Hold</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Directory & RBAC */}
        {activeTab === 'directory' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No registered users match your search criteria.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isEditing = editingEmail === u.email;
                const permissions = ROLE_PERMISSIONS_MAP[u.role] || [];
                return (
                  <div 
                    key={u.email}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEditing 
                        ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-400 dark:border-purple-600 shadow-md' 
                        : 'bg-white dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* User Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-zinc-600 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">{u.name}</h4>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              u.role === 'admin' || u.role === 'super_admin'
                                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border-purple-300' 
                                : u.role === 'program_manager' || u.role === 'management'
                                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-300'
                                : u.role === 'finance'
                                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300'
                                : u.role === 'content_manager'
                                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-300'
                                : u.role === 'volunteer_applicant'
                                ? 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200 border-yellow-300'
                                : u.role === 'volunteer'
                                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300'
                                : 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 border-orange-300'
                            }`}>
                              {u.role.replace('_', ' ').toUpperCase()}
                            </span>
                            {u.volunteerApplicationStatus === 'pending_review' && (
                              <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                                Pending Approval
                              </span>
                            )}
                            {u.authProvider === 'google' && (
                              <span className="text-[8px] bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                                Google Auth
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate">{u.email}</p>
                          <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-0.5">{u.title || 'General Member'}</p>
                          
                          {/* Permissions Preview Chip */}
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Tokens:</span>
                            {permissions.slice(0, 4).map((p) => (
                              <span key={p} className="text-[8px] bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono">
                                {p}
                              </span>
                            ))}
                            {permissions.length > 4 && (
                              <span className="text-[8px] text-purple-600 font-bold">
                                +{permissions.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions / Edit Button */}
                      <div className="flex items-center gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditing(u)}
                              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer shadow-2xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Modify Role</span>
                            </button>

                            {u.email.toLowerCase() !== currentUser.email.toLowerCase() && (
                              <button
                                type="button"
                                onClick={() => handleDirectDeleteUser(u.email, u.name)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                                title="Delete Account (DPDP Act Sec 12)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingEmail(null)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Role Elevation / Assignment Form */}
                    {isEditing && (
                      <div className="mt-4 pt-3 border-t border-purple-200 dark:border-purple-900/60 space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200 block mb-1">
                              Assign 10-Role RBAC *
                            </label>
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-purple-300 dark:border-purple-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="guest">0. Guest / Public (Read public content only)</option>
                              <option value="registered_user">1. Registered User (Profile setup only)</option>
                              <option value="volunteer_applicant">2. Volunteer Applicant (Pending Trustee approval)</option>
                              <option value="volunteer">3. Verified Volunteer (Field tasks, hours, certificates)</option>
                              <option value="donor">4. Donor (Donation history, 80G receipts)</option>
                              <option value="program_manager">5. Program Manager (Field batches, volunteer squads)</option>
                              <option value="content_manager">6. Content Manager (Publish stories, safeguarding checks)</option>
                              <option value="finance">7. Finance Officer (Tax receipts, donor ledger)</option>
                              <option value="admin">8. Trustee Admin (Full operations management)</option>
                              <option value="super_admin">9. Super Admin (Master governance & audits)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200 block mb-1">
                              Official Title / Designation
                            </label>
                            <input
                              type="text"
                              value={customTitle}
                              onChange={(e) => setCustomTitle(e.target.value)}
                              placeholder="e.g. Healthcare Operations Lead"
                              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-purple-300 dark:border-purple-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {/* Granted Tokens Display */}
                        <div className="p-3 bg-purple-50/80 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60 text-xs">
                          <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 uppercase block mb-1">
                            Tokens Granted for "{selectedRole.toUpperCase()}":
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(ROLE_PERMISSIONS_MAP[selectedRole] || []).map((tok) => (
                              <span key={tok} className="text-[9px] font-mono bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                                ✓ {tok}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveRole(u.email)}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Save & Enforce Permissions</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Volunteer Verification Queue */}
        {activeTab === 'applicants' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredApplicants.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No volunteer applications match your search filter.
              </div>
            ) : (
              filteredApplicants.map((app) => {
                const isSelected = selectedAppId === app.id;
                return (
                  <div 
                    key={app.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 shadow-md' 
                        : 'bg-white dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{app.applicantName}</h4>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            app.status === 'pending_review'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : app.status === 'verified_active'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {app.status === 'pending_review' ? '⏳ Pending Review' : app.status === 'verified_active' ? '✓ Verified Active' : app.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {app.id}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Contact</span>
                            <p className="text-gray-700 dark:text-gray-300 font-mono text-[11px]">{app.email}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-[11px]">{app.phone}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">ID Proof & Location</span>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">{app.idProofType}: {app.idProofNumberMasked}</p>
                            <p className="text-gray-500 text-[11px]">{app.location}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Skills & Availability</span>
                            <p className="text-gray-700 dark:text-gray-300 font-medium truncate">{app.skills}</p>
                            <p className="text-gray-500 text-[11px] truncate">{app.availability}</p>
                          </div>
                        </div>

                        {app.reviewedByAdmin && (
                          <div className="mt-2 text-[10px] text-gray-500 bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <strong>Reviewed by:</strong> {app.reviewedByAdmin} on {new Date(app.reviewedAt || '').toLocaleDateString()}. Notes: {app.reviewNotes || 'Compliant'}
                          </div>
                        )}
                      </div>

                      {/* Review Trigger */}
                      <div>
                        {app.status === 'pending_review' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppId(isSelected ? null : app.id);
                              setAssignedSquad(app.assignedSquad || 'Amritsar Rural Education Squad');
                            }}
                            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Close Review' : 'Review & Verify'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Review Form */}
                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-900/60 space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-1">
                              Assign Field Squad / Project
                            </label>
                            <input
                              type="text"
                              value={assignedSquad}
                              onChange={(e) => setAssignedSquad(e.target.value)}
                              placeholder="e.g. Mobile Health Clinic Squad - Majha"
                              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-1">
                              Trustee Verification Notes
                            </label>
                            <input
                              type="text"
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Verified government ID proof and emergency contact."
                              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleReviewApplicant(app.id, 'reject')}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReviewApplicant(app.id, 'hold')}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Hold for Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReviewApplicant(app.id, 'approve')}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify & Approve as Active Volunteer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: DPDP ACT STATUTORY ERASURE REQUESTS (NATIONAL ADMIN ONLY) */}
        {activeTab === 'erasure' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">Status:</span>
                {[
                  { id: 'all', label: `All (${erasureRequests.length})` },
                  { id: 'pending', label: `Pending (${erasureRequests.filter(r => r.status === 'pending').length})` },
                  { id: 'approved_deleted', label: `Purged (${erasureRequests.filter(r => r.status === 'approved_deleted').length})` },
                  { id: 'rejected', label: `Rejected (${erasureRequests.filter(r => r.status === 'rejected').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setErasureFilter(f.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      erasureFilter === f.id
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-rose-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800 font-bold">
                  National Admin Authority
                </span>
              </div>
            </div>

            {/* Requests List */}
            {erasureRequests.filter(r => {
              if (erasureFilter !== 'all' && r.status !== erasureFilter) return false;
              if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                return r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
              }
              return true;
            }).length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">No Erasure Requests in Queue</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  All statutory data erasure requests under DPDP Act 2023 Section 12 have been reviewed and processed by the National Admin.
                </p>
              </div>
            ) : (
              erasureRequests
                .filter(r => {
                  if (erasureFilter !== 'all' && r.status !== erasureFilter) return false;
                  if (searchTerm.trim()) {
                    const q = searchTerm.toLowerCase();
                    return r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((req) => {
                  const isPending = req.status === 'pending';
                  const isPurged = req.status === 'approved_deleted';
                  const isRejected = req.status === 'rejected';

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-xs'
                          : isPurged
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 opacity-90'
                          : 'bg-gray-50 dark:bg-zinc-800/40 border-gray-200 dark:border-zinc-700 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-zinc-700/60">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                            isPending ? 'bg-rose-600' : isPurged ? 'bg-emerald-600' : 'bg-gray-600'
                          }`}>
                            <Trash2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-gray-900 dark:text-white">{req.userName}</h4>
                              <span className="font-mono text-[10px] bg-white dark:bg-zinc-800 px-1.5 py-0.2 rounded border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 font-bold">
                                {req.userRole.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">{req.userEmail} {req.userPhone ? `• ${req.userPhone}` : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="font-mono text-[10px] text-gray-500">
                            {new Date(req.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isPending
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 border-rose-300'
                              : isPurged
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border-emerald-300'
                              : 'bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-zinc-300 border-gray-300'
                          }`}>
                            {isPending ? 'Pending National Admin Action' : isPurged ? 'Permanently Purged' : 'Rejected'}
                          </span>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="pt-3 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-700 dark:text-zinc-300 min-w-[90px]">Ticket ID:</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{req.id}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-700 dark:text-zinc-300 min-w-[90px]">User Stated Reason:</span>
                          <span className="text-gray-800 dark:text-zinc-200">{req.reason}</span>
                        </div>

                        {/* Statutory Retention Analysis */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${req.has80GDonations ? 'text-amber-600' : 'text-emerald-600'}`} />
                          <div className="text-[11px] leading-relaxed">
                            <span className="font-bold block text-gray-900 dark:text-white">
                              {req.has80GDonations 
                                ? 'Income Tax Act Rule 18AB / Section 80G Active' 
                                : 'Zero Financial Audit Constraints (Clean Purge)'}
                            </span>
                            <span className="text-gray-600 dark:text-zinc-400">
                              {req.statutoryAuditRetentionNotice}
                            </span>
                          </div>
                        </div>

                        {/* Reviewer Details for completed or rejected */}
                        {!isPending && req.reviewedBy && (
                          <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 text-[11px] text-gray-500 space-y-1">
                            <p><strong>Authorized By:</strong> {req.reviewedBy} on {new Date(req.reviewedAt || '').toLocaleString('en-IN')}</p>
                            {req.adminReviewNotes && <p><strong>Statutory Audit Notes:</strong> {req.adminReviewNotes}</p>}
                          </div>
                        )}

                        {/* Admin Action Bar (Only for Pending requests) */}
                        {isPending && (
                          <div className="pt-3 border-t border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Optional Admin audit notes (e.g. Verified by National Director Amarjeet Kumar)"
                                value={selectedErasureId === req.id ? erasureActionNotes : ''}
                                onChange={(e) => {
                                  setSelectedErasureId(req.id);
                                  setErasureActionNotes(e.target.value);
                                }}
                                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs"
                              />
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  const reasonPrompt = window.prompt(`Please provide statutory justification for rejecting request ${req.id}:`, 'Request could not be authenticated with registered phone/ID');
                                  if (reasonPrompt && reasonPrompt.trim()) {
                                    handleRejectErasure(req.id);
                                  }
                                }}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApproveErasure(req.id, selectedErasureId === req.id ? erasureActionNotes : undefined)}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Approve & Permanently Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
