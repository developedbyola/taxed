import React from 'react';
import { trpc } from '@/libs/trpc';
import { useDialog } from '@/components';
import { excerpt } from '@/utils/excerpt';
import { useNavigate } from 'react-router';
import { useTransactions } from './Provider';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

const useGetTransactions = () => {
  const dialog = useDialog();
  const { setTransactions } = useTransactions();
  const getTransactions = trpc.transactions.get.useQuery({
    pagination: {
      type: 'offset',
      page: 1,
      pageSize: 10,
    },
    sort: {
      field: 'created_at',
      direction: 'desc',
    },
  });

  React.useEffect(() => {
    if (getTransactions.status === 'success') {
      const data = getTransactions.data as any;
      setTransactions({
        type: 'SET_TRANSACTIONS',
        payload: {
          transactions: data?.transactions,
        },
      });
    }
    if (getTransactions.status === 'error') {
      dialog.open({
        title: 'Unable to fetch transactions',
        message: getTransactions.error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => getTransactions.refetch(),
          },
        ],
      });
    }
  }, [getTransactions.status]);

  return {
    isLoading: getTransactions.isLoading,
  };
};

const Loader = () => {
  return (
    <Box
      spaceY={2}
      maxW='3rem'
      mx={'auto'}
    >
      <Spinner size={'sm'} />
    </Box>
  );
};

const Empty = () => {
  const navigate = useNavigate();

  return (
    <VStack
      mt={6}
      gap={0}
    >
      {[
        { x: 8, y: 8, rotate: -6 },
        { x: 4, y: 14, rotate: -2 },
      ].map((item, index) => {
        return (
          <HStack
            gap={1}
            py={0.5}
            key={index}
            ring={'1px'}
            rounded={12}
            bg={'white'}
            ringColor={'gray.200'}
            transform={`translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`}
          >
            <Box
              ml={0.5}
              width={2.5}
              bg={'blue.500'}
              aspectRatio={1}
              rounded={'full'}
            />
            <Box
              mr={1}
              width={12}
              height={2}
              rounded={8}
              bg='gray.200'
            />
          </HStack>
        );
      })}

      <Heading
        mt={10}
        fontSize={14}
        lineHeight={1.4}
        textAlign={'center'}
      >
        No transactions found
      </Heading>
      <Text
        mt={2}
        fontSize={13}
        color='gray.500'
        textAlign={'center'}
      >
        You have not made any transactions yet
      </Text>
      <Button
        px={4}
        mt={4}
        py={1.5}
        rounded={12}
        fontSize={13}
        height={'fit'}
        variant='outline'
        colorScheme='blue'
        onClick={() => navigate('/app/pay')}
      >
        Pay tax
      </Button>
    </VStack>
  );
};

const Map = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  return (
    <Box
      spaceY={2}
      divideY={'1px'}
      divideColor={'gray.200'}
    >
      {transactions.map((transaction) => (
        <Flex
          p={1}
          gap={3.5}
          rounded={16}
          cursor={'pointer'}
          key={transaction.id}
          alignItems={'center'}
          _hover={{ bg: 'gray.100' }}
          transition={'all 0.2s ease-in-out'}
          onClick={() => navigate(`/app/transactions/${transaction.id}`)}
        >
          <Image
            p={2}
            shadow='xs'
            rounded={12}
            width={'44px'}
            aspectRatio={1}
            backgroundColor={'white'}
            src={transaction.meta.logo}
            alt={transaction.meta.title}
          />
          <Box spaceY={1.5}>
            <Text
              fontSize={14}
              lineHeight={1}
              fontWeight={'medium'}
              letterSpacing={'-0.01em'}
            >
              {transaction.meta.title} - {transaction.amount}{' '}
              {transaction.currency}
            </Text>
            <Text
              fontSize={13}
              lineHeight={1}
              color={'gray.600'}
            >
              {excerpt(transaction.meta.description, 36)}
            </Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export const List = () => {
  const { isLoading } = useGetTransactions();
  const { transactions } = useTransactions();

  if (isLoading) return <Loader />;

  if (transactions.length === 0) return <Empty />;

  return <Map />;
};
