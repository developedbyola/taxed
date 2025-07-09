import { Box, Flex, Icon, Image, Separator, Text } from '@chakra-ui/react';
import {
  LucideLibrary,
  LucideTicketPlus,
  LucideCog,
  LucideSparkles,
} from 'lucide-react';
import { Outlet, useMatch, useNavigate } from 'react-router';

const Items = [
  {
    name: 'Discover',
    path: '/app',
    icon: <LucideSparkles />,
  },
  {
    name: 'History',
    path: '/app/transactions',
    icon: <LucideLibrary />,
  },
  {
    name: 'Settings',
    path: '/app/settings',
    icon: <LucideCog />,
  },
  {
    name: 'Taxes',
    path: '/app/pay',
    icon: <LucideTicketPlus />,
  },
];

const WIDTH = '16rem';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      width={WIDTH}
      height='100dvh'
      bgColor='white'
      position={'fixed'}
      borderRight={'1px solid'}
      borderRightColor={'gray.100'}
    >
      <Box p={4}>
        <Image src='/assets/images/logo-full.svg' />
      </Box>
      <Separator mx={3} />

      <Box
        p={3}
        spaceY={1.5}
      >
        {Items.map((item, index) => (
          <Flex
            px={2}
            py={1.5}
            gap={2.5}
            as='button'
            key={index}
            rounded={10}
            ring={'1px'}
            width={'100%'}
            cursor={'pointer'}
            color={'gray.500'}
            alignItems={'center'}
            ringColor={'transparent'}
            transition={'all 0.2s ease-in-out'}
            onClick={() => navigate(item.path)}
            _hover={{
              color: 'gray.900',
              ringColor: 'gray.100',
              backgroundColor: 'white',
            }}
          >
            <Icon
              size={'md'}
              color={'currentColor'}
            >
              {item.icon}
            </Icon>
            <Text
              fontSize={14}
              color={'currentColor'}
              fontWeight={'medium'}
            >
              {item.name}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

const MenuItem = ({ item }: { item: (typeof Items)[0] }) => {
  const match = useMatch(item.path);
  const navigate = useNavigate();

  const isActive = match !== null;

  return (
    <Flex
      gap={1}
      as='button'
      width={'100%'}
      height={'3.5rem'}
      cursor={'pointer'}
      alignItems={'center'}
      flexDirection={'column'}
      justifyContent={'center'}
      onClick={() => navigate(item.path)}
      color={isActive ? 'gray.900' : 'gray.500'}
      _hover={{
        color: 'gray.900',
        ringColor: 'gray.100',
        backgroundColor: 'white',
      }}
    >
      <Icon size={'md'}>{item.icon}</Icon>
      <Text
        fontSize={13}
        fontWeight={'medium'}
        letterSpacing={'-3%'}
      >
        {item.name}
      </Text>
    </Flex>
  );
};

const Menubar = () => {
  return (
    <Flex
      height='64px'
      alignItems={'center'}
    >
      {Items.map((item, index) => (
        <MenuItem
          item={item}
          key={index}
        />
      ))}
    </Flex>
  );
};

const Main = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export const Dashboard = {
  Sidebar,
  Main,
  Menubar,
};
