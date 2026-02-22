import React from "react";
import Card from "../common/Card";

const TrendingNow = ({ items }) => {
    return (
        <div className="w-full">
            <h3 className="text-body-large-bold text-text-primary mb-md">Trending Now</h3>

            <Card variant="card" padding="p-md" className="">
                <div className="flex flex-col gap-md">
                    {items.map((it) => (
                        <div key={it.id} className="flex items-center gap-md">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-body-small-bold text-text-primary truncate">{it.title}</p>
                                <p className="text-body-extra-small text-text-tertiary truncate">{it.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default TrendingNow;
