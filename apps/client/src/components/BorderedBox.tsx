import { Box, Container, Flex } from '@chakra-ui/react';
import type React from 'react';

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
};

const GAPS = {
  x: [0, 32, 64, 144], // Responsive values for horizontal padding [base, sm, md, lg, xl]
  y: [0, 16, 32, 48], // Responsive values for vertical padding [base, sm, md, lg, xl]
};

export const BorderedBox = ({ children, header }: Props) => {
  return (
    <Box
      bg={'gray.50'}
      minHeight={'100dvh'}
    >
      {/* horizontal lines */}
      <Flex
        py={1.5}
        width={'full'}
        zIndex={1}
        flexDirection={'column'}
        px={{
          base: `${GAPS.x[0]}px`,
          sm: `${GAPS.x[1]}px`,
          md: `${GAPS.x[2]}px`,
          lg: `${GAPS.x[3]}px`,
          xl: `${GAPS.x[4]}px`,
        }}
        position={'fixed'}
        maxWidth={'100%'}
        _before={{
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          top: {
            lg: `${GAPS.y[3] - 1}px`,
            xl: `${GAPS.y[4] - 1}px`,
          },
          width: '100%',
          height: '1px',
          content: '""',
          bg: 'gray.200',
          position: 'fixed',
          display: { base: 'none', lg: 'block' },
        }}
        _after={{
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          width: '100%',
          height: '1px',
          content: '""',
          bg: 'gray.200',
          position: 'fixed',
          display: { base: 'none', lg: 'block' },
          top: {
            lg: `calc(100% - ${GAPS.y[3] - 0}px)`,
            xl: `calc(100% - ${GAPS.y[4] - 0}px)`,
          },
        }}
      >
        {header}
      </Flex>
      {/* vertical lines */}
      <Box
        minHeight={'100dvh'}
        position={'fixed'}
        _before={{
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          width: '1px',
          left: {
            lg: `${GAPS.x[3] - 1}px`,
            xl: `${GAPS.x[4] - 1}px`,
          },
          content: '""',
          bg: 'gray.200',
          height: '100dvh',
          position: 'fixed',
          display: { base: 'none', lg: 'block' },
        }}
        _after={{
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          width: '1px',
          content: '""',
          height: '100%',
          bg: 'gray.200',
          position: 'fixed',
          display: { base: 'none', lg: 'block' },
          left: {
            lg: `calc(100% - ${GAPS.x[3] - 0}px)`,
            xl: `calc(100% - ${GAPS.x[4] - 0}px)`,
          },
        }}
      />

      <Container
        px={{
          base: 0,
          lg: `${GAPS.x[3]}px`,
          xl: `${GAPS.x[4]}px`,
        }}
        py={{
          base: 0,
          lg: `${GAPS.y[3]}px`,
          xl: `${GAPS.y[4]}px`,
        }}
        maxWidth={'full'}
      >
        <Flex
          bg={'white'}
          flexDirection={'column'}
          minHeight={{
            base: `calc(100dvh - ${GAPS.y[0] * 2}px)`,
            lg: `calc(100dvh - ${GAPS.y[3] * 2}px)`,
            xl: `calc(100dvh - ${GAPS.y[4] * 2}px)`,
          }}
        >
          {children}
        </Flex>
      </Container>
    </Box>
  );
};
