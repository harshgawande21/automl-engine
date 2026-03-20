import BarChart from '../charts/BarChart';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function SHAPGraph({ data, height = 350 }) {
    const processedData = React.useMemo(() => {
        if (!data) return null;
        return data.map(item => ({
            ...item,
            impact: item.impact ?? item.importance // Fallback to importance
        }));
    }, [data]);

    const demoData = processedData || [
        { feature: 'Age', impact: 0.35 },
        { feature: 'Income', impact: 0.28 },
        { feature: 'Credit Score', impact: 0.22 },
        { feature: 'Employment', impact: 0.15 },
        { feature: 'Loan Amount', impact: 0.12 },
        { feature: 'Duration', impact: 0.08 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>SHAP Values</CardTitle>
            </CardHeader>
            <BarChart
                data={demoData}
                bars={[{ key: 'impact', label: 'SHAP Impact', color: '#6366F1' }]}
                xKey="feature"
                height={height}
            />
            <p className="text-xs text-slate-500 mt-3">Higher SHAP values indicate greater feature influence on model predictions.</p>
        </Card>
    );
}
