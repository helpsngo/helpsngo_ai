import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Webhook, 
  Activity, 
  CheckCircle2, 
  Send, 
  Settings, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  RefreshCw, 
  Sparkles, 
  FileCheck2, 
  Clock, 
  Phone, 
  Lock, 
  Check, 
  Copy,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { UserProfile, WebhookConfig, WebhookDeliveryLog, DonorNotificationPreferences } from '../types';
import { 
  getStoredWebhookConfigs, 
  saveWebhookConfigs, 
  getStoredDeliveryLogs, 
  dispatchWebhookEvent, 
  getStoredDonorPreferences, 
  saveDonorPreferences 
} from '../services/webhookService';
import { useTranslation } from '../i18n/I18nContext';

interface NotificationWebhooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}

export const NotificationWebhooksModal: React.FC<NotificationWebhooksModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'webhooks' | 'logs' | 'prefs'>('whatsapp');
  const [configs, setConfigs] = useState<WebhookConfig[]>(() => getStoredWebhookConfigs());
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(() => getStoredDeliveryLogs());
  const [preferences, setPreferences] = useState<DonorNotificationPreferences>(() => getStoredDonorPreferences());

  // Test dispatcher form state
  const [testDonorName, setTestDonorName] = useState<string>(user?.name || 'Ananya Sharma');
  const [testPhone, setTestPhone] = useState<string>(user?.phone || '+91 98765 43210');
  const [testEmail, setTestEmail] = useState<string>(user?.email || 'ananya.sharma@gmail.com');
  const [testAmount, setTestAmount] = useState<number>(5000);
  const [testProject, setTestProject] = useState<string>('Barmer Solar Borewells & Clean Water Hubs');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [selectedLogForJson, setSelectedLogForJson] = useState<WebhookDeliveryLog | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleWebhook = (id: string) => {
    const updated = configs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    setConfigs(updated);
    saveWebhookConfigs(updated);
  };

  const handleSavePreferences = (updated: DonorNotificationPreferences) => {
    setPreferences(updated);
    saveDonorPreferences(updated);
  };

  const handleSendTestDonationWhatsApp = async () => {
    setIsSending(true);
    setSendSuccessMessage(null);

    const randomReceipt = `REC-80G-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedLogs = await dispatchWebhookEvent(
      'donation.completed',
      {
        donorName: testDonorName,
        donorPhone: testPhone,
        donorEmail: testEmail,
        amount: testAmount,
        currency: '₹',
        receiptNo: randomReceipt,
        projectTitle: testProject,
        form10beUrl: `https://helpsngo.in/verify/80g/${randomReceipt}`,
        section80gExemption: '50% Statutory Exemption u/s 80G(5)(vi)'
      },
      'whatsapp'
    );

    setLogs(updatedLogs);
    setIsSending(false);
    setSendSuccessMessage(`WhatsApp notification dispatched to ${testPhone} with Form 10BE link!`);
    setTimeout(() => setSendSuccessMessage(null), 5000);
  };

  const handleSendQuarterlyMilestone = async () => {
    setIsSending(true);
    setSendSuccessMessage(null);

    const updatedLogs = await dispatchWebhookEvent('quarterly.impact_digest', {
      donorName: testDonorName,
      donorPhone: testPhone,
      donorEmail: testEmail,
      quarter: 'Q3 2026 Milestone Digest',
      totalWellsCommissioned: 18,
      litresPumped: '6,200,000 L Clean Water',
      livesImpactedInQuarter: '15,800 villagers',
      interactiveGisReport: 'https://helpsngo.in/impact/gis/2026-q3',
      videoUrl: 'https://helpsngo.in/stories/barmer-drought-relief-video'
    });

    setLogs(updatedLogs);
    setIsSending(false);
    setSendSuccessMessage(`Quarterly Impact Digest dispatched via WhatsApp & Email!`);
    setTimeout(() => setSendSuccessMessage(null), 5000);
  };

  const handleCopyJson = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Automated Communications
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Live Webhooks Active
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Donor WhatsApp & Email Notification Webhooks
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'email'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Template</span>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'webhooks'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            <span>Webhook Endpoints ({configs.filter((c) => c.enabled).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Logs ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('prefs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'prefs'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {sendSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sendSuccessMessage}</span>
            </div>
            <button onClick={() => setSendSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WHATSAPP INTERACTIVE PREVIEW & TEST DISPATCHER */}
          {activeTab === 'whatsapp' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live WhatsApp Chat Simulator */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-emerald-950 rounded-3xl p-4 sm:p-5 text-white shadow-lg border border-emerald-800/40 relative overflow-hidden">
                  {/* WhatsApp Top Chat Header */}
                  <div className="bg-emerald-900/90 rounded-2xl p-3 flex items-center justify-between border border-emerald-700/50 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-xs">
                        H
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">Helps NGO Official</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 text-emerald-950" />
                        </div>
                        <span className="text-[10px] text-emerald-300">Verified Business Account</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                      WhatsApp Cloud API
                    </span>
                  </div>

                  {/* Message Bubble 1: Instant Thank You & 80G Receipt */}
                  <div className="space-y-3 font-sans">
                    <div className="bg-[#005c4b] text-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm max-w-[95%] space-y-2 text-xs border border-emerald-600/30">
                      <p className="font-bold text-emerald-200">
                        🙏 Namaste {testDonorName || 'Alex Johnson'},
                      </p>
                      <p className="text-zinc-100 leading-relaxed text-[11.5px]">
                        Thank you for your generous contribution of{' '}
                        <strong className="text-white font-mono font-bold">₹{(testAmount ?? 0).toLocaleString()}</strong> to{' '}
                        <strong>{testProject}</strong>.
                      </p>
                      <div className="bg-emerald-950/60 rounded-xl p-2.5 border border-emerald-700/50 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-emerald-300">Receipt No:</span>
                          <span className="text-white font-bold">REC-80G-2026-9042</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-300">80G Reg No:</span>
                          <span className="text-white">AABTH1234F20261</span>
                        </div>
                        <div className="flex justify-between text-emerald-300">
                          <span>Tax Benefit:</span>
                          <span className="text-emerald-300 font-bold">50% Statutory Deduction</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-100">
                        Your official statutory Form 10BE certificate is attached and ready for your tax filing.
                      </p>
                      <div className="pt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-300">
                        <span>Just now</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>

                    {/* WhatsApp Interactive CTA Buttons */}
                    <div className="space-y-1.5 max-w-[95%]">
                      <div className="bg-[#1f2c34] hover:bg-[#2a3942] rounded-xl p-2.5 text-center text-xs font-bold text-emerald-400 border border-emerald-800/40 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                        <FileCheck2 className="w-4 h-4" />
                        <span>📄 Download Form 10BE Certificate (PDF)</span>
                      </div>
                      <div className="bg-[#1f2c34] hover:bg-[#2a3942] rounded-xl p-2.5 text-center text-xs font-bold text-emerald-400 border border-emerald-800/40 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                        <TrendingUp className="w-4 h-4" />
                        <span>📍 Track Live Solar Borewell GIS Telemetry</span>
                      </div>
                    </div>

                    {/* Message Bubble 2: Automated Quarterly Milestone Update */}
                    <div className="bg-[#005c4b] text-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm max-w-[95%] space-y-2 text-xs border border-emerald-600/30">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Quarterly Impact Milestone Update</span>
                      </div>
                      <p className="text-zinc-100 leading-relaxed text-[11.5px]">
                        Because of your partnership in <strong>{testProject}</strong>, 18 new solar borewells are now active, delivering <strong>6.2 Million Litres</strong> of potable water to 15,800 villagers this quarter.
                      </p>
                      <div className="pt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-300">
                        <span>Scheduled Digest</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Webhook Test Dispatcher */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-200 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700">
                      Interactive Dispatch Simulator
                    </span>
                    <h4 className="text-sm font-black text-gray-900">
                      Trigger Real-time Webhook Payload
                    </h4>
                    <p className="text-xs text-gray-500">
                      Test WhatsApp & Email webhook events with custom parameters.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Donor Name
                      </label>
                      <input
                        type="text"
                        value={testDonorName}
                        onChange={(e) => setTestDonorName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Recipient WhatsApp Phone
                      </label>
                      <input
                        type="tel"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Donation Amount (₹)
                      </label>
                      <div className="flex gap-2">
                        {[1000, 2500, 5000, 25000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTestAmount(amt)}
                            className={`flex-1 py-1.5 rounded-lg border font-bold text-[11px] transition-all cursor-pointer ${
                              testAmount === amt
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Supported Program
                      </label>
                      <select
                        value={testProject}
                        onChange={(e) => setTestProject(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Barmer Solar Borewells & Clean Water Hubs">Barmer Solar Borewells & Clean Water Hubs</option>
                        <option value="Rural Smart Classrooms & Digital Labs">Rural Smart Classrooms & Digital Labs</option>
                        <option value="Mobile Medical Clinic & Telemedicine Vans">Mobile Medical Clinic & Telemedicine Vans</option>
                        <option value="Community Kitchens & Nutrition Kits">Community Kitchens & Nutrition Kits</option>
                      </select>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={handleSendTestDonationWhatsApp}
                        disabled={isSending}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isSending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Send WhatsApp Thank You Webhook</span>
                      </button>

                      <button
                        onClick={handleSendQuarterlyMilestone}
                        disabled={isSending}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Quarterly Impact Digest Webhook</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL TEMPLATE PREVIEW */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
                {/* Email Header */}
                <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xs">
                      H
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">HELPS NGO STATUTORY COMMUNICATIONS</h4>
                      <p className="text-[10px] text-gray-500">From: receipts@helpsngo.in • DKIM & SPF Signed</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Form 10BE Attached
                  </span>
                </div>

                {/* Email Subject */}
                <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-xs">
                  <span className="text-gray-500 font-bold">Subject: </span>
                  <strong className="text-orange-950">
                    Official 80G Tax Exemption Certificate & Thank You for Your Contribution (REC-80G-2026-9042)
                  </strong>
                </div>

                {/* Email Body Content */}
                <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
                  <p>Dear <strong>{testDonorName}</strong>,</p>
                  <p>
                    On behalf of the trustees, field coordinators, and beneficiary families of <strong>Helps NGO</strong>, we express our heartfelt gratitude for your generous support of <strong>₹{(testAmount ?? 0).toLocaleString()}</strong> toward <em>{testProject}</em>.
                  </p>

                  {/* Statutory Exemption Box */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Donation Amount:</span>
                      <strong className="text-sm font-black text-orange-600 font-mono">₹{(testAmount ?? 0).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Receipt / Form 10BE No:</span>
                      <strong className="font-mono text-gray-900">REC-80G-2026-9042</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">80G Registration Unique No:</span>
                      <strong className="font-mono text-gray-900">AABTH1234F20261</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Income Tax Deduction:</span>
                      <span className="text-emerald-700 font-bold">50% Deduction under Section 80G(5)(vi)</span>
                    </div>
                  </div>

                  <p>
                    As an active impact partner, you will automatically receive our <strong>Quarterly Impact Digest</strong> containing real-time IoT water telemetry readings, photo logs, and beneficiary accounts.
                  </p>
                </div>

                {/* Email Signoff */}
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900">Amarjeet Kumar</p>
                    <p className="text-[11px] text-gray-500">Managing Trustee, Helps NGO</p>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-mono">
                    NITI Aayog DARPAN: RJ/2021/0299102
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEBHOOK ENDPOINTS CONFIGURATION */}
          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">Configured Notification Webhooks</h4>
                  <p className="text-xs text-gray-500">Manage real-time automated HTTP POST triggers and cloud channels.</p>
                </div>
              </div>

              <div className="space-y-3">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      config.enabled
                        ? 'bg-white border-gray-300 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                            config.channel === 'whatsapp'
                              ? 'bg-emerald-600'
                              : config.channel === 'email'
                              ? 'bg-orange-600'
                              : 'bg-purple-600'
                          }`}
                        >
                          {config.channel === 'whatsapp' ? (
                            <MessageSquare className="w-4 h-4" />
                          ) : config.channel === 'email' ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <Webhook className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black text-gray-900">{config.name}</h5>
                            <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                              {config.channel.toUpperCase()}
                            </span>
                            {config.successRate && (
                              <span className="text-[10px] text-emerald-700 font-bold">
                                {config.successRate}% Success
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{config.description}</p>
                          <div className="font-mono text-[11px] text-gray-500 break-all bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            {config.endpointUrl}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={() => handleToggleWebhook(config.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Last triggered: {config.lastTriggeredAt || 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS & PAYLOAD INSPECTOR */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">Live Delivery Logs & Telemetry</h4>
                  <p className="text-xs text-gray-500">Inspect real-time HTTP 200 responses, latency, and JSON payloads.</p>
                </div>
                <button
                  onClick={() => setLogs(getStoredDeliveryLogs())}
                  className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            log.status === 'delivered' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <strong className="font-bold text-gray-900">{log.event}</strong>
                        <span className="text-[10px] font-mono uppercase bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                          {log.channel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          HTTP {log.httpStatusCode} • {log.latencyMs}ms
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-600 text-[11px]">
                      <div>
                        <span className="text-gray-400">Recipient: </span>
                        <strong className="font-mono text-gray-800">{log.recipient}</strong>
                        {log.recipientName && <span> ({log.recipientName})</span>}
                      </div>
                      <button
                        onClick={() => setSelectedLogForJson(selectedLogForJson?.id === log.id ? null : log)}
                        className="text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        {selectedLogForJson?.id === log.id ? 'Hide JSON' : 'Inspect Payload'}
                      </button>
                    </div>

                    {/* Expandable JSON Payload Inspector */}
                    {selectedLogForJson?.id === log.id && (
                      <div className="bg-zinc-900 text-zinc-100 rounded-xl p-3 font-mono text-[11px] relative space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-700 pb-1">
                          <span>Payload JSON Payload</span>
                          <button
                            onClick={() => handleCopyJson(log.payload)}
                            className="flex items-center gap-1 hover:text-white cursor-pointer"
                          >
                            {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto max-h-48 text-emerald-400">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DONOR PREFERENCES */}
          {activeTab === 'prefs' && (
            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-200 space-y-4 max-w-xl mx-auto">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900">Donor Notification Preferences</h4>
                <p className="text-xs text-gray-500">Configure your automated communication touchpoints.</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                  <div>
                    <strong className="block text-gray-900 font-bold">Instant WhatsApp Thank You & 80G Receipt</strong>
                    <span className="text-gray-500 text-[11px]">Receive immediate Form 10BE links via verified WhatsApp</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.whatsappThankYou}
                    onChange={(e) => handleSavePreferences({ ...preferences, whatsappThankYou: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                  <div>
                    <strong className="block text-gray-900 font-bold">Quarterly Milestone Impact Digest (WhatsApp & Email)</strong>
                    <span className="text-gray-500 text-[11px]">Automated 90-day progress metrics on solar borewells & schools</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.whatsappQuarterlyMilestones}
                    onChange={(e) =>
                      handleSavePreferences({ ...preferences, whatsappQuarterlyMilestones: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                  <div>
                    <strong className="block text-gray-900 font-bold">Emergency Drought & Flood Relief Alerts</strong>
                    <span className="text-gray-500 text-[11px]">Urgent notifications when high-priority field missions launch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emergencyAlerts}
                    onChange={(e) => handleSavePreferences({ ...preferences, emergencyAlerts: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                  <div>
                    <strong className="block text-gray-900 font-bold">Automatic Annual Tax Pack Dispatch (Form 10BE)</strong>
                    <span className="text-gray-500 text-[11px]">Year-end consolidated donation statement for Income Tax filing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.taxCertificateAutoSend}
                    onChange={(e) =>
                      handleSavePreferences({ ...preferences, taxCertificateAutoSend: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-End Encrypted Webhook Deliveries</span>
          </div>
          <button
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
