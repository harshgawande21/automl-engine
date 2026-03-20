import Card, { CardHeader, CardTitle } from '../common/Card';

export default function LimeVisualization({ data }) {
    const demoData = data || [
        { feature: 'Age > 35', weight: 0.42, direction: 'positive' },
        { feature: 'Income > 50k', weight: 0.35, direction: 'positive' },
        { feature: 'Credit Score < 600', weight: -0.28, direction: 'negative' },
        { feature: 'Employment < 2yr', weight: -0.15, direction: 'negative' },
        { feature: 'Has Mortgage', weight: 0.08, direction: 'positive' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>LIME Explanation</CardTitle>
            </CardHeader>
            <div className="space-y-3">
                {demoData.map((item) => {
                    const isPositive = item.weight > 0;
                    const absWeight = Math.abs(item.weight);
                    return (
                        <div key={item.feature} className="flex items-center gap-3">
                            <span className="text-sm text-slate-300 w-40 truncate">{item.feature}</span>
                            <div className="flex-1 flex items-center gap-1">
                                {/* Negative bar */}
                                <div className="flex-1 flex justify-end">
                                    {!isPositive && (
                                        <div
                                            className="h-5 rounded-l bg-red-500/30 border border-red-500/40"
                                            style={{ width: `${absWeight * 100}%` }}
                                        />
                                    )}
                                </div>
                                <div className="w-px h-6 bg-slate-600" />
                                {/* Positive bar */}
                                <div className="flex-1">
                                    {isPositive && (
                                        <div
                                            className="h-5 rounded-r bg-emerald-500/30 border border-emerald-500/40"
                                            style={{ width: `${absWeight * 100}%` }}
                                        />
                                    )}
                                </div>
                            </div>
                            <span className={`text-xs font-mono w-14 text-right ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}{item.weight.toFixed(3)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 mt-4">Green bars push toward positive class, red bars push toward negative class.</p>
        </Card>
    );
}
