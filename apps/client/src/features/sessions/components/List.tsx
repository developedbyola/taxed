import React from 'react';
import dayjs from 'dayjs';
import { trpc } from '@/libs/trpc';
import type { Session } from '../types';
import { UAParser } from 'ua-parser-js';
import { useDialog } from '@/components';
import { Box, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react';

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
  const parser = new UAParser(session.userAgent);
  const revoke = trpc.sessions.revoke.useMutation({
    onSuccess: () => {
      dialog.open({
        title: 'Session revoked',
        message: 'Session revoked successfully',
        actions: [
          {
            label: 'Close',
          },
        ],
      });
    },
    onError: (error) => {
      dialog.open({
        title: 'Unable to revoke session',
        message: error.message,
        actions: [
          {
            label: 'Close',
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
      onClick={() =>
        dialog.open({
          title: 'Confirm',
          message: 'Are you sure you want to end this session?',
          actions: [
            {
              label: 'Cancel',
            },
            {
              variant: 'solid',
              label: 'End session',
              onClick: () => {
                revoke.mutate({
                  sessionId: session.id,
                });
              },
            },
          ],
        })
      }
      transition={'all 300ms ease-in-out'}
    >
      <Box flex={1}>
        <Heading
          lineHeight={1}
          fontSize={14}
          fontWeight={'medium'}
        >
          {`${parser.getOS().name} ${parser.getBrowser().name} - (${
            session.ipAddress
          })`}
        </Heading>
        <Text
          mt={2}
          fontSize={12}
          lineHeight={1}
          color='gray.500'
        >
          {`Last active - ${dayjs(session.createdAt).format(
            'DD/MM/YYYY hh:mm A'
          )}`}
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
