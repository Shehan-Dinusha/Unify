import React, { useState } from "react";
import { 
    ImagePlus, MapPin, Wifi, DollarSign, Users, Phone, BedDouble, 
    X, Plus, Edit3, Tag as TagIcon, Calendar, ArrowRight, Loader2 
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { useNavigate } from "react-router-dom";
import postService from "../services/postService";

const CreateBoardingPostPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "boarding_owner",
        displayRole: "Business & Organization"
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [roomType, setRoomType] = useState("");
    const [gender, setGender] = useState("Any");
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [phone, setPhone] = useState("");
    const [slots, setSlots] = useState("");

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

    const handleAddAmenity = () => {
        if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
            setAmenities([...amenities, amenityInput.trim()]);
            setAmenityInput("");
        }
    };

    const handleRemoveAmenity = (item) => {
        setAmenities(amenities.filter((a) => a !== item));
    };

    const handleCancel = () => navigate("/boarding-owner/marketplace");
    
    const handlePublish = async () => {
        if (!title || !description || !location || !price || !capacity || !phone || !slots || !roomType) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append("title", title);
            data.append("description", description);
            data.append("location", location);
            data.append("roomType", roomType);
            data.append("gender", gender);
            data.append("price", price);
            data.append("capacity", capacity);
            data.append("slots", slots);
            data.append("phone", phone);
            data.append("amenities", JSON.stringify(amenities));
            
            images.forEach(img => {
                if (img.file) {
                    data.append("images", img.file);
                }
            });

            // Mock userId for now
            data.append("userId", 1);

            await postService.createPost("boarding", data);
            navigate("/boarding-owner/marketplace");
        } catch (error) {
            console.error("Failed to publish boarding post:", error);
            alert(error.error || "Failed to publish boarding post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Boarding Post"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto py-8">
                <div className="flex flex-col w-full h-full text-white font-inter">
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                        {/* ── Left Column: Form Sections ── */}
                        <div className="flex flex-col gap-6 pb-8 min-w-0">
                            {/* Basic Information */}
                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                        <Edit3 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Basic Information</h3>
                                        <p className="text-text-secondary text-xs mt-0.5">Enter the core details of your boarding place</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {/* Photos */}
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

                                    {/* Title */}
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Title / Boarding Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Modern Student Boarding near Campus"
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe the boarding place, amenities, rules, and environment..."
                                            rows={4}
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors resize-none placeholder:text-text-secondary"
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Full address or nearby landmark"
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                    </div>

                                    {/* Room Type & Gender */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                                Room Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={roomType}
                                                onChange={(e) => setRoomType(e.target.value)}
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors appearance-none"
                                            >
                                                <option value="" disabled>Select Room Type</option>
                                                <option value="Single Private">Single Private</option>
                                                <option value="Shared Double">Shared Double</option>
                                                <option value="Shared Triple">Shared Triple</option>
                                                <option value="Dormitory">Dormitory</option>
                                                <option value="Entire Apartment">Entire Apartment</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                                Gender Preference
                                            </label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors appearance-none"
                                            >
                                                <option value="Any">Any</option>
                                                <option value="Male Only">Male Only</option>
                                                <option value="Female Only">Female Only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Amenities */}
                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                        <TagIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold">Amenities</h3>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Other Amenities
                                        </label>
                                        <div className="relative mb-3">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <Wifi className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={amenityInput}
                                                onChange={(e) => setAmenityInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddAmenity()}
                                                placeholder="e.g. Free Wi-Fi, Air Conditioning, Washing Machine, Parking..."
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {amenities.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-text-secondary">
                                                    {item}
                                                    <button onClick={() => handleRemoveAmenity(item)} className="hover:text-white transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={handleAddAmenity}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-primary-blue/20 text-primary-blue rounded-full text-xs hover:bg-primary-blue/20 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Add tag
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Pricing & Availability */}
                            <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-500/20 text-green-500 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold">Pricing & Availability</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Price (Monthly) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <span className="text-sm font-bold">Rs.</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Total Capacity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="number"
                                                value={capacity}
                                                onChange={(e) => setCapacity(e.target.value)}
                                                placeholder="Total people"
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="07X XXX XXXX"
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                            Available Slots <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                                <BedDouble className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="number"
                                                value={slots}
                                                onChange={(e) => setSlots(e.target.value)}
                                                placeholder="e.g. 1"
                                                className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ── Right Column: Preview Sidebar ── */}
                        <div className="flex flex-col gap-6 sticky top-4 h-fit min-w-0">
                            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                                Post Preview
                            </div>

                            <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
                                {/* Preview Image */}
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
                                    {price && (
                                        <div className="absolute bottom-4 left-4 bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 z-10">
                                            <span className="text-[13px] font-bold text-white">Rs.{price}/month</span>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt="User"
                                                className="w-9 h-9 rounded-full border border-white/20"
                                            />
                                            <div>
                                                <p className="text-[13px] font-bold text-white">{user.displayRole}</p>
                                                <p className="text-[11px] text-text-tertiary">Just now</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-heading-small md:text-[18px] font-bold text-white mb-2 leading-tight">
                                        {title || "Boarding Title Will Appear Here"}
                                    </h2>

                                    <div className="flex items-center gap-1 mb-3">
                                        <MapPin size={13} className="text-text-tertiary flex-shrink-0" />
                                        <span className="text-[13px] text-text-tertiary line-clamp-1">
                                            {location || "Your location will appear here"}
                                        </span>
                                    </div>

                                    <p className="text-[14px] text-text-secondary leading-6 mb-4 line-clamp-2 min-h-[48px]">
                                        {description || "Your post description will appear here..."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        {amenities.length > 0 ? amenities.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
                                                {item}
                                            </span>
                                        )) : (
                                            <span className="text-[11px] text-text-tertiary italic">No amenities specified</span>
                                        )}
                                        {amenities.length > 3 && (
                                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
                                                +{amenities.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Action Buttons */}
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
                                    {loading ? "Publishing..." : "Publish Boarding"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CreateBoardingPostPage;
