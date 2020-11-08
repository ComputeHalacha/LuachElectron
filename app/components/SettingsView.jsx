import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
  InputGroup
} from 'react-bootstrap';
import AppDataContext from './AppDataContext';
import styles from '../scss/SettingsView.scss';
import ChooseLocation from './ChooseLocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { log } from '../code/GeneralUtils';

export default function SettingsView(props) {
  const { appData, setAppData } = useContext(AppDataContext);
  const [showLocations, setShowLocations] = useState(false);

  return (
    <Container fluid>
      <Row xs={12}>
        <Col>
          <h1>Settings View</h1>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          <Card className={styles.card}>
            <Card.Header className={styles.cardHeader}>
              <h3>Halachic Settings</h3>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Choose your location</Form.Label>
                  <InputGroup className="mb-3" style={{ maxWidth: '350px' }}>
                    <Form.Control
                      type="email"
                      defaultValue={appData.Settings.location.Name}
                      placeholder="Choose your location"
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => setShowLocations(true)}
                          onKeyPress={() => setShowLocations(true)}
                        >
                          <FontAwesomeIcon
                            icon={faSearchLocation}
                            style={{ maxWidth: 45 }}
                          />
                          {' Search'}
                        </button>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Zmanim depend on your location
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="showOhrZeruah">
                  <Form.Check
                    type="switch"
                    id="showOhrZeruah"
                    label='Flag previous onah (The "Ohr Zaruah")'
                  />
                </Form.Group>
                <Form.Group controlId="onahBeinunis24Hours">
                  <Form.Check
                    type="switch"
                    id="onahBeinunis24Hours"
                    label="Keep Onah Beinonis (30, 31 and Yom HaChodesh) for a full 24 Hours"
                  />
                </Form.Group>
                <Form.Group controlId="keepThirtyOne">
                  <Form.Check
                    size="lg"
                    type="switch"
                    id="keepThirtyOne"
                    label="Keep day Thirty One for Onah Beinonis"
                  />
                </Form.Group>
                <Form.Group controlId="keepLongerHaflagah">
                  <Form.Check
                    type="switch"
                    id="keepLongerHaflagah"
                    label="Haflaga is only cancelled by a longer one"
                  />
                </Form.Group>
                <Form.Group controlId="dilugChodeshPastEnds">
                  <Form.Check
                    type="switch"
                    id="dilugChodeshPastEnds"
                    label=" Continue incrementing Dilug Yom Hachodesh Kavuahs into another month"
                  />
                </Form.Group>
                <Form.Group controlId="haflagaOfOnahs">
                  <Form.Check
                    type="switch"
                    id="haflagaOfOnahs"
                    label="Calculate Haflagas by counting Onahs"
                  />
                </Form.Group>
                <Form.Group controlId="kavuahDiffOnahs">
                  <Form.Check
                    type="switch"
                    id="kavuahDiffOnahs"
                    label="Flag Kavuahs even if not all the same Onah"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className={styles.cardFooter}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          <Card className={styles.card}>
            <Card.Header className={styles.cardHeader}>
              <h3>Application Settings</h3>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
                <Form.Group controlId="navigateBySecularDate">
                  <Form.Text>Calendar displays current:</Form.Text>
                  Jewish Date
                  <Form.Check
                    type="switch"
                    id="navigateBySecularDate"
                    label="Secular date"
                  />
                  <Form.Text className="text-muted">
                    Navigate by the secular date instead of the default Jewish
                    Date
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="showOhrZeruah">
                  <Form.Check
                    type="switch"
                    id="showOhrZeruah"
                    label='Flag previous onah (The "Ohr Zaruah")'
                  />
                </Form.Group>
                <Form.Group controlId="onahBeinunis24Hours">
                  <Form.Check
                    type="switch"
                    id="onahBeinunis24Hours"
                    label="Keep Onah Beinonis (30, 31 and Yom HaChodesh) for a full 24 Hours"
                  />
                </Form.Group>
                <Form.Group controlId="keepThirtyOne">
                  <Form.Check
                    type="switch"
                    id="keepThirtyOne"
                    label="Keep day Thirty One for Onah Beinonis"
                  />
                </Form.Group>
                <Form.Group controlId="keepLongerHaflagah">
                  <Form.Check
                    type="switch"
                    id="keepLongerHaflagah"
                    label="Haflaga is only cancelled by a longer one"
                  />
                </Form.Group>
                <Form.Group controlId="dilugChodeshPastEnds">
                  <Form.Check
                    type="switch"
                    id="dilugChodeshPastEnds"
                    label=" Continue incrementing Dilug Yom Hachodesh Kavuahs into another month"
                  />
                </Form.Group>
                <Form.Group controlId="haflagaOfOnahs">
                  <Form.Check
                    type="switch"
                    id="haflagaOfOnahs"
                    label="Calculate Haflagas by counting Onahs"
                  />
                </Form.Group>
                <Form.Group controlId="kavuahDiffOnahs">
                  <Form.Check
                    type="switch"
                    id="kavuahDiffOnahs"
                    label="Flag Kavuahs even if not all the same Onah"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className={styles.cardFooter}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Modal
        animation
        centered
        show={showLocations}
        onHide={() => setShowLocations(false)}
      >
        <Modal.Header closeButton className={styles.cardHeader}>
          <Modal.Title>Choose your location</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.cardHeader}>
          <ChooseLocation
            changeLocation={location => {
              appData.Settings.location = location;
              setAppData(appData);
              setShowLocations(false);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLocations(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowLocations(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
