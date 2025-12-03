// src/data/crewMock.ts

export type CrewStatus = 'ACTIVO' | 'BAJA_TEMPORAL' | 'BAJA';

export type CrewMember = {
  id: number;
  nombre: string;
  codigo: string;
  rol: string;
  estado: CrewStatus;
  base: string;
};

export const crewMock: CrewMember[] = [
  {
    id: 1,
    nombre: 'Luis Suarez',
    codigo: 'TCP-001',
    rol: 'Tripulante de Cabina',
    estado: 'ACTIVO',
    base: 'LPB',
  },
  {
    id: 2,
    nombre: 'Lucas Pérez',
    codigo: 'TCP-002',
    rol: 'Tripulante de Cabina',
    estado: 'BAJA_TEMPORAL',
    base: 'CBB',
  },
  {
    id: 3,
    nombre: 'Lola Martinez',
    codigo: 'TCP-003',
    rol: 'Tripulante de Cabina',
    estado: 'ACTIVO',
    base: 'VVI',
  },
];
