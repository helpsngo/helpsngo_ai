import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Sparkles, Send, ShieldCheck, ArrowRight } from 'lucide-react';

interface NewsletterSectionProps {
  defaultEmail?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ defaultEmail = '' }) => {
  const [email, setEmail] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['field_updates', 'impact_reports']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');

  useEffect(() => {
    const savedSub = localStorage.getItem('helps_ngo_newsletter_sub');
    if (savedSub) {
      try {
        const parsed = JSON.parse(savedSub);
        if (parsed.email) {
          setIsSubscribed(true);
          setSubscribedEmail(parsed.email);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const handleToggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) return; // Keep at least one
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setIsSubscribed(true);
      setSubscribedEmail(trimmed);
      localStorage.setItem(
        'helps_ngo_newsletter_sub',
        JSON.stringify({
          email: trimmed,
          topics: selectedTopics,
          subscribedAt: new Date().toISOString()
        })
      );
      setEmail('');
    }, 650);
  };

  const handleUnsubscribeOrChange = () => {
    localStorage.removeItem('helps_ngo_newsletter_sub');
    setIsSubscribed(false);
    setStatus('idle');
    setEmail(subscribedEmail);
  };

  return (
    <section
      id="newsletter-signup-section"
      className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-xs relative overflow-hidden space-y-4"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Monthly Dispatch
            </h3>
            <h2 className="text-sm font-black text-gray-900 tracking-tight">
              Newsletter & Field Reports
            </h2>
          </div>
        </div>
        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Zero Spam
        </span>
      </div>

      {isSubscribed ? (
        /* Subscribed Success View */
        <div className="bg-orange-50/50 border border-orange-200/80 rounded-[1.6rem] p-4 sm:p-5 text-center space-y-3 animate-fadeIn">
          <div className="w-11 h-11 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">
              You're on the Helps NGO Dispatch List!
            </h4>
            <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
              Updates and monthly field financial reports will be delivered to{' '}
              <strong className="text-gray-900 font-mono">{subscribedEmail}</strong>.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Monthly digest • Unsubscribe anytime</span>
          </div>

          <div className="pt-1">
            <button
              onClick={handleUnsubscribeOrChange}
              className="text-[11px] font-bold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-wider underline underline-offset-2"
            >
              Update email or preferences
            </button>
          </div>
        </div>
      ) : (
        /* Subscription Form View */
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <p className="text-xs text-gray-600 leading-relaxed">
            Get transparent ground reports, emergency relief bulletins, and verified beneficiary success stories once a month.
          </p>

          {/* Topics Chips Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Customize Your Updates
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'field_updates', label: 'Field Projects' },
                { id: 'impact_reports', label: 'Transparency & 80G' },
                { id: 'volunteer_drives', label: 'Volunteer Alerts' }
              ].map((topic) => {
                const active = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleToggleTopic(topic.id)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                      active
                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Input & Submit Button */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your email address..."
                  className="w-full pl-3.5 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  aria-label="Email address for monthly updates"
                />
              </div>
              <button
                id="newsletter-subscribe-button"
                type="submit"
                disabled={status === 'loading'}
                className="bg-orange-600 hover:bg-orange-700 active:scale-98 disabled:opacity-70 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs flex-shrink-0"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <p className="text-[11px] font-semibold text-rose-600 pl-1 animate-fadeIn">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Footer Transparency Assurance */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>We respect your privacy. No spam ever.</span>
            </div>
            <span>Published 1st of each month</span>
          </div>
        </form>
      )}
    </section>
  );
};
