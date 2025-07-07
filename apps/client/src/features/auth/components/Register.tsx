import { trpc } from '@/libs/trpc';
import { registerSchema } from '../schemas';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Field, useDialog } from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { BaseLayout } from '../layouts/BaseLayout';

export const Register = () => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(registerSchema),
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: (_) => {
      form.reset();
      dialog.open({
        variant: 'success',
        title: 'Thanks for joining us',
        message:
          'Cheers to you! Your membership is all set up and ready to go.',
        actions: [
          {
            label: 'Close',
          },
          {
            label: 'Login',
            variant: 'solid',
            onClick: () => {
              navigate('/login');
            },
          },
        ],
      });
    },
    onError: (error) => {
      dialog.open({
        title: 'Registration failed',
        message: error.message,
        actions: [
          {
            label: 'Close',
          },
          {
            label: 'Try again',
            variant: 'solid',
            onClick: () => {
              const values = form.getValues();
              register.mutate(values);
            },
          },
        ],
      });
    },
  });

  return (
    <BaseLayout
      title='Pay your taxes fast'
      description='Government-backed e-tax payments. Effortless, error-free, and always accessible on web.'
    >
      <form
        onSubmit={form.handleSubmit(
          async (data) => await register.mutateAsync(data)
        )}
      >
        <Box spaceY={2}>
          <Field.Root
            name='firstName'
            control={form.control as any}
          >
            <Field.Content>
              <Field.TextField
                autoComplete='given-name'
                placeholder='Given name e.g Thomas'
              />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>
          <Field.Root
            name='lastName'
            control={form.control as any}
          >
            <Field.Content>
              <Field.TextField
                autoComplete='family-name'
                placeholder='Family name e.g Mark'
              />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>
          <Field.Root
            name='email'
            control={form.control as any}
          >
            <Field.Content>
              <Field.TextField
                autoComplete='email webauthn'
                placeholder='Email'
              />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>
          <Field.Root
            textHidden
            name='password'
            control={form.control as any}
          >
            <Field.Content>
              <Field.TextField
                autoComplete='current-password'
                placeholder='Password'
              />
              <Field.Hidden />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>

          <Button
            size={'lg'}
            rounded={12}
            type='submit'
            width={'full'}
            fontSize={'0.875rem'}
            fontWeight={'semibold'}
            loading={register.isPending}
            disabled={register.isPending || !form.formState.isValid}
          >
            {register.isPending ? (
              <Spinner color={'white'} />
            ) : (
              'Become a member'
            )}
          </Button>
        </Box>
      </form>
    </BaseLayout>
  );
};
