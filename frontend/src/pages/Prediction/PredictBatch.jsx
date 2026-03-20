import { Download, Layers, Play } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import FileUpload from '../../components/forms/FileUpload';
import PageContainer from '../../components/layout/PageContainer';
import DataTable from '../../components/tables/DataTable';
import { predictBatch } from '../../store/predictionSlice';

export default function PredictBatch() {
    const dispatch = useDispatch();
    const { batchResults, loading } = useSelector((state) => state.prediction);
    const [file, setFile] = useState(null);

    const handlePredict = () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        dispatch(predictBatch(formData));
    };

    const demoResults = batchResults || null;

    return (
        <PageContainer title="Batch Prediction" subtitle="Upload a file for bulk predictions">
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Batch File</CardTitle>
                                <Layers size={18} className="text-indigo-400" />
                            </CardHeader>
                            <FileUpload onFileSelect={setFile} />
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-xs text-slate-500">Upload a CSV with the same features used in training</p>
                                <Button onClick={handlePredict} loading={loading} disabled={!file} icon={Play}>Run Batch</Button>
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Batch Info</CardTitle></CardHeader>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-700/50">
                                <span className="text-slate-400">Status</span>
                                <Badge variant={batchResults ? 'success' : 'default'} dot>{batchResults ? 'Complete' : 'Waiting'}</Badge>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700/50">
                                <span className="text-slate-400">Records</span>
                                <span className="text-white">{batchResults?.count || '—'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-400">Model</span>
                                <span className="text-white">Random Forest</span>
                            </div>
                        </div>
                        {batchResults && (
                            <Button variant="outline" className="w-full mt-4" icon={Download}>Download Results</Button>
                        )}
                    </Card>
                </div>

                {batchResults && (
                    <Card>
                        <CardHeader><CardTitle>Results Preview</CardTitle></CardHeader>
                        <DataTable
                            columns={[
                                { key: 'id', label: 'Row' },
                                { key: 'prediction', label: 'Prediction', render: (v) => <Badge variant="primary">{v}</Badge> },
                                { key: 'confidence', label: 'Confidence', render: (v) => `${(v * 100).toFixed(1)}%` },
                            ]}
                            data={batchResults.predictions || []}
                        />
                    </Card>
                )}
            </div>
        </PageContainer>
    );
}
