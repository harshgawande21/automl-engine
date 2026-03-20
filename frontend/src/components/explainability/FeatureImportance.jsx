import Card, { CardHeader, CardTitle } from '../common/Card';

export default function FeatureImportance({ features, maxDisplay = 10 }) {
    const processedFeatures = React.useMemo(() => {
        if (!features) return null;
        return features.map(f => ({
            ...f,
            name: f.name ?? f.feature // Fallback to feature
        }));
    }, [features]);

    const demoFeatures = processedFeatures || [
        { name: 'Age', importance: 0.28 },
        { name: 'Income', importance: 0.22 },
        { name: 'Credit Score', importance: 0.18 },
        { name: 'Employment Years', importance: 0.12 },
        { name: 'Loan Amount', importance: 0.09 },
        { name: 'Debt Ratio', importance: 0.06 },
        { name: 'Education', importance: 0.03 },
        { name: 'Marital Status', importance: 0.02 },
    ];

    const sorted = [...demoFeatures].sort((a, b) => b.importance - a.importance).slice(0, maxDisplay);
    const maxImportance = sorted[0]?.importance || 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
            </CardHeader>
            <div className="space-y-3">
                {sorted.map((feature, i) => (
                    <div key={feature.name} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-4 text-right">{i + 1}</span>
                        <span className="text-sm text-slate-300 w-32 truncate">{feature.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-700">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${(feature.importance / maxImportance) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono text-indigo-400 w-14 text-right">
                            {(feature.importance * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
