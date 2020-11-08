import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
  ListGroup
} from 'react-bootstrap';
import styles from '../scss/SettingsView.scss';
import DataUtils from '../code/Data/DataUtils';
import { app } from 'electron';
import { log } from '../code/GeneralUtils';
import { Link } from 'react-router-dom';

export default function ChooseLocation(props) {
  const [locations, setLocations] = useState([]);
  const [fullLocationList, setFullLocationList] = useState([]);

  useEffect(() => {
    async function initialize() {
      const locs = await DataUtils.GetAllLocations();
      setFullLocationList(locs);
      setLocations(locs);
    }
    initialize();
  }, []);

  async function findLocation(search) {
    const locs = await DataUtils.SearchLocations(locName);
    setLocations(locs);
  }

  function filterLocations(val) {
    log(
      `Searching for ${val} from full list of ${fullLocationList.length} locations`
    );
    const list = fullLocationList.filter(
      l => !val.trim() || l.Name.toLowerCase().indexOf(val.toLowerCase()) > -1
    );
    log(`Found ${list.length} locations`);
    setLocations(list);
  }

  return (
    <Container fluid>
      <Row xs={12}>
        <Col>
          <Form.Control
            type="text"
            onKeyUp={event => filterLocations(event.target.value)}
            placeholder="Search for your location..."
          />
        </Col>
      </Row>
      <Row xs={12} style={{ height: '0.50vw' }}>
        <Col>
          <ListGroup>
            {locations &&
              locations.map(location => (
                <ListGroup.Item
                  key={location.locationId}
                  className={styles.cardHeader}
                >
                  <a href="#" onClick={() => props.changeLocation(location)}>
                    {location.Name}
                  </a>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
