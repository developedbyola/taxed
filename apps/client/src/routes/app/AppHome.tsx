import React from 'react';
import { LucideChevronRight } from 'lucide-react';
import { Box, Flex, Heading, Icon, IconButton, Text } from '@chakra-ui/react';

export const AppHomeRoute = () => {
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
        <Heading>Discover</Heading>
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
          >
            Recent payments
          </Heading>

          <IconButton
            size={'xs'}
            aspectRatio={1}
            rounded={'full'}
            variant={'ghost'}
          >
            <Icon size={'md'}>
              <LucideChevronRight />
            </Icon>
          </IconButton>
        </Flex>
      </Box>

      <Box
        my={2}
        px={5}
        spaceY={1}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Flex
            py={1}
            px={3}
            gap={5}
            key={index}
            bg='gray.50'
            rounded={10}
            cursor={'pointer'}
            _hover={{ bg: 'gray.50' }}
            justifyContent={'space-between'}
            transition={'all 0.2s ease-in-out'}
          >
            <Box spaceY={1}>
              <Text fontSize={14}>Lorem ipsum dolor sit amet consectetur.</Text>
              <Text
                fontSize={13}
                color={'gray.500'}
              >
                May 8, 2023
              </Text>
            </Box>

            <Heading
              fontSize={14}
              fontWeight={'medium'}
            >
              $100.00
            </Heading>
          </Flex>
        ))}
      </Box>
    </React.Fragment>
  );
};
