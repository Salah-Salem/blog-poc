'use client';

import { useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function InfiniteScrollLoader({
  hasMore,
  isLoadingMore,
  onLoadMore,
  showEndMessage = true,
  loadingLabel = 'Loading more...',
  endLabel = "You're all caught up",
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || !onLoadMore) return undefined;

    const el = sentinelRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (!hasMore) {
    if (!showEndMessage) return null;
    return (
      <div className="infinite-scroll-end">
        <span>{endLabel}</span>
      </div>
    );
  }

  return (
    <div ref={sentinelRef} className="infinite-scroll-loader" aria-live="polite">
      {isLoadingMore ? (
        <>
          <ProgressSpinner style={{ width: '32px', height: '32px' }} strokeWidth="4" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <span className="infinite-scroll-hint">Scroll for more</span>
      )}
    </div>
  );
}
