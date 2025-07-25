import React from 'react';
import { User } from '@/features/users';
import { emailSchema } from '../schemas';
import { useForm } from 'react-hook-form';
import { LucideKey, LucideMail } from 'lucide-react';
import { Field, useDialog } from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Heading, Icon, Spinner, Text } from '@chakra-ui/react';
import { trpc } from '@/libs/trpc';
import { Auth } from '@/features/auth';

const IsoIcon = () => {
  return (
    <svg
      width='120'
      height='120'
      viewBox='0 0 103 115'
      fill='#c8e7ff'
      xmlns='http://www.w3.org/2000/svg'
      stroke-width='2px'
      stroke-linecap='round'
      stroke-linejoin='round'
      style={{ marginInline: 'auto' }}
    >
      <path
        d='M13.6797 14.6404L15.1997 13.8804C14.6797 14.1004 14.1697 14.3604 13.6797 14.6404Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M77.559 65.8103C75.499 59.1503 72.709 52.7703 69.179 46.6803C68.189 44.9803 67.149 43.3103 66.059 41.6803C63.279 37.4903 60.159 33.5602 56.729 29.8702C54.459 27.4302 52.0989 25.2102 49.6689 23.2202C47.0089 21.0402 44.269 19.1402 41.429 17.5002C36.069 14.4002 31.0189 12.6402 26.2889 12.2302C26.2389 12.2202 26.1889 12.2102 26.1389 12.2102C22.0289 11.8702 18.379 12.4302 15.199 13.8802L13.679 14.6402C10.149 16.6602 7.35895 19.8102 5.29895 24.0902C3.23895 28.3802 2.20898 33.6402 2.20898 39.8602C2.20898 46.0802 3.23895 52.5303 5.29895 59.2003C7.35895 65.8603 10.149 72.2402 13.679 78.3302C17.209 84.4102 21.3589 90.0202 26.1389 95.1402C30.9089 100.25 36.009 104.38 41.429 107.51C46.859 110.64 51.959 112.41 56.729 112.8C61.499 113.19 65.649 112.38 69.179 110.37C72.179 108.66 74.639 106.13 76.569 102.78C76.919 102.19 77.249 101.57 77.559 100.92C79.619 96.6302 80.6489 91.3702 80.6489 85.1502C80.6489 78.9302 79.619 72.4803 77.559 65.8103ZM53.199 55.8003L45.349 51.2702V78.2702L53.199 82.8003V91.8003L29.6689 78.2102V69.2102L36.799 73.3302L37.5089 73.7402V46.7402L29.6689 42.2102V33.2102L38.0189 38.0302L45.859 42.5603L53.199 46.8003V55.8003Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M87.6582 101.13C88.1782 100.91 88.6882 100.65 89.1782 100.37L87.6582 101.13Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M45.348 69.8201V70.37L37.458 74.3101L29.668 78.21V69.21L36.798 73.33L37.5079 73.74L45.348 69.8201Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M53.198 82.8002V91.8002L29.668 78.2101L37.458 74.3102L45.348 70.3701V78.2701L53.198 82.8002Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M53.1976 47.3501V55.8002L45.3477 51.2701L53.1976 47.3501Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M38.0179 38.03L29.668 42.21V33.21L38.0179 38.03Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M45.858 42.5601L37.5079 46.74L29.668 42.21L38.0179 38.03L45.858 42.5601Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M100.649 75.1501C100.649 81.3701 99.6192 86.6301 97.5592 90.9201C95.4992 95.2001 92.7092 98.3501 89.1792 100.37L69.1792 110.37C72.1792 108.66 74.6392 106.13 76.5692 102.78C76.9192 102.19 77.2492 101.57 77.5592 100.92C79.6192 96.6301 80.6492 91.3701 80.6492 85.1501C80.6492 78.9301 79.6192 72.4801 77.5592 65.8101C75.4992 59.1501 72.7092 52.7701 69.1792 46.6801C68.1892 44.9801 67.1492 43.3101 66.0592 41.6801C63.2792 37.4901 60.1592 33.5601 56.7292 29.8701C54.4592 27.4301 52.0992 25.2101 49.6692 23.2201C47.0092 21.0401 44.2692 19.1401 41.4292 17.5001C36.0692 14.4001 31.0192 12.6401 26.2892 12.2301C26.2392 12.2201 26.1892 12.21 26.1392 12.21C22.0292 11.87 18.3792 12.4301 15.1992 13.8801L33.6792 4.6401C37.2092 2.6301 41.3592 1.82005 46.1392 2.21005C50.9092 2.60005 56.0092 4.37009 61.4292 7.50009C66.8592 10.6301 71.9592 14.7601 76.7292 19.8701C81.4992 24.9901 85.6492 30.6001 89.1792 36.6801C92.7092 42.7701 95.4992 49.1501 97.5592 55.8101C99.6192 62.4801 100.649 68.9201 100.649 75.1501Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
      <path
        d='M53.1998 46.8V47.35L45.3499 51.27V69.8201L37.5098 73.74V46.74L45.8599 42.5601L53.1998 46.8Z'
        stroke='#229EFF'
        stroke-linejoin='round'
      />
    </svg>
  );
};

const EmailForm = () => {
  const dialog = useDialog();
  const { user } = User.useUser();
  const { setAuth } = Auth.useAuth();

  const defaultValues = {
    email: user?.email || '',
    password: '',
  };

  const form = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(emailSchema),
  });

  const changeEmail = trpc.users.changeEmail.useMutation({
    onSuccess: () => {
      dialog.open({
        variant: 'success',
        title: 'Email changed',
        message:
          'Your email has been changed successfully. You will be logged out after you close this dialog.',
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
        title: 'Unable to change email',
        message: error.message,
        actions: [
          { label: 'Close' },
          {
            variant: 'solid',
            label: 'Try again',
            onClick: () => {
              changeEmail.mutate({
                password: data.password,
                email: data.email.toLowerCase(),
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
      style={{ display: 'flex', gap: 8, flexDirection: 'column' }}
      onSubmit={form.handleSubmit((data) => changeEmail.mutate(data))}
    >
      <Field.Root
        name='email'
        control={form.control as any}
      >
        <Field.Content height='2.5rem'>
          <Icon
            ml={3}
            color='gray.500'
          >
            <LucideMail size={20} />
          </Icon>
          <Field.TextField
            fontSize={14}
            placeholder='Enter a valid email address'
          />
        </Field.Content>
      </Field.Root>
      <Field.Root
        textHidden
        name='password'
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
            placeholder='Enter your password'
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
        disabled={
          !form.formState.isValid ||
          !form.formState.isDirty ||
          changeEmail.isPending
        }
      >
        {changeEmail.isPending ? <Spinner size='sm' /> : 'Change email'}
      </Button>
    </form>
  );
};

export const Account = () => {
  return (
    <React.Fragment>
      <Box py={4}>
        <Box mx={5}>
          <Heading letterSpacing={'-3%'}>Account</Heading>
          <Text
            color='gray.600'
            letterSpacing={'-1%'}
          >
            Manage your account
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
            Change email address
          </Heading>
          <Text
            mx='auto'
            fontSize={13}
            maxWidth='18rem'
            color='gray.500'
            textAlign={'center'}
          >
            Changing your email address will log you out the application.
          </Text>
        </Box>

        <Box
          mt={6}
          mx={5}
        >
          <EmailForm />
        </Box>
      </Box>
    </React.Fragment>
  );
};
