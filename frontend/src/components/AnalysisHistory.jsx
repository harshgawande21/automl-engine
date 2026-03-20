import axios from 'axios';
import { Clock, History, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnalysisHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/history/');
            setHistory(res.data.history || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const clearHistory = async () => {
        try {
            await axios.delete('http://localhost:8000/history/');
            setHistory([]);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    if (loading) return <div className="loading-overlay"><div className="spinner"></div><p>Loading history...</p></div>;

    return (
        <div className="animate-in">
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title"><History size={18} /> Analysis History</div>
                        <p className="card-subtitle">Track all your previous model training runs</p>
                    </div>
                    {history.length > 0 && (
                        <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={clearHistory}>
                            <Trash2 size={14} /> Clear
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <Clock size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                        <p>No analysis history yet. Train some models to see them here!</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Time</th>
                                <th>Dataset</th>
                                <th>Model</th>
                                <th>Category</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice().reverse().map((entry, i) => (
                                <tr key={entry.id || i}>
                                    <td>{entry.id || i + 1}</td>
                                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                                    </td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.filename}</td>
                                    <td>
                                        <span className="metric-badge" style={{ padding: '4px 8px', fontSize: 11 }}>
                                            {entry.model_type?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                                            color: entry.model_category === 'classification' ? 'var(--accent-light)' :
                                                entry.model_category === 'regression' ? 'var(--success)' : 'var(--warning)'
                                        }}>
                                            {entry.model_category}
                                        </span>
                                    </td>
                                    <td>
                                        {entry.accuracy && <span className="metric-badge" style={{ marginRight: 4 }}><span className="metric-label">Acc</span><span className="metric-value">{(entry.accuracy * 100).toFixed(1)}%</span></span>}
                                        {entry.r2 && <span className="metric-badge" style={{ marginRight: 4 }}><span className="metric-label">R²</span><span className="metric-value">{entry.r2.toFixed(4)}</span></span>}
                                        {entry.silhouette && <span className="metric-badge"><span className="metric-label">Sil</span><span className="metric-value">{entry.silhouette.toFixed(4)}</span></span>}
                                        {!entry.accuracy && !entry.r2 && !entry.silhouette && '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AnalysisHistory;
