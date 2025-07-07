import React from 'react';
import { Transactions } from '@/features/transactions';
import { Flex, Heading } from '@chakra-ui/react';

const TransactionsRoute = () => {
  return (
    <React.Fragment>
      <Flex
        py={4}
        px={5}
      >
        <Heading>Transactions</Heading>
      </Flex>
      <Flex
        py={3}
        px={5}
        flexDirection={'column'}
      >
        <Transactions.List />
      </Flex>
    </React.Fragment>
  );
};

export default TransactionsRoute;
