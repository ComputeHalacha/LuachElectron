import React, { ReactNode, useState, useEffect } from 'react';
import AppDataContext from '../components/AppDataContext';
import AppData from '../code/Data/AppData';
import { ipcRenderer } from 'electron';
import { log } from '../code/GeneralUtils';
import { tryToGuessLocation } from '../code/JCal/Locations';
import DataUtils from '../code/Data/DataUtils';
import RemoteBackup from '../code/RemoteBackup';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const [appData, setAppData] = useState(new AppData());

  useEffect(() => {
    async function initialize() {
      if (ipcRenderer.sendSync('getIsFirstRun')) {
        log('AppData.getAppData(): IsFirstRun is true.');

        /** *********************************************************************
         * If this is the first time the app was run after a fresh installation,
         * we change the default location to a guess based
         * on the system time zone or else Lakewood NJ.
         *********************************************************************** */

        const newLocation = await tryToGuessLocation();
        log(
          `AppData.getAppData(): Guessed location is ${newLocation &&
            newLocation.Name}.`
        );
        await DataUtils.SetCurrentLocationOnDatabase(newLocation);
        log(`Location has been set to: ${newLocation.Name}`);
        // Create a remote backup account.
        if (await RemoteBackup.createFreshUserNewAccount()) {
          log(
            'AppData.getAppData(): A new remote account has been created with a random username and password'
          );
        }
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
