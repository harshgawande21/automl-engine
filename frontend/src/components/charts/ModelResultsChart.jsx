import {
    RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
    PieChart, Pie, Legend
} from 'recharts';

const COLORS = ['#60A5FA', '#F472B6', '#4ADE80', '#FBBF24', '#A78BFA', '#34D399'];

// Simple gauge-style score card
function ScoreCard({ label, value, color, description }) {
    const pct = Math.round(value * 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (pct / 100) * circumference;
    return (
        <div className="bg-white rounded-xl border border-blue-100 p-4 flex flex-col items-center text-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1E293B">{pct}%</text>
            </svg>
            <p className="font-semibold text-slate-800 text-sm mt-1">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
    );
}

// Feature importance bar chart
function FeatureImportanceChart({ data }) {
    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ name: name.length > 14 ? name.slice(0, 14) + '…' : name, value: +(value * 100).toFixed(1) }));

    return (
        <div className="bg-white rounded-xl border border-blue-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-1">🔑 What Matters Most</h3>
            <p className="text-xs text-slate-500 mb-3">These features had the biggest impact on predictions</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={11} />
                    <YAxis type="category" dataKey="name" width={100} fontSize={11} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Importance']} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Confusion matrix heatmap
function ConfusionMatrixChart({ matrix, labels }) {
    const max = Math.max(...matrix.flat());
    return (
        <div className="bg-white rounded-xl border border-blue-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-1">🎯 Prediction Accuracy Map</h3>
            <p className="text-xs text-slate-500 mb-3">Diagonal = correct predictions. Brighter = more predictions</p>
            <div className="overflow-x-auto">
                <table className="mx-auto text-xs">
                    <thead>
                        <tr>
                            <th className="p-1 text-slate-400">Actual ↓ / Predicted →</th>
                            {(labels || matrix[0].map((_, i) => `Class ${i}`)).map((l, i) => (
                                <th key={i} className="p-2 text-slate-600 font-medium">{l}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="p-2 text-slate-600 font-medium pr-4">
                                    {labels ? labels[i] : `Class ${i}`}
                                </td>
                                {row.map((val, j) => {
                                    const intensity = max > 0 ? val / max : 0;
                                    const isCorrect = i === j;
                                    const bg = isCorrect
                                        ? `rgba(74, 222, 128, ${0.2 + intensity * 0.7})`
                                        : `rgba(248, 113, 113, ${intensity * 0.6})`;
                                    return (
                                        <td key={j} className="p-3 text-center font-bold rounded"
                                            style={{ background: bg, color: intensity > 0.5 ? '#fff' : '#374151' }}>
                                            {val}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-4 mt-3 justify-center text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block" /> Correct</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Incorrect</span>
            </div>
        </div>
    );
}

// Regression metrics chart
function RegressionChart({ metrics }) {
    const data = [
        { name: 'R² Score', value: +(metrics.r2_score * 100).toFixed(1), color: '#60A5FA', desc: 'How well model explains variance' },
    ];
    const errorData = [
        { name: 'MAE', value: +metrics.mae?.toFixed(3) || 0 },
        { name: 'MSE', value: +metrics.mse?.toFixed(3) || 0 },
        { name: 'RMSE', value: +metrics.rmse?.toFixed(3) || 0 },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-blue-100 p-4">
                <h3 className="font-semibold text-slate-800 mb-1">📈 Model Fit Score</h3>
                <p className="text-xs text-slate-500 mb-3">R² = 100% means perfect prediction</p>
                <div className="flex items-center justify-center">
                    <ScoreCard label="R² Score" value={metrics.r2_score || 0} color="#60A5FA" description="Variance explained" />
                </div>
            </div>
            <div className="bg-white rounded-xl border border-blue-100 p-4">
                <h3 className="font-semibold text-slate-800 mb-1">📉 Error Metrics</h3>
                <p className="text-xs text-slate-500 mb-3">Lower is better — how far off predictions are</p>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={errorData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {errorData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Plain-English summary
function PlainEnglishSummary({ metrics, taskType, modelType }) {
    const lines = [];
    if (taskType === 'classification') {
        const acc = metrics.accuracy ? (metrics.accuracy * 100).toFixed(1) : null;
        const f1 = metrics.f1_score ? (metrics.f1_score * 100).toFixed(1) : null;
        if (acc) lines.push(`✅ Your model correctly predicted **${acc}%** of cases.`);
        if (f1) lines.push(`⚖️ It has a balanced accuracy (F1) of **${f1}%** — good for uneven data.`);
        if (acc >= 90) lines.push(`🌟 Excellent performance! This model is production-ready.`);
        else if (acc >= 75) lines.push(`👍 Good performance. Consider more data or tuning to improve further.`);
        else lines.push(`⚠️ Moderate performance. Try a different algorithm or clean the data more.`);
    } else if (taskType === 'regression') {
        const r2 = metrics.r2_score ? (metrics.r2_score * 100).toFixed(1) : null;
        if (r2) lines.push(`📊 Your model explains **${r2}%** of the variation in the target value.`);
        if (r2 >= 85) lines.push(`🌟 Excellent fit! Predictions are very close to actual values.`);
        else if (r2 >= 60) lines.push(`👍 Decent fit. The model captures most patterns in the data.`);
        else lines.push(`⚠️ Weak fit. The model struggles to predict accurately — try feature engineering.`);
    } else if (taskType === 'clustering') {
        lines.push(`🔵 The model grouped your data into clusters based on similarity.`);
        if (metrics.n_clusters) lines.push(`📦 Found **${metrics.n_clusters}** natural groups in your data.`);
        lines.push(`💡 Use these clusters to segment customers, detect anomalies, or explore patterns.`);
    }
    return (
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl border border-blue-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-2">💬 What does this mean?</h3>
            <div className="space-y-2">
                {lines.map((line, i) => (
                    <p key={i} className="text-sm text-slate-700" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                ))}
            </div>
        </div>
    );
}

export default function ModelResultsChart({ results, modelType, taskType }) {
    if (!results) return null;

    const metrics = results.results || results;
    const featureImportances = metrics.feature_importances || metrics.featureImportance;
    const confusionMatrix = metrics.confusion_matrix;

    return (
        <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-pink-400 rounded-full" />
                <h2 className="text-lg font-bold text-slate-800">Training Results</h2>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {modelType?.replace(/_/g, ' ')} · {taskType}
                </span>
            </div>

            {/* Plain English Summary */}
            <PlainEnglishSummary metrics={metrics} taskType={taskType} modelType={modelType} />

            {/* Classification Metrics */}
            {taskType === 'classification' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {metrics.accuracy != null && <ScoreCard label="Accuracy" value={metrics.accuracy} color="#60A5FA" description="Overall correct predictions" />}
                    {metrics.precision != null && <ScoreCard label="Precision" value={metrics.precision} color="#F472B6" description="When it says yes, is it right?" />}
                    {metrics.recall != null && <ScoreCard label="Recall" value={metrics.recall} color="#4ADE80" description="How many positives did it catch?" />}
                    {metrics.f1_score != null && <ScoreCard label="F1 Score" value={metrics.f1_score} color="#FBBF24" description="Balance of precision & recall" />}
                </div>
            )}

            {/* Regression Metrics */}
            {taskType === 'regression' && <RegressionChart metrics={metrics} />}

            {/* Clustering Metrics */}
            {taskType === 'clustering' && metrics.n_clusters && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-blue-100 p-4 text-center">
                        <p className="text-4xl font-bold text-blue-500">{metrics.n_clusters}</p>
                        <p className="text-sm font-medium text-slate-700 mt-1">Clusters Found</p>
                        <p className="text-xs text-slate-500">Natural groups in your data</p>
                    </div>
                    {metrics.silhouette_score != null && (
                        <ScoreCard label="Cluster Quality" value={metrics.silhouette_score} color="#A78BFA" description="How well-separated the clusters are" />
                    )}
                </div>
            )}

            {/* Feature Importance */}
            {featureImportances && Object.keys(featureImportances).length > 0 && (
                <FeatureImportanceChart data={featureImportances} />
            )}

            {/* Confusion Matrix */}
            {confusionMatrix && confusionMatrix.length > 0 && (
                <ConfusionMatrixChart matrix={confusionMatrix} />
            )}
        </div>
    );
}
