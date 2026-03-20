import axios from 'axios';
import { Activity, BarChart3 } from 'lucide-react';
import environment from '../config/environment';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Button from './common/Button';
import Card, { CardHeader, CardTitle } from './common/Card';

const COLORS = ['#60A5FA', '#93C5FD', '#F472B6', '#FDE047', '#4ADE80', '#3B82F6', '#8B5CF6'];

const Visualizations = ({ filename, columns }) => {
    const [histData, setHistData] = useState(null);
    const [corrData, setCorrData] = useState(null);
    const [selectedCol, setSelectedCol] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('histogram');

    const loadHistogram = async (col = '') => {
        setLoading(true);
        try {
            const res = await axios.post(`${environment.API_BASE_URL}/visualize/histogram`, { filename, column: col });
            setHistData(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadCorrelation = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${environment.API_BASE_URL}/visualize/correlation`, { filename });
            setCorrData(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'histogram' && !histData) loadHistogram();
        if (tab === 'correlation' && !corrData) loadCorrelation();
    };

    return (
        <div className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-2">
                {['histogram', 'correlation'].map(tab => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? 'primary' : 'outline'}
                        onClick={() => handleTabChange(tab)}
                        icon={tab === 'histogram' ? BarChart3 : Activity}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                ))}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            )}

            {/* Histogram Tab */}
            {activeTab === 'histogram' && !loading && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 size={18} />
                            Column Distribution
                        </CardTitle>
                        <select 
                            className="px-3 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            value={selectedCol} 
                            onChange={(e) => { 
                                setSelectedCol(e.target.value); 
                                loadHistogram(e.target.value); 
                            }}
                        >
                            <option value="">All Numeric Columns</option>
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </CardHeader>

                    {histData?.data && (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={histData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="bin" stroke="#6B7280" fontSize={11} angle={-30} textAnchor="end" height={60} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#1F2937' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {histData.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {histData?.histograms && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {Object.entries(histData.histograms).map(([col, data]) => (
                                <div key={col} className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">{col}</h4>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="bin" stroke="#6B7280" fontSize={10} />
                                            <YAxis stroke="#6B7280" fontSize={10} />
                                            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#1F2937' }} />
                                            <Bar dataKey="count" fill="#60A5FA" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {/* Correlation Tab */}
            {activeTab === 'correlation' && !loading && corrData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity size={18} />
                            Correlation Heatmap
                        </CardTitle>
                    </CardHeader>
                    {corrData.columns && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"></th>
                                        {corrData.columns.map(c => <th key={c} className="p-2 text-xs font-medium text-blue-700 uppercase tracking-wider">{c}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100">
                                    {corrData.columns.map(row => (
                                        <tr key={row}>
                                            <td className="p-2 font-medium text-slate-800 text-xs">{row}</td>
                                            {corrData.columns.map(col => {
                                                const val = corrData.correlation_matrix?.[row]?.[col] ?? 0;
                                                const abs = Math.abs(val);
                                                const bg = val > 0
                                                    ? `rgba(96, 165, 250, ${abs * 0.7})`
                                                    : `rgba(248, 113, 113, ${abs * 0.7})`;
                                                return (
                                                    <td key={col} className="p-2 text-center font-medium text-xs" style={{ background: bg, color: abs > 0.4 ? '#FFFFFF' : '#374151' }}>
                                                        {val.toFixed(2)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default Visualizations;
