import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import type { CrewMember, CrewStatus } from '../../data/crewMock';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (created: CrewMember) => void;
};

type FormValues = {
  nombre: string;
  codigo: string;
  rol: string;
  base: string;
  estado: CrewStatus;
};

const schema = Yup.object({
  nombre: Yup.string().min(3, 'Muy corto').required('Requerido'),
  codigo: Yup.string()
    .matches(/^TCP-\d{3}$/, 'Formato esperado: TCP-001')
    .required('Requerido'),
  rol: Yup.string().required('Requerido'),
  base: Yup.string().length(3, 'Debe ser 3 letras (LPB/CBB/VVI)').required('Requerido'),
  estado: Yup.mixed<CrewStatus>().oneOf(['ACTIVO', 'BAJA_TEMPORAL', 'BAJA']).required(),
});

export default function NewCrewMemberModal({ open, onClose, onCreated }: Props) {
  if (!open) return null;

  const initialValues: FormValues = {
    nombre: '',
    codigo: '',
    rol: 'Tripulante de Cabina',
    base: 'LPB',
    estado: 'ACTIVO',
  };

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h2 style={{ marginTop: 0 }}>Nuevo tripulante</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values) => {
            const newItem: CrewMember = {
              id: Date.now(), // suficiente para mock
              ...values,
            };
            onCreated(newItem);
            onClose();
          }}
        >
          {(f) => (
            <form onSubmit={f.handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <Field
                label="Nombre"
                name="nombre"
                value={f.values.nombre}
                onChange={f.handleChange}
                error={f.touched.nombre ? (f.errors.nombre as string) : undefined}
              />

              <Field
                label="Código (TCP-001)"
                name="codigo"
                value={f.values.codigo}
                onChange={f.handleChange}
                error={f.touched.codigo ? (f.errors.codigo as string) : undefined}
              />

              <div style={{ display: 'grid', gap: 6 }}>
                <label>Rol</label>
                <select name="rol" value={f.values.rol} onChange={f.handleChange} style={input}>
                  <option value="Tripulante de Cabina">Tripulante de Cabina</option>
                  <option value="Jefe de Cabina">Jefe de Cabina</option>
                  <option value="Piloto">Piloto</option>
                  <option value="Copiloto">Copiloto</option>
                </select>
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <label>Base</label>
                <select name="base" value={f.values.base} onChange={f.handleChange} style={input}>
                  <option value="LPB">LPB</option>
                  <option value="CBB">CBB</option>
                  <option value="VVI">VVI</option>
                </select>
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <label>Estado</label>
                <select
                  name="estado"
                  value={f.values.estado}
                  onChange={f.handleChange}
                  style={input}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="BAJA_TEMPORAL">BAJA_TEMPORAL</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={onClose} style={btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" style={btnPrimary} disabled={!f.isValid}>
                  Guardar
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
}) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label>{props.label}</label>
      <input name={props.name} value={props.value} onChange={props.onChange} style={input} />
      {props.error ? <span style={{ color: '#b00020', fontSize: 12 }}>{props.error}</span> : null}
    </div>
  );
}

const backdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  width: 'min(560px, 100%)',
  background: '#fff',
  borderRadius: 16,
  padding: 18,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
};

const input: React.CSSProperties = {
  height: 40,
  borderRadius: 10,
  border: '1px solid #d0d7de',
  padding: '0 12px',
  outline: 'none',
};

const btnPrimary: React.CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: 0,
  padding: '0 14px',
  background: '#2563eb',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: '1px solid #d0d7de',
  padding: '0 14px',
  background: 'white',
  fontWeight: 600,
  cursor: 'pointer',
};
