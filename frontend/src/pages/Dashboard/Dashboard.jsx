import {
    Activity, BarChart3, Brain, CheckCircle, Clock,
    Database, Play, Settings, Target, TrendingUp, Upload, Zap, AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import api from '../../config/axiosConfig';

function timeAgo(dateStr) {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState({ models: 0, datasets: 0, predictions: 0, avgAccuracy: null });
    const [models, setModels] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [m, d, p] = await Promise.allSettled([
                    api.get('/models/'),
                    api.get('/data/list'),
                    api.get('/predictions/history'),
                ]);
                const modelList = m.status === 'fulfilled' ? (m.value.data?.data || []) : [];
                const datasetList = d.status === 'fulfilled' ? (d.value.data?.data || []) : [];
                const predList = p.status === 'fulfilled' ? (p.value.data?.data || []) : [];

                const accuracies = modelList.filter(m => m.metrics?.accuracy).map(m => m.metrics.accuracy);
                const avgAcc = accuracies.length ? (accuracies.reduce((a, b) => a + b, 0) / accuracies.length * 100).toFixed(1) : null;

                setModels(modelList);
                setDatasets(datasetList);
                setPredictions(predList);
                setStats({ models: modelList.length, datasets: datasetList.length, predictions: predList.length, avgAccuracy: avgAcc });
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const kpiData = [
        { label: 'Models Trained', value: stats.models, icon: Brain, color: 'blue', route: '/model/training' },
        { label: 'Datasets', value: stats.datasets, icon: Database, color: 'green', route: '/data/upload' },
        { label: 'Predictions', value: stats.predictions, icon: Target, color: 'yellow', route: '/prediction/single' },
        { label: 'Avg Accuracy', value: stats.avgAccuracy ? `${stats.avgAccuracy}%` : '—', icon: TrendingUp, color: 'pink', route: '/model/evaluation' },
    ];

    const quickActions = [
        { title: 'Upload Dataset', description: 'Add new data for training', icon: Upload, route: '/data/upload', color: 'blue' },
        { title: 'Train Model', description: 'Create new ML model', icon: Play, route: '/model/training', color: 'green' },
        { title: 'Make Prediction', description: 'Single or batch predictions', icon: Target, route: '/prediction/single', color: 'purple' },
        { title: 'View Analytics', description: 'Detailed insights', icon: BarChart3, route: '/analytics', color: 'orange' },
        { title: 'Monitoring', description: 'Monitor performance', icon: Activity, route: '/monitoring', color: 'red' },
        { title: 'Work History', description: 'View past work', icon: Clock, route: '/history', color: 'gray' },
    ];

    const colorMap = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-50' },
        green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-50' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', hover: 'hover:bg-yellow-50' },
        pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-50' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-50' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-50' },
        red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-50' },
        gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', hover: 'hover:bg-gray-50' },
    };

    // Build recent activity from real data
    const recentActivity = [
        ...models.slice(0, 3).map(m => ({
            id: m.id, action: 'Model trained',
            details: `${m.model_type?.replace(/_/g, ' ')} ${m.metrics?.accuracy ? `— ${(m.metrics.accuracy * 100).toFixed(1)}% accuracy` : ''}`,
            time: timeAgo(m.created_at), status: 'success'
        })),
        ...datasets.slice(0, 2).map(d => ({
            id: d.id, action: 'Dataset uploaded',
            details: `${d.filename} — ${d.rows?.toLocaleString() || '?'} rows`,
            time: timeAgo(d.created_at), status: 'success'
        })),
        ...predictions.slice(0, 2).map(p => ({
            id: p.id, action: 'Prediction made',
            details: `${p.type || 'single'} prediction${p.confidence ? ` — ${(p.confidence * 100).toFixed(0)}% confidence` : ''}`,
            time: timeAgo(p.created_at), status: 'success'
        })),
    ].sort((a, b) => 0).slice(0, 6);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
                        </h1>
                        <p className="text-slate-600 mt-1">Here's what's happening with your ML projects</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/data/upload')}>
                        <Upload className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {kpiData.map((kpi) => {
                        const Icon = kpi.icon;
                        const c = colorMap[kpi.color];
                        return (
                            <Card key={kpi.label} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate(kpi.route)}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium">{kpi.label}</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-1">
                                            {loading ? <span className="text-slate-300 text-xl">...</span> : kpi.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 ${c.bg} rounded-lg`}>
                                        <Icon className={`w-6 h-6 ${c.text}`} />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                const c = colorMap[action.color];
                                return (
                                    <button key={action.route} onClick={() => navigate(action.route)}
                                        className={`p-4 bg-white border ${c.border} rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 text-left group ${c.hover}`}>
                                        <div className={`p-2 ${c.bg} rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-5 h-5 ${c.text}`} />
                                        </div>
                                        <h3 className="font-semibold text-slate-800 text-sm">{action.title}</h3>
                                        <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Recent Models */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Models</CardTitle>
                            <button onClick={() => navigate('/history')} className="text-xs text-blue-500 hover:underline">View all</button>
                        </CardHeader>
                        {loading ? (
                            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}</div>
                        ) : models.length === 0 ? (
                            <div className="text-center py-8">
                                <Brain size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">No models yet</p>
                                <button onClick={() => navigate('/model/training')} className="mt-2 text-xs text-blue-500 hover:underline">Train your first model</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {models.slice(0, 4).map(m => {
                                    const acc = m.metrics?.accuracy ? `${(m.metrics.accuracy * 100).toFixed(1)}%` : m.metrics?.r2_score ? `R²: ${m.metrics.r2_score.toFixed(2)}` : '—';
                                    return (
                                        <div key={m.id} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate('/history')}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg"><Brain className="w-4 h-4 text-blue-600" /></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{m.model_type?.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-slate-500">{timeAgo(m.created_at)}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">{acc}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <button onClick={() => navigate('/history')} className="text-xs text-blue-500 hover:underline">View all</button>
                        </CardHeader>
                        {loading ? (
                            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />)}</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">No activity yet</p>
                                <button onClick={() => navigate('/data/upload')} className="mt-2 text-xs text-blue-500 hover:underline">Upload a dataset to get started</button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentActivity.map((a, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                                        <div className="p-2 rounded-full bg-green-100 flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800">{a.action}</p>
                                            <p className="text-xs text-slate-600 truncate">{a.details}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 flex-shrink-0">{a.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Recent Datasets */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Datasets</CardTitle>
                            <button onClick={() => navigate('/history')} className="text-xs text-blue-500 hover:underline">View all</button>
                        </CardHeader>
                        {loading ? (
                            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}</div>
                        ) : datasets.length === 0 ? (
                            <div className="text-center py-8">
                                <Database size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">No datasets yet</p>
                                <button onClick={() => navigate('/data/upload')} className="mt-2 text-xs text-blue-500 hover:underline">Upload your first dataset</button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {datasets.slice(0, 5).map(d => (
                                    <div key={d.id} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate('/data/upload')}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg"><Database className="w-4 h-4 text-green-600" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 truncate max-w-[160px]">{d.filename}</p>
                                                <p className="text-xs text-slate-500">{d.rows?.toLocaleString() || '?'} rows • {d.size_mb} MB</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">{timeAgo(d.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
