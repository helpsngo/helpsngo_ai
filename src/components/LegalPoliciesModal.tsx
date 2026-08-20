import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  FileText, 
  Lock, 
  HeartHandshake, 
  Scale, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Search,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { LegalPolicySection } from '../types';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicyId?: string;
}

export const STATUTORY_POLICIES: LegalPolicySection[] = [
  {
    id: 'terms-and-conditions',
    title: '1. Terms of Service & NGO Bylaws',
    category: 'Legal Governance',
    lastUpdated: '2026-08-15',
    version: 'v2026.4',
    summary: 'Rules governing public portal access, intellectual property, donation terms, and general civic conduct.',
    content: `### 1. Acceptance of Terms
By accessing or using the HELPS Welfare Society portal (helpsngo.ai.studio), you agree to be bound by these statutory bylaws, Indian Trust Act provisions, and all applicable central & state laws.

### 2. Civic Non-Profit Mission
HELPS Welfare Society is an officially registered non-governmental organization operating under Section 12A and Section 80G of the Income Tax Act, 1961. All portal resources, fundraising campaigns, and community interventions are dedicated strictly to public benefit, rural education, clinical relief, clean drinking water, and environmental revitalization.

### 3. Account Responsibility & Zero-Trust Access
Users registered as field volunteers or trustees must maintain the confidentiality of their credentials. Any unauthorized access, scraping, or misuse of protected internal beneficiary or donor databases will result in immediate termination of access and statutory legal action.`
  },
  {
    id: 'privacy-policy',
    title: '2. Privacy & Data Protection (DPDP Act 2023)',
    category: 'Data Privacy',
    lastUpdated: '2026-08-15',
    version: 'v2026.3',
    summary: 'Comprehensive compliance with the Digital Personal Data Protection (DPDP) Act 2023 and GDPR guidelines.',
    content: `### 1. Data Collection & Purpose Limitation
We collect minimal personal data (Name, Email, Mobile Number, Government ID Proof for verified volunteers, PAN for 80G tax receipts) strictly for non-commercial NGO operations, donor statutory compliance, and volunteer safety dispatch.

### 2. Explicit Consent & Data Fiduciary Standards
HELPS acts as a Data Fiduciary under the DPDP Act 2023. User data is never sold, leased, or monetized. Explicit consent is captured before field deployment or processing tax certificates.

### 3. Data Subject Rights
You retain the statutory right to request a copy of your personal records, rectify errors, or exercise the right to be forgotten (subject to mandatory 7-year statutory financial audit records). Contact: amar@helpsngo.in.`
  },
  {
    id: 'refund-cancellation',
    title: '3. Donation Refund & Cancellation Policy',
    category: 'Finance & 80G',
    lastUpdated: '2026-08-10',
    version: 'v2026.2',
    summary: 'Standard operating procedures for voluntary contributions, duplicate payment refunds, and tax deduction receipts.',
    content: `### 1. Voluntary Contributions
All donations made to HELPS Welfare Society are voluntary charitable contributions toward our humanitarian field missions.

### 2. Refund Eligibility for Accidental Duplicate Transactions
In the event of an inadvertent technical duplicate deduction or erroneous payment amount, donors must notify our accounts desk within 7 working days with the payment reference ID.

### 3. Section 80G Tax Certificates
Upon processing a refund, any issued Section 80G tax exemption certificate is electronically revoked and updated in the Income Tax Department's Form 10BD annual statutory return.`
  },
  {
    id: 'donor-privacy-pii',
    title: '4. Donor Privacy & Financial Protection',
    category: 'Data Privacy',
    lastUpdated: '2026-08-18',
    version: 'v2026.5',
    summary: 'Zero-Trust masking of PAN numbers, transaction histories, and donor contact details across public portals.',
    content: `### 1. PII Masking Standards
Donor PAN numbers, phone numbers, and full home addresses are masked across all non-trustee views. Public leaderboards display donor contributions strictly with consent or under verified pseudonyms.

### 2. Tiered Financial Access
Only the designated Chief Financial Officer and National Managing Trustee have decryption rights to full statutory donor transaction ledgers.

### 3. No Commercial Dissemination
HELPS adheres to an absolute ban on sharing donor directories with third-party telemarketers or external fundraising agencies.`
  },
  {
    id: 'volunteer-safeguarding',
    title: '5. Volunteer Code of Conduct & Field Safety',
    category: 'Operations',
    lastUpdated: '2026-08-12',
    version: 'v2026.2',
    summary: 'Standards of ethical engagement, anti-harassment protocols, squad duty hours, and field safety.',
    content: `### 1. Ethical Engagement & Respect
Volunteers represent the core values of HELPS. Every volunteer must treat all community members, women, senior citizens, and children with absolute dignity and equality.

### 2. Anti-Harassment & POSH Policy
We maintain a strict zero-tolerance policy against any form of harassment, discrimination, or abusive conduct. Violations lead to immediate de-registration and reporting to local authorities.

### 3. Safety Gear & Squad Coordination
Volunteers deployed during emergency flood relief or night clinics must operate in squads of at least two members and carry emergency contact protocols.`
  },
  {
    id: 'child-safeguarding-pocso',
    title: '6. Child Protection & Vulnerable Beneficiary Policy',
    category: 'Safeguarding',
    lastUpdated: '2026-08-18',
    version: 'v2026.4',
    summary: 'Mandatory statutory compliance with the POCSO Act 2012, Juvenile Justice (JJ) Act, and UNICEF media ethics.',
    content: `### 1. Mandatory Parental/Guardian Consent
No photograph, video, or identifiable story of a minor (under 18 years) or vulnerable beneficiary may be uploaded or published without written consent from their legal guardian.

### 2. Face Blur & Dignified Representation
Media depicting beneficiaries in distressed medical or economic conditions must protect their human dignity. Sensationalized or degrading imagery is strictly banned.

### 3. POCSO & JJ Act Compliance
All field mentors in the AABHA digital literacy and school programs must pass background screening. Any suspicion of child neglect or abuse must be reported to the Child Welfare Committee (CWC) within 24 hours.`
  },
  {
    id: 'anti-bribery-fcra',
    title: '7. Anti-Corruption & Public Trust Governance',
    category: 'Legal Governance',
    lastUpdated: '2026-08-10',
    version: 'v2026.1',
    summary: 'Zero tolerance for bribery, strict vendor procurement auditing, and regulatory compliance.',
    content: `### 1. Zero Tolerance for Bribery
HELPS operates with uncompromised integrity. No officer, volunteer, or partner may offer, solicit, or receive any form of bribe or illegal gratification.

### 2. Competitive Vendor Procurement
All major equipment purchases (e.g. RO water filtration units, clinical van medical kits) require comparative quotations and Trustee Board sign-off.

### 3. Independent Annual Audit
Our books of accounts are audited annually by certified Chartered Accountants and submitted to the Registrar of Societies and the Income Tax Department.`
  },
  {
    id: 'grievance-whistleblower',
    title: '8. Grievance Redressal & Whistleblower Mechanism',
    category: 'Compliance',
    lastUpdated: '2026-08-15',
    version: 'v2026.3',
    summary: 'Confidential channel for reporting statutory violations, financial fraud, or ethics breaches without fear of retaliation.',
    content: `### 1. Protected Reporting Channel
Any volunteer, donor, or citizen can confidentially report violations of our bylaws, financial irregularities, or safeguarding issues directly to the Board of Trustees.

### 2. Whistleblower Non-Retaliation Guarantee
We guarantee complete confidentiality and protection against retaliation for any individual reporting in good faith.

### 3. Statutory Nodal Officer Contact
* **Nodal Officer:** Amarjeet Kumar (National Managing Trustee)
* **Dedicated Email:** compliance@helpsngo.in / amar@helpsngo.in
* **Direct Mobile Desk:** +91 94729 29856
* **Registered Address:** GNDEC Campus, Gill Park, Ludhiana, Punjab 141006`
  }
];

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  initialPolicyId
}) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(initialPolicyId || 'privacy-policy');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentPolicy = STATUTORY_POLICIES.find(p => p.id === selectedPolicyId) || STATUTORY_POLICIES[0];

  const filteredPolicies = STATUTORY_POLICIES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shadow-xs">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  Statutory Compliance
                </span>
                <span className="text-xs text-slate-400 font-mono">HELPS Welfare Society</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-0.5">
                Statutory Governance & Compliance Policies
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">
              Full statutory adherence: <strong>Indian Trust Act 1882</strong>, <strong>DPDP Act 2023</strong>, <strong>POCSO Act 2012</strong>, and <strong>Section 80G / 12A</strong> Income Tax bylaws.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-slate-300">
            Reg. No: 144/2019-20
          </span>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Policy Menu */}
          <div className="md:col-span-4 border-r border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-zinc-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter policies..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredPolicies.map((p) => {
                const isActive = p.id === currentPolicy.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPolicyId(p.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 shadow-xs'
                        : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {p.category}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400">{p.version}</span>
                    </div>
                    <h4 className="font-bold text-xs leading-tight line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Policy Detail Viewer */}
          <div className="md:col-span-8 overflow-y-auto p-5 sm:p-6 bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {currentPolicy.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {currentPolicy.title}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    Version: {currentPolicy.version} • Effective Date: {currentPolicy.lastUpdated}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Print statutory policy document"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* Policy Body */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed space-y-3">
                {(currentPolicy.content || currentPolicy.contentMarkdown || '').split('\n\n').map((block, idx) => {
                  if (block.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="font-extrabold text-sm text-gray-900 dark:text-white pt-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
                        {block.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (block.startsWith('* ')) {
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1 text-xs">
                        {block.split('\n').map((line, lIdx) => (
                          <li key={lIdx}>{line.replace('* ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx} className="leading-relaxed">{block}</p>;
                })}
              </div>
            </div>

            {/* Official Statutory Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <strong className="text-gray-900 dark:text-white block">Official Redressal & Compliance Desk</strong>
                <span>Direct inquiries: compliance@helpsngo.in | Phone: +91 94729 29856</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Board of Trustees Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
