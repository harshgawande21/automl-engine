import { AlertTriangle, Bell, Info } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../common/Card';

export default function AlertsPanel({ alerts = [] }) {
    const demoAlerts = alerts.length ? alerts : [
        { id: 1, type: 'warning', title: 'Model Drift Detected', message: 'Feature distribution shift in age column', time: '5 min ago' },
        { id: 2, type: 'error', title: 'High Error Rate', message: 'Prediction error rate exceeds 5%', time: '12 min ago' },
        { id: 3, type: 'info', title: 'Training Complete', message: 'XGBoost model training finished', time: '1 hr ago' },
    ];

    const iconMap = { warning: AlertTriangle, error: AlertTriangle, info: Info };
    const colorMap = { warning: 'text-amber-400', error: 'text-red-400', info: 'text-blue-400' };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <Bell size={18} className="text-slate-400" />
            </CardHeader>
            <div className="space-y-3">
                {demoAlerts.map((alert) => {
                    const Icon = iconMap[alert.type] || Info;
                    return (
                        <div key={alert.id} className="flex gap-3 py-3 border-b border-slate-700/50 last:border-b-0">
                            <Icon size={18} className={colorMap[alert.type] || 'text-slate-400'} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-white">{alert.title}</p>
                                    <span className="text-xs text-slate-500">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">{alert.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
