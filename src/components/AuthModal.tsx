import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SEEDED_ACCOUNTS } from '../data/mockData';
import { authService, RegisterPayload } from '../services/authService';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Send, 
  MessageSquare, 
  Loader2, 
  Sparkles, 
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

type AuthViewMode = 'login' | 'signup' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) => {
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');

  // 1. Email + Password State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // 2. WhatsApp OTP Login State
  const [whatsAppPhone, setWhatsAppPhone] = useState<string>('9472929856');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [unregisteredPhoneError, setUnregisteredPhoneError] = useState<string | null>(null);

  // 3. Sign Up State (New User: Name + Email + Password + WhatsApp Number)
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // 4. Forgot Password State
  const [resetIdentifier, setResetIdentifier] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [resetCodeSent, setResetCodeSent] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // Status & Feedback State
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setFeedbackMsg(null);
      setUnregisteredPhoneError(null);
      setIsLoading(false);
      setOtpCode('');
      setOtpSent(false);
      setResetCodeSent(false);
    }
  }, [isOpen]);

  // Resend Timer Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // HANDLER: Email & Password Login
  // -------------------------------------------------------------
  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);
    setUnregisteredPhoneError(null);

    setTimeout(() => {
      const res = authService.signInWithEmailPassword(loginEmail, loginPassword);
      setIsLoading(false);

      if (res.success && res.user) {
        onSelectUser(res.user);
        setFeedbackMsg({
          type: 'success',
          text: `Welcome back, ${res.user.name}! Logged in successfully.`
        });
        setTimeout(() => {
          setFeedbackMsg(null);
          onClose();
        }, 700);
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Authentication failed. Please verify your email and password.'
        });
      }
    }, 350);
  };

  // -------------------------------------------------------------
  // HANDLER: Send WhatsApp OTP (Only for registered numbers)
  // -------------------------------------------------------------
  const handleSendWhatsAppOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);
    setUnregisteredPhoneError(null);

    setTimeout(() => {
      const res = authService.sendWhatsAppOtp(whatsAppPhone);
      setIsLoading(false);

      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(30);
        setFeedbackMsg({
          type: 'success',
          text: res.message
        });
      } else if (res.notFound) {
        setUnregisteredPhoneError(res.message);
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.message || 'Unable to send WhatsApp OTP.'
        });
      }
    }, 400);
  };

  // -------------------------------------------------------------
  // HANDLER: Verify WhatsApp OTP (Only authenticates existing account)
  // -------------------------------------------------------------
  const handleVerifyWhatsAppOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);
    setUnregisteredPhoneError(null);

    setTimeout(() => {
      const res = authService.verifyWhatsAppOtp(whatsAppPhone, otpCode);
      setIsLoading(false);

      if (res.success && res.user) {
        onSelectUser(res.user);
        setFeedbackMsg({
          type: 'success',
          text: `WhatsApp OTP Verified! Welcome back, ${res.user.name} (${res.user.role.toUpperCase()}).`
        });
        setTimeout(() => {
          setFeedbackMsg(null);
          onClose();
        }, 700);
      } else if (res.notFound) {
        setUnregisteredPhoneError(res.error || 'No account found with this WhatsApp number. Please sign up first.');
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Invalid WhatsApp OTP code. Please try again.'
        });
      }
    }, 450);
  };

  // -------------------------------------------------------------
  // HANDLER: Sign Up / Account Creation
  // Flow: Name + Email + Password + WhatsApp Number -> Account Created -> Login
  // -------------------------------------------------------------
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);

    const payload: RegisterPayload = {
      name: regName,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      phone: regPhone
    };

    setTimeout(() => {
      const res = authService.registerWithEmailPassword(payload);
      setIsLoading(false);

      if (res.success && res.user) {
        onSelectUser(res.user);
        setFeedbackMsg({
          type: 'success',
          text: `Account created successfully! Welcome to Helps NGO, ${res.user.name}.`
        });
        setTimeout(() => {
          setFeedbackMsg(null);
          onClose();
        }, 900);
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Registration failed. Please check your details and try again.'
        });
      }
    }, 400);
  };

  // -------------------------------------------------------------
  // HANDLER: Forgot Password Request Code
  // -------------------------------------------------------------
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);

    setTimeout(() => {
      const res = authService.requestPasswordReset(resetIdentifier);
      setIsLoading(false);

      if (res.success) {
        setResetCodeSent(true);
        setFeedbackMsg({
          type: 'success',
          text: res.message
        });
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.message
        });
      }
    }, 400);
  };

  // -------------------------------------------------------------
  // HANDLER: Complete Password Reset
  // -------------------------------------------------------------
  const handleCompletePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setFeedbackMsg({
        type: 'error',
        text: 'New passwords do not match. Please re-enter identical passwords.'
      });
      return;
    }

    setIsLoading(true);
    setFeedbackMsg(null);

    setTimeout(() => {
      const res = authService.completePasswordReset(resetIdentifier, resetCode, newPassword);
      setIsLoading(false);

      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: res.message
        });
        setTimeout(() => {
          setViewMode('login');
          setLoginEmail(resetIdentifier.includes('@') ? resetIdentifier : '');
          setResetCodeSent(false);
          setResetCode('');
          setNewPassword('');
          setConfirmNewPassword('');
        }, 1200);
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.message || 'Failed to reset password.'
        });
      }
    }, 450);
  };

  // Switch to Sign Up with prefilled WhatsApp phone
  const handleSwitchToSignUpWithPhone = (unregisteredDigits: string) => {
    setUnregisteredPhoneError(null);
    setFeedbackMsg(null);
    setRegPhone(unregisteredDigits);
    setViewMode('signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-md w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-100 dark:border-zinc-700/60 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 block leading-none">
                Helps NGO Foundation
              </span>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight mt-0.5">
                {viewMode === 'login' ? 'Account Login' : viewMode === 'signup' ? 'New Registration' : 'Password Reset'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors shadow-xs border border-gray-200 dark:border-zinc-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Feedback Toast */}
        {feedbackMsg && (
          <div className="px-5 pt-3 animate-fadeIn">
            <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}>
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
              <span className="leading-snug flex-1">{feedbackMsg.text}</span>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5">
          {/* ============================================================= */}
          {/* VIEW 1: LOGIN (EMAIL + PASSWORD OR WHATSAPP OTP)              */}
          {/* ============================================================= */}
          {viewMode === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sign in with your registered account to continue to your dashboard.
                </p>
              </div>

              {/* --------------------------------------------------------- */}
              {/* METHOD 1: EMAIL + PASSWORD FORM                           */}
              {/* --------------------------------------------------------- */}
              <form onSubmit={handleEmailPasswordLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Registered Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      id="login-email-input"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. helpsngoteam@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetIdentifier(loginEmail);
                        setFeedbackMsg(null);
                        setViewMode('forgot_password');
                      }}
                      className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="email-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In with Email & Password</span>
                    </>
                  )}
                </button>
              </form>

              {/* --------------------------------------------------------- */}
              {/* CLEAN "OR" DIVIDER                                        */}
              {/* --------------------------------------------------------- */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-gray-200 dark:border-zinc-700 w-full" />
                <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 absolute">
                  OR
                </span>
              </div>

              {/* --------------------------------------------------------- */}
              {/* METHOD 2: WHATSAPP OTP LOGIN                             */}
              {/* --------------------------------------------------------- */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-tight">
                      Continue with WhatsApp OTP
                    </h4>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Enter your registered WhatsApp mobile number to get a one-time login code.
                    </p>
                  </div>
                </div>

                {/* Not Registered Error Banner */}
                {unregisteredPhoneError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-xl space-y-2 animate-fadeIn text-left">
                    <div className="flex items-start gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{unregisteredPhoneError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchToSignUpWithPhone(whatsAppPhone)}
                      className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up with +91 {whatsAppPhone}</span>
                    </button>
                  </div>
                )}

                {!otpSent ? (
                  <form onSubmit={handleSendWhatsAppOtp} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Registered WhatsApp Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          🇮🇳 +91
                        </span>
                        <input
                          id="whatsapp-phone-input"
                          type="tel"
                          value={whatsAppPhone}
                          onChange={(e) => {
                            setWhatsAppPhone(e.target.value);
                            setUnregisteredPhoneError(null);
                          }}
                          placeholder="94729 29856"
                          className="w-full pl-16 pr-3 py-2.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <button
                      id="whatsapp-send-otp-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send WhatsApp OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyWhatsAppOtp} className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 text-[11px]">
                        Sent to: <strong>+91 {whatsAppPhone}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Change Number
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                          Enter 6-Digit WhatsApp OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpCode('729856')}
                          className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Autofill Demo Code (729856)
                        </button>
                      </div>
                      <input
                        id="whatsapp-otp-code-input"
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border-2 border-emerald-500 rounded-xl text-base font-mono tracking-widest text-center font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      {otpCountdown > 0 ? (
                        <span className="text-gray-500 font-medium">Resend OTP in {otpCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppOtp()}
                          className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </div>

                    <button
                      id="whatsapp-verify-otp-btn"
                      type="submit"
                      disabled={isLoading || otpCode.length < 4}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify OTP & Log In</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* --------------------------------------------------------- */}
              {/* SWITCH TO SIGN UP                                         */}
              {/* --------------------------------------------------------- */}
              <div className="pt-2 text-center border-t border-gray-100 dark:border-zinc-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackMsg(null);
                      setUnregisteredPhoneError(null);
                      setViewMode('signup');
                    }}
                    className="font-black text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Test Credentials Helper */}
              <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/60 text-[11px] space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block text-[10px]">
                  Registered Test Accounts (Click to Fill):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('amar@helpsngo.in');
                      setLoginPassword('Amarjeetkumar@12345');
                      setWhatsAppPhone('9472929856');
                    }}
                    className="p-1.5 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-left text-gray-800 dark:text-gray-200 font-bold hover:bg-orange-50 dark:hover:bg-zinc-600 transition-all truncate cursor-pointer"
                  >
                    🛡️ Admin (+91 94729 29856)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('volunteer@helpsngo.in');
                      setLoginPassword('vol123');
                      setWhatsAppPhone('9876543210');
                    }}
                    className="p-1.5 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg text-left text-gray-800 dark:text-gray-200 font-bold hover:bg-emerald-50 dark:hover:bg-zinc-600 transition-all truncate cursor-pointer"
                  >
                    🤝 Volunteer (+91 98765 43210)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* VIEW 2: SIGN UP (NEW USER REGISTRATION)                       */}
          {/* ============================================================= */}
          {viewMode === 'signup' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Create Your Account
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Join the Helps NGO ecosystem to participate in relief drives, claim tax exemptions, and access member features.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      id="signup-name-input"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Verma"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                      id="signup-email-input"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      🇮🇳 +91
                    </span>
                    <input
                      id="signup-phone-input"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-16 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 block">
                    Used for WhatsApp OTP login & instant task notifications.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <input
                      id="signup-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      id="signup-confirm-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account & Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center border-t border-gray-100 dark:border-zinc-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackMsg(null);
                      setViewMode('login');
                    }}
                    className="font-black text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* VIEW 3: FORGOT PASSWORD / PASSWORD RESET                      */}
          {/* ============================================================= */}
          {viewMode === 'forgot_password' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Enter your registered email or WhatsApp number to reset your password.
                </p>
              </div>

              {!resetCodeSent ? (
                <form onSubmit={handleRequestPasswordReset} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Registered Email or WhatsApp Number
                    </label>
                    <input
                      id="reset-identifier-input"
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. helpsngoteam@gmail.com or 9472929856"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <button
                    id="reset-send-code-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reset Verification Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompletePasswordReset} className="space-y-3 animate-fadeIn">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Reset Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setResetCode('884920')}
                        className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                      >
                        Autofill Demo Code (884920)
                      </button>
                    </div>
                    <input
                      id="reset-code-input"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Enter 6-digit reset code"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border-2 border-orange-500 rounded-xl text-xs font-mono font-black text-center text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      id="reset-new-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="reset-confirm-new-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <button
                    id="reset-complete-submit-btn"
                    type="submit"
                    disabled={isLoading || newPassword.length < 4}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Update Password & Return to Login</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="pt-2 text-center border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackMsg(null);
                    setViewMode('login');
                  }}
                  className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
