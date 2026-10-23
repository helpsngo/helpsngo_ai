import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  HeartHandshake, 
  Clock, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { TabType } from '../types';

interface GrassrootsLiveTickerProps {
  onNavigate: (tab: TabType) => void;
  onOpenAboutOrg?: () => void;
}

interface LiveDispatchNotice {
  id: string;
  tag: string;
  location: string;
  timeAgo: string;
  headline: string;
  statBadge: string;
  category: 'education' | 'health' | 'hunger' | 'water' | 'environment';
}

const LIVE_NOTICES: LiveDispatchNotice[] = [
  {
    id: 'disp-live-1',
    tag: 'AABHA Classes Active',
    location: 'Gill Road Center, Ludhiana',
    timeAgo: 'Just now',
    headline: '180 children currently attending evening tutorial classes & receiving fresh stationery kits.',
    statBadge: '180 Kids Taught',
    category: 'education'
  },
  {
    id: 'disp-live-2',
    tag: 'Mobile Health Van',
    location: 'Raikot Rural Outpost, PB',
    timeAgo: '42m ago',
    headline: 'Free diagnostic camp completed: 150 blood screenings and free preventive medicines dispensed.',
    statBadge: '150 Patients Treated',
    category: 'health'
  },
  {
    id: 'disp-live-3',
    tag: 'Daily Annapurna Kitchen',
    location: 'Central Community Rasoi',
    timeAgo: '1h ago',
    headline: '1,200 nutritious hot meals cooked with fresh grains & distributed to hospital attendees and laborers.',
    statBadge: '1,200 Hot Meals',
    category: 'hunger'
  },
  {
    id: 'disp-live-4',
    tag: 'Solar Borewell Telemetry',
    location: 'Arid Belt Unit #42, PB Border',
    timeAgo: 'Live Telemetry',
    headline: 'Borewell active with 96% battery efficiency, delivering mineral-safe water (TDS 42 PPM).',
    statBadge: '14,250 L Delivered',
    category: 'water'
  },
  {
    id: 'disp-live-5',
    tag: 'Green Earth Drive',
    location: 'GNDEC Canal Belt, Ludhiana',
    timeAgo: 'Today',
    headline: 'Youth volunteers planted 500 shaded and fruit tree saplings with organic soil conditioning.',
    statBadge: '500 Trees Planted',
    category: 'environment'
  }
];

export const GrassrootsLiveTicker: React.FC<GrassrootsLiveTickerProps> = ({
  onNavigate,
  onOpenAboutOrg
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_NOTICES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentNotice = LIVE_NOTICES[currentIndex];

  const getCategoryColor = (cat: LiveDispatchNotice['category']) => {
    switch (cat) {
      case 'education': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'health': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'hunger': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'water': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30';
      case 'environment': return 'text-teal-500 bg-teal-500/10 border-teal-500/30';
      default: return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    }
  };

  return (
    <aside 
      aria-label="Live Ground Reality Dispatches"
      className="bg-zinc-900/90 text-white rounded-2xl px-3 sm:px-4 py-2 border border-zinc-800 shadow-sm relative overflow-hidden backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Field Reality</span>
          </span>
          <span className="text-zinc-600 text-[10px]">•</span>
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(currentNotice.category)}`}>
            {currentNotice.tag}
          </span>
        </div>

        {/* Center Live Message with smooth fade */}
        <div 
          key={currentNotice.id}
          className="flex-1 text-left sm:text-center text-xs truncate max-w-full sm:max-w-md animate-fadeIn"
        >
          <span className="text-zinc-400 font-medium text-[11px] mr-1">
            [{currentNotice.location}]:
          </span>
          <span className="text-zinc-200 font-semibold text-[11px]">
            {currentNotice.headline}
          </span>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
            {currentNotice.statBadge}
          </span>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Programs</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
export default GrassrootsLiveTicker;
