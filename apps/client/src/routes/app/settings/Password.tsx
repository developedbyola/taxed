import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsPassword = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Password</title>
      </Helmet>
      <Settings.Password />
    </React.Fragment>
  );
};

export default SettingsPassword;
