import React, { useState } from 'react';
import { ORGANIZATION_INFO } from '../data/mockData';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Users, 
  Target, 
  Compass, 
  HeartHandshake, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Utensils, 
  Sparkles, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Copy, 
  Check,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  FileCheck2,
  Share2
} from 'lucide-react';

interface AboutOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateDonate?: () => void;
  onNavigateVolunteer?: () => void;
}

export const AboutOrganizationModal: React.FC<AboutOrganizationModalProps> = ({
  isOpen,
  onClose,
  onNavigateDonate,
  onNavigateVolunteer
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'programs' | 'leadership' | 'statutory'>('overview');
  const org = ORGANIZATION_INFO;

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scaleUp">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-md font-black text-xl flex-shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                  Est. {org.foundedYear} • Registered Society
                </span>
                <span className="text-[10px] font-bold text-amber-200">
                  Govt. Approved
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
                {org.name}
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                {org.acronymMeaning}
              </p>
            </div>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Mission', icon: Compass },
              { id: 'programs', label: 'Our Programs', icon: Target },
              { id: 'leadership', label: 'Leadership', icon: Users },
              { id: 'statutory', label: 'Address & Legal', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-white text-orange-700 shadow-xs' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 dark:text-gray-200">

          {/* SECTION 1: OVERVIEW, MISSION & VISION */}
          {activeSection === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Mission Banner */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Our Mission</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
                  "{org.mission}"
                </p>
              </div>

              {/* Vision Banner */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Our Vision</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
                  "{org.vision}"
                </p>
              </div>

              {/* Key Impact Metrics Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Verified Impact At A Glance
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-lg font-black text-orange-600 dark:text-orange-400">{org.impactMetrics.livesTouched}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Lives Touched</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">{org.impactMetrics.childrenEducated}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Children (AABHA)</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400">{org.impactMetrics.mealsServed}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Meals Served</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{org.impactMetrics.medicalCamps}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Free Health Camps</p>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Guiding Principles & Core Values
                </h3>
                <div className="space-y-1.5">
                  {org.coreValues.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Social Links Banner */}
              <div className="bg-gray-900 text-white p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                    Connect On Official Social Channels
                  </span>
                  <a 
                    href={org.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-bold underline"
                  >
                    <span>helpsngo.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={org.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold transition-all"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={org.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-200 text-xs font-bold transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={org.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-bold transition-all"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube (@helpsngo_in)</span>
                  </a>
                  <a
                    href={org.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: PROGRAMS */}
          {activeSection === 'programs' && (
            <div className="space-y-3.5 animate-fadeIn">
              <p className="text-xs text-gray-500">
                HELPS Welfare Society operates 6 major sustained programs addressing grassroots education, healthcare, and livelihood needs across India:
              </p>

              <div className="space-y-3">
                {org.programs.map((prog) => (
                  <div 
                    key={prog.id}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                          {prog.category === 'Education' ? <GraduationCap className="w-4 h-4" /> :
                           prog.category === 'Healthcare' ? <HeartPulse className="w-4 h-4" /> :
                           prog.category === 'Environment' ? <Droplets className="w-4 h-4" /> :
                           prog.category === 'Hunger' ? <Utensils className="w-4 h-4" /> :
                           <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{prog.name}</h4>
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase">{prog.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                        {prog.impactHighlight}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: LEADERSHIP */}
          {activeSection === 'leadership' && (
            <div className="space-y-3.5 animate-fadeIn">
              <p className="text-xs text-gray-500">
                Governed by dedicated social workers, medical professionals, educators, and university mentors:
              </p>

              <div className="space-y-3">
                {org.leadership.map((leader) => (
                  <div
                    key={leader.id}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 flex items-start gap-3 shadow-xs"
                  >
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                          {leader.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{leader.location}</span>
                        </span>
                      </div>
                      <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        {leader.role}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                        {leader.bio}
                      </p>
                      {leader.email && (
                        <div className="pt-1 flex items-center gap-3 text-[11px]">
                          <a href={`mailto:${leader.email}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3" />
                            <span>{leader.email}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: ADDRESS, CONTACT & STATUTORY REGISTRATION */}
          {activeSection === 'statutory' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Statutory & Legal Registration Details */}
              <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Registration & Tax Status</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Official Legal Entity:</span>
                    <span className="font-bold text-right text-gray-900 dark:text-white">{org.legalName}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Governing Act:</span>
                    <span className="font-bold text-right text-gray-900 dark:text-white">{org.governingAct}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Registration Details:</span>
                    <span className="font-bold text-right text-emerald-700 dark:text-emerald-400">{org.registrationNumber}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Tax Exemption:</span>
                    <span className="font-bold text-right text-orange-700 dark:text-orange-400">{org.taxStatus}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-500">Established / Founded:</span>
                    <span className="font-bold text-right text-gray-900 dark:text-white">{org.foundedYear} (Over 8+ Years of Service)</span>
                  </div>
                </div>
              </div>

              {/* Official Address */}
              <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Official Headquarters Address</span>
                  </div>
                  <button
                    onClick={() => handleCopy(org.address.fullFormatted, 'address')}
                    className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'address' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {org.address.fullFormatted}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold px-2 py-0.5 rounded">
                    Landmark: {org.address.landmark}
                  </span>
                  <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono px-2 py-0.5 rounded">
                    PIN: {org.address.pinCode}
                  </span>
                </div>
              </div>

              {/* Official Phone & Email Directory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Official Helpline</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p>
                      <a href={`tel:${org.phone.primary}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        {org.phone.primary} (Primary)
                      </a>
                    </p>
                    <p>
                      <a href={`tel:${org.phone.secondary}`} className="font-mono text-gray-600 dark:text-gray-300 hover:underline">
                        {org.phone.secondary}
                      </a>
                    </p>
                    <p>
                      <a href={`tel:${org.phone.helpline}`} className="font-mono text-gray-600 dark:text-gray-300 hover:underline">
                        {org.phone.helpline}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Official Email</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p>
                      <a href={`mailto:${org.email.primary}`} className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                        {org.email.primary}
                      </a>
                    </p>
                    <p>
                      <a href={`mailto:${org.email.general}`} className="font-mono text-gray-600 dark:text-gray-300 hover:underline">
                        {org.email.general}
                      </a>
                    </p>
                    <p>
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="font-mono text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{org.website}</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
          <div className="text-[11px] text-gray-500 font-medium">
            Official Data Source: <a href="https://helpsngo.in/" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold hover:underline">helpsngo.in</a>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateVolunteer && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateVolunteer();
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Join As Volunteer
              </button>
            )}
            {onNavigateDonate && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateDonate();
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Support Our Mission (₹)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
