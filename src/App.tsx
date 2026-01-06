import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TripulantesListPage from './pages/TripulantesListPage';
import TripulanteDetailPage from './pages/TripulanteDetailPage';
import VuelosListPage from './pages/VuelosListPage';
import FlightDetailPage from './pages/FlightDetailPage';
import SyncRunsListPage from './pages/SyncRunsListPage';
import DevicesListPage from './pages/DevicesListPage';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Routes>
      {/* Login de admin (sin layout) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Todo lo demás usa el layout con sidebar */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Primera pantalla: Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Gestión de tripulantes */}
        <Route path="tripulantes" element={<TripulantesListPage />} />
        <Route path="tripulantes/:id" element={<TripulanteDetailPage />} />

        {/* Gestión de vuelos */}
        <Route path="vuelos" element={<VuelosListPage />} />
        <Route path="vuelos/:id" element={<FlightDetailPage />} />

        {/* Sincronización (CRON) */}
        <Route path="sync-runs" element={<SyncRunsListPage />} />
        <Route path="sync" element={<SyncRunsListPage />} />

        {/* (opcional) listado de dispositivos */}
        <Route path="dispositivos" element={<DevicesListPage />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default App;
