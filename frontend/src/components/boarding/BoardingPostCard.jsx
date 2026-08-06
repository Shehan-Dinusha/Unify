import React, { useState, useRef, useEffect } from "react";
import { MapPin, Send, ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import Card from "../common/Card";
import { getImageUrl, formatTimeAgo, getAvatarUrl } from "../../utils/formatters";
import newsfeedService from "../../services/newsfeedService";
import { useSavedPosts } from "../../context/SavedPostsContext";
import { getCurrentUser } from "../../services/authService";

/* ─── Action Button ──────────────────────────────────────────── */
const ActionBtn = ({ svgSrc, icon: Icon, label, count, showBoth, activeColor = "text-primary", onClick, active, fillActive = false }) => (
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
        {showBoth ? (
            <>
                <div className="flex items-center gap-[3px]">
                    {svgSrc ? <img src={svgSrc} alt={label} className="w-5 h-5" /> : <Icon size={20} className={active && fillActive ? "fill-current" : ""} strokeWidth={active && fillActive ? 0 : 1.8} />}
                    <span className="text-[12px] font-bold leading-none">{count}</span>
                </div>
                <span className="text-[11px] leading-none font-medium">{label}</span>
            </>
        ) : (
            <>
                {svgSrc ? <img src={svgSrc} alt={label} className="w-5 h-5" /> : <Icon size={20} className={active && fillActive ? "fill-current" : ""} strokeWidth={active && fillActive ? 0 : 1.8} />}
                <span className="text-[11px] leading-none font-medium">{label}</span>
            </>
        )}
    </button>
);

/* ─── Image Carousel ─────────────────────────────────────────── */
const ImageCarousel = ({ images, title, price }) => {
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
        <div className="relative w-full bg-white/5 flex justify-center items-center min-h-[200px] max-h-[500px] overflow-hidden">
            <img
                key={idx}
                src={getImageUrl(imgList[idx])}
                alt={title}
                className="w-full h-auto min-h-[200px] object-cover sm:object-contain max-h-[500px] transition-opacity duration-300"
            />

            {/* Price pill overlay */}
            {price && (
                <div className="absolute bottom-md left-md bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-md py-sm z-10">
                    <span className="text-body-small-bold text-text-primary">{price}</span>
                </div>
            )}

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
                                <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">{c.text}</p>
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
                    <button type="submit" disabled={!text.trim()} className="text-primary disabled:text-text-tertiary transition-colors">
                        <Send size={16} strokeWidth={2} />
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Main Card ──────────────────────────────────────────────── */
const BoardingPostCard = ({ post, onClick }) => {
    const { toggleSavePost } = useSavedPosts();
    const currentUser = getCurrentUser();

    const [liked, setLiked] = useState(post.isLiked || false);
    const [likes, setLikes] = useState(post.likesCount || post.stats?.likes || 0);
    const [saved, setSaved] = useState(post.isSaved || false);
    const [boosted, setBoosted] = useState(false);
    const [reported, setReported] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [postComments, setPostComments] = useState(post.comments || []);
    const [commentCount, setCommentCount] = useState(post.commentsCount || post.stats?.comments || (post.comments ? post.comments.length : 0));
    const [loadingComments, setLoadingComments] = useState(false);

    const postType = post?.postType || "boarding";
    const postId = post?.id;

    const handleToggleLike = async () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikes(wasLiked ? Math.max(0, likes - 1) : likes + 1);

        try {
            await newsfeedService.toggleLike(postType, postId);
        } catch (err) {
            setLiked(wasLiked);
            setLikes(wasLiked ? likes : Math.max(0, likes - 1));
        }
    };

    const handleToggleSave = async () => {
        const wasSaved = saved;
        setSaved(!wasSaved);
        if (post) toggleSavePost(post);

        try {
            await newsfeedService.toggleSave(postType, postId);
        } catch (err) {
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
            setPostComments((prev) => prev.filter((c) => c.id !== tempComment.id));
            setCommentCount((c) => Math.max(0, c - 1));
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const DESCRIPTION_LIMIT = 180;
    const isLongDescription = post.description && post.description.length > DESCRIPTION_LIMIT;

    return (
        <Card variant="card" padding="p-0" className="overflow-hidden cursor-pointer group" onClick={onClick}>
            {/* Image carousel */}
            <ImageCarousel images={post.images || post.image || post.coverImage} title={post.title || post.name} price={post.price} />

            {/* Content */}
            <div className="p-lg">
                {/* Author row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={getAvatarUrl(post.author?.avatar, post.author?.name)}
                            alt={post.author?.name || post.user}
                            className="w-9 h-9 rounded-full border border-white/20 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, post.author?.name); }}
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

                {/* Location */}
                <div className="flex items-center gap-1 mb-2">
                    <MapPin size={13} className="text-text-tertiary flex-shrink-0" />
                    <span className="text-[13px] text-text-tertiary line-clamp-1">{post.location}</span>
                </div>

                {/* Description */}
                <div className="text-body-medium text-text-secondary leading-6 mb-1">
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

                {/* Gender tag */}
                <span className="inline-block mt-1 mb-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/8 border border-white/10 text-text-tertiary">
                    {post.gender}
                </span>

                {/* Action bar */}
                <div className="pt-md border-t border-white/10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <ActionBtn
                        icon={Heart}
                        label="Like"
                        count={likes}
                        showBoth
                        activeColor="text-primary-blue"
                        active={liked}
                        fillActive={true}
                        onClick={handleToggleLike}
                    />
                    <ActionBtn
                        icon={MessageCircle}
                        label="Comments"
                        count={commentCount}
                        showBoth
                        activeColor="text-primary-blue"
                        active={commentOpen}
                        onClick={handleToggleComments}
                    />
                    {/*<ActionBtn
                        svgSrc="/icon_boost_controller.svg"
                        label="Boost"
                        activeColor="text-yellow-400"
                        active={boosted}
                        onClick={() => setBoosted(p => !p)}
                    />*/}
                    {currentUser?.role === 'STUDENT' && (
                        <ActionBtn
                            svgSrc="/icon_save_marketplace.svg"
                            label="Save"
                            activeColor="text-purple-400"
                            active={saved}
                            onClick={() => setSaved(p => !p)}
                        />
                    )}
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


export default BoardingPostCard;
