import { ArrowRight, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function RecentPredictions({ predictions = [] }) {
    const demoData = predictions.length ? predictions : [
        { id: 1, model: 'Random Forest', result: 'Class A', confidence: 0.94, timestamp: new Date().toISOString() },
        { id: 2, model: 'XGBoost', result: 'Class B', confidence: 0.87, timestamp: new Date().toISOString() },
        { id: 3, model: 'Logistic Regression', result: 'Class A', confidence: 0.91, timestamp: new Date().toISOString() },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <a href="/prediction/results" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View All <ArrowRight size={12} />
                </a>
            </CardHeader>
            <div className="space-y-3">
                {demoData.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">{p.model}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock size={12} className="text-slate-500" />
                                <span className="text-xs text-slate-500">{formatDateTime(p.timestamp)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge variant="primary">{p.result}</Badge>
                            <p className="text-xs text-slate-400 mt-1">{(p.confidence * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
