import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DynamicUpiQrCodeProps {
  amount: number;
  projectTitle: string;
  projectCategory?: string;
  donorName?: string;
  donorEmail?: string;
  isMonthly?: boolean;
  onPaymentConfirmed: (utrNumber?: string) => void;
  isProcessing?: boolean;
}

export const DynamicUpiQrCode: React.FC<DynamicUpiQrCodeProps> = ({
  amount,
  projectTitle,
  projectCategory = 'General',
  donorName = '',
  donorEmail = '',
  isMonthly = false,
  onPaymentConfirmed,
  isProcessing = false
}) => {
  const { isDark } = useTheme();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<string>('gpay');
  const [showUtrHelper, setShowUtrHelper] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5-minute dynamic session

  // Official NGO UPI VPA and Organization details
  const upiVpa = 'helpsngo@icici';
  const orgName = 'Helps NGO India';
  const merchantCategoryCode = '8398'; // Charitable Organizations

  // Construct NPCI Standard UPI Intent URI
  // Example: upi://pay?pa=helpsngo@icici&pn=Helps%20NGO%20India&mc=8398&am=1000&cu=INR&tn=Donation%20for%20Rural%20Classrooms
  const sanitizedNote = `Donation ${isMonthly ? 'Monthly' : ''} for ${projectTitle.slice(0, 40)}`
    .replace(/[^\w\s-]/gi, '')
    .trim();
  
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(orgName)}&mc=${merchantCategoryCode}&am=${amount > 0 ? amount.toFixed(2) : '100.00'}&cu=INR&tn=${encodeURIComponent(sanitizedNote)}`;

  // Generate QR Code data URL dynamically when amount or project changes
  useEffect(() => {
    let isCancelled = false;
    setIsGenerating(true);

    const generateCode = async () => {
      try {
        const url = await QRCode.toDataURL(upiUri, {
          width: 320,
          margin: 1.5,
          color: {
            dark: '#0F172A', // Slate-900 high contrast
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });

        if (!isCancelled) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Failed to render dynamic UPI QR Code:', err);
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateCode();

    return () => {
      isCancelled = true;
    };
  }, [upiUri]);

  // Session timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiVpa);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `HelpsNGO_UPI_QR_₹${amount}_${projectTitle.replace(/\s+/g, '_').slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDirectUpiIntent = () => {
    window.location.href = upiUri;
  };

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '⚡', color: 'text-blue-600 dark:text-blue-400' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'text-purple-600 dark:text-purple-400' },
    { id: 'paytm', name: 'Paytm', icon: '🔷', color: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'cred', name: 'CRED UPI', icon: '💳', color: 'text-rose-600 dark:text-rose-400' },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/80 border-2 border-orange-200 dark:border-gray-700 rounded-[2rem] p-4 sm:p-5 shadow-xs space-y-4 animate-fadeIn transition-colors">
      {/* Header with 80G Certified Badge & Live Timer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                Dynamic UPI / QR Code
              </h3>
              <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase border border-emerald-200 dark:border-emerald-800">
                Live ₹ Amount
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              Scan with any Indian UPI App (Google Pay, PhonePe, Paytm, BHIM)
            </p>
          </div>
        </div>

        {/* Expiration Session Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-[10px] font-mono font-bold text-orange-700 dark:text-orange-400 shadow-2xs">
          <Clock className="w-3 h-3 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>QR Active: {formatTimer(secondsRemaining)}</span>
        </div>
      </div>

      {/* Main QR Presentation Box */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white dark:bg-gray-800/90 p-4 sm:p-5 rounded-2xl border border-orange-100 dark:border-gray-700 shadow-xs">
        {/* Dynamic QR Code Card */}
        <div className="relative group flex-shrink-0 flex flex-col items-center">
          <div className="relative p-3 bg-white rounded-2xl border-2 border-orange-200 dark:border-orange-500/40 shadow-md">
            {isGenerating ? (
              <div className="w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-orange-600 animate-spin" />
                <span className="text-[11px] font-bold text-gray-600">Generating UPI QR...</span>
              </div>
            ) : qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Code for ₹${amount} donation to ${projectTitle}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
                />
                
                {/* Center Helps NGO Emblem */}
                <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl shadow-md border-2 border-orange-500 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-orange-600 font-black text-xs leading-none">H</span>
                  <span className="text-[7px] font-black uppercase text-gray-700 tracking-tighter">NGO</span>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-rose-500 text-xs font-bold">
                Failed to render QR
              </div>
            )}

            {/* Dynamic Rupee Amount Overlay Tag */}
            <div className="mt-2 flex items-center justify-center gap-1.5 bg-orange-600 text-white py-1 px-3 rounded-xl font-mono font-black text-xs shadow-xs">
              <span>₹{(amount ?? 0).toLocaleString('en-IN')} INR</span>
              <span className="text-[9px] opacity-80 font-normal uppercase">
                {isMonthly ? '/ month' : 'One-time'}
              </span>
            </div>
          </div>

          {/* Download QR Code Button */}
          <button
            type="button"
            onClick={handleDownloadQr}
            className="mt-2 text-[10px] font-bold text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Download QR code image to print or share"
          >
            <Download className="w-3 h-3" />
            <span>Save QR Image</span>
          </button>
        </div>

        {/* QR Details & Payment Metadata */}
        <div className="flex-1 space-y-3 w-full">
          {/* Target Cause Name & Category */}
          <div className="bg-orange-50/60 dark:bg-gray-700/50 p-3 rounded-xl border border-orange-200/60 dark:border-gray-600 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
              <span>Target Project</span>
              <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-600">
                {projectCategory}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
              {projectTitle}
            </h4>
            <div className="text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Tax Benefit: 50% Statutory 80G Deduction</span>
            </div>
          </div>

          {/* Official Verified UPI ID with 1-Click Copy */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Official NGO UPI VPA ID
            </label>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/80 rounded-xl border border-gray-200 dark:border-gray-600 font-mono text-xs text-gray-900 dark:text-gray-100">
              <span className="font-extrabold text-orange-600 dark:text-orange-400 select-all">
                {upiVpa}
              </span>
              <button
                type="button"
                onClick={handleCopyUpiId}
                className="flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy VPA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick UPI App Icons / Deep-link buttons */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Supported Mobile Apps
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {upiApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setSelectedApp(app.id);
                    handleDirectUpiIntent();
                  }}
                  className="p-1.5 rounded-xl bg-gray-50 dark:bg-gray-700/60 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-0.5 transition-all text-center group cursor-pointer"
                  title={`Open ${app.name} with pre-filled ₹${amount}`}
                >
                  <span className="text-sm sm:text-base group-hover:scale-110 transition-transform">
                    {app.icon}
                  </span>
                  <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 truncate w-full">
                    {app.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile 1-Tap Launch Button */}
          <button
            type="button"
            id="open-upi-app-intent-btn"
            onClick={handleDirectUpiIntent}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open UPI App Directly (₹{(amount ?? 0).toLocaleString('en-IN')})</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Confirmation & Optional UTR Reconcile Step */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 border border-orange-100 dark:border-gray-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Step 2: Instant 80G Receipt Confirmation</span>
          </div>

          <button
            type="button"
            onClick={() => setShowUtrHelper(!showUtrHelper)}
            className="text-[10px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Where is UTR?</span>
          </button>
        </div>

        {showUtrHelper && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 space-y-1 animate-fadeIn">
            <p className="font-bold">How to find your UPI Ref / UTR No.:</p>
            <p>After completing payment in Google Pay, PhonePe, or Paytm, open transaction details. Look for the 12-digit number labelled <strong>"UPI Ref No"</strong>, <strong>"UTR"</strong>, or <strong>"Transaction ID"</strong>.</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="upi-utr-input" className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            UPI Transaction Ref / UTR Number (Optional for Instant 80G Reconciliation)
          </label>
          <div className="relative">
            <input
              type="text"
              id="upi-utr-input"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 16))}
              placeholder="e.g. 423819283719 (12-digit UTR)"
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
            />
            {utrNumber.length >= 10 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-bold uppercase">
                Valid Format ✓
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Button: "I Have Paid via QR" */}
        <button
          type="button"
          id="confirm-qr-payment-btn"
          disabled={isProcessing}
          onClick={() => onPaymentConfirmed(utrNumber)}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Generating Verified 80G Certificate...</span>
            </div>
          ) : (
            <>
              <span>I Have Completed Payment of ₹{(amount ?? 0).toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
