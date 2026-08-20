import React, { useState } from 'react';
import { Project, OrgStats, ImpactStory, FieldDispatch, TabType, DonationRecord } from '../types';
import { 
  X, 
  Sparkles, 
  FolderKanban, 
  BarChart3, 
  HeartHandshake, 
  Radio, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Search,
  ExternalLink
} from 'lucide-react';

interface AdminContentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  stats: OrgStats;
  stories: ImpactStory[];
  dispatches: FieldDispatch[];
  donations?: DonationRecord[];
  onOpenEditProject: (project: Project | null) => void;
  onOpenEditStats: () => void;
  onOpenEditStory: (story: ImpactStory | null) => void;
  onSaveDispatch: (dispatch: FieldDispatch) => void;
  onDeleteDispatch: (dispatchId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteStory: (storyId: string) => void;
  onNavigate: (tab: TabType) => void;
  onApproveDonation?: (donationId: string) => void;
  onRejectDonation?: (donationId: string, reason?: string) => void;
  onViewReceipt?: (donation: DonationRecord) => void;
}

export const AdminContentStudioModal: React.FC<AdminContentStudioModalProps> = ({
  isOpen,
  onClose,
  projects,
  stats,
  stories,
  dispatches,
  donations = [],
  onOpenEditProject,
  onOpenEditStats,
  onOpenEditStory,
  onSaveDispatch,
  onDeleteDispatch,
  onDeleteProject,
  onDeleteStory,
  onNavigate,
  onApproveDonation,
  onRejectDonation,
  onViewReceipt
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'programs' | 'stats' | 'stories' | 'dispatches'>('programs');
  const [searchQuery, setSearchQuery] = useState('');

  // Approvals filter state
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const pendingDonationCount = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending').length;

  // Dispatch inline state
  const [isAddingDispatch, setIsAddingDispatch] = useState(false);
  const [newDispatchTitle, setNewDispatchTitle] = useState('');
  const [newDispatchMeta, setNewDispatchMeta] = useState('');
  const [newDispatchCategory, setNewDispatchCategory] = useState('Education');
  const [newDispatchDate, setNewDispatchDate] = useState('Today');

  if (!isOpen) return null;

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDispatchTitle.trim()) return;

    const created: FieldDispatch = {
      id: `disp-${Date.now()}`,
      title: newDispatchTitle.trim(),
      meta: newDispatchMeta.trim() || 'Verified Ground Update',
      category: newDispatchCategory,
      date: newDispatchDate.trim() || 'Today',
      iconType: newDispatchCategory === 'Education' ? 'classroom' : newDispatchCategory === 'Healthcare' ? 'clinic' : newDispatchCategory === 'Water' ? 'water' : 'general'
    };

    onSaveDispatch(created);
    setNewDispatchTitle('');
    setNewDispatchMeta('');
    setIsAddingDispatch(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2.2rem] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Studio Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 text-white flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight">
                  Helps NGO Content Studio
                </h2>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                  Admin Active
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                Modify campaigns, statistics, stories, and dispatches in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 p-1.5 border-b border-gray-200 flex items-center gap-1 overflow-x-auto scrollbar-none sticky top-[68px] z-20">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'approvals'
                ? 'bg-white text-orange-600 shadow-xs font-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>80G Approvals</span>
            {pendingDonationCount > 0 && (
              <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {pendingDonationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'programs'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Programs ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Org Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'stories'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Stories ({stories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatches')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'dispatches'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Field Updates ({dispatches.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 space-y-4 flex-1">
          {/* TAB 0: 80G TAX EXEMPTION & BADGE APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    80G Tax Exemption & Badge Approval Queue
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Review and verify donor contributions to authorize official downloadable 80G certificates & unlock achievement badges.
                  </p>
                </div>

                {pendingDonationCount > 0 && onApproveDonation && (
                  <button
                    onClick={() => {
                      const pendingList = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending');
                      pendingList.forEach(d => onApproveDonation(d.id));
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve All Pending ({pendingDonationCount})</span>
                  </button>
                )}
              </div>

              {/* Approval Filter Chips */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setApprovalFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'pending'
                      ? 'bg-amber-500 text-black font-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending ({pendingDonationCount})
                </button>
                <button
                  onClick={() => setApprovalFilter('approved')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'approved'
                      ? 'bg-emerald-600 text-white font-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Approved ({donations.filter(d => d.approvalStatus === 'approved').length})
                </button>
                <button
                  onClick={() => setApprovalFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    approvalFilter === 'all'
                      ? 'bg-gray-900 text-white font-black shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({donations.length})
                </button>
              </div>

              {/* Donations List in Content Studio */}
              <div className="space-y-2.5">
                {donations
                  .filter(d => {
                    const status = d.approvalStatus || 'pending';
                    if (approvalFilter !== 'all' && status !== approvalFilter) return false;
                    return true;
                  })
                  .map((donation) => {
                    const status = donation.approvalStatus || 'pending';
                    const isPending = status === 'pending';
                    const isApproved = status === 'approved';

                    return (
                      <div
                        key={donation.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isPending
                            ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] font-bold bg-white border border-gray-200 px-1.5 py-0.2 rounded">
                              {donation.id}
                            </span>
                            <span className="font-extrabold text-xs text-gray-900">
                              {donation.donorName || 'Generous Supporter'}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              ({donation.donorEmail || 'no-email'})
                            </span>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                              ₹{donation.amount.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-gray-600">
                            <span>PAN: <strong className="font-mono">{donation.donorTaxId || 'PAN-UNASSIGNED'}</strong></span>
                            <span>•</span>
                            <span>{donation.title}</span>
                            <span>•</span>
                            <span className="font-mono">{donation.date}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                          {onViewReceipt && (
                            <button
                              onClick={() => onViewReceipt(donation)}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-[10px] font-bold border border-gray-200 shadow-xs flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          )}

                          {isPending && onApproveDonation && (
                            <button
                              onClick={() => onApproveDonation(donation.id)}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1 transition-all"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve 80G</span>
                            </button>
                          )}

                          {isApproved && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 1: PROGRAMS & CAMPAIGNS */}
          {activeTab === 'programs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Live Relief Programs & Fundraising Goals
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Control goals, images, updates, and descriptions
                  </p>
                </div>
                <button
                  id="admin-studio-add-program-btn"
                  onClick={() => onOpenEditProject(null)}
                  className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Campaign</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
                            {proj.category}
                          </span>
                          {proj.urgency === 'High' && (
                            <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md">
                              Urgent
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono mt-0.5">
                          <span className="text-orange-600 font-bold font-sans">
                            {proj.percentage}% funded
                          </span>
                          <span>₹{proj.raisedAmount.toLocaleString('en-IN')} / ₹{proj.targetAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => onOpenEditProject(proj)}
                        className="p-2 bg-white hover:bg-orange-50 hover:text-orange-600 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold uppercase flex items-center gap-1 transition-colors shadow-2xs"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${proj.title}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-2 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 rounded-xl transition-colors shadow-2xs"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ORG METRICS & MISSION BANNER */}
          {activeTab === 'stats' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Live Organization Impact Metrics
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Displayed prominently on Homepage & Trust Portals
                  </p>
                </div>
                <button
                  onClick={onOpenEditStats}
                  className="bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Metrics & Hero</span>
                </button>
              </div>

              {/* Bento Preview Card */}
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Current Mission Headline:
                  </span>
                  <h4 className="text-base font-extrabold text-gray-900">
                    {stats.missionHeadline}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {stats.missionDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-orange-200/60 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Children Educated</span>
                    <span className="font-extrabold text-blue-600 text-sm">{stats.childrenEducated}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Meals Served</span>
                    <span className="font-extrabold text-emerald-600 text-sm">{stats.mealsServed}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Lives Touched</span>
                    <span className="font-extrabold text-orange-600 text-sm">{stats.livesTouched}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Water Wells</span>
                    <span className="font-extrabold text-cyan-600 text-sm">{stats.waterWellsInstalled}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Volunteers</span>
                    <span className="font-extrabold text-purple-600 text-sm">{stats.volunteersActive}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">80G Trust Reg.</span>
                    <span className="font-mono text-emerald-800 text-[10px] font-bold truncate block">{stats.trustRegistration}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPACT STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Beneficiary Testimonials & Impact Stories
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Rotated dynamically on the homepage carousel
                  </p>
                </div>
                <button
                  onClick={() => onOpenEditStory(null)}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Story</span>
                </button>
              </div>

              <div className="space-y-3">
                {stories.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl transition-all shadow-xs flex items-start justify-between gap-3"
                  >
                    <img
                      src={st.image}
                      alt={st.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {st.name} {st.age ? `(${st.age} yrs)` : ''}
                        </h4>
                        <span className="text-[9px] font-bold uppercase bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-md">
                          {st.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium truncate">{st.role} • {st.location}</p>
                      <p className="text-xs text-gray-700 italic mt-1 line-clamp-1">
                        "{st.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditStory(st)}
                        className="p-2 bg-white hover:bg-purple-50 text-gray-600 hover:text-purple-700 border border-gray-200 rounded-xl text-xs transition-colors"
                        title="Edit Story"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete story for "${st.name}"?`)) {
                            onDeleteStory(st.id);
                          }
                        }}
                        className="p-2 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 rounded-xl text-xs transition-colors"
                        title="Delete Story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FIELD DISPATCHES */}
          {activeTab === 'dispatches' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Homepage Live Field Dispatches
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Real-time field updates shown to supporters
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingDispatch(!isAddingDispatch)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingDispatch ? 'Cancel' : 'Post Dispatch'}</span>
                </button>
              </div>

              {/* Add Dispatch Form */}
              {isAddingDispatch && (
                <form onSubmit={handleCreateDispatch} className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2.5 animate-fadeIn">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    New Field Dispatch Broadcast
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Dispatch Headline (e.g. New Primary Classroom in Rajasthan)"
                        value={newDispatchTitle}
                        onChange={(e) => setNewDispatchTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <select
                        value={newDispatchCategory}
                        onChange={(e) => setNewDispatchCategory(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Water">Water</option>
                        <option value="Hunger">Hunger</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Impact Metric (e.g. 150 Children Enrolled)"
                      value={newDispatchMeta}
                      onChange={(e) => setNewDispatchMeta(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Timeline (e.g. 2 days ago)"
                      value={newDispatchDate}
                      onChange={(e) => setNewDispatchDate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Publish Dispatch
                    </button>
                  </div>
                </form>
              )}

              {/* Dispatches List */}
              <div className="space-y-2">
                {dispatches.map((disp) => (
                  <div
                    key={disp.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 truncate">{disp.title}</span>
                        <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded">
                          {disp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {disp.meta} • {disp.date}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteDispatch(disp.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5"
                      title="Delete Dispatch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Studio Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Changes persist immediately across donor interfaces</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
