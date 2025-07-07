import React from 'react';
import { BorderedBox } from '@/components';
import {
  HStack,
  Heading,
  Button,
  Container,
  Box,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router';

type Props = { title: string; description: string; children: React.ReactNode };

export const BaseLayout = ({ children, title, description }: Props) => {
  const location = useLocation();

  const to = location.pathname === '/login' ? '/register' : '/login';
  const label =
    location.pathname === '/login' ? 'Become a taxpayer' : 'Pay taxes';

  return (
    <BorderedBox
      header={
        <HStack
          flex={1}
          px={{ base: 3, sm: 5 }}
          py={{ base: 2, sm: 0 }}
          justifyContent={'space-between'}
        >
          <Heading>Taxed</Heading>
          <Link to={to}>
            <Button
              py={1.5}
              bg='white'
              rounded={12}
              fontSize={14}
              height={'fit'}
              minHeight={'fit'}
              variant={'surface'}
              fontWeight={'semibold'}
              _hover={{ bg: 'gray.50' }}
            >
              {label}
            </Button>
          </Link>
        </HStack>
      }
    >
      <VStack
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Container maxWidth={'28rem'}>
          <Box mb={8}>
            <Heading
              fontSize={'1.5rem'}
              lineHeight={'short'}
              textAlign={'center'}
              fontWeight={'semibold'}
              letterSpacing={'-0.01em'}
            >
              {title}
            </Heading>
            <Text
              mt={2}
              fontSize={'1rem'}
              color={'gray.600'}
              lineHeight={'1.5em'}
              textAlign={'center'}
              fontWeight={'normal'}
            >
              {description}
            </Text>
          </Box>
          {children}
        </Container>
      </VStack>
    </BorderedBox>
  );
};
