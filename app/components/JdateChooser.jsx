import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import {
  Link,
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
import { range } from '../code/GeneralUtils';
import Utils from '../code/JCal/Utils';
import JDate from '../code/JCal/JDate';
import NumberPicker from './NumberPicker';

export default function JdateChooser(props) {
  const [modalVisible, setModalVisible] = useState(false),
    { jdate, setDate } = props,
    months = range(1, 13),
    changeDate = (year, month, day) => {
      // To prevent user from choosing a non-exiting month or day
      const daysInMonth = JDate.daysJMonth(year, month),
        monthsInYear = JDate.monthsJYear(year);
      setDate(
        new JDate(
          year,
          // Choosing Adar Sheini in a non-leap-year will set the month to Adar
          Math.min(month, monthsInYear),
          // Choosing day 30 in a non-full-month will set the day to 29
          Math.min(day, daysInMonth)
        )
      );
    };
  return (
    // eslint-disable-next-line react/jsx-fragments
    <Fragment>
      <Link href="#" onPress={() => setModalVisible(!modalVisible)}>
        {jdate.toString()}
      </Link>
      <Modal
        style={{ flex: 1 }}
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: '#0009',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              flex: 0,
              width: 350,
              maxWidth: '90%'
            }}
          >
            <div
              style={{
                backgroundColor: '#88a',
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 10,
                paddingRight: 10
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'center'
                }}
              >
                {`${jdate.toString()}\n`}
                <span style={{ fontSize: 22 }}>{jdate.toStringHeb()}</span>
              </span>
            </div>
            <div>
              <span>Jewish Day</span>
              <NumberPicker
                startNumber={1}
                endNumber={JDate.daysJMonth(jdate.Year, jdate.Month)}
                onChange={value => changeDate(jdate.Year, jdate.Month, value)}
                value={jdate.Day}
              />
            </div>
            <div>
              <span>Jewish Month</span>
              <select
                value={jdate.Month}
                onChange={value => changeDate(jdate.Year, value, jdate.Day)}
              >
                {months.map(i => (
                  <option value={i} key={i}>
                    {Utils.jMonthsEng[i]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span>Jewish Year</span>
              <NumberPicker
                startNumber={jdate.Year - 30}
                endNumber={jdate.Years}
                onChange={value => changeDate(value, jdate.Month, jdate.Day)}
                value={jdate.Year}
              />
            </div>
            <div>
              <Link onPress={() => setModalVisible(false)}>
                <div
                  style={{
                    alignItems: 'flex-end',
                    margin: 30
                  }}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: 15,
                      color: '#77a'
                    }}
                  >
                    CLOSE
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

JdateChooser.propTypes = {
  jdate: PropTypes.shape({
    Day: PropTypes.any,
    Month: PropTypes.any,
    Year: PropTypes.number,
    toString: PropTypes.func,
    toStringHeb: PropTypes.func
  }).isRequired,
  setDate: PropTypes.func.isRequired
};
