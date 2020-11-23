import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
  InputGroup,
  Alert,
  Navbar,
  Nav
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import ChooseLocation from './ChooseLocation';
import styles from '../scss/SettingsView.scss';
import { log, inform, getGlobals } from '../code/GeneralUtils';
import DataUtils from '../code/Data/DataUtils';
import NumberPicker from './NumberPicker';
import EditInput from './EditInput';
import LocalStorage from '../code/Data/LocalStorage';

function scrollTo(item) {
  item.scrollIntoView({
    behavior: 'smooth'
  });
}
function TopLink() {
  return (
    <Button onClick={() => scrollTo(window.document.body)}>
      <FontAwesomeIcon
        icon={faArrowUp}
        style={{ maxWidth: 45, marginRight: 5 }}
      />
      Top
    </Button>
  );
}

export default function SettingsView({ appData, setAppData }) {
  const [showLocations, setShowLocations] = useState(false);
  const [localStorage, setLocalStorage] = useState(new LocalStorage());
  const halachicRef = useRef(null);
  const applicationRef = useRef(null);
  const remoteRef = useRef(null);
  const reminderRef = useRef(null);
  const saveSettings = async () => {
    await DataUtils.SettingsToDatabase(appData);
    setAppData(appData);
  };
  const cancelChanges = async () => {
    appData.Settings = await DataUtils.SettingsFromDatabase();
    setAppData(appData);
  };

  const changePIN = pin => {
    const validPin = !pin || getGlobals().VALID_PIN.test(pin);
    if (validPin) {
      const ls = localStorage.clone();
      ls.PIN = pin;
      setLocalStorage(ls);
    } else {
      inform('Pin is  not valid');
    }
  };
  const changeUsername = userName => {
    if (userName && userName.length < 7) {
      inform(
        'Please choose a User Name with at least 7 characters',
        'Invalid user Name'
      );
    } else if (userName && userName === localStorage.password) {
      inform(
        'Please choose a User Name that is not the same as your Password',
        'Invalid user name'
      );
    } else {
      const ls = localStorage.clone();
      ls.remoteUserName = userName;
      setLocalStorage(ls);
    }
  };
  const changePassword = password => {
    if (localStorage.remoteUserName && password.length < 7) {
      inform(
        'Please choose a Password with at least 7 characters',
        'Invalid password'
      );
    } else if (password && password === localStorage.remoteUserName) {
      inform(
        'Please choose a Password that is not the same as your User Name',
        'Invalid password'
      );
    } else {
      const ls = localStorage.clone();
      ls.remotePassword = password;
      setLocalStorage(ls);
    }
  };

  return (
    <Container fluid>
      <Row xs={12}>
        <Col className={styles.pageHeader}>
          <h1>Luach Settings</h1>
          <Nav>
            <Nav.Link onClick={() => scrollTo(halachicRef.current)}>
              Halachic Settings
            </Nav.Link>
            <Nav.Link onClick={() => scrollTo(applicationRef.current)}>
              Application Settings
            </Nav.Link>
            <Nav.Link onClick={() => scrollTo(remoteRef.current)}>
              Remote Backup Settings
            </Nav.Link>
            <Nav.Link onClick={() => scrollTo(reminderRef.current)}>
              Reminder Settings
            </Nav.Link>
          </Nav>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          <Card ref={halachicRef} className={styles.card}>
            <Card.Header className={styles.sectionHeader}>
              <h3>Halachic Settings</h3>
              <TopLink />
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
          <Card ref={applicationRef} className={styles.card}>
            <Card.Header className={styles.sectionHeader}>
              <h3>Application Settings</h3>
              <TopLink />
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
                <Form.Group controlId="navigateBySecularDate">
                  <BootstrapSwitchButton
                    checked={appData.Settings.navigateBySecularDate}
                    onlabel="Secular Date"
                    offlabel="Jewish Date"
                    onstyle="primary"
                    offstyle="secondary"
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
                <Form.Group controlId="numberMonthsAheadToWarn">
                  <NumberPicker
                    value={appData.Settings.numberMonthsAheadToWarn}
                    unitName="Month"
                    onChange={number => {
                      appData.Settings.numberMonthsAheadToWarn = number;
                      setAppData(appData);
                    }}
                    startNumber={0}
                    endNumber={24}
                  />
                  {' Number of Months ahead to warn'}
                </Form.Group>
                <Form.Group controlId="showIgnoredKavuahs">
                  <BootstrapSwitchButton
                    checked={appData.Settings.showIgnoredKavuahs}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.showIgnoredKavuahs = checked;
                    }}
                  />
                  {' Show explicitly ignored Kavuahs in the Kavuah list'}
                </Form.Group>
                <Form.Group controlId="hideHelp">
                  <BootstrapSwitchButton
                    checked={appData.Settings.hideHelp}
                    onstyle="secondary"
                    offstyle="primary"
                    width="90"
                    onChange={checked => {
                      appData.Settings.hideHelp = checked;
                    }}
                  />
                  {' Hide Help Button'}
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
          <Card ref={remoteRef} className={styles.card}>
            <Card.Header className={styles.sectionHeader}>
              <h3>Remote Backup Settings</h3>
              <TopLink />
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
                <Form.Group controlId="remoteUserName">
                  <EditInput
                    type="text"
                    id="remoteUserName"
                    label="Remote backup account user name"
                    value={localStorage.remoteUserName}
                    onChange={val => changeUsername(val)}
                  />
                </Form.Group>
                <Form.Group controlId="remotePassword">
                  <EditInput
                    type="text"
                    id="remotePassword"
                    label="Remote backup account password"
                    onChange={val => changePassword(val)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className={styles.cardFooter}>
              <Container fluid>
                <Row>
                  <Col md="auto">
                    <Button
                      variant="primary"
                      onClick={async () => {
                        const ls = await LocalStorage.loadAll();
                        setLocalStorage(ls);
                      }}
                    >
                      Cancel Changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      type="submit"
                      onClick={() => localStorage.saveAll()}
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
          <Card ref={reminderRef} className={styles.card}>
            <Card.Header className={styles.sectionHeader}>
              <h3>Reminder Settings</h3>
              <TopLink />
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form>
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
        <Modal.Header closeButton className={styles.sectionHeader}>
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
