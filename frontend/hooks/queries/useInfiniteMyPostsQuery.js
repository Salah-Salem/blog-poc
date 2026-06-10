'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';
import {
  flattenPostPages,
  getLastPagination,
  getPostsNextPageParam,
} from '@/lib/infiniteQueryUtils';

export function useInfiniteMyPostsQuery({ limit = 5 } = {}) {
  const token = useApiToken();

  const query = useInfiniteQuery({
    queryKey: queryKeys.posts.infiniteMine(limit),
    queryFn: ({ pageParam }) =>
      api(`/users/me/posts?page=${pageParam}&limit=${limit}`, { token }),
    initialPageParam: 1,
    getNextPageParam: getPostsNextPageParam,
    enabled: !!token,
    select: (data) => ({
      pages: data.pages.map((res) => ({
        posts: res.data ?? [],
        pagination: res.pagination ?? null,
      })),
      pageParams: data.pageParams,
    }),
  });

  return {
    ...query,
    posts: flattenPostPages(query.data),
    pagination: getLastPagination(query.data),
  };
}
