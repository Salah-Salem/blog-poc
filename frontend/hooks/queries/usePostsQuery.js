'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export function usePostsQuery({ page = 1, limit = 5, search = '', enabled = true } = {}) {
  const trimmedSearch = search.trim();

  return useQuery({
    queryKey: queryKeys.posts.list(page, limit, trimmedSearch),
    queryFn: () =>
      api(
        `/posts?page=${page}&limit=${limit}${
          trimmedSearch ? `&search=${encodeURIComponent(trimmedSearch)}` : ''
        }`
      ),
    enabled,
    placeholderData: keepPreviousData,
    select: (res) => ({
      posts: res.data ?? [],
      pagination: res.pagination ?? null,
    }),
  });
}
