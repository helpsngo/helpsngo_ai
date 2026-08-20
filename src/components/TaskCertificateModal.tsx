import React from 'react';
import { WorkAssignment, UserProfile } from '../types';
import { 
  X, 
  Award, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Share2,
  FileCheck,
  Check
} from 'lucide-react';

interface TaskCertificateModalProps {
  task: WorkAssignment;
  onClose: () => void;
  currentUser?: UserProfile;
}

export const TaskCertificateModal: React.FC<TaskCertificateModalProps> = ({
  task,
  onClose,
  currentUser
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getBadgeInfo = (category: string) => {
    switch (category) {
      case 'Water':
        return {
          title: '💧 Water Security Sentinel',
          tier: 'Honorary Vanguard',
          desc: 'Recognized for pioneering clean solar water infrastructure and aquifer safety in underserved rural clusters.',
          gradient: 'from-cyan-600 to-blue-700'
        };
      case 'Education':
        return {
          title: '📚 STEM Education Luminary',
          tier: 'Digital Impact Leader',
          desc: 'Recognized for delivering digital literacy tablet kits and advancing classroom innovation for underprivileged children.',
          gradient: 'from-blue-600 to-indigo-700'
        };
      case 'Healthcare':
        return {
          title: '🩺 Healthcare Guardian',
          tier: 'Clinical Relief Champion',
          desc: 'Recognized for frontline tribal diagnostic triage, medicine distribution, and emergency clinic operations.',
          gradient: 'from-emerald-600 to-teal-700'
        };
      case 'Hunger':
        return {
          title: '🍲 Zero-Hunger Hero',
          tier: 'Food Relief Champion',
          desc: 'Recognized for hygienic mega-kitchen operations, nutritious meal dispatch, and slum community hunger relief.',
          gradient: 'from-amber-600 to-orange-700'
        };
      case 'Logistics':
        return {
          title: '📦 Emergency Logistics Specialist',
          tier: 'Rapid Deployment Lead',
          desc: 'Recognized for warehouse inventory governance and winter relief distribution to vulnerable urban communities.',
          gradient: 'from-purple-600 to-pink-700'
        };
      default:
        return {
          title: '🛡️ Field Excellence & Governance Badge',
          tier: 'Excellence in Service',
          desc: 'Recognized for disciplined execution of NGO operational directives with high integrity and transparency.',
          gradient: 'from-orange-600 to-amber-700'
        };
    }
  };

  const badge = getBadgeInfo(task.category);
  const certId = `HELPS-CERT-2026-${(task.id || 'TASK').replace(/[^a-zA-Z0-9]/g, '')}`;
  const completionDate = task.completedAt || task.updatedAt || new Date().toISOString().split('T')[0];
  const hoursCredited = task.submittedHours || task.estimatedHours || 4;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                Official Certification of Field Excellence
              </span>
              <h3 className="font-black text-sm text-white leading-tight">
                Helps NGO Service Honors
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 border-4 border-double border-amber-300 shadow-sm text-center overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <ShieldCheck className="w-72 h-72 text-orange-950" />
            </div>

            {/* Top Emblem & NGO Details */}
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>NITI Aayog Darpan & 80G Certified Public Trust</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                HELPS NGO TRUST
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                Govt. Reg. No. 12AA/80G/TRUST-2024 • Headquarters: Jaipur, Rajasthan
              </p>
            </div>

            {/* Title */}
            <div className="relative z-10 my-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 block">
                Certificate of Operational Excellence
              </span>
              <p className="text-xs text-zinc-600 mt-1 italic">
                This honor is officially conferred upon
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 pb-1.5 border-b-2 border-amber-400 inline-block px-6">
                {task.assignedTo?.name || 'Dedicated Service Member'}
              </h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">
                {task.assignedTo?.title || 'Field Volunteer'} ({task.assignedTo?.role ? task.assignedTo.role.toUpperCase() : 'VOLUNTEER'})
              </p>
            </div>

            {/* Directive Citation */}
            <div className="relative z-10 my-4 bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-2xs text-left space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-zinc-700 uppercase">Field Task Directive:</span>
                <span className="font-mono text-zinc-400 text-[10px]">#{task.id}</span>
              </div>
              <h4 className="text-sm font-black text-zinc-900 leading-snug">
                {task.title}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {task.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-xs text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{task.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span><strong>{hoursCredited} Hours</strong> Credited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span>Completed: {completionDate}</span>
                </div>
              </div>
            </div>

            {/* Badge Earned Showcase */}
            <div className="relative z-10 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white text-left flex items-center gap-3.5 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Badge Conferred
                  </span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.2 rounded-full uppercase">
                    {badge.tier}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white truncate">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">
                  {badge.desc}
                </p>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="relative z-10 mt-6 pt-4 border-t-2 border-amber-200/80 grid grid-cols-3 items-center text-left text-[11px]">
              {/* Left: Assigning Trustee */}
              <div>
                <span className="font-extrabold text-zinc-900 block text-xs">
                  {task.assignedBy?.name || 'Amarjeet Kumar'}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {task.assignedBy?.title || 'Trustee & National Director'}
                </span>
                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider block mt-0.5">
                  Verified Authority
                </span>
              </div>

              {/* Middle: Official Seal */}
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-[9px] tracking-widest shadow-xs border-2 border-white uppercase">
                  SEAL
                </div>
                <span className="text-[8px] font-mono text-zinc-400 mt-1 uppercase">
                  {certId}
                </span>
              </div>

              {/* Right: Date Issued */}
              <div className="text-right">
                <span className="font-bold text-zinc-900 block">
                  {completionDate}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Date of Certification
                </span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mt-0.5">
                  ✓ 80G Audited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Official Helps NGO Certificate Ledger Record
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl border border-zinc-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
