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

  // Hash canônico: ordena as chaves para que a comparação não dependa da
  // ordem do localStorage nem do round-trip pelo Redis (evita falsos "diferente").
  const canonical = (obj: Record<string, string>) =>
    JSON.stringify(
      Object.keys(obj)
        .sort()
        .reduce((acc, k) => {
          acc[k] = obj[k];
          return acc;
        }, {} as Record<string, string>)
    );

  const getSnapshotString = () => canonical(getLocalStateSnapshot());

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
        // Compara de forma canônica (ordem das chaves não importa).
        const cloudHash = canonical(data as Record<string, string>);
        const localHash = getSnapshotString();

        if (cloudHash !== localHash) {
          // Nuvem é diferente: aplica no localStorage.
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
          lastSyncHash.current = cloudHash;

          // Recarrega para os componentes lerem o novo localStorage — mas com
          // DUAS travas à prova de loop:
          //  1) sessionStorage: no máx. 1 reload por sessão da aba.
          //  2) timestamp (localStorage, chave NÃO sincronizada): no máx. 1
          //     reload a cada 60s, sobrevive mesmo se a sessão for limpa.
          // Nota: a chave NÃO começa com 'ete_' para não entrar no snapshot.
          const lastReload = parseInt(localStorage.getItem('cloudsync_last_reload') || '0', 10);
          const recentlyReloaded = Date.now() - lastReload < 60000;
          if (!sessionStorage.getItem('ete_cloud_reloaded') && !recentlyReloaded) {
            sessionStorage.setItem('ete_cloud_reloaded', '1');
            localStorage.setItem('cloudsync_last_reload', String(Date.now()));
            window.location.reload();
            return;
          }
        } else {
          // Já está em sincronia: marca o hash para o push periódico não disparar à toa.
          lastSyncHash.current = cloudHash;
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
