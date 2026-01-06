// src/pages/TripulantesListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import type { CrewMember, CrewStatus } from '../data/crewMock';
import { getCrewMembers } from '../services/crewService';
import { loadCrewFromStorage, saveCrewToStorage } from '../utils/crewStorage';

type FormValues = {
  nombre: string;
  codigo: string;
  rol: string;
  base: string;
  estado: CrewStatus;
};

function TripulantesListPage() {
  const navigate = useNavigate();

  const [tripulantes, setTripulantes] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function loadTripulantes() {
      try {
        setLoading(true);
        setError(null);

        // ✅ 1) Intentar cargar desde localStorage
        const stored = loadCrewFromStorage();
        if (stored && Array.isArray(stored) && stored.length >= 0) {
          setTripulantes(stored);
          return;
        }

        // ✅ 2) Si no hay nada en storage, cargar mock y guardarlo
        const data = await getCrewMembers();
        setTripulantes(data);
        saveCrewToStorage(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los tripulantes.');
      } finally {
        setLoading(false);
      }
    }

    loadTripulantes();
  }, []);

  const nextId = useMemo(() => {
    const maxId = tripulantes.reduce((acc, t) => Math.max(acc, t.id), 0);
    return maxId + 1;
  }, [tripulantes]);

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
        }}
      >
        {estado.replace('_', ' ')}
      </span>
    );
  }

  const initialValues: FormValues = {
    nombre: '',
    codigo: '',
    rol: 'Tripulante de Cabina',
    base: 'LPB',
    estado: 'ACTIVO',
  };

  function validate(values: FormValues) {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.nombre.trim()) errors.nombre = 'El nombre es requerido.';
    if (!values.codigo.trim()) errors.codigo = 'El código es requerido.';
    if (!values.rol.trim()) errors.rol = 'El rol es requerido.';
    if (!values.base.trim()) errors.base = 'La base es requerida.';

    // ✅ Evitar códigos repetidos
    const exists = tripulantes.some(
      (t) => t.codigo.trim().toLowerCase() === values.codigo.trim().toLowerCase()
    );
    if (exists) errors.codigo = 'Ese código ya existe.';

    return errors;
  }

  function close() {
    setOpenModal(false);
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
          onClick={() => setOpenModal(true)}
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
                    onClick={() => navigate(`/admin/tripulantes/${t.id}`)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {!loading && tripulantes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                  No hay tripulantes registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {openModal && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 520,
              borderRadius: 16,
              background: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: 16,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0 }}>Nuevo tripulante</h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>
                  Completa los datos para registrarlo en el panel.
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  background: 'white',
                  cursor: 'pointer',
                  height: 34,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ height: 12 }} />

            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={(values, helpers) => {
                const newCrew: CrewMember = {
                  id: nextId,
                  nombre: values.nombre.trim(),
                  codigo: values.codigo.trim(),
                  rol: values.rol.trim(),
                  base: values.base.trim(),
                  estado: values.estado,
                };

                // ✅ Guardar en estado + persistir en localStorage
                setTripulantes((prev) => {
                  const updated = [newCrew, ...prev];
                  saveCrewToStorage(updated);
                  return updated;
                });

                helpers.resetForm();
                setOpenModal(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Nombre</label>
                      <Field
                        name="nombre"
                        placeholder="Ej. Ana López"
                        style={{
                          width: '100%',
                          marginTop: 6,
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: `1px solid ${
                            errors.nombre && touched.nombre ? '#ef4444' : '#d1d5db'
                          }`,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.nombre && touched.nombre && (
                        <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>
                          {errors.nombre}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Código</label>
                      <Field
                        name="codigo"
                        placeholder="Ej. TCP-004"
                        style={{
                          width: '100%',
                          marginTop: 6,
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: `1px solid ${
                            errors.codigo && touched.codigo ? '#ef4444' : '#d1d5db'
                          }`,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.codigo && touched.codigo && (
                        <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>
                          {errors.codigo}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Estado</label>
                      <Field
                        as="select"
                        name="estado"
                        style={{
                          width: '100%',
                          marginTop: 6,
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: '1px solid #d1d5db',
                          outline: 'none',
                          background: 'white',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="BAJA_TEMPORAL">BAJA_TEMPORAL</option>
                        <option value="BAJA">BAJA</option>
                      </Field>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Rol</label>
                      <Field
                        name="rol"
                        placeholder="Ej. Tripulante de Cabina"
                        style={{
                          width: '100%',
                          marginTop: 6,
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: `1px solid ${
                            errors.rol && touched.rol ? '#ef4444' : '#d1d5db'
                          }`,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.rol && touched.rol && (
                        <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>
                          {errors.rol}
                        </div>
                      )}
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Base</label>
                      <Field
                        name="base"
                        placeholder="Ej. LPB / CBB / VVI"
                        style={{
                          width: '100%',
                          marginTop: 6,
                          padding: '10px 12px',
                          borderRadius: 10,
                          border: `1px solid ${
                            errors.base && touched.base ? '#ef4444' : '#d1d5db'
                          }`,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {errors.base && touched.base && (
                        <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>
                          {errors.base}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={close}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid #d1d5db',
                        background: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        background: '#2563eb',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 700,
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripulantesListPage;
