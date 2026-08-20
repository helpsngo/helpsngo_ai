import React, { useState, useEffect } from 'react';
import { Project, PaymentMethodType, DonationRecord, DonationJourneyStep, UserProfile } from '../types';
import { INITIAL_PROJECTS, ORGANIZATION_INFO } from '../data/mockData';
import { 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  Building2, 
  FileText,
  Smartphone,
  Banknote,
  Layers,
  GraduationCap,
  HeartPulse,
  Droplets,
  Utensils,
  Users,
  MapPin,
  Target,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Award,
  Globe,
  HelpCircle,
  Clock,
  ChevronRight,
  Receipt,
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dispatchWebhookEvent } from '../services/webhookService';
import { useTranslation } from '../i18n/I18nContext';
import { DynamicUpiQrCode } from './DynamicUpiQrCode';
import { AppreciationLetterModal } from './AppreciationLetterModal';
import { ShareModal } from './ShareModal';

interface DonateScreenProps {
  selectedProject?: Project | null;
  projects?: Project[];
  onDonationSuccess: (donation: DonationRecord) => void;
  userCurrency?: string;
  defaultEmail?: string;
  defaultName?: string;
  onSelectProjectChange?: (project: Project | null) => void;
}

export const DonateScreen: React.FC<DonateScreenProps> = ({
  selectedProject,
  projects = INITIAL_PROJECTS,
  onDonationSuccess,
  userCurrency = '₹',
  defaultEmail = '',
  defaultName = '',
  onSelectProjectChange
}) => {
  const { t } = useTranslation();
  const allProjectsList = projects && projects.length > 0 ? projects : INITIAL_PROJECTS;
  const org = ORGANIZATION_INFO;

  // Active Journey Step
  const [currentStep, setCurrentStep] = useState<DonationJourneyStep>('amount');

  // Step 1: Amount & Frequency
  const presetAmounts = [500, 1000, 2500, 5000];
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');

  // Step 2: Cause Selection
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    selectedProject ? selectedProject.id : 'all'
  );

  // Step 3: Donor & Tax Profile
  const [donorName, setDonorName] = useState<string>(defaultName || 'Alex Johnson');
  const [donorEmail, setDonorEmail] = useState<string>(defaultEmail || 'alex.johnson@example.com');
  const [donorPhone, setDonorPhone] = useState<string>('+91 98765 43210');
  const [donorPan, setDonorPan] = useState<string>('ABCDE1234F');
  const [donorAddress, setDonorAddress] = useState<string>('Civil Lines, Ludhiana, Punjab');
  const [donorPincode, setDonorPincode] = useState<string>('141001');
  const [citizenship, setCitizenship] = useState<'indian' | 'nri' | 'international'>('indian');

  // Step 4: Payment Method & Details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qr');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('•••');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [enteredUtr, setEnteredUtr] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Completed Record for Post-Donation Stages
  const [completedDonation, setCompletedDonation] = useState<DonationRecord | null>(null);

  // Modals state
  const [isAppreciationModalOpen, setIsAppreciationModalOpen] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Update selected program if prop changes
  useEffect(() => {
    if (selectedProject) {
      setSelectedProgramId(selectedProject.id);
    }
  }, [selectedProject]);

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const currentProgram = selectedProgramId === 'all' 
    ? null 
    : allProjectsList.find((p) => p.id === selectedProgramId) || null;

  const activeCauseTitle = currentProgram ? currentProgram.title : 'All Programs & General Relief Fund';
  const activeCauseCategory = currentProgram ? currentProgram.category : 'General Relief';

  // Currency Symbols
  const currencySymbol = selectedCurrency === 'INR' ? '₹' : selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£';

  // Tax Savings Calculation (Section 80G allows 50% deduction of donation amount from taxable income)
  const taxableDeductionAmount = Math.round(effectiveAmount * 0.5);
  const estimatedTaxSaved30 = Math.round(taxableDeductionAmount * 0.312); // ~31.2% with cess
  const estimatedTaxSaved20 = Math.round(taxableDeductionAmount * 0.208);

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(0);
    } else {
      setSelectedAmount(1000);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#EA580C', '#F97316', '#10B981', '#3B82F6', '#6366F1', '#F59E0B']
      });
    } catch {
      // safe fallback
    }
  };

  const handleExecutePayment = (customUtr?: string) => {
    if (effectiveAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      triggerCelebration();

      const methodLabel = paymentMethod === 'qr'
        ? `UPI Dynamic QR (NPCI${customUtr || enteredUtr ? ` • UTR: ${customUtr || enteredUtr}` : ''})`
        : paymentMethod === 'upi'
        ? `UPI Intent (Google Pay / PhonePe / Paytm)`
        : paymentMethod === 'card'
        ? `RuPay / Debit Card (•••• 4242)`
        : paymentMethod === 'paypal'
        ? `Net Banking (${selectedBank} Bank)`
        : 'International FCRA Gateway';

      const receiptNo = `HLP-80G-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const letterNo = `HELPS/LTR/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;

      const newRecord: DonationRecord = {
        id: `DON-${Math.floor(10000 + Math.random() * 90000)}`,
        title: activeCauseTitle,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        amount: effectiveAmount,
        currency: currencySymbol,
        category: activeCauseCategory,
        status: 'Completed',
        receiptNumber: receiptNo,
        isMonthly: isMonthly,
        paymentMethod: methodLabel,
        taxDeductible: citizenship === 'indian',
        donorEmail: (donorEmail || 'supporter@helpsngo.in').trim(),
        donorName: (donorName || 'Generous Supporter').trim(),
        donorTaxId: (donorPan || 'ABCDE1234F').trim().toUpperCase(),
        donorPhone: donorPhone.trim(),
        donorAddress: donorAddress.trim(),
        donorPincode: donorPincode.trim(),
        donorCitizenship: citizenship,
        appreciationLetterId: letterNo,
        appreciationSignedBy: 'Amarjeet Kumar, Managing Director',
        transactionHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        utrNumber: customUtr || enteredUtr || `UPI-TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        impactMilestone: 'Allocated to Ludhiana Field Relief Unit',
        approvalStatus: 'approved'
      };

      setCompletedDonation(newRecord);
      onDonationSuccess(newRecord);

      // Automated Webhook Trigger for WhatsApp/Email Receipt Dispatch
      dispatchWebhookEvent('donation.completed', {
        donorName: newRecord.donorName,
        donorEmail: newRecord.donorEmail,
        donorPhone: newRecord.donorPhone,
        amount: newRecord.amount,
        currency: newRecord.currency,
        receiptNo: newRecord.receiptNumber,
        projectTitle: newRecord.title,
        form10beUrl: `https://helpsngo.in/verify/80g/${newRecord.receiptNumber}`,
        section80gExemption: '50% Statutory Deduction u/s 80G(5)(vi)'
      }).catch(console.error);

      // Move directly to Confirmation Step
      setCurrentStep('confirmation');
    }, 850);
  };

  const getImpactEquation = (amt: number) => {
    if (amt >= 10000) {
      return 'Sponsors 1 full classroom with digital tablets, teaching aids, and complete mid-day nutrition for 20 children.';
    } else if (amt >= 5000) {
      return 'Provides full-term school fees, uniform kits, and evening tutoring for 2 children OR a certified vocational sewing machine kit for a rural woman.';
    } else if (amt >= 2500) {
      return 'Funds 1 rural medical camp diagnostic kit with free physician consultations, blood tests & essential medicines for 5 elderly villagers.';
    } else if (amt >= 1000) {
      return 'Covers 1 month of evening tutorial coaching at AABHA Center, school bags, notebooks & daily hot nutritious meals.';
    } else {
      return 'Sponsors school kits, textbooks & 1 week of nutritious hot meals for an underprivileged child.';
    }
  };

  return (
    <div className="pb-12 p-3 sm:p-4 space-y-4 animate-fadeIn text-gray-900 dark:text-gray-100 max-w-2xl mx-auto">
      
      {/* Conversion Header & Stepper Navigation */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                Official Giving Engine • 80G Verified
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
              100% Direct Relief
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Make an Immediate Grassroots Impact
            </h1>
            <p className="text-xs text-orange-100 mt-0.5">
              Empowering slum education, rural healthcare & poverty alleviation in Punjab & India.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-1 pt-2">
            {[
              { id: 'amount', label: '1. Amount' },
              { id: 'cause', label: '2. Cause' },
              { id: 'donor', label: '3. Donor' },
              { id: 'payment', label: '4. Payment' },
              { id: 'confirmation', label: '5. Impact' }
            ].map((step, idx) => {
              const stepKeys: DonationJourneyStep[] = ['amount', 'cause', 'donor', 'payment', 'confirmation'];
              const currentIdx = stepKeys.indexOf(currentStep === 'receipt' || currentStep === 'appreciation' || currentStep === 'impact' ? 'confirmation' : currentStep);
              const isActive = currentIdx === idx;
              const isPast = currentIdx > idx;

              return (
                <div key={step.id} className="space-y-1">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    isPast ? 'bg-white' : isActive ? 'bg-amber-300' : 'bg-white/30'
                  }`} />
                  <p className={`text-[9px] font-bold text-center truncate ${
                    isActive ? 'text-amber-200' : isPast ? 'text-white' : 'text-orange-200/60'
                  }`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500 rounded-full opacity-30 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: AMOUNT SELECTION & FREQUENCY */}
      {/* ========================================================================= */}
      {currentStep === 'amount' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Preset Amounts Card */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xs">
                  ₹
                </span>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">
                  Select Donation Amount
                </h2>
              </div>

              {/* Currency Selector for International Supporters */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-[10px] font-bold">
                {(['INR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      selectedCurrency === curr
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : curr === 'EUR' ? '€ EUR' : '£ GBP'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Standard Rupee Preset Amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presetAmounts.map((amt) => {
                const isSelected = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    id={`preset-amount-${amt}`}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`py-3.5 px-2 rounded-2xl font-black text-base transition-all text-center flex flex-col items-center justify-center border-2 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 text-orange-700 dark:text-orange-400 shadow-xs scale-102 ring-2 ring-orange-500/20'
                        : 'bg-gray-50 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {amt === 2500 && (
                      <span className="absolute top-0 right-0 bg-orange-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-bl-lg">
                        Popular
                      </span>
                    )}
                    <span>{currencySymbol}{amt.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                      {selectedCurrency}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400 font-black text-base">
                {currencySymbol}
              </div>
              <input
                type="text"
                id="custom-amount-input"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Or enter custom amount (e.g. 10000)"
                className={`w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden transition-all ${
                  customAmount 
                    ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/30 ring-2 ring-orange-500/20' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-orange-600'
                }`}
              />
            </div>

            {/* Live Tangible Impact Callout */}
            <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-900/50 text-xs text-orange-950 dark:text-orange-200 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider text-orange-700 dark:text-orange-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Real-World Grassroots Impact:</span>
              </div>
              <p className="font-medium text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                <strong>{currencySymbol}{effectiveAmount.toLocaleString('en-IN')}:</strong> {getImpactEquation(effectiveAmount)}
              </p>
            </div>
          </section>

          {/* One-Time vs. Monthly Sustainer Switch */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                    Monthly Giving Commitment
                  </h3>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                  Recurring support ensures uninterrupted daily meals & education throughout the year.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  id="monthly-donation-toggle"
                  checked={isMonthly}
                  onChange={(e) => setIsMonthly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
          </section>

          {/* Statutory 80G Tax Benefit Savings Calculator */}
          {selectedCurrency === 'INR' && (
            <section className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-3xl p-4.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <h3 className="font-extrabold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                    Section 80G Tax Benefit Calculator
                  </h3>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                  50% Deduction
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                By donating <strong>₹{(effectiveAmount ?? 0).toLocaleString('en-IN')}</strong>, you receive an official 80G Certificate deducting <strong>₹{(taxableDeductionAmount ?? 0).toLocaleString('en-IN')}</strong> from your taxable income.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] text-gray-500 block font-medium">Est. Tax Saved (30% Slab)</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{(estimatedTaxSaved30 ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] text-gray-500 block font-medium">Est. Tax Saved (20% Slab)</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{(estimatedTaxSaved20 ?? 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>
          )}

          {/* Continue Button */}
          <button
            onClick={() => setCurrentStep('cause')}
            disabled={effectiveAmount <= 0}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <span>Continue to Select Cause</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CAUSE / CAMPAIGN SELECTION */}
      {/* ========================================================================= */}
      {currentStep === 'cause' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('amount')}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Amount ({currencySymbol}{(effectiveAmount ?? 0).toLocaleString('en-IN')})</span>
            </button>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Step 2 of 4</span>
          </div>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Choose Where Your Support Goes
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allocate to a specific grassroots project or our general relief emergency pool.
              </p>
            </div>

            {/* Option 1: General Fund */}
            <div
              onClick={() => setSelectedProgramId('all')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedProgramId === 'all'
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 shadow-xs'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white">
                      🌟 All Programs & Urgent Relief (Where Needed Most)
                    </h3>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 rounded">
                      Fastest Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                    Proportionally allocated across AABHA schools, mobile health camps, hunger kitchens, and clean water.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedProgramId === 'all' ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
              }`}>
                {selectedProgramId === 'all' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Campaign-Specific Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {allProjectsList.map((project) => {
                const isSelected = selectedProgramId === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProgramId(project.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 shadow-xs'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                          {project.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {project.percentage}% Funded
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {project.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden mt-1">
                        <div 
                          className="bg-orange-600 h-full rounded-full" 
                          style={{ width: `${Math.min(project.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Continue Button */}
          <button
            onClick={() => setCurrentStep('donor')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Continue to Donor Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DONOR & 80G TAX PROFILE */}
      {/* ========================================================================= */}
      {currentStep === 'donor' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('cause')}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cause ({activeCauseCategory})</span>
            </button>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Step 3 of 4</span>
          </div>

          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">
                  Donor & Statutory 80G Details
                </h2>
                <p className="text-[10px] text-gray-500">
                  Required by Income Tax Department (Govt. of India) to issue official Form 10BE tax receipt.
                </p>
              </div>
            </div>

            {/* Citizenship Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Residential & Tax Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'indian', label: 'Indian Resident (80G)' },
                  { id: 'nri', label: 'NRI (Indian Passport)' },
                  { id: 'international', label: 'International (FCRA)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCitizenship(item.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border-2 transition-all cursor-pointer ${
                      citizenship === item.id
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 text-orange-700 dark:text-orange-400'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Fields Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Full Name (As per PAN / ID Card) *
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Email (For Instant 80G Receipt) *
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp / Phone (For Dispatch Alerts)
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 font-mono"
                  />
                </div>
              </div>

              {citizenship === 'indian' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    PAN Number (Required for 50% 80G Tax Exemption) *
                  </label>
                  <input
                    type="text"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Address / City
                  </label>
                  <input
                    type="text"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="City, State"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={donorPincode}
                    onChange={(e) => setDonorPincode(e.target.value)}
                    placeholder="141006"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-medium focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Continue Button */}
          <button
            onClick={() => setCurrentStep('payment')}
            disabled={!donorName.trim() || !donorEmail.trim()}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <span>Proceed to Secure Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PAYMENT GATEWAY SELECTION & EXECUTION */}
      {/* ========================================================================= */}
      {currentStep === 'payment' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('donor')}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Donor Details</span>
            </button>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Step 4 of 4</span>
          </div>

          {/* Summary Pill */}
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Contribution Summary</span>
              <span className="font-extrabold text-gray-900 dark:text-white">
                {currencySymbol}{(effectiveAmount ?? 0).toLocaleString('en-IN')} {isMonthly ? '/ Month' : 'One-Time'} • {activeCauseTitle}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Zero Fees
            </span>
          </div>

          {/* 4 Payment Methods Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'qr', label: 'Dynamic QR', sub: 'Scan & Pay (0% Fee)', icon: QrCode },
              { id: 'upi', label: 'UPI Apps', sub: 'GPay / PhonePe', icon: Smartphone },
              { id: 'card', label: 'RuPay / Cards', sub: 'Debit & Credit', icon: CreditCard },
              { id: 'paypal', label: 'Net Banking', sub: 'All Indian Banks', icon: Banknote }
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-600 text-orange-900 dark:text-orange-200 shadow-xs ring-2 ring-orange-500/20'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                  }`}
                >
                  <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-1" />
                  <span className="text-[11px] font-black uppercase tracking-tight">{m.label}</span>
                  <span className="text-[8px] text-gray-500 dark:text-gray-400">{m.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Method A: Dynamic UPI QR & Intent */}
          {(paymentMethod === 'qr' || paymentMethod === 'upi') && (
            <DynamicUpiQrCode
              amount={effectiveAmount}
              projectTitle={activeCauseTitle}
              projectCategory={activeCauseCategory}
              donorName={donorName}
              donorEmail={donorEmail}
              isMonthly={isMonthly}
              onPaymentConfirmed={(utr) => handleExecutePayment(utr)}
              isProcessing={isProcessing}
            />
          )}

          {/* Method B: Cards */}
          {paymentMethod === 'card' && (
            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-3.5 text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                <span className="font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Credit / Debit / RuPay Card
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-bit Encrypted
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xs text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExecutePayment()}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isProcessing ? 'Processing 3D Secure...' : `Pay ${currencySymbol}${(effectiveAmount ?? 0).toLocaleString('en-IN')}`}
              </button>
            </section>
          )}

          {/* Method C: Net Banking */}
          {paymentMethod === 'paypal' && (
            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-3.5 text-xs animate-fadeIn">
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Select Your Indian Bank
                </span>
                <p className="text-[10px] text-gray-500">
                  Direct net-banking debit gateway via NPCI IMPS/NEFT gateway.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['HDFC', 'SBI', 'ICICI', 'Axis', 'PNB', 'Kotak', 'Canara', 'BOB'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      selectedBank === bank
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {bank} Bank
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleExecutePayment()}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isProcessing ? 'Connecting to Bank Gateway...' : `Proceed with ${selectedBank} Bank (${currencySymbol}${(effectiveAmount ?? 0).toLocaleString('en-IN')})`}
              </button>
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: CONFIRMATION, AUTOMATED RECEIPT & IMPACT ROADMAP */}
      {/* ========================================================================= */}
      {currentStep === 'confirmation' && completedDonation && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Hero Success Badge */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-xl text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                Donation Completed & Verified
              </span>
              <h2 className="text-2xl font-black mt-2">
                Thank You, {completedDonation.donorName}!
              </h2>
              <p className="text-xs text-emerald-100 max-w-sm mx-auto mt-1 leading-relaxed">
                Your gift of <strong>{completedDonation.currency}{completedDonation.amount.toLocaleString('en-IN')}</strong> has been instantly allocated to the Ludhiana field relief base.
              </p>
            </div>

            {/* Quick 3-Pill Action Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-extrabold">
              <button
                onClick={() => setCurrentStep('receipt')}
                className="bg-white text-emerald-800 hover:bg-emerald-50 py-2.5 px-2 rounded-2xl shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <Receipt className="w-4 h-4 mb-0.5 text-emerald-600" />
                <span className="text-[10px]">80G Receipt</span>
              </button>
              <button
                onClick={() => setIsAppreciationModalOpen(true)}
                className="bg-emerald-800/80 hover:bg-emerald-900 text-white py-2.5 px-2 rounded-2xl border border-emerald-400/40 shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <Award className="w-4 h-4 mb-0.5 text-amber-300" />
                <span className="text-[10px]">Thank You Letter</span>
              </button>
              <button
                onClick={() => setCurrentStep('impact')}
                className="bg-emerald-800/80 hover:bg-emerald-900 text-white py-2.5 px-2 rounded-2xl border border-emerald-400/40 shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <TrendingUp className="w-4 h-4 mb-0.5 text-cyan-300" />
                <span className="text-[10px]">Impact Tracker</span>
              </button>
            </div>
          </div>

          {/* Instant Summary Receipt Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Receipt Number</span>
                <span className="text-xs font-mono font-black text-orange-600 dark:text-orange-400">
                  {completedDonation.receiptNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-mono block">Transaction Date</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {completedDonation.date}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Designated Initiative:</span>
                <span className="font-bold text-right text-gray-900 dark:text-white">{completedDonation.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Contribution Amount:</span>
                <span className="font-black text-right text-gray-900 dark:text-white">{completedDonation.currency}{(completedDonation.amount ?? 0).toLocaleString('en-IN')} INR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Tax Exemption:</span>
                <span className="font-bold text-right text-emerald-600">50% Statutory Exemption u/s 80G</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Payment Reference (UTR):</span>
                <span className="font-mono text-gray-600 dark:text-gray-400 text-[11px]">{completedDonation.utrNumber}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCurrentStep('receipt')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Full 80G Receipt</span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Impact</span>
              </button>
            </div>
          </div>

          {/* Reset / Make Another Contribution */}
          <button
            onClick={() => {
              setCompletedDonation(null);
              setCurrentStep('amount');
            }}
            className="w-full py-3 text-center text-xs font-bold text-gray-500 hover:text-orange-600 uppercase tracking-wider cursor-pointer"
          >
            + Make Another Contribution
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: DEDICATED FULL AUTOMATED 80G TAX RECEIPT VIEW */}
      {/* ========================================================================= */}
      {currentStep === 'receipt' && completedDonation && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('confirmation')}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Confirmation</span>
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          {/* Official Printable 80G Receipt Paper */}
          <div className="bg-white dark:bg-gray-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="border-b-2 border-gray-200 dark:border-gray-800 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-gray-950 dark:text-white">
                    HELPS Welfare Society
                  </h2>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {org.registrationNumber} • 12A & 80G Certified
                  </p>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-gray-500">
                <p className="font-bold text-emerald-600">FORM 10BE TAX RECEIPT</p>
                <p>Sec 80G(5)(vi) Income Tax Act</p>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Receipt No:</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{completedDonation.receiptNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Date of Payment:</span>
                <span className="font-bold">{completedDonation.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Donor PAN:</span>
                <span className="font-mono font-bold uppercase">{completedDonation.donorTaxId}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Donor Name:</span>
                <span className="font-bold">{completedDonation.donorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Amount Received:</span>
                <span className="font-black text-emerald-600 text-sm">₹{(completedDonation.amount ?? 0).toLocaleString('en-IN')} INR</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">Exemption Type:</span>
                <span className="font-bold text-emerald-700">50% Tax Deduction</span>
              </div>
            </div>

            {/* Statutory Declaration */}
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "This is to certify that the sum of <strong>₹{(completedDonation.amount ?? 0).toLocaleString('en-IN')}</strong> has been received from <strong>{completedDonation.donorName}</strong> as a voluntary donation towards {completedDonation.title}. This receipt qualifies for deduction under Section 80G of the Income Tax Act, 1961."
            </p>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <div className="text-[10px] font-mono text-gray-400">
                <p>Digital Certificate Verification: Valid</p>
                <p>HELPS Welfare Society • Ludhiana (PB)</p>
              </div>
              <div className="text-right">
                <p className="font-serif italic font-bold text-sm">Amarjeet Kumar</p>
                <p className="text-[10px] text-gray-500 font-medium">Authorized Signatory & Managing Director</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsAppreciationModalOpen(true)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Award className="w-4 h-4" />
              <span>View Thank You Letter</span>
            </button>
            <button
              onClick={() => setCurrentStep('impact')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Track Impact Roadmap</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: LIVE IMPACT UPDATE & GROUND FULFILLMENT TRACKER */}
      {/* ========================================================================= */}
      {currentStep === 'impact' && completedDonation && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('confirmation')}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-[10px] text-emerald-600 font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded">
              Live Field Pipeline
            </span>
          </div>

          {/* Impact Milestones Timeline */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">
                  Your Rupee Journey & Field Milestones
                </h2>
                <p className="text-[10px] text-gray-500">
                  Real-time transparent lifecycle of your contribution for {completedDonation.title}.
                </p>
              </div>
            </div>

            {/* 4 Milestones */}
            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200 dark:before:bg-gray-800 text-xs">
              
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">Funds Allocated to Ground Unit</h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono px-1 rounded">Today</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    ₹{completedDonation.amount.toLocaleString('en-IN')} assigned to field coordinator Priya Sharma at Ludhiana Relief Hub.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">Supply Procurement & Kits Assembly</h4>
                    <span className="text-[9px] bg-orange-100 text-orange-800 font-mono px-1 rounded">Within 48h</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Materials, medicines, school kits, and fresh food packages prepared in bulk.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-[9px] font-bold">
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Direct Handover to Beneficiaries</h4>
                    <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono px-1 rounded">Day 7</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Volunteer team delivers education sessions and nutritional meals at GNDEC AABHA center.
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-[9px] font-bold">
                  4
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Field Photographs & Impact Digest Emailed</h4>
                    <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono px-1 rounded">Day 30</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Verified photo gallery and beneficiary progress report sent directly to {completedDonation.donorEmail}.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Invitation to Visit Ground Center */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 rounded-3xl p-4.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 font-bold">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Visit Us In Person & See the Impact Live</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
              You are warmly invited to visit our evening AABHA classroom and community kitchen near <strong>Guru Nanak Dev Engineering College (GNDEC), Gill Road, Ludhiana</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Formal Letter of Appreciation Modal */}
      {isAppreciationModalOpen && completedDonation && (
        <AppreciationLetterModal
          donation={completedDonation}
          isOpen={isAppreciationModalOpen}
          onClose={() => setIsAppreciationModalOpen(false)}
          onViewImpactUpdate={() => {
            setIsAppreciationModalOpen(false);
            setCurrentStep('impact');
          }}
        />
      )}

      {/* Share Impact Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareTitle="I just donated to HELPS Welfare Society!"
          shareText="I supported grassroots child education and healthcare with HELPS Welfare Society (100% 80G tax exempt). Join me in making a difference!"
          shareUrl="https://helpsngo.in/"
        />
      )}

    </div>
  );
};
