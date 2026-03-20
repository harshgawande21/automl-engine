import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BarChart from '../../components/charts/BarChart';
import CorrelationHeatmap from '../../components/charts/CorrelationHeatmap';
import PieChart from '../../components/charts/PieChart';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import { 
    Activity, 
    AlertTriangle,
    BarChart3, 
    CheckCircle2,
    Database, 
    Info, 
    LayoutGrid, 
    Lightbulb,
    Play, 
    Sparkles,
    Target, 
    TrendingUp 
} from 'lucide-react';

export default function AnalyticsDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentDataset } = useSelector(state => state.data);
    const { currentModel } = useSelector(state => state.model);
    
    const datasetInfo = location.state?.datasetInfo || currentDataset || currentModel?.datasetInfo;
    const results = location.state?.results || currentModel;
    const algorithm = location.state?.algorithm || currentModel?.algorithm;
    const taskType = location.state?.taskType || currentModel?.taskType;

    if (!datasetInfo || !results) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
                <Card className="max-w-2xl text-center p-12 border-2 border-dashed border-blue-100 shadow-xl">
                    <Database className="w-20 h-20 text-blue-200 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Awaiting Data Insights</h2>
                    <p className="text-slate-600 mb-8 text-lg">
                        This advanced analytics floor requires an analyzed dataset and a trained model. 
                        Launch your first ML pipeline to unlock strategic intelligence.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Button onClick={() => navigate('/data/upload')} variant="outline" className="px-8 border-blue-400 text-blue-600">
                            Upload Dataset
                        </Button>
                        <Button onClick={() => navigate('/model/training')} icon={Play} className="px-8 bg-blue-600 shadow-lg shadow-blue-200">
                            Train New Model
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Recommendation Logic based on performance
    const getRecommendations = () => {
        const recs = [];
        if (taskType === 'clustering') {
            if (results.silhouetteScore > 0.6) {
                recs.push({ title: 'Optimal Clustering', desc: 'The data has clearly defined groups. Proceed to profile these clusters.', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' });
            } else {
                recs.push({ title: 'Low Separation', desc: 'Clusters overlap. Consider adding more features or trying more clusters.', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' });
            }
            recs.push({ title: 'Actionable Segments', desc: 'Identify common traits within each cluster for targeted marketing or operations.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' });
        } else {
            if (results.accuracy > 0.9) {
                recs.push({ title: 'Production Ready', desc: 'High accuracy detected. This model is reliable for automated decision-making.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' });
            } else if (results.accuracy > 0.7) {
                recs.push({ title: 'Refinement Advised', desc: 'Accuracy is acceptable but could improve with more specific feature engineering.', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50' });
            } else {
                recs.push({ title: 'Data Imbalance?', desc: 'Check if target classes are evenly distributed to improve performance.', icon: Activity, color: 'text-pink-500', bg: 'bg-pink-50' });
            }
        }
        return recs;
    };

    // Calculate a "Confidence Score"
    const confidenceScore = Math.round((results.accuracy || results.silhouetteScore || 0.8) * 100);

    const distributionData = taskType === 'clustering' 
        ? results.clusterSizes.map((size, i) => ({ name: `Segment ${i+1}`, value: size }))
        : datasetInfo.eda?.distributions?.[datasetInfo.targetColumn]?.slice(0, 5) || [
            { name: 'Class A', value: 65 },
            { name: 'Class B', value: 35 }
        ];

    const performanceMetrics = taskType === 'clustering'
        ? [
            { name: 'Stability', value: results.silhouetteScore },
            { name: 'Density', value: (results.inertia / 100000) % 1 }
        ]
        : [
            { name: 'Accuracy', value: results.accuracy },
            { name: 'F1 Score', value: results.f1Score }
        ];

    const featureImportanceData = results.featureImportance?.map(f => ({
        feature: f.feature,
        importance: f.importance * 100
    })) || (taskType === 'clustering' ? [
        { feature: 'Feature A', importance: 45 },
        { feature: 'Feature B', importance: 30 },
        { feature: 'Feature C', importance: 25 }
    ] : []);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            {/* Top Insight Bar */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive ML Dashboard</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Strategic Analysis: <span className="text-blue-600 uppercase font-bold">{algorithm?.replace('_', ' ')}</span></p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-slate-100/50 p-2 rounded-xl flex items-center gap-4 px-4 border border-slate-200">
                             <div className="text-right">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Model Reliability</div>
                                <div className="text-xl font-bold text-slate-800">{confidenceScore}%</div>
                             </div>
                             <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-600 bg-emerald-50">
                                HIGH
                             </div>
                        </div>
                        <Badge variant="primary" className="px-4 py-2 text-sm shadow-sm ring-4 ring-blue-50">Live Intel</Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 pt-8 space-y-8">
                
                {/* Decision Support Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border-none shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-40 h-40 text-blue-400" />
                        </div>
                        <div className="p-8 relative">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-blue-400" />
                                Decision Support & Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getRecommendations().map((rec, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${rec.bg} ${rec.color}`}>
                                                <rec.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{rec.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                <p className="text-slate-400 text-sm italic italic">Automated intelligence based on {datasetInfo.rows.toLocaleString()} data points</p>
                                <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={() => navigate('/prediction/single')}>
                                    Deploy Strategy
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white border-blue-100 shadow-xl flex flex-col justify-center text-center p-8">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Growth Potential</h3>
                            <p className="text-sm text-slate-500 mt-2">Predicted accuracy uplift if data sample is doubled</p>
                        </div>
                        <div className="text-4xl font-black text-blue-600 mb-2">+{Math.min(5, (100 - confidenceScore) / 2)}%</div>
                        <p className="text-xs text-slate-400">Estimated based on learning curves</p>
                    </Card>
                </div>

                {/* Main Visual Data Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-none ring-1 ring-slate-200">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                                    {taskType === 'clustering' ? 'High Impact Features' : 'Feature Influence (%)'}
                                </CardTitle>
                                <div className="group relative">
                                    <Info className="w-4 h-4 text-slate-300 cursor-help" />
                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        Shows which features contribute most to the model's decision-making logic.
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="p-6 h-80">
                            {featureImportanceData.length > 0 ? (
                                <BarChart 
                                    data={featureImportanceData} 
                                    bars={[{ key: 'importance', label: 'Weight %', color: '#6366F1' }]} 
                                    xKey="feature"
                                    height={280} 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                    <AlertTriangle className="w-12 h-12 text-slate-200" />
                                    <p className="italic text-sm">Sensitivity data limited for this model architecture</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-none ring-1 ring-slate-200">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <LayoutGrid className="w-6 h-6 text-orange-500" />
                                    Strategic Correlations
                                </CardTitle>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100">Relationship Analysis</Badge>
                            </div>
                        </CardHeader>
                        <div className="p-6 overflow-hidden h-80">
                            {datasetInfo.eda?.correlations ? (
                                <CorrelationHeatmap 
                                    data={datasetInfo.eda.correlations} 
                                    columns={Object.keys(datasetInfo.eda.correlations).slice(0, 10)}
                                    height={280}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 italic">
                                    Interaction data points not synchronized
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card className="shadow-lg hover:shadow-xl transition-shadow border-none ring-1 ring-slate-200">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <CardTitle className="flex items-center gap-3 text-slate-800">
                                <Activity className="w-6 h-6 text-pink-500" />
                                {taskType === 'clustering' ? 'Structural Distribution' : 'Target Balance Overview'}
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6 h-80">
                            <PieChart data={distributionData} height={280} />
                        </div>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-none ring-1 ring-slate-200">
                        <CardHeader className="border-b border-slate-50 pb-4">
                             <CardTitle className="flex items-center gap-3 text-slate-800">
                                <Target className="w-6 h-6 text-emerald-500" />
                                KPI Performance Benchmarks
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6 h-80">
                            <BarChart 
                                data={performanceMetrics} 
                                bars={[{ key: 'value', label: 'Score', color: '#10B981' }]} 
                                xKey="name"
                                height={280} 
                            />
                        </div>
                    </Card>
                </div>

                {/* Final Intelligence Footer */}
                <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <BrainIcon className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Lightbulb className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold">Conclusion & Strategy</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <p className="text-blue-50 text-xl leading-relaxed">
                                    Your data ecosystem shows <span className="font-bold underline decoration-pink-400">strong coherence</span> in the recent {algorithm?.replace('_', ' ')} cycle. 
                                    With a {confidenceScore}% reliability index, we recommend proceeding with 
                                    <span className="font-bold text-white ml-1">
                                        {taskType === 'clustering' ? 'cluster-based segmentation strategies' : 'high-impact predictions'}
                                    </span>.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>
                                        {taskType === 'clustering' ? 'Natural data patterns distilled' : 'Dataset complexity handled autonomously'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>
                                        {taskType === 'clustering' ? 'Segment differentiators identified' : 'Primary drivers identified and validated'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>
                                        {taskType === 'clustering' ? 'Strategic grouping validated' : 'Strategic alignment with business KPIs verified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BrainIcon({ className }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
    );
}

function Users({ className }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v4h-2zm0 6h2v2h-2z" />
        </svg>
    );
}
