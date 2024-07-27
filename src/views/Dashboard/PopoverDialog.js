import { DialogContent, DialogTitle, Dialog } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function PopoverDialog(props) {
  const {
    taskId,
    columnId,
    onClose,
    isOpen,
    exceedHoursDates,
    notes,
    timesheetDate,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const generateParagraphs = () => {
    return exceedHoursDates.map((date, index) => (
      <p key={index} type="text" contentEditable="true">
        Please Correct the Following Errors before saving timesheet: Hours
        reported for a day cannot exceed 24 Hours. Please correct Timesheet for
        Date: {moment(date).format("DD-MMM-YYYY")}
      </p>
    ));
  };
  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className="dashboardPopover">
        <DialogTitle className="header">
          <span>{"Error !"}</span>
          <button title="Close" className="float-right" onClick={handleClose}>
            x
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="errorMsg">{generateParagraphs()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
