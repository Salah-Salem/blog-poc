'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export function useCommentsQuery(postId) {
  return useQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: async () => {
      const data = await api(`/posts/${postId}/comments`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!postId,
  });
}
