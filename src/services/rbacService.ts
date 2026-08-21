import { 
  UserRole, 
  UserProfile, 
  Permission,
  ContentSubmissionItem, 
  ContentApprovalStatus, 
  BatchAssignment, 
  AuditLogEntry, 
  TaskCategory,
  SafeguardingConsent,
  VolunteerApplication,
  VolunteerApplicationStatus
} from '../types';

const STORAGE_SUBMISSIONS_KEY = 'helps_ngo_content_submissions_v2';
const STORAGE_BATCHES_KEY = 'helps_ngo_batches_v2';
const STORAGE_AUDIT_LOG_KEY = 'helps_ngo_audit_logs_v2';
const STORAGE_VOLUNTEER_APPLICATIONS_KEY = 'helps_ngo_volunteer_applications_v2';

// -------------------------------------------------------------
// 1. Explicit Role-Based Access Control (RBAC) Permission Matrix
// -------------------------------------------------------------

export const ROLE_PERMISSIONS_MAP: Record<UserRole, Permission[]> = {
  guest: [
    'reports.view'
  ],
  registered_user: [
    'reports.view',
    'volunteers.apply',
    'donations.view_own',
    'certificates.view_own'
  ],
  volunteer_applicant: [
    'reports.view',
    'volunteers.apply',
    'donations.view_own',
    'certificates.view_own'
  ],
  volunteer: [
    'reports.view',
    'volunteers.apply',
    'donations.view_own',
    'tasks.execute',
    'content.draft',
    'certificates.view_own',
    'safeguarding.view'
  ],
  donor: [
    'reports.view',
    'donations.view_own',
    'certificates.view_own'
  ],
  program_manager: [
    'reports.view',
    'volunteers.view',
    'volunteers.assign_tasks',
    'tasks.create',
    'tasks.execute',
    'tasks.review',
    'content.draft',
    'content.review',
    'safeguarding.view',
    'safeguarding.verify_consent',
    'certificates.view_own'
  ],
  management: [ // Alias for program_manager
    'reports.view',
    'volunteers.view',
    'volunteers.assign_tasks',
    'tasks.create',
    'tasks.execute',
    'tasks.review',
    'content.draft',
    'content.review',
    'safeguarding.view',
    'safeguarding.verify_consent',
    'certificates.view_own'
  ],
  content_manager: [
    'reports.view',
    'content.draft',
    'content.review',
    'projects.create',
    'projects.edit',
    'safeguarding.view',
    'safeguarding.verify_consent',
    'certificates.view_own'
  ],
  finance: [
    'reports.view',
    'reports.publish',
    'donations.view_all',
    'donations.view_own',
    'donations.verify',
    'donations.refund',
    'finance.view',
    'finance.audit',
    'finance.export_10be',
    'certificates.view_own',
    'certificates.sign_80g'
  ],
  admin: [
    'users.view',
    'users.edit',
    'users.roles',
    'users.delete',
    'volunteers.view',
    'volunteers.apply',
    'volunteers.review',
    'volunteers.approve',
    'volunteers.assign_tasks',
    'donations.view_all',
    'donations.view_own',
    'donations.verify',
    'donations.refund',
    'finance.view',
    'finance.audit',
    'finance.export_10be',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'tasks.create',
    'tasks.execute',
    'tasks.review',
    'content.draft',
    'content.review',
    'content.publish',
    'reports.view',
    'reports.publish',
    'certificates.view_own',
    'certificates.view_all',
    'certificates.issue',
    'certificates.sign_80g',
    'certificates.revoke',
    'safeguarding.view',
    'safeguarding.verify_consent',
    'safeguarding.override',
    'settings.manage',
    'webhooks.manage',
    'audit.view',
    'security.simulate'
  ],
  super_admin: [
    'users.view',
    'users.edit',
    'users.roles',
    'users.delete',
    'volunteers.view',
    'volunteers.apply',
    'volunteers.review',
    'volunteers.approve',
    'volunteers.assign_tasks',
    'donations.view_all',
    'donations.view_own',
    'donations.verify',
    'donations.refund',
    'finance.view',
    'finance.audit',
    'finance.export_10be',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'tasks.create',
    'tasks.execute',
    'tasks.review',
    'content.draft',
    'content.review',
    'content.publish',
    'reports.view',
    'reports.publish',
    'certificates.view_own',
    'certificates.view_all',
    'certificates.issue',
    'certificates.sign_80g',
    'certificates.revoke',
    'safeguarding.view',
    'safeguarding.verify_consent',
    'safeguarding.override',
    'settings.manage',
    'webhooks.manage',
    'audit.view',
    'security.simulate'
  ]
};

