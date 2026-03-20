import LineChart from '../charts/LineChart';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function ErrorRates({ data }) {
    const demoData = data || [
        { time: '10:00', rate: 0.01, count: 5 },
        { time: '10:05', rate: 0.02, count: 8 },
        { time: '10:10', rate: 0.015, count: 6 },
        { time: '10:15', rate: 0.035, count: 14 },
        { time: '10:20', rate: 0.02, count: 9 },
        { time: '10:25', rate: 0.01, count: 4 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Error Rates</CardTitle>
            </CardHeader>
            <LineChart
                data={demoData}
                lines={[{ key: 'rate', label: 'Error Rate', color: '#EF4444' }]}
                xKey="time"
                height={250}
            />
        </Card>
    );
}
