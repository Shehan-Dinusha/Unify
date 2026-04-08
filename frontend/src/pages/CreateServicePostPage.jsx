import React, { useState } from "react";
import { 
    ImagePlus, MapPin, Tag as TagIcon, Clock, Phone,
    X, Plus, Edit3, ArrowRight, Wrench
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { useNavigate } from "react-router-dom";

const CreateServicePostPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "services_owner",
        displayRole: "Business & Organization"
    };

    const [description, setDescription] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState(["Rental", "Delivery"]);
    const [hours, setHours] = useState("");
    const [phone, setPhone] = useState("");

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

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (item) => {
        setTags(tags.filter((a) => a !== item));
    };

    const handleCancel = () => navigate("/services-owner/marketplace");
    const handlePublish = () => {
        console.log("Submitting service post:", { description, tags, hours, phone });
        navigate("/services-owner/marketplace");
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Post"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto py-8">
                <div className="flex flex-col w-full h-full text-white font-inter">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8">
                        {/* Left Column */}
                        <div className="flex flex-col gap-6 pb-8 min-w-0">
                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                        <Edit3 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold">Basic Information</h3>
                                </div>

                                <div className="flex flex-col gap-6">
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
                                                className={`aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary-blue/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                                    <ImagePlus className="text-primary-blue w-5 h-5" />
                                                </div>
                                                <p className="text-white text-[11px] font-medium mb-1 text-center">
                                                    Drag & drop or click
                                                </p>
                                                <p className="text-text-secondary text-[9px] text-center uppercase tracking-wider">
                                                    Max. 10MB
                                                </p>
                                            </div>
                                            {images.map((img) => (
                                                <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
                                                    <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button onClick={() => removeImage(img.id)} className="text-red-400 font-bold text-[10px] bg-red-400/20 px-2.5 py-1.5 rounded-lg border border-red-400/30 hover:bg-red-400/30 transition-colors">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your services in detail..."
                                            rows={4}
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors resize-none placeholder:text-text-secondary"
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                                        <TagIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold">Details & Tags</h3>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                                Working Hours
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={hours}
                                                    onChange={(e) => setHours(e.target.value)}
                                                    placeholder="e.g. 9 AM - 6 PM"
                                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Tags & Capabilities
                                        </label>
                                        <div className="relative mb-3">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <Wrench className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                placeholder="e.g. Repairs, Delivery, Consultation..."
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {tags.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-text-secondary">
                                                    {item}
                                                    <button onClick={() => handleRemoveTag(item)} className="hover:text-white transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={handleAddTag}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-primary-blue/20 text-primary-blue rounded-full text-xs hover:bg-primary-blue/20 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Add tag
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Preview Sidebar */}
                        <div className="flex flex-col gap-6 sticky top-4 h-fit min-w-0">
                            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                                Post Preview
                            </div>

                            <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
                                <div className="aspect-[4/3] bg-white/5 relative group bg-dark-1/50 flex items-center justify-center">
                                    {images.length > 0 ? (
                                        <>
                                            <img
                                                src={images[0].url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {images.length > 1 && (
                                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 shadow-lg">
                                                    +{images.length - 1} more
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-white/20">
                                            <ImagePlus className="w-10 h-10 mb-2" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">No photos added</span>
                                        </div>
                                    )}
                                    {hours && (
                                        <div className="absolute bottom-4 left-4 bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 z-10">
                                            <span className="text-[13px] font-bold text-white">{hours}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bike Rental"
                                                alt="User"
                                                className="w-9 h-9 rounded-full border border-white/20"
                                            />
                                            <div>
                                                <p className="text-[13px] font-bold text-white">Bike Rental</p>
                                                <p className="text-[11px] text-text-tertiary">Just now</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-text-secondary leading-6 mb-4 line-clamp-2 min-h-[48px]">
                                        {description || "Your post description will appear here..."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        {tags.length > 0 ? tags.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
                                                {item}
                                            </span>
                                        )) : (
                                            <span className="text-[11px] text-text-tertiary italic">No tags specified</span>
                                        )}
                                        {tags.length > 3 && (
                                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
                                                +{tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            <div className="flex gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 py-3 bg-[#1A2536] hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    className="flex-1 py-3 bg-primary-blue hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 group"
                                >
                                    Submit Post
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CreateServicePostPage;
