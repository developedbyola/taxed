import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Payments } from '@/features/payments';

export const AppPayItemRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Pay Taxes</title>
      </Helmet>
      <Payments.Item />
    </React.Fragment>
  );
};
