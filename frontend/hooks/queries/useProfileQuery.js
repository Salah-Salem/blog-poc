'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';

export function useProfileQuery() {
  const token = useApiToken();

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => api('/users/profile', { token }),
    enabled: !!token,
  });
}
