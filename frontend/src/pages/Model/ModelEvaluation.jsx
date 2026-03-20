import BarChart from '../../components/charts/BarChart';
import ConfusionMatrix from '../../components/charts/ConfusionMatrix';
import ROCChart from '../../components/charts/ROCChart';
import Badge from '../../components/common/Badge';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import PageContainer from '../../components/layout/PageContainer';
import MetricsTable from '../../components/tables/MetricsTable';

const metrics = [
    { name: 'Accuracy', value: 0.9456, change: 0.012, description: 'Overall correct predictions' },
    { name: 'Precision', value: 0.9312, change: 0.008, description: 'Positive predictive value' },
    { name: 'Recall', value: 0.9523, change: 0.015, description: 'True positive rate' },
    { name: 'F1 Score', value: 0.9416, change: 0.011, description: 'Harmonic mean of P & R' },
    { name: 'AUC-ROC', value: 0.9734, change: 0.005, description: 'Area under ROC curve' },
];

const confMatrix = [[85, 8], [5, 102]];

const rocData = Array.from({ length: 20 }, (_, i) => ({
    fpr: i / 19,
    tpr: Math.min(1, Math.pow(i / 19, 0.4)),
}));

const classMetrics = [
    { class: 'Class A', precision: 0.94, recall: 0.91, f1: 0.92 },
    { class: 'Class B', precision: 0.92, recall: 0.96, f1: 0.94 },
];

export default function ModelEvaluation() {
    return (
        <PageContainer title="Model Evaluation" subtitle="Evaluate your trained model's performance">
            <div className="space-y-6">
                {/* Model Info */}
                <Card className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Random Forest Classifier</h3>
                        <p className="text-sm text-slate-400">Trained on Feb 15, 2026 • 1,500 samples</p>
                    </div>
                    <Badge variant="success" dot>Active</Badge>
                </Card>

                {/* Metrics */}
                <MetricsTable metrics={metrics} />

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Confusion Matrix</CardTitle></CardHeader>
                        <ConfusionMatrix matrix={confMatrix} />
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>ROC Curve</CardTitle></CardHeader>
                        <ROCChart data={rocData} height={280} />
                    </Card>
                </div>

                {/* Per-class metrics */}
                <Card>
                    <CardHeader><CardTitle>Per-Class Metrics</CardTitle></CardHeader>
                    <BarChart
                        data={classMetrics}
                        bars={[
                            { key: 'precision', label: 'Precision', color: '#6366F1' },
                            { key: 'recall', label: 'Recall', color: '#10B981' },
                            { key: 'f1', label: 'F1 Score', color: '#F59E0B' },
                        ]}
                        xKey="class"
                        height={250}
                    />
                </Card>
            </div>
        </PageContainer>
    );
}
