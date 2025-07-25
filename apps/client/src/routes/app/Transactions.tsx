import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { Transactions } from '@/features/transactions';

const TransactionsRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Transactions</title>
      </Helmet>
      <Box py={4}>
        <Flex px={5}>
          <Heading letterSpacing={'-3%'}>Transactions</Heading>
        </Flex>
        <Flex
          mt={4}
          px={5}
          flexDirection={'column'}
        >
          <Transactions.List />
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default TransactionsRoute;
