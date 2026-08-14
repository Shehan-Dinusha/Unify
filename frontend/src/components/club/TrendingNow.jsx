import React from "react";
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TrendingNow = ({ items, loading = false, clickable = true }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <h3 className="text-body-large-bold text-text-primary mb-md">Trending Now</h3>

            <Card variant="card" padding="p-md" className="min-h-[100px]">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-primary-blue animate-spin" />
                    </div>
                ) : items && items.length > 0 ? (
                    <div className="flex flex-col gap-md">
                        {items.map((it) => (
                            <div 
                                key={`${it.postType}-${it.id}`} 
                                onClick={clickable ? () => navigate(`/marketplace/club/product/${it.postType}/${it.id}`) : undefined}
                                className={`flex items-center gap-md p-2 -mx-2 rounded-xl transition-colors ${clickable ? "cursor-pointer hover:bg-white/5" : "cursor-default"}`}
                            >
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
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-text-tertiary text-sm">No trending items</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TrendingNow;
