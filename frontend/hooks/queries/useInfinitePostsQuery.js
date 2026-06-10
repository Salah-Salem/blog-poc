'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import {
  flattenPostPages,
  getLastPagination,
  getPostsNextPageParam,
} from '@/lib/infiniteQueryUtils';

export function useInfinitePostsQuery({ limit = 5, search = '', enabled = true } = {}) {
  const trimmedSearch = search.trim();

  const query = useInfiniteQuery({
    queryKey: queryKeys.posts.infiniteList(limit, trimmedSearch),
    queryFn: ({ pageParam }) =>
      api(
        `/posts?page=${pageParam}&limit=${limit}${
          trimmedSearch ? `&search=${encodeURIComponent(trimmedSearch)}` : ''
        }`
      ),
    initialPageParam: 1,
    getNextPageParam: getPostsNextPageParam,
    enabled,
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
