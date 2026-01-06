// src/services/syncRunsService.ts
import { syncRunsMock, type SyncRunRow } from '../data/syncRunsMock';

export async function getSyncRuns(): Promise<SyncRunRow[]> {
  await new Promise((res) => setTimeout(res, 300));
  return syncRunsMock;
}

// Para más adelante, cuando tengas backend real:
export async function registerSyncRun() {
  alert('Aquí se registrará una nueva ejecución del CRON (mock).');
}
