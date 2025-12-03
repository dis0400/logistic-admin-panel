import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TripulantesListPage from './pages/TripulantesListPage';
import TripulanteDetailPage from './pages/TripulanteDetailPage';
import VuelosListPage from './pages/VuelosListPage';
import FlightDetailPage from './pages/FlightDetailPage';



function App() {
  return (
    <Routes>
      {/* Login de admin */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Dashboard principal */}
      <Route path="/admin" element={<DashboardPage />} />

      {/* Lista de tripulantes */}
      <Route path="/admin/tripulantes" element={<TripulantesListPage />} />

      <Route path="/admin/tripulantes/:id" element={<TripulanteDetailPage />} />

      <Route path="/admin/vuelos" element={<VuelosListPage />} />
      <Route path="/admin/vuelos/:id" element={<FlightDetailPage />} />


      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/admin/login" />} />


    </Routes>
  );
}

export default App;
