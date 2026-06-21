'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { mutationErrorDetail } from '@/lib/notify';
import { useApiToken } from '@/hooks/useApiToken';
import { useToast } from '@/context/ToastContext';

export function useCreatePostMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (body) => api('/posts', { method: 'POST', token, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.infiniteLists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.posts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
      toast.success('Post published', 'Your post is now live on the feed.');
    },
    onError: (err) => {
      toast.error('Failed to publish post', mutationErrorDetail(err));
    },
  });
}

export function useUpdatePostMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, ...body }) => api(`/posts/${id}`, { method: 'PUT', token, body }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.infiniteLists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post updated', 'Your changes have been saved.');
    },
    onError: (err) => {
      toast.error('Failed to update post', mutationErrorDetail(err));
    },
  });
}

export function useDeletePostMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id) => api(`/posts/${id}`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success('Post deleted', 'The post was removed successfully.');
    },
    onError: (err) => {
      toast.error('Failed to delete post', mutationErrorDetail(err));
    },
  });
}

export function useReactPostMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, type }) =>
      api(`/posts/${id}/reaction`, { method: 'POST', token, body: { type } }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
    },
    onError: (err) => {
      toast.error('Failed to update reaction', mutationErrorDetail(err));
    },
  });
}
