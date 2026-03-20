import LineChart from '../charts/LineChart';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function LatencyChart({ data }) {
    const demoData = data || [
        { time: '10:00', p50: 45, p95: 120, p99: 280 },
        { time: '10:05', p50: 52, p95: 135, p99: 310 },
        { time: '10:10', p50: 38, p95: 95, p99: 250 },
        { time: '10:15', p50: 60, p95: 155, p99: 340 },
        { time: '10:20', p50: 42, p95: 110, p99: 260 },
        { time: '10:25', p50: 55, p95: 140, p99: 300 },
    ];

    const lines = [
        { key: 'p50', label: 'P50', color: '#10B981' },
        { key: 'p95', label: 'P95', color: '#F59E0B' },
        { key: 'p99', label: 'P99', color: '#EF4444' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>API Latency (ms)</CardTitle>
            </CardHeader>
            <LineChart data={demoData} lines={lines} xKey="time" height={250} />
        </Card>
    );
}
