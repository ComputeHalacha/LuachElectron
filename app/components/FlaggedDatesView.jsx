import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

export default function FlaggedDatesView({ appData, setAppData, jdate }) {
  return (
    <Container fluid>
      <Row xs={12}>
        <Col>
          <h1>Flagged Dates View</h1>
        </Col>
      </Row>
    </Container>
  );
}
