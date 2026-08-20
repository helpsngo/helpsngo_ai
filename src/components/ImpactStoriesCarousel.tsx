import React, { useState, useEffect, useRef } from 'react';
import { ImpactStory, TabType, Project, UserProfile } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Utensils, 
  Users,
  ArrowRight,
  Pause,
  Play,
  Share2,
  Edit3,
  Plus
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ImpactStoriesCarouselProps {
  stories: ImpactStory[];
  onNavigate: (tab: TabType) => void;
  onSelectProject?: (project: Project) => void;
  projects?: Project[];
  user?: UserProfile;
  onEditStory?: (story: ImpactStory) => void;
  onAddNewStory?: () => void;
}

export const ImpactStoriesCarousel: React.FC<ImpactStoriesCarouselProps> = ({
  stories,
  onNavigate,
  onSelectProject,
  projects = [],
  user,
  onEditStory,
  onAddNewStory
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isAdmin = user?.role === 'admin';
  const totalStories = stories.length;

  useEffect(() => {
    if (!isAutoPlaying || totalStories <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalStories);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalStories]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalStories) % totalStories);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalStories);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Healthcare':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Water':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'Hunger':
        return <Utensils className="w-3.5 h-3.5" />;
      default:
        return <Users className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Education':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          accent: 'text-blue-600',
          bgLight: 'bg-blue-50/40'
        };
      case 'Healthcare':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          accent: 'text-emerald-600',
          bgLight: 'bg-emerald-50/40'
        };
      case 'Water':
        return {
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          accent: 'text-cyan-600',
          bgLight: 'bg-cyan-50/40'
        };
      case 'Hunger':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          accent: 'text-amber-700',
          bgLight: 'bg-amber-50/40'
        };
      default:
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          accent: 'text-purple-600',
          bgLight: 'bg-purple-50/40'
        };
    }
  };

  const theme = getCategoryTheme(currentStory.category);

  return (
    <section 
      id="impact-stories-section"
      className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-4 relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Top Header & Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-900">
            Voices of Impact
          </h3>
          <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-100 hidden sm:inline-block">
            {currentIndex + 1} of {totalStories}
          </span>
        </div>

        {/* Action Controls & Arrows */}
        <div className="flex items-center gap-1.5">
          {isAdmin && onAddNewStory && (
            <button
              onClick={onAddNewStory}
              className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Add New Beneficiary Story"
            >
              <Plus className="w-3 h-3" />
              <span>Add Story</span>
            </button>
          )}

          {isAdmin && onEditStory && (
            <button
              onClick={() => onEditStory(currentStory)}
              className="text-[10px] font-bold uppercase text-gray-700 hover:text-purple-700 bg-gray-100 hover:bg-purple-50 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Admin: Edit this story"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            title={isAutoPlaying ? 'Pause rotation' : 'Play rotation'}
            aria-label={isAutoPlaying ? 'Pause rotation' : 'Play rotation'}
          >
            {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          <button
            id="prev-story-btn"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="next-story-btn"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Next story"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Story Bento Card */}
      <div 
        className="touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${theme.bgLight} border-gray-200/80`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Beneficiary Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-900 border-2 border-white shadow-md flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={currentStory.image}
                alt={currentStory.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md text-[9px] font-bold text-white px-1.5 py-0.2 rounded">
                {currentStory.category}
              </span>
            </div>

            {/* Content & Quote */}
            <div className="flex-1 min-w-0 space-y-2 text-left">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">
                    {currentStory.name} {currentStory.age ? `(${currentStory.age} yrs)` : ''}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {currentStory.role} • {currentStory.location}
                  </p>
                </div>

                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                  {getCategoryIcon(currentStory.category)}
                  <span>{currentStory.category}</span>
                </div>
              </div>

              {/* Direct Beneficiary Quote */}
              <div className="relative pl-3 border-l-2 border-orange-500">
                <p className="text-xs sm:text-sm text-gray-800 italic leading-relaxed font-serif">
                  "{currentStory.quote}"
                </p>
              </div>

              {/* Impact Metric Pill & Background Story */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-800 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  <span>{currentStory.impactMetric}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-1.5 rounded-xl bg-white hover:bg-orange-50 text-gray-600 hover:text-orange-600 border border-gray-200 text-[10px] font-bold transition-colors flex items-center gap-1"
                    title="Share this story"
                  >
                    <Share2 className="w-3 h-3" />
                    <span className="hidden xs:inline">Share</span>
                  </button>

                  <button
                    onClick={() => {
                      const matchingProj = projects.find(p => p.category === currentStory.category);
                      if (matchingProj && onSelectProject) {
                        onSelectProject(matchingProj);
                      } else {
                        onNavigate('projects');
                      }
                    }}
                    className="text-[10px] font-extrabold uppercase text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Support Similar Causes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-6 bg-orange-600'
                : 'w-1.5 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Go to story ${idx + 1}`}
          />
        ))}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={{
          title: `Impact Story: ${currentStory.name}`,
          text: `"${currentStory.quote}" - ${currentStory.name}, ${currentStory.role} (${currentStory.location}) supported by Helps NGO.`,
          category: currentStory.category,
          image: currentStory.image,
          metric: currentStory.impactMetric
        }}
      />
    </section>
  );
};
