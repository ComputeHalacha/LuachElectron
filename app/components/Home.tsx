import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import os from 'os';
import routes from '../constants/routes.json';
import styles from './Home.css';
import AppSettingsContext from './AppSettingsContext';
import jDate from '../code/JCal/jDate';

export default function Home() {
  const settings = useContext(AppSettingsContext);
  const [showMenu, setShowMenu] = useState(true);
  const [fileText, setfileText] = useState(null);
  const jd = new jDate();
  return (
    <Container fluid className="h-100">
      <Row style={{ backgroundColor: '#334' }}>
        <Col sm="1">
          <FontAwesomeIcon
            style={{ maxWidth: 25 }}
            icon={faBars}
            onClick={() => setShowMenu(!showMenu)}
          />
        </Col>
        <Col>
          <h3>This is the heading row </h3>
          {os.platform()}
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
        <Col>
          <Row>
            <Col sm="12">
              <Container fluid className="pl-5 pt-3">
                <Row className="justify-content-md-center">
                  <h1>Luach</h1>
                </Row>
                <Row className="justify-content-md-center">
                  <h4 className="check">
                    {`Home - ${
                      settings.showOhrZeruah
                    } and today is ${jd.toString()}`}
                  </h4>
                </Row>
                <Row>
                  <Link to={routes.COUNTER}>
                    <Button color="danger">to Counter</Button>
                  </Link>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>
        <Button
          onClick={() => {
            ipcRenderer.on('openFileReply', (event, object) => {
              console.log('Got file data - ' + object);
              setfileText(object.data);
            });
            ipcRenderer.send('openFile');
          }}>
          Dialog
        </Button>
        {fileText}
      </Row>
    </Container>
  );
}
