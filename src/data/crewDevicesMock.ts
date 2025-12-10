// src/data/crewDevicesMock.ts
export type DeviceStatus = 'ACTIVO' | 'SUSPENDIDO' | 'REVOCADO';

export type CrewDevice = {
  id: number;
  crewId: number;
  nombre: string;
  estado: DeviceStatus;
  registradoEl: string;
  ultimoUso?: string;
};

export const crewDevicesMock: CrewDevice[] = [
  {
    id: 1,
    crewId: 1,
    nombre: 'Samsung A54',
    estado: 'ACTIVO',
    registradoEl: '2025-01-10',
    ultimoUso: '2025-03-01 12:34',
  },
  {
    id: 2,
    crewId: 1,
    nombre: 'Moto G Power',
    estado: 'SUSPENDIDO',
    registradoEl: '2025-02-05',
    ultimoUso: '2025-02-20 09:15',
  },
  {
    id: 3,
    crewId: 2,
    nombre: 'iPhone 13',
    estado: 'ACTIVO',
    registradoEl: '2025-01-20',
  },
];
