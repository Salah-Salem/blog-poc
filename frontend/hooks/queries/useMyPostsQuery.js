'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';

export function useMyPostsQuery({ page = 1, limit = 5 } = {}) {
  const token = useApiToken();

  return useQuery({
    queryKey: queryKeys.posts.mine(page, limit),
    queryFn: () => api(`/users/me/posts?page=${page}&limit=${limit}`, { token }),
    enabled: !!token,
    placeholderData: keepPreviousData,
    select: (res) => ({
      posts: res.data ?? [],
      pagination: res.pagination ?? null,
    }),
  });
}
