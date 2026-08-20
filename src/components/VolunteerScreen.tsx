import React, { useState } from 'react';
import { SKILL_OPTIONS } from '../data/mockData';
import { VolunteerFormData, UserProfile, WorkAssignment } from '../types';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Clock, 
  MapPin,
  Calendar,
  Send,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  Sliders,
  ChevronRight,
  Download,
  AlertCircle,
  Briefcase,
  ArrowRight,
  CheckSquare,
  Square,
  Wifi,
  WifiOff,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfflineSyncBadge } from './OfflineSyncBadge';
import { queueOfflineAction } from '../services/offlineSyncService';

interface VolunteerDrive {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  spotsLeft: number;
  signedUp?: boolean;
}

const UPCOMING_DRIVES: VolunteerDrive[] = [
  {
    id: 'drive-1',
    title: 'AABHA Weekend Literacy & Tablet Tutoring Camp',
    location: 'AABHA Learning Center, Near GNDEC, Gill Road, Ludhiana',
    date: 'Saturday, Nov 18',
    time: '9:00 AM - 1:00 PM (4 hrs)',
    category: 'Education',
    spotsLeft: 4
  },
  {
    id: 'drive-2',
    title: 'Mobile Health Checkup & Diagnostic Camp',
    location: 'HELPS Mobile Health Unit, Dhandari Kalan, Ludhiana',
    date: 'Sunday, Nov 19',
    time: '8:30 AM - 3:30 PM (7 hrs)',
    category: 'Healthcare',
    spotsLeft: 2
  },
  {
    id: 'drive-3',
    title: 'Green Earth with Bharat Mega Tree Plantation Drive',
    location: 'GNDEC Campus & Canal Belt, Ludhiana',
    date: 'Tuesday, Nov 21',
    time: '10:00 AM - 2:00 PM (4 hrs)',
    category: 'Environment',
    spotsLeft: 8
  },
  {
    id: 'drive-4',
    title: 'Community Nutrition & Winter Warmth Distribution',
    location: 'Railway Colony & Slum Clusters, Ludhiana',
    date: 'Thursday, Nov 23',
    time: '11:00 AM - 3:00 PM (4 hrs)',
    category: 'Relief',
    spotsLeft: 6
  }
];

interface VolunteerScreenProps {
  user?: UserProfile;
  onSubmitSuccess: (data: VolunteerFormData) => void;
  onNavigateHome: () => void;
  onOpenCertificate?: () => void;
  onOpenAdminStudio?: () => void;
  onOpenAuth?: () => void;
  onLogHours?: (hours: number, activity: string) => void;
  workAssignments?: WorkAssignment[];
  onOpenWorkAssignments?: () => void;
  onUpdateAssignment?: (task: WorkAssignment) => void;
}

