import React from 'react';
import { trpc } from '@/libs/trpc';
import type { Session } from '../types';
import { useDialog } from '@/components';
import { Box, Flex, Spinner, Text, Heading } from '@chakra-ui/react';

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

export const List = () => {
  const { status, data } = useListSessions();

  if (status === 'pending') return <Spinner mx='auto' />;

  return (
    <Box>
      {data?.sessions.map((session) => {
        return (
          <Flex key={session.id}>
            <Text>{session.userAgent}</Text>
            <Text>{session.ipAddress}</Text>
            <Text>{session.createdAt}</Text>
            <Text>{session.lastActiveAt}</Text>
          </Flex>
        );
      })}
    </Box>
  );
};
