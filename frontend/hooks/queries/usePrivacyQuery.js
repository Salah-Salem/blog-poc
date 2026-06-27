'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useApiToken } from '@/hooks/useApiToken';

export function usePrivacyQuery() {
  const token = useApiToken();

  return useQuery({
    queryKey: queryKeys.auth.privacy,
    queryFn: () => api('/users/privacy', { token }),
    enabled: !!token,
  });
}