/**
 * Evaluates whether a user holds a specific permission token
 */
export function hasPermission(
  user?: UserProfile | { role?: UserRole | string } | null, 
  permission?: Permission
): boolean {
  if (!user || !permission) return false;
  const role: UserRole = (user.role as UserRole) || 'guest';
  const rolePerms = ROLE_PERMISSIONS_MAP[role] || [];
  return rolePerms.includes(permission);
}

/**
 * Throws an explicit authorization exception if the user does not hold permission
 */
export function assertPermission(
  user: UserProfile | { role?: UserRole } | null, 
  permission: Permission, 
  actionDesc?: string
): void {
  if (!hasPermission(user, permission)) {
    const role = user?.role || 'guest';
    const msg = `403 Forbidden: Role '${role}' lacks required permission '${permission}' to execute ${actionDesc || 'action'}.`;
    throw new Error(msg);
  }
}

/**
 * Direct URL / Route Authorization Inspector
 */
export function isRouteAuthorized(
  role: UserRole | string | undefined, 
  routePath: string
): { authorized: boolean; requiredPermission?: Permission; statusCode: 200 | 401 | 403; reason: string } {
  const normalizedRole: UserRole = (role as UserRole) || 'guest';
  const cleanPath = routePath.toLowerCase().trim();

  // Public routes accessible to everyone (even guest)
  if (
    cleanPath === '/' || 
    cleanPath === '/home' || 
    cleanPath === '/projects' || 
    cleanPath === '/donate' || 
    cleanPath === '/transparency' || 
    cleanPath === '/impact' ||
    cleanPath === '/legal'
  ) {
    return { authorized: true, statusCode: 200, reason: 'Public Route Open to All' };
  }

  // Volunteer signup route
  if (cleanPath === '/volunteer' || cleanPath === '/volunteer/apply') {
    return { authorized: true, statusCode: 200, reason: 'Volunteer Onboarding Open' };
  }

  // Profile Route (Requires at least authentication or guest fallback)
  if (cleanPath === '/profile') {
    return { authorized: true, statusCode: 200, reason: 'Profile view authorized' };
  }

  // Protected Routes mapping
  const routePermissionMap: Record<string, Permission> = {
    '/admin': 'users.view',
    '/admin/users': 'users.roles',
    '/admin/settings': 'settings.manage',
    '/admin/approvals': 'content.publish',
    '/admin/certificates': 'certificates.issue',
    '/finance': 'finance.view',
    '/finance/audit': 'finance.audit',
    '/finance/10be': 'finance.export_10be',
    '/volunteers/manage': 'volunteers.view',
    '/volunteers/tasks': 'tasks.execute',
    '/reports/internal': 'reports.publish',
    '/dashboard': 'tasks.execute',
    '/security/audit': 'audit.view'
  };

  const matchedKey = Object.keys(routePermissionMap).find(k => cleanPath.startsWith(k));
  if (matchedKey) {
    const reqPerm = routePermissionMap[matchedKey];
    const isAuth = hasPermission({ role: normalizedRole }, reqPerm);
    if (!isAuth) {
      const isUnauth = normalizedRole === 'guest';
      return {
        authorized: false,
        requiredPermission: reqPerm,
        statusCode: isUnauth ? 401 : 403,
        reason: isUnauth 
          ? `401 Unauthorized: Please sign in with appropriate administrative credentials to access ${cleanPath}.` 
          : `403 Forbidden: Role '${normalizedRole}' does not hold '${reqPerm}' required for ${cleanPath}.`
      };
    }
    return { authorized: true, requiredPermission: reqPerm, statusCode: 200, reason: 'Authorized Route' };
  }

  // Catch-all for unknown /admin paths
  if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/finance')) {
    const isAuth = normalizedRole === 'admin' || normalizedRole === 'super_admin';
    return {
      authorized: isAuth,
      statusCode: isAuth ? 200 : (normalizedRole === 'guest' ? 401 : 403),
      reason: isAuth ? 'Authorized Admin Area' : '403 Forbidden: Administrative Credentials Required'
    };
  }

  return { authorized: true, statusCode: 200, reason: 'Authorized' };
}

