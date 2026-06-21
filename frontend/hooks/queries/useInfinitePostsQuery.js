'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import {
  flattenPostPages,
  getLastPagination,
  getPostsNextPageParam,
} from '@/lib/infiniteQueryUtils';

export function useInfinitePostsQuery({ limit = 5, search = '', enabled = true } = {}) {
  const trimmedSearch = search.trim();
  const { token, user } = useAuth();

  const query = useInfiniteQuery({
    queryKey: [...queryKeys.posts.infiniteList(limit, trimmedSearch), { viewerId: user?.id ?? null }],
    queryFn: ({ pageParam }) =>
      api(
        `/posts?page=${pageParam}&limit=${limit}${
          trimmedSearch ? `&search=${encodeURIComponent(trimmedSearch)}` : ''
        }`,
        { token: token || undefined }
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
