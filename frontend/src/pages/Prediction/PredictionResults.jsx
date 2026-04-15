import {
    Activity,
    BarChart3,
    Brain,
    CheckCircle,
    Info,
    Play,
    Target,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import api from '../../config/axiosConfig';

const getAlgorithmDisplayName = (alg) => {
    const names = {
        'random_forest': 'Random Forest', 'xgboost': 'XGBoost',
        'logistic_regression': 'Logistic Regression', 'svm': 'SVM',
        'knn': 'KNN', 'kmeans': 'K-Means', 'dbscan': 'DBSCAN',
        'hierarchical': 'Hierarchical Clustering', 'linear_regression': 'Linear Regression',
    };
    return names[alg] || alg;
};

function getVerdict(pct) {
    if (pct >= 90) return { text: '🌟 Excellent', color: 'text-green-600' };
    if (pct >= 75) return { text: '👍 Good', color: 'text-blue-600' };
    if (pct >= 60) return { text: '⚠️ Fair', color: 'text-yellow-600' };
    return { text: '❌ Needs work', color: 'text-red-500' };
}

function MetricRow({ label, value, description, color, isPercent = true }) {
    const pct = isPercent ? (value <= 1 ? value * 100 : value) : null;
    const verdict = isPercent ? getVerdict(pct) : null;
    const colorMap = {
        purple: 'bg-purple-50 text-purple-800 border-purple-200',
        blue: 'bg-blue-50 text-blue-800 border-blue-200',
        green: 'bg-green-50 text-green-800 border-green-200',
        orange: 'bg-orange-50 text-orange-800 border-orange-200',
    };
    const barMap = {
        purple: 'bg-purple-400', blue: 'bg-blue-400',
        green: 'bg-green-400', orange: 'bg-orange-400',
    };
    return (
        <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
            <div className="flex justify-between items-start mb-1">
                <div>
                    <span className="text-sm font-semibold">{label}</span>
                    <p className="text-xs opacity-70 mt-0.5">{description}</p>
                </div>
                <div className="text-right">
                    <span className="text-xl font-bold">
                        {isPercent ? `${pct.toFixed(1)}%` : value}
                    </span>
                    {verdict && <p className={`text-xs font-medium ${verdict.color}`}>{verdict.text}</p>}
                </div>
            </div>
            {isPercent && (
                <div className="w-full bg-white/60 rounded-full h-2 mt-2">
                    <div className={`${barMap[color]} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
            )}
        </div>
    );
}

export default function PredictionResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const passed = location.state?.model;
        const modelId = location.state?.modelId;
        if (passed) {
            setModel(passed); setLoading(false);
        } else if (modelId) {
            api.get(`/models/${modelId}`).then(r => { setModel(r.data?.data || r.data); setLoading(false); }).catch(() => setLoading(false));
        } else {
            api.get('/models/').then(r => {
                const list = r.data?.data || [];
                if (list.length > 0) setModel(list[0]);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, []);

    // Also support old navigation style (from ModelTraining before fix)
    const algorithm = model?.model_type || location.state?.algorithm;
    const taskType = model?.task_type || location.state?.taskType;
    const datasetInfo = location.state?.datasetInfo;
    // Backend returns metrics inside 'results' key when coming directly from training
    const metrics = model?.metrics || model?.results || {};

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <div className="bg-white border-b border-blue-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Model Results</h1>
                </div>
                <div className="p-6">
                    <Card>
                        <div className="p-12 text-center">
                            <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
                            <p className="text-slate-600">Loading model results...</p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!model && !location.state?.modelTrained) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <div className="bg-white border-b border-blue-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Model Results</h1>
                </div>
                <div className="p-6">
                    <Card>
                        <div className="p-12 text-center">
                            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Model Results</h3>
                            <p className="text-slate-600 mb-6">Train a model to see performance results here</p>
                            <Button onClick={() => navigate('/model/training')} icon={Play}>Train Model</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // Plain-English summary
    const getSummary = () => {
        if (taskType === 'clustering') {
            const n = metrics.n_clusters;
            const sil = metrics.silhouette_score;
            return `The AI found ${n || '?'} natural groups in your data. ${sil >= 0.6 ? 'The groups are well-separated — reliable segmentation.' : sil >= 0.4 ? 'Groups have moderate separation — useful but some overlap.' : 'Groups overlap somewhat — consider tuning parameters.'}`;
        }
        if (taskType === 'regression') {
            const r2 = metrics.r2_score;
            if (!r2) return 'Model trained successfully.';
            return `The model explains ${(r2 * 100).toFixed(1)}% of the variation in your target value. ${r2 >= 0.85 ? 'Excellent fit!' : r2 >= 0.6 ? 'Good fit — captures most patterns.' : 'Weak fit — try feature engineering or a different algorithm.'}`;
        }
        const acc = metrics.accuracy;
        if (!acc) return 'Model trained successfully.';
        return `Your model correctly predicted ${(acc * 100).toFixed(1)}% of cases. ${acc >= 0.9 ? 'Excellent — ready for real use!' : acc >= 0.75 ? 'Good — reliable for most use cases.' : 'Moderate — try more data or a different algorithm.'}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-slate-800">Model Training Results</h1>
                <p className="text-slate-600">Performance analysis and insights for your trained model</p>
            </div>

            <div className="p-6">
                {/* Success Banner */}
                <Card className="mb-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="p-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-slate-800">Model Training Completed Successfully!</h2>
                                <p className="text-slate-600 text-sm mt-1">{getAlgorithmDisplayName(algorithm)} trained on {datasetInfo?.rows || model?.name || 'your dataset'}</p>
                                {/* Plain English */}
                                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-green-200">
                                    <p className="text-sm text-slate-700 flex items-start gap-2">
                                        <span className="text-lg">💬</span>
                                        <span><strong>What this means:</strong> {getSummary()}</span>
                                    </p>
                                </div>
                            </div>
                            <Badge variant="primary">{taskType === 'clustering' ? 'Unsupervised' : 'Supervised'} Learning</Badge>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Performance Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                Performance Metrics
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-3">
                            {taskType === 'clustering' ? (
                                <>
                                    {metrics.silhouette_score != null && <MetricRow label="Silhouette Score" value={metrics.silhouette_score} description="How well-separated are the clusters? Closer to 1 = better." color="purple" />}
                                    {metrics.inertia != null && <MetricRow label="Inertia" value={metrics.inertia?.toFixed(0)} description="Total distance of points from cluster centers. Lower = tighter clusters." color="blue" isPercent={false} />}
                                    {metrics.n_clusters != null && <MetricRow label="Number of Clusters" value={metrics.n_clusters} description="How many natural groups the AI discovered in your data." color="green" isPercent={false} />}
                                </>
                            ) : taskType === 'regression' ? (
                                <>
                                    {metrics.r2_score != null && <MetricRow label="R² Score" value={metrics.r2_score} description="How well the model explains the data. 100% = perfect prediction." color="blue" />}
                                    {metrics.mse != null && <MetricRow label="Mean Squared Error" value={metrics.mse?.toFixed(4)} description="Average squared difference between predicted and actual values. Lower = better." color="orange" isPercent={false} />}
                                    {metrics.mae != null && <MetricRow label="Mean Absolute Error" value={metrics.mae?.toFixed(4)} description="Average absolute difference between predicted and actual values. Lower = better." color="purple" isPercent={false} />}
                                </>
                            ) : (
                                <>
                                    {metrics.accuracy != null && <MetricRow label="Accuracy" value={metrics.accuracy} description="Out of every 100 predictions, how many were correct?" color="green" />}
                                    {metrics.precision != null && <MetricRow label="Precision" value={metrics.precision} description="When the model says YES, how often is it actually right?" color="blue" />}
                                    {metrics.recall != null && <MetricRow label="Recall" value={metrics.recall} description="Out of all real YES cases, how many did the model catch?" color="purple" />}
                                    {metrics.f1_score != null && <MetricRow label="F1 Score" value={metrics.f1_score} description="Balance between Precision and Recall — best single metric for imbalanced data." color="orange" />}
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Training Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-purple-600" />
                                Training Information
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-3">
                            {[
                                ['Algorithm', getAlgorithmDisplayName(algorithm)],
                                ['Task Type', taskType],
                                ['Training Time', model?.training_duration ? `${Number(model.training_duration).toFixed(2)}s` : 'N/A'],
                                ['Dataset', model?.name || (datasetInfo?.rows ? `${datasetInfo.rows} rows` : 'N/A')],
                            ].map(([k, v]) => (
                                <div key={k} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm text-slate-600">{k}</span>
                                    <span className="font-semibold text-slate-800 capitalize">{v}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Feature Importance */}
                {metrics.feature_importances && Object.keys(metrics.feature_importances).length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                What Drove the Predictions?
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-4">These columns had the biggest influence on the model's decisions — ranked from most to least important.</p>
                            <div className="space-y-3">
                                {Object.entries(metrics.feature_importances).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([feat, imp]) => (
                                    <div key={feat} className="flex items-center gap-4">
                                        <div className="w-28 text-sm font-medium text-slate-700 truncate">{feat}</div>
                                        <div className="flex-1">
                                            <div className="w-full bg-gray-100 rounded-full h-6">
                                                <div className="bg-gradient-to-r from-blue-500 to-pink-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${(imp * 100).toFixed(1)}%` }}>
                                                    <span className="text-xs text-white font-medium">{(imp * 100).toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Confusion Matrix */}
                {metrics.confusion_matrix && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                Prediction Accuracy Map
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-4">Green diagonal = correct predictions. Red = mistakes. More green = better model.</p>
                            <div className="overflow-x-auto">
                                <table className="mx-auto text-sm">
                                    <tbody>
                                        {metrics.confusion_matrix.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((val, j) => (
                                                    <td key={j} className={`w-14 h-14 text-center font-bold rounded-lg m-1 ${i === j ? 'bg-green-100 text-green-700' : val > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex gap-4 mt-3 justify-center text-xs text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded inline-block" /> Correct</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-200 rounded inline-block" /> Incorrect</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                <Card>
                    <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button onClick={() => navigate('/prediction/single')} icon={Target} className="w-full">Make Predictions</Button>
                            <Button variant="outline" onClick={() => navigate('/analytics')} icon={Activity} className="w-full">View Analytics</Button>
                            <Button variant="outline" onClick={() => navigate('/model/training')} icon={Brain} className="w-full">Train Another Model</Button>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    <strong>Model Insights:</strong> {getSummary()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
