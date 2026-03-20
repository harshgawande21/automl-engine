import BarChart from '../charts/BarChart';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function UsageAnalytics({ data }) {
    const demoData = data || [
        { day: 'Mon', predictions: 120, uploads: 15, trainings: 3 },
        { day: 'Tue', predictions: 185, uploads: 22, trainings: 5 },
        { day: 'Wed', predictions: 210, uploads: 18, trainings: 4 },
        { day: 'Thu', predictions: 165, uploads: 25, trainings: 6 },
        { day: 'Fri', predictions: 195, uploads: 20, trainings: 2 },
        { day: 'Sat', predictions: 80, uploads: 8, trainings: 1 },
        { day: 'Sun', predictions: 55, uploads: 5, trainings: 0 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
            </CardHeader>
            <BarChart
                data={demoData}
                bars={[
                    { key: 'predictions', label: 'Predictions', color: '#6366F1' },
                    { key: 'uploads', label: 'Uploads', color: '#10B981' },
                    { key: 'trainings', label: 'Trainings', color: '#F59E0B' },
                ]}
                xKey="day"
                height={250}
            />
        </Card>
    );
}
