import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  TabType, 
  Project, 
  DonationRecord, 
  UserProfile, 
  VolunteerFormData, 
  OrgStats, 
  ImpactStory, 
  FieldDispatch, 
  WorkAssignment,
  ContentSubmissionItem
} from './types';
import { 
  GUEST_USER, 
  INITIAL_PROJECTS, 
  INITIAL_DONATIONS, 
  MISSIONS, 
  IMPACT_STORIES,
  INITIAL_ORG_STATS,
  INITIAL_FIELD_DISPATCHES,
  INITIAL_WORK_ASSIGNMENTS
} from './data/mockData';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { HomeScreen } from './components/HomeScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { DonateScreen } from './components/DonateScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { VolunteerScreen } from './components/VolunteerScreen';
import { AuthModal } from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { authService } from './services/authService';
import { submitVolunteerApplication } from './services/rbacService';
import { mobileService } from './services/mobileService';

// Dynamic Lazy Imports for Large Modals (Reduces initial bundle size & improves mobile load times)
const ProjectDetailModal = lazy(() => import('./components/ProjectDetailModal').then(m => ({ default: m.ProjectDetailModal })));
const ReceiptModal = lazy(() => import('./components/ReceiptModal').then(m => ({ default: m.ReceiptModal })));
const AppreciationLetterModal = lazy(() => import('./components/AppreciationLetterModal').then(m => ({ default: m.AppreciationLetterModal })));
const CertificateModal = lazy(() => import('./components/CertificateModal').then(m => ({ default: m.CertificateModal })));
const AdminCertificateControlModal = lazy(() => import('./components/AdminCertificateControlModal').then(m => ({ default: m.AdminCertificateControlModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const NotificationWebhooksModal = lazy(() => import('./components/NotificationWebhooksModal').then(m => ({ default: m.NotificationWebhooksModal })));
const AdminApprovalsModal = lazy(() => import('./components/AdminApprovalsModal').then(m => ({ default: m.AdminApprovalsModal })));
const AdminContentStudioModal = lazy(() => import('./components/AdminContentStudioModal').then(m => ({ default: m.AdminContentStudioModal })));
const AdminProjectModal = lazy(() => import('./components/AdminProjectModal').then(m => ({ default: m.AdminProjectModal })));
const AdminStatsModal = lazy(() => import('./components/AdminStatsModal').then(m => ({ default: m.AdminStatsModal })));
const AdminStoryModal = lazy(() => import('./components/AdminStoryModal').then(m => ({ default: m.AdminStoryModal })));
const WorkAssignmentModal = lazy(() => import('./components/WorkAssignmentModal').then(m => ({ default: m.WorkAssignmentModal })));
const CorporateCSRModal = lazy(() => import('./components/CorporateCSRModal').then(m => ({ default: m.CorporateCSRModal })));
const TaxExemptionModal = lazy(() => import('./components/TaxExemptionModal').then(m => ({ default: m.TaxExemptionModal })));
const OfflineSyncModal = lazy(() => import('./components/OfflineSyncModal').then(m => ({ default: m.OfflineSyncModal })));
const ContentApprovalPipelineModal = lazy(() => import('./components/ContentApprovalPipelineModal').then(m => ({ default: m.ContentApprovalPipelineModal })));
const AdminUserManagementModal = lazy(() => import('./components/AdminUserManagementModal').then(m => ({ default: m.AdminUserManagementModal })));
const AboutOrganizationModal = lazy(() => import('./components/AboutOrganizationModal').then(m => ({ default: m.AboutOrganizationModal })));
const LegalPoliciesModal = lazy(() => import('./components/LegalPoliciesModal').then(m => ({ default: m.LegalPoliciesModal })));

const ModalLoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-3 max-w-xs w-full text-center">
      <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Loading module...</span>
    </div>
  </div>
);

const WORK_ASSIGNMENTS_STORAGE_KEY = 'helps_ngo_work_assignments_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [previousTab, setPreviousTab] = useState<TabType>('home');

  // Default to Guest/Public Mode when no one is manually signed in (or retrieve persisted session)
  const [user, setUser] = useState<UserProfile>(() => {
    return authService.getActiveSession();
  });
  
  // Dynamic Content Data States (Admin can modify in real-time)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [stats, setStats] = useState<OrgStats>(INITIAL_ORG_STATS);
  const [stories, setStories] = useState<ImpactStory[]>(IMPACT_STORIES);
  const [dispatches, setDispatches] = useState<FieldDispatch[]>(INITIAL_FIELD_DISPATCHES);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  
  // Work & Task Assignments State (Admin -> Management -> Volunteer)
  const [workAssignments, setWorkAssignments] = useState<WorkAssignment[]>(() => {
    try {
      const stored = localStorage.getItem(WORK_ASSIGNMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: item?.id || `TASK-${100 + idx}`,
            title: item?.title || 'Operational Field Task',
            description: item?.description || 'Follow standard operations protocol and maintain field safety.',
            category: item?.category || 'Education',
            priority: item?.priority || 'Medium',
            deadline: item?.deadline || '2026-08-25',
            location: item?.location || 'Regional Field Unit',
            estimatedHours: Number(item?.estimatedHours) || 4,
            assignedBy: {
              name: item?.assignedBy?.name || 'Amarjeet Kumar',
              email: item?.assignedBy?.email || 'amar@helpsngo.in',
              role: item?.assignedBy?.role || 'admin',
              title: item?.assignedBy?.title || 'Trustee & National Director',
              avatar: item?.assignedBy?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
            },
            assignedTo: {
              name: item?.assignedTo?.name || 'Rahul Verma',
              email: item?.assignedTo?.email || 'volunteer@helpsngo.in',
              role: item?.assignedTo?.role || 'volunteer',
              title: item?.assignedTo?.title || 'Field Volunteer',
              avatar: item?.assignedTo?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
            },
            status: item?.status || 'pending',
            checklist: Array.isArray(item?.checklist) ? item.checklist : [
              { id: 'c1', text: 'Coordinate with local ground coordinator upon arrival', completed: false },
              { id: 'c2', text: 'Execute service tasks according to NGO safety SOPs', completed: false }
            ],
            completionNotes: item?.completionNotes || '',
            submittedHours: item?.submittedHours,
            completedAt: item?.completedAt,
            reviewedBy: item?.reviewedBy,
            createdAt: item?.createdAt || '2026-08-15',
            updatedAt: item?.updatedAt
          }));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_WORK_ASSIGNMENTS;
  });

  // Standard Modals state
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<Project | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<DonationRecord | null>(null);
  const [viewingAppreciationLetter, setViewingAppreciationLetter] = useState<DonationRecord | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isWorkAssignmentModalOpen, setIsWorkAssignmentModalOpen] = useState<boolean>(false);
  const [isCSRModalOpen, setIsCSRModalOpen] = useState<boolean>(false);
  const [isTaxCertModalOpen, setIsTaxCertModalOpen] = useState<boolean>(false);
  const [isWebhooksModalOpen, setIsWebhooksModalOpen] = useState<boolean>(false);
  const [isOfflineSyncModalOpen, setIsOfflineSyncModalOpen] = useState<boolean>(false);
  const [isAboutOrgOpen, setIsAboutOrgOpen] = useState<boolean>(false);

  // Admin Modals state
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState<boolean>(false);
  const [isAdminApprovalsOpen, setIsAdminApprovalsOpen] = useState<boolean>(false);
  const [isAdminProjectModalOpen, setIsAdminProjectModalOpen] = useState<boolean>(false);
  const [adminProjectToEdit, setAdminProjectToEdit] = useState<Project | null>(null);
  const [isAdminStatsModalOpen, setIsAdminStatsModalOpen] = useState<boolean>(false);
  const [isAdminStoryModalOpen, setIsAdminStoryModalOpen] = useState<boolean>(false);
  const [adminStoryToEdit, setAdminStoryToEdit] = useState<ImpactStory | null>(null);
  const [isApprovalPipelineOpen, setIsApprovalPipelineOpen] = useState<boolean>(false);
  const [isAdminCertControlOpen, setIsAdminCertControlOpen] = useState<boolean>(false);
  const [isAdminUserManagementOpen, setIsAdminUserManagementOpen] = useState<boolean>(false);
  const [selectedCertForDetail, setSelectedCertForDetail] = useState<string | undefined>(undefined);
  const [isLegalPoliciesOpen, setIsLegalPoliciesOpen] = useState<boolean>(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('privacy-policy');

  // Initialize native Capacitor & mobile runtime features (status bar, splash screen, hardware back button)
  useEffect(() => {
    mobileService.initMobileApp();
  }, []);

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const isManagement = user.role === 'management' || user.role === 'program_manager';
  const isPendingReview = user.volunteerApplicationStatus === 'pending_review';
  const isApplicant = user.role === 'volunteer_applicant' || isPendingReview;
  const isVolunteer = (user.role === 'volunteer') && !isApplicant && !isPendingReview;
  const isStaff = isAdmin || isManagement;
  const pendingApprovalsCount = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending').length;
  const pendingTasksCount = isStaff
    ? workAssignments.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length
    : isVolunteer
    ? workAssignments.filter(t => (t.status !== 'completed' && t.status !== 'cancelled') && (
        (t.assignedTo?.email || '').toLowerCase() === (user.email || '').toLowerCase() ||
        (t.assignedTo?.name || '').toLowerCase() === (user.name || '').toLowerCase()
      )).length
    : 0;

  const handleContentPublished = (item: ContentSubmissionItem) => {
    if (item.contentType === 'project') {
      const target = item.contentData?.targetAmount || 750000;
      const newProj: Project = {
        id: item.id,
        title: item.title,
        category: (item.category as any) || 'Education',
        description: item.summary,
        longDescription: item.contentData?.description || item.summary,
        raisedAmount: 0,
        targetAmount: target,
        percentage: 0,
        image: item.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80',
        location: item.contentData?.location || 'Pan-India',
        beneficiariesCount: '500+ Children',
        updates: [],
        urgency: 'Normal'
      };
      setProjects((prev) => [newProj, ...prev]);
    } else if (item.contentType === 'story') {
      const newStory: ImpactStory = {
        id: item.id,
        name: item.contentData?.protagonist || item.title,
        role: 'Beneficiary Story',
        category: (item.category as any) || 'Education',
        location: item.contentData?.location || 'Field Unit',
        quote: item.contentData?.quote || item.summary,
        story: item.summary,
        impactMetric: '100% Verified',
        image: item.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      };
      setStories((prev) => [newStory, ...prev]);
    }
  };

  // Volunteer Task Deadline Check via Web Notification API (Alerts when due within 24 hours)
  useEffect(() => {
    if (!workAssignments || workAssignments.length === 0) return;
    if (user.role !== 'volunteer' || user.role === 'volunteer_applicant' || user.volunteerApplicationStatus === 'pending_review') return;

    const notifiedStorageKey = 'helps_ngo_alerted_deadlines';
    let alertedIds: string[] = [];
    try {
      const stored = sessionStorage.getItem(notifiedStorageKey);
      if (stored) {
        alertedIds = JSON.parse(stored);
      }
    } catch {
      alertedIds = [];
    }

    const now = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    // Filter tasks due within the next 24 hours that are not yet completed
    const upcomingVolunteerTasks = workAssignments.filter((task) => {
      if (task.status === 'completed' || task.status === 'cancelled') return false;
      if (alertedIds.includes(task.id)) return false;

      // Check if user is a volunteer or task is assigned to a volunteer
      const isVolunteerTask = task.assignedTo.role === 'volunteer';
      const isAssignedToCurrentUser = user.email ? task.assignedTo.email === user.email : true;
      if (!isVolunteerTask && user.role === 'volunteer' && !isAssignedToCurrentUser) return false;

      // Parse task deadline timestamp
      const deadlineDate = new Date(task.deadline);
      const deadlineTime = deadlineDate.getTime();
      if (isNaN(deadlineTime)) return false;

      const diff = deadlineTime - now;
      // Triggers if deadline is within the next 24 hours (or due today)
      return diff > -12 * 3600 * 1000 && diff <= twentyFourHoursMs;
    });

    if (upcomingVolunteerTasks.length === 0) return;

    const sendDeadlineAlerts = () => {
      upcomingVolunteerTasks.forEach((task) => {
        try {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Helps NGO: Task Deadline Approaching ⏳', {
              body: `Volunteer Task "${task.title}" is due within 24 hours (${task.deadline}) at ${task.location}. Please complete your assigned checklist.`,
              icon: '/manifest.webmanifest'
            });
          }
          alertedIds.push(task.id);
        } catch {
          // notification dispatch handled safely
        }
      });

      try {
        sessionStorage.setItem(notifiedStorageKey, JSON.stringify(alertedIds));
      } catch {}
    };

    // Request permission & dispatch notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        sendDeadlineAlerts();
      } else if (Notification.permission === 'default') {
        Notification.requestPermission()
          .then((permission) => {
            if (permission === 'granted') {
              sendDeadlineAlerts();
            }
          })
          .catch(() => {});
      }
    }
  }, [workAssignments, user.email, user.role, user.volunteerApplicationStatus]);

  const handleAddWorkAssignment = (newAssignment: WorkAssignment) => {
    if (user.role === 'volunteer_applicant' || user.volunteerApplicationStatus === 'pending_review' || (!isAdmin && !isManagement)) {
      return;
    }
    setWorkAssignments((prev) => {
      const updated = [newAssignment, ...prev];
      localStorage.setItem(WORK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateWorkAssignment = (updatedAssignment: WorkAssignment) => {
    // Verify user role is active volunteer (and not volunteer_applicant / pending_review) or admin/management
    if (user.role === 'volunteer_applicant' || user.volunteerApplicationStatus === 'pending_review' || (user.role !== 'volunteer' && !isAdmin && !isManagement)) {
      return;
    }
    setWorkAssignments((prev) => {
      const updated = prev.map((t) => (t.id === updatedAssignment.id ? updatedAssignment : t));
      localStorage.setItem(WORK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteWorkAssignment = (taskId: string) => {
    if (!isAdmin && !isManagement) return;
    setWorkAssignments((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      localStorage.setItem(WORK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleNavigate = (tab: TabType) => {
    setPreviousTab(currentTab);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProjectForDetail(project);
  };

  const handleDonateToProject = (project: Project) => {
    setSelectedProjectForDonation(project);
    handleNavigate('donate');
  };

  const handleDonationSuccess = (newDonation: DonationRecord) => {
    setDonations([newDonation, ...donations]);
    setUser((prev) => {
      const updated = {
        ...prev,
        totalContribution: prev.totalContribution + newDonation.amount
      };
      if (prev.role !== 'guest') {
        authService.saveActiveSession(updated);
      }
      return updated;
    });

    // If donating to a specific project, update raised amount
    if (selectedProjectForDonation) {
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p.id === selectedProjectForDonation.id) {
            const newRaised = p.raisedAmount + newDonation.amount;
            const newPct = Math.min(Math.round((newRaised / p.targetAmount) * 100), 100);
            return {
              ...p,
              raisedAmount: newRaised,
              percentage: newPct
            };
          }
          return p;
        })
      );
    }

    // Open receipt modal for celebration & display pending status
    setViewingReceipt(newDonation);
  };

  const handleVolunteerSubmit = (data: VolunteerFormData) => {
    // Record application in Trustee Review Queue
    submitVolunteerApplication({
      applicantName: data.name || user.name || 'Volunteer Applicant',
      email: data.email || user.email || 'applicant@helpsngo.in',
      phone: data.phone || user.phone || '+91 98765 43210',
      skills: data.skills || 'Education & Community Outreach',
      availability: data.availability || 'Flexible Field Directives',
      location: data.location || 'Local Community Chapter',
      idProofType: 'Aadhaar',
      idProofNumberMasked: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
      emergencyContactName: 'Primary Emergency Contact',
      emergencyContactPhone: data.phone || '+91 98765 43210',
      assignedSquad: 'General Field Volunteer Squad (Pending Verification)'
    });

    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        role: 'volunteer_applicant',
        volunteerApplicationStatus: 'pending_review',
        volunteerHours: 0,
        volunteerLevel: 'Volunteer Applicant (Pending Review)',
        title: 'Volunteer Applicant (Awaiting Trustee Verification)'
      };
      if (prev.role !== 'guest') {
        authService.saveActiveSession(updated);
      }
      return updated;
    });
  };

  const handleLogVolunteerHours = (hours: number, _activity: string) => {
    if (user.role === 'volunteer_applicant' || user.volunteerApplicationStatus === 'pending_review') {
      return;
    }
    setUser((prev) => {
      const newHours = prev.volunteerHours + hours;
      const updated: UserProfile = {
        ...prev,
        volunteerHours: newHours,
        volunteerLevel: newHours >= 100 ? 'National Social Leader' : newHours >= 50 ? 'Platinum Field Volunteer' : 'Active Field Volunteer'
      };
      if (prev.role !== 'guest') {
        authService.saveActiveSession(updated);
      }
      return updated;
    });
  };

  const handleSetUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (updatedUser.role === 'guest') {
      authService.signOut();
    } else {
      authService.saveActiveSession(updatedUser);
    }
  };

  const handleLogout = () => {
    authService.signOut(user);
    handleSetUser(GUEST_USER);
  };

  // --- 80G Tax Exemption & Badge Approval Handlers ---
  const handleApproveDonation = (donationId: string) => {
    if (!isAdmin) return;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          return {
            ...d,
            approvalStatus: 'approved',
            approvedAt: nowStr,
            approvedBy: user.name || 'Amarjeet Kumar (Trustee & National Director)',
            rejectionReason: undefined
          };
        }
        return d;
      })
    );

    if (viewingReceipt?.id === donationId) {
      setViewingReceipt((prev) => prev ? ({
        ...prev,
        approvalStatus: 'approved',
        approvedAt: nowStr,
        approvedBy: user.name || 'Amarjeet Kumar (Trustee & National Director)',
        rejectionReason: undefined
      }) : null);
    }
  };

  const handleRejectDonation = (donationId: string, reason: string = 'PAN verification required') => {
    if (!isAdmin) return;
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          return {
            ...d,
            approvalStatus: 'rejected',
            rejectionReason: reason
          };
        }
        return d;
      })
    );

    if (viewingReceipt?.id === donationId) {
      setViewingReceipt((prev) => prev ? ({
        ...prev,
        approvalStatus: 'rejected',
        rejectionReason: reason
      }) : null);
    }
  };

  // --- Admin Content Mutation Handlers (Gated to Admin only) ---
  const handleOpenEditProject = (project: Project | null) => {
    if (!isAdmin) {
      setIsAuthOpen(true);
      return;
    }
    setAdminProjectToEdit(project);
    setIsAdminProjectModalOpen(true);
  };

  const handleSaveProject = (savedProject: Project) => {
    if (!isAdmin) return;
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === savedProject.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
      }
      return [savedProject, ...prev];
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (!isAdmin) return;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectForDetail?.id === projectId) {
      setSelectedProjectForDetail(null);
    }
  };

  const handleSaveStats = (newStats: OrgStats) => {
    if (!isAdmin) return;
    setStats(newStats);
  };

  const handleOpenEditStory = (story: ImpactStory | null) => {
    if (!isAdmin) {
      setIsAuthOpen(true);
      return;
    }
    setAdminStoryToEdit(story);
    setIsAdminStoryModalOpen(true);
  };

  const handleSaveStory = (savedStory: ImpactStory) => {
    if (!isAdmin) return;
    setStories((prev) => {
      const exists = prev.some((s) => s.id === savedStory.id);
      if (exists) {
        return prev.map((s) => (s.id === savedStory.id ? savedStory : s));
      }
      return [savedStory, ...prev];
    });
  };

  const handleDeleteStory = (storyId: string) => {
    if (!isAdmin) return;
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleSaveDispatch = (savedDispatch: FieldDispatch) => {
    if (!isAdmin) return;
    setDispatches((prev) => {
      const exists = prev.some((d) => d.id === savedDispatch.id);
      if (exists) {
        return prev.map((d) => (d.id === savedDispatch.id ? savedDispatch : d));
      }
      return [savedDispatch, ...prev];
    });
  };

  const handleDeleteDispatch = (dispatchId: string) => {
    if (!isAdmin) return;
    setDispatches((prev) => prev.filter((d) => d.id !== dispatchId));
  };

  return (
    <AuthProvider currentUser={user} onUserChange={handleSetUser}>
      <DeviceFrame>
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onBack={() => handleNavigate(previousTab || 'home')}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          pendingApprovalsCount={pendingApprovalsCount}
          onOpenApprovals={() => setIsAdminApprovalsOpen(true)}
          onOpenWorkAssignments={() => setIsWorkAssignmentModalOpen(true)}
          pendingTasksCount={pendingTasksCount}
          onOpenWebhooks={() => setIsWebhooksModalOpen(true)}
          onOpenOfflineSync={() => setIsOfflineSyncModalOpen(true)}
        />

        {/* Top Navigation Bar */}
        <TopNav
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          user={user}
        />

        {/* Screen Content */}
        <div className="flex-1">
          {currentTab === 'home' && (
            <HomeScreen
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
              onDonateToProject={handleDonateToProject}
              projects={projects}
              missions={MISSIONS}
              stories={stories}
              stats={stats}
              dispatches={dispatches}
              user={user}
              donations={donations}
              onOpenAdminStudio={() => isAdmin && setIsAdminStudioOpen(true)}
              onEditProject={isAdmin ? handleOpenEditProject : undefined}
              onEditStats={isAdmin ? () => setIsAdminStatsModalOpen(true) : undefined}
              onEditStory={isAdmin ? handleOpenEditStory : undefined}
              onAddNewStory={isAdmin ? () => handleOpenEditStory(null) : undefined}
              onOpenCorporateCSR={() => setIsCSRModalOpen(true)}
              onOpenTaxCert={() => setIsTaxCertModalOpen(true)}
              onOpenWebhooks={() => setIsWebhooksModalOpen(true)}
              onOpenAboutOrg={() => setIsAboutOrgOpen(true)}
              onOpenLegalPolicies={(policyId) => {
                if (policyId) setSelectedPolicyId(policyId);
                setIsLegalPoliciesOpen(true);
              }}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsScreen
              projects={projects}
              onSelectProject={handleSelectProject}
              onDonateToProject={handleDonateToProject}
              user={user}
              onEditProject={isAdmin ? handleOpenEditProject : undefined}
              onAddNewProject={isAdmin ? () => handleOpenEditProject(null) : undefined}
            />
          )}

          {currentTab === 'donate' && (
            <DonateScreen
              selectedProject={selectedProjectForDonation}
              projects={projects}
              onDonationSuccess={handleDonationSuccess}
              userCurrency={user.currency}
              defaultEmail={user.role !== 'guest' ? user.email : ''}
              defaultName={user.role !== 'guest' ? user.name : ''}
              onSelectProjectChange={(proj) => setSelectedProjectForDonation(proj)}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              user={user}
              donations={donations}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onViewReceipt={(donation) => setViewingReceipt(donation)}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenAdminStudio={isAdmin ? () => setIsAdminStudioOpen(true) : undefined}
              onOpenApprovals={isAdmin ? () => setIsAdminApprovalsOpen(true) : undefined}
              onAddNewProject={isAdmin ? () => handleOpenEditProject(null) : undefined}
              onEditStats={isAdmin ? () => setIsAdminStatsModalOpen(true) : undefined}
              workAssignments={workAssignments}
              onOpenWorkAssignments={() => setIsWorkAssignmentModalOpen(true)}
              onOpenWebhooks={() => setIsWebhooksModalOpen(true)}
              onOpenApprovalPipeline={() => setIsApprovalPipelineOpen(true)}
              onOpenAdminCertControl={isAdmin ? () => setIsAdminCertControlOpen(true) : undefined}
              onOpenUserManagement={isAdmin ? () => setIsAdminUserManagementOpen(true) : undefined}
              onOpenAboutOrg={() => setIsAboutOrgOpen(true)}
              onOpenTaxCert={() => setIsTaxCertModalOpen(true)}
              onOpenCorporateCSR={() => setIsCSRModalOpen(true)}
            />
          )}

          {currentTab === 'volunteer' && (
            <VolunteerScreen
              user={user}
              onSubmitSuccess={handleVolunteerSubmit}
              onNavigateHome={() => handleNavigate('home')}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onOpenAdminStudio={isAdmin ? () => setIsAdminStudioOpen(true) : undefined}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogHours={handleLogVolunteerHours}
              workAssignments={workAssignments}
              onOpenWorkAssignments={() => setIsWorkAssignmentModalOpen(true)}
              onUpdateAssignment={handleUpdateWorkAssignment}
            />
          )}
        </div>

      {/* Dynamic Lazy Loaded Modals & Overlay Modules */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {/* Project Detail Modal */}
        {selectedProjectForDetail && (
          <ProjectDetailModal
            project={selectedProjectForDetail}
            onClose={() => setSelectedProjectForDetail(null)}
            onDonate={(p) => {
              setSelectedProjectForDetail(null);
              handleDonateToProject(p);
            }}
            user={user}
            onEditProject={isAdmin ? handleOpenEditProject : undefined}
          />
        )}

        {/* 80G Tax Exemption Receipt Modal */}
        {viewingReceipt && (
          <ReceiptModal
            donation={viewingReceipt}
            user={user}
            onClose={() => setViewingReceipt(null)}
            onApproveDonation={handleApproveDonation}
            onOpenForm10BE={() => setIsTaxCertModalOpen(true)}
            onOpenAppreciationLetter={(d) => setViewingAppreciationLetter(d)}
          />
        )}

        {/* Formal Signed Letter of Appreciation Modal */}
        {viewingAppreciationLetter && (
          <AppreciationLetterModal
            donation={viewingAppreciationLetter}
            user={user}
            isOpen={!!viewingAppreciationLetter}
            onClose={() => setViewingAppreciationLetter(null)}
            onViewImpactUpdate={() => {
              setViewingAppreciationLetter(null);
              handleNavigate('donate');
            }}
          />
        )}

        {/* Volunteer & Honors Certificate Modal / Secure Vault */}
        {isCertificateOpen && (
          <CertificateModal
            user={user}
            onClose={() => {
              setIsCertificateOpen(false);
              setSelectedCertForDetail(undefined);
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAdminStudio={isAdmin ? () => setIsAdminCertControlOpen(true) : undefined}
            initialCertificateId={selectedCertForDetail}
          />
        )}

        {/* Admin Certificate Authority & Batch Control Studio Modal */}
        {isAdmin && isAdminCertControlOpen && (
          <AdminCertificateControlModal
            isOpen={isAdminCertControlOpen}
            onClose={() => setIsAdminCertControlOpen(false)}
            currentUser={user}
            onPreviewCertificate={(cert) => {
              setSelectedCertForDetail(cert.id);
              setIsCertificateOpen(true);
            }}
          />
        )}

        {/* Account Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            user={user}
            onUpdateUser={(updated) => handleSetUser(updated)}
            onClose={() => setIsSettingsOpen(false)}
            onOpenWebhooks={() => {
              setIsSettingsOpen(false);
              setIsWebhooksModalOpen(true);
            }}
          />
        )}

        {/* Automated Donor WhatsApp & Mail Notification Webhooks Hub */}
        {isWebhooksModalOpen && (
          <NotificationWebhooksModal
            isOpen={isWebhooksModalOpen}
            onClose={() => setIsWebhooksModalOpen(false)}
          />
        )}

        {/* Credential-Based Authentication & Account Creation Modal */}
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            currentUser={user}
            onSelectUser={handleSetUser}
          />
        )}

        {/* Admin 80G Tax Exemption & Badge Approvals Queue Modal */}
        {isAdmin && isAdminApprovalsOpen && (
          <AdminApprovalsModal
            isOpen={isAdminApprovalsOpen}
            onClose={() => setIsAdminApprovalsOpen(false)}
            donations={donations}
            onApproveDonation={handleApproveDonation}
            onRejectDonation={handleRejectDonation}
            onViewReceipt={(donation) => setViewingReceipt(donation)}
          />
        )}

        {/* Admin Content Studio Hub Modal */}
        {isAdmin && isAdminStudioOpen && (
          <AdminContentStudioModal
            isOpen={isAdminStudioOpen}
            onClose={() => setIsAdminStudioOpen(false)}
            projects={projects}
            stats={stats}
            stories={stories}
            dispatches={dispatches}
            donations={donations}
            onOpenEditProject={handleOpenEditProject}
            onOpenEditStats={() => {
              setIsAdminStudioOpen(false);
              setIsAdminStatsModalOpen(true);
            }}
            onOpenEditStory={handleOpenEditStory}
            onSaveDispatch={handleSaveDispatch}
            onDeleteDispatch={handleDeleteDispatch}
            onDeleteProject={handleDeleteProject}
            onDeleteStory={handleDeleteStory}
            onNavigate={(t) => {
              setIsAdminStudioOpen(false);
              handleNavigate(t);
            }}
            onApproveDonation={handleApproveDonation}
            onRejectDonation={handleRejectDonation}
            onViewReceipt={(donation) => setViewingReceipt(donation)}
          />
        )}

        {/* Admin Program & Media Editor Modal (with local image file upload) */}
        {isAdminProjectModalOpen && (
          <AdminProjectModal
            isOpen={isAdminProjectModalOpen}
            onClose={() => {
              setIsAdminProjectModalOpen(false);
              setAdminProjectToEdit(null);
            }}
            projectToEdit={adminProjectToEdit}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            user={user}
          />
        )}

        {/* Admin Org Metrics & Mission Text Modal */}
        {isAdmin && isAdminStatsModalOpen && (
          <AdminStatsModal
            isOpen={isAdminStatsModalOpen}
            onClose={() => setIsAdminStatsModalOpen(false)}
            stats={stats}
            onSaveStats={handleSaveStats}
          />
        )}

        {/* Admin Impact Story & Beneficiary Modal (with local image file upload) */}
        {isAdminStoryModalOpen && (
          <AdminStoryModal
            isOpen={isAdminStoryModalOpen}
            onClose={() => {
              setIsAdminStoryModalOpen(false);
              setAdminStoryToEdit(null);
            }}
            storyToEdit={adminStoryToEdit}
            onSaveStory={handleSaveStory}
            onDeleteStory={handleDeleteStory}
            user={user}
          />
        )}

        {/* Field Work & Operations Assignment Hub (Admin -> Management -> Volunteer Hierarchy) */}
        {isWorkAssignmentModalOpen && (
          <WorkAssignmentModal
            isOpen={isWorkAssignmentModalOpen}
            onClose={() => setIsWorkAssignmentModalOpen(false)}
            currentUser={user}
            user={user}
            assignments={workAssignments}
            tasks={workAssignments}
            onAddAssignment={handleAddWorkAssignment}
            onUpdateAssignment={handleUpdateWorkAssignment}
            onDeleteAssignment={handleDeleteWorkAssignment}
            onAddTask={handleAddWorkAssignment}
            onUpdateTask={handleUpdateWorkAssignment}
            onDeleteTask={handleDeleteWorkAssignment}
            onLogVolunteerHours={handleLogVolunteerHours}
          />
        )}

        {/* Corporate CSR & Institutional Giving Suite Modal */}
        {isCSRModalOpen && (
          <CorporateCSRModal
            isOpen={isCSRModalOpen}
            onClose={() => setIsCSRModalOpen(false)}
            user={user}
            projects={projects}
          />
        )}

        {/* Instant Form 10BE / Section 80G Statutory Tax Exemption Certificate Modal */}
        {isTaxCertModalOpen && (
          <TaxExemptionModal
            isOpen={isTaxCertModalOpen}
            onClose={() => setIsTaxCertModalOpen(false)}
            user={user}
            donation={donations[0] || null}
          />
        )}

        {/* Village Offline Field Sync & PWA Service Worker Console Modal */}
        {isOfflineSyncModalOpen && (
          <OfflineSyncModal
            isOpen={isOfflineSyncModalOpen}
            onClose={() => setIsOfflineSyncModalOpen(false)}
          />
        )}

        {/* Content & Work Approval Workflow Pipeline Modal (Admin -> Mgmt -> Volunteer -> Public) */}
        {isApprovalPipelineOpen && (
          <ContentApprovalPipelineModal
            isOpen={isApprovalPipelineOpen}
            onClose={() => setIsApprovalPipelineOpen(false)}
            currentUser={user}
            onContentPublished={handleContentPublished}
          />
        )}

        {/* Admin User Management & Role Promotion Console Modal (Admin Only) */}
        {isAdmin && isAdminUserManagementOpen && (
          <AdminUserManagementModal
            isOpen={isAdminUserManagementOpen}
            onClose={() => setIsAdminUserManagementOpen(false)}
            currentUser={user}
            onUserUpdated={(updatedUser) => {
              if (user.id === updatedUser.id || user.email.toLowerCase() === updatedUser.email.toLowerCase()) {
                handleSetUser(updatedUser);
              }
            }}
          />
        )}

        {/* Official Organization Profile, Mission & Statutory Transparency Modal */}
        {isAboutOrgOpen && (
          <AboutOrganizationModal
            isOpen={isAboutOrgOpen}
            onClose={() => setIsAboutOrgOpen(false)}
            onNavigateDonate={() => {
              setIsAboutOrgOpen(false);
              handleNavigate('donate');
            }}
            onNavigateVolunteer={() => {
              setIsAboutOrgOpen(false);
              handleNavigate('volunteer');
            }}
          />
        )}

        {/* Statutory Legal Governance & 8 NGO Statutory Policies Modal */}
        {isLegalPoliciesOpen && (
          <LegalPoliciesModal
            isOpen={isLegalPoliciesOpen}
            onClose={() => setIsLegalPoliciesOpen(false)}
            initialPolicyId={selectedPolicyId}
          />
        )}
      </Suspense>
      </DeviceFrame>
    </AuthProvider>
  );
}