/**
 * Donor Data Privacy Filter: Masks sensitive PII (PAN, Phone, Address)
 * unless the requester is an authorized Admin or the Donor themself.
 */
export function sanitizeDonorRecord(
  donation: any, 
  currentUser?: UserProfile | null
): any {
  if (!donation) return donation;
  const isSelf = currentUser && currentUser.email && donation.donorEmail && 
    currentUser.email.toLowerCase() === donation.donorEmail.toLowerCase();
  const isAdminOrFinance = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.role === 'super_admin' || 
    currentUser.role === 'finance'
  );

  // Authorized full view
  if (isSelf || isAdminOrFinance) {
    return { ...donation };
  }

  // Sanitized view for public/volunteer/management
  return {
    ...donation,
    donorEmail: donation.donorEmail ? donation.donorEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined,
    donorPhone: donation.donorPhone ? donation.donorPhone.replace(/(\d{2})(\d+)(\d{2})/, '$1******$3') : undefined,
    donorTaxId: donation.donorTaxId ? 'XXXXX' + donation.donorTaxId.slice(-4) : undefined,
    donorAddress: undefined,
    donorPincode: donation.donorPincode ? '***' + donation.donorPincode.slice(-3) : undefined,
    utrNumber: donation.utrNumber ? 'UTR-***' + donation.utrNumber.slice(-4) : undefined,
    transactionHash: undefined
  };
}

export const RBAC = {
  // Roles check
  isAdmin: (role?: UserRole | string): boolean => role === 'admin' || role === 'super_admin',
  isSuperAdmin: (role?: UserRole | string): boolean => role === 'super_admin',
  isFinance: (role?: UserRole | string): boolean => role === 'finance' || role === 'admin' || role === 'super_admin',
  isManagement: (role?: UserRole | string): boolean => role === 'management' || role === 'program_manager' || role === 'admin' || role === 'super_admin',
  isContentManager: (role?: UserRole | string): boolean => role === 'content_manager' || role === 'admin' || role === 'super_admin',
  isVolunteer: (role?: UserRole | string): boolean => role === 'volunteer' || role === 'admin' || role === 'super_admin',
  isVolunteerApplicant: (role?: UserRole | string): boolean => role === 'volunteer_applicant',
  isRegisteredUser: (role?: UserRole | string): boolean => role === 'registered_user',
  isGuest: (role?: UserRole | string): boolean => !role || role === 'guest',
  isDonor: (role?: UserRole | string): boolean => role === 'donor' || role === 'admin' || role === 'super_admin',

  // Permission-mapped helpers
  canFullControl: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'users.delete'),

  canEditDirectlyWithoutApproval: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.publish'),

  canCreateContent: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.draft'),

  canModifyOrDeletePublished: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.publish'),

  canReviewVolunteerSubmissions: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.review'),

  canFinalApproveAndPublish: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.publish'),

  canAssignWorkTo: (assignerRole?: UserRole | string, targetRole?: UserRole | string): boolean => {
    if (assignerRole === 'admin' || assignerRole === 'super_admin') return true;
    if ((assignerRole === 'management' || assignerRole === 'program_manager') && targetRole === 'volunteer') return true;
    return false;
  },

  canViewAuditLogs: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'audit.view'),

  canManageUserRoles: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'users.roles'),

  canReviewVolunteerApplications: (role?: UserRole | string): boolean =>
    hasPermission({ role: role as UserRole }, 'volunteers.approve'),

  canViewInternalWork: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.execute') || hasPermission({ role: role as UserRole }, 'tasks.create'),

  canVerifySafeguarding: (role?: UserRole | string): boolean =>
    hasPermission({ role: role as UserRole }, 'safeguarding.verify_consent'),

  // Certificate Authority
  canCreateCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.issue'),
  canIssueCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.issue'),
  canApproveCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.sign_80g'),
  canEditCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.issue'),
  canRevokeCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.revoke'),
  canDeleteCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.revoke'),
  canAssignCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.issue'),
  canViewAllCertificates: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.view_all'),
  
  canViewOwnCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.view_own'),
  
  canDownloadOwnCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.view_own'),

  canViewOtherUserCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.view_all'),
  canDownloadOtherUserCertificate: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.view_all'),

  // Batch Authorization
  canCreateBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.create'),
  canAssignBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'volunteers.assign_tasks'),
  canReassignBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'volunteers.assign_tasks'),
  canCloseBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.create'),
  canDeleteBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.create'),
  canManageAssignedBatch: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.create') || hasPermission({ role: role as UserRole }, 'tasks.execute'),

  // UI Navigation Checks
  canAccessTasksNav: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.execute') || hasPermission({ role: role as UserRole }, 'tasks.create'),
  canAccessApprovalsNav: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'content.publish') || hasPermission({ role: role as UserRole }, 'volunteers.approve'),
  canAccessAdminStudio: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'projects.create') || hasPermission({ role: role as UserRole }, 'content.publish'),
  canAccessManagementStudio: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.create') || hasPermission({ role: role as UserRole }, 'content.review'),
  canAccessVolunteerStudio: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'tasks.execute'),
  canAccessDonorPortal: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'donations.view_own'),
  canAccessCertificateAuthority: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'certificates.issue'),
  canAccessSystemSettings: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'settings.manage'),
  canAccessWebhooks: (role?: UserRole | string): boolean => 
    hasPermission({ role: role as UserRole }, 'webhooks.manage'),
  canAccessSecuritySimulator: (role?: UserRole | string): boolean =>
    hasPermission({ role: role as UserRole }, 'security.simulate') || role === 'admin'
};

