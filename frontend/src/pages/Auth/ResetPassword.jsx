import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // Simulate API
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-400 mt-1">Enter your new password</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm space-y-5">
                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>}
                    <InputField label="New Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} icon={Lock} required />
                    <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} icon={Lock} required />
                    <Button type="submit" className="w-full">Reset Password</Button>
                </form>
            </motion.div>
        </div>
    );
}
