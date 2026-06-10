'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';

export function usePostQuery(id) {
  const token = useApiToken();

  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      const res = await api(`/posts/${id}`, { token: token || undefined });
      return res.data;
    },
    enabled: !!id,
  });
}
