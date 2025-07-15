import React from 'react';
import { trpc } from '@/libs/trpc';
import { useAuth } from './Provider';
import { useDialog } from '@/components';
import { useNavigate } from 'react-router';

const useRefreshToken = () => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onError: (err, input) => {
      if (err.message.toLowerCase().includes('sign in')) {
        dialog.open({
          title: 'Session ended',
          message: err.message,
          actions: [
            {
              label: 'Sign in',
              variant: 'solid',
              onClick: async () => {
                setAuth({ type: 'LOGOUT' });
                navigate('/login', {
                  replace: true,
                });
              },
            },
          ],
        });

        return;
      }

      dialog.open({
        title: 'Authentication failed',
        message: err.message,
        actions: [
          {
            label: 'Understood',
          },
          {
            label: 'Retry',
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
        type: 'SET_TOKENS',
        payload: {
          auth: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
          },
        },
      });
    },
  });

  const mutate = React.useCallback(() => {
    if (!auth.refreshToken) {
      setAuth({ type: 'LOGOUT' });
      return;
    }

    refresh.mutate({
      refreshToken: auth.refreshToken || '',
    });
  }, [auth.refreshToken]);

  React.useEffect(() => {
    if (auth.isLoading) {
      mutate();
    }

    const interval = setInterval(() => {
      mutate();
    }, 25 * 60 * 1000);

    return () => clearInterval(interval);
  }, [mutate, auth.isLoading]);
};

export const RefreshToken = ({ children }: { children: React.ReactNode }) => {
  useRefreshToken();

  return <React.Fragment>{children}</React.Fragment>;
};
