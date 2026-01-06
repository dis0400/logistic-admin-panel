// src/data/flightsMock.ts

export type FlightStatus = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

// Fila para la tabla de vuelos
export type FlightRow = {
  id: number;
  codigoVuelo: string;
  origen: string;
  destino: string;
  fecha: string; // YYYY-MM-DD
  tipo: string;
  estado: FlightStatus;
  tripulantesAsignados: number;
  asientosDisponibles: number;
  asientosTotales: number;
};

// Detalle de vuelo
export type FlightAdmin = FlightRow & {
  avion: string;
  salidaUTC: string;
  llegadaUTC: string;
};

// Mock de ejemplo
export const flightsMock: FlightAdmin[] = [
  {
    id: 1,
    codigoVuelo: 'LPB-CBB-001',
    origen: 'LPB',
    destino: 'CBB',
    fecha: '2025-12-18',
    tipo: 'DEMO',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 5,
    asientosDisponibles: 40,
    asientosTotales: 60,
    avion: 'Boeing 737-800',
    salidaUTC: '2025-12-18T10:00:00Z',
    llegadaUTC: '2025-12-18T11:00:00Z',
  },
  
  {
    id: 2,
    codigoVuelo: 'BOA-CBB-SCZ-002',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-14',
    tipo: 'Vuelo',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 4,
    asientosDisponibles: 28,
    asientosTotales: 60,
    avion: 'A320',
    salidaUTC: '2025-12-14T12:30:00Z',
    llegadaUTC: '2025-12-14T13:10:00Z',
  },
  {
    id: 3,
    codigoVuelo: 'BOA-SCZ-LPB-003',
    origen: 'SCZ',
    destino: 'LPB',
    fecha: '2025-12-15',
    tipo: 'Vuelo',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 6,
    asientosDisponibles: 12,
    asientosTotales: 60,
    avion: 'B737',
    salidaUTC: '2025-12-15T09:15:00Z',
    llegadaUTC: '2025-12-15T10:10:00Z',
  },
  {
    id: 4,
    codigoVuelo: 'BOA-LPB-SCZ-004',
    origen: 'LPB',
    destino: 'SCZ',
    fecha: '2025-12-16',
    tipo: 'Deadhead',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 2,
    asientosDisponibles: 44,
    asientosTotales: 60,
    avion: 'A320',
    salidaUTC: '2025-12-16T06:00:00Z',
    llegadaUTC: '2025-12-16T06:55:00Z',
  },
  {
    id: 5,
    codigoVuelo: 'BOA-LPB-CBB-005',
    origen: 'LPB',
    destino: 'CBB',
    fecha: '2025-12-17',
    tipo: 'Entrenamiento',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 8,
    asientosDisponibles: 50,
    asientosTotales: 70,
    avion: 'B737',
    salidaUTC: '2025-12-17T14:00:00Z',
    llegadaUTC: '2025-12-17T14:45:00Z',
  },
  {
    id: 6,
    codigoVuelo: 'BOA-CBB-SCZ-006',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-18',
    tipo: 'Vuelo',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 5,
    asientosDisponibles: 31,
    asientosTotales: 60,
    avion: 'A320',
    salidaUTC: '2025-12-18T18:20:00Z',
    llegadaUTC: '2025-12-18T19:00:00Z',
  },

  // Extras para que tu tabla se vea “con más vida” en demo:
  {
    id: 7,
    codigoVuelo: 'LATAM-CBB-SCZ-007',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-20',
    tipo: 'Vuelo',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 6,
    asientosDisponibles: 22,
    asientosTotales: 60,
    avion: 'A320',
    salidaUTC: '2025-12-20T08:44:00Z',
    llegadaUTC: '2025-12-20T11:04:00Z',
  },
  {
    id: 8,
    codigoVuelo: 'AA-CBB-SCZ-008',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-25',
    tipo: 'Deadhead',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 1,
    asientosDisponibles: 55,
    asientosTotales: 60,
    avion: 'B787',
    salidaUTC: '2025-12-25T13:21:00Z',
    llegadaUTC: '2025-12-25T15:27:00Z',
  },
  {
    id: 9,
    codigoVuelo: 'AVIANCA-CBB-SCZ-009',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-15',
    tipo: 'Deadhead',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 2,
    asientosDisponibles: 38,
    asientosTotales: 60,
    avion: 'B787',
    salidaUTC: '2025-12-15T12:20:00Z',
    llegadaUTC: '2025-12-15T14:12:00Z',
  },
  {
    id: 10,
    codigoVuelo: 'AVIANCA-SCZ-CBB-010',
    origen: 'SCZ',
    destino: 'CBB',
    fecha: '2026-01-15',
    tipo: 'Vuelo',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 5,
    asientosDisponibles: 19,
    asientosTotales: 60,
    avion: 'A220',
    salidaUTC: '2026-01-15T05:36:00Z',
    llegadaUTC: '2026-01-15T08:02:00Z',
  },
  {
    id: 11,
    codigoVuelo: 'AA-SCZ-CBB-011',
    origen: 'SCZ',
    destino: 'CBB',
    fecha: '2025-12-28',
    tipo: 'Deadhead',
    estado: 'EN_CURSO',
    tripulantesAsignados: 3,
    asientosDisponibles: 41,
    asientosTotales: 60,
    avion: 'A320',
    salidaUTC: '2025-12-28T06:00:00Z',
    llegadaUTC: '2025-12-28T08:58:00Z',
  },
  {
    id: 12,
    codigoVuelo: 'AA-CBB-SCZ-012',
    origen: 'CBB',
    destino: 'SCZ',
    fecha: '2025-12-19',
    tipo: 'Entrenamiento',
    estado: 'PROGRAMADO',
    tripulantesAsignados: 7,
    asientosDisponibles: 33,
    asientosTotales: 70,
    avion: 'B737',
    salidaUTC: '2025-12-19T13:39:00Z',
    llegadaUTC: '2025-12-19T15:54:00Z',
  },
];
