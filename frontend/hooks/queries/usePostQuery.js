'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';

export function usePostQuery(id) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.posts.detail(id), { viewerId: user?.id ?? null }],
    queryFn: async () => {
      const res = await api(`/posts/${id}`, { token: token || undefined });
      return res.data;
    },
    enabled: !!id,
  });
}
