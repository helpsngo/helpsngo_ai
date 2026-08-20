import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  CloudOff, 
  Zap, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  getCurrentSyncState, 
  subscribeSyncState, 
  autoSyncQueue, 
  setSimulatedOffline 
} from '../services/offlineSyncService';
import { OfflineSyncState } from '../types';
import confetti from 'canvas-confetti';

interface OfflineSyncBadgeProps {
  onOpenSyncModal?: () => void;
  compact?: boolean;
}

export const OfflineSyncBadge: React.FC<OfflineSyncBadgeProps> = ({ 
  onOpenSyncModal,
  compact = false
}) => {
  const [syncState, setSyncState] = useState<OfflineSyncState>(() => getCurrentSyncState());
  const [justSyncedAnim, setJustSyncedAnim] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSyncState((state) => {
      setSyncState(state);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!syncState.isOnline) {
      if (onOpenSyncModal) onOpenSyncModal();
      return;
    }

    const res = await autoSyncQueue();
    if (res.syncedCount > 0) {
      setJustSyncedAnim(true);
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.2 }
          });
        }
      } catch {}
      setTimeout(() => setJustSyncedAnim(false), 2000);
    }
  };

  const pendingCount = syncState.queue.length;

  if (compact) {
    return (
      <button
        onClick={onOpenSyncModal}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
          !syncState.isOnline
            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
            : pendingCount > 0
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}
        title={!syncState.isOnline ? 'Offline / Remote Village Mode Active' : 'All Field Tasks Synced'}
      >
        {!syncState.isOnline ? (
          <>
            <WifiOff className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>Village Offline ({pendingCount})</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <RefreshCw className={`w-3 h-3 text-blue-600 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
            <span>{pendingCount} Pending</span>
          </>
        ) : (
          <>
            <Wifi className="w-3 h-3 text-emerald-600" />
            <span>Field Sync Live</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onOpenSyncModal}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
          !syncState.isOnline
            ? 'bg-amber-500/10 text-amber-950 border-amber-300 hover:bg-amber-500/20'
            : pendingCount > 0
            ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
            : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {!syncState.isOnline ? (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            ) : pendingCount > 0 ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            )}
          </span>

          {!syncState.isOnline ? (
            <div className="flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-black tracking-tight">Village Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-black tracking-tight">Sync Online</span>
            </div>
          )}
        </div>

        {pendingCount > 0 && (
          <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Quick Sync Button */}
      {syncState.isOnline && pendingCount > 0 && (
        <button
          onClick={handleManualSync}
          disabled={syncState.isSyncing}
          className="p-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-2xs text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer"
          title="Sync Pending Tasks to Cloud HQ"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};
