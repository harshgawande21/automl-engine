import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser, logout, registerUser } from '../store/authSlice';

export function useAuth() {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error, token } = useSelector((state) => state.auth);

    const login = (credentials) => dispatch(loginUser(credentials));
    const register = (userData) => dispatch(registerUser(userData));
    const handleLogout = () => dispatch(logout());
    const handleClearError = () => dispatch(clearError());

    return {
        user,
        isAuthenticated,
        loading,
        error,
        token,
        login,
        register,
        logout: handleLogout,
        clearError: handleClearError,
    };
}

export default useAuth;
