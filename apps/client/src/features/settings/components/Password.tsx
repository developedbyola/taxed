import React from 'react';
import { trpc } from '@/libs/trpc';
import { Auth } from '@/features/auth';
import { LucideKey } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { passwordSchema } from '../schemas';
import { Field, useDialog } from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Heading, Icon, Spinner, Text } from '@chakra-ui/react';

const IsoIcon = () => {
  return (
    <svg
      width='120'
      height='120'
      viewBox='0 0 98 122'
      fill='#c8e7ff'
      xmlns='http://www.w3.org/2000/svg'
      stroke-width='2px'
      stroke-linecap='round'
      stroke-linejoin='round'
      style={{ marginInline: 'auto' }}
    >
      <path
        d='M44.9299 74.7334L39.7499 65.7934L23.1299 37.1134L17.1199 26.7534L8.84985 12.4934L4.16992 15.1534L12.2999 29.1734L12.6199 29.7334C11.6099 29.8334 10.6699 30.0634 9.79993 30.4234C9.32993 30.6134 8.88985 30.8334 8.46985 31.0934C7.36985 31.7734 6.40995 32.6834 5.56995 33.8434C3.81995 36.2834 2.93994 39.5834 2.93994 43.7234C2.93994 49.9934 4.85994 56.4334 8.68994 63.0334C12.5099 69.6434 17.1599 74.5234 22.6299 77.6734C26.2899 79.7934 29.5899 80.6634 32.5199 80.2734C33.7199 80.1134 34.8199 79.7934 35.8199 79.3034L36.0099 79.2034C37.3699 78.4934 38.5499 77.4734 39.5299 76.1334L40.1199 77.1434L64.5499 119.293L69.2198 116.623L44.9299 74.7334ZM29.1899 58.8734C29.1899 60.9434 28.5499 62.3434 27.2699 63.0834C25.9799 63.8134 24.4399 63.6634 22.6299 62.6134C20.8299 61.5734 19.2799 59.9434 17.9999 57.7334C16.7099 55.5134 16.0699 53.3734 16.0699 51.2934C16.0699 49.2134 16.7099 47.8234 17.9999 47.0934C19.2799 46.3634 20.8299 46.5134 22.6299 47.5534L23.2098 47.8834L29.1899 58.2134V58.8734Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M29.1898 58.2133V58.8734C29.1898 60.9434 28.5498 62.3433 27.2698 63.0833C25.9798 63.8133 24.4398 63.6634 22.6298 62.6134C20.8298 61.5734 19.2798 59.9434 17.9998 57.7334C16.7098 55.5134 16.0698 53.3734 16.0698 51.2934C16.0698 49.2134 16.7098 47.8233 17.9998 47.0933C19.2798 46.3633 20.8298 46.5134 22.6298 47.5534L23.2097 47.8834L29.1898 58.2133Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M89.2197 106.624L84.5498 109.294L64.5498 119.294L69.2197 116.624L84.3998 109.034L89.2197 106.624Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M89.2198 106.623L84.3999 109.033L69.2198 116.623L44.9299 74.7334L39.7499 65.7934L23.1299 37.1134L17.1199 26.7534L8.84985 12.4934L28.8499 2.49341L56.9598 50.9834L41.7399 58.5934L48.3799 70.0434L49.7098 72.3334L67.9899 103.863L68.5699 104.193L78.6699 99.1434L83.4899 96.7334L89.2198 106.623Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M88.5698 86.2034V94.1934L83.4897 96.7334L78.6698 99.1434L68.5698 104.193V89.1334L75.0298 92.8634L75.1298 92.9234L79.8998 90.5434L84.6798 88.1534L88.5698 86.2034Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M95.1299 67.8633V82.9233L88.5699 86.2032L84.6799 88.1533L79.8999 90.5433L75.1299 92.9233V77.8633L77.9099 76.4733L95.1299 67.8633Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M95.1298 67.8633L77.9098 76.4733L75.1298 77.8633L71.2498 75.6233L61.9098 70.2333L57.8898 67.9133L41.7397 58.5933L61.7397 48.5933L95.1298 67.8633Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M75.1298 77.8633V92.9233L75.0298 92.8633L68.5698 89.1333V104.193L67.9897 103.863L49.7097 72.3333L48.3798 70.0433L41.7397 58.5933L57.8898 67.9133L61.9098 70.2333L71.2498 75.6233L75.1298 77.8633Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M12.6198 29.7333C11.6098 29.8333 10.6698 30.0633 9.7998 30.4233L12.2998 29.1733L12.6198 29.7333Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M40.1198 77.1433L36.0098 79.2033'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
    </svg>
  );
};

const PasswordForm = () => {
  const dialog = useDialog();
  const { setAuth } = Auth.useAuth();

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
  };

  const form = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(passwordSchema),
  });

  const changePassword = trpc.users.changePassword.useMutation({
    onSuccess: () => {
      dialog.open({
        variant: 'success',
        title: 'Password changed',
        message:
          'Your password has been changed successfully. You will be logged out after you close this dialog.',
        actions: [
          {
            variant: 'solid',
            label: 'Close',
            onClick: () => {
              setAuth({ type: 'LOGOUT' });
            },
          },
        ],
      });
    },
    onError: (error, data) => {
      dialog.open({
        title: 'Password change failed',
        message: error.message,
        actions: [
          { label: 'Close' },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => {
              changePassword.mutate({
                newPassword: data.newPassword,
                currentPassword: data.currentPassword,
              });
            },
          },
        ],
      });
    },
  });

  return (
    <form
      style={{ display: 'flex', gap: 8, flexDirection: 'column' }}
      onSubmit={form.handleSubmit((data) => changePassword.mutate(data))}
    >
      <Field.Root
        textHidden
        name='currentPassword'
        control={form.control as any}
      >
        <Field.Content height='2.5rem'>
          <Icon
            ml={3}
            color='gray.500'
          >
            <LucideKey size={20} />
          </Icon>
          <Field.TextField
            fontSize={14}
            placeholder='Enter your current password'
          />
        </Field.Content>
      </Field.Root>
      <Field.Root
        textHidden
        name='newPassword'
        control={form.control as any}
      >
        <Field.Content height='2.5rem'>
          <Icon
            ml={3}
            color='gray.500'
          >
            <LucideKey size={20} />
          </Icon>
          <Field.TextField
            fontSize={14}
            autoComplete='new-password'
            placeholder='Enter your new password'
          />
        </Field.Content>
      </Field.Root>

      <Button
        py={3}
        px={4}
        width='full'
        rounded={12}
        height={'fit'}
        type='submit'
        disabled={!form.formState.isValid || changePassword.isPending}
      >
        {changePassword.isPending ? <Spinner size='sm' /> : 'Change password'}
      </Button>
    </form>
  );
};

export const Password = () => {
  return (
    <React.Fragment>
      <Box py={4}>
        <Box mx={5}>
          <Heading letterSpacing={'-3%'}>Password</Heading>
          <Text
            color='gray.600'
            letterSpacing={'-1%'}
          >
            Change your password
          </Text>
        </Box>

        <Box mt={10}>
          <IsoIcon />
          <Heading
            mt={4}
            fontSize={16}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            Change password
          </Heading>
          <Text
            mx='auto'
            fontSize={13}
            maxWidth='18rem'
            color='gray.500'
            textAlign={'center'}
          >
            Changing your password will log you out the application.
          </Text>
        </Box>

        <Box
          mt={6}
          mx={5}
        >
          <PasswordForm />
        </Box>
      </Box>
    </React.Fragment>
  );
};
