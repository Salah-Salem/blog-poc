'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';

export function usePostsQuery({ page = 1, limit = 5, search = '', enabled = true } = {}) {
  const trimmedSearch = search.trim();
  const { token, user } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.posts.list(page, limit, trimmedSearch), { viewerId: user?.id ?? null }],
    queryFn: () =>
      api(
        `/posts?page=${page}&limit=${limit}${
          trimmedSearch ? `&search=${encodeURIComponent(trimmedSearch)}` : ''
        }`,
        { token: token || undefined }
      ),
    enabled,
    placeholderData: keepPreviousData,
    select: (res) => ({
      posts: res.data ?? [],
      pagination: res.pagination ?? null,
    }),
  });
}
