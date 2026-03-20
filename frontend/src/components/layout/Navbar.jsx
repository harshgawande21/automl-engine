import {
    BarChart3,
    Bell,
    Brain,
    ChevronDown,
    Database,
    FileText,
    Home,
    LogOut,
    Menu,
    Monitor,
    PieChart,
    Play,
    Search,
    Settings,
    Shield,
    Target,
    Upload,
    User,
    X
} from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [showProfile, setShowProfile] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setShowProfile(false);
        setShowMobileMenu(false);
    };

    const navigateToPage = (path) => {
        navigate(path);
        setShowMobileMenu(false);
    };

    // Navigation items organized by category
    const navigationItems = [
        {
            category: 'Main',
            items: [
                { name: 'Home', path: '/', icon: Home, description: 'Landing page' },
                { name: 'Dashboard', path: '/dashboard', icon: BarChart3, description: 'Main overview' },
            ]
        },
        {
            category: 'Data Management',
            items: [
                { name: 'Upload Data', path: '/data/upload', icon: Upload, description: 'Upload datasets' },
                { name: 'Data Processing', path: '/data/processing', icon: Database, description: 'Process data' },
                { name: 'Dataset Preview', path: '/data/preview', icon: FileText, description: 'Preview datasets' },
            ]
        },
        {
            category: 'ML Models',
            items: [
                { name: 'Model Training', path: '/model/training', icon: Brain, description: 'Train models' },
                { name: 'Model Evaluation', path: '/model/evaluation', icon: BarChart3, description: 'Evaluate models' },
                { name: 'Hyperparameter Tuning', path: '/model/tuning', icon: Settings, description: 'Optimize models' },
            ]
        },
        {
            category: 'Predictions',
            items: [
                { name: 'Single Prediction', path: '/prediction/single', icon: Target, description: 'Single predictions' },
                { name: 'Batch Prediction', path: '/prediction/batch', icon: Play, description: 'Batch predictions' },
                { name: 'Prediction Results', path: '/prediction/results', icon: PieChart, description: 'View results' },
            ]
        },
        {
            category: 'Analytics & Monitoring',
            items: [
                { name: 'Analytics', path: '/analytics', icon: BarChart3, description: 'Data analytics' },
                { name: 'Explainability', path: '/explainability', icon: Shield, description: 'Model explanations' },
                { name: 'Monitoring', path: '/monitoring', icon: Monitor, description: 'System monitoring' },
            ]
        },
        {
            category: 'Account',
            items: [
                { name: 'Settings', path: '/settings', icon: Settings, description: 'User settings' },
            ]
        }
    ];

    const isActivePath = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-xl border-b border-blue-200 shadow-sm">
                <div className="flex items-center justify-between h-full px-4">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 rounded-lg text-blue-600 hover:text-pink-600 hover:bg-blue-50 transition-colors"
                            >
                                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="text-lg font-semibold text-slate-800 hidden sm:block">AutoInsight</span>
                        </Link>
                    </div>

                    {/* Center — Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {isAuthenticated && navigationItems.map((section) => (
                            <div key={section.category} className="relative group">
                                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                    {section.category}
                                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-blue-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-2">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = isActivePath(item.path);
                                            return (
                                                <button
                                                    key={item.path}
                                                    onClick={() => navigateToPage(item.path)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                                        active 
                                                            ? 'bg-blue-50 text-blue-600' 
                                                            : 'text-slate-700 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-500'} />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">{item.name}</div>
                                                        <div className="text-xs text-slate-500">{item.description}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-48 pl-10 pr-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-sm text-slate-700 placeholder-blue-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Notifications */}
                        {isAuthenticated && (
                            <button className="p-2 rounded-lg text-blue-600 hover:text-pink-600 hover:bg-blue-50 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                            </button>
                        )}

                        {/* Profile */}
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <span className="text-sm text-slate-700 hidden sm:block">
                                        {user?.name || 'User'}
                                    </span>
                                </button>

                                {showProfile && (
                                    <div className="absolute right-0 top-12 w-48 bg-white border border-blue-200 rounded-xl shadow-lg py-1 z-50">
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                            onClick={() => setShowProfile(false)}
                                        >
                                            <User size={16} /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Login/Register for non-authenticated users */}
                        {!isAuthenticated && (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && isAuthenticated && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div 
                        className="fixed inset-0 bg-black/50" 
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-blue-200 overflow-y-auto">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">AI</span>
                                    </div>
                                    <span className="text-lg font-semibold text-slate-800">AutoInsight</span>
                                </div>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="p-2 rounded-lg text-slate-500 hover:bg-blue-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <div className="space-y-4">
                                {navigationItems.map((section) => (
                                    <div key={section.category}>
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            {section.category}
                                        </h3>
                                        <div className="space-y-1">
                                            {section.items.map((item) => {
                                                const Icon = item.icon;
                                                const active = isActivePath(item.path);
                                                return (
                                                    <button
                                                        key={item.path}
                                                        onClick={() => navigateToPage(item.path)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                                            active 
                                                                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' 
                                                                : 'text-slate-700 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-500'} />
                                                        <div>
                                                            <div className="text-sm font-medium">{item.name}</div>
                                                            <div className="text-xs text-slate-500">{item.description}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile User Actions */}
                            <div className="mt-6 pt-6 border-t border-blue-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">{user?.name || 'User'}</div>
                                        <div className="text-xs text-slate-500">{user?.email || 'user@example.com'}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
