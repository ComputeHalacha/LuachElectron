import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default function EditInput({
  onChange,
  type,
  className,
  placeholder,
  value
}) {
  const [newValue, setNewValue] = useState(value || '');
  const newValueRef = useRef(newValue);
  const timeoutRef = useRef(null);

  const handleChange = e => {
    newValueRef.current = e.target.value;
    setNewValue(newValueRef.current);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onChange(newValueRef.current);
    }, WAIT_INTERVAL);
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      newValueRef.current = e.target.value;
      setNewValue(newValueRef.current);
      onChange(newValueRef.current);
    }
  };

  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={newValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

EditInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};
