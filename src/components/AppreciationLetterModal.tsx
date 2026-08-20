import React, { useState, useRef } from 'react';
import { DonationRecord, UserProfile } from '../types';
import { ORGANIZATION_INFO } from '../data/mockData';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface AppreciationLetterModalProps {
  donation: DonationRecord | null;
  user?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onViewImpactUpdate?: () => void;
}

export const AppreciationLetterModal: React.FC<AppreciationLetterModalProps> = ({
  donation,
  user,
  isOpen,
  onClose,
  onViewImpactUpdate
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const org = ORGANIZATION_INFO;

  if (!isOpen || !donation) return null;

  const donorName = donation.donorName || user?.name || 'Generous Supporter';
  const donorTaxId = donation.donorTaxId || user?.taxId || 'PAN-RECORDED';
  const formattedAmount = `${donation.currency || '₹'} ${(donation.amount ?? 0).toLocaleString('en-IN')}`;
  const letterNumber = donation.appreciationLetterId || `HELPS/LTR/${new Date().getFullYear()}/${donation.id.replace('DON-', '')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
        <div 
          className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-200 dark:border-gray-800 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Actions Top Bar */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-widest">
                Official Letter of Appreciation
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowShareModal(true)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share Certificate"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Print Letter"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Letter Canvas */}
          <div className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-900 dark:text-gray-100 bg-amber-50/20 dark:bg-gray-900">
            
            {/* Letterhead Container with Decorative Gold Border */}
            <div 
              ref={letterRef}
              className="bg-white dark:bg-gray-950 p-6 sm:p-8 rounded-2xl border-2 border-amber-300 dark:border-amber-900/60 shadow-lg relative space-y-6 text-gray-800 dark:text-gray-200 print:shadow-none print:border-none"
            >
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
                <HeartHandshake className="w-96 h-96 text-orange-900" />
              </div>

              {/* Letterhead Header */}
              <div className="border-b-2 border-amber-400/60 dark:border-amber-700/60 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center font-black text-2xl shadow-md flex-shrink-0">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight uppercase">
                      HELPS Welfare Society
                    </h1>
                    <p className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                      Health, Education, Liberty, Peace, and Service
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                      {org.registrationNumber} • {org.taxStatus.split('•')[0].trim()}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-gray-600 dark:text-gray-400 font-mono space-y-0.5 sm:border-l sm:border-gray-200 dark:sm:border-gray-800 sm:pl-4">
                  <p className="font-bold text-gray-900 dark:text-white">{org.address.landmark}</p>
                  <p>{org.address.city}, {org.address.state} – {org.address.pinCode}</p>
                  <p className="text-orange-700 dark:text-orange-400 font-bold">{org.website}</p>
                </div>
              </div>

              {/* Reference & Date Bar */}
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 font-mono">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Ref No: </span>
                  <span className="text-orange-700 dark:text-orange-400 font-bold">{letterNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Date: </span>
                  <span>{donation.date || new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Salutation */}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">To,</p>
                <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
                  {donorName}
                </h3>
                {donorTaxId && donorTaxId !== 'PAN-RECORDED' && (
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    PAN: <span className="font-bold uppercase">{donorTaxId}</span>
                  </p>
                )}
                {donation.donorEmail && (
                  <p className="text-xs text-gray-500 font-mono">{donation.donorEmail}</p>
                )}
              </div>

              {/* Letter Subject */}
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60">
                <p className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200">
                  Subject: Heartfelt Gratitude & Letter of Appreciation for Generous Contribution towards "{donation.title}"
                </p>
              </div>

              {/* Formal Letter Body */}
              <div className="space-y-3.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
                <p>
                  Dear <strong>{donorName}</strong>,
                </p>
                <p>
                  On behalf of the <strong>Board of Trustees, staff, and over 4,500 volunteers of HELPS Welfare Society</strong>, we express our profound gratitude for your valuable contribution of <strong>{formattedAmount}</strong> ({donation.isMonthly ? 'Monthly Recurring Commitment' : 'Generous One-Time Gift'}) made on {donation.date}.
                </p>
                <p>
                  Your contribution directly empowers our ongoing mission under <strong>{donation.category} Welfare</strong>. Because of compassionate champions like you, slum children enrolled in our <em>AABHA Learning Centers</em> receive daily evening coaching and school kits, rural patients receive free doctor diagnostic consultations and life-saving medicines, and destitute families are served hot, nutritious meals.
                </p>
                <p className="italic text-gray-700 dark:text-gray-300 bg-orange-50/50 dark:bg-gray-900/60 p-3 rounded-xl border-l-4 border-orange-500 font-sans text-xs">
                  "True service is not merely about charity; it is about restoring dignity, building self-reliance, and ensuring that no child or family is left behind."
                </p>
                <p>
                  This letter also confirms that your donation is eligible for <strong>50% Tax Exemption under Section 80G</strong> of the Income Tax Act, 1961 (Receipt No: <span className="font-mono font-bold text-orange-700 dark:text-orange-400">{donation.receiptNumber}</span>). We are deeply privileged to have you as an integral part of the HELPS family.
                </p>
              </div>

              {/* Signatures & Official Stamp */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-end justify-between gap-4">
                
                {/* Official Circular Stamp */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange-600 text-orange-700 dark:text-orange-400 flex flex-col items-center justify-center text-center p-1 font-mono text-[7px] uppercase font-bold transform -rotate-12 select-none shadow-xs">
                    <span>★ HELPS NGO ★</span>
                    <span className="font-black text-[8px]">SEAL OF TRUST</span>
                    <span>REGD. 1860</span>
                    <span>LUDHIANA (PB)</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Digitally Certified</p>
                    <p>Sec 80G • MCA CSR-1</p>
                    <p>Govt. of India</p>
                  </div>
                </div>

                {/* Director Signature */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic font-black text-base text-gray-900 dark:text-white">
                    Amarjeet Kumar
                  </div>
                  <div className="h-0.5 w-32 bg-gray-400 ml-auto" />
                  <p className="text-xs font-black text-gray-900 dark:text-white">Amarjeet Kumar</p>
                  <p className="text-[10px] text-gray-500 font-medium">Founder & National Managing Director</p>
                  <p className="text-[9px] text-orange-700 dark:text-orange-400 font-mono">HELPS Welfare Society</p>
                </div>
              </div>

            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Letter</span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share On Social</span>
              </button>
            </div>

            {onViewImpactUpdate && (
              <button
                onClick={() => {
                  onClose();
                  onViewImpactUpdate();
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <span>Track Field Impact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareTitle={`I just supported HELPS Welfare Society (${donation.title})!`}
          shareText={`Proud to support ${donation.title} with HELPS Welfare Society. 100% transparent grassroots relief across Punjab and India.`}
          shareUrl="https://helpsngo.in/"
        />
      )}
    </>
  );
};
