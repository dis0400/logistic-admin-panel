// src/services/flightService.ts
// Se encarga de hablar con el backend (microservicio de vuelos)

import type { FlightRow, FlightAdmin, FlightStatus } from '../data/flightsMock';

// ✅ Si luego quieres, lo pasas a .env (VITE_API_URL)
// Por ahora lo dejamos fijo para demo:
const API_BASE_URL = 'http://localhost:3001';

// Lo que devuelve TU backend demo: GET /vuelos
type ApiVuelo = {
  id: number;
  origen: string;
  destino: string;
  horaSalidaUTC: string;
  horaLlegadaUTC: string;
  aerolinea: string;
  avion: string;
  tipoVuelo: string;
  nombreTripulante?: string; // no lo usas en web, pero puede venir
};

const ESTADOS: FlightStatus[] = ['PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'];

function toFechaYYYYMMDD(isoUTC: string): string {
  // iso viene tipo "2025-12-14T10:00:00Z"
  // sacamos solo YYYY-MM-DD
  return isoUTC?.slice(0, 10) || '2025-12-18';
}

function buildCodigoVuelo(v: ApiVuelo): string {
  // Ej: BO101, OB201… si no viene, lo generamos
  return `FL-${String(v.id).padStart(4, '0')}`;
}

function mapApiVueloToRow(v: ApiVuelo, index: number): FlightRow {
  // Datos “demo” para el panel
  const tripulantes = 5; // dotación mínima que manejas en UI
  const asientosTotales = 60;

  // si tuvieras disponibilidad real en bdd, aquí lo usarías
  const asientosDisponibles = 40;

  return {
    id: v.id, // ✅ importante: id estable
    codigoVuelo: buildCodigoVuelo(v),
    origen: v.origen ?? 'LPB',
    destino: v.destino ?? 'CBB',
    fecha: toFechaYYYYMMDD(v.horaSalidaUTC),
    tipo: v.tipoVuelo ?? 'DEMO',

    // Estado demo, para que tu filtro tenga variedad
    estado: ESTADOS[index % ESTADOS.length],

    tripulantesAsignados: tripulantes,
    asientosDisponibles,
    asientosTotales,
  };
}

export async function getFlights(): Promise<FlightRow[]> {
  const res = await fetch(`${API_BASE_URL}/vuelos`);

  if (!res.ok) {
    throw new Error(`Error al obtener vuelos desde el backend: ${res.status}`);
  }

  const apiVuelos: ApiVuelo[] = await res.json();
  return apiVuelos.map(mapApiVueloToRow);
}

export async function getFlightById(id: number): Promise<FlightAdmin | null> {
  // Modo simple: pedir todos y filtrar (demo)
  const rows = await getFlights();
  const row = rows.find((r) => r.id === id);

  if (!row) return null;

  // Para el detalle, puedes reconstruir salida/llegada en base a la lista real
  // (volvemos a pedir y buscamos ese id real)
  const res = await fetch(`${API_BASE_URL}/vuelos`);
  if (!res.ok) throw new Error(`Error al obtener vuelo por id (lista): ${res.status}`);
  const apiVuelos: ApiVuelo[] = await res.json();
  const v = apiVuelos.find((x) => x.id === id);

  const flightAdmin: FlightAdmin = {
    ...row,
    avion: v?.avion ?? 'Boeing 737-800',
    salidaUTC: v?.horaSalidaUTC ?? `${row.fecha}T10:00:00Z`,
    llegadaUTC: v?.horaLlegadaUTC ?? `${row.fecha}T11:00:00Z`,
  };

  return flightAdmin;
}


// // src/services/flightService.ts
// // Se encarga de hablar con el backend (microservicio de vuelos)

// import type { FlightRow, FlightAdmin, FlightStatus } from '../data/flightsMock';

// const API_BASE_URL = 'http://localhost:3001';

// // Tipo que representa exactamente lo que devuelve el backend
// // en GET http://localhost:3000/flights
// type ApiFlight = {
//   id: string;
//   codigoVuelo: string;
//   origen: string;
//   destino: string;
//   fecha: string;
//   tipo: string;
//   estado: string;
//   tripulantesAsignados: number;
//   asientosDisponibles: number;
//   asientosTotales: number;
// };

// /**
//  * Mapea el vuelo que viene del backend
//  * al formato que usa la tabla del panel (FlightRow).
//  */
// function mapApiFlightToRow(apiFlight: ApiFlight, index: number): FlightRow {
//   return {
//     // id interno solo para el panel
//     id: index + 1,
//     codigoVuelo: apiFlight.codigoVuelo ?? `FL-${index + 1}`,
//     origen: apiFlight.origen ?? 'LPB',
//     destino: apiFlight.destino ?? 'CBB',
//     fecha: apiFlight.fecha ?? '2025-12-18',
//     tipo: apiFlight.tipo ?? 'DEMO',
//     estado: (apiFlight.estado as FlightStatus) ?? 'PROGRAMADO',
//     tripulantesAsignados: apiFlight.tripulantesAsignados ?? 5,
//     asientosDisponibles: apiFlight.asientosDisponibles ?? 40,
//     asientosTotales: apiFlight.asientosTotales ?? 60,
//   };
// }

// /**
//  * Obtiene TODOS los vuelos desde el backend
//  * y los mapea a FlightRow para la tabla de la vista VuelosListPage.
//  */
// export async function getFlights(): Promise<FlightRow[]> {
//   const res = await fetch(`${API_BASE_URL}/flights`);

//   if (!res.ok) {
//     throw new Error('Error al obtener vuelos desde el backend');
//   }

//   const apiFlights: ApiFlight[] = await res.json();
//   return apiFlights.map(mapApiFlightToRow);
// }

// /**
//  * Obtiene UN vuelo por id (id interno de la tabla) y
//  * lo adapta al formato FlightAdmin que usa FlightDetailPage.
//  *
//  * De momento el backend no tiene endpoint /flights/:id,
//  * así que volvemos a pedir la lista completa y filtramos.
//  */
// export async function getFlightById(id: number): Promise<FlightAdmin | null> {
//   const rows = await getFlights();
//   const row = rows.find((r) => r.id === id);

//   if (!row) {
//     return null;
//   }

//   // Aquí agregamos los campos extra que necesita FlightDetailPage.
//   // Más adelante estos valores vendrán también del backend.
//   const flightAdmin: FlightAdmin = {
//     ...row,
//     avion: 'Boeing 737-800',
//     salidaUTC: '2025-12-18T10:00:00Z',
//     llegadaUTC: '2025-12-18T11:00:00Z',
//   };

//   return flightAdmin;
// }
