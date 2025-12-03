import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Panel Administrativo - Logistic</h1>
      <p>Bienvenida Alexia, este es el dashboard general.</p>

      <ul>
        <li>
          <Link to="/admin/tripulantes">Gestión de tripulantes</Link>
        </li>
        <li>
          <Link to="/admin/vuelos">Gestión de vuelos</Link>
        </li>
        <li>
          <Link to="/admin/sync-runs">Sincronización (CRON)</Link>
        </li>
      </ul>
    </div>
  );
}

export default DashboardPage;
