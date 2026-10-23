import React, { useState } from 'react';
import { TabType, Mission, Project, ImpactStory, OrgStats, FieldDispatch, UserProfile, DonationRecord } from '../types';
import { INITIAL_ORG_STATS, INITIAL_FIELD_DISPATCHES, IMPACT_STORIES, INITIAL_DONATIONS } from '../data/mockData';
import { ImpactStoriesCarousel } from './ImpactStoriesCarousel';
import { NewsletterSection } from './NewsletterSection';
import { HomeImageCarousel } from './HomeImageCarousel';
import { GeospatialImpactMap } from './GeospatialImpactMap';
import { IoTWaterTelemetryWidget } from './IoTWaterTelemetryWidget';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { NarrativeJourneySection } from './NarrativeJourneySection';
import { GlobalImpactCounter } from './GlobalImpactCounter';
import { GrassrootsLiveTicker } from './GrassrootsLiveTicker';
import { GrassrootsRealityShowcase } from './GrassrootsRealityShowcase';
import { 
  HeartHandshake, 
  Utensils, 
  BookOpen, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Users,
  CheckCircle2,
  Calendar,
  Edit3,
  Plus,
  Sliders,
  Building2,
  FileCheck2,
  Compass,
  Radio,
  ArrowLeftRight
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onSelectProject: (project: Project) => void;
  onDonateToProject?: (project: Project) => void;
  projects: Project[];
  missions: Mission[];
  stories?: ImpactStory[];
  stats?: OrgStats;
  dispatches?: FieldDispatch[];
  user?: UserProfile;
  donations?: DonationRecord[];
  onOpenAdminStudio?: () => void;
  onEditProject?: (project: Project) => void;
  onEditStats?: () => void;
  onEditStory?: (story: ImpactStory) => void;
  onAddNewStory?: () => void;
  onOpenCorporateCSR?: () => void;
  onOpenTaxCert?: () => void;
  onOpenWebhooks?: () => void;
  onOpenAboutOrg?: () => void;
  onOpenLegalPolicies?: (policyId?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectProject,
  onDonateToProject,
  projects,
  missions,
  stories = IMPACT_STORIES,
  stats = INITIAL_ORG_STATS,
  dispatches = INITIAL_FIELD_DISPATCHES,
  user,
  donations = INITIAL_DONATIONS,
  onOpenAdminStudio,
  onEditProject,
  onEditStats,
  onEditStory,
  onAddNewStory,
  onOpenCorporateCSR,
  onOpenTaxCert,
  onOpenWebhooks,
  onOpenAboutOrg,
  onOpenLegalPolicies
}) => {
  const isAdmin = user?.role === 'admin';
  const isManagement = user?.role === 'management';
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'map' | 'iot' | 'before_after'>('map');

  return (
    <div className="pb-8 p-3 sm:p-4 space-y-3.5 animate-fadeIn">
      {/* Admin Quick Bar (Only shown for Admin role) */}
      {isAdmin && onOpenAdminStudio && (
        <div className="bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 text-white rounded-2xl p-3.5 shadow-sm border border-zinc-700 flex flex-wrap items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-white">
                  Administrator Studio (Full Control)
                </span>
                <span className="text-[9px] bg-purple-500/30 text-purple-300 font-mono px-1.5 py-0.2 rounded border border-purple-400/30">
                  Full Read & Write Access
                </span>
              </div>
              <p className="text-[10px] text-zinc-300">
                You can change all text, images, program targets, metrics & stories in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {onEditStats && (
              <button
                onClick={onEditStats}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-zinc-600 flex items-center gap-1 transition-colors"
                title="Edit Org Metrics"
              >
                <Edit3 className="w-3 h-3 text-purple-400" />
                <span>Edit Metrics</span>
              </button>
            )}
            <button
              id="open-admin-studio-top-btn"
              onClick={onOpenAdminStudio}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Content Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* Management Controlled Bar */}
      {isManagement && onOpenAdminStudio && (
        <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-blue-950 text-white rounded-2xl p-3.5 shadow-sm border border-blue-800 flex flex-wrap items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-white">
                  Management Desk (Controlled Write)
                </span>
                <span className="text-[9px] bg-blue-500/30 text-blue-300 font-mono px-1.5 py-0.2 rounded border border-blue-400/30">
                  Admin Approval Required
                </span>
              </div>
              <p className="text-[10px] text-zinc-300">
                Submit campaign updates and field dispatches for National Director approval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              id="open-mgmt-studio-btn"
              onClick={onOpenAdminStudio}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Drafts & Proposals</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Grassroots Reality Telemetry Ticker */}
      <GrassrootsLiveTicker 
        onNavigate={onNavigate} 
        onOpenAboutOrg={onOpenAboutOrg} 
      />

      {/* Image Sliding Carousel */}
      <HomeImageCarousel
        onNavigate={onNavigate}
        projects={projects}
        onDonateToProject={onDonateToProject}
      />

      {/* Bento Block 1: Main Mission Banner */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-md">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-44 h-44 border-4 border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-4 w-20 h-20 bg-orange-400/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-white border border-white/20">
              Our Mission
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-orange-200 tracking-wider">
                helpsngo.in
              </span>
              {isAdmin && onEditStats && (
                <button
                  type="button"
                  onClick={onEditStats}
                  className="bg-black/40 hover:bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1 transition-all"
                  title="Admin: Edit Hero Headline & Mission"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Headline</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              {stats.missionHeadline}
            </h1>
            <p className="text-orange-100/90 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed font-normal">
              {stats.missionDescription}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              id="hero-donate-now-btn"
              onClick={() => onNavigate('donate')}
              className="bg-white text-orange-700 hover:bg-orange-50 active:scale-95 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-programs-btn"
              onClick={() => onNavigate('projects')}
              className="bg-orange-800/60 hover:bg-orange-800/80 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border border-white/20 transition-all"
            >
              View Programs
            </button>
          </div>
        </div>
      </section>

      {/* Real-Time Global Impact Counter (Derived from donation history records) */}
      <GlobalImpactCounter
        donations={donations}
        onNavigate={onNavigate}
      />

      {/* Primary Narrative Journey: Who we are → What we do → Where we work → What changed → How you can participate */}
      <NarrativeJourneySection
        onNavigate={onNavigate}
        onSelectProject={onSelectProject}
        projects={projects}
        stats={stats}
        onOpenAboutOrg={onOpenAboutOrg}
        onOpenCorporateCSR={onOpenCorporateCSR}
        onOpenTaxCert={onOpenTaxCert}
        user={user}
      />

      {/* Ground Reality & 24-Hour Field Rhythm Showcase */}
      <GrassrootsRealityShowcase
        onNavigate={onNavigate}
        onSelectProject={onSelectProject}
        projects={projects}
      />

      {/* Bento Grid: 2-Column Impact Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
        {/* Bento Metric Tile 1: Children Educated */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-5 flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors relative group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Education
              </span>
              {isAdmin && onEditStats && (
                <button
                  onClick={onEditStats}
                  className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Admin: Edit stats"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {stats.childrenEducated}
            </h3>
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">
              Children Educated & Supported
            </p>
          </div>
        </div>

        {/* Bento Metric Tile 2: Meals Served (Green theme) */}
        <div className="bg-emerald-600 rounded-[2rem] p-5 flex flex-col justify-between text-white shadow-xs relative group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 bg-emerald-700/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Active Relief
              </span>
              {isAdmin && onEditStats && (
                <button
                  onClick={onEditStats}
                  className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
                  title="Admin: Edit meals served"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {stats.mealsServed}
            </h3>
            <p className="text-emerald-100 text-[11px] font-bold uppercase tracking-wider mt-0.5">
              Nutritious Meals Served
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid: 2-Column Mix (Community Volunteer Bento + Clean Water / Lives Touched) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Bento Volunteer Card (Dark Charcoal theme) */}
        <div className="bg-[#18181B] rounded-[2rem] p-5 flex flex-col justify-between text-white shadow-xs relative overflow-hidden">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-orange-500 font-black text-sm uppercase tracking-wider">
                Volunteer Squad
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">PAN-INDIA</span>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">
              Join {stats.volunteersActive} change-makers creating grassroots impact.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            {/* Avatar Stack */}
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-zinc-600 border-2 border-[#18181B] flex items-center justify-center text-[10px] font-bold">AJ</div>
              <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-[#18181B] flex items-center justify-center text-[10px] font-bold text-white">SK</div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-[#18181B] flex items-center justify-center text-[10px] font-bold text-white">RM</div>
              <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-[#18181B] flex items-center justify-center text-[9px] font-bold text-zinc-300">+</div>
            </div>

            <button
              id="home-volunteer-join-btn"
              onClick={() => onNavigate('volunteer')}
              className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Bento Clean Water / Lives Touched (Cyan/Indigo theme) */}
        <div className="bg-indigo-600 rounded-[2rem] p-5 text-white flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Ground Infrastructure
              </span>
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-extrabold">
                {stats.waterWellsInstalled} Clean Water Wells
              </div>
              <p className="text-indigo-100 text-xs">
                Across {stats.livesTouched} lives touched with direct solar filtration.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigate('projects')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider transition-all"
            >
              View Initiatives
            </button>
            {isAdmin && onEditStats && (
              <button
                onClick={onEditStats}
                className="text-[10px] text-indigo-200 hover:text-white font-bold uppercase tracking-wider"
              >
                Edit Wells
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bento Urgent Appeal Card */}
      {projects[0] && (
        <section className="bg-white border border-gray-200 rounded-[2rem] p-5 sm:p-6 shadow-xs relative">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-rose-600 font-bold uppercase text-[10px] tracking-widest">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>Urgent Appeal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                {projects[0].category}
              </span>
              {isAdmin && onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(projects[0])}
                  className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                  title="Admin: Edit this urgent campaign"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Campaign</span>
                </button>
              )}
            </div>
          </div>

          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
            {projects[0].title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {projects[0].description}
          </p>

          {/* Bento Progress Bar */}
          <div className="mt-3.5 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${projects[0].percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold mt-2">
            <span className="text-gray-900">
              ₹{(projects[0]?.raisedAmount ?? 0).toLocaleString('en-IN')} Raised ({projects[0]?.percentage ?? 0}%)
            </span>
            <span className="text-gray-400 font-mono text-[11px]">
              Target: ₹{(projects[0]?.targetAmount ?? 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="mt-4 flex gap-2.5">
            <button
              id="urgent-donate-btn"
              onClick={() => onNavigate('donate')}
              className="flex-1 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold py-2.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              Donate Now
            </button>
            <button
              id="urgent-details-btn"
              onClick={() => onSelectProject(projects[0])}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors"
            >
              Details
            </button>
          </div>
        </section>
      )}

      {/* Bento Missions Grid: 4 Core Pillars */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Mission Pillars
          </h2>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-bold text-orange-600 uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Programs <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Pillar 1: Education */}
          <div 
            onClick={() => {
              const p = projects.find(item => item.category === 'Education');
              if (p) onSelectProject(p);
              else onNavigate('projects');
            }}
            className="bg-white border border-gray-200 rounded-[1.8rem] p-4 flex flex-col justify-between hover:border-blue-300 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Education</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Schools & Kits</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-blue-600">
              <span>Explore</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Pillar 2: Healthcare */}
          <div 
            onClick={() => {
              const p = projects.find(item => item.category === 'Healthcare');
              if (p) onSelectProject(p);
              else onNavigate('projects');
            }}
            className="bg-white border border-gray-200 rounded-[1.8rem] p-4 flex flex-col justify-between hover:border-emerald-300 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Healthcare</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Mobile Clinics</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-emerald-600">
              <span>Explore</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Pillar 3: Hunger Relief */}
          <div 
            onClick={() => {
              const p = projects.find(item => item.category === 'Hunger');
              if (p) onSelectProject(p);
              else onNavigate('projects');
            }}
            className="bg-white border border-gray-200 rounded-[1.8rem] p-4 flex flex-col justify-between hover:border-amber-300 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Nutrition</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{stats.mealsServed} Meals</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-amber-600">
              <span>Ongoing</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Pillar 4: Clean Water */}
          <div 
            onClick={() => {
              const p = projects.find(item => item.category === 'Water');
              if (p) onSelectProject(p);
              else onNavigate('projects');
            }}
            className="bg-white border border-gray-200 rounded-[1.8rem] p-4 flex flex-col justify-between hover:border-cyan-300 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Clean Water</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{stats.waterWellsInstalled} Wells</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-cyan-600">
              <span>Explore</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Field Telemetry & GIS Command Center (Public Proof of Ground Reality) */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Ground Reality & IoT Telemetry
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-tight">
              Live Field Intelligence & Borewell Telemetry
            </h2>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-2xl border border-gray-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTelemetryTab('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTelemetryTab === 'map'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>GIS Map</span>
            </button>
            <button
              onClick={() => setActiveTelemetryTab('iot')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTelemetryTab === 'iot'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>IoT Telemetry</span>
            </button>
            <button
              onClick={() => setActiveTelemetryTab('before_after')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTelemetryTab === 'before_after'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Before & After</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display based on Tab */}
        {activeTelemetryTab === 'map' && (
          <GeospatialImpactMap
            onSelectProject={onSelectProject}
            onDonateClick={() => onNavigate('donate')}
          />
        )}
        {activeTelemetryTab === 'iot' && (
          <IoTWaterTelemetryWidget />
        )}
        {activeTelemetryTab === 'before_after' && (
          <BeforeAfterSlider />
        )}
      </section>

      {/* Admin Executive & Operations Suite (Visible ONLY to Admin after login) */}
      {isAdmin && (
        <div className="space-y-4 pt-2 border-t-2 border-dashed border-purple-200 dark:border-purple-900/60 my-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 dark:text-purple-300">
                Admin Executive & Statutory Telemetry Console
              </span>
            </div>
            <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-extrabold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
              Admin Exclusive Controls
            </span>
          </div>

          {/* Enterprise Feature 2: Corporate CSR & Section 80G Tax Exemption Hub Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Corporate CSR Co-Sponsorship */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white rounded-[2rem] p-5 sm:p-6 border border-zinc-700 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                    Form CSR-1 Certified
                  </span>
                  <Building2 className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  Corporate CSR & Institutional Co-Sponsorship Suite
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Co-brand solar borewells, digital labs, or medical vans with full MCA statutory audit packs, employee matching gifts, and customized BOQ dossiers.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                <button
                  onClick={onOpenCorporateCSR}
                  className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider py-2 px-4 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open CSR Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-zinc-400 font-mono">Sec. 135 Companies Act</span>
              </div>
            </div>

            {/* Card 2: Form 10BE / 80G Instant Tax Certificate */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-white rounded-[2rem] p-5 sm:p-6 border border-orange-400/40 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-100 bg-white/20 px-2 py-0.5 rounded border border-white/30">
                    100% Tax Deductible
                  </span>
                  <FileCheck2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  Form 10BE & Section 80G Tax Exemption Center
                </h3>
                <p className="text-xs text-orange-100 leading-relaxed font-normal">
                  Generate instant cryptographic QR-verified Form 10BE donation receipts recognized by the Income Tax Department for 50% statutory deduction.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/20">
                <button
                  onClick={onOpenTaxCert}
                  className="bg-white hover:bg-orange-50 text-orange-800 active:scale-95 font-extrabold text-xs uppercase tracking-wider py-2 px-4 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Download Form 10BE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-orange-100 font-mono">Rule 18AB Compliant</span>
              </div>
            </div>
          </div>

          {/* Enterprise Feature 3: Automated WhatsApp Webhooks & Multilingual Accessibility */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-[2rem] p-5 sm:p-6 border border-emerald-700/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Automated Donor Engagement
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-200 font-bold px-2 py-0.5 rounded">
                  WhatsApp Cloud API • i18n
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                Instant WhatsApp 80G Receipts & Multilingual Regional Access
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                Automated event-driven webhooks deliver instant Form 10BE statutory certificates to donor WhatsApp accounts, schedule quarterly IoT impact milestone digests, and offer full native accessibility in Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), and Gujarati (ગુજરાતી).
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
              {onOpenWebhooks && (
                <button
                  onClick={onOpenWebhooks}
                  className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Test Webhooks & Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bento Block: Impact Stories Carousel */}
      <ImpactStoriesCarousel
        stories={stories}
        onNavigate={onNavigate}
        onSelectProject={onSelectProject}
        projects={projects}
        user={user}
        onEditStory={onEditStory}
        onAddNewStory={onAddNewStory}
      />

      {/* Bento Block: Quick Field Updates */}
      <section className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">
            Latest Field Updates
          </h4>
          {isAdmin && onOpenAdminStudio && (
            <button
              onClick={onOpenAdminStudio}
              className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Post Update</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {dispatches.map((disp) => (
            <div key={disp.id} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs">
                {disp.iconType === 'clinic' ? (
                  <HeartPulse className="w-4 h-4 text-emerald-600" />
                ) : disp.iconType === 'water' ? (
                  <Droplets className="w-4 h-4 text-cyan-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{disp.title}</p>
                <p className="text-[10px] text-gray-400 font-mono">{disp.meta} • {disp.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Block: Monthly Newsletter & Field Reports Signup */}
      <NewsletterSection />

      {/* Bento Bottom CTA Banner */}
      <section className="bg-orange-600 rounded-[2rem] p-6 text-white overflow-hidden relative shadow-md">
        <div className="relative z-10 space-y-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Make a difference today.
            </h2>
            <p className="text-orange-100 text-xs mt-1 leading-relaxed max-w-xs">
              Every contribution directly fuels field relief with 100% 80G tax exemption.
            </p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('donate')}
              className="flex-1 bg-white text-orange-600 hover:bg-orange-50 font-bold py-2.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs text-center"
            >
              One-Time Gift
            </button>
            <button
              onClick={() => onNavigate('donate')}
              className="flex-1 bg-orange-800 hover:bg-orange-900 text-white font-bold py-2.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all border border-orange-400/40 text-center"
            >
              Monthly Giving
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500 rounded-full opacity-40 pointer-events-none"></div>
      </section>

      {/* Official NGO Profile & Statutory Transparency Card */}
      <div className="p-4 sm:p-5 rounded-[1.75rem] bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-orange-200/80 dark:border-gray-700 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-md">
                  Est. 2016
                </span>
                <span className="text-[10px] text-gray-500 font-bold">
                  Society Act XXI of 1860
                </span>
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                HELPS Welfare Society (HELPS NGO)
              </h3>
            </div>
          </div>

          {onOpenAboutOrg && (
            <button
              onClick={onOpenAboutOrg}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              View Full Profile
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white font-semibold">Health, Education, Liberty, Peace, and Service:</strong> Dedicated to empowering marginalized communities through AABHA Child Education, Green Earth tree plantations, free rural medical camps, and daily nutrition.
        </p>

        {/* Quick Official Contact Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-gray-200/80 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">12A & 80G Tax Exempt</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <span className="font-bold text-orange-600">HQ:</span>
            <span className="truncate">Near GNDEC, Ludhiana, PB</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <a
              href="https://helpsngo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>helpsngo.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Footnote */}
      <div className="p-4 rounded-[1.5rem] bg-white border border-gray-200 text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-left">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block text-gray-900">Registered NGO Society (Est. 2016)</span>
            <span className="text-[10px] text-gray-500">{stats.trustRegistration}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenLegalPolicies && (
            <button
              onClick={() => onOpenLegalPolicies('privacy-policy')}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              <span>Statutory Policies (8)</span>
            </button>
          )}
          <button
            onClick={onOpenAboutOrg}
            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
          >
            <span>Legal & Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Statutory Footer Policy Links */}
      {onOpenLegalPolicies && (
        <div className="pt-2 pb-4 text-center border-t border-gray-200/60">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500">
            <button 
              onClick={() => onOpenLegalPolicies('terms-and-conditions')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalPolicies('privacy-policy')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer"
            >
              Privacy & DPDP Act
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalPolicies('refund-cancellation')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer"
            >
              Refund Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalPolicies('donor-privacy-pii')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer"
            >
              Donor PII Protection
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalPolicies('child-safeguarding-pocso')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer text-emerald-700 font-semibold"
            >
              Child Safeguarding (POCSO)
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalPolicies('grievance-whistleblower')} 
              className="hover:text-gray-900 underline underline-offset-2 cursor-pointer"
            >
              Grievance & Nodal Officer
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-mono">
            © 2016-2026 HELPS Welfare Society. All rights reserved. Registered under Society Registration Act XXI of 1860.
          </p>
        </div>
      )}
    </div>
  );
};
