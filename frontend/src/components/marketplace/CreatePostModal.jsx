import React from "react";
import { Tag, Calendar, Edit3, X, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";

const CreatePostModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const options = [
        {
            id: "product",
            title: "New Product",
            description: "List merch, gear, or digital items for sale in the marketplace.",
            icon: Tag,
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-500",
            action: () => { navigate("/club-owner/create-product"); onClose(); }
        },
        {
            id: "event",
            title: "Club Event",
            description: "Schedule a meetup, party, or workshop for your community.",
            icon: Calendar,
            iconBg: "bg-emerald-500/20",
            iconColor: "text-emerald-500",
            action: () => { navigate("/club-owner/create-event"); onClose(); }
        },
        {
            id: "general",
            title: "General Post",
            description: "Share daily updates, photos, or news with everyone.",
            icon: Edit3,
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400",
            action: () => { navigate("/club-owner/create-post"); onClose(); }
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-1/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card — centered on all screen sizes */}
            <Card
                variant="card"
                className="relative w-full sm:max-w-[1040px] !p-5 sm:!p-16 flex flex-col items-center animate-in fade-in zoom-in duration-300 border border-white/10 bg-[#12283E] rounded-2xl max-h-[90dvh] overflow-y-auto"
            >
                {/* Close X — all screens */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="text-center mb-4 sm:mb-12 w-full mt-2 sm:mt-0">
                    <h2 className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-3">
                        Create New Post
                    </h2>
                    <p className="text-text-secondary text-xs sm:text-base">
                        Choose what you want to post.
                    </p>
                </div>

                {/* ── MOBILE: compact horizontal list ── */}
                <div className="flex flex-col gap-2 w-full sm:hidden mb-3">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            onClick={option.action}
                            className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] hover:border-white/20 hover:bg-white/10 active:scale-[0.98] transition-all p-3.5 rounded-2xl cursor-pointer text-left group w-full"
                        >
                            <div className={`${option.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <option.icon className={`${option.iconColor} w-5 h-5`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm leading-tight">{option.title}</h3>
                                <p className="text-text-secondary text-[11px] leading-snug mt-0.5">{option.description}</p>
                            </div>
                            <ChevronRight size={15} className="text-white/30 shrink-0" />
                        </button>
                    ))}
                </div>

                {/* ── DESKTOP: original 3-column grid (unchanged) ── */}
                <div className="hidden sm:grid grid-cols-3 gap-6 w-full mb-10">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={option.action}
                            className="bg-white/10 border border-white/5 hover:border-white/10 hover:bg-white/[0.18] transition-all p-8 rounded-[24px] flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className={`${option.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <option.icon className={`${option.iconColor} w-8 h-8`} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{option.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{option.description}</p>
                        </div>
                    ))}
                </div>

                {/* Cancel — desktop only (mobile has X button) */}
                <div className="hidden sm:flex justify-end w-full">
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-white transition-colors text-lg font-medium px-4 py-2"
                    >
                        Cancel
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default CreatePostModal;
