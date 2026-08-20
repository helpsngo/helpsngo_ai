import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  CloudOff, 
  Zap, 
  MapPin, 
  Clock, 
  Trash2, 
  Layers, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  AlertTriangle,
  FileCheck,
  CheckSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  getCurrentSyncState, 
  subscribeSyncState, 
  autoSyncQueue, 
  setSimulatedOffline, 
  clearSyncQueue, 
  clearSyncHistory 
} from '../services/offlineSyncService';
import { OfflineSyncState, OfflineSyncItem } from '../types';
import confetti from 'canvas-confetti';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const [syncState, setSyncState] = useState<OfflineSyncState>(() => getCurrentSyncState());
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'guide'>('queue');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSyncState((state) => {
      setSyncState(state);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleToggleSimulatedOffline = () => {
    const nextVal = !syncState.isSimulatedOffline;
    setSimulatedOffline(nextVal);
    if (!nextVal) {
      setSyncFeedback('🛰️ Back in Range! Reconnecting & auto-syncing field records...');
      setTimeout(() => setSyncFeedback(null), 3000);
    } else {
      setSyncFeedback('🏕️ Remote Village Mode Active: All edits saved locally to offline queue.');
      setTimeout(() => setSyncFeedback(null), 3000);
    }
  };

  const handleSyncNow = async () => {
    if (!syncState.isOnline) {
      setSyncFeedback('⚠️ Cannot sync while in Village Offline Mode. Switch to Online mode first.');
      setTimeout(() => setSyncFeedback(null), 3000);
      return;
    }

    const res = await autoSyncQueue();
    if (res.syncedCount > 0) {
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch {}
      setSyncFeedback(`✅ Successfully synced ${res.syncedCount} field operations to Central HQ!`);
    } else if (res.errors > 0) {
      setSyncFeedback(`⚠️ Sync completed with ${res.errors} items requiring retry.`);
    } else {
      setSyncFeedback('✨ All field data is already up to date!');
    }
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const getActionBadge = (type: OfflineSyncItem['type']) => {
    switch (type) {
      case 'CHECKLIST_TOGGLE':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Checklist Item</span>;
      case 'LOG_VOLUNTEER_HOURS':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Log Hours</span>;
      case 'TASK_COMPLETION_SUBMIT':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Completion Proof</span>;
      case 'TASK_STATUS_UPDATE':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Status Update</span>;
      case 'CREATE_TASK':
        return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Create Task</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">{type}</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-gray-900 via-zinc-900 to-gray-900 text-white rounded-t-[2rem] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              !syncState.isOnline ? 'bg-amber-600' : 'bg-emerald-600'
            }`}>
              {!syncState.isOnline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                  PWA • Service Worker Engine
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  !syncState.isOnline ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {!syncState.isOnline ? 'VILLAGE OFFLINE' : 'LIVE CLOUD SYNC'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Offline Field Task Sync Console
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {syncFeedback && (
          <div className="bg-orange-50 border-b border-orange-200 p-3 text-xs font-bold text-orange-950 flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Village Mode Toggle Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            syncState.isSimulatedOffline
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-emerald-50/80 border-emerald-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Remote Village Simulation
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold text-gray-600 border border-gray-200">
                    Offline Sandbox
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  Simulate taking this tablet into a remote rural village with 0 cellular network. Ticking checklists and logging volunteer hours will be queued locally and synced once back in range.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleSimulatedOffline}
                className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer flex-shrink-0 ${
                  syncState.isSimulatedOffline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {syncState.isSimulatedOffline ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Reconnect (Back in Range)</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Go Offline (Village Mode)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Pending Sync</span>
              <strong className="text-lg font-black text-blue-600">{syncState.queue.length}</strong>
              <span className="text-[9px] text-gray-400 block mt-0.5">items in queue</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">History Synced</span>
              <strong className="text-lg font-black text-emerald-600">{syncState.history.length}</strong>
              <span className="text-[9px] text-gray-400 block mt-0.5">confirmed records</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Service Worker</span>
              <strong className="text-xs font-black text-emerald-700 block mt-1">Active (PWA)</strong>
              <span className="text-[9px] text-gray-400 block mt-0.5">Local Cache Ready</span>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Sync Queue</span>
              {syncState.queue.length > 0 && (
                <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {syncState.queue.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Sync History</span>
              <span className="text-[10px] text-gray-400">({syncState.history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Roles & Field Guide</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              {activeTab === 'queue' && syncState.queue.length > 0 && (
                <button
                  onClick={handleSyncNow}
                  disabled={syncState.isSyncing || !syncState.isOnline}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: Queue Items */}
          {activeTab === 'queue' && (
            <div className="space-y-3">
              {syncState.queue.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                    All Field Tasks Fully Synced!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No pending mutations in local storage. Any task checklist updates or volunteer hours logged while offline will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold px-1">
                    <span>Pending Local Storage Queue ({syncState.queue.length})</span>
                    <button
                      onClick={() => clearSyncQueue()}
                      className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Queue</span>
                    </button>
                  </div>

                  {syncState.queue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getActionBadge(item.type)}
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            #{item.taskId}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{item.dateFormatted}</span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-gray-900">
                        {item.taskTitle}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          <span>{item.villageLocation || 'Remote Cluster'}</span>
                        </div>
                        <span className="text-blue-600 font-bold uppercase tracking-wider">
                          Ready to Auto-Sync
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Sync History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {syncState.history.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-2">
                  <p className="text-xs text-gray-500">No sync history recorded yet in this session.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold px-1">
                    <span>Recent Successful Dispatches ({syncState.history.length})</span>
                    <button
                      onClick={() => clearSyncHistory()}
                      className="text-gray-400 hover:text-gray-600 text-[10px] hover:underline cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>

                  {syncState.history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-emerald-50/40 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-gray-900">{item.taskTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          {getActionBadge(item.type)}
                          <span>•</span>
                          <span>{item.dateFormatted}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        200 OK
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Roles & Field Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-gray-600">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Profile-Based Task Visibility Rules</span>
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                    <strong className="text-gray-900 font-bold block mb-0.5">1. Management & Trustee Profiles:</strong>
                    <span>Full administrative access. Dispatches operations to volunteers & managers, monitors village task completion audits, verifies volunteer logged hours, and reviews real-time sync queues.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                    <strong className="text-gray-900 font-bold block mb-0.5">2. Volunteer Field Agents:</strong>
                    <span>Tailored field dashboard showing tasks assigned specifically to them. Direct offline-ready interactive checklists, GPS-tagged hour logging, and automated local sync queue.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                    <strong className="text-gray-900 font-bold block mb-0.5">3. Donor & Philanthropist Profiles:</strong>
                    <span>Stewardship & transparency view. Displays operational field tasks and village drives funded by the donor's contributions with real-time ground progress and verified milestone certificates.</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-1.5">
                <h4 className="font-bold text-blue-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Service Worker & PWA Offline Protocol</span>
                </h4>
                <p className="text-[11px] text-blue-900 leading-relaxed font-normal">
                  Helps NGO registers a progressive Service Worker that pre-caches app shell assets and data. In remote villages with intermittent or no connectivity, volunteer checklists and logged hours persist in browser local storage and auto-dispatch to NGO HQ the instant connection is re-established.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 rounded-b-[2rem]">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px]">Helps NGO Offline Sync v1.4 • IndexedStorage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
