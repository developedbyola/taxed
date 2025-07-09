import React from 'react';
import { trpc } from '@/libs/trpc';
import { Field } from '@/components';
import { User } from '@/features/users';
import { useDialog } from '@/components';
import { useForm } from 'react-hook-form';
import { profileSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Heading, Text, Flex, Button, Spinner } from '@chakra-ui/react';

const NameForm = () => {
  const dialog = useDialog();
  const { user, setUser } = User.useUser();

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  };

  const form = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  const update = trpc.users.update.useMutation({
    onSuccess: (data: any) => {
      setUser({
        type: 'UPDATE_USER',
        payload: {
          user: {
            firstName: data?.user?.firstName,
            lastName: data?.user?.lastName,
          },
        },
      });
      dialog.open({
        variant: 'success',
        title: 'Profile updated',
        message: 'Your profile has been updated successfully.',
        actions: [{ label: 'Close' }],
      });
    },
    onError: (error, data) => {
      dialog.open({
        title: 'Unable to update profile',
        message: error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            label: 'Try again',
            variant: 'solid',
            onClick: () => {
              update.mutate({
                firstName: data.firstName?.toLowerCase(),
                lastName: data.lastName?.toLowerCase(),
              });
            },
          },
        ],
      });
    },
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [user]);

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        update.mutate({
          firstName: data.firstName?.toLowerCase(),
          lastName: data.lastName?.toLowerCase(),
        });
      })}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <Field.Root
        name='firstName'
        control={form.control as any}
      >
        <Field.Content
          height='2.5rem'
          alignItems={'baseline'}
        >
          <Field.Label
            pl={3}
            width='6rem'
            fontSize={14}
          >
            First Name
          </Field.Label>
          <Field.TextField placeholder='First Name' />
        </Field.Content>
      </Field.Root>
      <Field.Root
        name='lastName'
        control={form.control as any}
      >
        <Field.Content
          height='2.5rem'
          alignItems={'baseline'}
        >
          <Field.Label
            pl={3}
            width='6rem'
            fontSize={14}
          >
            Last Name
          </Field.Label>
          <Field.TextField placeholder='Last Name' />
        </Field.Content>
      </Field.Root>
      <Button
        py={3}
        px={4}
        rounded={12}
        fontSize={14}
        width='full'
        color='white'
        height={'fit'}
        type='submit'
        cursor={'pointer'}
        backgroundColor={'gray.900'}
        transition={'all 0.2s ease-in-out'}
        disabled={!form.formState.isValid || update.isPending}
        _hover={{
          backgroundColor: 'gray.700',
        }}
      >
        {update.isPending ? <Spinner size='sm' /> : 'Change'}
      </Button>
    </form>
  );
};

export const Profile = () => {
  const { user } = User.useUser();

  return (
    <React.Fragment>
      <Box
        px={5}
        py={4}
      >
        <Heading letterSpacing={'-3%'}>Profile</Heading>
        <Text
          color='gray.600'
          letterSpacing={'-1%'}
        >
          Manage your profile
        </Text>
      </Box>

      <Box mt={12}>
        <Flex
          mx='auto'
          w={'6rem'}
          rounded={32}
          aspectRatio={1}
          alignItems={'center'}
          justifyContent={'center'}
          backgroundColor={'gray.100'}
        >
          <Text
            fontSize={24}
            fontWeight={'bold'}
            textAlign={'center'}
            letterSpacing={'-1%'}
            textTransform={'capitalize'}
          >
            {user?.firstName.slice(0, 2)}
          </Text>
        </Flex>
        <Heading
          mt={2}
          fontSize={20}
          textAlign={'center'}
          fontWeight={'medium'}
          letterSpacing={'-1%'}
          textTransform={'capitalize'}
        >
          {`${user?.firstName || ''} ${user?.lastName || ''}`}
        </Heading>
      </Box>

      <Box
        mt={10}
        px={5}
      >
        <NameForm />
      </Box>
    </React.Fragment>
  );
};
