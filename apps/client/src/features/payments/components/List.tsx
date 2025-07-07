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
import { LucideMessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

export const List = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('federal');

  return (
    <React.Fragment>
      <Box
        my={4}
        px={5}
      >
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Heading>Pay</Heading>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <IconButton
                size={'xs'}
                rounded={'full'}
                variant={'ghost'}
                color={'gray.600'}
              >
                <Icon size={'md'}>
                  <LucideMessageSquare />
                </Icon>
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content
                px={2.5}
                py={2.5}
                rounded={10}
                maxW={'18rem'}
                backdropFilter={'blur(8px)'}
                bg={'rgba(255, 255, 255, 0.6)'}
              >
                <Text
                  fontSize={13}
                  color={'gray.600'}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
                  eveniet blanditiis vel.
                </Text>
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </Flex>
      </Box>

      <Box
        mx={5}
        my={6}
      >
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
              textTransform: 'capitalize',
            }}
            items={Object.keys(Taxes).map((key) => key)}
          />
        </SegmentGroup.Root>
      </Box>

      <Box
        mx={5}
        my={5}
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
            >
              {Taxes[key as keyof typeof Taxes].map((tax) => (
                <Flex
                  px={4}
                  py={2}
                  key={tax.name}
                  width={'full'}
                  cursor={'pointer'}
                  alignItems={'start'}
                  justifyContent={'start'}
                  flexDirection={'column'}
                  borderBottom={'3px solid'}
                  borderBottomColor={'white'}
                  transition={'all 400ms ease-in-out'}
                  _hover={{ backgroundColor: 'gray.50' }}
                  onClick={() => navigate(`/app/pay/${key}?taxId=${tax.id}`)}
                >
                  <Text
                    fontSize={14}
                    textAlign={'left'}
                    fontWeight={'medium'}
                  >
                    {tax.name}
                  </Text>
                  <Text
                    fontSize={13}
                    textAlign={'left'}
                    color={'gray.600'}
                  >
                    {tax.description}
                  </Text>
                </Flex>
              ))}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>
    </React.Fragment>
  );
};
