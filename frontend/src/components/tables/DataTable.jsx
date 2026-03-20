import { cn } from '../../utils/helpers';

export default function DataTable({ columns = [], data = [], onRowClick, emptyMessage = 'No data available' }) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center py-12 text-slate-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-blue-200">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-blue-200 bg-blue-50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left font-medium text-blue-700 uppercase tracking-wider text-xs"
                                style={{ width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                'transition-colors',
                                onRowClick && 'cursor-pointer hover:bg-blue-50'
                            )}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-slate-700">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
