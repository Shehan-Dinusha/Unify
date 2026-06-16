import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import { getCurrentUser } from '../../services/authService';
import { useNotifications } from '../../context/NotificationContext';
import { getImageUrl } from '../../utils/formatters';

const getAvatarUrl = (avatar, name) => {
  if (avatar && !avatar.includes('placehold') && !avatar.includes('dicebear')) return avatar;
  const seed = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${seed}&background=2666F1&color=fff`;
};

const normalizeNotification = (n) => {
  const typeLower = (n.type || 'general').toLowerCase();
  const actorName = n.actorName || n.actor?.name || 'User';
  const actorAvatar = getAvatarUrl(n.avatar || n.actor?.avatar, actorName);
  const referenceType = n.referenceType || null;

  let reviewAction = null;
  let reviewFeedbackAction = null;
  let metadata = null;
  let displayContent = n.content;

  if (referenceType === 'ReviewFeedback') {
    if (n.content) {
      try {
        const parsed = JSON.parse(n.content);
        if (parsed.targetId) {
          metadata = parsed;
          reviewFeedbackAction = parsed.action;
          displayContent = '';
        }
      } catch {}
    }
  } else if (referenceType === 'Review') {
    if (n.title?.includes('reviewed your business')) reviewAction = 'new';
    else if (n.title?.includes('replied to your review')) reviewAction = 'reply';
    else if (n.title?.includes('liked your review')) reviewAction = 'like';
    else if (n.title?.includes('found your review')) reviewAction = 'feedback';

    // Hide JSON metadata from display — it's only for navigation
    if (n.content) {
      try {
        const parsed = JSON.parse(n.content);
        if (parsed.targetId) {
          metadata = parsed;
          displayContent = '';
        }
      } catch {}
    }
  }

  if (referenceType === 'Follower') {
    // Content holds the aggregated follower list — hide from display
    if (n.content) {
      try {
        JSON.parse(n.content);
        displayContent = '';
      } catch {}
    }
  }

  return {
    id: n.id,
    type: typeLower,
    title: n.title,
    content: displayContent,
    time: n.time,
    isUnread: n.isUnread,
    image: n.image ? getImageUrl(n.image) : null,
    referenceId: n.referenceId || null,
    referenceType,
    avatar: actorAvatar,
    reviewAction,
    reviewFeedbackAction,
    metadata,
  };
};

const getBackendFilter = (filter) => {
  switch (filter) {
    case 'Unread': return 'unread';
    case 'Lost & Found': return 'match';
    default: return 'all';
  }
};

const BASE_FILTERS = ['All', 'Unread'];
const STUDENT_FILTERS = ['All', 'Unread', 'Lost & Found'];

export const useNotification = () => {
  const navigate = useNavigate();
  const authUser = getCurrentUser();
  const isStudent = authUser?.role === 'Student';
  const FILTERS = isStudent ? STUDENT_FILTERS : BASE_FILTERS;
  const { refreshUnreadCount } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const fetchNotifications = useCallback(async (filter = activeFilter) => {
    try {
      setLoading(true);
      setError(null);
      const backendFilter = getBackendFilter(filter);
      const data = await notificationService.getNotifications(backendFilter);
      const normalized = (data.notifications || []).map(normalizeNotification);
      setNotifications(normalized);
    } catch (err) {
      setError(err.error || err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchNotifications();
    refreshUnreadCount();
  }, [activeFilter, fetchNotifications, refreshUnreadCount]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isUnread: false } : n))
      );
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleNavigateToPost = (referenceId, referenceType, notification) => {
    if (referenceType === 'LostAndFound') {
      navigate(`/lost-and-found?view=detail&id=${referenceId}`);
    } else if (referenceType === 'Semester') {
      navigate('/student-learning');
    } else if (referenceType === 'Follower') {
      navigate('/club/followers');
    } else if (referenceType === 'Review' || referenceType === 'ReviewFeedback') {
      const user = authUser;
      if (user?.role === 'Business') {
        navigate(`/business/reviews?scrollToReview=${referenceId}`);
      } else {
        const targetId = notification?.metadata?.targetId;
        if (targetId) {
          navigate(`/marketplace/${targetId}/reviews?scrollToReview=${referenceId}`);
        } else {
          navigate('/business/reviews');
        }
      }
    } else {
      navigate('/news-feed', { state: { targetPostId: referenceId, targetPostType: referenceType } });
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const user = authUser
    ? { name: authUser.name, role: authUser.role || 'student' }
    : { name: 'Guest', role: 'student' };

  const filteredNotifications = searchQuery.trim()
    ? notifications.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

  return {
    FILTERS,
    activeFilter,
    notifications: filteredNotifications,
    loading,
    error,
    searchInputRef,
    showSearch,
    setShowSearch,
    searchQuery,
    setSearchQuery,
    unreadCount,
    user,
    fetchNotifications,
    handleFilterChange,
    handleMarkRead,
    handleNavigateToPost,
  };
};
