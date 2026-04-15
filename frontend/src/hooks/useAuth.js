import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser, logout, registerUser } from '../store/authSlice';

export function useAuth() {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error, token } = useSelector((state) => state.auth);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        token,
        login: (credentials) => dispatch(loginUser(credentials)),
        register: (userData) => dispatch(registerUser(userData)),
        logout: () => dispatch(logout()),
        clearError: () => dispatch(clearError()),
    };
}

export default useAuth;
