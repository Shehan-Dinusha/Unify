// src/components/marketplace/MarketplaceCard.jsx

import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { MapPin, Tag } from "lucide-react";

const badgeStyles = {
    Hot: "bg-state-warning/15 text-state-warning border-state-warning/30",
    New: "bg-primary-blue/15 text-primary-blue border-primary-blue/30",
    Verified: "bg-state-success/15 text-state-success border-state-success/30",
    "Top Rated": "bg-primary-accent/15 text-primary-accent border-primary-accent/30",
};

const money = (amount) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(amount);

const MarketplaceCard = ({ item }) => {
    const badgeClass =
        item.badge && badgeStyles[item.badge] ? badgeStyles[item.badge] : "bg-white/10 text-text-secondary border-white/10";

    return (
        <Card variant="container" padding="p-md" className="hover:bg-white/10 transition-colors">
            {/* Image placeholder */}
            <div className="w-full h-40 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary-blue/15 border border-primary-blue/25 flex items-center justify-center shadow-custom">
                        <span className="text-heading-small text-primary-blue">
                            {item.title?.trim()?.[0]?.toUpperCase() ?? "M"}
                        </span>
                    </div>
                </div>

                {item.badge && (
                    <div className={`absolute top-sm left-sm px-sm py-[6px] rounded-full border text-body-extra-small-bold ${badgeClass}`}>
                        {item.badge}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mt-md flex flex-col gap-sm">
                <div className="flex items-start justify-between gap-md">
                    <h3 className="text-body-medium-bold text-text-primary leading-5 line-clamp-2">{item.title}</h3>
                    <div className="shrink-0 text-body-medium-bold text-text-primary">{money(item.price)}</div>
                </div>

                <div className="flex items-center gap-sm text-body-small text-text-secondary">
                    <div className="inline-flex items-center gap-xs">
                        <Tag size={16} className="opacity-80" />
                        <span>{item.condition}</span>
                    </div>
                    <span className="opacity-30">•</span>
                    <div className="inline-flex items-center gap-xs">
                        <MapPin size={16} className="opacity-80" />
                        <span>{item.location}</span>
                    </div>
                    <span className="opacity-30">•</span>
                    <span>{item.postedAt}</span>
                </div>

                {/* Seller + actions */}
                <div className="pt-sm flex items-center justify-between gap-md border-t border-white/10">
                    <div className="flex items-center gap-sm min-w-0">
                        <img
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.seller.seed)}`}
                            alt="Seller avatar"
                        />
                        <div className="min-w-0">
                            <p className="text-body-small-bold text-text-primary truncate">{item.seller.name}</p>
                            <p className="text-body-extra-small text-text-tertiary truncate">Seller</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-sm">
                        <Button variant="ghost" size="small" className="rounded-2xl">
                            Save
                        </Button>
                        <Button variant="primary" size="small" className="rounded-2xl">
                            View
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MarketplaceCard;
