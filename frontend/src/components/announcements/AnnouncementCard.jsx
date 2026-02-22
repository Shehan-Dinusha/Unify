import React from "react";

const AnnouncementCard = ({
    title,
    description,
    location,
    image,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className="w-full bg-[#1A2634] rounded-[16px] overflow-hidden border border-white/5 font-inter text-white flex flex-col md:flex-row h-auto md:h-64 transition-transform hover:scale-[1.01] cursor-pointer"
        >
            {/* Image Container */}
            {image && (
                <div className="w-full md:w-[30%] h-48 md:h-full bg-white/10 shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content Container */}
            <div className="p-6 md:p-8 flex flex-col justify-center gap-3">
                <h3 className="text-xl md:text-heading-small text-white font-bold leading-tight">
                    {title}
                </h3>

                {location && (
                    <p className="text-sm font-semibold text-primary-blue">
                        {location}
                    </p>
                )}

                <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default AnnouncementCard;
