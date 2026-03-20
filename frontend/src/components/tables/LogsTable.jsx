import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import DataTable from './DataTable';

export default function LogsTable({ logs = [] }) {
    const columns = [
        { key: 'timestamp', label: 'Time', render: (val) => formatDateTime(val), width: '160px' },
        {
            key: 'level',
            label: 'Level',
            render: (val) => {
                const variant = val === 'error' ? 'danger' : val === 'warning' ? 'warning' : 'info';
                return <Badge variant={variant}>{val?.toUpperCase()}</Badge>;
            },
            width: '100px',
        },
        { key: 'source', label: 'Source' },
        { key: 'message', label: 'Message' },
    ];

    return <DataTable columns={columns} data={logs} />;
}
