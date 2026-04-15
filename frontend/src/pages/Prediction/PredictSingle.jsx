import { Brain, Play, RefreshCcw, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import PageContainer from '../../components/layout/PageContainer';
import PredictionResultChart from '../../components/charts/PredictionResultChart';
import { predictSingle } from '../../store/predictionSlice';
import { fetchModels, setCurrentModel } from '../../store/modelSlice';
import api from '../../config/axiosConfig';

export default function PredictSingle() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { results, loading, error } = useSelector((state) => state.prediction);
    const { currentModel, models } = useSelector((state) => state.model);
    const { activeDataset } = useSelector((state) => state.data);

    const [features, setFeatures] = useState({});
    const [selectedModelId, setSelectedModelId] = useState('');
    const [fetchingModels, setFetchingModels] = useState(true);
    const [sampleRows, setSampleRows] = useState([]);
    const [selectedSample, setSelectedSample] = useState(0);

    // Load models on mount
    useEffect(() => {
        dispatch(fetchModels()).finally(() => setFetchingModels(false));
    }, []);

    // Auto-select most recent model
    useEffect(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0].id);
            dispatch(setCurrentModel(models[0]));
        }
    }, [models]);

    // When model changes, load its feature columns and auto-fill from dataset
    useEffect(() => {
        if (!selectedModelId) return;
        api.get(`/models/${selectedModelId}`).then(res => {
            const m = res.data?.data || res.data;
            dispatch(setCurrentModel(m));
            const cols = m.hyperparameters?.feature_columns
                || (m.metrics?.feature_importances ? Object.keys(m.metrics.feature_importances) : null);

            // Try to auto-fill from the active dataset's preview rows
            const preview = activeDataset?.preview || [];
            if (preview.length > 0) {
                setSampleRows(preview);
                // Fill with first sample row, only keeping feature columns
                const firstRow = preview[0];
                const init = {};
                (cols || Object.keys(firstRow)).forEach(f => {
                    if (f in firstRow) init[f] = String(firstRow[f] ?? '');
                    else init[f] = '';
                });
                setFeatures(init);
            } else if (cols) {
                const init = {};
                cols.forEach(f => { init[f] = ''; });
                setFeatures(init);
            }
        }).catch(() => {});
    }, [selectedModelId, activeDataset]);

    const handlePredict = () => {
        if (!selectedModelId) return;
        dispatch(predictSingle({ features, model_id: selectedModelId }));
    };

    const handleReset = () => {
        const init = {};
        Object.keys(features).forEach(k => { init[k] = ''; });
        setFeatures(init);
    };

    if (fetchingModels) {
        return (
            <PageContainer title="Single Prediction" subtitle="Make a prediction using your trained model">
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
                    <p className="text-slate-500">Loading models...</p>
                </div>
            </PageContainer>
        );
    }

    if (models.length === 0) {
        return (
            <PageContainer title="Single Prediction" subtitle="Make a prediction using your trained model">
                <Card className="max-w-lg mx-auto mt-10 text-center p-12">
                    <Brain className="w-14 h-14 text-blue-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-3">No Trained Models Yet</h2>
                    <p className="text-slate-500 mb-6">Train a model first, then come back here to make predictions.</p>
                    <Button onClick={() => navigate('/model/training')} icon={Zap}>Train a Model</Button>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Single Prediction" subtitle="Enter values and get an instant prediction">
            {/* Model Selector */}
            <div className="mb-6 bg-white rounded-xl border border-blue-200 p-4 flex items-center gap-4">
                <Brain className="text-blue-500 flex-shrink-0" size={20} />
                <div className="flex-1">
                    <label className="text-sm font-medium text-slate-700 block mb-1">Active Model</label>
                    <select
                        value={selectedModelId}
                        onChange={e => setSelectedModelId(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                        {models.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.model_type?.replace(/_/g, ' ')} — {m.task_type}
                                {m.metrics?.accuracy ? ` (${(m.metrics.accuracy * 100).toFixed(1)}% acc)` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex-shrink-0">Active</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card>
                    <div className="bg-slate-800 px-5 py-3 flex items-center justify-between rounded-t-xl">
                        <h3 className="text-white font-semibold text-sm">Enter Values</h3>
                        <button onClick={handleReset} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
                            <RefreshCcw size={12} /> Reset
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Sample row selector */}
                        {sampleRows.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-semibold text-blue-700 mb-2">
                                    📋 Auto-filled from your dataset — try different rows:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {sampleRows.slice(0, 5).map((row, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSelectedSample(i);
                                                const newFeatures = {};
                                                Object.keys(features).forEach(f => {
                                                    newFeatures[f] = String(row[f] ?? '');
                                                });
                                                setFeatures(newFeatures);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSample === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-100'}`}
                                        >
                                            Row {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p className="text-sm text-slate-500 mb-4">
                            Values are pre-filled from your dataset. Edit any value to test different scenarios.
                        </p>                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.keys(features).map(key => (
                                <InputField
                                    key={key}
                                    label={key.replace(/_/g, ' ')}
                                    name={key}
                                    type="text"
                                    placeholder={`Enter ${key}`}
                                    value={features[key]}
                                    onChange={e => setFeatures({ ...features, [key]: e.target.value })}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ❌ {error}
                            </div>
                        )}

                        <div className="mt-6">
                            <Button
                                onClick={handlePredict}
                                loading={loading}
                                icon={Play}
                                className="w-full"
                                disabled={Object.values(features).every(v => v === '')}
                            >
                                {loading ? 'Predicting...' : 'Make Prediction'}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Result */}
                <div>
                    {results ? (
                        <PredictionResultChart
                            result={results}
                            features={features}
                            modelType={currentModel?.model_type}
                            taskType={currentModel?.task_type}
                            currentModel={currentModel}
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-blue-100 p-10 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Brain className="w-8 h-8 text-blue-300" />
                            </div>
                            <p className="text-slate-500 font-medium">Your result will appear here</p>
                            <p className="text-slate-400 text-sm mt-1">Fill in the values and click "Make Prediction"</p>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
