import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import "../components/SessionExpirationModal.scss";

const SessionExpiryPopup = ({ show, onHide, onContinueSession, onLogout,countdown }) => {

  useEffect(() => {
    let timer;

    if (show) {
      if (countdown <= 0) {
        clearInterval(timer);
        onLogout();
      } else {
        timer = setInterval(() => {
          if (countdown <= 0) {
            clearInterval(timer);
            onLogout();
          }
        }, 1000);
      }
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [show, countdown, onLogout]);


  return (
    <Modal dialogClassName="custom-modal" show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header  className="modalHeader">
      <Modal.Title className="modalTitle">
           <span>Session Timeout</span>
         </Modal.Title>
       </Modal.Header>
       <Modal.Body className="modalBody">
         <p className="popupMsg">
           <span className="countdownText">
             {" "}
             <FaExclamationTriangle className="warningIcon me-1" /> Your session
             will expire in
           </span>
           <span className="countdown">{countdown} seconds</span>{" "}
           <span className="countdownText2">Do you want to continue?</span>
         </p>
       </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={onLogout}>
          No, Logout
        </Button>
        <Button className="continueBtn" onClick={onContinueSession}>
          Yes, Continue
        </Button>     
      </Modal.Footer>
    </Modal>
  );
};

export default SessionExpiryPopup;


