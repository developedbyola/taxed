import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsProfile = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Profile</title>
      </Helmet>
      <Settings.Profile />
    </React.Fragment>
  );
};

export default SettingsProfile;
