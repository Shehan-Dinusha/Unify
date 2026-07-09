import React, { useState } from "react";
import { ImagePlus, MapPin, Wifi, DollarSign, Users, Phone, BedDouble, X, Plus, Edit3, Tag, Calendar, ArrowRight } from "lucide-react";
import Card from "../common/Card";
import BoardingPostCard from "./BoardingPostCard";

const CreateBoardingPostForm = ({ onCancel, onPublish }) => {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState(["Wi-Fi", "AC"]);
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [phone, setPhone] = useState("");
    const [slots, setSlots] = useState("");

    const handleAddAmenity = () => {
        if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
            setAmenities([...amenities, amenityInput.trim()]);
            setAmenityInput("");
        }
    };

    const handleRemoveAmenity = (item) => {
        setAmenities(amenities.filter((a) => a !== item));
    };

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8">
                
                {/* ── Left Column: Form Sections ── */}
                <div className="flex flex-col gap-6 pb-8 min-w-0">
                    
                    {/* Basic Information */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold">Basic Information</h3>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Photos */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Photos
                                </label>
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-primary-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                        <ImagePlus className="text-primary-blue w-6 h-6" />
                                    </div>
                                    <p className="text-white text-sm font-bold mb-1 text-center">
                                        Click to upload photos
                                    </p>
                                    <p className="text-text-secondary text-[11px] text-center uppercase tracking-wider">
                                        SVG, PNG, JPG or GIF (max. 10MB)
                                    </p>
                                </div>
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
                        </div>
                    </Card>

                    {/* Amenities */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                <Tag className="w-5 h-5" />
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
                                    Price (Monthly)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Capacity
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
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
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Available Slots
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                        <BedDouble className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
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
                        Feed Preview
                    </div>

                    <div className="pointer-events-none">
                        <BoardingPostCard 
                            post={{
                                id: "preview",
                                author: { name: "Your Name" },
                                userSeed: "Your Name",
                                time: "Just now",
                                location: location || "Your location will appear here",
                                description: description || "Your post description will appear here...",
                                gender: "Any",
                                price: price ? `$${price}/month` : "",
                                images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
                                stats: { likes: 0 },
                                comments: []
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 bg-[#1A2536] hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onPublish && onPublish({ description, location, amenities, price, capacity, phone, slots })}
                            className="flex-1 py-3 bg-primary-blue hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 group"
                        >
                            Submit Post
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateBoardingPostForm;
