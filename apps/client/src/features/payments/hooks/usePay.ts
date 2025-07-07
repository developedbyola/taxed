import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useFlutterwave } from 'flutterwave-react-v3';
import { trpc } from '@/libs/trpc';
import { useDialog } from '@/components';
import { User } from '@/features/users';

type PaymentMeta = {
  title: string;
  description: string;
  logo: string;
};

type PaymentData = {
  amount: string;
  companyCode: string;
  remark: string;
  meta: PaymentMeta;
};

type UsePayOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const usePay = (data: PaymentData, options?: UsePayOptions) => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const { user } = User.useUser();
  const createTransaction = trpc.transactions.create.useMutation({
    onSuccess: () => {
      dialog.open({
        variant: 'success',
        title: 'Transaction successful',
        message: 'Your transaction was successful',
        actions: [
          { label: 'OK' },
          {
            variant: 'solid',
            label: 'View transactions',
            onClick: () => navigate('/app/transactions'),
          },
        ],
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dialog.open({
        title: 'Transaction failed',
        message: errorMessage,
        actions: [{ label: 'OK' }],
      });

      if (options?.onError) {
        const normalizedError =
          error instanceof Error ? error : new Error(errorMessage);
        options.onError(normalizedError);
      }
    },
  });

  const fw = useFlutterwave({
    currency: 'NGN',
    tx_ref: `taxed_ref:${Date.now()}`,
    amount: parseFloat(data.amount || '0'),
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: '',
      name: user ? `${user.firstName} ${user.lastName}` : '',
    },
    customizations: data.meta,
  });

  const handlePayment = useCallback(() => {
    fw({
      callback: async (response) => {
        if (response.status === 'completed') {
          await createTransaction.mutateAsync({
            amount: parseFloat(data.amount || '0'),
            companyCode: data.companyCode || '',
            currency: response.currency || 'NGN',
            flwRef: response.flw_ref || '',
            txRef: response.tx_ref || '',
            txId: response.transaction_id || 0,
            status: response.status,
            customer: response.customer || {},
            meta: data.meta,
          });
        }
      },
      onClose: () => null,
    });
  }, [fw, createTransaction]);

  return { handlePayment, isProcessing: createTransaction.isPending };
};
