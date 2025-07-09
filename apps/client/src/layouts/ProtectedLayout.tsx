import React from 'react';
import Cookies from 'js-cookie';
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
    if (!auth.isPending && !auth.isAuthenticated) {
      dialog.open({
        title: 'Session Expired',
        message:
          'Your session has expired. Sign in again to continue where you left off.',
        actions: [
          {
            label: 'Login',
            variant: 'solid',
            onClick: () => {
              Cookies.remove('refresh_token');
              navigate('/login', {
                replace: true,
              });
            },
          },
        ],
      });
    }
  }, [auth.isAuthenticated, auth.isPending]);

  return (
    <Flex
      minH='100dvh'
      bg='gray.100'
      alignItems={'center'}
      flexDirection={'column'}
      justifyContent={'center'}
    >
      <Container
        px={0}
        bg='white'
        maxW='26rem'
        shadow='xs'
        rounded={24}
        overflow={'clip'}
      >
        <Flex
          height={'40rem'}
          flexDirection={'column'}
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
