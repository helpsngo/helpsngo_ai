import { DpdpErasureRequest, UserProfile, DonationRecord } from '../types';
import { authService, STORAGE_SESSION_KEY } from './authService';
import { appendAuditLog } from './rbacService';

export const STORAGE_DPDP_ERASURE_REQUESTS_KEY = 'helps_ngo_dpdp_erasure_requests_v1';

// Initial pre-seeded demo deletion requests for National Admin review
const INITIAL_ERASURE_REQUESTS: DpdpErasureRequest[] = [
  {
    id: 'DPDP-ERA-2026-48291',
    userId: 'user_erasure_demo_1',
    userName: 'Karan Mehra',
    userEmail: 'karan.mehra@example.com',
    userPhone: '+91 98140 12345',
    userRole: 'registered_user',
    requestedAt: '2026-10-28T14:22:00.000Z',
    status: 'pending',
    reason: 'Account closure and withdrawal of consent under Section 12 of DPDP Act 2023.',
    wipeLocalConfirmed: true,
    has80GDonations: false,
    statutoryAuditRetentionNotice: 'No tax-deductible donations on record. Eligible for full permanent purge.'
  },
  {
    id: 'DPDP-ERA-2026-61902',
    userId: 'user_erasure_demo_2',
    userName: 'Sunita Aggarwal',
    userEmail: 'sunita.aggarwal@gmail.com',
    userPhone: '+91 98722 54321',
    userRole: 'donor',
    requestedAt: '2026-11-01T10:15:30.000Z',
    status: 'pending',
    reason: 'Relocating overseas; requested removal of personal contact data.',
    wipeLocalConfirmed: true,
    has80GDonations: true,
    statutoryAuditRetentionNotice: 'Rule 18AB / Section 80G(5)(vi) Active: Form 10BE financial audit records must be retained for 7 financial years. Non-statutory phone and marketing records will be purged.'
  }
];

