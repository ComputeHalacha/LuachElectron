import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

export default function PopUpMessage(props) {
  const { message, title, autoHideDelaySeconds, visible } = props;
  const [show, setShow] = useState(visible);
  return (
    <Toast
      show={show}
      onClose={() => setShow(false)}
      delay={autoHideDelaySeconds * 1000}
      autohide={!!autoHideDelaySeconds}
    >
      {title && (
        <Toast.Header>
          <strong className="mr-auto">{title}</strong>
        </Toast.Header>
      )}
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}
