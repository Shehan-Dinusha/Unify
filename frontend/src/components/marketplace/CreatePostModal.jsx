import React from "react";
import { Tag, Calendar, Edit3, X } from "lucide-react";
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
            action: () => {
                navigate("/club-owner/create-product");
                onClose();
            }
        },
        {
            id: "event",
            title: "Club Event",
            description: "Schedule a meetup, party, or workshop for your community.",
            icon: Calendar,
            iconBg: "bg-emerald-500/20",
            iconColor: "text-emerald-500",
            action: () => {
                navigate("/club-owner/create-event");
                onClose();
            }
        },
        {
            id: "general",
            title: "General Post",
            description: "Share daily updates, photos, or news with everyone.",
            icon: Edit3,
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400",
            action: () => {
                navigate("/club-owner/create-post");
                onClose();
            }
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-1/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <Card
                variant="card"
                className="relative w-full max-w-[1040px] !p-8 sm:!p-16 flex flex-col items-center animate-in fade-in zoom-in duration-300 border border-white/10 bg-[#12283E]"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Create New Post</h2>
                    <p className="text-text-secondary text-sm sm:text-base">
                        Select the type of content you want to share with your club members today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
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
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {option.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end w-full">
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
