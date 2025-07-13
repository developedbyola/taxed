import React from 'react';
import { Auth } from '@/features/auth';
import { Dashboard } from '@/components';
import { useDialog } from '@/components';
import { useNavigate } from 'react-router';
import { Container, Flex } from '@chakra-ui/react';

export const ProtectedLayout = () => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const { auth } = Auth.useAuth();

  React.useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated === false) {
      const title = auth.refreshToken ? 'Session Expired' : 'Signed out';
      const message = auth.refreshToken
        ? 'Your session has expired. Sign in again to continue where you left off.'
        : 'You are signed out. Please login to continue.';

      dialog.open({
        title,
        message,
        actions: [
          {
            label: 'Login',
            variant: 'solid',
            onClick: () => {
              navigate('/login', {
                replace: true,
              });
            },
          },
        ],
      });
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.refreshToken]);

  if (!auth.isAuthenticated) return null;

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
