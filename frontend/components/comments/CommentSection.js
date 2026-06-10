'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import UserAvatar from '@/components/ui/UserAvatar';
import PageLoader from '@/components/ui/PageLoader';
import { useAuth } from '@/context/AuthContext';
import { useCommentsQuery } from '@/hooks/queries/useCommentsQuery';
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from '@/hooks/mutations/useCommentMutations';

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function CommentSection({ postId }) {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { data: comments = [], isLoading, isError } = useCommentsQuery(postId);

  const createComment = useCreateCommentMutation(postId);
  const updateComment = useUpdateCommentMutation(postId);
  const deleteComment = useDeleteCommentMutation(postId);

  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const addComment = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(content.trim(), {
      onSuccess: () => setContent(''),
    });
  };

  const saveEdit = () => {
    updateComment.mutate(
      { id: editId, content: editText.trim() },
      { onSuccess: () => setEditId(null) }
    );
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: 'Delete this comment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteComment.mutate(id),
    });
  };

  const canModify = (comment) =>
    isLoggedIn && (user.id === comment.userId || isAdmin);

  return (
    <section className="fb-card p-4 mt-4">
      <ConfirmDialog />
      <h3 className="font-semibold text-[#050505] mb-4">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {isLoggedIn ? (
        <form onSubmit={addComment} className="flex gap-3 mb-4">
          <UserAvatar name={user.name} image={user.profileImage} size="normal" />
          <div className="flex-1">
            <InputTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Write a comment..."
              className="w-full !rounded-2xl !bg-[#f0f2f5]"
            />
            <Button
              type="submit"
              label="Comment"
              size="small"
              loading={createComment.isPending}
              className="mt-2 !bg-[#1877f2] !border-[#1877f2]"
              disabled={!content.trim()}
            />
          </div>
        </form>
      ) : (
        <p className="text-sm text-[#65676b] mb-4 bg-[#f0f2f5] rounded-lg p-3">
          Guests can view comments. Log in to add, edit, or delete your comments.
        </p>
      )}

      {isLoading ? (
        <PageLoader label="Loading comments..." className="!py-8" />
      ) : isError ? (
        <p className="text-red-600 text-sm">Failed to load comments.</p>
      ) : comments.length === 0 ? (
        <p className="text-[#65676b] text-sm">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => {
            const name = comment.user?.name || 'Unknown';
            const owner = user?.id === comment.userId;
            return (
              <li key={comment.id} className="flex gap-3">
                <UserAvatar name={name} image={comment.user?.profileImage} size="normal" />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2 inline-block max-w-full">
                    <p className="font-semibold text-sm text-[#050505]">{name}</p>
                    <p className="text-[#050505] text-sm whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-2 text-xs text-[#65676b] font-semibold">
                    <span>{formatDate(comment.createdAt)}</span>
                    {canModify(comment) && owner && (
                      <button type="button" onClick={() => { setEditId(comment.id); setEditText(comment.content); }}>
                        Edit
                      </button>
                    )}
                    {canModify(comment) && (
                      <button type="button" onClick={() => handleDelete(comment.id)} className="text-red-600">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog header="Edit comment" visible={!!editId} onHide={() => setEditId(null)} modal className="w-full max-w-md">
        <InputTextarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={4} className="w-full" />
        <Button
          label="Save"
          loading={updateComment.isPending}
          onClick={saveEdit}
          className="mt-3 !bg-[#1877f2] !border-[#1877f2]"
        />
      </Dialog>
    </section>
  );
}