// -------------------------------------------------------------
// 2. Initial Seed Data (Batches, Submissions & Audit Logs)
// -------------------------------------------------------------

export const INITIAL_BATCHES: BatchAssignment[] = [
  {
    id: 'BATCH-2026-01',
    batchCode: 'BATCH #WTR-01',
    title: 'Bundi Solar Borewell Installation & Water Quality TDS Audit',
    category: 'Water',
    description: 'Complete water filtration setup, TDS sensor verification, and handover certificates for 4 solar borewell clusters.',
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'Founder & National Managing Director'
    },
    assignedTo: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management',
      title: 'Field Operations & Regional Logistics Manager'
    },
    totalTasks: 4,
    completedTasks: 4,
    status: 'completed',
    startDate: '2026-08-01',
    targetCompletionDate: '2026-08-15',
    nextBatchAssigned: true,
    nextBatchId: 'BATCH-2026-02',
    nextBatchTitle: 'BATCH #WTR-02: Water Distribution Pipeline Extension',
    deliverablesNotes: 'All 4 wells verified with TDS < 120 PPM. Panchayat deed signed.',
    proofImages: [
      'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584445584400-880948e9196d?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-08-01',
    completedAt: '2026-08-15'
  },
  {
    id: 'BATCH-2026-02',
    batchCode: 'BATCH #WTR-02',
    title: 'Water Distribution Pipeline & Tap Stand Commissioning',
    category: 'Water',
    description: 'Second phase following Batch #WTR-01. Lay 1.2km distribution pipe to 60 tribal households.',
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'Managing Trustee & National Director'
    },
    assignedTo: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer',
      title: 'Field Volunteer'
    },
    totalTasks: 3,
    completedTasks: 1,
    status: 'in_progress',
    startDate: '2026-08-16',
    targetCompletionDate: '2026-08-28',
    nextBatchAssigned: false,
    deliverablesNotes: 'Piping trench 40% complete. Pressure testing scheduled.',
    proofImages: [
      'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-08-16'
  },
  {
    id: 'BATCH-2026-03',
    batchCode: 'BATCH #EDU-04',
    title: 'Smart Class Solar Tablet Lab Deployment & Teacher Training',
    category: 'Education',
    description: 'Deploy 45 offline-cached educational tablets across 3 government schools in Mewat.',
    assignedBy: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin',
      title: 'National Director'
    },
    assignedTo: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer',
      title: 'AABHA Student Chapter Lead'
    },
    totalTasks: 5,
    completedTasks: 3,
    status: 'in_progress',
    startDate: '2026-08-10',
    targetCompletionDate: '2026-08-25',
    nextBatchAssigned: false,
    deliverablesNotes: 'Tablets pre-loaded with NCERT syllabus. 2 schools completed.',
    createdAt: '2026-08-10'
  }
];

