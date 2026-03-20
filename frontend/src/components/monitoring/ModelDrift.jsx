import DriftChart from '../charts/DriftChart';
import Badge from '../common/Badge';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function ModelDrift({ driftData }) {
    const demo = driftData || {
        status: 'warning',
        features: [
            { feature: 'Age', reference: 0.5, current: 0.62, threshold: 0.1 },
            { feature: 'Income', reference: 0.3, current: 0.35, threshold: 0.1 },
            { feature: 'Score', reference: 0.7, current: 0.88, threshold: 0.1 },
        ],
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Model Drift</CardTitle>
                <Badge variant={demo.status === 'healthy' ? 'success' : 'warning'} dot>
                    {demo.status}
                </Badge>
            </CardHeader>
            <DriftChart data={demo.features} height={250} />
        </Card>
    );
}
