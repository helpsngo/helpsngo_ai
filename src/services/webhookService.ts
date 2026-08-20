import { WebhookConfig, WebhookDeliveryLog, WebhookEventType, DonorNotificationPreferences } from '../types';

const WEBHOOK_CONFIGS_STORAGE_KEY = 'helps_ngo_webhook_configs_v1';
const WEBHOOK_LOGS_STORAGE_KEY = 'helps_ngo_webhook_delivery_logs_v1';
const DONOR_PREFS_STORAGE_KEY = 'helps_ngo_donor_notification_preferences_v1';

export const INITIAL_WEBHOOK_CONFIGS: WebhookConfig[] = [
  {
    id: 'wh-whatsapp-cloud',
    name: 'WhatsApp Business Cloud API',
    channel: 'whatsapp',
    endpointUrl: 'https://graph.facebook.com/v20.0/helpsngo_official/messages',
    secretKey: 'whsec_wa_live_9a7b8c2d1e0f',
    enabled: true,
    events: ['donation.completed', 'tax_certificate.issued', 'quarterly.impact_digest', 'disaster.field_alert'],
    templateId: 'helps_ngo_instant_receipt_v2',
    description: 'Instant WhatsApp confirmation with green verified checkmark, 80G tax receipt PDF & quarterly impact videos.',
    lastTriggeredAt: '12 minutes ago',
    successRate: 99.4
  },
  {
    id: 'wh-email-resend',
    name: 'Statutory Email Notification Webhook',
    channel: 'email',
    endpointUrl: 'https://api.resend.com/emails/webhooks/helps-ngo-statutory',
    secretKey: 'whsec_email_live_4d5e6f7a8b9c',
    enabled: true,
    events: ['donation.completed', 'tax_certificate.issued', 'quarterly.impact_digest'],
    templateId: 'tpl_80g_form10be_statutory',
    description: 'Direct high-deliverability dispatch of official Form 10BE certificates and quarterly progress dossiers.',
    lastTriggeredAt: '28 minutes ago',
    successRate: 100.0
  },
  {
    id: 'wh-custom-zapier',
    name: 'Corporate CSR & Field Ops Webhook',
    channel: 'custom_webhook',
    endpointUrl: 'https://hooks.zapier.com/hooks/catch/948271/helps_ngo_ops',
    secretKey: 'whsec_custom_live_3c2b1a0f9e8d',
    enabled: true,
    events: ['donation.completed', 'volunteer.assignment_created', 'disaster.field_alert'],
    description: 'Real-time JSON webhook stream to ERP, Salesforce CSR connector, and Slack volunteer dispatch channel.',
    lastTriggeredAt: '1 hour ago',
    successRate: 98.8
  }
];

export const INITIAL_DELIVERY_LOGS: WebhookDeliveryLog[] = [
  {
    id: 'log-wa-9021',
    webhookId: 'wh-whatsapp-cloud',
    channel: 'whatsapp',
    event: 'donation.completed',
    recipient: '+91 98765 43210',
    recipientName: 'Alex Johnson',
    timestamp: 'Today at 09:42 AM',
    status: 'delivered',
    httpStatusCode: 200,
    latencyMs: 142,
    retryCount: 0,
    responseMessage: 'Message delivered to recipient WhatsApp handset. Read receipt received.',
    payload: {
      event: 'donation.completed',
      donorName: 'Alex Johnson',
      amount: 25000,
      currency: '₹',
      receiptNo: 'REC-80G-2026-9042',
      projectTitle: 'Barmer Solar Borewells & Clean Water Hubs',
      form10beUrl: 'https://helpsngo.in/verify/80g/REC-80G-2026-9042',
      section80gExemption: '50% Deductible u/s 80G(5)(vi)'
    }
  },
  {
    id: 'log-email-8941',
    webhookId: 'wh-email-resend',
    channel: 'email',
    event: 'tax_certificate.issued',
    recipient: 'donor.alex@example.com',
    recipientName: 'Alex Johnson',
    timestamp: 'Today at 09:42 AM',
    status: 'delivered',
    httpStatusCode: 200,
    latencyMs: 310,
    retryCount: 0,
    responseMessage: 'SMTP 250 OK: Form 10BE PDF attached and DKIM signed.',
    payload: {
      event: 'tax_certificate.issued',
      pan: 'ABCDE1234F',
      financialYear: '2026-27',
      statutoryApprovalNo: 'AABTH1234F20261'
    }
  },
  {
    id: 'log-wa-8830',
    webhookId: 'wh-whatsapp-cloud',
    channel: 'whatsapp',
    event: 'quarterly.impact_digest',
    recipient: '+91 98200 11223',
    recipientName: 'Priya Sharma',
    timestamp: 'Yesterday at 04:15 PM',
    status: 'delivered',
    httpStatusCode: 200,
    latencyMs: 168,
    retryCount: 0,
    responseMessage: 'Quarterly Milestone Video & Telemetry Link delivered.',
    payload: {
      event: 'quarterly.impact_digest',
      quarter: 'Q2 2026 (Apr - Jun)',
      totalWellsCommissioned: 14,
      litresPumped: '4,850,000 L',
      livesImpactedInQuarter: '12,400 villagers',
      interactiveGisReport: 'https://helpsngo.in/impact/gis/2026-q2'
    }
  },
  {
    id: 'log-custom-8712',
    webhookId: 'wh-custom-zapier',
    channel: 'custom_webhook',
    event: 'volunteer.assignment_created',
    recipient: 'https://hooks.zapier.com/hooks/catch/948271/helps_ngo_ops',
    timestamp: 'Yesterday at 11:20 AM',
    status: 'delivered',
    httpStatusCode: 200,
    latencyMs: 245,
    retryCount: 0,
    responseMessage: 'HTTP 200 OK: Zapier triggered volunteer Slack broadcast.',
    payload: {
      event: 'volunteer.assignment_created',
      taskId: 'task-water-01',
      title: 'Solar Water Pump Installation Inspection - Barmer',
      assignedTo: 'Vikram Mehta',
      priority: 'Urgent'
    }
  }
];

