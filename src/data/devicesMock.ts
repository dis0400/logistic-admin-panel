// src/data/devicesMock.ts

export type DeviceStatus = 'ACTIVO' | 'SUSPENDIDO' | 'REVOCADO';

export type Device = {
  id: number;
  nombre: string;            // Ej: "iPhone de Juan"
  plataforma: 'Android' | 'iOS';
  modelo: string;            // Ej: "iPhone 14 Pro", "Samsung A54"
  tripulanteId: number;
  tripulanteNombre: string;
  registradoEl: string;      // '2025-03-10 08:30'
  ultimoAcceso: string;      // '2025-03-10 09:15'
  estado: DeviceStatus;
};

export const devicesMock: Device[] = [
  {
    id: 1,
    nombre: 'iPhone de Suarez',
    plataforma: 'iOS',
    modelo: 'iPhone 13',
    tripulanteId: 1,
    tripulanteNombre: 'Luis Suarez',
    registradoEl: '2025-03-09 10:15',
    ultimoAcceso: '2025-03-10 07:50',
    estado: 'ACTIVO',
  },
  {
    id: 2,
    nombre: 'Android de Lola',
    plataforma: 'Android',
    modelo: 'Samsung A54',
    tripulanteId: 2,
    tripulanteNombre: 'Lola Marinez',
    registradoEl: '2025-03-08 16:40',
    ultimoAcceso: '2025-03-10 06:20',
    estado: 'SUSPENDIDO',
  },
  {
    id: 3,
    nombre: 'iPhone de Lucas',
    plataforma: 'iOS',
    modelo: 'iPhone 14 Pro',
    tripulanteId: 3,
    tripulanteNombre: 'Lucas Pérez',
    registradoEl: '2025-03-07 09:00',
    ultimoAcceso: '2025-03-09 23:10',
    estado: 'REVOCADO',
  },
];
