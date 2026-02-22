import React, { useState } from 'react';
import { X, FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import Button from './Button';

const DocumentPreviewModal = ({ isOpen, onClose, document }) => {
    const [zoomLevel, setZoomLevel] = useState(100);

    if (!isOpen || !document) return null;

    const getDownloadUrl = (doc) => {
        if (doc.file) return URL.createObjectURL(doc.file);
        return doc.url;
    };

    const getPreviewUrl = (doc) => {
        if (doc.file) return URL.createObjectURL(doc.file);
        // Use Google Docs Viewer for remote PDFs to avoid X-Frame-Options "refused to connect" errors
        if (doc.url && (doc.type === 'pdf' || doc.name?.toLowerCase().endsWith('.pdf'))) {
            return `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
        }
        return doc.url;
    };

    const downloadUrl = getDownloadUrl(document);
    const previewUrl = getPreviewUrl(document);
    
    const isPdf = document.type === 'pdf' || document.name?.toLowerCase().endsWith('.pdf');
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(document.type) || /\.(jpg|jpeg|png|gif)$/i.test(document.name);

    const handleDownload = () => {
        const link = window.document.createElement('a');
        link.href = downloadUrl;
        link.download = document.name;
        link.target = "_blank"; // Open in new tab if download fails or for PDF
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-6xl h-[90vh] bg-gray-900 rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-white/10 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/20">
                            <FileText className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">{document.name}</h3>
                            <p className="text-text-secondary text-sm">{document.size} • {document.date}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Zoom Controls (Images Only) */}
                        {isImage && (
                            <div className="flex items-center bg-gray-900 rounded-lg border border-white/10 p-1 mr-2">
                                <button 
                                    onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                                    className="p-1.5 hover:bg-white/10 rounded-md text-text-secondary hover:text-white hover:bg-white/5"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-center min-w-[3rem] text-text-secondary font-medium">{zoomLevel}%</span>
                                <button 
                                    onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
                                    className="p-1.5 hover:bg-white/10 rounded-md text-text-secondary hover:text-white hover:bg-white/5"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={handleDownload}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors group text-text-secondary hover:text-white"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-1"></div>

                        <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full transition-colors group">
                            <X className="w-5 h-5 text-text-secondary group-hover:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-gray-950 overflow-hidden flex justify-center items-center relative gap-4">
                    {previewUrl ? (
                        isPdf ? (
                            <iframe 
                                src={previewUrl} 
                                className="w-full h-full border-none"
                                title="Document Preview"
                            />
                        ) : isImage ? (
                            <div className="overflow-auto w-full h-full flex items-start justify-center p-8 bg-gray-950/50">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="max-w-none transition-all duration-200 shadow-2xl object-contain min-h-[50%]"
                                    style={{ 
                                        width: `${zoomLevel}%`,
                                        height: 'auto'
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-text-secondary">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Preview not available for this file type.</p>
                                <Button variant="secondary" className="mt-4" onClick={handleDownload}>
                                    Download to View
                                </Button>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                             <p>No document source found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default DocumentPreviewModal;
