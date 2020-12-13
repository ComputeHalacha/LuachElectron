import React, { ReactNode } from 'react';
import { AppDataProvider } from '../components/AppDataContext';

type Props = {
  children: ReactNode;
};

export default function App({ children }: Props) {
  return <AppDataProvider>{children}</AppDataProvider>;
}
