import React, { ReactNode } from 'react';
import Settings from '../code/Settings';
import AppSettingsContext from '../components/AppSettingsContext';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const settings = new Settings();
  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  );
}
