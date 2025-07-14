import React from 'react';
import { Auth } from '@/features/auth';
import { Helmet } from 'react-helmet-async';

export const LoginRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Sign in</title>
      </Helmet>
      <Auth.Login />
    </React.Fragment>
  );
};
