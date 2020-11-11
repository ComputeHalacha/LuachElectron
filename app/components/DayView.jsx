import React, { useState, useEffect } from 'react';
import { Container, CardGroup, Card, Button, Row, Col } from 'react-bootstrap';
import { getTodayJdate } from '../code/JCal/jDateUtils';
import Utils from '../code/JCal/Utils';
import styles from '../scss/DayView.scss';

function getDaysList(jdate) {
  const daysList = [jdate];
  for (let i = 1; i < 30; i++) {
    daysList.push(jdate.addDays(i));
  }
  return daysList;
}

export default function DayView({appData, setAppData, jdate}) {
  const todayJd = getTodayJdate();
  const [daysList, setDaysList] = useState(getDaysList(jdate || todayJd));

  function addNextDay() {
    const nextDay = daysList[daysList.length - 1].addDays(1);
    const newList = [...daysList, nextDay];
    setDaysList(newList);
  }

  function addPrevDay() {
    const prevDay = daysList[0].addDays(-1);
    const newList = [prevDay, ...daysList];
    setDaysList(newList);
  }

  function setToday() {
    setDaysList(getDaysList(todayJd));
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={1}>
          <Button onClick={() => addPrevDay()}>Earlier</Button>
        </Col>
        <Col xs={1}>
          <Button onClick={() => setToday()}>Today</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {daysList.map((d, i) => (
            <Card
              className={`${styles.card} ${
                Utils.isSameJdate(d, todayJd) ? styles.cardToday : ''
              }`}
              key={i}
            >
              <Card.Header className={styles.cardHeader}>
                <span>{d.toStringHeb()}</span>
              </Card.Header>
              <Card.Body className={styles.cardBody}>
                <Card.Title>{d.toShortString(true)}</Card.Title>
                <Card.Subtitle>
                  {Utils.toStringDate(d.getDate(), true)}
                </Card.Subtitle>
                <Card.Text>{d.toString()}</Card.Text>
              </Card.Body>
              <Card.Footer className={styles.cardFooter}>
                <small className="text-muted">this is a footer</small>
              </Card.Footer>
            </Card>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => addNextDay()}>Later</Button>
        </Col>
      </Row>
    </Container>
  );
}
