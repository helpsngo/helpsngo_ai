import React from 'react';
import { TabType, UserProfile } from '../types';
import { ArrowLeft, HeartHandshake, ShieldCheck, User, LogIn, Briefcase, Bell, MessageSquare } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { OfflineSyncBadge } from './OfflineSyncBadge';
import { useTranslation } from '../i18n/I18nContext';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onBack?: () => void;
  titleOverride?: string;
  subtitleOverride?: string;
  user?: UserProfile;
  onOpenAuth?: () => void;
  pendingApprovalsCount?: number;
  onOpenApprovals?: () => void;
  onOpenWorkAssignments?: () => void;
  pendingTasksCount?: number;
  onOpenWebhooks?: () => void;
  onOpenOfflineSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onBack,
  titleOverride,
  subtitleOverride,
  user,
  onOpenAuth,
  pendingApprovalsCount = 0,
  onOpenApprovals,
  onOpenWorkAssignments,
  pendingTasksCount = 0,
  onOpenWebhooks,
  onOpenOfflineSync
}) => {
  const { t } = useTranslation();
  const isGuest = !user || user.role === 'guest';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManagement = user?.role === 'management' || user?.role === 'program_manager';
  const isApplicant = user?.role === 'volunteer_applicant' || user?.volunteerApplicationStatus === 'pending_review';
  const isVolunteer = (user?.role === 'volunteer') && !isApplicant;
  const isInternalStaff = (isAdmin || isManagement || isVolunteer) && !isApplicant;

  if (currentTab === 'donate') {
    return (
      <header className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            id="header-back-btn"
            onClick={onBack || (() => onNavigate('home'))}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 active:scale-95 transition-all cursor-pointer border border-transparent dark:border-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">Helps NGO</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('common.verified_trust', '80G Verified')}</span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {titleOverride || t('donate.title', 'Donation Checkout (₹ INR)')}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('common.tax_free', '80G Tax Free')}</span>
          </div>
        </div>
      </header>
    );
  }

  if (currentTab === 'volunteer') {
    return (
      <header className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            id="volunteer-back-btn"
            onClick={onBack || (() => onNavigate('home'))}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 active:scale-95 transition-all cursor-pointer border border-transparent dark:border-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">{t('volunteer.join_movement', 'Join Community')}</div>
            <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {titleOverride || t('volunteer.title', 'Volunteer Portal')}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" />
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <User className="w-3 h-3" />
              <span>{isGuest ? t('common.sign_in', 'Sign In') : isAdmin ? 'Admin' : isVolunteer ? 'Volunteer' : 'Donor'}</span>
            </button>
          )}
          <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>
        </div>
      </header>
    );
  }

  if (currentTab === 'profile') {
    return (
      <header className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs">
            H
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 block leading-tight">Helps NGO</span>
            <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {isGuest 
                ? 'Guest Community Hub' 
                : isAdmin 
                ? 'NGO Admin Portal' 
                : isManagement 
                ? 'Operations Dashboard' 
                : isVolunteer 
                ? 'Volunteer Dashboard' 
                : t('profile.impact_dashboard', 'Donor Impact Profile')}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" />
          {isAdmin && onOpenWebhooks && (
            <button
              onClick={onOpenWebhooks}
              className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
              title="Automated WhatsApp & Email Notifications"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}
          {onOpenAuth && (
            <button
              id="header-auth-btn"
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                isAdmin 
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                  : isManagement
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                  : isVolunteer
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  : !isGuest
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-200'
              }`}
            >
              {isGuest ? (
                <>
                  <LogIn className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  <span>{t('common.sign_in', 'Sign In')}</span>
                </>
              ) : (
                <>
                  <span>{isAdmin ? '🛡️ Admin' : isManagement ? '💼 Mgmt' : isVolunteer ? '🤝 Volunteer' : '👤 Donor'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>
    );
  }

  // Home & Projects
  return (
    <header className="px-4 py-2.5 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs">
          H
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase">
              Helps NGO
            </h1>
            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full uppercase border border-emerald-200 dark:border-emerald-800">
              80G
            </span>
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
            {subtitleOverride || 'Help Foundation'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Offline Village Sync Badge */}
        {onOpenOfflineSync && <OfflineSyncBadge onOpenSyncModal={onOpenOfflineSync} compact />}

        {/* Language Switcher */}
        <LanguageSelector variant="compact" />

        {/* WhatsApp & Email Webhooks Quick Hub (Admin Only) */}
        {isAdmin && onOpenWebhooks && (
          <button
            onClick={onOpenWebhooks}
            className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
            title="Automated WhatsApp & Email Notifications"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Internal Operations / Field Tasks Button (Internal Staff Only: Admin, Management, Volunteer) */}
        {isInternalStaff && onOpenWorkAssignments && (
          <button
            id="header-tasks-btn"
            onClick={onOpenWorkAssignments}
            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            title={isAdmin ? "All Field Operations & Task Assignments" : isManagement ? "Supervised Volunteer Tasks" : "My Assigned Tasks"}
          >
            <Briefcase className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            <span className="hidden sm:inline">{t('nav.tasks', 'Tasks')}</span>
            {pendingTasksCount > 0 && (
              <span className="bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {pendingTasksCount}
              </span>
            )}
          </button>
        )}

        {isAdmin && pendingApprovalsCount > 0 && onOpenApprovals && (
          <button
            onClick={onOpenApprovals}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse transition-all cursor-pointer"
            title={`${pendingApprovalsCount} 80G donations awaiting approval`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{pendingApprovalsCount}</span>
          </button>
        )}
        {onOpenAuth && (
          <button
            id="header-user-btn"
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              isAdmin
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                : isManagement
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                : isVolunteer
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : !isGuest
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
            }`}
            title={isGuest ? 'Sign in to your account' : `Account: ${user?.name}`}
          >
            {isGuest ? (
              <>
                <LogIn className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                <span className="hidden xs:inline">{t('common.sign_in', 'Sign In')}</span>
              </>
            ) : (
              <>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-3.5 h-3.5 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                <span className="max-w-[60px] truncate">{isAdmin ? 'Admin' : isManagement ? 'Mgmt' : isVolunteer ? 'Vol' : user?.name.split(' ')[0]}</span>
              </>
            )}
          </button>
        )}
        <button
          id="header-donate-cta-btn"
          onClick={() => onNavigate('donate')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
        >
          <span>{t('common.donate_inr', 'Donate ₹')}</span>
        </button>
      </div>
    </header>
  );
};