export const DEFAULT_DONOR_PREFERENCES: DonorNotificationPreferences = {
  whatsappThankYou: true,
  whatsappQuarterlyMilestones: true,
  emailMonthlyDigest: true,
  emailQuarterlyImpactReport: true,
  taxCertificateAutoSend: true,
  emergencyAlerts: true
};

export const getStoredWebhookConfigs = (): WebhookConfig[] => {
  try {
    const saved = localStorage.getItem(WEBHOOK_CONFIGS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_WEBHOOK_CONFIGS;
};

export const saveWebhookConfigs = (configs: WebhookConfig[]): void => {
  try {
    localStorage.setItem(WEBHOOK_CONFIGS_STORAGE_KEY, JSON.stringify(configs));
  } catch {}
};

export const getStoredDeliveryLogs = (): WebhookDeliveryLog[] => {
  try {
    const saved = localStorage.getItem(WEBHOOK_LOGS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_DELIVERY_LOGS;
};

export const saveDeliveryLogs = (logs: WebhookDeliveryLog[]): void => {
  try {
    localStorage.setItem(WEBHOOK_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch {}
};

export const getStoredDonorPreferences = (): DonorNotificationPreferences => {
  try {
    const saved = localStorage.getItem(DONOR_PREFS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_DONOR_PREFERENCES;
};

export const saveDonorPreferences = (prefs: DonorNotificationPreferences): void => {
  try {
    localStorage.setItem(DONOR_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
};

// Dispatch a simulated or real webhook payload
export const dispatchWebhookEvent = async (
  event: WebhookEventType,
  data: Record<string, any>,
  targetChannel?: 'whatsapp' | 'email' | 'custom_webhook'
): Promise<WebhookDeliveryLog[]> => {
  const configs = getStoredWebhookConfigs();
  const currentLogs = getStoredDeliveryLogs();
  const newLogs: WebhookDeliveryLog[] = [];

  const activeConfigs = configs.filter(
    (c) => c.enabled && c.events.includes(event) && (!targetChannel || c.channel === targetChannel)
  );

  for (const config of activeConfigs) {
    const logId = `log-${config.channel}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const recipient =
      config.channel === 'whatsapp'
        ? data.donorPhone || '+91 98765 43210'
        : config.channel === 'email'
        ? data.donorEmail || 'donor@example.com'
        : config.endpointUrl;

    const newLog: WebhookDeliveryLog = {
      id: logId,
      webhookId: config.id,
      channel: config.channel,
      event,
      recipient,
      recipientName: data.donorName || 'Valued Donor',
      timestamp: 'Just now',
      status: 'delivered',
      httpStatusCode: 200,
      latencyMs: Math.floor(Math.random() * 180) + 120,
      retryCount: 0,
      responseMessage:
        config.channel === 'whatsapp'
          ? `WhatsApp Business Message ID wamid.HBgL... delivered to ${recipient}.`
          : config.channel === 'email'
          ? `Resend Email ID res_982... sent successfully to ${recipient}.`
          : `Custom webhook endpoint acknowledged HTTP 200 OK.`,
      payload: {
        event,
        timestamp: new Date().toISOString(),
        ...data
      }
    };

    newLogs.unshift(newLog);
  }

  const updatedLogs = [...newLogs, ...currentLogs].slice(0, 30);
  saveDeliveryLogs(updatedLogs);
  return updatedLogs;
};
