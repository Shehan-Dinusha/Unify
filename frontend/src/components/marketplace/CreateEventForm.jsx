import React, { useState } from "react";
import {
    ImagePlus, MapPin, Calendar, Clock, ChevronRight,
    LayoutGrid, Edit3, Info
} from "lucide-react";
import Card from "../common/Card";

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

    const [tiers, setTiers] = useState([
        { id: 1, label: "Ticketing Details", enabled: false, price: "", isFree: false },
        { id: 2, label: "Ticketing Details", enabled: false, price: "", isFree: false },
        { id: 3, label: "Ticketing Details", enabled: false, price: "", isFree: false },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const updateTier = (id, patch) =>
        setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

                {/* ── Left Column ──────────────────────────────── */}
                <div className="flex flex-col gap-6 pb-8">

                    {/* Event Details */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
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
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                        <ImagePlus className="text-blue-500 w-5 h-5" />
                                    </div>
                                    <p className="text-white text-sm font-medium mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-text-secondary text-[11px]">
                                        SVG, PNG, JPG or GIF (max. 800×400px)
                                    </p>
                                </div>
                            </div>

                            {/* Event Name */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Event Name
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
                                    Description
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Date
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
                                    Location
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
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
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
                <div className="flex flex-col gap-6 sticky top-4 h-fit">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                        Event Preview
                    </div>

                    <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
                        {/* Cover placeholder */}
                        <div className="h-44 bg-white/5 flex items-center justify-center">
                            <ImagePlus className="w-8 h-8 text-white/10" />
                        </div>

                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold leading-tight">
                                {formData.name || <span className="text-text-secondary font-normal text-base">Event name will appear here</span>}
                            </h3>

                            <div className="flex flex-col gap-2 text-sm text-text-secondary">
                                {formData.date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary-blue shrink-0" />
                                        <span>{formData.date}{formData.time && ` · ${formData.time}`}</span>
                                    </div>
                                )}
                                {formData.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary-blue shrink-0" />
                                        <span>{formData.location}</span>
                                    </div>
                                )}
                            </div>

                            {formData.description && (
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                    {formData.description}
                                </p>
                            )}

                            {/* Ticket tiers preview */}
                            {tiers.some((t) => t.enabled) && (
                                <div>
                                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                                        Tickets
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {tiers.filter((t) => t.enabled).map((t, i) => (
                                            <div key={t.id} className="flex justify-between items-center text-sm">
                                                <span>{t.label} {i + 1}</span>
                                                <span className="font-bold text-primary-blue">
                                                    {t.isFree ? "Free" : t.price ? `$${t.price}` : "—"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button className="w-full py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(43,140,238,0.35)]">
                                Register Now
                            </button>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onPublish && onPublish(formData, tiers)}
                            className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2"
                        >
                            Publish Event
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventForm;
