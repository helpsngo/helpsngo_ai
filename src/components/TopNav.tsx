import React from 'react';
import { TabType, UserProfile } from '../types';
import { Home, Search, Heart, User, HeartHandshake, ShieldCheck, Briefcase, Award, LogIn } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

interface TopNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  user?: UserProfile;
}

export const TopNav: React.FC<TopNavProps> = ({ currentTab, onSelectTab, user }) => {
  const { t } = useTranslation();
  const isGuest = !user || user.role === 'guest';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManagement = user?.role === 'management' || user?.role === 'program_manager';
  const isVolunteer = user?.role === 'volunteer';
  const isDonor = user?.role === 'donor';

  const getProfileTabConfig = () => {
    if (isGuest) {
      return { label: t('common.sign_in', 'Sign In'), icon: LogIn };
    }
    if (isAdmin) {
      return { label: t('nav.admin_portal', 'Trustee Admin'), icon: ShieldCheck };
    }
    if (isManagement) {
      return { label: t('nav.mgmt_portal', 'Operations'), icon: Briefcase };
    }
    if (isVolunteer) {
      return { label: t('nav.volunteer_desk', 'Volunteer Desk'), icon: HeartHandshake };
    }
    if (isDonor) {
      return { label: t('nav.donor_portal', 'My Giving'), icon: Award };
    }
    return { label: t('nav.profile', 'My Profile'), icon: User };
  };

  const profileConfig = getProfileTabConfig();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t('nav.home', 'Home'), icon: Home },
    { id: 'projects', label: t('nav.projects', 'Programs'), icon: Search },
    { id: 'donate', label: t('nav.donate', 'Donate'), icon: Heart },
    { id: 'profile', label: profileConfig.label, icon: profileConfig.icon },
    { id: 'volunteer', label: t('nav.volunteer', 'Join Us'), icon: HeartHandshake },
  ];

  return (
    <nav
      id="top-navigation"
      aria-label="Main Navigation"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-3 sm:px-6 py-2.5 sticky top-0 z-40 w-full shadow-xs transition-colors duration-200"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-1 sm:gap-3 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const isDonate = tab.id === 'donate';

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDonate
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md scale-105 ring-2 ring-orange-500/30'
                      : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-xs'
                    : isDonate
                    ? 'bg-gradient-to-r from-orange-600/15 via-amber-500/20 to-orange-600/15 text-orange-700 dark:text-orange-300 border border-orange-300/60 dark:border-orange-700/60 hover:from-orange-600 hover:to-amber-600 hover:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[2]'
                  } ${isDonate ? (isActive ? 'text-white' : 'text-orange-600 dark:text-orange-400') : ''}`}
                />
                <span className="text-[11px] sm:text-xs tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
                {isDonate && (
                  <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    80G
                  </span>
                )}
              </button>
            );
        })}
      </div>
    </nav>
  );
};

