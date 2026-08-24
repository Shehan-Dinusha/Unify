import React, { useState } from "react";
import { X, MapPin, Star, Calendar, Phone, Home, Wifi, ChevronRight } from "lucide-react";
import { CheckSmallIcon } from "../common/Icons";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getAvatarUrl } from "../../utils/formatters";

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
                    {/* Header Info */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${post.slots > 0 ? 'bg-primary-blue/20 text-primary-blue' : 'bg-red-500/20 text-red-500'}`}>
                                {post.slots > 0 ? 'AVAILABLE NOW' : 'FULL'}
                            </span>
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

                        {/* Mini Google Map — only when coordinates are stored */}
                        {post.latitude && post.longitude && (
                            <div className="mt-4">
                                <MiniMap lat={parseFloat(post.latitude)} lng={parseFloat(post.longitude)} />
                            </div>
                        )}
                    </div>

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
                            label="AVAILABLE SLOTS"
                            value={post.slots > 0 ? `${post.slots} Slots Available` : "No Slots Left"}
                        />
                        <InfoItem
                            icon={<Phone size={18} className="text-text-tertiary" />}
                            label="CONTACT"
                            value={post.phone || "Not provided"}
                        />
                        <InfoItem
                            icon={<Home size={18} className="text-text-tertiary" />}
                            label="ROOM TYPE"
                            value={post.roomType || "Not specified"}
                        />
                        <InfoItem
                            icon={<Wifi size={18} className="text-text-tertiary" />}
                            label="AMENITIES"
                            value={(post.amenities && post.amenities.length) ? post.amenities.join(', ') : "None"}
                        />
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="text-body-large-bold text-text-primary mb-3">About this place</h3>
                        <p className="text-body-medium text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {post.description}
                        </p>
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

// ── MiniMap ────────────────────────────────────────────────────────────────────
const MINI_MAP_CONTAINER = { width: "100%", height: "180px", borderRadius: "12px" };
const MINI_MAP_OPTIONS = {
    disableDefaultUI: true,
    gestureHandling: "none",
    zoomControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3a5f" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2b5ea7" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c2340" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    ],
};

const MiniMap = ({ lat, lng }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey || "",
        libraries: [],
    });

    if (!apiKey || !isLoaded) return null;

    const center = { lat, lng };
    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/10 shadow-md">
            <GoogleMap
                mapContainerStyle={MINI_MAP_CONTAINER}
                center={center}
                zoom={15}
                options={MINI_MAP_OPTIONS}
            >
                <Marker position={center} />
            </GoogleMap>
            <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 transition-colors text-[11px] font-semibold text-primary-blue"
            >
                <MapPin size={11} />
                Open in Google Maps
            </a>
        </div>
    );
};

export default BoardingOverlay;
