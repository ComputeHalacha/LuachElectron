import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Row, Col, ListGroup } from 'react-bootstrap';
import DataUtils from '../code/Data/DataUtils';
import { log } from '../code/GeneralUtils';
import styles from '../scss/SettingsView.scss';

export default function ChooseLocation(props) {
  const [locations, setLocations] = useState([]);
  const [fullLocationList, setFullLocationList] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    async function initialize() {
      const locs = await DataUtils.GetAllLocations();
      setFullLocationList(locs);
      setLocations(locs);
    }
    initialize();
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

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
            ref={inputRef}
            type="text"
            onKeyUp={event => filterLocations(event.target.value)}
            placeholder="Search for your location..."
          />
        </Col>
      </Row>
      <Row xs={12} style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        <Col>
          <ListGroup>
            {locations &&
              locations.map(location => (
                <ListGroup.Item
                  key={location.locationId}
                  className={styles.cardBody}
                  onClick={() => props.changeLocation(location)}
                  style={{ cursor: 'pointer' }}
                >
                  {location.Name}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
