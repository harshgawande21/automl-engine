import { Shield, Zap } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import FeatureImportance from '../../components/explainability/FeatureImportance';
import LimeVisualization from '../../components/explainability/LimeVisualization';
import SHAPGraph from '../../components/explainability/SHAPGraph';
import PageContainer from '../../components/layout/PageContainer';

export default function ExplainabilityDashboard() {
    const { currentModel } = useSelector(state => state.model);
    const navigate = useNavigate();

    if (!currentModel) {
        return (
            <PageContainer title="Explainability" subtitle="Understand your model's decision-making process">
                <Card className="max-w-2xl mx-auto mt-10 text-center p-12 bg-slate-900 border-slate-800">
                    <Shield className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">No Model Explainability Available</h2>
                    <p className="text-slate-400 mb-8">
                        Explainability analysis requires a trained model. 
                        Please train a model to see feature influence and local interpretations.
                    </p>
                    <Button onClick={() => navigate('/model/training')} icon={Zap}>
                        Go to Model Training
                    </Button>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Explainability" subtitle={`Insights for ${currentModel.algorithm?.toUpperCase()} Model`}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SHAPGraph data={currentModel.featureImportance} />
                    <FeatureImportance features={currentModel.featureImportance} />
                </div>
                <LimeVisualization />

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Model Transparency Summary</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <p className="text-3xl font-bold text-indigo-400">
                                {currentModel.datasetInfo?.columns || '0'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Features Analyzed</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <p className="text-3xl font-bold text-emerald-400">
                                {currentModel.accuracy ? `${(currentModel.accuracy * 100).toFixed(1)}%` : 'N/A'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Model Accuracy</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <p className="text-3xl font-bold text-amber-400">
                                {currentModel.featureImportance?.length || '0'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Key Drivers</p>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}
