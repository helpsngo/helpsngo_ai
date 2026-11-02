import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Settings, 
  Check, 
  X, 
  ChevronRight, 
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';

interface DpdpConsentBannerProps {
  onOpenLegalPolicies?: (policyId?: string) => void;
  onOpenRightsCenter?: () => void;
}

interface ConsentPreferences {
  essential: boolean; // Always true (Session, RBAC, 10-min timeout, CSRF)
  functional: boolean; // Language selection, Dark/Light mode theme
  communications: boolean; // WhatsApp instant receipt & quarterly impact digest
  analytics: boolean; // Anonymous portal visit telemetry
  timestamp: string;
}

const STORAGE_DPDP_CONSENT_KEY = 'helps_ngo_dpdp_consent_v1';

export const DpdpConsentBanner: React.FC<DpdpConsentBannerProps> = ({
  onOpenLegalPolicies,
  onOpenRightsCenter
}) => {
  const [hasConsented, setHasConsented] = useState<boolean>(true); // Default true until checked
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [prefs, setPrefs] = useState<ConsentPreferences>({
    essential: true,
    functional: true,
    communications: true,
    analytics: false,
    timestamp: ''
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_DPDP_CONSENT_KEY);
      if (!stored) {
        setHasConsented(false);
      } else {
        const parsed = JSON.parse(stored);
        setPrefs(parsed);
      }
    } catch {
      setHasConsented(false);
    }
  }, []);

  const saveConsent = (updated: ConsentPreferences) => {
    const finalPrefs = { ...updated, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_DPDP_CONSENT_KEY, JSON.stringify(finalPrefs));
    } catch {
      // safe fallback
    }
    setPrefs(finalPrefs);
    setHasConsented(true);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      communications: true,
      analytics: true,
      timestamp: ''
    });
  };

  const handleEssentialOnly = () => {
    saveConsent({
      essential: true,
      functional: false,
      communications: false,
      analytics: false,
      timestamp: ''
    });
  };

  if (hasConsented) return null;

  return (
    <aside 
      aria-label="Digital Personal Data Protection Act (DPDP Act 2023) Statutory Notice"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 animate-slideUp pointer-events-auto"
    >
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-emerald-500" />

        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-600/60 text-emerald-300 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    DPDP Act 2023 Statutory Notice
                  </span>
                  <span className="text-[10px] text-slate-400">Section 5 & 6 Compliant</span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                  Your Privacy & Data Protection Rights with HELPS Welfare Society
                </h3>
              </div>
            </div>

            <button
              onClick={handleEssentialOnly}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              title="Decline Non-Essential"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with the <strong>Digital Personal Data Protection Act, 2023 (Govt. of India)</strong>, we collect minimal personal data solely for non-profit purposes: processing Section 80G tax certificates, volunteer field dispatch coordination, and safeguarding minor beneficiaries. We never sell or share data with telemarketers.
          </p>

          {/* Customization Drawer */}
          {showCustomize && (
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Granular Processing Choices
                </span>
                <span className="text-[10px] text-slate-400">Withdraw Anytime in Settings</span>
              </div>

              {/* 1. Essential */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>1. Essential Security & RBAC</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">Mandatory</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Session auth, role verification, 10-minute inactivity security timeout.</p>
                </div>
                <input type="checkbox" checked disabled className="accent-emerald-500 rounded" />
              </div>

              {/* 2. Functional */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-bold text-white">2. Functional Preferences</div>
                  <p className="text-[10px] text-slate-400">Preserves language choice (EN/HI/PA) and light/dark theme preference.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={prefs.functional} 
                  onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                  className="accent-emerald-500 rounded cursor-pointer" 
                />
              </div>

              {/* 3. Communications */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-bold text-white">3. WhatsApp & Email Service Notifications</div>
                  <p className="text-[10px] text-slate-400">Delivery of 80G tax receipt PDFs and quarterly beneficiary impact updates.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={prefs.communications} 
                  onChange={(e) => setPrefs({ ...prefs, communications: e.target.checked })}
                  className="accent-emerald-500 rounded cursor-pointer" 
                />
              </div>
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              {onOpenLegalPolicies && (
                <button
                  type="button"
                  onClick={() => onOpenLegalPolicies('privacy-policy')}
                  className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Statutory Privacy Policy</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
              {onOpenRightsCenter && (
                <button
                  type="button"
                  onClick={onOpenRightsCenter}
                  className="text-slate-300 hover:underline cursor-pointer"
                >
                  Exercise DPDP Rights (Sec 11-14) →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowCustomize(!showCustomize)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-none"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showCustomize ? 'Hide Choices' : 'Preferences'}</span>
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex-1 sm:flex-none"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer flex-1 sm:flex-none"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default DpdpConsentBanner;
