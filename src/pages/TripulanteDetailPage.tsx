import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CrewStatus, CrewMember } from '../data/crewMock';
import { getCrewMemberById, updateCrewMemberStatus } from '../services/crewService';
import QRCode from 'react-qr-code';
import {
  type CrewDevice,
  type DeviceStatus,
} from '../data/crewDevicesMock';
import {
  getDevicesByCrewId,
  updateDeviceStatus,
} from '../services/crewDeviceService';



type TabKey = 'resumen' | 'dispositivos' | 'accesos';

type LoginCodeStatus = 'VIGENTE' | 'USADO' | 'EXPIRADO';
type LoginCodeType = 'NUMERIC_CODE' | 'QR_TOKEN';

type LoginCode = {
  id: number;
  code: string;
  tipo: LoginCodeType;
  status: LoginCodeStatus;
  createdAt: string;
  expiresAt: string;
};


function renderEstado(estado: CrewStatus) {
  let background = '#e5e7eb';
  let color = '#111827';

  if (estado === 'ACTIVO') {
    background = '#dcfce7';
    color = '#166534';
  } else if (estado === 'BAJA_TEMPORAL') {
    background = '#fef3c7';
    color = '#92400e';
  } else if (estado === 'BAJA') {
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
        textTransform: 'capitalize',
      }}
    >
      {estado.replace('_', ' ')}
    </span>
  );
}

function renderLoginStatus(status: LoginCodeStatus) {
  let background = '#e5e7eb';
  let color = '#111827';

  if (status === 'VIGENTE') {
    background = '#dcfce7';
    color = '#166534';
  } else if (status === 'USADO') {
    background = '#dbeafe';
    color = '#1d4ed8';
  } else if (status === 'EXPIRADO') {
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
      {status}
    </span>
  );
}

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


function generateNumericCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function TripulanteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<TabKey>('resumen');

  const [loginCodes, setLoginCodes] = useState<LoginCode[]>([
    {
      id: 1,
      code: '482913',
      tipo: 'NUMERIC_CODE',
      status: 'USADO',
      createdAt: '2025-02-20 10:15',
      expiresAt: '2025-02-20 10:25',
    },
    {
      id: 2,
      code: 'QR_TOKEN_ABC123',
      tipo: 'QR_TOKEN',
      status: 'EXPIRADO',
      createdAt: '2025-02-18 09:00',
      expiresAt: '2025-02-18 09:10',
    },
  ]);

  const [tipoLoginSeleccionado, setTipoLoginSeleccionado] =
  useState<LoginCodeType>('NUMERIC_CODE');

  const [qrActual, setQrActual] = useState<string | null>(null);

  const [tripulante, setTripulante] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [devices, setDevices] = useState<CrewDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);


  const crewId = Number(id);

    useEffect(() => {
    if (!Number.isFinite(crewId)) {
      setError('ID de tripulante inválido.');
      setLoading(false);
      return;
    }

    async function loadTripulante() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCrewMemberById(crewId);
        if (!data) {
          setError('No se encontró el tripulante.');
        } else {
          setTripulante(data);
        }
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al cargar el tripulante.');
      } finally {
        setLoading(false);
      }
    }

    loadTripulante();
  }, [crewId]);

      useEffect(() => {
      if (!Number.isFinite(crewId)) return;

      async function loadDevices() {
        try {
          setLoadingDevices(true);
          const data = await getDevicesByCrewId(crewId);
          setDevices(data);
        } catch (err) {
          console.error('Error cargando dispositivos', err);
        } finally {
          setLoadingDevices(false);
        }
      }

      loadDevices();
    }, [crewId]);




  function handleGenerateLoginCode() {
  const now = new Date();
  const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);

  let code: string;

  if (tipoLoginSeleccionado === 'NUMERIC_CODE') {
    // Código numérico de 6 dígitos
    code = generateNumericCode(6);
  } else {
    // Token tipo QR (string más “rara”)
    const randomPart = generateNumericCode(6);
    code = `QR_TOKEN_${randomPart}`;
  }

  const newLoginCode: LoginCode = {
    id: loginCodes.length + 1,
    code,
    tipo: tipoLoginSeleccionado,
    status: 'VIGENTE',
    createdAt: now.toISOString().slice(0, 16).replace('T', ' '),
    expiresAt: inTenMinutes.toISOString().slice(0, 16).replace('T', ' '),
  };

  setLoginCodes((prev) => [newLoginCode, ...prev]);

  if (tipoLoginSeleccionado === 'QR_TOKEN') {
    setQrActual(code);
  }

  const tipoTexto =
    tipoLoginSeleccionado === 'NUMERIC_CODE'
      ? 'Código numérico'
      : 'Token para QR';

  alert(
    `Nuevo ${tipoTexto} generado para ${tripulante!.nombre}:\n\n` +
      `Código/Token: ${code}\n` +
      `Válido hasta: ${newLoginCode.expiresAt}\n\n` +
      `Más adelante este botón llamará a la API real para generar el código y el QR.`
  );
}

