'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/posts/PostCard';
import InfiniteScrollLoader from '@/components/ui/InfiniteScrollLoader';
import PageLoader from '@/components/ui/PageLoader';
import { useInfinitePostsQuery } from '@/hooks/queries/useInfinitePostsQuery';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') || searchParams.get('search') || '';

  const [query, setQuery] = useState(initialQ);

  const {
    posts,
    pagination,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfinitePostsQuery({
    limit: 5,
    search: initialQ,
    enabled: !!initialQ.trim(),
  });

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="fb-card p-4">
          <h1 className="text-xl font-bold mb-1">Search Results</h1>
          {initialQ && pagination && (
            <p className="text-sm text-[#65676b] mb-3">
              {pagination.total} result{pagination.total !== 1 ? 's' : ''} for &quot;{initialQ}&quot;
            </p>
          )}
          <form onSubmit={onSearch} className="flex gap-2 flex-wrap">
            <InputText
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="flex-1 min-w-[200px]"
            />
            <Button type="submit" label="Search" className="!bg-[#1877f2] !border-[#1877f2]" />
            <Button type="button" label="Clear" outlined onClick={clearSearch} />
          </form>
        </div>

        {isLoading ? (
          <div className="fb-card">
            <PageLoader label="Searching..." />
          </div>
        ) : !initialQ ? (
          <div className="fb-card p-8 text-center text-[#65676b]">Enter a keyword to search posts.</div>
        ) : isError ? (
          <div className="fb-card p-8 text-center text-red-600">Search failed. Try again.</div>
        ) : posts.length === 0 ? (
          <div className="fb-card p-8 text-center text-[#65676b]">No posts match your search.</div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <InfiniteScrollLoader
              hasMore={!!hasNextPage}
              isLoadingMore={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              loadingLabel="Loading more results..."
              endLabel="No more results"
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
