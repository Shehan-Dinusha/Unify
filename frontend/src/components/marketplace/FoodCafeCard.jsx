// src/components/marketplace/FoodCafeCard.jsx

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Send, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import { getImageUrl } from "../../utils/formatters";

/* ─── Action Button ──────────────────────────────────────────── */
const ActionBtn = ({ svgSrc, label, count, showCount, activeColor = "text-primary", onClick, active }) => (
    <button
        onClick={onClick}
        className={`
            flex flex-col items-center gap-[3px] px-3 py-2 rounded-xl
            transition-all duration-150 select-none active:scale-95 active:brightness-90
            ${active
                ? `${activeColor} bg-white/10`
                : "text-text-tertiary hover:text-text-primary hover:bg-white/5"
            }
        `}
    >
        <div className="flex items-center gap-[3px]">
            <img src={svgSrc} alt={label} className={`w-5 h-5 ${active ? "brightness-125" : ""}`} />
            {showCount && <span className="text-[12px] font-bold leading-none">{count}</span>}
        </div>
        <span className="text-[11px] leading-none font-medium">{label}</span>
    </button>
);

/* ─── Image Carousel ─────────────────────────────────────────── */
const ImageCarousel = ({ images, title }) => {
    const [idx, setIdx] = useState(0);
    const imgList = Array.isArray(images) ? images : [images].filter(Boolean);
    
    if (imgList.length === 0) return (
        <div className="w-full h-[320px] bg-white/5 flex items-center justify-center">
            <p className="text-text-tertiary">No image available</p>
        </div>
    );

    const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + imgList.length) % imgList.length); };
    const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % imgList.length); };

    return (
        <div className="relative w-full h-[320px] bg-white/5 overflow-hidden">
            <img
                key={idx}
                src={getImageUrl(imgList[idx])}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Nav arrows */}
            {imgList.length > 1 && (
                <>
                    <button onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all z-20">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all z-20">
                        <ChevronRight size={18} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {imgList.map((_, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/40"}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Comment Section ────────────────────────────────────────── */
const CommentSection = ({ postComments, onAddComment }) => {
    const [text, setText] = useState("");
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onAddComment(trimmed);
        setText("");
    };

    return (
        <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4">
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
                    <button type="submit" disabled={!text.trim()} className="text-primary-blue disabled:text-text-tertiary transition-colors">
                        <Send size={16} strokeWidth={2} />
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Main Card ──────────────────────────────────────────────── */
const FoodCafeCard = ({ post, onClick }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likesCount || post.stats?.likes || 0);
    const [saved, setSaved] = useState(false);
    const [reported, setReported] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [postComments, setPostComments] = useState(post.comments || []);

    const handleAddComment = (text) => {
        setPostComments(prev => [...prev, {
            id: `new-${Date.now()}`, user: "You", seed: "Me", time: "just now", text,
        }]);
    };

    return (
        <Card variant="card" padding="p-0" className="overflow-hidden" onClick={onClick}>
            {/* Image carousel */}
            <ImageCarousel images={post.images || post.image || post.coverImage} title={post.title || post.name} />

            {/* Content */}
            <div className="p-lg ">
                {/* Author row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.author?.name || post.userSeed || "user")}`}
                            alt={post.author?.name || post.user}
                            className="w-10 h-10 rounded-full border border-white/20"
                        />
                        <div>
                            <p className="text-body-medium-bold text-text-primary group-hover:text-primary-blue transition-colors font-bold">
                                {post.author?.name || post.user || "Anonymous"}
                            </p>
                            <p className="text-body-small text-text-tertiary">
                                {post.time || "Recently"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Title 
                <h3 className="text-heading-small text-text-primary mb-1 group-hover:text-primary-blue transition-colors font-bold">{post.title}</h3>
                */}
                {/* Location 
                <div className="flex items-center gap-1 mb-2">
                    <MapPin size={14} className="text-text-tertiary flex-shrink-0" />
                    <span className="text-[14px] text-text-tertiary line-clamp-1">{post.location}</span>
                </div>*/}

                {/* Description */}
                <p className="text-body-medium text-text-secondary leading-6 mb-4 line-clamp-2">
                    {post.description}
                </p>

                {/* Action bar */}
                <div className="pt-md border-t border-white/10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <ActionBtn
                        svgSrc="/icon_like_marketplace.svg"
                        label="Like"
                        count={likes}
                        showCount
                        activeColor="text-red-500"
                        active={liked}
                        onClick={() => { setLiked(p => !p); setLikes(n => liked ? n - 1 : n + 1); }}
                    />
                    <ActionBtn
                        svgSrc="/icon_comment_marketplace.svg"
                        label="Comments"
                        count={postComments.length}
                        showCount
                        activeColor="text-blue-500"
                        active={commentOpen}
                        onClick={() => setCommentOpen(o => !o)}
                    />
                    <ActionBtn
                        svgSrc="/icon_save_marketplace.svg"
                        label="Save"
                        activeColor="text-yellow-500"
                        active={saved}
                        onClick={() => setSaved(p => !p)}
                    />
                    <ActionBtn
                        svgSrc="/icon_report_marketplace.svg"
                        label="Report"
                        activeColor="text-orange-500"
                        active={reported}
                        onClick={() => setReported(p => !p)}
                    />
                </div>

                {/* Comment section */}
                {commentOpen && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <CommentSection postComments={postComments} onAddComment={handleAddComment} />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FoodCafeCard;
