import { Navigate, Outlet } from 'react-router-dom';
import { useUsuarioStore } from './stores/useUsuarioStore';

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
    return <Navigate to="/usuario/" replace />;
  }

  return <Outlet />;
}
