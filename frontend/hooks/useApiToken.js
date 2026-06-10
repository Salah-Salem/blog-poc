'use client';

import { useAuth } from '@/context/AuthContext';

export function useApiToken() {
  const { token } = useAuth();
  return token;
}
