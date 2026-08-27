import React from "react";
import { useNavigate } from "react-router-dom";

const PopularPostCard = ({ post }) => {
    const navigate = useNavigate();
    return (
        <section className="w-full shrink-0 flex flex-col hover:brightness-110 transition-all active:scale-[0.99] cursor-pointer" onClick={() => navigate(`/marketplace/club/product/${post.postType}/${post.id}`)} >
            <div className="w-full aspect-[7/6] sm:aspect-auto sm:h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 bg-gradient-to-t from-emerald-600/20 to-transparent ">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/*<div className="mt-md flex items-start justify-between gap-md">
                <div className="min-w-0">
                    <p className="text-body-small text-text-tertiary">{post.tag}</p>
                    <h3 className="text-body-medium-bold text-text-primary leading-5 mt-xs line-clamp-2">
                        {post.title}
                    </h3>
                </div>
                {post.priceLabel && (
                    <div className="text-body-medium-bold text-text-primary shrink-0">
                        {post.priceLabel}
                    </div>
                )}
            </div>*/}

            <p className="text-body-small text-text-secondary mt-sm line-clamp-2">
                {post.description}
            </p>

            {/*<div className="mt-md flex items-center justify-between gap-md">
                <div className="flex items-center gap-sm min-w-0">
                    <img
                        className="w-9 h-9 rounded-full border border-white/20"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            post.author.seed
                        )}`}
                        alt="avatar"
                    />
                    <div className="min-w-0">
                        <p className="text-body-small-bold text-text-primary truncate">{post.author.name}</p>
                        <p className="text-body-extra-small text-text-tertiary truncate">Posted</p>
                    </div>
                </div>

                <Button size="small" variant="primary" >
                    Buy Now
                </Button>
            </div>*/}
        </section>
    );
};

export default PopularPostCard;
