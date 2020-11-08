import React, { ReactNode, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import AppDataContext from '../components/AppDataContext';
import AppData from '../code/Data/AppData';
import { initFirstRun, deepClone } from '../code/GeneralUtils';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const [appData, setAppData] = useState(
    new AppData(null, null, null, null, null, null)
  );

  useEffect(() => {
    async function initialize() {
      if (ipcRenderer.sendSync('getIsFirstRun')) {
        await initFirstRun();
        ipcRenderer.send('setAfterFirstRun');
      }
      const ad = await AppData.fromDatabase();
      setAppData(ad);
    }
    initialize();
  }, []);

  return (
    <AppDataContext.Provider
      value={{ appData, setAppData: ad => setAppData(deepClone(ad)) }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
