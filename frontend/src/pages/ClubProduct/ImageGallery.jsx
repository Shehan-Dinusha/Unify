import React from 'react';

const ImageGallery = ({ images, currentImg, activeImg, onSelect }) => (
    <div>
        <div className="w-full aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            <img
                src={currentImg?.src || '/placeholder-post.jpg'}
                alt={currentImg?.alt || 'Product'}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/placeholder-post.jpg'; e.target.className = 'w-1/2 h-1/2 object-contain opacity-20'; }}
            />
        </div>
        {images.length > 1 && (
            <div className="mt-lg flex gap-md overflow-x-auto scrollbar-hide md:overflow-x-visible">
                {images.map((img) => (
                    <button key={img.id} type="button" onClick={() => onSelect(img.id)}
                        className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden border transition-all ${img.id === activeImg ? 'border-primary-blue shadow-custom' : 'border-white/10 hover:border-white/20'} bg-white/5`}>
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default ImageGallery;
