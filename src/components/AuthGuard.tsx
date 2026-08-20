import React, { ReactNode } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  LogIn, 
  Sparkles, 
  HeartHandshake, 
  Briefcase, 
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  permissionCheck?: (role?: UserRole | string) => boolean;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  onOpenAuth?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  requireAuth = false,
  permissionCheck,
  fallback,
  title = 'Authentication Required',
  description = 'Please sign in or create an account to unlock this feature and view your role-based dashboard.',
  onOpenAuth
}) => {
  const { user, isAuthenticated, currentRole, can, hasRole } = useAuth();

  // 1. If requireAuth is true and user is in Guest mode:
  if (requireAuth && !isAuthenticated) {
    if (fallback) return <>{fallback}</>;

    return (
      <div 
        id="auth-guard-unauthenticated-banner"
        className="w-full bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-xl my-4 animate-fadeIn"
      >
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
            Guest / Public Mode
          </span>
          <h3 className="text-base sm:text-lg font-black text-white">
            {title}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Pipeline Progression Breadcrumb */}
        <div className="max-w-md mx-auto p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-300 flex items-center justify-between gap-1">
          <span className="text-zinc-500 font-semibold">1. Auth</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-500 font-semibold">2. Profile</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-500 font-semibold">3. Role</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-500 font-semibold">4. Permissions</span>
          <ArrowRight className="w-3 h-3 text-zinc-600" />
          <span className="text-orange-400 font-bold">5. Dashboard</span>
        </div>

        {onOpenAuth && (
          <div className="pt-2 flex justify-center">
            <button
              id="auth-guard-sign-in-btn"
              type="button"
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with OTP / Email / Google</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. If allowedRoles is specified and current role is not included:
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div 
        id="auth-guard-unauthorized-banner"
        className="w-full bg-zinc-950 border border-rose-900/60 rounded-3xl p-5 text-center space-y-3 shadow-lg my-4 animate-fadeIn"
      >
        <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-white">
            Role Permission Restrained
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            This module is reserved for <strong className="text-rose-300">{allowedRoles.join(', ').toUpperCase()}</strong>. Your current authenticated role is <strong className="text-zinc-200">{currentRole.toUpperCase()}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // 3. If a specific RBAC permission check function fails:
  if (permissionCheck && !can(permissionCheck)) {
    if (fallback) return <>{fallback}</>;

    return null;
  }

  // Authorized: Render guarded component
  return <>{children}</>;
};

/**
 * Pipeline Status Visualizer Badge / Banner
 * Shows: Auth → Profile → Role → Permissions → Dashboard
 */
export const AuthPipelineVisualizer: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { user, isGuest, currentRole, pipelineState, logout } = useAuth();

  return (
    <aside 
      id="auth-pipeline-badge"
      aria-label="Security & Role Authorization Pipeline"
      className="w-full bg-zinc-950 text-white border-b border-zinc-800/80 px-3 py-1.5 text-[11px]"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
        {/* Pipeline Step Sequence */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-zinc-400">
          <span className="font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            RBAC Pipeline:
          </span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isGuest ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
            1. {isGuest ? 'Guest' : (user.authProvider?.toUpperCase() || 'VERIFIED')}
          </span>
          <span className="text-zinc-600">→</span>
          <span className={`px-1.5 py-0.5 rounded font-mono ${isGuest ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
            2. {isGuest ? 'Public Visitor' : user.name.split(' ')[0]}
          </span>
          <span className="text-zinc-600">→</span>
          <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
            currentRole === 'admin' 
              ? 'bg-purple-950 text-purple-300 border border-purple-800' 
              : currentRole === 'management'
              ? 'bg-blue-950 text-blue-300 border border-blue-800'
              : currentRole === 'volunteer'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : currentRole === 'donor'
              ? 'bg-amber-950 text-amber-300 border border-amber-800'
              : 'bg-zinc-800 text-zinc-400'
          }`}>
            3. {currentRole}
          </span>
          <span className="text-zinc-600">→</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
            4. {currentRole === 'admin' ? 'Full Authority' : currentRole === 'management' ? 'Field Ops' : currentRole === 'volunteer' ? 'Assigned Tasks' : currentRole === 'donor' ? '80G Exemption' : 'Public View'}
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-emerald-400 font-bold">
            5. {currentRole === 'guest' ? 'Public Screen' : 'Dashboard Active'}
          </span>
        </div>

        {/* Action shortcut */}
        <div className="flex items-center gap-2">
          {isGuest ? (
            onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                Sign In to access role dashboard →
              </button>
            )
          ) : (
            <span className="text-[10px] text-zinc-400">
              Logged in as <strong className="text-white">{user.name}</strong>
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
