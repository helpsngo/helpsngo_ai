import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, DollarSign, Globe, ExternalLink, Check, MessageSquare, Sun, Moon, Monitor, SunMedium, MoonStar, Eye } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../i18n/I18nContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { getStoredDonorPreferences, saveDonorPreferences } from '../services/webhookService';

interface SettingsModalProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onClose: () => void;
  onOpenWebhooks?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  onUpdateUser,
  onClose,
  onOpenWebhooks
}) => {
  const { t } = useTranslation();
  const { theme, actualTheme, isDark, setTheme, toggleTheme } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [taxId, setTaxId] = useState(user.taxId);
  const [currency, setCurrency] = useState(user.currency || '₹');
  const [donorPrefs, setDonorPrefs] = useState(() => getStoredDonorPreferences());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      phone,
      taxId,
      currency
    });
    saveDonorPreferences(donorPrefs);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-[2rem] max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10 transition-colors">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">Preferences</span>
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-gray-900 dark:text-white">
              Account & Display Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xs border border-gray-200 dark:border-gray-700 cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Global Theme & Field Contrast Toggle (High Readability for Field Workers) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 dark:from-gray-800/90 dark:to-gray-800/50 rounded-2xl p-4 border border-orange-200/80 dark:border-gray-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center text-white shadow-xs">
                  {isDark ? <MoonStar className="w-4 h-4" /> : <SunMedium className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                    Display & Field Theme
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    High-contrast for sunlight / eye-safe for night camps
                  </p>
                </div>
              </div>

              {/* Quick 1-Click Toggle Pill */}
              <button
                type="button"
                id="theme-quick-toggle-btn"
                onClick={toggleTheme}
                aria-label="Quick toggle dark/light mode"
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer bg-gray-200 dark:bg-orange-600"
              >
                <span
                  className={`${
                    isDark ? 'translate-x-6 bg-gray-950' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition-transform shadow-xs flex items-center justify-center`}
                >
                  {isDark ? (
                    <Moon className="w-2.5 h-2.5 text-orange-400" />
                  ) : (
                    <Sun className="w-2.5 h-2.5 text-amber-500" />
                  )}
                </span>
              </button>
            </div>

            {/* 3-Way Mode Selector: Sunlight Day, Low-Light Night, System Auto */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                id="theme-mode-light"
                onClick={() => setTheme('light')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 font-extrabold shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-100 dark:bg-gray-700 text-amber-600 dark:text-amber-400'}`}>
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-bold leading-tight">Sunlight</span>
                  <span className="text-[9px] opacity-75 font-normal">Day Mode</span>
                </div>
              </button>

              <button
                type="button"
                id="theme-mode-dark"
                onClick={() => setTheme('dark')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 dark:bg-slate-800 border-orange-500 text-orange-400 font-extrabold shadow-xs ring-2 ring-orange-500/20'
                    : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-bold leading-tight">Low Light</span>
                  <span className="text-[9px] opacity-75 font-normal">Night Vision</span>
                </div>
              </button>

              <button
                type="button"
                id="theme-mode-system"
                onClick={() => setTheme('system')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-orange-50 dark:bg-gray-800 border-orange-500 text-orange-700 dark:text-orange-400 font-extrabold shadow-xs ring-2 ring-orange-500/20'
                    : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${theme === 'system' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-bold leading-tight">System</span>
                  <span className="text-[9px] opacity-75 font-normal">Auto Sync</span>
                </div>
              </button>
            </div>

            {/* Readability Info Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-gray-800/90 border border-orange-200/50 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-300">
              <Eye className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <span>
                Current view: <strong className="text-gray-900 dark:text-white font-bold">{isDark ? '🌙 Dark Mode (Low Light / Eye-Safe)' : '☀️ Light Mode (Sunlight High Contrast)'}</strong>
              </span>
            </div>
          </div>

          {/* Multilingual Support (i18n) */}
          <div className="bg-orange-50/50 dark:bg-gray-800/40 rounded-2xl p-4 border border-orange-200/80 dark:border-gray-700 space-y-2.5">
            <LanguageSelector variant="modal_inline" />
          </div>

          {/* Automated Donor WhatsApp & Mail Notifications */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Automated Donor Webhooks</span>
              </h4>
              {onOpenWebhooks && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWebhooks();
                  }}
                  className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Advanced Hub</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-emerald-800/40 cursor-pointer shadow-2xs">
                <div>
                  <strong className="block text-gray-900 dark:text-gray-100 font-bold text-[11px]">Instant WhatsApp Thank You</strong>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Auto-sends verified receipt & Form 10BE link</span>
                </div>
                <input
                  type="checkbox"
                  checked={donorPrefs.whatsappThankYou}
                  onChange={(e) => setDonorPrefs({ ...donorPrefs, whatsappThankYou: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-emerald-800/40 cursor-pointer shadow-2xs">
                <div>
                  <strong className="block text-gray-900 dark:text-gray-100 font-bold text-[11px]">Quarterly Impact Milestone Updates</strong>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Telemetry & video updates on funded projects</span>
                </div>
                <input
                  type="checkbox"
                  checked={donorPrefs.whatsappQuarterlyMilestones}
                  onChange={(e) => setDonorPrefs({ ...donorPrefs, whatsappQuarterlyMilestones: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Personal Details</span>
            </h4>
            <div className="space-y-2.5">
              <div>
                <label className="text-gray-600 dark:text-gray-300 block mb-1 text-[11px] font-bold uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-300 block mb-1 text-[11px] font-bold uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-300 block mb-1 text-[11px] font-bold uppercase">WhatsApp Phone (For Instant Receipts)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-300 block mb-1 text-[11px] font-bold uppercase">Tax ID / PAN (For 80G Form 10BE)</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60 space-y-2.5">
            <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Display Currency</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { symbol: '$', label: 'USD ($)' },
                { symbol: '₹', label: 'INR (₹)' },
                { symbol: '€', label: 'EUR (€)' },
                { symbol: '£', label: 'GBP (£)' }
              ].map((c) => (
                <button
                  type="button"
                  key={c.symbol}
                  onClick={() => setCurrency(c.symbol)}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all text-xs cursor-pointer ${
                    currency === c.symbol
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                  }`}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* About Helps NGO Link */}
          <div>
            <a
              href="https://helpsngo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-orange-600 dark:text-orange-400 font-bold hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs">helpsngo.in Official Portal</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('common.save', 'Saved Changes!')}</span>
                </>
              ) : (
                <span>{t('common.save', 'Save Preferences')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


