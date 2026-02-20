import React, { useState } from "react";
import {
    Zap,
    Bookmark,
    Flag,
    Megaphone,
} from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

/* ─── Single pushable action button ─────────────────────────── */
const ActionBtn = ({ icon: Icon, svgSrc, label, count, showBoth, activeColor = "text-primary", onClick, active }) => (
    <button
        onClick={onClick}
        className={`
            flex flex-col items-center gap-[3px] px-3 py-2 rounded-xl
            transition-all duration-150 select-none
            active:scale-95 active:brightness-90
            ${active
                ? `${activeColor} bg-white/10`
                : "text-text-tertiary hover:text-text-primary hover:bg-white/5"
            }
        `}
    >
        {showBoth
            ? <>
                <div className="flex items-center gap-[3px]">
                    {svgSrc
                        ? <img src={svgSrc} alt={label} className="w-5 h-5" />
                        : <Icon size={20} strokeWidth={1.8} />
                    }
                    <span className="text-[12px] font-bold leading-none">{count}</span>
                </div>
                <span className="text-[11px] leading-none font-medium">{label}</span>
            </>
            : <>
                {svgSrc
                    ? <img src={svgSrc} alt={label} className="w-5 h-5" />
                    : <Icon size={20} strokeWidth={1.8} />
                }
                <span className="text-[11px] leading-none font-medium">
                    {count !== undefined ? count : label}
                </span>
            </>
        }
    </button>
);

/* ─── Card component ─────────────────────────────────────────── */
const ClubPostCard = ({ post }) => {
    const navigate = useNavigate();

    const [boosted, setBoosted] = useState(false);
    const [saved, setSaved] = useState(false);
    const [reported, setReported] = useState(false);
    const [adActive, setAdActive] = useState(false);
    const [comments, setComments] = useState(post.stats?.comments ?? 0);
    const [boosts, setBoosts] = useState(post.stats?.boosts ?? 0);
    const [likes, setLikes] = useState(post.stats?.likes ?? 0);

    const toggleBoost = () => { setBoosted(p => !p); setBoosts(n => boosted ? n - 1 : n + 1); };
    const toggleSave = () => setSaved(p => !p);
    const toggleReport = () => setReported(p => !p);
    const toggleAd = () => setAdActive(p => !p);

    return (
        <Card variant="card" padding="p-0" className="overflow-hidden">
            {/* Image */}
            <div className="relative w-full h-[360px] bg-white/5">
                <img src={post.image} alt={post.clubName} className="w-full h-full object-cover" />

                {/* Price pill */}
                <div className="absolute bottom-md left-md bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-md py-sm">
                    <span className="text-body-small-bold text-text-primary">{post.price}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-lg">
                {/* Club header */}
                <div className="flex items-center gap-md">
                    <img
                        className="w-11 h-11 rounded-full border border-white/20"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.clubSeed)}`}
                        alt="club"
                    />
                    <div className="min-w-0">
                        <p className="text-body-medium-bold text-text-primary truncate">{post.clubName}</p>
                        <p className="text-body-small text-text-tertiary">
                            {post.time} <span className="opacity-50">•</span> {post.category}
                        </p>
                    </div>
                </div>

                <p className="mt-md text-body-medium text-text-secondary leading-6">
                    {post.text}
                </p>

                {/* ── Action bar ─────────────────────────────────────── */}
                <div className="mt-lg pt-md border-t border-white/10 flex items-center justify-between">
                    {/* Like */}
                    <ActionBtn
                        svgSrc="/icon_like_marketplace.svg"
                        label="Like"
                        count={likes}
                        showBoth
                        activeColor="text-green-400"
                        active={adActive}
                        onClick={() => { toggleAd(); setLikes(n => adActive ? n - 1 : n + 1); }}
                    />

                    {/* Comment */}
                    <ActionBtn
                        svgSrc="/icon_comment_marketplace.svg"
                        label="Comment"
                        count={comments}
                        showBoth
                        activeColor="text-blue-400"
                        onClick={() => setComments(n => n + 1)}
                    />

                    {/* Boost */}
                    <ActionBtn
                        svgSrc="/icon_boost_controller.svg"
                        label="Boost"
                        activeColor="text-yellow-400"
                        active={boosted}
                        onClick={toggleBoost}
                    />

                    {/* Save */}
                    <ActionBtn
                        svgSrc="/icon_save_marketplace.svg"
                        label="Save"
                        activeColor="text-purple-400"
                        active={saved}
                        onClick={toggleSave}
                    />

                    {/* Report */}
                    <ActionBtn
                        svgSrc="/icon_report_marketplace.svg"
                        label="Report"
                        activeColor="text-red-400"
                        active={reported}
                        onClick={toggleReport}
                    />
                </div>

                {/* Buy now */}
                <div className="mt-lg pt-md border-t border-white/10 flex items-end justify-end">
                    <Button
                        variant="primary"
                        size="medium"
                        className="min-w-[160px]"
                        onClick={() => navigate("/marketplace/club/product")}
                    >
                        Buy now
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ClubPostCard;
