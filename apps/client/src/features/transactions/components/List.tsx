import React from 'react';
import { trpc } from '@/libs/trpc';
import { useDialog } from '@/components';
import { excerpt } from '@/utils/excerpt';
import { useNavigate } from 'react-router';
import { useTransactions } from './Provider';
import { Box, Flex, Image, Spinner, Text } from '@chakra-ui/react';

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
  return <React.Fragment></React.Fragment>;
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
