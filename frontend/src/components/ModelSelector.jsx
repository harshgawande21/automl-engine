import axios from 'axios';
import { AlertCircle, Play } from 'lucide-react';
import environment from '../config/environment';
import { useState } from 'react';
import Button from './common/Button';

const ALL_MODELS = [
    {
        group: 'Classification', models: [
            { value: 'logistic_regression', label: 'Logistic Regression' },
            { value: 'svm', label: 'SVM' },
            { value: 'random_forest', label: 'Random Forest' },
            { value: 'xgboost', label: 'XGBoost' },
            { value: 'naive_bayes', label: 'Naive Bayes' },
        ]
    },
    {
        group: 'Regression', models: [
            { value: 'linear_regression', label: 'Linear Regression' },
            { value: 'ridge_regression', label: 'Ridge Regression' },
            { value: 'lasso_regression', label: 'Lasso Regression' },
            { value: 'xgboost_regression', label: 'XGBoost Regression' },
        ]
    },
    {
        group: 'Clustering', models: [
            { value: 'kmeans', label: 'K-Means' },
            { value: 'dbscan', label: 'DBSCAN' },
            { value: 'hierarchical', label: 'Hierarchical' },
        ]
    },
];

const CLUSTERING_MODELS = ['kmeans', 'dbscan', 'hierarchical'];

const ModelSelector = ({ filename, columns, onTrainStart, onTrainComplete }) => {
    const [targetColumn, setTargetColumn] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [modelType, setModelType] = useState('logistic_regression');
    const [nClusters, setNClusters] = useState(3);
    const [error, setError] = useState(null);
    const [isTraining, setIsTraining] = useState(false);

    const isClustering = CLUSTERING_MODELS.includes(modelType);

    const handleTrain = async () => {
        if (!isClustering && !targetColumn) {
            setError("Please select a target column for supervised models.");
            return;
        }
        setError(null);
        setIsTraining(true);
        onTrainStart();

        try {
            const response = await axios.post(`${environment.API_BASE_URL}/train/`, {
                filename,
                target_column: targetColumn,
                model_type: modelType,
                n_clusters: nClusters,
                features: selectedFeatures.length > 0 ? selectedFeatures : undefined
            });

            // Save to history
            const result = response.data;
            try {
                await axios.post(`${environment.API_BASE_URL}/history/`, {
                    filename,
                    model_type: modelType,
                    model_category: result.model_category || 'unknown',
                    target_column: targetColumn,
                    accuracy: result.results?.accuracy || null,
                    mse: result.results?.mean_squared_error || null,
                    r2: result.results?.r2_score || null,
                    silhouette: result.results?.silhouette_score || null,
                });
            } catch { }

            onTrainComplete(result);
        } catch (err) {
            setError(err.response?.data?.detail || "Training failed.");
            onTrainComplete(null);
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        What do you want to predict? {columns?.length > 0 ? `(e.g., ${columns.slice(-2).join(', ')})` : ''} {isClustering && '(optional for clustering)'}
                    </label>
                    <select 
                        value={targetColumn} 
                        onChange={(e) => setTargetColumn(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    >
                        <option value="">— Select what to predict —</option>
                        {columns.map((col) => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        ML Algorithm
                    </label>
                    <select 
                        value={modelType} 
                        onChange={(e) => setModelType(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    >
                        {ALL_MODELS.map(group => (
                            <optgroup key={group.group} label={group.group}>
                                {group.models.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            {/* Feature Selection UI */}
            <div className="border border-blue-200 rounded-lg bg-white p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    What information should the model use to make this prediction?
                    <span className="text-slate-400 font-normal ml-2">(Optional: Select specific features. Leave empty to use all.)</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {columns.filter(c => c !== targetColumn).map((col) => {
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
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                {isSelected && <span className="mr-1">✓</span>}
                                {col}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isClustering && (
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Number of Clusters
                    </label>
                    <input
                        type="number"
                        min="2"
                        max="20"
                        value={nClusters}
                        onChange={(e) => setNClusters(parseInt(e.target.value) || 3)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                </div>
            )}

            <Button 
                onClick={handleTrain} 
                loading={isTraining}
                icon={Play}
                className="w-fit"
            >
                Train Model
            </Button>
        </div>
    );
};

export default ModelSelector;
