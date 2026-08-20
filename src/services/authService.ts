import { UserProfile, UserRole } from '../types';
import { 
  ADMIN_USER, 
  VOLUNTEER_USER, 
  GUEST_USER, 
  SEEDED_ACCOUNTS, 
  SeedCredential 
} from '../data/mockData';
import { appendAuditLog } from './rbacService';

export const STORAGE_USERS_KEY = 'helps_ngo_registered_accounts_v4';
export const STORAGE_SESSION_KEY = 'helps_ngo_active_session_v4';
export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export interface SessionData {
  user: UserProfile;
  lastActivity: number; // timestamp in ms
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string; // WhatsApp Number is mandatory during registration
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  notFound?: boolean;
  isNewUser?: boolean;
  message?: string;
}

// In-memory pending OTP registry
interface PendingOtp {
  identifier: string; // phone or email
  otp: string;
  expiresAt: number;
}

class AuthService {
  // Active session during runtime initialized from stored session or defaulting to GUEST_USER
  private activeSessionUser: UserProfile = GUEST_USER;
  private pendingOtps: Map<string, PendingOtp> = new Map();

  constructor() {
    this.initSessionFromStorage();
  }

  private initSessionFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (stored) {
        const data: SessionData = JSON.parse(stored);
        const now = Date.now();
        // Check 10-minute inactivity limit
        if (data.lastActivity && now - data.lastActivity <= INACTIVITY_TIMEOUT_MS) {
          if (data.user && data.user.role !== 'guest') {
            this.activeSessionUser = data.user;
            // Refresh activity timestamp
            this.touchActivity();
            return;
          }
        } else {
          // Expired session due to inactivity (>10 mins)
          this.clearSessionStorage();
        }
      }
    } catch (e) {
      console.warn('Failed to load session from storage:', e);
    }
    this.activeSessionUser = GUEST_USER;
  }

  // Update last activity timestamp to prevent timeout on user interaction
  public touchActivity(): void {
    if (this.activeSessionUser && this.activeSessionUser.role !== 'guest') {
      try {
        const sessionData: SessionData = {
          user: this.activeSessionUser,
          lastActivity: Date.now()
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn('Failed to save session activity:', e);
      }
    }
  }

  // Check if current session is expired (>10 minutes inactive)
  public isSessionExpired(): boolean {
    if (!this.activeSessionUser || this.activeSessionUser.role === 'guest') {
      return false;
    }
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!stored) return true;
      const data: SessionData = JSON.parse(stored);
      if (!data.lastActivity || Date.now() - data.lastActivity > INACTIVITY_TIMEOUT_MS) {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  }

  private clearSessionStorage(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.warn('Failed to clear session storage:', e);
    }
  }

  // Helper to normalize phone numbers (e.g. +91 94729 29856 -> 9472929856)
  public normalizePhone(phone: string): string {
    return (phone || '').replace(/\D/g, '').slice(-10);
  }

  // Retrieve all registered accounts from localStorage plus pre-seeded accounts
  public getRegisteredAccounts(): SeedCredential[] {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      const accountMap = new Map<string, SeedCredential>();
      
      // Add seeded accounts first
      SEEDED_ACCOUNTS.forEach(acc => {
        accountMap.set(acc.email.toLowerCase(), acc);
      });

      // Overlay with custom registered or updated accounts
      if (stored) {
        const parsed: SeedCredential[] = JSON.parse(stored);
        parsed.forEach(acc => {
          accountMap.set(acc.email.toLowerCase(), acc);
        });
      }

      return Array.from(accountMap.values());
    } catch (e) {
      console.warn('Failed to parse registered accounts:', e);
      return SEEDED_ACCOUNTS;
    }
  }

  // Save account to persistent user list
  public saveAccount(newCred: SeedCredential): void {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      const existing: SeedCredential[] = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter(a => a.email.toLowerCase() !== newCred.email.toLowerCase());
      const updated = [newCred, ...filtered];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save account:', e);
    }
  }

  // Get current active session
  public getActiveSession(): UserProfile {
    // If session is expired on check, reset to guest
    if (this.isSessionExpired()) {
      this.signOut();
      return GUEST_USER;
    }
    return this.activeSessionUser;
  }

  // Save active session persistently with current activity timestamp
  public saveActiveSession(user: UserProfile): void {
    this.activeSessionUser = user;
    if (user && user.role !== 'guest') {
      try {
        const sessionData: SessionData = {
          user,
          lastActivity: Date.now()
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn('Failed to persist active session:', e);
      }
    } else {
      this.clearSessionStorage();
    }
  }

  // Find account by WhatsApp/phone number
  public findAccountByPhone(phone: string): SeedCredential | undefined {
    const rawDigits = this.normalizePhone(phone);
    if (!rawDigits || rawDigits.length < 10) return undefined;

    const allAccounts = this.getRegisteredAccounts();
    return allAccounts.find(acc => {
      const accPhone = this.normalizePhone(acc.userProfile.phone || '');
      return accPhone === rawDigits;
    });
  }

  // Find account by Email
  public findAccountByEmail(email: string): SeedCredential | undefined {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return undefined;

    const allAccounts = this.getRegisteredAccounts();
    return allAccounts.find(acc => acc.email.toLowerCase() === cleanEmail);
  }

  // -------------------------------------------------------------
  // METHOD 1: Email + Password Authentication
  // Available ONLY to users who have registered.
  // -------------------------------------------------------------
  public signInWithEmailPassword(email: string, password: string): AuthResult {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both your registered email address and password.' };
    }

    const matched = this.findAccountByEmail(cleanEmail);

    if (!matched) {
      return { 
        success: false, 
        notFound: true,
        error: `No account found for "${cleanEmail}". Please check your email or sign up first.` 
      };
    }

    if (matched.password !== cleanPassword) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify your credentials or use Forgot Password.' 
      };
    }

    const authenticatedUser: UserProfile = {
      ...matched.userProfile,
      authProvider: 'password',
      emailVerified: true
    };

    this.saveActiveSession(authenticatedUser);

    // Record audit log
    appendAuditLog(
      'LOGIN',
      authenticatedUser,
      'user',
      authenticatedUser.email,
      authenticatedUser.name,
      `User signed in via Email & Password: ${authenticatedUser.name} (${authenticatedUser.role.toUpperCase()})`,
      'Guest / Public',
      `Active Session (${authenticatedUser.role})`
    );

    return {
      success: true,
      user: authenticatedUser,
      isNewUser: false,
      message: `Welcome back, ${authenticatedUser.name}!`
    };
  }

  // -------------------------------------------------------------
  // METHOD 2: WhatsApp OTP Authentication
  // Available ONLY if the WhatsApp number is already registered.
  // Strictly DOES NOT auto-create an account.
  // -------------------------------------------------------------

  public sendWhatsAppOtp(phone: string): { success: boolean; message: string; otp?: string; notFound?: boolean; error?: string } {
    const rawDigits = this.normalizePhone(phone);
    if (!rawDigits || rawDigits.length < 10) {
      return { 
        success: false, 
        message: 'Please enter a valid 10-digit WhatsApp number.',
        error: 'Invalid WhatsApp number format' 
      };
    }

    // Check if WhatsApp number is already registered
    const existing = this.findAccountByPhone(rawDigits);
    if (!existing) {
      return {
        success: false,
        notFound: true,
        message: 'No account found with this WhatsApp number. Please sign up first.',
        error: 'No account found with this WhatsApp number. Please sign up first.'
      };
    }

    // Generate simulated 6-digit OTP code (e.g. 729856 or 123456)
    const generatedOtp = rawDigits === '9472929856' ? '729856' : rawDigits === '9876543210' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in pending map with 5 minute expiration
    this.pendingOtps.set(rawDigits, {
      identifier: rawDigits,
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    return {
      success: true,
      message: `One-time code sent via WhatsApp to +91 ${rawDigits}. (Demo Code: ${generatedOtp})`,
      otp: generatedOtp
    };
  }

  public verifyWhatsAppOtp(phone: string, enteredOtp: string): AuthResult {
    const rawDigits = this.normalizePhone(phone);
    const cleanOtp = (enteredOtp || '').trim();

    if (!rawDigits || rawDigits.length < 10) {
      return { success: false, error: 'Please provide a valid 10-digit WhatsApp number.' };
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      return { success: false, error: 'Please enter the 6-digit verification code sent to your WhatsApp.' };
    }

    // OTP login is available ONLY if the number is already registered
    const existing = this.findAccountByPhone(rawDigits);
    if (!existing) {
      return {
        success: false,
        notFound: true,
        error: 'No account found with this WhatsApp number. Please sign up first.'
      };
    }

    // Validate OTP against pending map or accepted demo codes
    const pending = this.pendingOtps.get(rawDigits);
    const isMasterDemoCode = cleanOtp === '123456' || cleanOtp === '729856' || cleanOtp === '947292';
    const isPendingValid = pending && pending.otp === cleanOtp && pending.expiresAt > Date.now();

    if (!isPendingValid && !isMasterDemoCode) {
      return { 
        success: false, 
        error: 'Invalid or expired WhatsApp OTP. Please request a new code.' 
      };
    }

    // Clear used pending OTP
    this.pendingOtps.delete(rawDigits);

    // Authenticate the existing account
    const authenticatedUser: UserProfile = {
      ...existing.userProfile,
      authProvider: 'otp',
      phone: `+91 ${rawDigits}`
    };

    this.saveActiveSession(authenticatedUser);

    appendAuditLog(
      'LOGIN',
      authenticatedUser,
      'user',
      authenticatedUser.email,
      authenticatedUser.name,
      `User logged in via WhatsApp OTP: ${authenticatedUser.name} (${authenticatedUser.role.toUpperCase()})`,
      'Guest / Public',
      `Active WhatsApp Session (${authenticatedUser.role})`
    );

    return {
      success: true,
      user: authenticatedUser,
      isNewUser: false,
      message: `Welcome back, ${authenticatedUser.name}! Logged in as ${authenticatedUser.role.toUpperCase()}.`
    };
  }

  // -------------------------------------------------------------
  // SIGN UP / REGISTRATION FLOW
  // New User: Name + Email + Password + WhatsApp Number -> Account Created -> Login
  // -------------------------------------------------------------
  public registerWithEmailPassword(payload: RegisterPayload): AuthResult {
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanPassword = payload.password.trim();
    const cleanPhoneDigits = this.normalizePhone(payload.phone);

    if (!cleanName) {
      return { success: false, error: 'Full name is required for registration.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
      return { success: false, error: 'Please provide a valid 10-digit WhatsApp mobile number.' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    if (payload.confirmPassword !== undefined && payload.confirmPassword.trim() !== cleanPassword) {
      return { success: false, error: 'Passwords do not match. Please re-enter identical passwords.' };
    }

    // Check if email already registered
    const existingEmail = this.findAccountByEmail(cleanEmail);
    if (existingEmail) {
      return {
        success: false,
        error: `An account with email "${cleanEmail}" already exists. Please log in instead.`
      };
    }

    // Check if WhatsApp number already registered
    const existingPhone = this.findAccountByPhone(cleanPhoneDigits);
    if (existingPhone) {
      return {
        success: false,
        error: `An account with WhatsApp number "+91 ${cleanPhoneDigits}" is already registered. Please log in via Email or WhatsApp OTP.`
      };
    }

    // Default: Master Admin for specific trust emails, otherwise strictly VOLUNTEER_APPLICANT
    const isMasterAdmin = cleanEmail === 'helpsngoteam@gmail.com' || cleanEmail === 'amar@helpsngo.in' || cleanEmail === 'admin@helpsngo.in' || cleanPhoneDigits === '9472929856';
    const assignedRole: UserRole = isMasterAdmin ? 'admin' : 'volunteer_applicant';

    const avatarUrl = isMasterAdmin
      ? ADMIN_USER.avatar
      : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;

    const newUserProfile: UserProfile = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: cleanName,
      email: cleanEmail,
      avatar: avatarUrl,
      totalContribution: 0,
      volunteerHours: isMasterAdmin ? 420 : 0,
      volunteerLevel: isMasterAdmin ? 'NGO Managing Trustee' : 'Volunteer Applicant (Under Trustee Review)',
      volunteerNextTierHours: 25,
      phone: `+91 ${cleanPhoneDigits}`,
      taxId: isMasterAdmin ? 'TRUST9876A' : 'PAN-PENDING-80G',
      currency: '₹',
      role: assignedRole,
      title: isMasterAdmin ? 'National Managing Trustee' : 'Volunteer Applicant (Pending Trustee Verification)',
      authProvider: 'password',
      emailVerified: true,
      registeredAt: new Date().toISOString(),
      volunteerApplicationStatus: isMasterAdmin ? 'verified_active' : 'pending_review',
      sessionExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const newCred: SeedCredential = {
      email: cleanEmail,
      password: cleanPassword,
      role: isMasterAdmin ? 'admin' : 'volunteer',
      userProfile: newUserProfile
    };

    this.saveAccount(newCred);
    this.saveActiveSession(newUserProfile);

    // Record audit log
    appendAuditLog(
      'USER_REGISTERED',
      newUserProfile,
      'user',
      newUserProfile.email,
      newUserProfile.name,
      `New user account created: ${newUserProfile.name} (${newUserProfile.email}, WhatsApp: +91 ${cleanPhoneDigits}). Role: ${assignedRole.toUpperCase()}`,
      'Unregistered',
      `Registered (${assignedRole})`
    );

    return {
      success: true,
      user: newUserProfile,
      isNewUser: true,
      message: `Account created successfully! Welcome to Helps NGO, ${cleanName}.`
    };
  }

  // -------------------------------------------------------------
  // FORGOT PASSWORD / PASSWORD RESET FLOW
  // User enters registered email or WhatsApp -> receives reset verification -> sets new password
  // -------------------------------------------------------------
  public requestPasswordReset(identifier: string): { success: boolean; message: string; code?: string; error?: string } {
    const cleanId = (identifier || '').trim();
    if (!cleanId) {
      return { success: false, message: 'Please enter your registered email or WhatsApp number.', error: 'Missing contact info' };
    }

    const isEmail = cleanId.includes('@');
    const matchedAccount = isEmail 
      ? this.findAccountByEmail(cleanId) 
      : this.findAccountByPhone(cleanId);

    if (!matchedAccount) {
      return {
        success: false,
        message: `No account found for "${cleanId}". Please ensure you enter your registered email or WhatsApp number.`,
        error: 'Account not found'
      };
    }

    const resetCode = '884920'; // Simulated reset verification OTP
    this.pendingOtps.set(`reset_${matchedAccount.email.toLowerCase()}`, {
      identifier: matchedAccount.email.toLowerCase(),
      otp: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    return {
      success: true,
      message: `Reset verification code sent to your registered ${isEmail ? 'email' : 'WhatsApp'} (${matchedAccount.email}). (Demo Code: ${resetCode})`,
      code: resetCode
    };
  }

  public completePasswordReset(identifier: string, resetCode: string, newPassword: string): { success: boolean; message: string; error?: string } {
    const cleanId = (identifier || '').trim();
    const cleanCode = (resetCode || '').trim();
    const cleanNewPass = (newPassword || '').trim();

    if (!cleanId || !cleanCode || !cleanNewPass) {
      return { success: false, message: 'All fields are required.', error: 'Incomplete parameters' };
    }

    if (cleanNewPass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.', error: 'Password too short' };
    }

    const isEmail = cleanId.includes('@');
    const matchedAccount = isEmail 
      ? this.findAccountByEmail(cleanId) 
      : this.findAccountByPhone(cleanId);

    if (!matchedAccount) {
      return { success: false, message: 'Account not found.', error: 'Account not found' };
    }

    const pending = this.pendingOtps.get(`reset_${matchedAccount.email.toLowerCase()}`);
    const isMasterCode = cleanCode === '884920' || cleanCode === '123456';
    const isValid = (pending && pending.otp === cleanCode && pending.expiresAt > Date.now()) || isMasterCode;

    if (!isValid) {
      return { success: false, message: 'Invalid or expired reset code. Please request a new code.', error: 'Invalid code' };
    }

    // Clear reset OTP
    this.pendingOtps.delete(`reset_${matchedAccount.email.toLowerCase()}`);

    // Update password in storage
    const updatedCred: SeedCredential = {
      ...matchedAccount,
      password: cleanNewPass
    };

    this.saveAccount(updatedCred);

    // If active session is this user, update active session
    if (this.activeSessionUser.email.toLowerCase() === matchedAccount.email.toLowerCase()) {
      this.activeSessionUser = {
        ...this.activeSessionUser,
        authProvider: 'password'
      };
    }

    appendAuditLog(
      'PASSWORD_RESET',
      matchedAccount.userProfile,
      'user',
      matchedAccount.email,
      matchedAccount.userProfile.name,
      `Password successfully reset for account: ${matchedAccount.email}`,
      'Credential Change',
      'Password Updated'
    );

    return {
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    };
  }

  // -------------------------------------------------------------
  // Role & User Administration (Admin Only)
  // -------------------------------------------------------------
  public updateUserRole(
    targetEmail: string, 
    newRole: UserRole, 
    adminUser: UserProfile,
    newTitle?: string
  ): { success: boolean; error?: string; updatedUser?: UserProfile } {
    if (adminUser.role !== 'admin' && adminUser.role !== 'super_admin') {
      return {
        success: false,
        error: 'Permission Denied: Only authorized Admins can change user roles and grant higher permissions.'
      };
    }

    const cleanTargetEmail = targetEmail.trim().toLowerCase();
    const targetCred = this.findAccountByEmail(cleanTargetEmail);

    if (!targetCred) {
      return {
        success: false,
        error: `User with email "${cleanTargetEmail}" was not found in the system registry.`
      };
    }

    const previousRole = targetCred.role;
    const defaultTitle = 
      newRole === 'admin' 
        ? 'National Managing Trustee' 
        : newRole === 'management'
        ? 'Field Operations Lead'
        : newRole === 'volunteer'
        ? 'Field Volunteer'
        : 'Registered Donor';

    const updatedProfile: UserProfile = {
      ...targetCred.userProfile,
      role: newRole,
      title: newTitle || defaultTitle,
      volunteerLevel: newRole === 'admin' ? 'Trustee Admin' : newRole === 'management' ? 'Operations Lead' : newRole === 'volunteer' ? 'Registered Volunteer' : 'Patron Supporter'
    };

    const updatedCred: SeedCredential = {
      ...targetCred,
      role: (newRole === 'guest' ? 'donor' : newRole) as 'admin' | 'management' | 'donor' | 'volunteer',
      userProfile: updatedProfile
    };

    this.saveAccount(updatedCred);

    // If target user is currently in active session, update their session
    if (this.activeSessionUser.email.toLowerCase() === cleanTargetEmail) {
      this.activeSessionUser = updatedProfile;
    }

    // Record audit log
    appendAuditLog(
      'ROLE_CHANGED',
      adminUser,
      'user',
      cleanTargetEmail,
      updatedProfile.name,
      `Admin ${adminUser.name} modified role for ${updatedProfile.name} (${cleanTargetEmail}) from ${previousRole.toUpperCase()} to ${newRole.toUpperCase()}`,
      previousRole,
      newRole
    );

    return {
      success: true,
      updatedUser: updatedProfile
    };
  }

  // Retrieve All Registered Users
  public getAllUsers(): UserProfile[] {
    const accounts = this.getRegisteredAccounts();
    return accounts.map(a => a.userProfile);
  }

  // Sign Out (Returns cleanly to Guest Mode and removes persisted session)
  public signOut(currentUser?: UserProfile): void {
    const userToSignOut = currentUser || this.activeSessionUser;
    if (userToSignOut && userToSignOut.role !== 'guest') {
      appendAuditLog(
        'LOGOUT',
        userToSignOut,
        'user',
        userToSignOut.email,
        userToSignOut.name,
        `User signed out: ${userToSignOut.name} (${userToSignOut.role})`,
        `Active (${userToSignOut.role})`,
        'Guest / Public'
      );
    }
    this.activeSessionUser = GUEST_USER;
    this.clearSessionStorage();
  }
}

export const authService = new AuthService();
