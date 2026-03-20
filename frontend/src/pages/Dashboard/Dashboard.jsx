import {
    Activity,
    AlertCircle,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Database,
    Play,
    Settings,
    Target, TrendingUp, Upload,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';

export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

    // Mock data for dashboard
    const kpiData = [
        { label: 'Total Models', value: '12', change: '+2', icon: Brain, color: 'blue', trend: 'up' },
        { label: 'Datasets', value: '34', change: '+5', icon: Database, color: 'green', trend: 'up' },
        { label: 'Predictions', value: '1,247', change: '+127', icon: Target, color: 'yellow', trend: 'up' },
        { label: 'Accuracy', value: '94.6%', change: '+2.1%', icon: TrendingUp, color: 'pink', trend: 'up' },
        { label: 'Active Users', value: '8', change: '+1', icon: Users, color: 'purple', trend: 'up' },
        { label: 'API Calls', value: '45.2K', change: '+8.3K', icon: Zap, color: 'orange', trend: 'up' }
    ];

    const recentActivity = [
        { id: 1, action: 'Model trained', details: 'Random Forest Classifier', time: '2 hours ago', status: 'success' },
        { id: 2, action: 'Dataset uploaded', details: 'customer_data_v2.csv', time: '4 hours ago', status: 'success' },
        { id: 3, action: 'Prediction completed', details: 'Batch of 150 records', time: '6 hours ago', status: 'success' },
        { id: 4, action: 'Model evaluation', details: 'XGBoost v2.1 - 95.2% accuracy', time: '1 day ago', status: 'success' },
        { id: 5, action: 'System update', details: 'Security patches applied', time: '2 days ago', status: 'info' }
    ];

    const modelPerformance = [
        { name: 'Random Forest', accuracy: 94.6, status: 'active', lastTrained: '2 hours ago' },
        { name: 'XGBoost', accuracy: 95.2, status: 'active', lastTrained: '1 day ago' },
        { name: 'Logistic Regression', accuracy: 89.3, status: 'inactive', lastTrained: '3 days ago' },
        { name: 'SVM', accuracy: 91.8, status: 'training', lastTrained: 'Training...' }
    ];

    const quickActions = [
        { title: 'Upload Dataset', description: 'Add new data for training', icon: Upload, route: '/data/upload', color: 'blue' },
        { title: 'Train Model', description: 'Create new ML model', icon: Play, route: '/model/training', color: 'green' },
        { title: 'Make Prediction', description: 'Single or batch predictions', icon: Target, route: '/prediction/single', color: 'purple' },
        { title: 'View Analytics', description: 'Detailed insights', icon: BarChart3, route: '/analytics', color: 'orange' },
        { title: 'System Health', description: 'Monitor performance', icon: Activity, route: '/monitoring', color: 'red' },
        { title: 'Settings', description: 'Configure system', icon: Settings, route: '/settings', color: 'gray' }
    ];

    const systemHealth = {
        cpu: 45,
        memory: 62,
        storage: 78,
        api: 99.9,
        uptime: '15 days 7 hours'
    };

    const handleQuickAction = (route) => {
        navigate(route);
    };

    // Helper function for color classes
    const getColorClasses = (color) => {
        const colorMap = {
            blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-50', progress: 'bg-blue-500', progressBg: 'bg-blue-100' },
            green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-50', progress: 'bg-green-500', progressBg: 'bg-green-100' },
            yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', hover: 'hover:bg-yellow-50', progress: 'bg-yellow-500', progressBg: 'bg-yellow-100' },
            pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-50', progress: 'bg-pink-500', progressBg: 'bg-pink-100' },
            purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-50', progress: 'bg-purple-500', progressBg: 'bg-purple-100' },
            orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-50', progress: 'bg-orange-500', progressBg: 'bg-orange-100' },
            red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-50', progress: 'bg-red-500', progressBg: 'bg-red-100' },
            gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', hover: 'hover:bg-gray-50', progress: 'bg-gray-500', progressBg: 'bg-gray-100' }
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-blue-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">ML Engine Dashboard</h1>
                        <p className="text-slate-600 mt-1">Complete overview of your machine learning platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select 
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="px-4 py-2 border border-blue-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        >
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <Button variant="primary" onClick={() => navigate('/settings')}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    {kpiData.map((kpi, index) => {
                        const Icon = kpi.icon;
                        const colors = getColorClasses(kpi.color);
                        return (
                            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium">{kpi.label}</p>
                                        <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                                        <p className="text-xs text-green-600 flex items-center mt-1 font-semibold">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            {kpi.change}
                                        </p>
                                    </div>
                                    <div className={`p-3 ${colors.bg} rounded-lg`}>
                                        <Icon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                const colors = getColorClasses(action.color);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickAction(action.route)}
                                        className={`p-4 bg-white border ${colors.border} rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 text-left group ${colors.hover}`}
                                    >
                                        <div className={`p-2 ${colors.bg} rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-5 h-5 ${colors.text}`} />
                                        </div>
                                        <h3 className="font-semibold text-slate-800 text-sm">{action.title}</h3>
                                        <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* System Health */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">CPU Usage</span>
                                    <span className="text-slate-800 font-semibold">{systemHealth.cpu}%</span>
                                </div>
                                <div className="w-full bg-blue-100 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.cpu}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">Memory</span>
                                    <span className="text-slate-800 font-semibold">{systemHealth.memory}%</span>
                                </div>
                                <div className="w-full bg-green-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.memory}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">Storage</span>
                                    <span className="text-slate-800 font-semibold">{systemHealth.storage}%</span>
                                </div>
                                <div className="w-full bg-yellow-100 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.storage}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">API Uptime</span>
                                    <span className="text-slate-800 font-semibold">{systemHealth.api}%</span>
                                </div>
                                <div className="w-full bg-purple-100 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemHealth.api}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-blue-100">
                                <div className="flex items-center text-sm text-slate-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Uptime: {systemHealth.uptime}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer">
                                    <div className={`p-2 rounded-full ${
                                        activity.status === 'success' ? 'bg-green-100' : 'bg-blue-100'
                                    }`}>
                                        {activity.status === 'success' ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                                        <p className="text-xs text-slate-600">{activity.details}</p>
                                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Model Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Model Performance</CardTitle>
                        </CardHeader>
                        <div className="space-y-3">
                            {modelPerformance.map((model, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Brain className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{model.name}</p>
                                            <p className="text-xs text-slate-600">{model.lastTrained}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">{model.accuracy}%</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            model.status === 'active' ? 'bg-green-100 text-green-700' :
                                            model.status === 'training' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {model.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Features Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Features</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer">
                            <div className="p-4 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                                <Database className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-2">Data Management</h3>
                            <p className="text-sm text-slate-600">Upload, process, and manage datasets with ease</p>
                        </div>
                        <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-colors duration-200 cursor-pointer">
                            <div className="p-4 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                                <Brain className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-2">Model Training</h3>
                            <p className="text-sm text-slate-600">Train various ML models with hyperparameter tuning</p>
                        </div>
                        <div className="text-center p-4 hover:bg-purple-50 rounded-lg transition-colors duration-200 cursor-pointer">
                            <div className="p-4 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                                <Target className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-2">Predictions</h3>
                            <p className="text-sm text-slate-600">Single and batch predictions with confidence scores</p>
                        </div>
                        <div className="text-center p-4 hover:bg-orange-50 rounded-lg transition-colors duration-200 cursor-pointer">
                            <div className="p-4 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
                                <BarChart3 className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-2">Analytics</h3>
                            <p className="text-sm text-slate-600">Comprehensive insights and visualizations</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
