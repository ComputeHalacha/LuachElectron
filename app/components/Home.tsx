import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  faBars,
  faCalendarDay,
  faCalendarWeek,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Row, Col, Nav, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import os from 'os';
import routes from '../constants/routes.json';
import AppSettingsContext from './AppSettingsContext';
import AppData from '../code/Data/AppData';
import jDate from '../code/JCal/jDate';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import styles from '../scss/Home.scss';

export default function Home() {
  const settings = useContext(AppSettingsContext);
  const [showMenu, setShowMenu] = useState(true);
  const [appData, setAppData] = useState(new AppData());
  const [homeViewType, sethomeViewType] = useState('day');
  useEffect(() => {
    async function getAppData() {
      setAppData(await AppData.getAppData());
    }

    getAppData();
  });
  const jd = new jDate();
  function View() {
    switch (homeViewType) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
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
          <h3>{appData.Settings.location.name}</h3>
        </Col>
        <Col xs="2">
          <ListGroup horizontal color="primary">
            <ListGroup.Item onClick={() => sethomeViewType('day')}>
              <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendarDay} />
            </ListGroup.Item>
            <ListGroup.Item onClick={() => sethomeViewType('week')}>
              <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendarWeek} />
            </ListGroup.Item>
            <ListGroup.Item onClick={() => sethomeViewType('month')}>
              <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendar} />
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
          <ul className="nav flex-column navbar-dark sticky-top">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Active
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <h1>Luach</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h4 className="check">
          {`Home - ${settings.showOhrZeruah} and today is ${jd.toString()}`}
        </h4>
      </Row>
      <Row>
        <Col xs="12">
          <Nav variant="tabs" defaultActiveKey="day">
            <Nav.Item>
              <Nav.Link eventKey="day" onClick={() => sethomeViewType('day')}>
                <FontAwesomeIcon
                  style={{ maxWidth: 25 }}
                  icon={faCalendarDay}
                />
                &nbsp;Days View
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="week" onClick={() => sethomeViewType('week')}>
                <FontAwesomeIcon
                  style={{ maxWidth: 25 }}
                  icon={faCalendarWeek}
                />
                &nbsp;Week View
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="month"
                onClick={() => sethomeViewType('month')}
              >
                <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendar} />
                &nbsp;Month View
              </Nav.Link>
            </Nav.Item>
          </Nav>
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
