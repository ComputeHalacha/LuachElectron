import React, { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { getTodayJdate } from '../code/JCal/JDateUtils';
import Utils from '../code/JCal/Utils';
import styles from '../scss/WeekView.scss';

function getDaysList(jdate) {
  const dow = jdate.getDayOfWeek();
  const sunday = dow === 0 ? jdate : jdate.addDays(-dow);
  const daysList = [sunday];
  for (let i = 1; i < 6; i++) {
    daysList.push(sunday.addDays(i));
  }
  return daysList;
}

export default function WeekView({ jdate }) {
  const todayJd = getTodayJdate();
  const [currJd, setcurrJd] = useState(jdate || todayJd);
  const [daysList, setDaysList] = useState(getDaysList(currJd));

  function changeDays(daysToAdd) {
    const newCurr = currJd.addDays(daysToAdd);
    setcurrJd(newCurr);
    setDaysList(getDaysList(newCurr));
  }

  function setToday() {
    setcurrJd(todayJd);
    setDaysList(getDaysList(todayJd));
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={1}>
          <Button onClick={() => changeDays(-7)}>Earlier</Button>
        </Col>
        <Col xs={1}>
          <Button onClick={() => setToday()}>Today</Button>
        </Col>
      </Row>
      <Row xs={12}>
        <Col>
          <div className={styles.cardDeck}>
            {daysList.map((d, i) => (
              <Card
                className={
                  Utils.isSameJdate(d, todayJd) ? styles.cardToday : ''
                }
                key={i}
              >
                <Card.Header className={styles.cardHeader}>
                  <span>{d.toStringHeb()}</span>
                </Card.Header>
                <Card.Body className={styles.cardBody}>
                  <Card.Title>{d.Day}</Card.Title>
                  <Card.Text>{d.toString()}</Card.Text>
                </Card.Body>
                <Card.Footer className={styles.cardFooter}>
                  <small className="text-muted">this is a footer</small>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => changeDays(7)}>Later</Button>
        </Col>
      </Row>
    </Container>
  );
}
