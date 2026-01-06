// src/types/tripulante.ts
export type TripulanteStatus = 'ACTIVO' | 'BAJA_TEMPORAL';

export type Tripulante = {
  id: string;          // uuid o timestamp
  nombre: string;
  codigo: string;      // TCP-001
  rol: string;         // Tripulante de Cabina
  base: string;        // LPB, CBB, VVI
  estado: TripulanteStatus;
};
