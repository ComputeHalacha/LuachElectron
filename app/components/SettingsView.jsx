import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
  InputGroup,
  Alert
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import ChooseLocation from './ChooseLocation';
import AppDataContext from './AppDataContext';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import styles from '../scss/SettingsView.scss';
import { log } from '../code/GeneralUtils';
import DataUtils from './../code/Data/DataUtils';

export default function SettingsView() {
  const { appData, setAppData } = useContext(AppDataContext);
  const [showLocations, setShowLocations] = useState(false);

  const saveSettings = async () => {
    await DataUtils.SettingsToDatabase(appData.Settings);
    setAppData(appData);
  };

  const cancelChanges = async () => {
    appData.Settings = await DataUtils.SettingsFromDatabase();
    setAppData(appData);
  };

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
                <Form.Group
                  controlId="formBasicEmail"
                  onClick={() => setShowLocations(true)}
                >
                  <Form.Label>Choose your location</Form.Label>
                  <InputGroup className="mb-3" style={{ maxWidth: '350px' }}>
                    <Form.Control
                      type="text"
                      defaultValue={appData.Settings.location.Name}
                      placeholder="Choose your location"
                      readOnly
                      onKeyDown={() => setShowLocations(true)}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>
                        <FontAwesomeIcon
                          icon={faSearchLocation}
                          style={{ maxWidth: 45, marginRight: 5 }}
                        />
                        Search
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Zmanim depend on your location
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="showOhrZeruah">
                  <BootstrapSwitchButton
                    checked={appData.Settings.showOhrZeruah}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.showOhrZeruah = checked;
                    }}
                  />
                  {' Flag previous onah (The "Ohr Zaruah")'}
                </Form.Group>
                <Form.Group controlId="onahBeinunis24Hours">
                  <BootstrapSwitchButton
                    checked={appData.Settings.onahBeinunis24Hours}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.onahBeinunis24Hours = checked;
                    }}
                  />
                  {
                    ' Keep Onah Beinonis (30, 31 and Yom HaChodesh) for a full 24 Hours'
                  }
                </Form.Group>
                <Form.Group controlId="keepThirtyOne">
                  <BootstrapSwitchButton
                    checked={appData.Settings.keepThirtyOne}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.keepThirtyOne = checked;
                    }}
                  />
                  {' Keep day Thirty One for Onah Beinonis'}
                </Form.Group>
                <Form.Group controlId="keepLongerHaflagah">
                  <BootstrapSwitchButton
                    checked={appData.Settings.keepLongerHaflagah}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.keepLongerHaflagah = checked;
                    }}
                  />
                  {' Haflaga is only cancelled by a longer one'}
                </Form.Group>
                <Form.Group controlId="dilugChodeshPastEnds">
                  <BootstrapSwitchButton
                    checked={appData.Settings.dilugChodeshPastEnds}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.dilugChodeshPastEnds = checked;
                    }}
                  />
                  {
                    ' Continue incrementing Dilug Yom Hachodesh Kavuahs into another month'
                  }
                </Form.Group>
                <Form.Group controlId="haflagaOfOnahs">
                  <BootstrapSwitchButton
                    checked={appData.Settings.haflagaOfOnahs}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.haflagaOfOnahs = checked;
                    }}
                  />
                  {' Calculate Haflagas by counting Onahs'}
                </Form.Group>
                <Form.Group controlId="kavuahDiffOnahs">
                  <BootstrapSwitchButton
                    checked={appData.Settings.kavuahDiffOnahs}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.kavuahDiffOnahs = checked;
                    }}
                  />
                  {' Flag Kavuahs even if not all the same Onah'}
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className={styles.cardFooter}>
              <Container fluid>
                <Row>
                  <Col md="auto">
                    <Button variant="primary" onClick={cancelChanges}>
                      Cancel Changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      type="submit"
                      onClick={saveSettings}
                    >
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </Container>
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
                  <BootstrapSwitchButton
                    checked={appData.Settings.navigateBySecularDate}
                    onlabel="Secular Date"
                    offlabel="Jewish Date"
                    onstyle="secondary"
                    offstyle="primary"
                    width="150"
                    onChange={checked => {
                      appData.Settings.navigateBySecularDate = checked;
                      setAppData(appData);
                    }}
                  />
                  {' Date navigation calendar displayed'}
                  {appData.Settings.navigateBySecularDate === true && (
                    <Alert
                      variant="danger"
                      style={{ maxWidth: '50%', margin: 10 }}
                    >
                      Please Note: If the current time is between sunset and
                      midnight, the current Jewish date will be incorrect.
                    </Alert>
                  )}
                </Form.Group>
                <Form.Group controlId="calcKavuahsOnNewEntry">
                  <BootstrapSwitchButton
                    checked={appData.Settings.calcKavuahsOnNewEntry}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.calcKavuahsOnNewEntry = checked;
                    }}
                  />
                  {' Automatically Calculate Kavuahs upon addition of an Entry'}
                </Form.Group>
                <Form.Group controlId="noProbsAfterEntry">
                  <BootstrapSwitchButton
                    checked={appData.Settings.noProbsAfterEntry}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.noProbsAfterEntry = checked;
                    }}
                  />
                  {" Don't show Flagged dates for a week after Entry"}
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
              <Container fluid>
                <Row>
                  <Col md="auto">
                    <Button variant="primary" onClick={cancelChanges}>
                      Cancel Changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      type="submit"
                      onClick={saveSettings}
                    >
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </Container>
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
      </Modal>
    </Container>
  );
}