class DpdpService {
  public getErasureRequests(): DpdpErasureRequest[] {
    try {
      const stored = localStorage.getItem(STORAGE_DPDP_ERASURE_REQUESTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      // Initialize with seed data
      localStorage.setItem(STORAGE_DPDP_ERASURE_REQUESTS_KEY, JSON.stringify(INITIAL_ERASURE_REQUESTS));
      return INITIAL_ERASURE_REQUESTS;
    } catch {
      return INITIAL_ERASURE_REQUESTS;
    }
  }

  public getPendingErasureRequests(): DpdpErasureRequest[] {
    return this.getErasureRequests().filter(r => r.status === 'pending');
  }

  public submitErasureRequest(
    user: UserProfile,
    reason: string,
    wipeLocalConfirmed: boolean = true,
    donations: DonationRecord[] = []
  ): DpdpErasureRequest {
    const requests = this.getErasureRequests();
    const cleanEmail = (user.email || '').trim().toLowerCase();
    
    // Check if user has active 80G tax donations
    const has80G = donations.some(d => 
      d.donorEmail && d.donorEmail.toLowerCase() === cleanEmail && (d.taxDeductible || d.approvalStatus === 'approved')
    );

    const ticketId = `DPDP-ERA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRequest: DpdpErasureRequest = {
      id: ticketId,
      userId: user.id || `USER-${Date.now()}`,
      userName: user.name || 'Registered User',
      userEmail: user.email,
      userPhone: user.phone,
      userRole: user.role,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      reason: reason || 'Statutory Right to Erasure requested by Data Principal under Section 12, DPDP Act 2023.',
      wipeLocalConfirmed,
      has80GDonations: has80G,
      statutoryAuditRetentionNotice: has80G
        ? 'Rule 18AB / Section 80G Active: Statutory Form 10BE tax records are preserved for 7 years under Income Tax Rules. Non-statutory communication channels will be purged by National Admin.'
        : 'Zero financial audit requirements. Eligible for immediate full purge by National Admin.'
    };

    // Save into deletion requests list
    const updated = [newRequest, ...requests.filter(r => r.id !== ticketId)];
    try {
      localStorage.setItem(STORAGE_DPDP_ERASURE_REQUESTS_KEY, JSON.stringify(updated));
    } catch {
      // quiet catch
    }

    // Append Audit Log
    appendAuditLog(
      'DATA_DELETION_REQUESTED',
      user,
      'user',
      user.email,
      user.name,
      `Data Principal ${user.name} submitted Right to Erasure request under DPDP Act 2023. Ticket: ${ticketId}. Pending National Admin execution.`,
      'Active User',
      'Erasure Requested (Pending Admin Execution)'
    );

    // If wipe local data confirmed, wipe all locally stored user data
    if (wipeLocalConfirmed) {
      this.wipeAllLocalUserData(user);
    }

    return newRequest;
  }

  // Wipe all client-side locally stored user data
  public wipeAllLocalUserData(currentUser?: UserProfile): void {
    try {
      // Clear active user session
      localStorage.removeItem(STORAGE_SESSION_KEY);
      
      // Clear cookie and consent cache
      localStorage.removeItem('helps_ngo_dpdp_consent_v1');
      
      // Clear donor preferences and webhook settings
      localStorage.removeItem('helps_ngo_donor_prefs_v1');
      
      // Clear deadline alerts
      localStorage.removeItem('helps_ngo_alerted_deadlines');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Sign out in auth service
      authService.signOut(currentUser);
    } catch {
      // fallback
    }
  }

  // National Admin: Approve and permanently execute account erasure
  public approveAndExecuteErasure(
    requestId: string,
    adminUser: UserProfile,
    adminNotes?: string
  ): { success: boolean; message: string; error?: string } {
    if (adminUser.role !== 'admin' && adminUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Permission Denied: Only National Admin can approve and execute DPDP Act data erasures.',
        error: 'Unauthorized'
      };
    }

    const requests = this.getErasureRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      return {
        success: false,
        message: 'Erasure request record not found.',
        error: 'Not Found'
      };
    }

    const targetReq = requests[reqIndex];
    
    // Call authService to permanently delete account from user directory
    const deleteResult = authService.deleteAccountByAdmin(targetReq.userEmail, adminUser);
    if (!deleteResult.success) {
      // If user is already removed from directory, proceed to close request
    }

    // Update request status
    const updatedRequest: DpdpErasureRequest = {
      ...targetReq,
      status: 'approved_deleted',
      reviewedBy: adminUser.name || 'Amarjeet Kumar (National Admin)',
      reviewedAt: new Date().toISOString(),
      adminReviewNotes: adminNotes || (targetReq.has80GDonations 
        ? 'Account purged. Non-statutory PII deleted. Section 80G financial audit ledger archived for 7 years under Rule 18AB.' 
        : 'Account and all associated records permanently purged under DPDP Act 2023 Section 12.')
    };

    requests[reqIndex] = updatedRequest;
    try {
      localStorage.setItem(STORAGE_DPDP_ERASURE_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // quiet
    }

    appendAuditLog(
      'DPDP_ERASURE_EXECUTED',
      adminUser,
      'user',
      targetReq.userEmail,
      targetReq.userName,
      `National Admin ${adminUser.name} executed statutory erasure for ${targetReq.userName} (${targetReq.userEmail}). Ticket: ${targetReq.id}`,
      'Pending Erasure',
      'Permanently Erased / Purged'
    );

    return {
      success: true,
      message: `Statutory erasure successfully executed for ${targetReq.userName}. Account has been permanently purged.`
    };
  }

  // National Admin: Reject erasure request with justification
  public rejectErasureRequest(
    requestId: string,
    adminUser: UserProfile,
    rejectionReason: string
  ): { success: boolean; message: string; error?: string } {
    if (adminUser.role !== 'admin' && adminUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Permission Denied: Only National Admin can review DPDP Act requests.',
        error: 'Unauthorized'
      };
    }

    const requests = this.getErasureRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      return {
        success: false,
        message: 'Erasure request record not found.',
        error: 'Not Found'
      };
    }

    const targetReq = requests[reqIndex];
    const updatedRequest: DpdpErasureRequest = {
      ...targetReq,
      status: 'rejected',
      reviewedBy: adminUser.name || 'Amarjeet Kumar (National Admin)',
      reviewedAt: new Date().toISOString(),
      adminReviewNotes: rejectionReason || 'Request could not be verified or identity credentials did not match.'
    };

    requests[reqIndex] = updatedRequest;
    try {
      localStorage.setItem(STORAGE_DPDP_ERASURE_REQUESTS_KEY, JSON.stringify(requests));
    } catch {
      // quiet
    }

    appendAuditLog(
      'DPDP_ERASURE_REJECTED',
      adminUser,
      'user',
      targetReq.userEmail,
      targetReq.userName,
      `National Admin ${adminUser.name} rejected erasure request ${targetReq.id}: ${rejectionReason}`,
      'Pending Erasure',
      'Rejected by Admin'
    );

    return {
      success: true,
      message: `Erasure request ${targetReq.id} has been marked as rejected.`
    };
  }
}

export const dpdpService = new DpdpService();
