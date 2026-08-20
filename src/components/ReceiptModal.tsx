import React, { useState } from 'react';
import { DonationRecord, UserProfile } from '../types';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake, 
  Share2, 
  Clock, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  FileCheck2,
  ShieldAlert,
  Award
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ReceiptModalProps {
  donation: DonationRecord | null;
  user: UserProfile;
  onClose: () => void;
  onApproveDonation?: (donationId: string) => void;
  onOpenForm10BE?: () => void;
  onOpenAppreciationLetter?: (donation: DonationRecord) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  donation,
  user,
  onClose,
  onApproveDonation,
  onOpenForm10BE,
  onOpenAppreciationLetter
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  if (!donation) return null;

  const isApproved = donation.approvalStatus === 'approved';
  const isPending = !donation.approvalStatus || donation.approvalStatus === 'pending';
  const isRejected = donation.approvalStatus === 'rejected';
  const isAdmin = user?.role === 'admin' || user?.role === 'management';

  // Can download/print only if approved
  const canDownload = isApproved;

  const handlePrint = () => {
    if (!canDownload) return;
    window.print();
  };

  const handleQuickApprove = () => {
    if (!onApproveDonation) return;
    setIsApproving(true);
    setTimeout(() => {
      onApproveDonation(donation.id);
      setIsApproving(false);
    }, 400);
  };

  const donorDisplayName = donation.donorName || user?.name || 'Generous Supporter';
  const donorDisplayEmail = donation.donorEmail || user?.email || 'donor@helpsngo.in';
  const donorDisplayTaxId = donation.donorTaxId || user?.taxId || 'PAN-VERIFIED';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-white rounded-[2rem] max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">
                Tax Exemption Receipt (80G)
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {canDownload && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-600 text-gray-700 flex items-center justify-center transition-colors shadow-xs border border-gray-200"
                  title="Share Contribution"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-xs border border-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pending Approval Notice Banner (if pending) */}
          {isPending && (
            <div className="p-4 bg-amber-50 border-b border-amber-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-amber-900">80G Verification & Badge Approval Pending</h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                    Your contribution of ₹{donation.amount.toLocaleString('en-IN')} has been received! The official signed 80G certificate & downloadable badge will unlock as soon as verified by NGO Management.
                  </p>
                </div>
              </div>

              {/* Admin One-Click Quick Approve Trigger */}
              {isAdmin && onApproveDonation && (
                <div className="pt-2 flex items-center justify-between border-t border-amber-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    🛡️ Admin Authorization
                  </span>
                  <button
                    onClick={handleQuickApprove}
                    disabled={isApproving}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 py-1 rounded-xl text-[10px] uppercase tracking-wider shadow-xs flex items-center gap-1 transition-all"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>{isApproving ? 'Approving...' : 'Approve 80G Certificate'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rejected Notice Banner (if rejected) */}
          {isRejected && (
            <div className="p-3.5 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold">80G Certification Rejected: </span>
                <span>{donation.rejectionReason || 'Please verify your PAN number or contact NGO helpdesk.'}</span>
              </div>
            </div>
          )}

          {/* Printable Receipt Paper */}
          <div id="printable-receipt" className={`p-5 space-y-4 text-gray-800 text-xs ${!canDownload ? 'opacity-90' : ''}`}>
            {/* NGO Org Details */}
            <div className="text-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-black text-gray-900 tracking-tight">
                HELPS WELFARE SOCIETY (HELPS NGO)
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Registered under Societies Registration Act XXI of 1860 (Est. 2016) • Chandigarh Reg.
              </p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                80G Reg: CIT(E)/80G/AAATH7892RE20214 • NITI Aayog DARPAN Verified
              </p>
            </div>

            {/* Receipt Status Badge */}
            {isApproved ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs">Payment & 80G Approved</span>
                    <span className="text-[10px] text-emerald-700">100% Tax Exemption Verified • {donation.approvedBy || 'Trustee Board'}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-gray-700">
                  {donation.receiptNumber}
                </span>
              </div>
            ) : isPending ? (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <div>
                    <span className="font-bold text-amber-900 block text-xs">Approval in Progress</span>
                    <span className="text-[10px] text-amber-700">Awaiting Trustee 80G Seal</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  PENDING-80G
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="font-bold text-rose-900 block text-xs">Approval Rejected</span>
                    <span className="text-[10px] text-rose-700">Contact admin@helpsngo.in</span>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Summary Grid */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Donor Name:</span>
                <span className="font-bold text-gray-900">{donorDisplayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Email Address:</span>
                <span className="font-medium text-gray-900">{donorDisplayEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tax ID / PAN:</span>
                <span className="font-mono font-medium text-gray-900">{donorDisplayTaxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Donation Date:</span>
                <span className="font-medium text-gray-900">{donation.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Initiative:</span>
                <span className="font-semibold text-gray-900">{donation.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Mode:</span>
                <span className="font-medium text-gray-900">{donation.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">Total Contributed:</span>
                <span className="font-extrabold text-base text-orange-600">
                  ₹{(donation.amount ?? 0).toLocaleString('en-IN')} INR
                </span>
              </div>
            </div>

            {/* Legal statement */}
            <div className="text-[10px] text-gray-500 leading-relaxed bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
              * 100% Eligible for income tax deduction under Section 80G of the Income Tax Act. No commercial goods or services were exchanged in return.
            </div>

            {/* Digital Signature & Seal */}
            <div className="pt-1 flex items-center justify-between border-t border-gray-100 text-[10px] text-gray-500">
              <div className="flex items-center gap-1 text-gray-600 font-semibold">
                <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
                <span>Helps NGO Authorized</span>
              </div>
              <div className="text-right">
                {isApproved ? (
                  <>
                    <div className="font-serif italic font-bold text-gray-900 text-xs">Amarjeet Kumar</div>
                    <span className="text-emerald-700 font-medium">✓ Digitally Signed & Sealed (Founder & Director)</span>
                  </>
                ) : (
                  <>
                    <div className="font-serif italic text-gray-400 text-xs">[Pending Verification]</div>
                    <span className="text-amber-600">Awaiting Director Signature</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex gap-2">
            {canDownload ? (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3 bg-white hover:bg-orange-50 hover:text-orange-600 text-gray-700 font-bold py-2.5 rounded-xl border border-gray-200 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  title="Share Contribution on Social Media"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                {onOpenAppreciationLetter && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAppreciationLetter(donation);
                    }}
                    className="px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold py-2.5 rounded-xl border border-amber-200 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="View Formal Signed Letter of Appreciation"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Appreciation Letter</span>
                  </button>
                )}
                {onOpenForm10BE && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenForm10BE();
                    }}
                    className="px-3 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold py-2.5 rounded-xl border border-orange-200 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="View Official Statutory Form 10BE Certificate"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Form 10BE</span>
                  </button>
                )}
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-bold py-2.5 px-3 rounded-xl border border-gray-200 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </>
            ) : (
              <div className="flex-1 bg-gray-100 text-gray-400 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed border border-gray-200">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Print / Download Locked (Pending Approval)</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-5 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={{
          title: `Supported ${donation.title}`,
          text: `I just contributed ₹${donation.amount.toLocaleString('en-IN')} to ${donation.title} with Helps NGO! Join me in making a verified difference.`,
          category: donation.category,
          metric: `₹${donation.amount.toLocaleString('en-IN')} Contributed`
        }}
      />
    </>
  );
};
