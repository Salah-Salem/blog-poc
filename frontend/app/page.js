'use client';

import AppShell from '@/components/layout/AppShell';
import PostComposer from '@/components/posts/PostComposer';
import PostCard from '@/components/posts/PostCard';
import InfiniteScrollLoader from '@/components/ui/InfiniteScrollLoader';
import PageLoader from '@/components/ui/PageLoader';
import { useInfinitePostsQuery } from '@/hooks/queries/useInfinitePostsQuery';

export default function HomePage() {
  const {
    posts,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfinitePostsQuery({ limit: 5 });

  return (
    <AppShell>
      <div className="space-y-4">
        <PostComposer />

        {isLoading ? (
          <div className="fb-card">
            <PageLoader label="Loading feed..." />
          </div>
        ) : isError ? (
          <div className="fb-card p-8 text-center text-red-600">Failed to load posts.</div>
        ) : posts.length === 0 ? (
          <div className="fb-card p-8 text-center text-[#65676b]">
            No posts yet. Be the first to share something!
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <InfiniteScrollLoader
              hasMore={!!hasNextPage}
              isLoadingMore={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              showEndMessage={posts.length > 0}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
