'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/posts/PostCard';
import CommentSection from '@/components/comments/CommentSection';
import PageLoader from '@/components/ui/PageLoader';
import { usePostQuery } from '@/hooks/queries/usePostQuery';

export default function PostDetailPage() {
  const { id } = useParams();
  const { data: post, isLoading, isError, error } = usePostQuery(id);

  return (
    <AppShell>
      <Link href="/" className="inline-flex items-center gap-2 text-[#1877f2] font-semibold text-sm mb-3 hover:underline">
        <i className="pi pi-arrow-left" /> Back to feed
      </Link>

      {isLoading ? (
        <div className="fb-card">
          <PageLoader label="Loading post..." />
        </div>
      ) : isError ? (
        <div className="fb-card p-8 text-center text-red-600">{error?.message || 'Post not found'}</div>
      ) : (
        <>
          <PostCard post={post} showFull />
          <CommentSection postId={post.id} />
        </>
      )}
    </AppShell>
  );
}
