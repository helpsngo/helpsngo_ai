import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  Mail, 
  Sparkles,
  ExternalLink,
  Heart
} from 'lucide-react';

export interface ShareContent {
  title: string;
  text: string;
  url?: string;
  category?: string;
  image?: string;
  authorOrBeneficiary?: string;
  metric?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  content
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !content) return null;

  const shareUrl = content.url || (typeof window !== 'undefined' ? window.location.href : 'https://helpsngo.org');
  const fullShareText = `${content.title}\n\n"${content.text}"\n\nSupport this cause via Helps NGO: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: `${content.title} - ${content.text}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${content.title} - "${content.text}" #HelpsNGO #Impact`);
  const encodedEmailSubject = encodeURIComponent(`Inspiring Cause: ${content.title}`);
  const encodedEmailBody = encodeURIComponent(`${content.title}\n\n${content.text}\n\nLearn more and support at: ${shareUrl}`);

  const shareChannels = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      iconBg: 'bg-emerald-600',
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black hover:bg-gray-800 text-white',
      iconBg: 'bg-neutral-800',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      iconBg: 'bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      iconBg: 'bg-[#004182]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Email',
      color: 'bg-gray-700 hover:bg-gray-800 text-white',
      iconBg: 'bg-gray-800',
      href: `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Spread The Word
              </h3>
              <h2 className="text-sm font-black text-gray-900 tracking-tight">
                Share on Social Media
              </h2>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Card Preview Preview */}
          <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-1 text-orange-600">
                <Sparkles className="w-3 h-3" />
                {content.category || 'Helps NGO Initiative'}
              </span>
              {content.metric && (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {content.metric}
                </span>
              )}
            </div>

            <div className="flex gap-3 items-center">
              {content.image && (
                <img
                  src={content.image}
                  alt={content.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white shadow-2xs"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-gray-900 leading-snug line-clamp-1">
                  {content.title}
                </h4>
                <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 italic">
                  "{content.text}"
                </p>
              </div>
            </div>
          </div>

          {/* Direct Social Channels Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
              Select Social Platform
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shareChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs ${channel.color}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{channel.name}</span>
                </a>
              ))}

              {/* Native System Share (Mobile/Tablet) */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white transition-all active:scale-95 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>More...</span>
              </button>
            </div>
          </div>

          {/* Copy Link & Full Text */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
              Share Link
            </span>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 pr-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-gray-700 font-mono px-2 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] font-bold text-emerald-600 px-1 animate-fadeIn">
                ✓ Full impact story & campaign link copied to clipboard!
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-medium">
            Sharing helps multiply NGO reach and inspire donors worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};
