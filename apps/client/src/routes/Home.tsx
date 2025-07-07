import { useNavigate } from 'react-router';
import { BorderedBox } from '@/components';
import {
  Text,
  Box,
  Button,
  HStack,
  Heading,
  Container,
  Flex,
  Image,
} from '@chakra-ui/react';

const HomeRoute = () => {
  const navigate = useNavigate();

  return (
    <BorderedBox>
      <Flex
        flex={1}
        height={'100%'}
        alignItems={'center'}
        flexDirection={'column'}
        justifyContent={'center'}
      >
        <Container maxWidth={'32rem'}>
          <Box>
            <Image
              p={2}
              rounded={12}
              bg={'white'}
              shadow={'xs'}
              width={'48px'}
              aspectRatio={'1/1'}
              src='/assets/images/logo-mark.svg'
            />
            <Heading
              mt={8}
              lineHeight={'short'}
              fontWeight={'semibold'}
              letterSpacing={'-0.015em'}
            >
              Maximize refunds, minimize stress—finalize your taxes in minutes.
            </Heading>
            <Text
              mt={3}
              fontSize={18}
              color={'gray.600'}
              lineHeight={'1.5em'}
              letterSpacing={'-0.01em'}
            >
              From submission to payment, we’ve got you with fast, compliant,
              and stress-free digital tax management.
            </Text>
            <HStack mt={6}>
              <Button
                rounded={16}
                fontSize={14}
                fontWeight={'semibold'}
                onClick={() => navigate('/register')}
              >
                Create an account
              </Button>
              <Button
                rounded={16}
                fontSize={14}
                fontWeight={'semibold'}
                variant={'outline'}
                onClick={() => navigate('/login')}
              >
                Pay your taxes
              </Button>
            </HStack>
          </Box>
        </Container>
      </Flex>
    </BorderedBox>
  );
};

export default HomeRoute;
