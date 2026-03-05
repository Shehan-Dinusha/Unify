import React, { useState } from "react";
import { X, MapPin, Star, Calendar, Phone, Home, Wifi, ChevronRight } from "lucide-react";

/**
 * BoardingOverlay Component
 * A full-screen modal overlay for displaying detailed information about a boarding post.
 */
const BoardingOverlay = ({ post, onClose }) => {
    const [activeImage, setActiveImage] = useState(0);

    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-1/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#12202E] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image Gallery */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-dark-3 flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                        <img
                            src={post.images[activeImage]}
                            alt={post.title}
                            className="w-full h-full object-cover transition-all duration-500"
                        />

                        {/* Image Pagination Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {post.images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails (at bottom of left side) */}
                    <div className="p-4 bg-black/20 backdrop-blur-md flex gap-3 overflow-x-auto scrollbar-hide">
                        {post.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary-blue scale-95 shadow-lg shadow-primary-blue/20" : "border-transparent opacity-60 hover:opacity-100"}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto scrollbar-hide flex flex-col gap-6">
                    {/* Header Info 
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="bg-primary-blue/20 text-primary-blue text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                AVAILABLE NOW
                            </span>
                            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-body-small-bold text-text-primary">{post.rating || '4.8'}</span>
                                <span className="text-body-extra-small text-text-tertiary">({post.reviews || '24'} reviews)</span>
                            </div>
                        </div>
                        <h2 className="text-heading-small md:text-heading-medium text-text-primary mb-2">
                            {post.title}
                        </h2>
                        <div className="flex items-start gap-2 text-text-tertiary">
                            <MapPin size={16} className="mt-1 flex-shrink-0 text-primary-blue" />
                            <p className="text-body-small italic">
                                {post.location}
                            </p>
                        </div>
                    </div>*/}

                    {/* Price Card */}
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col">
                        <span className="text-body-extra-small text-text-tertiary mb-1 uppercase tracking-widest font-semibold">Monthly Rent</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-heading-medium text-text-primary">{post.price.split('/')[0]}</span>
                            <span className="text-body-medium text-text-tertiary">/{post.price.split('/')[1] || 'mo'}</span>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <InfoItem
                            icon={<Calendar size={18} className="text-text-tertiary" />}
                            label="AVAILABILITY"
                            value={post.availability || "Immediate Move-in"}
                        />
                        <InfoItem
                            icon={<Phone size={18} className="text-text-tertiary" />}
                            label="CONTACT"
                            value={post.contact || "+1 (555) 012-3456"}
                        />
                        {/*<InfoItem
                            icon={<Home size={18} className="text-text-tertiary" />}
                            label="ROOM TYPE"
                            value={post.roomType || "Single Private"}
                        />*/}
                        <InfoItem
                            icon={<Wifi size={18} className="text-text-tertiary" />}
                            label="AMENITIES"
                            value={post.amenities || "WiFi, Desk, AC"}
                        />
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="text-body-large-bold text-text-primary mb-3">About this place</h3>
                        <p className="text-body-medium text-text-secondary leading-relaxed">
                            {post.description}
                        </p>
                    </div>

                    <div className="h-[1px] bg-white/5 w-full"></div>

                    {/* Host Section */}
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.host?.avatar || post.userSeed)}`}
                                    alt={post.host?.name || post.user}
                                    className="w-12 h-12 rounded-full border-2 border-primary-blue/30"
                                />
                                {post.host?.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-primary-blue rounded-full p-0.5 border-2 border-[#12202E]">
                                        <svg viewBox="0 0 24 24" className="w-2 h-2 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-body-medium-bold text-text-primary">{post.host?.name || post.user}</h4>
                                {/*<p className="text-body-extra-small text-text-tertiary">
                                    Joined {post.host?.joined || "September 2023"} • {post.host?.verified ? "Verified Owner" : "Owner"}
                                </p>*/}
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-text-tertiary group-hover:text-text-primary transform group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-body-small-bold text-text-primary">{value}</span>
    </div>
);

export default BoardingOverlay;
