import { CheckCircle, Play, Settings } from 'lucide-react';
import { useState } from 'react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import SelectField from '../../components/forms/SelectField';
import PageContainer from '../../components/layout/PageContainer';

const processingSteps = [
    { id: 'missing', label: 'Handle Missing Values', options: ['drop', 'mean', 'median', 'mode'] },
    { id: 'encoding', label: 'Encode Categoricals', options: ['label', 'onehot', 'target'] },
    { id: 'scaling', label: 'Feature Scaling', options: ['none', 'standard', 'minmax', 'robust'] },
    { id: 'outliers', label: 'Outlier Handling', options: ['none', 'iqr', 'zscore', 'clip'] },
];

export default function DataProcessing() {
    const [config, setConfig] = useState({ missing: 'mean', encoding: 'onehot', scaling: 'standard', outliers: 'iqr' });
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);

    const handleProcess = () => {
        setProcessing(true);
        setTimeout(() => { setProcessing(false); setDone(true); }, 2000);
    };

    return (
        <PageContainer title="Data Processing" subtitle="Configure preprocessing pipeline">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {processingSteps.map((step) => (
                        <Card key={step.id} hover>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Settings size={18} className="text-indigo-400" />
                                    <span className="font-medium text-white">{step.label}</span>
                                </div>
                                <SelectField
                                    name={step.id}
                                    value={config[step.id]}
                                    onChange={(e) => setConfig({ ...config, [step.id]: e.target.value })}
                                    options={step.options.map((o) => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
                                    className="w-40"
                                />
                            </div>
                        </Card>
                    ))}
                    <div className="flex justify-end">
                        <Button onClick={handleProcess} loading={processing} icon={Play}>
                            Run Pipeline
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline Status</CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                        {processingSteps.map((step) => (
                            <div key={step.id} className="flex items-center justify-between py-2">
                                <span className="text-sm text-slate-300">{step.label}</span>
                                <Badge variant={done ? 'success' : 'default'} dot>
                                    {done ? 'Complete' : 'Pending'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                    {done && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" />
                            <span className="text-sm text-emerald-400">Pipeline executed successfully</span>
                        </div>
                    )}
                </Card>
            </div>
        </PageContainer>
    );
}
