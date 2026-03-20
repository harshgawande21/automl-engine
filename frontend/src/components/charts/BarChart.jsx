import { Bar, CartesianGrid, Legend, BarChart as RBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}
                </p>
            ))}
        </div>
    );
};

export default function BarChart({ data, bars = [], xKey = 'name', height = 300, stacked = false }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={xKey} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                {bars.map((bar, i) => (
                    <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        name={bar.label || bar.key}
                        fill={bar.color || CHART_COLORS[i % CHART_COLORS.length]}
                        radius={[4, 4, 0, 0]}
                        stackId={stacked ? 'stack' : undefined}
                    />
                ))}
            </RBarChart>
        </ResponsiveContainer>
    );
}
