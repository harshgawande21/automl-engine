import {
    AlertCircle,
    BarChart3,
    Brain,
    CheckCircle,
    Info,
    Play,
    Settings,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import { trainModel } from '../../store/modelSlice';

const algorithms = {
    classification: [
        { value: 'random_forest', label: 'Random Forest', description: 'Ensemble method with high accuracy' },
        { value: 'xgboost', label: 'XGBoost', description: 'Gradient boosting with excellent performance' },
        { value: 'logistic_regression', label: 'Logistic Regression', description: 'Simple and interpretable' },
        { value: 'svm', label: 'SVM', description: 'Effective in high-dimensional spaces' },
        { value: 'knn', label: 'KNN', description: 'Instance-based learning' },
    ],
    regression: [
        { value: 'linear_regression', label: 'Linear Regression', description: 'Classic regression approach' },
        { value: 'ridge', label: 'Ridge', description: 'Regularized linear regression' },
        { value: 'lasso', label: 'Lasso', description: 'L1 regularized regression' },
        { value: 'decision_tree', label: 'Decision Tree', description: 'Non-parametric method' },
        { value: 'xgboost_reg', label: 'XGBoost Regressor', description: 'Gradient boosting for regression' },
    ],
    clustering: [
        { value: 'kmeans', label: 'K-Means', description: 'Centroid-based clustering' },
        { value: 'dbscan', label: 'DBSCAN', description: 'Density-based clustering' },
        { value: 'hierarchical', label: 'Hierarchical', description: 'Tree-based clustering' },
    ],
};

export default function ModelTraining() {
    const dispatch = useDispatch();
    const { loading, trainingStatus } = useSelector((state) => state.model);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check if we have auto-train data from DataUpload
    const datasetAnalysis = location.state?.datasetAnalysis;
    const autoTrain = location.state?.autoTrain;
    
    const [config, setConfig] = useState({
        taskType: datasetAnalysis?.recommendedApproach === 'supervised' ? 'classification' : 'clustering',
        algorithm: datasetAnalysis?.recommendedAlgorithm?.toLowerCase().replace(' ', '_') || 'random_forest',
        targetColumn: datasetAnalysis?.targetColumn || '',
        testSize: '0.2',
        autoTrain: false,
    });
    
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingStarted, setTrainingStarted] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);

    // Auto-populate form if coming from DataUpload
    useEffect(() => {
        if (autoTrain && datasetAnalysis) {
            setConfig(prev => ({
                ...prev,
                taskType: datasetAnalysis.recommendedApproach === 'supervised' ? 'classification' : 'clustering',
                algorithm: datasetAnalysis.recommendedAlgorithm.toLowerCase().replace(' ', '_'),
                targetColumn: datasetAnalysis.targetColumn || '',
                autoTrain: true
            }));
            
            // Auto-start training after a short delay
            setTimeout(() => {
                handleAutoTrain();
            }, 1000);
        }
    }, [autoTrain, datasetAnalysis]);

    const handleTrain = () => {
        setTrainingStarted(true);
        setTrainingComplete(false);
        setTrainingProgress(0);
        
        // Include dataset info in the training config
        const trainingConfig = {
            ...config,
            datasetInfo: datasetAnalysis
        };
        
        // Simulate training progress
        const progressInterval = setInterval(() => {
            setTrainingProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 200);

        dispatch(trainModel(trainingConfig)).then(() => {
            clearInterval(progressInterval);
            setTrainingProgress(100);
            setTrainingComplete(true);
            
            // Navigate to results after training
            setTimeout(() => {
                navigate('/prediction/results', {
                    state: {
                        modelTrained: true,
                        algorithm: config.algorithm,
                        taskType: config.taskType,
                        datasetInfo: datasetAnalysis
                    }
                });
            }, 2000);
        });
    };

    const handleAutoTrain = () => {
        handleTrain();
    };

    const getAlgorithmInfo = () => {
        const taskAlgorithms = algorithms[config.taskType] || [];
        return taskAlgorithms.find(alg => alg.value === config.algorithm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-slate-800">Model Training</h1>
                <p className="text-slate-600">
                    {autoTrain ? 'Auto-training recommended model' : 'Configure and train your ML model'}
                </p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {autoTrain && datasetAnalysis && (
                    <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-semibold text-slate-800">Auto-Training Mode</h2>
                                <Badge variant="primary">AI Recommended</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="p-3 bg-white/50 rounded-lg">
                                    <div className="text-sm text-slate-600">Dataset</div>
                                    <div className="font-semibold text-slate-800">{datasetAnalysis.rows} rows × {datasetAnalysis.columns} columns</div>
                                </div>
                                <div className="p-3 bg-white/50 rounded-lg">
                                    <div className="text-sm text-slate-600">Approach</div>
                                    <div className="font-semibold text-slate-800 capitalize">{datasetAnalysis.recommendedApproach} Learning</div>
                                </div>
                                <div className="p-3 bg-white/50 rounded-lg">
                                    <div className="text-sm text-slate-600">Algorithm</div>
                                    <div className="font-semibold text-slate-800">{datasetAnalysis.recommendedAlgorithm}</div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <p className="text-sm text-blue-800">{datasetAnalysis.explanation}</p>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuration */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Training Configuration</CardTitle>
                            </CardHeader>
                            <div className="p-6 space-y-6">
                                {/* Task Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Task Type
                                    </label>
                                    <SelectField
                                        value={config.taskType}
                                        onChange={(value) => setConfig(prev => ({ ...prev, taskType: value, algorithm: algorithms[value][0]?.value || '' }))}
                                        options={[
                                            { value: 'classification', label: 'Classification' },
                                            { value: 'regression', label: 'Regression' },
                                            { value: 'clustering', label: 'Clustering' },
                                        ]}
                                        disabled={autoTrain}
                                    />
                                </div>

                                {/* Algorithm */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Algorithm
                                    </label>
                                    <SelectField
                                        value={config.algorithm}
                                        onChange={(value) => setConfig(prev => ({ ...prev, algorithm: value }))}
                                        options={algorithms[config.taskType] || []}
                                        disabled={autoTrain}
                                    />
                                    {getAlgorithmInfo() && (
                                        <p className="mt-2 text-sm text-slate-600">
                                            {getAlgorithmInfo().description}
                                        </p>
                                    )}
                                </div>

                                {/* Target Column (for supervised learning) */}
                                {(config.taskType === 'classification' || config.taskType === 'regression') && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Target Column
                                        </label>
                                        <InputField
                                            value={config.targetColumn}
                                            onChange={(value) => setConfig(prev => ({ ...prev, targetColumn: value }))}
                                            placeholder="Enter target column name"
                                            disabled={autoTrain}
                                        />
                                    </div>
                                )}

                                {/* Test Size */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Test Size ({parseInt(config.testSize) * 100}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="40"
                                        value={parseInt(config.testSize) * 100}
                                        onChange={(e) => setConfig(prev => ({ ...prev, testSize: (e.target.value / 100).toString() }))}
                                        className="w-full"
                                        disabled={autoTrain}
                                    />
                                </div>

                                {/* Train Button */}
                                <div className="flex gap-4">
                                    <Button 
                                        onClick={handleTrain}
                                        disabled={loading || trainingStarted}
                                        loading={loading}
                                        icon={Play}
                                        className={autoTrain ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                                    >
                                        {autoTrain ? 'Start Auto-Training' : 'Train Model'}
                                    </Button>
                                    {!autoTrain && (
                                        <Button 
                                            variant="outline"
                                            onClick={() => navigate('/data/upload')}
                                        >
                                            Upload Dataset
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Training Progress */}
                        {trainingStarted && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-blue-600" />
                                        Training Progress
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600">Overall Progress</span>
                                                <span className="text-slate-800 font-semibold">{trainingProgress}%</span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-3">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${trainingProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {trainingProgress < 30 && (
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm">Preparing data...</span>
                                            </div>
                                        )}
                                        {trainingProgress >= 30 && trainingProgress < 70 && (
                                            <div className="flex items-center gap-2 text-purple-600">
                                                <Brain className="w-4 h-4 animate-pulse" />
                                                <span className="text-sm">Training model...</span>
                                            </div>
                                        )}
                                        {trainingProgress >= 70 && trainingProgress < 100 && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-sm">Evaluating performance...</span>
                                            </div>
                                        )}
                                        {trainingComplete && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Training completed successfully!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Model Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Model Information</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">Task Type</span>
                                        </div>
                                        <div className="text-lg font-semibold text-blue-600 capitalize">
                                            {config.taskType}
                                        </div>
                                    </div>

                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart3 className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-800">Algorithm</span>
                                        </div>
                                        <div className="text-lg font-semibold text-purple-600">
                                            {getAlgorithmInfo()?.label || 'Not selected'}
                                        </div>
                                    </div>

                                    {(config.taskType === 'classification' || config.taskType === 'regression') && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Settings className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">Test Split</span>
                                            </div>
                                            <div className="text-lg font-semibold text-green-600">
                                                {parseInt(config.testSize) * 100}% Test
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Tips */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Training Tips</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <div className="text-sm text-slate-600">
                                            <strong>Random Forest</strong> works well with mixed data types and handles missing values.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-purple-600 mt-0.5" />
                                        <div className="text-sm text-slate-600">
                                            <strong>XGBoost</strong> provides excellent performance but may require more tuning.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div className="text-sm text-slate-600">
                                            <strong>20% test split</strong> is good for reliable performance evaluation.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
