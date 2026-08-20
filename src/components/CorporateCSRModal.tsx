import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Download, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  X, 
  ExternalLink, 
  Briefcase, 
  PieChart, 
  Users, 
  HeartHandshake, 
  Award,
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

interface CorporateCSRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiatePledge?: (amount: number, companyName: string, program: string) => void;
}

const FUND_UTILIZATION_DATA = [
  { name: 'Direct Field Programs & Equipment', value: 88.4, color: '#16a34a' },
  { name: 'Cold-Chain & Rural Logistics', value: 6.8, color: '#0284c7' },
  { name: 'Independent Statutory Audits & Tech', value: 4.8, color: '#f97316' },
];

export const CorporateCSRModal: React.FC<CorporateCSRModalProps> = ({
  isOpen,
  onClose,
  onInitiatePledge
}) => {
  const [activeTab, setActiveTab] = useState<'co_sponsor' | 'compliance' | 'matching' | 'grant_kit'>('co_sponsor');
  
  // Co-Sponsorship Form State
  const [companyName, setCompanyName] = useState<string>('');
  const [csrContactName, setCsrContactName] = useState<string>('');
  const [csrEmail, setCsrEmail] = useState<string>('');
  const [csrPhone, setCsrPhone] = useState<string>('');
  const [selectedFocus, setSelectedFocus] = useState<string>('Clean Water Solar Wells');
  const [pledgeTier, setPledgeTier] = useState<number>(500000); // 5 Lakhs INR
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Matching Gift Calculator State
  const [employeeCount, setEmployeeCount] = useState<number>(250);
  const [avgEmployeeGift, setAvgEmployeeGift] = useState<number>(2000);
  const [matchRatio, setMatchRatio] = useState<number>(1); // 1:1 match

  if (!isOpen) return null;

  const totalEmployeePool = employeeCount * avgEmployeeGift;
  const corporateMatchAmount = totalEmployeePool * matchRatio;
  const combinedImpactTotal = totalEmployeePool + corporateMatchAmount;

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !csrContactName || !csrEmail) return;
    setIsSubmitted(true);
    if (onInitiatePledge) {
      onInitiatePledge(pledgeTier, companyName, selectedFocus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                  Section 135 Companies Act Ready
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Form CSR-1 Certified
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Corporate CSR & Institutional Co-Sponsorship Suite
              </h2>
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
        <div className="bg-gray-50 border-b border-gray-200 px-5 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'co_sponsor', label: 'Co-Sponsorship Portal', icon: Building2 },
            { id: 'compliance', label: 'MCA CSR-1 & Audits', icon: ShieldCheck },
            { id: 'matching', label: 'Payroll Match Calculator', icon: Calculator },
            { id: 'grant_kit', label: 'CSR Grant Proposal Pack', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'co_sponsor' && (
            <div className="space-y-6">
              {/* Value Proposition */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-orange-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Turnkey Brand Impact Partnership</span>
                </div>
                <h3 className="text-base font-black text-gray-900">
                  Co-Brand a Solar Water Borewell or High-Tech Rural STEM Lab
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Every CSR co-sponsorship includes permanent steel foundation plaques with your corporate logo, live IoT dashboard access for shareholders, quarterly statutory impact reports, and employee volunteer field engagement days.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-emerald-950">
                    CSR Co-Sponsorship Dossier Generated!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold">{csrContactName}</span> from <span className="font-bold">{companyName}</span>. Our National Managing Trustee (<span className="font-bold">Amarjeet Kumar</span>) and CSR compliance office have received your ₹{(pledgeTier ?? 0).toLocaleString()} allocation for {selectedFocus}.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Submit Another Co-Sponsorship
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePledgeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Corporation / Foundation Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Infosys Foundation, Tata Motors"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        CSR Director / Point of Contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={csrContactName}
                        onChange={(e) => setCsrContactName(e.target.value)}
                        placeholder="e.g. Rajesh Khurana (VP CSR)"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Official Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={csrEmail}
                        onChange={(e) => setCsrEmail(e.target.value)}
                        placeholder="csr@yourcompany.com"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Direct Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={csrPhone}
                        onChange={(e) => setCsrPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Choose Strategic CSR Impact Focus
                    </label>
                    <select
                      value={selectedFocus}
                      onChange={(e) => setSelectedFocus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                    >
                      <option value="AABHA Child Education Centers">AABHA — Ek Nayi Kiran: Evening Learning Centers & STEM Tablets (Ludhiana / Punjab)</option>
                      <option value="Green Earth with Bharat & Clean Water">Green Earth with Bharat: Mass Tree Plantations & Clean Water Installations (GNDEC Chapter)</option>
                      <option value="Mobile Healthcare & Medical Camps">Mobile Healthcare & Diagnostic Clinical Camps (Rural Punjab & Slums)</option>
                      <option value="Daily Nutrition & Hunger Relief">Daily Nutrition & Community Hunger Relief Drives</option>
                      <option value="Women Vocational Stitching Centers">Women Empowerment & Certified Vocational Stitching Units</option>
                    </select>
                  </div>

                  {/* Tier Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Proposed CSR Allocation Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { amount: 250000, label: '₹2.5 Lakhs', tier: 'Silver Partner', desc: '1 Solar Borewell or 30 STEM Tablet Kits' },
                        { amount: 500000, label: '₹5.0 Lakhs', tier: 'Gold Co-Sponsor', desc: '2 Solar Water Hubs + Dedicated Ground Plaque' },
                        { amount: 1500000, label: '₹15.0 Lakhs', tier: 'Platinum Keystone', desc: 'Full Cluster Turnkey Hub + Live IoT Telemetry' },
                      ].map(t => (
                        <button
                          type="button"
                          key={t.amount}
                          onClick={() => setPledgeTier(t.amount)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            pledgeTier === t.amount
                              ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-gray-900">{t.label}</span>
                            <span className="text-[10px] font-bold text-orange-600 uppercase">{t.tier}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request CSR Partnership Pack & Mou</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Compliance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-widest block">
                    Ministry of Corporate Affairs
                  </span>
                  <h4 className="text-sm font-black text-emerald-950">Form CSR-1 Verified</h4>
                  <p className="text-[11px] text-emerald-700 font-mono">Reg ID: CSR00039281</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-widest block">
                    Income Tax Department
                  </span>
                  <h4 className="text-sm font-black text-blue-950">12A & 80G Tax Exemption</h4>
                  <p className="text-[11px] text-blue-700 font-mono">Order: ITBA/EXM/S/80G/2026</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-purple-800 uppercase tracking-widest block">
                    NITI Aayog Darpan Portal
                  </span>
                  <h4 className="text-sm font-black text-purple-950">Registered NGO Entity</h4>
                  <p className="text-[11px] text-purple-700 font-mono">DARPAN: RJ/2021/0299102</p>
                </div>
              </div>

              {/* Fund Utilization Transparent Breakdown */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">
                      Statutory Fund Utilization Ledger (FY 2025-26)
                    </h4>
                    <p className="text-xs text-gray-500">
                      Audited by Sharma & Associates, Chartered Accountants
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    88.4% Direct Field Ratio
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={FUND_UTILIZATION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {FUND_UTILIZATION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any) => [`${val}%`, 'Allocation']}
                          contentStyle={{ borderRadius: '0.75rem', fontSize: '11px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {FUND_UTILIZATION_DATA.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-black text-gray-900 font-mono">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matching' && (
            <div className="space-y-6">
              <div className="bg-zinc-900 text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-400" />
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Corporate Employee Matching Gift Simulator
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    Payroll Giving
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Participating Employees</label>
                    <input
                      type="number"
                      min={10}
                      max={50000}
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(Number(e.target.value) || 0)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Avg. Monthly Gift / Emp (₹)</label>
                    <input
                      type="number"
                      min={100}
                      step={500}
                      value={avgEmployeeGift}
                      onChange={(e) => setAvgEmployeeGift(Number(e.target.value) || 0)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Corporate Match Ratio</label>
                    <select
                      value={matchRatio}
                      onChange={(e) => setMatchRatio(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
                    >
                      <option value={0.5}>0.5 : 1 (50% Match)</option>
                      <option value={1}>1 : 1 (100% Match)</option>
                      <option value={2}>2 : 1 (200% Double Match)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Employee Pool</span>
                    <span className="text-base font-black text-white font-mono">₹{(totalEmployeePool ?? 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-orange-400 uppercase font-bold block">Corporate Match</span>
                    <span className="text-base font-black text-orange-400 font-mono">₹{(corporateMatchAmount ?? 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">Total Monthly Impact</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">₹{(combinedImpactTotal ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grant_kit' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm font-black text-gray-900">
                  Statutory CSR Compliance & Grant Proposal Bundle
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Download audited PDFs, Form CSR-1 certificate, FCRA registration, 12A/80G orders, and detailed field budget breakups for board approval.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Helps NGO Comprehensive CSR Dossier (FY 2026-27)', size: '3.4 MB', type: 'PDF' },
                  { title: 'MCA Form CSR-1 & Trust Deed Registration Certificate', size: '1.8 MB', type: 'PDF' },
                  { title: 'Section 80G / 12A Permanent Income Tax Exemption Order', size: '1.2 MB', type: 'PDF' },
                  { title: 'Solar Borewell & STEM Lab Turnkey BOQ / Budget Breakdown', size: '850 KB', type: 'XLSX / PDF' }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black">
                        {doc.type}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">{doc.title}</h5>
                        <span className="text-[10px] text-gray-400">{doc.size} • Verified Valid</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${doc.title}...`)}
                      className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Helpline: <strong className="text-gray-900">+91 94729 29856 / +91 62837 77177</strong> (Founder & National Managing Director Amarjeet Kumar)</span>
          </div>
          <button
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
