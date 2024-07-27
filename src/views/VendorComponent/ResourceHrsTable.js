import React, { useEffect, useRef, useState } from "react";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { ImCross } from "react-icons/im";
import { environment } from "../../environments/environment";
import { BiCheck, BiX } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateResourceComments } from "../../reducers/SelectedSEReducer";
import { useSelector } from "react-redux";
import { IoWarningOutline } from "react-icons/io5";
import Popover from "@mui/material/Popover";
import { DialogContent, DialogTitle } from "@material-ui/core";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { Box, IconButton } from "@mui/material";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

function ResourceHrsTable(props) {
  const {
    tableData,
    resId,
    ResHrsDetails,
    setDispResData,
    setResData,
    payloadData,
    searchHandle1,
    setValidationMessage,
    validationMsg,
  } = props;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [dataPR, setDataPR] = useState([{}]);
  const baseUrl = environment.baseUrl;
  const [successfullymsg, setSccessfullyMsg] = useState(false);
  const [newData, setNewData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [invoicableDtData, setininvoicableDtData] = useState([]);
  const dispatch = useDispatch();
  const [popup, setPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const ref3 = useRef([]);
  const [formattedDate, setFormattedDate] = useState("");

  const handleClose = () => {
    setAnchorEl(false);
  };
  const [formdata, setFormdata] = useState([
    {
      resId: resId,
      invoicebleHrs: "",
      invoicableDt: "",
      comments: "",
      loggedUserId: loggedUserId,
    },
  ]);

  let getResData = {
    resource_id: resId,
    month: payloadData.FromDt,
  };

  useEffect(() => {
    const slicedData = tableData.slice(1);
    setNewData(slicedData);
  }, [tableData]);

  const invalidDates = useSelector(
    (state) => state.selectedSEState.resourecHrs
  );
  useEffect(() => {
    getData();
  }, [tableData, invalidDates]);

  // useEffect(() => {
  //   getData();
  // }, [anchorEl]);
  useEffect(() => {
    getData();
  }, [anchorEl, validationMsg]);
  const handleSaveClick = () => {
    let finaldata = formdata.slice(1);
    console.log(finaldata);
    const filteredDates = finaldata
      .filter((item) => item.comments === "" || item.invoicebleHrs === "")
      .map((item) => item.invoicableDt);

    const formattedDates = filteredDates.map((date) => {
      const formattedDate = new Date(date);
      const year = formattedDate.getFullYear();
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = formattedDate.getDate().toString().padStart(2, "0");
      const day1 = formattedDate.getDate().toString().padStart(1, "0");
      return `${year}_${month}_${day}_${day1}_day`;
    });
    dispatch(updateResourceComments(formattedDates));
    console.log(formattedDates);
    if (formattedDates.length > 0) {
      setValidationMessage(true);
      return;
    } else {
      setValidationMessage(false);
      axios({
        url: baseUrl + `/VendorMS/subkTimesheet/saveInvoicablehrsandcomments`,
        method: "post",
        data: finaldata,
      }).then((resp) => {
        setSccessfullyMsg(true);
        setTimeout(() => {
          setSccessfullyMsg(false);
          ResHrsDetails(getResData, payloadData.FromDt);
        }, 3000);
        dispatch(updateResourceComments(""));
        searchHandle1();
        setFormdata([
          {
            resId: resId,
            invoicebleHrs: "",
            invoicableDt: "",
            comments: "",
            loggedUserId: loggedUserId,
          },
        ]);
      });
    }
  };
  const handleReset = () => {
    setValidationMessage(false);
    setFormdata([
      {
        resId: resId,
        invoicebleHrs: "",
        invoicableDt: "",
        comments: "",
        loggedUserId: loggedUserId,
      },
    ]);
    const currentStDte = formattedDate;
    const prevEdDate = moment(currentStDte)
      .startOf("month")
      .format("YYYY-MM-DD");
    ResHrsDetails(getResData, prevEdDate);
    formdata.forEach((item) => {
      item.invoicebleHrs = "";
      item.invoicableDt = "";
      item.comments = "";
    });
  };

  const handleInputChange = (e, invoicableDt) => {
    const { name, value } = e.target;
    setFormdata((prevData) => {
      const newData = [...prevData];
      const existingIndex = newData.findIndex(
        (item) => item.invoicableDt === invoicableDt
      );
      if (existingIndex !== -1) {
        // If an object with the same invoicableDt already exists, update it
        newData[existingIndex][name] = value;
      } else {
        // If not, create a new object for this invoicableDt
        newData.push({
          // id: uuid(), // You can use uuid or any other method to generate unique IDs
          resId: resId,
          invoicebleHrs: name === "invoicebleHrs" ? value : "",
          invoicableDt: invoicableDt,
          comments: name === "comments" ? value : "",
          loggedUserId: loggedUserId,
        });
      }
      return newData;
    });
  };

  const getData = () => {
    const headerRow = tableData.find((row) => row.id === -1);
    if (!headerRow) {
      setColumns(null);
      return;
    }
    const headers = Object.keys(headerRow);
    const filteredHeaders = headers.filter(
      (header) => !["id", "resource_id", "lvl", "status"].includes(header)
    );
    const dateHeaders = filteredHeaders.filter(
      (header) => header !== "name" && header !== "total"
    );
    dateHeaders.sort();
    const sortedHeaders = ["name", ...dateHeaders];
    const newHeaders = filteredHeaders.map((key, index) => {
      const headerValue = headerRow[key];
      function getOrdinalSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const remainder = number % 100;
        return (
          number +
          (suffixes[(remainder - 20) % 10] ||
            suffixes[remainder] ||
            suffixes[0])
        );
      }

      const lines = headerValue.split("\n");
      const transformedData = lines
        .map((line) => {
          const parts = line.split(" ");
          const sequenceNumber = parseInt(parts[0]);
          const ordinalSuffix = getOrdinalSuffix(sequenceNumber);
          return `${ordinalSuffix} ${parts.slice(1).join(" ")}`;
        })
        .join("\n");
      const headerText = key == "name" ? "Name" : key;
      let originalString = transformedData;
      let transformedData1 = originalString.replace(
        /(\d+)(st|nd|rd|th)/g,
        function (match, number, suffix) {
          return (
            number +
            '<span class="SubkTimeSheetResourceHeader">' +
            '</span><sup class="SubkTimeSheetResourceHeader">' +
            suffix +
            "</sup>"
          );
        }
      );
      return {
        accessorKey: key,
        header: headerText,
        Header: () => (
          <div
            title={
              key.includes("_")
                ? transformedData
                : headerValue === "name"
                ? "Name"
                : headerValue === "type"
                ? "Type"
                : headerValue
            }
          >
            {key.includes("_") ? (
              <div dangerouslySetInnerHTML={{ __html: transformedData1 }} />
            ) : headerValue === "name" ? (
              "Name"
            ) : headerValue === "type" ? (
              "Type"
            ) : (
              <div dangerouslySetInnerHTML={{ __html: transformedData1 }} />
            )}
          </div>
        ),

        Cell: ({ cell, index }) => {
          const cellValue = cell.getValue();
          let keyval = key.split("_");
          let invoicableDt = keyval.slice(0, 3).join("-");
          return (
            <div className="ellipsis">
              {key.includes("_") &&
              cell.row.original.id != 99 &&
              cell.row.original.id != 9 ? (
                <div>
                  <div className="col-12 pt-1 pb-1 p-0">
                    <input
                      type="text"
                      id="invoicebleHrs"
                      className={
                        invalidDates.includes(key) && validationMsg
                          ? "error-block"
                          : ""
                      }
                      disabled={cell.row.original.status === "1472"}
                      name="invoicebleHrs"
                      value={cellValue}
                      title={cellValue}
                      placeholder="hrs"
                      onKeyDown={(e) => {
                        const keyPressed = e.key;
                        const currentValue = e.target.value;

                        // Allow control keys such as backspace, delete, arrow keys, etc.
                        if (
                          e.ctrlKey ||
                          e.altKey ||
                          e.metaKey ||
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Backspace" ||
                          e.key === "Delete"
                        ) {
                          return;
                        }

                        // Allow digits and decimal point
                        if (
                          /^\d$/.test(keyPressed) ||
                          keyPressed === "." ||
                          (currentValue.indexOf(".") !== -1 &&
                            /^\d$/.test(keyPressed))
                        ) {
                          // Test if the resulting value would exceed 24
                          if (currentValue + keyPressed > 23) {
                            e.preventDefault();
                          }
                        } else {
                          // Prevent typing any other characters
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const { value } = e.target;
                        handleInputChange(e, invoicableDt),
                          setininvoicableDtData(invoicableDt);
                        setNewData((prevNewData) =>
                          prevNewData.map((row) => {
                            if (row.id === cell.row.original.id) {
                              return {
                                ...row,
                                [key]: value,
                              };
                            }
                            return row;
                          })
                        );
                      }}
                      onBlur={(e) => {
                        const inputId = e.target.id;
                        const inputValue = e.target.value.trim(); // Trim whitespace from input value
                        if (inputId === "invoicebleHrs" && inputValue) {
                          setAnchorEl(e.currentTarget);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <span title={cellValue} className="ellipsis">
                  {cellValue}
                </span>
              )}
              {anchorEl && (
                <Popover
                  className="POPUP"
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: {
                      width: "320px", // Set the width as per your requirement
                    },
                  }}
                >
                  <DialogTitle
                    style={{ padding: "2px 8px", backgroundColor: "#ddd" }}
                  >
                    <span style={{ fontSize: "14px" }}>{"Comments"}</span>
                    <button
                      style={{
                        float: "right",
                        marginRight: "-8px",
                        backgroundColor: "rgb(221, 221, 221)",
                      }}
                      className="button1"
                      onClick={() => {
                        setAnchorEl(null);
                      }}
                    >
                      <BiX />
                    </button>
                  </DialogTitle>
                  <DialogContent>
                    {validationMsg ? (
                      <div className="statusMsg error">
                        <IoWarningOutline />
                        {"Please select valid values for highlighted field"}
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className=" textfield"
                      ref={(ele) => {
                        ref3.current[0] = ele;
                      }}
                    >
                      <input
                        type="text"
                        className={
                          invalidDates.includes(key) && validationMsg
                            ? "error-block"
                            : ""
                        }
                        id="comments"
                        value={
                          formdata?.comments != null || formdata?.comments != ""
                            ? formdata?.comments
                            : "hi"
                        }
                        defaultValue=""
                        name="comments"
                        placeholder="Comments"
                        onChange={(e) => handleInputChange(e, invoicableDtData)}
                      ></input>

                      <div className="col-md-12 btn-container center ">
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => {
                            let valid = GlobalValidation(ref3);
                            if (valid) {
                              {
                                setValidationMessage(true);
                              }
                              return;
                            }
                            setAnchorEl(null);
                          }}
                        >
                          <FaSave /> Save
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Popover>
              )}
            </div>
          );
        },
      };
    });
    newHeaders.sort();
    setColumns(newHeaders);
  };

  useEffect(() => {
    dataPR[0] && setHeaderData(JSON.parse(JSON.stringify(dataPR[0])));
  }, [dataPR]);

  const [year, month] = payloadData?.FromDt.split("-");
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const endDate = `${year}-${month}-${lastDayOfMonth}`;

  useEffect(() => {
    if (newData && newData.length > 0) {
      const firstIndexFirstKey = Object.keys(newData[0])[6];
      const formattedDate1 = firstIndexFirstKey
        .split("_")
        .slice(0, 3)
        .join("-");
      setFormattedDate(formattedDate1);
      // Use the handlePrevMonthIcon and handleNextMonthIcon functions as needed
    } else {
      console.log("No data available in tableData.");
    }
  }, [newData]);
  const handlePrevMonthIcon = () => {
    const currentStDte = formattedDate;
    const prevStDate = moment(currentStDte)
      .subtract(1, "months")
      .format("YYYY-MM-DD");
    const prevEdDate = moment(prevStDate).startOf("month").format("YYYY-MM-DD");
    let getResData = {
      resource_id: resId,
      month: prevEdDate,
    };
    ResHrsDetails(getResData, prevEdDate);
    // getPrjTeamTimesheet(globalReportRunId, prevStDate, prevEdDate);
  };

  //Handling next month icon click on top left of table
  const handleNextMonthIcon = () => {
    const currentStDte = formattedDate;
    const nextStDate = moment(currentStDte)
      .add(1, "months")
      .format("YYYY-MM-DD");
    const nextEdDate = moment(nextStDate).startOf("month").format("YYYY-MM-DD");
    console.log(nextEdDate);
    let getResData = {
      resource_id: resId,
      month: nextEdDate,
    };
    ResHrsDetails(getResData, nextEdDate);
  };

  return (
    <div>
      {successfullymsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Invoiceable Hours added Successfully"}
        </div>
      ) : (
        ""
      )}

      {validationMsg ? (
        <div className="statusMsg error">
          <IoWarningOutline />
          {"Please select valid values for highlighted fields"}
        </div>
      ) : (
        ""
      )}

      <div className="materialReactExpandableTable ResourceHrsTable darkHeader">
        {newData && (
          <MaterialReactTable
            enableExpanding={false}
            enableStickyHeader
            enablePagination={false}
            enableBottomToolbar={false}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableHiding={false}
            enableFilters={false}
            enableSorting={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            filterFromLeafRows //apply filtering to all rows instead of just parent rows
            initialState={{
              showGlobalFilter: true,
              expanded: false,
              density: "compact",
              enablePinning: true,
            }}
            paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
            muiSearchTextFieldProps={{
              placeholder: `Search `,
              sx: { minWidth: "300px" },
              variant: "outlined",
            }}
            columns={columns}
            data={newData}
            renderTopToolbarCustomActions={({ table }) => (
              <div
                className="month-change-btn"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.1rem",
                    p: "0.1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      handlePrevMonthIcon();
                    }}
                  >
                    <AiFillLeftCircle />
                  </IconButton>
                  <b style={{ margin: 0 }}>
                    {moment(formattedDate).format("MMM-YYYY")}
                  </b>
                  <IconButton
                    onClick={() => {
                      handleNextMonthIcon();
                    }}
                  >
                    <AiFillRightCircle />
                  </IconButton>
                </Box>
              </div>
            )}
          />
        )}
      </div>
      <div className="row">
        <div className="col-md-12 btn-container center ">
          <button
            className="btn btn-primary mt-2 mb-2"
            onClick={handleSaveClick}
            style={{ cursor: formdata?.length > 1 ? "pointer" : "not-allowed" }}
            disabled={formdata.length <= 1}
          >
            <FaSave />
            Save
          </button>
          <button
            className="btn btn-secondary mt-2 mb-2"
            onClick={() => handleReset()}
          >
            <ImCross />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default ResourceHrsTable;
