'use client';

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import GlobalFetchIndicator from '@/components/ui/GlobalFetchIndicator';
import { makeQueryClient } from '@/lib/queryClient';

export default function Providers({ children }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider value={{ ripple: true }}>
        <ToastProvider>
          <GlobalFetchIndicator />
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </PrimeReactProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
