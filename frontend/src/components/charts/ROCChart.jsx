import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ROCChart({ data, height = 300 }) {
    const diagonalData = [{ fpr: 0, random: 0 }, { fpr: 1, random: 1 }];

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'bottom', fill: '#94A3B8', fontSize: 12 }} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 12 }} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#F8FAFC' }} />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                <Line type="monotone" dataKey="tpr" name="ROC Curve" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line type="monotone" data={diagonalData} dataKey="random" name="Random" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
