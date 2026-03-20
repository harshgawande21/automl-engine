import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload) return null;
    const data = payload[0].payload;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
            <p className="text-xs text-slate-400 mb-1">Data Point</p>
            <p className="text-sm font-medium text-blue-400">X: {data.x?.toFixed(2)}</p>
            <p className="text-sm font-medium text-green-400">Y: {data.y?.toFixed(2)}</p>
            {data.category && (
                <p className="text-sm font-medium text-purple-400">Category: {data.category}</p>
            )}
        </div>
    );
};

export default function ScatterPlot({ data, xKey = 'x', yKey = 'y', colorKey = null, height = 300 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    type="number" 
                    dataKey={xKey} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    axisLine={{ stroke: '#475569' }}
                    name={xKey}
                />
                <YAxis 
                    type="number" 
                    dataKey={yKey} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    axisLine={{ stroke: '#475569' }}
                    name={yKey}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Data Points" data={data} fill="#3B82F6">
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={colorKey ? colors[entry[colorKey] % colors.length] : '#3B82F6'} 
                        />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
}
