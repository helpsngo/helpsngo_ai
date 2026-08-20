import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  X, 
  CheckCircle2, 
  Award, 
  Building2, 
  Sparkles,
  Calendar,
  Lock
} from 'lucide-react';
import { DonationRecord, UserProfile } from '../types';

interface TaxExemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation?: DonationRecord | null;
  user?: UserProfile;
}

export const TaxExemptionModal: React.FC<TaxExemptionModalProps> = ({
  isOpen,
  onClose,
  donation,
  user
}) => {
  if (!isOpen) return null;

  const donorName = donation?.donorName || user?.name || 'Alex Johnson';
  const donorPan = donation?.donorTaxId || user?.taxId || 'ABCDE1234F';
  const amount = donation?.amount || 25000;
  const currency = donation?.currency || '₹';
  const receiptNo = donation?.receiptNumber || 'REC-80G-2026-9042';
  const date = donation?.date || 'August 16, 2026';
  const financialYear = '2026-27 (Assessment Year 2027-28)';
  const uniqueCertHash = `80G-MCA-IN-${receiptNo.replace(/[^0-9]/g, '')}-7A9F3`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400">
                  Form 10BE / Section 80G Certificate
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  100% Tax Deductible
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Official Statutory Tax Exemption Certificate
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable Area) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-amber-50/30 space-y-6">
          <div className="bg-white border-2 border-amber-600/30 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
            {/* Watermark Logo */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Building2 className="w-96 h-96 text-zinc-900" />
            </div>

            {/* Top Header with Trust Info */}
            <div className="border-b-2 border-amber-500/40 pb-5 text-center space-y-1 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 font-mono">
                GOVERNMENT OF INDIA • INCOME TAX DEPARTMENT
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                HELPS WELFARE SOCIETY (HELPS NGO)
              </h1>
              <p className="text-xs text-gray-600 max-w-xl mx-auto">
                Registered under Societies Registration Act XXI of 1860 (Est. 2016) • Chandigarh Reg. • NITI Aayog DARPAN: RJ/2021/0299102
              </p>
              <p className="text-[11px] font-mono text-gray-500">
                80G Unique Reg. No: <strong>AABTH1234F20261</strong> | Validity: Permanent
              </p>
            </div>

            {/* Title Badge */}
            <div className="text-center space-y-1">
              <div className="inline-block bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full border border-orange-300">
                FORM NO. 10BE • CERTIFICATE OF DONATION
              </div>
              <p className="text-[11px] text-gray-500 font-mono">
                Issued under Rule 18AB of the Income-tax Rules, 1962 for Financial Year {financialYear}
              </p>
            </div>

            {/* Donor & Donation Data Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Donor Particulars
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Donor Name:</span>
                    <strong className="text-gray-900 font-bold">{donorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">PAN / Tax ID:</span>
                    <strong className="font-mono text-gray-900">{donorPan}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax Exemption:</span>
                    <span className="text-emerald-700 font-bold">50% Deduction u/s 80G(5)(vi)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Contribution Particulars
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Certificate No:</span>
                    <strong className="font-mono text-gray-900">{receiptNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date Received:</span>
                    <strong className="text-gray-900">{date}</strong>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Amount Donated:</span>
                    <strong className="text-base font-black text-orange-600 font-mono">
                      {currency || '₹'}{(amount ?? 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Hash & Verification QR Area */}
            <div className="bg-zinc-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-200">Cryptographic Verification Hash</span>
                </div>
                <div className="font-mono text-[11px] text-orange-400 break-all bg-black/40 px-2.5 py-1 rounded border border-zinc-800">
                  {uniqueCertHash}
                </div>
                <p className="text-[10px] text-zinc-400">
                  Directly verifiable via NITI Aayog Darpan & Income Tax E-filing portal
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-zinc-700 flex-shrink-0 flex flex-col items-center">
                <QrCode className="w-16 h-16 text-zinc-950" />
                <span className="text-[8px] font-mono text-zinc-600 font-bold uppercase tracking-tighter mt-1">
                  SCAN TO VERIFY
                </span>
              </div>
            </div>

            {/* Signature & Seal Block */}
            <div className="border-t border-gray-200 pt-5 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <div className="w-14 h-14 rounded-full border-2 border-orange-600/30 flex items-center justify-center text-[8px] font-bold text-orange-800 text-center uppercase p-1">
                  Official Seal Helps NGO
                </div>
                <p className="text-[10px] text-gray-500">Helps NGO National Secretariat</p>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-serif italic text-base font-bold text-gray-800">
                  Amarjeet Kumar
                </div>
                <div className="h-0.5 w-32 bg-gray-400 ml-auto"></div>
                <p className="font-black text-gray-900 text-xs">Amarjeet Kumar</p>
                <p className="text-[10px] text-gray-500">Founder & National Managing Director (Authorized Signatory)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Eligible for 50% tax deduction under Indian IT Act Section 80G</span>
          </div>
          <button
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
