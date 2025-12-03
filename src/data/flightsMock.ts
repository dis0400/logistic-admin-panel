// src/data/flightsMock.ts

export type FlightStatus = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

export type FlightType = 'NACIONAL' | 'INTERNACIONAL';

export type FlightAdmin = {
  id: number;
  codigoVuelo: string;
  origen: string;       // código IATA o ciudad (LPB, CBB, VVI, etc.)
  destino: string;
  fecha: string;        // '2025-03-15'
  salidaUTC: string;    // '2025-03-15T10:00:00Z'
  llegadaUTC: string;   // '2025-03-15T11:00:00Z'
  estado: FlightStatus;
  tipo: FlightType;
  avion: string;
  tripulantesAsignados: number; // cuántos tripulantes tiene asignados
  asientosTotales: number;
  asientosDisponibles: number;
};
 
export const flightsMock: FlightAdmin[] = [
  {
    id: 1,
    codigoVuelo: 'LG123',
    origen: 'LPB',
    destino: 'CBB',
    fecha: '2025-03-15',
    salidaUTC: '2025-03-15T10:00:00Z',
    llegadaUTC: '2025-03-15T11:00:00Z',
    estado: 'PROGRAMADO',
    tipo: 'NACIONAL',
    avion: 'A320',
    tripulantesAsignados: 4,
    asientosTotales: 180,
    asientosDisponibles: 32,
  },
  {
    id: 2,
    codigoVuelo: 'LG456',
    origen: 'CBB',
    destino: 'VVI',
    fecha: '2025-03-15',
    salidaUTC: '2025-03-15T13:30:00Z',
    llegadaUTC: '2025-03-15T14:20:00Z',
    estado: 'EN_CURSO',
    tipo: 'NACIONAL',
    avion: 'B737',
    tripulantesAsignados: 5,
    asientosTotales: 160,
    asientosDisponibles: 10,
  },
  {
    id: 3,
    codigoVuelo: 'LG789',
    origen: 'VVI',
    destino: 'LPB',
    fecha: '2025-03-16',
    salidaUTC: '2025-03-16T09:00:00Z',
    llegadaUTC: '2025-03-16T10:10:00Z',
    estado: 'FINALIZADO',
    tipo: 'NACIONAL',
    avion: 'A319',
    tripulantesAsignados: 4,
    asientosTotales: 144,
    asientosDisponibles: 0,
  },
  {
    id: 4,
    codigoVuelo: 'LG900',
    origen: 'LPB',
    destino: 'MIA',
    fecha: '2025-03-17',
    salidaUTC: '2025-03-17T04:00:00Z',
    llegadaUTC: '2025-03-17T10:30:00Z',
    estado: 'CANCELADO',
    tipo: 'INTERNACIONAL',
    avion: 'A321',
    tripulantesAsignados: 8,
    asientosTotales: 200,
    asientosDisponibles: 200,
  },
];