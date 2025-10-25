import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCreditos from './pages/Admin/AdminCreditos';
import AdminCuotas from './pages/Admin/AdminCuotas';
import AdminUsuarios from './pages/Admin/AdminUsuarios';
import AdminCrearCredito from './pages/Admin/AdminCrearCredito';
import AdminHistorial from './pages/Admin/AdminHistorial';
import AdminCajaChica from './pages/Admin/AdminCajaChica';
import LandingPage from './pages/Landing/LandingPage';
import AdminIngresos from './pages/Admin/AdminIngresos';
import AdminEgresos from './pages/Admin/AdminEgresos';
import AdminCobros from './pages/Admin/AdminCobros';
import Login from './pages/Landing/Login';
import Register from './pages/Landing/Register';
import { useUsuarioStore } from './stores/useUsuarioStore';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import UsuarioDashboard from './pages/Usuario/UsuarioDashboard';
import UsuarioCreditos from './pages/Usuario/UsuarioCreditos';
import UsuarioSolicitar from './pages/Usuario/UsuarioSolicitar';
import UsuarioCuotas from './pages/Usuario/UsuarioCuotas';
import AdminEditarCredito from './pages/Admin/AdminEditarCredito';
import AdminRegistrarUsuario from './pages/Admin/AdminRegistrarUsuario';
import AdminHistorialBalance from './pages/Admin/AdminHistorialBalance';
import AdminEstadisticas from './pages/Admin/AdminEstadisticas';

export default function App(){
    const {authenticate } = useUsuarioStore();

    useEffect(() =>{
        authenticate();
    }, [])

    return(
        <Router>
            <Toaster />
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                    {/* Usuarios */}
                    <Route path="/usuario/" element={<UsuarioDashboard />} /> 
                    <Route path="/usuario/solicitar" element={<UsuarioSolicitar />} /> 
                    <Route path="/usuario/creditos" element={<UsuarioCreditos />} /> 
                    <Route path="/usuario/creditos/:id/cuotas" element={<UsuarioCuotas />} /> 

                    <Route path="/admin/" element={<AdminDashboard />} />
                    <Route path="/admin/creditos" element={<AdminCreditos />} />
                    <Route path="/admin/creditos/:id/cuotas" element={<AdminCuotas />} />
                    <Route path="/admin/creditos/:id/editar" element={<AdminEditarCredito />} />
                    <Route path="/admin/cobros" element={<AdminCobros />} />
                    <Route path="/admin/caja" element={<AdminCajaChica />} />
                    <Route path="/admin/caja/ingresos" element={<AdminIngresos />} />
                    <Route path="/admin/caja/egresos" element={<AdminEgresos />} />
                    <Route path="/admin/caja/balance" element={<AdminHistorialBalance />} />
                    <Route path="/admin/caja/estadisticas" element={<AdminEstadisticas />} />
                    <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                    <Route path="/admin/usuarios/crear" element={<AdminRegistrarUsuario />} />
                    <Route path="/admin/usuarios/:usuarioId/creditos/:id/cuotas" element={<AdminCuotas />} />
                    <Route path="/admin/usuarios/:id/crear" element={<AdminCrearCredito />} />
                    <Route path="/admin/usuarios/:usuarioId/cuotas" element={<AdminCuotas />} />
                    <Route path="/admin/usuarios/:usuarioId/creditos" element={<AdminCreditos />} />
                    <Route path="/admin/historial" element={<AdminHistorial />} />
                </Route>
            </Routes>
        </Router>
    )
}