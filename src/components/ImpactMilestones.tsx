import React, { useState } from 'react';
import { UserProfile, DonationRecord, ImpactMilestone } from '../types';
import { 
  Trophy, 
  Award, 
  Medal, 
  Heart, 
  HandHeart, 
  Sparkles, 
  Flame, 
  Star, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Share2, 
  ArrowRight,
  Zap,
  Clock,
  Coins,
  X
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ImpactMilestonesProps {
  user: UserProfile;
  donations: DonationRecord[];
}

export const ImpactMilestones: React.FC<ImpactMilestonesProps> = ({
  user,
  donations
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'donation' | 'volunteer' | 'special'>('all');
  const [activeBadge, setActiveBadge] = useState<ImpactMilestone | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Filter donations strictly belonging to this user that are approved
  const userApprovedDonations = donations.filter(
    (d) => 
      d.approvalStatus === 'approved' && 
      (d.donorEmail?.toLowerCase() === user.email.toLowerCase() || (!d.donorEmail && user.email === 'alex.johnson@example.com'))
  );

  const approvedDonationTotal = userApprovedDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const effectiveTotalContribution = Math.max(user.totalContribution || 0, approvedDonationTotal);
  const effectiveVolunteerHours = user.volunteerHours || 0;

  // Derive unique categories user has contributed to in approved donations
  const uniqueCategories = new Set(userApprovedDonations.map((d) => d.category)).size;
  const hasMonthlyDonation = userApprovedDonations.some((d) => d.isMonthly);

  // Compute milestones dynamically based on user state
  const milestones: ImpactMilestone[] = [
    // Donation Milestones
    {
      id: 'don-500',
      title: 'First Spark',
      category: 'donation',
      description: 'Contribute ₹500 or more in approved donations to initiate grassroots aid.',
      targetValue: 500,
      unit: '₹',
      currentValue: effectiveTotalContribution,
      isUnlocked: effectiveTotalContribution >= 500,
      unlockedDate: effectiveTotalContribution >= 500 ? 'Verified Milestone' : undefined,
      iconName: 'Sparkles',
      tier: 'bronze',
      reward: 'Official Supporter Badge & First Impact Report'
    },
    {
      id: 'don-2500',
      title: 'Sustainer',
      category: 'donation',
      description: 'Reach ₹2,500 in approved funding for rural clean water & nutrition.',
      targetValue: 2500,
      unit: '₹',
      currentValue: effectiveTotalContribution,
      isUnlocked: effectiveTotalContribution >= 2500,
      unlockedDate: effectiveTotalContribution >= 2500 ? 'Verified Milestone' : undefined,
      iconName: 'Coins',
      tier: 'silver',
      reward: '80G Tax Exemption Digital Portfolio + Early Campaign Briefs'
    },
    {
      id: 'don-5000',
      title: 'Hero Patron',
      category: 'donation',
      description: 'Support high-priority initiatives with ₹5,000+ approved total giving.',
      targetValue: 5000,
      unit: '₹',
      currentValue: effectiveTotalContribution,
      isUnlocked: effectiveTotalContribution >= 5000,
      unlockedDate: effectiveTotalContribution >= 5000 ? 'Verified Milestone' : undefined,
      iconName: 'Medal',
      tier: 'gold',
      reward: 'Personalized Impact Certificate & Field Name Recognition'
    },
    {
      id: 'don-10000',
      title: 'Visionary Leader',
      category: 'donation',
      description: 'Pledge ₹10,000+ to sponsor complete village school classrooms.',
      targetValue: 10000,
      unit: '₹',
      currentValue: effectiveTotalContribution,
      isUnlocked: effectiveTotalContribution >= 10000,
      unlockedDate: effectiveTotalContribution >= 10000 ? 'Verified Milestone' : undefined,
      iconName: 'Trophy',
      tier: 'platinum',
      reward: 'Direct Quarterly Video Briefings with Field Directors'
    },
    {
      id: 'don-25000',
      title: 'Legend Benefactor',
      category: 'donation',
      description: 'Empower sustainable infrastructure with ₹25,000+ in lifetime donations.',
      targetValue: 25000,
      unit: '₹',
      currentValue: effectiveTotalContribution,
      isUnlocked: effectiveTotalContribution >= 25000,
      unlockedDate: effectiveTotalContribution >= 25000 ? 'Verified Milestone' : undefined,
      iconName: 'Star',
      tier: 'diamond',
      reward: 'Plaque Dedication at Helps NGO Rural Health Hub'
    },

    // Volunteer Hour Milestones
    {
      id: 'vol-5',
      title: 'Helping Hand',
      category: 'volunteer',
      description: 'Complete 5 hours of on-ground or remote volunteer activities.',
      targetValue: 5,
      unit: 'hrs',
      currentValue: effectiveVolunteerHours,
      isUnlocked: effectiveVolunteerHours >= 5,
      unlockedDate: effectiveVolunteerHours >= 5 ? 'Verified Hours' : undefined,
      iconName: 'HandHeart',
      tier: 'bronze',
      reward: 'Official Helps NGO Volunteer ID & Orientation Kit'
    },
    {
      id: 'vol-15',
      title: 'Ground Catalyst',
      category: 'volunteer',
      description: 'Contribute 15+ verified hours in field medical or food drives.',
      targetValue: 15,
      unit: 'hrs',
      currentValue: effectiveVolunteerHours,
      isUnlocked: effectiveVolunteerHours >= 15,
      unlockedDate: effectiveVolunteerHours >= 15 ? 'Verified Hours' : undefined,
      iconName: 'Zap',
      tier: 'silver',
      reward: 'Verified Service Hours Letter for Academic/Work Credits'
    },
    {
      id: 'vol-30',
      title: 'Community Pillar',
      category: 'volunteer',
      description: 'Dedicate 30 hours to mentoring, relief triage, or logistics.',
      targetValue: 30,
      unit: 'hrs',
      currentValue: effectiveVolunteerHours,
      isUnlocked: effectiveVolunteerHours >= 30,
      unlockedDate: effectiveVolunteerHours >= 30 ? 'Verified Hours' : undefined,
      iconName: 'Award',
      tier: 'gold',
      reward: 'Gold Tier Changemaker Certificate & Lead Volunteer Status'
    },
    {
      id: 'vol-50',
      title: 'Master Ambassador',
      category: 'volunteer',
      description: 'Achieve 50 hours of humanitarian service leadership.',
      targetValue: 50,
      unit: 'hrs',
      currentValue: effectiveVolunteerHours,
      isUnlocked: effectiveVolunteerHours >= 50,
      unlockedDate: effectiveVolunteerHours >= 50 ? 'Verified Leadership' : undefined,
      iconName: 'Flame',
      tier: 'platinum',
      reward: 'NGO Chapter Organizer Credentials & National Summit Pass'
    },

    // Special Milestones
    {
      id: 'spec-multi',
      title: 'Multi-Cause Champion',
      category: 'special',
      description: 'Support 3 or more distinct mission verticals with verified donations.',
      targetValue: 3,
      unit: 'causes',
      currentValue: uniqueCategories,
      isUnlocked: uniqueCategories >= 3,
      unlockedDate: uniqueCategories >= 3 ? 'Verified Multi-Cause' : undefined,
      iconName: 'ShieldCheck',
      tier: 'gold',
      reward: 'Omni-Impact Recognition Badge & Cross-Sector Briefings'
    },
    {
      id: 'spec-monthly',
      title: 'Monthly Life Saver',
      category: 'special',
      description: 'Set up an active recurring monthly pledge to provide steady relief.',
      targetValue: 1,
      unit: 'pledge',
      currentValue: hasMonthlyDonation ? 1 : 0,
      isUnlocked: hasMonthlyDonation,
      unlockedDate: hasMonthlyDonation ? 'Verified Monthly Patron' : undefined,
      iconName: 'Heart',
      tier: 'platinum',
      reward: 'Exclusive Monthly Ground Impact Dispatch & VIP Helpline'
    }
  ];

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const totalMilestones = milestones.length;
  const progressPercent = Math.round((unlockedCount / totalMilestones) * 100);

  // Find next milestone to unlock
  const nextMilestone = milestones.find((m) => !m.isUnlocked);

  const filteredMilestones = milestones.filter((m) => {
    if (selectedFilter === 'all') return true;
    return m.category === selectedFilter;
  });

  const getTierColors = (tier: ImpactMilestone['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-400',
        iconBg: 'bg-gray-200 text-gray-400',
        pill: 'bg-gray-200 text-gray-500'
      };
    }

    switch (tier) {
      case 'bronze':
        return {
          bg: 'bg-amber-50/70 hover:bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-900',
          iconBg: 'bg-amber-600 text-white shadow-xs',
          pill: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'silver':
        return {
          bg: 'bg-slate-50/90 hover:bg-slate-100/70',
          border: 'border-slate-300',
          text: 'text-slate-900',
          iconBg: 'bg-slate-600 text-white shadow-xs',
          pill: 'bg-slate-200 text-slate-800 border-slate-300'
        };
      case 'gold':
        return {
          bg: 'bg-orange-50/80 hover:bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-950',
          iconBg: 'bg-orange-600 text-white shadow-xs',
          pill: 'bg-orange-100 text-orange-800 border-orange-300'
        };
      case 'platinum':
        return {
          bg: 'bg-indigo-50/80 hover:bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-950',
          iconBg: 'bg-indigo-600 text-white shadow-xs',
          pill: 'bg-indigo-100 text-indigo-800 border-indigo-300'
        };
      case 'diamond':
        return {
          bg: 'bg-cyan-50/80 hover:bg-cyan-50',
          border: 'border-cyan-200',
          text: 'text-cyan-950',
          iconBg: 'bg-cyan-600 text-white shadow-xs',
          pill: 'bg-cyan-100 text-cyan-800 border-cyan-300'
        };
    }
  };

  const renderBadgeIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Medal':
        return <Medal className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'HandHeart':
        return <HandHeart className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Star':
        return <Star className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <section 
      id="personal-impact-milestones-section"
      className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-4"
    >
      {/* Header with unlocked counter pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Achievements
            </h3>
            <h2 className="text-sm font-black text-gray-900 tracking-tight">
              Personal Impact Milestones
            </h2>
          </div>
        </div>

        <span className="bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
          <span>{unlockedCount} of {totalMilestones} Unlocked</span>
        </span>
      </div>

      {/* Progress Bar & Next Target Callout */}
      <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-gray-700">Overall Milestone Progress</span>
          <span className="text-orange-600 font-extrabold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {nextMilestone && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-gray-600">
            <span className="flex items-center gap-1 font-medium">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>Next up: <strong>{nextMilestone.title}</strong></span>
            </span>
            <span className="font-mono text-[10px] text-gray-500 font-semibold">
              {nextMilestone.unit === '₹' 
                ? `₹${(nextMilestone?.currentValue ?? 0).toLocaleString('en-IN')}/₹${(nextMilestone?.targetValue ?? 0).toLocaleString('en-IN')}` 
                : `${nextMilestone?.currentValue ?? 0}/${nextMilestone?.targetValue ?? 0} ${nextMilestone.unit}`}
            </span>
          </div>
        )}
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'donation', label: 'Giving Goals' },
          { id: 'volunteer', label: 'Volunteer' },
          { id: 'special', label: 'Special' }
        ].map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              id={`filter-milestone-${tab.id}`}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filteredMilestones.map((m) => {
          const theme = getTierColors(m.tier, m.isUnlocked);
          return (
            <button
              key={m.id}
              id={`badge-card-${m.id}`}
              onClick={() => setActiveBadge(m)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative group overflow-hidden active:scale-98 ${theme.bg} ${theme.border} ${
                m.isUnlocked ? 'shadow-2xs' : 'opacity-70'
              }`}
            >
              {/* Top Badge Icon & Status */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${theme.iconBg}`}>
                  {renderBadgeIcon(m.iconName, 'w-4 h-4')}
                </div>

                {m.isUnlocked ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Title & Goal */}
              <div className="space-y-0.5">
                <h4 className={`text-xs font-black leading-tight ${theme.text}`}>
                  {m.title}
                </h4>
                <p className="text-[10px] text-gray-500 font-mono">
                  {m.unit === '₹' ? `₹${(m?.targetValue ?? 0).toLocaleString('en-IN')}` : `${m?.targetValue ?? 0} ${m.unit}`} Target
                </p>
              </div>

              {/* Progress mini indicator */}
              <div className="mt-2 pt-1 border-t border-gray-200/50 w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-gray-400">
                <span>{m.tier}</span>
                {m.isUnlocked ? (
                  <span className="text-emerald-600 font-bold">Earned</span>
                ) : (
                  <span>{Math.min(Math.round(((m?.currentValue ?? 0) / (m?.targetValue || 1)) * 100), 99)}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal Dialog */}
      {activeBadge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveBadge(null)}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-scaleUp relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-badge-detail-btn"
              onClick={() => setActiveBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors text-xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge Medallion Banner */}
            <div className="text-center pt-2 space-y-2">
              <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md ${
                activeBadge.isUnlocked ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {renderBadgeIcon(activeBadge.iconName, 'w-8 h-8')}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full inline-block">
                  {activeBadge.tier} Tier Milestone
                </span>
                <h3 className="text-base font-black text-gray-900 mt-1">
                  {activeBadge.title}
                </h3>
              </div>
            </div>

            {/* Description & Target */}
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-2 text-xs">
              <p className="text-gray-700 leading-relaxed font-medium">
                {activeBadge.description}
              </p>

              <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Requirement:</span>
                <span className="font-bold text-gray-900 font-mono">
                  {activeBadge.unit === '₹' ? `₹${(activeBadge?.targetValue ?? 0).toLocaleString('en-IN')} Donated` : `${activeBadge?.targetValue ?? 0} ${activeBadge.unit}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Your Progress:</span>
                <span className="font-bold text-orange-600 font-mono">
                  {activeBadge.unit === '₹' ? `₹${(activeBadge?.currentValue ?? 0).toLocaleString('en-IN')}` : `${activeBadge?.currentValue ?? 0} ${activeBadge.unit}`} ({Math.min(Math.round(((activeBadge?.currentValue ?? 0) / (activeBadge?.targetValue || 1)) * 100), 100)}%)
                </span>
              </div>
            </div>

            {/* Perks & Rewards Unlocked */}
            <div className="bg-orange-50/60 rounded-2xl p-3 border border-orange-200/70 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-800">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Unlocked Patron Perk</span>
              </div>
              <p className="text-xs text-orange-950 font-medium leading-snug">
                {activeBadge.reward}
              </p>
            </div>

            {/* Status Footer & Share */}
            <div className="pt-1 space-y-2">
              {activeBadge.isUnlocked ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowShareModal(true);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Achievement</span>
                  </button>
                  <button
                    onClick={() => setActiveBadge(null)}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Keep contributing to unlock this recognition badge</span>
                  </div>
                  <button
                    onClick={() => setActiveBadge(null)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Got It
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog for Milestones */}
      {activeBadge && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          content={{
            title: `Impact Milestone: ${activeBadge.title}`,
            text: `I just unlocked the "${activeBadge.title}" achievement with Helps NGO for ${activeBadge.description}!`,
            category: 'Personal Impact Milestone',
            metric: activeBadge.reward
          }}
        />
      )}
    </section>
  );
};
