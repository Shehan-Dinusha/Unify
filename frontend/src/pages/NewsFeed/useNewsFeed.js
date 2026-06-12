import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import postService from '../../services/postService';
import newsfeedService from '../../services/newsfeedService';
import { searchProfiles } from '../../services/searchService';

export const useNewsFeed = (userRole = 'student') => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = getCurrentUser();

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    const postRefs = useRef({});
    const searchInputRef = useRef(null);
    const searchTimerRef = useRef(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightCounts, setHighlightCounts] = useState({ announcements: 0, marketplace: 0, events: 0 });

    const role = currentUser?.role?.toLowerCase() || userRole;
    const canSearch = currentUser?.role === 'Student' || currentUser?.role === 'Club';
    const user = {
        name: currentUser?.name || 'Unknown User',
        role: role,
        avatar: currentUser?.avatar,
        ...(role === 'business' ? { displayRole: 'Business & Organization' } : {}),
    };

    useEffect(() => {
        const fetchFeedAndHighlights = async () => {
            try {
                setLoading(true);
                const [feedData, events, marketplace, announcements] = await Promise.all([
                    postService.getFeed('all'),
                    newsfeedService.getEventsToday().catch(() => ({ events: [] })),
                    newsfeedService.getMarketplaceItemsToday().catch(() => ({ items: [] })),
                    newsfeedService.getNewAnnouncements().catch(() => ({ announcements: [] })),
                ]);
                setPosts(feedData.feed);
                setHighlightCounts({
                    events: events.events?.length || 0,
                    marketplace: marketplace.items?.length || 0,
                    announcements: announcements.announcements?.length || 0,
                });
            } catch (err) {
                setError(err.error || 'Failed to load feed');
            } finally {
                setLoading(false);
            }
        };
        fetchFeedAndHighlights();
    }, []);

    useEffect(() => {
        if (location.state?.targetPostId && posts.length > 0) {
            const targetId = location.state.targetPostId;
            const targetType = location.state.targetPostType;
            const refKey = targetType ? `${targetType}-${targetId}` : targetId;
            const targetRef = postRefs.current[refKey];
            if (targetRef) {
                setTimeout(() => targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        }
    }, [location.state, posts]);

    useEffect(() => {
        if (showSearch && searchInputRef.current) searchInputRef.current.focus();
    }, [showSearch]);

    useEffect(() => {
        if (showSearch && searchQuery.trim().length >= 2) {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(async () => {
                setSearchLoading(true);
                try {
                    const res = await searchProfiles(searchQuery.trim());
                    setSearchResults(res.data || []);
                } catch {
                    setSearchResults([]);
                } finally {
                    setSearchLoading(false);
                }
            }, 300);
        } else {
            setSearchResults([]);
        }
        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery, showSearch]);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showSearch) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const handleSearchSelect = (result) => {
        navigate(`/profile/${result.id}`);
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    if (!currentUser) return { skipRender: true };

    return {
        skipRender: false,
        navigate, user, canSearch,
        postRefs, searchInputRef,
        showSearch, searchQuery, searchLoading, searchResults,
        setSearchQuery, toggleSearch, handleSearchSelect,
        posts, loading, error, highlightCounts,
    };
};
