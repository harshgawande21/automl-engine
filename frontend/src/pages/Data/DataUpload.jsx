import { CheckCircle, Database, FileText, Upload, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { setActiveDataset } from '../../store/dataSlice';
import api from '../../config/axiosConfig';

export default function DataUpload() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) {
            setError('Please upload a CSV or Excel file.');
            return;
        }
        setError(null);
        setSelectedFile(file);
        setUploaded(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await api.post('/data/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = res.data?.data || res.data;
            dispatch(setActiveDataset(data));
            setUploaded(data);
        } catch (e) {
            setError(e.response?.data?.detail || e.response?.data?.message || 'Upload failed. Please try again.');
        }
        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="bg-white border-b border-blue-200 px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800">Upload Your Data</h1>
                <p className="text-slate-500 text-sm mt-1">Upload a CSV or Excel file — we'll handle everything else</p>
            </div>

            <div className="p-6 max-w-2xl mx-auto">
                {!uploaded ? (
                    <>
                        {/* Drop Zone */}
                        <div
                            onDragEnter={() => setDragActive(true)}
                            onDragLeave={() => setDragActive(false)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer mb-6 ${
                                dragActive ? 'border-blue-400 bg-blue-50' :
                                selectedFile ? 'border-green-400 bg-green-50' :
                                'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                            }`}
                        >
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={e => handleFile(e.target.files?.[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {selectedFile ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <FileText className="text-green-600" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{selectedFile.name}</p>
                                        <p className="text-slate-500 text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                                    </div>
                                    <p className="text-green-600 text-sm font-medium">✅ File ready to upload</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Upload className="text-blue-500" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">Drop your file here</p>
                                        <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                                        <p className="text-slate-400 text-xs mt-2">Supports CSV, Excel (.xlsx, .xls)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            loading={uploading}
                            icon={Upload}
                            className="w-full py-4 text-base"
                            size="lg"
                        >
                            {uploading ? 'Uploading...' : 'Upload Dataset'}
                        </Button>

                        {/* Tips */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                ['📋', 'CSV Format', 'First row must be column headers'],
                                ['🎯', 'Target Column', 'Include a column you want to predict'],
                                ['📊', 'Any Size', 'Works with small and large datasets'],
                            ].map(([emoji, title, desc]) => (
                                <div key={title} className="p-3 bg-white rounded-xl border border-blue-100 text-center">
                                    <span className="text-2xl">{emoji}</span>
                                    <p className="font-semibold text-slate-800 text-sm mt-1">{title}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <Card>
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-500" size={36} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Successful! 🎉</h2>
                            <p className="text-slate-500 mb-6">Your dataset is ready for training</p>

                            {/* Dataset Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    ['📁', 'File', uploaded.filename],
                                    ['📊', 'Rows', uploaded.shape?.[0]?.toLocaleString() || '?'],
                                    ['📋', 'Columns', uploaded.shape?.[1] || uploaded.columns?.length || '?'],
                                ].map(([emoji, label, value]) => (
                                    <div key={label} className="bg-blue-50 rounded-xl p-4">
                                        <span className="text-2xl">{emoji}</span>
                                        <p className="text-xs text-slate-500 mt-1">{label}</p>
                                        <p className="font-bold text-slate-800 text-sm truncate">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Columns preview */}
                            {uploaded.columns && (
                                <div className="mb-6 text-left">
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Columns detected:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {uploaded.columns.slice(0, 12).map(col => (
                                            <span key={col} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                                {col}
                                            </span>
                                        ))}
                                        {uploaded.columns.length > 12 && (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                                                +{uploaded.columns.length - 12} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={() => navigate('/model/training')}
                                    icon={Zap}
                                    className="w-full"
                                >
                                    Train AI Model
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedFile(null); setUploaded(null); }}
                                    icon={Upload}
                                    className="w-full"
                                >
                                    Upload Another
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
