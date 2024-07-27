import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import { IoWarningOutline } from "react-icons/io5";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import axios from "axios";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Loader from "../Loader/Loader";
import { FaSave } from "react-icons/fa";
import { WindowSharp } from "@mui/icons-material";
import { Column } from "ag-grid-community";
import { DataTable } from "primereact/datatable";
import { VscSave } from "react-icons/vsc";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
function FillTimesheets() {
  const [dataTime, setDataTime] = useState([]);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [successmsg, setSuccessmsg] = useState(false);

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [ProjectName, setProjectName] = useState([]);
  const [hrs, setHrs] = useState("");
  const [ResourceN, setResourceN] = useState([]);
  const [TaskN, setTaskN] = useState([]);
  const [projectValue, setprojectValue] = useState([]);

  const HelpPDFName = "PMOTimesheet.pdf";
  const Headername = "Fill Timesheets Help";
  const [ResourceName, setResourceName] = useState([]);
  const [taskName, setTASKName] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validation, setValidation] = useState(false);
  const [taskvalidation, setTaskValidation] = useState(false);

  const [target, setTarget] = useState([]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Fill Timesheets"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [loaderState, setLoaderState] = useState(false);
  const [searching, setSearching] = useState(false);
  const [timedata, setTimeData] = useState({});
  const initialValue1 = {};
  const [tabledata, settabledata] = useState(initialValue1);
  const now = new Date();
  const quarter = now.getMonth();
  const year = now.getFullYear();
  const dd = new Date(year, quarter - 11);
  let rows = 25;
  const abortController = useRef(null);

  const [date, SetDate] = useState(moment(moment().startOf("month"))._d);
  const ref = useRef([]);

  const initialValue = {
    FromDate: moment(date).format("yyyy-MM-DD"),
    // prj_id: "",
    // res_id: "",
    // task_id: "",
  };
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  console.log(loggedUserId);

  const [formData, setFormData] = useState(initialValue);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setTaskValidation(true);
    setTASKName();
    setResourceN(value);
  };
  const handleChange1 = (e) => {
    const { id, value } = e.target;
    setTaskN(value);

    // setFormData((prevVal) => ({ ...prevVal, ["task_id"]: value }));
  };

  const [dataAccess, setDataAccess] = useState([]);

  console.log(dataAccess);

  const getMenus = () => {
    // setMenusData
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/admin/timesheet";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            // && submenu.display_name !== "Lock Timesheets"
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const TMExpensesSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find((subMenu) => subMenu.display_name === "Fill Timesheets");

      // Extract the access_level value
      const accessLevel = TMExpensesSubMenu
        ? TMExpensesSubMenu.userRoles.includes("690")
          ? 690
          : TMExpensesSubMenu.userRoles.includes("641")
          ? 641
          : TMExpensesSubMenu.userRoles.includes("46")
          ? 46
          : TMExpensesSubMenu.userRoles.includes("930") && 930
        : null;

      setDataAccess(accessLevel);

      if (accessLevel == 930) {
        axios
          .get(
            baseUrl +
              `/CommonMS/master/getProjectsforAE?loggedUserId=${loggedUserId}`
          )
          .then((Response) => {
            let data = Response.data;
            setProjectName(data);
          })
          .catch((error) => console.log(error));
      } else if (accessLevel == 641 || accessLevel == 690) {
        axios
          .get(
            baseUrl +
              `/ProjectMS/project/getProjectsbyDp?loggedUserId=${loggedUserId}`
          )
          // .then((Response) => {
          //   let data = Response.data;
          //   setProjectName(data);
          // })
          .then((response) => {
            var resp = response.data;
            resp.push({ id: "-1", name: "<<ALL>>" });
            setProjectName(resp);
          })
          .catch((error) => console.log(error));
      } else if (accessLevel == 46) {
        axios
          .get(
            baseUrl +
              `/ProjectMS/project/getProjectsForFillTimeSheets?loggedUserId=${loggedUserId}`
          )
          // .then((Response) => {
          //   let data = Response.data;
          //   setProjectName(data);
          // })
          .then((response) => {
            var resp = response.data;
            resp.push({ id: "-1", name: "<<ALL>>" });
            setProjectName(resp);
          })
          .catch((error) => console.log(error));
      } else {
        axios
          .get(baseUrl + `/timeandexpensesms/getProjectsForAdmin`)
          .then((Response) => {
            let data = Response.data;
            setProjectName(data);
          })
          .catch((error) => console.log(error));
      }
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  // const getProjectName = () => {
  //   console.log(dataAccess, "dataAccess");

  //   if (dataAccess == 909) {
  //     axios
  //       .get(baseUrl + `/CommonMS/master/getProjectsforAE?loggedUserId=${loggedUserId}`)
  //       .then((Response) => {
  //         let data = Response.data;
  //         setProjectName(data);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  //   else if (dataAccess == 641 || dataAccess == 690) {
  //     axios
  //       .get(
  //         baseUrl +
  //         `/ProjectMS/project/getProjectsbyDp?loggedUserId=${loggedUserId}`
  //       )
  //       // .then((Response) => {
  //       //   let data = Response.data;
  //       //   setProjectName(data);
  //       // })
  //       .then((response) => {
  //         var resp = response.data;
  //         resp.push({ id: "-1", name: "<<ALL>>" });
  //         setProjectName(resp);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  //   else {
  //     axios
  //       .get(baseUrl + `/timeandexpensesms/getProjectsForAdmin`)
  //       .then((Response) => {
  //         let data = Response.data;
  //         setProjectName(data);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // };
  const getResourceName = () => {
    if (projectValue != 0) {
      axios
        .get(baseUrl + `/timeandexpensesms/getResources?PrjId=${projectValue}`)
        .then((Response) => {
          let data = Response.data;
          setResourceName(data);
        })
        .catch((error) => console.log(error));
    }
  };
  const getTASKName = () => {
    if (ResourceN != 0) {
      axios
        .get(
          baseUrl +
            `/timeandexpensesms/getTaskList?resId=${ResourceN}&PrjId=${projectValue}&fromdt=${formData.FromDate}`
        )
        .then((Response) => {
          let data = Response.data;
          setTASKName(data);
        })
        .catch((error) => console.log(error));
    }
  };
  useEffect(() => {
    // getProjectName();
    getResourceName();
    getTASKName();
  }, [
    projectValue,
    formData.FromDate,
    ResourceN,
    timedata,
    dataTime,
    dataAccess,
  ]);

  useEffect(() => {
    getMenus();
  }, []);

  const getData = () => {
    let valid = GlobalValidation(ref);

    axios
      .post(
        baseUrl +
          `/timeandexpensesms/getTimesheetTable?resId=${ResourceN}&PrjId=${projectValue}&fromdt=${formData.FromDate}&taskId=${TaskN}`
      )
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          GetData[i]["createdAt"] =
            GetData[i]["createdAt"] == null
              ? ""
              : moment(GetData[i]["createdAt"]).format("DD-MM-YYYY HH:mm:ss");
        }

        setDataTime(GetData);

        // setTimeout(() => {
        setLoaderState(false);
        setSearching(true);
        // }, 2000);

        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        settabledata();
      })
      .catch((error) => {});
  };

  const handleClick = () => {
    GlobalCancel(ref);

    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }

    setLoaderState(false);
    abortController.current = new AbortController();
    setSearching(false);
    setValidationMessage(false);

    getData();
  };
  const topRef = useRef(null);

  const handleConfirm = (e) => {
    if (
      tabledata == undefined ||
      tabledata == null ||
      tabledata == {} ||
      hrs === "" ||
      hrs == 0 ||
      (hrs >= 0 && hrs >= 25)
    ) {
      setValidation(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
      setTimeout(() => {
        setValidation(false);
      }, 6000);
    } else {
      setTarget(e.target.value);

      setValidation(false);

      let data = [];
      Object.keys(tabledata).forEach((ele) => {
        const obj = {};
        obj["timesheetDt"] = ele;
        obj["enteredHours"] = Math.round(tabledata[ele]);
        obj["projectId"] = projectValue;
        obj["projectTaskId"] = TaskN;
        obj["resource_id"] = ResourceN;
        obj["approver_notes"] = "";
        obj["typStatusId"] = 174;

        obj["loggedId"] = loggedUserId;

        obj["updatedById"] = loggedUserId;

        data.push(obj);
      });

      axios({
        method: "post",
        url: baseUrl + `/administrationms/timeSheet/saveTimesheet`,
        data: data,
      }).then(function (res) {
        var resp = res.data;
        getData();
        setLoaderState(false);
        setSearching(false);
        setTimeout(() => {
          setLoaderState(false);
          setSearching(true);
        }, 5000);
        settabledata();

        setSuccessfullymsg(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
        setTimeout(() => {
          setSuccessfullymsg(false);
        }, 3000);
      });
    }
  };
  const handleConfirmSave = (e) => {
    setTarget(e.target.value);
    if (
      tabledata == undefined ||
      tabledata == null ||
      tabledata == {} ||
      hrs === "" ||
      hrs == 0 ||
      (hrs >= 0 && hrs >= 25)
    ) {
      setValidation(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

      setTimeout(() => {
        setValidation(false);
      }, 6000);
    } else {
      setValidation(false);
      let data = [];
      Object.keys(tabledata).forEach((ele) => {
        const obj = {};
        obj["timesheetDt"] = ele;
        obj["enteredHours"] = tabledata[ele];
        obj["projectId"] = projectValue;
        obj["projectTaskId"] = TaskN;
        obj["resource_id"] = ResourceN;
        obj["approver_notes"] = "";
        obj["typStatusId"] = 173;

        obj["loggedId"] = loggedUserId;

        obj["updatedById"] = loggedUserId;

        data.push(obj);
      });

      axios({
        method: "post",
        url: baseUrl + `/administrationms/timeSheet/saveTimesheet`,
        data: data,
      }).then(function (res) {
        var resp = res.data;

        getData(resp);
        settabledata();
        setSuccessmsg(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

        setTimeout(() => {
          setSuccessmsg(false);
        }, 3000);
      });
    }
  };
  const onchange = (e, rowData) => {
    setHrs(e);

    if (e === "" || (e >= 0 && e <= 24)) {
      settabledata((prev) => ({
        ...prev,
        [rowData.timesheet_dt]: e,
      }));
    }
  };

  const represent = (rowData) => {
    return (
      <div align="center">
        {moment(rowData.timesheet_dt).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const representComments = (rowData) => {
    return (
      <div align="center">
        {rowData.typ_status == 173 ? (
          <form>
            <input
              id="hours"
              disabled
              className="approvedHrs"
              value={Math.round(rowData.hours)}
            />
          </form>
        ) : rowData.typ_status == 172 ? (
          <input
            // disabled={
            //   dataAccess === 1000 || dataAccess === 100 || dataAccess === 46
            //     ? false
            //     : true
            // }
            id="hours"
            style={{ backgroundColor: "red", textAlign: "center" }}
            defaultValue={Math.round(rowData.hours)}
            onChange={(e) => {
              const roundedValue = Math.round(e.target.value);
              onchange(roundedValue, rowData);
            }}
          />
        ) : (
          <input
            // disabled={
            //   dataAccess === 1000 || dataAccess === 100 || dataAccess === 46
            //     ? false
            //     : true
            // }
            id="hours"
            // maxLength="2"
            style={{ textAlign: "center" }}
            defaultValue={Math.round(rowData.hours)}
            onChange={(e) => {
              const roundedValue = Math.round(e.target.value);
              onchange(roundedValue, rowData);
            }}
          />
        )}
      </div>
    );
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };

  return (
    <div>
      <div className="col-md-12  mt-2">
        {successfullymsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck />
              &nbsp;TimeSheet Saved Successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {successmsg && target == "Save" ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck />
              &nbsp; Timesheet Saved and Approved Successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select the valid values for
              highlighted fields{" "}
            </span>
          </div>
        ) : (
          ""
        )}
        {validation ? (
          <div className="statusMsg error" ref={topRef}>
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please enter the valid hours{" "}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Fill Timesheets</h2>
          </div>
          <div className="childThree toggleBtns">
            {" "}
            <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisible(!visible);

                visible
                  ? setCheveronIcon(FaChevronCircleUp)
                  : setCheveronIcon(FaChevronCircleDown);
              }}
            >
              Search Filters
              <span className="serchFilterText">{cheveronIcon}</span>
            </button>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-1 customCard">
        {/* <div className="col-md-12 collapseHeader">
          <h2>Timesheet</h2>
          <div className="helpBtn">
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
          <div
            onClick={() => {
              setVisible(!visible);
              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div> */}
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Month&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <DatePicker
                      id="FromDate"
                      selected={date}
                      minDate={dd}
                      autoComplete="off"
                      onChange={(e) => {
                        SetDate(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                        }));

                        // setResourceN();
                        // setprojectValue();
                      }}
                      dateFormat="MMM-yyyy"
                      maxDate={now}
                      showMonthYearPicker
                      placeholderText="Begin Date"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country-select">
                  Projects&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    className=" text"
                    name="prj_id"
                    id="prj_id"
                    onChange={(e) => {
                      setprojectValue(e.target.value);
                      // setFormData((prev) => ({
                      //   ...prev,
                      //   ["prj_id"]: e.target.value,
                      // }));
                      setResourceName();
                      setTASKName();
                      setTaskValidation(false);
                    }}
                    // onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {ProjectName?.map((Item) => (
                      <option key={Item.id} value={Item.id}>
                        {Item.projectName}
                      </option>
                    ))}
                  </select>
                  {/* </div> */}
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country-select">
                  Resources&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                    className=" text"
                    id="res_id"
                    name="res_id"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {ResourceName?.map((Item) => (
                      <option key={Item.id} value={Item.id}>
                        {Item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Task List&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                    className=" text"
                    name="task_id"
                    id="task_id"
                    onChange={(e) => {
                      handleChange1(e);
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {taskName?.map((Item) => (
                      <option
                        key={Item.project_task_id}
                        value={Item.project_task_id}
                      >
                        {Item.task_name}
                      </option>
                    ))}
                  </select>
                  {(taskvalidation && taskName == "") || taskName == [] ? (
                    <div>
                      {" "}
                      <span>
                        <b>No Task Found</b>{" "}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => handleClick()}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>

        {loaderState ? <Loader handleAbort={handleAbort} /> : ""}
        {searching ? (
          <div className="col-md-4 darkHeader">
            <div className="legendContainer">
              <div className="legend green">
                <div className="legendCircle "></div>Approved
              </div>
              <div className="legend red">
                <div className="legendCircle "></div> Rejected
              </div>
            </div>

            <DataTable
              className="primeReactDataTable "
              value={dataTime}
              showGridlines
              rows={rows}
              dataKey="id"
              responsiveLayout="scroll"
              emptyMessage="No Records found."
              style={{
                align: "center",
              }}
            >
              <Column
                field="timesheet_dt"
                header="  Date"
                alignHeader={"center"}
                body={represent}
              ></Column>
              <Column
                field="hours"
                header="Hours"
                alignHeader={"center"}
                body={representComments}
              ></Column>
            </DataTable>
            <div className="row mt-3">
              {/* {dataAccess === 1000 ||
              dataAccess === 100 ||
              dataAccess === 46 ? ( */}
              <div className="col-md-12 btn-container center ">
                <button
                  className="btn btn-primary mt-2 mb-2"
                  value="Approved"
                  onClick={(e) => {
                    handleConfirm(e);
                  }}
                >
                  <FaSave />
                  Save
                </button>
                <button
                  className="btn btn-primary mt-2 mb-2"
                  value="Save"
                  onClick={(e) => {
                    handleConfirmSave(e);
                  }}
                >
                  <FaSave />
                  Save & Approve
                </button>
              </div>
              {/* ) : (
                ""
              )} */}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default FillTimesheets;
