import {
    Activity,
    AlertCircle,
    BarChart3,
    Brain,
    CheckCircle,
    Download,
    Eye,
    Info,
    PieChart as PieChartIcon,
    LayoutGrid,
    Target
} from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BarChart from '../../components/charts/BarChart';
import BoxPlot from '../../components/charts/BoxPlot';
import CorrelationHeatmap from '../../components/charts/CorrelationHeatmap';
import Histogram from '../../components/charts/Histogram';
import PieChart from '../../components/charts/PieChart';
import RadarChart from '../../components/charts/RadarChart';
import ViolinPlot from '../../components/charts/ViolinPlot';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';

export default function DetailedEDA() {
    const location = useLocation();
    const analysis = location.state?.datasetAnalysis;
    const [selectedChart, setSelectedChart] = useState('overview');

    if (!analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Dataset Analysis Available</h2>
                    <p className="text-gray-600">Please upload and analyze a dataset first.</p>
                </div>
            </div>
        );
    }

    // Generate chart data from analysis
    const generateChartData = () => {
        const charts = {};

        // Data Type Distribution
        charts.dataTypes = [
            { name: 'Numeric', value: analysis.dataTypes.numeric, color: '#3B82F6' },
            { name: 'Categorical', value: analysis.dataTypes.categorical, color: '#10B981' },
            { name: 'Text', value: analysis.dataTypes.text, color: '#F59E0B' }
        ];

        // Missing Values by Column
        charts.missingValues = analysis.headers.map(header => ({
            name: header,
            missing: analysis.columnInfo[header].missingValues,
            percentage: (analysis.columnInfo[header].missingValues / analysis.rows) * 100
        })).filter(item => item.missing > 0);

        // Column Statistics
        charts.columnStats = analysis.headers.map(header => {
            const info = analysis.columnInfo[header];
            const stats = analysis.eda.summary[header];
            return {
                name: header,
                uniqueValues: info.uniqueValues,
                missingValues: info.missingValues,
                dataType: info.dataType,
                ...(stats && {
                    mean: stats.mean,
                    median: stats.median,
                    std: stats.std,
                    min: stats.min,
                    max: stats.max
                })
            };
        });

        // Numeric Columns Distribution
        charts.numericColumns = analysis.headers.filter(header => 
            analysis.columnInfo[header].dataType === 'numeric'
        );

        // Categorical Distributions
        charts.categoricalDistributions = {};
        analysis.headers.forEach(header => {
            if (analysis.columnInfo[header].dataType === 'categorical' && analysis.eda.distributions[header]) {
                charts.categoricalDistributions[header] = analysis.eda.distributions[header].slice(0, 10);
            }
        });

        // Numeric Distributions (Histograms)
        charts.numericDistributions = {};
        analysis.headers.forEach(header => {
            if (analysis.columnInfo[header].dataType === 'numeric' && analysis.eda.distributions[header]) {
                charts.numericDistributions[header] = analysis.eda.distributions[header];
            }
        });

        // Correlation Matrix Data
        if (Object.keys(analysis.eda.correlations).length > 0) {
            charts.correlationData = analysis.eda.correlations;
            charts.correlationColumns = Object.keys(analysis.eda.correlations);
        }

        // Outlier Analysis
        charts.outliers = Object.entries(analysis.eda.outliers).map(([column, data]) => ({
            column,
            count: data.count,
            percentage: data.percentage
        }));

        // Box Plot Data
        charts.boxPlotData = analysis.headers
            .filter(header => analysis.columnInfo[header].dataType === 'numeric' && analysis.eda.summary[header])
            .map(header => {
                const stats = analysis.eda.summary[header];
                return {
                    name: header,
                    min: stats.min,
                    q1: stats.q1,
                    median: stats.median,
                    q3: stats.q3,
                    max: stats.max
                };
            });

        return charts;
    };

    const charts = generateChartData();

    const renderChart = () => {
        switch (selectedChart) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                                    Data Type Distribution
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4">
                                <PieChart data={charts.dataTypes} height={300} />
                                <div className="mt-4 text-sm text-gray-600">
                                    <p><strong>Total Columns:</strong> {analysis.columns}</p>
                                    <p><strong>Total Rows:</strong> {analysis.rows}</p>
                                    <p><strong>Missing Values:</strong> {analysis.missingValues}</p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                    Missing Values Analysis
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4">
                                {charts.missingValues.length > 0 ? (
                                    <BarChart 
                                        data={charts.missingValues}
                                        bars={[{ key: 'missing', label: 'Missing Values', color: '#EF4444' }]}
                                        xKey="name"
                                        height={300}
                                    />
                                ) : (
                                    <div className="text-center py-8 text-green-600">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                        <p>No missing values found!</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                );

            case 'distributions':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Object.entries(charts.categoricalDistributions).map(([column, data]) => (
                                <Card key={column}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-purple-600" />
                                            {column} Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <div className="p-4">
                                        <BarChart 
                                            data={data}
                                            bars={[{ key: 'count', label: 'Count', color: '#8B5CF6' }]}
                                            xKey="value"
                                            height={250}
                                        />
                                        <div className="mt-2 text-xs text-gray-600">
                                            Unique values: {data.length}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Object.entries(charts.numericDistributions).map(([column, data]) => (
                                <Card key={column}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                            {column} Histogram
                                        </CardTitle>
                                    </CardHeader>
                                    <div className="p-4">
                                        <Histogram data={data} height={250} />
                                        <div className="mt-2 text-xs text-gray-600">
                                            Bins: {data.length}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'correlations':
                return (
                    <div className="space-y-6">
                        {charts.correlationData ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LayoutGrid className="w-5 h-5 text-orange-600" />
                                        Correlation Matrix
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-4">
                                    <CorrelationHeatmap 
                                        data={charts.correlationData} 
                                        columns={charts.correlationColumns}
                                        height={400}
                                    />
                                </div>
                            </Card>
                        ) : (
                            <Card>
                                <div className="text-center py-8 text-gray-500">
                                    <Info className="w-12 h-12 mx-auto mb-2" />
                                    <p>Correlation analysis requires at least 2 numeric columns</p>
                                </div>
                            </Card>
                        )}
                    </div>
                );

            case 'outliers':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        Outlier Analysis
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-4">
                                    {charts.outliers.length > 0 ? (
                                        <BarChart 
                                            data={charts.outliers}
                                            bars={[{ key: 'count', label: 'Outlier Count', color: '#EF4444' }]}
                                            xKey="column"
                                            height={300}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-green-600">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                            <p>No significant outliers detected!</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-orange-600" />
                                        Outlier Percentage
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-4">
                                    {charts.outliers.length > 0 ? (
                                        <BarChart 
                                            data={charts.outliers}
                                            bars={[{ key: 'percentage', label: 'Percentage (%)', color: '#F59E0B' }]}
                                            xKey="column"
                                            height={300}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No outlier data available</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {charts.boxPlotData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-purple-600" />
                                        Box Plot Analysis
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-4">
                                    <BoxPlot data={charts.boxPlotData} height={400} />
                                </div>
                            </Card>
                        )}
                    </div>
                );

            case 'advanced':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {charts.boxPlotData.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-indigo-600" />
                                            Violin Plot Analysis
                                        </CardTitle>
                                    </CardHeader>
                                    <div className="p-4">
                                        <ViolinPlot data={charts.boxPlotData} height={400} />
                                    </div>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-pink-600" />
                                        Feature Importance Radar
                                    </CardTitle>
                                </CardHeader>
                                <div className="p-4">
                                    {analysis.features && analysis.features.length > 0 ? (
                                        <RadarChart 
                                            data={analysis.features.slice(0, 6).map((feature, index) => ({
                                                label: feature,
                                                importance: Math.max(20, 100 - (index * 15)),
                                                completeness: Math.max(30, 95 - (index * 10)),
                                                uniqueness: Math.max(40, 85 - (index * 8))
                                            }))}
                                            height={400}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Feature data not available</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LayoutGrid className="w-5 h-5 text-cyan-600" />
                                    Data Quality Assessment
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {((analysis.rows * analysis.columns - analysis.missingValues) / (analysis.rows * analysis.columns) * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-slate-600">Data Completeness</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {analysis.rows * analysis.columns - analysis.missingValues} / {analysis.rows * analysis.columns} cells
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {charts.outliers.length > 0 ? 
                                                ((charts.outliers.reduce((sum, o) => sum + o.count, 0) / (analysis.rows * charts.numericColumns.length)) * 100).toFixed(1) : 
                                                '0.0'}%
                                        </div>
                                        <div className="text-sm text-slate-600">Outlier Rate</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {charts.outliers.reduce((sum, o) => sum + o.count, 0)} outliers detected
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {charts.correlationColumns ? charts.correlationColumns.length : 0}
                                        </div>
                                        <div className="text-sm text-slate-600">Numeric Features</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Available for correlation analysis
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Exploratory Data Analysis</h1>
                        <p className="text-slate-600">Comprehensive analysis of your dataset</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" icon={Download}>
                            Export Report
                        </Button>
                        <Button icon={Eye}>
                            View Raw Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dataset Overview */}
            <div className="p-6">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            Dataset Overview
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{analysis.rows}</div>
                                <div className="text-xs text-slate-600">Total Rows</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{analysis.columns}</div>
                                <div className="text-xs text-slate-600">Total Columns</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{analysis.dataTypes.numeric}</div>
                                <div className="text-xs text-slate-600">Numeric Columns</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{analysis.dataTypes.categorical}</div>
                                <div className="text-xs text-slate-600">Categorical Columns</div>
                            </div>
                        </div>

                        {/* Column Details Table */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">Column Details</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-blue-200">
                                            <th className="text-left py-2 px-3 text-slate-700">Column Name</th>
                                            <th className="text-left py-2 px-3 text-slate-700">Type</th>
                                            <th className="text-left py-2 px-3 text-slate-700">Unique Values</th>
                                            <th className="text-left py-2 px-3 text-slate-700">Missing</th>
                                            <th className="text-left py-2 px-3 text-slate-700">Statistics</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysis.headers.map(header => {
                                            const info = analysis.columnInfo[header];
                                            const stats = analysis.eda.summary[header];
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
                                                        {stats ? (
                                                            info.dataType === 'numeric' ? 
                                                            `Mean: ${stats.mean?.toFixed(2)}, Std: ${stats.std?.toFixed(2)}` :
                                                            `Most Frequent: ${stats.mostFrequent}`
                                                        ) : '-'}
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
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">EDA Insights</h3>
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
                    </div>
                </Card>

                {/* Chart Navigation */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedChart === 'overview' ? 'primary' : 'outline'}
                            onClick={() => setSelectedChart('overview')}
                            icon={BarChart3}
                        >
                            Overview
                        </Button>
                        <Button
                            variant={selectedChart === 'distributions' ? 'primary' : 'outline'}
                            onClick={() => setSelectedChart('distributions')}
                            icon={Activity}
                        >
                            Distributions
                        </Button>
                        <Button
                            variant={selectedChart === 'correlations' ? 'primary' : 'outline'}
                            onClick={() => setSelectedChart('correlations')}
                            icon={LayoutGrid}
                        >
                            Correlations
                        </Button>
                        <Button
                            variant={selectedChart === 'outliers' ? 'primary' : 'outline'}
                            onClick={() => setSelectedChart('outliers')}
                            icon={AlertCircle}
                        >
                            Outliers
                        </Button>
                        <Button
                            variant={selectedChart === 'advanced' ? 'primary' : 'outline'}
                            onClick={() => setSelectedChart('advanced')}
                            icon={Brain}
                        >
                            Advanced
                        </Button>
                    </div>
                </div>

                {/* Charts */}
                {renderChart()}

                {/* ML Recommendations */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            Machine Learning Recommendations
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-2">Recommended Approach</h4>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-semibold text-blue-800 capitalize">
                                            {analysis.recommendedApproach} Learning
                                        </span>
                                        <Badge variant="primary">
                                            {Math.round(analysis.confidence * 100)}% Confidence
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">{analysis.explanation}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-2">Best Algorithm</h4>
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-lg font-semibold text-green-800 capitalize">
                                        {analysis.recommendedAlgorithm.replace('_', ' ')}
                                    </div>
                                    <div className="text-sm text-slate-600 mt-1">
                                        Optimized for your specific data characteristics
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold text-slate-800 mb-2">Why This Algorithm?</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                                <p>• <strong>Data Type Match:</strong> Perfect for {analysis.dataTypes.numeric > analysis.dataTypes.categorical ? 'numeric-heavy' : 'mixed'} data types</p>
                                <p>• <strong>Dataset Size:</strong> Optimal for {analysis.rows < 1000 ? 'small' : analysis.rows < 10000 ? 'medium' : 'large'} datasets ({analysis.rows} rows)</p>
                                <p>• <strong>Feature Complexity:</strong> Handles {analysis.columns} features effectively</p>
                                <p>• <strong>Target Variable:</strong> {analysis.hasTargetColumn ? `Perfect for ${analysis.columnInfo[analysis.targetColumn].uniqueValues}-class classification` : 'Ideal for clustering analysis'}</p>
                                {analysis.missingValues > 0 && <p>• <strong>Missing Data:</strong> Robust to {((analysis.missingValues / (analysis.rows * analysis.columns)) * 100).toFixed(1)}% missing values</p>}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <Button icon={Target} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Train Recommended Model
                            </Button>
                            <Button variant="outline">
                                Compare Algorithms
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
