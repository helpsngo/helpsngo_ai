export type TabType = 'home' | 'projects' | 'donate' | 'profile' | 'volunteer';

export type UserRole = 
  | 'guest'
  | 'registered_user'
  | 'volunteer_applicant'
  | 'volunteer'
  | 'donor'
  | 'program_manager'
  | 'content_manager'
  | 'finance'
  | 'admin'
  | 'super_admin'
  | 'management'; // Backwards compatibility alias for program_manager

export type Permission =
  // User Management & Access
  | 'users.view'
  | 'users.edit'
  | 'users.roles'
  | 'users.delete'
  // Volunteer Lifecycle
  | 'volunteers.view'
  | 'volunteers.apply'
  | 'volunteers.review'
  | 'volunteers.approve'
  | 'volunteers.assign_tasks'
  // Donations & Finance
  | 'donations.view_all'
  | 'donations.view_own'
  | 'donations.verify'
  | 'donations.refund'
  | 'finance.view'
  | 'finance.audit'
  | 'finance.export_10be'
  // Projects & Operations
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'tasks.create'
  | 'tasks.execute'
  | 'tasks.review'
  // Content & Reports
  | 'content.draft'
  | 'content.review'
  | 'content.publish'
  | 'reports.view'
  | 'reports.publish'
  // Certificates & Compliance
  | 'certificates.view_own'
  | 'certificates.view_all'
  | 'certificates.issue'
  | 'certificates.sign_80g'
  | 'certificates.revoke'
  // Safeguarding & Minor Protection
  | 'safeguarding.view'
  | 'safeguarding.verify_consent'
  | 'safeguarding.override'
  // System & Security
  | 'settings.manage'
  | 'webhooks.manage'
  | 'audit.view'
  | 'security.simulate';

export interface SafeguardingConsent {
  hasGuardianConsent: boolean;
  guardianName?: string;
  guardianRelation?: string;
  guardianContact?: string;
  minorProtectionApplied: boolean;
  faceObfuscated: boolean;
  consentFormRef?: string;
  signedOfficerName?: string;
  verifiedAt?: string;
  riskAssessment: 'low' | 'moderate' | 'high_protection_required';
  notes?: string;
}

export type VolunteerApplicationStatus = 'pending_review' | 'interview_scheduled' | 'verified_active' | 'on_hold' | 'rejected';

export interface VolunteerApplication {
  id: string;
  userId?: string;
  applicantName: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  location: string;
  idProofType?: 'Aadhaar' | 'Voter ID' | 'Driving License' | 'Passport' | 'Student ID';
  idProofNumberMasked?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  status: VolunteerApplicationStatus;
  appliedAt: string;
  reviewedByAdmin?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  assignedSquad?: string;
}

export interface LegalPolicySection {
  id: string;
  title: string;
  category: 'privacy' | 'statutory' | 'governance' | 'donor' | 'volunteer' | 'safeguarding' | 'Legal Governance' | 'Data Privacy' | 'Finance & 80G' | 'Operations' | 'Safeguarding' | 'Compliance' | string;
  shortSummary?: string;
  summary?: string;
  statutoryReference?: string;
  lastUpdated: string;
  version?: string;
  contentMarkdown?: string;
  content?: string;
  keyHighlights?: string[];
}

export type ContentApprovalStatus = 
  | 'draft' 
  | 'pending_management_review' 
  | 'pending_admin_approval' 
  | 'approved' 
  | 'published' 
  | 'rejected' 
  | 'archived';

export interface ContentSubmissionItem {
  id: string;
  title: string;
  contentType: 'project' | 'story' | 'dispatch' | 'media' | 'report' | 'announcement';
  category?: string;
  summary: string;
  contentData: Record<string, any>;
  status: ContentApprovalStatus;
  
