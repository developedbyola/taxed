import React from 'react';
import dayjs from 'dayjs';
import { trpc } from '@/libs/trpc';
import { Auth } from '@/features/auth';
import type { Session } from '../types';
import { UAParser } from 'ua-parser-js';
import { useDialog } from '@/components';
import { useNavigate } from 'react-router';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react';

dayjs.extend(relativeTime);

const useListSessions = () => {
  const dialog = useDialog();
  const list = trpc.sessions.list.useQuery();

  React.useEffect(() => {
    if (list.status === 'error') {
      dialog.open({
        title: 'Unable to fetch sessions',
        message: list.error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => list.refetch(),
          },
        ],
      });
    }
  }, [list.status]);

  return { status: list.status, data: list.data as { sessions: Session[] } };
};

const Item = ({ session }: { session: Session }) => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const { auth, setAuth } = Auth.useAuth();
  const parser = new UAParser(session.userAgent);
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      dialog.open({
        title: 'Session ended',
        message:
          'Your session has ended. Sign in again to continue where you left off.',
        actions: [
          {
            label: 'Sign in',
            variant: 'solid',
            onClick: () => {
              setAuth({ type: 'LOGOUT' });
              navigate('/login', { replace: true });
            },
          },
        ],
      });
    },
    onError: (error, input) => {
      dialog.open({
        title: 'Unable to end session',
        message: error.message,
        actions: [
          {
            label: 'Understood',
          },
          {
            variant: 'solid',
            label: 'Retry',
            onClick: () => logout.mutate({ refreshToken: input.refreshToken }),
          },
        ],
      });
    },
  });
  const revoke = trpc.sessions.revoke.useMutation({
    onSuccess: () => {
      dialog.open({
        title: 'Session revoked',
        message: 'Session revoked successfully',
        actions: [
          {
            label: 'Understood',
          },
        ],
      });
    },
    onError: (error, input) => {
      dialog.open({
        title: 'Unable to revoke session',
        message: error.message,
        actions: [
          {
            label: 'Understood',
          },
          {
            variant: 'solid',
            label: 'Retry',
            onClick: () => revoke.mutate({ sessionId: input.sessionId }),
          },
        ],
      });
    },
  });

  return (
    <Flex
      py={3}
      px={4}
      gap={1}
      key={session.id}
      cursor={'pointer'}
      flexDirection={'column'}
      _hover={{ bg: 'gray.200' }}
      onClick={() => {
        if (session.isCurrent) {
          dialog.open({
            title: 'Sign out',
            message: 'Are you sure you want to sign out of this device?',
            actions: [
              {
                label: 'Cancel',
              },
              {
                variant: 'solid',
                label: "Yes, I'm sure",
                onClick: () => {
                  logout.mutate({
                    refreshToken: auth?.refreshToken!,
                  });
                },
              },
            ],
          });
        } else if (session.revoked) {
          dialog.open({
            title: 'Session revoked',
            message: 'Session revoked successfully',
            actions: [
              {
                label: 'Understood',
              },
            ],
          });
        } else {
          dialog.open({
            title: 'End session',
            message: 'Are you sure you want to end this session?',
            actions: [
              {
                label: 'Cancel',
              },
              {
                variant: 'solid',
                label: "Yes, I'm sure",
                onClick: () => {
                  revoke.mutate({
                    sessionId: session.id,
                  });
                },
              },
            ],
          });
        }
      }}
      transition={'all 300ms ease-in-out'}
    >
      <Box flex={1}>
        <Heading
          fontSize={13}
          lineHeight={1.2}
          fontWeight={'medium'}
        >
          <Text
            as='span'
            color={session.revoked ? 'red.600' : 'green.600'}
          >
            {session.revoked ? 'Inactive' : 'Active'}
          </Text>
          {` - ${parser.getOS().name} (${parser.getBrowser().name})`}
        </Heading>
        <Text
          mt={1}
          fontSize={12}
          lineHeight={1.4}
          color='gray.500'
        >
          {`${session.isCurrent ? '(Current)' : ''} ${dayjs(
            session.lastActiveAt
          ).fromNow()}`}
        </Text>
      </Box>
    </Flex>
  );
};

export const List = () => {
  const { status, data } = useListSessions();

  if (status === 'pending')
    return (
      <VStack>
        <Spinner />
      </VStack>
    );

  return (
    <Box
      rounded={12}
      bg='gray.100'
      divideY='3px'
      overflow='clip'
      divideColor='white'
    >
      {data?.sessions.map((session) => {
        return (
          <Item
            session={session}
            key={session.id}
          />
        );
      })}
    </Box>
  );
};
