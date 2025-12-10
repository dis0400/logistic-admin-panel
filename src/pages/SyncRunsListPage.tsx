// src/pages/SyncRunsListPage.tsx
import { useEffect, useState } from 'react';
import type { SyncRun, SyncRunStatus } from '../data/syncRunsMock';
import { getSyncRuns } from '../services/syncRunsService';

function renderEstadoSync(estado: SyncRunStatus) {
  let background = '#e5e7eb';
  let color = '#111827';
  let texto = 'Desconocido';

  if (estado === 'OK') {
    background = '#dcfce7';
    color = '#166534';
    texto = 'Éxito';
  } else if (estado === 'ERROR') {
    background = '#fee2e2';
    color = '#b91c1c';
    texto = 'Error';
  } else if (estado === 'PARCIAL') {
    background = '#fef3c7';
    color = '#92400e';
    texto = 'Parcial';
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
      {texto}
    </span>
  );
}

function SyncRunsListPage() {
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRuns() {
      try {
        setLoading(true);
        setError(null);

        const data = await getSyncRuns();
        setRuns(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las ejecuciones de sincronización.');
      } finally {
        setLoading(false);
      }
    }

    loadRuns();
  }, []);

  const totalEjecuciones = runs.length;
  const exitosas = runs.filter((r) => r.estado === 'OK').length;
  const conError = runs.filter((r) => r.estado === 'ERROR').length;

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
          <h1 style={{ margin: 0 }}>Sincronizaciones (CRON)</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Registro de ejecuciones del microservicio que sincroniza vuelos desde SerpAPI
            (Google Flights) y el sistema interno de la aerolínea.
          </p>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
            minWidth: 240,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Resumen</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Ejecuciones totales: <strong>{totalEjecuciones}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Exitosas: <strong>{exitosas}</strong> · Con error:{' '}
            <strong>{conError}</strong>
          </p>
        </div>
      </header>

      {loading && (
        <p style={{ marginBottom: 12, color: '#6b7280' }}>Cargando ejecuciones...</p>
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
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Fecha / hora
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Origen de datos
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Vuelos (proc./act./cre.)
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Errores
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Estado
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Mensaje
              </th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{run.ejecutadoEn}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{run.origenDatos}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {run.vuelosProcesados} / {run.vuelosActualizados} / {run.vuelosCreados}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{run.errores}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {renderEstadoSync(run.estado)}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{run.mensaje}</td>
              </tr>
            ))}

            {runs.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  Aún no se registraron ejecuciones de sincronización.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SyncRunsListPage;
