import {
    Activity,
    AlertCircle,
    BarChart3,
    Brain,
    CheckCircle,
    Database,
    Eye,
    File,
    Info,
    Lightbulb,
    Play,
    Target,
    TrendingUp,
    Upload,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import FileUpload from '../../components/forms/FileUpload';

export default function DataUpload() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, datasets } = useSelector((state) => state.data);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Real CSV parsing function
    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        reject(new Error('CSV file must have at least a header row and one data row'));
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const data = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                        if (values.length === headers.length) {
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index];
                            });
                            data.push(row);
                        }
                    }

                    resolve({ headers, data, rows: data.length, columns: headers.length });
                } catch (error) {
                    reject(new Error('Failed to parse CSV file: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    };

    // Real data analysis function with EDA
    const analyzeRealDataset = (headers, data) => {
        const analysis = {
            headers: headers,
            rows: data.length,
            columns: headers.length,
            dataTypes: { numeric: 0, categorical: 0, text: 0 },
            missingValues: 0,
            columnInfo: {},
            targetColumn: null,
            hasTargetColumn: false,
            recommendedApproach: 'supervised',
            recommendedAlgorithm: 'random_forest',
            confidence: 0.85,
            explanation: '',
            features: [],
            dataPreview: data.slice(0, 5),
            // EDA specific data
            eda: {
                summary: {},
                correlations: {},
                distributions: {},
                outliers: {},
                insights: []
            }
        };

        // Analyze each column for EDA
        headers.forEach(header => {
            const columnData = data.map(row => row[header]).filter(val => val !== '');
            const uniqueValues = [...new Set(columnData)];
            const numericValues = columnData.filter(val => !isNaN(val) && val !== '').map(val => parseFloat(val));
            
            // Determine data type
            let dataType = 'text';
            if (numericValues.length > columnData.length * 0.8) {
                dataType = 'numeric';
            } else if (uniqueValues.length < columnData.length * 0.1 && uniqueValues.length <= 10) {
                dataType = 'categorical';
            }
            
            analysis.dataTypes[dataType]++;
            
            // Count missing values
            const missingCount = data.length - columnData.length;
            analysis.missingValues += missingCount;
            
            // Store column info
            analysis.columnInfo[header] = {
                dataType,
                uniqueValues: uniqueValues.length,
                missingValues: missingCount,
                sampleValues: uniqueValues.slice(0, 5)
            };

            // EDA Analysis for numeric columns
            if (dataType === 'numeric' && numericValues.length > 0) {
                const sorted = numericValues.sort((a, b) => a - b);
                const q1Index = Math.floor(sorted.length * 0.25);
                const q3Index = Math.floor(sorted.length * 0.75);
                const q1 = sorted[q1Index];
                const q3 = sorted[q3Index];
                const iqr = q3 - q1;
                const lowerBound = q1 - 1.5 * iqr;
                const upperBound = q3 + 1.5 * iqr;
                
                const outliers = numericValues.filter(val => val < lowerBound || val > upperBound);
                
                analysis.eda.summary[header] = {
                    count: numericValues.length,
                    mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
                    median: sorted[Math.floor(sorted.length / 2)],
                    std: Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - (numericValues.reduce((a, b) => a + b, 0) / numericValues.length), 2), 0) / numericValues.length),
                    min: Math.min(...numericValues),
                    max: Math.max(...numericValues),
                    q1: q1,
                    q3: q3,
                    iqr: iqr
                };
                
                analysis.eda.outliers[header] = {
                    count: outliers.length,
                    percentage: (outliers.length / numericValues.length) * 100,
                    values: outliers.slice(0, 10)
                };

                // Generate distribution data
                const bins = 10;
                const min = Math.min(...numericValues);
                const max = Math.max(...numericValues);
                const binWidth = (max - min) / bins;
                const distribution = [];
                
                for (let i = 0; i < bins; i++) {
                    const binMin = min + i * binWidth;
                    const binMax = min + (i + 1) * binWidth;
                    const count = numericValues.filter(val => val >= binMin && val < binMax).length;
                    distribution.push({
                        range: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
                        count: count,
                        percentage: (count / numericValues.length) * 100
                    });
                }
                
                analysis.eda.distributions[header] = distribution;
            }

            // EDA Analysis for categorical columns
            if (dataType === 'categorical') {
                const valueCounts = {};
                columnData.forEach(val => {
                    valueCounts[val] = (valueCounts[val] || 0) + 1;
                });
                
                const sortedValues = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);
                
                analysis.eda.summary[header] = {
                    count: columnData.length,
                    uniqueCount: uniqueValues.length,
                    mostFrequent: sortedValues[0] ? sortedValues[0][0] : null,
                    mostFrequentCount: sortedValues[0] ? sortedValues[0][1] : 0,
                    leastFrequent: sortedValues[sortedValues.length - 1] ? sortedValues[sortedValues.length - 1][0] : null,
                    leastFrequentCount: sortedValues[sortedValues.length - 1] ? sortedValues[sortedValues.length - 1][1] : 0
                };
                
                analysis.eda.distributions[header] = sortedValues.map(([value, count]) => ({
                    value: value,
                    count: count,
                    percentage: (count / columnData.length) * 100
                })).slice(0, 10);
            }
            
            // Check if this could be a target column
            if (dataType === 'categorical' && uniqueValues.length >= 2 && uniqueValues.length <= 20) {
                if (!analysis.targetColumn || uniqueValues.length < analysis.columnInfo[analysis.targetColumn].uniqueValues) {
                    analysis.targetColumn = header;
                    analysis.hasTargetColumn = true;
                }
            }
        });

        // Correlation analysis for numeric columns
        const numericColumns = headers.filter(header => analysis.columnInfo[header].dataType === 'numeric');
        if (numericColumns.length > 1) {
            numericColumns.forEach(col1 => {
                analysis.eda.correlations[col1] = {};
                numericColumns.forEach(col2 => {
                    if (col1 !== col2) {
                        const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
                        const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
                        
                        if (values1.length === values2.length && values1.length > 0) {
                            const correlation = calculateCorrelation(values1, values2);
                            analysis.eda.correlations[col1][col2] = correlation;
                        }
                    }
                });
            });
        }

        // Generate EDA insights
        analysis.eda.insights = generateEDAInsights(analysis, data);

        // Determine features (all columns except target)
        analysis.features = headers.filter(h => h !== analysis.targetColumn);

        // Determine ML approach and algorithm
        if (analysis.hasTargetColumn) {
            analysis.recommendedApproach = 'supervised';
            const targetInfo = analysis.columnInfo[analysis.targetColumn];
            
            if (targetInfo.uniqueValues === 2) {
                analysis.recommendedAlgorithm = 'logistic_regression';
                analysis.explanation = `Your dataset has a binary target column "${analysis.targetColumn}" with ${targetInfo.uniqueValues} classes. Logistic Regression is recommended for its interpretability and good performance on binary classification tasks.`;
            } else if (targetInfo.uniqueValues <= 10) {
                analysis.recommendedAlgorithm = 'random_forest';
                analysis.explanation = `Your dataset has a multi-class target column "${analysis.targetColumn}" with ${targetInfo.uniqueValues} classes. Random Forest is recommended for its ability to handle multiple classes and mixed data types.`;
            } else {
                analysis.recommendedAlgorithm = 'xgboost';
                analysis.explanation = `Your dataset has a complex target column "${analysis.targetColumn}" with ${targetInfo.uniqueValues} classes. XGBoost is recommended for its excellent performance on complex multi-class problems.`;
            }
            
            // Adjust confidence based on data quality
            const missingPercentage = analysis.missingValues / (analysis.rows * analysis.columns);
            if (missingPercentage < 0.05) {
                analysis.confidence = 0.95;
            } else if (missingPercentage < 0.15) {
                analysis.confidence = 0.88;
            } else {
                analysis.confidence = 0.75;
            }
        } else {
            analysis.recommendedApproach = 'unsupervised';
            analysis.recommendedAlgorithm = 'kmeans';
            analysis.explanation = `Your dataset contains only input features without a clear target column. K-Means clustering is recommended to discover natural groupings in your data. The algorithm will identify ${Math.min(5, Math.max(2, Math.floor(analysis.rows / 100)))} clusters based on feature similarities.`;
            analysis.confidence = 0.82;
        }

        return analysis;
    };

    // Calculate Pearson correlation coefficient
    const calculateCorrelation = (x, y) => {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
        const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
        const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    };

    // Generate EDA insights
    const generateEDAInsights = (analysis, data) => {
        const insights = [];
        
        // Data quality insights
        const missingPercentage = (analysis.missingValues / (analysis.rows * analysis.columns)) * 100;
        if (missingPercentage > 20) {
            insights.push({
                type: 'warning',
                title: 'High Missing Data',
                description: `${missingPercentage.toFixed(1)}% of your data is missing. Consider data cleaning or imputation.`
            });
        } else if (missingPercentage < 5) {
            insights.push({
                type: 'success',
                title: 'Clean Dataset',
                description: `Your dataset has very low missing data (${missingPercentage.toFixed(1)}%). This is excellent for ML.`
            });
        }

        // Dataset size insights
        if (analysis.rows < 100) {
            insights.push({
                type: 'warning',
                title: 'Small Dataset',
                description: `Your dataset has only ${analysis.rows} rows. Consider collecting more data for better model performance.`
            });
        } else if (analysis.rows > 10000) {
            insights.push({
                type: 'info',
                title: 'Large Dataset',
                description: `Your dataset has ${analysis.rows} rows. This should provide good model training results.`
            });
        }

        // Feature insights
        const numericCount = analysis.dataTypes.numeric;
        const categoricalCount = analysis.dataTypes.categorical;
        
        if (numericCount > categoricalCount) {
            insights.push({
                type: 'info',
                title: 'Numeric-Dominated Dataset',
                description: `Your dataset has ${numericCount} numeric and ${categoricalCount} categorical features. Well-suited for regression tasks.`
            });
        } else if (categoricalCount > numericCount) {
            insights.push({
                type: 'info',
                title: 'Categorical-Rich Dataset',
                description: `Your dataset has ${categoricalCount} categorical and ${numericCount} numeric features. Consider encoding for ML.`
            });
        }

        // Outlier insights
        const outlierColumns = Object.keys(analysis.eda.outliers).filter(col => 
            analysis.eda.outliers[col].percentage > 5
        );
        
        if (outlierColumns.length > 0) {
            insights.push({
                type: 'warning',
                title: 'Potential Outliers',
                description: `Columns ${outlierColumns.join(', ')} have significant outliers (${outlierColumns.map(col => analysis.eda.outliers[col].percentage.toFixed(1) + '%').join(', ')}). Consider outlier treatment.`
            });
        }

        // Correlation insights
        const highCorrelations = [];
        Object.keys(analysis.eda.correlations).forEach(col1 => {
            Object.keys(analysis.eda.correlations[col1]).forEach(col2 => {
                const corr = Math.abs(analysis.eda.correlations[col1][col2]);
                if (corr > 0.8) {
                    highCorrelations.push(`${col1} and ${col2} (${corr.toFixed(2)})`);
                }
            });
        });

        if (highCorrelations.length > 0) {
            insights.push({
                type: 'warning',
                title: 'High Correlation Detected',
                description: `Strong correlations found: ${highCorrelations.join(', ')}. Consider feature selection to avoid multicollinearity.`
            });
        }

        // Target variable insights
        if (analysis.hasTargetColumn) {
            const targetInfo = analysis.eda.summary[analysis.targetColumn];
            if (targetInfo && targetInfo.mostFrequent) {
                const balanceRatio = (targetInfo.mostFrequentCount / analysis.rows) * 100;
                if (balanceRatio > 80) {
                    insights.push({
                        type: 'warning',
                        title: 'Imbalanced Classes',
                        description: `Target column "${analysis.targetColumn}" is imbalanced (${balanceRatio.toFixed(1)}% in majority class). Consider class balancing techniques.`
                    });
                } else if (balanceRatio < 60) {
                    insights.push({
                        type: 'success',
                        title: 'Balanced Classes',
                        description: `Target column "${analysis.targetColumn}" has good class balance (${balanceRatio.toFixed(1)}% in majority class).`
                    });
                }
            }
        }

        return insights;
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        
        try {
            setAnalyzing(true);
            
            // Parse the actual CSV file
            const { headers, data, rows, columns } = await parseCSV(selectedFile);
            
            // Analyze the real data
            const analysisResult = analyzeRealDataset(headers, data);
            setAnalysis(analysisResult);
            
            // Show success message
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
            
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Error processing file: ' + error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleTrainModel = () => {
        if (!analysis) return;
        
        // Navigate to model training with real analysis data
        navigate('/model/training', { 
            state: { 
                datasetAnalysis: analysis,
                autoTrain: true 
            } 
        });
    };

    const handleViewDataset = () => {
        if (!analysis) return;
        navigate('/data/detailed-eda', { 
            state: { 
                datasetAnalysis: analysis 
            } 
        });
    };

    const handleQuickPreview = () => {
        if (!analysis) return;
        navigate('/data/preview', { 
            state: { 
                datasetAnalysis: analysis 
            } 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-slate-800">Data Upload & Analysis</h1>
                <p className="text-slate-600">Upload datasets and get AI-powered ML recommendations based on YOUR data</p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Area */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Dataset</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                <FileUpload
                                    onFileSelect={setSelectedFile}
                                    acceptedTypes=".csv"
                                    maxSize={100 * 1024 * 1024} // 100MB
                                />
                                
                                {selectedFile && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <File className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-blue-800">{selectedFile.name}</span>
                                            </div>
                                            <Badge variant="primary">Selected</Badge>
                                        </div>
                                    </div>
                                )}

                                {uploadSuccess && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm">File analyzed successfully! Real data processed.</span>
                                        </div>
                                    </div>
                                )}

                                {analyzing && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-yellow-700">
                                            <Brain className="w-4 h-4 animate-pulse" />
                                            <span className="text-sm">Processing your real data and finding patterns...</span>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex gap-4">
                                    <Button 
                                        onClick={handleUpload}
                                        disabled={!selectedFile || loading || analyzing}
                                        loading={loading || analyzing}
                                        icon={Upload}
                                    >
                                        Process Real Data
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setAnalysis(null);
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Dataset Analysis Results */}
                        {analysis && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-blue-600" />
                                        Your Data Analysis Results
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-6">
                                    {/* Dataset Overview */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{analysis.rows}</div>
                                            <div className="text-xs text-slate-600">Rows</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{analysis.columns}</div>
                                            <div className="text-xs text-slate-600">Columns</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">{analysis.dataTypes.numeric}</div>
                                            <div className="text-xs text-slate-600">Numeric</div>
                                        </div>
                                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-600">{analysis.dataTypes.categorical}</div>
                                            <div className="text-xs text-slate-600">Categorical</div>
                                        </div>
                                    </div>

                                    {/* Column Details */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Column Analysis</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-blue-200">
                                                        <th className="text-left py-2 px-3 text-slate-700">Column Name</th>
                                                        <th className="text-left py-2 px-3 text-slate-700">Type</th>
                                                        <th className="text-left py-2 px-3 text-slate-700">Unique Values</th>
                                                        <th className="text-left py-2 px-3 text-slate-700">Missing</th>
                                                        <th className="text-left py-2 px-3 text-slate-700">Sample Values</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analysis.headers.map(header => {
                                                        const info = analysis.columnInfo[header];
                                                        return (
                                                            <tr key={header} className="border-b border-blue-100">
                                                                <td className="py-2 px-3 font-medium text-slate-800">
                                                                    {header}
                                                                    {header === analysis.targetColumn && (
                                                                        <Badge variant="primary" className="ml-2 text-xs">Target</Badge>
                                                                    )}
                                                                </td>
                                                                <td className="py-2 px-3">
                                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                                        info.dataType === 'numeric' ? 'bg-blue-100 text-blue-700' :
                                                                        info.dataType === 'categorical' ? 'bg-green-100 text-green-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {info.dataType}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 px-3 text-slate-600">{info.uniqueValues}</td>
                                                                <td className="py-2 px-3 text-slate-600">{info.missingValues}</td>
                                                                <td className="py-2 px-3 text-slate-600 text-xs">
                                                                    {info.sampleValues.slice(0, 3).join(', ')}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* EDA Insights */}
                                    {analysis.eda.insights && analysis.eda.insights.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                                <h3 className="text-lg font-semibold text-slate-800">EDA Insights</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {analysis.eda.insights.map((insight, index) => (
                                                    <div key={index} className={`p-3 border rounded-lg ${
                                                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                                        insight.type === 'success' ? 'bg-green-50 border-green-200' :
                                                        insight.type === 'info' ? 'bg-blue-50 border-blue-200' :
                                                        'bg-gray-50 border-gray-200'
                                                    }`}>
                                                        <div className="flex items-start gap-2">
                                                            {insight.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                                                            {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                                                            {insight.type === 'info' && <Info className="w-4 h-4 text-blue-600 mt-0.5" />}
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-800">{insight.title}</div>
                                                                <div className="text-xs text-slate-600 mt-1">{insight.description}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Statistical Summary */}
                                    {Object.keys(analysis.eda.summary).length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                                <h3 className="text-lg font-semibold text-slate-800">Statistical Summary</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-blue-200">
                                                            <th className="text-left py-2 px-3 text-slate-700">Column</th>
                                                            <th className="text-left py-2 px-3 text-slate-700">Type</th>
                                                            <th className="text-left py-2 px-3 text-slate-700">Count</th>
                                                            {analysis.dataTypes.numeric > 0 && <th className="text-left py-2 px-3 text-slate-700">Mean</th>}
                                                            {analysis.dataTypes.numeric > 0 && <th className="text-left py-2 px-3 text-slate-700">Std Dev</th>}
                                                            {analysis.dataTypes.numeric > 0 && <th className="text-left py-2 px-3 text-slate-700">Min</th>}
                                                            {analysis.dataTypes.numeric > 0 && <th className="text-left py-2 px-3 text-slate-700">Max</th>}
                                                            {analysis.dataTypes.categorical > 0 && <th className="text-left py-2 px-3 text-slate-700">Unique</th>}
                                                            {analysis.dataTypes.categorical > 0 && <th className="text-left py-2 px-3 text-slate-700">Most Frequent</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(analysis.eda.summary).map(([column, stats]) => (
                                                            <tr key={column} className="border-b border-blue-100">
                                                                <td className="py-2 px-3 font-medium text-slate-800">{column}</td>
                                                                <td className="py-2 px-3">
                                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                                        analysis.columnInfo[column].dataType === 'numeric' ? 'bg-blue-100 text-blue-700' :
                                                                        analysis.columnInfo[column].dataType === 'categorical' ? 'bg-green-100 text-green-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {analysis.columnInfo[column].dataType}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 px-3 text-slate-600">{stats.count}</td>
                                                                {stats.mean !== undefined && <td className="py-2 px-3 text-slate-600">{stats.mean.toFixed(2)}</td>}
                                                                {stats.std !== undefined && <td className="py-2 px-3 text-slate-600">{stats.std.toFixed(2)}</td>}
                                                                {stats.min !== undefined && <td className="py-2 px-3 text-slate-600">{stats.min.toFixed(2)}</td>}
                                                                {stats.max !== undefined && <td className="py-2 px-3 text-slate-600">{stats.max.toFixed(2)}</td>}
                                                                {stats.uniqueCount !== undefined && <td className="py-2 px-3 text-slate-600">{stats.uniqueCount}</td>}
                                                                {stats.mostFrequent !== undefined && <td className="py-2 px-3 text-slate-600">{stats.mostFrequent}</td>}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Correlation Matrix */}
                                    {Object.keys(analysis.eda.correlations).length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <TrendingUp className="w-5 h-5 text-purple-500" />
                                                <h3 className="text-lg font-semibold text-slate-800">Correlation Matrix</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-blue-200">
                                                            <th className="text-left py-2 px-3 text-slate-700"></th>
                                                            {Object.keys(analysis.eda.correlations).map(col => (
                                                                <th key={col} className="text-left py-2 px-3 text-slate-700">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(analysis.eda.correlations).map(col1 => (
                                                            <tr key={col1} className="border-b border-blue-100">
                                                                <td className="py-2 px-3 font-medium text-slate-800">{col1}</td>
                                                                {Object.keys(analysis.eda.correlations).map(col2 => (
                                                                    <td key={col2} className="py-2 px-3">
                                                                        {col1 === col2 ? (
                                                                            <span className="text-slate-400">-</span>
                                                                        ) : (
                                                                            <span className={`font-medium ${
                                                                                Math.abs(analysis.eda.correlations[col1][col2]) > 0.8 ? 'text-red-600' :
                                                                                Math.abs(analysis.eda.correlations[col1][col2]) > 0.6 ? 'text-orange-600' :
                                                                                Math.abs(analysis.eda.correlations[col1][col2]) > 0.4 ? 'text-yellow-600' :
                                                                                'text-green-600'
                                                                            }`}>
                                                                                {analysis.eda.correlations[col1][col2]?.toFixed(3) || 'N/A'}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-2 text-xs text-slate-500">
                                                <span className="inline-block w-3 h-3 bg-red-200 rounded mr-1"></span>
                                                <span>Strong (&gt;0.8)</span>
                                                <span className="inline-block w-3 h-3 bg-orange-200 rounded ml-3 mr-1"></span>
                                                <span>Moderate (0.6-0.8)</span>
                                                <span className="inline-block w-3 h-3 bg-yellow-200 rounded ml-3 mr-1"></span>
                                                <span>Weak (0.4-0.6)</span>
                                                <span className="inline-block w-3 h-3 bg-green-200 rounded ml-3 mr-1"></span>
                                                <span>Very Weak (&lt;0.4)</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Outlier Analysis */}
                                    {Object.keys(analysis.eda.outliers).length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                                <h3 className="text-lg font-semibold text-slate-800">Outlier Analysis</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(analysis.eda.outliers).map(([column, outliers]) => (
                                                    <div key={column} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-medium text-slate-800">{column}</span>
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                outliers.percentage > 10 ? 'bg-red-100 text-red-700' :
                                                                outliers.percentage > 5 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {outliers.count} outliers ({outliers.percentage.toFixed(1)}%)
                                                            </span>
                                                        </div>
                                                        {outliers.values.length > 0 && (
                                                            <div className="text-xs text-slate-600">
                                                                <strong>Sample outliers:</strong> {outliers.values.slice(0, 5).join(', ')}
                                                                {outliers.values.length > 5 && '...'}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ML Approach Recommendation */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                                            <h3 className="text-lg font-semibold text-slate-800">Recommended Approach</h3>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-lg font-semibold text-slate-800 capitalize">
                                                        {analysis.recommendedApproach} Learning
                                                    </span>
                                                    <Badge variant="primary" className="ml-2">
                                                        {Math.round(analysis.confidence * 100)}% Confidence
                                                    </Badge>
                                                </div>
                                                <Target className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3">{analysis.explanation}</p>
                                            
                                            {analysis.hasTargetColumn && (
                                                <div className="p-2 bg-white/50 rounded border border-blue-200">
                                                    <div className="text-xs text-slate-600">
                                                        <strong>Target Column:</strong> {analysis.targetColumn}
                                                    </div>
                                                    <div className="text-xs text-slate-600">
                                                        <strong>Features:</strong> {analysis.features.join(', ')}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Algorithm Recommendation */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap className="w-5 h-5 text-purple-500" />
                                            <h3 className="text-lg font-semibold text-slate-800">Best Algorithm</h3>
                                        </div>
                                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-lg font-semibold text-purple-800 capitalize">
                                                        {analysis.recommendedAlgorithm.replace('_', ' ')}
                                                    </div>
                                                    <div className="text-sm text-slate-600 mt-1">
                                                        Optimized for your specific data characteristics
                                                    </div>
                                                </div>
                                                <BarChart3 className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <Button 
                                            onClick={handleTrainModel}
                                            icon={Play}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            Train Model on Your Data
                                        </Button>
                                        <Button 
                                            onClick={handleViewDataset}
                                            icon={Activity}
                                            variant="outline"
                                        >
                                            Detailed EDA Analysis
                                        </Button>
                                        <Button 
                                            onClick={handleQuickPreview}
                                            icon={Eye}
                                            variant="outline"
                                        >
                                            Quick Preview
                                        </Button>
                                    </div>

                                    {/* Educational Info */}
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-blue-800 mb-1">
                                                    Understanding {analysis.recommendedApproach} Learning
                                                </div>
                                                <div className="text-xs text-blue-700">
                                                    {analysis.recommendedApproach === 'supervised' 
                                                        ? 'Supervised learning uses your labeled data to train models. The algorithm learns from input features and known outputs to make predictions on new data.'
                                                        : 'Unsupervised learning finds hidden patterns in your unlabeled data. It discovers natural groupings or structures without predefined target variables.'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Instructions */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>EDA & Real Data Processing Features</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                <div className="space-y-3 text-sm text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <div>
                                            <strong>Real CSV Processing:</strong> Actually reads and analyzes your uploaded CSV file
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <BarChart3 className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div>
                                            <strong>Statistical Analysis:</strong> Computes mean, std dev, quartiles, and distribution statistics
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Target className="w-4 h-4 text-purple-600 mt-0.5" />
                                        <div>
                                            <strong>Correlation Matrix:</strong> Analyzes relationships between numeric features
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                                        <div>
                                            <strong>Outlier Detection:</strong> Identifies statistical outliers using IQR method
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-yellow-600 mt-0.5" />
                                        <div>
                                            <strong>Smart Insights:</strong> Generates actionable insights about data quality and patterns
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <div>
                                            <strong>Data Quality Analysis:</strong> Checks missing values, class balance, and data issues
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Datasets */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Preview</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                {analysis && analysis.dataPreview ? (
                                    <div className="space-y-3">
                                        <div className="text-sm text-slate-600 mb-2">First 5 rows of your data:</div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-blue-200">
                                                        {analysis.headers.slice(0, 4).map(header => (
                                                            <th key={header} className="text-left py-1 px-2 text-slate-700 font-medium">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analysis.dataPreview.slice(0, 3).map((row, idx) => (
                                                        <tr key={idx} className="border-b border-blue-100">
                                                            {analysis.headers.slice(0, 4).map(header => (
                                                                <td key={header} className="py-1 px-2 text-slate-600 truncate">
                                                                    {row[header] || '-'}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {analysis.rows > 5 && (
                                            <div className="text-xs text-slate-500 mt-2">
                                                ... and {analysis.rows - 5} more rows
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600">Upload a CSV file to see preview</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Quick Tips */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Data Tips</CardTitle>
                            </CardHeader>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">CSV Format</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">First row must contain column headers</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Target Column</span>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-1">Include a column with categories/values to predict</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-purple-700">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm font-medium">Clean Data</span>
                                        </div>
                                        <p className="text-xs text-purple-600 mt-1">Remove empty rows for better analysis</p>
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
