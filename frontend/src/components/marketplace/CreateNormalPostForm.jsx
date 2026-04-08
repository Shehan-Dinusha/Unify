import React, { useState } from "react";
import { ImagePlus, Edit3 } from "lucide-react";
import Card from "../common/Card";

const CreateNormalPostForm = ({ onCancel, onPublish }) => {
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleFiles = (files) => {
        const newImages = Array.from(files)
            .filter(file => file.type.startsWith('image/'))
            .map(file => ({
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                file
            }));
        if (newImages.length > 0) {
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

                {/* ── Left Column: Form ── */}
                <div className="flex flex-col gap-6 pb-8">
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Create Normal Post</h3>
                                <p className="text-text-secondary text-xs mt-0.5">
                                    Share your precious moments as a club
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Photos Upload */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Photos
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={(e) => handleFiles(e.target.files)} 
                                    />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                                        className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                            <ImagePlus className="text-blue-500 w-5 h-5" />
                                        </div>
                                        <p className="text-white text-[11px] font-medium mb-1 text-center">
                                            Drag & drop or click
                                        </p>
                                    </div>
                                    {images.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                                            <img src={img.url} alt="Post" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => removeImage(img.id)} className="text-red-400 font-bold text-[10px] bg-red-400/20 px-2.5 py-1.5 rounded-lg border border-red-400/30">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's happening today? Share updates, thoughts, or moments with your club..."
                                    rows={6}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue transition-colors resize-none placeholder:text-text-secondary"
                                />
                                <div className="text-right text-[10px] text-text-secondary italic mt-1">
                                    Share updates, photos, or news with everyone.
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ── Right Column: Preview Sidebar ── */}
                <div className="flex flex-col gap-6 xl:sticky xl:top-4 h-fit pb-24 xl:pb-0">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                        Post Preview
                    </div>

                    <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
                        {/* Image preview */}
                        {images.length > 0 ? (
                            <div className="h-48 relative">
                                <img src={images[0].url} alt="Preview" className="w-full h-full object-cover" />
                                {images.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
                                        +{images.length - 1} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-48 bg-white/5 flex items-center justify-center">
                                <ImagePlus className="w-8 h-8 text-white/10" />
                            </div>
                        )}

                        {/* Club header stub */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                                <div>
                                    <div className="text-sm font-semibold">Your Club Name</div>
                                    <div className="text-xs text-text-secondary">Just now · General</div>
                                </div>
                            </div>

                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">
                                {description || (
                                    <span className="italic opacity-50">Your post description will appear here...</span>
                                )}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-text-secondary text-xs">
                                <span>0 Likes</span>
                                <span>0 Comments</span>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0B1724]/95 backdrop-blur-md border-t border-white/10 xl:static xl:z-auto xl:p-0 xl:bg-transparent xl:backdrop-blur-none xl:border-t-0 flex gap-4 mt-4 xl:mt-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onPublish && onPublish({ description })}
                            className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)]"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNormalPostForm;
