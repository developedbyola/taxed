import React from 'react';
import Cookies from 'js-cookie';
import { trpc } from '@/libs/trpc';
import { useAuth } from './Provider';
import { useDialog } from '@/components';
import { useNavigate } from 'react-router';

const useRefreshToken = () => {
  const dialog = useDialog();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const refresh = trpc.auth.refresh.useMutation({
    onError: (err) => {
      if (err.message.includes('expired')) {
        dialog.open({
          title: 'Session Expired',
          message:
            'Your session has expired. Sign in again to continue where you left off.',
          actions: [
            {
              label: 'Login',
              variant: 'solid',
              onClick: () => {
                setAuth({
                  type: 'LOGOUT',
                });
                Cookies.remove('refresh_token');
                navigate('/login', {
                  replace: true,
                });
              },
            },
          ],
        });
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
            onClick: async () => {
              const refreshToken = Cookies.get('refresh_token');
              await refresh.mutateAsync({
                refreshToken: refreshToken!,
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
