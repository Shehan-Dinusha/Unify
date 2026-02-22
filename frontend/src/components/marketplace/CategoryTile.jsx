import React from "react";

const CategoryTile = ({ title, subtitle, image, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative w-[280px] h-[360px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 text-left hover:brightness-110 transition-all active:scale-[0.99]"
        >
            <img src={image} alt={title} className="w-full h-full object-cover opacity-80" />

            {/* dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* label pill */}
            <div className="absolute bottom-md left-md right-md bg-dark-1/60 backdrop-blur-md border border-white/10 rounded-2xl p-md">
                <p className="text-body-medium-bold text-text-primary">{title}</p>
                <p className="text-body-small text-text-secondary">{subtitle}</p>
            </div>
        </button>
    );
};

export default CategoryTile;
