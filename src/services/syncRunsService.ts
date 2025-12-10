// src/services/syncRunsService.ts
import { syncRunsMock, type SyncRun } from '../data/syncRunsMock';

export async function getSyncRuns(): Promise<SyncRun[]> {
  // Simulamos una llamada HTTP con Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(syncRunsMock);
    }, 300); // pequeño delay para ver "cargando..."
  });
}
