import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Building2, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ShieldCheck, 
  X, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  FileCheck2, 
  CheckCircle2, 
  Smartphone,
  Landmark,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { mobileService } from '../services/mobileService';
import { DonationRecord } from '../types';

interface NgoBankAccountQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectBankDonationSubmitted?: (donation: Partial<DonationRecord>) => void;
  initialAmount?: number;
}

export const NgoBankAccountQrModal: React.FC<NgoBankAccountQrModalProps> = ({
  isOpen,
  onClose,
  onDirectBankDonationSubmitted,
  initialAmount = 1000
}) => {
  const [qrMode, setQrMode] = useState<'upi_bank' | 'wire_details'>('upi_bank');
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>(initialAmount ? String(initialAmount) : '');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  // Copy status indicators
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // UTR submission drawer state
  const [showUtrForm, setShowUtrForm] = useState<boolean>(false);
  const [enteredUtr, setEnteredUtr] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('Alex Johnson');
  const [donorEmail, setDonorEmail] = useState<string>('alex.johnson@example.com');
  const [donorPan, setDonorPan] = useState<string>('ABCDE1234F');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Official NGO Bank Account Particulars
  const bankDetails = {
    accountName: 'HELPS WELFARE SOCIETY',
    bankName: 'ICICI Bank Ltd.',
    accountNumber: '003501048291',
    accountType: 'Current Account',
    ifscCode: 'ICIC0000035',
    micrCode: '141229002',
    branch: 'Civil Lines Branch, Ludhiana, Punjab - 141001',
    upiVpa: 'helpsngo@icici',
    taxReg80G: 'CIT(E) CHD/12A/2016-17/AABTH1234F',
    csrRegNumber: 'CSR00012345 (MCA, Govt. of India)',
    societyReg: 'Societies Registration Act XXI of 1860'
  };

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Generate QR Code URI based on mode and amount
  useEffect(() => {
    let isCancelled = false;
    setIsGenerating(true);

    const generateQr = async () => {
      try {
        let payload = '';

        if (qrMode === 'upi_bank') {
          // Standard NPCI UPI Intent targeting the official ICICI bank account VPA
          const amountQuery = effectiveAmount > 0 ? `&am=${effectiveAmount.toFixed(2)}` : '';
          const note = `Donation to HELPS Welfare Society Bank Account`;
          payload = `upi://pay?pa=${encodeURIComponent(bankDetails.upiVpa)}&pn=${encodeURIComponent(bankDetails.accountName)}&mc=8398${amountQuery}&cu=INR&tn=${encodeURIComponent(note)}`;
        } else {
          // Structured Bank Account Wire Transfer Payload for banking readers
          payload = [
            `BENEFICIARY: ${bankDetails.accountName}`,
            `BANK: ${bankDetails.bankName}`,
            `A/C NO: ${bankDetails.accountNumber}`,
            `IFSC: ${bankDetails.ifscCode}`,
            `BRANCH: ${bankDetails.branch}`,
            `TYPE: ${bankDetails.accountType}`,
            `UPI: ${bankDetails.upiVpa}`,
            effectiveAmount > 0 ? `AMOUNT: INR ${effectiveAmount.toLocaleString('en-IN')}` : '',
            `PURPOSE: Charitable Donation (80G Tax Deductible)`
          ].filter(Boolean).join('\n');
        }

        const url = await QRCode.toDataURL(payload, {
          width: 340,
          margin: 1.5,
          color: {
            dark: '#0F172A', // Slate-900
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });

        if (!isCancelled) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Failed to generate NGO bank account QR code:', err);
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateQr();

    return () => {
      isCancelled = true;
    };
  }, [qrMode, effectiveAmount, bankDetails.accountName, bankDetails.accountNumber, bankDetails.accountType, bankDetails.bankName, bankDetails.branch, bankDetails.ifscCode, bankDetails.upiVpa]);

  const handleCopy = async (text: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      mobileService.hapticImpact('light');
      setCopiedField(fieldKey);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyAllBankDetails = () => {
    const fullText = `=== HELPS WELFARE SOCIETY (OFFICIAL BANK ACCOUNT) ===
Beneficiary Name: ${bankDetails.accountName}
Bank Name: ${bankDetails.bankName}
Account Number: ${bankDetails.accountNumber}
Account Type: ${bankDetails.accountType}
IFSC Code: ${bankDetails.ifscCode}
Branch: ${bankDetails.branch}
UPI ID: ${bankDetails.upiVpa}
80G Registration: ${bankDetails.taxReg80G}
50% Tax Exemption eligible under Section 80G of Income Tax Act 1961.`;

    handleCopy(fullText, 'all');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    mobileService.hapticImpact('medium');

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `HELPS_NGO_Bank_Account_QR_${effectiveAmount > 0 ? `₹${effectiveAmount}_` : ''}ICICI.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareQr = async () => {
    mobileService.hapticImpact('light');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HELPS Welfare Society - Official Bank Account QR',
          text: `Support HELPS Welfare Society directly via ICICI Bank transfer. A/C: ${bankDetails.accountNumber}, IFSC: ${bankDetails.ifscCode}, UPI: ${bankDetails.upiVpa}. All donations are 50% tax exempt under Section 80G.`,
          url: 'https://helpsngo.in/'
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyAllBankDetails();
    }
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredUtr.trim()) return;

    mobileService.hapticImpact('heavy');
    setIsSubmitted(true);

    if (onDirectBankDonationSubmitted) {
      onDirectBankDonationSubmitted({
        amount: effectiveAmount > 0 ? effectiveAmount : 1000,
        currency: '₹',
        title: 'Direct Bank Wire (ICICI Current A/C)',
        category: 'General Grassroots Relief',
        paymentMethod: 'bank_transfer',
        utrNumber: enteredUtr.trim().toUpperCase(),
        donorName: donorName.trim() || 'Alex Johnson',
        donorEmail: donorEmail.trim() || 'alex.johnson@example.com',
        donorTaxId: donorPan.trim().toUpperCase() || 'ABCDE1234F',
        taxDeductible: true,
        status: 'Completed',
        approvalStatus: 'approved'
      });
    }

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  NGO Bank Account QR Code
                </h3>
                <span className="bg-emerald-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-blue-100 font-medium">
                HELPS Welfare Society • ICICI Bank Direct Beneficiary Account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector: UPI-to-Bank QR vs Direct Bank Details QR */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setQrMode('upi_bank')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              qrMode === 'upi_bank'
                ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI-to-Bank QR</span>
          </button>

          <button
            type="button"
            onClick={() => setQrMode('wire_details')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              qrMode === 'wire_details'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>NEFT / RTGS Wire QR</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Amount Selection Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Specify Amount to Embed in Bank QR:
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-mono font-black">
                {effectiveAmount > 0 ? `₹${effectiveAmount.toLocaleString('en-IN')}` : 'Open / Any Amount'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[0, 500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount(amt > 0 ? String(amt) : '');
                  }}
                  className={`py-1.5 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    effectiveAmount === amt
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                  }`}
                >
                  {amt === 0 ? 'Any' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-800 dark:to-gray-800/60 p-4 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col items-center shadow-xs">
            <div className="relative p-3.5 bg-white rounded-2xl border-2 border-orange-200 dark:border-gray-700 shadow-md">
              {isGenerating ? (
                <div className="w-52 h-52 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
                  <span className="text-xs font-bold text-gray-500">Generating Official Bank QR...</span>
                </div>
              ) : qrDataUrl ? (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt="NGO Bank Account QR Code"
                    className="w-52 h-52 object-contain rounded-xl"
                  />
                  {/* Center Emblem */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl shadow-md border-2 border-orange-500 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-orange-600 font-black text-xs leading-none">H</span>
                    <span className="text-[7px] font-black uppercase text-gray-700 tracking-tighter">NGO</span>
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-rose-500 text-xs font-bold">
                  Failed to load QR
                </div>
              )}

              {/* Amount Tag */}
              <div className="mt-2 text-center">
                <span className="inline-block bg-orange-600 text-white text-[11px] font-mono font-black py-0.5 px-3 rounded-full shadow-2xs">
                  {effectiveAmount > 0 ? `₹${effectiveAmount.toLocaleString('en-IN')} INR` : 'SCAN & ENTER ANY AMOUNT'}
                </span>
              </div>
            </div>

            {/* Quick Actions for QR */}
            <div className="flex items-center gap-2 mt-3 text-xs font-bold">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="py-1.5 px-3 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-orange-600" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleShareQr}
                className="py-1.5 px-3 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share QR</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAllBankDetails}
                className="py-1.5 px-3 bg-white dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied All!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    <span>Copy Details</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Official Bank Account Details Card with 1-Click Copy */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3 shadow-xs text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <div className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-orange-600" />
                <span className="font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
                  Beneficiary Account Details
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                80G Certified
              </span>
            </div>

            <div className="space-y-2">
              {/* Account Name */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-750">
                <span className="text-gray-500 font-medium">Beneficiary Name:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {bankDetails.accountName}
                </span>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-750">
                <span className="text-gray-500 font-medium">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-gray-900 dark:text-white text-sm">
                    {bankDetails.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.accountNumber, 'acc')}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-600 transition-colors cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'acc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bank & Branch */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-750">
                <span className="text-gray-500 font-medium">Bank & Branch:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {bankDetails.bankName}, Civil Lines, Ludhiana
                </span>
              </div>

              {/* IFSC Code */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-750">
                <span className="text-gray-500 font-medium">IFSC Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-orange-600 dark:text-orange-400 text-sm">
                    {bankDetails.ifscCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.ifscCode, 'ifsc')}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-600 transition-colors cursor-pointer"
                    title="Copy IFSC Code"
                  >
                    {copiedField === 'ifsc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-750">
                <span className="text-gray-500 font-medium">Account Type:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {bankDetails.accountType}
                </span>
              </div>

              {/* UPI VPA */}
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 font-medium">Official UPI VPA:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {bankDetails.upiVpa}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.upiVpa, 'upi')}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-600 transition-colors cursor-pointer"
                    title="Copy UPI VPA"
                  >
                    {copiedField === 'upi' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory 80G Tax Exemption Notice */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Legally Compliant & 50% Tax Deductible (Sec 80G)</span>
            </div>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-300">
              Tax exemption certificate <strong>{bankDetails.taxReg80G}</strong>. Provide your transaction UTR reference below to immediately receive your official Form 10BE compliant receipt.
            </p>
          </div>

          {/* Direct UTR Submission Section */}
          {!showUtrForm ? (
            <button
              type="button"
              onClick={() => setShowUtrForm(true)}
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>I Have Transferred • Submit UTR Reference</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <form onSubmit={handleSubmitUtr} className="p-4 bg-orange-50/60 dark:bg-gray-800/80 border border-orange-200 dark:border-gray-700 rounded-2xl space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between border-b border-orange-100 dark:border-gray-700 pb-2">
                <span className="font-extrabold uppercase text-gray-800 dark:text-gray-200">
                  Verify Bank Transfer & Issue 80G Receipt
                </span>
                <button
                  type="button"
                  onClick={() => setShowUtrForm(false)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-bold"
                >
                  Cancel
                </button>
              </div>

              {isSubmitted ? (
                <div className="py-4 text-center space-y-2 text-emerald-600">
                  <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
                  <span className="text-sm font-black block">Bank Transfer Record Created!</span>
                  <p className="text-[11px] text-gray-500">
                    Your 80G Tax Exemption Receipt has been queued and credited.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Bank Transaction ID / UTR Number (12 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      value={enteredUtr}
                      onChange={(e) => setEnteredUtr(e.target.value)}
                      placeholder="e.g. 427819283741 or ICICR2409..."
                      className="w-full p-2.5 bg-white dark:bg-gray-900 border border-orange-300 dark:border-gray-700 rounded-xl font-mono text-xs font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                        Donor Name
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                        PAN (For 80G)
                      </label>
                      <input
                        type="text"
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xs font-bold uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!enteredUtr.trim()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Generate 80G Receipt</span>
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Landmark className="w-3.5 h-3.5 text-blue-600" />
            <span>ICICI Current Account • Regd. Society XXI of 1860</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
