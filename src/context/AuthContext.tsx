import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { GUEST_USER } from '../data/mockData';
import { 
  authService, 
  AuthResult, 
  RegisterPayload,
  INACTIVITY_TIMEOUT_MS
} from '../services/authService';

export type PipelineStage = 
  | 'guest_unauthenticated'
  | 'credentials_submitted'
  | 'identity_verified'
  | 'profile_loaded'
  | 'role_resolved'
  | 'permissions_granted'
  | 'dashboard_active';

export interface AuthPipelineState {
  stage: PipelineStage;
  authMethod: 'guest' | 'otp' | 'email';
  verifiedAt?: string;
  isNewUser?: boolean;
}

export interface AuthContextType {
  // Current user in active volatile session
  user: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  isManagement: boolean;
  isVolunteer: boolean;
  isDonor: boolean;
  currentRole: UserRole;

  // Pipeline Status & Transparency
  pipelineState: AuthPipelineState;

  // Authentication Methods (Strictly 2 Login Methods + Registration)
  requestWhatsAppOtp: (phone: string) => { success: boolean; message: string; otp?: string; notFound?: boolean; error?: string };
  loginWithWhatsAppOtp: (phone: string, otp: string) => AuthResult;
  loginWithEmail: (email: string, password: string) => AuthResult;
  registerWithEmail: (payload: RegisterPayload) => AuthResult;
  logout: () => void;
  setUserSession: (user: UserProfile) => void;

  // Permission & Role Checkers
  can: (permissionFn: (role?: UserRole | string) => boolean) => boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always strictly initialize in Guest mode on clean load/refresh
  const [user, setUser] = useState<UserProfile>(() => authService.getActiveSession() || GUEST_USER);
  
  const [pipelineState, setPipelineState] = useState<AuthPipelineState>(() => ({
    stage: user.role === 'guest' ? 'guest_unauthenticated' : 'dashboard_active',
    authMethod: (user.authProvider as any) || 'guest',
    verifiedAt: user.role === 'guest' ? undefined : new Date().toISOString()
  }));

  const isGuest = !user || user.role === 'guest';
  const isAuthenticated = !isGuest;
  const currentRole = (user.role || 'guest') as UserRole;
  const isAdmin = currentRole === 'admin' || currentRole === 'super_admin';
  const isManagement = currentRole === 'management' || currentRole === 'program_manager';
  const isVolunteer = currentRole === 'volunteer';
  const isDonor = currentRole === 'donor';

  // Request WhatsApp OTP (Available only for registered accounts)
  const requestWhatsAppOtp = (phone: string) => {
    return authService.sendWhatsAppOtp(phone);
  };

  // 1. WhatsApp OTP Login (Authenticate existing account)
  const loginWithWhatsAppOtp = (phone: string, otp: string): AuthResult => {
    setPipelineState({
      stage: 'credentials_submitted',
      authMethod: 'otp'
    });

    const result = authService.verifyWhatsAppOtp(phone, otp);
    if (result.success && result.user) {
      setUser(result.user);
      setPipelineState({
        stage: 'dashboard_active',
        authMethod: 'otp',
        verifiedAt: new Date().toISOString(),
        isNewUser: false
      });
    } else {
      setPipelineState({
        stage: 'guest_unauthenticated',
        authMethod: 'guest'
      });
    }
    return result;
  };

  // 2. Email + Password Login (Authenticate existing account)
  const loginWithEmail = (email: string, password: string): AuthResult => {
    setPipelineState({
      stage: 'credentials_submitted',
      authMethod: 'email'
    });

    const result = authService.signInWithEmailPassword(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setPipelineState({
        stage: 'dashboard_active',
        authMethod: 'email',
        verifiedAt: new Date().toISOString(),
        isNewUser: false
      });
    } else {
      setPipelineState({
        stage: 'guest_unauthenticated',
        authMethod: 'guest'
      });
    }
    return result;
  };

  // 3. New User Registration: Email + Password + WhatsApp Number
  const registerWithEmail = (payload: RegisterPayload): AuthResult => {
    setPipelineState({
      stage: 'credentials_submitted',
      authMethod: 'email'
    });

    const result = authService.registerWithEmailPassword(payload);
    if (result.success && result.user) {
      setUser(result.user);
      setPipelineState({
        stage: 'dashboard_active',
        authMethod: 'email',
        verifiedAt: new Date().toISOString(),
        isNewUser: true
      });
    }
    return result;
  };

  // 4. Logout -> Return strictly to Guest mode
  const logout = useCallback(() => {
    authService.signOut(user);
    setUser(GUEST_USER);
    setPipelineState({
      stage: 'guest_unauthenticated',
      authMethod: 'guest'
    });
  }, [user]);

  // Track user activity and auto logout after 10 minutes of inactivity
  useEffect(() => {
    if (isGuest) return;

    // Reset / touch last activity in storage
    const handleUserActivity = () => {
      authService.touchActivity();
    };

    // Events to monitor user interaction
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Check periodically every 15 seconds for inactivity timeout (> 10 minutes)
    const intervalId = setInterval(() => {
      if (authService.isSessionExpired()) {
        console.warn('Session expired due to 10 minutes of inactivity. Logging out...');
        logout();
      }
    }, 15000);

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      clearInterval(intervalId);
    };
  }, [isGuest, logout]);

  const setUserSession = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    authService.saveActiveSession(updatedUser);
    if (updatedUser.role === 'guest') {
      setPipelineState({
        stage: 'guest_unauthenticated',
        authMethod: 'guest'
      });
    } else {
      setPipelineState({
        stage: 'dashboard_active',
        authMethod: (updatedUser.authProvider as any) || 'email',
        verifiedAt: new Date().toISOString()
      });
    }
  };

  // Permission evaluator
  const can = (permissionFn: (role?: UserRole | string) => boolean): boolean => {
    return permissionFn(currentRole);
  };

  // Role Checker
  const hasRole = (...roles: UserRole[]): boolean => {
    return roles.includes(currentRole);
  };

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isGuest,
    isAdmin,
    isManagement,
    isVolunteer,
    isDonor,
    currentRole,
    pipelineState,
    requestWhatsAppOtp,
    loginWithWhatsAppOtp,
    loginWithEmail,
    registerWithEmail,
    logout,
    setUserSession,
    can,
    hasRole
  }), [user, isAuthenticated, isGuest, isAdmin, isManagement, isVolunteer, isDonor, currentRole, pipelineState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
