import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useNewsFeed } from './useNewsFeed';
import SearchBar from './SearchBar';
import HighlightStats from './HighlightStats';
import PostList from './PostList';

const NewsFeed = ({ userRole = 'student' }) => {
    const ctx = useNewsFeed(userRole);

    if (ctx.skipRender) return null;

    const {
        user, canSearch,
        postRefs,
        showSearch, searchQuery, searchLoading, searchResults,
        searchInputRef,
        setSearchQuery, toggleSearch, handleSearchSelect,
        posts, loading, error, highlightCounts,
    } = ctx;

    const headerRight = canSearch ? (
        <SearchBar
            showSearch={showSearch}
            searchQuery={searchQuery}
            searchLoading={searchLoading}
            searchResults={searchResults}
            searchInputRef={searchInputRef}
            onToggle={toggleSearch}
            onChange={setSearchQuery}
            onSelectResult={handleSearchSelect}
        />
    ) : undefined;

    return (
        <MainLayout user={user} pageTitle="News Feed" verificationCount={0} headerRight={headerRight}>
            <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                <HighlightStats counts={highlightCounts} />

                <PostList
                    posts={posts}
                    loading={loading}
                    error={error}
                    onRetry={() => window.location.reload()}
                    postRefs={postRefs}
                    user={user}
                />
            </div>
        </MainLayout>
    );
};

export default NewsFeed;
