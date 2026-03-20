import { Cell, Legend, Pie, ResponsiveContainer, PieChart as RPieChart, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
            <p className="text-sm font-medium text-white">{d.name}</p>
            <p className="text-xs text-slate-400">Value: {d.value}</p>
        </div>
    );
};

export default function PieChart({ data, dataKey = 'value', nameKey = 'name', height = 300, innerRadius = 0 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={100}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    stroke="none"
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: '#94A3B8', fontSize: 12 }}
                    formatter={(val) => <span className="text-slate-300">{val}</span>}
                />
            </RPieChart>
        </ResponsiveContainer>
    );
}
