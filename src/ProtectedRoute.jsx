import { Navigate, Outlet } from 'react-router-dom';
import { useUsuarioStore } from './stores/useUsuarioStore';

export default function ProtectedRoute() {
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

  return <Outlet />;
}