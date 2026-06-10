'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { mutationErrorDetail } from '@/lib/notify';
import { useApiToken } from '@/hooks/useApiToken';
import { useToast } from '@/context/ToastContext';

export function useDeleteAdminUserMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api(`/admin/users/${id}`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success('User deleted', 'The user account was removed.');
    },
    onError: (err) => {
      toast.error('Failed to delete user', mutationErrorDetail(err));
    },
  });
}

export function useDeleteAdminPostMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api(`/admin/posts/${id}`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post deleted', 'The post was removed from the platform.');
    },
    onError: (err) => {
      toast.error('Failed to delete post', mutationErrorDetail(err));
    },
  });
}

export function useDeleteAdminCommentMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api(`/admin/comments/${id}`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success('Comment deleted', 'The comment was removed.');
    },
    onError: (err) => {
      toast.error('Failed to delete comment', mutationErrorDetail(err));
    },
  });
}
