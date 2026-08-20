import React, { useState, useEffect, useRef } from 'react';
import { TabType, Project } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause,
  GraduationCap,
  HeartPulse,
  Droplets,
  Utensils,
  Users
} from 'lucide-react';

export interface CarouselSlide {
  id: string;
  category: 'Education' | 'Healthcare' | 'Water' | 'Hunger' | 'Community';
  badge: string;
  headline: string;
  subheadline: string;
  image: string;
  accentColor: string;
  impactStat: string;
  projectCategory: string;
  tagline: string;
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-edu',
    category: 'Education',
    badge: 'Rural Learning Revolution',
    headline: 'Empowering Young Minds with Smart Classrooms',
    subheadline: 'Equipping 50,000+ underprivileged children in remote villages with digital tablets, STEM kits, and dedicated mentors.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-blue-600/90 via-blue-900/60 to-black/80',
    impactStat: '50K+ Students Sponsored',
    projectCategory: 'Education',
    tagline: '📚 Smart Classrooms'
  },
  {
    id: 'slide-health',
    category: 'Healthcare',
    badge: 'Mobile Health Clinics',
    headline: 'Bringing Critical Medical Care to Tribal Doorsteps',
    subheadline: 'Mobile clinical vans conducting regular diagnostic screenings, maternal care, free medication, and emergency triage.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-emerald-700/90 via-emerald-950/60 to-black/80',
    impactStat: '250K+ Patients Treated',
    projectCategory: 'Healthcare',
    tagline: '🩺 Mobile Clinics'
  },
  {
    id: 'slide-water',
    category: 'Water',
    badge: 'Solar Aquifer Borewells',
    headline: 'Safe, Pure Drinking Water for Drought-Stricken Belts',
    subheadline: 'Installing high-capacity solar water purification systems providing 0-TDS clean drinking water to over 1,200 villages.',
    image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-cyan-700/90 via-cyan-950/60 to-black/80',
    impactStat: '1,200+ Wells Commissioned',
    projectCategory: 'Water',
    tagline: '💧 Clean Water'
  },
  {
    id: 'slide-hunger',
    category: 'Hunger',
    badge: 'Daily Nutrition Drives',
    headline: 'Zero Hunger: 500,000+ Nutritious Meals Served',
    subheadline: 'Daily mega-kitchens delivering warm, fortified meals and micronutrient supplements to fight acute childhood stunting.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-amber-700/90 via-amber-950/60 to-black/80',
    impactStat: '500K+ Fortified Meals',
    projectCategory: 'Hunger',
    tagline: '🍲 Zero Hunger'
  },
  {
    id: 'slide-community',
    category: 'Community',
    badge: 'Grassroots Leadership',
    headline: 'Vocational Training & Youth Skill Empowerment',
    subheadline: 'Free certified courses in electrical technology, solar maintenance, and computer literacy guaranteeing dignified livelihoods.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-purple-700/90 via-purple-950/60 to-black/80',
    impactStat: '4,500+ Active Volunteers',
    projectCategory: 'Community',
    tagline: '🤝 Skill Workshops'
  }
];

interface HomeImageCarouselProps {
  onNavigate: (tab: TabType) => void;
  onSelectProjectCategory?: (category: string) => void;
  onDonateToProject?: (project: Project) => void;
  projects?: Project[];
}

export const HomeImageCarousel: React.FC<HomeImageCarouselProps> = ({
  onNavigate,
  onSelectProjectCategory,
  onDonateToProject,
  projects = []
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION_MS = 5000;
  const TICK_INTERVAL_MS = 50;

  // Auto-play timer with smooth visual progress
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          setCurrentIndex((curr) => (curr + 1) % CAROUSEL_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, currentIndex]);

  const handleSlideChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setProgress(0);
  };

  const handlePrev = () => {
    const prev = currentIndex === 0 ? CAROUSEL_SLIDES.length - 1 : currentIndex - 1;
    handleSlideChange(prev);
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % CAROUSEL_SLIDES.length;
    handleSlideChange(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      handleNext();
    } else if (diffX < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handleDonateClick = (slide: CarouselSlide) => {
    const matchingProject = projects.find(
      (p) => p.category.toLowerCase() === slide.projectCategory.toLowerCase()
    );

    if (matchingProject && onDonateToProject) {
      onDonateToProject(matchingProject);
    } else {
      onNavigate('donate');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-400" />;
      case 'Healthcare':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Hunger':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div 
      id="homescreen-image-carousel"
      className="relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-200 bg-gray-950 text-white select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Animated Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/15 z-30 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sliding Images Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden">
        {CAROUSEL_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Gentle Ken Burns Effect */}
              <img
                src={slide.image}
                alt={slide.headline}
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* High-Contrast Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} opacity-75 mix-blend-multiply`} />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-7 flex flex-col justify-between z-20">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white border border-white/30 shadow-xs">
                      {getCategoryIcon(slide.category)}
                      <span>{slide.badge}</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-orange-300 border border-white/10">
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      <span>{slide.impactStat}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Slide Counter */}
                    <span className="bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-gray-200 border border-white/15">
                      0{idx + 1} / 0{CAROUSEL_SLIDES.length}
                    </span>
                    {/* 80G Certified Pill */}
                    <div className="flex items-center gap-1 bg-emerald-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs border border-emerald-400/40">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="hidden xs:inline">80G</span>
                      <span>Certified</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Text & Actions */}
                <div className="space-y-2 max-w-xl">
                  <div>
                    <h2 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                      {slide.headline}
                    </h2>
                    <p className="text-gray-200 text-[11px] sm:text-sm mt-1 line-clamp-2 leading-relaxed font-normal drop-shadow">
                      {slide.subheadline}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      id={`carousel-donate-btn-${slide.id}`}
                      type="button"
                      onClick={() => handleDonateClick(slide)}
                      className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-white" />
                      <span>Donate to this Cause</span>
                    </button>

                    <button
                      id={`carousel-explore-btn-${slide.id}`}
                      type="button"
                      onClick={() => {
                        if (onSelectProjectCategory) {
                          onSelectProjectCategory(slide.projectCategory);
                        }
                        onNavigate('projects');
                      }}
                      className="bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Initiatives</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        id="carousel-prev-btn"
        type="button"
        onClick={handlePrev}
        className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 shadow-md cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        id="carousel-next-btn"
        type="button"
        onClick={handleNext}
        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 shadow-md cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Bottom Controls Bar (Indicator Dots, Direct Mission Links & Play/Pause) */}
      <div className="absolute bottom-2.5 right-3.5 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
        {/* Play/Pause Button */}
        <button
          id="carousel-play-pause-btn"
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/80 hover:text-white transition-colors p-0.5 cursor-pointer"
          title={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
          aria-label={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        <div className="h-3 w-px bg-white/20" />

        {/* Slide Indicators */}
        <div className="flex items-center gap-1.5">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                id={`carousel-dot-${idx}`}
                type="button"
                onClick={() => handleSlideChange(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.headline}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive 
                    ? 'w-6 h-2 bg-orange-500 shadow-xs' 
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Mission Navigation Strip at bottom of carousel on wider screens */}
      <div className="hidden md:flex items-center justify-between gap-1.5 px-4 py-2 bg-black/90 border-t border-white/10 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Featured Causes:
        </span>
        <div className="flex items-center gap-1">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSlideChange(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {slide.tagline}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
