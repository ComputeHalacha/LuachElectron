import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
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
  Nav
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearchLocation,
  faArrowUp,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import ChooseLocation from './ChooseLocation';
import styles from '../scss/SettingsView.scss';
import { scrollTo, inform, getGlobals } from '../code/GeneralUtils';
import DataUtils from '../code/Data/DataUtils';
import EditInput from './EditInput';
import JdateChooser from './JdateChooser';

export default function EntriesView({ appData, setAppData, jdate }) {
  const entryList = appData.EntryList;
  const [showAddNew, setShowAddNew] = useState(false);
  return (
    <Container fluid>
      <Row xs={12}>
        <Col className={styles.pageHeader}>
          <h1>Entries</h1>
          <Nav>
            <Nav.Link onClick={() => setShowAddNew(!showAddNew)}>
              <FontAwesomeIcon icon={faPlus} style={{ maxWidth: 45 }} />
              Add New Entry
            </Nav.Link>
          </Nav>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          {entryList &&
            entryList.list.map((entry, index) => (
              <Card
                key={entry.entryId.toString() || entry.toString()}
                className={styles.card}
              >
                <Card.Header className={styles.sectionHeader}>
                  <h3>{entry.toLongString()}</h3>
                </Card.Header>
                <Card.Body className={styles.cardBody}></Card.Body>
              </Card>
            ))}
        </Col>
      </Row>
      <Modal
        animation
        centered
        show={showAddNew}
        onHide={() => setShowAddNew(false)}
      >
        <Modal.Header closeButton className={styles.sectionHeader}>
          <Modal.Title>Add a new Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.cardHeader}>
          <Form>
            <Form.Group controlId="jdate">
              <Form.Label>Choose the Jewish Date</Form.Label>
              <InputGroup className="mb-3" style={{ maxWidth: '350px' }}>
                <JdateChooser />
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
        </Modal.Body>
      </Modal>
    </Container>
  );
}

EntriesView.propTypes = {
  appData: PropTypes.object.isRequired,
  setAppData: PropTypes.func.isRequired
};
