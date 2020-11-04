import React from 'react';
import AppData from '../code/Data/AppData';

const AppDataContext = React.createContext({
  appData: AppData,
  setAppData: Function
});

export default AppDataContext;
