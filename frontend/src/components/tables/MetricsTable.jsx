import { formatMetric } from '../../utils/formatters';
import DataTable from './DataTable';

export default function MetricsTable({ metrics = [] }) {
    const columns = [
        { key: 'name', label: 'Metric', render: (val) => <span className="font-medium text-slate-800">{val}</span> },
        { key: 'value', label: 'Value', render: (val) => <span className="font-mono text-blue-600">{formatMetric(val)}</span> },
        {
            key: 'change',
            label: 'Change',
            render: (val) => {
                if (!val) return '—';
                const isPositive = val > 0;
                return (
                    <span className={isPositive ? 'text-green-600' : 'text-red-500'}>
                        {isPositive ? '+' : ''}{formatMetric(val)}
                    </span>
                );
            },
        },
        { key: 'description', label: 'Description', render: (val) => <span className="text-slate-600">{val}</span> },
    ];

    return <DataTable columns={columns} data={metrics} />;
}
