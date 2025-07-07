import { z } from 'zod';

const email = z
  .string({ required_error: 'Email is required' })
  .email('Enter a valid email address')
  .min(5, 'Must be at least 5 characters')
  .max(100, 'Must be less than 100 characters')
  .toLowerCase()
  .trim();

const password = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Must be at least 8 characters')
  .max(20, 'Must be less than 20 characters')
  .refine((val) => !/\s/.test(val), {
    message: 'Must not contain spaces',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Must contain at least one lowercase letter',
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Must contain at least one uppercase letter',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Must contain at least one number',
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(val), {
    message: 'Must contain at least one special character',
  });

const firstName = z
  .string({ required_error: 'First name is required' })
  .min(2, 'At least 2 characters')
  .max(50, 'Less than 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Only contain letters, spaces, hyphens, and apostrophes'
  )
  .transform((val) => val.trim().replace(/\s+/g, ' '));

const lastName = z
  .string({ required_error: 'Last name is required' })
  .min(2, 'At least 2 characters')
  .max(50, 'Less than 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Only contain letters, spaces, hyphens, and apostrophes'
  )
  .transform((val) => val.trim().replace(/\s+/g, ' '));

export const loginSchema = z.object({
  email,
  password,
});

export const registerSchema = z.object({
  firstName,
  lastName,
  email,
  password,
});
