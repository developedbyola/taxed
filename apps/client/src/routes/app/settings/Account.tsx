import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsAccount = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Account</title>
      </Helmet>
      <Settings.Account />
    </React.Fragment>
  );
};

export default SettingsAccount;
