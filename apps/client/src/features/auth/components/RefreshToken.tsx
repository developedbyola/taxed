import React from 'react';
import Cookies from 'js-cookie';
import { trpc } from '@/libs/trpc';
import { useAuth } from './Provider';
import { useDialog } from '@/components';

const useRefreshToken = () => {
  const dialog = useDialog();
  const { setAuth } = useAuth();

  const refresh = trpc.auth.refresh.useMutation({
    onError: (err, data) => {
      if (err.message.includes('expired')) {
        setAuth({
          type: 'LOGOUT',
        });
        return;
      }

      dialog.open({
        title: 'Connection error',
        message: err.message,
        actions: [
          {
            label: 'OK',
          },
          {
            label: 'Reload',
            variant: 'solid',
            onClick: async () => {
              await refresh.mutateAsync({
                refreshToken: data.refreshToken,
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
            isPending: false,
            accessToken: data?.accessToken,
            isAuthenticated: true,
          },
        },
      });
      Cookies.set('refresh_token', data?.refreshToken, {
        expires: 30,
        secure: false,
        httpOnly: false,
        sameSite: 'Lax',
      });
    },
  });

  const mutate = React.useCallback(async () => {
    const refreshToken = Cookies.get('refresh_token');

    await refresh.mutateAsync({
      refreshToken: refreshToken!,
    });
  }, []);

  React.useEffect(() => {
    mutate();

    const interval = setInterval(() => mutate(), 30 * 60 * 1000); // 30 minutes;
    return () => clearInterval(interval);
  }, [mutate]);
};

export const RefreshToken = ({ children }: { children: React.ReactNode }) => {
  useRefreshToken();

  return <React.Fragment>{children}</React.Fragment>;
};
