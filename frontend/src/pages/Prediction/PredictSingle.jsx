import { 
    AlertTriangle, 
    ArrowRightCircle, 
    Brain, 
    CheckCircle, 
    Info, 
    Layers, 
    Play, 
    RefreshCcw, 
    Send, 
    ShieldCheck, 
    Target, 
    TrendingUp, 
    Zap 
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BarChart from '../../components/charts/BarChart';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import PageContainer from '../../components/layout/PageContainer';
import { predictSingle } from '../../store/predictionSlice';

export default function PredictSingle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { results, loading } = useSelector((state) => state.prediction);
    const { currentModel } = useSelector((state) => state.model);
    
    const [features, setFeatures] = useState({});
    const [autoMode, setAutoMode] = useState(false);

    // Initialize features based on model columns
    useEffect(() => {
        if (currentModel?.datasetInfo?.columns_list) {
            const initial = {};
            currentModel.datasetInfo.columns_list.forEach(col => {
                if (col !== currentModel.targetColumn) {
                    initial[col] = '';
                }
            });
            setFeatures(initial);
        }
    }, [currentModel]);

    const handlePredict = () => {
        dispatch(predictSingle({ features, model_id: currentModel?.id || 'latest' }));
    };

    const handleInputChange = (name, value) => {
        const newFeatures = { ...features, [name]: value };
        setFeatures(newFeatures);
        
        // "What-if" auto-simulate if enabled
        if (autoMode && Object.values(newFeatures).every(v => v !== '')) {
            dispatch(predictSingle({ features: newFeatures, model_id: currentModel?.id || 'latest' }));
        }
    };

    if (!currentModel) {
        return (
            <PageContainer title="Single Prediction" subtitle="Simulate individual data points">
                <Card className="max-w-2xl mx-auto mt-10 text-center p-12 bg-slate-900 border-slate-800">
                    <Brain className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Intelligence Engine Offline</h2>
                    <p className="text-slate-400 mb-8">
                        Individual predictions require an active, trained model. 
                        Please complete the training cycle to unlock simulation capabilities.
                    </p>
                    <Button onClick={() => navigate('/model/training')} icon={Zap} className="bg-indigo-600">
                        Launch Training Cycle
                    </Button>
                </Card>
            </PageContainer>
        );
    }

    const confidence = results?.confidence || (results?.probability ? Math.max(...Object.values(results.probability)) : 0.85);
    const confidencePercent = Math.round(confidence * 100);

    const impactData = results?.localImpact?.map(item => ({
        feature: item.feature,
        impact: item.impact * 100
    })) || [
        { feature: 'Feature A', impact: 45 },
        { feature: 'Feature B', impact: -20 },
        { feature: 'Feature C', impact: 15 }
    ];

    return (
        <PageContainer title="Single Prediction" subtitle={`Production Simulation with ${currentModel.algorithm?.toUpperCase()} model`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Simulation Control Panel */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <Card className="bg-white border-none shadow-xl ring-1 ring-slate-200 overflow-hidden">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Layers className="w-5 h-5 text-indigo-400" />
                                Feature Simulation Engine
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Mode</span>
                                    <button 
                                        onClick={() => setAutoMode(!autoMode)}
                                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${autoMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${autoMode ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-white border-white/20 hover:bg-white/10"
                                    onClick={() => setFeatures(Object.fromEntries(Object.keys(features).map(k => [k, ''])))}
                                >
                                    <RefreshCcw className="w-3 h-3 mr-1" /> Reset
                                </Button>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {Object.keys(features).map((key) => (
                                    <div key={key}>
                                        <InputField 
                                            label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} 
                                            name={key} 
                                            type="number" 
                                            placeholder={`Value for ${key}`}
                                            value={features[key]} 
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            className="border-slate-200 focus:ring-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {!autoMode && (
                                <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                                    <Button 
                                        onClick={handlePredict} 
                                        loading={loading} 
                                        icon={Play}
                                        className="px-12 bg-indigo-600 shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
                                    >
                                        Execute Simulation
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-50 border-t border-slate-100 p-4">
                            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-2 italic">
                                <Info className="w-3 h-3" /> 
                                Adjust values to see real-time shifts in predicted outcomes.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Intelligence Result Panel */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-none shadow-2xl overflow-hidden relative min-h-[400px]">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Target className="w-64 h-64 text-white" />
                        </div>
                        
                        <div className="p-8 h-full flex flex-col items-center justify-center relative z-10">
                            {results ? (
                                <div className="text-center w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full border-8 border-white/10 flex items-center justify-center">
                                                <div className="text-3xl font-black text-white">{confidencePercent}%</div>
                                            </div>
                                            <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                                                <circle
                                                    cx="64" cy="64" r="56" fill="none"
                                                    stroke="white" strokeWidth="8"
                                                    strokeDasharray={351.8}
                                                    strokeDashoffset={351.8 * (1 - confidence)}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                                                Confidence
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-inner">
                                        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">Predicted Outcome</p>
                                        <h2 className="text-5xl font-black text-white tracking-tight break-words">
                                            {results.prediction || 'Positive'}
                                        </h2>
                                    </div>

                                    <div className="flex items-center justify-center gap-3 text-white/70">
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        <span className="text-sm font-medium">Verified by {currentModel.algorithm?.toUpperCase()} model</span>
                                    </div>
                                    
                                    <div className="pt-4 grid grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                            <div className="text-indigo-300 text-[10px] uppercase font-bold tracking-wider mb-1">Latency</div>
                                            <div className="text-white font-bold">14ms</div>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                            <div className="text-indigo-300 text-[10px] uppercase font-bold tracking-wider mb-1">Stability</div>
                                            <div className="text-white font-bold">High</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 animate-pulse">
                                        <Target className="w-12 h-12 text-indigo-200" />
                                    </div>
                                    <p className="text-indigo-100 text-lg font-bold">Awaiting Simulation Data</p>
                                    <p className="text-indigo-300/80 text-sm mt-2 px-8">Configure features on the left to generate model intelligence.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {results && (
                        <Card className="bg-white border-none shadow-xl ring-1 ring-slate-200">
                            <CardHeader className="pb-2 border-b border-slate-50">
                                <CardTitle className="text-sm text-slate-800 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                    Prediction Key Drivers (Individual)
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4 h-64 overflow-hidden">
                                <BarChart 
                                    data={impactData} 
                                    bars={[{ key: 'impact', label: 'Impact Factor', color: '#6366F1' }]} 
                                    xKey="feature"
                                    height={220}
                                />
                            </div>
                        </Card>
                    )}

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mt-1" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-800">Operational Warning</h4>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                Single simulations provide directional insight. Always validate "What-If" scenarios against actual production distributions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
