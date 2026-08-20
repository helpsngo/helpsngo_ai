import React, { useState, useMemo } from 'react';
import { 
  IssuedCertificate, 
  UserProfile, 
  CertificateType, 
  BatchAssignment,
  UserRole
} from '../types';
import { 
  getStoredCertificates, 
  issueNewCertificate, 
  revokeCertificate, 
  reissueCertificate, 
  deleteCertificate,
  CreateCertificateInput 
} from '../services/certificateService';
import { getStoredBatches, getStoredAuditLogs } from '../services/rbacService';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Ban, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Users, 
  Sparkles,
  ExternalLink,
  QrCode,
  Calendar,
  AlertTriangle,
  FolderKanban,
  Check
} from 'lucide-react';

interface AdminCertificateControlModalProps {
  isOpen?: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onViewCertificate?: (cert: IssuedCertificate) => void;
  onPreviewCertificate?: (cert: IssuedCertificate) => void;
}

export const AdminCertificateControlModal: React.FC<AdminCertificateControlModalProps> = ({
  isOpen = true,
  currentUser,
  onClose,
  onViewCertificate,
  onPreviewCertificate
}) => {
  const handleView = onViewCertificate || onPreviewCertificate || (() => {});

  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'registry' | 'issue' | 'batches' | 'policy'>('registry');
  const [certificates, setCertificates] = useState<IssuedCertificate[]>(getStoredCertificates());
  const [batches] = useState<BatchAssignment[]>(getStoredBatches());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Issue Form State
  const [formType, setFormType] = useState<CertificateType>('volunteer_service');
  const [formRecipientName, setFormRecipientName] = useState<string>('');
  const [formRecipientEmail, setFormRecipientEmail] = useState<string>('');
  const [formRecipientRole, setFormRecipientRole] = useState<UserRole>('volunteer');
  const [formTitle, setFormTitle] = useState<string>('Certificate of Community Impact & Field Excellence');
  const [formSubtitle, setFormSubtitle] = useState<string>('National Volunteer Service Honor • Class of 2026');
  const [formHours, setFormHours] = useState<number>(12);
  const [formDonationAmount, setFormDonationAmount] = useState<number>(5000);
  const [formImpactMetrics, setFormImpactMetrics] = useState<string>('Contributed 12 verified service hours in rural healthcare camp');
  const [formCitation, setFormCitation] = useState<string>('In high recognition of selfless dedication, outstanding field leadership, and active contributions towards community empowerment.');
  const [formCustomCertNo, setFormCustomCertNo] = useState<string>('');
  const [formLinkedBatchId, setFormLinkedBatchId] = useState<string>('');
  const [issueSuccessMsg, setIssueSuccessMsg] = useState<string | null>(null);

  // Revoke Dialog State
  const [revokingCert, setRevokingCert] = useState<IssuedCertificate | null>(null);
  const [revokeReason, setRevokeReason] = useState<string>('');

  const refreshCertificates = () => {
    setCertificates(getStoredCertificates());
  };

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch = 
        cert.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || cert.type === filterType;
      const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [certificates, searchQuery, filterType, filterStatus]);

  const completedBatchesWithoutCerts = useMemo(() => {
    return batches.filter(b => b.status === 'completed' || b.completedTasks === b.totalTasks);
  }, [batches]);

  const handleTypeChange = (newType: CertificateType) => {
    setFormType(newType);
    if (newType === 'volunteer_service') {
      setFormTitle('Certificate of Community Impact & Field Excellence');
      setFormSubtitle('National Volunteer Service Honor • Class of 2026');
      setFormRecipientRole('volunteer');
      setFormCitation('In high recognition of selfless dedication, exemplary ground coordination, and active field contributions towards humanitarian relief.');
    } else if (newType === 'donation_80g') {
      setFormTitle('Section 80G Tax Exemption Certificate & Patron Honor');
      setFormSubtitle('Income Tax Act 1961, Section 80G(5)(vi) Compliance');
      setFormRecipientRole('donor');
      setFormCitation('Certified that the contribution made to Helps NGO Public Charitable Trust qualifies for 50% deduction under Section 80G of the Indian Income Tax Act 1961.');
    } else if (newType === 'management_appreciation') {
      setFormTitle('Executive Trustee & Management Leadership Citation');
      setFormSubtitle('For Excellence in Field Logistics & Chapter Operations');
      setFormRecipientRole('management');
      setFormCitation('Awarded for extraordinary managerial leadership, operational governance, and diligent execution of humanitarian relief projects.');
    } else if (newType === 'batch_completion') {
      setFormTitle('Operational Batch Completion & Project Handover Certificate');
      setFormSubtitle('Batch Deliverables & Milestone Compliance Record');
      setFormRecipientRole('volunteer');
      setFormCitation('Certified that all milestone deliverables and technical standards for the designated operational batch were successfully achieved and formally audited.');
    } else if (newType === 'leadership_award') {
      setFormTitle('National Humanitarian Leadership & Trustee Fellowship');
      setFormSubtitle('Distinguished Social Impact & Philanthropy Medal');
      setFormRecipientRole('management');
      setFormCitation('In highest appreciation of visionary leadership, ethical stewardship, and transformative contributions to societal welfare.');
    }
  };

  const handleQuickIssueForBatch = (batch: BatchAssignment) => {
    setFormType('batch_completion');
    handleTypeChange('batch_completion');
    setFormRecipientName(batch.assignedTo?.name || 'Field Volunteer');
    setFormRecipientEmail(batch.assignedTo?.email || 'volunteer@helpsngo.in');
    setFormRecipientRole(batch.assignedTo?.role || 'volunteer');
    setFormLinkedBatchId(batch.id);
    setFormTitle(`Operational Batch Completion: ${batch.batchCode}`);
    setFormSubtitle(batch.title);
    setFormImpactMetrics(`Successfully executed all ${batch.totalTasks} cluster deliverables for ${batch.category} program.`);
    setActiveTab('issue');
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecipientName.trim() || !formRecipientEmail.trim()) return;

    const input: CreateCertificateInput = {
      type: formType,
      title: formTitle,
      subtitle: formSubtitle,
      recipientName: formRecipientName.trim(),
      recipientEmail: formRecipientEmail.trim(),
      recipientRole: formRecipientRole,
      hoursCredited: formType === 'volunteer_service' || formType === 'batch_completion' ? formHours : undefined,
      donationAmount: formType === 'donation_80g' ? formDonationAmount : undefined,
      impactMetrics: formImpactMetrics,
      citationText: formCitation,
      batchId: formLinkedBatchId || undefined,
      customCertificateNumber: formCustomCertNo || undefined
    };

    const res = issueNewCertificate(currentUser, input);
    if (res.success && res.certificate) {
      refreshCertificates();
      setIssueSuccessMsg(`Certificate #${res.certificate.certificateNumber} generated & signed successfully!`);
      setTimeout(() => {
        setIssueSuccessMsg(null);
        setActiveTab('registry');
      }, 1800);
    }
  };

  const handleRevokeSubmit = () => {
    if (!revokingCert || !revokeReason.trim()) return;
    revokeCertificate(currentUser, revokingCert.id, revokeReason.trim());
    refreshCertificates();
    setRevokingCert(null);
    setRevokeReason('');
  };

  const handleDelete = (certId: string) => {
    if (confirm('Are you sure you want to permanently delete this certificate from the official trust records?')) {
      deleteCertificate(currentUser, certId);
      refreshCertificates();
    }
  };

  const auditLogs = getStoredAuditLogs().filter(log => log.entityType === 'certificate' || log.entityType === 'batch');

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-purple-950 to-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Admin Certificate & Batch Authorization Studio
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-400/30">
                  Admin Exclusive Control
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Issue, revoke, and assign verified private honors, 80G tax certificates, and batch completion credentials.
              </p>
            </div>
          </div>
          <button
            id="admin-cert-close-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-4 sm:px-6 overflow-x-auto gap-2">
          <button
            id="admin-cert-tab-registry"
            onClick={() => setActiveTab('registry')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'registry'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Certificate Registry ({certificates.length})</span>
          </button>

          <button
            id="admin-cert-tab-issue"
            onClick={() => setActiveTab('issue')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'issue'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>

          <button
            id="admin-cert-tab-batches"
            onClick={() => setActiveTab('batches')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'batches'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Completed Batches ({completedBatchesWithoutCerts.length})</span>
          </button>

          <button
            id="admin-cert-tab-policy"
            onClick={() => setActiveTab('policy')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'policy'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorization Policy & Audit Log</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-900">
          {/* TAB 1: REGISTRY */}
          {activeTab === 'registry' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by recipient name, email, cert ID, or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-800 dark:text-zinc-200 focus:outline-hidden"
                  >
                    <option value="all">All Types</option>
                    <option value="volunteer_service">Volunteer Service</option>
                    <option value="donation_80g">80G Tax Exemption</option>
                    <option value="management_appreciation">Management Appreciation</option>
                    <option value="batch_completion">Batch Completion</option>
                    <option value="leadership_award">Leadership Award</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-800 dark:text-zinc-200 focus:outline-hidden"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active / Valid</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
              </div>

              {/* Certificate Cards */}
              {filteredCertificates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                  <Award className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-gray-800 dark:text-zinc-200">No Certificates Found</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    No certificate records match your filter criteria. Click "Issue New Certificate" to create one.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredCertificates.map((cert) => (
                    <div 
                      key={cert.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        cert.status === 'revoked'
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 opacity-80'
                          : 'bg-white dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700/80 hover:border-purple-300 dark:hover:border-purple-600 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                              {cert.certificateNumber}
                            </span>
                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-zinc-100 mt-1.5 line-clamp-1">
                              {cert.title}
                            </h4>
                          </div>

                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            cert.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                          }`}>
                            {cert.status === 'active' ? '✓ ACTIVE' : '✕ REVOKED'}
                          </span>
                        </div>

                        {/* Recipient Details */}
                        <div className="mt-3 p-2.5 bg-gray-50 dark:bg-zinc-900/80 rounded-xl border border-gray-100 dark:border-zinc-800 text-xs flex items-center justify-between">
                          <div>
                            <div className="font-bold text-gray-900 dark:text-zinc-100">{cert.recipientName}</div>
                            <div className="text-[11px] text-gray-500 font-mono">{cert.recipientEmail}</div>
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200">
                            {cert.recipientRole}
                          </span>
                        </div>

                        {/* Metadata Snippet */}
                        <div className="mt-2.5 text-[11px] text-gray-600 dark:text-zinc-400 space-y-1">
                          {cert.hoursCredited && (
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span><strong>{cert.hoursCredited}</strong> Verified Service Hours</span>
                            </div>
                          )}
                          {cert.donationAmount !== undefined && cert.donationAmount !== null && (
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span><strong>₹{(cert.donationAmount ?? 0).toLocaleString('en-IN')}</strong> 80G Tax Deductible</span>
                            </div>
                          )}
                          {cert.batchTitle && (
                            <div className="flex items-center gap-1.5">
                              <FolderKanban className="w-3.5 h-3.5 text-purple-500" />
                              <span className="line-clamp-1">{cert.batchTitle}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                            <Calendar className="w-3 h-3" />
                            <span>Issued: {cert.issueDate} • By: {cert.issuedByAdminName}</span>
                          </div>
                        </div>

                        {cert.status === 'revoked' && (
                          <div className="mt-2 p-2 bg-red-100/70 dark:bg-red-950/60 rounded-lg text-[10px] text-red-800 dark:text-red-300 font-medium">
                            <strong>Revocation Reason:</strong> {cert.revokedReason || 'Administrative decision'}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <button
                          id={`admin-cert-view-${cert.id}`}
                          onClick={() => handleView(cert)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Live</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {cert.status === 'active' ? (
                            <button
                              id={`admin-cert-revoke-${cert.id}`}
                              onClick={() => setRevokingCert(cert)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          ) : (
                            <button
                              id={`admin-cert-reissue-${cert.id}`}
                              onClick={() => {
                                reissueCertificate(currentUser, cert.id, { status: 'active', revokedReason: undefined });
                                refreshCertificates();
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </button>
                          )}

                          <button
                            id={`admin-cert-del-${cert.id}`}
                            onClick={() => handleDelete(cert.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Delete certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ISSUE NEW CERTIFICATE */}
          {activeTab === 'issue' && (
            <form onSubmit={handleIssueSubmit} className="max-w-2xl mx-auto space-y-4">
              {issueSuccessMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{issueSuccessMsg}</span>
                </div>
              )}

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-purple-950 dark:text-purple-200">Admin Authorization Policy Enforcement</div>
                  <div className="text-purple-800 dark:text-purple-300 mt-0.5">
                    Certificates created here are cryptographically signed, bound to the specified recipient account ID, and stored in the official verification registry.
                  </div>
                </div>
              </div>

              {/* Certificate Template Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  1. Select Certificate Category & Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'volunteer_service', label: '🤝 Volunteer Impact', desc: 'Hours & Field service' },
                    { id: 'donation_80g', label: '🛡️ 80G Tax Exemption', desc: 'Donor tax exemption' },
                    { id: 'management_appreciation', label: '💼 Trustee & Mgmt', desc: 'Leadership citation' },
                    { id: 'batch_completion', label: '📦 Batch Completion', desc: 'Milestone project handover' },
                    { id: 'leadership_award', label: '🏆 Leadership Award', desc: 'Distinguished medal' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTypeChange(t.id as CertificateType)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        formType === t.id
                          ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-400'
                          : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{t.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Binding */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3">
                <label className="block text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
                  2. Recipient Account Assignment (Private Access Binding)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Patel"
                      value={formRecipientName}
                      onChange={(e) => setFormRecipientName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Recipient Email (Account Binding) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav.volunteer@helpsngo.in"
                      value={formRecipientEmail}
                      onChange={(e) => setFormRecipientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Recipient Role
                    </label>
                    <select
                      value={formRecipientRole}
                      onChange={(e) => setFormRecipientRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="management">Management Member</option>
                      <option value="donor">Donor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Custom Certificate ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank for auto-generated ID"
                      value={formCustomCertNo}
                      onChange={(e) => setFormCustomCertNo(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specific Metrics */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3">
                <label className="block text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
                  3. Citation & Metric Achievements
                </label>

                {(formType === 'volunteer_service' || formType === 'batch_completion') && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Verified Field Hours Credited
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formHours}
                      onChange={(e) => setFormHours(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                )}

                {formType === 'donation_80g' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                      Tax Exempt Donation Amount (INR ₹)
                    </label>
                    <input
                      type="number"
                      min={500}
                      value={formDonationAmount}
                      onChange={(e) => setFormDonationAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                    Impact Summary Text
                  </label>
                  <input
                    type="text"
                    value={formImpactMetrics}
                    onChange={(e) => setFormImpactMetrics(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                    Official Citation & Honors Text
                  </label>
                  <textarea
                    rows={3}
                    value={formCitation}
                    onChange={(e) => setFormCitation(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('registry')}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="admin-issue-cert-submit-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue & Sign Certificate</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BATCH LINKING */}
          {activeTab === 'batches' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200">
                <strong>Batch Completion Certificate Workflow:</strong> When an Admin-authorized batch reaches 100% completion, the Admin can generate and assign a verified Certificate of Batch Completion directly to the responsible team member or volunteer.
              </div>

              <div className="space-y-3">
                {completedBatchesWithoutCerts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-xs">
                    No completed batches available at this time.
                  </div>
                ) : (
                  completedBatchesWithoutCerts.map((batch) => (
                    <div 
                      key={batch.id}
                      className="p-4 bg-gray-50 dark:bg-zinc-800/80 rounded-2xl border border-gray-200 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md">
                            {batch.batchCode}
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                            {batch.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          Assigned To: <strong>{batch.assignedTo?.name}</strong> ({batch.assignedTo?.email}) • {batch.completedTasks}/{batch.totalTasks} Tasks Completed
                        </div>
                      </div>

                      <button
                        id={`admin-issue-batch-cert-${batch.id}`}
                        onClick={() => handleQuickIssueForBatch(batch)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Authorize Certificate</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: POLICY & AUDIT */}
          {activeTab === 'policy' && (
            <div className="space-y-6">
              {/* Permission Matrix Table */}
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-3.5 bg-gray-900 text-white text-xs font-bold flex items-center justify-between">
                  <span>Certificate & Batch Authorization Policy Matrix</span>
                  <span className="text-[10px] bg-purple-600 px-2 py-0.5 rounded-full font-mono">
                    RBAC Enforcement Active
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800/70 text-gray-600 dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-700">
                      <tr>
                        <th className="p-3">Feature</th>
                        <th className="p-3 text-center">Admin</th>
                        <th className="p-3 text-center">Management</th>
                        <th className="p-3 text-center">Volunteer</th>
                        <th className="p-3 text-center">Donor</th>
                        <th className="p-3 text-center">Public / Guest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300">
                      <tr>
                        <td className="p-3 font-semibold">Create / Issue Certificate</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ Admin Only</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Approve / Revoke Certificate</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ Admin Only</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">View Own Certificate</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (All)</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (Assigned)</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (Assigned)</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (Assigned)</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌ (Login Required)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">View Other User Certificate</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ Full Access</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌ Blocked</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌ Blocked</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌ Blocked</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌ Blocked</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Create / Assign Batch</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ Admin Only</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Manage Assigned Batch Work</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ Full Access</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (Supervise)</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">✅ (Assigned only)</td>
                        <td className="p-3 text-center text-gray-400 font-bold">Relevant only</td>
                        <td className="p-3 text-center text-red-500 font-bold">❌</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Audit Log */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                  Certificate & Batch Audit Logs
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/80 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-zinc-300 mt-1 font-medium">
                          {log.details}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-white dark:bg-zinc-700 px-2 py-0.5 rounded-md border border-gray-200 dark:border-zinc-600 flex-shrink-0">
                        {log.actor.name} ({log.actor.role})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Revoke Modal Dialog */}
        {revokingCert && (
          <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-100">
                  Revoke Certificate #{revokingCert.certificateNumber}
                </h4>
              </div>

              <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                Revoking this certificate will immediately invalidate its verification hash and block future downloads. Please state the reason for audit compliance.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Reason for Revocation *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Disciplinary review, corrected reissue pending, or factual error"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevokingCert(null)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRevokeSubmit}
                  disabled={!revokeReason.trim()}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
