import { motion } from 'framer-motion';
import { CheckCircle, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [localError, setLocalError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (localError) setLocalError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegistrationSuccess(false);
        
        console.log('Registration attempt with:', { name: form.name, email: form.email, password: '***' });
        
        // Validation
        if (!form.name.trim()) {
            setLocalError('Name is required');
            return;
        }
        if (!form.email.trim()) {
            setLocalError('Email is required');
            return;
        }
        if (form.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        try {
            await register({ name: form.name, email: form.email, password: form.password });
            console.log('Registration successful for:', form.email);
            setRegistrationSuccess(true);
            
            // Show success message briefly before redirecting
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please login with your new account.',
                        email: form.email 
                    } 
                });
            }, 2000);
            
        } catch (err) {
            console.error('Registration failed:', err);
            setRegistrationSuccess(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-pink-100/20" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-400/25">
                        <span className="text-white font-bold text-xl">AI</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-600 mt-2">Join AutoInsight today</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/80 border border-blue-200 rounded-2xl p-8 backdrop-blur-sm shadow-lg space-y-6">
                    {/* Success Message */}
                    {registrationSuccess && (
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Account created successfully! Redirecting to login...
                        </div>
                    )}
                    
                    {(error || localError) && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {localError || error}
                        </div>
                    )}
                    
                    <InputField 
                        label="Full Name" 
                        name="name" 
                        placeholder="John Doe" 
                        value={form.name} 
                        onChange={handleChange} 
                        icon={User} 
                        required 
                    />
                    
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
                    
                    <InputField 
                        label="Password" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={form.password} 
                        onChange={handleChange} 
                        icon={Lock} 
                        required 
                    />
                    
                    <InputField 
                        label="Confirm Password" 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={form.confirmPassword} 
                        onChange={handleChange} 
                        icon={Lock} 
                        required 
                    />
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full" 
                        loading={loading}
                    >
                        Create Account
                    </Button>
                    
                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-pink-600 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>

                {/* Registration Example */}
                <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-xs text-green-800">
                        <strong>Example Registration Flow:</strong><br />
                        1. Fill in all fields<br />
                        2. Password must be 6+ characters<br />
                        3. Click "Create Account"<br />
                        4. Account is created securely<br />
                        5. Redirect to login page
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
