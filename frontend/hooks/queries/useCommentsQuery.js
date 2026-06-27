'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';

export function useCommentsQuery(postId) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.posts.comments(postId), { viewerId: user?.id ?? null }],
    queryFn: async () => {
      const data = await api(`/posts/${postId}/comments`, { token: token || undefined });
      return Array.isArray(data) ? data : [];
    },
    enabled: !!postId,
  });
}
