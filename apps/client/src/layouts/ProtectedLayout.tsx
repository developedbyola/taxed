import { Auth } from '@/features/auth';
import { Navigate } from 'react-router';
import { Dashboard } from '@/components';
import { Container, Flex } from '@chakra-ui/react';

export const ProtectedLayout = () => {
  const { auth } = Auth.useAuth();

  if (!auth.isLoading && !auth.isAuthenticated) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return (
    <Flex
      minH='100dvh'
      bg='gray.100'
      p={{ base: 0, md: 4 }}
      alignItems={'center'}
      flexDirection={'column'}
      justifyContent={'center'}
    >
      <Container
        px={0}
        bg='white'
        overflow={'clip'}
        rounded={{ base: 0, md: 24 }}
        shadow={{ base: 'none', md: 'xs' }}
        maxW={{ base: '100%', md: '26rem' }}
      >
        <Flex
          flexDirection={'column'}
          height={{ base: '100dvh', md: '46rem', lg: '48rem' }}
        >
          <Flex
            flex={1}
            bg='white'
            height={'full'}
            overflow={'scroll'}
            flexDirection={'column'}
          >
            <Dashboard.Main />
          </Flex>
          <Flex
            bg='white'
            borderTop={'1px solid'}
            flexDirection={'column'}
            borderTopColor={'gray.100'}
          >
            <Dashboard.Menubar />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
