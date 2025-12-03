// src/data/crewAssignmentsMock.ts

export type CrewAssignment = {
  id: number;
  nombre: string;
  rol: string;   // "Piloto" | "Copiloto" | "TCP" más adelante si quieres
  base: string;  // LPB, CBB, VVI...
};

export const crewAvailableMock: CrewAssignment[] = [
  { id: 1, nombre: 'Alan Torrejon', rol: 'TCP', base: 'LPB' },
  { id: 2, nombre: 'Lola Cortez', rol: 'TCP', base: 'LPB' },
  { id: 3, nombre: 'Lucas Pérez', rol: 'Piloto', base: 'CBB' },
  { id: 4, nombre: 'María Gómez', rol: 'Copiloto', base: 'LPB' },
  { id: 5, nombre: 'Pedro Rojas', rol: 'TCP', base: 'VVI' },
];

export const initialAssignedMock: CrewAssignment[] = [
  { id: 3, nombre: 'Lucas Pérez', rol: 'Piloto', base: 'CBB' },
  { id: 4, nombre: 'María Gómez', rol: 'Copiloto', base: 'LPB' },
];
