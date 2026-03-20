import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import DataTable from './DataTable';

export default function PredictionTable({ predictions = [] }) {
    const columns = [
        { key: 'id', label: 'ID', width: '80px' },
        { key: 'model', label: 'Model' },
        { key: 'input', label: 'Input', render: (val) => <span className="truncate max-w-[200px] block">{JSON.stringify(val)}</span> },
        { key: 'result', label: 'Result', render: (val) => <span className="font-semibold text-blue-600">{val}</span> },
        {
            key: 'confidence',
            label: 'Confidence',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-blue-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-pink-400"
                            style={{ width: `${(val || 0) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-600">{((val || 0) * 100).toFixed(1)}%</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <Badge variant={val === 'completed' ? 'success' : val === 'failed' ? 'danger' : 'warning'} dot>
                    {val}
                </Badge>
            ),
        },
        { key: 'timestamp', label: 'Time', render: (val) => formatDateTime(val) },
    ];

    return <DataTable columns={columns} data={predictions} />;
}
