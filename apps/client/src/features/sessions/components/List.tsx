import React from 'react';
import dayjs from 'dayjs';
import { trpc } from '@/libs/trpc';
import type { Session } from '../types';
import { UAParser } from 'ua-parser-js';
import { useDialog } from '@/components';
import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react';

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
      rounded={12}
      bg='gray.100'
      divideY='3px'
      overflow='clip'
      divideColor='white'
    >
      {data?.sessions.map((session) => {
        const parser = new UAParser(session.userAgent);

        return (
          <Flex
            py={3}
            px={4}
            gap={1}
            key={session.id}
            cursor={'pointer'}
            flexDirection={'column'}
            _hover={{ bg: 'gray.200' }}
            transition={'all 300ms ease-in-out'}
          >
            <Box flex={1}>
              <Heading
                lineHeight={1}
                fontSize={14}
                fontWeight={'medium'}
              >
                {`${parser.getOS().name} ${parser.getBrowser().name} ${
                  parser.getCPU().architecture
                }`}
              </Heading>
              <Text
                mt={2}
                fontSize={12}
                lineHeight={1}
                color='gray.500'
              >
                {session.ipAddress}-{' '}
                {dayjs(session.createdAt).format('DD/MM/YYYY')}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};
