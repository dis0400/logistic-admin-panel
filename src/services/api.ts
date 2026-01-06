// src/services/api.ts
const API_BASE_URL = 'http://localhost:3000';

/**
 * Helper genérico para llamar al backend.
 * Ejemplo:
 *   const vuelos = await api<FlightRow[]>('/flights');
 *   const resp = await api<CronRunResponse>('/cron/run-once', { method: 'POST' });
 */
export async function api<TReturn = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<TReturn> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} al llamar ${url}`);
  }

  // Si la respuesta no tiene body (por ejemplo 204)
  if (res.status === 204) {
    return null as TReturn;
  }

  const data = (await res.json()) as TReturn;
  return data;
}
