'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';

function useAdminQuery(key, path) {
  const token = useApiToken();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api(path, { token });
      return res.data ?? res;
    },
    enabled: !!token,
  });
}

export function useAdminStatsQuery() {
  return useAdminQuery(queryKeys.admin.stats(), '/admin/stats');
}

export function useAdminUsersQuery() {
  return useAdminQuery(queryKeys.admin.users(), '/admin/users');
}

export function useAdminPostsQuery() {
  return useAdminQuery(queryKeys.admin.posts(), '/admin/posts');
}

export function useAdminCommentsQuery() {
  return useAdminQuery(queryKeys.admin.comments(), '/admin/comments');
}
