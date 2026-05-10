import React, { useState } from "react";
import {
    ImagePlus, MapPin, Calendar, Clock, ChevronRight,
    LayoutGrid, Edit3, Info, Loader2
} from "lucide-react";
import Card from "../common/Card";
import ClubPostCard from "../club/ClubPostCard";


/* ─── Toggle ─────────────────────────────────────────────────── */
const Toggle = ({ value, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${value ? "bg-primary-blue" : "bg-white/10"}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`} />
    </button>
);

/* ─── Ticketing Detail Block ─────────────────────────────────── */
const TicketingBlock = ({ label, enabled, onToggle, price, onPriceChange, isFree, onFreeToggle }) => (
    <div className="bg-[#0F172A]/60 border border-white/8 rounded-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <LayoutGrid className="text-blue-500 w-3.5 h-3.5" />
                </div>
                <span className="text-white text-sm font-medium">{label}</span>
            </div>
            <Toggle value={enabled} onChange={onToggle} />
        </div>

        {/* Fields — always visible, dimmed when off */}
        <div className={`space-y-4 transition-opacity ${enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                    Ticket Price
                </label>
                <div className="flex items-center bg-[#0D1A26] border border-white/10 rounded-xl px-4 py-3 gap-2">
                    <span className="text-text-secondary text-sm">$</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        disabled={isFree}
                        onChange={onPriceChange}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none disabled:text-text-secondary placeholder:text-text-secondary"
                    />
                </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
                <div
                    onClick={onFreeToggle}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${isFree ? "border-primary-blue" : "border-white/20"}`}
                >
                    {isFree && <div className="w-2 h-2 bg-primary-blue rounded-full" />}
                </div>
                <span className="text-text-secondary text-xs group-hover:text-white transition-colors select-none">
                    This is a free event (hides price field)
                </span>
            </label>
        </div>
    </div>
);

/* ─── Create Event Form ───────────────────────────────────────── */
const CreateEventForm = ({ onCancel, onPublish }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
    });

    const [loading, setLoading] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleFile = (files) => {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverImage({
                url: URL.createObjectURL(file),
                file
            });
        }
    };

    const [tiers, setTiers] = useState([
        { id: 1, label: "Early Bird", enabled: false, price: "", isFree: false },
        { id: 2, label: "Standard", enabled: false, price: "", isFree: false },
        { id: 3, label: "VIP", enabled: false, price: "", isFree: false },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const updateTier = (id, patch) =>
        setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    const handlePublishClick = async () => {
        if (!formData.name || !formData.description || !formData.date || !formData.location) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const eventPayload = {
                ...formData,
                tickets: tiers.filter(t => t.enabled).map(t => ({
                    name: t.label,
                    price: t.isFree ? 0 : parseFloat(t.price) || 0,
                    isFree: t.isFree
                }))
            };

            await onPublish(eventPayload, coverImage);
        } catch (error) {
            alert(error.error || "Failed to publish event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

                {/* ── Left Column ──────────────────────────────── */}
                <div className="flex flex-col gap-6 pb-8">

                    {/* Event Details */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Create Event Post</h3>
                                <p className="text-text-secondary text-xs mt-0.5">Share your upcoming event with the community</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Cover Image */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Event Cover Image
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files); }}
                                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group ${isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFile(e.target.files)}
                                    />
                                    {coverImage ? (
                                        <div className="w-full relative rounded-lg overflow-hidden group">
                                            <img src={coverImage.url} alt="Cover" className="max-h-32 mx-auto object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} className="text-red-400 font-bold text-xs bg-red-400/20 px-3 py-1.5 rounded-lg border border-red-400/30">Replace Image</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                                <ImagePlus className="text-blue-500 w-5 h-5" />
                                            </div>
                                            <p className="text-white text-sm font-medium mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-text-secondary text-[11px]">
                                                SVG, PNG, JPG or GIF (max. 800×400px)
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Event Name */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Event Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Annual Varsity Match"
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your event... What can attendees expect?"
                                    rows={4}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue transition-colors resize-none placeholder:text-text-secondary"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue transition-colors appearance-none pr-10"
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue transition-colors appearance-none pr-10"
                                        />
                                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. University Stadium"
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Ticketing Card */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6">
                        <div className="mb-5">
                            <h3 className="text-base font-bold">Enable Tickets</h3>
                            <p className="text-text-secondary text-xs mt-0.5">
                                Allow students to select different Ticket types
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {tiers.map((tier) => (
                                <TicketingBlock
                                    key={tier.id}
                                    label={tier.label}
                                    enabled={tier.enabled}
                                    onToggle={() => updateTier(tier.id, { enabled: !tier.enabled })}
                                    price={tier.price}
                                    onPriceChange={(e) => updateTier(tier.id, { price: e.target.value })}
                                    isFree={tier.isFree}
                                    onFreeToggle={() => updateTier(tier.id, { isFree: !tier.isFree })}
                                />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Right Column: Preview ─────────────────────── */}
                <div className="flex flex-col gap-6 xl:sticky xl:top-4 h-fit pb-24 xl:pb-0">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                        Feed Preview
                    </div>
                    <div className="pointer-events-none">
                        <ClubPostCard
                            post={{
                                id: "preview",
                                clubName: "Your Club Name",
                                clubSeed: "Your Club Name",
                                time: "Just now",
                                category: "Event",
                                image: coverImage?.url || "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22rgba(255,255,255,0.05)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214px%22%20fill%3D%22%2394A3B8%22%3ENo%20Image%20Provided%3C%2Ftext%3E%3C%2Fsvg%3E",
                                price: tiers.find(t => t.enabled)?.isFree ? "Free" : tiers.find(t => t.enabled)?.price ? `Rs.${tiers.find(t => t.enabled).price}` : "Free",
                                text: `${formData.name ? `Event: ${formData.name}\n` : ""}${formData.date ? `Date: ${formData.date}${formData.time ? ` @ ${formData.time}` : ''}\n` : ""}${formData.location ? `Location: ${formData.location}\n` : ""}\n${formData.description || "Your event description will appear here..."}`,
                                postType: "club-event",
                                stats: { likes: 0 },
                                comments: []
                            }}
                            isOwner={false}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0B1724]/95 backdrop-blur-md border-t border-white/10 xl:static xl:z-auto xl:p-0 xl:bg-transparent xl:backdrop-blur-none xl:border-t-0 flex gap-4 mt-4 xl:mt-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handlePublishClick}
                            disabled={loading}
                            className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Publishing..." : "Publish Event"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventForm;
