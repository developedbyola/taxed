import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Tooltip,
  SegmentGroup,
  Tabs,
} from '@chakra-ui/react';
import Taxes from '@/data/Taxes.json';
import { useNavigate } from 'react-router';
import { LucideBadgeInfo } from 'lucide-react';

export const List = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('federal');

  return (
    <React.Fragment>
      <Box
        py={4}
        px={5}
      >
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Heading letterSpacing={'-3%'}>Pay</Heading>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <IconButton
                unstyled
                size={'xs'}
                rounded={'full'}
                color={'gray.500'}
                cursor={'pointer'}
                _hover={{ color: 'gray.900' }}
              >
                <Icon>
                  <LucideBadgeInfo size={20} />
                </Icon>
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content
                px={4}
                py={3}
                rounded={18}
                maxW={'18rem'}
                bg={'gray.800'}
                backdropFilter={'blur(8px)'}
              >
                <Text
                  fontSize={13}
                  color={'white'}
                >
                  Taxes are grouped into four sections. Choose any section to
                  view the taxes in that section and make payment.
                </Text>
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </Flex>
      </Box>

      <Box py={3}>
        <Box mx={5}>
          <SegmentGroup.Root
            rounded={32}
            width={'full'}
            value={value}
            onValueChange={(group) => setValue(group.value!)}
          >
            <SegmentGroup.Indicator
              rounded={32}
              bg={'white'}
            />
            <SegmentGroup.Items
              style={{
                width: '100%',
                height: '2rem',
                cursor: 'pointer',
                fontWeight: 'medium',
                letterSpacing: '-1%',
                textTransform: 'capitalize',
              }}
              items={Object.keys(Taxes).map((key) => key)}
            />
          </SegmentGroup.Root>
        </Box>
        <Box
          mx={5}
          mt={4}
          rounded={16}
          bg={'gray.100'}
          overflow={'hidden'}
        >
          <Tabs.Root
            value={value}
            spaceY={1}
            onValueChange={(group) => setValue(group.value!)}
          >
            {Object.keys(Taxes).map((key) => (
              <Tabs.Content
                p={0}
                key={key}
                value={key}
                divideY={'3px'}
                divideColor={'white'}
              >
                {Taxes[key as keyof typeof Taxes].map((tax) => (
                  <Flex
                    px={4}
                    py={2}
                    key={tax.name}
                    width={'full'}
                    cursor={'pointer'}
                    alignItems={'start'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    transition={'all 400ms ease-in-out'}
                    _hover={{ backgroundColor: 'gray.200' }}
                    onClick={() => navigate(`/app/pay/${key}?taxId=${tax.id}`)}
                  >
                    <Text
                      fontSize={14}
                      textAlign={'left'}
                      fontWeight={'medium'}
                      letterSpacing={'-1%'}
                    >
                      {tax.name}
                    </Text>
                    <Text
                      fontSize={13}
                      textAlign={'left'}
                      color={'gray.600'}
                      letterSpacing={'-1%'}
                    >
                      {tax.description}
                    </Text>
                  </Flex>
                ))}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Box>
    </React.Fragment>
  );
};
