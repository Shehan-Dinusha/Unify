import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PackageCard from './PackageCard';

const PackageCarousel = ({ visiblePackages, canGoLeft, canGoRight, goLeft, goRight, carouselIndex, setCarouselIndex, maxIndex, onEdit, onDelete }) => (
    <div className="relative">
        {canGoLeft && (
            <button
                onClick={goLeft}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-2 border border-white/15 flex items-center justify-center shadow-lg hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
            >
                <ChevronLeft size={20} className="text-text-primary" />
            </button>
        )}

        {canGoRight && (
            <button
                onClick={goRight}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-2 border border-white/15 flex items-center justify-center shadow-lg hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
            >
                <ChevronRight size={20} className="text-text-primary" />
            </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {visiblePackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>

        {maxIndex > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-md">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCarouselIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-200 ${i === carouselIndex ? 'w-6 bg-primary-blue' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                    />
                ))}
            </div>
        )}
    </div>
);

export default PackageCarousel;
