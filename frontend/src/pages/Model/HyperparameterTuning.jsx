import { Play, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import PageContainer from '../../components/layout/PageContainer';
import MetricsTable from '../../components/tables/MetricsTable';

const paramDefs = [
    { key: 'n_estimators', label: 'N Estimators', type: 'number', default: '100' },
    { key: 'max_depth', label: 'Max Depth', type: 'number', default: '6' },
    { key: 'learning_rate', label: 'Learning Rate', type: 'number', default: '0.1' },
    { key: 'min_samples_split', label: 'Min Samples Split', type: 'number', default: '2' },
];

export default function HyperparameterTuning() {
    const [params, setParams] = useState({ n_estimators: '100', max_depth: '6', learning_rate: '0.1', min_samples_split: '2' });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTune = () => {
        setLoading(true);
        setTimeout(() => {
            setResults([
                { name: 'Best Accuracy', value: 0.9567, change: 0.012, description: 'Cross-validated' },
                { name: 'Best F1 Score', value: 0.9423, change: 0.008, description: 'Weighted average' },
                { name: 'Best Precision', value: 0.9512, change: 0.015, description: 'Macro average' },
                { name: 'Training Time', value: 12.45, change: null, description: 'Seconds' },
            ]);
            setLoading(false);
        }, 2000);
    };

    return (
        <PageContainer title="Hyperparameter Tuning" subtitle="Optimize your model's performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Parameters</CardTitle>
                        <SlidersHorizontal size={18} className="text-slate-400" />
                    </CardHeader>
                    <div className="grid grid-cols-2 gap-4">
                        {paramDefs.map((p) => (
                            <InputField
                                key={p.key}
                                label={p.label}
                                name={p.key}
                                type={p.type}
                                value={params[p.key]}
                                onChange={(e) => setParams({ ...params, [p.key]: e.target.value })}
                            />
                        ))}
                    </div>
                    <div className="mt-4">
                        <SelectField
                            label="Search Strategy"
                            name="strategy"
                            value="grid"
                            onChange={() => { }}
                            options={[
                                { value: 'grid', label: 'Grid Search' },
                                { value: 'random', label: 'Random Search' },
                                { value: 'bayesian', label: 'Bayesian Optimization' },
                            ]}
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleTune} loading={loading} icon={Play}>Run Tuning</Button>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    {results ? (
                        <MetricsTable metrics={results} />
                    ) : (
                        <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
                            Run tuning to see results
                        </div>
                    )}
                </Card>
            </div>
        </PageContainer>
    );
}
