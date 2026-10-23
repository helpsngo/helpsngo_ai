import React, { useState } from 'react';
import { 
  Medal, 
  Award, 
  Trophy, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Zap, 
  Heart, 
  HeartHandshake, 
  Coins, 
  Flame, 
  CheckCircle2, 
  Share2, 
  Lock, 
  ArrowRight, 
  X,
  TrendingUp,
  Download,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, DonationRecord, TabType } from '../types';
import { mobileService } from '../services/mobileService';

export interface VirtualMedal {
  id: string;
  title: string;
  subtitle: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ruby' | 'legendary';
  thresholdAmount: number;
  icon: React.ElementType;
  emoji: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  progressPct: number;
  perk: string;
  rarity: string;
  citation: string;
  badgeGradient: string;
  badgeBorder: string;
  badgeText: string;
  ringColor: string;
}

export const computeUserMedals = (user: UserProfile, donations: DonationRecord[] = []): VirtualMedal[] => {
  // Compute user donation metrics
  const userDonations = donations.filter(
    (d) => 
      (d.donorEmail?.toLowerCase() === user.email?.toLowerCase()) ||
      (!d.donorEmail && user.email === 'alex.johnson@example.com') ||
      user.role === 'admin'
  );

  const donationSum = userDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const effectiveTotal = Math.max(user.totalContribution || 0, donationSum);
  const hasMonthly = userDonations.some((d) => d.isMonthly);
  const donationCount = userDonations.length;
  const categoriesCount = new Set(userDonations.map((d) => d.category)).size;

  const medalConfigs: Array<{
    id: string;
    title: string;
    subtitle: string;
    tier: VirtualMedal['tier'];
    thresholdAmount: number;
    icon: React.ElementType;
    emoji: string;
    checkUnlocked: (amount: number) => boolean;
    currentVal: number;
    targetVal: number;
    perk: string;
    rarity: string;
    citation: string;
    badgeGradient: string;
    badgeBorder: string;
    badgeText: string;
    ringColor: string;
  }> = [
    {
      id: 'badge-first-donor',
      title: 'First Donor',
      subtitle: 'The Journey of a Thousand Smiles',
      tier: 'bronze',
      thresholdAmount: 500,
      icon: Heart,
      emoji: '🥉',
      checkUnlocked: (amt) => amt >= 500 || donationCount >= 1,
      currentVal: effectiveTotal,
      targetVal: 500,
      perk: 'Official Donor Badge & Direct 80G Tax Receipt Ledger',
      rarity: 'Common (All Generous Supporters)',
      citation: 'Conferred upon taking the pivotal first step in funding grassroots child education, free nutrition, and medical relief with HELPS Welfare Society.',
      badgeGradient: 'from-amber-700 via-amber-600 to-amber-800',
      badgeBorder: 'border-amber-500/60',
      badgeText: 'text-amber-100',
      ringColor: 'ring-amber-500/30'
    },
    {
      id: 'badge-monthly-hero',
      title: 'Monthly Hero',
      subtitle: 'Unbroken Lifeline of Hope',
      tier: 'silver',
      thresholdAmount: 1000,
      icon: Flame,
      emoji: '🌟',
      checkUnlocked: (amt) => (hasMonthly && amt >= 500) || amt >= 2000,
      currentVal: hasMonthly ? 1000 : effectiveTotal,
      targetVal: 1000,
      perk: 'Sustained Nutrition Dispatch Alerts & VIP Annual Impact Brief',
      rarity: 'Rare (Consistent Sustainer)',
      citation: 'Honoring unwavering monthly commitment ensuring underprivileged school children and rural families never face interrupted meals or schooling.',
      badgeGradient: 'from-slate-600 via-zinc-500 to-slate-700',
      badgeBorder: 'border-slate-400/60',
      badgeText: 'text-slate-100',
      ringColor: 'ring-slate-400/30'
    },
    {
      id: 'badge-community-pillar',
      title: 'Community Pillar',
      subtitle: 'Anchor of Grassroots Resilience',
      tier: 'silver',
      thresholdAmount: 2500,
      icon: ShieldCheck,
      emoji: '🥈',
      checkUnlocked: (amt) => amt >= 2500,
      currentVal: effectiveTotal,
      targetVal: 2500,
      perk: 'Digital Form 10BE Vault & Priority Field Dispatch Bulletins',
      rarity: 'Uncommon (Top 35% Benefactor)',
      citation: 'Recognizing steadfast community patrons who fund rural clean water borewells, school uniform sets, and emergency ration parcels across Ludhiana.',
      badgeGradient: 'from-sky-700 via-slate-600 to-blue-800',
      badgeBorder: 'border-sky-400/60',
      badgeText: 'text-sky-100',
      ringColor: 'ring-sky-400/30'
    },
    {
      id: 'badge-golden-guardian',
      title: 'Golden Guardian',
      subtitle: 'Beacon of Dignity & Service',
      tier: 'gold',
      thresholdAmount: 5000,
      icon: Award,
      emoji: '🥇',
      checkUnlocked: (amt) => amt >= 5000,
      currentVal: effectiveTotal,
      targetVal: 5000,
      perk: 'Signed Citation of Honor by Founder & Public Recognition Roll',
      rarity: 'Prestigious (Top 15% Donor)',
      citation: 'Awarded for extraordinary philanthropy directly underwriting free diagnostic health screening camps and full-term school supplies for slum children.',
      badgeGradient: 'from-amber-500 via-yellow-500 to-amber-600',
      badgeBorder: 'border-yellow-300',
      badgeText: 'text-yellow-950',
      ringColor: 'ring-yellow-400/50'
    },
    {
      id: 'badge-multi-cause',
      title: 'Compassion Polymath',
      subtitle: 'Holistic Grassroots Champion',
      tier: 'platinum',
      thresholdAmount: 7500,
      icon: Sparkles,
      emoji: '🌈',
      checkUnlocked: (amt) => (categoriesCount >= 3 && amt >= 2500) || amt >= 7500,
      currentVal: categoriesCount >= 3 ? 7500 : effectiveTotal,
      targetVal: 7500,
      perk: 'Cross-Disciplinary Impact Digest & Field Visiting Pass to AABHA Classrooms',
      rarity: 'Epic (Multi-Program Patron)',
      citation: 'Celebrates donors whose compassion touches multiple critical domains: education, child welfare, nutrition, clean water, and rural healthcare.',
      badgeGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
      badgeBorder: 'border-teal-300/80',
      badgeText: 'text-teal-50',
      ringColor: 'ring-teal-400/40'
    },
    {
      id: 'badge-diamond-champion',
      title: 'Diamond Champion',
      subtitle: 'Transformational Benefactor',
      tier: 'diamond',
      thresholdAmount: 10000,
      icon: Trophy,
      emoji: '💎',
      checkUnlocked: (amt) => amt >= 10000,
      currentVal: effectiveTotal,
      targetVal: 10000,
      perk: 'Permanent Honor Roll Rollcall & Annual Trustee Governance Briefing',
      rarity: 'Legendary (Top 5% Philanthropist)',
      citation: 'Conferred in recognition of leadership-tier philanthropy funding complete digital learning centers, high-capacity solar borewells, and major hospital food drives.',
      badgeGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      badgeBorder: 'border-cyan-200',
      badgeText: 'text-white',
      ringColor: 'ring-cyan-400/50'
    },
    {
      id: 'badge-grand-patron',
      title: 'Grand National Patron',
      subtitle: 'Architect of Social Transformation',
      tier: 'legendary',
      thresholdAmount: 25000,
      icon: Crown,
      emoji: '👑',
      checkUnlocked: (amt) => amt >= 25000,
      currentVal: effectiveTotal,
      targetVal: 25000,
      perk: 'Distinguished Trustee Medal, Bespoke Plaque & Ground Dedication Rights',
      rarity: 'Elite (National Philanthropic Circle)',
      citation: 'The highest honor of HELPS Welfare Society, celebrating donors whose profound generosity fundamentally alters the trajectory of vulnerable children and families across Punjab and India.',
      badgeGradient: 'from-purple-600 via-fuchsia-600 to-indigo-800',
      badgeBorder: 'border-purple-300',
      badgeText: 'text-white',
      ringColor: 'ring-fuchsia-400/50'
    }
  ];

  return medalConfigs.map((cfg) => {
    const isUnlocked = cfg.checkUnlocked(effectiveTotal);
    const progress = Math.min(100, Math.round((cfg.currentVal / cfg.targetVal) * 100));

    return {
      id: cfg.id,
      title: cfg.title,
      subtitle: cfg.subtitle,
      tier: cfg.tier,
      thresholdAmount: cfg.thresholdAmount,
      icon: cfg.icon,
      emoji: cfg.emoji,
      isUnlocked,
      unlockedAt: isUnlocked ? 'Verified Active Honor' : undefined,
      currentValue: cfg.currentVal,
      progressPct: progress,
      perk: cfg.perk,
      rarity: cfg.rarity,
      citation: cfg.citation,
      badgeGradient: cfg.badgeGradient,
      badgeBorder: cfg.badgeBorder,
      badgeText: cfg.badgeText,
      ringColor: cfg.ringColor
    };
  });
};

