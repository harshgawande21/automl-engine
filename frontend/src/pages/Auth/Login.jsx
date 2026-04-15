import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/authSlice';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    // If already authenticated, go straight to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        dispatch(clearError());
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-pink-100/20" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-400/25">
                        <span className="text-white font-bold text-xl">AI</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
                    <p className="text-slate-600 mt-2">Sign in to your AutoInsight account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/80 border border-blue-200 rounded-2xl p-8 backdrop-blur-sm shadow-lg space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        icon={Mail}
                        required
                    />

                    <div className="relative">
                        <InputField
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            icon={Lock}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-600">
                            <input type="checkbox" className="rounded border-blue-200 bg-white text-blue-600 focus:ring-blue-400" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-blue-600 hover:text-pink-600 font-medium transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" loading={loading}>
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-pink-600 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
