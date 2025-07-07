import React from 'react';
import { Field } from '@/components';
import Taxes from '@/data/Taxes.json';
import { paymentSchema } from '../schemas';
import { useSearchParams } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Separator,
  Text,
} from '@chakra-ui/react';
import { LucideArrowLeft } from 'lucide-react';
import { usePay } from '../hooks/usePay';

type FormProps = {
  tax: (typeof Taxes)['federal'][number];
};

const Form = ({ tax }: FormProps) => {
  const form = useForm({
    mode: 'all',
    defaultValues: {
      amount: '0',
      companyCode: '',
      remark: '',
    },
    resolver: zodResolver(paymentSchema),
  });

  const values = useWatch({ control: form.control });

  const meta = {
    title: tax.name,
    description: `${values.remark}`,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Coat_of_arms_of_Nigeria.svg/960px-Coat_of_arms_of_Nigeria.svg.png',
  };

  const { handlePayment, isProcessing } = usePay(
    {
      amount: values.amount || '0',
      companyCode: values.companyCode || '',
      remark: values.remark || '',
      meta,
    },
    { onSuccess: () => form.reset() }
  );

  return (
    <React.Fragment>
      <form onSubmit={form.handleSubmit((_) => handlePayment())}>
        <Box
          px={5}
          spaceY={3}
        >
          <Field.Root
            name='amount'
            control={form.control as any}
          >
            <Field.Label>Amount</Field.Label>
            <Field.Content>
              <Field.TextField />
            </Field.Content>
            <Field.Feedback />
          </Field.Root>
          <Field.Root
            name='companyCode'
            control={form.control as any}
          >
            <Field.Label>Company code</Field.Label>
            <Field.Content>
              <Field.TextField />
            </Field.Content>
            <Field.Feedback />
            <Field.Hint>
              Reach out to your HR department for your company code
            </Field.Hint>
          </Field.Root>
          <Field.Root
            name='remark'
            control={form.control as any}
          >
            <Field.Label>Remark</Field.Label>
            <Box flex={1}>
              <Field.Content height={'fit'}>
                <Field.Textarea rows={1} />
              </Field.Content>
              <Field.Feedback />
            </Box>
          </Field.Root>
        </Box>
        <Box
          mt={3}
          px={5}
          py={2}
          bg='white'
          bottom={0}
          position={'sticky'}
          borderTop={'1px solid'}
          borderTopColor={'gray.100'}
        >
          <Button
            size={'lg'}
            rounded={12}
            type='submit'
            width={'full'}
            fontSize={'0.875rem'}
            fontWeight={'semibold'}
            loadingText='Processing...'
            disabled={!form.formState.isValid || isProcessing}
          >
            Pay
          </Button>
        </Box>
      </form>
    </React.Fragment>
  );
};

export const Item = () => {
  const navigate = useNavigate();
  const { taxGroup } = useParams<{ taxGroup: string }>();
  const [searchParams] = useSearchParams();

  const taxId = searchParams.get('taxId');

  const tax = Taxes[taxGroup as keyof typeof Taxes].find(
    (tax) => tax.id === taxId
  );

  if (!tax) {
    return null;
  }

  return (
    <React.Fragment>
      <Flex
        py={4}
        px={5}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Button
          size='sm'
          rounded={12}
          variant='ghost'
          onClick={() => navigate(-1)}
        >
          <Icon>
            <LucideArrowLeft />
          </Icon>
          Taxes
        </Button>
      </Flex>

      <Box px={5}>
        <Image
          p={4}
          width={40}
          mx={'auto'}
          alt={tax.name}
          aspectRatio={1}
          borderRadius={24}
          backgroundColor={'gray.100'}
          src={'/assets/images/coat_of_arms.png'}
        />

        <Heading
          mt={3}
          mx={'auto'}
          fontSize={20}
          maxW={'18rem'}
          textAlign={'center'}
          letterSpacing={'tight'}
        >
          {tax.name}
        </Heading>
        <Text
          mx={'auto'}
          fontSize={14}
          maxW={'21rem'}
          color={'gray.500'}
          textAlign={'center'}
        >
          {tax.description} {tax.rate}
        </Text>
      </Box>

      <Separator my={5} />

      <Form tax={tax} />
    </React.Fragment>
  );
};
