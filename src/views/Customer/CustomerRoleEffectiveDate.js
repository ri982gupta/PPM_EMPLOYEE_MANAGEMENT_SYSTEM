import React, { useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useEffect } from "react";

const InputSixComponent = (props) => {
  const { rowData, setDisable, setIsModified, onchangeDate } = props;

  const [date1, setDate1] = useState(null);
  const formattedDate = moment(rowData.effectiveMonth, "YYYY-MM-DD").format(
    "MMM-yyyy"
  );

  useEffect(() => {
    // setDate1(() => new Date(rowData.effectiveMonth));
    setDate1(rowData.effectiveMonth ? new Date(rowData.effectiveMonth) : "");
    if (rowData.effectiveMonth) {
      let date = rowData.effectiveMonth;

      const [year, month, day] = date.split("-");
      const formattedDate = `${new Date(year, month - 1, day).toLocaleString(
        "default",
        { month: "short" }
      )}-${year}`;
    }
  }, [rowData, rowData.effectiveMonth]);

  return (
    <div>
      <div className="datepicker">
        <DatePicker
          name="month"
          id="month"
          className="cancel"
          selected={date1}
          minDate={new Date(rowData.effectiveMonth)}
          onChange={(e) => {
            onchangeDate(e, rowData);
            setDate1(e);
            setDisable(false);
            setIsModified(true);
          }}
          dateFormat="MMM-yyyy"
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          placeholderText="Select Month"
          showMonthYearPicker
        />
      </div>
    </div>
  );
};

export default InputSixComponent;
