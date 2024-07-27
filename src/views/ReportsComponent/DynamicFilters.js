import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";

function DynamicFilters(props) {
  const { filterType, ele, optionsArr, formData, setFormData, refArr } = props;

  const [display, setDisplay] = useState(true);

  const SwitchCaseFilters = () => {
    switch (filterType) {
      case "Month Picker":
        setFormData((prev) => ({ ...prev, [ele.FName]: new Date() }));
        return (
          <div
            className="datepicker"
            ref={(e) => {
              refArr.current.push(e);
            }}
          >
            <DatePicker
              id={ele.FName}
              selected={new Date()}
              onChange={(date) => {
                setFormData((prev) => ({ ...prev, [ele.FName]: date }));
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
            />
          </div>
        );
        break;
      case "Multi Dropdown":
        return (
          <div
            className="multiselect"
            ref={(e) => {
              refArr.current.push(e);
            }}
          >
            <MultiSelect
              id={ele.FName}
              options={optionsArr}
              hasSelectAll={true}
              isLoading={false}
              shouldToggleOnHover={false}
              disableSearch={false}
              value={[]}
              disabled={false}
              onChange={(s) => {
                setFormData((prev) => ({ ...prev, [ele.FName]: s }));
              }}
            />
          </div>
        );
        break;
      case "Date Picker":
        formData[ele.FName] = moment()._d;
        return (
          display && (
            <div
              className="datepicker"
              ref={(e) => {
                refArr.current.push(e);
              }}
            >
              <DatePicker
                id={ele.FName}
                selected={
                  formData[ele.FName] == undefined
                    ? moment()._d
                    : formData[ele.FName]
                }
                onChange={(s) => {
                  setFormData((prev) => ({
                    ...prev,
                    [ele.FName]: moment(s)._d,
                  }));
                  setTimeout(() => {
                    setDisplay(false);
                  }, 500);
                  setTimeout(() => {
                    setDisplay(true);
                  }, 500);
                }}
              />
            </div>
          )
        );
        break;
      case "Drop Down":
        return (
          <select
            className="text"
            ref={(e) => {
              refArr.current.push(e);
            }}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, [ele.FName]: e.target.value }));
            }}
          >
            <option>{"<<Please Select>>"}</option>
            {optionsArr.map((ele, index) => {
              return (
                <option key={index} value={ele.value}>
                  {ele.label}
                </option>
              );
            })}
          </select>
        );

      default:
        return null;
        break;
    }
  };

  return (
    <div>
      <SwitchCaseFilters />
    </div>
  );
}

export default DynamicFilters;
