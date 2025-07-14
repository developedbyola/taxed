import React from 'react';
import { trpc } from '@/libs/trpc';
import { useUser } from './Provider';
import { Auth } from '@/features/auth';
import { useDialog } from '@/components';

const useProfile = () => {
  const dialog = useDialog();
  const { auth } = Auth.useAuth();
  const { user, setUser } = useUser();

  const profile = trpc.users.profile.useQuery(undefined, {
    enabled: auth.isAuthenticated && !user,
  });

  React.useEffect(() => {
    if (profile.status === 'success') {
      const data = profile.data as any;
      setUser({ type: 'SET_USER', payload: { user: data?.user } });
    }
    if (profile.status === 'error') {
      dialog.open({
        title: 'Unable to fetch profile',
        message: profile.error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => {
              profile.refetch();
            },
          },
        ],
      });
    }
  }, [profile.status]);

  console.log({ user, data: profile.status });
};

export const Profile = ({ children }: { children: React.ReactNode }) => {
  useProfile();

  return <React.Fragment>{children}</React.Fragment>;
};
