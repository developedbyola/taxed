import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsTerms = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Terms of Service</title>
      </Helmet>
      <Settings.Terms />
    </React.Fragment>
  );
};

export default SettingsTerms;
