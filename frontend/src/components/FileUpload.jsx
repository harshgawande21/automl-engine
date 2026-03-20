import axios from 'axios';
import { Upload } from 'lucide-react';
import { useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('http://localhost:8000/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(response.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please check the file format and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${
        dragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        id="file-upload" 
        onChange={handleChange} 
        accept=".csv,.xlsx,.xls" 
      />
      <div className="flex flex-col items-center justify-center pointer-events-none">
        {uploading ? (
          <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        ) : (
          <Upload size={40} className="text-blue-400 mb-3" />
        )}
        <p className="text-sm font-medium text-slate-700 text-center">
          {uploading ? "Uploading..." : "Drag & drop your dataset here or click to browse"}
        </p>
        <p className="text-xs text-slate-500 mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</p>
      </div>
    </div>
  );
};

export default FileUpload;
