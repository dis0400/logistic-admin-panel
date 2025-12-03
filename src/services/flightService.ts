// src/services/flightService.ts
import api from './api';
import type { FlightAdmin } from '../data/flightsMock';
import { flightsMock } from '../data/flightsMock';

// Listar vuelos
export async function getFlights(): Promise<FlightAdmin[]> {
  // TODO backend real:
  // const res = await api.get<FlightAdmin[]>('/admin/flights');
  // return res.data;

  // Por ahora: mock
  return flightsMock;
}

// Detalle de vuelo
export async function getFlightById(id: number): Promise<FlightAdmin | null> {
  // TODO backend real:
  // const res = await api.get<FlightAdmin>(`/admin/flights/${id}`);
  // return res.data;

  const all = await getFlights();
  return all.find((f) => f.id === id) ?? null;
}