  // Author details
  createdBy: {
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  
  // Management Review stage
  managementReview?: {
    reviewedBy: string;
    reviewerEmail: string;
    reviewedAt: string;
    comments: string;
    status: 'endorsed_for_admin' | 'revisions_requested';
  };
  
  // Admin Final Review stage
  adminReview?: {
    reviewedBy: string;
    reviewerEmail: string;
    reviewedAt: string;
    comments: string;
    status: 'published' | 'rejected' | 'archived';
  };
  
  // Associated Batch / Task if linked
  batchId?: string;
  taskId?: string;
  mediaUrls?: string[];
  publishedAt?: string;
  version: number;
  safeguarding?: SafeguardingConsent;
}

export interface BatchAssignment {
  id: string;
  batchCode: string;
  title: string;
  category: TaskCategory;
  description: string;
  assignedBy: {
    name: string;
    email: string;
    role: 'admin';
    title?: string;
  };
  assignedTo: {
    name: string;
    email: string;
    role: 'management' | 'volunteer';
    title?: string;
    avatar?: string;
  };
  totalTasks: number;
  completedTasks: number;
  status: 'active' | 'in_progress' | 'completed' | 'verified_by_management' | 'approved_by_admin';
  startDate: string;
  targetCompletionDate: string;
  nextBatchAssigned?: boolean;
  nextBatchId?: string;
  nextBatchTitle?: string;
  deliverablesNotes?: string;
  proofImages?: string[];
  createdAt: string;
  completedAt?: string;
  certificateIssued?: boolean;
  certificateId?: string;
  isPublic?: boolean;
}

export type CertificateType = 
  | 'volunteer_service' 
  | 'donation_80g' 
  | 'management_appreciation' 
  | 'batch_completion' 
  | 'leadership_award';

export type CertificateStatus = 'active' | 'revoked' | 'draft';

export interface IssuedCertificate {
  id: string;
  certificateNumber: string;
  type: CertificateType;
  title: string;
  subtitle?: string;
  recipientUserId: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: UserRole;
  recipientAvatar?: string;
  
  // Admin Authorization Details
  issuedByAdminId: string;
  issuedByAdminName: string;
  issuedByAdminTitle: string;
  issueDate: string;
  expiryDate?: string;
  status: CertificateStatus;
  revokedReason?: string;
  revokedAt?: string;
  
  // Operational Linkage
  batchId?: string;
  batchTitle?: string;
  taskId?: string;
  donationId?: string;
  hoursCredited?: number;
  donationAmount?: number;
  donationCurrency?: string;
  impactMetrics?: string;
  citationText: string;
  