/**
 * Public Profile Card Badges Shelf
 * Displayed directly inside the User's Public Profile Card at the top of ProfileScreen.
 */
export const PublicProfileBadgesShelf: React.FC<{
  user: UserProfile;
  donations: DonationRecord[];
  onSelectMedal: (medal: VirtualMedal) => void;
  onViewAllBadges?: () => void;
}> = ({ user, donations, onSelectMedal, onViewAllBadges }) => {
  const medals = computeUserMedals(user, donations);
  const unlockedMedals = medals.filter((m) => m.isUnlocked);
  const nextMedal = medals.find((m) => !m.isUnlocked);

  return (
    <div className="w-full mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-800 text-left space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Medal className="w-4 h-4 text-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">
            Virtual Medals & Honors
          </span>
          <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black px-2 py-0.2 rounded-full border border-amber-200 dark:border-amber-800">
            {unlockedMedals.length} / {medals.length}
          </span>
        </div>

        {onViewAllBadges && (
          <button
            type="button"
            onClick={onViewAllBadges}
            className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Unlocked Badges Shelf */}
      <div className="flex flex-wrap items-center gap-2">
        {unlockedMedals.map((medal) => {
          const Icon = medal.icon;
          return (
            <button
              key={medal.id}
              type="button"
              onClick={() => {
                mobileService.hapticImpact('light');
                onSelectMedal(medal);
              }}
              className={`group px-2.5 py-1.5 rounded-2xl bg-gradient-to-r ${medal.badgeGradient} text-white shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 border ${medal.badgeBorder} cursor-pointer active:scale-95`}
              title={`Click to view ${medal.title} honor certificate`}
            >
              <span className="text-sm">{medal.emoji}</span>
              <div className="text-left">
                <span className="text-[11px] font-black leading-none block">
                  {medal.title}
                </span>
                <span className="text-[8px] opacity-80 uppercase tracking-tighter block">
                  {medal.tier}
                </span>
              </div>
            </button>
          );
        })}

        {/* Next Locked Medal Preview Pill */}
        {nextMedal && (
          <button
            type="button"
            onClick={() => {
              mobileService.hapticImpact('light');
              onSelectMedal(nextMedal);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-left cursor-pointer hover:border-orange-400 transition-colors"
            title={`Next Medal to unlock: ${nextMedal.title}`}
          >
            <Lock className="w-3 h-3 text-gray-400" />
            <div>
              <span className="text-[10px] font-bold block leading-none text-gray-700 dark:text-gray-300">
                Next: {nextMedal.title}
              </span>
              <span className="text-[8px] text-orange-600 dark:text-orange-400 font-mono font-bold block">
                ₹{(nextMedal.thresholdAmount - nextMedal.currentValue).toLocaleString('en-IN')} to unlock
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Dedicated Full Badges & Medals Section
 * Rendered in the main body of ProfileScreen.
 */
export const BadgesSystemSection: React.FC<{
  user: UserProfile;
  donations: DonationRecord[];
  onNavigate?: (tab: TabType) => void;
  onSelectMedal: (medal: VirtualMedal) => void;
}> = ({ user, donations, onNavigate, onSelectMedal }) => {
  const medals = computeUserMedals(user, donations);
  const unlockedCount = medals.filter((m) => m.isUnlocked).length;
  const completionPct = Math.round((unlockedCount / medals.length) * 100);

  return (
    <section 
      aria-label="Donor Badges & Virtual Medals"
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-5 sm:p-6 shadow-xs space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
            <Trophy className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                Giving Medals & Honors
              </h3>
              <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {unlockedCount} / {medals.length} Unlocked
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Virtual medals awarded automatically based on your cumulative contribution milestones
            </p>
          </div>
        </div>

        {/* Overall Completion Bar */}
        <div className="w-full sm:w-44 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-gray-500">Honors Portfolio</span>
            <span className="text-orange-600 font-mono">{completionPct}% Complete</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-700" 
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Virtual Medals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {medals.map((medal) => {
          const Icon = medal.icon;
          return (
            <div
              key={medal.id}
              onClick={() => {
                mobileService.hapticImpact('light');
                onSelectMedal(medal);
              }}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 group ${
                medal.isUnlocked
                  ? 'bg-gradient-to-br from-white via-orange-50/20 to-amber-50/40 dark:from-gray-800/90 dark:via-gray-800 dark:to-gray-850 border-amber-200/90 dark:border-amber-700/60 shadow-xs hover:border-amber-400 hover:shadow-md'
                  : 'bg-gray-50/70 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-75 hover:opacity-95'
              }`}
            >
              {/* Top Row: Medal Icon, Title, Tier Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 bg-gradient-to-br ${
                    medal.isUnlocked 
                      ? medal.badgeGradient 
                      : 'from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-800'
                  }`}>
                    {medal.isUnlocked ? (
                      <span className="text-2xl filter drop-shadow-xs">{medal.emoji}</span>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-200 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                        {medal.title}
                      </h4>
                      {medal.isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                      {medal.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                  medal.isUnlocked
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}>
                  {medal.tier}
                </span>
              </div>

              {/* Progress & Threshold Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-gray-500">
                    Threshold: ₹{medal.thresholdAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {medal.isUnlocked 
                      ? '✓ Unlocked' 
                      : `₹${(medal.currentValue || 0).toLocaleString('en-IN')} / ₹${medal.thresholdAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      medal.isUnlocked 
                        ? 'bg-emerald-500' 
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${medal.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Bottom Card Perks */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate max-w-[190px]">
                  🎁 {medal.perk}
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/**
 * Modal to display high-res virtual medal certificate & share options
 */
export const VirtualMedalDetailModal: React.FC<{
  medal: VirtualMedal | null;
  onClose: () => void;
  onDonateToUnlock?: () => void;
}> = ({ medal, onClose, onDonateToUnlock }) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!medal) return null;

  const handleShare = async () => {
    mobileService.hapticImpact('medium');
    const shareText = `I just earned the "${medal.title}" virtual medal with HELPS Welfare Society! Supporting grassroots education, healthcare, and nutrition relief.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `HELPS NGO Virtual Medal - ${medal.title}`,
          text: shareText,
          url: 'https://helpsngo.in/'
        });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} https://helpsngo.in/`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F97316', '#10B981', '#3B82F6']
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className={`px-5 py-5 bg-gradient-to-r ${medal.badgeGradient} text-white flex flex-col items-center justify-center relative shadow-md text-center`}>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Large Medal Emblem */}
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-lg mb-2">
            <span className="text-4xl filter drop-shadow-md">{medal.emoji}</span>
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest bg-white/25 px-3 py-0.5 rounded-full mb-1">
            {medal.tier} Medal • {medal.rarity}
          </span>
          <h3 className="text-xl font-black">{medal.title}</h3>
          <p className="text-xs text-white/90 font-medium">{medal.subtitle}</p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {medal.isUnlocked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-black uppercase text-gray-500 block">
                  Honor Status
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {medal.isUnlocked ? 'Earned & Verified in Public Profile' : 'In Progress (Not Yet Unlocked)'}
                </span>
              </div>
            </div>

            <span className="font-mono text-xs font-black text-orange-600 dark:text-orange-400">
              ₹{medal.thresholdAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Official Citation */}
          <div className="p-4 bg-orange-50/60 dark:bg-gray-800/60 rounded-2xl border border-orange-200/80 dark:border-gray-700 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 dark:text-orange-400 block">
              Official Citation of Honor
            </span>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "{medal.citation}"
            </p>
          </div>

          {/* Perks unlocked */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
              Exclusive Supporter Privileges
            </span>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 font-bold">
                {medal.perk}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {medal.isUnlocked ? (
              <>
                <button
                  type="button"
                  onClick={handleShare}
                  className="py-3 px-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[11px] tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied Link!' : 'Share Honor'}</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCelebrate}
                  className="py-3 px-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold uppercase text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Celebrate</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onDonateToUnlock) onDonateToUnlock();
                }}
                className="col-span-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black uppercase text-xs tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Contribute ₹{(medal.thresholdAmount - medal.currentValue).toLocaleString('en-IN')} to Unlock This Medal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-500">
          <span>HELPS Welfare Society Digital Honor Registry</span>
          <span className="font-mono text-gray-400">Regd. XXI of 1860</span>
        </div>
      </div>
    </div>
  );
};
