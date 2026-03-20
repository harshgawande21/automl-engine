import { CheckCircle, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { formatFileSize } from '../../utils/formatters';
import { cn } from '../../utils/helpers';

export default function FileUpload({
    onFileSelect,
    accept = '.csv,.xlsx,.json',
    maxSizeMB = 50,
    label = 'Upload File',
    multiple = false,
}) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const validateAndSet = (file) => {
        setError(null);
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large. Max ${maxSizeMB}MB`);
            return;
        }
        setSelectedFile(file);
        onFileSelect?.(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) validateAndSet(e.dataTransfer.files[0]);
    }, []);

    const handleChange = (e) => {
        if (e.target.files?.[0]) validateAndSet(e.target.files[0]);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError(null);
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer',
                    dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
                )}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                    <div className="flex items-center gap-3">
                        <CheckCircle size={24} className="text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-slate-800">{selectedFile.name}</p>
                            <p className="text-xs text-slate-600">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearFile();
                            }} 
                            className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <X size={16} className="text-red-500" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={32} className="text-blue-400 mb-3" />
                        <p className="text-sm text-slate-700">Drag & drop your file here, or click to browse</p>
                        <p className="text-xs text-slate-500 mt-1">CSV, XLSX, JSON — up to {maxSizeMB}MB</p>
                    </>
                )}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
