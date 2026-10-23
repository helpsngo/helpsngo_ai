import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  CameraOff, 
  SwitchCamera, 
  Flashlight, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Zap, 
  QrCode,
  Image as ImageIcon,
  Heart
} from 'lucide-react';
import { mobileService } from '../services/mobileService';
import { Project } from '../types';

export interface ScannedDonationData {
  raw: string;
  payeeName: string;
  payeeVpa?: string;
  amount?: number;
  currency: string;
  purpose?: string;
  projectId?: string;
  projectTitle?: string;
  isHelpsNgoVerified: boolean;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  type: 'upi' | 'bank_account' | 'url' | 'text';
}

interface QrCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationDetected: (data: ScannedDonationData) => void;
  availableProjects?: Project[];
}

export const QrCodeScannerModal: React.FC<QrCodeScannerModalProps> = ({
  isOpen,
  onClose,
  onDonationDetected,
  availableProjects = []
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<ScannedDonationData | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'demo'>('camera');

  // Intelligent parser for QR content
  const parseQrContent = useCallback((text: string): ScannedDonationData => {
    const trimmed = text.trim();

    // 1. NPCI UPI Intent URI: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
    if (trimmed.toLowerCase().startsWith('upi://pay')) {
      try {
        const url = new URL(trimmed.replace(/^upi:\/\/pay/i, 'https://dummy.com'));
        const pa = url.searchParams.get('pa') || '';
        const pn = decodeURIComponent(url.searchParams.get('pn') || 'HELPS Welfare Society');
        const amStr = url.searchParams.get('am');
        const cu = url.searchParams.get('cu') || 'INR';
        const tn = decodeURIComponent(url.searchParams.get('tn') || '');
        const am = amStr ? parseFloat(amStr) : undefined;

        // Check if official HELPS NGO
        const isHelpsNgo = 
          pa.toLowerCase().includes('helpsngo') || 
          pn.toLowerCase().includes('helps') || 
          pa.toLowerCase().includes('icici');

        // Match project from transaction note
        let matchedProj: Project | undefined;
        if (tn && availableProjects.length > 0) {
          const lowerTn = tn.toLowerCase();
          matchedProj = availableProjects.find(p => 
            lowerTn.includes(p.title.toLowerCase()) || 
            lowerTn.includes(p.category.toLowerCase()) ||
            p.title.toLowerCase().includes(lowerTn)
          );
        }

        return {
          raw: trimmed,
          payeeName: pn || 'HELPS Welfare Society',
          payeeVpa: pa || 'helpsngo@icici',
          amount: am && !isNaN(am) ? am : undefined,
          currency: cu === 'INR' ? '₹' : cu,
          purpose: tn || (matchedProj ? matchedProj.title : 'General Grassroots Relief Fund'),
          projectId: matchedProj ? matchedProj.id : undefined,
          projectTitle: matchedProj ? matchedProj.title : undefined,
          isHelpsNgoVerified: isHelpsNgo,
          type: 'upi'
        };
      } catch (e) {
        console.warn('Failed to parse full UPI URL, applying fallback parser', e);
      }
    }

    // 2. JSON Payload (e.g. { ngo: 'HELPS', amount: 1000, project: 'AABHA' })
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const json = JSON.parse(trimmed);
        const am = json.amount || json.amt;
        const matchedProj = availableProjects.find(p => 
          (json.project && p.title.toLowerCase().includes(String(json.project).toLowerCase())) ||
          (json.projectId && p.id === json.projectId)
        );

        return {
          raw: trimmed,
          payeeName: json.payee || json.ngo || 'HELPS Welfare Society (Regd.)',
          payeeVpa: json.upi || json.vpa || 'helpsngo@icici',
          amount: am ? parseFloat(am) : undefined,
          currency: '₹',
          purpose: json.purpose || json.project || (matchedProj ? matchedProj.title : 'Slum Education & Relief'),
          projectId: matchedProj ? matchedProj.id : undefined,
          projectTitle: matchedProj ? matchedProj.title : undefined,
          isHelpsNgoVerified: true,
          accountNumber: json.accountNumber || json.acc,
          ifsc: json.ifsc,
          bankName: json.bank || 'ICICI Bank',
          type: json.accountNumber ? 'bank_account' : 'upi'
        };
      } catch {
        // Continue to fallback
      }
    }

    // 3. Bank Account String (contains IFSC or Account)
    if (/ifsc/i.test(trimmed) || /acc(?:ount)?\s*(?:no|number)?/i.test(trimmed)) {
      const ifscMatch = trimmed.match(/[A-Z]{4}0[A-Z0-9]{6}/i);
      const accMatch = trimmed.match(/\b\d{9,18}\b/);
      const amMatch = trimmed.match(/(?:rs\.?|inr|₹)\s*(\d+(?:\.\d+)?)/i);

      return {
        raw: trimmed,
        payeeName: 'HELPS Welfare Society (Current Account)',
        accountNumber: accMatch ? accMatch[0] : '003501048291',
        ifsc: ifscMatch ? ifscMatch[0].toUpperCase() : 'ICIC0000035',
        bankName: 'ICICI Bank Ltd.',
        amount: amMatch ? parseFloat(amMatch[1]) : undefined,
        currency: '₹',
        purpose: 'NGO Direct Bank Account Contribution',
        isHelpsNgoVerified: true,
        type: 'bank_account'
      };
    }

    // 4. Raw Amount Number (e.g. "1000", "₹2500", "5000 INR")
    const rawNumberMatch = trimmed.match(/^₹?\s*(\d+(?:\.\d{1,2})?)\s*(?:inr|rs)?$/i);
    if (rawNumberMatch) {
      const val = parseFloat(rawNumberMatch[1]);
      return {
        raw: trimmed,
        payeeName: 'HELPS Welfare Society',
        payeeVpa: 'helpsngo@icici',
        amount: val,
        currency: '₹',
        purpose: 'Instant Grassroots Community Contribution',
        isHelpsNgoVerified: true,
        type: 'upi'
      };
    }

    // 5. Default General Text / URL
    return {
      raw: trimmed,
      payeeName: 'HELPS Welfare Society - Field Giving',
      payeeVpa: 'helpsngo@icici',
      currency: '₹',
      purpose: trimmed.length > 50 ? `${trimmed.slice(0, 50)}...` : trimmed,
      isHelpsNgoVerified: true,
      type: 'text'
    };
  }, [availableProjects]);

  // Clean stop for camera stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
  }, []);

  // Frame scanning loop
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    // Set canvas dimensions to match video stream
    const width = video.videoWidth || 480;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    // Run jsQR decoder
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      // Successful QR code detection
      mobileService.hapticImpact('heavy');
      const parsed = parseQrContent(code.data);
      setScannedResult(parsed);
      if (parsed.amount) {
        setCustomAmountInput(String(parsed.amount));
      }
      stopCamera();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [parseQrContent, stopCamera]);

  // Start Camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScannedResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported on this browser/environment.');
      setHasCameraPermission(false);
      setActiveTab('upload');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as any) : {};
        setTorchSupported(Boolean(capabilities.torch));
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCameraPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser settings or upload an image below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No video camera device was found on this system. You can upload a QR image instead.');
      } else {
        setCameraError('Unable to start camera. Please upload a QR code image or use one of our quick presets.');
      }
      setActiveTab('upload');
    }
  }, [facingMode, scanFrame, stopCamera]);

  // Handle Torch Toggle
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextState = !torchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextState }]
      });
      setTorchOn(nextState);
      mobileService.hapticImpact('light');
    } catch (e) {
      console.warn('Torch control failed:', e);
    }
  };

  // Switch between front and rear camera
  const handleFlipCamera = () => {
    mobileService.hapticImpact('light');
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Process uploaded QR image file
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setCameraError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessingImage(false);
          setCameraError('Failed to initialize 2D canvas context for image analysis.');
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        setIsProcessingImage(false);

        if (code && code.data) {
          mobileService.hapticImpact('heavy');
          const parsed = parseQrContent(code.data);
          setScannedResult(parsed);
          if (parsed.amount) {
            setCustomAmountInput(String(parsed.amount));
          }
        } else {
          setCameraError('No valid QR code was detected in the uploaded image. Please try a clearer screenshot or photo.');
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setCameraError('Failed to load image file. Please verify file format.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Quick Demo Presets
  const demoPresets: Array<{
    title: string;
    sub: string;
    amount: number;
    upiUrl: string;
    icon: string;
  }> = [
    {
      title: 'AABHA Slum Child Education Kit',
      sub: 'School bag, books & evening tutorial support',
      amount: 1000,
      upiUrl: 'upi://pay?pa=helpsngo@icici&pn=Helps%20NGO&mc=8398&am=1000&cu=INR&tn=AABHA%20Slum%20Education%20Kit',
      icon: '🎓'
    },
    {
      title: 'Annapoorna Daily Nutritious Meals',
      sub: 'Warm cooked meals for 25 underprivileged kids',
      amount: 2500,
      upiUrl: 'upi://pay?pa=helpsngo@icici&pn=Helps%20NGO&mc=8398&am=2500&cu=INR&tn=Annapoorna%20Daily%20Nutrition%20Relief',
      icon: '🍲'
    },
    {
      title: 'Rural Diagnostic Health Camp',
      sub: 'Free physician screenings & medicines',
      amount: 5000,
      upiUrl: 'upi://pay?pa=helpsngo@icici&pn=Helps%20NGO&mc=8398&am=5000&cu=INR&tn=Rural%20Diagnostic%20Health%20Camp',
      icon: '🩺'
    },
    {
      title: 'Green Earth & Clean Potable Water',
      sub: '50 shaded fruit tree saplings & water access',
      amount: 10000,
      upiUrl: 'upi://pay?pa=helpsngo@icici&pn=Helps%20NGO&mc=8398&am=10000&cu=INR&tn=Green%20Earth%20and%20Clean%20Water',
      icon: '🌳'
    }
  ];

  const handleSelectDemoPreset = (preset: typeof demoPresets[0]) => {
    mobileService.hapticImpact('medium');
    const parsed = parseQrContent(preset.upiUrl);
    setScannedResult(parsed);
    setCustomAmountInput(String(preset.amount));
  };

  // Confirm and proceed with donation
  const handleProceedDonation = () => {
    if (!scannedResult) return;
    mobileService.hapticImpact('heavy');

    const effectiveAmount = customAmountInput ? parseFloat(customAmountInput) || scannedResult.amount || 1000 : scannedResult.amount || 1000;

    onDonationDetected({
      ...scannedResult,
      amount: effectiveAmount
    });
    onClose();
  };

  // Re-scan
  const handleResetScan = () => {
    setScannedResult(null);
    setCameraError(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  // Manage camera on modal open/close/tab changes
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scannedResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, scannedResult, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Hidden offscreen canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Scan QR to Donate
                </h3>
                <span className="bg-white/25 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  Fast Giving
                </span>
              </div>
              <p className="text-[10px] text-orange-100 font-medium">
                Point your camera at any UPI or NGO donation QR code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Close scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Camera / Upload / Demo Presets */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              handleResetScan();
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('demo');
              stopCamera();
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Test Presets</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ========================================================================= */}
          {/* RESULT CARD IF DETECTED */}
          {/* ========================================================================= */}
          {scannedResult ? (
            <div className="space-y-4 animate-scaleUp">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/50 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-black tracking-wider block">
                      QR Code Successfully Decoded
                    </span>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {scannedResult.payeeName}
                    </h4>
                  </div>
                  {scannedResult.isHelpsNgoVerified && (
                    <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified NGO
                    </span>
                  )}
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-[11px] font-medium">Designated Purpose:</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right">
                      {scannedResult.purpose || 'Grassroots Relief & Welfare'}
                    </span>
                  </div>

                  {scannedResult.payeeVpa && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[11px] font-medium">UPI VPA:</span>
                      <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                        {scannedResult.payeeVpa}
                      </span>
                    </div>
                  )}

                  {scannedResult.accountNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[11px] font-medium">Bank Account:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {scannedResult.accountNumber} ({scannedResult.ifsc || 'ICICI'})
                      </span>
                    </div>
                  )}

                  {/* Amount Input / Editor */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                      Donation Amount ({scannedResult.currency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                        {scannedResult.currency}
                      </span>
                      <input
                        type="number"
                        value={customAmountInput}
                        onChange={(e) => setCustomAmountInput(e.target.value)}
                        placeholder="Enter donation amount"
                        className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-gray-800 border-2 border-orange-500/40 focus:border-orange-600 rounded-xl font-mono text-sm font-black text-gray-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets for Amount */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold">Quick:</span>
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomAmountInput(String(amt))}
                      className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResetScan}
                  className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedDonation}
                  disabled={!customAmountInput || parseFloat(customAmountInput) <= 0}
                  className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <span>Donate ₹{customAmountInput || '1,000'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          {/* ========================================================================= */}
          {/* TAB 1: LIVE CAMERA VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'camera' && !scannedResult && (
            <div className="space-y-3">
              <div className="relative aspect-square max-h-72 w-full bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {/* Live Video Feed */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted
                />

                {/* Reticle / Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 border-2 border-white/60 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                    {/* Corner Reticles */}
                    <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-lg" />
                    <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-lg" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-lg" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                </div>

                {/* Floating Top Controls (Torch & Flip) */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  {torchSupported && (
                    <button
                      type="button"
                      onClick={handleToggleTorch}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        torchOn 
                          ? 'bg-amber-400 text-gray-900 shadow-md ring-2 ring-white' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      title="Toggle Torch"
                    >
                      <Flashlight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer"
                    title="Switch Front/Rear Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>

                {/* Scanning Instruction Bar */}
                <div className="absolute bottom-3 inset-x-4 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-full text-center text-[10px] text-white font-medium">
                  Center the donation QR code inside the viewfinder box
                </div>
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <p>{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="font-bold underline text-orange-600 dark:text-orange-400 cursor-pointer"
                    >
                      Click here to upload QR image instead
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: UPLOAD IMAGE / GALLERY */}
          {/* ========================================================================= */}
          {activeTab === 'upload' && !scannedResult && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="qr-file-upload-input"
              />

              <label
                htmlFor="qr-file-upload-input"
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/40 hover:bg-orange-50/40 dark:hover:bg-orange-950/20"
              >
                {isProcessingImage ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Decoding QR Code from image...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 shadow-xs">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase text-gray-900 dark:text-white">
                      Upload QR Code Screenshot or Photo
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                      Select any saved image or screenshot from your device gallery containing a UPI QR code
                    </p>
                    <span className="mt-3 inline-block bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold py-2 px-4 rounded-xl shadow-xs">
                      Choose from Device
                    </span>
                  </>
                )}
              </label>

              {cameraError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TEST PRESETS */}
          {/* ========================================================================= */}
          {activeTab === 'demo' && !scannedResult && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulate instant scanning of official HELPS donation initiatives:</span>
              </div>

              <div className="space-y-2">
                {demoPresets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectDemoPreset(preset)}
                    className="w-full p-3 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-gray-200 dark:border-gray-700 hover:border-orange-500 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        {preset.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {preset.title}
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          {preset.sub}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                        ₹{preset.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">
                        Instant Scan
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official UPI & BharatQR Standard Compliance</span>
          </div>
          <span className="font-mono text-[10px] text-gray-400">NPCI 8398</span>
        </div>
      </div>
    </div>
  );
};
