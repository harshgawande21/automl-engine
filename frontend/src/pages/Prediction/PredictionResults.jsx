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

// Mock model performance data based on real dataset
const generateMockResults = (algorithm, taskType, datasetInfo) => {
    const baseAccuracy = algorithm === 'random_forest' ? 0.92 : 
                        algorithm === 'xgboost' ? 0.94 : 
                        algorithm === 'logistic_regression' ? 0.87 : 0.89;
    
    // Adjust accuracy based on actual data quality
    let accuracyAdjustment = 0;
    if (datasetInfo) {
        const missingPercentage = datasetInfo.missingValues / (datasetInfo.rows * datasetInfo.columns);
        if (missingPercentage > 0.1) accuracyAdjustment -= 0.05;
        if (missingPercentage > 0.2) accuracyAdjustment -= 0.03;
        
        // Adjust based on number of samples
        if (datasetInfo.rows < 100) accuracyAdjustment -= 0.08;
        else if (datasetInfo.rows > 10000) accuracyAdjustment += 0.02;
        
        // Adjust based on feature count
        if (datasetInfo.columns > 20) accuracyAdjustment -= 0.02;
    }
    
    const finalAccuracy = Math.max(0.65, Math.min(0.99, baseAccuracy + accuracyAdjustment + (Math.random() * 0.04 - 0.02)));

    if (taskType === 'clustering') {
        return {
            accuracy: null,
            silhouetteScore: 0.55 + Math.random() * 0.25,
            inertia: (datasetInfo?.rows || 1000) * (10 + Math.random() * 20),
            clusters: Math.min(8, Math.max(2, Math.floor((datasetInfo?.rows || 1000) / 200))),
            clusterSizes: [120, 95, 85, 60, 40].slice(0, Math.min(5, Math.max(2, Math.floor((datasetInfo?.rows || 1000) / 200))))
        };
    }

    // Generate feature importance based on actual features
    let featureImportance = [];
    if (datasetInfo && datasetInfo.features) {
        featureImportance = datasetInfo.features.map((feature, index) => ({
            feature: feature,
            importance: Math.max(0.01, (0.4 - index * 0.05) + Math.random() * 0.1)
        })).sort((a, b) => b.importance - a.importance).slice(0, 10);
    } else {
        // Fallback to generic features
        featureImportance = generateFeatureImportance();
    }

    return {
        accuracy: finalAccuracy,
        precision: Math.max(0.6, finalAccuracy - 0.02 + Math.random() * 0.04),
        recall: Math.max(0.6, finalAccuracy - 0.03 + Math.random() * 0.06),
        f1Score: Math.max(0.6, finalAccuracy - 0.01 + Math.random() * 0.02),
        trainingTime: 1.5 + (datasetInfo?.rows || 1000) / 1000 + Math.random() * 2,
        confusionMatrix: generateConfusionMatrix(),
        featureImportance: featureImportance
    };
};

const generateConfusionMatrix = () => {
    const matrix = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(i === j ? 80 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 10));
        }
        matrix.push(row);
    }
    return matrix;
};

const generateFeatureImportance = () => {
    return [
        { feature: 'age', importance: 0.35 + Math.random() * 0.1 },
        { feature: 'income', importance: 0.25 + Math.random() * 0.1 },
        { feature: 'education', importance: 0.15 + Math.random() * 0.1 },
        { feature: 'experience', importance: 0.10 + Math.random() * 0.1 },
        { feature: 'gender', importance: 0.05 + Math.random() * 0.05 }
    ].sort((a, b) => b.importance - a.importance);
};

