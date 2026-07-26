// src/services/flightService.ts
// ===============================
// MODO DEMO – SOLO FRONTEND
// Usa flightsMock (igual que App-tsis)
// ===============================

import { flightsMock } from '../data/flightsMock';
import type { FlightRow, FlightAdmin } from '../data/flightsMock';

// ===============================
// LISTADO DE VUELOS (tabla)
// ===============================
export async function getFlights(): Promise<FlightRow[]> {
  // simulamos async para que la UI se comporte igual
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        flightsMock.map((f) => ({
          id: f.id,
          codigoVuelo: f.codigoVuelo,
          origen: f.origen,
          destino: f.destino,
          fecha: f.fecha,
          tipo: f.tipo,
          estado: f.estado,
          tripulantesAsignados: f.tripulantesAsignados,
          asientosDisponibles: f.asientosDisponibles,
          asientosTotales: f.asientosTotales,
        }))
      );
    }, 300);
  });
}

// ===============================
// DETALLE DE UN VUELO
// ===============================
export async function getFlightById(
  id: number
): Promise<FlightAdmin | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const flight = flightsMock.find((f) => f.id === id);
      resolve(flight ?? null);
    }, 300);
  });
}
