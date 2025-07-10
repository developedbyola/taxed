import { Settings } from '@/features/settings';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SettingsRoute = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | Settings</title>
      </Helmet>
      <Settings.List />
    </React.Fragment>
  );
};

export default SettingsRoute;
