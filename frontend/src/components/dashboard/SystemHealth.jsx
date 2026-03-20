import { AlertTriangle, CheckCircle, Server, XCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../common/Card';

function HealthIndicator({ label, status, usage }) {
    const statusMap = {
        healthy: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        critical: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    };
    const s = statusMap[status] || statusMap.healthy;
    const Icon = s.icon;

    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-b-0">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon size={16} className={s.color} />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {usage !== undefined && (
                    <div className="w-24 h-2 rounded-full bg-slate-700">
                        <div
                            className={`h-full rounded-full ${usage > 90 ? 'bg-red-500' : usage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(usage, 100)}%` }}
                        />
                    </div>
                )}
                <span className="text-xs text-slate-400 w-12 text-right">{usage}%</span>
            </div>
        </div>
    );
}

export default function SystemHealth({ health }) {
    const data = health || {
        api: { status: 'healthy', usage: 32 },
        cpu: { status: 'healthy', usage: 45 },
        memory: { status: 'warning', usage: 78 },
        storage: { status: 'healthy', usage: 55 },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Health</CardTitle>
                <Server size={18} className="text-slate-400" />
            </CardHeader>
            <div>
                <HealthIndicator label="API Server" status={data.api?.status} usage={data.api?.usage} />
                <HealthIndicator label="CPU" status={data.cpu?.status} usage={data.cpu?.usage} />
                <HealthIndicator label="Memory" status={data.memory?.status} usage={data.memory?.usage} />
                <HealthIndicator label="Storage" status={data.storage?.status} usage={data.storage?.usage} />
            </div>
        </Card>
    );
}
