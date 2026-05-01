import { Brain, CheckCircle, Play, Upload, Zap, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { trainModel } from '../../store/modelSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModelResultsChart from '../../components/charts/ModelResultsChart';

const STEPS = [
    { id: 1, label: 'Reading your data', duration: 800 },
    { id: 2, label: 'Cleaning & preparing', duration: 1200 },
    { id: 3, label: 'Finding patterns', duration: 2000 },
    { id: 4, label: 'Training the model', duration: 3000 },
    { id: 5, label: 'Evaluating results', duration: 1000 },
];

export default function ModelTraining() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, currentModel } = useSelector(s => s.model);
    const { activeDataset } = useSelector(s => s.data);

    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [trainError, setTrainError] = useState(null);
    const [result, setResult] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState([]);

    const filename = activeDataset?.filename;
    const columns = activeDataset?.columns_list || Object.keys(activeDataset?.preview?.[0] || {});

    const runSteps = async () => {
        for (let i = 0; i < STEPS.length; i++) {
            setStep(i + 1);
            await new Promise(r => setTimeout(r, STEPS[i].duration));
        }
    };

    const handleTrain = async () => {
        if (!filename) {
            setTrainError('No dataset found. Please upload a dataset first.');
            return;
        }
        setTrainError(null);
        setDone(false);
        setResult(null);

        // Run visual steps in parallel with real training
        runSteps();

        const action = await dispatch(trainModel({ filename, features: selectedFeatures }));

        if (action.type === 'model/train/fulfilled') {
            setStep(STEPS.length);
            setDone(true);
            setResult(action.payload);
        } else {
            setStep(0);
            setTrainError(action.payload || 'Training failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="bg-white border-b border-blue-200 px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800">Train Your AI Model</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Just click the button — we handle everything automatically
                </p>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                {/* Dataset Status */}
                <div className={`rounded-xl border p-4 mb-6 flex items-center gap-3 ${filename ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    {filename ? (
                        <>
                            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                            <div>
                                <p className="font-semibold text-green-800 text-sm">Dataset ready: <span className="font-bold">{filename}</span></p>
                                <p className="text-green-600 text-xs mt-0.5">
                                    {activeDataset?.rows?.toLocaleString() || '?'} rows × {activeDataset?.columns || '?'} columns
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
                            <div className="flex-1">
                                <p className="font-semibold text-yellow-800 text-sm">No dataset uploaded yet</p>
                                <p className="text-yellow-600 text-xs mt-0.5">Upload a CSV file first to train a model</p>
                            </div>
                            <Button onClick={() => navigate('/data/upload')} icon={Upload} variant="outline" size="sm">
                                Upload Data
                            </Button>
                        </>
                    )}
                </div>

                {/* What happens card */}
                {!loading && !done && (
                    <Card className="mb-6">
                        <div className="p-6">
                            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Zap className="text-blue-500" size={18} />
                                What will happen automatically?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    ['🔍', 'Analyze your data', 'Understand what type of data you have'],
                                    ['🧹', 'Clean the data', 'Fix missing values and errors automatically'],
                                    ['🎯', 'Find the target', 'Detect what you want to predict'],
                                    ['🤖', 'Train the model', 'Learn patterns from your data'],
                                    ['📊', 'Show results', 'Visual charts you can understand'],
                                    ['💡', 'Explain findings', 'Plain English summary of what was learned'],
                                ].map(([emoji, title, desc]) => (
                                    <div key={title} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-xl">{emoji}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{title}</p>
                                            <p className="text-xs text-slate-500">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Training Progress */}
                {loading && (
                    <Card className="mb-6">
                        <div className="p-8">
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-blue-100 flex items-center justify-center">
                                        <Brain className="text-blue-400 animate-pulse" size={32} />
                                    </div>
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {STEPS.map((s, i) => (
                                    <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step > i ? 'bg-green-50' : step === i + 1 ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step > i ? 'bg-green-500' : step === i + 1 ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`}>
                                            {step > i ? (
                                                <CheckCircle size={14} className="text-white" />
                                            ) : (
                                                <span className="text-xs text-white font-bold">{i + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${step > i ? 'text-green-700' : step === i + 1 ? 'text-blue-700' : 'text-slate-400'}`}>
                                            {s.label}
                                            {step === i + 1 && '...'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Error */}
                {trainError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-semibold text-red-800 text-sm">Training failed</p>
                            <p className="text-red-600 text-xs mt-1">{trainError}</p>
                        </div>
                    </div>
                )}

                {/* Feature Selection */}
                {!loading && !done && columns.length > 0 && (
                    <Card className="mb-6">
                        <div className="p-6">
                            <h2 className="font-bold text-slate-800 mb-2">
                                What information should the model use?
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">
                                By default, the AI will look at all available data. You can optionally select specific columns if you only want the model to learn from those.
                            </p>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                                {columns.map((col) => {
                                    const isSelected = selectedFeatures.includes(col);
                                    return (
                                        <button
                                            key={col}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedFeatures(selectedFeatures.filter(f => f !== col));
                                                } else {
                                                    setSelectedFeatures([...selectedFeatures, col]);
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                                isSelected
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                            }`}
                                        >
                                            {isSelected && <span className="mr-1">✓</span>}
                                            {col}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Train Button */}
                {!loading && !done && (
                    <Button
                        onClick={handleTrain}
                        disabled={!filename}
                        icon={Play}
                        className="w-full py-4 text-lg"
                        size="lg"
                    >
                        🚀 Train My AI Model
                    </Button>
                )}

                {/* Results */}
                {done && result && (
                    <>
                        {/* Auto-detection explanation */}
                        {result.explanation && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-800">
                                    <strong>🤖 What I did:</strong> {result.explanation}
                                </p>
                            </div>
                        )}

                        <ModelResultsChart
                            results={result}
                            modelType={result.model_type}
                            taskType={result.task_type}
                        />

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => navigate('/prediction/single')}
                                className="w-full"
                                icon={Zap}
                            >
                                Make a Prediction
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDone(false);
                                    setResult(null);
                                    setStep(0);
                                }}
                                className="w-full"
                            >
                                Train Again
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
