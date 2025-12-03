// src/pages/FlightDetailPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FlightAdmin, FlightStatus } from '../data/flightsMock';
import { getFlightById } from '../services/flightService';
import {
  crewAvailableMock,
  initialAssignedMock,
  type CrewAssignment,
} from '../data/crewAssignmentsMock';

function renderEstadoVuelo(estado: FlightStatus) {
  let background = '#e5e7eb';
  let color = '#111827';

  if (estado === 'PROGRAMADO') {
    background = '#dbeafe';
    color = '#1d4ed8';
  } else if (estado === 'EN_CURSO') {
    background = '#fef3c7';
    color = '#92400e';
  } else if (estado === 'FINALIZADO') {
    background = '#dcfce7';
    color = '#166534';
  } else if (estado === 'CANCELADO') {
    background = '#fee2e2';
    color = '#991b1b';
  }

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: 999,
        background,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {estado}
    </span>
  );
}

function formatRuta(origen: string, destino: string) {
  return `${origen} → ${destino}`;
}

function FlightDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [flight, setFlight] = useState<FlightAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 estados para asignación de tripulantes
  const [disponibles, setDisponibles] = useState<CrewAssignment[]>(crewAvailableMock);
  const [asignados, setAsignados] = useState<CrewAssignment[]>(initialAssignedMock);

  const flightId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(flightId)) {
      setError('ID de vuelo inválido.');
      setLoading(false);
      return;
    }

    async function loadFlight() {
      try {
        setLoading(true);
        setError(null);

        const data = await getFlightById(flightId);
        if (!data) {
          setError('No se encontró el vuelo.');
        } else {
          setFlight(data);
        }
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al cargar el vuelo.');
      } finally {
        setLoading(false);
      }
    }

    loadFlight();
  }, [flightId]);

  // 🔹 funciones para mover tripulantes entre listas
  function asignarTripulante(trip: CrewAssignment) {
    setDisponibles((prev) => prev.filter((t) => t.id !== trip.id));
    setAsignados((prev) => [...prev, trip]);
  }

  function removerTripulante(trip: CrewAssignment) {
    setAsignados((prev) => prev.filter((t) => t.id !== trip.id));
    setDisponibles((prev) => [...prev, trip]);
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 16,
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
        <p>Cargando vuelo...</p>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div style={{ padding: 24 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 16,
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
        <p style={{ color: '#b91c1c' }}>{error ?? 'No se encontró el vuelo.'}</p>
      </div>
    );
  }

  // Mock de info de sincronización (luego vendrá de la bdd)
  const ultimaSync = '2025-03-10 03:00';
  const proximaSync = '2025-03-10 09:00';
  const origenDatos = 'SerpAPI (Google Flights) + sistema interno de la aerolínea';

  return (
    <div style={{ padding: 24 }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 16,
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid #d1d5db',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        ← Volver
      </button>

      {/* Header principal */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Vuelo {flight.codigoVuelo} · {formatRuta(flight.origen, flight.destino)}
          </h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Fecha {flight.fecha} · Avión {flight.avion} · Tipo {flight.tipo}
          </p>
        </div>
        <div>{renderEstadoVuelo(flight.estado)}</div>
      </header>

      {/* Info general */}
      <section
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: 'white',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Información general</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            fontSize: 14,
          }}
        >
          <div>
            <p style={{ margin: 0, color: '#6b7280' }}>Salida (UTC)</p>
            <p style={{ margin: 0 }}>{flight.salidaUTC}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280' }}>Llegada (UTC)</p>
            <p style={{ margin: 0 }}>{flight.llegadaUTC}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280' }}>Tripulación asignada</p>
            <p style={{ margin: 0 }}>{flight.tripulantesAsignados} tripulantes</p>
          </div>
          <div>
            <p style={{ margin: 0, color: '#6b7280' }}>Asientos</p>
            <p style={{ margin: 0 }}>
              {flight.asientosDisponibles} disponibles de {flight.asientosTotales}
            </p>
          </div>
        </div>
      </section>

      {/* Asignación de tripulantes */}
      <section
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: 'white',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Asignación de tripulación</h2>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#6b7280', fontSize: 14 }}>
          El administrador puede asignar o remover tripulantes para este vuelo.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {/* Izquierda: disponibles */}
          <div
            style={{
              flex: 1,
              minWidth: 300,
              padding: 12,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Disponibles</h3>
            {disponibles.length === 0 && (
              <p style={{ color: '#6b7280' }}>No hay tripulantes disponibles.</p>
            )}

            {disponibles.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: 8,
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <span>
                  <strong>{t.nombre}</strong> — {t.rol} · Base {t.base}
                </span>
                <button
                  type="button"
                  style={{
                    padding: '4px 8px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                  onClick={() => asignarTripulante(t)}
                >
                  Asignar →
                </button>
              </div>
            ))}
          </div>

          {/* Derecha: asignados */}
          <div
            style={{
              flex: 1,
              minWidth: 300,
              padding: 12,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Asignados</h3>
            {asignados.length === 0 && (
              <p style={{ color: '#6b7280' }}>No hay tripulantes asignados.</p>
            )}

            {asignados.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: 8,
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <span>
                  <strong>{t.nombre}</strong> — {t.rol} · Base {t.base}
                </span>
                <button
                  type="button"
                  style={{
                    padding: '4px 8px',
                    borderRadius: 8,
                    border: '1px solid #fecaca',
                    background: '#fee2e2',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                  onClick={() => removerTripulante(t)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sincronización con sistema externo */}
      <section
        style={{
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: 'white',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Sincronización de datos</h2>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Origen de datos:</strong> {origenDatos}
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Última sincronización (CRON):</strong> {ultimaSync}
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Próxima sincronización estimada:</strong> {proximaSync}
        </p>
        <p style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>
          Más adelante, estos valores se leerán desde una tabla de auditoría en la base de datos,
          donde el microservicio de sincronización registrará cada ejecución de CRON
          (hora, cantidad de vuelos actualizados, errores, etc.).
        </p>
      </section>
    </div>
  );
}

export default FlightDetailPage;
