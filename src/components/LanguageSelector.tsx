import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { SupportedLanguage } from '../types';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown' | 'modal_inline';
  className?: string;
  onLanguageChange?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
  onLanguageChange
}) => {
  const { language, currentLanguage, setLanguage, languages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange();
  };

  if (variant === 'modal_inline') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-bold text-xs flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('common.language', 'Language')} / भाषा</span>
          </label>
          <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            {currentLanguage.nativeName} ({currentLanguage.code.toUpperCase()})
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{lang.flagEmoji}</span>
                    <span className="font-extrabold text-xs">{lang.nativeName}</span>
                  </div>
                  <span className={`text-[10px] block truncate ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                    {lang.name}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 bg-white hover:bg-orange-50 text-gray-800 hover:text-orange-700 border border-gray-200 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
          title="Switch Language / भाषा बदलें"
        >
          <span className="text-xs">{currentLanguage.flagEmoji}</span>
          <span className="font-extrabold">{currentLanguage.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 p-1.5 z-50 animate-fadeIn space-y-1">
            <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 flex items-center justify-between">
              <span>Select Language</span>
              <Globe className="w-3 h-3 text-orange-600" />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-2.5 py-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    language === lang.code
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flagEmoji}</span>
                    <div>
                      <span className="block font-bold leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-gray-400 block">{lang.region}</span>
                    </div>
                  </div>
                  {language === lang.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default dropdown
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-gray-50 hover:bg-orange-50 text-gray-800 border border-gray-200 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-orange-600" />
        <span className="font-extrabold">{currentLanguage.nativeName}</span>
        <span className="text-gray-400 text-[10px] font-normal">({currentLanguage.code.toUpperCase()})</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 animate-fadeIn space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
            <span>Community Accessibility</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  language === lang.code
                    ? 'bg-orange-50 text-orange-700 font-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flagEmoji}</span>
                  <div>
                    <span className="block font-bold">{lang.nativeName}</span>
                    <span className="text-[10px] text-gray-500">{lang.name} • {lang.region}</span>
                  </div>
                </div>
                {language === lang.code && <Check className="w-4 h-4 text-orange-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
