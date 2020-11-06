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
          <Card>
            <Card.Header className={styles.cardHeader}>
              <h3>Halachic Settings</h3>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Choose your location</Form.Label>
                  <Form.Control
                    type="email"
                    value={appData.Settings.location.Name}
                    onBeforeInput={() => setShowLocations(!showLocations)}
                    placeholder="Choose your location"
                  />
                  <Form.Text className="text-muted">
                    Zmanim depend on your location
                  </Form.Text>
                  {showLocations && (
                    <Modal>
                      <ChooseLocation
                        appData={appData}
                        setAppData={setAppData}
                      />
                    </Modal>
                  )}
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
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          <Card>
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
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
