import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsSourceCode = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Source Code</title>
      </Helmet>
      <Settings.SourceCode />
    </React.Fragment>
  );
};

export default SettingsSourceCode;
