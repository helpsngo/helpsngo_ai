import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, VolunteerApplication, Permission } from '../types';
import { authService } from '../services/authService';
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
  FileText
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
  const [activeTab, setActiveTab] = useState<'directory' | 'applicants'>('directory');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [applicantFilter, setApplicantFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Selected user for editing role
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  const [customTitle, setCustomTitle] = useState<string>('');

  // Application action state
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [assignedSquad, setAssignedSquad] = useState<string>('');

  const loadData = () => {
    const list = authService.getAllUsers();
    setUsers(list);
    const apps = getStoredVolunteerApplications();
    setApplications(apps);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFeedback(null);
      setEditingEmail(null);
      setSelectedAppId(null);
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

  // Counts
  const totalCount = users.length;
  const pendingAppsCount = applications.filter(a => a.status === 'pending_review').length;
  const verifiedAppsCount = applications.filter(a => a.status === 'verified_active').length;

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
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-gray-200 dark:border-zinc-800 bg-purple-50/40 dark:bg-purple-950/20">
          <button
            type="button"
            onClick={() => { setActiveTab('directory'); setFeedback(null); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
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
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'applicants'
                ? 'bg-white dark:bg-zinc-900 text-purple-900 dark:text-purple-200 border-purple-600 dark:border-purple-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>Volunteer Verification Queue</span>
            {pendingAppsCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingAppsCount}
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
                          <button
                            type="button"
                            onClick={() => startEditing(u)}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify Role</span>
                          </button>
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
      </div>
    </div>
  );
};
