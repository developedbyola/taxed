import { z } from 'zod';

const firstName = z
  .string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  })
  .min(2)
  .max(255);

const lastName = z
  .string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  })
  .min(2)
  .max(255);

const email = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .email();

const password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8)
  .regex(/\S+/, {
    message: 'Password must not contain spaces',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[\d]/, {
    message: 'Password must contain at least one number',
  })
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, {
    message: 'Password must contain at least one special character',
  });

export const emailSchema = z.object({
  email,
  password,
});

export const profileSchema = z.object({
  firstName,
  lastName,
});
