import React from 'react';
import { trpc } from '@/libs/trpc';
import type { Session } from '../types';
import { useDialog } from '@/components';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { UAParser } from 'ua-parser-js';

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
    <Box
      bg='gray.100'
      divideY='3px'
      divideColor='white'
      rounded={12}
    >
      {data?.sessions.map((session) => {
        const parser = new UAParser(session.userAgent);

        return (
          <Flex
            p={2}
            gap={1}
            key={session.id}
            flexDirection={'column'}
          >
            <Text>
              {parser.getBrowser().name || 'Unknown'}{' '}
              {parser.getOS().name || 'Unknown'}
            </Text>
            <Text>{session.createdAt}</Text>
            <Text>{session.lastActiveAt}</Text>
          </Flex>
        );
      })}
    </Box>
  );
};
