import Badge from '../../components/common/Badge';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import PageContainer from '../../components/layout/PageContainer';
import DataTable from '../../components/tables/DataTable';

const demoData = {
    columns: [
        { key: 'age', label: 'Age' },
        { key: 'income', label: 'Income' },
        { key: 'score', label: 'Score' },
        { key: 'category', label: 'Category' },
        { key: 'target', label: 'Target' },
    ],
    rows: Array.from({ length: 10 }, (_, i) => ({
        age: 25 + Math.floor(Math.random() * 40),
        income: Math.floor(30000 + Math.random() * 70000),
        score: Math.floor(300 + Math.random() * 550),
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        target: Math.random() > 0.5 ? 1 : 0,
    })),
    stats: { rows: 1500, columns: 12, missing: 23, duplicates: 5 },
};

export default function DatasetPreview() {
    return (
        <PageContainer title="Dataset Preview" subtitle="Explore and understand your data">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Rows', value: demoData.stats.rows },
                        { label: 'Columns', value: demoData.stats.columns },
                        { label: 'Missing Values', value: demoData.stats.missing },
                        { label: 'Duplicates', value: demoData.stats.duplicates },
                    ].map((stat) => (
                        <Card key={stat.label} className="text-center py-4">
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Sample (First 10 rows)</CardTitle>
                    </CardHeader>
                    <DataTable columns={demoData.columns} data={demoData.rows} />
                </Card>

                {/* Column Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Column Information</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {demoData.columns.map((col) => (
                            <div key={col.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                                <span className="text-sm text-slate-300">{col.label}</span>
                                <Badge variant="info">{col.key === 'category' ? 'categorical' : 'numeric'}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}
