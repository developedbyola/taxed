import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Transactions } from '@/features/transactions';

const TransactionRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Transaction</title>
      </Helmet>
      <Transactions.Item />
    </React.Fragment>
  );
};

export default TransactionRoute;
