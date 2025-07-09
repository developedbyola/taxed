import { trpc } from '@/libs/trpc';
import { useAuth } from './Provider';
import { loginSchema } from '../schemas';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Field, useDialog } from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Box, Spinner } from '@chakra-ui/react';
import { BaseLayout } from '../layouts/BaseLayout';
import Cookies from 'js-cookie';

export const Login = () => {
  const dialog = useDialog();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(loginSchema),
  });

  const login = trpc.auth.login.useMutation({
    onSuccess: (data: any) => {
      form.reset();
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: {
            isPending: false,
            isAuthenticated: true,
            accessToken: data?.accessToken,
          },
        },
      });

      Cookies.set('refresh_token', data?.refreshToken, {
        expires: 30,
        secure: false,
        httpOnly: false,
        sameSite: 'Lax',
      });
      navigate('/app', {
        replace: true,
      });
    },
    onError: (error) => {
      dialog.open({
        title: 'Unable to login',
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
              login.mutate(values);
            },
          },
        ],
      });
    },
  });

  return (
    <BaseLayout
      title='Secure tax payment'
      description='Government-backed e-tax payments. Effortless, error-free, and always accessible on web.'
    >
      <form
        onSubmit={form.handleSubmit(
          async (data) => await login.mutateAsync(data)
        )}
      >
        <Box spaceY={3}>
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
            loading={login.isPending}
            disabled={login.isPending || !form.formState.isValid}
          >
            {login.isPending ? <Spinner color={'white'} /> : 'Sign in'}
          </Button>
        </Box>
      </form>
    </BaseLayout>
  );
};
