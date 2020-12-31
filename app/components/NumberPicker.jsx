import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { setDefault, range } from '../code/GeneralUtils';
import Utils from '../code/JCal/Utils';

export default function NumberPicker(props) {
  const {
    value,
    style,
    startNumber,
    endNumber,
    suffixed,
    unitName,
    onChange,
    className
  } = props;

  const getValueText = number =>
    (suffixed ? Utils.toSuffixed(number) : number.toString()) +
    (unitName ? ` ${unitName}${number !== 1 && !suffixed ? 's' : ''}` : '');

  return (
    <DropdownButton
      title={getValueText(value)}
      flip="true"
      focusFirstItemOnShow
      variant="secondary"
      style={style || { display: 'inline-block' }}
      className={className}
    >
      {range(setDefault(startNumber, 1), endNumber).map(n => (
        <Dropdown.Item
          key={n}
          eventKey={n}
          active={value === n}
          onSelect={key => {
            onChange(key);
          }}
        >
          {getValueText(n)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

NumberPicker.propTypes = {
  className: PropTypes.string,
  endNumber: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  startNumber: PropTypes.number,
  style: PropTypes.object,
  suffixed: PropTypes.bool,
  unitName: PropTypes.string,
  value: PropTypes.number
};
