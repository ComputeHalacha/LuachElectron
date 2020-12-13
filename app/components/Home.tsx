import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Row, Col, Nav, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import routes from '../constants/routes.json';
import { useAppGlobalState } from './AppDataContext';
import jDate from '../code/JCal/jDate';
import Utils from '../code/JCal/Utils';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import SettingsView from './SettingsView';
import EntriesView from './EntriesView';
import FlaggedDatesView from './FlaggedDatesView';
import KavuahsView from './KavuahsView';
import OccasionsView from './OccasionsView';
import LuachNav from './LuachNav';
import styles from '../scss/Home.scss';
import { app } from 'electron';

export default function Home() {
  const [state] = useAppGlobalState();
  const { appData } = state;
  const [showMenu, setShowMenu] = useState(true);
  const [homeViewType, setHomeViewType] = useState('day');
  const jd = new jDate();

  function View() {
    switch (homeViewType) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      case 'settings':
        return <SettingsView />;
      case 'flaggedDates':
        return <FlaggedDatesView />;
      case 'entries':
        return <EntriesView />;
      case 'kavuahs':
        return <KavuahsView />;
      case 'occasions':
        return <OccasionsView />;
      default:
        return <DayView />;
    }
  }

  return (
    <Container fluid className="h-100">
      <Row className={styles.headerRow}>
        <Col xs="1">
          <FontAwesomeIcon
            style={{ maxWidth: 25 }}
            icon={faBars}
            onClick={() => setShowMenu(!showMenu)}
          />
        </Col>
        <Col xs="9">
          <h3>{`Location - ${appData.Settings.location.Name}`}</h3>
        </Col>
        <Col xs="2">
          <ListGroup horizontal color="primary">
            <ListGroup.Item onClick={() => setHomeViewType('day')}>
              TEST 1
            </ListGroup.Item>
            <ListGroup.Item onClick={() => setHomeViewType('week')}>
              TEST 2
            </ListGroup.Item>
            <ListGroup.Item onClick={() => setHomeViewType('month')}>
              TEST 3
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col
          sm="5"
          md="3"
          className={`${showMenu ? 'collapse ' : ''} m-0 p-0 bg-dark`}
        >
          <Button
            className="close"
            aria-label="Close"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
          <LuachNav
            className="flex-column navbar-dark sticky-top"
            homeViewType={homeViewType}
            setHomeViewType={setHomeViewType}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <h1>Luach</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h4 className="check">
          {`Today is ${jd.toString()} ${Utils.toStringDate(
            jd.getDate(),
            true
          )}`}
        </h4>
      </Row>
      <Row>
        <Col xs="12">
          <LuachNav
            variant="tabs"
            defaultActiveKey="day"
            homeViewType={homeViewType}
            setHomeViewType={setHomeViewType}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs="12">
          <View />
        </Col>
      </Row>
      <Row>
        <Link to={routes.COUNTER}>
          <Button color="danger">to Counter</Button>
        </Link>
      </Row>
    </Container>
  );
}
