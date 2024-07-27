import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Column } from "ag-grid-community";
import { AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import { DataTable } from "primereact/datatable";

import { CCollapse } from "@coreui/react";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import "./Timesheet.scss";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
function Timesheet({
  urlPath,
  visible,
  setVisible,
  setCheveronIcon,
  maxHeight1,
}) {
  const ref = useRef([]);
  const [unreaddata, setUnreadData] = useState([{}]);
  const [undata, setUnData] = useState([]);

  const [headerData, setHeaderData] = useState([]);

  const [addmsg, setAddmsg] = useState(false);
  const [startDate, setStartDate] = useState();
  const [toDate, setToDate] = useState();
  const [datatimesheet, setDataTimesheet] = useState([]);

  const [date, SetDate] = useState();
  const [target, setTarget] = useState();
  const [dateto, SetDateTo] = useState();
  const [resourceName, setResourceName] = useState([]);
  const [ProjectName, setProjectName] = useState([]);
  const [tasklist, setTaskList] = useState([]);
  const [loaderState, setLoaderState] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [RejectvalidationMessage, setRejectValidationMessage] = useState(false);
  const [RejectMessage, setRejectMessage] = useState(false);

  const [validat, setvalidat] = useState(false);

  const [searching, setsearching] = useState(false);
  const [hrs, setHrs] = useState([{}]);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Timesheet", "Fill Timesheet"];
  let textContent = "Administration";

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 74) + "px"
  );

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const initialValue1 = {};
  const [tabledata, settabledata] = useState(initialValue1);

  let rows = 10;
  let date1 = moment(date).format("yyyy-MM-DD");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    getData();
    getMenus();
    getUrlPath();
  }, []);

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/timesheetEntries&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  //=====================
  const getData = () => {
    if (
      !formData.res_id &&
      !formData.prj_id &&
      !formData.FromDate &&
      !formData.ToDate &&
      !formData.task_id
    ) {
      console.log("first");
      return;
    }
    axios
      .get(
        baseUrl +
          `/administrationms/timeSheet/postTimeSheet?res_id=${formData.res_id}&prj_id=${formData.prj_id}&FromDate=${formData.FromDate}&ToDate=${formData.ToDate}&task_id=${formData.task_id}`
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
        let dataHeaders = [
          {
            timesheet_dt: "Date",
            hours: "Hours",
          },
        ];
        setUnreadData(dataHeaders.concat(GetData));
        setHeaderData(GetData);

        setTimeout(() => {
          setsearching(false);
          setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }, 2000);

        settabledata();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getData();
    setHeaderData();
  }, []);

  //[==========================Post Comments===================]
  const handleReject = (e) => {
    if (
      tabledata == undefined ||
      tabledata == null ||
      tabledata == {} ||
      hrs === "" ||
      (hrs >= 0 && hrs >= 25)
    ) {
      setRejectValidationMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

      setTimeout(() => {
        setRejectValidationMessage(false);
      }, 3000);
    } else {
      setRejectValidationMessage(false);
      let data = [];
      Object?.keys(tabledata)?.forEach((ele) => {
        setTarget(tabledata[ele]);
        const obj = {};
        obj["timesheetDt"] = ele;
        obj["enteredHours"] = tabledata[ele];
        obj["projectId"] = formData.prj_id;
        obj["projectTaskId"] = formData.task_id;
        obj["resource_id"] = formData.res_id;
        obj["approver_notes"] = "";
        obj["typStatusId"] = e.target.value == "Approved" ? 174 : 172;
        obj["loggedId"] = formData.res_id;
        obj["updatedById"] = formData.res_id;

        data.push(obj);
      });

      axios({
        method: "post",
        url: baseUrl + `/administrationms/timeSheet/saveTimesheet`,
        data: data,
      }).then(function (res) {
        var resp = res.data;
        getData();
        settabledata();
        setRejectMessage(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

        setTimeout(() => {
          setRejectMessage(false);
        }, 2000);
      });
    }
  };
  const handleSaveClick = (e) => {
    if (
      tabledata == undefined ||
      tabledata == null ||
      tabledata == {} ||
      hrs === "" ||
      (hrs >= 0 && hrs >= 25)
    ) {
      setValidationMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      // return;
    } else {
      setValidationMessage(false);

      let data = [];
      Object?.keys(tabledata)?.forEach((ele) => {
        setTarget(tabledata[ele]);
        const obj = {};
        obj["timesheetDt"] = ele;
        obj["enteredHours"] = tabledata[ele];
        obj["projectId"] = formData.prj_id;
        obj["projectTaskId"] = formData.task_id;
        obj["resource_id"] = formData.res_id;
        obj["approver_notes"] = "";
        obj["typStatusId"] = e.target.value == "Approved" ? 174 : 172;
        obj["loggedId"] = formData.res_id;
        obj["updatedById"] = formData.res_id;

        data.push(obj);
      });

      axios({
        method: "post",
        url: baseUrl + `/administrationms/timeSheet/saveTimesheet`,
        data: data,
      }).then(function (res) {
        var resp = res.data;
        getData();
        settabledata();
        setAddmsg(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

        setTimeout(() => {
          setAddmsg(false);
        }, 2000);
      });
    }
  };
  const initialValue = {
    FromDate: "",
    ToDate: "",
    prj_id: "",
    res_id: "",
    task_id: "",
  };
  const baseUrl = environment.baseUrl;

  const [formData, setFormData] = useState(initialValue);

  useEffect(() => {}, [formData?.FromDate, formData.ToDate]);

  const getProjectName = () => {
    if (!formData?.FromDate && !formData.ToDate) {
      return;
    }
    axios
      .get(
        baseUrl +
          `/administrationms/timeSheet/getProjectssss?FromDate=${formData?.FromDate}&ToDate=${formData.ToDate}`
      )
      .then((Response) => {
        let data = Response.data;
        setProjectName(data);
      })
      .catch((error) => console.log(error));
  };

  const getTaskList = () => {
    if (!formData?.res_id && !formData?.FromDate && !formData.prj_id) {
      return;
    }
    axios({
      method: "get",
      url:
        baseUrl +
        `/administrationms/timeSheet/getTaskListTimeSheet?res_id=${formData.res_id}&prj_id=${formData.prj_id}&FromDate=${formData.FromDate}`,
    }).then((res) => {
      let tasklist = res.data;
      setTaskList(tasklist);
    });
  };

  const getResourceName = () => {
    if (!formData.prj_id) {
      return;
    }
    axios
      .get(baseUrl + `/timeandexpensesms/getResources?PrjId=${formData.prj_id}`)
      .then((Response) => {
        let data = Response.data;
        setResourceName(data);
      })
      .catch((error) => console.log(error));
  };

  const handleClick = () => {
    GlobalCancel(ref);
    if (
      formData.FromDate == "" ||
      formData.ToDate == "" ||
      formData.res_id == "" ||
      formData.prj_id == "" ||
      formData.task_id == ""
    ) {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setvalidat(true);
        }
        return;
      }
    } else {
      setLoaderState(true);
      setvalidat(false);
      setsearching(true);
    }
    getData();
  };

  useEffect(() => {
    getResourceName();
    getProjectName();
    getTaskList();
  }, [
    formData.prj_id,
    formData.task_id,
    formData.res_id,
    formData?.FromDate,
    formData.ToDate,
  ]);

  const handleReset = () => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      const initialValue = ele[index].dataset.initialValue;
      ele[index].value = initialValue; // reset the value to the initial value
      setValidationMessage(false);
      setAddmsg(false);
    }
  };
  const onChangeSetDate = (e, rowData) => {
    setHrs(e);

    if (e === "" || (e >= 0 && e <= 24)) {
      settabledata((prev) => ({
        ...prev,
        [rowData.timesheet_dt]: e,
      }));
    }
  };
  const representComments = (rowData) => {
    return (
      <>
        {rowData.typ_status == 172 ? (
          <form>
            <input
              className="cancel"
              id="hours"
              style={{ backgroundColor: "red", textAlign: "center" }}
              defaultValue={rowData.hours}
              data-initial-value={rowData.hours}
              onChange={(e) => {
                onChangeSetDate(e.target.value, rowData);
              }}
            ></input>
          </form>
        ) : rowData.typ_status == 173 && rowData.hours !== 0 ? (
          <input
            id="hours"
            defaultValue={rowData.hours}
            style={{
              backgroundColor: "rgb(79 167 116 / 85%)",
              textAlign: "center",
            }}
            className=" cancel"
            data-initial-value={rowData.hours}
            // defaultValue={gettimesheet.hours}
            onChange={(e) => {
              onChangeSetDate(e.target.value, rowData);
            }}
          ></input>
        ) : (
          <input
            id="hours"
            style={{
              textAlign: "center",
            }}
            className=" cancel"
            defaultValue={rowData.hours}
            data-initial-value={rowData.hours}
            // value={inputValue}
            onChange={(e) => {
              onChangeSetDate(e.target.value, rowData);
            }}
          ></input>
        )}
      </>
    );
  };
  const represent = (rowData) => {
    // setHrs(rowData.hours);
    setUnData(rowData.typ_status);

    return (
      <span className="vertical-align-middle ml-2">
        {moment(rowData.timesheet_dt).format("DD-MMM-yyyy")}
      </span>
    );
  };

  return (
    <>
      <div className="col-md-12">
        {addmsg ? (
          <div className="statusMsg success">
            {" "}
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Time Saved Successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error">
            <span className="error-block">
              <AiFillWarning /> &nbsp; Please enter valid hours
            </span>
          </div>
        ) : (
          ""
        )}
        {validat ? (
          <div className="statusMsg error">
            <span className="error-block">
              <AiFillWarning /> &nbsp; Please select valid values for
              highlighted fields
            </span>
          </div>
        ) : (
          ""
        )}
        {RejectvalidationMessage ? (
          <div className="statusMsg error">
            <span className="error-block">
              <AiFillWarning /> &nbsp; Please save the hours before reject
            </span>
          </div>
        ) : (
          ""
        )}
        {RejectMessage ? (
          <div className="statusMsg success">
            <span className="error-block">
              <AiFillWarning /> &nbsp; Time Rejected Successfully
            </span>
          </div>
        ) : (
          ""
        )}

        <div className="group mb-3 customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="From Date">
                    From Date <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="datepicker"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        id="FromDate"
                        autoComplete="off"
                        selected={startDate}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            ["FromDate"]: moment(e).format("YYYY-MM-DD"),
                          }));
                          setStartDate(e);
                        }}
                        showYearDropdown
                        showMonthDropdown
                        dateFormat="dd-MMM-yyyy"
                        placeholderText="Begin Date"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="To Date">
                    To Date<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="datepicker"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <DatePicker
                        id="ToDate"
                        autoComplete="off"
                        selected={dateto}
                        onChange={(e) => {
                          SetDateTo(e);
                          setFormData((prev) => ({
                            ...prev,
                            ["ToDate"]: moment(e).format("YYYY-MM-DD"),
                          }));
                          setToDate(e);
                        }}
                        // minDate={formData?.FromDate}
                        showYearDropdown
                        showMonthDropdown
                        dateFormat="dd-MMM-yyyy"
                        placeholderText="End Date"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Projects">
                    Projects<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      className=" text"
                      name="prj_id"
                      id="prj_id"
                      onChange={handleChange}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {ProjectName?.map((Item) => (
                        <option key={Item.id} value={Item.id}>
                          {Item.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Resources">
                    Resources<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                      className=" text"
                      id="res_id"
                      onChange={handleChange}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {resourceName?.map((Item) => (
                        <option key={Item.id} value={Item.id}>
                          {Item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Task List">
                    Task List<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                      className=" text"
                      name="task_id"
                      id="task_id"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {tasklist.map((Item) => (
                        <option
                          key={Item.project_task_id}
                          value={Item.project_task_id}
                        >
                          {Item.task_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => handleClick()}
                >
                  <FaSearch />
                  Search{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>
      {loaderState ? (
        <div className="col-md-4 darkHeader">
          <div className="legendContainer">
            <div className="legend green">
              <div className="legendCircle "></div>Approved
            </div>
            <div className="legend red">
              <div className="legendCircle "></div> Rejected
            </div>
          </div>
          {/* <CellRendererPrimeReactDataTable
            data={unreaddata}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            rows={rows}
          /> */}
          {searching ? (
            <>
              {" "}
              <Loader setsearching={setsearching} />
            </>
          ) : (
            <>
              <div className="administrationTimeSheet">
                <DataTable
                  className="primeReactDataTable "
                  value={headerData}
                  // paginator
                  showGridlines
                  rows={rows}
                  dataKey="id"
                  // filters={filters1}
                  responsiveLayout="scroll"
                  // header={header1}
                  emptyMessage="No Records found."
                  // ref={(el) => {
                  //   dt.current = el;
                  // }}
                >
                  <Column
                    field="timesheet_dt"
                    header="  Date"
                    body={represent}
                    style={{ textAlign: "center" }}
                  ></Column>
                  <Column
                    field="hours"
                    header="  Hours"
                    body={representComments}
                    style={{ textAlign: "center" }}
                  ></Column>
                </DataTable>
              </div>
              <div className="row">
                <div className="col-md-12 btn-container center ">
                  <button
                    className="btn btn-primary mt-2 mb-2"
                    value="Approved"
                    onClick={(e) => {
                      handleSaveClick(e);
                    }}
                  >
                    <VscSave />
                    Save
                  </button>
                  <button
                    className="btn btn-primary mt-2 mb-2"
                    value="Reject"
                    onClick={(e) => {
                      handleReject(e);
                    }}
                  >
                    <VscSave />
                    Reject
                  </button>
                  <button
                    className="btn btn-secondary   mt-2 mb-2"
                    onClick={(e) => handleReset(e)}
                  >
                    <ImCross />
                    Cancel
                  </button>
                </div>
              </div>{" "}
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
export default Timesheet;
