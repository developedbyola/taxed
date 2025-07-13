import React from 'react';
import { trpc } from '@/libs/trpc';
import { useAuth } from './Provider';
import { useDialog } from '@/components';

const useRefreshToken = () => {
  const dialog = useDialog();
  const { auth, setAuth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onError: (err, input) => {
      if (err.message.includes('expired')) {
        setAuth({
          type: 'LOGOUT',
        });
        return;
      }

      dialog.open({
        title: 'Authentication error',
        message: err.message,
        actions: [
          {
            label: 'Understood',
          },
          {
            label: 'Reload',
            variant: 'solid',
            onClick: async () => {
              await refresh.mutateAsync({
                refreshToken: input.refreshToken,
              });
            },
          },
        ],
      });
    },
    onSuccess: (data: any) => {
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
          },
        },
      });
    },
  });

  const mutate = React.useCallback(async () => {
    if (!auth?.refreshToken) {
      setAuth({
        type: 'LOGOUT',
      });

      return;
    }

    await refresh.mutateAsync({
      refreshToken: auth?.refreshToken || '',
    });
  }, []);

  React.useEffect(() => {
    mutate();

    const interval = setInterval(() => {
      mutate();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [mutate]);
};

export const RefreshToken = ({ children }: { children: React.ReactNode }) => {
  useRefreshToken();

  return <React.Fragment>{children}</React.Fragment>;
};
