import React, { useState, useMemo } from 'react';
import { 
  WorkAssignment, 
  UserProfile, 
  TaskPriority, 
  TaskStatus, 
  TaskCategory, 
  TeamMember 
} from '../types';
import { 
  TEAM_MANAGEMENT_ROSTER, 
  TEAM_VOLUNTEER_ROSTER 
} from '../data/mockData';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  ShieldCheck, 
  HeartHandshake, 
  Search, 
  Sparkles, 
  Send, 
  CheckSquare, 
  Square, 
  Check, 
  Edit3, 
  Trash2, 
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Droplets,
  Utensils,
  Truck,
  FileCheck,
  Users,
  Award,
  Layers,
  Printer,
  ChevronRight,
  CheckCircle,
  ShieldAlert,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskCertificateModal } from './TaskCertificateModal';
import { OfflineSyncBadge } from './OfflineSyncBadge';
import { OfflineSyncModal } from './OfflineSyncModal';
import { queueOfflineAction } from '../services/offlineSyncService';

interface WorkAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  user?: UserProfile;
  assignments?: WorkAssignment[];
  tasks?: WorkAssignment[];
  onAddAssignment?: (assignment: WorkAssignment) => void;
  onAddTask?: (assignment: WorkAssignment) => void;
  onUpdateAssignment?: (assignment: WorkAssignment) => void;
  onUpdateTask?: (assignment: WorkAssignment) => void;
  onDeleteAssignment?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onLogVolunteerHours?: (hours: number, activity: string) => void;
}

// Preset NGO Task Templates for 1-click dispatch
const TASK_TEMPLATES: {
  label: string;
  category: TaskCategory;
  priority: TaskPriority;
  targetRole: 'management' | 'volunteer';
  title: string;
  description: string;
  location: string;
  estimatedHours: number;
  badgeName: string;
  checklist: string[];
}[] = [
  {
    label: '💧 Solar Borewell TDS Audit',
    category: 'Water',
    priority: 'Urgent',
    targetRole: 'management',
    title: 'Audit & TDS Quality Test for 4 Solar Borewells in Bundi District',
    description: 'Perform rigorous water quality TDS testing, verify solar inverter wiring, and handover safe drinking water stations to local Panchayat heads.',
    location: 'Bundi Rural Cluster, Rajasthan',
    estimatedHours: 12,
    badgeName: '💧 Water Security Sentinel',
    checklist: [
      'Calibrate digital 0-TDS water sensor against control standard',
      'Inspect 3KW solar panel arrays and water pump motor',
      'Collect Panchayat signing deed with village Sarpanch',
      'Upload GPS-tagged installation photographs to NGO cloud'
    ]
  },
  {
    label: '📚 STEM Tablet & Router Setup',
    category: 'Education',
    priority: 'High',
    targetRole: 'volunteer',
    title: 'Deliver 120 STEM Tablet Kits & Setup Router at Alwar School',
    description: 'Transport sealed digital tablet packages, install offline Khan Academy Hindi modules, and conduct 2 demo sessions for Grade 6-8 students.',
    location: 'Govt. Senior Secondary School, Alwar',
    estimatedHours: 6,
    badgeName: '📚 STEM Education Luminary',
    checklist: [
      'Verify serial numbers of 120 tablets and protective cases',
      'Distribute student passcodes and log attendance ledger',
      'Conduct hands-on digital science orientation demo',
      'Take photo documentation with Headmaster and students'
    ]
  },
  {
    label: '🍲 Mega-Kitchen Meal Dispatch',
    category: 'Hunger',
    priority: 'High',
    targetRole: 'volunteer',
    title: 'Coordinate Mega-Kitchen Meal Packing & Thermal Food Safety',
    description: 'Supervise clean preparation of 2,500 khichdi & nutrient meal packets. Ensure temperature check >65°C and dispatch via delivery e-rickshaws to 5 slum clusters.',
    location: 'Patna Central Mega-Kitchen Hub',
    estimatedHours: 5,
    badgeName: '🍲 Zero-Hunger Hero',
    checklist: [
      'Sanitation inspection of cooking vats and cooking staff gloves',
      'Pack 2,500 sealed thermal foil meal boxes with bananas',
      'Measure sample meal temperature (>65°C required)',
      'Handover route batches to cluster distribution drivers'
    ]
  },
  {
    label: '🩺 Tribal Health Screening Van',
    category: 'Healthcare',
    priority: 'High',
    targetRole: 'management',
    title: 'Mobile Clinic Triage & Digital Prescription Logging',
    description: 'Assist Dr. Arvind with blood pressure, hemoglobin, and blood sugar tests for 150+ tribal women in Ranchi sector.',
    location: 'Ranchi Sector 4 Mobile Health Van, Jharkhand',
    estimatedHours: 8,
    badgeName: '🩺 Healthcare Guardian',
    checklist: [
      'Set up mobile diagnostic counter and calibrate glucometers',
      'Register 150+ patient records into offline triage tablet',
      'Distribute 1-month iron & folic acid supplement kits',
      'Flag high-risk cases for district hospital specialist referral'
    ]
  },
  {
    label: '📦 Winter Relief & Blanket Logistics',
    category: 'Logistics',
    priority: 'Medium',
    targetRole: 'volunteer',
    title: 'Distribute 500 High-Grade Woolen Blankets to Night Shelters',
    description: 'Verify warehouse inventory count, load distribution mini-trucks, and hand out blankets to homeless residents across designated night shelters.',
    location: 'Jaipur Railway Station & Night Shelter Corridors',
    estimatedHours: 4,
    badgeName: '📦 Emergency Logistics Specialist',
    checklist: [
      'Unload and inspect 500 wool blankets at staging hub',
      'Coordinate security and token distribution with shelter supervisors',
      'Distribute blankets directly to verified residents',
      'Collect beneficiary signature sheets for audit file'
    ]
  }
];

