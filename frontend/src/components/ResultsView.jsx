import { CheckCircle, Layers, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const ResultsView = ({ results }) => {
    if (!results || !results.results) return null;

    const { results: metrics, model_path, model_type, model_category } = results;

    // Classification
    if (metrics.classification_report) {
        const report = metrics.classification_report;
        const accuracy = metrics.accuracy;

        const chartData = Object.keys(report)
            .filter(key => key !== 'accuracy' && key !== 'macro avg' && key !== 'weighted avg')
            .map(key => ({
                name: `Class ${key}`,
                precision: +(report[key].precision * 100).toFixed(1),
                recall: +(report[key].recall * 100).toFixed(1),
                f1: +(report[key]['f1-score'] * 100).toFixed(1)
            }));

        return (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="alert alert-success">
                    <CheckCircle size={18} />
                    <span>Model trained! Accuracy: <strong>{(accuracy * 100).toFixed(2)}%</strong></span>
                </div>

                <div className="grid-3">
                    <div className="stat-card">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-value accent">{(accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Model</span>
                        <span className="stat-value" style={{ fontSize: 16 }}>{model_type || '—'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Saved As</span>
                        <span className="stat-value" style={{ fontSize: 12, wordBreak: 'break-all' }}>{model_path}</span>
                    </div>
                </div>

                {/* Confusion Matrix */}
                {metrics.confusion_matrix && (
                    <div>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Confusion Matrix</h4>
                        <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${metrics.confusion_matrix.length}, 1fr)`, gap: 4 }}>
                            {metrics.confusion_matrix.flat().map((val, idx) => {
                                const maxVal = Math.max(...metrics.confusion_matrix.flat());
                                const intensity = maxVal > 0 ? val / maxVal : 0;
                                return (
                                    <div key={idx} className="confusion-cell"
                                        style={{ background: `rgba(99, 102, 241, ${0.1 + intensity * 0.6})`, color: intensity > 0.5 ? '#fff' : 'var(--text-secondary)' }}>
                                        {val}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Chart */}
                <div style={{ height: 280 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Metrics per Class</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#1e2030', border: '1px solid #2a2d3e', borderRadius: 8, color: '#f1f5f9' }} />
                            <Legend />
                            <Bar dataKey="precision" fill="#6366f1" name="Precision %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="recall" fill="#10b981" name="Recall %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="f1" fill="#f59e0b" name="F1 %" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    // Regression
    if (metrics.mean_squared_error !== undefined) {
        return (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="alert alert-success">
                    <TrendingUp size={18} />
                    <span>Regression model trained! R² Score: <strong>{metrics.r2_score?.toFixed(4)}</strong></span>
                </div>
                <div className="grid-3">
                    <div className="stat-card">
                        <span className="stat-label">MSE</span>
                        <span className="stat-value warning">{metrics.mean_squared_error?.toFixed(4)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">R² Score</span>
                        <span className="stat-value accent">{metrics.r2_score?.toFixed(4)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Saved As</span>
                        <span className="stat-value" style={{ fontSize: 12, wordBreak: 'break-all' }}>{model_path}</span>
                    </div>
                </div>
                {metrics.coefficients && (
                    <div>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Coefficients</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {metrics.coefficients.map((c, i) => (
                                <span key={i} className="metric-badge">
                                    <span className="metric-label">β{i}</span>
                                    <span className="metric-value">{c.toFixed(4)}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Clustering
    if (metrics.silhouette_score !== undefined || metrics.labels) {
        return (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="alert alert-success">
                    <Layers size={18} />
                    <span>Clustering complete! Found <strong>{metrics.n_clusters || '—'}</strong> clusters</span>
                </div>
                <div className="grid-3">
                    <div className="stat-card">
                        <span className="stat-label">Clusters</span>
                        <span className="stat-value accent">{metrics.n_clusters || '—'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Silhouette</span>
                        <span className="stat-value" style={{ color: metrics.silhouette_score > 0.5 ? 'var(--success)' : 'var(--warning)' }}>
                            {metrics.silhouette_score?.toFixed(4)}
                        </span>
                    </div>
                    {metrics.n_noise_points !== undefined && (
                        <div className="stat-card">
                            <span className="stat-label">Noise Points</span>
                            <span className="stat-value">{metrics.n_noise_points}</span>
                        </div>
                    )}
                </div>
                {metrics.labels && (
                    <div>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Cluster Distribution</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={
                                Object.entries(metrics.labels.reduce((acc, l) => { acc[l] = (acc[l] || 0) + 1; return acc; }, {}))
                                    .map(([k, v]) => ({ cluster: `Cluster ${k}`, count: v }))
                            }>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                                <XAxis dataKey="cluster" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#1e2030', border: '1px solid #2a2d3e', borderRadius: 8, color: '#f1f5f9' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {Object.keys(metrics.labels.reduce((acc, l) => { acc[l] = 1; return acc; }, {})).map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        );
    }

    return <div className="alert alert-info">Unknown result format</div>;
};

export default ResultsView;
