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
        setLastSync(data[0] ?? null);
      } catch (err) {
        console.error('Error cargando última sincronización', err);
      } finally {
        setLoadingLastSync(false);
      }
    }

    loadLastSync();
  }, []);

  // ✅ DATOS DEMO FIJOS PARA EL DASHBOARD
  // Esto te asegura que siempre se vea con información en la presentación.
  const dashboardData = {
    tripulantesActivos: 3,
    tripulantesRegistrados: 4,
    dispositivosActivos: 2,
    dispositivosRevocados: 0,
    vuelosRegistrados: 12,
    vuelosProgramados: 10,
    vuelosEnCurso: 1,
    vuelosFinalizados: 0,
    vuelosCancelados: 1,
    tripulantesConAsignacion: 4,
    vuelosSinTripulacion: 2,
    vuelosCriticos: [
      {
        id: 1,
        codigo: 'AA-CBB-SCZ-008',
        ruta: 'CBB → SCZ',
        estado: 'PROGRAMADO',
        disponibles: '55/60',
        ocupacion: '92%',
      },
      {
        id: 2,
        codigo: 'BOA-LPB-CBB-005',
        ruta: 'LPB → CBB',
        estado: 'PROGRAMADO',
        disponibles: '50/70',
        ocupacion: '71%',
      },
      {
        id: 3,
        codigo: 'AA-SCZ-CBB-011',
        ruta: 'SCZ → CBB',
        estado: 'EN_CURSO',
        disponibles: '41/60',
        ocupacion: '68%',
      },
      {
        id: 4,
        codigo: 'LATAM-CBB-SCZ-007',
        ruta: 'CBB → SCZ',
        estado: 'PROGRAMADO',
        disponibles: '22/60',
        ocupacion: '63%',
      },
      {
        id: 5,
        codigo: 'AVIANCA-SCZ-CBB-010',
        ruta: 'SCZ → CBB',
        estado: 'PROGRAMADO',
        disponibles: '19/60',
        ocupacion: '58%',
      },
    ],
  };

  const cardBaseStyle: React.CSSProperties = {
    padding: 16,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: 'white',
  };

  const miniMetricStyle: React.CSSProperties = {
    background: '#f9fafb',
    padding: 14,
    borderRadius: 10,
  };

  const kpiCard = (
    title: string,
    value: string | number,
    subtitle: string
  ) => (
    <div style={cardBaseStyle}>
      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{title}</p>
      <h3 style={{ margin: '8px 0 4px', fontSize: 28, color: '#111827' }}>{value}</h3>
      <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{subtitle}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
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
          <h2 style={{ margin: 0, fontSize: 18 }}>Panel de reportes Logistic</h2>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
            Resumen de tripulantes, vuelos, dispositivos y sincronización.
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

      {/* KPIs */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {kpiCard(
          'Tripulantes activos',
          dashboardData.tripulantesActivos,
          `${dashboardData.tripulantesRegistrados} registrados`
        )}
        {kpiCard(
          'Vuelos registrados',
          dashboardData.vuelosRegistrados,
          'Disponibles en el panel operativo'
        )}
        {kpiCard(
          'Dispositivos activos',
          dashboardData.dispositivosActivos,
          `${dashboardData.dispositivosRevocados} revocados`
        )}
        {kpiCard(
          'Vuelos sin tripulación',
          dashboardData.vuelosSinTripulacion,
          'Requieren revisión administrativa'
        )}
      </section>

      {/* Grid principal */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Reporte operativo */}
        <div style={cardBaseStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Reporte operativo diario
          </p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>
            Estado de vuelos y asignaciones
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6b7280' }}>
            Resumen rápido para apoyar la toma de decisiones del administrador.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
            }}
          >
            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Programados</p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24 }}>
                {dashboardData.vuelosProgramados}
              </h4>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>En curso</p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24 }}>
                {dashboardData.vuelosEnCurso}
              </h4>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Finalizados</p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24 }}>
                {dashboardData.vuelosFinalizados}
              </h4>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Cancelados</p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24 }}>
                {dashboardData.vuelosCancelados}
              </h4>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Tripulantes con asignación
              </p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24 }}>
                {dashboardData.tripulantesConAsignacion}
              </h4>
            </div>

            <div
              style={{
                background: '#fff7ed',
                padding: 14,
                borderRadius: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: '#9a3412' }}>
                Vuelos sin tripulación
              </p>
              <h4 style={{ margin: '6px 0 0', fontSize: 24, color: '#c2410c' }}>
                {dashboardData.vuelosSinTripulacion}
              </h4>
            </div>
          </div>
        </div>

        {/* Card sincronización */}
        <div
          onClick={() => navigate('/admin/sync')}
          style={{
            ...cardBaseStyle,
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
                  <span style={{ color: '#b91c1c' }}>{lastSync.errores} error(es)</span>
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
            <>
              <h3 style={{ margin: '4px 0 4px', fontSize: 18 }}>2025-03-10 03:00</h3>
              <p style={{ margin: 0, fontSize: 13 }}>
                <strong>14</strong> vuelos actualizados ·{' '}
                <span style={{ color: '#166534' }}>sin errores</span>
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Fuente: SerpAPI + Sistema Aerolínea
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
        </div>
      </section>

      {/* Tabla de vuelos críticos + resumen admin */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={cardBaseStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Reporte de ocupación
          </p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>
            Vuelos críticos por ocupación
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6b7280' }}>
            Vuelos con mayor porcentaje de ocupación para revisión rápida.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13 }}>
                    Vuelo
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13 }}>
                    Ruta
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13 }}>
                    Estado
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13 }}>
                    Asientos
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13 }}>
                    Ocupación
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.vuelosCriticos.map((vuelo) => (
                  <tr key={vuelo.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 600 }}>
                      {vuelo.codigo}
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{vuelo.ruta}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{vuelo.estado}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{vuelo.disponibles}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 600 }}>
                      {vuelo.ocupacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={cardBaseStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Resumen administrativo
          </p>
          <h3 style={{ margin: '4px 0 12px', fontSize: 18 }}>
            Indicadores de control
          </h3>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Tripulantes activos
              </p>
              <h4 style={{ margin: '6px 0 4px', fontSize: 24 }}>
                {dashboardData.tripulantesActivos}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                {dashboardData.tripulantesRegistrados} registrados en total
              </p>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Tripulantes con asignación
              </p>
              <h4 style={{ margin: '6px 0 4px', fontSize: 24 }}>
                {dashboardData.tripulantesConAsignacion}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Con vuelo asignado actualmente
              </p>
            </div>

            <div style={miniMetricStyle}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                Dispositivos vinculados
              </p>
              <h4 style={{ margin: '6px 0 4px', fontSize: 24 }}>
                {dashboardData.dispositivosActivos}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                {dashboardData.dispositivosRevocados} revocados
              </p>
            </div>

            <div
              style={{
                background: '#fff7ed',
                padding: 14,
                borderRadius: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: '#9a3412' }}>
                Vuelos sin tripulación
              </p>
              <h4 style={{ margin: '6px 0 4px', fontSize: 24, color: '#c2410c' }}>
                {dashboardData.vuelosSinTripulacion}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#9a3412' }}>
                Requieren atención del administrador
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={cardBaseStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Gestión de tripulantes
          </p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>Tripulantes de cabina</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
            Ver y actualizar datos, estados y accesos QR.
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

        <div style={cardBaseStyle}>
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

        <div style={cardBaseStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            Dispositivos vinculados
          </p>
          <h3 style={{ margin: '4px 0 8px', fontSize: 18 }}>Control de dispositivos</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
            Supervisar dispositivos activos, revocados y accesos vinculados.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/devices')}
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
            Ver dispositivos →
          </button>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;