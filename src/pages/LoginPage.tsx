import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (email && password) {
      navigate('/admin');
    } else {
      alert('Por favor completa el email y la contraseña');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          background: 'white',
        }}
      >
        <h1 style={{ marginBottom: 16, textAlign: 'center' }}>Logistic Admin</h1>
        <p style={{ marginBottom: 24, textAlign: 'center', color: '#555' }}>
          Inicia sesión como administrador
        </p>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 16 }}
        />

        <label style={{ display: 'block', marginBottom: 8 }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 24 }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 10,
            border: 'none',
            borderRadius: 8,
            background: '#2563eb',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
