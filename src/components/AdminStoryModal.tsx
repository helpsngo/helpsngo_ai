import React, { useState, useRef } from 'react';
import { ImpactStory, UserProfile } from '../types';
import { IMAGE_PRESETS } from '../data/mockData';
import { 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  Trash2, 
  Quote, 
  User, 
  MapPin,
  Upload,
  FileImage,
  AlertTriangle
} from 'lucide-react';

interface AdminStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyToEdit: ImpactStory | null;
  onSaveStory: (story: ImpactStory) => void;
  onDeleteStory?: (storyId: string) => void;
  user?: UserProfile;
}

export const AdminStoryModal: React.FC<AdminStoryModalProps> = ({
  isOpen,
  onClose,
  storyToEdit,
  onSaveStory,
  onDeleteStory,
  user
}) => {
  const isEditing = Boolean(storyToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(storyToEdit?.name || '');
  const [role, setRole] = useState(storyToEdit?.role || '');
  const [age, setAge] = useState<number | string>(storyToEdit?.age || '');
  const [category, setCategory] = useState<ImpactStory['category']>(storyToEdit?.category || 'Education');
  const [location, setLocation] = useState(storyToEdit?.location || '');
  const [quote, setQuote] = useState(storyToEdit?.quote || '');
  const [story, setStory] = useState(storyToEdit?.story || '');
  const [impactMetric, setImpactMetric] = useState(storyToEdit?.impactMetric || '');
  const [image, setImage] = useState(storyToEdit?.image || IMAGE_PRESETS[4].url);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
              Only verified NGO Management Administrators have permission to post or edit beneficiary stories.
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
    if (!name.trim() || !quote.trim()) return;

    const updated: ImpactStory = {
      id: storyToEdit?.id || `story-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Beneficiary',
      age: age ? Number(age) : undefined,
      category,
      location: location.trim() || 'India',
      quote: quote.trim(),
      story: story.trim() || quote.trim(),
      impactMetric: impactMetric.trim() || 'Verified Grassroots Impact',
      image: image.trim() || IMAGE_PRESETS[4].url
    };

    onSaveStory(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight">
                {isEditing ? 'Edit Beneficiary Story & Media' : 'Add New Impact Story'}
              </h2>
              <p className="text-[10px] text-purple-200 font-mono">
                Admin Media Upload & Testimonial Sync
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
          {/* Image Upload & Management */}
          <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                Beneficiary Portrait Photo
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Admin Media
              </span>
            </label>

            {/* Live Preview */}
            <div className="flex gap-3 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-900 border border-gray-300 flex-shrink-0 shadow-sm relative">
                <img
                  src={image}
                  alt="Portrait preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGE_PRESETS[4].url;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                {uploadedFileName ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 truncate mb-1.5">
                    <FileImage className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{uploadedFileName}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 mb-1.5 font-medium">
                    Upload a high-resolution photo of the beneficiary or program recipient.
                  </p>
                )}
                <input
                  type="url"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setUploadedFileName(null);
                  }}
                  placeholder="Or paste image URL..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Local Computer File Upload Dropzone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-purple-500 bg-purple-50/80 scale-[0.99]' 
                  : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="admin-story-file-input"
              />
              <div className="flex flex-col items-center justify-center gap-1 text-xs">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-0.5">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <p className="font-bold text-gray-900 text-[11px]">
                  Click to upload portrait photo from your computer
                </p>
                <p className="text-[9px] text-gray-500">
                  or drag and drop photo file here (PNG, JPG, WebP)
                </p>
              </div>
            </div>

            {/* Quick preset selector */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Presets:
              </span>
              <div className="grid grid-cols-2 gap-1 max-h-20 overflow-y-auto">
                {IMAGE_PRESETS.slice(4).concat(IMAGE_PRESETS.slice(0, 4)).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setUploadedFileName(null);
                    }}
                    className={`text-left p-1 rounded-md text-[10px] font-medium border truncate ${
                      image === preset.url
                        ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Beneficiary Name, Role & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Beneficiary Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 14"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Role & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Class 9 STEM Scholar"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ImpactStory['category'])}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Water">Water</option>
                <option value="Hunger">Hunger</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          {/* Location & Impact Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-600" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Impact Metric Badge
              </label>
              <input
                type="text"
                value={impactMetric}
                onChange={(e) => setImpactMetric(e.target.value)}
                placeholder="e.g. 1st in District Science Fair"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Direct Quote */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Quote className="w-3 h-3 text-purple-600" />
              Direct Beneficiary Quote *
            </label>
            <textarea
              required
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="“Before the learning center opened, I had to drop out. Now I want to become a software engineer.”"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Full Story Details */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Detailed Background Story
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Helps NGO provided digital learning tools, uniforms, and mentorship..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            {isEditing && onDeleteStory && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete this story for "${storyToEdit?.name}"?`)) {
                    onDeleteStory(storyToEdit!.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
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
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save Story' : 'Publish Story'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
