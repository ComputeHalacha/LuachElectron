import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import AppSettingsContext from './AppSettingsContext';
import jDate from '../code/JCal/jDate';

export default function Home() {
  const settings = useContext(AppSettingsContext);
  const jd = new jDate();
  return (
    <div className={styles.container} data-tid="container">
      <h2>
        {`Home - ${settings.showOhrZeruah} and today is ${jd.toString()}`}
      </h2>
      <Link to={routes.COUNTER}>to Counter</Link>
    </div>
  );
}
