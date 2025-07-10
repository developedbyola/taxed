import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Payments } from '@/features/payments';

export const AppPayListRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Pay Taxes</title>
      </Helmet>
      <Payments.List />
    </React.Fragment>
  );
};
