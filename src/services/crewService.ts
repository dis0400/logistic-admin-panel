// src/services/crewService.ts
// import { api } from './api';   // 👈 lo quitamos por ahora
import type { CrewMember, CrewStatus } from '../data/crewMock';
import { crewMock } from '../data/crewMock';

// Lista de tripulantes
export async function getCrewMembers(): Promise<CrewMember[]> {
  return crewMock;
}

// Detalle de tripulante
export async function getCrewMemberById(id: number): Promise<CrewMember | null> {
  const all = await getCrewMembers();
  return all.find((c) => c.id === id) ?? null;
}

// Actualizar estado (mock)
export async function updateCrewMemberStatus(
  id: number,
  newStatus: CrewStatus
): Promise<void> {
  console.log(`[MOCK] updateCrewMemberStatus(${id}, ${newStatus})`);
}

// Generar código de acceso (mock)
export type GeneratedLoginCodeResponse = {
  id: number;
  codigo: string;
  expiracion: string;
};

export async function generateLoginCodeForCrewMember(
  id: number
): Promise<GeneratedLoginCodeResponse> {
  const now = new Date();
  const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);

  return {
    id,
    codigo: '123456',
    expiracion: inTenMinutes.toISOString().slice(0, 16).replace('T', ' '),
  };
}