export default function PredictionResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    const modelTrained = location.state?.modelTrained;
    const algorithm = location.state?.algorithm;
    const taskType = location.state?.taskType;
    const datasetInfo = location.state?.datasetInfo;

    useEffect(() => {
        if (modelTrained && algorithm && taskType) {
            // Simulate loading results
            setTimeout(() => {
                const mockResults = generateMockResults(algorithm, taskType, datasetInfo);
                setResults(mockResults);
                setLoading(false);
            }, 2000);
        } else {
            setLoading(false);
        }
    }, [modelTrained, algorithm, taskType, datasetInfo]);

    const getAlgorithmDisplayName = (alg) => {
        const names = {
            'random_forest': 'Random Forest',
            'xgboost': 'XGBoost',
            'logistic_regression': 'Logistic Regression',
            'svm': 'SVM',
            'knn': 'KNN',
            'kmeans': 'K-Means',
            'dbscan': 'DBSCAN',
            'hierarchical': 'Hierarchical Clustering'
        };
        return names[alg] || alg;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <div className="bg-white border-b border-blue-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Model Results</h1>
                    <p className="text-slate-600">Analyzing trained model performance...</p>
                </div>
                <div className="p-6">
                    <Card>
                        <div className="p-12 text-center">
                            <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
                            <p className="text-slate-600">Generating model insights...</p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!modelTrained || !results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <div className="bg-white border-b border-blue-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Model Results</h1>
                    <p className="text-slate-600">View your trained model performance</p>
                </div>
                <div className="p-6">
                    <Card>
                        <div className="p-12 text-center">
                            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Model Results</h3>
                            <p className="text-slate-600 mb-6">Train a model to see performance results here</p>
                            <Button onClick={() => navigate('/model/training')} icon={Play}>
                                Train Model
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-slate-800">Model Training Results</h1>
                <p className="text-slate-600">Performance analysis and insights for your trained model</p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Success Banner */}
                <Card className="mb-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Model Training Completed Successfully!</h2>
                                <p className="text-slate-600">
                                    {getAlgorithmDisplayName(algorithm)} model trained on {datasetInfo?.rows || '1000'} samples
                                </p>
                            </div>
                            <Badge variant="primary" className="ml-auto">
                                {taskType === 'clustering' ? 'Unsupervised' : 'Supervised'} Learning
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Overall Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                Performance Metrics
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6">
                            {taskType === 'clustering' ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-purple-800">Silhouette Score</span>
                                            <span className="text-xl font-bold text-purple-600">
                                                {results.silhouetteScore.toFixed(3)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-blue-800">Inertia</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {results.inertia.toFixed(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-800">Number of Clusters</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {results.clusters}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-800">Accuracy</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {(results.accuracy * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-blue-800">Precision</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {(results.precision * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-purple-800">Recall</span>
                                            <span className="text-xl font-bold text-purple-600">
                                                {(results.recall * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-orange-800">F1 Score</span>
                                            <span className="text-xl font-bold text-orange-600">
                                                {(results.f1Score * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
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
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-800">Algorithm</span>
                                        <span className="font-semibold text-slate-600">
                                            {getAlgorithmDisplayName(algorithm)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-800">Task Type</span>
                                        <span className="font-semibold text-slate-600 capitalize">
                                            {taskType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-800">Training Time</span>
                                        <span className="font-semibold text-slate-600">
                                            {results.trainingTime?.toFixed(2) || 'N/A'}s
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-800">Dataset Size</span>
                                        <span className="font-semibold text-slate-600">
                                            {datasetInfo?.rows || '1000'} rows
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Feature Importance (for supervised learning) */}
                {taskType !== 'clustering' && results.featureImportance && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Feature Importance
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6">
                            <div className="space-y-3">
                                {results.featureImportance.map((feature, index) => (
                                    <div key={feature.feature} className="flex items-center gap-4">
                                        <div className="w-24 text-sm font-medium text-slate-700">
                                            {feature.feature}
                                        </div>
                                        <div className="flex-1">
                                            <div className="w-full bg-gray-200 rounded-full h-6">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${feature.importance * 100}%` }}
                                                >
                                                    <span className="text-xs text-white font-medium">
                                                        {(feature.importance * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button 
                                onClick={() => navigate('/prediction/single')}
                                icon={Target}
                                className="w-full"
                            >
                                Make Predictions
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/analytics', { state: { datasetInfo, results, algorithm, taskType } })}
                                icon={Activity}
                                className="w-full"
                            >
                                View Analytics
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/model/training')}
                                icon={Brain}
                                className="w-full"
                            >
                                Train Another Model
                            </Button>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <strong>Model Insights:</strong> Your model is ready for predictions! 
                                    {taskType === 'clustering' 
                                        ? ` The algorithm identified ${results.clusters} distinct clusters in your data.`
                                        : ` With ${(results.accuracy * 100).toFixed(1)}% accuracy, this model performs well on your dataset.`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
