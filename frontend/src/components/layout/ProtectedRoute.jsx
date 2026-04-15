import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    const hasToken = !!localStorage.getItem('authToken');

    if (!isAuthenticated && !hasToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
