import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings } from '@/features/settings';

const SettingsAbout = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Taxed | About </title>
      </Helmet>
      <Settings.About />
    </React.Fragment>
  );
};

export default SettingsAbout;
