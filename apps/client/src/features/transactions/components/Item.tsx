import React from 'react';
import { trpc } from '@/libs/trpc';
import { useParams } from 'react-router';
import { useDialog } from '@/components';
import {
  Box,
  Heading,
  Image,
  Separator,
  Spinner,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import type { Transaction } from './Provider';
import dayjs from 'dayjs';

const useGetTransaction = () => {
  const dialog = useDialog();
  const { id } = useParams<{ id: string }>();

  const transaction = trpc.transactions.getById.useQuery({
    transactionId: id || '',
  });

  React.useEffect(() => {
    if (transaction.status === 'error') {
      dialog.open({
        title: 'Unable to fetch transaction',
        message: transaction.error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => transaction.refetch(),
          },
        ],
      });
    }
  }, [transaction.status]);

  return {
    isLoading: transaction.isLoading,
    data: ((transaction.data as any)?.transaction as Transaction) || null,
  };
};

export const Item = () => {
  const { data, isLoading } = useGetTransaction();

  if (isLoading) {
    return (
      <VStack
        mt={6}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Spinner size={'md'} />
      </VStack>
    );
  }

  if (!data) {
    return (
      <VStack
        mt={6}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text>No transaction found</Text>
      </VStack>
    );
  }

  return (
    <React.Fragment>
      <Box py={4}>
        <Box
          px={5}
          mt={12}
        >
          <Image
            p={4}
            mx='auto'
            ring={'1px'}
            rounded={20}
            width={'8rem'}
            aspectRatio={1}
            src={data.meta.logo}
            alt={data.meta.title}
            ringColor={'gray.200'}
          />
        </Box>

        <Box px={5}>
          <Heading
            mt={3}
            mx={'auto'}
            fontSize={16}
            maxW={'18rem'}
            textAlign={'center'}
            fontWeight={'medium'}
            letterSpacing={'-1%'}
          >
            {data.meta.title}
          </Heading>

          <Text
            mx={'auto'}
            fontSize={14}
            maxW={'21rem'}
            color={'gray.600'}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            {data.meta.description}
          </Text>
        </Box>

        <Separator my={6} />

        <Flex
          px={5}
          gap={6}
          flexWrap={'wrap'}
          justifyContent={'space-between'}
        >
          <Flex
            w={'10rem'}
            textAlign={'left'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Amount
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
            >
              {data.amount} {data.currency}
            </Text>
          </Flex>
          <Flex
            w={'10rem'}
            textAlign={'right'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Date
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
            >
              {dayjs(data.createdAt).format('DD MMM YYYY')}
            </Text>
          </Flex>
          <Flex
            w={'10rem'}
            textAlign={'left'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Name
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
              textTransform={'capitalize'}
            >
              {data.customer.name}
            </Text>
          </Flex>
          <Flex
            w={'10rem'}
            textAlign={'right'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Company code
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
            >
              {data.companyCode}
            </Text>
          </Flex>
          <Flex
            w={'10rem'}
            textAlign={'left'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Transaction ID
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
              textTransform={'capitalize'}
            >
              {data.txId}
            </Text>
          </Flex>
          <Flex
            w={'10rem'}
            textAlign={'right'}
            flexDirection={'column'}
          >
            <Text
              fontSize={12}
              color={'gray.500'}
            >
              Status
            </Text>
            <Text
              fontSize={14}
              fontWeight={'medium'}
              textTransform={'capitalize'}
            >
              {data.status}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};
