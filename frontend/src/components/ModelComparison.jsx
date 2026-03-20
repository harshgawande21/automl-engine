import axios from 'axios';
import { CheckCircle, GitCompare, Play, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const MODEL_OPTIONS = [
    { value: 'logistic_regression', label: 'Logistic Regression', type: 'classification' },
    { value: 'svm', label: 'SVM', type: 'classification' },
    { value: 'random_forest', label: 'Random Forest', type: 'classification' },
    { value: 'xgboost', label: 'XGBoost', type: 'classification' },
    { value: 'naive_bayes', label: 'Naive Bayes', type: 'classification' },
    { value: 'linear_regression', label: 'Linear Regression', type: 'regression' },
    { value: 'ridge_regression', label: 'Ridge Regression', type: 'regression' },
    { value: 'lasso_regression', label: 'Lasso Regression', type: 'regression' },
    { value: 'xgboost_regression', label: 'XGBoost Regression', type: 'regression' },
];

const ModelComparison = ({ filename, columns }) => {
    const [targetColumn, setTargetColumn] = useState('');
    const [selectedModels, setSelectedModels] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleModel = (value) => {
        setSelectedModels(prev =>
            prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
        );
    };

    const handleCompare = async () => {
        if (!targetColumn) { setError('Select a target column'); return; }
        if (selectedModels.length < 2) { setError('Select at least 2 models'); return; }
        setError(null);
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/compare/', {
                filename,
                target_column: targetColumn,
                model_types: selectedModels
            });
            setResults(res.data);
        } catch (e) {
            setError(e.response?.data?.detail || 'Comparison failed');
        }
        setLoading(false);
    };

    const getChartData = () => {
        if (!results?.comparison) return [];
        return results.comparison
            .filter(r => r.status === 'success')
            .map(r => {
                const name = MODEL_OPTIONS.find(m => m.value === r.model_type)?.label || r.model_type;
                return {
                    name,
                    accuracy: r.results.accuracy ? +(r.results.accuracy * 100).toFixed(1) : undefined,
                    r2: r.results.r2_score ? +(r.results.r2_score * 100).toFixed(1) : undefined,
                };
            });
    };

    return (
        <div className="animate-in">
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title"><GitCompare size={18} /> Model Comparison</div>
                        <p className="card-subtitle">Train multiple models and compare side by side</p>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Target Column</label>
                    <select value={targetColumn} onChange={(e) => setTargetColumn(e.target.value)} style={{ maxWidth: 300 }}>
                        <option value="">— Select Target —</option>
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Select Models (pick 2+)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                        {MODEL_OPTIONS.map(m => (
                            <button key={m.value}
                                className={`btn ${selectedModels.includes(m.value) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: 12, padding: '6px 12px' }}
                                onClick={() => toggleModel(m.value)}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div className="alert alert-error"><XCircle size={16} /> {error}</div>}

                <button className="btn btn-primary" onClick={handleCompare} disabled={loading}>
                    <Play size={16} /> {loading ? 'Comparing...' : 'Compare Models'}
                </button>
            </div>

            {loading && <div className="loading-overlay"><div className="spinner"></div><p>Training and comparing models...</p></div>}

            {results?.comparison && (
                <div className="card animate-in">
                    <div className="card-header">
                        <div className="card-title">Comparison Results</div>
                    </div>

                    {/* Results Table */}
                    <table className="data-table" style={{ marginBottom: 20 }}>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Status</th>
                                <th>Accuracy / R²</th>
                                <th>MSE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.comparison.map((r, i) => {
                                const label = MODEL_OPTIONS.find(m => m.value === r.model_type)?.label || r.model_type;
                                return (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</td>
                                        <td>{r.status === 'success'
                                            ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Success</span>
                                            : <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={14} /> Failed</span>
                                        }</td>
                                        <td>
                                            <span className="metric-value" style={{ color: 'var(--accent-light)', fontWeight: 700 }}>
                                                {r.results?.accuracy ? (r.results.accuracy * 100).toFixed(2) + '%' :
                                                    r.results?.r2_score ? r.results.r2_score.toFixed(4) : '—'}
                                            </span>
                                        </td>
                                        <td>{r.results?.mean_squared_error?.toFixed(4) || '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#1e2030', border: '1px solid #2a2d3e', borderRadius: 8, color: '#f1f5f9' }} />
                            <Legend />
                            <Bar dataKey="accuracy" fill="#6366f1" name="Accuracy %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="r2" fill="#10b981" name="R² %" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ModelComparison;
