import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => { setLoading(false); setSent(true); }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
                    <p className="text-slate-400 mt-1">Enter your email to reset your password</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm space-y-5">
                    {sent ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Mail size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
                            <p className="text-sm text-slate-400">We've sent a password reset link to <strong className="text-white">{email}</strong></p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <InputField label="Email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                            <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
                        </form>
                    )}
                    <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
