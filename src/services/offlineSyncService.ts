import { OfflineSyncItem, OfflineSyncState, OfflineActionType, WorkAssignment } from '../types';

const SYNC_QUEUE_STORAGE_KEY = 'helps_ngo_offline_sync_queue_v1';
const SYNC_HISTORY_STORAGE_KEY = 'helps_ngo_offline_sync_history_v1';
const SIMULATED_OFFLINE_STORAGE_KEY = 'helps_ngo_simulated_offline_mode';
const LAST_SYNCED_STORAGE_KEY = 'helps_ngo_last_synced_timestamp';

type SyncListener = (state: OfflineSyncState) => void;
const listeners = new Set<SyncListener>();

let isSyncingInProgress = false;

// Initial state helpers
function getStoredQueue(): OfflineSyncItem[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredHistory(): OfflineSyncItem[] {
  try {
    const raw = localStorage.getItem(SYNC_HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredSimulatedOffline(): boolean {
  try {
    return localStorage.getItem(SIMULATED_OFFLINE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getStoredLastSynced(): number | null {
  try {
    const raw = localStorage.getItem(LAST_SYNCED_STORAGE_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

function saveQueue(queue: OfflineSyncItem[]) {
  try {
    localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save offline sync queue', err);
  }
}

function saveHistory(history: OfflineSyncItem[]) {
  try {
    // Keep max 50 historical items
    localStorage.setItem(SYNC_HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save offline sync history', err);
  }
}

export function getCurrentSyncState(): OfflineSyncState {
  const simulatedOffline = getStoredSimulatedOffline();
  const realOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const isOnline = realOnline && !simulatedOffline;

  return {
    isOnline,
    isSimulatedOffline: simulatedOffline,
    isSyncing: isSyncingInProgress,
    lastSyncedAt: getStoredLastSynced(),
    queue: getStoredQueue(),
    history: getStoredHistory()
  };
}

function notifyListeners() {
  const state = getCurrentSyncState();
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (e) {
      console.error('Error in sync listener', e);
    }
  });
}

export function subscribeSyncState(listener: SyncListener): () => void {
  listeners.add(listener);
  // Initial fire
  listener(getCurrentSyncState());
  return () => {
    listeners.delete(listener);
  };
}

export function setSimulatedOffline(enabled: boolean) {
  try {
    localStorage.setItem(SIMULATED_OFFLINE_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.error(e);
  }
  notifyListeners();

  // If we just came back online, trigger auto-sync!
  if (!enabled && typeof navigator !== 'undefined' && navigator.onLine) {
    autoSyncQueue();
  }
}

export function queueOfflineAction(
  type: OfflineActionType,
  taskId: string,
  taskTitle: string,
  payload: Record<string, any>,
  villageLocation?: string
): OfflineSyncItem {
  const now = Date.now();
  const d = new Date(now);
  const dateFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const newItem: OfflineSyncItem = {
    id: `sync-${now}-${Math.floor(Math.random() * 1000)}`,
    type,
    taskId,
    taskTitle,
    timestamp: now,
    dateFormatted,
    payload,
    status: 'pending',
    retryCount: 0,
    villageLocation: villageLocation || 'Field Unit (Remote Village)'
  };

  const currentQueue = getStoredQueue();
  const updatedQueue = [newItem, ...currentQueue];
  saveQueue(updatedQueue);
  notifyListeners();

  // If we are actually online right now, attempt immediate background sync
  const state = getCurrentSyncState();
  if (state.isOnline) {
    // slight delay for fluid UI state
    setTimeout(() => {
      autoSyncQueue();
    }, 400);
  }

  return newItem;
}

export async function autoSyncQueue(): Promise<{ syncedCount: number; errors: number }> {
  const state = getCurrentSyncState();
  if (!state.isOnline || isSyncingInProgress) {
    return { syncedCount: 0, errors: 0 };
  }

  const queue = getStoredQueue();
  if (queue.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  isSyncingInProgress = true;
  notifyListeners();

  let syncedCount = 0;
  let errorCount = 0;
  const history = getStoredHistory();
  const remainingQueue: OfflineSyncItem[] = [];

  for (const item of queue) {
    try {
      // Simulate network roundtrip latency for realistic field sync experience
      await new Promise((res) => setTimeout(res, 280));

      const syncedItem: OfflineSyncItem = {
        ...item,
        status: 'synced',
        timestamp: Date.now()
      };

      history.unshift(syncedItem);
      syncedCount++;
    } catch (err: any) {
      errorCount++;
      remainingQueue.push({
        ...item,
        status: 'failed',
        retryCount: item.retryCount + 1,
        error: err?.message || 'Sync transmission timeout'
      });
    }
  }

  saveQueue(remainingQueue);
  saveHistory(history);
  
  const now = Date.now();
  try {
    localStorage.setItem(LAST_SYNCED_STORAGE_KEY, String(now));
  } catch {}

  isSyncingInProgress = false;
  notifyListeners();

  return { syncedCount, errors: errorCount };
}

export function clearSyncQueue() {
  saveQueue([]);
  notifyListeners();
}

export function clearSyncHistory() {
  saveHistory([]);
  notifyListeners();
}

// Register Service Worker safely
export function registerFieldServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed (normal in dev container):', err);
        });
    });
  }
}

// Global window network online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Network] Browser back online. Triggering auto-sync...');
    notifyListeners();
    autoSyncQueue();
  });

  window.addEventListener('offline', () => {
    console.log('[Network] Browser went offline. Enabling village local storage.');
    notifyListeners();
  });

  // Listen for background sync messages from Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'BACKGROUND_SYNC_TRIGGERED') {
        autoSyncQueue();
      }
    });
  }
}
