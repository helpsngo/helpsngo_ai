import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Utensils, 
  Leaf, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  Play, 
  Pause, 
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  DollarSign
} from 'lucide-react';
import { TabType, Project } from '../types';

interface GrassrootsRealityShowcaseProps {
  onNavigate: (tab: TabType) => void;
  onSelectProject?: (project: Project) => void;
  projects?: Project[];
}

interface FieldRhythmItem {
  time: string;
  hourLabel: string;
  title: string;
  pillar: 'Hunger' | 'Health' | 'Water' | 'Education' | 'Community';
  location: string;
  leadCoordinator: string;
  gpsCoords: string;
  challenge: string;
  realityAction: string;
  metricNumber: string;
  metricLabel: string;
  imageUrl: string;
  icon: any;
  color: string;
  bgColor: string;
}

const FIELD_RHYTHM: FieldRhythmItem[] = [
  {
    time: '06:30 AM',
    hourLabel: 'Morning Relief',
    title: 'Annapurna Kitchen Daily Prep',
    pillar: 'Hunger',
    location: 'Central Community Rasoi, Near GNDEC, Ludhiana',
    leadCoordinator: 'Priya Sharma & 6 Kitchen Volunteers',
    gpsCoords: '30.8607° N, 75.8596° E',
    challenge: 'Hospital attendants and daily-wage laborers often skip morning meals due to soaring inflation and tight shifts.',
    realityAction: 'Volunteers begin boiling massive vessels of nutritious khichdi, dal, and fresh rotis packed with protein and distributed hot.',
    metricNumber: '1,200+',
    metricLabel: 'Fresh Meals Cooked Daily',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    icon: Utensils,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
  },
  {
    time: '09:30 AM',
    hourLabel: 'Clinical Outpost',
    title: 'Rural Diagnostic Van Deployment',
    pillar: 'Health',
    location: 'Raikot Rural Primary Outpost, Ludhiana District',
    leadCoordinator: 'Dr. Arvind Mehta (Visiting Medical Lead)',
    gpsCoords: '30.6514° N, 75.6022° E',
    challenge: 'Marginalized elderly villagers must travel 35km to get blood glucose or pressure screenings, leading to silent strokes.',
    realityAction: 'Mobile clinical van parks at the Panchayat chaupal, setting up free diagnostic tables, vision screenings, and distributing essential medicines.',
    metricNumber: '150+',
    metricLabel: 'Patients Treated per Camp',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    icon: HeartPulse,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  },
  {
    time: '01:15 PM',
    hourLabel: 'Clean Water Flow',
    title: 'Solar Borewell Telemetry & Quality Check',
    pillar: 'Water',
    location: 'Arid Belt Water Unit #42, Punjab-Rajasthan Boundary',
    leadCoordinator: 'Er. Sandeep Gill (IoT Field Engineer)',
    gpsCoords: '29.9821° N, 74.8722° E',
    challenge: 'High groundwater fluoride & TDS causes debilitating joint stiffness in children and kidney stones across villages.',
    realityAction: 'Our solar-powered filtration stations purify up to 35,000 Litres daily; real-time digital sensors transmit TDS levels to prevent contamination.',
    metricNumber: '14,250 L',
    metricLabel: 'Dispensed Today (TDS 42 PPM)',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    icon: Droplets,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800'
  },
  {
    time: '04:45 PM',
    hourLabel: 'Evening Tutorial',
    title: 'AABHA Child Learning Center Classes',
    pillar: 'Education',
    location: 'Gill Road Slum Learning Cluster, Ludhiana',
    leadCoordinator: 'Rahul Verma & GNDEC Youth Mentors',
    gpsCoords: '30.8719° N, 75.8641° E',
    challenge: 'Children of migrant brick-kiln laborers are first-generation learners with no quiet study space or homework guidance at home.',
    realityAction: 'Under bright LED lanterns, 180 children sit in tutoring circles for English, maths, and general science, followed by healthy fruit snacks.',
    metricNumber: '180+',
    metricLabel: 'Children in Evening Batches',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    icon: GraduationCap,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800'
  },
  {
    time: '07:00 PM',
    hourLabel: 'Livelihood Circle',
    title: 'Women Tailoring & Vocational Circle',
    pillar: 'Community',
    location: 'AABHA Skill Development Wing, Ludhiana Hub',
    leadCoordinator: 'Simranjeet Kaur & 12 Trainees',
    gpsCoords: '30.8622° N, 75.8560° E',
    challenge: 'Single mothers and homemakers lacked independent earnings, leaving their families vulnerable to medical debt.',
    realityAction: 'Hands-on tailoring certification classes equip women to sew school uniforms and take boutique stitching contracts, generating independent income.',
    metricNumber: '85+',
    metricLabel: 'Certified Women Entrepreneurs',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    icon: Leaf,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800'
  }
];

