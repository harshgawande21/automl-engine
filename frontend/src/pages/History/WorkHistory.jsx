import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Database, Brain, Target, ChevronRight, Trash2, RefreshCw, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../config/axiosConfig';

const STATUS_COLOR = {
  completed: 'bg-green-100 text-green-700',
  training: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  ready: 'bg-blue-100 text-blue-700',
};

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function WorkHistory() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, m, p] = await Promise.all([
        api.get('/data/list'),
        api.get('/models/'),
        api.get('/predictions/history'),
      ]);
      setDatasets(d.data?.data || []);
      setModels(m.data?.data || []);
      setPredictions(p.data?.data || []);
    } catch (e) {
      setError('Failed to load history. Make sure the backend is running.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteDataset = async (id) => {
    if (!confirm('Delete this dataset?')) return;
    await api.delete(`/data/${id}`);
    setDatasets(prev => prev.filter(d => d.id !== id));
  };

  const deleteModel = async (id) => {
    if (!confirm('Delete this model?')) return;
    await api.delete(`/models/${id}`);
    setModels(prev => prev.filter(m => m.id !== id));
  };

  const tabs = [
    { id: 'all', label: 'All Activity', count: datasets.length + models.length + predictions.length },
    { id: 'datasets', label: 'Datasets', count: datasets.length },
    { id: 'models', label: 'Models', count: models.length },
    { id: 'predictions', label: 'Predictions', count: predictions.length },
  ];

  // Build unified timeline
  const timeline = [
    ...datasets.map(d => ({ type: 'dataset', ...d, sortDate: d.created_at })),
    ...models.map(m => ({ type: 'model', ...m, sortDate: m.created_at })),
    ...predictions.map(p => ({ type: 'prediction', ...p, sortDate: p.created_at })),
  ].sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

  const filtered = activeTab === 'all' ? timeline
    : activeTab === 'datasets' ? timeline.filter(i => i.type === 'dataset')
    : activeTab === 'models' ? timeline.filter(i => i.type === 'model')
    : timeline.filter(i => i.type === 'prediction');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={24} />
              Work History
            </h1>
            <p className="text-slate-500 text-sm mt-1">All your datasets, models, and predictions in one place</p>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Datasets', value: datasets.length, icon: Database, color: 'blue', route: '/data/upload' },
            { label: 'Models Trained', value: models.length, icon: Brain, color: 'green', route: '/model/training' },
            { label: 'Predictions Made', value: predictions.length, icon: Target, color: 'purple', route: '/prediction/single' },
          ].map(({ label, value, icon: Icon, color, route }) => (
            <div key={label} onClick={() => navigate(route)} className="bg-white rounded-xl border border-blue-100 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all">
              <div className={`p-3 rounded-xl bg-${color}-100`}>
                <Icon size={20} className={`text-${color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-blue-100 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-blue-50'}`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
            <p className="text-slate-500">Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No history yet</p>
            <p className="text-slate-400 text-sm mt-1">Upload a dataset to get started</p>
            <button onClick={() => navigate('/data/upload')} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Upload Dataset
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, idx) => (
              <HistoryItem key={`${item.type}-${item.id}-${idx}`} item={item} onDeleteDataset={deleteDataset} onDeleteModel={deleteModel} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryItem({ item, onDeleteDataset, onDeleteModel, navigate }) {
  const [expanded, setExpanded] = useState(false);

  if (item.type === 'dataset') {
    return (
      <div className="bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Database size={18} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800 truncate">{item.filename}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[item.status] || STATUS_COLOR.ready}`}>{item.status || 'ready'}</span>
            </div>
            <p className="text-sm text-slate-500">Dataset • {item.rows?.toLocaleString() || '?'} rows × {item.columns || '?'} columns • {item.size_mb || '?'} MB</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-slate-400">{timeAgo(item.created_at)}</span>
            <button onClick={(e) => { e.stopPropagation(); navigate('/data/upload'); }} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Use</button>
            <button onClick={(e) => { e.stopPropagation(); onDeleteDataset(item.id); }} className="text-slate-400 hover:text-red-500 transition-colors p-1">
              <Trash2 size={14} />
            </button>
            <ChevronRight size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
        {expanded && (
          <div className="px-4 pb-4 border-t border-blue-50 pt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['Rows', item.rows?.toLocaleString()], ['Columns', item.columns], ['Size', `${item.size_mb} MB`], ['Uploaded', new Date(item.created_at).toLocaleDateString()]].map(([k, v]) => (
                <div key={k} className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium">{k}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{v || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (item.type === 'model') {
    const acc = item.metrics?.accuracy ? `${(item.metrics.accuracy * 100).toFixed(1)}%` : item.metrics?.r2_score ? `R²: ${item.metrics.r2_score.toFixed(3)}` : null;
    return (
      <div className="bg-white rounded-xl border border-green-100 hover:border-green-300 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800 truncate">{item.name || item.model_type}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[item.status] || STATUS_COLOR.completed}`}>{item.status || 'completed'}</span>
            </div>
            <p className="text-sm text-slate-500">
              {item.model_type?.replace(/_/g, ' ')} • {item.task_type}
              {acc && <span className="ml-2 text-green-600 font-medium">{acc}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-slate-400">{timeAgo(item.created_at)}</span>
            <button onClick={(e) => { e.stopPropagation(); navigate('/prediction/single'); }} className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">Predict</button>
            <button onClick={(e) => { e.stopPropagation(); onDeleteModel(item.id); }} className="text-slate-400 hover:text-red-500 transition-colors p-1">
              <Trash2 size={14} />
            </button>
            <ChevronRight size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
        {expanded && item.metrics && (
          <div className="px-4 pb-4 border-t border-green-50 pt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metrics</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(item.metrics).filter(([k]) => !['classification_report','confusion_matrix','feature_importances'].includes(k)).slice(0, 8).map(([k, v]) => (
                <div key={k} className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">{k.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{typeof v === 'number' ? (v > 1 ? v.toFixed(2) : (v * 100).toFixed(1) + '%') : String(v)}</p>
                </div>
              ))}
            </div>
            {item.training_duration && (
              <p className="text-xs text-slate-400 mt-2">Training time: {item.training_duration.toFixed(2)}s</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (item.type === 'prediction') {
    return (
      <div className="bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800">Prediction</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">{item.type === 'prediction' ? (item.prediction_type || 'single') : ''}</span>
            </div>
            <p className="text-sm text-slate-500">
              {item.confidence ? `Confidence: ${(item.confidence * 100).toFixed(1)}%` : ''}
              {item.latency_ms ? ` • ${item.latency_ms.toFixed(0)}ms` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-slate-400">{timeAgo(item.created_at)}</span>
            <ChevronRight size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
        {expanded && (
          <div className="px-4 pb-4 border-t border-purple-50 pt-3 space-y-2">
            {item.result && (
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium mb-1">Result</p>
                <p className="text-sm text-slate-800 font-mono">{JSON.stringify(item.result)}</p>
              </div>
            )}
            {item.input_data && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1">Input</p>
                <p className="text-xs text-slate-600 font-mono truncate">{JSON.stringify(item.input_data)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
