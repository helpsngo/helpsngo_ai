/**
 * Google Translate Global Integration Service
 * Manages Google Translate script loading, language switching, cookie synchronization,
 * and seamless DOM translation across session navigation.
 */

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: {
          new (options: any, elementId: string): any;
        };
      };
    };
    googleTranslateElementInit?: () => void;
    __googleTranslateInitialized?: boolean;
  }
}

const GOOG_TRANS_COOKIE_NAME = 'googtrans';
const PREFERRED_LANG_STORAGE_KEY = 'helps_ngo_preferred_language_v2';

/**
 * Reads the current translation target from the googtrans cookie or local storage
 */
export function getStoredLanguage(): string {
  try {
    const saved = localStorage.getItem(PREFERRED_LANG_STORAGE_KEY);
    if (saved) return saved;

    const match = document.cookie.match(new RegExp('(^|;\\s*)' + GOOG_TRANS_COOKIE_NAME + '=([^;]*)'));
    if (match && match[2]) {
      const decoded = decodeURIComponent(match[2]);
      const parts = decoded.split('/');
      const code = parts[parts.length - 1];
      if (code && code !== 'en') return code;
    }
  } catch {
    // Ignore storage/cookie read error
  }
  return 'en';
}

/**
 * Sets the googtrans cookie across all root paths and domain variants
 */
export function setGoogTransCookie(targetLang: string): void {
  try {
    const valEn = `/en/${targetLang}`;
    const expires = 'expires=Fri, 31 Dec 9999 23:59:59 GMT';
    
    // Set for current host and root path
    document.cookie = `${GOOG_TRANS_COOKIE_NAME}=${encodeURIComponent(valEn)}; ${expires}; path=/;`;
    document.cookie = `${GOOG_TRANS_COOKIE_NAME}=${valEn}; ${expires}; path=/;`;
    
    // Also set on root domain if applicable
    const hostname = window.location.hostname;
    if (hostname && !hostname.includes('localhost') && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      const domainParts = hostname.split('.');
      if (domainParts.length >= 2) {
        const rootDomain = domainParts.slice(-2).join('.');
        document.cookie = `${GOOG_TRANS_COOKIE_NAME}=${encodeURIComponent(valEn)}; ${expires}; domain=.${rootDomain}; path=/;`;
        document.cookie = `${GOOG_TRANS_COOKIE_NAME}=${valEn}; ${expires}; domain=.${rootDomain}; path=/;`;
      }
    }
  } catch (err) {
    console.warn('[GoogleTranslate] Failed to set cookie', err);
  }
}

/**
 * Clears the googtrans cookie to restore original language (English)
 */
export function clearGoogTransCookie(): void {
  try {
    const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `${GOOG_TRANS_COOKIE_NAME}=; ${expired}; path=/;`;
    document.cookie = `${GOOG_TRANS_COOKIE_NAME}=/en/en; path=/;`;
    
    const hostname = window.location.hostname;
    if (hostname && !hostname.includes('localhost')) {
      const domainParts = hostname.split('.');
      if (domainParts.length >= 2) {
        const rootDomain = domainParts.slice(-2).join('.');
        document.cookie = `${GOOG_TRANS_COOKIE_NAME}=; ${expired}; domain=.${rootDomain}; path=/;`;
        document.cookie = `${GOOG_TRANS_COOKIE_NAME}=/en/en; path=/; domain=.${rootDomain};`;
      }
    }
  } catch {
    // Ignore
  }
}

/**
 * Locates the Google Translate select dropdown element in the DOM
 */
function findGoogleTranslateSelect(): HTMLSelectElement | null {
  return (
    document.querySelector<HTMLSelectElement>('.goog-te-combo') ||
    document.querySelector<HTMLSelectElement>('#google_translate_element select') ||
    document.querySelector<HTMLSelectElement>('select.goog-te-combo')
  );
}

/**
 * Trigger Google Translate select element in the DOM
 */
export function triggerGoogleTranslateSelect(targetLang: string): boolean {
  const select = findGoogleTranslateSelect();
  if (!select) {
    return false;
  }

  // Check if option exists in select
  let targetOptionIndex = -1;
  for (let i = 0; i < select.options.length; i++) {
    const opt = select.options[i];
    if (opt.value === targetLang) {
      targetOptionIndex = i;
      break;
    }
  }

  // If restoring to English, but 'en' is not an option value, option 0 is typically "Select Language"
  if (targetLang === 'en' && targetOptionIndex === -1) {
    targetOptionIndex = 0;
  }

  if (targetOptionIndex !== -1) {
    select.selectedIndex = targetOptionIndex;
  }
  select.value = targetLang;
  
  // Dispatch native change and input events to trigger Google's internal translate hooks
  try {
    select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    select.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    if (typeof (select as any).onchange === 'function') {
      (select as any).onchange();
    }
  } catch (e) {
    console.warn('[GoogleTranslate] Error dispatching event on combo', e);
  }

  return true;
}

/**
 * Apply translation for a specific language code with retry polling
 */
export function applyGoogleTranslateLanguage(targetLang: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 1. Sync cookie & storage
    if (targetLang === 'en') {
      clearGoogTransCookie();
    } else {
      setGoogTransCookie(targetLang);
    }

    try {
      localStorage.setItem(PREFERRED_LANG_STORAGE_KEY, targetLang);
    } catch {
      // Ignore storage errors
    }

    // 2. Try applying immediately
    const immediateSuccess = triggerGoogleTranslateSelect(targetLang);
    if (immediateSuccess) {
      resolve(true);
      return;
    }

    // 3. If combo element is not rendered yet, poll for up to 4 seconds
    let attempts = 0;
    const maxAttempts = 40;
    const interval = setInterval(() => {
      attempts++;
      const success = triggerGoogleTranslateSelect(targetLang);
      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        resolve(success);
      }
    }, 100);
  });
}

/**
 * Injects Google Translate script and initializes container
 */
export function initGoogleTranslate(): void {
  if (typeof window === 'undefined') return;

  // Check if container div exists
  let element = document.getElementById('google_translate_element');
  if (!element) {
    element = document.createElement('div');
    element.id = 'google_translate_element';
    element.setAttribute('aria-hidden', 'true');
    element.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0.01;';
    document.body.appendChild(element);
  }

  // Setup global callback
  window.googleTranslateElementInit = () => {
    if (window.google?.translate?.TranslateElement) {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,ur,ta,te,mr,gu,pa,ml,kn,or,as,sa,ne,es,fr,ar,de',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        window.__googleTranslateInitialized = true;

        // Check if there is a saved non-English language to apply
        const savedLang = getStoredLanguage();
        if (savedLang && savedLang !== 'en') {
          setTimeout(() => {
            applyGoogleTranslateLanguage(savedLang);
          }, 300);
        }
      } catch (err) {
        console.warn('[GoogleTranslate] TranslateElement init error:', err);
      }
    }
  };

  // Check if script already exists
  const existingScript = document.getElementById('google-translate-script');
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  } else if (window.google?.translate?.TranslateElement && !window.__googleTranslateInitialized) {
    window.googleTranslateElementInit();
  }
}
