import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillLeftCircle } from "react-icons/ai";
import { AiFillRightCircle } from "react-icons/ai";
import axios from "axios";
import { environment } from "../../../environments/environment";

function ExpensesCreateTable(props) {
  const baseUrl = environment.baseUrl;
  const {
    formData,
    setFormData,
    projectRenderData,
    dates,
    setDates,
    expenseTypeRenderData,
    iconState,
    setRates,
    setLoader,
    setWeekData,
    id,
    stackIdData,
  } = props;

  useEffect(() => {
    dateHandler();
  }, [formData]);

  const onClickHandler = (state) => {
    if (state === "left") {
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);
      let endDt = moment(formData.fromDate)
        .subtract(1, "days")
        .format("DD-MMM-yyyy");
      axios
        .get(
          baseUrl +
            `/timeandexpensesms/projectExpense/getWeekDays?lastDay=${endDt}`
        )
        .then((res) => {
          setLoader(false);
          clearTimeout(loaderTime);
          let strtDt = res.data?.days[0];
          let endDt = res.data?.days[res.data.days.length - 1];

          setFormData((prev) => ({ ...prev, ["fromDate"]: strtDt }));

          setFormData((prev) => ({
            ...prev,
            ["toDate"]: moment(endDt).endOf("day"),
          }));
          setWeekData(res.data);
          setRates(res.data.rates);
        })
        .catch((error) => console.log(error));
    } else {
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);
      let endDt = moment(formData.toDate).add(7, "days").format("DD-MMM-yyyy");
      axios
        .get(
          baseUrl +
            `/timeandexpensesms/projectExpense/getWeekDays?lastDay=${endDt}`
        )
        .then((res) => {
          setLoader(false);
          clearTimeout(loaderTime);
          let strtDt = res.data?.days[0];
          let endDt = res.data?.days[res.data.days.length - 1];

          setFormData((prev) => ({ ...prev, ["fromDate"]: strtDt }));

          setFormData((prev) => ({
            ...prev,
            ["toDate"]: moment(endDt).endOf("day"),
          }));
          setWeekData(res.data);
          setRates(res.data.rates);
        })
        .catch((error) => console.log(error));
    }
  };

  const dateHandler = () => {
    let dt = [];

    let stDt = moment(formData.fromDate);
    let endDt = moment(formData.toDate);

    while (stDt.isSameOrBefore(endDt, "day")) {
      dt.push(stDt.format("YYYY-MM-DD"));
      stDt.add(1, "days");
    }

    setDates(dt);
  };

  return (
    <div className="darkHeader">
      <table
        id="details"
        className="table table-bordered htmlTable expensesCreateTable"
      >
        <thead style={{ backgroundColor: "#eee" }}>
          <tr>
            <th colSpan={dates.length + 2}>
              <AiFillLeftCircle
                title="Previous Week"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onClickHandler("left");
                }}
              />
              {moment(formData.fromDate).format("DD-MMM-yyyy") +
                " to " +
                moment(formData.toDate).format("DD-MMM-yyyy")}
              <AiFillRightCircle
                style={{ cursor: "pointer" }}
                title="Next Week"
                onClick={() => {
                  onClickHandler("right");
                }}
              />
            </th>
          </tr>

          <tr>
            <th rowSpan={2}>{"Project/Expense Type"}</th>
            {dates.map((d) => (
              <th>{moment(d).format("ddd")}</th>
            ))}
            <th rowSpan={2}>{"Total"}</th>
          </tr>

          <tr>
            {dates.map((d) => (
              <th
                style={{
                  backgroundColor:
                    moment(d).format("DD-MMM-YYYY") ==
                    moment().format("DD-MMM-YYYY")
                      ? "#D9FBB3"
                      : "#eeeeee",
                  textAlign: "center",
                }}
              >
                {moment(d).format("DD-MMM")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {id !== undefined
            ? stackIdData.length > 0
              ? projectRenderData
              : ""
            : projectRenderData}

          {iconState === "down" && expenseTypeRenderData}
        </tbody>
      </table>
    </div>
  );
}

export default ExpensesCreateTable;
