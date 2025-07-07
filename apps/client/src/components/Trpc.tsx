import React from 'react';
import { trpc } from '@/libs/trpc';
import { Auth } from '@/features/auth';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = Auth.useAuth();
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:4600/api/trpc',
        fetch: async (url, options) => {
          return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              ...options?.headers,
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
        },
      }),
    ],
  });

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
