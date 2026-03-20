import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import store from './store';
import { removeToast } from './store/uiSlice';

function ToastWrapper() {
    const { toasts } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    return <ToastContainer toasts={toasts} onRemove={(id) => dispatch(removeToast(id))} />;
}

export default function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <AppRoutes />
                        <ToastWrapper />
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    );
}
