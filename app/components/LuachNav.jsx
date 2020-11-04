import PropTypes from 'prop-types';
import React from 'react';
import { Nav } from 'react-bootstrap';
import {
  faCalendarDay,
  faCalendarWeek,
  faCalendar,
  faFlag,
  faEye,
  faTools,
  faCog,
  faStopwatch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LuachNav(props) {
  const {
    homeViewType,
    setHomeViewType,
    variant,
    defaultActiveKey,
    className
  } = props;
  return (
    <Nav
      justify
      variant={variant}
      className={className}
      defaultActiveKey={defaultActiveKey}
      activeKey={homeViewType}
    >
      <Nav.Item>
        <Nav.Link eventKey="day" onClick={() => setHomeViewType('day')}>
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendarDay} />
          &nbsp;Days View
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="week" onClick={() => setHomeViewType('week')}>
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendarWeek} />
          &nbsp;Week View
        </Nav.Link>
      </Nav.Item>
      <Nav.Item active={homeViewType === 'month' ? 'true' : 'false'}>
        <Nav.Link eventKey="month" onClick={() => setHomeViewType('month')}>
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCalendar} />
          &nbsp;Month View
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="flaggedDates"
          onClick={() => setHomeViewType('flaggedDates')}
        >
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faFlag} />
          &nbsp;Flagged Dates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="entries" onClick={() => setHomeViewType('entries')}>
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faEye} />
          &nbsp;Entries
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="kavuahs" onClick={() => setHomeViewType('kavuahs')}>
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faCog} />
          &nbsp;Kavuahs
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="occasions"
          onClick={() => setHomeViewType('occasions')}
        >
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faStopwatch} />
          &nbsp;Occasions
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="settings"
          onClick={() => setHomeViewType('settings')}
        >
          <FontAwesomeIcon style={{ maxWidth: 25 }} icon={faTools} />
          &nbsp;Settings
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

LuachNav.propTypes = {
  className: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  homeViewType: PropTypes.string,
  setHomeViewType: PropTypes.func.isRequired,
  variant: PropTypes.string
};
