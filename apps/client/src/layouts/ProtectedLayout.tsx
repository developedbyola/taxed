import React from 'react';
import { Auth } from '@/features/auth';
import { Dashboard } from '@/components';
import { Container, Flex } from '@chakra-ui/react';

export const ProtectedLayout = () => {
  const { setAuth } = Auth.useAuth();

  React.useEffect(() => {
    const accessToken = JSON.parse(
      localStorage.getItem('access_token') as string
    );
    if (accessToken) {
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: {
            accessToken,
            isAuthenticated: true,
          },
        },
      });
    }
  }, []);

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
