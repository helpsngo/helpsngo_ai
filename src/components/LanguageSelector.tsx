import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { SupportedLanguage, LanguageOption } from '../types';
import { Globe, Check, ChevronDown, Search, Sparkles, Loader2, X } from 'lucide-react';

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
  const { language, currentLanguage, setLanguage, languages, isTranslating } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'indian' | 'global'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setFilterTab('all');
    }
  }, [isOpen]);

  const handleSelect = async (code: SupportedLanguage) => {
    await setLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange();
  };

  const filteredLanguages = useMemo(() => {
    return languages.filter((lang: LanguageOption) => {
      // Tab filter
      if (filterTab === 'indian' && lang.category !== 'indian') return false;
      if (filterTab === 'global' && lang.category !== 'global') return false;

      // Query search
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query) ||
        lang.region.toLowerCase().includes(query)
      );
    });
  }, [languages, filterTab, searchQuery]);

  // Modal inline variant (used inside Settings Modal)
  if (variant === 'modal_inline') {
    return (
      <div className={`space-y-3 notranslate ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>Website Language / वेबसाइट भाषा</span>
          </label>
          <div className="flex items-center gap-1.5">
            {isTranslating && (
              <span className="text-[10px] text-orange-600 flex items-center gap-1 font-semibold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Translating...
              </span>
            )}
            <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              {currentLanguage.nativeName} ({currentLanguage.code.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All ({languages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('indian')}
            className={`flex-1 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              filterTab === 'indian'
                ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🇮🇳 Indian ({languages.filter((l) => l.category === 'indian').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('global')}
            className={`flex-1 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              filterTab === 'global'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🌐 Global ({languages.filter((l) => l.category === 'global').length})
          </button>
        </div>

        {/* Grid Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="truncate pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{lang.flagEmoji}</span>
                    <span className="font-extrabold text-xs">{lang.nativeName}</span>
                  </div>
                  <span className={`text-[9.5px] block truncate ${isSelected ? 'text-orange-100' : 'text-gray-400'}`}>
                    {lang.name}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact variant (Header top right, works smoothly on mobile & desktop)
  if (variant === 'compact') {
    return (
      <div className={`relative inline-block notranslate ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer active:scale-98"
          title="Translate Whole Website / पूरी वेबसाइट का अनुवाद करें"
        >
          {isTranslating ? (
            <Loader2 className="w-3 h-3 text-orange-600 animate-spin" />
          ) : (
            <span className="text-xs">{currentLanguage.flagEmoji}</span>
          )}
          <span className="font-extrabold">{currentLanguage.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-1.5 w-[calc(100vw-1rem)] sm:w-72 max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-50 animate-fadeIn space-y-2">
            {/* Header & Close */}
            <div className="flex items-center justify-between px-1 border-b border-gray-100 dark:border-gray-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Translate Website
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language (हिन्दी, தமிழ்...)"
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex gap-1 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  filterTab === 'all'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                All ({languages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('indian')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  filterTab === 'indian'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                🇮🇳 Indian
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('global')}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  filterTab === 'global'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                🌐 Global
              </button>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto space-y-0.5 pr-0.5">
              {filteredLanguages.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-400">
                  No languages found matching "{searchQuery}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{lang.flagEmoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold leading-tight">{lang.nativeName}</span>
                            <span className="text-[10px] text-gray-400 font-normal">({lang.name})</span>
                          </div>
                          <span className="text-[9px] text-gray-400 block">{lang.region}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Notice */}
            <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[9px] text-gray-400 font-mono">
              <span>Google Translate Engine</span>
              <span>Whole Page Auto-Sync</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard dropdown variant
  return (
    <div className={`relative inline-block notranslate ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
      >
        {isTranslating ? (
          <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin" />
        ) : (
          <Globe className="w-3.5 h-3.5 text-orange-600" />
        )}
        <span className="font-extrabold">{currentLanguage.nativeName}</span>
        <span className="text-gray-400 text-[10px] font-normal">({currentLanguage.code.toUpperCase()})</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2.5 z-50 animate-fadeIn space-y-2">
          <div className="flex items-center justify-between px-1 border-b border-gray-100 dark:border-gray-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Select Website Language
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language (हिन्दी, தமிழ், বাংলা, Urdu...)"
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                filterTab === 'all'
                  ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              All ({languages.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('indian')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                filterTab === 'indian'
                  ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              🇮🇳 Indian ({languages.filter((l) => l.category === 'indian').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('global')}
              className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center ${
                filterTab === 'global'
                  ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black border border-orange-200 dark:border-orange-800'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              🌐 Global ({languages.filter((l) => l.category === 'global').length})
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
            {filteredLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-black'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flagEmoji}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang.nativeName}</span>
                        <span className="text-[10px] text-gray-400 font-normal">({lang.name})</span>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{lang.region}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
