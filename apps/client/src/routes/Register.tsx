import React from 'react';
import { Auth } from '@/features/auth';
import { Helmet } from 'react-helmet-async';

export const RegisterRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Sign up</title>
      </Helmet>
      <Auth.Register />
    </React.Fragment>
  );
};
