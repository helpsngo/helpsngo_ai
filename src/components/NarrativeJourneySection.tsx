import React, { useState } from 'react';
import { TabType, Project, OrgStats, UserProfile } from '../types';
import { ORGANIZATION_INFO } from '../data/mockData';
import { 
  HeartHandshake, 
  BookOpen, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Utensils, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Compass, 
  Award, 
  Heart, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Target,
  FileCheck2,
  PhoneCall,
  Scissors
} from 'lucide-react';

interface NarrativeJourneySectionProps {
  onNavigate: (tab: TabType) => void;
  onSelectProject?: (project: Project) => void;
  projects?: Project[];
  stats?: OrgStats;
  onOpenAboutOrg?: () => void;
  onOpenCorporateCSR?: () => void;
  onOpenTaxCert?: () => void;
  user?: UserProfile;
}

export type NarrativeStep = 'who' | 'what' | 'where' | 'changed' | 'participate';

export const NarrativeJourneySection: React.FC<NarrativeJourneySectionProps> = ({
  onNavigate,
  onSelectProject,
  projects = [],
  stats,
  onOpenAboutOrg,
  onOpenCorporateCSR,
  onOpenTaxCert,
  user
}) => {
  const [activeStep, setActiveStep] = useState<NarrativeStep>('who');
  const org = ORGANIZATION_INFO;

  const stepsConfig: { id: NarrativeStep; label: string; number: string; subtitle: string; icon: any }[] = [
    { id: 'who', number: '01', label: 'Who We Are', subtitle: 'Identity & Roots', icon: HeartHandshake },
    { id: 'what', number: '02', label: 'What We Do', subtitle: '5 Core Pillars', icon: Target },
    { id: 'where', number: '03', label: 'Where We Work', subtitle: 'Field Bases', icon: MapPin },
    { id: 'changed', number: '04', label: 'What Changed', subtitle: 'Real Impact', icon: TrendingUp },
    { id: 'participate', number: '05', label: 'How To Participate', subtitle: 'Join Mission', icon: Users }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 animate-fadeIn">
      
      {/* Narrative Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
              The HELPS Journey & Mission
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight mt-0.5">
            Who We Are → What We Do → Where We Work → What Changed → How You Can Participate
          </h2>
        </div>

        {onOpenAboutOrg && (
          <button
            onClick={onOpenAboutOrg}
            className="self-start sm:self-auto bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-orange-700 dark:text-orange-300 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Statutory NGO Registry</span>
          </button>
        )}
      </div>

      {/* 5-Step Stepper Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {stepsConfig.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-start justify-between text-left cursor-pointer ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 shadow-xs ring-2 ring-orange-500/20'
                  : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/80 hover:border-orange-300 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[10px] font-black font-mono ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>
                  {s.number}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
              </div>
              <div>
                <span className={`text-xs font-black block tracking-tight ${isActive ? 'text-gray-950 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {s.label}
                </span>
                <span className="text-[9px] text-gray-500 font-medium truncate block">
                  {s.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. WHO WE ARE */}
      {/* ========================================================================= */}
      {activeStep === 'who' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-orange-200 dark:border-orange-900/60 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-black uppercase tracking-wider">
                    Est. 2017 • Ludhiana, Punjab
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Reg. Act XXI of 1860
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
                  HELPS Welfare Society — Health, Education, Liberty, Peace, and Service
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  Founded in 2017 by <strong>Amarjeet Kumar</strong>, HELPS is a grassroots non-profit dedicated to uplifting marginalized children, women, and vulnerable families through direct on-ground intervention in Punjab and across India.
                </p>
              </div>

              {/* Founder / Leadership Box */}
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-orange-200 dark:border-gray-700 text-xs space-y-1 sm:w-64 flex-shrink-0 shadow-xs">
                <span className="text-[9px] font-mono text-orange-600 dark:text-orange-400 font-bold uppercase block">
                  Founder & Leadership
                </span>
                <p className="font-extrabold text-gray-900 dark:text-white">Amarjeet Kumar</p>
                <p className="text-[11px] text-gray-500">Founder & Managing Director</p>
                <p className="text-[10px] text-gray-400 font-mono pt-1 border-t border-gray-100 dark:border-gray-700">
                  4,500+ Active Volunteers
                </p>
              </div>
            </div>
          </div>

          {/* 3 Core Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <h4 className="font-bold text-gray-900 dark:text-white">100% Statutory Compliant</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Registered under Societies Act XXI of 1860, 12A Certified, Section 80G 50% Tax Exemption, and MCA Form CSR-1 Registered.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <Users className="w-5 h-5 text-blue-600 mb-1" />
              <h4 className="font-bold text-gray-900 dark:text-white">Volunteer-Driven Engine</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Over 4,500 certified youth volunteers, teachers, doctors, and engineers power our daily ground operations with near-zero overhead.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <FileCheck2 className="w-5 h-5 text-orange-600 mb-1" />
              <h4 className="font-bold text-gray-900 dark:text-white">Radical Transparency</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Every rupee is tracked with instant Form 10BE tax receipts, digital audit trails, and live IoT ground telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setActiveStep('what')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next: What We Do</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. WHAT WE DO */}
      {/* ========================================================================= */}
      {activeStep === 'what' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Our 5 Flagship Grassroots Programs
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Targeted, high-impact interventions designed to create permanent self-reliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Pillar 1: AABHA Child Education */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  1. AABHA — Child Education
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Free evening learning coaching, digital tablets, school bags, and mainstream school admission for children of migrant laborers and ragpickers.
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 py-1 px-2 rounded-lg inline-block">
                1,200+ Students Enrolled
              </span>
            </div>

            {/* Pillar 2: Sanjeevani Mobile Health */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  2. Sanjeevani Health Outreach
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Free mobile diagnostic clinics, physician checkups, ECG/blood glucose tests, eye checkups, and free essential medicines for rural elderly.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 py-1 px-2 rounded-lg inline-block">
                18,500+ Patients Treated
              </span>
            </div>

            {/* Pillar 3: Annapoorna Food */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  3. Annapoorna Hunger Relief
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Daily nutritious snack boxes for students and emergency dry ration parcels for destitute families during winter and monsoon distress.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 py-1 px-2 rounded-lg inline-block">
                24,000+ Meals Served
              </span>
            </div>

            {/* Pillar 4: Prerna Skill Academy */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  4. Prerna Women Empowerment
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Certified vocational tailoring, embroidery, and digital literacy training providing sewing machines to enable self-sufficient family income.
                </p>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 py-1 px-2 rounded-lg inline-block">
                350+ Women Certified
              </span>
            </div>

            {/* Pillar 5: Clean Water & Environment */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center font-bold">
                  <Droplets className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white">
                  5. Jal Shakti & Green Earth
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Solar drinking water filtration wells installed in arsenic-affected villages and native tree plantation drives across schools and canals.
                </p>
              </div>
              <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 py-1 px-2 rounded-lg inline-block">
                45+ Wells & 8,000 Trees
              </span>
            </div>

            {/* Quick Action: View Projects */}
            <div 
              onClick={() => onNavigate('projects')}
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between cursor-pointer transition-all active:scale-98"
            >
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-orange-200 block">
                  Campaign Directory
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  Explore Active Field Projects
                </h4>
                <p className="text-[11px] text-orange-100 mt-1">
                  View individual project BOQs, funding targets, and ground progress updates.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider">
                <span>Open Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveStep('who')}
              className="text-xs font-bold text-gray-500 hover:text-orange-600"
            >
              ← Back to Who We Are
            </button>
            <button
              onClick={() => setActiveStep('where')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next: Where We Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WHERE WE WORK */}
      {/* ========================================================================= */}
      {activeStep === 'where' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Ground Zero & Regional Field Hubs
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-500 bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                GPS: 30.8607° N, 75.8601° E
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Our registered head office and primary teaching centers are located in <strong>Ludhiana, Punjab</strong>, operating across both dense urban industrial slum settlements and remote rural villages.
            </p>

            {/* 4 Geographic Operational Hubs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">Ludhiana Hub (Headquarters)</span>
                  <span className="text-[9px] bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold px-1.5 rounded">Primary Base</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Near Guru Nanak Dev Engineering College (GNDEC), Gill Road, Ludhiana – 141006.
                </p>
                <p className="text-[10px] text-orange-700 dark:text-orange-400 font-mono">
                  • 4 AABHA Centers • Mobile Health Van Base • Women Skill Lab
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">Ludhiana Urban Slum Clusters</span>
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold px-1.5 rounded">Daily Relief</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Dhandari Kalan, Focal Point, Shimlapuri, and Giaspura labor colonies.
                </p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400 font-mono">
                  • Mid-Day Nutrition • Evening Literacy • Polio & Health Screenings
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">Rural Punjab Field Units</span>
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 rounded">Regional</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Jalandhar, Amritsar, Bathinda, Patiala, Sangrur & Malwa belt villages.
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                  • Clean Water Wells • Tree Plantations • Free Physician Camps
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">Pan-India Rapid Emergency Relief</span>
                  <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold px-1.5 rounded">National</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Disaster relief volunteer deployment in Uttarakhand, Bihar & Himachal.
                </p>
                <p className="text-[10px] text-purple-700 dark:text-purple-400 font-mono">
                  • Emergency Ration • Winter Blankets • Water Purification Kits
                </p>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveStep('what')}
              className="text-xs font-bold text-gray-500 hover:text-orange-600"
            >
              ← Back to What We Do
            </button>
            <button
              onClick={() => setActiveStep('changed')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next: What Changed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WHAT CHANGED */}
      {/* ========================================================================= */}
      {activeStep === 'changed' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              The Real, Verifiable Transformation
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Behind every number is a life changed from vulnerability to lasting dignity.
            </p>
          </div>

          {/* 4 Big Transformation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/50 text-center space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block">1,200+</span>
              <span className="text-[10px] font-extrabold uppercase text-gray-700 dark:text-gray-300">Children in School</span>
              <span className="text-[9px] text-gray-400 block">Zero dropouts in adopted zones</span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 text-center space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block">18,500+</span>
              <span className="text-[10px] font-extrabold uppercase text-gray-700 dark:text-gray-300">Patients Cared</span>
              <span className="text-[9px] text-gray-400 block">Free diagnostic testing & meds</span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-center space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 block">24,000+</span>
              <span className="text-[10px] font-extrabold uppercase text-gray-700 dark:text-gray-300">Meals Distributed</span>
              <span className="text-[9px] text-gray-400 block">Hot food & emergency rations</span>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-900/50 text-center space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 block">350+</span>
              <span className="text-[10px] font-extrabold uppercase text-gray-700 dark:text-gray-300">Women Entrepreneurs</span>
              <span className="text-[9px] text-gray-400 block">Sewing kit certified & earning</span>
            </div>
          </div>

          {/* Real Human Stories Case Studies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Story 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  Education Transformation
                </span>
                <span className="text-[10px] text-gray-400">Ludhiana Slum</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Rahul Kumar (Age 11) • From Child Labor to Class Topper
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "Rahul was picking scrap metal near the railway tracks to support his ailing grandmother. After 18 months at AABHA Evening Center, he was enrolled in 5th grade and secured 92% in his annual school exams."
              </p>
            </div>

            {/* Story 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                  Livelihood Transformation
                </span>
                <span className="text-[10px] text-gray-400">Gill Road Hub</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Sunita Devi (Age 34) • From Debt to Dignified Income
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "After completing 6 months of certified tailoring training at Prerna Center, Sunita received a sponsored sewing machine. She now earns ₹14,000 monthly stitching uniforms, sending her 3 daughters to private school."
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveStep('where')}
              className="text-xs font-bold text-gray-500 hover:text-orange-600"
            >
              ← Back to Where We Work
            </button>
            <button
              onClick={() => setActiveStep('participate')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Next: How To Participate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOW YOU CAN PARTICIPATE */}
      {/* ========================================================================= */}
      {activeStep === 'participate' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              5 Concrete Ways You Can Make A Difference Today
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose the pathway that best matches your passion, time, or organizational capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Pathway 1: 80G Donate */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-4.5 rounded-2xl shadow-md space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    Immediate Impact
                  </span>
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <h4 className="text-sm font-black">1. Donate with 50% 80G Tax Exemption</h4>
                <p className="text-[11px] text-orange-100 leading-relaxed">
                  Support child education, meals, or medical camps with instant Form 10BE tax receipts via UPI, Cards, or Net Banking.
                </p>
              </div>
              <button
                onClick={() => onNavigate('donate')}
                className="bg-white text-orange-700 hover:bg-orange-50 font-black text-xs uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 mt-2"
              >
                <span>Donate Now (₹500 / ₹1,000 / Custom)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pathway 2: Volunteer */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    Hands-On Service
                  </span>
                  <HeartHandshake className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white">2. Join the Volunteer Squad</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Teach children, assist mobile clinics, coordinate logistics, or help remotely. Earn official verifiable certificates.
                </p>
              </div>
              <button
                onClick={() => onNavigate('volunteer')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 mt-2"
              >
                <span>Join As Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pathway 3: Corporate CSR */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    Institutional
                  </span>
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white">3. Corporate CSR Partnership</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Schedule Form CSR-1 certified projects with statutory MCA audit packs, employee payroll giving, and co-branded schools.
                </p>
              </div>
              {onOpenCorporateCSR && (
                <button
                  onClick={onOpenCorporateCSR}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 mt-2"
                >
                  <span>Explore CSR Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pathway 4: Visit Ground Center */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    In-Person
                  </span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white">4. Visit Our Ludhiana Ground Center</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Meet our teachers and students at our evening AABHA classroom near GNDEC, Gill Road, Ludhiana. Open daily 4:00 PM – 7:30 PM.
                </p>
              </div>
              <a
                href="https://helpsngo.in/contact-us"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-900 dark:text-white font-black text-xs uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2 text-center"
              >
                <span>Get Driving Directions & Timings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveStep('changed')}
              className="text-xs font-bold text-gray-500 hover:text-orange-600"
            >
              ← Back to What Changed
            </button>
            <button
              onClick={() => onNavigate('donate')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Start Your Contribution Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
