import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, CheckCircle2, ArrowLeftRight, Droplets, GraduationCap, HeartPulse, Utensils } from 'lucide-react';

export interface BeforeAfterPair {
  id: string;
  category: 'Water' | 'Education' | 'Healthcare' | 'Hunger';
  title: string;
  location: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  metric: string;
  verifiedDate: string;
  description: string;
}

export const BEFORE_AFTER_ITEMS: BeforeAfterPair[] = [
  {
    id: 'ba-water',
    category: 'Water',
    title: 'Solar Deep-Borewell & Water Purification Kiosk',
    location: 'Bundi District Cluster, Rajasthan',
    beforeLabel: 'Before Intervention (Dry Well & Saline Contamination)',
    afterLabel: 'After Completion (Solar 0-TDS Potable Water Hub)',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=1200&q=80',
    metric: '4,200 villagers with 24/7 safe water; 0-TDS certified',
    verifiedDate: 'August 2026',
    description: 'Replaced a contaminated manual handpump with an automated 3kW solar pump, reverse osmosis filtration unit, and 4-tap community dispensary.'
  },
  {
    id: 'ba-stem',
    category: 'Education',
    title: 'Smart Digital STEM Lab & Khan Academy Tablet Pods',
    location: 'Govt. Senior Secondary School, Alwar',
    beforeLabel: 'Before: Empty Room without Electricity or Books',
    afterLabel: 'After: High-Tech Solar STEM Center with 60 Tablets',
    beforeImage: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    metric: '320+ students learning robotics, coding & mathematics daily',
    verifiedDate: 'July 2026',
    description: 'Equipped rural classroom with solar inverter, high-speed mesh router, 60 ruggedized tablet kits, and interactive digital science modules in Hindi.'
  },
  {
    id: 'ba-clinic',
    category: 'Healthcare',
    title: 'Mobile Diagnostic Van & Tribal Telemedicine Dispensary',
    location: 'Ranchi Sector 4 Forest Enclave, Jharkhand',
    beforeLabel: 'Before: Zero Clinic Access within 35km Radius',
    afterLabel: 'After: Bi-Weekly Fully Equipped Clinical Van',
    beforeImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    metric: '1,450+ maternal & pediatric checkups performed to date',
    verifiedDate: 'August 2026',
    description: 'Brought on-site hematology analyzers, ultrasound screening, free prescription meds, and digital health card records to remote indigenous settlements.'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = BEFORE_AFTER_ITEMS[selectedIdx];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Water': return <Droplets className="w-4 h-4 text-cyan-500" />;
      case 'Education': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'Healthcare': return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      default: return <Utensils className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[2rem] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-2xs">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                Ground-Truth Verifier
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ GPS-Verified Photos
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 leading-tight">
              Before & After Visual Impact Comparison
            </h3>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {BEFORE_AFTER_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedIdx(idx);
                setSliderPosition(50);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedIdx === idx
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(item.category)}
              <span>{item.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Visual Splitter Canvas */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none border border-gray-200 shadow-inner bg-zinc-900"
      >
        {/* AFTER Image (Background base layer) */}
        <img
          src={activeItem.afterImage}
          alt={activeItem.afterLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* AFTER Overlay Tag (Top Right) */}
        <div className="absolute top-3 right-3 z-10 bg-emerald-900/85 backdrop-blur-md text-emerald-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/40 shadow-sm flex items-center gap-1.5 pointer-events-none">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{activeItem.afterLabel}</span>
        </div>

        {/* BEFORE Image (Clipped overlay layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={activeItem.beforeImage}
            alt={activeItem.beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none filter saturate-50 contrast-95"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            referrerPolicy="no-referrer"
          />

          {/* BEFORE Overlay Tag (Top Left) */}
          <div className="absolute top-3 left-3 z-10 bg-zinc-950/85 backdrop-blur-md text-zinc-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-zinc-700 shadow-sm pointer-events-none">
            <span>{activeItem.beforeLabel}</span>
          </div>
        </div>

        {/* Draggable Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-1 bg-white h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
          <div className="absolute w-9 h-9 rounded-full bg-white text-zinc-900 shadow-lg border-2 border-orange-500 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
            <ArrowLeftRight className="w-4 h-4 text-orange-600 stroke-[2.5]" />
          </div>
        </div>

        {/* Bottom instruction hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/65 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full pointer-events-none border border-white/20">
          ↔ Drag slider left or right to inspect transformation
        </div>
      </div>

      {/* Meta details footer */}
      <div className="bg-gray-50 rounded-2xl p-3.5 sm:p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-gray-900 text-sm">
              {activeItem.title}
            </h4>
            <span className="text-[10px] font-bold text-gray-500">
              • {activeItem.location}
            </span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            {activeItem.description}
          </p>
        </div>

        <div className="flex-shrink-0 sm:text-right bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-gray-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
            Verified Program Impact
          </span>
          <span className="font-extrabold text-gray-900 text-xs">
            {activeItem.metric}
          </span>
        </div>
      </div>
    </div>
  );
};
