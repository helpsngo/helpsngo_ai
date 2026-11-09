import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  ExternalLink,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { UserProfile, DonationRecord } from '../types';
import { dpdpService } from '../services/dpdpService';
import { ORGANIZATION_INFO } from '../data/mockData';

interface DataDeletionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  donations?: DonationRecord[];
  onDeletionInitiated: () => void;
}

export const DataDeletionConfirmModal: React.FC<DataDeletionConfirmModalProps> = ({
  isOpen,
  onClose,
  user,
  donations = [],
  onDeletionInitiated
}) => {
  const [reason, setReason] = useState<string>('Account Closure & Withdrawal of Consent');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [confirmCheckbox, setConfirmCheckbox] = useState<boolean>(false);
  const [docketTicket, setDocketTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const isGuest = user.role === 'guest';
  const org = ORGANIZATION_INFO;

  // Check if user has active 80G tax deductible donations
  const userDonations = donations.filter(d => 
    user.email && d.donorEmail && d.donorEmail.toLowerCase() === user.email.toLowerCase()
  );
  const has80GRecords = userDonations.some(d => d.taxDeductible || d.approvalStatus === 'approved');

  const handleConfirmDeletion = () => {
    if (!confirmCheckbox) return;

    const fullReason = customNotes.trim() 
      ? `${reason} — ${customNotes.trim()}` 
      : reason;

    // Call service to log statutory erasure docket and wipe all local data
    const request = dpdpService.submitErasureRequest(
      user,
      fullReason,
      true, // wipeLocalConfirmed
      donations
    );

    setDocketTicket(request.id);
  };

  const handleFinishAndExit = () => {
    onDeletionInitiated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-200 dark:border-rose-950/80 flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white flex items-center justify-between border-b border-rose-900/60 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-700 flex items-center justify-center text-white font-bold shadow-xs">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-rose-900 text-rose-200 px-2 py-0.2 rounded-full border border-rose-700">
                  Section 12 DPDP Act 2023
                </span>
                <span className="text-[10px] text-rose-300 font-mono">Right to Erasure</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight mt-0.5 text-white">
                Request Data Deletion & Local Wipe
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

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {docketTicket ? (
            /* Success State after Deletion Request & Local Wipe */
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Statutory Docket Generated
                </span>
                <h4 className="font-black text-base text-gray-900 dark:text-white">
                  Local Data Wiped & Erasure Request Logged
                </h4>
                <p className="text-gray-600 dark:text-zinc-300 text-xs max-w-sm mx-auto leading-relaxed">
                  All local session tokens, cached form drafts, and stored device preferences have been wiped clean.
                </p>
              </div>

              {/* Docket Ticket Badge */}
              <div className="p-3.5 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Docket Tracking Number</span>
                  <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                    {docketTicket}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-zinc-400">
                  <span>Data Principal:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-zinc-400">
                  <span>Authorized Reviewer:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">National Admin Only</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-zinc-400">
                  <span>Statutory SLA:</span>
                  <span className="font-bold text-gray-900 dark:text-white">7 Working Days</span>
                </div>
              </div>

              {/* Statutory Note on Retention */}
              {has80GRecords && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl text-left text-[11px] text-amber-900 dark:text-amber-200">
                  <strong className="block font-bold">Income Tax Act Rule 18AB Notice:</strong>
                  Your donation receipts and Form 10BE tax certificates will be archived for the mandatory 7 financial years for statutory auditing. All non-statutory personal identifiers will be permanently purged by the National Admin.
                </div>
              )}

              <button
                type="button"
                onClick={handleFinishAndExit}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold uppercase tracking-wider rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Public View (Guest Mode)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Confirmation Flow Form */
            <div className="space-y-4">
              {/* Statutory Framework Banner */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-rose-900 dark:text-rose-200 space-y-1">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider block">
                    DPDP Act 2023 — Right to Erasure Workflow
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Under the <strong>Digital Personal Data Protection Act, 2023</strong>, Data Principals may request erasure of their personal data. To protect legal integrity and non-profit transparency, <strong>permanent central account purging is authorized and executed by the National Admin only</strong>.
                  </p>
                </div>
              </div>

              {/* What will happen immediately */}
              <div className="p-3.5 bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                  Actions Triggered Upon Your Request:
                </span>
                <ul className="space-y-1.5 text-[11px] text-gray-600 dark:text-zinc-300 list-disc list-inside">
                  <li><strong>Local Data Wipe:</strong> Active credentials, session tokens, cached volunteer dispatches, and cookie preferences are instantly purged from this device.</li>
                  <li><strong>Logged for National Admin:</strong> A formal statutory erasure docket is dispatched to National Managing Trustee Amarjeet Kumar's administrative review desk.</li>
                  <li><strong>Return to Guest Mode:</strong> Your session safely resets to public guest status.</li>
                </ul>
              </div>

              {/* 80G Audit Exception Warning */}
              {has80GRecords ? (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
                    <strong className="block font-bold">Rule 18AB / Section 80G Statutory Exception:</strong>
                    <p className="leading-relaxed">
                      You have active Section 80G tax exemption records. Under <strong>Rule 18AB of the Income Tax Rules, 1962</strong>, financial donation ledgers must be retained for <strong>7 financial years</strong> for statutory auditing. The National Admin will purge non-statutory communication channels while securely archiving audit ledgers.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No statutory 80G financial audits attached. Your account is eligible for immediate 100% complete purge.</span>
                </div>
              )}

              {/* Reason Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Requesting Erasure
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                >
                  <option value="Account Closure & Withdrawal of Consent">Account Closure & Withdrawal of Consent</option>
                  <option value="Privacy Preference & Discretion">Privacy Preference & Discretion</option>
                  <option value="No longer active in NGO initiatives">No longer active in NGO initiatives</option>
                  <option value="Device or Email Change">Device or Email Change</option>
                  <option value="Other">Other Specific Reason</option>
                </select>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes for National Admin (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Please purge all contact phone and volunteer squad records"
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white"
                />
              </div>

              {/* Affirmative Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 cursor-pointer">
                <input
                  type="checkbox"
                  id="confirm-erasure-checkbox"
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <span className="text-[11px] font-medium text-gray-800 dark:text-zinc-200 leading-snug">
                  I understand that this action will <strong>wipe all my locally stored data on this device</strong> and queue an official account erasure request to the <strong>National Admin</strong> under the DPDP Act 2023.
                </span>
              </label>

              {/* Modal Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors uppercase tracking-wider text-xs cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  id="confirm-data-deletion-btn"
                  disabled={!confirmCheckbox}
                  onClick={handleConfirmDeletion}
                  className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-xs uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe & Request</span>
                </button>
              </div>

              {/* DPO Contact footnote */}
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center pt-1 font-mono">
                Statutory Data Protection Desk: compliance@helpsngo.in • +91 94729 29856
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
