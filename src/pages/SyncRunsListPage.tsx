// src/pages/SyncRunsListPage.tsx
import { useEffect, useState } from 'react';
import { getSyncRuns } from '../services/syncRunsService';
import { runSyncOnce } from '../services/cronService';
import type { SyncRunRow } from '../data/syncRunsMock';

function SyncRunsListPage() {
  const [runs, setRuns] = useState<SyncRunRow[]>([]);
  const [loading, setLoading] = useState(true);    // carga de historial
  const [syncing, setSyncing] = useState(false);   // estado del botón
  const [message, setMessage] = useState<string | null>(null);

  async function loadRuns() {
    try {
      setLoading(true);
      const data = await getSyncRuns();
      setRuns(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();
  }, []);

  // Siempre asumimos que runs está ordenado de más reciente a más antiguo.
  const lastRun = runs.length > 0 ? runs[0] : null;

  async function handleForceSync() {
    try {
      setSyncing(true);
      setMessage(null);

      // 👇 Llamamos al microservicio Nest `/cron/run-once`
      await runSyncOnce();

      setMessage('Sincronización ejecutada correctamente.');
      // Luego recargamos el historial desde el backend
      await loadRuns();
    } catch (err) {
      console.error(err);
      setMessage('Ocurrió un error al ejecutar la sincronización.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0 }}>Historial de sincronización (CRON)</h1>

        <button
          onClick={handleForceSync}
          disabled={syncing}
          style={{
            padding: '8px 14px',
            background: syncing ? '#1d4ed8aa' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: syncing ? 'default' : 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {syncing ? 'Sincronizando...' : 'Forzar sincronización ahora'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 4, marginBottom: 12, color: '#374151' }}>
          {message}
        </p>
      )}

      {/* Resumen de la última ejecución */}
      {lastRun && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Última ejecución del microservicio
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>{lastRun.ejecutadoEl}</strong>
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Vuelos actualizados
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>{lastRun.vuelosActualizados}</strong>
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Errores</p>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: lastRun.errores > 0 ? '#b91c1c' : '#166534',
                fontWeight: 600,
              }}
            >
              {lastRun.errores}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
              Fuente de datos
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>{lastRun.fuente}</p>
          </div>
        </div>
      )}

      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Registros del microservicio que sincroniza vuelos desde SerpAPI y el
        sistema interno. Si el backend está apagado, esta tabla puede aparecer
        vacía.
      </p>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          background: 'white',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: 10, textAlign: 'left' }}>Ejecutado el</th>
              <th style={{ padding: 10, textAlign: 'left' }}>
                Vuelos actualizados
              </th>
              <th style={{ padding: 10, textAlign: 'left' }}>Errores</th>
              <th style={{ padding: 10, textAlign: 'left' }}>
                Fuente de datos
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} style={{ padding: 12, textAlign: 'center' }}>
                  Cargando...
                </td>
              </tr>
            )}

            {!loading &&
              runs.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 10 }}>{r.ejecutadoEl}</td>
                  <td style={{ padding: 10 }}>{r.vuelosActualizados}</td>
                  <td
                    style={{
                      padding: 10,
                      color: r.errores > 0 ? '#b91c1c' : '#166534',
                    }}
                  >
                    {r.errores}
                  </td>
                  <td style={{ padding: 10 }}>{r.fuente}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SyncRunsListPage;
