'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { AxiosError } from 'axios';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError;
              if (axiosError?.response?.status === 401) return false;
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError;
              if (axiosError?.response?.status === 401) return false;
              return failureCount < 3;
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
