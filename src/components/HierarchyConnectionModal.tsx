import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  Briefcase, 
  HeartHandshake, 
  Award, 
  Users, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  FileCheck2, 
  Sliders, 
  Eye, 
  FileText, 
  RefreshCw,
  GitBranch,
  Shield,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { RBAC } from '../services/rbacService';

interface HierarchyConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser?: (user: UserProfile) => void;
  onOpenUserManagement?: () => void;
  onOpenApprovalPipeline?: () => void;
  onOpenWorkAssignments?: () => void;
  onOpenCertificates?: () => void;
}

export const HierarchyConnectionModal: React.FC<HierarchyConnectionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onOpenUserManagement,
  onOpenApprovalPipeline,
  onOpenWorkAssignments,
  onOpenCertificates
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy_tree' | 'connections_flow' | 'permissions_matrix' | 'role_simulator'>('hierarchy_tree');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const currentRole = (currentUser.role || 'guest') as UserRole;

  // Organizational Tiers Specification
  const TIERS = [
    {
      role: 'admin' as UserRole,
      tierNumber: 1,
      title: 'Founder & National Managing Director',
      badge: 'Super Admin / Master Trustee',
      color: 'purple',
      bgGradient: 'from-purple-900 to-indigo-950',
      borderAccent: 'border-purple-500/60',
      textColor: 'text-purple-300',
      icon: ShieldCheck,
      keyPeople: 'Amarjeet Kumar (Founder & National Director)',
      reportingTo: 'Board of Trustees & Registrar of Societies',
      delegatesTo: 'Regional Operations Management & Volunteer Coordinators',
      responsibilities: [
        'Statutory compliance (12A, 80G, CSR-1, Societies Act XXI of 1860)',
        'Exclusive authority to assign, elevate, or revoke user roles',
        'Official Certificate Authority (Cryptographic signing & batch issuance)',
        'Final publishing gate for all public programs, stories, and metrics',
        'Batch creation, mission assignment, and financial disbursement audits',
        'System settings, WhatsApp webhook configurations & security logs'
      ],
      accessScope: 'Full System Control (Read, Write, Delete, Approve, Sign, Dispatch)'
    },
    {
      role: 'management' as UserRole,
      tierNumber: 2,
      title: 'Regional Operations & Field Logistics Manager',
      badge: 'Operations Management',
      color: 'blue',
      bgGradient: 'from-blue-950 to-slate-900',
      borderAccent: 'border-blue-500/60',
      textColor: 'text-blue-300',
      icon: Briefcase,
      keyPeople: 'Priya Sharma (Field Operations Lead), Vikram Singh (Logistics)',
      reportingTo: 'Master Trustee & National Director (Admin)',
      delegatesTo: 'Grassroots Changemakers & Field Volunteers',
      responsibilities: [
        'Supervises on-ground volunteer squads across rural and urban clusters',
        'Manages execution of operational batches authorized by Admin',
        'First-stage review and quality vetting of volunteer photo/GPS submissions',
        'Conducts ground water TDS audits and medical diagnostic camp logistics',
        'Logs and verifies volunteer service hours for honors certification',
        'Submits program expansion proposals and draft impact dispatches'
      ],
      accessScope: 'Controlled Operations Write (Subject to Admin Final Publishing Approval)'
    },
    {
      role: 'volunteer' as UserRole,
      tierNumber: 3,
      title: 'Field Changemaker & Grassroots Volunteer',
      badge: 'Field Volunteer (Auto-Assigned on Signup)',
      color: 'emerald',
      bgGradient: 'from-emerald-950 to-teal-950',
      borderAccent: 'border-emerald-500/60',
      textColor: 'text-emerald-300',
      icon: HeartHandshake,
      keyPeople: 'Rahul Verma (AABHA Lead), Ananya Roy (Health Squad), 4,500+ Youth',
      reportingTo: 'Regional Management & National Admin',
      delegatesTo: 'Peer field teams & community student groups',
      responsibilities: [
        'Direct ground execution: teaching at AABHA centers, ration parcel distribution',
        'Submits task completion proofs with geotagged photos and beneficiary metrics',
        'Follows safety checklists and operational SOPs for relief drives',
        'Logs verified service hours to qualify for verified Honors Certificates',
        'Reports village ground needs, water sensor status, and emergency alerts'
      ],
      accessScope: 'Assigned Work & Proof Submission (Cannot change roles or publish directly)'
    },
    {
      role: 'donor' as UserRole,
      tierNumber: 4,
      title: 'Registered Benefactor & CSR Partner',
      badge: 'Verified Donor',
      color: 'amber',
      bgGradient: 'from-amber-950 to-zinc-950',
      borderAccent: 'border-amber-500/60',
      textColor: 'text-amber-300',
      icon: Award,
      keyPeople: 'Individual Donors, Corporate CSR Partners, Diaspora Supporters',
      reportingTo: 'Independent Contributor',
      delegatesTo: 'None (Supports Field Initiatives)',
      responsibilities: [
        'Direct philanthropic support for education, healthcare, and water relief',
        'Access to instant Section 80G tax exemption certificates (Form 10BE)',
        'Views official signed letters of appreciation and annual transparency packs',
        'Receives real-time milestone notifications and IoT water well telemetry',
        'Requests CSR project co-branding and audits'
      ],
      accessScope: 'Philanthropic Records, 80G Receipts & Impact Milestone Tracking'
    },
    {
      role: 'guest' as UserRole,
      tierNumber: 5,
      title: 'Public Visitor & Community Member',
      badge: 'Public / Guest Mode',
      color: 'zinc',
      bgGradient: 'from-zinc-900 to-neutral-950',
      borderAccent: 'border-zinc-700',
      textColor: 'text-zinc-300',
      icon: Users,
      keyPeople: 'Global Citizens, Beneficiaries, Prospective Volunteers',
      reportingTo: 'Public Community',
      delegatesTo: 'None',
      responsibilities: [
        'Explore verified NGO programs, mission stories, and audited impact metrics',
        'Make secure instant tax-deductible contributions in INR via UPI / Gateway',
        'Apply for volunteer membership (Instantly enlists as Volunteer upon Signup)',
        'Verify digital certificates using QR code and Certificate Authority serials'
      ],
      accessScope: 'Read-Only Public Portal (Protected actions require Sign In / Signup)'
    }
  ];

  // Comprehensive Permissions Matrix
  const PERMISSIONS_MATRIX = [
    {
      feature: 'User Directory & Role Elevation',
      desc: 'Promote or reassign user roles, manage credentials',
      admin: true,
      mgmt: false,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Batch Authority & Assignment',
      desc: 'Create new project batches and assign operational units',
      admin: true,
      mgmt: false,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Certificate Authority & Signing',
      desc: 'Digitally issue, sign, seal, and revoke volunteer certificates',
      admin: true,
      mgmt: false,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Direct Content Publishing',
      desc: 'Publish campaigns, stories, and metrics to public without review',
      admin: true,
      mgmt: false,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: '80G Tax Approval Queue',
      desc: 'Audit and approve pending donation receipts for Form 10BE',
      admin: true,
      mgmt: false,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'System Webhooks & Audit Logs',
      desc: 'Access immutable audit trails and automated messaging triggers',
      admin: true,
      mgmt: true,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Field Submission Vetting',
      desc: 'Review and verify field drafts submitted by grassroots teams',
      admin: true,
      mgmt: true,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Task Delegation in Authorized Batches',
      desc: 'Assign daily checklists to volunteers in authorized missions',
      admin: true,
      mgmt: true,
      vol: false,
      donor: false,
      guest: false
    },
    {
      feature: 'Field Proof & Media Upload',
      desc: 'Submit photos, geotags, and beneficiary count deliverables',
      admin: true,
      mgmt: true,
      vol: true,
      donor: false,
      guest: false
    },
    {
      feature: 'Volunteer Hours & Checklist Logging',
      desc: 'Complete assigned task checklists and log service duration',
      admin: true,
      mgmt: true,
      vol: true,
      donor: false,
      guest: false
    },
    {
      feature: 'View & Download Own Certificate',
      desc: 'Access personal verified honors citation with QR validation',
      admin: true,
      mgmt: true,
      vol: true,
      donor: true,
      guest: false
    },
    {
      feature: '80G Tax Exemption Receipt (Form 10BE)',
      desc: 'Generate official 50% tax exemption deduction documents',
      admin: true,
      mgmt: false,
      vol: false,
      donor: true,
      guest: false
    },
    {
      feature: 'Official Letter of Appreciation',
      desc: 'Download high-res signed appreciation letter with NGO seal',
      admin: true,
      mgmt: false,
      vol: false,
      donor: true,
      guest: false
    },
    {
      feature: 'Public Program & Impact Explorer',
      desc: 'View public projects, IoT water telemetry, and stories',
      admin: true,
      mgmt: true,
      vol: true,
      donor: true,
      guest: true
    },
    {
      feature: 'Instant INR Donation (UPI/Card)',
      desc: 'Contribute funds with immediate receipt generation',
      admin: true,
      mgmt: true,
      vol: true,
      donor: true,
      guest: true
    },
    {
      feature: 'Volunteer Registration (Auto-Enroll)',
      desc: 'Sign up to immediately join active volunteer rosters',
      admin: true,
      mgmt: true,
      vol: true,
      donor: true,
      guest: true
    }
  ];

  return (
    <div 
      id="hierarchy-connection-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-[2rem] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Governance & Access Architecture
                </span>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">HELPS Welfare Society</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white mt-0.5">
                Organizational Hierarchy & Access Connection Matrix
              </h3>
            </div>
          </div>
          <button
            id="close-hierarchy-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer border border-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            id="tab-hierarchy-tree-btn"
            onClick={() => setActiveTab('hierarchy_tree')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'hierarchy_tree'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5-Tier Hierarchy</span>
          </button>

          <button
            id="tab-connections-flow-btn"
            onClick={() => setActiveTab('connections_flow')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'connections_flow'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow Connections</span>
          </button>

          <button
            id="tab-permissions-matrix-btn"
            onClick={() => setActiveTab('permissions_matrix')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'permissions_matrix'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Permissions Matrix (RBAC)</span>
          </button>

          <button
            id="tab-role-simulator-btn"
            onClick={() => setActiveTab('role_simulator')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'role_simulator'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Persona Switcher</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: 5-Tier Hierarchy Tree */}
          {activeTab === 'hierarchy_tree' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 text-xs text-orange-950 dark:text-orange-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-orange-900 dark:text-orange-300">
                    HELPS Welfare Society — Structured Chain of Command & Statutory Governance
                  </p>
                  <p className="text-gray-600 dark:text-zinc-300 leading-relaxed">
                    Our platform operates on a strict zero-trust Role-Based Access Control (RBAC) architecture. All users begin in <strong>Guest Mode</strong> upon page load. New signups automatically enroll into the <strong>Volunteer</strong> role. Only an authorized <strong>Trustee Admin</strong> can elevate roles or grant managerial credentials.
                  </p>
                </div>
              </div>

              {/* Tiers List */}
              <div className="space-y-3.5">
                {TIERS.map((tier) => {
                  const Icon = tier.icon;
                  const isCurrent = currentRole === tier.role;
                  const isSelected = selectedRoleDetail === tier.role;

                  return (
                    <div
                      key={tier.role}
                      onClick={() => setSelectedRoleDetail(tier.role)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-orange-500 bg-white dark:bg-zinc-800 shadow-lg border-orange-500' 
                          : 'bg-gray-50 dark:bg-zinc-800/70 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${tier.bgGradient} border ${tier.borderAccent} flex items-center justify-center text-white shadow-xs flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                                Level {tier.tierNumber}
                              </span>
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                tier.role === 'admin' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800' :
                                tier.role === 'management' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800' :
                                tier.role === 'volunteer' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                                tier.role === 'donor' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}>
                                {tier.badge}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                                  Your Active Role
                                </span>
                              )}
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white mt-1">
                              {tier.title}
                            </h4>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Leadership & Scale</span>
                          <span className="font-medium text-gray-700 dark:text-zinc-300">{tier.keyPeople}</span>
                        </div>
                      </div>

                      {/* Expanded Details when selected */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-3 text-xs animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                                Reports Directly To:
                              </span>
                              <p className="font-bold text-gray-800 dark:text-zinc-200">{tier.reportingTo}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                                Oversees & Delegates To:
                              </span>
                              <p className="font-bold text-gray-800 dark:text-zinc-200">{tier.delegatesTo}</p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider block">
                              Core Statutory Responsibilities:
                            </span>
                            <ul className="space-y-1 text-gray-600 dark:text-zinc-300">
                              {tier.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-purple-900 dark:text-purple-200 font-bold">
                            <span className="text-[11px]">Access Scope:</span>
                            <span className="text-[11px] font-extrabold">{tier.accessScope}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Connections & Workflow Flowchart */}
          {activeTab === 'connections_flow' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Interconnected NGO Workflows
                </span>
                <h4 className="text-base font-extrabold">How Roles Connect & Coordinate in Practice</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  HELPS NGO connects field changemakers with leadership and donors in real time. Below are the 4 fundamental interconnected loops:
                </p>
              </div>

              {/* Loop 1: Operational Batch Execution */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Layers className="w-5 h-5" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    1. Operational Mission Batch Lifecycle
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-purple-700 dark:text-purple-300">Phase 1: Admin</span>
                    <p className="font-extrabold text-gray-900 dark:text-white">Batch Created & Assigned</p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400">Admin defines mission objectives, target metrics, and budget.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-blue-700 dark:text-blue-300">Phase 2: Management</span>
                    <p className="font-extrabold text-gray-900 dark:text-white">Squad Task Delegation</p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400">Management assigns ground checklists to field volunteers.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">Phase 3: Volunteer</span>
                    <p className="font-extrabold text-gray-900 dark:text-white">Field Execution & Proofs</p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400">Volunteers execute on ground and upload photos & GPS coordinates.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-300">Phase 4: Admin / Public</span>
                    <p className="font-extrabold text-gray-900 dark:text-white">Sign-off & Honors Award</p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400">Admin closes batch, updates metrics, and awards certificates.</p>
                  </div>
                </div>
              </div>

              {/* Loop 2: 2-Stage Content Approval Pipeline */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <FileCheck2 className="w-5 h-5" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    2. Two-Stage Content Approval Pipeline
                  </h4>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
                  <div className="flex-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 w-full">
                    <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">Stage 1</span>
                    <p className="font-bold text-gray-900 dark:text-white">Volunteer Draft Submission</p>
                    <p className="text-[10px] text-gray-500">Submits impact story, report, or project draft with media.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                  <div className="flex-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 w-full">
                    <span className="text-[9px] font-black uppercase text-blue-700 dark:text-blue-300">Stage 2</span>
                    <p className="font-bold text-gray-900 dark:text-white">Management Review</p>
                    <p className="text-[10px] text-gray-500">Verifies factual accuracy, ground proofs & photos.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                  <div className="flex-1 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 w-full">
                    <span className="text-[9px] font-black uppercase text-purple-700 dark:text-purple-300">Final Gate</span>
                    <p className="font-bold text-gray-900 dark:text-white">Admin Final Publishing</p>
                    <p className="text-[10px] text-gray-500">Master Admin approves & publishes live to public website.</p>
                  </div>
                </div>
              </div>

              {/* Loop 3: Certificate Authority & Honors */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    3. Digital Certificate Authority Pipeline
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-500">Requirement</span>
                    <p className="font-bold text-gray-900 dark:text-white">Volunteer Completes Work</p>
                    <p className="text-[10px] text-gray-500">Logs hours & passes field checklist review.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-purple-700 dark:text-purple-300">Admin Authority</span>
                    <p className="font-bold text-gray-900 dark:text-white">Digital Cryptographic Issuance</p>
                    <p className="text-[10px] text-gray-500">Admin signs with official seal & generates unique serial ID.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">Public Validation</span>
                    <p className="font-bold text-gray-900 dark:text-white">Immutable Verification</p>
                    <p className="text-[10px] text-gray-500">QR code verification portal enables instant authenticity verification.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Permissions Matrix (RBAC) */}
          {activeTab === 'permissions_matrix' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                    Access Level & Permissions Matrix (RBAC)
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Granular permission matrix across all 5 user tiers
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-300 dark:border-purple-800">
                  Strict Enforcement
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border-b border-gray-200 dark:border-zinc-700">
                      <th className="p-3 font-extrabold">Capability / Feature</th>
                      <th className="p-3 font-extrabold text-center text-purple-600 dark:text-purple-400">Admin</th>
                      <th className="p-3 font-extrabold text-center text-blue-600 dark:text-blue-400">Mgmt</th>
                      <th className="p-3 font-extrabold text-center text-emerald-600 dark:text-emerald-400">Volunteer</th>
                      <th className="p-3 font-extrabold text-center text-amber-600 dark:text-amber-400">Donor</th>
                      <th className="p-3 font-extrabold text-center text-gray-500">Guest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                    {PERMISSIONS_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-gray-900 dark:text-white">{row.feature}</p>
                          <p className="text-[10px] text-gray-500 dark:text-zinc-400">{row.desc}</p>
                        </td>
                        <td className="p-3 text-center">
                          {row.admin ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 dark:text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {row.mgmt ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 dark:text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {row.vol ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 dark:text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {row.donor ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 dark:text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {row.guest ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 dark:text-zinc-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Live Persona Switcher */}
          {activeTab === 'role_simulator' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-800/80 text-purple-200 text-xs space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                  Role Simulator & Access Testing Console
                </span>
                <p className="leading-relaxed">
                  Instantly switch the active in-memory session among predefined organizational personas to test navigation menus, action permissions, and security guards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Persona 1: Admin */}
                <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-600/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-400">Master Trustee Admin</span>
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Amarjeet Kumar</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">amar@helpsngo.in</p>
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                      Full access to User Management, 80G Approvals, Certificate Signing & Batch Authority.
                    </p>
                  </div>
                  {onSwitchUser && (
                    <button
                      onClick={() => {
                        onSwitchUser({
                          name: 'Amarjeet Kumar',
                          email: 'amar@helpsngo.in',
                          role: 'admin',
                          title: 'Founder & National Managing Director',
                          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                          totalDonated: 125000,
                          causesSupported: 8,
                          badgesEarned: 12,
                          certificatesCount: 15,
                          is80GEligible: true,
                          authProvider: 'password'
                        });
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Admin Persona
                    </button>
                  )}
                </div>

                {/* Persona 2: Management */}
                <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-600/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-400">Operations Management</span>
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Priya Sharma</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">priya.mgmt@helpsngo.in</p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                      Manages volunteer tasks, reviews field submission drafts, audits batch progress.
                    </p>
                  </div>
                  {onSwitchUser && (
                    <button
                      onClick={() => {
                        onSwitchUser({
                          name: 'Priya Sharma',
                          email: 'priya.mgmt@helpsngo.in',
                          role: 'management',
                          title: 'Regional Field Operations Manager',
                          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                          totalDonated: 15000,
                          causesSupported: 4,
                          badgesEarned: 6,
                          certificatesCount: 3,
                          is80GEligible: true,
                          authProvider: 'password'
                        });
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Management Persona
                    </button>
                  )}
                </div>

                {/* Persona 3: Volunteer */}
                <div className="p-4 rounded-2xl bg-emerald-900/20 border border-emerald-600/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-400">Field Volunteer</span>
                      <HeartHandshake className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Rahul Verma</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">volunteer@helpsngo.in</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      Submits photo/GPS field proof, logs service hours, views personal Honors Certificate.
                    </p>
                  </div>
                  {onSwitchUser && (
                    <button
                      onClick={() => {
                        onSwitchUser({
                          name: 'Rahul Verma',
                          email: 'volunteer@helpsngo.in',
                          role: 'volunteer',
                          title: 'AABHA Child Education Field Volunteer',
                          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                          totalDonated: 5000,
                          causesSupported: 3,
                          badgesEarned: 4,
                          certificatesCount: 2,
                          is80GEligible: true,
                          authProvider: 'password'
                        });
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Volunteer Persona
                    </button>
                  )}
                </div>

                {/* Persona 4: Donor */}
                <div className="p-4 rounded-2xl bg-amber-900/20 border border-amber-600/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-400">Registered Benefactor</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Siddharth Oberoi</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">donor@helpsngo.in</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                      Access to 80G tax exemption certificates, signed appreciation letters & milestone telemetry.
                    </p>
                  </div>
                  {onSwitchUser && (
                    <button
                      onClick={() => {
                        onSwitchUser({
                          name: 'Siddharth Oberoi',
                          email: 'donor@helpsngo.in',
                          role: 'donor',
                          title: 'Philanthropic Benefactor',
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                          totalDonated: 75000,
                          causesSupported: 6,
                          badgesEarned: 8,
                          certificatesCount: 4,
                          is80GEligible: true,
                          authProvider: 'password'
                        });
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Donor Persona
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/80 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Active Session: <strong>{currentUser.name}</strong> ({currentRole.toUpperCase()})</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentRole === 'admin' && onOpenUserManagement && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUserManagement();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Manage User Directory & Roles
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
