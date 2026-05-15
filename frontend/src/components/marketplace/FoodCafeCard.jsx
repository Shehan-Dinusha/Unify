// src/components/marketplace/FoodCafeCard.jsx

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Send, ChevronLeft, ChevronRight, Zap, Heart, MessageCircle, Bookmark } from "lucide-react";
import Card from "../common/Card";
import { getImageUrl, formatTimeAgo,getAvatarUrl } from "../../utils/formatters";
import newsfeedService from "../../services/newsfeedService";
import { useSavedPosts } from "../../context/SavedPostsContext";
import { getCurrentUser } from "../../services/authService";

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
        <div className="relative w-full bg-white/5 flex justify-center items-center min-h-[200px] max-h-[600px] overflow-hidden">
            <img
                key={idx}
                src={getImageUrl(imgList[idx])}
                alt={title}
                className="w-full h-auto min-h-[200px] object-cover sm:object-contain max-h-[600px] transition-opacity duration-300"
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
const CommentSection = ({ postComments, onAddComment, loading, currentUser }) => {
    const [text, setText] = useState("");
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onAddComment(trimmed);
        setText("");
        if (inputRef.current) {
            inputRef.current.style.height = "inherit";
        }
    };

    return (
        <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {loading && (
                <div className="text-center text-text-secondary text-sm py-2">
                    Loading comments...
                </div>
            )}

            {!loading && postComments.length > 0 && (
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
                    {postComments.map((c) => (
                        <div key={c.id} className="flex gap-3 items-start">
                            <img
                                src={
                                    c.avatar && !c.avatar.includes("placehold") && !c.avatar.includes("dicebear")
                                        ? c.avatar
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || c.user || "User")}&background=2666F1&color=fff`
                                }
                                alt={c.user?.name || c.user || "User"}
                                className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mt-0.5 object-cover"
                            />
                            <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[13px] font-semibold text-text-primary">{c.user?.name || c.user || "User"}</span>
                                    <span className="text-[11px] text-text-tertiary">{c.time || "just now"}</span>
                                </div>
                                <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap break-words">{c.content || c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <img
                    src={
                        currentUser?.avatar && !currentUser.avatar.includes("placehold") && !currentUser.avatar.includes("dicebear")
                            ? currentUser.avatar
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "Me")}&background=2666F1&color=fff`
                    }
                    alt="You"
                    className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mb-1 object-cover"
                />
                <div className="flex-1 flex items-end bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-2 focus-within:border-primary-blue/50 transition-colors">
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            e.target.style.height = "inherit";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Write a comment…"
                        className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none resize-none py-1 max-h-32 scrollbar-hide"
                    />
                    <button type="submit" disabled={!text.trim()} className="text-primary-blue disabled:text-text-tertiary transition-colors p-1">
                        <Send size={18} strokeWidth={2} />
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Main Card ──────────────────────────────────────────────── */
const FoodCafeCard = ({ post, onClick }) => {
    const { toggleSavePost } = useSavedPosts();
    const currentUser = getCurrentUser();

    const [liked, setLiked] = useState(post.isLiked || false);
    const [likes, setLikes] = useState(post.likesCount || post.stats?.likes || 0);
    const [saved, setSaved] = useState(post.isSaved || false);
    const [reported, setReported] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    
    const [postComments, setPostComments] = useState(post.comments || []);
    const [commentCount, setCommentCount] = useState(post.commentsCount || post.stats?.comments || (post.comments ? post.comments.length : 0));
    const [loadingComments, setLoadingComments] = useState(false);

    const isPromoted = post.isPromoted;
    const boostMeta = post.boostMeta;
    const highlightStyle = boostMeta?.highlightStyle || "none";
    const postType = post?.postType || "normal";
    const postId = post?.id;

    // Build card border classes and styles based on highlightStyle
    const boostStyles = (() => {
        if (!isPromoted || !boostMeta) return { 
            borderClass: "border border-white/5", 
            glowStyle: {} 
        };

        switch (highlightStyle) {
            case "gold":
                return {
                    borderClass: "border-2 border-[#FBBF24] animate-pulse-slow",
                    glowStyle: { boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)" }
                };
            case "blue":
                return {
                    borderClass: "border-2 border-[#3B82F6]",
                    glowStyle: { boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)" }
                };
            case "subtle":
                return {
                    borderClass: "border-2 border-white/30",
                    glowStyle: { boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)" }
                };
            default:
                return { 
                    borderClass: "border border-white/5", 
                    glowStyle: {} 
                };
        }
    })();

    const handleToggleLike = async () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikes(wasLiked ? likes - 1 : likes + 1);

        try {
            await newsfeedService.toggleLike(postType, postId);
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setLiked(wasLiked);
            setLikes(wasLiked ? likes : likes - 1);
        }
    };

    const handleToggleSave = async () => {
        const wasSaved = saved;
        setSaved(!wasSaved);
        if (post) toggleSavePost(post);

        try {
            await newsfeedService.toggleSave(postType, postId);
        } catch (err) {
            console.error("Failed to toggle save:", err);
            setSaved(wasSaved);
            if (post) toggleSavePost(post);
        }
    };

    const handleToggleComments = async () => {
        const shouldShow = !commentOpen;
        setCommentOpen(shouldShow);

        if (shouldShow && postComments.length === 0) {
            try {
                setLoadingComments(true);
                const data = await newsfeedService.getComments(postType, postId);
                const fetchedComments = (data.comments || []).map((c) => ({
                    id: c.id,
                    user: c.user?.name || "User",
                    avatar: c.user?.avatar,
                    seed: c.user?.name || "User",
                    time: c.createdAt ? formatTimeAgo(c.createdAt) : "just now",
                    text: c.content,
                }));
                setPostComments(fetchedComments);
                setCommentCount(fetchedComments.length);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            } finally {
                setLoadingComments(false);
            }
        }
    };

    const handleAddComment = async (text) => {
        const tempComment = {
            id: `new-${Date.now()}`,
            user: currentUser?.name || "You",
            avatar: currentUser?.avatar,
            seed: currentUser?.name || "Me",
            time: "just now",
            text,
        };
        setPostComments((prev) => [...prev, tempComment]);
        setCommentCount((c) => c + 1);

        try {
            const data = await newsfeedService.addComment(postType, postId, text);
            if (data.comment) {
                const realComment = {
                    id: data.comment.id,
                    user: data.comment.user?.name || currentUser?.name || "You",
                    avatar: data.comment.user?.avatar || currentUser?.avatar,
                    seed: data.comment.user?.name || currentUser?.name || "Me",
                    time: "just now",
                    text: data.comment.content,
                };
                setPostComments((prev) =>
                    prev.map((c) => (c.id === tempComment.id ? realComment : c)),
                );
            }
        } catch (err) {
            console.error("Failed to add comment:", err);
            setPostComments((prev) => prev.filter((c) => c.id !== tempComment.id));
            setCommentCount((c) => c - 1);
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const DESCRIPTION_LIMIT = 180;
    const isLongDescription = post.description && post.description.length > DESCRIPTION_LIMIT;

    return (
        <Card variant="card" padding="p-0" className={`overflow-hidden transition-all duration-300 !border-0 ${boostStyles.borderClass}`} style={boostStyles.glowStyle} onClick={onClick}>
            {/* Image carousel */}
            <ImageCarousel images={post.images || post.image || post.coverImage} title={post.title || post.name} />

            {/* Content */}
            <div className="p-lg ">
                {/* Author row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={getAvatarUrl(post.author?.avatar, post.author?.name || post.user)}
                            alt={post.author?.name || post.user}
                            className="w-10 h-10 rounded-full border border-white/20"
                            onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, post.author?.name || post.user); }}
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

                    {/* Boost Badge */}
                    {isPromoted && (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            highlightStyle === 'gold' ? 'bg-[#FBBF24] text-black' : 
                            highlightStyle === 'blue' ? 'bg-primary-blue text-white' : 
                            'bg-white/10 text-white'
                        }`}>
                            <Zap size={10} fill="currentColor" />
                            Promoted
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="text-body-medium text-text-secondary leading-6 mb-4">
                    <p className="whitespace-pre-wrap">
                        {isLongDescription && !isExpanded
                            ? `${post.description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`
                            : post.description}
                    </p>
                    {isLongDescription && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-primary-blue hover:text-primary-blue/80 text-sm font-semibold mt-1 transition-colors"
                        >
                            {isExpanded ? "See less" : "See more"}
                        </button>
                    )}
                </div>

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
                    {currentUser?.role === 'STUDENT' && (
                        <ActionBtn
                            svgSrc="/icon_save_marketplace.svg"
                            label="Save"
                            activeColor="text-yellow-500"
                            active={saved}
                            onClick={() => setSaved(p => !p)}
                        />
                    )}
                </div>

                {/* Comment section */}
                {commentOpen && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <CommentSection 
                            postComments={postComments} 
                            onAddComment={handleAddComment} 
                            loading={loadingComments}
                            currentUser={currentUser}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default FoodCafeCard;
