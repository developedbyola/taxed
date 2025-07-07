import z from 'zod';

const amount = z.string().refine(
  (value) => {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed >= 10 && parsed <= 50000;
  },
  {
    message: 'Amount must be a number between 10 and 50000',
  }
);

const companyCode = z
  .string()
  .min(1, 'Company code is required')
  .refine((value) => !isNaN(parseInt(value)), {
    message: 'Company code must be a number',
  });

const remark = z
  .string()
  .min(1, 'Remark is required')
  .max(255, 'Remark is too long');

export const paymentSchema = z.object({
  amount,
  companyCode,
  remark,
});
