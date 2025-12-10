// src/data/syncRunsMock.ts

export type SyncRunStatus = 'OK' | 'ERROR' | 'PARCIAL';

export type SyncRun = {
  id: number;
  ejecutadoEn: string;      // '2025-03-10 03:00'
  origenDatos: string;      // 'SerpAPI (Google Flights) + sistema interno'
  vuelosProcesados: number; // total de vuelos leídos del origen
  vuelosActualizados: number;
  vuelosCreados: number;
  errores: number;
  estado: SyncRunStatus;
  mensaje?: string;         // un breve resumen
};

export const syncRunsMock: SyncRun[] = [
  {
    id: 3,
    ejecutadoEn: '2025-03-10 09:00',
    origenDatos: 'SerpAPI (Google Flights) + sistema interno de la aerolínea',
    vuelosProcesados: 42,
    vuelosActualizados: 30,
    vuelosCreados: 10,
    errores: 2,
    estado: 'PARCIAL',
    mensaje: 'Algunos vuelos no pudieron actualizarse por cambios en el origen.',
  },
  {
    id: 2,
    ejecutadoEn: '2025-03-10 03:00',
    origenDatos: 'SerpAPI (Google Flights) + sistema interno de la aerolínea',
    vuelosProcesados: 38,
    vuelosActualizados: 28,
    vuelosCreados: 8,
    errores: 0,
    estado: 'OK',
    mensaje: 'Sincronización completada correctamente.',
  },
  {
    id: 1,
    ejecutadoEn: '2025-03-09 21:00',
    origenDatos: 'SerpAPI (Google Flights) + sistema interno de la aerolínea',
    vuelosProcesados: 0,
    vuelosActualizados: 0,
    vuelosCreados: 0,
    errores: 1,
    estado: 'ERROR',
    mensaje: 'Fallo de conexión con el origen de datos.',
  },
];
