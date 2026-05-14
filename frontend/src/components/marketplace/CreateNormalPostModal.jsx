import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Card from "../common/Card";

const CreateNormalPostModal = ({ isOpen, onClose }) => {
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState([]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Normal Post:", { description, photos });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-1/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <Card
                variant="card"
                className="relative w-full max-w-[640px] !p-8 sm:!p-10 flex flex-col animate-in fade-in zoom-in duration-300 border border-white/10 bg-[#12283E]/95 rounded-[32px] overflow-hidden"
            >
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Normal Post</h2>
                    <p className="text-text-secondary text-sm sm:text-base">
                        Share your precious moments as a club
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photos Section */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-sm sm:text-base">Photos</label>
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                             <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <ImagePlus className="text-blue-500 w-6 h-6" />
                             </div>
                             <p className="text-white text-sm sm:text-base font-medium mb-1 text-center">
                                Drag & drop photos or <span className="text-blue-500">Browse</span>
                             </p>
                             <p className="text-text-secondary text-xs sm:text-sm text-center">
                                Supported formats: JPG, PNG, WEBP
                             </p>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-sm sm:text-base">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's delicious today? Describe the taste, ingredients..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-blue-500/50 min-h-[200px] resize-y text-sm sm:text-base transition-colors"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-sm sm:text-base active:scale-95"
                        >
                            Cancle
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all text-sm sm:text-base active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateNormalPostModal;
