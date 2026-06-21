'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { mutationErrorDetail } from '@/lib/notify';
import { useApiToken } from '@/hooks/useApiToken';
import { useToast } from '@/context/ToastContext';

export function useCreateCommentMutation(postId) {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (content) =>
      api(`/posts/${postId}/comments`, {
        method: 'POST',
        token,
        body: { content },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.comments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      toast.success('Comment added', 'Your comment was posted.');
    },
    onError: (err) => {
      toast.error('Failed to add comment', mutationErrorDetail(err));
    },
  });
}

export function useUpdateCommentMutation(postId) {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, content }) =>
      api(`/comments/${id}`, { method: 'PUT', token, body: { content } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Comment updated', 'Your comment was saved.');
    },
    onError: (err) => {
      toast.error('Failed to update comment', mutationErrorDetail(err));
    },
  });
}

export function useDeleteCommentMutation(postId) {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api(`/comments/${id}`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.comments() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      toast.success('Comment deleted', 'The comment was removed.');
    },
    onError: (err) => {
      toast.error('Failed to delete comment', mutationErrorDetail(err));
    },
  });
}
