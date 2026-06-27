'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import UserAvatar from '@/components/ui/UserAvatar';
import VisibilityBadge from '@/components/posts/VisibilityBadge';
import { useAuth } from '@/context/AuthContext';
import {
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactPostMutation,
} from '@/hooks/mutations/usePostMutations';

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PostCard({
  post,
  showFull = false,
  profileMode = false,
  onDeleted,
}) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const updatePost = useUpdatePostMutation();
  const deletePost = useDeletePostMutation();
  const reactPost = useReactPostMutation();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const author = post.author?.name || 'Unknown';
  const authorImage = post.author?.profileImage;
  const profilePostVisibility = post.author?.privacy?.postVisibility || 'public';
  const isOwner = isLoggedIn && user?.id === post.userId;
  const commentCount = Number(post.commentCount ?? post.comments?.length ?? 0);
  const likeCount = Number(post.likeCount ?? 0);
  const dislikeCount = Number(post.dislikeCount ?? 0);
  const currentReaction = post.currentUserReaction;
  const excerpt =
    post.content?.length > 280 && !showFull
      ? `${post.content.slice(0, 280)}...`
      : post.content;

  const openEdit = () => {
    setTitle(post.title);
    setContent(post.content);
    setEditing(true);
  };

  const handleDelete = () => {
    confirmDialog({
      message: 'Delete this post permanently?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        deletePost.mutate(post.id, {
          onSuccess: () => {
            onDeleted?.();
            if (!onDeleted && !profileMode) router.push('/');
          },
        });
      },
    });
  };

  const handleSave = () => {
    updatePost.mutate(
      {
        id: post.id,
        title: title.trim(),
        content: content.trim(),
      },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleReaction = (type) => {
    reactPost.mutate({ id: post.id, type });
  };

  return (
    <article className="fb-card fb-card-hover overflow-hidden">
      <ConfirmDialog />
      <div className="flex items-center gap-3 p-4 pb-2">
        <UserAvatar name={author} image={authorImage} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-[#050505] truncate">{author}</p>
            {(profileMode || isOwner) && <VisibilityBadge visibility={profilePostVisibility} />}
          </div>
          <p className="text-xs text-[#65676b]">{formatDate(post.createdAt)}</p>
        </div>
        {profileMode && isOwner && (
          <div className="ml-auto flex gap-1">
            <Button icon="pi pi-pencil" rounded text size="small" onClick={openEdit} aria-label="Edit post" />
            <Button icon="pi pi-trash" rounded text size="small" severity="danger" onClick={handleDelete} aria-label="Delete post" />
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        {showFull ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold leading-tight text-[#050505]">{post.title}</h1>
            <VisibilityBadge visibility={profilePostVisibility} />
          </div>
        ) : (
          <Link href={`/posts/${post.id}`}>
            <h2 className="mb-2 text-[17px] font-bold leading-snug text-[#050505] hover:underline">{post.title}</h2>
          </Link>
        )}
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#050505]">{excerpt}</p>
        {!showFull && post.content?.length > 280 && (
          <Link href={`/posts/${post.id}`} className="text-[#65676b] text-sm font-semibold mt-2 inline-block">
            See more
          </Link>
        )}
      </div>

      <div className="mx-4 border-t border-[#e4e6eb] px-0 py-1">
        <div className="grid grid-cols-3 gap-1">
        <Link href={`/posts/${post.id}`} className="flex-1">
          <Button
            label={`Comments (${commentCount})`}
            icon="pi pi-comment"
            text
            className="w-full text-[#65676b]! font-semibold! hover:!bg-[#f2f3f5]"
          />
        </Link>
        <Button
          label={`Like (${likeCount})`}
          icon="pi pi-thumbs-up"
          text
          disabled={!isLoggedIn}
          loading={reactPost.isPending}
          className={`flex-1 font-semibold! ${
            currentReaction === 'like' ? 'text-[#1877f2]!' : 'text-[#65676b]!'
          } hover:!bg-[#f2f3f5]`}
          onClick={() => handleReaction('like')}
        />
        <Button
          label={`Dislike (${dislikeCount})`}
          icon="pi pi-thumbs-down"
          text
          disabled={!isLoggedIn}
          loading={reactPost.isPending}
          className={`flex-1 font-semibold! ${
            currentReaction === 'dislike' ? 'text-[#1877f2]!' : 'text-[#65676b]!'
          } hover:!bg-[#f2f3f5]`}
          onClick={() => handleReaction('dislike')}
        />
        </div>
      </div>

      <Dialog
        header="Edit post"
        visible={editing}
        onHide={() => setEditing(false)}
        className="w-full max-w-lg"
        modal
      >
        <div className="space-y-3">
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" placeholder="Title" />
          <InputTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full"
            placeholder="Content"
          />
          <p className="text-sm text-[#65676b]">
            Post privacy is managed from your profile settings.
          </p>
          <Button
            label="Save changes"
            loading={updatePost.isPending}
            onClick={handleSave}
            className="bg-[#1877f2]! border-[#1877f2]!"
          />
        </div>
      </Dialog>
    </article>
  );
}
