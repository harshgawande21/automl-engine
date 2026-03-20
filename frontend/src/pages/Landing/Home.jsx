import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Brain, Database, Shield, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const features = [
    { icon: Brain, title: 'Model Training', desc: 'Train ML models with no-code interface. Support for classification, regression, and clustering.' },
    { icon: BarChart3, title: 'Visual Analytics', desc: 'Interactive charts and dashboards for deep insights into your data and model performance.' },
    { icon: Zap, title: 'Real-time Predictions', desc: 'Make instant predictions with trained models. Single or batch processing supported.' },
    { icon: Shield, title: 'Explainability', desc: 'Understand your models with SHAP, LIME, and feature importance visualizations.' },
    { icon: TrendingUp, title: 'Monitoring', desc: 'Track model drift, latency, and error rates with real-time monitoring dashboards.' },
    { icon: Database, title: 'Data Management', desc: 'Upload, preview, and process datasets with built-in data pipeline tools.' },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-pink-100/20" />
            
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-blue-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg shadow-blue-400/25">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="text-lg font-semibold text-slate-800">AutoInsight</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
                        <Link to="/register">
                            <Button size="sm" variant="primary">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                            AutoInsight
                            <span className="block text-3xl lg:text-4xl text-blue-600 mt-2">
                                ML Engine Platform
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Unlock the power of machine learning with our no-code platform. 
                            Upload data, train models, and get insights without writing a single line of code.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/register">
                            <Button size="lg" variant="primary" icon={ArrowRight}>
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button size="lg" variant="outline">
                                View Dashboard
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                            Everything You Need for ML Success
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Powerful features designed to make machine learning accessible to everyone
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/80 border border-blue-200 rounded-2xl p-12 shadow-lg"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Join thousands of users who are already leveraging the power of AutoInsight
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" variant="primary" icon={ArrowRight}>
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white/80 border-t border-blue-200 py-8 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-slate-600">
                        © 2024 AutoInsight ML Engine. Built with ❤️ using modern ML technologies.
                    </p>
                </div>
            </footer>
        </div>
    );
}
