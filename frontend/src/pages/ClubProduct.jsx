import React, { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Zap, Minus, Plus } from "lucide-react";
import { mockClubProduct } from "../data/mockClubProduct";

const Pill = ({ children }) => (
    <span className="px-sm py-xs rounded-full bg-white/5 border border-white/10 text-body-extra-small-bold text-text-tertiary">
        {children}
    </span>
);

const ClubProduct = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    const product = mockClubProduct;

    const [activeImg, setActiveImg] = useState(product.images[0]?.id);
    const [activeColor, setActiveColor] = useState(product.colors[0]?.id);
    const [activeSize, setActiveSize] = useState("S");
    const [qty, setQty] = useState(1);

    const currentImg = useMemo(
        () => product.images.find((i) => i.id === activeImg) || product.images[0],
        [activeImg, product.images]
    );

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <Card variant="card" padding="p-0" className="overflow-hidden">
                <div className="p-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-2xl">
                        {/* LEFT: Gallery */}
                        <div>
                            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                                <img src={currentImg.src} alt={currentImg.alt} className="w-full h-full object-cover" />
                            </div>

                            <div className="mt-lg flex gap-md">
                                {product.images.map((img) => {
                                    const active = img.id === activeImg;
                                    return (
                                        <button
                                            key={img.id}
                                            type="button"
                                            onClick={() => setActiveImg(img.id)}
                                            className={`w-20 h-20 rounded-2xl overflow-hidden border transition-all ${active ? "border-primary-blue shadow-custom" : "border-white/10 hover:border-white/20"
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
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(product.clubName)}`}
                                    alt="club"
                                />
                                <div>
                                    <p className="text-body-small-bold text-text-primary">{product.clubName}</p>
                                    <p className="text-body-extra-small text-text-tertiary">{product.clubSubtitle}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="mt-md text-heading-large text-text-primary leading-tight">
                                {product.title}
                            </h1>

                            {/* Price row */}
                            <div className="mt-md flex items-center gap-md flex-wrap">
                                <span className="text-heading-small text-primary-blue">{product.priceNow}</span>
                            </div>

                            {/* Description */}
                            <p className="mt-md text-body-medium text-text-secondary leading-6 max-w-[640px]">
                                {product.description}
                            </p>

                            <div className="my-lg h-px bg-white/10" />

                            {/* Color */}
                            <div>
                                <div className="flex items-center gap-sm">
                                    <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">COLOR:</p>
                                    <p className="text-body-extra-small-bold text-text-primary">
                                        {product.colors.find((c) => c.id === activeColor)?.name}
                                    </p>
                                </div>

                                <div className="mt-sm flex items-center gap-sm">
                                    {product.colors.map((c) => {
                                        const active = c.id === activeColor;
                                        return (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setActiveColor(c.id)}
                                                className={`w-10 h-10 rounded-full border transition-all ${active ? "border-primary-blue shadow-custom" : "border-white/10 hover:border-white/20"
                                                    }`}
                                                style={{ backgroundColor: c.swatch }}
                                                aria-label={c.name}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Size */}
                            <div className="mt-lg flex items-center justify-between">
                                <div className="flex items-center gap-sm">
                                    <p className="text-body-extra-small-bold text-text-tertiary tracking-widest">SIZE:</p>
                                    <p className="text-body-extra-small-bold text-text-primary">{activeSize}</p>
                                </div>
                            </div>

                            <div className="mt-sm flex gap-sm flex-wrap">
                                {product.sizes.map((s) => {
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

                            {/* Qty + Buy */}
                            <div className="mt-2xl flex items-center gap-md flex-wrap">
                                <div className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        className="w-14 h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="w-14 text-center text-body-medium-bold text-text-primary">{qty}</div>
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => q + 1)}
                                        className="w-14 h-14 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <Button
                                    variant="primary"
                                    size="large"
                                    className="flex-1 min-w-[260px] justify-center"
                                    onClick={() => console.log("BUY (mock)", { activeColor, activeSize, qty })}
                                    icon={Zap}
                                >
                                    Buy Now
                                </Button>
                            </div>
                            <div className="mt-md text-body-small text-text-tertiary"><p className="text-center">{product.pickupNote}</p></div>
                        </div>
                    </div>
                </div>
            </Card>
        </MainLayout>
    );
};

export default ClubProduct;
