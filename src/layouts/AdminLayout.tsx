// src/layouts/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  const linkBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 999,
    fontSize: 14,
    textDecoration: 'none',
    color: 'white',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f3f4f6', // gris claro fondo
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: '#1d4ed8', // azul
          color: 'white',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo / título */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'white',
              opacity: 0.9,
              marginBottom: 8,
            }}
          />
          <h1 style={{ fontSize: 18, margin: 0 }}>Logistic Admin</h1>
          <p style={{ fontSize: 12, margin: 0, opacity: 0.8 }}>
            Panel de tripulantes
          </p>
        </div>

        {/* Menú */}
        <nav style={{ flex: 1 }}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              ...linkBaseStyle,
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            })}
          >
            📊 <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/tripulantes"
            style={({ isActive }) => ({
              ...linkBaseStyle,
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            })}
          >
            👨‍✈️ <span>Gestión de tripulantes</span>
          </NavLink>

          <NavLink
            to="/admin/vuelos"
            style={({ isActive }) => ({
              ...linkBaseStyle,
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            })}
          >
            ✈️ <span>Gestión de vuelos</span>
          </NavLink>

          <NavLink
            to="/admin/sync"
            style={({ isActive }) => ({
              ...linkBaseStyle,
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            })}
          >
            🔁 <span>Sincronización (CRON)</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          style={{
            marginTop: 16,
            padding: '8px 12px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.6)',
            background: 'transparent',
            color: 'white',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          🚪 Log out
        </button>
      </aside>

      {/* Contenido principal SIN header duplicado */}
      <main
        style={{
          flex: 1,
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        {/* Aquí se renderizan las páginas (cada una pone su header) */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
