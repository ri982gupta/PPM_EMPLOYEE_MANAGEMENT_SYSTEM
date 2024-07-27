import { PostAdd } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProjectReviews.scss";

const ProjectReviewDatePicker = (props) => {
  const {
    rowData,
    setpostData,

    selectedCustomer,

    reviewdatevalid,
    setselecteddatevalidation,
    changedRows,
    setChangedRows,
  } = props;

  const [selectedDate, setSelectedDate] = useState(
    rowData.scheduledDate ? new Date(rowData.scheduledDate) : null
  );

  const handleDateChange = (date, reviewId, projectId) => {
    setSelectedDate(date);
    setselecteddatevalidation(date);
    setpostData((prevData) => ({
      ...prevData,
      [reviewId]: {
        ...prevData[reviewId],
        selectedDate: date,
        reviewId: reviewId,
        projectId: projectId,
      },
    }));
    const currentRow = changedRows.get(projectId);
    if (currentRow) {
      const updateRow = {
        ...currentRow,
        scheduledDate: date,
      };
      const updateChangedRows = new Map(changedRows);

      updateChangedRows.set(updateRow.id, updateRow);
      setChangedRows(updateChangedRows);
    }
  };
  const rowClassName =
    selectedCustomer === rowData.projectId && reviewdatevalid
      ? "error-block"
      : "";
  return (
    <div>
      <div className={`datepicker projectReviewDatepciker `}>
        <DatePicker
          name="scheduled_date"
          className={`error ${rowClassName}`}
          id="scheduled_date"
          selected={selectedDate}
          autoComplete="off"
          onChange={(e) => {
            const revStatus = rowData?.revStatus;
            const reviewId = rowData?.reviewId;
            const date = e;
            handleDateChange(date, reviewId, rowData?.id);
          }}
          minDate={new Date()}
          dateFormat="dd-MMM-yyyy"
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          style={{ textAlign: "center" }}
        />
      </div>
    </div>
  );
};

export default ProjectReviewDatePicker;