  // Official Trust Compliance
  trustName: string;
  taxExemption80GNumber: string;
  nitiAayogDarpanId: string;
  trustRegistrationNumber: string;
  signatoryName: string;
  signatoryDesignation: string;
  qrCodeVerificationHash: string;
  verificationUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  action: 
    | 'CONTENT_CREATED'
    | 'CONTENT_EDITED'
    | 'CONTENT_SUBMITTED_TO_MGMT'
    | 'CONTENT_MGMT_REVIEWED'
    | 'CONTENT_SUBMITTED_TO_ADMIN'
    | 'CONTENT_ADMIN_APPROVED'
    | 'CONTENT_PUBLISHED'
    | 'CONTENT_REJECTED'
    | 'CONTENT_ARCHIVED'
    | 'CONTENT_DELETED'
    | 'TASK_ASSIGNED'
    | 'TASK_COMPLETED'
    | 'TASK_SUBMITTED'
    | 'BATCH_CREATED'
    | 'BATCH_ASSIGNED'
    | 'BATCH_REASSIGNED'
    | 'BATCH_COMPLETED'
    | 'BATCH_CLOSED'
    | 'BATCH_DELETED'
    | 'CERTIFICATE_CREATED'
    | 'CERTIFICATE_ISSUED'
    | 'CERTIFICATE_EDITED'
    | 'CERTIFICATE_REVOKED'
    | 'CERTIFICATE_REISSUED'
    | 'CERTIFICATE_DELETED'
    | 'CERTIFICATE_DOWNLOAD_VERIFIED'
    | 'CERTIFICATE_ACCESS_DENIED'
    | 'ROLE_CHANGED'
    | 'DONATION_APPROVED'
    | 'PERMISSION_ACCESS_DENIED'
    | 'SECURITY_ROUTE_BLOCKED'
    | 'SAFEGUARDING_CONSENT_VERIFIED'
    | 'SAFEGUARDING_FLAG_APPLIED'
    | 'VOLUNTEER_APPLICANT_SUBMITTED'
    | 'VOLUNTEER_APPLICANT_APPROVED'
    | 'VOLUNTEER_APPLICANT_REJECTED'
    | 'LEGAL_POLICY_ACKNOWLEDGED'
    | 'MFA_CHALLENGE_VERIFIED'
    | 'LOGIN'
    | 'LOGOUT'
    | 'USER_REGISTERED'
    | 'PASSWORD_RESET'
    | 'WHATSAPP_AUTH';
  entityType: 'project' | 'story' | 'dispatch' | 'task' | 'batch' | 'media' | 'donation' | 'user' | 'system' | 'report' | 'announcement' | 'certificate' | 'policy' | 'safeguarding';
  entityId: string;
  entityTitle: string;
  details: string;
  previousState?: string;
  newState?: string;
}

export interface Mission {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: 'GraduationCap' | 'HeartPulse' | 'Utensils' | 'Droplets' | 'Users' | 'ShieldCheck';
  iconBg: string;
  iconColor: string;
  stat: string;
  statLabel: string;
}

export interface ProjectUpdate {
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'Education' | 'Healthcare' | 'Water' | 'Hunger' | 'Community' | 'Environment' | 'Relief';
  image: string;
  raisedAmount: number;
  targetAmount: number;
  percentage: number;
  location: string;
  beneficiariesCount: string;
  updates: ProjectUpdate[];
  urgency?: 'High' | 'Normal';
}

export type DonationJourneyStep = 
  | 'amount' 
  | 'cause' 
  | 'donor' 
  | 'payment' 
  | 'confirmation' 
  | 'receipt' 
  | 'appreciation' 
  | 'impact';

export interface DonationRecord {
  id: string;
  title: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  status: 'Completed' | 'Processing';
  receiptNumber: string;
  isMonthly: boolean;
  paymentMethod: string;
  taxDeductible: boolean;
  donorEmail?: string;
  donorName?: string;
  donorTaxId?: string;
  donorPhone?: string;
  donorAddress?: string;
  donorPincode?: string;
  donorCitizenship?: 'indian' | 'nri' | 'international';
  appreciationLetterId?: string;
  appreciationSignedBy?: string;
  transactionHash?: string;
  utrNumber?: string;
  impactMilestone?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  totalContribution: number;
  volunteerHours: number;
  volunteerLevel: string;
  volunteerNextTierHours: number;
  phone: string;
  taxId: string;
  currency: string;
  role?: UserRole;
  title?: string;
  authProvider?: 'google' | 'password' | 'guest' | 'otp';
  emailVerified?: boolean;
  registeredAt?: string;
  volunteerApplicationStatus?: VolunteerApplicationStatus;
  assignedSquad?: string;
  idProofType?: string;
  idProofNumberMasked?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  isMfaEnabled?: boolean;
  sessionExpiresAt?: string;
}

export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';
export type TaskCategory = 'Education' | 'Healthcare' | 'Water' | 'Hunger' | 'Logistics' | 'Audit' | 'Field Relief' | 'Community Outreach' | 'Environment' | 'Relief' | 'Community';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WorkAssignment {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline: string;
  location: string;
  estimatedHours: number;
  
  // Who created and assigned this work
  assignedBy: {
    name: string;
    email: string;
    role: 'admin' | 'management';
    title?: string;
    avatar?: string;
  };
  
  // Who is responsible for executing this work
  assignedTo: {
    name: string;
    email: string;
    role: 'management' | 'volunteer';
    title?: string;
    avatar?: string;
  };
  
  status: TaskStatus;
  checklist?: TaskChecklistItem[];
  completionNotes?: string;
  submittedHours?: number;
  completedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'management' | 'volunteer';
  title: string;
  avatar: string;
  phone: string;
  location: string;
  activeTasksCount?: number;
  completedTasksCount?: number;
}

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  location: string;
  notes?: string;
}

