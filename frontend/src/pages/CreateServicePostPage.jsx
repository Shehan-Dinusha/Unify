import React, { useState } from "react";
import { 
    ImagePlus, MapPin,
    ArrowRight, Loader2, Edit3
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import FoodCafeCard from "../components/marketplace/FoodCafeCard";
import { useNavigate } from "react-router-dom";
import postService from "../services/postService";

const CreateServicePostPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "services_owner",
        displayRole: "Business & Organization"
    };

    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
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

    const handleCancel = () => navigate("/services-owner/marketplace");
    
    const handlePublish = async () => {
        if (!description) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append("description", description);
            
            images.forEach(img => {
                if (img.file) {
                    data.append("images", img.file);
                }
            });

            // Mock userId and set postType for category inference
            data.append("userId", 1);
            data.append("postType", "service");

            await postService.createPost("service", data);
            navigate("/services-owner/marketplace");
        } catch (error) {
            console.error("Failed to publish service post:", error);
            alert(error.error || "Failed to publish post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Post"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto py-8">
                <div className="flex flex-col w-full h-full text-white font-inter">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                        {/* Left Column */}
                        <div className="flex flex-col gap-6 pb-8 min-w-0">
                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                        <Edit3 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Basic Information</h3>
                                        <p className="text-text-secondary text-xs mt-0.5">Enter the core details of your service</p>
                                    </div>
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

                            {/* Removed Details & Tags Card */}
                        </div>

                        {/* Right Column: Preview Sidebar */}
                        <div className="flex flex-col gap-6 sticky top-4 h-fit min-w-0">
                            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                                Feed Preview
                            </div>

                            <div className="pointer-events-none">
                                <FoodCafeCard 
                                    post={{
                                        id: "preview",
                                        author: { name: user.name },
                                        userSeed: user.name,
                                        time: "Just now",
                                        description: description || "Your post description will appear here...",
                                        images: images.length > 0 ? images.map(img => img.url) : null,
                                        stats: { likes: 0 },
                                        comments: []
                                    }}
                                />
                            </div>

                            <div className="flex gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#1A2536] hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {loading ? "Publishing..." : "Publish Service"}
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
