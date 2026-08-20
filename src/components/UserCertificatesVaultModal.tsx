import React, { useState, useMemo } from 'react';
import { IssuedCertificate, UserProfile } from '../types';
import { 
  getCertificatesForUser, 
  verifyCertificateDownloadSecurityRule,
  SecurityVerificationResult 
} from '../services/certificateService';
import { RBAC } from '../services/rbacService';
import { 
  X, 
  Award, 
  Download, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  HandHeart, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  LogIn, 
  Calendar, 
  FileCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface UserCertificatesVaultModalProps {
  user: UserProfile | null | undefined;
  onClose: () => void;
  onOpenAuth?: () => void;
  initialCertificateId?: string;
  onOpenAdminStudio?: () => void;
}

export const UserCertificatesVaultModal: React.FC<UserCertificatesVaultModalProps> = ({
  user,
  onClose,
  onOpenAuth,
  initialCertificateId,
  onOpenAdminStudio
}) => {
  const isGuest = !user || user.role === 'guest' || !user.role;
  const isAdmin = user && RBAC.isAdmin(user.role);

  // Retrieve authorized certificates for this user
  const userCertificates = useMemo(() => {
    return getCertificatesForUser(user);
  }, [user]);

  const [selectedCertId, setSelectedCertId] = useState<string>(() => {
    if (initialCertificateId) {
      const match = userCertificates.find(c => c.id === initialCertificateId || c.certificateNumber === initialCertificateId);
      if (match) return match.id;
    }
    return userCertificates.length > 0 ? userCertificates[0].id : '';
  });

  // Active certificate
  const activeCert = useMemo(() => {
    return userCertificates.find(c => c.id === selectedCertId) || userCertificates[0] || null;
  }, [userCertificates, selectedCertId]);

  // Secure Download Gatekeeper State
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState<boolean>(false);
  const [securityResult, setSecurityResult] = useState<SecurityVerificationResult | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleStartSecureDownload = () => {
    if (!activeCert) return;
    setIsVerifyingSecurity(true);

    // Run 6-step security verification rule
    const result = verifyCertificateDownloadSecurityRule(user, activeCert.id);
    setSecurityResult(result);

    if (result.allowed) {
      setIsDownloading(true);
      setTimeout(() => {
        setIsDownloading(false);
        window.print();
      }, 1200);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Helps NGO Official Certificate Vault
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  80G & NITI Aayog Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Private, cryptographically sealed honors and tax exemption credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onOpenAdminStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminStudio();
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <span>Admin Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="user-cert-modal-close-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Guest Lockout State */}
        {isGuest ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tight">
                Authentication Required for Certificate Access
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Certificates are <strong>private user-specific documents</strong> strictly bound to individual accounts (Management, Volunteers, and Donors). Guests cannot browse or download private credentials.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-200 dark:border-zinc-700 text-left text-xs max-w-md mx-auto space-y-2">
              <span className="font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider block text-[10px]">
                6-Step Verification Policy:
              </span>
              <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 text-[11px]">
                <span className="font-mono font-bold text-amber-600">1. Login</span>
                <span>→</span>
                <span className="font-mono font-bold text-amber-600">2. User ID</span>
                <span>→</span>
                <span className="font-mono font-bold text-amber-600">3. Role</span>
                <span>→</span>
                <span className="font-mono font-bold text-amber-600">4. Ownership</span>
                <span>→</span>
                <span className="font-mono font-bold text-amber-600">5. Verify</span>
                <span>→</span>
                <span className="font-mono font-bold text-emerald-600">6. Download</span>
              </div>
            </div>

            {onOpenAuth && (
              <button
                id="user-cert-login-btn"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Access My Certificates</span>
              </button>
            )}
          </div>
        ) : userCertificates.length === 0 ? (
          /* Logged-in user has no issued certificates yet */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-100">
                No Certificates Assigned Yet
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Certificates are issued exclusively by the <strong>Admin</strong> upon verified service hours, completed batch milestones, or 80G tax deductible donations.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-200 dark:border-zinc-700 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="font-bold text-gray-800 dark:text-zinc-200 text-[11px]">How to Receive Your Certificate:</div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 text-[11px]">
                <HandHeart className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>Complete volunteer shifts or finish assigned project batches</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Admin verifies deliverables and authorizes official credentials</span>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Certificate View & Canvas */
          <div className="p-4 sm:p-6 space-y-5">
            {/* Multiple Certificate Selector (if user has > 1) */}
            {userCertificates.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {userCertificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCertId(cert.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      cert.id === activeCert?.id
                        ? 'bg-amber-500 text-black border-amber-600 ring-2 ring-amber-400 shadow-xs'
                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:border-amber-300'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{cert.certificateNumber}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Official Certificate Visual Canvas */}
            {activeCert && (
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-4 border-amber-400/60 dark:border-amber-600/50 shadow-xl space-y-6 text-center overflow-hidden">
                {/* Background Guilloche Watermark Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Top Compliance Header */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-b-2 border-amber-200 dark:border-amber-800/60 pb-4 gap-2">
                  <div className="text-left">
                    <span className="text-[10px] font-black tracking-widest text-amber-700 dark:text-amber-400 uppercase block">
                      PUBLIC CHARITABLE TRUST
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tight">
                      HELPS NGO TRUST
                    </h2>
                  </div>

                  <div className="text-right text-[10px] text-gray-500 dark:text-zinc-400 space-y-0.5 font-mono">
                    <div>Reg: <strong>{activeCert.trustRegistrationNumber}</strong></div>
                    <div>NITI Aayog Darpan: <strong>{activeCert.nitiAayogDarpanId}</strong></div>
                    <div>80G Tax Ref: <strong>{activeCert.taxExemption80GNumber}</strong></div>
                  </div>
                </div>

                {/* Certificate Core Body */}
                <div className="relative z-10 space-y-3 max-w-xl mx-auto py-2">
                  <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] uppercase tracking-widest border border-amber-300 dark:border-amber-700 shadow-xs">
                    ★ OFFICIAL NATIONAL CREDENTIAL ★
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight uppercase">
                    {activeCert.title}
                  </h1>

                  <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold tracking-wide">
                    {activeCert.subtitle || 'Helps NGO Public Charitable Trust Official Honor'}
                  </p>

                  <div className="pt-3">
                    <span className="text-[11px] text-gray-500 dark:text-zinc-400 uppercase tracking-widest block font-medium">
                      Proudly Awarded To
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-amber-300 mt-1 border-b-2 border-amber-300 dark:border-amber-600 inline-block px-6 pb-1">
                      {activeCert.recipientName}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-serif italic max-w-lg mx-auto pt-2">
                    "{activeCert.citationText}"
                  </p>

                  {/* Operational Metric Badges */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {activeCert.hoursCredited && (
                      <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        ⚡ {activeCert.hoursCredited} Verified Service Hours
                      </span>
                    )}
                    {activeCert.donationAmount !== undefined && activeCert.donationAmount !== null && (
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        💰 ₹{(activeCert.donationAmount ?? 0).toLocaleString('en-IN')} Tax Exempt
                      </span>
                    )}
                    {activeCert.batchTitle && (
                      <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        📦 Batch Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Signature & QR Stamp */}
                <div className="relative z-10 pt-4 border-t-2 border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  {/* Left: Signatory */}
                  <div className="text-left space-y-0.5">
                    <div className="font-serif italic font-bold text-sm text-gray-900 dark:text-zinc-100">
                      {activeCert.signatoryName}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                      {activeCert.signatoryDesignation}
                    </div>
                    <div className="text-[9px] text-gray-400 font-mono">
                      Issued: {activeCert.issueDate} • ID: {activeCert.certificateNumber}
                    </div>
                  </div>

                  {/* Center: Gold Trust Seal */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-black flex flex-col items-center justify-center font-black text-[8px] uppercase tracking-tighter border-2 border-amber-200 shadow-md">
                    <span>★ OFFICIAL ★</span>
                    <span className="text-[7px]">GOVT TRUST</span>
                    <span>SEAL</span>
                  </div>

                  {/* Right: QR Code Security Hash */}
                  <div className="text-right flex items-center gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <QrCode className="w-7 h-7 text-gray-900 dark:text-zinc-100" />
                    <div className="text-left">
                      <div className="text-[9px] font-mono font-bold text-gray-900 dark:text-zinc-100">
                        {activeCert.qrCodeVerificationHash.substring(0, 16)}...
                      </div>
                      <div className="text-[8px] text-emerald-600 font-bold uppercase">
                        ✓ Tamper-Evident Stamped
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar with 6-Step Secure Download */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Certificate bound to: <strong>{user?.email}</strong></span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="user-cert-download-action-btn"
                  onClick={handleStartSecureDownload}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>{isDownloading ? 'Verifying & Printing...' : 'Download / Print Official PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6-Step Security Gatekeeper Verification Modal */}
        {isVerifyingSecurity && securityResult && (
          <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-zinc-800 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {securityResult.allowed ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  )}
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-zinc-100">
                    Security Authorization Pipeline
                  </h4>
                </div>
                <button
                  onClick={() => setIsVerifyingSecurity(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {securityResult.verificationChain.map((step) => (
                  <div 
                    key={step.step}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      step.passed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                        : 'bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {step.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{step.step}. {step.title}</div>
                      <div className="text-[10px] opacity-80">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {!securityResult.allowed && (
                <div className="p-3 bg-red-100 dark:bg-red-950 rounded-xl text-xs text-red-800 dark:text-red-300 font-medium">
                  <strong>Access Denied:</strong> {securityResult.denialReason}
                </div>
              )}

              {securityResult.allowed && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-mono text-[10px]">
                  <strong>Verified Token:</strong> {securityResult.downloadToken}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsVerifyingSecurity(false)}
                  className="px-4 py-2 bg-gray-900 dark:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
