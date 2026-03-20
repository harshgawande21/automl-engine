import axios from 'axios';
import { AlertCircle, Lightbulb, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from './common/Button';
import Card, { CardHeader, CardTitle } from './common/Card';

const Recommendations = ({ filename, columns }) => {
    const [targetColumn, setTargetColumn] = useState('');
    const [recs, setRecs] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async (target = '') => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/recommend/', {
                filename,
                target_column: target
            });
            setRecs(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRecommendations();
    }, [filename]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb size={18} />
                            Smart Recommendations
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">AI analyzes your dataset and suggests the best models</p>
                    </div>
                </CardHeader>
                <div className="flex gap-3 items-end">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Column (optional)</label>
                        <select 
                            value={targetColumn} 
                            onChange={(e) => setTargetColumn(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        >
                            <option value="">— None (Clustering) —</option>
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <Button 
                        onClick={() => fetchRecommendations(targetColumn)}
                        loading={loading}
                        icon={TrendingUp}
                    >
                        Get Recommendations
                    </Button>
                </div>
            </Card>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <p className="text-slate-600">Analyzing dataset...</p>
                </div>
            )}

            {recs && !loading && (
                <>
                    {/* Dataset Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Task Type</span>
                            <span className="block text-lg font-semibold text-blue-700 capitalize mt-1">{recs.task_type || '—'}</span>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Rows</span>
                            <span className="block text-lg font-semibold text-green-700 mt-1">{recs.dataset_summary?.rows || '—'}</span>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Numeric</span>
                            <span className="block text-lg font-semibold text-yellow-700 mt-1">{recs.dataset_summary?.numeric_columns || '—'}</span>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                            <span className="text-xs font-medium text-pink-600 uppercase tracking-wider">Categorical</span>
                            <span className="block text-lg font-semibold text-pink-700 mt-1">{recs.dataset_summary?.categorical_columns || '—'}</span>
                        </div>
                    </div>

                    {/* Preprocessing Tips */}
                    {recs.preprocessing_tips?.length > 0 && (
                        <div className="space-y-2">
                            {recs.preprocessing_tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                    <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-sm font-medium text-blue-800">{tip.tip}</strong>
                                        <div className="text-xs text-blue-600 mt-1">{tip.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Model Recommendations */}
                    {recs.models?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star size={18} />
                                    Recommended Models
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recs.models.map((model, i) => (
                                    <div key={i} className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-blue-700">
                                                {model.confidence}% match
                                            </span>
                                            {i === 0 && <span className="bg-gradient-to-r from-blue-400 to-pink-400 text-white text-xs font-bold px-2 py-1 rounded">TOP PICK</span>}
                                        </div>
                                        <div className="font-semibold text-slate-800 mb-1">{model.name}</div>
                                        <div className="text-sm text-slate-600 mb-3">{model.reason}</div>
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-400 to-pink-400 h-2 rounded-full transition-all duration-300" style={{
                                                width: `${model.confidence}%`
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Visualization Suggestions */}
                    {recs.visualizations?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp size={18} />
                                    Suggested Visualizations
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-2">
                                {recs.visualizations.map((viz, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                                        <div>
                                            <strong className="text-sm font-medium text-slate-800 capitalize">{viz.type.replace('_', ' ')}</strong>
                                            <p className="text-xs text-slate-600 mt-1">{viz.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default Recommendations;