export const WorkAssignmentModal: React.FC<WorkAssignmentModalProps> = ({
  isOpen,
  onClose,
  currentUser: propCurrentUser,
  user: propUser,
  assignments: propAssignments,
  tasks: propTasks,
  onAddAssignment: propOnAddAssignment,
  onAddTask: propOnAddTask,
  onUpdateAssignment: propOnUpdateAssignment,
  onUpdateTask: propOnUpdateTask,
  onDeleteAssignment: propOnDeleteAssignment,
  onDeleteTask: propOnDeleteTask,
  onLogVolunteerHours
}) => {
  const currentUser: UserProfile = propCurrentUser || propUser || {
    name: 'Amarjeet Kumar',
    email: 'amar@helpsngo.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    totalContribution: 0,
    volunteerHours: 0,
    volunteerLevel: 'Gold',
    volunteerNextTierHours: 50,
    phone: '',
    taxId: '',
    currency: 'INR'
  };

  const rawAssignments = propAssignments || propTasks || [];
  const assignments: WorkAssignment[] = useMemo(() => {
    if (!Array.isArray(rawAssignments)) return [];
    return rawAssignments.map((item, idx) => ({
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
  }, [rawAssignments]);

  const onAddAssignment = propOnAddAssignment || propOnAddTask || (() => {});
  const onUpdateAssignment = propOnUpdateAssignment || propOnUpdateTask || (() => {});
  const onDeleteAssignment = propOnDeleteAssignment || propOnDeleteTask;

  const isApplicant = currentUser?.role === 'volunteer_applicant' || currentUser?.volunteerApplicationStatus === 'pending_review';
  const isVolunteer = (currentUser?.role === 'volunteer') && !isApplicant;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const isManagement = currentUser?.role === 'management' || currentUser?.role === 'program_manager';
  const canAssign = (isAdmin || isManagement) && !isApplicant;

  // View state
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [filterTab, setFilterTab] = useState<'all' | 'assigned_to_me' | 'assigned_by_me' | 'admin_to_mgmt' | 'admin_to_vol' | 'mgmt_to_vol' | 'in_progress' | 'completed'>(
    isVolunteer ? 'assigned_to_me' : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Form State for creating / editing assignment
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<'management' | 'volunteer'>(
    isAdmin ? 'management' : 'volunteer'
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string>('mgmt-1');
  const [customAssigneeName, setCustomAssigneeName] = useState<string>('');
  const [customAssigneeEmail, setCustomAssigneeEmail] = useState<string>('');
  const [customAssigneeTitle, setCustomAssigneeTitle] = useState<string>('');
  
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Education');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('High');
  const [taskDeadline, setTaskDeadline] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [taskLocation, setTaskLocation] = useState<string>('Jaipur Central Hub');
  const [estimatedHours, setEstimatedHours] = useState<number>(6);
  
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Coordinate with local ground coordinator upon arrival', completed: false },
    { id: '2', text: 'Execute service tasks according to NGO safety SOPs', completed: false },
    { id: '3', text: 'Capture geo-tagged photo documentation of completion', completed: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState<string>('');

  // Completion submission modal state
  const [completingTask, setCompletingTask] = useState<WorkAssignment | null>(null);
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [actualHoursSpent, setActualHoursSpent] = useState<number>(6);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Certificate Modal State
  const [certificateTask, setCertificateTask] = useState<WorkAssignment | null>(null);
  const [isOfflineSyncModalOpen, setIsOfflineSyncModalOpen] = useState<boolean>(false);
  const [rolePerspective, setRolePerspective] = useState<'auto' | 'management' | 'volunteer' | 'donor'>('auto');

  // Effective role based on logged in user or testing perspective
  const effectiveRole = rolePerspective === 'auto' ? (currentUser?.role || 'volunteer') : rolePerspective;
  const isEffectiveManagement = effectiveRole === 'admin' || effectiveRole === 'management';
  const isEffectiveVolunteer = effectiveRole === 'volunteer';
  const isEffectiveDonor = effectiveRole === 'donor';

  // Filter available team roster based on role
  const availableMembers = targetType === 'management' ? TEAM_MANAGEMENT_ROSTER : TEAM_VOLUNTEER_ROSTER;

  const handleApplyTemplate = (template: typeof TASK_TEMPLATES[0]) => {
    setTaskTitle(template.title);
    setTaskDesc(template.description);
    setTaskCategory(template.category);
    setTaskPriority(template.priority);
    setTaskLocation(template.location);
    setEstimatedHours(template.estimatedHours);
    setTargetType(template.targetRole);
    setSelectedMemberId(template.targetRole === 'management' ? 'mgmt-1' : 'vol-1');
    setChecklistItems(template.checklist.map((item, idx) => ({
      id: `tmpl-${idx + 1}`,
      text: item,
      completed: false
    })));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([
      ...checklistItems,
      { id: Date.now().toString(), text: newChecklistText.trim(), completed: false }
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  const handleStartEdit = (task: WorkAssignment) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setTaskLocation(task.location);
    setEstimatedHours(task.estimatedHours);
    setTargetType(task.assignedTo?.role === 'management' ? 'management' : 'volunteer');
    
    // Check if assignee is in roster
    const allRoster = [...TEAM_MANAGEMENT_ROSTER, ...TEAM_VOLUNTEER_ROSTER];
    const match = allRoster.find(m => m.email.toLowerCase() === (task.assignedTo?.email || '').toLowerCase());
    if (match) {
      setSelectedMemberId(match.id);
    } else {
      setSelectedMemberId('custom');
      setCustomAssigneeName(task.assignedTo?.name || '');
      setCustomAssigneeEmail(task.assignedTo?.email || '');
      setCustomAssigneeTitle(task.assignedTo?.title || '');
    }

    setChecklistItems(task.checklist || []);
    setActiveView('edit');
  };

  const handleCreateOrUpdateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    let assigneeName = '';
    let assigneeEmail = '';
    let assigneeRole: 'management' | 'volunteer' = targetType;
    let assigneeTitle = '';
    let assigneeAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    if (selectedMemberId === 'custom') {
      assigneeName = customAssigneeName.trim() || 'Assigned Field Staff';
      assigneeEmail = customAssigneeEmail.trim() || 'field.ops@helpsngo.in';
      assigneeTitle = customAssigneeTitle.trim() || (targetType === 'management' ? 'Management Lead' : 'Field Volunteer');
    } else {
      const found = availableMembers.find(m => m.id === selectedMemberId) || availableMembers[0];
      assigneeName = found.name;
      assigneeEmail = found.email;
      assigneeRole = found.role;
      assigneeTitle = found.title;
      assigneeAvatar = found.avatar;
    }

    if (editingTaskId) {
      // Update existing
      const existing = assignments.find(t => t.id === editingTaskId);
      const updatedAssignment: WorkAssignment = {
        ...(existing || {}),
        id: editingTaskId,
        title: taskTitle.trim(),
        description: taskDesc.trim() || 'Follow standard operations protocol and maintain field safety.',
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline,
        location: taskLocation.trim() || 'Regional Field Unit',
        estimatedHours: Number(estimatedHours) || 4,
        assignedBy: existing?.assignedBy || {
          name: currentUser.name,
          email: currentUser.email,
          role: isAdmin ? 'admin' : 'management',
          title: currentUser.title || (isAdmin ? 'Trustee & National Director' : 'Field Operations Manager'),
          avatar: currentUser.avatar
        },
        assignedTo: {
          name: assigneeName,
          email: assigneeEmail,
          role: assigneeRole,
          title: assigneeTitle,
          avatar: assigneeAvatar
        },
        status: existing?.status || 'pending',
        checklist: checklistItems,
        updatedAt: new Date().toISOString().split('T')[0],
        createdAt: existing?.createdAt || new Date().toISOString().split('T')[0]
      };

      onUpdateAssignment(updatedAssignment);
      setSuccessToast(`Task #${editingTaskId} successfully updated!`);
      setTimeout(() => {
        setSuccessToast(null);
        setActiveView('list');
        setEditingTaskId(null);
      }, 1400);
    } else {
      // Create new
      const newAssignment: WorkAssignment = {
        id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        title: taskTitle.trim(),
        description: taskDesc.trim() || 'Follow standard operations protocol and maintain field safety.',
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline,
        location: taskLocation.trim() || 'Regional Field Unit',
        estimatedHours: Number(estimatedHours) || 4,
        assignedBy: {
          name: currentUser.name,
          email: currentUser.email,
          role: isAdmin ? 'admin' : 'management',
          title: currentUser.title || (isAdmin ? 'Trustee & National Director' : 'Field Operations Manager'),
          avatar: currentUser.avatar
        },
        assignedTo: {
          name: assigneeName,
          email: assigneeEmail,
          role: assigneeRole,
          title: assigneeTitle,
          avatar: assigneeAvatar
        },
        status: 'pending',
        checklist: checklistItems,
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddAssignment(newAssignment);
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } catch {
        // safe
      }

      setSuccessToast(`Dispatched "${newAssignment.title}" to ${newAssignment.assignedTo.name}!`);
      setTimeout(() => {
        setSuccessToast(null);
        setActiveView('list');
        setTaskTitle('');
        setTaskDesc('');
      }, 1500);
    }
  };

  // Toggle checklist item
  const handleToggleChecklist = (task: WorkAssignment, checkId: string) => {
    if (isApplicant) {
      setSuccessToast(`Authorization Restriction: Volunteer applicants cannot modify field task deliverables until Trustee verification is completed.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const userEmail = (currentUser?.email || '').toLowerCase();
    const userName = (currentUser?.name || '').toLowerCase();
    const isAssignedToMe = (
      (task.assignedTo?.email || '').toLowerCase() === userEmail ||
      (task.assignedTo?.name || '').toLowerCase() === userName
    );
    const canModify = isAdmin || isManagement || isAssignedToMe;

    if (!canModify) {
      setSuccessToast(`Authorization Notice: Deliverable checklists can only be checked off by the assigned volunteer (${task.assignedTo?.name || 'Assignee'}) or Management.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    if (!task.checklist) return;
    const targetItem = task.checklist.find(i => i.id === checkId);
    const updatedChecklist = task.checklist.map(item => 
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    const updatedTask: WorkAssignment = {
      ...task,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateAssignment(updatedTask);

    // Queue offline action for PWA sync
    queueOfflineAction(
      'CHECKLIST_TOGGLE',
      task.id,
      task.title,
      {
        checklistId: checkId,
        itemText: targetItem?.text || 'Checklist Step',
        completed: !targetItem?.completed,
        updatedBy: currentUser.name
      },
      task.location
    );
  };

  // Quick Status Transition Handler
  const handleStatusChange = (task: WorkAssignment, newStatus: TaskStatus) => {
    if (isApplicant) {
      setSuccessToast(`Authorization Restriction: Task status changes are locked for pending volunteer applicants.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const userEmail = (currentUser?.email || '').toLowerCase();
    const userName = (currentUser?.name || '').toLowerCase();
    const isAssignedToMe = (
      (task.assignedTo?.email || '').toLowerCase() === userEmail ||
      (task.assignedTo?.name || '').toLowerCase() === userName
    );
    const canModify = isAdmin || isManagement || isAssignedToMe;

    if (!canModify) {
      setSuccessToast(`Authorization Notice: You can only update the status of tasks assigned to you.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const updatedTask: WorkAssignment = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    if (newStatus === 'completed' && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date().toISOString().split('T')[0];
    }
    onUpdateAssignment(updatedTask);

    // Queue offline status update
    queueOfflineAction(
      'TASK_STATUS_UPDATE',
      task.id,
      task.title,
      {
        oldStatus: task.status,
        newStatus,
        updatedBy: currentUser.name
      },
      task.location
    );

    setSuccessToast(`Task status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`);
    setTimeout(() => setSuccessToast(null), 1800);
  };

  // Submit completion proof & log volunteer hours
  const handleCompleteTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTask) return;

    if (isApplicant) {
      setSuccessToast(`Authorization Restriction: Volunteer applicants cannot submit task completions.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const userEmail = (currentUser?.email || '').toLowerCase();
    const userName = (currentUser?.name || '').toLowerCase();
    const isAssignedToMe = (
      (completingTask.assignedTo?.email || '').toLowerCase() === userEmail ||
      (completingTask.assignedTo?.name || '').toLowerCase() === userName
    );
    const canModify = isAdmin || isManagement || isAssignedToMe;

    if (!canModify) {
      setSuccessToast(`Authorization Notice: You can only submit completion for tasks assigned to you.`);
      setTimeout(() => setSuccessToast(null), 3000);
      return;
    }

    const hours = Number(actualHoursSpent) || completingTask.estimatedHours;
    const updatedTask: WorkAssignment = {
      ...completingTask,
      status: 'completed',
      completionNotes: completionNotes.trim() || 'Work completed successfully according to checklist specifications and verified on ground.',
      submittedHours: hours,
      completedAt: new Date().toISOString().split('T')[0],
      reviewedBy: `${currentUser.name} (${currentUser.role ? currentUser.role.toUpperCase() : 'ADMIN'})`
    };

    onUpdateAssignment(updatedTask);

    // Queue offline completion proof & hour logging
    queueOfflineAction(
      'TASK_COMPLETION_SUBMIT',
      completingTask.id,
      completingTask.title,
      {
        hours,
        completionNotes: updatedTask.completionNotes,
        submittedBy: currentUser.name,
        volunteerEmail: currentUser.email,
        villageLocation: completingTask.location
      },
      completingTask.location
    );

    if (onLogVolunteerHours && hours > 0) {
      onLogVolunteerHours(hours, `Completed: ${completingTask.title}`);
    }

    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } catch {
      // safe
    }

    const completedRef = updatedTask;
    setCompletingTask(null);
    setCompletionNotes('');
    setSuccessToast(`🎉 Task marked completed! ${hours} hours credited & honors badge awarded.`);
    setTimeout(() => {
      setSuccessToast(null);
      // Offer immediate certificate view
      setCertificateTask(completedRef);
    }, 1800);
  };

  // Filtering assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(task => {
      if (!task) return false;
      const userEmail = (currentUser?.email || '').toLowerCase();
      const taskAssignedToEmail = (task.assignedTo?.email || '').toLowerCase();
      const taskAssignedByEmail = (task.assignedBy?.email || '').toLowerCase();
      const taskAssignedByRole = task.assignedBy?.role || 'admin';
      const taskAssignedToRole = task.assignedTo?.role || 'volunteer';
      
      // Role & Hierarchy Tab Filter
      if (filterTab === 'assigned_to_me') {
        if (!taskAssignedToEmail || taskAssignedToEmail !== userEmail) return false;
      } else if (filterTab === 'assigned_by_me') {
        if (!taskAssignedByEmail || taskAssignedByEmail !== userEmail) return false;
      } else if (filterTab === 'admin_to_mgmt') {
        if (taskAssignedByRole !== 'admin' || taskAssignedToRole !== 'management') return false;
      } else if (filterTab === 'admin_to_vol') {
        if (taskAssignedByRole !== 'admin' || taskAssignedToRole !== 'volunteer') return false;
      } else if (filterTab === 'mgmt_to_vol') {
        if (taskAssignedByRole !== 'management' || taskAssignedToRole !== 'volunteer') return false;
      } else if (filterTab === 'in_progress') {
        if (task.status !== 'in_progress') return false;
      } else if (filterTab === 'completed') {
        if (task.status !== 'completed') return false;
      }

      // Status selector
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && (task.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (task.title || '').toLowerCase().includes(q);
        const matchDesc = (task.description || '').toLowerCase().includes(q);
        const matchAssignee = (task.assignedTo?.name || '').toLowerCase().includes(q);
        const matchAssigner = (task.assignedBy?.name || '').toLowerCase().includes(q);
        const matchLocation = (task.location || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchAssignee && !matchAssigner && !matchLocation) {
          return false;
        }
      }

      return true;
    });
  }, [assignments, filterTab, statusFilter, priorityFilter, categoryFilter, searchQuery, currentUser]);

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'Education':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-500" />;
      case 'Healthcare':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Hunger':
        return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
      case 'Logistics':
        return <Truck className="w-3.5 h-3.5 text-purple-500" />;
      case 'Audit':
        return <FileCheck className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Users className="w-3.5 h-3.5 text-orange-500" />;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">🔥 Urgent</span>;
      case 'High':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">⚡ High</span>;
      case 'Medium':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">Medium</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <FileCheck className="w-3 h-3 text-purple-600" />
            <span>Under Review</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span>⏳ Pending Acceptance</span>
          </span>
        );
    }
  };

  const getHierarchyBadge = (task: WorkAssignment) => {
    const byRole = task.assignedBy?.role || 'admin';
    const toRole = task.assignedTo?.role || 'volunteer';
    if (byRole === 'admin' && toRole === 'management') {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
          <span>👑 Admin</span>
          <ArrowRight className="w-2.5 h-2.5 text-purple-600" />
          <span>👔 Management</span>
        </span>
      );
    }
    if (byRole === 'admin' && toRole === 'volunteer') {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
          <span>👑 Admin</span>
          <ArrowRight className="w-2.5 h-2.5 text-blue-600" />
          <span>🤝 Volunteer</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
        <span>👔 Management</span>
        <ArrowRight className="w-2.5 h-2.5 text-indigo-600" />
        <span>🤝 Volunteer</span>
      </span>
    );
  };

  const getBadgeNameForCategory = (category: string) => {
    switch (category) {
      case 'Water': return '💧 Water Security Sentinel';
      case 'Education': return '📚 STEM Education Luminary';
      case 'Healthcare': return '🩺 Healthcare Guardian';
      case 'Hunger': return '🍲 Zero-Hunger Hero';
      case 'Logistics': return '📦 Emergency Logistics Specialist';
      default: return '🛡️ Field Excellence Badge';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2rem] max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-950 via-zinc-900 to-gray-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  NGO Field Sync & Operations Hub
                </span>
                <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {effectiveRole === 'admin' ? 'Trustee Admin Access' : effectiveRole === 'management' ? 'Management Access' : effectiveRole === 'donor' ? 'Donor Transparency View' : 'Volunteer Portal'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Work & Task Assignments Command Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PWA Offline Sync Badge */}
            <OfflineSyncBadge onClick={() => setIsOfflineSyncModalOpen(true)} />

            {/* Role Profile Perspective Switcher */}
            <div className="hidden md:flex items-center bg-white/10 p-0.5 rounded-full border border-white/15 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setRolePerspective('management')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  effectiveRole === 'admin' || effectiveRole === 'management'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="View from Management & Trustee perspective"
              >
                👔 Mgmt
              </button>
              <button
                type="button"
                onClick={() => setRolePerspective('volunteer')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  effectiveRole === 'volunteer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="View from Field Volunteer perspective"
              >
                🤝 Volunteer
              </button>
              <button
                type="button"
                onClick={() => setRolePerspective('donor')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  effectiveRole === 'donor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white'
                }`}
                title="View from Donor Impact transparency perspective"
              >
                💖 Donor
              </button>
            </div>

            {canAssign && (
              <button
                type="button"
                id="tab-toggle-create-assignment"
                onClick={() => {
                  if (activeView === 'create' || activeView === 'edit') {
                    setActiveView('list');
                    setEditingTaskId(null);
                  } else {
                    setActiveView('create');
                    setEditingTaskId(null);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView !== 'list'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-xs'
                }`}
              >
                {activeView !== 'list' ? (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Task Roster</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign New Work</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* APPLICANT ACCESS GATE: Locked Until Trustee Board Verification */}
          {isApplicant ? (
            <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[11px] font-black text-amber-900 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Statutory Trustee Review In Progress</span>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  Task Command Center Locked
                </h3>
                <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                  Your volunteer profile for <strong>{currentUser?.name}</strong> ({currentUser?.email}) is pending statutory compliance verification by the Board of Trustees. Field tasks cannot be modified or marked complete until your profile is authorized.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3 max-w-lg mx-auto shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Applicant Verification Status
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Applicant</span>
                    <span className="font-bold text-gray-900">{currentUser?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Designated Role</span>
                    <span className="font-bold text-amber-700">Volunteer Applicant</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Trustee Queue</span>
                    <span className="font-bold text-amber-600">Pending Background Check</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Field Directives</span>
                    <span className="font-bold text-gray-500">0 Tasks (Restricted)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Close Command Center
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* VIEW 1: CREATE / EDIT WORK FORM */}
              {(activeView === 'create' || activeView === 'edit') && canAssign && (
            <div className="animate-fadeIn max-w-3xl mx-auto space-y-5">
              {/* Preset Template Dispatcher */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-extrabold text-orange-950 uppercase tracking-wider">
                      1-Click Rapid Dispatch Templates
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-800 font-semibold">
                    Click any preset to prefill realistic NGO field directives
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {TASK_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="bg-white hover:bg-orange-600 hover:text-white text-gray-800 border border-orange-200 hover:border-orange-600 text-xs font-bold px-3 py-1.5 rounded-full transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigning Authority Card */}
              <div className="bg-zinc-900 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-orange-500 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                      Assigning Authority
                    </span>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {currentUser.name}
                    </h4>
                    <p className="text-[11px] text-zinc-300">
                      {currentUser.title || (isAdmin ? 'Trustee & National Director' : 'Field Operations Manager')} • {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    {isAdmin ? 'Admin Direct Dispatch' : 'Management Dispatch'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCreateOrUpdateAssignmentSubmit} className="space-y-4">
                {/* 1. Target Audience Hierarchy Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    1. Who is this work being assigned to? *
                  </label>
                  {isAdmin ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        id="target-audience-mgmt"
                        onClick={() => { setTargetType('management'); setSelectedMemberId('mgmt-1'); }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          targetType === 'management'
                            ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500/20 text-purple-900 font-bold shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black">Management Team Staff</div>
                          <p className="text-[10px] text-gray-500 font-normal">Field Operations Managers, Clinical Leads</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        id="target-audience-vol"
                        onClick={() => { setTargetType('volunteer'); setSelectedMemberId('vol-1'); }}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          targetType === 'volunteer'
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 font-bold shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black">Volunteer Team Member</div>
                          <p className="text-[10px] text-gray-500 font-normal">Direct Ground, Camp & Logistics Volunteers</p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-indigo-900">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold">Management Delegating Directly to Field Volunteers</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-200 px-2.5 py-0.5 rounded-full">Volunteer Roster</span>
                    </div>
                  )}
                </div>

                {/* 2. Specific Assignee Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    2. Select Active Team Member or Volunteer *
                  </label>
                  <select
                    id="assignee-select-dropdown"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden transition-all"
                  >
                    {availableMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.title}) — {member.location}
                      </option>
                    ))}
                    <option value="custom">➕ Enter Custom Email / Field Coordinator</option>
                  </select>
                </div>

                {/* If custom assignee is selected */}
                {selectedMemberId === 'custom' && (
                  <div className="p-3.5 bg-gray-50 border border-gray-300 rounded-2xl space-y-2.5 animate-fadeIn">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                      Custom Field Assignee Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={customAssigneeName}
                        onChange={(e) => setCustomAssigneeName(e.target.value)}
                        className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={customAssigneeEmail}
                        onChange={(e) => setCustomAssigneeEmail(e.target.value)}
                        className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={customAssigneeTitle}
                        onChange={(e) => setCustomAssigneeTitle(e.target.value)}
                        className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Task Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    3. Task / Assignment Headline *
                  </label>
                  <input
                    type="text"
                    id="task-title-input"
                    required
                    placeholder="e.g., Deliver 150 STEM Tablets & Train School Teachers"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden transition-all"
                  />
                </div>

                {/* 4. Task Category, Priority, Hours, and Deadline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block mb-1">
                      Category
                    </label>
                    <select
                      id="task-category-select"
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900"
                    >
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Water">Clean Water</option>
                      <option value="Hunger">Hunger Relief</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Audit">Audit & Quality</option>
                      <option value="Field Relief">Field Relief</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block mb-1">
                      Priority
                    </label>
                    <select
                      id="task-priority-select"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900"
                    >
                      <option value="Urgent">🔥 Urgent</option>
                      <option value="High">⚡ High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block mb-1">
                      Est. Hours
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={80}
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block mb-1">
                      Deadline Date
                    </label>
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* 5. Location */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    4. Field Location / Operational Site *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g., Bundi Solar Borewell Cluster 3, Rajasthan"
                      value={taskLocation}
                      onChange={(e) => setTaskLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-900"
                    />
                  </div>
                </div>

                {/* 6. Description / Operational Instructions */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    5. Detailed Work Scope & Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific field requirements, equipment needed, safety protocols, and key deliverables..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-normal text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                </div>

                {/* 7. Actionable Checklist Items */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                    6. Actionable Field Deliverables / Checklist
                  </label>
                  <div className="space-y-1.5">
                    {checklistItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                        <span className="font-semibold text-gray-800 truncate">
                          {idx + 1}. {item.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add specific checklist deliverable..."
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklistItem(); } }}
                        className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklistItem}
                        className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setActiveView('list'); setEditingTaskId(null); }}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-create-task-btn"
                    className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{editingTaskId ? 'Update Assignment' : 'Dispatch & Assign Work'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 2: TASK LIST & ROSTER */}
          {activeView === 'list' && (
            <div className="space-y-4">
              {/* Role Perspective Context Banner */}
              <div className={`p-3.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 transition-all ${
                isEffectiveDonor
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : isEffectiveVolunteer
                  ? 'bg-blue-50 border-blue-300 text-blue-950'
                  : 'bg-purple-50 border-purple-300 text-purple-950'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs ${
                    isEffectiveDonor ? 'bg-emerald-600' : isEffectiveVolunteer ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {isEffectiveDonor ? '💖' : isEffectiveVolunteer ? '🤝' : '👔'}
                  </div>
                  <div>
                    <strong className="block font-black uppercase text-[11px] tracking-wide">
                      {isEffectiveDonor 
                        ? 'Donor & Philanthropist Impact Stream' 
                        : isEffectiveVolunteer 
                        ? 'Volunteer Field Agent Directives' 
                        : 'Management Operational Command & Audit Hub'}
                    </strong>
                    <span className="text-[11px] opacity-90">
                      {isEffectiveDonor
                        ? 'Live transparency feed of village projects, medical camps, and food drives funded by your donations.'
                        : isEffectiveVolunteer
                        ? 'Interactive offline-ready checklists, village hour logger, and field completion certifications.'
                        : 'Oversee full hierarchical task dispatch, volunteer checklists, and village operations.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1 hidden sm:inline">Role View:</span>
                  <button
                    type="button"
                    onClick={() => setRolePerspective('management')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      effectiveRole === 'admin' || effectiveRole === 'management'
                        ? 'bg-purple-700 text-white shadow-2xs'
                        : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    👔 Mgmt
                  </button>
                  <button
                    type="button"
                    onClick={() => setRolePerspective('volunteer')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      effectiveRole === 'volunteer'
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    🤝 Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRolePerspective('donor')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      effectiveRole === 'donor'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    💖 Donor
                  </button>
                </div>
              </div>

              {/* Hierarchy Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-3">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Tasks ({assignments.length})
                </button>

                <button
                  onClick={() => setFilterTab('assigned_to_me')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterTab === 'assigned_to_me'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                  }`}
                >
                  <span>Assigned to Me</span>
                  <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full">
                    {assignments.filter(t => (t.assignedTo?.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase()).length}
                  </span>
                </button>

                {canAssign && (
                  <button
                    onClick={() => setFilterTab('assigned_by_me')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterTab === 'assigned_by_me'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <span>Assigned by Me</span>
                    <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full">
                      {assignments.filter(t => (t.assignedBy?.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase()).length}
                    </span>
                  </button>
                )}

                <div className="h-4 w-px bg-gray-300 hidden sm:block mx-1" />

                <button
                  onClick={() => setFilterTab('admin_to_mgmt')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'admin_to_mgmt'
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👑 Admin ➔ 👔 Mgmt
                </button>

                <button
                  onClick={() => setFilterTab('admin_to_vol')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'admin_to_vol'
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👑 Admin ➔ 🤝 Vol
                </button>

                <button
                  onClick={() => setFilterTab('mgmt_to_vol')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'mgmt_to_vol'
                      ? 'bg-indigo-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👔 Mgmt ➔ 🤝 Vol
                </button>

                <button
                  onClick={() => setFilterTab('completed')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'completed'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  🎓 Completed & Certified ({assignments.filter(t => t.status === 'completed').length})
                </button>
              </div>

              {/* Quick Search & Multi-Criteria Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by task title, location, or team member..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white outline-hidden"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="under_review">📋 Under Review</option>
                  <option value="completed">✅ Completed</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <option value="all">All Domains</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Water">Clean Water</option>
                  <option value="Hunger">Hunger Relief</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              {/* Assignment Cards List */}
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-800">No tasks found matching your filter</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {canAssign 
                      ? 'You can dispatch a new work assignment to Management or Volunteers.'
                      : 'Check back later or explore upcoming volunteer drives on the volunteer screen.'}
                  </p>
                  {canAssign && (
                    <button
                      type="button"
                      onClick={() => setActiveView('create')}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider cursor-pointer"
                    >
                      Assign New Work Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {filteredAssignments.map((task) => {
                    const userEmail = (currentUser?.email || '').toLowerCase();
                    const userName = (currentUser?.name || '').toLowerCase();
                    const isAssignedToCurrent = (task.assignedTo?.email || '').toLowerCase() === userEmail || (task.assignedTo?.name || '').toLowerCase() === userName;
                    const isAssignedByCurrent = (task.assignedBy?.email || '').toLowerCase() === userEmail || (task.assignedBy?.name || '').toLowerCase() === userName;
                    const canModifyThisTask = (isAdmin || isManagement || isAssignedToCurrent) && !isApplicant;
                    const completedChecklistCount = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
                    const totalChecklistCount = task.checklist ? task.checklist.length : 0;
                    const isCompleted = task.status === 'completed';

                    return (
                      <div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-3.5 bg-white ${
                          isCompleted
                            ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                            : task.priority === 'Urgent'
                            ? 'border-rose-200 shadow-xs'
                            : 'border-gray-200 shadow-xs hover:border-orange-200'
                        }`}
                      >
                        {/* Top Meta Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {getHierarchyBadge(task)}
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                              {getCategoryIcon(task.category)}
                              <span>{task.category}</span>
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(task.status)}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm sm:text-base font-black text-gray-900 leading-snug">
                              {task.title}
                            </h3>
                            {canAssign && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(task)}
                                className="text-gray-400 hover:text-orange-600 p-1 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                                title="Edit this assignment"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Assignor & Assignee Profile Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {/* Assigner */}
                          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200/80 flex items-center gap-2.5">
                            <img
                              src={task.assignedBy?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'}
                              alt={task.assignedBy?.name || 'Assigner'}
                              className="w-8 h-8 rounded-full object-cover border border-purple-400 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 block">
                                Assigned By ({task.assignedBy?.role ? task.assignedBy.role.toUpperCase() : 'ADMIN'})
                              </span>
                              <p className="text-xs font-bold text-gray-900 truncate">{task.assignedBy?.name || 'Director'}</p>
                              <p className="text-[10px] text-gray-500 truncate">{task.assignedBy?.title || 'Management'}</p>
                            </div>
                          </div>

                          {/* Assignee */}
                          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200/80 flex items-center gap-2.5">
                            <img
                              src={task.assignedTo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                              alt={task.assignedTo?.name || 'Assignee'}
                              className="w-8 h-8 rounded-full object-cover border border-orange-400 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 block">
                                Assigned To ({task.assignedTo?.role ? task.assignedTo.role.toUpperCase() : 'VOLUNTEER'})
                              </span>
                              <p className="text-xs font-bold text-gray-900 truncate">{task.assignedTo?.name || 'Team Member'}</p>
                              <p className="text-[10px] text-gray-500 truncate">{task.assignedTo?.title || 'Field Volunteer'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location, Deadline, Hours & Checklist Progress */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              <span>{task.location}</span>
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              <span>Due {task.deadline}</span>
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>{task.estimatedHours} hrs</span>
                            </span>
                          </div>

                          {totalChecklistCount > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase text-gray-500">
                                Deliverables: {completedChecklistCount}/{totalChecklistCount}
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full transition-all"
                                  style={{ width: `${(completedChecklistCount / totalChecklistCount) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Checklist Details (Interactive Deliverables) */}
                        {task.checklist && task.checklist.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                              Required Field Deliverables (Click to check off):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {task.checklist.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => handleToggleChecklist(task, item.id)}
                                  className={`p-2 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                                    !canModifyThisTask ? 'opacity-80 cursor-default' : 'cursor-pointer'
                                  } ${
                                    item.completed
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                  }`}
                                  title={!canModifyThisTask ? `Assigned to ${task.assignedTo?.name || 'Assignee'}` : 'Click to toggle'}
                                >
                                  {item.completed ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  )}
                                  <span className={item.completed ? 'line-through text-emerald-800' : ''}>
                                    {item.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Completed Task Badge & Certification Ribbon */}
                        {isCompleted && (
                          <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 animate-fadeIn">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
                                <Award className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black uppercase text-amber-800">
                                    Badge Earned:
                                  </span>
                                  <span className="text-xs font-black text-zinc-900">
                                    {getBadgeNameForCategory(task.category)}
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-600">
                                  {task.submittedHours || task.estimatedHours} verified hours credited • Completed on {task.completedAt || task.updatedAt || 'Recent'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setCertificateTask(task)}
                              className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-300" />
                              <span>View Certificate</span>
                            </button>
                          </div>
                        )}

                        {/* Completion Notes if completed */}
                        {task.completionNotes && (
                          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
                            <span className="text-[10px] font-black uppercase text-emerald-800 block">
                              Verified Field Completion Proof
                            </span>
                            <p className="text-emerald-900">{task.completionNotes}</p>
                            {task.reviewedBy && (
                              <p className="text-[10px] text-emerald-700 font-bold pt-0.5">
                                Verified by: {task.reviewedBy}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Toolbar based on User Role & Task Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                          {/* Quick Status Dropdown for Admin/Management */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-mono">
                              #{task.id}
                            </span>

                            {canAssign && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Status:</span>
                                <select
                                  value={task.status}
                                  onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-gray-300 outline-hidden cursor-pointer"
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="in_progress">⚡ In Progress</option>
                                  <option value="under_review">📋 Under Review</option>
                                  <option value="completed">✅ Completed</option>
                                  <option value="cancelled">❌ Cancelled</option>
                                </select>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Non-authorized volunteer badge */}
                            {!canModifyThisTask && !isCompleted && (
                              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5">
                                <Lock className="w-3 h-3 text-gray-400" />
                                <span>Assigned to {task.assignedTo?.name || 'Assignee'}</span>
                              </span>
                            )}

                            {/* Accept & Start - Authorized Assignee or Admin/Mgmt */}
                            {canModifyThisTask && task.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(task, 'in_progress')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Start Duty</span>
                              </button>
                            )}

                            {/* Submit Completion - Authorized Assignee or Admin/Mgmt */}
                            {canModifyThisTask && task.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCompletingTask(task);
                                  setActualHoursSpent(task.estimatedHours);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Submit Completion & Award Badges</span>
                              </button>
                            )}

                            {/* Direct Certificate View for completed tasks */}
                            {isCompleted && (
                              <button
                                type="button"
                                onClick={() => setCertificateTask(task)}
                                className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Certificate</span>
                              </button>
                            )}

                            {/* Delete button for Admin / Assigner */}
                            {(isAdmin || isAssignedByCurrent) && onDeleteAssignment && (
                              <button
                                type="button"
                                onClick={() => onDeleteAssignment(task.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Helps NGO Governance Matrix • Certified 80G Service Delivery
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold uppercase text-xs tracking-wider text-gray-800 cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>

      {/* Completion Submission Mini-Dialog */}
      {completingTask && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-[2rem] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Submit Work Completion
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 line-clamp-1">
                    {completingTask.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setCompletingTask(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCompleteTaskSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Actual Service Hours Spent *
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  required
                  value={actualHoursSpent}
                  onChange={(e) => setActualHoursSpent(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  These hours will be officially credited to the volunteer profile ledger and certificate.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Field Observations & Completion Proof Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail results achieved, number of beneficiaries served, or items delivered..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Honors Badge & Official Certificate will be issued</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Completing this task automatically unlocks the <strong>{getBadgeNameForCategory(completingTask.category)}</strong> and generates a verified certificate.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingTask(null)}
                  className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify, Credit & Issue Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Certificate Modal */}
      {certificateTask && (
        <TaskCertificateModal
          task={certificateTask}
          currentUser={currentUser}
          onClose={() => setCertificateTask(null)}
        />
      )}

      {/* Village Offline Ready PWA Field Sync Modal */}
      <OfflineSyncModal
        isOpen={isOfflineSyncModalOpen}
        onClose={() => setIsOfflineSyncModalOpen(false)}
      />
    </div>
  );
};