export const INITIAL_SUBMISSIONS: ContentSubmissionItem[] = [
  {
    id: 'SUB-101',
    title: 'Kishanganj Flood Relief Medical Van Field Report',
    contentType: 'report',
    category: 'Healthcare',
    summary: 'Detailed medical relief metrics: 840 patients treated, chlorine tablet kits distributed across 6 waterlogged hamlets.',
    contentData: {
      location: 'Kishanganj, Bihar',
      beneficiaries: 840,
      medicinesDispatched: 'ORSalts, Antibiotics, Paracetamol, Water Purification Tablets',
      leadDoctor: 'Dr. Arvind Mehta'
    },
    status: 'pending_admin_approval',
    createdBy: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
    },
    createdAt: '2026-08-16T10:30:00Z',
    managementReview: {
      reviewedBy: 'Priya Sharma',
      reviewerEmail: 'priya.mgmt@helpsngo.in',
      reviewedAt: '2026-08-17T09:15:00Z',
      comments: 'All patient rosters and pharmacy vouchers verified against field receipts. Ready for National Director approval and public bulletin release.',
      status: 'endorsed_for_admin'
    },
    batchId: 'BATCH-2026-01',
    mediaUrls: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
    ],
    version: 1
  },
  {
    id: 'SUB-102',
    title: 'Tribal Girl Child STEM Scholarship Program 2026-27',
    contentType: 'project',
    category: 'Education',
    summary: 'New fundraising campaign seeking ₹12,50,000 for full residential schooling of 100 first-generation tribal girls.',
    contentData: {
      targetAmount: 1250000,
      location: 'Koraput & Rayagada Districts, Odisha',
      targetBeneficiaries: 100,
      durationMonths: 12
    },
    status: 'pending_admin_approval',
    createdBy: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    createdAt: '2026-08-17T14:00:00Z',
    managementReview: {
      reviewedBy: 'Priya Sharma',
      reviewerEmail: 'priya.mgmt@helpsngo.in',
      reviewedAt: '2026-08-17T14:05:00Z',
      comments: 'Formulated with Odisha District Education Office mou draft. Submitted for Amarjeet Kumar final approval.',
      status: 'endorsed_for_admin'
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
    ],
    version: 1
  },
  {
    id: 'SUB-103',
    title: 'Voices of Resilience: Sunita’s Journey to State Polytechnic',
    contentType: 'story',
    category: 'Education',
    summary: 'Impact story documenting Sunita Soren from AABHA coaching center scoring 94% in state engineering entrance.',
    contentData: {
      protagonist: 'Sunita Soren',
      age: 18,
      location: 'Ranchi, Jharkhand',
      quote: 'Helps NGO gave me books when we had no electricity. Today I am the first girl in our village to enter engineering college.'
    },
    status: 'published',
    createdBy: {
      name: 'Rahul Verma',
      email: 'volunteer@helpsngo.in',
      role: 'volunteer'
    },
    createdAt: '2026-08-14T08:00:00Z',
    managementReview: {
      reviewedBy: 'Priya Sharma',
      reviewerEmail: 'priya.mgmt@helpsngo.in',
      reviewedAt: '2026-08-14T11:00:00Z',
      comments: 'Consent release signed by parents. High impact visual.',
      status: 'endorsed_for_admin'
    },
    adminReview: {
      reviewedBy: 'Amarjeet Kumar',
      reviewerEmail: 'amar@helpsngo.in',
      reviewedAt: '2026-08-15T10:00:00Z',
      comments: 'Approved and published to public impact carousel.',
      status: 'published'
    },
    publishedAt: '2026-08-15T10:00:00Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    ],
    version: 2
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-15T10:00:00Z',
    actor: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin'
    },
    action: 'CONTENT_PUBLISHED',
    entityType: 'story',
    entityId: 'SUB-103',
    entityTitle: 'Voices of Resilience: Sunita’s Journey to State Polytechnic',
    details: 'Final approval granted. Story published live to public view.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-15T09:30:00Z',
    actor: {
      name: 'Amarjeet Kumar',
      email: 'amar@helpsngo.in',
      role: 'admin'
    },
    action: 'BATCH_ASSIGNED',
    entityType: 'batch',
    entityId: 'BATCH-2026-02',
    entityTitle: 'BATCH #WTR-02: Water Distribution Pipeline Extension',
    details: 'Assigned next batch package to Field Operations following completion of Batch #WTR-01.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-08-17T09:15:00Z',
    actor: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management'
    },
    action: 'CONTENT_MGMT_REVIEWED',
    entityType: 'report',
    entityId: 'SUB-101',
    entityTitle: 'Kishanganj Flood Relief Medical Van Field Report',
    details: 'Management verified volunteer submissions and endorsed to National Director for final signoff.'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-08-17T14:05:00Z',
    actor: {
      name: 'Priya Sharma',
      email: 'priya.mgmt@helpsngo.in',
      role: 'management'
    },
    action: 'CONTENT_SUBMITTED_TO_ADMIN',
    entityType: 'project',
    entityId: 'SUB-102',
    entityTitle: 'Tribal Girl Child STEM Scholarship Program 2026-27',
    details: 'Management created campaign draft and submitted for Admin approval.'
  }
];

