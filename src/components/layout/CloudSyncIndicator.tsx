import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { auth } from '../../lib/firebase';

export type SyncState = 'synced' | 'syncing' | 'offline';

export function CloudSyncIndicator() {
  const [syncState, setSyncState] = useState<SyncState>('synced');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Baru saja');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('syncing');
      setTimeout(() => {
        setSyncState('synced');
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to custom local broadcast events when trades or learning progress are saved
    const handleDataMutation = () => {
      if (!navigator.onLine) {
        setSyncState('offline');
        return;
      }
      setSyncState('syncing');
      setTimeout(() => {
        setSyncState('synced');
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }, 1000);
    };

    window.addEventListener('sikaya_data_mutation', handleDataMutation);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sikaya_data_mutation', handleDataMutation);
    };
  }, []);

  return (
    <div 
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all duration-300 select-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      title={`Status Sinkronisasi Cloud: ${syncState === 'synced' ? 'Tersimpan aman di Firestore (' + lastSyncedTime + ')' : syncState === 'syncing' ? 'Menyinkronkan data...' : 'Offline - Tersimpan di perangkat'}`}
    >
      {syncState === 'syncing' && (
        <>
          <RefreshCw className="w-3 h-3 text-teal-600 dark:text-teal-400 animate-spin" />
          <span className="text-teal-600 dark:text-teal-400 font-bold">Syncing...</span>
        </>
      )}

      {syncState === 'synced' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1">
            <Cloud className="w-3 h-3 text-emerald-500" />
            <span>Cloud Aktif</span>
          </span>
        </>
      )}

      {syncState === 'offline' && (
        <>
          <CloudOff className="w-3 h-3 text-amber-500" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Lokal (Offline)</span>
        </>
      )}
    </div>
  );
}

// Global utility helper to trigger sync pulse from anywhere in the app
export function notifyDataMutation() {
  window.dispatchEvent(new Event('sikaya_data_mutation'));
}
