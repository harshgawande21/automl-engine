import { Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
            <p className="text-xs text-slate-400 mb-1">Range: {label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm font-medium text-blue-400">
                    Count: {p.value}
                </p>
            ))}
        </div>
    );
};

export default function Histogram({ data, dataKey = 'count', height = 300, color = '#3B82F6' }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    dataKey="range" 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    axisLine={{ stroke: '#475569' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
