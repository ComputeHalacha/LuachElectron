import React, { ReactNode, useState, useEffect } from 'react';
import AppDataContext from '../components/AppDataContext';
import AppData from '../code/Data/AppData';
import { ipcRenderer } from 'electron';
import { initFirstRun } from '../code/GeneralUtils';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const [appData, setAppData] = useState(new AppData());

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
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
}
