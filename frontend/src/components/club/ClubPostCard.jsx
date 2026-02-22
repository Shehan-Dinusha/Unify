import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
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

/* ─── Comment Section ────────────────────────────────────────── */
const CommentSection = ({ postComments, onAddComment }) => {
    const [text, setText] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onAddComment(trimmed);
        setText("");
    };

    return (
        <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Existing comments */}
            {postComments.length > 0 && (
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
                    {postComments.map((c) => (
                        <div key={c.id} className="flex gap-3 items-start">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.seed || c.user)}`}
                                alt={c.user}
                                className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[13px] font-semibold text-text-primary">{c.user}</span>
                                    <span className="text-[11px] text-text-tertiary">{c.time}</span>
                                </div>
                                <p className="text-[13px] text-text-secondary leading-relaxed">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
                    alt="You"
                    className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0"
                />
                <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 focus-within:border-primary/50 transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment…"
                        className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="text-primary disabled:text-text-tertiary transition-colors"
                    >
                        <Send size={16} strokeWidth={2} />
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Card component ─────────────────────────────────────────── */
const ClubPostCard = ({ post }) => {
    const navigate = useNavigate();

    const [boosted, setBoosted] = useState(false);
    const [saved, setSaved] = useState(false);
    const [reported, setReported] = useState(false);
    const [adActive, setAdActive] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [postComments, setPostComments] = useState(post.comments ?? []);
    const [likes, setLikes] = useState(post.stats?.likes ?? 0);

    const toggleBoost = () => { setBoosted(p => !p); };
    const toggleSave = () => setSaved(p => !p);
    const toggleReport = () => setReported(p => !p);
    const toggleAd = () => setAdActive(p => !p);

    const handleAddComment = (text) => {
        const newComment = {
            id: `new-${Date.now()}`,
            user: "You",
            seed: "Me",
            time: "just now",
            text,
        };
        setPostComments(prev => [...prev, newComment]);
    };

    return (
        <Card variant="card" padding="p-0" className="overflow-hidden">
            {/* Image */}
            <div className="relative w-full h-[360px] bg-white/5">
                <img src={post.image} alt={post.clubName} className="w-full h-full object-cover" />

                {/* Price pill */}
                {post.price && (
                    <div className="absolute bottom-md left-md bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-md py-sm">
                        <span className="text-body-small-bold text-text-primary">{post.price}</span>
                    </div>
                )}
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
                        label="Comment"
                        svgSrc="/icon_comment_marketplace.svg"
                        count={postComments.length}
                        showBoth
                        activeColor="text-blue-400"
                        active={commentOpen}
                        onClick={() => setCommentOpen(o => !o)}
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

                {/* ── Comment section (toggles open) ─────────────────── */}
                {commentOpen && (
                    <CommentSection
                        postComments={postComments}
                        onAddComment={handleAddComment}
                    />
                )}

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
