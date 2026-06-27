import { useEffect, useState, useCallback, useRef } from 'react';

export function useCloudSync() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const lastSyncHash = useRef<string>('');
  const initialized = useRef(false);

  const getLocalStateSnapshot = () => {
    const state: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ete_')) {
        state[key] = localStorage.getItem(key) || '';
      }
    }
    return state;
  };

  const getSnapshotString = () => JSON.stringify(getLocalStateSnapshot());

  const pushToCloud = useCallback(async (force = false) => {
    const currentHash = getSnapshotString();
    
    // Only push if something actually changed since last sync
    if (!force && currentHash === lastSyncHash.current) return;
    if (Object.keys(getLocalStateSnapshot()).length === 0) return; // Don't push empty state

    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: getLocalStateSnapshot() })
      });
      
      if (res.ok) {
        lastSyncHash.current = currentHash;
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Cloud Sync Push Error:', err);
      setSyncStatus('error');
    }
  }, []);

  const pullFromCloud = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/sync');
      
      if (!res.ok) {
        setSyncStatus('error');
        return;
      }
      
      const { data } = await res.json();
      
      if (data && Object.keys(data).length > 0) {
        // Compare with local. If cloud has data, we overwrite local and force reload.
        const cloudHash = JSON.stringify(data);
        const localHash = getSnapshotString();
        
        if (cloudHash !== localHash) {
          // Cloud is different, apply it!
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
          lastSyncHash.current = cloudHash;
          
          // Force a reload so all components pick up the new localStorage values
          window.location.reload();
          return;
        }
      }
      
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error('Cloud Sync Pull Error:', err);
      setSyncStatus('error');
    }
  }, []);

  // Initial pull on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      pullFromCloud();
    }
  }, [pullFromCloud]);

  // Periodic push (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      pushToCloud();
    }, 5000);
    return () => clearInterval(interval);
  }, [pushToCloud]);

  return { syncStatus, pushToCloud, pullFromCloud };
}
