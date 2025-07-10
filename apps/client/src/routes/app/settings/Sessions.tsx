import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsSessions = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Sessions</title>
      </Helmet>
      <Settings.Sessions />
    </React.Fragment>
  );
};

export default SettingsSessions;
