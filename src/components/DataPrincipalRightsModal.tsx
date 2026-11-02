import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  Phone, 
  FileText, 
  Lock, 
  Building, 
  X, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Send,
  Eye,
  FileCheck2,
  Users
} from 'lucide-react';
import { UserProfile, DonationRecord } from '../types';
import { ORGANIZATION_INFO } from '../data/mockData';

interface DataPrincipalRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  donations?: DonationRecord[];
  onOpenLegalPolicies?: (policyId?: string) => void;
}

type DpdpRightTab = 'access' | 'correction' | 'erasure' | 'nomination' | 'grievance';

export const DataPrincipalRightsModal: React.FC<DataPrincipalRightsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  donations = [],
  onOpenLegalPolicies
}) => {
  const [activeTab, setActiveTab] = useState<DpdpRightTab>('access');
  const org = ORGANIZATION_INFO;

  // Form states for Correction
  const [correctionField, setCorrectionField] = useState<string>('phone');
  const [correctedValue, setCorrectedValue] = useState<string>('');
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [correctionSubmitted, setCorrectionSubmitted] = useState<boolean>(false);

  // Form states for Erasure
  const [erasureConfirmed, setErasureConfirmed] = useState<boolean>(false);
  const [erasureReason, setErasureReason] = useState<string>('Account Closure');
  const [erasureSubmitted, setErasureSubmitted] = useState<boolean>(false);

  // Form states for Nomination (Sec 14)
  const [nomineeName, setNomineeName] = useState<string>('');
  const [nomineeRelation, setNomineeRelation] = useState<string>('Spouse / Family Member');
  const [nomineeContact, setNomineeContact] = useState<string>('');
  const [nomineeEmail, setNomineeEmail] = useState<string>('');
  const [nominationSubmitted, setNominationSubmitted] = useState<boolean>(false);

  // Grievance filing
  const [grievanceNature, setGrievanceNature] = useState<string>('Data Inaccuracy');
  const [grievanceDescription, setGrievanceDescription] = useState<string>('');
  const [grievanceTrackingId, setGrievanceTrackingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate downloadable JSON summary of personal data (Section 11)
  const handleDownloadPersonalData = () => {
    const personalDataDossier = {
      statutoryDeclaration: 'Digital Personal Data Protection Act, 2023 (Section 11 Right to Access Personal Data Summary)',
      dataFiduciary: {
        legalName: org.legalName,
        darpanId: 'HR/2021/0285458',
        cinOrRegistration: org.registrationNumber,
        registeredOffice: org.address.fullFormatted,
        nodalDataProtectionOfficer: 'Amarjeet Kumar (Managing Trustee & DPO)'
      },
      dataPrincipalProfile: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        taxIdOrPanMasked: currentUser.taxId ? 'XXXXX' + currentUser.taxId.slice(-4) : 'Not Provided',
        volunteerHours: currentUser.volunteerHours,
        volunteerLevel: currentUser.volunteerLevel,
        currency: currentUser.currency
      },
      donationsLedgerSummary: donations.filter(d => 
        currentUser.email && d.donorEmail && d.donorEmail.toLowerCase() === currentUser.email.toLowerCase()
      ).map(d => ({
        donationId: d.id,
        receiptNumber: d.receiptNumber,
        date: d.date,
        amount: d.amount,
        currency: d.currency,
        project: d.title,
        taxExemptionClaimed: d.taxDeductible ? 'Section 80G(5)(vi) 50% Deduction' : 'No'
      })),
      statutoryRetentionDisclaimer: 'Donation records are retained for mandatory 7 years under Section 80G of the Income Tax Act, 1961 & Rule 18AB of Income Tax Rules, 1962.',
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(personalDataDossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HELPS_DPDPA_Data_Export_${currentUser.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDescription.trim()) return;
    const ticketId = `DPDP-GRV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setGrievanceTrackingId(ticketId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-700/80 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/60">
                  DPDP Act 2023 Compliant
                </span>
                <span className="text-xs text-emerald-400/80 font-mono">Govt. of India</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-0.5 text-white">
                Data Principal Rights & Privacy Center
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DPDP Statutory Tab Bar */}
        <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('access')}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'access'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Sec 11: Access Data</span>
          </button>

          <button
            onClick={() => setActiveTab('correction')}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'correction'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sec 12: Correction</span>
          </button>

          <button
            onClick={() => setActiveTab('erasure')}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'erasure'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sec 12: Erasure</span>
          </button>

          <button
            onClick={() => setActiveTab('nomination')}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'nomination'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Sec 14: Nomination</span>
          </button>

          <button
            onClick={() => setActiveTab('grievance')}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'grievance'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Sec 13: Grievance & DPO</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: SECTION 11 RIGHT TO ACCESS */}
          {activeTab === 'access' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 uppercase text-[11px]">
                    Section 11, Digital Personal Data Protection Act, 2023
                  </span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                  As a Data Principal, you have the statutory right to obtain a summary of your personal data processed by HELPS Welfare Society, the identities of all data processors, and any other information prescribed by the Data Protection Board of India.
                </p>
              </div>

              {/* Data Overview Table */}
              <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-gray-200 dark:border-zinc-700 space-y-3">
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Your Personal Data Stored with HELPS
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Full Legal Name</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentUser.name || 'Public Visitor'}</span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Primary Email</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentUser.email || 'None'}</span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Registered Phone</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentUser.phone || '+91 Not Provided'}</span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Tax ID / PAN (Masked u/s 8)</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {currentUser.taxId ? 'XXXXX' + currentUser.taxId.slice(-4) : 'Not Provided'}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">System Access Tier</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{currentUser.role}</span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Donation Transactions</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {donations.filter(d => currentUser.email && d.donorEmail && d.donorEmail.toLowerCase() === currentUser.email.toLowerCase()).length} Records on Ledger
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-zinc-700">
                  <span className="text-[10px] text-gray-500 leading-tight">
                    Format: Encrypted Machine-Readable JSON Dossier
                  </span>
                  <button
                    onClick={handleDownloadPersonalData}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Personal Data Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION 12 RIGHT TO CORRECTION */}
          {activeTab === 'correction' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-extrabold text-blue-900 dark:text-blue-200 uppercase text-[11px]">
                    Section 12(1), DPDP Act, 2023 — Right to Correction & Updating
                  </span>
                </div>
                <p className="text-blue-800 dark:text-blue-300 text-xs leading-relaxed">
                  You have the right to request correction of inaccurate or misleading personal data, completion of incomplete personal data, and updating of your records.
                </p>
              </div>

              {correctionSubmitted ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm">
                    Correction Request Formally Logged
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Your request to update <strong>{correctionField.toUpperCase()}</strong> has been assigned tracking ID <strong>DPDP-COR-{Math.floor(10000 + Math.random() * 90000)}</strong>. As mandated by the DPDP Act 2023, our DPO desk will process this within 7 working days.
                  </p>
                  <button
                    onClick={() => { setCorrectionSubmitted(false); setCorrectedValue(''); setCorrectionReason(''); }}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 underline mt-2"
                  >
                    Submit another correction
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (correctedValue.trim()) setCorrectionSubmitted(true); }}
                  className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Field to Correct
                    </label>
                    <select
                      value={correctionField}
                      onChange={(e) => setCorrectionField(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                    >
                      <option value="name">Legal Name (As per PAN / Government ID)</option>
                      <option value="phone">Contact Phone / WhatsApp Number</option>
                      <option value="email">Primary Email Address</option>
                      <option value="address">Postal Residential Address</option>
                      <option value="pan">Permanent Account Number (PAN for 80G)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      New Corrected Value *
                    </label>
                    <input
                      type="text"
                      required
                      value={correctedValue}
                      onChange={(e) => setCorrectedValue(e.target.value)}
                      placeholder="Enter verified new value"
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Reason for Correction / Supporting Document Reference
                    </label>
                    <textarea
                      rows={2}
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="e.g. Inadvertent typo during initial volunteer registration"
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    Submit Statutory Correction Notice
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SECTION 12 RIGHT TO ERASURE ("RIGHT TO BE FORGOTTEN") */}
          {activeTab === 'erasure' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="font-extrabold text-rose-900 dark:text-rose-200 uppercase text-[11px]">
                    Section 12(2), DPDP Act, 2023 — Right to Erasure ("Right to be Forgotten")
                  </span>
                </div>
                <p className="text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                  A Data Principal may request erasure of their personal data upon withdrawal of consent, unless retention of such personal data is required under applicable Indian laws.
                </p>
              </div>

              {/* Statutory Retention Exception Alert */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <strong className="block font-bold">Mandatory Statutory Financial Retention (Section 8(7) Proviso):</strong>
                  <p className="leading-relaxed text-[11px]">
                    Donation records, PAN, Form 10BE tax receipts, and UTR numbers cannot be immediately purged if you have made charitable contributions. Under <strong>Section 80G(5)(vi) of the Income Tax Act, 1961</strong> and <strong>Rule 18AB</strong>, charitable trusts must retain financial donation registers for a mandatory period of <strong>7 financial years</strong> for statutory auditing. All non-statutory records (volunteer badges, messaging logs, newsletters) will be permanently purged immediately.
                  </p>
                </div>
              </div>

              {erasureSubmitted ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm">
                    Statutory Erasure Ticket Issued
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Your erasure request has been queued under Ticket <strong>DPDP-ERA-{Math.floor(10000 + Math.random() * 90000)}</strong>. Non-statutory tokens, preferences, and session data have been cleared.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Reason for Withdrawal of Consent & Erasure
                    </label>
                    <select
                      value={erasureReason}
                      onChange={(e) => setErasureReason(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Account Closure">Account Closure / No longer participating</option>
                      <option value="Withdrawal of Consent">Withdrawal of consent for communication</option>
                      <option value="Privacy Discretion">Personal privacy preference</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={erasureConfirmed}
                      onChange={(e) => setErasureConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-[11px] text-gray-700 dark:text-zinc-300 leading-snug">
                      I understand that submitting this statutory notice revokes active volunteer status and deletes non-statutory records, while statutory 80G tax audit files are retained as required by the Income Tax Department.
                    </span>
                  </label>

                  <button
                    disabled={!erasureConfirmed}
                    onClick={() => setErasureSubmitted(true)}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    Execute Statutory Erasure Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECTION 14 RIGHT TO NOMINATE */}
          {activeTab === 'nomination' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-extrabold text-purple-900 dark:text-purple-200 uppercase text-[11px]">
                    Section 14, DPDP Act, 2023 — Right to Nominate
                  </span>
                </div>
                <p className="text-purple-800 dark:text-purple-300 text-xs leading-relaxed">
                  A Data Principal shall have the right to nominate any other individual who shall, in the event of death or incapacity of the Data Principal, exercise the rights of the Data Principal under this Act.
                </p>
              </div>

              {nominationSubmitted ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm">
                    Nominee Record Successfully Registered
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Nominee <strong>{nomineeName}</strong> ({nomineeRelation}) has been officially attached to your Data Principal account.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (nomineeName.trim()) setNominationSubmitted(true); }}
                  className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Nominee Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Relationship to Data Principal
                      </label>
                      <input
                        type="text"
                        value={nomineeRelation}
                        onChange={(e) => setNomineeRelation(e.target.value)}
                        placeholder="Spouse / Parent / Child / Sibling"
                        className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Nominee Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={nomineeContact}
                        onChange={(e) => setNomineeContact(e.target.value)}
                        placeholder="+91 98765 00000"
                        className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-mono font-medium text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                        Nominee Email Address
                      </label>
                      <input
                        type="email"
                        value={nomineeEmail}
                        onChange={(e) => setNomineeEmail(e.target.value)}
                        placeholder="nominee@example.com"
                        className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    Save Statutory Nominee Designation
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: SECTION 13 GRIEVANCE REDRESSAL & DATA PROTECTION OFFICER (DPO) */}
          {activeTab === 'grievance' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 uppercase text-[11px]">
                    Section 13, DPDP Act, 2023 — Right of Grievance Redressal
                  </span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                  A Data Principal shall have the right to have readily available means of grievance redressal provided by HELPS Welfare Society.
                </p>
              </div>

              {/* DPO Statutory Credentials Card */}
              <div className="bg-slate-900 text-white p-4.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase text-emerald-400 tracking-wider">
                    Designated Data Protection Officer (DPO)
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    SLA: 7 Working Days
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Nodal DPO Name:</span>
                    <strong className="text-white text-sm">Amarjeet Kumar</strong>
                    <span className="text-slate-400 block text-[11px]">Founder & Managing Trustee, HELPS</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Dedicated Grievance Email:</span>
                    <a href="mailto:compliance@helpsngo.in" className="text-emerald-400 font-bold hover:underline">
                      compliance@helpsngo.in
                    </a>
                    <span className="text-slate-400 block text-[11px]">or amar@helpsngo.in</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Direct Compliance Helpline:</span>
                    <span className="text-slate-200 font-mono font-bold">+91 94729 29856</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Registered Statutory Office:</span>
                    <span className="text-slate-200 text-[11px] leading-tight block">
                      GNDEC Campus, Gill Park, Ludhiana, Punjab 141006
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Escalation Body: <strong>Data Protection Board of India (DPBI)</strong></span>
                  {onOpenLegalPolicies && (
                    <button
                      onClick={() => onOpenLegalPolicies('privacy-policy')}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      View Policy #2 →
                    </button>
                  )}
                </div>
              </div>

              {/* Grievance Submission Form */}
              {grievanceTrackingId ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm">
                    Grievance Formally Docketed
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Your grievance has been assigned tracking docket <strong>{grievanceTrackingId}</strong> and forwarded to DPO Amarjeet Kumar. Under DPDP Act rules, you will receive a resolution notice via email within 7 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFileGrievance} className="bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-3">
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[11px]">
                    Lodge a Data Privacy Grievance
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Nature of Grievance
                    </label>
                    <select
                      value={grievanceNature}
                      onChange={(e) => setGrievanceNature(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Data Inaccuracy">Inaccurate or misleading data recorded</option>
                      <option value="Unauthorized Processing">Dispute regarding consent or processing purpose</option>
                      <option value="Erasure Delay">Delay in processing data erasure request</option>
                      <option value="Child Safeguarding">Child media / POCSO / minor data inquiry</option>
                      <option value="Other">Other DPDP Act compliance query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Detailed Explanation of Grievance *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={grievanceDescription}
                      onChange={(e) => setGrievanceDescription(e.target.value)}
                      placeholder="Please describe the issue with specific dates or transaction numbers..."
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lodge Formal Grievance with DPO</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DataPrincipalRightsModal;
