// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSyncRuns } from '../services/syncRunsService';
import type { SyncRunRow } from '../data/syncRunsMock';

function DashboardPage() {
  const navigate = useNavigate();

  const [lastSync, setLastSync] = useState<SyncRunRow | null>(null);
  const [loadingLastSync, setLoadingLastSync] = useState<boolean>(false);

  useEffect(() => {
    async function loadLastSync() {
      try {
        setLoadingLastSync(true);
        const data = await getSyncRuns();
        setLastSync(data[0] ?? null); // asumimos que vienen ordenados desc
      } catch (err) {
        console.error('Error cargando última sincronización', err);
      } finally {
        setLoadingLastSync(false);
      }
    }

    loadLastSync();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header propio del Dashboard */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Application</p>
          <h1 style={{ margin: 0, fontSize: 24 }}>Dashboard</h1>
        </div>

        <input
          placeholder="Buscar..."
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid #d1d5db',
            fontSize: 13,
            minWidth: 220,
          }}
        />
      </header>

      {/* Banner superior */}
      <section
        style={{
          marginBottom: 20,
          padding: 16,
          borderRadius: 12,
          background: '#1d4ed8',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Panel de operaciones Logistic</h2>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
            Resumen de tripulantes, vuelos y sincronización con SerpAPI.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/vuelos')}
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            border: 'none',
            background: 'white',
            color: '#1d4ed8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Ver vuelos de hoy →
        </button>
      </section>

      {/* Grid de tarjetas principales */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Card tripulantes */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Gestión de tripulantes
          </p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>Tripulantes de cabina</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
            Ver y actualizar datos, estados (activo / baja) y accesos QR.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/tripulantes')}
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: 'white',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Ir a gestión de tripulantes →
          </button>
        </div>

        {/* Card vuelos */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Gestión de vuelos</p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>Vuelos de la aerolínea</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
            Revisar vuelos sincronizados, estados y dotación de tripulantes.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/vuelos')}
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: 'white',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Ir a gestión de vuelos →
          </button>
        </div>

        {/* Card sincronización (última ejecución) */}
        <div
          onClick={() => navigate('/admin/sync')}
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Última sincronización (CRON)
          </p>

          {loadingLastSync && (
            <p style={{ margin: '4px 0 0', fontSize: 14 }}>
              Cargando información...
            </p>
          )}

          {!loadingLastSync && lastSync && (
            <>
              <h3 style={{ margin: '4px 0 4px', fontSize: 18 }}>
                {lastSync.ejecutadoEl}
              </h3>
              <p style={{ margin: 0, fontSize: 13 }}>
                <strong>{lastSync.vuelosActualizados}</strong> vuelos actualizados ·{' '}
                {lastSync.errores > 0 ? (
                  <span style={{ color: '#b91c1c' }}>
                    {lastSync.errores} error(es)
                  </span>
                ) : (
                  <span style={{ color: '#166534' }}>sin errores</span>
                )}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Fuente: {lastSync.fuente}
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 12,
                  color: '#2563eb',
                  fontWeight: 500,
                }}
              >
                Ver historial de sincronización →
              </p>
            </>
          )}

          {!loadingLastSync && !lastSync && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
              Todavía no hay ejecuciones registradas.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