// -------------------------------------------------------------
// 3. Persistent Storage Accessors & Lifecycle State Managers
// -------------------------------------------------------------

export const getStoredSubmissions = (): ContentSubmissionItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return INITIAL_SUBMISSIONS;
};

export const saveSubmissions = (items: ContentSubmissionItem[]) => {
  try {
    localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const getStoredBatches = (): BatchAssignment[] => {
  try {
    const data = localStorage.getItem(STORAGE_BATCHES_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return INITIAL_BATCHES;
};

export const saveBatches = (items: BatchAssignment[]) => {
  try {
    localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const getStoredAuditLogs = (): AuditLogEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_AUDIT_LOG_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return INITIAL_AUDIT_LOGS;
};

/**
 * Access-controlled batch query according to Policy:
 * - Admin: Full access to all batches.
 * - Management: Batches assigned to them + volunteer batches under their supervision.
 * - Volunteer: Only batches directly assigned to their account.
 * - Donor: Only public/donor-accessible batches.
 * - Guest: Only public batches.
 */
export const getBatchesForUser = (user: UserProfile | null | undefined): BatchAssignment[] => {
  const allBatches = getStoredBatches();
  
  if (!user || user.role === 'guest' || !user.role) {
    return allBatches.filter(b => b.isPublic);
  }

  if (RBAC.isAdmin(user.role)) {
    return allBatches;
  }

  const userEmail = (user.email || '').trim().toLowerCase();
  const userName = (user.name || '').trim().toLowerCase();

  if (RBAC.isManagement(user.role)) {
    return allBatches.filter(b => {
      const assignedEmail = (b.assignedTo?.email || '').trim().toLowerCase();
      const isAssignedToSelf = assignedEmail === userEmail;
      const isSupervisingVolunteer = b.assignedTo?.role === 'volunteer';
      return isAssignedToSelf || isSupervisingVolunteer || b.isPublic;
    });
  }

  if (RBAC.isVolunteer(user.role)) {
    return allBatches.filter(b => {
      const assignedEmail = (b.assignedTo?.email || '').trim().toLowerCase();
      const assignedName = (b.assignedTo?.name || '').trim().toLowerCase();
      return assignedEmail === userEmail || assignedName === userName;
    });
  }

  if (RBAC.isDonor(user.role)) {
    return allBatches.filter(b => b.isPublic);
  }

  return [];
};

/**
 * Admin-Only Batch Operations
 */
export const createBatchByAdmin = (
  adminUser: UserProfile,
  batchData: Omit<BatchAssignment, 'id' | 'createdAt' | 'assignedBy'>
): { success: boolean; batch?: BatchAssignment; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    appendAuditLog(
      'PERMISSION_ACCESS_DENIED',
      adminUser,
      'batch',
      'NEW_BATCH_ATTEMPT',
      batchData.title,
      'Unauthorized non-admin attempted to create an official batch.'
    );
    return { success: false, error: 'Only System Administrators can create official batches.' };
  }

  const newBatch: BatchAssignment = {
    ...batchData,
    id: `BATCH-2026-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    assignedBy: {
      name: adminUser.name || 'Amarjeet Kumar',
      email: adminUser.email || 'amar@helpsngo.in',
      role: 'admin',
      title: 'Managing Trustee & National Director'
    }
  };

  const batches = getStoredBatches();
  const updated = [newBatch, ...batches];
  saveBatches(updated);

  appendAuditLog(
    'BATCH_CREATED',
    adminUser,
    'batch',
    newBatch.id,
    newBatch.title,
    `Admin created batch ${newBatch.batchCode} and assigned to ${newBatch.assignedTo?.name} (${newBatch.assignedTo?.role})`
  );

  return { success: true, batch: newBatch };
};

export const reassignBatchByAdmin = (
  adminUser: UserProfile,
  batchId: string,
  newAssignedTo: BatchAssignment['assignedTo']
): { success: boolean; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can reassign batches.' };
  }

  const batches = getStoredBatches();
  const batchIndex = batches.findIndex(b => b.id === batchId);

  if (batchIndex === -1) {
    return { success: false, error: 'Batch not found.' };
  }

  const oldAssignee = batches[batchIndex].assignedTo?.name;
  batches[batchIndex].assignedTo = newAssignedTo;
  saveBatches(batches);

  appendAuditLog(
    'BATCH_REASSIGNED',
    adminUser,
    'batch',
    batchId,
    batches[batchIndex].title,
    `Admin reassigned batch from ${oldAssignee} to ${newAssignedTo.name} (${newAssignedTo.email})`
  );

  return { success: true };
};

export const closeBatchByAdmin = (
  adminUser: UserProfile,
  batchId: string,
  completionNotes?: string
): { success: boolean; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can close or complete batches.' };
  }

  const batches = getStoredBatches();
  const batchIndex = batches.findIndex(b => b.id === batchId);

  if (batchIndex === -1) {
    return { success: false, error: 'Batch not found.' };
  }

  batches[batchIndex].status = 'completed';
  batches[batchIndex].completedAt = new Date().toISOString();
  if (completionNotes) {
    batches[batchIndex].deliverablesNotes = completionNotes;
  }
  saveBatches(batches);

  appendAuditLog(
    'BATCH_COMPLETED',
    adminUser,
    'batch',
    batchId,
    batches[batchIndex].title,
    `Admin verified deliverables and marked batch ${batches[batchIndex].batchCode} as closed & completed.`
  );

  return { success: true };
};

export const deleteBatchByAdmin = (
  adminUser: UserProfile,
  batchId: string
): { success: boolean; error?: string } => {
  if (!RBAC.isAdmin(adminUser.role)) {
    return { success: false, error: 'Only Administrators can delete batches.' };
  }

  const batches = getStoredBatches();
  const target = batches.find(b => b.id === batchId);
  const filtered = batches.filter(b => b.id !== batchId);
  saveBatches(filtered);

  if (target) {
    appendAuditLog(
      'BATCH_DELETED',
      adminUser,
      'batch',
      target.id,
      target.title,
      `Admin permanently removed batch ${target.batchCode} from records.`
    );
  }

  return { success: true };
};

export const appendAuditLog = (
  action: AuditLogEntry['action'],
  actor: UserProfile,
  entityType: AuditLogEntry['entityType'],
  entityId: string,
  entityTitle: string,
  details: string,
  previousState?: string,
  newState?: string
): AuditLogEntry => {
  const newEntry: AuditLogEntry = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    actor: {
      name: actor.name || 'Anonymous User',
      email: actor.email || 'user@helpsngo.in',
      role: actor.role || 'guest',
      avatar: actor.avatar
    },
    action,
    entityType,
    entityId,
    entityTitle,
    details,
    previousState,
    newState
  };

  const logs = getStoredAuditLogs();
  const updatedLogs = [newEntry, ...logs];
  try {
    localStorage.setItem(STORAGE_AUDIT_LOG_KEY, JSON.stringify(updatedLogs));
  } catch {
    // ignore
  }
  return newEntry;
};

// -------------------------------------------------------------
// Volunteer Application & Applicant Lifecycle Service
// -------------------------------------------------------------

export const INITIAL_VOLUNTEER_APPLICATIONS: VolunteerApplication[] = [
  {
    id: 'APP-2026-081',
    applicantName: 'Simran Kaur',
    email: 'simran.kaur@gmail.com',
    phone: '+91 98765 43210',
    skills: 'Teaching, Mathematics & English tutoring',
    availability: 'Weekends (Saturday & Sunday mornings)',
    location: 'Amritsar District, Punjab',
    idProofType: 'Aadhaar',
    idProofNumberMasked: 'XXXX-XXXX-4921',
    emergencyContactName: 'Harpreet Singh (Father)',
    emergencyContactPhone: '+91 98765 43211',
    status: 'pending_review',
    appliedAt: '2026-08-18T14:30:00Z',
    assignedSquad: 'Amritsar Rural Education Squad'
  },
  {
    id: 'APP-2026-082',
    applicantName: 'Dr. Vivek Malhotra',
    email: 'dr.malhotra@healthhub.org',
    phone: '+91 98123 77654',
    skills: 'General Medicine, Pediatric Health Camps, First Aid Training',
    availability: 'Monthly field clinics (2 days/month)',
    location: 'Ludhiana, Punjab',
    idProofType: 'Driving License',
    idProofNumberMasked: 'PB-XXXX-2019-88',
    emergencyContactName: 'Ritu Malhotra (Spouse)',
    emergencyContactPhone: '+91 98123 77655',
    status: 'verified_active',
    appliedAt: '2026-08-10T10:15:00Z',
    reviewedByAdmin: 'Amarjeet Kumar (Trustee)',
    reviewedAt: '2026-08-12T16:00:00Z',
    reviewNotes: 'Verified MBBS credentials and medical council registration.',
    assignedSquad: 'Mobile Health Clinic Squad - Majha'
  },
  {
    id: 'APP-2026-083',
    applicantName: 'Gurdeep Singh',
    email: 'gurdeep.s@outlook.com',
    phone: '+91 94112 33445',
    skills: 'Logistics, Relief Distribution, Driving Light Commercial Vehicles',
    availability: 'Full-time during disaster relief operations',
    location: 'Jalandhar, Punjab',
    idProofType: 'Voter ID',
    idProofNumberMasked: 'PB/04/XXX/991',
    emergencyContactName: 'Manjit Singh (Brother)',
    emergencyContactPhone: '+91 94112 33446',
    status: 'pending_review',
    appliedAt: '2026-08-19T09:00:00Z',
    assignedSquad: 'Emergency Flood Relief Squad'
  }
];

export const getStoredVolunteerApplications = (): VolunteerApplication[] => {
  try {
    const stored = localStorage.getItem(STORAGE_VOLUNTEER_APPLICATIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_VOLUNTEER_APPLICATIONS;
};

export const saveVolunteerApplications = (apps: VolunteerApplication[]): void => {
  try {
    localStorage.setItem(STORAGE_VOLUNTEER_APPLICATIONS_KEY, JSON.stringify(apps));
  } catch {
    // ignore
  }
};

export const submitVolunteerApplication = (
  appData: Omit<VolunteerApplication, 'id' | 'status' | 'appliedAt'>
): { success: boolean; application: VolunteerApplication } => {
  const newApp: VolunteerApplication = {
    ...appData,
    id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
    status: 'pending_review',
    appliedAt: new Date().toISOString()
  };

  const current = getStoredVolunteerApplications();
  const updated = [newApp, ...current];
  saveVolunteerApplications(updated);

  appendAuditLog(
    'VOLUNTEER_APPLICANT_SUBMITTED',
    {
      name: appData.applicantName,
      email: appData.email,
      role: 'volunteer_applicant',
      avatar: '',
      totalContribution: 0,
      volunteerHours: 0,
      volunteerLevel: 'Applicant',
      volunteerNextTierHours: 10,
      phone: appData.phone,
      taxId: '',
      currency: 'INR'
    },
    'user',
    newApp.id,
    newApp.applicantName,
    `New volunteer application submitted. Skills: ${appData.skills}. Status: Pending Trustee Verification.`
  );

  return { success: true, application: newApp };
};

export const reviewVolunteerApplication = (
  adminUser: UserProfile,
  applicationId: string,
  decision: 'approve' | 'reject' | 'hold',
  notes?: string,
  assignedSquad?: string
): { success: boolean; error?: string; updatedApp?: VolunteerApplication } => {
  if (!RBAC.canReviewVolunteerApplications(adminUser.role)) {
    return { success: false, error: '403 Forbidden: Only authorized Trustees/Admins can review volunteer applications.' };
  }

  const applications = getStoredVolunteerApplications();
  const idx = applications.findIndex(a => a.id === applicationId);
  if (idx === -1) {
    return { success: false, error: 'Application record not found.' };
  }

  const target = applications[idx];
  const newStatus: VolunteerApplicationStatus = 
    decision === 'approve' ? 'verified_active' : 
    decision === 'reject' ? 'rejected' : 'on_hold';

  target.status = newStatus;
  target.reviewedByAdmin = `${adminUser.name} (${adminUser.title || 'Trustee'})`;
  target.reviewedAt = new Date().toISOString();
  if (notes) target.reviewNotes = notes;
  if (assignedSquad) target.assignedSquad = assignedSquad;

  saveVolunteerApplications(applications);

  const action = decision === 'approve' ? 'VOLUNTEER_APPLICANT_APPROVED' : 'VOLUNTEER_APPLICANT_REJECTED';
  appendAuditLog(
    action,
    adminUser,
    'user',
    target.id,
    target.applicantName,
    `Trustee ${adminUser.name} marked application ${target.id} as ${newStatus}. Notes: ${notes || 'Verified statutory compliance.'}`
  );

  return { success: true, updatedApp: target };
};
