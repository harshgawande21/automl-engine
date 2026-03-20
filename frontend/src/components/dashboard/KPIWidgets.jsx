import { motion } from 'framer-motion';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { cn } from '../../utils/helpers';

function KPICard({ title, value, change, icon: Icon, color = 'indigo', format = 'number' }) {
    const formatted = format === 'percent' ? formatPercent(value) : formatNumber(value);
    const isPositive = change > 0;
    const isNeutral = change === 0;
    const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

    const colorMap = {
        indigo: 'from-indigo-500 to-purple-600',
        emerald: 'from-emerald-500 to-teal-600',
        amber: 'from-amber-500 to-orange-600',
        rose: 'from-rose-500 to-pink-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-slate-600 transition-all"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{formatted}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', colorMap[color])}>
                    {Icon && <Icon size={20} className="text-white" />}
                </div>
            </div>
            {change !== undefined && (
                <div className="flex items-center gap-1 mt-3">
                    <TrendIcon size={14} className={isPositive ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-red-400'} />
                    <span className={cn('text-xs font-medium', isPositive ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-red-400')}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    <span className="text-xs text-slate-500 ml-1">vs last period</span>
                </div>
            )}
        </motion.div>
    );
}

export default function KPIWidgets({ kpis = [] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
            ))}
        </div>
    );
}
