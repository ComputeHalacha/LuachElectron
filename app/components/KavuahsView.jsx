import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

function getDaysList(jdate) {
  const daysList = [jdate];
  for (let i = 1; i < 7; i++) {
    daysList.push(jdate.addDays(i));
  }
  return daysList;
}

export default function KavuahsView({appData, setAppData, jdate}) {
  return (
    <Container fluid>
      <Row xs={12}>
        <Col>
          <h1>Kavuahs View</h1>
        </Col>
      </Row>
    </Container>
  );
}
