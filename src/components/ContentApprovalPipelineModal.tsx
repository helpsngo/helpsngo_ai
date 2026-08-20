import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  ContentSubmissionItem, 
  BatchAssignment, 
  AuditLogEntry, 
  TaskCategory 
} from '../types';
import { 
  RBAC, 
  getStoredSubmissions, 
  saveSubmissions, 
  getStoredBatches, 
  saveBatches, 
  getStoredAuditLogs, 
  appendAuditLog 
} from '../services/rbacService';
import { 
  X, 
  ShieldCheck, 
  Briefcase, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCheck2, 
  Layers, 
  History, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Upload, 
  Send, 
  Check, 
  XCircle, 
  RotateCcw, 
  Filter, 
  Search,
  ExternalLink,
  Eye,
  Building2,
  Lock,
  ChevronRight,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContentApprovalPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onContentPublished?: (item: ContentSubmissionItem) => void;
}

export const ContentApprovalPipelineModal: React.FC<ContentApprovalPipelineModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onContentPublished
}) => {
  const currentRole = (currentUser.role || 'guest') as UserRole;
  
  // Navigation tabs inside the modal
  const [activeTab, setActiveTab] = useState<'admin_approval' | 'mgmt_review' | 'batches' | 'audit_logs' | 'submit_new'>('admin_approval');

  // Core Data States
  const [submissions, setSubmissions] = useState<ContentSubmissionItem[]>([]);
  const [batches, setBatches] = useState<BatchAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('All');

  // Action State (e.g. feedback comments)
  const [reviewComments, setReviewComments] = useState<string>('');
  const [activeActionItemId, setActiveActionItemId] = useState<string | null>(null);

  // New Submission Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentSubmissionItem['contentType']>('report');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Education');
  const [newSummary, setNewSummary] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newBeneficiaries, setNewBeneficiaries] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newBatchLink, setNewBatchLink] = useState('');
  
  // Safeguarding Consent State
  const [safeguardingSigned, setSafeguardingSigned] = useState(true);
  const [involvesMinors, setInvolvesMinors] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [protectionNotes, setProtectionNotes] = useState('');

  // New Batch Form State (Admin / Mgmt)
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [newBatchCategory, setNewBatchCategory] = useState<TaskCategory>('Water');
  const [newBatchDesc, setNewBatchDesc] = useState('');
  const [newBatchTargetRole, setNewBatchTargetRole] = useState<'management' | 'volunteer'>('management');
  const [newBatchDeadline, setNewBatchDeadline] = useState('2026-09-15');

  // Load latest data on modal open
  useEffect(() => {
    if (isOpen) {
      setSubmissions(getStoredSubmissions());
      setBatches(getStoredBatches());
      setAuditLogs(getStoredAuditLogs());
      
      // Auto switch to appropriate starting tab based on role
      if (currentRole === 'admin') setActiveTab('admin_approval');
      else if (currentRole === 'management') setActiveTab('mgmt_review');
      else if (currentRole === 'volunteer') setActiveTab('submit_new');
      else setActiveTab('audit_logs');
    }
  }, [isOpen, currentRole]);

  if (!isOpen) return null;

  // Counts
  const pendingAdminCount = submissions.filter(s => s.status === 'pending_admin_approval').length;
  const pendingMgmtCount = submissions.filter(s => s.status === 'pending_management_review').length;
  const publishedCount = submissions.filter(s => s.status === 'published').length;

  // -------------------------------------------------------------
  // Workflow Actions
  // -------------------------------------------------------------

  // 1. Volunteer/Management submits new content
  const handleSubmitNewContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    // If Admin creates, it can be published directly or staged
    const initialStatus = currentRole === 'admin' 
      ? 'published' 
      : currentRole === 'management' 
      ? 'pending_admin_approval' 
      : 'pending_management_review';

    const newItem: ContentSubmissionItem = {
      id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      title: newTitle.trim(),
      contentType: newType,
      category: newCategory,
      summary: newSummary.trim(),
      contentData: {
        location: newLocation.trim() || 'Pan-India Field Unit',
        beneficiaries: newBeneficiaries.trim() || '150+',
        submittedByRole: currentRole
      },
      status: initialStatus,
      createdBy: {
        name: currentUser.name,
        email: currentUser.email,
        role: currentRole,
        avatar: currentUser.avatar
      },
      createdAt: new Date().toISOString(),
      mediaUrls: newMediaUrl.trim() ? [newMediaUrl.trim()] : [
        'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80'
      ],
      batchId: newBatchLink || undefined,
      publishedAt: initialStatus === 'published' ? new Date().toISOString() : undefined,
      version: 1,
      safeguarding: {
        hasGuardianConsent: safeguardingSigned,
        guardianName: involvesMinors ? guardianName : undefined,
        signedOfficerName: currentUser.name,
        verifiedAt: new Date().toISOString(),
        minorProtectionApplied: involvesMinors,
        faceObfuscated: involvesMinors,
        riskAssessment: involvesMinors ? 'moderate' : 'low',
        notes: protectionNotes || 'Compliant with POCSO, JJ Act & HELPS Child Safeguarding Policy'
      }
    };

    const updated = [newItem, ...submissions];
    setSubmissions(updated);
    saveSubmissions(updated);

    appendAuditLog(
      initialStatus === 'published' ? 'CONTENT_PUBLISHED' : currentRole === 'volunteer' ? 'CONTENT_SUBMITTED_TO_MGMT' : 'CONTENT_SUBMITTED_TO_ADMIN',
      currentUser,
      newType,
      newItem.id,
      newItem.title,
      `${currentUser.name} (${currentRole.toUpperCase()}) created new ${newType} content. Safeguarding Consent: ${safeguardingSigned ? 'VERIFIED' : 'PENDING'}.`
    );

    setAuditLogs(getStoredAuditLogs());

    // Reset Form
    setNewTitle('');
    setNewSummary('');
    setNewLocation('');
    setNewBeneficiaries('');
    setNewMediaUrl('');
    setNewBatchLink('');
    setGuardianName('');
    setProtectionNotes('');

    if (initialStatus === 'published') {
      confetti({ particleCount: 50, spread: 60 });
      if (onContentPublished) onContentPublished(newItem);
    }

    setActiveTab(currentRole === 'admin' ? 'admin_approval' : currentRole === 'management' ? 'mgmt_review' : 'batches');
  };

  // 2. Management Reviews & Endorses to Admin
  const handleManagementEndorse = (item: ContentSubmissionItem) => {
    if (!RBAC.canReviewVolunteerSubmissions(currentRole)) return;

    const comments = reviewComments.trim() || 'Verified all field metrics, vouchers, and photos. Forwarded for Admin approval.';

    const updated = submissions.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: 'pending_admin_approval' as const,
          managementReview: {
            reviewedBy: currentUser.name,
            reviewerEmail: currentUser.email,
            reviewedAt: new Date().toISOString(),
            comments,
            status: 'endorsed_for_admin' as const
          },
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setSubmissions(updated);
    saveSubmissions(updated);

    appendAuditLog(
      'CONTENT_MGMT_REVIEWED',
      currentUser,
      item.contentType,
      item.id,
      item.title,
      `Management (${currentUser.name}) endorsed submission to Admin for publication.`
    );

    setAuditLogs(getStoredAuditLogs());
    setActiveActionItemId(null);
    setReviewComments('');
  };

  // 3. Admin Approves & Publishes Live
  const handleAdminApproveAndPublish = (item: ContentSubmissionItem) => {
    if (!RBAC.canFinalApproveAndPublish(currentRole)) return;

    const comments = reviewComments.trim() || 'Approved by National Director. Published live to public portals.';

    const updated = submissions.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: 'published' as const,
          publishedAt: new Date().toISOString(),
          adminReview: {
            reviewedBy: currentUser.name,
            reviewerEmail: currentUser.email,
            reviewedAt: new Date().toISOString(),
            comments,
            status: 'published' as const
          },
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setSubmissions(updated);
    saveSubmissions(updated);

    appendAuditLog(
      'CONTENT_PUBLISHED',
      currentUser,
      item.contentType,
      item.id,
      item.title,
      `Admin (${currentUser.name}) granted final approval. Content is now PUBLIC.`
    );

    setAuditLogs(getStoredAuditLogs());
    setActiveActionItemId(null);
    setReviewComments('');
    confetti({ particleCount: 70, spread: 70 });

    if (onContentPublished) {
      onContentPublished({ ...item, status: 'published', publishedAt: new Date().toISOString() });
    }
  };

  // 4. Admin / Management Requests Revisions or Rejection
  const handleRejectOrRequestChanges = (item: ContentSubmissionItem) => {
    const isAdm = currentRole === 'admin';
    const comments = reviewComments.trim() || 'Additional verification required from field coordinators.';

    const updated = submissions.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: 'rejected' as const,
          ...(isAdm ? {
            adminReview: {
              reviewedBy: currentUser.name,
              reviewerEmail: currentUser.email,
              reviewedAt: new Date().toISOString(),
              comments,
              status: 'rejected' as const
            }
          } : {
            managementReview: {
              reviewedBy: currentUser.name,
              reviewerEmail: currentUser.email,
              reviewedAt: new Date().toISOString(),
              comments,
              status: 'revisions_requested' as const
            }
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setSubmissions(updated);
    saveSubmissions(updated);

    appendAuditLog(
      'CONTENT_REJECTED',
      currentUser,
      item.contentType,
      item.id,
      item.title,
      `${currentRole.toUpperCase()} (${currentUser.name}) requested changes: "${comments}"`
    );

    setAuditLogs(getStoredAuditLogs());
    setActiveActionItemId(null);
    setReviewComments('');
  };

  // 5. Admin Creates & Assigns Next Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchTitle.trim() || !RBAC.canCreateBatch(currentRole)) return;

    const newBatch: BatchAssignment = {
      id: `BATCH-${Date.now().toString(36).toUpperCase()}`,
      batchCode: `BATCH #${newBatchCategory.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      title: newBatchTitle.trim(),
      category: newBatchCategory,
      description: newBatchDesc.trim() || 'Execute assigned service deliverables according to standard SOPs.',
      assignedBy: {
        name: currentUser.name || 'Amarjeet Kumar',
        email: currentUser.email || 'amar@helpsngo.in',
        role: 'admin',
        title: currentUser.title || 'Managing Trustee & National Director'
      },
      assignedTo: {
        name: newBatchTargetRole === 'management' ? 'Priya Sharma' : 'Rahul Verma',
        email: newBatchTargetRole === 'management' ? 'priya.mgmt@helpsngo.in' : 'volunteer@helpsngo.in',
        role: newBatchTargetRole,
        title: newBatchTargetRole === 'management' ? 'Field Operations Manager' : 'Field Volunteer'
      },
      totalTasks: 4,
      completedTasks: 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: newBatchDeadline,
      nextBatchAssigned: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newBatch, ...batches];
    setBatches(updated);
    saveBatches(updated);

    appendAuditLog(
      'BATCH_ASSIGNED',
      currentUser,
      'batch',
      newBatch.id,
      newBatch.title,
      `Assigned ${newBatch.batchCode} to ${newBatch.assignedTo.name} (${newBatch.assignedTo.role.toUpperCase()})`
    );

    setAuditLogs(getStoredAuditLogs());
    setIsCreatingBatch(false);
    setNewBatchTitle('');
    setNewBatchDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 rounded-[2rem] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header with Role & Security Badge */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-between sticky top-0 z-30 border-b border-gray-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white">
                  Content & Approval Workflow
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 uppercase tracking-wider">
                  RBAC Governed
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Admin → Assign Work → Volunteer/Mgmt → Review → Admin Approval → Publish
              </p>
            </div>
          </div>

          <button
            id="close-approval-pipeline-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-4 pt-3 pb-2 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Admin Desk Tab (Visible to all, action guarded for Admin) */}
            <button
              id="pipeline-tab-admin"
              type="button"
              onClick={() => setActiveTab('admin_approval')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin_approval'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Approval Desk</span>
              {pendingAdminCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-purple-700 text-[10px] font-black">
                  {pendingAdminCount}
                </span>
              )}
            </button>

            {/* Management Review Queue Tab */}
            <button
              id="pipeline-tab-mgmt"
              type="button"
              onClick={() => setActiveTab('mgmt_review')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'mgmt_review'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Management Review</span>
              {pendingMgmtCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-black">
                  {pendingMgmtCount}
                </span>
              )}
            </button>

            {/* Batches Tab */}
            <button
              id="pipeline-tab-batches"
              type="button"
              onClick={() => setActiveTab('batches')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'batches'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batch Manager</span>
            </button>

            {/* Audit Logs Tab */}
            <button
              id="pipeline-tab-audit"
              type="button"
              onClick={() => setActiveTab('audit_logs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'audit_logs'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Activity & Audit Log</span>
            </button>
          </div>

          {/* New Submission CTA */}
          <button
            id="pipeline-tab-submit-new"
            type="button"
            onClick={() => setActiveTab('submit_new')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'submit_new'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Content</span>
          </button>
        </div>

        {/* Modal Main Body Content */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* ========================================================= */}
          {/* TAB 1: ADMIN APPROVAL DESK (Full Control) */}
          {/* ========================================================= */}
          {activeTab === 'admin_approval' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-purple-950 dark:text-purple-100">
                      Admin Final Review & Publication Portal
                    </h3>
                    <p className="text-xs text-purple-800 dark:text-purple-300">
                      Only Admin has permission to publish content to public view or reject submissions.
                    </p>
                  </div>
                </div>

                {!RBAC.canFinalApproveAndPublish(currentRole) && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800">
                    <Lock className="w-3.5 h-3.5" />
                    <span>View Only — Admin Sign-in Required to Publish</span>
                  </div>
                )}
              </div>

              {/* Submissions Pending Admin Approval */}
              <div className="space-y-3">
                {submissions.filter(s => s.status === 'pending_admin_approval').length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      All Submissions are Up-to-Date!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      No pending items currently waiting for Admin signoff.
                    </p>
                  </div>
                ) : (
                  submissions
                    .filter(s => s.status === 'pending_admin_approval')
                    .map((item) => (
                      <div
                        key={item.id}
                        id={`submission-admin-${item.id}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xs space-y-3 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {item.contentType.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-gray-400">{item.id}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Submitted on {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {item.summary}
                          </p>
                        </div>

                        {/* Author & Management Endorsement Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Created By:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {item.createdBy.name} ({item.createdBy.role.toUpperCase()})
                            </span>
                          </div>
                          {item.managementReview && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-blue-500 block">Management Endorsement:</span>
                              <p className="text-gray-700 dark:text-gray-300 italic text-[11px]">
                                "{item.managementReview.comments}" — <span className="font-bold">{item.managementReview.reviewedBy}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Controls for Admin */}
                        {RBAC.canFinalApproveAndPublish(currentRole) ? (
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                            {activeActionItemId === item.id ? (
                              <div className="w-full space-y-2">
                                <textarea
                                  value={reviewComments}
                                  onChange={(e) => setReviewComments(e.target.value)}
                                  placeholder="Add publication remarks or instructions..."
                                  rows={2}
                                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setActiveActionItemId(null)}
                                    className="px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectOrRequestChanges(item)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Request Revisions</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdminApproveAndPublish(item)}
                                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Confirm & Publish Live</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 w-full justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionItemId(item.id);
                                    setReviewComments('Approved by National Director. Ready for public broadcast.');
                                  }}
                                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Approve & Publish Live</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionItemId(item.id);
                                    setReviewComments('Please re-verify the beneficiary list and submit revised receipts.');
                                  }}
                                  className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Request Changes</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-right text-xs text-gray-400 italic">
                            Awaiting signoff by Dr. Rajesh Sharma / Amarjeet Kumar (Admin)
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MANAGEMENT REVIEW QUEUE (Controlled Write) */}
          {/* ========================================================= */}
          {activeTab === 'mgmt_review' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-blue-950 dark:text-blue-100">
                      Management Verification & Endorsement Queue
                    </h3>
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      Review submissions from Volunteers, verify deliverables, and endorse to Admin for final publication.
                    </p>
                  </div>
                </div>

                {!RBAC.canReviewVolunteerSubmissions(currentRole) && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Management Role Required to Endorse</span>
                  </div>
                )}
              </div>

              {/* Items Pending Management Review */}
              <div className="space-y-3">
                {submissions.filter(s => s.status === 'pending_management_review').length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                    <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      No Submissions Waiting for Management Review
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      All volunteer deliverables have been processed and forwarded to Admin.
                    </p>
                  </div>
                ) : (
                  submissions
                    .filter(s => s.status === 'pending_management_review')
                    .map((item) => (
                      <div
                        key={item.id}
                        id={`submission-mgmt-${item.id}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xs space-y-3 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Volunteer Field Submission
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {item.summary}
                          </p>
                        </div>

                        <div className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Volunteer:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.createdBy.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Category:</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">{item.category}</span>
                          </div>
                        </div>

                        {RBAC.canReviewVolunteerSubmissions(currentRole) ? (
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                            {activeActionItemId === item.id ? (
                              <div className="w-full space-y-2">
                                <textarea
                                  value={reviewComments}
                                  onChange={(e) => setReviewComments(e.target.value)}
                                  placeholder="Add Management verification notes for Admin..."
                                  rows={2}
                                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setActiveActionItemId(null)}
                                    className="px-3 py-1.5 rounded-xl text-xs text-gray-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectOrRequestChanges(item)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Send Back to Volunteer</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleManagementEndorse(item)}
                                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer shadow-xs"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Endorse & Submit to Admin</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveActionItemId(item.id);
                                  setReviewComments('Deliverables verified by Field Operations. Ready for National Director approval.');
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Verify & Endorse to Admin</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-right text-xs text-gray-400 italic">
                            Management verification required
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BATCH MANAGER & WORK PACKAGE DISPATCH */}
          {/* ========================================================= */}
          {activeTab === 'batches' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-orange-950 dark:text-orange-100">
                      Work Packages & Batch Progression
                    </h3>
                    <p className="text-xs text-orange-800 dark:text-orange-300">
                      Official batches and certificates are exclusively authorized by Admin (Admin → Mgmt → Volunteer).
                    </p>
                  </div>
                </div>

                {RBAC.canCreateBatch(currentRole) ? (
                  <button
                    id="create-new-batch-btn"
                    type="button"
                    onClick={() => setIsCreatingBatch(!isCreatingBatch)}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreatingBatch ? 'Close Form' : 'Create & Assign Batch'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Batch creation is Admin-Only</span>
                  </div>
                )}
              </div>

              {/* New Batch Creation Form (Admin Only) */}
              {isCreatingBatch && RBAC.canCreateBatch(currentRole) && (
                <form
                  onSubmit={handleCreateBatch}
                  className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 shadow-sm space-y-3 animate-fadeIn"
                >
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-600" />
                    <span>Dispatch New Batch Assignment</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Batch Title
                      </label>
                      <input
                        type="text"
                        value={newBatchTitle}
                        onChange={(e) => setNewBatchTitle(e.target.value)}
                        placeholder="e.g. Village Solar Borewell Phase II"
                        required
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Category
                      </label>
                      <select
                        value={newBatchCategory}
                        onChange={(e) => setNewBatchCategory(e.target.value as TaskCategory)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="Education">Education & Smart Class</option>
                        <option value="Water">Water & Clean Wells</option>
                        <option value="Healthcare">Healthcare & Clinical Vans</option>
                        <option value="Hunger">Hunger Relief & Nutrition</option>
                        <option value="Community">Community Outreach</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Assign To Team Member Role
                      </label>
                      <select
                        value={newBatchTargetRole}
                        onChange={(e) => setNewBatchTargetRole(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        {currentRole === 'admin' && (
                          <option value="management">Priya Sharma (Field Operations Manager)</option>
                        )}
                        <option value="volunteer">Rahul Verma (Field Volunteer)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Target Completion Deadline
                      </label>
                      <input
                        type="date"
                        value={newBatchDeadline}
                        onChange={(e) => setNewBatchDeadline(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      Deliverables Description & Scope
                    </label>
                    <textarea
                      value={newBatchDesc}
                      onChange={(e) => setNewBatchDesc(e.target.value)}
                      placeholder="Outline batch objectives, GPS tags required, and deliverables..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingBatch(false)}
                      className="px-3 py-1.5 text-xs text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs cursor-pointer"
                    >
                      Confirm Batch Dispatch
                    </button>
                  </div>
                </form>
              )}

              {/* Batches List */}
              <div className="space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    id={`batch-card-${b.id}`}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                          {b.batchCode}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          b.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        Target: {b.targetCompletionDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                        {b.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {b.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned By:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {b.assignedBy.name} ({b.assignedBy.role.toUpperCase()})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned To:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {b.assignedTo.name} ({b.assignedTo.role.toUpperCase()})
                        </span>
                      </div>
                    </div>

                    {b.deliverablesNotes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        Deliverables note: {b.deliverablesNotes}
                      </p>
                    )}

                    {b.nextBatchAssigned && b.nextBatchTitle && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Next Batch Dispatched: <strong className="font-bold">{b.nextBatchTitle}</strong></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: AUDIT LOGS & ACTIVITY HISTORY */}
          {/* ========================================================= */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Immutable Activity & Audit History
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Chronological ledger of all creations, edits, reviews, approvals, and role actions.
                    </p>
                  </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Filter:</span>
                  <select
                    value={selectedAuditFilter}
                    onChange={(e) => setSelectedAuditFilter(e.target.value)}
                    className="text-xs p-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                  >
                    <option value="All">All Actions</option>
                    <option value="CONTENT_PUBLISHED">Published Live</option>
                    <option value="CONTENT_MGMT_REVIEWED">Management Reviews</option>
                    <option value="BATCH_ASSIGNED">Batch Assignments</option>
                    <option value="ROLE_CHANGED">Role Switches</option>
                  </select>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-2.5">
                {auditLogs
                  .filter(log => selectedAuditFilter === 'All' || log.action === selectedAuditFilter)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            log.action.includes('PUBLISHED') || log.action.includes('APPROVED')
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : log.action.includes('MGMT')
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                              : log.action.includes('BATCH')
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="font-extrabold text-gray-900 dark:text-white">
                            {log.entityTitle}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-[11px]">
                          {log.details}
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <div className="font-bold text-gray-800 dark:text-gray-200">
                          {log.actor.name}{' '}
                          <span className="text-[10px] uppercase text-gray-400">
                            ({log.actor.role})
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SUBMIT NEW CONTENT (Auto-routed by Role) */}
          {/* ========================================================= */}
          {activeTab === 'submit_new' && (
            <form onSubmit={handleSubmitNewContent} className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                      Submit New Field Content or Project
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {currentRole === 'admin'
                        ? 'Admin can publish directly to live portals or store for dispatch.'
                        : currentRole === 'management'
                        ? 'Management submissions are automatically routed to Admin for publication approval.'
                        : 'Volunteer reports are routed to Management for verification.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Bundi Solar Borewell Commissioning Report"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Content Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="report">Field Deliverable / Report</option>
                    <option value="story">Impact Story / Case Study</option>
                    <option value="project">Campaign / Project Draft</option>
                    <option value="dispatch">Field Dispatch Alert</option>
                    <option value="media">Media & High-Res Photography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Focus Cause / Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Water">Water Security</option>
                    <option value="Education">Education & AABHA Centers</option>
                    <option value="Healthcare">Healthcare & Clinical Vans</option>
                    <option value="Hunger">Hunger & Food Distribution</option>
                    <option value="Community">Community Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Field Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Bundi Rural Cluster, Rajasthan"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                  Executive Summary & Detailed Field Metrics
                </label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe the accomplishments, voucher references, beneficiary counts, and impact..."
                  rows={3}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Photo / Image URL
                  </label>
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Link to Batch Assignment (Optional)
                  </label>
                  <select
                    value={newBatchLink}
                    onChange={(e) => setNewBatchLink(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">-- No specific batch --</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.batchCode}: {b.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {currentRole === 'admin'
                      ? 'Publish Live Directly'
                      : currentRole === 'management'
                      ? 'Submit to Admin for Approval'
                      : 'Submit to Management for Review'}
                  </span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
