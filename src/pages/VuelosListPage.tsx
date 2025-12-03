// src/pages/VuelosListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FlightAdmin, FlightStatus } from '../data/flightsMock';
import { getFlights } from '../services/flightService';

type FiltroEstado = FlightStatus | 'TODOS';

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

function VuelosListPage() {
  const navigate = useNavigate();

  const [vuelos, setVuelos] = useState<FlightAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroFecha, setFiltroFecha] = useState<string>(''); // yyyy-mm-dd
  const [filtroOrigen, setFiltroOrigen] = useState<string>('');
  const [filtroDestino, setFiltroDestino] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('TODOS');

  useEffect(() => {
    async function loadVuelos() {
      try {
        setLoading(true);
        setError(null);

        const data = await getFlights();
        setVuelos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los vuelos.');
      } finally {
        setLoading(false);
      }
    }

    loadVuelos();
  }, []);

  const vuelosFiltrados = useMemo(() => {
    return vuelos.filter((vuelo) => {
      if (filtroFecha && vuelo.fecha !== filtroFecha) return false;
      if (filtroOrigen && !vuelo.origen.toLowerCase().includes(filtroOrigen.toLowerCase()))
        return false;
      if (filtroDestino && !vuelo.destino.toLowerCase().includes(filtroDestino.toLowerCase()))
        return false;
      if (filtroEstado !== 'TODOS' && vuelo.estado !== filtroEstado) return false;
      return true;
    });
  }, [vuelos, filtroFecha, filtroOrigen, filtroDestino, filtroEstado]);

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Vuelos de la aerolínea</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Visualización de vuelos sincronizados desde el sistema de la aerolínea
            (CRON + API externa).
          </p>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
            minWidth: 220,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Resumen rápido</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Vuelos totales: <strong>{vuelos.length}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Filtrados: <strong>{vuelosFiltrados.length}</strong>
          </p>
        </div>
      </header>

      {/* Filtros */}
      <section
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: 'white',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>Filtros</h2>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Origen</label>
            <input
              type="text"
              placeholder="LPB, CBB..."
              value={filtroOrigen}
              onChange={(e) => setFiltroOrigen(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Destino</label>
            <input
              type="text"
              placeholder="VVI, MIA..."
              value={filtroDestino}
              onChange={(e) => setFiltroDestino(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            >
              <option value="TODOS">Todos</option>
              <option value="PROGRAMADO">Programado</option>
              <option value="EN_CURSO">En curso</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setFiltroFecha('');
              setFiltroOrigen('');
              setFiltroDestino('');
              setFiltroEstado('TODOS');
            }}
            style={{
              alignSelf: 'flex-end',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {loading && (
        <p style={{ marginBottom: 12, color: '#6b7280' }}>Cargando vuelos...</p>
      )}
      {error && (
        <p style={{ marginBottom: 12, color: '#b91c1c' }}>{error}</p>
      )}

      <div
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          background: 'white',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Código</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Ruta</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Tipo</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Tripulación</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Asientos (disp./tot.)
              </th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: 14 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {vuelosFiltrados.map((vuelo) => (
              <tr key={vuelo.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{vuelo.fecha}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{vuelo.codigoVuelo}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {formatRuta(vuelo.origen, vuelo.destino)}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{vuelo.tipo}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {renderEstadoVuelo(vuelo.estado)}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {vuelo.tripulantesAsignados} tripulantes
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {vuelo.asientosDisponibles}/{vuelo.asientosTotales}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                  <button
                    type="button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                    onClick={() => navigate(`/admin/vuelos/${vuelo.id}`)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {vuelosFiltrados.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No se encontraron vuelos con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VuelosListPage;
