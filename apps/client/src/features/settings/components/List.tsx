import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import {
  LucideCode,
  LucideCog,
  LucideCookie,
  LucideScanText,
  LucideFingerprint,
  LucideInfo,
  LucideUserCircle,
} from 'lucide-react';

const items = [
  {
    label: 'Profile',
    path: '/app/settings/profile',
    icon: <LucideUserCircle />,
  },
  {
    label: 'Account Settings',
    path: '/app/settings/account',
    icon: <LucideCog />,
  },
  {
    label: 'Password',
    path: '/app/settings/password',
    icon: <LucideFingerprint />,
  },
  {
    label: 'Source Code',
    path: '/app/settings/source-code',
    icon: <LucideCode />,
  },
  {
    label: 'Sessions',
    path: '/app/settings/sessions',
    icon: <LucideCookie />,
  },
  {
    label: 'Terms',
    path: '/app/settings/terms',
    icon: <LucideScanText />,
  },
  {
    label: 'About',
    path: '/app/settings/about',
    icon: <LucideInfo />,
  },
];

export const List = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Box py={4}>
        <Flex mx={5}>
          <Heading letterSpacing={'-3%'}>Settings</Heading>
        </Flex>

        <Box
          mx={5}
          mt={4}
          rounded={16}
          bg={'gray.100'}
          divideY={'4px'}
          overflow={'hidden'}
          divideColor={'white'}
        >
          {items.map((item) => {
            return (
              <Flex
                p={3}
                gap={4}
                cursor={'pointer'}
                alignItems={'center'}
                _hover={{ bg: 'gray.200' }}
                onClick={() => navigate(item.path)}
                transition={'all 300ms ease-in-out'}
              >
                <Icon
                  width={5}
                  height={5}
                  color={'gray.600'}
                >
                  {item.icon}
                </Icon>
                <Text
                  fontSize={14}
                  fontWeight={'medium'}
                  letterSpacing={'-1%'}
                >
                  {item.label}
                </Text>
              </Flex>
            );
          })}
        </Box>

        <Box mt={12}>
          <Heading
            fontSize={16}
            textAlign={'center'}
            letterSpacing={'-3%'}
          >
            Taxed
          </Heading>
          <Text
            mx={'auto'}
            fontSize={13}
            maxWidth={'16rem'}
            color={'gray.600'}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            Taxed is an electronic tax payment platform.
          </Text>
          <Text
            mt={5}
            mx={'auto'}
            fontSize={11}
            maxWidth={'16rem'}
            color={'gray.500'}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            &copy; {new Date().getFullYear()} Taxed. All rights reserved.
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};
