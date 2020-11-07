import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal
} from 'react-bootstrap';
import AppDataContext from './AppDataContext';
import styles from '../scss/SettingsView.scss';
import DataUtils from '../code/Data/DataUtils';
import { app } from 'electron';

export default function ChooseLocation(props) {
  const { appData, setAppData } = useContext(AppDataContext);
  const { locations, setLocations } = useState([appData.Settings.location]);

  async function changeLocation(locName) {
    const l = await DataUtils.SearchLocations(locName);
    if (l) {
      await DataUtils.SetCurrentLocationOnDatabase(l);
      appData.Settings.location = l;
      setAppData(appData);
    }
  }

  async function findLocation(search) {
    const locs = await DataUtils.SearchLocations(locName);
    setLocations(locs);
  }

  return (
    <Container fluid>
      <Row xs={12}>
        <Col>
          <h4>Select your Location</h4>
        </Col>
      </Row>
      <Row xs={12}>
        <Col></Col>
      </Row>
    </Container>
  );
}
