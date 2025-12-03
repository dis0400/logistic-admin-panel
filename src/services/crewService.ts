// src/services/crewService.ts
import api from './api';
import type { CrewMember, CrewStatus } from '../data/crewMock';
import { crewMock } from '../data/crewMock';

// Lista de tripulantes
export async function getCrewMembers(): Promise<CrewMember[]> {
  // TODO backend real:
  // const res = await api.get<CrewMember[]>('/admin/crew-members');
  // return res.data;

  return crewMock;
}

// Detalle de tripulante
export async function getCrewMemberById(id: number): Promise<CrewMember | null> {
  // TODO backend real:
  // const res = await api.get<CrewMember>(`/admin/crew-members/${id}`);
  // return res.data;

  const all = await getCrewMembers();
  return all.find((c) => c.id === id) ?? null;
}

// 🔹 NUEVO: actualizar estado del tripulante (ACTIVO / BAJA_TEMPORAL / BAJA)
export async function updateCrewMemberStatus(
  id: number,
  newStatus: CrewStatus
): Promise<void> {
  // TODO backend real (NestJS):
  // await api.patch(`/admin/crew-members/${id}/status`, { status: newStatus });

  // Por ahora: simulamos una llamada exitosa (mock)
  console.log(`[MOCK] updateCrewMemberStatus(${id}, ${newStatus})`);
}

// 🔹 NUEVO: generar código de acceso (para futuro backend)
export type GeneratedLoginCodeResponse = {
  code: string;
  expiresAt: string;
};

export async function generateLoginCodeForCrewMember(
  id: number
): Promise<GeneratedLoginCodeResponse> {
  // TODO backend real:
  // const res = await api.post<GeneratedLoginCodeResponse>(`/admin/crew-members/${id}/login-codes`);
  // return res.data;

  // Mock de ejemplo (no lo estamos usando todavía, pero queda listo)
  const now = new Date();
  const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);

  return {
    code: '123456',
    expiresAt: inTenMinutes.toISOString().slice(0, 16).replace('T', ' '),
  };
}
