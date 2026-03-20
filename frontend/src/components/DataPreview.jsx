import axios from 'axios';
import { Database, Table } from 'lucide-react';
import { useEffect, useState } from 'react';
import environment from '../config/environment';

const DataPreview = ({ fileData }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (fileData?.filename) {
            axios.post(`${environment.API_BASE_URL}/data/preview?filename=${fileData.filename}`)
                .then(r => { setPreviewData(r.data); setLoading(false); })
                .catch(() => {
                    setPreviewData({
                        filename: fileData.filename,
                        shape: fileData.shape || [0, fileData.columns?.length || 0],
                        columns: fileData.columns || [],
                        dtypes: fileData.dtypes || {},
                        null_counts: {},
                        statistics: {},
                        preview: fileData.preview || []
                    });
                    setLoading(false);
                });
        }
    }, [fileData]);

    if (loading) return <div className="loading-overlay"><div className="spinner"></div><p>Loading preview...</p></div>;

    const data = previewData || fileData;

    return (
        <div className="animate-in">
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 20 }}>
                <div className="stat-card">
                    <span className="stat-label">Rows</span>
                    <span className="stat-value accent">{data.shape?.[0] || '—'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Columns</span>
                    <span className="stat-value">{data.shape?.[1] || data.columns?.length || '—'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Numeric</span>
                    <span className="stat-value success">{data.numeric_columns?.length || '—'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Categorical</span>
                    <span className="stat-value warning">{data.categorical_columns?.length || '—'}</span>
                </div>
            </div>

            {/* Column Info */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title"><Database size={18} /> Column Information</div>
                        <p className="card-subtitle">Data types and missing value counts</p>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Column</th>
                                <th>Type</th>
                                <th>Nulls</th>
                                {data.statistics && <th>Mean</th>}
                                {data.statistics && <th>Min</th>}
                                {data.statistics && <th>Max</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.columns?.map(col => (
                                <tr key={col}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{col}</td>
                                    <td><span className="metric-badge" style={{ padding: '4px 8px', fontSize: 11 }}>{data.dtypes?.[col] || '—'}</span></td>
                                    <td style={{ color: data.null_counts?.[col] > 0 ? 'var(--warning)' : 'var(--success)' }}>
                                        {data.null_counts?.[col] ?? '—'}
                                    </td>
                                    {data.statistics && <td>{data.statistics[col]?.mean ?? '—'}</td>}
                                    {data.statistics && <td>{data.statistics[col]?.min ?? '—'}</td>}
                                    {data.statistics && <td>{data.statistics[col]?.max ?? '—'}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Data Table Preview */}
            {data.preview?.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title"><Table size={18} /> Data Preview</div>
                            <p className="card-subtitle">First {data.preview.length} rows</p>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {data.columns?.map(col => <th key={col}>{col}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data.preview.map((row, i) => (
                                    <tr key={i}>
                                        {data.columns?.map(col => (
                                            <td key={col}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : '—'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataPreview;
