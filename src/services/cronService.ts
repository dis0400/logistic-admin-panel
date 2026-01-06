// src/services/cronService.ts
import { api } from './api';

export type CronRunResponse = {
  message: string;
};

export async function runSyncOnce(): Promise<CronRunResponse> {
  // Llama a POST http://localhost:3000/cron/run-once
  return api<CronRunResponse>('/cron/run-once', {
    method: 'POST',
  });
}