export const GrassrootsRealityShowcase: React.FC<GrassrootsRealityShowcaseProps> = ({
  onNavigate,
  onSelectProject,
  projects = []
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [donationAmount, setDonationAmount] = useState<number>(1000);

  // Auto advance timeline every 5 seconds if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % FIELD_RHYTHM.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStep = FIELD_RHYTHM[activeStepIndex];
  const StepIcon = currentStep.icon;

  // Real Impact Calculations based on donation amount
  const mealsCount = Math.floor(donationAmount / 25);
  const educationDays = Math.floor(donationAmount / 20);
  const healthCheckups = Math.floor(donationAmount / 150);
  const waterLiters = Math.floor(donationAmount * 8);

  return (
    <section 
      aria-label="Grassroots Reality and Ground Truth Operations"
      className="rounded-[2.5rem] bg-gradient-to-b from-stone-900 via-zinc-900 to-stone-950 text-white p-5 sm:p-7 shadow-xl border border-zinc-800 space-y-6 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live Field Radar Badge */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Grassroots Telemetry • Live Operations
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-[10px] text-zinc-400 font-medium">
              HQ: Ludhiana, Punjab
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>The Ground Reality of HELPS</span>
            <span className="text-xs font-bold text-orange-400 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Est. 2016
            </span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
            Real work happens in the dust of village squares, hospital corridors, and evening slums — not in corporate boardrooms. Witness our 24-hour daily cycle of service.
          </p>
        </div>

        {/* Play/Pause controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all cursor-pointer"
            title={isPlaying ? "Pause Timeline Auto-Advance" : "Auto-Play 24H Timeline"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause Auto-Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Play 24H Tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Part 1: Interactive 24-Hour Rhythm Timeline Selector */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-bold text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>24 Hours in the Field • Hourly Chronology</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Checkpoint {activeStepIndex + 1} of {FIELD_RHYTHM.length}
          </span>
        </div>

        {/* Timeline Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FIELD_RHYTHM.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = idx === activeStepIndex;
            return (
              <button
                key={step.time}
                type="button"
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-orange-500 shadow-md shadow-orange-950/50 scale-[1.02]' 
                    : 'bg-zinc-900/60 hover:bg-zinc-800/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400" />
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-black ${isSelected ? 'text-orange-400' : 'text-zinc-500'}`}>
                    {step.time}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? step.color : 'text-zinc-600'}`} />
                </div>
                <div className="text-[11px] font-bold text-white mt-1 truncate">
                  {step.hourLabel}
                </div>
                <div className="text-[9px] text-zinc-400 truncate mt-0.5">
                  {step.pillar}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2: Featured Interactive Field Operation Snapshot */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-zinc-900/90 rounded-3xl p-4 sm:p-6 border border-zinc-800/90 shadow-inner">
        {/* Left Column: Photo Viewfinder with Ground Truth Metadata */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[300px] border border-zinc-700/80 group">
          <img 
            src={currentStep.imageUrl} 
            alt={currentStep.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Viewfinder Camera Corners */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-orange-400/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-orange-400/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-orange-400/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-orange-400/80 pointer-events-none" />

          {/* GPS & Verification HUD */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-zinc-300">
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <Camera className="w-3 h-3 text-orange-400" />
              <span>FIELD SHOT</span>
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>GEO-VERIFIED</span>
            </span>
          </div>

          {/* Bottom GPS Coordinates Stamp */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/10 space-y-1 text-left">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono text-orange-300 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                {currentStep.gpsCoords}
              </span>
              <span className="text-zinc-400 text-[9px]">Ludhiana Division</span>
            </div>
            <div className="text-[11px] font-bold text-white truncate">
              {currentStep.location}
            </div>
          </div>
        </div>

        {/* Right Column: Ground Reality Dossier */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${currentStep.bgColor} flex items-center justify-center shrink-0`}>
                  <StepIcon className={`w-4 h-4 ${currentStep.color}`} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    {currentStep.hourLabel} • {currentStep.time}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <div className="bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 text-right">
                <div className="text-sm font-black text-emerald-400">
                  {currentStep.metricNumber}
                </div>
                <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">
                  {currentStep.metricLabel}
                </div>
              </div>
            </div>

            {/* The Ground Challenge vs Our Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-stone-950/80 p-3 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <span>The Ground Challenge</span>
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {currentStep.challenge}
                </p>
              </div>

              <div className="bg-stone-950/80 p-3 rounded-2xl border border-zinc-800 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span>What HELPS Does Daily</span>
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {currentStep.realityAction}
                </p>
              </div>
            </div>

            {/* Coordinator in Charge */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <Users className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Ground Lead: <strong className="text-zinc-200">{currentStep.leadCoordinator}</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Tax Deductible under Sec 80G</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const targetPillar = currentStep.pillar;
                  const matched = projects.find(p => p.category.toLowerCase().includes(targetPillar.toLowerCase()));
                  if (matched && onSelectProject) {
                    onSelectProject(matched);
                  } else {
                    onNavigate('projects');
                  }
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-zinc-700 transition-all cursor-pointer"
              >
                Inspect Program Details
              </button>

              <button
                type="button"
                onClick={() => onNavigate('donate')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md shadow-orange-950/50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Support This Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: "Rupee to Reality" Interactive Impact Converter */}
      <div className="relative z-10 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-orange-950/30 rounded-3xl p-5 border border-amber-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                Transparent Unit Economics
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Rupee to Reality Calculator
            </h3>
            <p className="text-xs text-zinc-400">
              Slide to see the concrete tangible service delivered on the ground by your contribution.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              ₹{donationAmount.toLocaleString('en-IN')}
            </span>
            <span className="block text-[10px] text-zinc-400 uppercase font-bold">Your Direct Support</span>
          </div>
        </div>

        {/* Interactive Range Slider */}
        <div className="space-y-2">
          <input 
            type="range"
            min="250"
            max="10000"
            step="250"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-zinc-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 font-bold">
            <span>₹250</span>
            <span>₹2,500</span>
            <span>₹5,000</span>
            <span>₹7,500</span>
            <span>₹10,000</span>
          </div>
        </div>

        {/* Live Calculation Output Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 text-left space-y-1">
            <Utensils className="w-4 h-4 text-amber-400" />
            <div className="text-lg font-black text-white font-mono">{mealsCount}</div>
            <div className="text-[10px] text-zinc-400 font-medium">Hot Meals Cooked & Distributed</div>
          </div>

          <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 text-left space-y-1">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <div className="text-lg font-black text-white font-mono">{educationDays} Days</div>
            <div className="text-[10px] text-zinc-400 font-medium">AABHA Tutoring & Books Funded</div>
          </div>

          <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 text-left space-y-1">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <div className="text-lg font-black text-white font-mono">{healthCheckups} Persons</div>
            <div className="text-[10px] text-zinc-400 font-medium">Free Clinical Checkups & Meds</div>
          </div>

          <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 text-left space-y-1">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <div className="text-lg font-black text-white font-mono">{waterLiters.toLocaleString('en-IN')} L</div>
            <div className="text-[10px] text-zinc-400 font-medium">Potable Water Purified at Wells</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GrassrootsRealityShowcase;
