import { Navigate, Outlet } from 'react-router-dom';
import { useUsuarioStore } from './stores/useUsuarioStore';
import toast from 'react-hot-toast';

export default function AdminProtectedRoute() {
  const { currentUsuario, isAuthenticating } = useUsuarioStore();

  if (isAuthenticating) {
    return (
      <div className="page initial">
        <div className="spinner large"></div>
      </div>
    );
  }

  if (!isAuthenticating && !currentUsuario || currentUsuario == null) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role (not 'USER')
  if (currentUsuario.rol === 'USER') {
    toast.error('No tienes permisos para acceder a esta página');
    return <Navigate to="/usuario/" replace />;
  }

  return <Outlet />;
}
