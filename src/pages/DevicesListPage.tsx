// src/pages/DevicesListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Device, DeviceStatus } from '../data/devicesMock';
import { getDevices, updateDeviceStatus } from '../services/devicesService';

type FiltroEstado = DeviceStatus | 'TODOS';
type FiltroPlataforma = 'TODAS' | 'Android' | 'iOS';

function renderEstadoDispositivo(estado: DeviceStatus) {
  let background = '#e5e7eb';
  let color = '#111827';

  if (estado === 'ACTIVO') {
    background = '#dcfce7';
    color = '#166534';
  } else if (estado === 'SUSPENDIDO') {
    background = '#fef3c7';
    color = '#92400e';
  } else if (estado === 'REVOCADO') {
    background = '#fee2e2';
    color = '#b91c1c';
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

function DevicesListPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('TODOS');
  const [filtroPlataforma, setFiltroPlataforma] = useState<FiltroPlataforma>('TODAS');
  const [filtroTripulante, setFiltroTripulante] = useState<string>('');

  useEffect(() => {
    async function loadDevices() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDevices();
        setDevices(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los dispositivos.');
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

  const devicesFiltrados = useMemo(() => {
    return devices.filter((d) => {
      if (filtroEstado !== 'TODOS' && d.estado !== filtroEstado) return false;
      if (filtroPlataforma !== 'TODAS' && d.plataforma !== filtroPlataforma) return false;
      if (
        filtroTripulante &&
        !d.tripulanteNombre.toLowerCase().includes(filtroTripulante.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [devices, filtroEstado, filtroPlataforma, filtroTripulante]);

  async function handleChangeStatus(device: Device, newStatus: DeviceStatus) {
    const confirmado = window.confirm(
      `¿Seguro que quieres cambiar el estado del dispositivo "${device.nombre}" a "${newStatus}"?`
    );
    if (!confirmado) return;

    try {
      const actualizado = await updateDeviceStatus(device.id, newStatus);
      if (!actualizado) {
        alert('No se pudo actualizar el dispositivo (mock).');
        return;
      }
      setDevices((prev) =>
        prev.map((d) => (d.id === actualizado.id ? actualizado : d))
      );
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al actualizar el dispositivo.');
    }
  }

  const total = devices.length;
  const activos = devices.filter((d) => d.estado === 'ACTIVO').length;

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
          <h1 style={{ margin: 0 }}>Dispositivos de tripulantes</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Gestión de dispositivos móviles registrados para el acceso a la app de tripulantes.
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
            Dispositivos totales: <strong>{total}</strong>
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Activos: <strong>{activos}</strong>
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
              <option value="ACTIVO">Activo</option>
              <option value="SUSPENDIDO">Suspendido</option>
              <option value="REVOCADO">Revocado</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Plataforma</label>
            <select
              value={filtroPlataforma}
              onChange={(e) => setFiltroPlataforma(e.target.value as FiltroPlataforma)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            >
              <option value="TODAS">Todas</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
            <label style={{ fontSize: 12, marginBottom: 4 }}>Tripulante</label>
            <input
              type="text"
              placeholder="Buscar por nombre de tripulante..."
              value={filtroTripulante}
              onChange={(e) => setFiltroTripulante(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFiltroEstado('TODOS');
              setFiltroPlataforma('TODAS');
              setFiltroTripulante('');
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
        <p style={{ marginBottom: 12, color: '#6b7280' }}>Cargando dispositivos...</p>
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
                Dispositivo
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Plataforma / modelo
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Tripulante
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Registrado
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Último acceso
              </th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                Estado
              </th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: 14 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {devicesFiltrados.map((d) => (
              <tr key={d.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{d.nombre}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {d.plataforma} · {d.modelo}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {d.tripulanteNombre}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{d.registradoEl}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>{d.ultimoAcceso}</td>
                <td style={{ padding: '8px 12px', fontSize: 14 }}>
                  {renderEstadoDispositivo(d.estado)}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                  {d.estado !== 'SUSPENDIDO' && (
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        borderRadius: 8,
                        border: '1px solid #fbbf24',
                        background: '#fef3c7',
                        cursor: 'pointer',
                        fontSize: 12,
                        marginRight: 8,
                      }}
                      onClick={() => handleChangeStatus(d, 'SUSPENDIDO')}
                    >
                      Suspender
                    </button>
                  )}

                  {d.estado !== 'REVOCADO' && (
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        borderRadius: 8,
                        border: '1px solid #fecaca',
                        background: '#fee2e2',
                        cursor: 'pointer',
                        fontSize: 12,
                        marginRight: 8,
                      }}
                      onClick={() => handleChangeStatus(d, 'REVOCADO')}
                    >
                      Revocar
                    </button>
                  )}

                  {d.estado !== 'ACTIVO' && (
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        borderRadius: 8,
                        border: '1px solid #bbf7d0',
                        background: '#dcfce7',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                      onClick={() => handleChangeStatus(d, 'ACTIVO')}
                    >
                      Reactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {devicesFiltrados.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No se encontraron dispositivos con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DevicesListPage;
