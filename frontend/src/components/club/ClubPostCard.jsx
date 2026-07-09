import React, { useState, useRef, useEffect } from "react";
import { Send, Heart, MessageCircle } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../utils/formatters";

/* ─── Single pushable action button ─────────────────────────── */
const ActionBtn = ({ icon: Icon, svgSrc, label, count, showBoth, activeColor = "text-primary", onClick, active, fillActive = false }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        }}
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
                        : <Icon size={20} className={active && fillActive ? "fill-current" : ""} strokeWidth={active && fillActive ? 0 : 1.8} />
                    }
                    <span className="text-[12px] font-bold leading-none">{count}</span>
                </div>
                <span className="text-[11px] leading-none font-medium">{label}</span>
            </>
            : <>
                {svgSrc
                    ? <img src={svgSrc} alt={label} className="w-5 h-5" />
                    : <Icon size={20} className={active && fillActive ? "fill-current" : ""} strokeWidth={active && fillActive ? 0 : 1.8} />
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
                                <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">{c.text}</p>
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
const ClubPostCard = ({ post, isOwner = false, hideActions = false, onCardClick, currentUser }) => {
    const navigate = useNavigate();

    const [saved, setSaved] = useState(false);
    const [reported, setReported] = useState(false);
    const [liked, setLiked] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [postComments, setPostComments] = useState(post.comments ?? []);
    const [likes, setLikes] = useState(post.stats?.likes ?? 0);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSave = () => setSaved(p => !p);
    const toggleReport = () => setReported(p => !p);

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
        <Card 
            variant="card" 
            padding="p-0" 
            className={`overflow-hidden transition-all duration-200 ${onCardClick ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.02]" : ""}`}
            onClick={onCardClick}
        >
            {/* Image */}
            <div className="relative w-full bg-white/5 flex justify-center items-center min-h-[200px] max-h-[500px] overflow-hidden">
                <img 
                    src={post.image || "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22400%22%20viewBox%3D%220%200%20800%20400%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22rgba(255,255,255,0.05)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214px%22%20fill%3D%22%2394A3B8%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E"} 
                    alt={post.clubName} 
                    className="w-full h-auto min-h-[200px] object-cover sm:object-contain max-h-[500px]" 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22400%22%20viewBox%3D%220%200%20800%20400%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22rgba(255,255,255,0.05)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214px%22%20fill%3D%22%2394A3B8%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E";
                    }}
                />

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
                        src={getAvatarUrl(post.authorAvatar, post.clubName)}
                        alt="club"
                        onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, post.clubName); }}
                    />
                    <div className="min-w-0">
                        <p className="text-body-medium-bold text-text-primary truncate">{post.clubName}</p>
                        <p className="text-body-small text-text-tertiary">
                            {post.time} <span className="opacity-50">•</span> {post.category}
                        </p>
                    </div>
                </div>

                {/* Description - Unified expandable logic */}
                <div className="mt-md text-body-medium text-text-secondary leading-6">
                    <p className="whitespace-pre-wrap">
                        {post.text && post.text.length > 180 && !isExpanded
                            ? `${post.text.slice(0, 180).trimEnd()}...`
                            : post.text}
                    </p>
                    {post.text && post.text.length > 180 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-white opacity-80 text-[13px] font-semibold mt-1 hover:underline"
                        >
                            {isExpanded ? "See less" : "See more"}
                        </button>
                    )}
                </div>

                {/* ── Action bar ─────────────────────────────────────── */}
                {!hideActions && (
                    <>
                        <div className="mt-lg pt-md border-t border-white/10 flex items-center justify-between">
                            {/* Like */}
                    <ActionBtn
                        icon={Heart}
                        label="Like"
                        count={likes}
                        showBoth
                        activeColor="text-primary-blue"
                        active={liked}
                        fillActive={true}
                        onClick={() => { setLiked(p => !p); setLikes(n => liked ? n - 1 : n + 1); }}
                    />

                    {/* Comment */}
                    <ActionBtn
                        icon={MessageCircle}
                        label="Comment"
                        count={postComments.length}
                        showBoth
                        activeColor="text-primary-blue"
                        active={commentOpen}
                        onClick={() => setCommentOpen(o => !o)}
                    />


                    {/* Save — only visible to students */}
                    {currentUser?.role === 'STUDENT' && (
                        <ActionBtn
                            svgSrc="/icon_save_marketplace.svg"
                            label="Save"
                            activeColor="text-purple-400"
                            active={saved}
                            onClick={toggleSave}
                        />
                    )}
                </div>

                {/* ── Comment section (toggles open) ─────────────────── */}
                {commentOpen && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <CommentSection
                            postComments={postComments}
                            onAddComment={handleAddComment}
                        />
                    </div>
                )}
                    </>
                )}

                {/* Buy now */}
                {!isOwner && (
                    <div className="mt-lg pt-md border-t border-white/10 flex items-end justify-end">
                        <Button
                            variant="primary"
                            size="medium"
                            className="min-w-[160px]"
                            onClick={() => navigate(`/marketplace/club/product/${post.postType}/${post.id}`)}
                        >
                            Buy now
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ClubPostCard;