export const VolunteerScreen: React.FC<VolunteerScreenProps> = ({
  user,
  onSubmitSuccess,
  onNavigateHome,
  onOpenCertificate,
  onOpenAdminStudio,
  onOpenAuth,
  onLogHours,
  workAssignments = [],
  onOpenWorkAssignments,
  onUpdateAssignment
}) => {
  const isApplicant = user?.role === 'volunteer_applicant' || user?.volunteerApplicationStatus === 'pending_review';
  const isVolunteer = (user?.role === 'volunteer') && !isApplicant;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManagement = user?.role === 'management' || user?.role === 'program_manager';
  const canManageWork = isAdmin || isManagement;
  const isDonor = user?.role === 'donor';
  const isGuest = !user || user.role === 'guest';

  const [name, setName] = useState<string>(user?.role !== 'guest' ? (user?.name || '') : '');
  const [email, setEmail] = useState<string>(user?.role !== 'guest' ? (user?.email || '') : '');
  const [skills, setSkills] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [location, setLocation] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [volunteerId, setVolunteerId] = useState<string>('');
  
  // Volunteer Drives signup state
  const [drives, setDrives] = useState<VolunteerDrive[]>(UPCOMING_DRIVES);
  const [signedUpDriveIds, setSignedUpDriveIds] = useState<string[]>([]);
  const [showLogHoursModal, setShowLogHoursModal] = useState<boolean>(false);
  const [logHoursCount, setLogHoursCount] = useState<number>(4);
  const [logActivityNote, setLogActivityNote] = useState<string>('');
  const [logSuccessMsg, setLogSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#EA580C', '#F97316', '#10B981', '#3B82F6']
      });
    } catch {
      // safe fallback
    }

    const genId = `HLP-VOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setVolunteerId(genId);
    setIsSubmitted(true);

    const formData: VolunteerFormData = {
      name,
      email,
      phone: phone || '+91 98765 43210',
      skills: skills || 'Education & Tutoring',
      availability: availability || 'Weekends (4-6 hrs)',
      location: location || 'Community Hub'
    };

    onSubmitSuccess(formData);
  };

  const handleDriveSignUp = (driveId: string) => {
    if (signedUpDriveIds.includes(driveId)) {
      setSignedUpDriveIds(prev => prev.filter(id => id !== driveId));
    } else {
      setSignedUpDriveIds(prev => [...prev, driveId]);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // safe
      }
    }
  };

  const handleLogHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logHoursCount <= 0) return;
    if (onLogHours) {
      onLogHours(logHoursCount, logActivityNote || 'Community Relief Drive');
    }
    setLogSuccessMsg(`Successfully logged ${logHoursCount} hours! Your volunteer record is updated.`);
    setTimeout(() => {
      setShowLogHoursModal(false);
      setLogSuccessMsg(null);
      setLogActivityNote('');
    }, 1800);
  };

  // Application Success View
  if (isSubmitted) {
    return (
      <div className="p-3.5 sm:p-4 pb-8 animate-fadeIn">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-200 text-center shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
              Application Approved
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1 tracking-tight">
              Welcome to the Helps NGO Family!
            </h2>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-xs mx-auto">
              Thank you, <strong className="text-gray-900">{name}</strong>. Your field coordinator will connect with you shortly.
            </p>
          </div>

          {/* Volunteer Digital ID Badge */}
          <div className="p-5 rounded-[1.8rem] bg-gray-900 text-white text-left relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-500" />
                <span className="font-extrabold text-xs tracking-wide">Helps NGO Official Pass</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 text-[11px] uppercase font-bold">Volunteer:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-[11px] uppercase font-bold">Pass ID:</span>
                <span className="font-mono font-bold text-orange-400">{volunteerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-[11px] uppercase font-bold">Domain:</span>
                <span className="font-semibold text-zinc-200">{skills || 'Community Outreach'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 text-[11px] uppercase font-bold">Availability:</span>
                <span className="font-semibold text-zinc-200">{availability || 'Flexible Hours'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onNavigateHome}
              className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xs"
            >
              Back to Home
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-2 text-[11px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 p-3.5 sm:p-4 space-y-4 animate-fadeIn">
      {/* Admin / Management Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-[2rem] p-4 shadow-sm border border-purple-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-700/60 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Volunteer Operations Roster
                </span>
                <span className="text-[9px] bg-purple-500/40 text-purple-200 font-mono px-1.5 py-0.2 rounded border border-purple-400/30">
                  Trustee View
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                4,500+ active field volunteers registered. Track service drives and approve certifications.
              </p>
            </div>
          </div>
          {onOpenAdminStudio && (
            <button
              onClick={onOpenAdminStudio}
              className="bg-white text-purple-900 hover:bg-purple-50 active:scale-95 font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 transition-all ml-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage Vol. Drives</span>
            </button>
          )}
        </div>
      )}

      {/* Applicant Pending Review Banner */}
      {isApplicant && user && (
        <div className="bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-900 rounded-[2rem] p-5 sm:p-6 text-white shadow-md border border-amber-700/60 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-800/80 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">{user.name}</h2>
                  <span className="bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Application Pending Review
                  </span>
                </div>
                <p className="text-xs text-amber-200 font-medium">{user.email} • Volunteer Applicant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Under Trustee Review</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Statutory Verification Status
              </span>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-black text-white">Trustee Clearance In Progress</span>
              </div>
              <p className="text-[10px] text-amber-200/80 leading-relaxed">
                National Child Safeguarding (PoCSO) & identity verification queue. Estimated review: 24–48 hours.
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Volunteer Squad & Directives
              </span>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-black text-white">0 Tasks Dispatched (Locked)</span>
              </div>
              <p className="text-[10px] text-amber-200/80 leading-relaxed">
                Field task dispatch and hours tracking are locked until your application is approved by the Trustee Board.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Volunteer Dedicated Dashboard Card */}
      {isVolunteer && user && (
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-900 rounded-[2rem] p-5 sm:p-6 text-white shadow-md border border-blue-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-800/80 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">{user.name}</h2>
                  <span className="bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user.volunteerLevel}
                  </span>
                </div>
                <p className="text-xs text-blue-200 font-medium">Verified NGO Field Volunteer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogHoursModal(true)}
                className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Log Service Hours</span>
              </button>

              {onOpenCertificate && (
                <button
                  onClick={onOpenCertificate}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </button>
              )}
            </div>
          </div>

          {/* Volunteer Hours & Tier Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                Total Service Hours Contributed
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">{user.volunteerHours}</span>
                <span className="text-xs text-zinc-300 font-bold">Hours of Direct Service</span>
              </div>
              <p className="text-[10px] text-zinc-400">Equivalent to ~₹42,500 in community support</p>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-orange-400">Tier Milestone Progress</span>
                <span className="text-zinc-300 font-mono text-[11px]">{user.volunteerHours} / {user.volunteerNextTierHours} hrs</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((user.volunteerHours / user.volunteerNextTierHours) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400">
                {user.volunteerNextTierHours - user.volunteerHours} more hours to unlock National Social Leader Badge!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Work Assignments & Directives Hub (Admin -> Management -> Volunteer Hierarchy) */}
      <div className="bg-white rounded-[2rem] p-4 sm:p-5 border border-gray-200 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
                  Field Directives & Work Assignments
                </h3>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {isApplicant ? '0 Tasks (Locked)' : canManageWork ? `${workAssignments.length} Tasks` : `${workAssignments.filter(t => (t.assignedTo?.email || '').toLowerCase() === (user?.email || '').toLowerCase() || (t.assignedTo?.name || '').toLowerCase() === (user?.name || '').toLowerCase()).length} Tasks`}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {isApplicant
                  ? 'Task assignments & deliverables are locked pending Trustee identity and background clearance.'
                  : canManageWork 
                  ? 'Dispatch tasks from Admin to Management and Management to Volunteers.'
                  : 'Execute assigned field duties, check off deliverables, and submit completion logs.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isApplicant && <OfflineSyncBadge onOpenSyncModal={onOpenWorkAssignments} />}
            {onOpenWorkAssignments && (
              <button
                type="button"
                onClick={onOpenWorkAssignments}
                className={`text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isApplicant 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isApplicant ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Review Access Status</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{canManageWork ? 'Assign Work / View Hub' : 'View My Tasks'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Task View / Security Isolation */}
        {isApplicant ? (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Field Directives Locked — Trustee Verification Pending
                </h4>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Your volunteer profile for <strong>{user?.name}</strong> is awaiting Board of Trustees authorization. In compliance with Statutory Child Safeguarding (PoCSO) and Field Operations SOPs, field directives and task deliverables will appear here once your account is verified.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-black uppercase tracking-wider text-amber-900">
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </div>
          </div>
        ) : isVolunteer ? (
          (() => {
            const userEmail = (user?.email || '').toLowerCase();
            const userName = (user?.name || '').toLowerCase();
            const myTasks = workAssignments.filter(t => 
              (t.assignedTo?.email || '').toLowerCase() === userEmail ||
              (t.assignedTo?.name || '').toLowerCase() === userName
            );

            if (myTasks.length === 0) {
              return (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-blue-950 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-blue-900">No Pending Directives</h4>
                      <p className="text-[11px] text-blue-800">
                        You currently have 0 active field tasks assigned to your profile. New tasks dispatched by your coordinator will appear here.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={onOpenWorkAssignments}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 cursor-pointer active:scale-[0.99] ${
                      task.status === 'completed'
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                        : task.priority === 'Urgent'
                        ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                        : 'bg-gray-50 border-gray-200 hover:border-orange-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-gray-500 uppercase">#{task.id} • {task.category || 'General'}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        task.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'completed' ? '✅ Done' : (task.priority || 'Normal')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-snug truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                        <span className="font-semibold text-gray-700">{task.assignedBy?.name || 'Director'} ({task.assignedBy?.role || 'Admin'})</span>
                        <span>➔</span>
                        <span className="font-semibold text-orange-700">{task.assignedTo?.name || 'Volunteer'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span className="truncate max-w-[120px]">{task.location || 'Field Site'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>{task.estimatedHours || 4} hrs</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : canManageWork && workAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workAssignments.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={onOpenWorkAssignments}
                className={`p-3.5 rounded-2xl border transition-all space-y-2.5 cursor-pointer active:scale-[0.99] ${
                  task.status === 'completed'
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : task.priority === 'Urgent'
                    ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                    : 'bg-gray-50 border-gray-200 hover:border-orange-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-gray-500 uppercase">#{task.id} • {task.category || 'General'}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    task.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status === 'completed' ? '✅ Done' : (task.priority || 'Normal')}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">{task.assignedBy?.name || 'Director'} ({task.assignedBy?.role || 'Admin'})</span>
                    <span>➔</span>
                    <span className="font-semibold text-orange-700">{task.assignedTo?.name || 'Volunteer'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span className="truncate max-w-[120px]">{task.location || 'Field Site'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{task.estimatedHours || 4} hrs</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic py-2">No active tasks assigned yet.</p>
        )}
      </div>

      {/* Hero Header for Applicants / General Audience */}
      {!isVolunteer && (
        <div className="bg-gradient-to-br from-gray-900 via-zinc-900 to-black rounded-[2rem] p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-orange-300">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Grassroots Volunteer Movement</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Create Direct Grassroots Impact.
            </h2>
            <p className="text-xs text-zinc-300 max-w-sm leading-relaxed">
              Dedicate your time in smart classroom teaching, medical van clinics, clean water installation, or food drives to empower underprivileged communities.
            </p>
          </div>
        </div>
      )}

      {/* Upcoming Field Drives & Service Opportunities */}
      <div className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 block">
              Field Opportunities
            </span>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase">
              Upcoming Relief Drives & Shifts
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
            Open for Signups
          </span>
        </div>

        <div className="space-y-2.5">
          {drives.map((drive) => {
            const isSignedUp = signedUpDriveIds.includes(drive.id);
            return (
              <div
                key={drive.id}
                id={`volunteer-drive-${drive.id}`}
                className="bg-[#F8F9FA] hover:bg-orange-50/40 rounded-2xl p-4 border border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-md text-gray-700 border border-gray-200">
                      {drive.category}
                    </span>
                    <span className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {drive.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{drive.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{drive.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{drive.time}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleDriveSignUp(drive.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs ${
                      isSignedUp
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-900 hover:bg-black text-white active:scale-95'
                    }`}
                  >
                    {isSignedUp ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Shift Confirmed</span>
                      </>
                    ) : (
                      <>
                        <span>Join Shift</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volunteer Application Form (Shown for Guests & Donors wanting to join) */}
      {!isVolunteer && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                Join our Ground Team
              </span>
              <h3 className="text-xs font-extrabold uppercase text-gray-900">
                Official Volunteer Registration
              </h3>
            </div>
            {isDonor && (
              <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Donor Profile Detected
              </span>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="vol-name" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="vol-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="vol-email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="vol-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="vol-phone" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Contact Phone (WhatsApp for Field Alerts)
            </label>
            <input
              type="tel"
              id="vol-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Skills Dropdown */}
          <div>
            <label htmlFor="vol-skills" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Skillset / Domain of Interest
            </label>
            <div className="relative">
              <select
                id="vol-skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              >
                <option value="">Select your focus skill</option>
                {SKILL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Availability Field */}
          <div>
            <label htmlFor="vol-availability" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Availability
            </label>
            <input
              type="text"
              id="vol-availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekends, 4-6 hrs/week, or monthly field trips"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Submit Application Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="submit-volunteer-application-btn"
              disabled={!name || !email}
              className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Volunteer Application</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 uppercase font-bold tracking-wider pt-1">
            Official Volunteer Certificate provided upon completion of 20 service hours.
          </p>
        </form>
      )}

      {/* Log Hours Modal for Active Volunteers */}
      {showLogHoursModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">Log Volunteer Service</h3>
                  <p className="text-[10px] text-gray-500">Record your hours for trustee certification</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogHoursModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase"
              >
                ✕
              </button>
            </div>

            {logSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">{logSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleLogHoursSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Hours Served
                  </label>
                  <div className="flex items-center gap-2">
                    {[2, 4, 6, 8].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setLogHoursCount(h)}
                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
                          logHoursCount === h
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {h} hrs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Activity & Field Mission Summary
                  </label>
                  <textarea
                    value={logActivityNote}
                    onChange={(e) => setLogActivityNote(e.target.value)}
                    placeholder="e.g. Conducted maths teaching session for 35 children at village primary school"
                    rows={3}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogHoursModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold uppercase text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs transition-all"
                  >
                    Submit Hours
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
