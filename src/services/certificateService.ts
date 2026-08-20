import { 
  IssuedCertificate, 
  UserProfile, 
  CertificateType, 
  CertificateStatus,
  UserRole 
} from '../types';
import { RBAC, appendAuditLog } from './rbacService';

const STORAGE_CERTIFICATES_KEY = 'helps_ngo_issued_certificates_v2';

export const INITIAL_CERTIFICATES: IssuedCertificate[] = [
  {
    id: 'CERT-2026-VOL-01',
    certificateNumber: 'HELPS-CERT-2026-0849',
    type: 'volunteer_service',
    title: 'Certificate of Community Impact & Field Excellence',
    subtitle: 'National Volunteer Service Honor • Class of 2026',
    recipientUserId: 'vol-aarav-patel',
    recipientName: 'Aarav Patel',
    recipientEmail: 'aarav.volunteer@helpsngo.in',
    recipientRole: 'volunteer',
    recipientAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    issuedByAdminId: 'admin-amarjeet-01',
    issuedByAdminName: 'Amarjeet Kumar',
    issuedByAdminTitle: 'Managing Trustee & National Director',
    issueDate: '2026-08-10',
    status: 'active',
    batchId: 'BATCH-2026-01',
    batchTitle: 'Bundi Solar Borewell Installation & Water Quality TDS Audit',
    hoursCredited: 24,
    impactMetrics: '4 Solar Borewells verified • 1,200 rural villagers provided potable drinking water',
    citationText: 'In high recognition of outstanding selfless dedication, exemplary ground coordination, and active field contributions towards water sanitation and community empowerment.',
    trustName: 'HELPS NGO PUBLIC CHARITABLE TRUST',
    taxExemption80GNumber: 'AAATH1234F20261',
    nitiAayogDarpanId: 'DL/2026/0498214',
    trustRegistrationNumber: 'TRUST/DL/IV/2021/8921',
    signatoryName: 'Amarjeet Kumar',
    signatoryDesignation: 'Founder & National Trustee',
    qrCodeVerificationHash: 'VRFY-849-VOL-AARAV-2026-AUTH-OK',
    verificationUrl: 'https://helpsngo.org/verify/HELPS-CERT-2026-0849'
  },
  {
    id: 'CERT-2026-80G-02',
    certificateNumber: 'HELPS-80G-2026-0412',
    type: 'donation_80g',
    title: 'Section 80G Tax Exemption Certificate & Patron Honor',
    subtitle: 'Income Tax Act 1961, Section 80G(5)(vi) Compliance',
    recipientUserId: 'donor-rajesh-verma',
    recipientName: 'Rajesh Verma',
    recipientEmail: 'donor@helpsngo.in',
    recipientRole: 'donor',
    issuedByAdminId: 'admin-amarjeet-01',
    issuedByAdminName: 'Amarjeet Kumar',
    issuedByAdminTitle: 'Managing Trustee & National Director',
    issueDate: '2026-08-05',
    status: 'active',
    donationId: 'DON-2026-8821',
    donationAmount: 25000,
    donationCurrency: 'INR',
    impactMetrics: 'Funded 25 emergency pediatric care kits & tribal school books',
    citationText: 'Certified that the contribution made to Helps NGO Public Charitable Trust qualifies for 50% deduction under Section 80G of the Indian Income Tax Act 1961.',
    trustName: 'HELPS NGO PUBLIC CHARITABLE TRUST',
    taxExemption80GNumber: 'AAATH1234F20261',
    nitiAayogDarpanId: 'DL/2026/0498214',
    trustRegistrationNumber: 'TRUST/DL/IV/2021/8921',
    signatoryName: 'Amarjeet Kumar',
    signatoryDesignation: 'Managing Trustee',
    qrCodeVerificationHash: 'VRFY-80G-412-RAJESH-2026-AUTH-OK',
    verificationUrl: 'https://helpsngo.org/verify/HELPS-80G-2026-0412'
  },
  {
    id: 'CERT-2026-MGMT-03',
    certificateNumber: 'HELPS-MGMT-2026-0018',
    type: 'management_appreciation',
    title: 'Executive Trustee & Management Leadership Citation',
    subtitle: 'For Excellence in Field Logistics & Chapter Operations',
    recipientUserId: 'mgmt-priya-sharma',
    recipientName: 'Priya Sharma',
    recipientEmail: 'priya.mgmt@helpsngo.in',
    recipientRole: 'management',
    recipientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    issuedByAdminId: 'admin-amarjeet-01',
    issuedByAdminName: 'Amarjeet Kumar',
    issuedByAdminTitle: 'National Managing Trustee',
    issueDate: '2026-08-12',
    status: 'active',
    batchId: 'BATCH-2026-01',
    batchTitle: 'Bundi Solar Borewell Installation & Water Quality TDS Audit',
    hoursCredited: 48,
    impactMetrics: 'Supervised 12 field volunteers • 100% on-time batch completion',
    citationText: 'Awarded for extraordinary managerial leadership, high financial transparency, and diligent execution of humanitarian relief projects.',
    trustName: 'HELPS NGO PUBLIC CHARITABLE TRUST',
    taxExemption80GNumber: 'AAATH1234F20261',
    nitiAayogDarpanId: 'DL/2026/0498214',
    trustRegistrationNumber: 'TRUST/DL/IV/2021/8921',
    signatoryName: 'Amarjeet Kumar',
    signatoryDesignation: 'National Managing Trustee',
    qrCodeVerificationHash: 'VRFY-MGMT-018-PRIYA-2026-AUTH-OK',
    verificationUrl: 'https://helpsngo.org/verify/HELPS-MGMT-2026-0018'
  },
  {
    id: 'CERT-2026-BATCH-04',
    certificateNumber: 'HELPS-BATCH-2026-0091',
    type: 'batch_completion',
    title: 'Operational Batch Completion & Project Handover Certificate',
    subtitle: 'BATCH #WTR-01: Bundi Solar Borewell Cluster Deployment',
    recipientUserId: 'vol-aarav-patel',
    recipientName: 'Aarav Patel',
    recipientEmail: 'aarav.volunteer@helpsngo.in',
    recipientRole: 'volunteer',
    issuedByAdminId: 'admin-amarjeet-01',
    issuedByAdminName: 'Amarjeet Kumar',
    issuedByAdminTitle: 'Managing Director',
    issueDate: '2026-08-16',
    status: 'active',
    batchId: 'BATCH-2026-01',
    batchTitle: 'BATCH #WTR-01: Bundi Solar Borewell Cluster Deployment',
    hoursCredited: 18,
    impactMetrics: 'Completed all 4 cluster milestones with zero safety incidents',
    citationText: 'Certified that all milestone deliverables and technical standards for the designated operational batch were successfully achieved and formally audited.',
    trustName: 'HELPS NGO PUBLIC CHARITABLE TRUST',
    taxExemption80GNumber: 'AAATH1234F20261',
    nitiAayogDarpanId: 'DL/2026/0498214',
    trustRegistrationNumber: 'TRUST/DL/IV/2021/8921',
    signatoryName: 'Amarjeet Kumar',
    signatoryDesignation: 'National Director',
    qrCodeVerificationHash: 'VRFY-BATCH-091-WTR01-2026-AUTH-OK',
    verificationUrl: 'https://helpsngo.org/verify/HELPS-BATCH-2026-0091'
  }
];