export interface ImpactStory {
  id: string;
  name: string;
  age?: number;
  role: string;
  category: 'Education' | 'Healthcare' | 'Water' | 'Hunger' | 'Community' | 'Environment' | 'Relief';
  location: string;
  quote: string;
  story: string;
  impactMetric: string;
  image: string;
}

export interface ImpactMilestone {
  id: string;
  title: string;
  category: 'donation' | 'volunteer' | 'special';
  description: string;
  targetValue: number;
  unit: string;
  currentValue: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  iconName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  reward: string;
}

export type PaymentMethodType = 'card' | 'paypal' | 'upi' | 'applepay' | 'qr';

export interface OrgStats {
  livesTouched: string;
  mealsServed: string;
  childrenEducated: string;
  waterWellsInstalled: string;
  volunteersActive: string;
  missionHeadline: string;
  missionDescription: string;
  trustRegistration: string;
}

export interface FieldDispatch {
  id: string;
  title: string;
  meta: string;
  category: string;
  date: string;
  iconType: 'classroom' | 'clinic' | 'water' | 'food' | 'general';
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'gu';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  flagEmoji: string;
}

export type WebhookEventType = 
  | 'donation.completed' 
  | 'quarterly.impact_digest' 
  | 'tax_certificate.issued' 
  | 'disaster.field_alert' 
  | 'volunteer.assignment_created';

export interface WebhookConfig {
  id: string;
  name: string;
  channel: 'whatsapp' | 'email' | 'custom_webhook';
  endpointUrl: string;
  secretKey?: string;
  enabled: boolean;
  events: WebhookEventType[];
  templateId?: string;
  description: string;
  lastTriggeredAt?: string;
  successRate?: number;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  channel: 'whatsapp' | 'email' | 'custom_webhook';
  event: WebhookEventType;
  recipient: string; // phone or email or URL
  recipientName?: string;
  timestamp: string;
  status: 'delivered' | 'failed' | 'processing';
  httpStatusCode: number;
  payload: Record<string, any>;
  responseMessage?: string;
  latencyMs: number;
  retryCount: number;
}

export interface DonorNotificationPreferences {
  whatsappThankYou: boolean;
  whatsappQuarterlyMilestones: boolean;
  emailMonthlyDigest: boolean;
  emailQuarterlyImpactReport: boolean;
  taxCertificateAutoSend: boolean;
  emergencyAlerts: boolean;
}

export type OfflineActionType = 
  | 'CHECKLIST_TOGGLE'
  | 'LOG_VOLUNTEER_HOURS'
  | 'TASK_STATUS_UPDATE'
  | 'TASK_COMPLETION_SUBMIT'
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'DELETE_TASK';

export interface OfflineSyncItem {
  id: string;
  type: OfflineActionType;
  taskId: string;
  taskTitle: string;
  timestamp: number;
  dateFormatted: string;
  payload: Record<string, any>;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  error?: string;
  villageLocation?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
  };
}

export interface OfflineSyncState {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  queue: OfflineSyncItem[];
  history: OfflineSyncItem[];
}

export type ProfileTaskViewRole = 'management' | 'volunteer' | 'donor';

export interface OrgProgram {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  impactHighlight: string;
  iconName: string;
  image: string;
}

export interface OrgLeadershipMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  avatar: string;
  email?: string;
  phone?: string;
  location: string;
}

export interface OrganizationInfo {
  name: string;
  legalName: string;
  shortName: string;
  acronymMeaning: string;
  registrationNumber: string;
  governingAct: string;
  taxStatus: string;
  foundedYear: string;
  address: {
    street: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
    country: string;
    fullFormatted: string;
  };
  phone: {
    primary: string;
    secondary: string;
    helpline: string;
  };
  email: {
    primary: string;
    general: string;
    support: string;
  };
  website: string;
  mission: string;
  vision: string;
  coreValues: string[];
  programs: OrgProgram[];
  impactMetrics: {
    livesTouched: string;
    childrenEducated: string;
    mealsServed: string;
    medicalCamps: string;
    treesPlanted: string;
    volunteersActive: string;
    womenEmpowered: string;
  };
  leadership: OrgLeadershipMember[];
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

