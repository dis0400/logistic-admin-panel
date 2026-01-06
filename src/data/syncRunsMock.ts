// src/data/syncRunsMock.ts
export type SyncRunRow = {
  id: number;
  ejecutadoEl: string;
  vuelosActualizados: number;
  errores: number;
  fuente: string;
};

export const syncRunsMock: SyncRunRow[] = [
  {
    id: 1,
    ejecutadoEl: '2025-03-10 03:00',
    vuelosActualizados: 14,
    errores: 0,
    fuente: 'SerpAPI + Sistema Aerolínea',
  },
  {
    id: 2,
    ejecutadoEl: '2025-03-09 21:00',
    vuelosActualizados: 11,
    errores: 1,
    fuente: 'SerpAPI + Sistema Aerolínea',
  },
  {
    id: 3,
    ejecutadoEl: '2025-03-09 15:00',
    vuelosActualizados: 18,
    errores: 0,
    fuente: 'Sistema Aerolínea (cache local)',
  },
];
