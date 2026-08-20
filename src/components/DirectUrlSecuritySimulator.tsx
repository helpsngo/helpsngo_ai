import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Copy,
  ExternalLink,
  Sparkles,
  Eye,
  Key
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { isRouteAuthorized, ROLE_PERMISSIONS_MAP } from '../services/rbacService';

interface DirectUrlSecuritySimulatorProps {
  currentUser: UserProfile;
  onNavigateToScreen?: (screen: any) => void;
}

interface TestCase {
  url: string;
  description: string;
  requiredRole: string;
  expectedStatus: 200 | 401 | 403;
}

export const ROUTE_TEST_CASES: TestCase[] = [
  {
    url: '/home',
    description: 'Public Landing & Impact Dashboard',
    requiredRole: 'Any (Public / Guest)',
    expectedStatus: 200
  },
  {
    url: '/volunteer-portal',
    description: 'Volunteer Field Dispatch & Task Certificates',
    requiredRole: 'Verified Volunteer / Program Manager / Admin',
    expectedStatus: 200
  },
  {
    url: '/donate',
    description: 'Donor Giving & Section 80G Tax Exemption Portal',
    requiredRole: 'Any (Public / Donor)',
    expectedStatus: 200
  },
  {
    url: '/admin/user-directory',
    description: 'Trustee User Management & Role Elevation',
    requiredRole: 'Trustee Admin / Super Admin only',
    expectedStatus: 403
  },
  {
    url: '/financials/audit-ledger',
    description: 'Statutory 80G Tax Records & Donor Financial PII',
    requiredRole: 'Finance Officer / Trustee Admin only',
    expectedStatus: 403
  },
  {
    url: '/content-pipeline/publish',
    description: 'Final Story Approval & Minor Safeguarding Verification',
    requiredRole: 'Content Manager / Trustee Admin only',
    expectedStatus: 403
  },
  {
    url: '/admin/audit-logs',
    description: 'Immutable System Audit Trail & Security Logs',
    requiredRole: 'Trustee Admin / Super Admin only',
    expectedStatus: 403
  }
];

export const DirectUrlSecuritySimulator: React.FC<DirectUrlSecuritySimulatorProps> = ({
  currentUser,
  onNavigateToScreen
}) => {
  const [customUrl, setCustomUrl] = useState<string>('/admin/user-directory');
  const [testResult, setTestResult] = useState<{
    authorized: boolean;
    reason: string;
    route: string;
    testedRole: UserRole;
    timestamp: string;
  } | null>(null);

  const handleTestRoute = (urlToTest: string) => {
    const res = isRouteAuthorized(currentUser, urlToTest);
    setTestResult({
      authorized: res.authorized,
      reason: res.reason,
      route: urlToTest,
      testedRole: currentUser.role || 'guest',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700">
                Security Sandbox
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero-Trust Route Guard</span>
            </div>
            <h3 className="font-extrabold text-base text-white mt-0.5">
              Direct URL & Endpoint Authorization Simulator
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Testing as:</span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-900/50 text-purple-200 border border-purple-700">
            {currentUser.role ? currentUser.role.toUpperCase() : 'GUEST'} ({currentUser.name})
          </span>
        </div>
      </div>

      {/* Simulator Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        Verify that protected internal URLs cannot be accessed by typing direct URL strings in the address bar without matching RBAC permissions.
      </p>

      {/* Interactive URL Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
            https://helpsngo.ai.studio
          </span>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="/admin/user-directory"
            className="w-full pl-52 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="button"
          onClick={() => handleTestRoute(customUrl)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Execute Route Check</span>
        </button>
      </div>

      {/* Test Execution Result */}
      {testResult && (
        <div className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
          testResult.authorized
            ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
            : 'bg-rose-950/40 border-rose-700 text-rose-200'
        }`}>
          <div className="flex items-start gap-3">
            {testResult.authorized ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-extrabold text-xs tracking-wider uppercase">
                  {testResult.authorized ? '✓ 200 OK — Route Access Authorized' : '✗ 403 Forbidden / 401 Unauthorized — Access Blocked'}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">{testResult.timestamp}</span>
              </div>
              <p className="text-xs font-mono mt-1 text-slate-200">{testResult.reason}</p>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-3">
                <span>Evaluated Route: <code className="text-purple-300">{testResult.route}</code></span>
                <span>Active Role: <code className="text-purple-300">{testResult.testedRole}</code></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Preset Buttons */}
      <div className="pt-2 border-t border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          One-Click Statutory Route Test Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ROUTE_TEST_CASES.map((tc) => (
            <button
              key={tc.url}
              type="button"
              onClick={() => {
                setCustomUrl(tc.url);
                handleTestRoute(tc.url);
              }}
              className="p-2.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-300 group-hover:text-purple-200">
                    {tc.url}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tc.description}</p>
              </div>
              <span className="text-[9px] text-slate-500 mt-1 font-mono">{tc.requiredRole}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
