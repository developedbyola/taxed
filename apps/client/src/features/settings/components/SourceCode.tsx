import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

export const SourceCode = () => {
  return (
    <React.Fragment>
      <Box py={4}>
        <Box px={5}>
          <Heading letterSpacing={'-3%'}>Source Code</Heading>
          <Text
            letterSpacing={'-1%'}
            color='gray.600'
          >
            Manage your source code
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};
