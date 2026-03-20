import LineChart from './LineChart';

export default function DriftChart({ data, height = 300 }) {
    const lines = [
        { key: 'reference', label: 'Reference', color: '#6366F1' },
        { key: 'current', label: 'Current', color: '#10B981' },
        { key: 'threshold', label: 'Threshold', color: '#EF4444' },
    ];

    return <LineChart data={data} lines={lines} xKey="feature" height={height} />;
}
