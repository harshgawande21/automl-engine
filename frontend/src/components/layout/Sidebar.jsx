import {
    Activity,
    BarChart3,
    Brain,
    Database,
    Layers,
    LayoutDashboard,
    Lightbulb,
    Settings,
    SlidersHorizontal,
    Target,
    TrendingUp,
    Upload
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const iconMap = {
    LayoutDashboard, Upload, Database, Brain, SlidersHorizontal, BarChart3,
    Target, Layers, Lightbulb, Activity, TrendingUp, Settings,
};

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    {
        section: 'Data', items: [
            { label: 'Upload Data', path: '/data/upload', icon: 'Upload' },
            { label: 'Processing', path: '/data/processing', icon: 'Database' },
        ]
    },
    {
        section: 'Model', items: [
            { label: 'Training', path: '/model/training', icon: 'Brain' },
            { label: 'Tuning', path: '/model/tuning', icon: 'SlidersHorizontal' },
            { label: 'Evaluation', path: '/model/evaluation', icon: 'BarChart3' },
        ]
    },
    {
        section: 'Predict', items: [
            { label: 'Single', path: '/prediction/single', icon: 'Target' },
            { label: 'Batch', path: '/prediction/batch', icon: 'Layers' },
        ]
    },
    {
        section: 'Insights', items: [
            { label: 'Explainability', path: '/explainability', icon: 'Lightbulb' },
            { label: 'Monitoring', path: '/monitoring', icon: 'Activity' },
            { label: 'Analytics', path: '/analytics', icon: 'TrendingUp' },
        ]
    },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
];

function SidebarLink({ item }) {
    const Icon = iconMap[item.icon];
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                    isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                )
            }
        >
            {Icon && <Icon size={18} className="flex-shrink-0" />}
            <span className="truncate">{item.label}</span>
        </NavLink>
    );
}

export default function Sidebar() {
    const { sidebarOpen } = useSelector((state) => state.ui);

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 bottom-0 z-40 bg-white/95 backdrop-blur-xl border-r border-blue-200 transition-all duration-300 overflow-y-auto',
                sidebarOpen ? 'w-64' : 'w-0 opacity-0 pointer-events-none'
            )}
        >
            <div className="flex flex-col gap-1 p-4">
                {navItems.map((item, idx) => {
                    if (item.section) {
                        return (
                            <div key={idx} className="mt-4">
                                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    {item.section}
                                </p>
                                {item.items.map((sub) => (
                                    <SidebarLink key={sub.path} item={sub} />
                                ))}
                            </div>
                        );
                    }
                    return <SidebarLink key={item.path} item={item} />;
                })}
            </div>

            {/* Bottom */}
            <div className="absolute bottom-4 left-4 right-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">AutoInsight v1.0</p>
                    <p className="text-xs text-slate-600 mt-1">ML Analytics Platform</p>
                </div>
            </div>
        </aside>
    );
}
