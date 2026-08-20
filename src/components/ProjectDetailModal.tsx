import React, { useState } from 'react';
import { Project, UserProfile } from '../types';
import { 
  X, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Share2,
  Edit3,
  QrCode
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onDonate: (project: Project) => void;
  user?: UserProfile;
  onEditProject?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onDonate,
  user,
  onEditProject
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const isAdmin = user?.role === 'admin';

  if (!project) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-white dark:bg-gray-900 rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col text-gray-900 dark:text-gray-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header Image */}
          <div className="relative aspect-[16/10] w-full bg-gray-900 overflow-hidden flex-shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && onEditProject && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditProject(project);
                  }}
                  className="px-3 py-1.5 rounded-full bg-purple-700/90 hover:bg-purple-800 text-white flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-purple-400/40 shadow-xs transition-all"
                  title="Admin: Edit this campaign"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
              )}
              <button
                id="share-project-header-btn"
                onClick={() => setShowShareModal(true)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-md cursor-pointer"
                title="Share this Campaign"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                id="close-project-modal-btn"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {project.category}
              </span>
              {project.urgency === 'High' && (
                <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Urgent Need
                </span>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4 flex-1">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug tracking-tight">
                {project.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {project.beneficiariesCount}
                </span>
              </div>
            </div>

            {/* Progress Card Bento */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-gray-100">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-extrabold">{project.percentage}% Funded</span>
                <span>₹{project.raisedAmount.toLocaleString('en-IN')} / ₹{project.targetAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(project.percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-semibold pt-1">
                <span>Goal: ₹{project.targetAmount.toLocaleString('en-IN')}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 80G Tax Deductible
                </span>
              </div>
            </div>

            {/* About Campaign */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                About This Initiative
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Project Updates */}
            {project.updates && project.updates.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Recent Field Updates
                </h3>
                <div className="space-y-2.5">
                  {project.updates.map((update, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{update.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{update.date}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 flex gap-2.5">
            <button
              id="modal-share-campaign-btn"
              onClick={() => setShowShareModal(true)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 shadow-xs font-bold text-xs uppercase tracking-wider cursor-pointer"
              title="Share Campaign on Social Media"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              id="modal-donate-now-btn"
              onClick={() => {
                onClose();
                onDonate(project);
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Donate via UPI / QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={{
          title: project.title,
          text: project.description,
          category: project.category,
          image: project.image,
          metric: `${project.percentage}% Funded (₹${project.raisedAmount.toLocaleString('en-IN')})`
        }}
      />
    </>
  );
};
