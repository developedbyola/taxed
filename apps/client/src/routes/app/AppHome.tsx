import React from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Transactions } from '@/features/transactions';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

export const AppHomeRoute = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Home</title>
      </Helmet>

      <Flex
        py={4}
        px={5}
        top={0}
        bg={'white'}
        position={'sticky'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Heading letterSpacing={'-3%'}>Discover</Heading>
      </Flex>

      <Box my={3}>
        <Flex
          px={5}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading
            fontSize={16}
            color={'gray.600'}
            fontWeight={'medium'}
            letterSpacing={'-3%'}
          >
            Recent payments
          </Heading>

          <Button
            px={3}
            py={0.5}
            gap={0.25}
            rounded={12}
            height={'fit'}
            fontSize={12}
            variant={'outline'}
            onClick={() => navigate('/app/transactions')}
          >
            All
          </Button>
        </Flex>
        <Box
          px={5}
          mt={3}
        >
          <Transactions.List />
        </Box>
      </Box>
    </React.Fragment>
  );
};
