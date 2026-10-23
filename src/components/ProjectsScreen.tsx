import React, { useState, Suspense, lazy } from 'react';
import { Project, UserProfile } from '../types';
import { Search, Filter, Sparkles, CheckCircle2, Share2, Plus, Edit3, ShieldCheck } from 'lucide-react';
import type { ShareContent } from './ShareModal';

const ShareModal = lazy(() => import('./ShareModal').then(m => ({ default: m.ShareModal })));

interface ProjectsScreenProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDonateToProject: (project: Project) => void;
  user?: UserProfile;
  onEditProject?: (project: Project) => void;
  onAddNewProject?: () => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  onSelectProject,
  onDonateToProject,
  user,
  onEditProject,
  onAddNewProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareItem, setShareItem] = useState<ShareContent | null>(null);

  const isAdmin = user?.role === 'admin';
  const isManagement = user?.role === 'management';
  const isVolunteer = user?.role === 'volunteer';
  const categories = ['All', 'Education', 'Water', 'Healthcare', 'Hunger'];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesQuery =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="pb-8 p-3.5 sm:p-4 space-y-4 animate-fadeIn">
      {/* Admin Full Control Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-sm border border-purple-800">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 p-1.5 rounded-xl text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block text-purple-200">
                Admin Full Control Mode
              </span>
              <span className="text-[11px] text-purple-300">
                Full permission to create, edit, approve, publish, and delete live campaigns.
              </span>
            </div>
          </div>
          {onAddNewProject && (
            <button
              id="admin-add-new-campaign-btn"
              onClick={onAddNewProject}
              className="bg-white text-purple-950 hover:bg-purple-50 active:scale-95 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Campaign</span>
            </button>
          )}
        </div>
      )}

      {/* Management Controlled Write Banner */}
      {isManagement && (
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-sm border border-blue-800">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 p-1.5 rounded-xl text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block text-blue-200">
                Management Mode (Admin Approval Required)
              </span>
              <span className="text-[11px] text-blue-300">
                Create and update campaign proposals. All modifications route to Admin before public release.
              </span>
            </div>
          </div>
          {onAddNewProject && (
            <button
              id="mgmt-submit-campaign-proposal-btn"
              onClick={onAddNewProject}
              className="bg-white text-blue-950 hover:bg-blue-50 active:scale-95 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Proposal</span>
            </button>
          )}
        </div>
      )}

      {/* Bento Search & Category Filter Tile */}
      <div className="bg-white border border-gray-200 rounded-[2rem] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Active Programs & Campaigns
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-orange-600">
              {filteredProjects.length} Initiatives
            </span>
            {isAdmin && onAddNewProject && (
              <button
                onClick={onAddNewProject}
                className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full transition-colors hidden sm:inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="projects-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search causes, regions or relief initiatives..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-pill-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'All Causes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className="bg-white rounded-[2rem] border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col group relative"
          >
            {/* Project Image */}
            <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                {project.category}
              </span>
              {project.urgency === 'High' && (
                <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Critical
                </span>
              )}

              {/* Admin Quick Edit Badge on Image (Admin Only) */}
              {isAdmin && onEditProject && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  className="absolute bottom-3 right-3 bg-purple-700/90 hover:bg-purple-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border border-purple-400/40 shadow-xs flex items-center gap-1 transition-all"
                  title="Admin: Edit this campaign content & image"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Media</span>
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1 space-y-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h2>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Bento Progress Bar Container */}
              <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-gray-100 space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(project.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-orange-600">
                    {project.percentage}% Funded
                  </span>
                  <span className="text-gray-700 font-mono text-[11px]">
                    ₹{(project.raisedAmount ?? 0).toLocaleString('en-IN')} / ₹{(project.targetAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex gap-2">
                <button
                  id={`share-btn-${project.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareItem({
                      title: project.title,
                      text: project.description,
                      category: project.category,
                      image: project.image,
                      metric: `${project.percentage}% Funded (₹${(project.raisedAmount ?? 0).toLocaleString('en-IN')})`
                    });
                  }}
                  className="p-2.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 rounded-2xl transition-colors shadow-2xs flex items-center justify-center flex-shrink-0"
                  title="Share Campaign on Social Media"
                  aria-label={`Share ${project.title}`}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* If Admin, show Edit button alongside Details & Donate */}
                {isAdmin && onEditProject && (
                  <button
                    onClick={() => onEditProject(project)}
                    className="px-3 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                    title="Edit Program Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                <button
                  id={`learn-more-btn-${project.id}`}
                  onClick={() => onSelectProject(project)}
                  className="flex-1 bg-gray-900 hover:bg-black active:scale-98 text-white font-bold py-2.5 px-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Details</span>
                </button>
                <button
                  id={`quick-donate-btn-${project.id}`}
                  onClick={() => onDonateToProject(project)}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs whitespace-nowrap"
                  title="Direct Donation"
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-gray-200 p-6 col-span-full">
            <Filter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-extrabold text-gray-900 text-sm uppercase">No campaigns match your filter</h3>
            <p className="text-xs text-gray-500 mt-1">Try searching for other missions like Education or Water.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-orange-50 text-xs font-bold text-orange-600 uppercase tracking-wider hover:bg-orange-100"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Social Media Sharing Modal */}
      {Boolean(shareItem) && (
        <Suspense fallback={null}>
          <ShareModal
            isOpen={Boolean(shareItem)}
            onClose={() => setShareItem(null)}
            content={shareItem}
          />
        </Suspense>
      )}
    </div>
  );
};
