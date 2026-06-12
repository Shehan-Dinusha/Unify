import React from 'react';

const ProductDetails = ({ post, activeColor, setActiveColor, activeSize, setActiveSize, activeTier, setActiveTier, isDescExpanded, setIsDescExpanded, finalPrice }) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-md">
            <img className="w-10 h-10 rounded-full border border-white/20"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.author?.name || 'club')}`} alt="club" />
            <div>
                <p className="text-body-small-bold text-text-primary">{post.author?.name || 'Unknown Club'}</p>
                <p className="text-body-extra-small text-text-tertiary">{post.category || 'Official Merchandise'}</p>
            </div>
        </div>

        <h1 className="mt-md text-[24px] md:text-heading-large font-bold text-text-primary md:!leading-tight">{post.name}</h1>

        <div className="mt-sm md:mt-md flex items-center gap-md flex-wrap">
            <span className="text-heading-small text-primary-blue">Rs.{finalPrice}</span>
        </div>

        <p className="hidden md:block mt-md text-body-medium text-text-secondary leading-6 max-w-[640px] whitespace-pre-wrap">{post.description}</p>
        <div className="md:hidden mt-md text-body-medium text-text-secondary leading-6 max-w-[640px]">
            <p className={`${!isDescExpanded ? 'line-clamp-3' : ''} whitespace-pre-wrap`}>{post.description}</p>
            {post.description && post.description.length > 100 && (
                <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="text-white opacity-80 text-[13px] font-semibold mt-1 hover:underline">
                    {isDescExpanded ? 'See less' : 'See more'}
                </button>
            )}
        </div>

        <div className="my-lg h-px bg-white/10" />

        {post.colors?.length > 0 && (
            <div>
                <div className="flex items-center gap-sm">
                    <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">COLOR:</p>
                    <p className="text-body-extra-small-bold text-text-primary uppercase">{post.colors.find(c => c.id === activeColor)?.name}</p>
                </div>
                <div className="mt-sm flex items-center gap-sm">
                    {post.colors.map(c => (
                        <button key={c.id} type="button" onClick={() => setActiveColor(c.id)}
                            className={`w-10 h-10 rounded-full border transition-all ${c.id === activeColor ? 'border-primary-blue shadow-custom' : 'border-white/10 hover:border-white/20'}`}
                            style={{ backgroundColor: c.hex }} aria-label={c.name} />
                    ))}
                </div>
            </div>
        )}

        {post.sizes?.length > 0 && (
            <div className="mt-lg">
                <div className="flex items-center gap-sm">
                    <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">SIZE:</p>
                    <p className="text-body-extra-small-bold text-text-primary">{activeSize}</p>
                </div>
                <div className="mt-sm flex gap-sm flex-wrap">
                    {post.sizes.map(s => (
                        <button key={s} type="button" onClick={() => setActiveSize(s)}
                            className={`h-10 px-lg rounded-full border transition-all text-body-small-bold ${s === activeSize ? 'bg-primary-blue/15 border-primary-blue text-primary-blue' : 'bg-white/5 border-white/10 text-text-tertiary hover:border-white/20 hover:text-text-primary'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {post.tiers?.length > 0 && (
            <div className="mt-lg">
                <div className="flex items-center gap-sm">
                    <p className="text-body-extra-small-bold text-text-tertiary tracking-widest uppercase">Ticket Type:</p>
                    <p className="text-body-extra-small-bold text-text-primary">{activeTier}</p>
                </div>
                <div className="mt-sm flex gap-sm flex-wrap">
                    {post.tiers.map(t => (
                        <button key={t.name} type="button" onClick={() => setActiveTier(t.name)}
                            className={`h-10 px-lg rounded-full border transition-all text-body-small-bold ${t.name === activeTier ? 'bg-primary-blue/15 border-primary-blue text-primary-blue' : 'bg-white/5 border-white/10 text-text-tertiary hover:border-white/20 hover:text-text-primary'}`}>
                            {t.name} (Rs.{t.price})
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default ProductDetails;
