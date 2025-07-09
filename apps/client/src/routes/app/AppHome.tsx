import React from 'react';
import { LucideChevronRight } from 'lucide-react';
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { Transactions } from '@/features/transactions';
import { useNavigate } from 'react-router';

export const AppHomeRoute = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
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

          <IconButton
            size={'xs'}
            aspectRatio={1}
            rounded={'full'}
            variant={'ghost'}
            onClick={() => navigate('/app/transactions')}
          >
            <Icon size={'md'}>
              <LucideChevronRight />
            </Icon>
          </IconButton>
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
