import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-pink-100/20" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative text-center max-w-md w-full"
            >
                {/* Logo */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-400/25">
                    <span className="text-white font-bold text-xl">AI</span>
                </div>

                {/* 404 Code */}
                <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    404
                </h1>
                
                {/* Error Message */}
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Page Not Found</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved. 
                    Please check the URL or return to a valid page.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="primary" icon={Home} className="w-full sm:w-auto">
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="outline" icon={ArrowLeft} className="w-full sm:w-auto">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Additional Help */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <strong>Need help?</strong> If you think this is an error, 
                        please contact support or try refreshing the page.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="mt-6 text-sm text-slate-500">
                    <p className="mb-2">Popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link to="/dashboard" className="text-blue-600 hover:text-pink-600 transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-slate-400">•</span>
                        <Link to="/data/upload" className="text-blue-600 hover:text-pink-600 transition-colors">
                            Upload Data
                        </Link>
                        <span className="text-slate-400">•</span>
                        <Link to="/model/training" className="text-blue-600 hover:text-pink-600 transition-colors">
                            Train Model
                        </Link>
                        <span className="text-slate-400">•</span>
                        <Link to="/settings" className="text-blue-600 hover:text-pink-600 transition-colors">
                            Settings
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
