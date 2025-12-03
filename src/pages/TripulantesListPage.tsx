import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CrewMember, CrewStatus } from '../data/crewMock';
import { getCrewMembers } from '../services/crewService';


function TripulantesListPage() {
  const navigate = useNavigate();

  const [tripulantes, setTripulantes] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    async function loadTripulantes() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCrewMembers();
        setTripulantes(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los tripulantes.');
      } finally {
        setLoading(false);
      }
    }

    loadTripulantes();
  }, []);



  function renderEstado(estado: CrewStatus) {
    let background = '#e5e7eb'; // gris
    let color = '#111827';

    if (estado === 'ACTIVO') {
      background = '#dcfce7'; // verde suave
      color = '#166534';
    } else if (estado === 'BAJA_TEMPORAL') {
      background = '#fef3c7'; // amarillo suave
      color = '#92400e';
    } else if (estado === 'BAJA') {
      background = '#fee2e2'; // rojo suave
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
        {estado.replace('_', ' ')}
      </span>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Tripulantes de vuelo</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Gestión de tripulantes, su estado y base de operación.
          </p>
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
          }}
          onClick={() => {
            alert('Aquí más adelante abriremos el formulario para crear un tripulante.');
          }}
        >
          + Nuevo tripulante
        </button>
      </header>
      
            {loading && (
        <p style={{ marginBottom: 12, color: '#6b7280' }}>
          Cargando tripulantes...
        </p>
      )}

      {error && (
        <p style={{ marginBottom: 12, color: '#b91c1c' }}>
          {error}
        </p>
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
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 14 }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 14 }}>Código</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 14 }}>Rol</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 14 }}>Base</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 14 }}>Estado</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 14 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tripulantes.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{t.nombre}</td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{t.codigo}</td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{t.rol}</td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{t.base}</td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{renderEstado(t.estado)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
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
                    navigate(`/admin/tripulantes/${t.id}`);
                    }}

                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {tripulantes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                  No hay tripulantes registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TripulantesListPage;
