import React, {
  useContext,
  useEffect,
  createContext,
  ReactNode,
  useReducer
} from 'react';
import { ipcRenderer } from 'electron';
import AppData from '../code/Data/AppData';
import { initFirstRun } from '../code/GeneralUtils';
import { globalStateReducer } from '../code/GlobalStateReducer';
import LocalStorage from '../code/Data/LocalStorage';

type Props = { children: ReactNode };

const AppDataContext = createContext({
  appData: new AppData(),
  localStorage: new LocalStorage()
});
const AppDataDispatchContext: React.Context<Function> = createContext();

function AppDataProvider({ children }: Props) {
  const [state, dispatch] = useReducer(globalStateReducer, {
    appData: new AppData(),
    localStorage: new LocalStorage()
  });
  useEffect(() => {
    async function initialize() {
      if (ipcRenderer.sendSync('getIsFirstRun')) {
        await initFirstRun();
        ipcRenderer.send('setAfterFirstRun');
      }
      const appData = await AppData.fromDatabase();
      const localStorage = await LocalStorage.loadAll();
      dispatch({
        type: 'INIT_GLOBAL_STATE',
        payload: { appData, localStorage }
      });
    }
    initialize();
  }, []);

  return (
    <AppDataDispatchContext.Provider value={dispatch}>
      <AppDataContext.Provider value={state}>
        {children}
      </AppDataContext.Provider>
    </AppDataDispatchContext.Provider>
  );
}

function useAppGlobalState(): [
  { appData: AppData; localStorage: LocalStorage },
  Function
] {
  return [useContext(AppDataContext), useContext(AppDataDispatchContext)];
}

export { AppDataProvider, useAppGlobalState };