async function handleSuspenderDevice(device: CrewDevice) {
  try {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === device.id ? { ...d, estado: 'SUSPENDIDO' } : d
      )
    );

    await updateDeviceStatus(device.id, 'SUSPENDIDO');
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al suspender el dispositivo.');
  }
}

async function handleRevocarDevice(device: CrewDevice) {
  if (
    !window.confirm(
      '¿Seguro que quieres revocar este dispositivo? El tripulante deberá volver a iniciar sesión con un nuevo código/QR.'
    )
  ) {
    return;
  }

  try {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === device.id ? { ...d, estado: 'REVOCADO' } : d
      )
    );

    await updateDeviceStatus(device.id, 'REVOCADO');
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al revocar el dispositivo.');
  }
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
        <p>Cargando tripulante...</p>
      </div>
    );
  }

  if (error || !tripulante) {
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
        <p style={{ color: '#b91c1c' }}>{error ?? 'No se encontró el tripulante.'}</p>
      </div>
    );
  }

    // Cambiar estado del tripulante (solo frontend por ahora)
    async function handleChangeEstado(newEstado: CrewStatus) {
    if (!tripulante) return;

    try {
      // 1) Actualizamos visualmente en la UI
      setTripulante((prev) => (prev ? { ...prev, estado: newEstado } : prev));

      // 2) Llamamos al servicio (mock ahora, API real después)
      await updateCrewMemberStatus(tripulante.id, newEstado);

      alert(
        `Estado actualizado a ${newEstado.replace('_', ' ')}.\n\n` +
          'Cuando el backend esté listo, este cambio se guardará en la base de datos.'
      );
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al intentar actualizar el estado en el backend.');
    }
  }



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

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
              <section
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: 'white',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Gestión de estado del tripulante</h2>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#6b7280', fontSize: 14 }}>
          Como administrador puedes marcar al tripulante como activo, en baja temporal
          o en baja definitiva. Más adelante este cambio se guardará en la base de datos.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleChangeEstado('ACTIVO')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #16a34a',
              background: '#dcfce7',
              color: '#166534',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Marcar como ACTIVO
          </button>

          <button
            type="button"
            onClick={() => handleChangeEstado('BAJA_TEMPORAL')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #f59e0b',
              background: '#fef3c7',
              color: '#92400e',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Baja TEMPORAL
          </button>

          <button
            type="button"
            onClick={() => handleChangeEstado('BAJA')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #ef4444',
              background: '#fee2e2',
              color: '#991b1b',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Baja DEFINITIVA
          </button>
        </div>
      </section>


        <div>
          <h1 style={{ margin: 0 }}>{tripulante.nombre}</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {tripulante.rol} · Código {tripulante.codigo} · Base {tripulante.base}
          </p>
        </div>
        <div>{renderEstado(tripulante.estado)}</div>
      </header>

      <div
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid #e5e7eb',
          marginBottom: 16,
        }}
      >
        {[
          { key: 'resumen', label: 'Resumen' },
          { key: 'dispositivos', label: 'Dispositivos' },
          { key: 'accesos', label: 'Accesos (código / QR)' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabKey)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom:
                activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#111827' : '#6b7280',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'resumen' && (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 16,
            background: 'white',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Resumen del tripulante</h2>
          <ul>
            <li>Aquí más adelante mostraremos últimos vuelos asignados.</li>
            <li>Horas acumuladas en el periodo.</li>
            <li>Estadísticas relevantes para programación de rutas.</li>
          </ul>
        </div>
      )}

      {activeTab === 'dispositivos' && (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 16,
            background: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0 }}>Dispositivos registrados</h2>
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
              onClick={() => {
                alert('Aquí luego podrás registrar manualmente un nuevo dispositivo.');
              }}
            >
              + Registrar dispositivo
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                  Dispositivo
                </th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                  Estado
                </th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                  Registrado el
                </th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: 14 }}>
                  Acciones
                </th>
              </tr>
            </thead>
                 <tbody>
                  {loadingDevices && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: '8px 12px',
                          fontSize: 14,
                          color: '#6b7280',
                        }}
                      >
                        Cargando dispositivos...
                      </td>
                    </tr>
                  )}

                  {!loadingDevices && devices.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: '8px 12px',
                          fontSize: 14,
                          color: '#6b7280',
                        }}
                      >
                        Este tripulante todavía no tiene dispositivos registrados.
                      </td>
                    </tr>
                  )}

                  {devices.map((d) => (
                    <tr key={d.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '8px 12px', fontSize: 14 }}>{d.nombre}</td>
                      <td style={{ padding: '8px 12px', fontSize: 14 }}>
                        {renderEstadoDispositivo(d.estado)}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: 14 }}>{d.registradoEl}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          style={{
                            padding: '4px 8px',
                            borderRadius: 8,
                            border: '1px solid #d1d5db',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: 12,
                            marginRight: 8,
                          }}
                          onClick={() => handleSuspenderDevice(d)}
                        >
                          Suspender
                        </button>
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
                          onClick={() => handleRevocarDevice(d)}
                        >
                          Revocar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

          </table>
        </div>
      )}

            {activeTab === 'accesos' && (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 16,
            background: 'white',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Accesos mediante código / QR</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 0 }}>
            El administrador puede generar códigos de acceso temporales para que el tripulante
            inicie sesión en la app móvil desde un nuevo dispositivo.
          </p>

          {/* Selector de tipo + botón generar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <label style={{ fontSize: 13, marginRight: 8 }}>Tipo de acceso:</label>
              <select
                value={tipoLoginSeleccionado}
                onChange={(e) =>
                  setTipoLoginSeleccionado(e.target.value as LoginCodeType)
                }
                style={{
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 13,
                }}
              >
                <option value="NUMERIC_CODE">Código numérico</option>
                <option value="QR_TOKEN">Token para QR</option>
              </select>
            </div>

            <button
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#2563eb',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13,
              }}
              onClick={handleGenerateLoginCode}
            >
              Generar acceso
            </button>
          </div>

          {/* Tabla de accesos */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Código</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>Estado</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                  Creado el
                </th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 14 }}>
                  Expira el
                </th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: 14 }}>
                  QR / Ver
                </th>
              </tr>
            </thead>
            <tbody>
              {loginCodes.map((c) => (
                <tr key={c.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px 12px', fontSize: 14 }}>{c.code}</td>
                  <td style={{ padding: '8px 12px', fontSize: 14 }}>
                    {c.tipo === 'NUMERIC_CODE' ? 'Código numérico' : 'Token QR'}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: 14 }}>
                    {renderLoginStatus(c.status)}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: 14 }}>{c.createdAt}</td>
                  <td style={{ padding: '8px 12px', fontSize: 14 }}>{c.expiresAt}</td>
                  <td style={{ padding: '8px 12px', fontSize: 14, textAlign: 'right' }}>
                      {c.tipo === 'QR_TOKEN' ? (
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
                          onClick={() => setQrActual(c.code)}
                        >
                          Ver QR
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#6b7280' }}>No aplica</span>
                      )}
                    </td>

                </tr>
              ))}

              {loginCodes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    Todavía no se han generado códigos de acceso para este tripulante.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Bloque que muestra el QR cuando hay uno seleccionado */}
          {qrActual && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'inline-block',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 16 }}>
                QR de acceso para {tripulante.nombre}
              </h3>
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 8,
                  fontSize: 13,
                  color: '#6b7280',
                }}
              >
                Escanéalo desde la app móvil de tripulantes para iniciar sesión en un nuevo
                dispositivo. Este QR representa el token:
                <br />
                <span style={{ fontFamily: 'monospace' }}>{qrActual}</span>
              </p>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'white',
                  display: 'inline-block',
                }}
              >
                <QRCode value={qrActual} size={160} />
              </div>

              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setQrActual(null)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default TripulanteDetailPage;
