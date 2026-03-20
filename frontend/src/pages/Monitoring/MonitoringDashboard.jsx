import SystemHealth from '../../components/dashboard/SystemHealth';
import PageContainer from '../../components/layout/PageContainer';
import ErrorRates from '../../components/monitoring/ErrorRates';
import LatencyChart from '../../components/monitoring/LatencyChart';
import ModelDrift from '../../components/monitoring/ModelDrift';
import UsageAnalytics from '../../components/monitoring/UsageAnalytics';

export default function MonitoringDashboard() {
    return (
        <PageContainer title="Monitoring" subtitle="Real-time health and performance tracking">
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SystemHealth />
                    <ModelDrift />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LatencyChart />
                    <ErrorRates />
                </div>
                <UsageAnalytics />
            </div>
        </PageContainer>
    );
}