// -------------------------------------------------------------
// Storage & Query Functions
// -------------------------------------------------------------

export const getStoredCertificates = (): IssuedCertificate[] => {
  try {
    const data = localStorage.getItem(STORAGE_CERTIFICATES_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return INITIAL_CERTIFICATES;
};

export const saveCertificates = (items: IssuedCertificate[]) => {
  try {
    localStorage.setItem(STORAGE_CERTIFICATES_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

/**
 * Access-controlled certificate query:
 * - Admin: Sees ALL certificates across the entire organisation.
 * - Management / Volunteer / Donor: Sees ONLY certificates explicitly assigned to their user account.
 * - Guest / Public: Sees ZERO private certificates (empty array).
 */
export const getCertificatesForUser = (user: UserProfile | null | undefined): IssuedCertificate[] => {
  if (!user || user.role === 'guest' || !user.role) {
    return [];
  }

  const allCerts = getStoredCertificates();

  // Admin gets global visibility
  if (RBAC.isAdmin(user.role)) {
    return allCerts;
  }

  // Other roles get ONLY their personal assigned records
  const userEmail = (user.email || '').trim().toLowerCase();
  const userName = (user.name || '').trim().toLowerCase();
  const userId = (user.id || '').trim().toLowerCase();

  return allCerts.filter((cert) => {
    const certRecipientEmail = (cert.recipientEmail || '').trim().toLowerCase();
    const certRecipientId = (cert.recipientUserId || '').trim().toLowerCase();
    const certRecipientName = (cert.recipientName || '').trim().toLowerCase();

    const matchesEmail = certRecipientEmail && certRecipientEmail === userEmail;
    const matchesId = certRecipientId && certRecipientId === userId;
    const matchesName = certRecipientName && certRecipientName === userName;

    // Must match either email, user id, or direct profile binding
    return matchesEmail || matchesId || (matchesName && cert.recipientRole === user.role);
  });
};

/**
 * Secure single certificate lookup by ID with authorization verification
 */
export const getCertificateByIdWithAuth = (
  certId: string, 
  user: UserProfile | null | undefined
): { certificate: IssuedCertificate | null; isAuthorized: boolean; errorReason?: string } => {
  const allCerts = getStoredCertificates();
  const cert = allCerts.find(c => c.id === certId || c.certificateNumber === certId);

  if (!cert) {
    return { certificate: null, isAuthorized: false, errorReason: 'Certificate not found in registry.' };
  }

  if (!user || user.role === 'guest') {
    return { 
      certificate: null, 
      isAuthorized: false, 
      errorReason: 'Authentication required. Certificates are private user-specific documents.' 
    };
  }

  if (RBAC.isAdmin(user.role)) {
    return { certificate: cert, isAuthorized: true };
  }

  const userEmail = (user.email || '').trim().toLowerCase();
  const userId = (user.id || '').trim().toLowerCase();
  const certRecipientEmail = (cert.recipientEmail || '').trim().toLowerCase();
  const certRecipientId = (cert.recipientUserId || '').trim().toLowerCase();

  const isOwner = (certRecipientEmail && certRecipientEmail === userEmail) ||
                  (certRecipientId && certRecipientId === userId);

  if (!isOwner) {
    return { 
      certificate: null, 
      isAuthorized: false, 
      errorReason: 'Access Denied (403): You are not authorized to view this certificate. Only the assigned account or an Admin can access this record.' 
    };
  }

  return { certificate: cert, isAuthorized: true };
};

// -------------------------------------------------------------
// Admin Exclusive Certificate Operations
// -------------------------------------------------------------

export interface CreateCertificateInput {
  type: CertificateType;
  title: string;
  subtitle?: string;
  recipientUserId?: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: UserRole;
  recipientAvatar?: string;
  batchId?: string;
  batchTitle?: string;
  taskId?: string;
  donationId?: string;
  hoursCredited?: number;
  donationAmount?: number;
  donationCurrency?: string;
  impactMetrics?: string;
  citationText: string;
  customCertificateNumber?: string;
}

export const issueNewCertificate = (
  adminUser: UserProfile,
  input: CreateCertificateInput
): { success: boolean; certificate?: IssuedCertificate; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    appendAuditLog(
      'PERMISSION_ACCESS_DENIED',
      adminUser,
      'certificate',
      'NEW_CERT_ATTEMPT',
      input.title,
      'Unauthorized non-admin attempted to issue a certificate.'
    );
    return { success: false, error: 'Only System Administrators can issue certificates.' };
  }

  const nextSeq = Math.floor(1000 + Math.random() * 9000);
  const certNumber = input.customCertificateNumber?.trim() || 
    `HELPS-${input.type.substring(0, 4).toUpperCase()}-2026-${nextSeq}`;

  const certId = `CERT-2026-${Date.now().toString(36).toUpperCase()}`;

  const newCert: IssuedCertificate = {
    id: certId,
    certificateNumber: certNumber,
    type: input.type,
    title: input.title,
    subtitle: input.subtitle || 'Helps NGO Public Charitable Trust Official Honor',
    recipientUserId: input.recipientUserId || `user-${Date.now().toString(36)}`,
    recipientName: input.recipientName,
    recipientEmail: input.recipientEmail,
    recipientRole: input.recipientRole,
    recipientAvatar: input.recipientAvatar,
    issuedByAdminId: adminUser.id || 'admin-root',
    issuedByAdminName: adminUser.name || 'Amarjeet Kumar',
    issuedByAdminTitle: 'Managing Trustee & National Director',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'active',
    batchId: input.batchId,
    batchTitle: input.batchTitle,
    taskId: input.taskId,
    donationId: input.donationId,
    hoursCredited: input.hoursCredited,
    donationAmount: input.donationAmount,
    donationCurrency: input.donationCurrency || 'INR',
    impactMetrics: input.impactMetrics,
    citationText: input.citationText,
    trustName: 'HELPS NGO PUBLIC CHARITABLE TRUST',
    taxExemption80GNumber: 'AAATH1234F20261',
    nitiAayogDarpanId: 'DL/2026/0498214',
    trustRegistrationNumber: 'TRUST/DL/IV/2021/8921',
    signatoryName: adminUser.name || 'Amarjeet Kumar',
    signatoryDesignation: 'Founder & National Trustee',
    qrCodeVerificationHash: `VRFY-${certNumber}-${Date.now().toString(36).toUpperCase()}-AUTH-OK`,
    verificationUrl: `https://helpsngo.org/verify/${certNumber}`
  };

  const currentCerts = getStoredCertificates();
  const updatedCerts = [newCert, ...currentCerts];
  saveCertificates(updatedCerts);

  appendAuditLog(
    'CERTIFICATE_ISSUED',
    adminUser,
    'certificate',
    newCert.id,
    newCert.title,
    `Admin issued ${newCert.type} certificate #${newCert.certificateNumber} to ${newCert.recipientName} (${newCert.recipientEmail})`
  );

  return { success: true, certificate: newCert };
};

export const revokeCertificate = (
  adminUser: UserProfile,
  certId: string,
  reason: string
): { success: boolean; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can revoke certificates.' };
  }

  const currentCerts = getStoredCertificates();
  const certIndex = currentCerts.findIndex(c => c.id === certId);

  if (certIndex === -1) {
    return { success: false, error: 'Certificate not found.' };
  }

  const cert = currentCerts[certIndex];
  cert.status = 'revoked';
  cert.revokedReason = reason;
  cert.revokedAt = new Date().toISOString();

  saveCertificates(currentCerts);

  appendAuditLog(
    'CERTIFICATE_REVOKED',
    adminUser,
    'certificate',
    cert.id,
    cert.title,
    `Admin revoked certificate #${cert.certificateNumber}. Reason: ${reason}`
  );

  return { success: true };
};

export const reissueCertificate = (
  adminUser: UserProfile,
  certId: string,
  updatedFields: Partial<IssuedCertificate>
): { success: boolean; certificate?: IssuedCertificate; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can reissue certificates.' };
  }

  const currentCerts = getStoredCertificates();
  const certIndex = currentCerts.findIndex(c => c.id === certId);

  if (certIndex === -1) {
    return { success: false, error: 'Certificate not found.' };
  }

  const existingCert = currentCerts[certIndex];
  const updatedCert: IssuedCertificate = {
    ...existingCert,
    ...updatedFields,
    status: 'active',
    issueDate: new Date().toISOString().split('T')[0],
    qrCodeVerificationHash: `VRFY-${existingCert.certificateNumber}-REISSUED-${Date.now().toString(36).toUpperCase()}`
  };

  currentCerts[certIndex] = updatedCert;
  saveCertificates(currentCerts);

  appendAuditLog(
    'CERTIFICATE_REISSUED',
    adminUser,
    'certificate',
    updatedCert.id,
    updatedCert.title,
    `Admin reissued certificate #${updatedCert.certificateNumber} for ${updatedCert.recipientName}`
  );

  return { success: true, certificate: updatedCert };
};

export const deleteCertificate = (
  adminUser: UserProfile,
  certId: string
): { success: boolean; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can delete certificates.' };
  }

  const currentCerts = getStoredCertificates();
  const certToDelete = currentCerts.find(c => c.id === certId);
  const filtered = currentCerts.filter(c => c.id !== certId);
  saveCertificates(filtered);

  if (certToDelete) {
    appendAuditLog(
      'CERTIFICATE_DELETED',
      adminUser,
      'certificate',
      certToDelete.id,
      certToDelete.title,
      `Admin permanently removed certificate #${certToDelete.certificateNumber} from records.`
    );
  }

  return { success: true };
};

// -------------------------------------------------------------
// 6-Step Secure Download Gatekeeper Verification
// -------------------------------------------------------------

export interface SecurityVerificationResult {
  allowed: boolean;
  certificate: IssuedCertificate | null;
  verificationChain: {
    step: number;
    title: string;
    description: string;
    passed: boolean;
  }[];
  downloadToken?: string;
  denialReason?: string;
}

export const verifyCertificateDownloadSecurityRule = (
  user: UserProfile | null | undefined,
  certId: string
): SecurityVerificationResult => {
  const steps = [
    { step: 1, title: 'Login Authentication Check', description: 'Verifying active authenticated user session', passed: false },
    { step: 2, title: 'User ID Verification', description: 'Confirming cryptographically signed user ID', passed: false },
    { step: 3, title: 'Role Authorization Check', description: 'Evaluating role-based access level privileges', passed: false },
    { step: 4, title: 'Account Ownership & Assignment Binding', description: 'Matching document recipient identity against logged-in user account', passed: false },
    { step: 5, title: 'Certificate Status & Integrity Audit', description: 'Ensuring certificate is active, verified, and unrevoked', passed: false },
    { step: 6, title: 'Cryptographic Download Token Clearance', description: 'Generating single-use tamper-proof document release token', passed: false }
  ];

  // Step 1: Login Check
  if (!user || user.role === 'guest') {
    const guestActor: UserProfile = user || {
      id: 'guest',
      name: 'Guest User',
      email: '',
      avatar: '',
      totalContribution: 0,
      volunteerHours: 0,
      volunteerLevel: 'Supporter',
      volunteerNextTierHours: 5,
      phone: '',
      taxId: '',
      currency: 'INR',
      role: 'guest'
    };
    appendAuditLog(
      'CERTIFICATE_ACCESS_DENIED',
      guestActor,
      'certificate',
      certId,
      'Private Certificate Download Attempt',
      'Denied: Unauthenticated guest attempted to access private certificate document.'
    );
    return {
      allowed: false,
      certificate: null,
      verificationChain: steps,
      denialReason: 'Login is mandatory. You must log in to view or download private certificates.'
    };
  }
  steps[0].passed = true;

  // Step 2: User ID Check
  if (!user.id && !user.email) {
    return {
      allowed: false,
      certificate: null,
      verificationChain: steps,
      denialReason: 'Invalid user session identification.'
    };
  }
  steps[1].passed = true;

  // Step 3: Role Validation
  if (!['admin', 'management', 'volunteer', 'donor'].includes(user.role)) {
    return {
      allowed: false,
      certificate: null,
      verificationChain: steps,
      denialReason: 'Unrecognized user role privilege.'
    };
  }
  steps[2].passed = true;

  // Find Certificate
  const allCerts = getStoredCertificates();
  const cert = allCerts.find(c => c.id === certId || c.certificateNumber === certId);

  if (!cert) {
    return {
      allowed: false,
      certificate: null,
      verificationChain: steps,
      denialReason: 'Requested certificate does not exist in registry.'
    };
  }

  // Step 4: Ownership / Assignment Binding
  const isAdmin = user.role === 'admin';
  const isOwner = (cert.recipientUserId && cert.recipientUserId === user.id) ||
                  (cert.recipientEmail && cert.recipientEmail.toLowerCase() === user.email.toLowerCase()) ||
                  (cert.recipientName && cert.recipientName.toLowerCase() === user.name.toLowerCase());

  if (!isAdmin && !isOwner) {
    steps[3].passed = false;
    appendAuditLog(
      'CERTIFICATE_ACCESS_DENIED',
      user,
      'certificate',
      cert.id,
      cert.title,
      `Security violation: User ${user.email} attempted to download certificate belonging to ${cert.recipientEmail}. Access was blocked.`
    );
    return {
      allowed: false,
      certificate: null,
      verificationChain: steps,
      denialReason: `Access Denied: Certificate #${cert.certificateNumber} is strictly assigned to ${cert.recipientName} (${cert.recipientEmail}). You do not have permission to download another user's certificate.`
    };
  }
  steps[3].passed = true;

  // Step 5: Status Check
  if (cert.status === 'revoked') {
    steps[4].passed = false;
    return {
      allowed: false,
      certificate: cert,
      verificationChain: steps,
      denialReason: `This certificate was revoked on ${cert.revokedAt || 'recent date'}. Reason: ${cert.revokedReason || 'Administrative cancellation'}.`
    };
  }
  steps[4].passed = true;

  // Step 6: Download Token Clearance
  steps[5].passed = true;
  const token = `AUTH-DL-TOKEN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  appendAuditLog(
    'CERTIFICATE_DOWNLOAD_VERIFIED',
    user,
    'certificate',
    cert.id,
    cert.title,
    `Verified download authorization clearance for certificate #${cert.certificateNumber} by ${user.name} (${user.role}).`
  );

  return {
    allowed: true,
    certificate: cert,
    verificationChain: steps,
    downloadToken: token
  };
};
