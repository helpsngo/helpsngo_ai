import React, { useState, useRef } from 'react';
import { Project, ProjectUpdate, UserProfile } from '../types';
import { IMAGE_PRESETS } from '../data/mockData';
import { 
  X, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  Users,
  Upload,
  FileImage,
  RefreshCw
} from 'lucide-react';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit: Project | null;
  onSaveProject: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  user?: UserProfile;
}

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  onSaveProject,
  onDeleteProject,
  user
}) => {
  const isEditing = Boolean(projectToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [longDescription, setLongDescription] = useState(projectToEdit?.longDescription || '');
  const [category, setCategory] = useState<Project['category']>(projectToEdit?.category || 'Education');
  const [image, setImage] = useState(projectToEdit?.image || IMAGE_PRESETS[0].url);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [raisedAmount, setRaisedAmount] = useState<number>(projectToEdit?.raisedAmount || 0);
  const [targetAmount, setTargetAmount] = useState<number>(projectToEdit?.targetAmount || 1000000);
  const [location, setLocation] = useState(projectToEdit?.location || 'Pan-India Rural Belts');
  const [beneficiariesCount, setBeneficiariesCount] = useState(projectToEdit?.beneficiariesCount || '5,000+ People Supported');
  const [urgency, setUrgency] = useState<'High' | 'Normal'>(projectToEdit?.urgency || 'Normal');
  const [updates, setUpdates] = useState<ProjectUpdate[]>(projectToEdit?.updates || []);

  // New update input fields
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateDesc, setNewUpdateDesc] = useState('');
  const [newUpdateDate, setNewUpdateDate] = useState('Today');
  const [showAddUpdate, setShowAddUpdate] = useState(false);

  if (!isOpen) return null;

  // Strict Admin Role Check
  if (user && user.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-[2rem] max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Admin Authorization Required</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Only verified NGO Management Administrators have permission to create or modify campaigns, programs, and visual media.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
          >
            Return to App
          </button>
        </div>
      </div>
    );
  }

  // Handle local file selection
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPEG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const percentage = targetAmount > 0 ? Math.min(Math.round((raisedAmount / targetAmount) * 100), 100) : 0;

    const updated: Project = {
      id: projectToEdit?.id || `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      category,
      image: image.trim() || IMAGE_PRESETS[0].url,
      raisedAmount: Number(raisedAmount),
      targetAmount: Number(targetAmount),
      percentage,
      location: location.trim(),
      beneficiariesCount: beneficiariesCount.trim(),
      urgency,
      updates
    };

    onSaveProject(updated);
    onClose();
  };

  const handleAddUpdate = () => {
    if (!newUpdateTitle.trim() || !newUpdateDesc.trim()) return;
    const newUp: ProjectUpdate = {
      title: newUpdateTitle.trim(),
      description: newUpdateDesc.trim(),
      date: newUpdateDate.trim() || 'Just now'
    };
    setUpdates([newUp, ...updates]);
    setNewUpdateTitle('');
    setNewUpdateDesc('');
    setShowAddUpdate(false);
  };

  const handleRemoveUpdate = (index: number) => {
    setUpdates(updates.filter((_, idx) => idx !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2rem] max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-1.5 rounded-lg text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight">
                {isEditing ? 'Edit Program Content & Media' : 'Create New Relief Program'}
              </h2>
              <p className="text-[10px] text-orange-100 font-mono">
                Admin Authorized • Local Image Upload & Instant Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
          {/* Image Upload & Media Management */}
          <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                Cover Image & Visual Media
              </label>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Admin Media Upload
              </span>
            </div>

            {/* Live Image Preview */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-300 shadow-inner">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                }}
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase">
                {category}
              </div>
              {uploadedFileName && (
                <div className="absolute bottom-2 left-2 bg-emerald-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                  <FileImage className="w-3 h-3" />
                  <span className="max-w-[200px] truncate">Uploaded: {uploadedFileName}</span>
                </div>
              )}
            </div>

            {/* Local Computer File Upload Dropzone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50/80 scale-[0.99]' 
                  : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="admin-project-file-input"
              />
              <div className="flex flex-col items-center justify-center gap-1 text-xs">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-0.5">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="font-extrabold text-gray-900">
                  Click to upload image from your computer
                </p>
                <p className="text-[10px] text-gray-500">
                  or drag and drop your photo file here (JPG, PNG, WebP)
                </p>
              </div>
            </div>

            {/* Custom Image URL Input */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Or enter image web URL:
              </span>
              <input
                type="url"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setUploadedFileName(null);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Curated Presets */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Or pick a preset photo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pr-1">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setUploadedFileName(null);
                    }}
                    className={`text-left p-1.5 rounded-lg text-[10px] font-semibold border transition-all truncate flex items-center gap-1.5 ${
                      image === preset.url
                        ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Program Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rural Primary School STEM Program"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Cause Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Project['category'])}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Water">Water</option>
                <option value="Hunger">Hunger</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          {/* Target & Raised Financials (₹ INR) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Funding Goal (₹ INR) *
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Amount Raised (₹ INR)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={raisedAmount}
                onChange={(e) => setRaisedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs font-bold text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Urgency Status
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'High' | 'Normal')}
                className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Normal">Normal</option>
                <option value="High">🚨 Critical Urgency</option>
              </select>
            </div>
          </div>

          {/* Location & Beneficiaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-600" />
                Target Geography / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Marathwada & Bundelkhand Rural"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" />
                Beneficiary Impact Metric
              </label>
              <input
                type="text"
                value={beneficiariesCount}
                onChange={(e) => setBeneficiariesCount(e.target.value)}
                placeholder="e.g. 18,000+ Villagers & Families"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Short Summary Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief 1-2 sentence pitch shown on campaign cards..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Detailed Story & Methodology
            </label>
            <textarea
              rows={3}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Full comprehensive background, deployment plan, and 80G tax benefit details..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Field Updates Manager */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Field Progress Updates ({updates.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddUpdate(!showAddUpdate)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 flex items-center gap-1 uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddUpdate ? 'Cancel' : 'Post Field Update'}</span>
              </button>
            </div>

            {showAddUpdate && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Update headline..."
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Timeline (e.g. 2 days ago)"
                    value={newUpdateDate}
                    onChange={(e) => setNewUpdateDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <textarea
                  placeholder="Update details (e.g. New textbooks and desks delivered to village schools)"
                  value={newUpdateDesc}
                  onChange={(e) => setNewUpdateDesc(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddUpdate}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider"
                >
                  Add to Program
                </button>
              </div>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {updates.map((u, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{u.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{u.date}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{u.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUpdate(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1"
                    title="Remove update"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {updates.length === 0 && !showAddUpdate && (
                <p className="text-[11px] text-gray-400 italic text-center py-2">
                  No field updates posted yet.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
            {isEditing && onDeleteProject && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${projectToEdit?.title}"?`)) {
                    onDeleteProject(projectToEdit!.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Program</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save Changes' : 'Publish Program'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
