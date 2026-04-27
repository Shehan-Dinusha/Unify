import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Zap, Minus, Plus, Loader2 } from "lucide-react";
import postService from "../services/postService";
import { getImageUrl } from "../utils/formatters";

const Pill = ({ children }) => (
    <span className="px-sm py-xs rounded-full bg-white/5 border border-white/10 text-body-extra-small-bold text-text-tertiary">
        {children}
    </span>
);

const ClubProduct = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeImg, setActiveImg] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [activeSize, setActiveSize] = useState("");
    const [qty, setQty] = useState(1);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const data = await postService.getPost(type, id);
                setPost(data.post);
                
                // Initialize selections
                if (data.post.images?.length > 0) setActiveImg(0);
                if (data.post.colors?.length > 0) setActiveColor(data.post.colors[0].id);
                if (data.post.sizes?.length > 0) setActiveSize(data.post.sizes[0]);
                
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Product not found or has been removed.");
            } finally {
                setLoading(false);
            }
        };

        if (id && type) fetchProductDetails();
    }, [id, type]);

    const images = useMemo(() => {
        if (!post?.images) return [];
        return post.images.map((img, idx) => ({
            id: idx,
            src: getImageUrl(img),
            alt: post.name
        }));
    }, [post]);

    const currentImg = useMemo(
        () => images.find((i) => i.id === activeImg) || images[0],
        [activeImg, images]
    );

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Club" verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
                    <p className="text-text-secondary text-body-large">Loading product details...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !post) {
        return (
            <MainLayout user={user} pageTitle="Club" verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h2 className="text-heading-medium text-text-primary mb-2">Oops!</h2>
                    <p className="text-text-secondary mb-8">{error || "Something went wrong."}</p>
                    <Button variant="outline" onClick={() => navigate("/marketplace/club")}>
                        Back to Marketplace
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <Card variant="card" padding="p-0" className="overflow-hidden">
                <div className="p-md md:p-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-2xl">
                        {/* LEFT: Gallery */}
                        <div>
                            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                                <img src={currentImg?.src} alt={currentImg?.alt} className="w-full h-full object-cover" />
                            </div>

                            <div className="mt-lg flex gap-md overflow-x-auto scrollbar-hide md:overflow-x-visible">
                                {images.map((img) => {
                                    const active = img.id === activeImg;
                                    return (
                                        <button
                                            key={img.id}
                                            type="button"
                                            onClick={() => setActiveImg(img.id)}
                                            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden border transition-all ${active ? "border-primary-blue shadow-custom" : "border-white/10 hover:border-white/20"
                                                } bg-white/5`}
                                        >
                                            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT: Details */}
                        <div className="flex flex-col">
                            {/* Club line */}
                            <div className="flex items-center gap-md">
                                <img
                                    className="w-10 h-10 rounded-full border border-white/20"
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.author?.name || "club")}`}
                                    alt="club"
                                />
                                <div>
                                    <p className="text-body-small-bold text-text-primary">{post.author?.name || "Unknown Club"}</p>
                                    <p className="text-body-extra-small text-text-tertiary">{post.category || "Official Merchandise"}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="mt-md text-[24px] md:text-heading-large font-bold text-text-primary md:!leading-tight">
                                {post.name}
                            </h1>

                            {/* Price row */}
                            <div className="mt-sm md:mt-md flex items-center gap-md flex-wrap">
                                <span className="text-heading-small text-primary-blue">Rs.{post.price}</span>
                            </div>

                            {/* Description */}
                            <p className="hidden md:block mt-md text-body-medium text-text-secondary leading-6 max-w-[640px]">
                                {post.description}
                            </p>
                            <div className="md:hidden mt-md text-body-medium text-text-secondary leading-6 max-w-[640px]">
                                <p className={!isDescExpanded ? "line-clamp-3" : ""}>
                                    {post.description}
                                </p>
                                {post.description && post.description.length > 100 && (
                                    <button
                                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                                        className="text-white opacity-80 text-[13px] font-semibold mt-1 hover:underline"
                                    >
                                        {isDescExpanded ? "See less" : "See more"}
                                    </button>
                                )}
                            </div>

                            <div className="my-lg h-px bg-white/10" />

                            {/* Color */}
                            {post.colors?.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-sm">
                                        <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">COLOR:</p>
                                        <p className="text-body-extra-small-bold text-text-primary uppercase">
                                            {post.colors.find((c) => c.id === activeColor)?.name}
                                        </p>
                                    </div>

                                    <div className="mt-sm flex items-center gap-sm">
                                        {post.colors.map((c) => {
                                            const active = c.id === activeColor;
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setActiveColor(c.id)}
                                                    className={`w-10 h-10 rounded-full border transition-all ${active ? "border-primary-blue shadow-custom" : "border-white/10 hover:border-white/20"
                                                        }`}
                                                    style={{ backgroundColor: c.hex }}
                                                    aria-label={c.name}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size */}
                            {post.sizes?.length > 0 && (
                                <div className="mt-lg">
                                    <div className="flex items-center gap-sm">
                                        <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">SIZE:</p>
                                        <p className="text-body-extra-small-bold text-text-primary">{activeSize}</p>
                                    </div>

                                    <div className="mt-sm flex gap-sm flex-wrap">
                                        {post.sizes.map((s) => {
                                            const active = s === activeSize;
                                            return (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setActiveSize(s)}
                                                    className={`h-10 px-lg rounded-full border transition-all text-body-small-bold ${active
                                                        ? "bg-primary-blue/15 border-primary-blue text-primary-blue"
                                                        : "bg-white/5 border-white/10 text-text-tertiary hover:border-white/20 hover:text-text-primary"
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Qty + Buy — sticky on mobile */}
                            <div className="
                                fixed bottom-0 left-0 right-0 z-50 p-md bg-dark-1/90 backdrop-blur-lg border-t border-white/10
                                md:static md:z-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:mt-2xl
                            ">
                                <div className="flex items-center gap-md flex-wrap">
                                    <div className="h-12 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                                            className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <div className="w-10 md:w-14 text-center text-body-medium-bold text-text-primary">{qty}</div>
                                        <button
                                            type="button"
                                            onClick={() => setQty((q) => q + 1)}
                                            className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="large"
                                        className="flex-1 min-w-0 md:min-w-[260px] justify-center"
                                        onClick={() => navigate("/marketplace/club/checkout", {
                                            state: {
                                                product: post,
                                                selectedColor: post.colors?.find(c => c.id === activeColor),
                                                selectedSize: activeSize,
                                                quantity: qty
                                            }
                                        })}
                                    >
                                        Buy Now
                                    </Button>
                                </div>
                                <p className="mt-sm md:mt-md text-body-small text-text-tertiary text-left md:text-center">
                                    {post.pickupNote || "Ready for pickup once order is confirmed."}
                                </p>
                            </div>
                            {/* Spacer on mobile so content isn't hidden behind sticky bar */}
                            <div className="h-28 md:hidden" />
                        </div>
                    </div>
                </div>
            </Card>
        </MainLayout>
    );
};

export default ClubProduct;
